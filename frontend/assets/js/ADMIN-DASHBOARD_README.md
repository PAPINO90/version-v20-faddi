# admin-dashboard.js — README

## ✅ But du fichier
Ce fichier centralise le code JavaScript côté admin pour le tableau de bord. Il fournit des fonctions utilitaires et des gestionnaires pour :

- Les notifications visuelles (toast-like)
- La gestion des promotions (sélection multi, suppression groupée)
- La gestion des abonnés de la newsletter (chargement, blocage, suppression, actions groupées)
- La gestion des publicités flottantes (CRUD, upload d'image, redirections et ciblage de pages)
- Un système d'auto-refresh pour certaines vues d'administration


## 🔧 Fonctions principales exposées (globales)
- `window.showNotification(message, type)` — affiche une notification visuelle (`type` = `info|success|warning|error`).
- `window.updateSelectedPromotions()` — met à jour le compteur et l'état des boutons pour les promotions sélectionnées.
- `window.toggleAllPromotions(checked)` — coche/décoche toutes les promotions.
- `window.deleteSelectedPromotions()` — supprime les promotions sélectionnées (confirme avec l'utilisateur).
- `loadSubscribers()` — charge la liste des abonnés depuis l'API et remplit le tableau.
- `window.updateSelectedSubscribers()` — met à jour la sélection/compteur/boutons pour les abonnés.
- `window.toggleAllSubscribers(checked)` — coche/décoche tous les abonnés.
- `window.deleteSelectedSubscribers()` — supprime les abonnés sélectionnés (confirme avec l'utilisateur).
- `window.blockSelectedSubscribers()` — désactive (patch) les abonnés sélectionnés.
- `blockSubscriber(id, isActive)` — bascule le statut d'un abonné.
- `deleteSubscriber(id)` — supprime un abonné.
- Fonctions liées aux publicités flottantes : `openFloatingAdModal()`, `closeFloatingAdModal()`, `saveFloatingAd()`, `editFloatingAd(id)`, `deleteFloatingAd(id)`, `uploadFloatingAdImage(file)`, `refreshFloatingAdsStats()` etc. (implémentation partiellement déplacée/éclatée dans le fichier).
- `startAutoRefresh()` / `stopAutoRefresh()` — gestion du rafraîchissement automatique.
- `window.getRedirectUrl()` / `window.setRedirectUrl()` / `window.getSelectedTargetPages()` — utilitaires pour gérer la redirection et le ciblage des publicités.


## 📋 Éléments DOM attendus
Le script s'appuie sur des éléments HTML avec des IDs/classes spécifiques :

- `#subscribers-tbody`, `#subscribers-loading` — tableau et indicateur de chargement abonnés
- `.select-subscriber`, `#select-all-subscribers`, `#delete-selected-subscribers`, `#block-selected-subscribers`, `#selected-subscribers-count`
- `.select-promotion`, `#select-all-promotions`, `#delete-selected-promotions`, `#selected-promotions-count`
- `#floating-ad-image`, `#internal-redirect-select`, `#external-redirect-input`, `input[name="redirect-type"]`
- `#target-all-pages`, `input[name="target-page"]`, `#floating-ad-internal-redirect`, etc.

Veillez à ce que ces éléments existent dans vos pages d'administration (`admin.html`, `gestion-annonces.html`, etc.) pour que le script fonctionne correctement.


## 🌐 Endpoints API (utilisés dans le script)
- `GET http://localhost:3000/api/subscribers` — récupérer la liste des abonnés
- `DELETE http://localhost:3000/api/subscribers/:id` — supprimer un abonné
- `PATCH  http://localhost:3000/api/subscribers/:id` — modifier le statut d'un abonné

Le script appelle aussi des endpoints pour les promotions et publicités flottantes (CRUD), généralement sur la même API locale (`localhost:3000/api/...`). Vérifiez l'API back-end pour les routes exactes.


