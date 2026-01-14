## Header Banners Admin — `header-banners-admin.js` 🔧

**But / Purpose**
- Fournir l'interface d'administration pour gérer les **bannières d'en-tête** (CRUD, activation, upload d'images, aperçu, statistiques).

**Responsabilités principales**
- Charger et afficher la liste des bannières (`GET /header-banners`).
- Créer / modifier une bannière (upload d'image facultatif, `POST /header-banners` / `PATCH /header-banners/:id`).
- Supprimer une bannière (`DELETE /header-banners/:id`).
- Activer/désactiver une bannière (`PATCH /header-banners/:id/toggle-active`).
- Récupérer et afficher les statistiques (`GET /header-banners/statistics/all`).
- Gestion de l'aperçu d'image (miniature et modal plein écran).
- Incrémentation côté admin des vues/clics (POST `/header-banners/:id/view` et `/click`).

**Endpoints (utilisés par le script)**
- GET  `/api/header-banners` (liste)
- GET  `/api/header-banners/statistics/all` (stats)
- POST `/api/upload/header-banner` (upload d'image)
- POST `/api/header-banners` (création)
- PATCH `/api/header-banners/:id` (mise à jour)
- PATCH `/api/header-banners/:id/toggle-active` (basculer actif/inactif)
- DELETE `/api/header-banners/:id` (suppression)
- POST `/api/header-banners/:id/view` (incrémenter vue)
- POST `/api/header-banners/:id/click` (incrémenter clic)

> Le script utilise `window.API_CONFIG.BASE_URL` si présent, sinon `http://localhost:3000/api`.

**Fonctions publiques / points d'entrée**
- `initHeaderBanners()` — initialisation (appelée depuis le chargement de la page/admin).
- `loadHeaderBanners()` — charge les bannières depuis l'API.
- `displayHeaderBanners()` — rend la table HTML (`#header-banners-tbody`).
- `openHeaderBannerModal(bannerId)` / `closeHeaderBannerModal()` — ouvrir/fermer la modale ajout/édition.
- `saveHeaderBanner()` — valider et envoyer la création ou la MAJ (upload géré si fichier sélectionné).
- `editHeaderBanner(id)`, `toggleHeaderBannerStatus(id)`, `deleteHeaderBanner(id)` — actions sur chaque bannière.
- `updateHeaderBannersStats()` / `updateHeaderBannersStatsLocal()` — mettre à jour les compteurs à l'écran.
- `incrementHeaderBannerView(id)` / `incrementHeaderBannerClick(id)` — endpoints de tracking.
- `showImagePreview(imageUrl, title)` — modal d'aperçu d'image.

**Sélecteurs / IDs DOM attendus**
- Table: `#header-banners-tbody` (pour afficher la liste)
- Modale: `#header-banner-modal` et `#header-banner-modal-title`
- Formulaire: `#header-banner-form`, champs: `#header-banner-id`, `#header-banner-title`, `#header-banner-description`, `#header-banner-link`, `#header-banner-order`, `#header-banner-duration`, `#header-banner-styles`, `#header-banner-position`, `#header-banner-active`, `#header-banner-image`, `#header-banner-image-preview`.
- Stats: `#stat-header-banners-total`, `#stat-header-banners-active`, `#stat-header-banners-views`, `#stat-header-banners-clicks`.
- Modal d'aperçu dynamique: `#image-preview-modal` (créé dynamiquement si nécessaire).

**Format attendu d'une bannière (extrait)**
```
{
  id, title, description, imageUrl, linkUrl,
  displayOrder, displayDuration, customStyles, imagePosition, isActive,
  viewCount, clickCount
}
```

**Limitations & risques**
- Le script utilise `innerHTML` avec des valeurs renvoyées par l'API (risque d'injection si le backend n'échappe pas). ⚠️
- Upload et fetchs sans `AbortController` / timeout — requêtes bloquantes possibles. ⏳
- Handlers inline (`onclick`, attribut `onerror`) présents dans le HTML injecté — mauvaise pratique et difficile à tester. 🧩
- Pas d'authentification incluse (la fonction `getAuthHeaders()` est prête mais vide) — les calls sont actuellement non protégés si l'API nécessite auth. 🔒
- Validation des fichiers uploadés (type / taille) minimale côté client. 🗂️

**Recommandations d'amélioration**
- Remplacer `innerHTML` par création DOM sécurisée (textContent, createElement) pour prévenir les injections.
- Ajouter `AbortController` / timeout pour tous les fetchs et gérer les erreurs réseau proprement.
- Implémenter vérification côté client sur le fichier uploadé (type MIME, taille max) et feedback utilisateur.
- Supprimer handlers inline et utiliser event listeners pour améliorer testabilité et accessibilité.
- Remplir `getAuthHeaders()` pour envoyer un token d'auth si nécessaire (ex.: Authorization: Bearer ...).
- Améliorer l'accessibilité (aria-labels, focus management dans la modale, navigation clavier).
- Ajouter des tests unitaires pour la logique de parsing/format des bannières, et des tests d'intégration pour les flux upload/CRUD.

**Utilisation rapide / Debug**
- Forcer un rechargement depuis la console: `refreshHeaderBanners()` ou `loadHeaderBanners()`
- Ouvrir la modale d'ajout: `openHeaderBannerModal()`
- Voir preview image: `showImagePreview(url, title)`

**Souhaitez-vous que j'implémente une amélioration maintenant ?**
- Propositions fréquentes :
  1. Ajouter `AbortController` + timeout aux fetchs. 🔧
  2. Sécuriser le rendu DOM (retirer `innerHTML`). 🛡️
  3. Ajouter validation upload (taille/type) et feedback. 📁
  4. Ajouter auth header usage (utiliser `getAuthHeaders`). 🔐

Indiquez la ou les actions à prioriser et je peux ouvrir une PR avec les changements. ✅

Fichier : `frontend/assets/js/header-banners-admin.js`