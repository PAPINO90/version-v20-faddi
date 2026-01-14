# floating-ads-display.js — README

## ✅ But du fichier
Le script `floating-ads-display.js` s'occupe de charger et d'afficher les **publicités flottantes** côté site public (front). Il récupère les publicités actives depuis l'API et les affiche selon différents modes (toast, popup, banner) en respectant :

- la position (top-left, bottom-right, center, ...),
- le type d'affichage (toast, popup, banner),
- la durée d'affichage, couleurs et image, et
- la redirection (interne/externe) au clic.


## 🔧 Comportement et responsabilités
- Récupération des publicités actives pour la page courante via :
  - `GET http://localhost:3000/api/floating-ads/active?page=<page>`
  - Le script construit la `page` depuis `window.location.pathname`.
- Affichage par type :
  - `toast` : petit encart flottant qui peut se fermer automatiquement,
  - `popup` : overlay centré ou positionné selon `ad.position`,
  - `banner` : bannière flottante (ex : en bas/haut).
- Protection contre les duplications : le script garde un Set `displayedAds` pour ne pas réafficher une même pub.
- Comptage d'interactions :
  - en affichage on appelle `POST /:id/view` pour incrémenter la vue,
  - au clic on appelle `POST /:id/click` puis redirige (nouvel onglet si URL externe).
- Gestion des images :
  - n'affiche pas d'image si `imageUrl` est vide ou égale à l'image par défaut,
  - reconstruit les chemins relatifs `/uploads/...` vers `http://localhost:3000/uploads/...` si besoin.
- Injection dynamique des styles CSS spécifiques aux publicités (via `injectFloatingAdsStyles`).
- Protection contre interférence : `protectFloatingAdsImages()` utilise un `MutationObserver` pour restaurer l'image originale si un autre script la remplace par l'image par défaut.


## 📋 Propriétés d'une publicité attendues
Le script suppose que l'objet `ad` contient au minimum :
- `id`, `title`, `content`, `imageUrl` (optionnel),
- `displayMode` (`toast` | `popup` | `banner`),
- `position` (`top-left`, `center`, ...),
- `width`, `height`, `displayDuration` (ms),
- `backgroundColor`, `textColor`,
- `redirectUrl` (optionnel),
- `isActive`, `startDate`, `endDate`, `targetPages`,
- éventuellement `anchorType` ou `fixed` (gestion d'`absolute` vs `fixed`).


## ⚠️ Comportement réseau et fallback
- En cas d'erreur API, le script ne charge pas de fallback automatique depuis `localStorage` (par design pour éviter d'afficher des images par défaut potentiellement indésirables).
- Les requêtes d'incrémentation des vues/clics sont fire-and-forget : les erreurs sont loguées mais n'empêchent pas l'affichage.


## ♿ Accessibilité & UX
- Les popups sont ajoutés sans gestion de focus ou d'`aria` (amélioration nécessaire pour l'accessibilité).
- Les publicités peuvent être intrusives : prévoir un contrôle de fréquence ou un consentement (cookie consent) pour les afficher.


## ⚠️ Limites / risques identifiés
- `apiUrl` est codé en dur (`http://localhost:3000/api/floating-ads`) — à centraliser.
- `innerHTML` est utilisé pour insérer `title` et `content` — risque d'injection si les données ne sont pas sanitizées côté API.
- Pas d'`AbortController`/timeout sur les fetchs (risque de requêtes bloquantes en réseau lent).
- Pas de gestion du consentement / rate-limiting pour l'affichage des pubs (peut nuire à l'UX).
- Le style et le markup sont injectés dynamiquement ; assurez-vous qu'ils n'entrent pas en conflit avec le thème du site.


## 💡 Recommandations d'amélioration
- Centraliser et réutiliser la config API via `window.API_CONFIG` ou une constante partagée.
- Ajouter `AbortController` et timeout/retry pour les fetchs.
- Sanitize `ad.title` et `ad.content` avant insertion (ou s'assurer que l'API renvoie du contenu sûr).
- Respecter le consentement utilisateur (opt-in) et limiter la fréquence d'affichage par session/localStorage.
- Gérer l'accessibilité : focus trap pour les popups, `role="dialog"`, `aria-label`, et possibilité de fermer au clavier (Escape).
- Ajouter tests (unitaires et E2E) pour vérifier affichage, positionnement, et comptage vues/clics.


## ✅ Initialisation
Le script s'initialise automatiquement au chargement du DOM :
```js
// intégré automatiquement
new FloatingAdsDisplay();
```


---

Fichier : `frontend/assets/js/floating-ads-display.js` 