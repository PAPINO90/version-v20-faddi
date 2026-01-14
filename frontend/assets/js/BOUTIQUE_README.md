# boutique.js — README

## ✅ But du fichier
`boutique.js` contient la logique principale côté client pour la boutique FADIDI. Il gère principalement :

- Le panier (ajout, suppression, affichage, sauvegarde en localStorage)
- Le passage en caisse (formulaire client, sélection des moyens de paiement, génération de QR codes)
- La création et la sauvegarde des commandes (stockage local, confirmation)
- Le moteur de recherche (requête API + affichage des résultats)
- Le chargement et l'affichage des produits (Fadidi + vendeurs)
- Le suivi de commande et l'affichage des détails de suivi
- Différentes UI/animations (accordéons, slideshow, modals, widgets)


## 🔧 Fonctions principales (aperçu)
- Gestion panier
  - `addToCart(productName, productPrice)` — ajoute un produit au panier et sauvegarde dans `localStorage`.
  - `updateCart()` — met à jour l'UI du panier (liste, total, compteur).
  - `removeFromCart(index)` — supprime un item du panier.
  - `getCartTotal()` — calcule le total.
  - `emptyCart()` / `clearCartCompletely()` / `resetCart()` — différentes variantes pour vider/réinitialiser le panier.
  - `showAddedToCartNotification(productName)` — notification visuelle à l'ajout.

- Paiement & commandes
  - `continueToPayment()` — validation du formulaire client et affichage de la section paiement.
  - `selectPayment(method)` — affiche/masque les champs du moyen de paiement sélectionné et génère QR si besoin.
  - `processPayment()` — logique simplifiée de traitement de paiement (création d'objet commande, sauvegarde locale, vidage du panier).
  - `saveOrder()` — structure et sauvegarde d'une commande (groupée par vendeur si nécessaire).
  - `showOrderConfirmation(orderId)` / `showConfirmationMessage(orderId)` — affichage de la confirmation.

- Produits & affichage
  - `loadPublishedProducts()` — charge produits (combinaison `fadidiProducts` + `vendorProducts` depuis `localStorage`) et les affiche.
  - `createProductCard(product)` — crée la carte produit (HTML) utilisée dans la grille.
  - `forceReloadVendorProducts()` — permet de forcer un rechargement.

- Recherche
  - `searchProduct()` — recherche via API (utilise `window.API_CONFIG`, `buildApiUrl`, `checkApiAvailability`) et fallback local dans certains fichiers.
  - `displaySearchResults(products, searchQuery)` — affiche les résultats de recherche dans une section dédiée.
  - `createSearchResultsSection()` — crée dynamiquement la section de résultats.
  - `showSearchLoading(show)`, `showNoResultsMessage()` etc.

- Suivi de commande
  - `trackAnyOrder()` — recherche flexible dans plusieurs clés `localStorage` pour retrouver une commande.
  - `trackOrder()` — lecture d'un ID et affichage par `displayOrderDetails(order)`.
  - `displayOrderDetails(order)` — rendu complet de l'état de la commande et progression.

- Utilitaires & UI
  - `openImage(imgElement)` / `closeImage()` — modal d'image.
  - `generateQRCode(elementId, data)` — génère un QR (dépend d'une lib QRCode).
  - `showCategoryManager()`, `editCategory()`, `saveEditedCategory()` — gestion modale des catégories.
  - Animations (particles, widget attention) et écouteurs `storage` / `DOMContentLoaded`.


## 📋 Éléments DOM attendus (IDs / classes importants)
- Panier : `#cart-items`, `#total-price`, `#checkout-btn`, `#cart-count`, `#panier`, `#paiement`, `#client-info`
- Paiement : `#visa-fields`, `#wave-fields`, `#orange-money-fields`, `#card-number`, `#wave-number`, `#orange-number`
- Recherche : `#search-input`, `#search-button`, `#search-results-section`
- Produits : `.product-grid`, `.product-item`, `.fadidi-product-card`, `#vendor-product-list`
- Modal image : `#imageModal`, `#modalImg`
- Tracking : `#order-id`, `#tracking-result`

Assurez-vous que ces éléments existent et ont des IDs/classes cohérents dans vos pages (`boutique.html`, etc.).


## 🌐 API et stockage
- Recherche : utilise `window.API_CONFIG`, `buildApiUrl()` et `checkApiAvailability()` si l'API est disponible (`ENDPOINTS.PRODUCTS_SEARCH`).
- La plupart des données opérationnelles (panier, commandes, produits) sont stockées en clair dans `localStorage` (`cartItems`, `fadidiOrders`, `fadidiProducts`, `vendorProducts`).


## ⚠️ Observations / limites importantes
- Stockage local : les commandes et données sensibles (moyens de paiement simulés) sont conservées en clair dans `localStorage` — ceci **n'est pas sécurisé** pour la production.
- Duplications et redéfinitions : il existe plusieurs versions/duplications de fonctions (ex. `addToCart`, `selectPayment`, `showError`) — cela complique la maintenance et peut introduire des bugs.
- HTML injecté en dur : le code insère beaucoup de HTML/CSS inline — risque d'injection et difficile à tester.
- Paiement : la logique de paiement est simulée côté client (création de commande et sauvegarde) — il faut connecter un back-end et un fournisseur de paiement pour un vrai flux sécurisé.
- Dépendances : génération de QR codes dépend d'une lib externe (`QRCode`) qui doit être chargée.


## 💡 Recommandations d'amélioration
- Modulariser : extraire le panier, paiement, recherche et affichage produits en modules réutilisables ou classes (ex: `Cart`, `Payment`, `ProductManager`).
- Éviter les `onclick` inline : utiliser lier les événements via `addEventListener` et lier les handlers au DOM une seule fois (décomposition et test unitaire plus simple).
- Centraliser l'état : avoir un store (ou objet unique) pour l'état du panier et événements (publish/subscribe) pour synchronisation entre vues.
- Sécurité : ne pas stocker d'informations de paiement en `localStorage`. Envoyer les commandes au serveur sécurisé et utiliser tokens/escrow côté serveur.
- Nettoyage : supprimer fonctions dupliquées et codé mort pour rendre le fichier plus lisible et plus petit.
- Tests : ajouter des tests unitaires pour la logique du panier, calcul du total, sauvegarde/chargement et recherche.


## 🚀 Exemples rapides
- Ajouter un produit :

```js
addToCart('Chargeur USB', 2500);
// Met à jour localStorage, compteur et UI
```

- Lancer une recherche :

```js
document.getElementById('search-input').value = 'téléphone';
searchProduct();
```

- Simuler un paiement :

```js
selectPayment('wave');
processPayment(); // crée une commande dans localStorage et vide le panier
```


---

Fichier : `frontend/assets/js/boutique.js`

