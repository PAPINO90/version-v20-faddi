# Dashboard Admin FADIDI - Guide d'utilisation

## 🚀 Démarrage rapide

### Prérequis
- API NestJS démarrée sur `http://localhost:3000`
- Node.js installé

### Démarrer le dashboard
```bash
cd admin-dashboard
node server.js
```
Le dashboard sera accessible sur `http://localhost:8081`

## 🔐 Authentification

**Identifiants par défaut :**
- Email : `admin@fadidi.com`
- Mot de passe : `Admin123!`

## 📋 Fonctionnalités

### ✅ Tableau de bord
- Statistiques en temps réel
- Nombre de produits, catégories, commandes
- Chiffre d'affaires total

### ✅ Gestion des produits
- Créer, modifier, supprimer des produits
- Upload d'images multiples
- Gestion du stock et des prix
- Statuts : Brouillon, Publié, Archivé
- Association aux catégories

### ✅ Gestion des catégories
- Créer, modifier, supprimer des catégories
- Upload d'image de catégorie
- Description et organisation

### ✅ Gestion des commandes
- Visualisation des commandes (localStorage)
- Mise à jour des statuts
- Détails des commandes

## 🔄 Synchronisation

Le dashboard se synchronise automatiquement avec :
- **API NestJS** pour les données backend
- **Boutique FADIDI** via localStorage pour l'affichage public

## 🛠️ Fonctionnalités techniques

- **Authentification JWT** avec renouvellement automatique
- **Upload de fichiers** pour images produits/catégories
- **Gestion d'erreurs** robuste avec messages utilisateur
- **Interface responsive** avec indicateurs de chargement
- **Validation côté client** avant envoi API

## 📁 Structure des fichiers

```
admin-dashboard/
├── index.html          # Interface utilisateur
├── admin-dashboard.js  # Logique JavaScript
├── admin-dashboard.css # Styles CSS
├── server.js          # Serveur HTTP local
└── test-delete.html   # Page de test (développement)
```

## 🔧 API Endpoints utilisés

- `POST /api/auth/login` - Authentification
- `GET /api/categories` - Lister les catégories
- `POST /api/categories` - Créer une catégorie
- `PATCH /api/categories/:id` - Modifier une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie
- `GET /api/products` - Lister les produits
- `POST /api/products` - Créer un produit
- `PATCH /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `POST /api/upload/images` - Upload images produits
- `POST /api/upload/image` - Upload image catégorie

## 💡 Conseils d'utilisation

1. **Toujours démarrer l'API NestJS en premier**
2. **Les images sont automatiquement redimensionnées**
3. **Les suppressions nécessitent une confirmation**
4. **La synchronisation avec la boutique est automatique**
5. **Les tokens JWT expirent et sont renouvelés automatiquement**

## 🐛 Résolution de problèmes

### Problème de connexion API
- Vérifiez que l'API NestJS fonctionne sur localhost:3000
- Contrôlez les logs de la console (F12)

### Problème d'upload d'images
- Vérifiez les formats supportés : jpg, png, gif, webp, etc.
- Taille maximale recommandée : 5MB par image

### Erreurs d'authentification
- Utilisez les bons identifiants : admin@fadidi.com / Admin123!
- Le token se renouvelle automatiquement en cas d'expiration

---
*Dernière mise à jour : 24 septembre 2025*