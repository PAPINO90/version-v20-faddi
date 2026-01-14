-- Migration: Ajouter la colonne imagePosition à la table header_banners
-- Date: 2025-11-01
-- Description: Permet de définir la position de l'image dans les bannières (left, center, right)

ALTER TABLE header_banners 
ADD COLUMN imagePosition VARCHAR(20) DEFAULT 'center' NOT NULL;

-- Commentaire pour documenter la colonne
ALTER TABLE header_banners 
MODIFY COLUMN imagePosition VARCHAR(20) DEFAULT 'center' NOT NULL 
COMMENT 'Position de l\'image dans la bannière: left, center, right';

-- Mise à jour des bannières existantes pour avoir la position par défaut
UPDATE header_banners 
SET imagePosition = 'center' 
WHERE imagePosition IS NULL OR imagePosition = '';

-- Vérification des données après migration
SELECT id, title, imagePosition, isActive 
FROM header_banners 
ORDER BY displayOrder ASC;