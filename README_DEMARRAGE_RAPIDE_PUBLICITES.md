# 🚀 Démarrage rapide - Publicités flottantes FADIDI

## Installation en 1 clic

### Windows
```bash
# Double-cliquez sur le fichier ou exécutez en ligne de commande :
start-floating-ads-system.bat
```

Le script se charge automatiquement de :
- ✅ Vérifier les dépendances (Node.js, MySQL)
- ✅ Migrer la base de données 
- ✅ Installer les modules npm
- ✅ Démarrer l'API NestJS

### Manuel (si le script automatique ne fonctionne pas)

1. **Migration base de données**
```bash
cd database
run_floating_ads_migration.bat
```

2. **Démarrer l'API**
```bash
cd api-nestjs
npm install
npm run start:dev
```

## Utilisation immédiate

### 1. Accéder au dashboard admin
- Ouvrez `frontend/admin-dashboard/index.html`
- Cliquez sur "Publicités flottantes" dans le menu
- Créez votre première publicité !

### 2. Tester sur le site
- Ouvrez `frontend/boutique.html` ou `frontend/index.html`
- Les publicités actives s'affichent automatiquement

### 3. Exemples pré-configurés
Dans la console du dashboard admin :
```javascript
// Charger le script d'exemples
var script = document.createElement('script');
script.src = '../assets/js/exemples-publicites-flottantes.js';
document.head.appendChild(script);

// Puis créer les exemples
setTimeout(() => creerExemplesPub(), 2000);
```

## Vérifications rapides

### ✅ L'API fonctionne ?
Testez : http://localhost:3000/api/floating-ads

### ✅ La base de données est OK ?
```sql
USE fadidi_new_db;
SELECT COUNT(*) FROM floating_ads;
```

### ✅ Les publicités s'affichent ?
- Créez une publicité dans le dashboard
- Ouvrez la page ciblée
- Vérifiez la console du navigateur (F12)

## Problèmes fréquents

### ❌ "mysql n'est pas reconnu"
- Installez MySQL et ajoutez-le au PATH
- Ou utilisez XAMPP/WAMP

### ❌ "npm n'est pas reconnu"  
- Installez Node.js depuis https://nodejs.org

### ❌ "Table doesn't exist"
- Exécutez à nouveau la migration
- Vérifiez les paramètres de connexion MySQL

### ❌ Publicité ne s'affiche pas
- Vérifiez qu'elle est active
- Contrôlez le ciblage des pages
- Consultez la console du navigateur

## Liens utiles

- 📚 **Documentation complète** : [DOCUMENTATION_PUBLICITES_FLOTTANTES.md](DOCUMENTATION_PUBLICITES_FLOTTANTES.md)
- 🎯 **Exemples** : `frontend/assets/js/exemples-publicites-flottantes.js`
- 🔧 **Migration** : `database/migration_floating_ads.sql`
- 🌐 **API Endpoints** : http://localhost:3000/api/floating-ads

---

**Besoin d'aide ?** Consultez les logs dans le dashboard admin ou la console du navigateur.