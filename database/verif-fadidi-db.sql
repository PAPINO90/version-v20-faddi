-- Script de vérification de la base de données FADIDI
-- Base: fadidi_new_db

-- Sélectionner la base de données
USE fadidi_new_db;

-- Afficher les tables existantes
SHOW TABLES;

-- Vérifier la structure de la table orders
DESCRIBE orders;

-- Vérifier la structure de la table promotions
DESCRIBE promotions;

-- Compter les promotions actives
SELECT 
    COUNT(*) as total_promotions,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_promotions,
    SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_promotions
FROM promotions;

-- Compter les commandes
SELECT 
    COUNT(*) as total_orders,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders
FROM orders;

-- Afficher les dernières commandes
SELECT 
    id,
    customerName,
    total,
    paymentMethod,
    status,
    createdAt
FROM orders 
ORDER BY createdAt DESC 
LIMIT 10;

-- Afficher les promotions actives
SELECT 
    id,
    title,
    originalPrice,
    promotionPrice,
    discountPercentage,
    soldQuantity,
    status,
    endDate
FROM promotions 
WHERE status = 'active'
ORDER BY createdAt DESC;

-- Vérifier les commandes de panier temporaire (pour debug)
SELECT 
    COUNT(*) as cart_sessions,
    SUM(total) as total_cart_value
FROM orders 
WHERE status = 'cart_session' 
AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 DAY);

-- Statistiques des ventes par méthode de paiement
SELECT 
    paymentMethod,
    COUNT(*) as count,
    SUM(total) as total_amount
FROM orders 
WHERE status NOT IN ('cart_session', 'cancelled')
GROUP BY paymentMethod
ORDER BY total_amount DESC;