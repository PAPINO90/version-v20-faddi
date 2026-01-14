## Système de panier (NestJS) — `nestjs-cart-api.js` 🛒

**But / Purpose**
- Fournir la logique client du panier pour FADIDI : gestion locale du panier (ajout, suppression, quantités), calcul des totaux, synchronisation légère avec l'API NestJS (tracker / promotions) et finalisation de commande (`checkout`).

**Responsabilités principales**
- Gérer un panier par session (sessionId sauvegardé en `localStorage`).
- Ajouter / supprimer / mettre à jour la quantité des articles.
- Calculer `subtotal`, `deliveryFee`, `total` et `totalSavings`.
- Sauvegarder / charger le panier depuis `localStorage`.
- Synchroniser non-bloquant avec l'API (increment sold pour promotions, création d'un `cart tracker` via POST `/orders`).
- Finaliser la commande via `checkout(customerData)` (création d'order côté API).
- Émettre un event personnalisé `cartUpdated` et mettre à jour compteurs DOM.

**Fonctions publiques / API exposée**
- Classe exportée globalement: `window.FadidiCartAPI`.
- Instance globale: `window.fadidiCartAPI`.
- Méthodes principales:
  - `addToCart(product)` → ajoute/agrège un produit et sync avec API.
  - `removeFromCart(index)` → supprime un item par index.
  - `updateQuantity(index, newQuantity)` → met à jour la quantité (0 → suppression).
  - `clearCart()` → vide le panier.
  - `checkout(customerData)` → crée une commande côté API et vide le panier.
  - `getStats()` → retourne statistiques dérivées (totalItems, subtotal, totalSavings, etc.).
  - `findOrdersByPhone(phone)` → recherche d'ordres via API.
  - `triggerCartUpdated()` → déclenche l'évènement `cartUpdated`.

**Endpoints utilisés**
- POST `/api/orders` — création d'un ordre (utilisé pour tracker & checkout).
- PATCH `/api/promotions/:id/sold` — incrément des ventes d'une promotion.
- GET  `/api/orders/by-phone/:phone` — recherche commandes par téléphone.

**Sélecteurs & éléments DOM mis à jour**
- `#cart-count-display` — affiche la quantité totale.
- `#cart-total-display` — affiche le total formaté.
- `#cart-count` — compteur secondaire (boutique page).
- `#cart-counter` — animation visuelle lorsque le panier change.

**Format attendu d'un produit (exemple)**
```
{
  id, name, price, originalPrice, image, quantity,
  promotionId, productId, isPromotion, discountPercentage, category
}
```

**Limitations & risques**
- Stockage client : le panier est stocké dans `localStorage` (pas chiffré, pas sécurisé). ❗
- Synchronisation : les appels API (orders, promotions) sont non bloquants et peuvent échouer silencieusement — pas de retry ni d'undo.
- `API_BASE_URL` est codée dans la classe par défaut (`http://localhost:3000/api`) — pas d'utilisation systématique d'une config centralisée.
- Pas d'AbortController / timeout pour les fetchs → requêtes pendantes possibles. ⏳
- Pas de validation stricte côté client des réponses API (assume `result.data`), peu de gestion d'erreurs utilisateur lisible.
- Possibilité de conditions de concurrence (multi-onglets) non gérées (sur-écriture de localStorage). 🔁
- Paiement fait côté serveur via `checkout`, mais le code client n'a pas de contrôle de sécurité renforcée côté UX (tokenisation, etc.). 🔒

**Recommandations & améliorations**
- Centraliser la configuration API (`API_CONFIG`) et utiliser `window.API_CONFIG.BASE_URL` partout.
- Ajouter `AbortController` et timeouts pour les fetchs avec gestion d'erreurs et retries pour appels critiques.
- Ajouter retour UI clair pour les échecs de sync/checkout (toasts / modal d'erreur) et logging côté serveur.
- Empêcher les races multi-onglets (ex. mutex via localStorage events, ou réconciliation server-side du panier).
- Valider et normaliser le produit côté client (schéma/joi/ajv) avant ajout au panier.
- Ajouter tests unitaires pour `calculateTotals`, `addToCart`, `updateQuantity`, et tests d'intégration pour `checkout`.

**Utilisation rapide / Débogage**
- Ajouter un produit: `await window.fadidiCartAPI.addToCart(product)` ✅
- Écouter les mises à jour du panier: `window.addEventListener('cartUpdated', e => console.log(e.detail))` 🔔
- Forcer la réinitialisation: `window.fadidiCartAPI.clearCart()`

**Emplacement du fichier**
- `frontend/assets/js/nestjs-cart-api.js`

