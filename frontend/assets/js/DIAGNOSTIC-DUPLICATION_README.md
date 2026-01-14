# diagnostic-duplication.js — README

## ✅ But du fichier
`diagnostic-duplication.js` est un utilitaire de diagnostic et de correction pour détecter des problèmes de duplication d'éléments produits/sections dans l'interface de la boutique FADIDI. Il aide à repérer :

- Sections dupliquées dans le DOM (ex. plusieurs `#fadidi-products-list`).
- Produits affichés en double dans une même section (même `data-product-id`).
- État des variables/gestionnaires responsables de l'affichage (`window.fadidiProductManager`).

Le script propose aussi une correction automatique (rechargement des produits) via `autoFixDuplication()`.


## 🔧 Fonctions exposées
- `diagnoseFADIDI()`
  - Réalise plusieurs vérifications et affiche un diagnostic détaillé dans la console (sections, doublons, état des managers, recommandations).
  - Retourne un objet résumé :
    - `fadidiLists` — nombre de conteneurs `#fadidi-products-list` trouvés.
    - `fadidiDuplicates` — tableau d'IDs de produits dupliqués détectés.
  - Exemple d'usage :
    ```js
    const report = diagnoseFADIDI();
    console.log(report);
    ```

- `autoFixDuplication()`
  - Tente une correction automatique en appelant les fonctions existantes `forceReloadVendorProducts()` et `forceReloadProducts()` (si elles sont définies), puis relance le diagnostic après 1s.
  - **Note** : cette fonction ne supprime pas directement d'éléments ; elle force plutôt un rechargement pour laisser la logique existante résoudre les duplications.
  - Exemple d'usage :
    ```js
    autoFixDuplication();
    ```

- Global : Les deux fonctions sont exposées sur `window` (`window.diagnoseFADIDI`, `window.autoFixDuplication`) pour un accès facile depuis la console.


## 🧭 Ce que le script inspecte
- DOM
  - `#fadidi-products-list` (containeur officiel des produits FADIDI)
  - `.fadidi-product-card` (cartes produit attendues, lecture du `data-product-id`)

- Objets globaux
  - `window.fadidiProductManager` (si présent : utilisation de ses méthodes/structures pour vérifier l'état)


## ⚠️ Comportement automatique
- Le script exécute `diagnoseFADIDI()` automatiquement ~3 secondes après le chargement (via `setTimeout`), afin de laisser le rendu initial s'effectuer.
- Les rapports et recommandations sont affichés dans la console (pas de modifications destructives automatiques).


## 💡 Recommandations & bonnes pratiques
- Si des sections `#fadidi-products-list` sont dupliquées, nettoyez le HTML (templates ou server rendering) pour éviter plusieurs conteneurs identiques.
- Si des produits apparaissent en double :
  - Vérifiez la source (API / localStorage / insertion DOM double) et assurez-vous que la logique d'affichage est idempotente.
  - Utilisez `forceReloadProducts()` pour recharger proprement l'affichage (si disponible).
- Assurez-vous que `fadidiProductManager` (ou l'équivalent) possède des méthodes idempotentes pour éviter des insertions répétées à chaque rechargement.
- Ajoutez des tests (unitaires / E2E) qui vérifient l'absence de duplications après chargement et après mises à jour (ex. via `storage` event).



---

Fichier : `frontend/assets/js/diagnostic-duplication.js` — utilisez `diagnoseFADIDI()` pour un rapport manuel et `autoFixDuplication()` pour tenter un rechargement automatique suivi d'une vérification.
