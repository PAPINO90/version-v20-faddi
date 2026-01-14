-- Migration pour créer la table des publicités flottantes
-- Base de données: fadidi_new_db

USE fadidi_new_db;

-- Supprimer la table si elle existe déjà (pour les tests)
DROP TABLE IF EXISTS floating_ads;

-- Créer la table floating_ads
CREATE TABLE floating_ads (
    id int NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    content text NOT NULL,
    displayMode enum('toast','popup','banner') NOT NULL DEFAULT 'banner',
    position enum('top-left','top-right','top-center','bottom-left','bottom-right','bottom-center','center') NOT NULL DEFAULT 'bottom-right',
    -- displayDuration supprimé : le temps d'affichage n'est plus configurable
    width varchar(50) NOT NULL DEFAULT '300px',
    height varchar(50) NOT NULL DEFAULT '200px',
    backgroundColor varchar(7) NOT NULL DEFAULT '#ffffff' COMMENT 'Couleur de fond (hex)',
    textColor varchar(7) NOT NULL DEFAULT '#000000' COMMENT 'Couleur du texte (hex)',
    targetPages text COMMENT 'Pages où afficher (séparées par virgule, * pour toutes)',
    redirectUrl varchar(500) DEFAULT NULL COMMENT 'URL de redirection lors du clic',
    imageUrl varchar(500) DEFAULT NULL COMMENT 'URL de l\'image',
    isActive tinyint(1) NOT NULL DEFAULT 1,
    startDate datetime DEFAULT NULL,
    endDate datetime DEFAULT NULL,
    clickCount int NOT NULL DEFAULT 0 COMMENT 'Nombre de clics',
    viewCount int NOT NULL DEFAULT 0 COMMENT 'Nombre d\'affichages',
    createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_active_dates (isActive, startDate, endDate),
    INDEX idx_target_pages (targetPages(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer quelques exemples de publicités flottantes pour les tests
INSERT INTO floating_ads (
    title, content, displayMode, position, backgroundColor, textColor, targetPages, redirectUrl, isActive
) VALUES
('Offre spéciale !', 'Profitez de -20% sur tous nos produits avec le code FADIDI20', 'banner', 'top-center', '#ff8c00', '#ffffff', '*', 'boutique.html', 1),
('Nouveau produit', 'Découvrez notre nouvelle collection haut de gamme !', 'toast', 'bottom-right', '#28a745', '#ffffff', 'index.html,boutique.html', 'haut-game.html', 1),
('Livraison gratuite', 'Livraison gratuite pour toute commande supérieure à 50 000 CFA', 'popup', 'center', '#ffffff', '#333333', 'boutique.html', NULL, 0);

-- Vérifier que la table a été créée correctement
DESCRIBE floating_ads;

-- Afficher les données d'exemple
SELECT * FROM floating_ads;

-- Afficher le statut de la migration
SELECT 'Migration des publicités flottantes terminée avec succès' as status;