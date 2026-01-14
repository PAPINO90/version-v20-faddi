## Synchronisation Promotions ↔ Panier — `promotion-cart-sync.js` 🔄

**But / Purpose**
- Faciliter la synchronisation entre les **promotions** et le **panier** client : convertir une promotion en item de panier, ajouter la promotion au panier local, incrémenter les compteurs de vente et créer une pré-commande pour traçabilité.

**Responsabilités principales**
- Convertir un objet promotion en item compatible panier (`promotionToCartItem`).
- Ajouter une promotion au panier local (`addPromotionToCart`) et mettre à jour `localStorage` (`fadidi_cart_items`).
- Mettre à jour l'UI si `window.fadidiCart` est présent (synchronisation navbar / badge).
- Incrémenter la quantité vendue d'une promotion via l'API (`PATCH /promotions/:id/sold`).
- Créer une pré-commande (order) côté API pour traçabilité (`POST /orders`).
- Fournir utilitaires : `getCartStats()`, `cleanOldCartItems(maxAge)`.

**Endpoints utilisés**
- PATCH `/api/promotions/:id/sold` — incrémenter la quantité vendue.
- POST  `/api/orders` — créer une pré-commande (trace des ventes de promo).

**Exposition globale / utilitaires**
- Classe exportée : `window.PromotionCartSync`.
- Instance globale par défaut : `window.promotionSync`.
- Helper global pour l'intégration UI : `window.addPromotionToFadidiCart(promotionId, productName, price, imageUrl)`.

**Format d'item panier créé (extrait)**
```
{
  id: `promo_${id}`,
  name, price, image, promotionId, isPromotion: true, quantity: 1
}
```

**Comportement DOM / stockage**
- Écrit directement dans `localStorage` la clé `fadidi_cart_items`.
- Si `window.fadidiCart` est présent, met à jour `window.fadidiCart.items` puis appelle `updateNavbarCart()`.

**Limitations & risques**
- `API_BASE_URL` codée en dur (`http://localhost:3000/api`) → manque de centralisation.
- Opérations réseau sans `AbortController` / timeout ni retry.
- `createPreOrder` ignore les erreurs (log only) — perte possible d'information importante.
- Mutations directes de `localStorage` sans émissions d'événements CustomEvent → autres onglets/consumers peuvent ne pas être notifiés.
- Idempotence non garantie (double clic / re-soumission potentiellement ajoutent plusieurs fois l'item et la pré-commande).

**Recommandations d'amélioration**
- Centraliser la configuration API (utiliser `window.API_CONFIG` ou un module commun).
- Ajouter `AbortController` + timeout et stratégie de retry pour les appels critiques (`sold`, `orders`).
- Rendre `createPreOrder` résiliente : propager l'erreur ou stocker une file d'attente pour ré-essayer plus tard.
- Émettre un `CustomEvent('cartChanged', { detail: ... })` après mise à jour `localStorage` pour supporter multi-onglets.
- Ajouter protection idempotence (token / mutex) pour éviter doubles ajouts/créations.
- Ajouter retours UI utilisateur (toast / notification) en cas d'erreur ou de succès.
- Ajouter tests unitaires pour `promotionToCartItem`, `addPromotionToCart`, `getCartStats`.

**Utilisation rapide**
- Ajouter une promo depuis le front: `await window.addPromotionToFadidiCart(id, name, price, imageUrl)` ✅
- Obtenir stats: `window.promotionSync.getCartStats()` 🔍

**Emplacement du fichier**
- `frontend/assets/js/promotion-cart-sync.js`

