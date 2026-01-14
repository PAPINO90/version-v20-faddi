## Diagnostic d'images — `image-diagnostic.js` 🔧

**But / Purpose**
- Script d'analyse et de réparation automatique pour les images utilisées par FADIDI (produits, uploads, images dans le DOM).

**Responsabilités principales**
- Exécuter un diagnostic complet (`runFullDiagnostic`) qui :
  - vérifie la connectivité à l'API (`HEAD /api/products`),
  - analyse les données produits côté client (`localStorage` : `fadidiProducts`, `vendorProducts`),
  - teste le chargement des images présentes dans le DOM,
  - teste l'accès aux fichiers uploadés (`/uploads/placeholder.jpg`),
  - génère un rapport et recommandations.
- Réparer automatiquement les images du DOM (`autoRepair` / `repairImage`).

**Fonctions clés**
- `runFullDiagnostic()` — exécute le diagnostic complet et retourne la liste des problèmes.
- `checkApiConnectivity()` — teste l'accessibilité de l'API.
- `analyzeProductData()` / `analyzeProductArray()` — vérifie la présence et la validité des images dans les objets produits.
- `isValidImageUrl(url)` — règle simple de validation d'URL d'image.
- `checkDOMImages()` / `testImageLoad(src)` — vérifie visuellement chaque `<img>` du DOM (timeout 3s) et tente une réparation.
- `repairImage(imgElement)` — applique plusieurs stratégies (reconstruire URL vers `/uploads/`, image par défaut `assets/images/1-.png`, placeholder via.placeholder.com).
- `checkUploadsAccess()` — teste l'accès à `/uploads/placeholder.jpg`.
- `generateReport()` / `generateRecommendations()` — affiche résumé et recommandations dans la console.
- `autoRepair()` — exécute des réparations massives (vider cache, réparer images, forcer reload API si disponible).

**Exposition globale & utilisation**
- Instance globale : `window.fadidiDiagnostic`.
- Utilitaires rapides :
  - `window.runImageDiagnostic()` — lance le diagnostic.
  - `window.repairAllImageIssues()` — lance la réparation automatique.
- Diagnostic automatique : le script lance `runFullDiagnostic()` 3s après `DOMContentLoaded` (optionnel).

**Endpoints / ressources contactées**
- `HEAD http://localhost:3000/api/products` (connectivité API)
- `GET http://localhost:3000/uploads/placeholder.jpg` (vérifier dossier uploads)

**Dépendances & hooks optionnels**
- Si présents, le script appelle :
  - `window.fadidiImageManager.clearCache()` pour vider le cache image,
  - `window.forceReloadFromAPI()` pour forcer le rechargement de produits après réparation.

**Limitations & risques**
- `fetch(..., { timeout: X })` utilisé : ce n'est pas supporté par la spec Fetch — il faut utiliser `AbortController`.
- Test d'image basé sur `new Image()` + `setTimeout` — approche fragile (no retry, pas de contrôle Abort).
- `apiBaseUrl` codée en dur (`http://localhost:3000`) — pas de centralisation via `API_CONFIG`.
- Réparations mutent `img.src` directement sans validation ni journalisation côté serveur.
- Le script écrit uniquement dans la console — pas d'UI de rapport ou d'export de résultats.
- Auto-run au chargement peut être intrusif sur certains environnements de production/test.

**Recommandations & améliorations possibles**
- Remplacer timeouts implicites par `AbortController` pour fetch et tests réseau.
- Centraliser la base API (`window.API_CONFIG` ou `API_BASE_URL`) et l'utiliser partout.
- Ajouter option `dryRun` et `confirm` pour `autoRepair()` afin d'éviter changements non souhaités.
- Exposer un rapport visible dans l'UI (tableau / téléchargement JSON) en plus de la console.
- Ajouter retry/backoff raisonnable pour tests réseau et chargement d'images.
- Ajouter tests unitaires pour `isValidImageUrl`, `analyzeProductArray`, et tests d'intégration pour `autoRepair`.
- Remplacer `assets/images/1-.png` par une image de fallback configurable et vérifier l'existence sur le serveur.

**Conseils d'utilisation**
- Lancer un diagnostic depuis la console: `runImageDiagnostic()` ✅
- Lancer une réparation automatique: `repairAllImageIssues()` ⚠️ (préférer `dryRun` si implémenté)

**Emplacement du fichier**
- `frontend/assets/js/image-diagnostic.js`

