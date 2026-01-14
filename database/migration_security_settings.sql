-- Migration pour créer la table security_settings
-- Base de données: fadidi_new_db

USE fadidi_new_db;

-- Créer la table security_settings si elle n'existe pas
CREATE TABLE IF NOT EXISTS security_settings (
    id VARCHAR(36) PRIMARY KEY,
    settingKey VARCHAR(255) UNIQUE NOT NULL,
    settingValue TEXT NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insérer le code maître par défaut s'il n'existe pas
INSERT IGNORE INTO security_settings (id, settingKey, settingValue, description)
VALUES (
    UUID(),
    'MASTER_ACCESS_CODE',
    'FADIDI2025',
    'Code maître par défaut créé lors de l\'installation'
);

-- Afficher le contenu de la table pour vérification
SELECT * FROM security_settings;