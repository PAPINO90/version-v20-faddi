-- Migration pour ajouter les colonnes de retour client
-- Date: 27 septembre 2025

USE fadidi_new_db;

-- Ajouter les colonnes pour les retours clients
ALTER TABLE orders 
ADD COLUMN customerFeedback TEXT NULL,
ADD COLUMN feedbackType VARCHAR(20) NULL,
ADD COLUMN feedbackDate TIMESTAMP NULL,
ADD COLUMN adminResponse TEXT NULL,
ADD COLUMN adminResponseDate TIMESTAMP NULL,
ADD COLUMN deliveredAt TIMESTAMP NULL;

-- Créer un index pour optimiser les recherches sur les retours
CREATE INDEX idx_orders_feedback ON orders(feedbackDate);
CREATE INDEX idx_orders_feedback_type ON orders(feedbackType);
CREATE INDEX idx_orders_dispute ON orders(status) WHERE status = 'dispute';

-- Mise à jour des données existantes (optionnel)
-- Marquer les commandes livrées comme étant sans retour pour l'instant
UPDATE orders 
SET feedbackType = NULL, 
    customerFeedback = NULL 
WHERE status = 'delivered' AND feedbackType IS NULL;

COMMIT;