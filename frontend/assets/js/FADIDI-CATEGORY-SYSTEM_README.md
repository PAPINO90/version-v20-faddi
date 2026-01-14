# fadidi-category-system.js — README

## ✅ But du fichier
Le script **`fadidi-category-system.js`** fournit un système complet de gestion des catégories pour la boutique FADIDI :
- Charger les catégories et produits depuis l'API,
- Afficher une grille de catégories cliquables,
- Filtrer et afficher les produits par catégorie,
- Mettre à jour un menu de navigation avec les catégories.


## 🔧 Principales fonctionnalités
- Chargement depuis l'API :
  - `GET /api/categories` pour récupérer les catégories
  - `GET /api/products` pour récupérer les produits (utilisés pour le filtrage)
- UI : création dynamique de cartes de catégories (`createCategoryCard`) et d'une grille (`displayCategories`).
- Filtrage : `filterByCategory(category)` met à jour la liste des produits affichés et la section filtrée.
- Helpers : images par catégorie (`getCategoryImage`), compteur de produits par catégorie, badges, messages quand pas de produits.
- Exposition globale : instance accessible via `window.fadidiCategories` et fonctions utilitaires globales : `showAllProducts()`, `clearCategoryFilter()`, `backToAllCategories()`.
- Initialisation automatique : `init()` est lancé ~2s après `DOMContentLoaded`.


## 📋 Méthodes clés (classe `FadidiCategorySystem`)
- `init()` — charge catégories & produits et initialise l'affichage.
- `loadCategoriesFromAPI()` — récupère et met en cache les catégories (fallback prédéfini en cas d'erreur).
- `loadProductsFromAPI()` — récupère les produits et les convertit au format attendu.
- `displayCategories()` / `createCategoryCard(category)` — rendu des cartes catégories.
- `filterByCategory(category)` — filtre les produits et appelle `displayFilteredProducts`.
- `displayFilteredProducts(category, products)` — rend la grille de produits filtrés.
- `showFilteredSection(category)` / `updateFilterControls(category)` — gestion de l'affichage de la section filtrée.
- `showAllProducts()` / `clearCategoryFilter()` / `backToAllCategories()` — navigation et réinitialisation.
- `reload()` — recharge complètement les catégories et produits (utile après modifications).


## 🧩 Éléments DOM attendus
Le script s'appuie sur ces IDs/classes dans le HTML :
- `#categories-grid` — conteneur affichage des catégories
- `#categories-count` — compteur de catégories
- `#menu-categories` — liste du menu de navigation
- `#filtered-products-grid` — conteneur des produits filtrés
- `#filtered-products-section` — section contenant les résultats filtrés
- `#filtered-section-title` — titre de la section filtrée
- `#category-filter-info`, `#clear-filter-btn`, `#all-products-btn` — contrôles du filtre
- `#fadidi-products-list` — liste principale des produits (pour retour)

Assurez-vous que ces éléments existent dans `boutique.html` ou la page où vous activez le système.


## 🌐 Endpoints API utilisés
- `GET http://localhost:3000/api/categories` — récupération catégories
- `GET http://localhost:3000/api/products` — récupération produits pour le filtrage

(Remarque : les URLs sont codées en dur dans le script ; voir la section "Améliorations".)


## ⚠️ Limites & points d'attention
- URLs codées en dur (`http://localhost:3000`) — à adapter pour la production ou centraliser via `API_CONFIG`.
- Dépendance sur la structure des produits renvoyés par l'API (présence de `category.id`, `category.name`, `images`).
- Certaines images sont résolues localement via `getCategoryImage()` — garder la liste `images` à jour pour de nouveaux libellés.
- Le rendu utilise `onclick` inline pour certains éléments (ex. bouton d'ajout au panier via `addToCart`) — peut être amélioré via `addEventListener` pour testabilité/accessibilité.


## 💡 Recommandations d'amélioration
1. Centraliser les URLs API (utiliser `window.API_CONFIG` ou module config) pour faciliter le passage en production.
2. Remplacer `onclick` inline par des écouteurs (`addEventListener`) et déléguer les événements pour performance.
3. Ajouter des tests unitaires pour :
   - `getCategoryImage()` (cas clefs/partiels),
   - `filterByCategory()` (retourne bons produits),
   - rendu DOM minimal (présence des éléments attendus).
4. Gérer la pagination/limits côté API si le nombre de produits devient grand (au lieu d'un fetch massif).
5. Rendre le module exportable (ES module) pour permettre l'import et l'instanciation contrôlée dans des apps modernes.


## ✅ Exemples d'utilisation rapide
- Charger et initialiser (déjà fait automatiquement) :
```js
await window.fadidiCategories.init();
```
- Filtrer programmétiquement par catégorie :
```js
const cat = { id: 'default-2', name: 'Mode' };
window.fadidiCategories.filterByCategory(cat);
```
- Forcer un reload (après modification admin) :
```js
await window.fadidiCategories.reload();
```


---

