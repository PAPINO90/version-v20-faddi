# README — Gestion des annonces (FADIDI)

## 🎯 Objectif
Ce document explique le flux complet pour la **gestion des annonces** : de la création/édition dans l'admin jusqu'à l'affichage dans la vitrine (`index.html` / `boutique.html`). Il inclut le schéma de données, les endpoints API utilisés, le code frontal responsable de l'affichage et un schéma ASCII décrivant le flux.

---

## 📁 Fichiers principaux
- Frontend
  - `frontend/gestion-annonces.html` — interface d'administration pour créer, modifier, supprimer et activer/désactiver des annonces.
  - `frontend/index.html` — affichage du slider/vitrine des annonces sur la page d'accueil (filtre `pageCible === 'index'`).
  - `frontend/boutique.html` — affichage d'annonces ciblées pour la boutique (`pageCible === 'boutique'` ou autres).

- Backend (API NestJS)
  - `api-nestjs/src/annonces/annonce.entity.ts` — entité `Annonce` (schéma principal).
  - `api-nestjs/src/annonces/annonce-image.entity.ts` — entité pour les images/vidéos liées à une annonce.
  - `api-nestjs/src/annonces/annonces.controller.ts` & `annonces.service.ts` — endpoints et logique métier.

---

## 🧾 Schéma de données (table `annonces`)
Champs principaux (voir `Annonce` entity):
- `id: number (PK)`
- `type: string` (promotion / information / evenement / autre)
- `titre: string`
- `description: text`
- `pageCible: string` (ex: `index`, `boutique`, `promotion`)
- `redirectionUrl: string | null` (url ou route interne)
- `animation: string | null` (optionnel)
- `active: boolean` (visible en vitrine si true)
- `vues: int` (compte (optionnel) global)
- `clics: int` (compte global)
- `vuesIndex: int` (nombre de vues depuis l'index)
- `clicsIndex: int` (clics venant de l'index)
- Relation: `images: AnnonceImage[]` (table `annonce_images` stocke `imageBase64`, `type`)

AnnonceImage (champs importants):
- `id`, `annonceId`, `imageBase64`, `type` (`image` | `video`), `ordre`

---

## 🔌 Endpoints API importants
(les routes sont sous `/api/annonces`)
- GET `/` — lister toutes les annonces (admin / public natif) ✅
- GET `/:id` — obtenir une annonce
- PATCH `/:id/increment-vues-index` — incrémenter `vuesIndex` (appelé lors du rendu du slider)
- PATCH `/:id/increment-clics-index` — incrémenter `clicsIndex` (appelé lors du clic sur l'annonce dans l'index)
- PATCH `/:id` (JWT) — modifier (activé/désactivé, contenu, pageCible)
- POST `/` (JWT) — créer une annonce
- DELETE `/:id` (JWT) — supprimer une annonce

> Remarque : les endpoints d'incrémentation sont appelés par le front directement (méthode `fetch` en `index.html`).

---

## 🔁 Flux d'affichage (admin → vitrine)
1. Admin crée/édite une annonce dans `gestion-annonces.html` (formulaire envoie POST/PATCH au backend). ✅
2. Backend sauvegarde l'annonce et ses images, calcule valeurs par défaut puis renvoie l'objet. ✅
3. `index.html` ou `boutique.html` effectue un `fetch('http://localhost:3000/api/annonces')` et filtre les annonces :
   - visible si `active === true` et `pageCible === 'index'` (ou autre page ciblée)
   - s'assure qu'il y a des images/vidéos valides (`images[0].imageBase64`) avant d'afficher
4. À l'affichage d'une annonce dans le slider, le front appelle `PATCH /:id/increment-vues-index` pour comptabiliser la vue. ✅
5. Au clic sur l'image, le front appelle `PATCH /:id/increment-clics-index` puis redirige selon `redirectionUrl`.

---

## ✂ Extraits de code utiles
- Chargement & filtrage (extrait de `index.html`)
```js
const res = await fetch('http://localhost:3000/api/annonces');
const annonces = await res.json();
const filtered = annonces.filter(a => a.active && a.pageCible === 'index' && Array.isArray(a.images) && a.images.length > 0 && a.images[0].imageBase64);
```

- Compter une vue à l'affichage (extrait de `index.html`)
```js
fetch(`http://localhost:3000/api/annonces/${annonce.id}/increment-vues-index`, { method: 'PATCH' });
```

- Compter un clic puis rediriger (extrait de `index.html`)
```js
fetch(`http://localhost:3000/api/annonces/${annonce.id}/increment-clics-index`, { method: 'PATCH' });
// puis ouvrir annonce.redirectionUrl (ex: boutique.html ou URL externe)
```

- Admin : affichage et actions (extrait de `gestion-annonces.html`)
```js
const res = await fetch(API_URL);
// affichage tableau, boutons modifier/supprimer/activer
// action bouton: toggleActive -> PATCH API
```

---

## 🧭 Schéma du flux (diagramme ASCII)

Annonce DB (annonces, annonce_images)
  |
  |  (CRUD) via API (NestJS)
  v
API: /api/annonces
  |-- GET /                       -> renvoie toutes les annonces
  |-- POST / (admin)              -> crée une annonce
  |-- PATCH /:id                  -> modifie (active/désactive)
  |-- PATCH /:id/increment-vues-index -> incrémente vuesIndex
  |-- PATCH /:id/increment-clics-index-> incrémente clicsIndex
  |
  v
Frontend
  - Admin: `gestion-annonces.html`  (création, édition, activation)
  - Vitrine: `index.html` / `boutique.html`
     - charge `/api/annonces`
     - filtre `active && pageCible === 'index'`
     - affiche slider / cartes
     - appelle `increment-vues-index` à l'affichage
     - appelle `increment-clics-index` au clic

ASCII simple:

[DB: annonces] <---> [API: /api/annonces] --> { gestion-annonces.html (admin) }
                                         \--> { index.html / boutique.html (vitrine) }

---

## ✅ Tests manuels recommandés
- Créer une annonce `pageCible = 'index'`, `active = true`, ajouter une image ; vérifier qu'elle apparaît dans `index.html`.
- Observer que `PATCH /:id/increment-vues-index` est appelé lors du rendu du slider.
- Cliquer sur l'annonce : `PATCH /:id/increment-clics-index` et redirection correcte.
- Désactiver une annonce depuis l'admin : elle doit disparaître du slider.

---

## 💡 Conseils & améliorations possibles
- Paginer l'API `GET /api/annonces` si la liste devient grande.
- Indexer et compter vues/clics côté backend de façon atomique pour éviter pertes en cas de concurrence.
- Ajouter un job côté serveur pour nettoyer ou archiver les anciennes annonces.
- Ajouter métriques d'affichage (temps moyen de visualisation pour les vidéos).

---


