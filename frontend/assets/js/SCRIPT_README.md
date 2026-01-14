## `script.js` — Comportement global du front (carousel, chatbot, UI helpers) ⚙️

**But / Purpose**
- Fournir un ensemble de comportements UI génériques pour la page d'accueil : carousels, système d'avis (notes et commentaires), gestion du formulaire d'abonnement, contrôles vidéo, animations d'entête, menu mobile, et un assistant chatbot simple.

**Responsabilités principales**
- Carousel simple (navigation prev/next, autoplay).  
- Carousel 3D (rotation automatique des éléments `.carousel-3d-item`).
- Système d'avis : sélection d'étoiles, validation basique et affichage des commentaires.  
- Contrôle vidéo (clic pour play/pause).  
- Redirections rapides vers la boutique (`redirectToBoutique`).  
- Modal / formulaire d'abonnement (ouverture, fermeture, validation minimale).  
- Animation aléatoire pour éléments `.letter`.  
- Menu mobile toggle (`#menu-toggle` / `#mobile-menu`).  
- Assistant chatbot basique (FAQ local, similarité Levenshtein, affichage des messages).  
- Sécurité front : désactivation du clic droit et de certains raccourcis clavier (Ctrl+U, Ctrl+C, Ctrl+S).
- Widget dynamique : création d'un carrousel d'index (`createIndexCarousel`) à partir d'items stockés en `localStorage`.

**Sélecteurs & éléments DOM utilisés**
- Carousels: `.carousel-images`, `#prev`, `#next`, `.carousel-3d-item`.
- Avis: `.star`, `#feedback`, `#submitRating`, `#commentsList`.
- Vidéo: élément `<video>` (sélecteur `video`).
- Abonnement: `#subscribe-button`, `#subscribe-form-container`, `#close-subscribe-form`, `#subscribe-form`, `#subscribe-email`, `#subscribe-phone`.
- Animations: `.letter`.
- Menu mobile: `#menu-toggle`, `#mobile-menu`.
- Chatbot: `#chatbot-container`, `#chatbot-toggle`, `#chatbot-close`, `#chatbot-messages`, `#chatbot-input`, `#chatbot-send`.
- Widget carousel index: section id (ex: `carousel-section-1`) et structure `.custom-carousel-track` / `.custom-carousel-viewport`.

**Fonctions / éléments exposés**
- `redirectToBoutique()` (déjà défini plusieurs fois dans le fichier — duplication à corriger).
- `createIndexCarousel(sectionId, products)` — construit un carrousel d'index animé.
- `closeWelcomeScreen()` — masque l'écran d'accueil.

**Limitations, risques & problèmes observés**
- Duplication de fonctions (p.ex. `redirectToBoutique` définie plusieurs fois) → maintenance difficile.  
- Usage de `innerHTML` pour afficher du contenu (chatbot `addMessage` et rendu de commentaires) — risque XSS si du contenu utilisateur n'est pas correctement filtré / échappé.  
- Les commentaires sont autorisés via une simple liste de mots interdits : ce filtrage est facile à contourner et ne suffit pas pour la modération.  
- UX basique : nombreuses utilisations de `alert()` pour erreurs/retours utilisateur — expérience utilisateur pauvre et difficile à styliser/tester.  
- Désactivation du clic droit et de raccourcis clavier peut gêner les utilisateurs et n'empêche pas l'accès au code (mauvaise UX).  
- `setInterval` utilisé sans référence claire de nettoyage (potentiel de multiples timers si le script est réinitialisé).  
- Templates HTML créés avec attributs `onclick` dans `createIndexCarousel` — mélange de markup et de logique JS (moins testable).  
- Pas de gestion d'accessibilité (a11y) pour carousels, chatbot ou contrôles (no ARIA, focus management, keyboard nav).  
- La fonction de similarité (Levenshtein) est utile mais non testée / sans seuils configurables ; risque de faux positifs/negatifs.

**Recommandations & améliorations**
- Retirer duplications (consolider `redirectToBoutique`).  
- Éviter `innerHTML` pour tout contenu provenant d'utilisateurs ; utiliser `textContent` ou une fonction d'échappement HTML.  
- Remplacer `alert()` par un système de toasts/modals centralisé pour feedback UX cohérent.  
- Rendre le filtrage des commentaires robuste (modération asynchrone, regex plus fine, API de modération si nécessaire).  
- Ne pas bloquer les interactions UX natives (clic droit / raccourcis) sans justification — proposer alternatives (notice explicative).  
- Ajouter ARIA + gestion clavier pour carousels et chatbot (améliorer l'accessibilité).  
- Nettoyer timers (clearInterval) quand nécessaire ou remplacer autoplay par requestAnimationFrame/backed loop contrôlé.  
- Tester et paramétrer la fonction de similarité, extraire en utilitaire testable.  
- Eviter inline handlers dans `createIndexCarousel` (utiliser event delegation & attachEventListeners après insertion DOM).  

**Comment déboguer / points d'entrée**
- Le script s'initialise via `DOMContentLoaded` en plusieurs blocs — vérifier la présence des éléments DOM attendus avant d'appeler les fonctions.  
- Pour tester le chat: utilisez `#chatbot-input` + `#chatbot-send`.  
- Pour tester carousels: vérifiez `.carousel-images` et `.carousel-3d-item` en console (index, currentIndex).

**Emplacement**
- `frontend/assets/js/script.js`

