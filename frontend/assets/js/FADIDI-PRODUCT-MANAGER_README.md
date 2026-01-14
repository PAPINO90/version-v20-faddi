# fadidi-product-manager.js — README

## ✅ But du fichier
Le script `fadidi-product-manager.js` implémente un gestionnaire de produits côté front permettant d'éviter les duplications lors de l'affichage des produits dans la boutique FADIDI. Il fournit :

- Un cache produit (`productCache`) et un set des produits affichés (`displayedProducts`) pour éviter les insertions répétées.
- Des méthodes pour afficher sans duplication (`displayProducts`), recharger depuis l'API (`reloadFromAPI`) et ajouter un nouveau produit proprement (`addNewProduct`).
- Une instance globale accessible via `window.fadidiProductManager`.


## 🔧 Fonctions / méthodes principales
- `isProductDisplayed(productId)` — renvoie `true` si l'ID a déjà été affiché.
- `markProductAsDisplayed(productId)` — marque un produit comme affiché (ajout au set `displayedProducts`).
- `clearDisplayedProducts()` — réinitialise l'état d'affichage (vide le set et remet `productsLoaded = false`).
- `addToCache(product)` / `getFromCache(productId)` — gestion du cache interne `productCache`.
- `areProductsLoaded()` / `setProductsLoaded(loaded = true)` — état de chargement.

- `displayProducts(products, containerId)` —
  - Vide le conteneur si nécessaire, crée une grille `.fadidi-modern-grid` et ajoute uniquement les produits non déjà affichés.
  - Pour chaque produit, crée une carte via `createProductCard(product)` (classe `.fadidi-product-card`), marque le produit comme affiché et met à jour le cache.
  - Retourne `true` si l'affichage s'est bien passé.

- `createProductCard(product)` — construit le DOM d'une carte produit (image, titre, description, prix, bouton) en utilisant `product.image` ou une image par défaut.

- `reloadFromAPI()` —
  - Récupère `GET /api/products/published` (URL codée en dur), convertit le format, stocke `fadidiProducts` en `localStorage`, efface l'affichage et ré-affiche les produits via `displayProducts(..., 'fadidi-products-list')`.

- `addNewProduct(product)` —
  - Vérifie si le produit est déjà affiché (par `id`), ajoute au localStorage si nécessaire, crée une carte et l'ajoute à l'affichage, et met à jour le cache et le set `displayedProducts`.


## 📋 Éléments DOM & conventions attendus
- Conteneur principal attendu pour l'affichage par défaut : `#fadidi-products-list`.
- La grille créée porte la classe `.fadidi-modern-grid`.
- Les cartes produits utilisent `.fadidi-product-card` et définissent `data-product-id`.
- Les cartes utilisent `onclick="openImage(this)"` pour l'image et un bouton avec `data-cart-action="add"` — vérifiez que ces handlers sont présents ailleurs dans l'app.
- Clés locales : `localStorage.fadidiProducts` est utilisée comme source persistée.


## 🌐 Endpoints & stockage
- Endpoint appelé : `GET http://localhost:3000/api/products/published` (hardcodé dans `reloadFromAPI`).
- Stocke/écrit en `localStorage` la clé `fadidiProducts` (format: tableau d'objets avec `id`, `name`, `price`, `image`, ...).


## ⚠️ Limites & points d'attention
- L'anti-duplication s'appuie uniquement sur `product.id` : assurez-vous que les IDs fournis par l'API sont uniques et stables (évitez collisions entre vendeurs si applicable).
- URLs API codées en dur (http://localhost:3000) — à externaliser via `API_CONFIG` ou variables d'environnement pour prod/staging.
- Le script manipule directement le DOM et injecte HTML via `innerHTML` — attention aux injections et à la testabilité.
- Le bouton d'ajout au panier utilise un attribut `data-cart-action="add"` sans gestion attachée ici : assurez-vous d'un écouteur global qui le traite (ex: delegation event listener).


## 💡 Suggestions d'amélioration
- Centraliser l'API URL et les helpers de rendu (utiliser `window.API_CONFIG` et `buildUploadUrl()` si disponibles).
- Émettre des événements (`CustomEvent`) lors de l'ajout ou du rechargement des produits (ex: `window.dispatchEvent(new CustomEvent('fadidi:products:updated', { detail }))`) pour découpler l'affichage de la logique métier.
- Ajouter des tests unitaires pour :
  - `displayProducts` (pas de duplication),
  - `addNewProduct` (ajout idempotent),
  - `reloadFromAPI` (mock fetch + vérification du stockage local et rendu).
- Gérer la pagination / streaming si le nombre de produits devient élevé (au lieu de charger tout en mémoire).


## ✅ Exemples d'utilisation
- Recharger depuis l'API (manuel) :
```js
await window.fadidiProductManager.reloadFromAPI();
```
- Ajouter un nouveau produit sans duplication :
```js
window.fadidiProductManager.addNewProduct({ id: 'p-123', name: 'Produit X', price: 12000, image: 'uploads/x.jpg' });
```
- Vérifier si un produit est affiché :
```js
if (window.fadidiProductManager.isProductDisplayed('p-123')) console.log('déjà affiché');
```


---

