# Guide de Débogage des Images - FADIDI

## 🔍 Diagnostic Rapide

### Étape 1: Ouvrir la Console du Navigateur
1. Ouvrir `frontend/haut-game.html` dans le navigateur
2. Appuyer sur F12 pour ouvrir les outils développeur
3. Aller dans l'onglet "Console"

### Étape 2: Analyser les Messages de Debug

Chercher ces messages dans la console :

```
🎯 BuildSecureImageUrl appelé avec le produit: [NOM_PRODUIT]
📊 Structure des données images détectée: [TYPE]
🔗 URLs à tester pour [PRODUIT]: [LISTE_URLS]
✅ Image accessible: [URL_WORKING]
❌ Image non accessible: [URL_BROKEN]
```

### Étape 3: Identifier le Problème

#### Si vous voyez "❌ Image non accessible" pour toutes les URLs :
- **Problème**: L'API NestJS n'est pas démarrée ou les images sont manquantes
- **Solution**: Démarrer l'API avec `start-nestjs-api.bat`

#### Si vous voyez "📊 Structure: undefined" :
- **Problème**: L'API ne renvoie pas de données d'images
- **Solution**: Vérifier la structure des produits dans l'API

#### Si vous voyez "🔗 URLs à tester: []" :
- **Problème**: Aucune image trouvée dans les données du produit
- **Solution**: Ajouter des images aux produits via l'admin

### Étape 4: Actions de Réparation

#### Réparation Automatique
- La page tente automatiquement de réparer les images après 1.5 secondes
- Chercher le message : `🔄 Démarrage du test et réparation des images...`

#### Réparation Manuelle
- Utiliser le bouton "🔧 Réparer les Images" en bas de page
- Le système testera l'accessibilité de chaque image

### Étape 5: Vérification de l'API

```bash
# Tester si l'API fonctionne
curl http://localhost:3000/api/products/published
```

#### Réponse attendue :
```json
[
  {
    "id": 1,
    "name": "Produit Test",
    "images": ["image1.jpg", "image2.jpg"],
    // ou
    "image": "image.jpg"
  }
]
```

## 🛠️ Solutions Courantes

### Problème: Toutes les images montrent des placeholders
**Diagnostic**: L'API renvoie des données mais les URLs d'images sont incorrectes
**Solution**:
1. Vérifier que le dossier `api-nestjs/uploads/` contient les images
2. Vérifier que l'API sert bien les fichiers statiques
3. Tester l'URL complète: `http://localhost:3000/uploads/nom-image.jpg`

### Problème: Images manquantes dans les uploads
**Diagnostic**: Les fichiers d'images n'existent pas physiquement
**Solution**:
1. Copier les images dans `api-nestjs/uploads/`
2. Ou les uploader via l'admin dashboard

### Problème: API non démarrée
**Diagnostic**: Erreurs réseau dans la console
**Solution**:
```bash
cd api-nestjs
npm start
```

## 📋 Checklist de Diagnostic

- [ ] API NestJS est démarrée (http://localhost:3000)
- [ ] Dossier uploads contient les images
- [ ] Console montre les logs de debug
- [ ] URLs d'images sont correctes
- [ ] Images sont accessibles via navigateur
- [ ] Fonction de réparation automatique fonctionne

## 🔄 Tests Manuels

### Test 1: Accessibilité API
```javascript
// Dans la console du navigateur
fetch('http://localhost:3000/api/products/published')
  .then(r => r.json())
  .then(console.log)
```

### Test 2: Accessibilité Images
```javascript
// Dans la console du navigateur
const testUrl = 'http://localhost:3000/uploads/nom-image.jpg';
const img = new Image();
img.onload = () => console.log('✅ Image accessible');
img.onerror = () => console.log('❌ Image non accessible');
img.src = testUrl;
```

### Test 3: Forcer la Réparation
```javascript
// Dans la console du navigateur
buildAndTestImageUrl({name: 'Test', images: ['test.jpg']})
  .then(url => console.log('URL générée:', url))
```

## 📞 Support

Si le problème persiste après ces étapes, vérifier :
1. Les logs de l'API NestJS
2. Les erreurs réseau dans l'onglet Network
3. Les permissions du dossier uploads