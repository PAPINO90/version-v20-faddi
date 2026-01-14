## Serveur de développement frontend — `frontend/server.js` & `frontend/admin-dashboard/server.js` 🚦

**But / Purpose**
- Fournir de petits serveurs HTTP pour servir le frontend en développement :
  - `frontend/server.js` — Express static server (port 3001) servant `boutique.html` et le reste du dossier `frontend`.
  - `frontend/admin-dashboard/server.js` — simple static file server (port 8081) pour l'interface d'administration (`admin.html`) sans dépendance Express.

**Comportement / Routes**
- `frontend/server.js` :
  - CORS configuré pour `http://localhost:3000` et `127.0.0.1:3000`.
  - Sert l'ensemble du dossier `frontend` via `express.static()`.
  - Route `/` redirige/sert `boutique.html`.
- `frontend/admin-dashboard/server.js` :
  - Serveur `http` natif Node, déduit le `Content-Type` par extension.
  - Protège contre les accès hors dossier (contrôle du `filePath`).
  - Ajoute des en-têtes CORS permissifs (`Access-Control-Allow-Origin: *`).
  - Gère proprement `SIGINT` pour un arrêt gracieux.

**Ports**
- Frontend Boutique: `http://localhost:3001` (par `frontend/server.js`).
- Dashboard Admin: `http://localhost:8081` (par `frontend/admin-dashboard/server.js`).

**Limitations & recommandations**
- Ces serveurs sont conçus **uniquement pour le développement**. Ne pas utiliser en production.
- `frontend/server.js` utilise des origines CORS restreintes mais pourrait être configuré via variables d'environnement (recommandé).
- `admin-dashboard/server.js` utilise `Access-Control-Allow-Origin: *` — accepter en dev uniquement; préférer origines restreintes.
- Ajouter logs plus détaillés (req URL, status code) et gestion d'options pré-vol (`OPTIONS`) si besoin pour tester intégrations API.

**Démarrage**
- Depuis `frontend/` : `node server.js` → ouvre http://localhost:3001
- Depuis `frontend/admin-dashboard/` : `node server.js` → ouvre http://localhost:8081

**Améliorations proposées**
- Centraliser configuration (ports, CORS origins) via variables d'environnement (`PORT`, `ALLOWED_ORIGINS`).
- Remplacer le serveur HTTP natif par une solution Express/Serve statique cohérente pour homogénéité.
- Ajouter middleware de logging (morgan) et gestion des erreurs plus riche pour debug.
- Ajouter option `--static-only` / `--spa` pour support SPA (fallback to index.html).

Fichier(s) : `frontend/server.js`, `frontend/admin-dashboard/server.js`

