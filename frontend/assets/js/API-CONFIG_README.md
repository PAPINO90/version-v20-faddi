# api-config.js — README

## ✅ But du fichier
`api-config.js` centralise la configuration liée à l'API pour l'application FADIDI. Il fournit :

- Les URLs de base (API et uploads) et les endpoints principaux.
- Des constantes de configuration (recherche, timeouts, images par défaut).
- Des helpers réutilisables pour construire des URLs et vérifier la disponibilité de l'API.
- L'exposition de ces valeurs/fonctions sur `window` pour une utilisation simple depuis d'autres scripts côté front.


## 🔧 Contenu principal
- **Constante** `API_CONFIG` :
  - `BASE_URL` — URL de base de l'API (ex: `http://localhost:3000/api`).
  - `UPLOADS_URL` — URL pour accéder aux fichiers uploadés (ex: `http://localhost:3000/uploads`).
  - `ENDPOINTS` — chemins d'API utiles (`/products`, `/categories`, `/orders`, `/auth`, `/upload`, ...).
  - `SEARCH` — paramètres pour la recherche (longueur min, délai de debounce, nombre max de résultats).
  - `DEFAULT_IMAGES` — images par défaut pour produits/catégories et placeholder.
  - `TIMEOUTS` — timeouts utilisés pour la recherche et les requêtes API.

- **Fonctions exposées** :
  - `buildApiUrl(endpoint, params = {})` — construit une URL complète pour un endpoint (ajoute les query params si fournis).
  - `buildUploadUrl(filename)` — retourne l'URL publique d'un fichier uploadé ou l'image produit par défaut si filename manquant.
  - `checkApiAvailability()` — fait une requête HEAD rapide sur `BASE_URL/products` pour vérifier que l'API répond (timeout 3s via AbortController). Retourne `true` ou `false`.

- **Exposition globale** :
  - `window.API_CONFIG`, `window.buildApiUrl`, `window.buildUploadUrl`, `window.checkApiAvailability`.
  - Le fichier affiche aussi quelques logs console à son chargement.


## 📌 Exemples d'utilisation
- Construire une URL d'API :

```js
// Récupérer produits page 2
const url = buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS, { page: 2 });
fetch(url).then(res => res.json()).then(...);
```

- Construire l'URL d'une image uploadée :

```js
const imgUrl = buildUploadUrl('my-image.jpg'); // -> http://localhost:3000/uploads/my-image.jpg
```

- Vérifier la disponibilité de l'API :

```js
const available = await checkApiAvailability();
if (!available) {
  showNotification('API indisponible, mode dégradé', 'warning');
}
```


