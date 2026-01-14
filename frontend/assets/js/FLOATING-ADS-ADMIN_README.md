# floating-ads-admin.js — README

## ✅ But du fichier
`floating-ads-admin.js` est le script d'administration pour gérer les **publicités flottantes** depuis le dashboard admin. Il permet de :

- Lister, créer, modifier et supprimer des publicités flottantes.
- Gérer l'upload d'image pour une publicité.
- Activer/désactiver une publicité et consulter ses statistiques (vues / clics).
- Fournir une interface de création via modal avec validations et aperçu d'image.


## 🔧 Fonctions exposées (globales)
Ces helpers sont exposés sur `window` pour être appelés depuis les boutons `onclick` du HTML :

- `refreshFloatingAdsStats()` — recharge la liste et les stats.
- `openFloatingAdModal()` / `closeFloatingAdModal()` — ouvrir/fermer le modal de création/édition.
- `saveFloatingAd()` — sauvegarder la publicité (création ou modification).
- `editFloatingAd(id)` — ouvrir le modal en mode édition pour l'ID fourni.
- `toggleFloatingAdStatus(id)` — activer/désactiver une publicité.
- `deleteFloatingAd(id)` — supprimer une publicité (confirmation utilisateur).
- `removeFloatingAdImage()` — supprimer l'aperçu d'image dans le modal.
- `updateDisplayModeFields()` — adapter le formulaire selon le mode d'affichage sélectionné.


## 📋 Éléments DOM attendus
Le script attend les éléments suivants (IDs et classes) dans le HTML admin :

- `#floating-ads-section` — conteneur de la section admin (chargement conditionnel).
- `#floating-ads-loading` — indicateur de chargement.
- `#floating-ads-table`, `#floating-ads-tbody` — tableau et corps utilisé pour lister les publicités.
- Modal & formulaire de publicité :
  - `#floating-ad-modal`, `#floating-ad-form`, `#floating-ad-modal-title`
  - Champs : `#floating-ad-id`, `#floating-ad-title`, `#floating-ad-content`, `#floating-ad-display-mode`, `#floating-ad-position`, `#floating-ad-fixed`, `#floating-ad-width`, `#floating-ad-height`, `#floating-ad-duration`, `#floating-ad-bg-color`, `#floating-ad-bg-color-select`, `#floating-ad-text-color`, `#floating-ad-target-pages`, `#floating-ad-start-date`, `#floating-ad-end-date`, `#floating-ad-image`, `#floating-ad-image-preview`, `#floating-ad-active`.
- Statistiques : `#stat-floating-ads-total`, `#stat-floating-ads-active`, `#stat-floating-ads-views`, `#stat-floating-ads-clicks`.

Assurez-vous que ces IDs existent et correspondent au markup du dashboard admin.


## 🌐 Endpoints API utilisés
Le script communique avec l'API (variable `API_BASE_URL`) via :

- `GET ${'API_BASE_URL'}/floating-ads` — récupérer la liste des publicités.
- `GET ${'API_BASE_URL'}/floating-ads/:id` — obtenir une publicité pour édition.
- `POST ${'API_BASE_URL'}/floating-ads` — créer une publicité.
- `PATCH ${'API_BASE_URL'}/floating-ads/:id` — modifier une publicité (statut, contenu, etc.).
- `DELETE ${'API_BASE_URL'}/floating-ads/:id` — supprimer une publicité.
- `POST ${'API_BASE_URL'}/upload/floating-ad/:id` — upload d'image pour une publicité.
- `GET ${'API_BASE_URL'}/floating-ads/statistics` — récupérer statistiques globales.

Le script prévoit un fallback en cas d'indisponibilité de l'API (lecture depuis `localStorage`).


## ⚙️ Comportements notables & validations
- Le formulaire refuse la sauvegarde si aucune page cible n'est sélectionnée (champ `targetPages` requis).
- Les positions et types d'ancrage sont normalisés avant envoi (ex: suppression de `-fixed` pour l'API).
- L'aperçu d'image est affiché via `FileReader` avant upload ; l'upload se fait après création/modification via `uploadFloatingAdImage(adId, file)`.
- Les statistiques sont rafraîchies via endpoint dédié, sinon calculées localement à partir de `floatingAds`.


## ⚠️ Limitations & points d'amélioration
- **API_BASE_URL** est parfois défini localement dans le fichier ; il est préférable d'utiliser une config centrale (`API_CONFIG` / `.env`).
- `fetch` n'utilise pas `AbortController` ni gestion fine des timeouts/retries ; prévoir une meilleure gestion réseau.
- Les actions utilisent beaucoup d'`onclick` inline et manipulations directes du DOM — envisager la migration vers gestionnaires centralisés (`addEventListener`) pour testabilité et accessibilité.
- Les validations côté client sont basiques ; ajouter des vérifications supplémentaires avant l'envoi (par ex. formats de date/URL, taille/type d'image).
- Meilleure UX pour uploads : indiquer progression, erreurs d'upload et empêcher double envoi.
- Ajouter tests (unitaires & E2E) pour flots CRUD et upload.


## ✅ Exemples d'utilisation (console)
- Rafraîchir la liste et les stats :
```js
window.refreshFloatingAdsStats();
```
- Ouvrir le modal d'ajout :
```js
window.openFloatingAdModal();
```
- Éditer la publicité id=5 :
```js
window.editFloatingAd(5);
```
- Activer/désactiver id=5 :
```js
window.toggleFloatingAdStatus(5);
```
- Supprimer id=5 :
```js
window.deleteFloatingAd(5);
```


---

Fichier : `frontend/assets/js/floating-ads-admin.js` 