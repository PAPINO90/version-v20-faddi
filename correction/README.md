# Dashboard Admin FADIDI avec API NestJS

Ce système complet permet de gérer les produits FADIDI via un dashboard administrateur connecté à une API NestJS avec base de données MySQL.

## 🚀 Installation et Configuration

### Prérequis

- Node.js (version 16 ou supérieure)
- MySQL (version 8 ou supérieure)
- Git

### 1. Configuration de la base de données

1. **Installer MySQL** si ce n'est pas déjà fait
2. **Créer la base de données** :
   ```sql
   mysql -u root -p < database/setup.sql
   ```

### 2. Installation de l'API NestJS

1. **Aller dans le dossier API** :
   ```bash
   cd api-nestjs
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   - Le fichier `.env` est déjà configuré avec les valeurs par défaut
   - Modifiez les paramètres de base de données si nécessaire

4. **Démarrer l'API** :
   ```bash
   # Mode développement
   npm run start:dev
   
   # Mode production
   npm run build
   npm run start:prod
   ```

L'API sera accessible sur : `http://localhost:3000`

### 3. Configuration du Dashboard Admin

1. **Ouvrir le dashboard** :
   - Ouvrez `admin-dashboard/index.html` dans votre navigateur
   - Ou utilisez un serveur local (recommandé) :
   ```bash
   cd admin-dashboard
   # Avec Python
   python -m http.server 3001
   # Ou avec Node.js
   npx serve -p 3001
   ```

2. **Connexion admin par défaut** :
   - **Email** : `admin@fadidi.com`
   - **Mot de passe** : `Admin123!`

## 📱 Intégration avec la Boutique FADIDI

### Synchronisation automatique

Les produits ajoutés via le dashboard admin sont automatiquement synchronisés avec la boutique FADIDI existante via :

1. **API REST** pour les nouvelles données
2. **localStorage** pour la compatibilité avec l'existant

### Modification de la boutique existante

Pour connecter votre boutique FADIDI à l'API :

1. **Ajouter le script de synchronisation** dans `boutique.html` :

```html
<script>
// Configuration API
const API_URL = 'http://localhost:3000/api';

// Fonction pour charger les produits depuis l'API
async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${API_URL}/products/published`);
        const products = await response.json();
        
        // Convertir au format existant
        const fadidiProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.images?.[0] ? `http://localhost:3000/uploads/${product.images[0]}` : '1-.png',
            status: 'published',
            category: product.category?.name || null
        }));
        
        // Sauvegarder dans localStorage (compatibilité)
        localStorage.setItem('fadidiProducts', JSON.stringify(fadidiProducts));
        
        // Recharger l'affichage
        loadAndDisplayFadidiProducts();
        
    } catch (error) {
        console.error('Erreur chargement API:', error);
        // Fallback vers localStorage existant
        loadAndDisplayFadidiProducts();
    }
}

// Charger les produits au démarrage
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromAPI();
    
    // Recharger toutes les 30 secondes
    setInterval(loadProductsFromAPI, 30000);
});
</script>
```

## 🛠 Fonctionnalités

### Dashboard Admin

- ✅ **Authentification sécurisée**
- ✅ **Gestion des produits** (CRUD complet)
- ✅ **Gestion des catégories**
- ✅ **Upload d'images**
- ✅ **Statistiques en temps réel**
- ✅ **Gestion des commandes** (depuis localStorage)
- ✅ **Interface responsive**

### API NestJS

- ✅ **Authentication JWT**
- ✅ **CRUD Produits avec images**
- ✅ **CRUD Catégories**
- ✅ **Gestion des utilisateurs**
- ✅ **Upload de fichiers sécurisé**
- ✅ **Validation des données**
- ✅ **CORS configuré**

### Base de données MySQL

- ✅ **Entités optimisées**
- ✅ **Relations entre tables**
- ✅ **Migrations automatiques**
- ✅ **Contraintes de données**

## 📊 Structure des données

### Produit
```javascript
{
  id: "uuid",
  name: "string",
  description: "string?",
  price: "number",
  stock: "number",
  images: ["string[]"],
  status: "draft|published|archived",
  category: "Category?",
  createdAt: "Date",
  updatedAt: "Date"
}
```

### Catégorie
```javascript
{
  id: "uuid",
  name: "string",
  description: "string?",
  image: "string?",
  products: ["Product[]"],
  createdAt: "Date"
}
```

## 🔧 Configuration avancée

### Variables d'environnement (.env)

```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=fadidi_user
DB_PASSWORD=fadidi_password
DB_DATABASE=fadidi_db

# JWT
JWT_SECRET=fadidi-super-secret-key-2024
JWT_EXPIRES_IN=24h

# Serveur
PORT=3000

# Upload
MAX_FILE_SIZE=5242880
```

### CORS

Par défaut, l'API accepte les requêtes depuis :
- `http://localhost:3001` (Dashboard admin)
- `http://127.0.0.1:5500` (Live Server VS Code)
- Tous les ports localhost

## 🚀 Déploiement

### Production

1. **Construire l'API** :
   ```bash
   cd api-nestjs
   npm run build
   ```

2. **Variables d'environnement production** :
   - Changer `JWT_SECRET`
   - Configurer la vraie base de données
   - Désactiver `synchronize: true` dans TypeORM

3. **Serveur web** :
   - Servir les fichiers statiques du dashboard
   - Proxy vers l'API NestJS

## 🔒 Sécurité

- ✅ Authentification JWT
- ✅ Validation des données
- ✅ Filtres de fichiers
- ✅ Limitation de taille d'upload
- ✅ Protection CORS
- ✅ Hashage des mots de passe

## 📞 Support

Pour toute question ou problème :

1. Vérifiez que MySQL est démarré
2. Vérifiez les logs de l'API NestJS
3. Vérifiez la console du navigateur
4. Vérifiez les variables d'environnement

## 🔄 Mises à jour

Pour mettre à jour le système :

1. **Sauvegarder la base de données**
2. **Mettre à jour l'API** : `npm install`
3. **Redémarrer l'API** : `npm run start:dev`
4. **Vider le cache du navigateur**

---

**Système développé pour FADIDI E-commerce** 🛒