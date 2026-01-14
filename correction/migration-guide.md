# 📋 Guide de Migration FADIDI

## 🔄 Comment déplacer FADIDI sur une nouvelle machine

### 1. 📊 Exporter la base de données (Machine actuelle)

```bash
# Créer un backup complet de la base
mysqldump -u root -pRoot fadidi_new_db > fadidi_backup.sql

# Ou avec PowerShell
mysqldump -u root -pRoot --databases fadidi_new_db --routines --triggers > fadidi_complete_backup.sql
```

### 2. 📁 Préparer les fichiers à transférer

```
FADIDI---/
├── api-nestjs/           # ✅ Copier tout le dossier
├── admin-dashboard/      # ✅ Copier tout le dossier  
├── boutique.html         # ✅ Copier
├── boutique.js           # ✅ Copier
├── boutique.css          # ✅ Copier
├── *.jpg, *.png          # ✅ Copier toutes les images
└── fadidi_backup.sql     # ✅ Le fichier de backup créé
```

### 3. 🔧 Installation sur la nouvelle machine

#### A. Installer les prérequis
```bash
# Node.js (version 18+)
# MySQL Server
# Git (optionnel)
```

#### B. Restaurer la base de données
```bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE fadidi_new_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Restaurer les données
mysql -u root -p fadidi_new_db < fadidi_backup.sql
```

#### C. Configurer l'API
```bash
cd FADIDI---/api-nestjs
npm install
cp .env.example .env  # Adapter la config MySQL
npm run build
```

#### D. Tester
```bash
# Démarrer l'API
node dist/main.js

# Démarrer le dashboard
cd ../admin-dashboard
node server.js
```

### 4. ⚙️ Configuration MySQL (.env)

```env
# Dans api-nestjs/.env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=VotreMotDePasse
DB_DATABASE=fadidi_new_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

## 🎯 Résultat attendu

✅ **Tous vos produits** seront visibles  
✅ **Toutes vos catégories** seront présentes  
✅ **Tous vos utilisateurs** seront conservés  
✅ **Toutes les images** seront accessibles  
✅ **Le dashboard admin** fonctionnera identiquement  
✅ **La boutique** affichera tous les produits  

## ⚠️ Points d'attention

1. **Versions MySQL** : Assurez-vous que la nouvelle machine a MySQL 5.7+ ou 8.0+
2. **Permissions fichiers** : Vérifiez que le dossier `uploads/` est en écriture
3. **Ports** : 3000 (API) et 8081 (Dashboard) doivent être libres
4. **Node.js** : Version 18+ recommandée

## 🔍 Vérification après migration

```bash
# Test API
curl http://localhost:3000/api/products/published

# Test Dashboard  
# Ouvrir http://localhost:8081

# Test Boutique
# Ouvrir boutique.html dans le navigateur
```