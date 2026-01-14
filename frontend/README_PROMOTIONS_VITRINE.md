# README : Affichage des promotions dans la vitrine (page Boutique)

## 🔎 Objectif
Ce README décrit comment les promotions sont affichées dans la vitrine de la boutique, le schéma de données suivi par le backend et le code qui gère l'affichage et l'interaction côté frontend. Il contient aussi les endpoints API utilisés pour la récupération et le suivi (vues / clics / ventes).

---

## 📁 Fichiers clés
- Frontend
  - `frontend/promotion.html` — page dédiée aux promotions, UI et rendu des cartes de promotion.
  - `frontend/boutique.html` — affiche aussi des promotions sur la page boutique (intégration vitrine).
  - `frontend/assets/js/promotion-cart-sync.js` — logique de synchronisation promotion ↔ panier (ajout, pré-commande, incrément soldQuantity).
  - `frontend/assets/js/nestjs-cart-api.js` — wrapper pour l'API de panier (utilisé par `addToFadidiCart`).
  - `frontend/assets/js/admin-dashboard.js` — chargement / gestion côté admin (chargement des promotions, stats).

- Backend (API NestJS)
  - `api-nestjs/src/promotions/entities/promotion.entity.ts` — schéma de la table `promotions`.
  - `api-nestjs/src/promotions/promotions.controller.ts` — endpoints exposés.
  - `api-nestjs/src/promotions/promotions.service.ts` — logique métier (filtrage active/featured, incrément sold, expiration).

---

## 🧾 Schéma (table `promotions`)
Champs principaux (voir `Promotion` entity):
- `id: uuid`
- `title: string`
- `description: text | null`
- `originalPrice: decimal`
- `promotionPrice: decimal`
- `discountPercentage: decimal` (calculé automatiquement)
- `startDate: Date`
- `endDate: Date`
- `status: enum` (draft | active | expired | paused)
- `image: string | null`
- `maxQuantity: number` (0 = illimité)
- `soldQuantity: number`
- `isFeatured: boolean`
- `tags: string[]`
- `productId, categoryId` (liens optionnels)
- `createdAt, updatedAt`

Propriétés calculées utiles : `isActive`, `daysRemaining`, `timeRemainingPercentage`.

---

## 🔌 Endpoints API importants
- GET `/promotions?status=active` — liste des promotions actives (utilisé par `promotion.html` et `boutique.html`).
- GET `/promotions?status=featured` — promotions mises en avant.
- GET `/promotions/:id` — détail d'une promotion.
- PATCH `/promotions/:id/sold` — incrémenter la quantité vendue (appelé à l'ajout au panier / vente).
- POST `/promotions` (JWT) — créer une promotion (admin).
- PATCH `/promotions/:id` (JWT) — modifier une promotion (admin).
- POST `/promotions/update-expired` (JWT) — marquer les promotions expirées.

---

## Frontend — Flux d'affichage (résumé)
1. `promotion.html` exécute `loadPromotions()` qui fait :
   - fetch `${API_BASE_URL}/promotions?status=active`
   - mappe les objets API vers le format attendu par le rendu (id, title, description, image, category, oldPrice, promoPrice, startDate, endDate, discountPercentage, daysRemaining)
   - filtre localement les promotions expirées (vérification `endDate >= now`)
   - `renderCategories()` et `renderPromos()` produisent les cartes (`.promo-card`) et un indicateur visuel de temps restant.
2. Les cartes ont un bouton `J'en profite !` qui appelle `addToFadidiCart(promotionId, title, promoPrice)`.
3. `addToFadidiCart` tente d'ajouter via `window.fadidiCartAPI.addToCart` (API NestJS), sinon bascule vers `window.addPromotionToFadidiCart` (fallback) qui utilise `PromotionCartSync.addPromotionToCart()`.
4. Lors de l'ajout réussi :
   - `PATCH /promotions/:id/sold` est appelé pour incrémenter `soldQuantity`.
   - Une pré-commande peut être créée (`/orders`) pour traçabilité (optionnel dans `promotion-cart-sync.js`).
5. `promotion.html` effectue un rafraîchissement périodique : `setInterval(loadPromotions, 5 * 60 * 1000)`.

---

## Règles d'affichage
- Une promo est affichée si : `status === 'active'` ET `startDate <= now <= endDate` ET (`maxQuantity === 0 || soldQuantity < maxQuantity`).
- Le frontend filtre encore les `endDate < now` pour sécurité côté client.
- Les promotions `isFeatured` peuvent être triées/mises en avant (service renvoie `isFeatured` en premier).

---

## Extraits de code importants
- Charger les promotions (extrait de `promotion.html`)

```js
const response = await fetch(`${API_BASE_URL}/promotions?status=active`);
const promotions = await response.json();
// map -> { id, title, description, image, category, oldPrice, promoPrice, ... }
```

- Rendu d'une carte (extrait simplifié)

```js
promoCard.innerHTML = `
  <span class="promo-badge">-${p.discountPercentage}%</span>
  <img src="${imageUrl}" alt="${p.title}">
  <div class="promo-title">${p.title}</div>
  <div class="promo-prices">
    <span class="old-price">${p.oldPrice} CFA</span>
    <span class="promo-price">${p.promoPrice} CFA</span>
  </div>
  <button onclick="addToFadidiCart('${p.id}', '${p.title}', ${p.promoPrice})">J'en profite !</button>
`;
```

- Ajout au panier (synchronisation)
  - `promotion-cart-sync.js` -> `PromotionCartSync.addPromotionToCart(promotion)`
  - `nestjs-cart-api.js` -> wrapper `addToCart(productData)` pour intégration avec backend

- Incrément de vente (backend) :
```http
PATCH /promotions/:id/sold
Body: { "quantity": 1 }
```

---

## Tests manuels recommandés ✅
1. Créer une promotion active (via admin) avec `startDate` maintenant et `endDate` dans le futur.
2. Ouvrir `promotion.html` et vérifier la présence de la promotion.
3. Cliquer sur l'image (vérifier modal), cliquer sur `J'en profite !` et confirmer que :
   - Produit ajouté au panier (message d'UI)
   - Requête `PATCH /promotions/:id/sold` est faite (voir logs réseau)
   - `soldQuantity` du backend s'incrémente
4. Tester promotion expirée (endDate passé) : ne doit pas s'afficher.
5. Tester `maxQuantity` atteint : après avoir simulé ventes, la promo doit disparaître une fois `soldQuantity >= maxQuantity`.
6. Tester variants mobiles (taille, grille 2-colonnes) et performance (lazy loading images).

---

## Bonnes pratiques & conseils 💡
- Faire la validation côté serveur : ne pas se fier uniquement au filtre client pour masquer les promos expirées.
- Paginer les promotions si la liste grossit. Aujourd'hui l'API renvoie tout par défaut.
- Mettre en place un job périodique côté serveur pour exécuter `updateExpiredPromotions()`.
- Ajouter métriques: vues (GET), clics (PATCH endpoints existants pour annonces) et conversions (vente jointe à orders). Le front a déjà quelques PATCH pour vues/clics dans `index.html` et `promotion.html`.

---

## Dépannage rapide ⚠️
- Si `promotion.html` affiche « Erreur de connexion à l'API », vérifier `API_BASE_URL` et que le backend NestJS tourne (`npm run start` dans `api-nestjs`).
- Si les images n'apparaissent pas, vérifier que `image` contient soit URL complète, soit chemin `/uploads/...` (les helpers construisent l'URL correcte).

---

