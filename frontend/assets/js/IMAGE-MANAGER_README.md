## Gestionnaire d'images — `image-manager.js` 🖼️

**But / Purpose**
- Fournir des utilitaires robustes pour construire des URLs d'images, vérifier leur accessibilité, appliquer des images sur des `<img>` de façon résiliente et réparer/valider les images présentes sur la page.

**Responsabilités principales**
- Construire une URL d'image fiable avec fallback (`buildImageUrl`).
- Vérifier l'existence d'une image (`verifyImageExists`) et mettre en cache le résultat.
- Appliquer une image à un élément `<img>` de manière sécurisée (`setImageSafely`) avec placeholder, gestion d'erreur et callbacks.
- Réparer toutes les images dans un conteneur DOM (`repairImagesInContainer`).
- Précharger / valider les images d'un produit (`preloadProductImages`).
- Revalider / recharger toutes les images de la page (`revalidateImages`).
- Créer des éléments `<img>` sécurisés via `createSecureImage`.
- Réparer les URLs d'images dans les objets produits (`repairProductImageUrls`).

**Exposition globale / Utilitaires**
- Instance globale accessible: `window.fadidiImageManager`.
- Helpers exposés:
  - `window.createSecureProductImage(imageData, altText, className)` → retourne un `<img>` prêt.
  - `window.repairAllImages()` → force la revalidation/rechargement de toutes les images.

**Comportement DOM attendu**
- Travaille sur `img` éléments standards (sélecteur `img`) et accepte un conteneur DOM pour réparation (`repairImagesInContainer(container)`).
- Lors du chargement de la page, le script lance `repairImagesInContainer(document.body)` après 1 s (auto-réparation par défaut).

**Endpoints / URLs**
- Utilise `this.apiBaseUrl` (par défaut `http://localhost:3000`) pour construire les URLs vers `/uploads/<filename>`.
- Default images/fallbacks:
  - `assets/images/1-.png` (produit)
  - `http://localhost:3000/uploads/placeholder.jpg` (placeholder)

**Limitations & points d'attention**
- `fetch(..., { timeout: 3000 })` est utilisé — l'option `timeout` n'est pas standard pour fetch. Il faut plutôt utiliser `AbortController`.
- Vérification via `HEAD` sur des fichiers statiques peut être bloquée par certains serveurs/CDN (ou retourner 403) — prévoir fallback et retries.
- Cache mémoire (Map + Set) est processeur-locally persistant seulement pendant la session; pas d'expiration ni invalidation contrôlée.
- Handlers d'image sont assignés directement sur `imgElement.onerror` / `onload` — ok, mais peut interférer avec d'autres handlers existants.
- Hard-coded `apiBaseUrl` et valeurs par défaut — recommander la centralisation avec `window.API_CONFIG`.

**Recommandations d'amélioration**
- Remplacer `timeout` par `AbortController` pour contrôler les délais et éviter des requêtes pendantes.
- Ajouter une stratégie de retry/backoff pour les HEAD/GET des images.
- Permettre configuration externe des valeurs par défaut (placeholder, product fallback, apiBaseUrl) via `window.API_CONFIG`.
- Exposer hooks pour instrumentation (events CustomEvent ou callbacks) pour trace et tests.
- Considérer la persistance optionnelle du cache (IndexedDB / localStorage) pour éviter revalidation répétée entre sessions.
- Éviter d'écraser `img.onerror`/`onload` directement — attacher des listeners via `addEventListener` et permettre la préservation des handlers existants.

**Conseils d'utilisation rapide**
- Créer une image sécurisée depuis le template: `const img = createSecureProductImage(product.image, 'Nom produit', 'product-thumb');`
- Forcer la revalidation de toutes les images: `await repairAllImages();` ou `window.fadidiImageManager.revalidateImages();`
- Nettoyer le cache d'images (dev): `window.fadidiImageManager.clearCache();`

**Emplacement du fichier**
- `frontend/assets/js/image-manager.js`

