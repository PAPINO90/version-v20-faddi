# 📖 GUIDE D'INTÉGRATION - Dashboard Admin FADIDI

## ✅ Ce qui a été créé

### 1. API Backend NestJS (`api-nestjs/`)
- **Serveur API complet** avec base de données MySQL
- **Authentification JWT** sécurisée
- **Gestion des produits** (CRUD complet)
- **Upload d'images** automatique
- **Catégories** de produits

### 2. Dashboard Admin (`admin-dashboard/`)
- **Interface d'administration** moderne
- **Ajout/modification** de produits
- **Gestion des catégories**
- **Upload d'images** par glisser-déposer
- **Statistiques** en temps réel

### 3. Script d'intégration (`fadidi-api-integration.js`)
- **Connexion automatique** entre le dashboard et la boutique
- **Synchronisation** des produits en temps réel
- **Mode de secours** si l'API est indisponible
- **Indicateur de statut** visuel

## 🚀 Comment utiliser le système

### Étape 1: Installer et démarrer l'API

1. **Ouvrez un terminal** dans le dossier `api-nestjs`
2. **Installez les dépendances** :
   ```bash
   npm install
   ```
3. **Démarrez l'API** :
   ```bash
   npm run start:dev
   ```
4. **L'API sera disponible** sur `http://localhost:3000`

### Étape 2: Configurer la base de données

1. **Assurez-vous que MySQL est démarré**
2. **La base de données `fadidi_db` sera créée automatiquement**
3. **Un utilisateur admin par défaut sera créé** :
   - Email : `admin@fadidi.com`
   - Mot de passe : `admin123`

### Étape 3: Accéder au dashboard admin

1. **Ouvrez `admin-dashboard/index.html`** dans votre navigateur
2. **Connectez-vous** avec les identifiants admin
3. **Ajoutez vos produits** avec images et descriptions

### Étape 4: Intégrer avec votre boutique existante

**Ajoutez cette ligne dans `boutique.html` avant `</body>` :**

```html
<script src="fadidi-api-integration.js"></script>
```

**C'est tout !** Vos produits du dashboard apparaîtront automatiquement dans la boutique.

## 📊 Fonctionnalités du Dashboard

### ➕ Ajouter un produit
1. Cliquez sur **"Nouveau Produit"**
2. **Remplissez** les informations
3. **Glissez-déposez** les images
4. **Sauvegardez** → Le produit apparaît dans la boutique

### 🏷️ Gérer les catégories
1. Section **"Catégories"**
2. **Créez** de nouvelles catégories
3. **Organisez** vos produits

### 📈 Voir les statistiques
- **Nombre total** de produits
- **Produits publiés**
- **Catégories actives**
- **Dernière synchronisation**

## 🔧 Personnalisation

### Modifier l'URL de l'API
Dans `fadidi-api-integration.js`, ligne 13 :
```javascript
API_URL: 'http://localhost:3000/api'  // Changez ici
```

### Désactiver la synchronisation automatique
Dans `fadidi-api-integration.js`, ligne 15 :
```javascript
ENABLE_API: false  // Passer à false
```

### Changer l'intervalle de synchronisation
Dans `fadidi-api-integration.js`, ligne 14 :
```javascript
SYNC_INTERVAL: 60000  // 60 secondes au lieu de 30
```

## 🛠️ Résolution de problèmes

### ❌ L'API ne démarre pas
1. **Vérifiez MySQL** : Service démarré ?
2. **Port 3000** occupé ? Changez dans `main.ts`
3. **Dépendances** installées ? `npm install`

### ❌ Pas de produits dans la boutique
1. **Vérifiez l'indicateur** de statut (coin supérieur droit)
2. **Cliquez dessus** pour forcer la synchronisation
3. **Ouvrez la console** (F12) pour voir les logs

### ❌ Images ne s'affichent pas
1. **Vérifiez le dossier** `api-nestjs/uploads/`
2. **Permissions** du dossier correttes ?
3. **URL de l'API** correcte ?

## 🎯 Flux de travail recommandé

1. **Démarrez l'API** (`npm run start:dev`)
2. **Ouvrez le dashboard** admin
3. **Ajoutez vos produits** avec toutes les infos
4. **Ouvrez la boutique** → Les produits apparaissent automatiquement
5. **Les clients voient** immédiatement les nouveaux produits

## 📱 Compatibilité mobile

- ✅ **Dashboard responsive** sur tablette/mobile
- ✅ **Boutique optimisée** (déjà existante)
- ✅ **Synchronisation** fonctionne sur tous appareils

## 🔒 Sécurité

- 🔐 **Authentification JWT** pour l'admin
- 🛡️ **Validation** de tous les inputs
- 📁 **Upload sécurisé** (types de fichiers vérifiés)
- 🚫 **Accès API** protégé par rôles

## 🎉 Prochaines étapes

Votre système est maintenant **opérationnel** ! Vous pouvez :

1. **Personnaliser** le design du dashboard
2. **Ajouter** plus de champs produits
3. **Créer** des rôles utilisateurs supplémentaires
4. **Intégrer** des notifications en temps réel

---

**✨ Profitez de votre nouveau système FADIDI !**

Pour toute question, consultez les logs dans la console du navigateur (F12).