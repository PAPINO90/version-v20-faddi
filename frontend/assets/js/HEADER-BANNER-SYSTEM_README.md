## Header Banner System — `header-banner-system.js` 🔧

**But / Purpose**
- Gère l'affichage dynamique des bannières d'en-tête (header) sur la page.
- Vérifie s'il existe des bannières actives, charge leur contenu, injecte des styles responsives, remplace le `header` et fait la rotation automatique des bannières.

**Principales responsabilités**
- Détecter la présence de bannières actives (/api/header-banners/has-active).
- Récupérer la liste des bannières actives (/api/header-banners/active).
- Construire le HTML des bannières (mode produit ou full image) et l'injecter dans le `header`.
- Gérer la rotation automatique, les indicateurs, et l'incrémentation des vues/clics.

**Points d'entrée / API**
- GET  /api/header-banners/has-active — vérifier si des bannières sont disponibles.
- GET  /api/header-banners/active — récupérer la liste des bannières.
- POST /api/header-banners/:id/view — incrémenter le compteur de vues.
- POST /api/header-banners/:id/click — incrémenter le compteur de clics.

> Note: Le code utilise `window.API_BASE_URL` si disponible, sinon `http://localhost:3000`.

**Fonctions publiques / globales**
- `window.headerBannerSystem` — instance de `HeaderBannerSystem` exposée si `API_BASE_URL` est défini.
- `window.reloadHeaderBanners()` — recharge les bannières (restore + init).
- `window.stopHeaderBanners()` — restaure l'en-tête original et arrête la rotation.

**Sélecteurs & classes injectés**
- Cible principale: élément `<header>` (l'en-tête de la page).
- Conteneur créé: `.header-banner-container` (et slides `.header-banner-slide`).
- Classes/éléments utilisés: `.banner-wrapper`, `.banner-product-image`, `.banner-content`, `.banner-indicators`, `.banner-indicator`, `.banner-image-full`.

**Format attendu d'une bannière (exemple)**
```
{
  id: "uuid",
  title: "Titre",
  description: "Texte contenant parfois un prix",
  imageUrl: "/uploads/banners/foo.png",
  linkUrl: "https://...",
  displayDuration: 5000,
  customStyles: "background: #fff;",
  imagePosition: "left|center|right"
}
```

**Limitations & problèmes observés**
- Utilise `innerHTML` avec du contenu provenant du backend → risque d'injection si le backend n'est pas fiable.
- Les fetchs n'utilisent pas d'AbortController / timeout → risque de requêtes pendantes.
- `onerror` est injecté en HTML pour les images (attribut inline) — praticité mais mauvaise pratique.
- Le traitement d'image (canvas) pour détecter la transparence peut coûter en performance sur appareils faibles.
- Accessibilité (a11y) et comportement clavier non gérés (pas d'aria roles, pas de focus management).

**Recommandations & améliorations**
- Centraliser la base API (utiliser `API_CONFIG` ou un module ES) et éviter d'avoir des hard-coded fallbacks.
- Remplacer `innerHTML` par création d'éléments DOM et échappement/validation des champs.
- Ajouter AbortController + timeout pour les requêtes fetch.
- Retirer les handlers inline (`onerror`), et utiliser des listeners JS + `loading="lazy"` pour images quand pertinent.
- Ajouter attributs ARIA et contrôles clavier pour améliorer l'accessibilité.
- Ajouter une stratégie de cache (localStorage / session) si nécessaire pour limiter les appels réseau.
- Ajouter des tests unitaires pour les méthodes critiques (par ex. `isProductBanner`, `extractPrice`).
- Considérer le découpage en module ES (exporter la classe) pour faciliter le test et la réutilisation.

**Conseils d'utilisation rapide**
- Pour forcer une recharge depuis la console: `window.reloadHeaderBanners()` ✅
- Pour arrêter et restaurer l'en-tête original: `window.stopHeaderBanners()` ⚠️

**Emplacement du fichier**
- `frontend/assets/js/header-banner-system.js`

