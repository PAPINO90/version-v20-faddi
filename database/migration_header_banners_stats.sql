-- Migration pour ajouter les colonnes de statistiques aux bannières header
-- Ajout des colonnes viewCount et clickCount à la table header_banners

USE fadidi;

-- Vérifier si les colonnes n'existent pas déjà avant de les ajouter
SET @sql = '';
SET @col_exists = 0;

-- Vérifier si la colonne viewCount existe
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'fadidi' 
  AND TABLE_NAME = 'header_banners' 
  AND COLUMN_NAME = 'viewCount';

-- Ajouter viewCount si elle n'existe pas
IF @col_exists = 0 THEN
    SET @sql = 'ALTER TABLE header_banners ADD COLUMN viewCount INT DEFAULT 0 NOT NULL';
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SELECT 'Colonne viewCount ajoutée à header_banners' as Message;
ELSE
    SELECT 'Colonne viewCount existe déjà dans header_banners' as Message;
END IF;

-- Réinitialiser pour la deuxième colonne
SET @col_exists = 0;

-- Vérifier si la colonne clickCount existe
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'fadidi' 
  AND TABLE_NAME = 'header_banners' 
  AND COLUMN_NAME = 'clickCount';

-- Ajouter clickCount si elle n'existe pas
IF @col_exists = 0 THEN
    SET @sql = 'ALTER TABLE header_banners ADD COLUMN clickCount INT DEFAULT 0 NOT NULL';
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SELECT 'Colonne clickCount ajoutée à header_banners' as Message;
ELSE
    SELECT 'Colonne clickCount existe déjà dans header_banners' as Message;
END IF;

-- Afficher la structure finale de la table
DESCRIBE header_banners;

-- Afficher les bannières existantes avec les nouvelles colonnes
SELECT id, title, isActive, viewCount, clickCount, createdAt
FROM header_banners
ORDER BY id;