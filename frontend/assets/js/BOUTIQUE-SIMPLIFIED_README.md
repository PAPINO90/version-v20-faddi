# boutique-simplified.js — README

## ✅ But du fichier
`boutique-simplified.js` contient la logique principale côté front pour l'affichage simplifié de la boutique FADIDI (sans gestion du panier). Il gère :

- Les accordéons de catégories et l'ouverture/fermeture des sections
- L'affichage d'images en modal
- Un moteur de recherche local avancé (produits, sections, menu) avec mise en évidence des résultats
- Le chargement des produits depuis l'API (fallback vers `localStorage`)
- Un slideshow des produits mis en avant
- Quelques interactions UI (menu, écouteurs clavier)


## 🔧 Fonctions principales exposées
- `toggleAccordion(button)` — bascule l'affichage du panneau associé et ferme les autres.
- `openImage(imgElement)` / `closeImage()` — affichage d'une image dans une modal (`#imageModal`).
- `searchProduct()` — moteur de recherche : met en évidence produits, catégories et éléments de menu, gère les cas "produits avec même nom" et affiche des messages de résultat/redirect.
- `resetSearchResults()` — remet l'affichage à l'état normal (supprime surbrillance/messages).
- `showNoResultsMessage(searchTerm)`, `showAdvancedSearchSummary(...)`, `showRedirectMessage(...)`, `showSameNameProducts(...)` — UI pour les différents états de recherche.
- `openParentSection(productElement)` — ouvre la section parent d'un produit (accordéon, carrousel, tab, etc.).
- `loadProductsFromAPI()` — charge `GET /products/published` via `window.API_CONFIG.BASE_URL` et stocke un tableau réduit dans `localStorage` (`fadidiProducts`). Retourne `true` si l'appel API fonctionne, sinon bascule `useApiMode = false` et charge le fallback.
- `loadAndDisplayFadidiProducts()` / `forceReloadProducts()` — affichage des produits sauvegardés via `window.fadidiProductManager` ou re-essai différé.
- `initSlideshow()`, `changeSlide(direction)`, `showSlide(index)` — gestion du slider des produits mis en avant.


## 📋 Éléments DOM attendus / IDs et classes utilisés
Assurez-vous que les éléments suivants existent dans la page pour que le script fonctionne correctement :

- `#search-input` — champ de recherche (appuie sur Entrée déclenche `searchProduct()`)
- `.product-item` / `.fadidi-product-card` — conteneurs produits (titres, prix, descriptions attendus dans leurs sélecteurs internes)
- `.accordion-header` / `.accordion-content` — accordéons de catégories
- `#imageModal`, `#modalImg` — modal d'image
- `#menuButton`, `#menuContent` — menu mobile
- `#slideshow-content` — conteneur du slideshow
- Conteneurs cibles : `#fadidi-products-list`, `assets/images/1-.png` (image par défaut)


## 🌐 API & stockage local
- Endpoint principal utilisé : `GET ${'window.API_CONFIG ? window.API_CONFIG.BASE_URL : "http://localhost:3000/api"'}/products/published`.
- Si l'API n'est pas disponible, le script :
  - bascule `useApiMode = false`
  - lit `fadidiProducts` dans `localStorage` (clé : `'fadidiProducts'`) et appelle `window.fadidiProductManager.displayProducts(...)` si disponible.


## ⚠️ Comportements & limites
- Ce fichier **ne gère pas** le panier : le panier est pris en charge par `new-cart.js`.
- Le code effectue beaucoup de manipulations directes du DOM et d'injections HTML/CSS inline (styles temporaires pour surbrillances, messages, modals).
- Les URLs d'images sont parfois codées en dur (`http://localhost:3000/uploads/...`) — utilisez `API_CONFIG` ou `buildUploadUrl` pour rendre cela configurable.


## 💡 Suggestions d'amélioration
- Extraire la logique de recherche dans un module réutilisable (facilite tests et maintenance).
- Remplacer les constructions HTML inline par templates ou composants pour éviter les injections accidentelles.
- Utiliser `window.API_CONFIG` (ou convertir en module ES) pour centraliser la configuration API et éviter les URL codées en dur.
- Ajouter des tests unitaires pour `searchProduct`, `openParentSection` et le slideshow.
- Standardiser les classes CSS plutôt que de définir des styles inline pour faciliter le theming.


## 📌 Exemple d'usage / séquence d'initialisation
Au chargement (`DOMContentLoaded`) :

1. `loadProductsFromAPI()` est appelé ; si succès, les produits sont stockés dans `localStorage` et l'UI est rafraîchie.
2. `initSlideshow()` initialise le slider à partir des produits publiés.
3. Le menu est connecté (`#menuButton` toggles `#menuContent`).
4. L'appui sur `Enter` dans `#search-input` déclenche `searchProduct()`.


---

Fichier : `frontend/assets/js/boutique-simplified.js` 