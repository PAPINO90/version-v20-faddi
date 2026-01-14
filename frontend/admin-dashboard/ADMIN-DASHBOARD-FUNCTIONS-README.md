## README - Dashboard Admin: chemin fonctionnel des fonctions (clair & précis) ✅

But : donner un guide concis qui décrit le chemin (flow) de chaque fonction importante du dashboard admin (Produits, Catégories, Commandes, Promotions, Annonces, Bannières Header, Publicités flottantes, Abonnés, Admins).

Comment lire ce document
- **Fonction** : nom de la fonction (ou groupe) et rôle.
- **Déclencheur / sélecteur** : comment/quel élément déclenche la fonction.
- **Endpoints API** : endpoints utilisés.
- **Chemin (1..5 étapes)** : étapes exécutées (appel API, rendu, state updates).
- **Test rapide** : commande manuelle pour vérifier le chemin.

---

## 1) Abonnés notifications 🔔
- Fonctions principales
  - `loadSubscribers()` — charge GET /api/subscribers et rend `#subscribers-tbody`.
  - `updateSelectedSubscribers()` — calcule sélection, affiche compteur `#selected-subscribers-count`.
  - `toggleAllSubscribers(checked)` — coche/décoche `.select-subscriber`.
  - `deleteSubscriber(id)` — DELETE /api/subscribers/:id puis `loadSubscribers()`.
  - `blockSubscriber(id, isActive)` — PATCH /api/subscribers/:id {active: !isActive} puis `loadSubscribers()`.
  - `deleteSelectedSubscribers()` / `blockSelectedSubscribers()` — opérations groupées avec confirmation.

