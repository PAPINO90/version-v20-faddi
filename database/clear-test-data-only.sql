-- Script selectif pour supprimer certaines données de template dans FADIDI
-- Base de données : fadidi_new_db

USE fadidi_new_db;

-- Désactiver les vérifications de clés étrangères temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- 1. SUPPRIMER LES PRODUITS DE TEST/DEMO
-- Supprime les produits qui semblent être des templates (par exemple ceux avec des noms génériques)
DELETE FROM products 
WHERE name LIKE '%test%' 
   OR name LIKE '%demo%' 
   OR name LIKE '%example%'
   OR name LIKE '%template%'
   OR description LIKE '%lorem ipsum%'
   OR sku LIKE 'TEST%'
   OR sku LIKE 'DEMO%';

-- 2. SUPPRIMER LES PROMOTIONS DE TEST
DELETE FROM promotions 
WHERE title LIKE '%test%'
   OR title LIKE '%demo%'
   OR title LIKE '%example%'
   OR title LIKE '%template%'
   OR description LIKE '%lorem ipsum%';

-- 3. SUPPRIMER LES CATÉGORIES DE TEST
DELETE FROM categories 
WHERE name LIKE '%test%'
   OR name LIKE '%demo%'
   OR name LIKE '%example%'
   OR name LIKE '%template%';

-- 4. SUPPRIMER LES COMMANDES DE TEST (commandes avec des noms de test)
DELETE FROM orders 
WHERE customerName LIKE '%test%'
   OR customerName LIKE '%demo%'
   OR customerName LIKE '%example%'
   OR email LIKE '%test%'
   OR email LIKE '%@example.%'
   OR phone LIKE '0000%'
   OR status = 'cart_session';

-- 5. SUPPRIMER LES PUBLICITÉS FLOTTANTES DE TEST
DELETE FROM floating_ads 
WHERE title LIKE '%test%'
   OR title LIKE '%demo%'
   OR title LIKE '%example%'
   OR content LIKE '%lorem ipsum%';

-- 6. SUPPRIMER LES CODES D'AUTHENTIFICATION EXPIRÉS
DELETE FROM auth_codes 
WHERE expiresAt < NOW()
   OR code LIKE 'TEST%';

-- Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

-- Afficher le résultat
SELECT 'Nettoyage selectif terminé!' as Status;

-- Vérifier les données restantes
SELECT 
    'products' as table_name, COUNT(*) as remaining_records FROM products
UNION ALL
SELECT 
    'promotions' as table_name, COUNT(*) as remaining_records FROM promotions
UNION ALL
SELECT 
    'categories' as table_name, COUNT(*) as remaining_records FROM categories
UNION ALL
SELECT 
    'orders' as table_name, COUNT(*) as remaining_records FROM orders
UNION ALL
SELECT 
    'floating_ads' as table_name, COUNT(*) as remaining_records FROM floating_ads
UNION ALL
SELECT 
    'auth_codes' as table_name, COUNT(*) as remaining_records FROM auth_codes;