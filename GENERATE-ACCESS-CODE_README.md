## Générateur de codes d'accès — `generate-access-code.js` 🔐

**But / Purpose**
- Script CLI minimal pour générer un **code d'accès administrateur** via l'API NestJS (endpoint `/auth-codes`).

**Usage**
- Exécuter depuis la racine du projet :
  - node generate-access-code.js "Label du code" 24
- Arguments :
  - label (optionnel) : texte descriptif du code (par défaut: "Code d'accès admin").
  - durée en heures (optionnel) : validité du code en heures (par défaut: 24).

**Comportement**
- Fait une requête POST vers `http://localhost:3000/api/auth-codes` avec `{ label, expiresAt }`.
- Affiche dans la console le code généré, son label et sa date d'expiration.
- En cas d'échec de connexion, affiche un message d'aide indiquant de démarrer l'API (ex.: `npm start` dans `api-nestjs/`).

**Endpoint utilisé**
- POST `/api/auth-codes` — doit renvoyer un JSON contenant au minimum `{ code, label, expiresAt }`.

**Limitations & recommandations**
- `API_BASE_URL` est codée en dur (`http://localhost:3000/api`). Recommander :
  - 1) rendre l'URL configurable via une variable d'environnement (ex. `API_BASE_URL`) ;
  - 2) ajouter un flag `--verbose` ou `--json` pour faciliter l'intégration dans des scripts CI/CD ;
  - 3) gérer de façon plus explicite les codes de sortie (0 succès / >0 erreur) pour utilisation dans des pipelines ;
  - 4) ajouter des validations côté serveur (auth + permissions) pour empêcher la génération non autorisée de codes d'accès ;
  - 5) utiliser la `fetch` native (Node 18+) ou documenter la dépendance `node-fetch` pour compatibilité.

**Exemple rapide**
```
# Génère un code valable 48 heures avec label "Accès support"
node generate-access-code.js "Accès support" 48
```

**Emplacement**
- `generate-access-code.js` (racine du dépôt)

Si vous voulez, je peux :
- rendre `API_BASE_URL` configurable via `process.env`, ajouter une option `--json`, et améliorer la gestion des erreurs (voulez-vous que je le fasse ?) ✅