- Chemin (ex. suppression d'abonné)
  1. UI: utilisateur coche case `.select-subscriber` -> `updateSelectedSubscribers()` met à jour compteur.
  2. Clic `Supprimer` ou `deleteSelectedSubscribers()` -> confirmation `confirm()`.
  3. Appel API DELETE pour chaque id -> attend réponses.
  4. `loadSubscribers()` recharge et réaffiche la table.
  5. Notification visuelle via `showNotification()` ou `alert()`.

- Sélecteurs / test rapide
  - Table: `#subscribers-tbody`, cases: `.select-subscriber`, bouton groupe: `#delete-selected-subscribers`.
  - Test: Ouvrir `Dashboard > Abonnés`, cocher une ligne, cliquer supprimer -> vérifier que l'API DELETE a été appelée et que la ligne disparaît.

---

## 2) Annonces (gestion-annonces.html) 📣
- Fonctions principales
  - `loadAnnonces()` — GET /api/annonces -> rend `#annonces-table-body`.
  - `incrementClicAnnonce(id)` — PATCH/POST compteur clics (API dédiée) lors du clic aperçu.
  - `deleteAnnonce(id)`, `editAnnonce(id)`, `submitEdit(id)` / `sendEditRequest(id, dto)` — CRUD complet.
  - `toggleAnnonceActive(id, newState)` — activation/désactivation via PATCH.

- Chemin (ex. édition d'annonce)
  1. `loadAnnonces()` récupère et affiche les lignes (innerHTML + attachement events).
  2. Clic `Modifier` -> `editAnnonce(id)` -> `showEditForm(annonce)` pré-remplit le modal.
  3. Envoi du formulaire -> `submitEdit(id)` -> `sendEditRequest(id, dto)` -> PATCH /api/annonces/:id.
  4. Une fois OK -> `loadAnnonces()` recharge la table et affiche notification.

- Sélecteurs / test rapide
  - Table: `#annonces-table-body`, select all: `#selectAllAnnonces`.
  - Test: Modifier le titre d'une annonce puis vérifier via GET que la modification est persistée.

---

## 3) Produits (section Produits) 🛍️
- Fonctions principales
  - `loadProducts()` — GET /api/products -> charge catégories, appelle `displayProducts()`.
  - `displayProducts()` — crée lignes de `#products-tbody`, ajoute boutons `editProduct(id)` et `deleteProduct(id)`.
  - `openProductModal(productId)`, `fillProductForm(product)`, `saveProduct()` — modal CRUD + upload d'images (POST /products, PATCH /products/:id, POST /upload/images).
  - `deleteSelectedProducts()` / `toggleAllProducts(checked)` / `updateSelectedProducts()` — suppression groupée.

- Chemin (création produit)
  1. Open modal `openProductModal()` -> remplir champs.
  2. `saveProduct()` valide côté client puis POST /api/products (Authorization header).
  3. Si images -> POST /api/upload/images puis PATCH produit avec filenames.
  4. `closeProductModal()` -> `loadProducts()` -> UI rafraîchie -> `syncWithBoutique()` tenté.

- Sélecteurs / test rapide
  - Table: `#products-tbody`, modal: `#product-modal`, inputs: `#product-name`, `#product-images`.
  - Test: Créer produit minimal -> vérifier GET /api/products contient l'objet -> image upload si fournie.

---

## 4) Catégories ✅
- Fonctions principales
  - `loadCategories()`, `displayCategories()`, `loadCategoriesForSelect()` (alimenter select produit).
  - `updateSelectedCategories()`, `toggleAllCategories(checked)`, `deleteSelectedCategories()`.

- Chemin (ajout catégorie)
  1. Formulaire catégorie -> POST /api/categories.
  2. `loadCategories()` recharge et met à jour le `select` produit via `loadCategoriesForSelect()`.

---

## 5) Commandes & Commandes haut de game 🧾
- Fonctions principales
  - `loadOrders()` et variantes (chargent / affichent list), `updateOrderStatus(id, status)` pour patcher le statut.
  - `calculateRevenue()` utilitaire pour résumé du tableau de bord.

- Chemin (mise à jour statut commande)
  1. UI clic -> `updateOrderStatus()` -> PATCH /api/orders/:id.
  2. Recharger `loadOrders()` -> mettre à jour stats `calculateRevenue()`.

---

## 6) Promotions 🎉
- Fonctions principales
  - `loadPromotions()` — GET /api/promotions -> remplit `#promotions-tbody` et `promotions-stats`.
  - `loadPromotionStats()` / `refreshPromotionStats()` -> stat collecte GET /api/promotions/statistics/all.
  - `deletePromotion(id)`, `deleteSelectedPromotions()` -> suppression individuelle / groupée.

- Chemin (suppression promotion)
  1. Sélection -> `deleteSelectedPromotions()` -> confirmation.
  2. Pour chaque id -> `deletePromotion(id)` (DELETE /api/promotions/:id).
  3. `loadPromotions()` recharge et met à jour compteurs.

---

## 7) Bannières Header 🖼️
- Fonctions principales
  - `initHeaderBanners()` -> `loadHeaderBanners()` (GET /api/header-banners).
  - `displayHeaderBanners()` -> rend `#header-banners-tbody`.
  - `openHeaderBannerModal()`, `fillHeaderBannerForm(banner)`, `saveHeaderBanner()` -> POST/PATCH /api/header-banners (+ upload `/upload/header-banner`).
  - `toggleHeaderBannerStatus(bannerId)` -> PATCH /api/header-banners/:id/toggle-active.
  - `deleteHeaderBanner(bannerId)` -> DELETE /api/header-banners/:id.
  - `incrementHeaderBannerView(id)` / `incrementHeaderBannerClick(id)` -> POST /view, /click endpoints.

- Chemin (création bannière)
  1. `openHeaderBannerModal()` -> remplir -> `saveHeaderBanner()` (upload image éventuel puis POST / PATCH).
  2. `loadHeaderBanners()` recharge la liste et met à jour `updateHeaderBannersStats()`.

---

## 8) Publicités flottantes (Floating Ads) 🪄
- Fonctions principales
  - `loadFloatingAds()` — GET /api/floating-ads (fallback localStorage si erreur).
  - `displayFloatingAds()`, `updateFloatingAdsStats()`.
  - `openFloatingAdModalInternal()`, `closeFloatingAdModalInternal()`, `editFloatingAdInternal(id)`, `saveFloatingAdInternal()` — création / édition (POST /api/floating-ads, PATCH /api/floating-ads/:id).
  - `uploadFloatingAdImage(adId, file)` — POST /upload/floating-ad/:id
  - `toggleFloatingAdStatusInternal(id)`, `deleteFloatingAdInternal(id)`, `removeFloatingAdImageInternal()`.

- Chemin (création publicité)
  1. `openFloatingAdModalInternal()` -> remplir (ciblage pages via `setTargetPages()` / `getSelectedTargetPages()` et redirection via `getRedirectUrl()`).
  2. `saveFloatingAdInternal()` -> POST /api/floating-ads puis `uploadFloatingAdImage(adId,file)` si image.
  3. `loadFloatingAds()` recharge la table et `updateFloatingAdsStats()` met à jour les compteurs.

---

## Retours clients / Feedbacks 🗣️
- Fonctions principales
  - `loadFeedbacks()` — charge GET /api/orders puis filtre les commandes dont `deliveryNotes` contiennent des retours (confirmations / problèmes) et remplit `#feedbacks-list`.
  - `displayFeedbacks(feedbacks)` — rend les cartes de retours, attache les handlers (voir `viewOrderDetails`, `resolveDispute(id)`).
  - `filterFeedbacks()` — filtre par type (`confirmation`, `problem`).
  - `resolveDispute(orderId)` — PATCH /api/orders/:id pour marquer un litige comme résolu puis `loadFeedbacks()`.
  - `markSelectedAsResolved()` / `deleteSelectedFeedbacks()` — actions groupées (itère sur `getSelectedFeedbackIds()` et PATCH /api/orders/:id).

- Sélecteurs / test rapide
  - Section: `#feedbacks-list`, controls: `#feedback-filter`, `#select-all-feedbacks`, `.feedback-select`.
  - Test: Aller dans `Retours clients`, filtrer `problem`, marquer un litige comme résolu -> vérifier via GET /api/orders que `deliveryNotes` et `status` sont mis à jour.

---

## Bannière Boutique (Accueil) 🏷️
- Fonctions principales
  - `loadBannerForAdmin()` — GET /api/annonces -> trouve l'annonce de type `banner` avec `pageCible: 'boutique'` et pré-remplit le formulaire `#banner-section`.
  - `syncBannerColorInputs()` — synchronise `#banner-color` et `#banner-color-text` (saisie hex/rgb/gradient).
  - `saveBanner()` — crée/mettre à jour la bannière via POST/PATCH /api/annonces (envoie dto { type: 'banner', titre, description: JSON, pageCible: 'boutique', images: [{ imageBase64 }] }).
  - Gestion image base64: champ `#banner-image` -> preview en base64 stocké dans `#banner-image-base64`.

- Sélecteurs / test rapide
  - Section: `#banner-section`, champs: `#banner-title`, `#banner-description`, `#banner-icon`, `#banner-image`, `#banner-image-preview`, `#banner-form-result`.
  - Test: Modifier le texte ou l'image et cliquer sauvegarder -> vérifier qu'une annonce type `banner` avec `pageCible: 'boutique'` existe dans GET /api/annonces.

---

## Paramètres & Sécurité ⚙️
- Fonctions principales
  - `setupSettingsAccess()` / `handleSettingsAccess(e)` — intercepte l'accès à la section `settings` et ouvre la modal d'accès si nécessaire.
  - `openAccessModal()` / `closeAccessModal()` — gèrent la modal `#access-modal` et UI (champ `#access-code`, `#access-error`).
  - `validateAccessCode()` — POST /api/auth-codes/validate { code } — si succès, accorde l'accès temporaire (`settingsAccessGranted`, expiry) et appelle `showSection('settings')`.
  - `initSecurityManagement()` — initialisation des contrôles de sécurité (change master code, change superadmin password, actions liées aux modals et endpoints `/security-settings/*`, `/users` et `/auth/login`).

- Sélecteurs / test rapide
  - Menu item: `data-section="settings"`, modal: `#access-modal`, inputs: `#access-code`, boutons: `.action-btn` dans la modal.
  - Test: Cliquer sur `Paramètres` -> entrer code valide (via API `/auth-codes/validate`) -> vérifier que `#settings-section` apparaît et qu'un message de confirmation temporaire est affiché.

## 9) Administration (comptes admin) 🔐
- Fonctions principales
  - `openAddAdminModal()`, `addAdmin()` (génération / validation code d'autorisation via `generate-access-code.js`).
  - `editAdmin()` / `deleteAdmin()` / modals et confirmations.

---

## Diagrammes (Mermaid) — flux clés
### Flux : suppression d'éléments (pattern commun)
```mermaid
flowchart LR
  U[Utilisateur] -->|Clic sélection| UI
  UI -->|confirm()| Confirm
  Confirm -->|DELETE/PATCH per id| API[API]
  API -->|200 OK| DB[Base]
  DB -->|OK| UI
  UI -->|loadX()| API
```

### Flux : création produit (simplifié)
```mermaid
flowchart LR
  U --> FillForm
  FillForm --> saveProduct()
  saveProduct() -->|POST /products| API
  API -->|201 {id}| UI
  UI -->|upload images| API2[/upload/images]
  API2 -->|files| API
  API -->|PATCH product with images| DB
  DB -->|OK| loadProducts()
```

---

## Diagrammes fléchés détaillés (Mermaid) 🔁
Ci-dessous des diagrammes fléchés conçus pour que le backend comprenne rapidement les endpoints et les effets sur la base de données.

### 1) Création produit (flux détaillé)
```mermaid
flowchart TD
  AdminUI[[Admin UI - product modal]] -->|POST form| saveProduct[saveProduct()]
  saveProduct -->|POST /api/products| API[(API /products)]
  API -->|201 {id}| DB[(DB products table)]
  saveProduct -->|if images -> upload| Upload[/POST /api/upload/images]
  Upload -->|returns filenames| API
  API -->|PATCH /api/products/:id images| DB
  DB -->|ok| reload[loadProducts()]
  reload -->|GET /api/products| API
```

### 2) Suppression groupée promotions
```mermaid
flowchart TD
  AdminUI[Admin UI - promotions table] -->|select ids| deleteSelected[deleteSelectedPromotions()]
  deleteSelected -->|confirm()| Confirm
  Confirm -->|for each id: DELETE /api/promotions/:id| API
  API -->|204| DB[(DB promotions table)]
  DB -->|ok| refresh[loadPromotions()]
  refresh -->|GET /api/promotions| API
```

### 3) Bannière Boutique (édition / création)
```mermaid
flowchart TD
  AdminUI[Admin UI - banner form] --> loadBannerForAdmin[loadBannerForAdmin()]
  loadBannerForAdmin -->|GET /api/annonces| API[/api/annonces]
  API -->|find banner (type='banner', pageCible='boutique')| BannerFound{{exists?}}
  BannerFound -- yes --> prefill[Prefill form]
  AdminUI -->|submit| saveBanner[saveBanner()]
  saveBanner -->|POST /api/annonces (if new) or PATCH /api/annonces/:id| API
  API -->|201/200| DB[(annonces table)]
  DB -->|ok| notify[show success message & loadBannerForAdmin()]
```

### 4) Retours clients (diagnostic et résolution)
```mermaid
flowchart TD
  CronOrUI[Admin opens Retours clients] --> loadFeedbacks[loadFeedbacks()]
  loadFeedbacks -->|GET /api/orders| API[/api/orders]
  API -->|returns orders| Filter[filter deliveryNotes contains confirm/problem]
  Filter --> display[displayFeedbacks() -> render #feedbacks-list]
  display -->|resolve button| resolveDispute[resolveDispute(orderId)]
  resolveDispute -->|PATCH /api/orders/:id {status:'delivered', deliveryNotes: '...'}| API
  API -->|200| DB[(orders table updated)]
  DB -->|ok| reload[loadFeedbacks()]
```

---



---

             ====================  DASHBOARD AMIN  ====================

admin ---->ajout produit depuis dashboard admin----> affichage page boutique

admin ----> ajout cathegorie depuis dashboard admin ---->affichage page  boutique

admin ----> ajout promotion depuis dashboard admin ----> affichage page promotion

admin ---->ajout publicite flottant depuis dashboard admin ----> affichage page cible

admin ----> ajout banniere header depuis dashboard admin ----> affichage page boutique 

admin ----> ajout banniere boutique text depuis dashboard admin----> affuchage boutique

admin ----> gestion annonce video et image depuis dashboard admin ----> page cible 

admin ---->gestion des abonnement ---->peut suprimer un abonné

admin----> recoit la commande---->et le traite

admin ----> parametre---->code dacces

changer code d'access parametre ---->seul superAdmin

admin ----> ajout administrateur ---->code d'autorisation ---->nouveau admin

superAdmin ----> peut changer  ou bloquer un administrateur


                 ====================CLIEN ====================

clien---->ajout au panier---->passe la commande---->choisi mode paiement---->rempli information de livraison---->confirme la commande---->commande envoyer au dashboard admin

dasboard admin ---->recoit la commande ---->et le traite


                 ====================PROMOTION ====================

clien---->clic sur j'en profite---->produit ajouter au panier---->finaliser commande---->rediriger vers le panier boutique ---->passer la commande---->mode paiement---->information de livraison---->confirmer la commande


             ====================SUIVI DE COMMANDE  ====================

client---->entre le numero de telephon---->recoit les detail---->en attente ,en livraison,ou livré



              ==================== RETOUR CLIEN ====================

clien---->envoit reclamation ou satisfaction---->vers le dashboard admin---->

dashboard admin recoit la reclamation et la traite



     ====================GESTION DES ANNONCE ET BANNIERE HEADER  ====================

clien---->clic sur l'image ou la video ---->il est redirigé vers la page cible


                 ==================== ABONNEMENT ====================

clien---->clic sur la cloche---->entre emeil et numero phon ---->abonnement envoyer au dashboard ---->pour recevoir des notifition lors de l'ajout de nouveau produit

               



