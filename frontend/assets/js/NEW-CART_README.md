## Nouveau système de panier — `new-cart.js` 🛒

**But / Purpose**
- Implémenter le nouvel affichage et le flux complet du panier côté client pour FADIDI. Ce script gère l'ajout d'articles depuis la page produit, l'affichage du panier, la collecte des données de commande, la création d'une commande via l'API NestJS et la simulation du paiement.

**Responsabilités principales**
- Gestion des articles en session (stockage dans `localStorage`).
- Ajout d'articles via attributs `data-*` ou cartes produit (compatibilité avec anciens boutons).
- Rendu du panier (`#new-cart`), mise à jour des listes, quantités et résumé (subtotal / total).
- Flot de commande : collecte des infos client, validation, création d'order (`POST ${'${API_BASE_URL}'}/orders`) et traitement du paiement (simulé). 
- Notifications UI (popups) et mises à jour du badge panier dans la navbar.

**Points d'entrée & fonctions exposées**
- `new FadidiCart()` — classe principale.
- Global: `window.fadidiCart`, `window.cart`.
- Fonctions globales pour compatibilité:
  - `openCart()`, `closeCart()`, `proceedToCheckout()`, `backToCart()`, `continueShopping()`
  - Compat: `window.addToCart(productName, productPrice, productImage, productId)` — remappe vers `cart.addItem()`.

**Sélecteurs et éléments DOM attendus**
- Conteneur panier: `#new-cart` (ouvert/fermé par JS).
- Liste d'items: `#cart-items-list`.
- Messages / résumé: `#cart-empty-message`, `#cart-summary`, `#cart-subtotal`, `#cart-total-amount`.
- Navbar / badges: `#cart-count`, `.cart-badge`, `.cart-info`.
- Checkout: `#checkout-form`, `#order-form`, `#place-order-btn`, champs client (`#customer-name`, `#customer-phone`, `#delivery-address`, `#delivery-city`, etc.).

**Endpoints utilisés**
- `POST ${'${API_BASE_URL}'}/orders` — création de la commande.

**Format d'un item dans le panier**
```
{
  id, name, price, image, quantity
}
```

**Limitations & risques observés**
- `API_BASE_URL` est défini en dur (`http://localhost:3000/api`) → pas de centralisation ni d'environnement.
- Requêtes `fetch` sans `AbortController`/timeout ni retry.
- Validation UX basée sur `alert()` — mauvaise expérience utilisateur et difficile à tester.
- Paiement simulé côté client (placeholder). Nécessite intégration sécurisée pour le réel (tokenisation, webhooks).
- Rendu HTML via `innerHTML` et handlers inline (`onclick`, `onerror`) — risque d'injection, difficile à tester et à maintenir.
- Concurrence multi-onglets non gérée (possible écrasement de `localStorage`).

**Recommandations & améliorations**
- Centraliser la configuration API (`window.API_CONFIG` ou module) et remplacer `API_BASE_URL` codée en dur.
- Ajouter `AbortController` + timeout pour les appels réseau et une stratégie de retry pour calls critiques.
- Remplacer `alert()` par composants UI (toasts / modals) et afficher erreurs serveur lisibles.
- Retirer handlers inline et utiliser `addEventListener` + event delegation (améliore testabilité).
- Intégrer de véritables flux de paiement (Wave, Orange Money, cartes) côté backend et gérer statuts asynchrones (webhooks, polling).
- Gérer concurrence multi-onglets (ex. locks via localStorage events) ou réconciliation server-side.
- Ajouter tests unitaires pour `calculateTotals`, `addToCart`, `processOrder` et tests d'intégration pour le checkout.
- Considérer l'export ES module de `FadidiCart` pour faciliter le test et la réutilisation.

**Utilisation rapide / debug**
- Initialisation automatique au chargement: `window.fadidiCart = new FadidiCart()`.
- Ajouter un item depuis la console: `window.fadidiCart.addItem({ id, name, price, image, quantity })`.
- Forcer affichage panier: `openCart()` / `closeCart()`.

**Emplacement du fichier**
- `frontend/assets/js/new-cart.js`

