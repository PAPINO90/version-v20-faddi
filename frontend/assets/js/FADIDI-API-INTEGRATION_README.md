# fadidi-api-integration.js — README

## ✅ But du fichier
`fadidi-api-integration.js` connecte la boutique front-end FADIDI à l'API NestJS et fournit :

- La synchronisation périodique des produits depuis l'API vers `localStorage`.
- Un indicateur visuel de statut API (`#fadidi-api-status`) avec action manuelle de synchronisation.
- Des helpers pour construire les URLs d'images, fusionner les produits API avec les produits locaux et déclencher la mise à jour de l'UI.
- Une API publique côté client via `window.FadidiAPI` pour déclencher une sync manuelle ou consulter l'état.


## 🔧 Configuration (const `CONFIG`)
- `API_URL` — URL de base de l'API (ex: `http://localhost:3000/api`).
- `SYNC_INTERVAL` — intervalle de synchronisation périodique (ms).
- `ENABLE_API` — activer/désactiver la synchronisation vers l'API.
- `DEBUG` — logs détaillés.


## 🔍 Fonctions principales exposées
- `checkApiHealth()` — vérifie la disponibilité de l'API (HEAD /products/published) et met à jour l'état interne `apiAvailable`.
- `loadProductsFromAPI()` — récupère `GET /products/published`, convertit les produits au format front, les fusionne avec les produits locaux et écrit `localStorage.fadidiProducts`.
- `getProductImageUrl(product)` — construit l'URL d'une image de produit à partir du champ `images` renvoyé par l'API.
- `mergeProducts(apiProducts, existingProducts)` — stratégie simple : produit API + produits locaux non-API.
- `triggerProductsUpdate()` — déclenche un événement `storage` et appelle `loadAndDisplayFadidiProducts()` si disponible pour rafraîchir l'affichage.
- `startPeriodicSync()` — lance le timer de sync périodique, en évitant la sync si l'onglet est caché.
- `addApiStatusIndicator()` — insère `#fadidi-api-status` dans le DOM, met à jour son état visuel et permet de forcer une sync au clic.
- `initialize()` — orchestration : status indicator, check initial, load, start sync.

Toutes ces API sont aussi exposées via `window.FadidiAPI` :
```js
window.FadidiAPI = {
  sync: loadProductsFromAPI,
  checkHealth: checkApiHealth,
  getStatus: () => ({ apiAvailable, lastSyncTime }),
  config: CONFIG
};
```


## 📋 Comportement attendu / Effets secondaires
- Écrit `fadidiProducts` dans `localStorage` (format transformé, champ `source: 'api'`).
- Déclenche un `StorageEvent` personnalisé pour notifier les autres scripts et forcer le rafraîchissement.
- Ajoute un indicateur visuel en position fixe sur la page.
- Lance une synchronisation périodique (si activée) et ignore les syncs quand l'onglet est inactif.


## ⚠️ Limitations et points d'attention
- `checkApiHealth()` utilise `fetch(..., { timeout: 5000 })` : l'option `timeout` n'est pas standard pour `fetch`. Préférez `AbortController` pour implémenter un timeout.
- `mergeProducts` est très simple : il priorise les produits API et concatène les produits locaux. Il n'effectue pas de résolution de conflits (mise à jour, suppression, déduplication plus fine).
- Déclencher un `StorageEvent` programmatique peut ne pas réveiller tous les listeners selon le navigateur ; envisager d'émettre un `CustomEvent` global en plus.
- Pas d'authentification ni gestion d'erreurs avancée (retry/backoff, pagination, throttling). Les erreurs sont juste loggées.
- Les images sont construites en concaténant une URL d'uploads dérivée de `API_URL` — assurez-vous que les chemins correspondent à la config de production.


## 💡 Recommandations d'amélioration
- Implémenter un `AbortController` pour timeouts et annulation de requêtes.
- Améliorer `mergeProducts()` : utiliser une clé unique (id) pour fusionner/mettre à jour/dédupliquer au lieu de concaténer.
- Ajouter une gestion des erreurs avec stratégie de retry exponential backoff et logs centralisés.
- Ajouter une configuration externe (build-time env var / `window.API_CONFIG`) pour éviter les URLs codées en dur.
- Remplacer le dispatch programmatique de `StorageEvent` par un `window.dispatchEvent(new CustomEvent('fadidi:products:updated', { detail: {...} }))` pour une communication plus fiable entre modules.
- Ouverture : considérer d'exposer un hook de sync (`onSync(callback)`) pour permettre aux modules React/vanilla d'être notifiés plus proprement.


## ✅ Exemple d'utilisation
- Forcer une synchronisation manuelle :
```js
await window.FadidiAPI.sync();
```
- Vérifier l'état de l'API :
```js
const health = await window.FadidiAPI.checkHealth();
console.log(window.FadidiAPI.getStatus());
```


---

Fichier : `frontend/assets/js/fadidi-api-integration.js` 