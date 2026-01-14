-- Script pour supprimer tous les templates/données de test dans la base FADIDI
-- Base de données : fadidi_new_db

USE fadidi_new_db;

-- Désactiver les vérifications de clés étrangères temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- Supprimer toutes les commandes
DELETE FROM orders;
ALTER TABLE orders AUTO_INCREMENT = 1;

-- Supprimer toutes les promotions
DELETE FROM promotions;
ALTER TABLE promotions AUTO_INCREMENT = 1;

-- Supprimer tous les produits
DELETE FROM products;
ALTER TABLE products AUTO_INCREMENT = 1;

-- Supprimer toutes les catégories
DELETE FROM categories;
ALTER TABLE categories AUTO_INCREMENT = 1;

-- Supprimer toutes les publicités flottantes
DELETE FROM floating_ads;
ALTER TABLE floating_ads AUTO_INCREMENT = 1;

-- Supprimer tous les codes d'authentification (sauf si nécessaire)
DELETE FROM auth_codes;
ALTER TABLE auth_codes AUTO_INCREMENT = 1;

-- Optionnel : Supprimer tous les utilisateurs (ATTENTION : cela supprimera aussi les comptes admin)
-- Décommentez la ligne suivante si vous voulez aussi supprimer les utilisateurs
-- DELETE FROM users WHERE role != 'admin';

-- Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

-- Afficher le résultat
SELECT 'Templates supprimés avec succès!' as Status;

-- Vérifier que les tables sont vides
SELECT 
    'orders' as table_name, COUNT(*) as remaining_records FROM orders
UNION ALL
SELECT 
    'promotions' as table_name, COUNT(*) as remaining_records FROM promotions
UNION ALL
SELECT 
    'products' as table_name, COUNT(*) as remaining_records FROM products
UNION ALL
SELECT 
    'categories' as table_name, COUNT(*) as remaining_records FROM categories
UNION ALL
SELECT 
    'floating_ads' as table_name, COUNT(*) as remaining_records FROM floating_ads
UNION ALL
SELECT 
    'auth_codes' as table_name, COUNT(*) as remaining_records FROM auth_codes
UNION ALL
SELECT 
    'users' as table_name, COUNT(*) as remaining_records FROM users;