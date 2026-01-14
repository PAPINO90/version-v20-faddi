# Documentation - Système de publicités flottantes FADIDI

## Vue d'ensemble

Le système de publicités flottantes permet de créer et gérer des annonces dynamiques qui s'affichent sur les pages du site FADIDI. Les publicités peuvent être personnalisées avec différents modes d'affichage, positions, couleurs et ciblages de pages.

## Fonctionnalités

### 🎯 Modes d'affichage disponibles
- **Toast** : Notification discrète qui apparaît et disparaît automatiquement
- **Popup** : Fenêtre modale au centre de l'écran
- **Bannière** : Bande d'annonce fixe sur la page

### 📍 Positions disponibles
- Haut à gauche
- Haut à droite  
- Haut au centre
- Bas à gauche
- Bas à droite
- Bas au centre
- Centre (pour les popups)

### 🎨 Personnalisation
- **Taille** : Largeur et hauteur personnalisables
- **Couleurs** : Fond et texte avec sélecteur de couleur
- **Durée** : Temps d'affichage de 1 à 60 secondes
- **Image** : Upload d'image optionnel
- **Redirection** : URL de destination au clic

### 📄 Ciblage des pages
- **Toutes les pages** : Utiliser `*`
- **Pages spécifiques** : `boutique.html,index.html` (séparés par virgule)
- **Page unique** : `haut-game.html`

### ⏰ Planification
- **Date de début** : Quand commencer l'affichage
- **Date de fin** : Quand arrêter l'affichage
- **Activation/désactivation** : Contrôle manuel du statut

## Utilisation dans le Dashboard Admin

### Accès
1. Connectez-vous au dashboard admin
2. Cliquez sur "Publicités flottantes" dans le menu latéral
3. Consultez les statistiques et gérez vos publicités

### Créer une publicité
1. Cliquez sur "Nouvelle publicité"
2. Remplissez les informations :
   - **Titre** : Nom de la publicité
   - **Contenu** : Message à afficher
   - **Mode d'affichage** : Toast, Popup ou Bannière
   - **Position** : Où placer la publicité
   - **Dimensions** : Largeur et hauteur
   - **Couleurs** : Fond et texte
   - **Durée d'affichage** : En millisecondes (1000-60000)
   - **Pages cibles** : Où afficher la publicité
   - **URL de redirection** : Optionnel
   - **Image** : Optionnel
   - **Période** : Dates de début/fin optionnelles
3. Cliquez sur "Enregistrer"

### Modifier une publicité
1. Dans la liste, cliquez sur l'icône de modification (crayon)
2. Modifiez les informations souhaitées
3. Cliquez sur "Enregistrer"

### Statistiques disponibles
- **Total publicités** : Nombre total de publicités créées
- **Publicités actives** : Nombre de publicités actuellement actives
- **Vues totales** : Nombre total d'affichages
- **Clics totaux** : Nombre total de clics

## Architecture technique

### Base de données
Table `floating_ads` dans `fadidi_new_db` :
- Stockage de toutes les informations des publicités
- Index sur les colonnes de performance
- Support des statistiques de clics et vues

### API NestJS
Endpoints disponibles :
- `GET /api/floating-ads` - Liste toutes les publicités
- `GET /api/floating-ads/active` - Publicités actives pour une page
- `POST /api/floating-ads` - Créer une nouvelle publicité
- `PATCH /api/floating-ads/:id` - Modifier une publicité
- `DELETE /api/floating-ads/:id` - Supprimer une publicité
- `POST /api/floating-ads/:id/view` - Incrémenter les vues
- `POST /api/floating-ads/:id/click` - Incrémenter les clics
- `GET /api/floating-ads/statistics` - Statistiques globales

### Frontend
- **Dashboard admin** : Interface complète de gestion
- **Affichage automatique** : Script inclus sur toutes les pages
- **Responsive** : Adaptation automatique aux mobiles
- **Performances** : Chargement optimisé et cache local

## Installation et Configuration

### 1. Migration de la base de données
```bash
# Exécuter le fichier batch
cd database
run_floating_ads_migration.bat
```

### 2. Démarrer l'API NestJS
```bash
cd api-nestjs
npm install
npm run start:dev
```

### 3. Configuration des pages
Le script `floating-ads-display.js` est déjà inclus sur :
- `index.html`
- `boutique.html`

Pour ajouter à d'autres pages :
```html
<script src="assets/js/floating-ads-display.js"></script>
```

## Exemples d'utilisation

### Publicité de promotion (Bannière)
- **Mode** : Bannière
- **Position** : Haut au centre
- **Couleur** : Orange (#ff8c00)
- **Pages** : boutique.html
- **Durée** : 10 secondes
- **Redirection** : Vers une page de promotion

### Notification de nouveauté (Toast)
- **Mode** : Toast
- **Position** : Bas à droite
- **Couleur** : Vert (#28a745)
- **Pages** : Toutes (*)
- **Durée** : 6 secondes

### Popup d'information importante
- **Mode** : Popup
- **Position** : Centre
- **Durée** : Manuel (0 = jusqu'à fermeture)
- **Pages** : index.html

## Bonnes pratiques

### Performance
- Limitez le nombre de publicités actives simultanément
- Utilisez des images optimisées (< 200Ko)
- Définissez des durées d'affichage raisonnables

### Expérience utilisateur
- Évitez les popups trop fréquents
- Laissez toujours un moyen de fermer la publicité
- Testez sur mobile pour l'ergonomie

### Contenu
- Messages courts et impactants
- Call-to-action clairs
- Images de qualité et cohérentes avec la marque

## Dépannage

### La publicité ne s'affiche pas
1. Vérifiez que la publicité est active
2. Contrôlez les dates de début/fin
3. Vérifiez le ciblage des pages
4. Consultez la console du navigateur pour les erreurs

### Problèmes d'API
1. Vérifiez que l'API NestJS est démarrée
2. Contrôlez la configuration de la base de données
3. Vérifiez les logs du serveur

### Problèmes d'affichage
1. Testez sur différents navigateurs
2. Vérifiez les conflits CSS
3. Contrôlez les scripts JavaScript

## Support

Pour tout problème ou question :
1. Consultez les logs dans le dashboard admin
2. Vérifiez la console du navigateur
3. Contrôlez l'état de l'API NestJS
4. Examinez les données en base

---

*Documentation générée pour le système de publicités flottantes FADIDI v1.0*