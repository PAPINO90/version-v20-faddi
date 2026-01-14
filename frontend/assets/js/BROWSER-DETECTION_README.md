# browser-detection-fadidi.js — README

## ✅ But du fichier
Le script **browser-detection-fadidi.js** détecte le navigateur et le support CSS côté client afin de charger des styles optimisés et d'appliquer des correctifs JavaScript spécifiques, principalement pour corriger des problèmes connus avec **Samsung Internet** et améliorer l'affichage mobile.


## 🔍 Fonctionnalités principales
- Détection du navigateur via `navigator.userAgent` (Samsung Internet, Chrome Android, Safari iOS, Firefox Mobile, Desktop/Autre).
- Extraction approximative de la version pour Samsung/Chrome/Safari/Firefox.
- Tests de support CSS via `CSS.supports()` (grid, flexbox, object-fit, fit-content, -webkit-line-clamp).
- Chargement conditionnel de fichers CSS :
  - `assets/css/promotion-mobile-optimized.css` (CSS mobile de base)
  - `assets/css/samsung-internet-fix.css` (correctifs spécifiques Samsung)
- Application de correctifs JavaScript ciblés pour Samsung Internet (ex. fallback pour fit-content et line-clamp).
- Injection d'un CSS d'urgence si le CSS mobile attendu n'a pas été chargé.
- Enregistrement des informations de détection/support dans `localStorage` sous la clé `fadidi-browser-info` pour debug.
- Exposition de `window.fadidiBrowserInfo` (contient `browser`, `cssSupport` et `redetect()` pour ré-exécuter l'initialisation).
- Réexécution partielle des correctifs au resize de la fenêtre (avec debounce).


## ⚙️ Éléments DOM / classes ciblées
Le script applique des modifications ou lit des éléments DOM spécifiques :
- `.category-btn` — fix de largeur pour problèmes fit-content
- `.promo-title` — fallback JavaScript pour line-clamp
- `.promo-list`, `.promo-card` — styles d'urgence (injection CSS)

Assurez-vous que ces sélecteurs correspondent aux composants HTML des pages promotionnelles/admin.


## 🧭 Utilisation & débogage
- Le script s'initialise automatiquement au chargement du DOM.
- Pour redétecter manuellement (utile en dev) :

```js
// Re-exécuter l'initialisation
window.fadidiBrowserInfo && window.fadidiBrowserInfo.redetect();

// Consulter les infos de détection
console.log(localStorage.getItem('fadidi-browser-info'));
console.log(window.fadidiBrowserInfo);
```


## ✨ Notes de déploiement
- Vérifier que `assets/css/promotion-mobile-optimized.css` et `assets/css/samsung-internet-fix.css` sont bien inclus dans le bundle de production.
- Ne pas compter uniquement sur UA sniffing pour la logique critique ; considérez des en-têtes côté serveur si besoin d'un rendu différencié.


---

Fichier : `frontend/assets/js/browser-detection-fadidi.js`

