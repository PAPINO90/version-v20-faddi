// =================================
// FADIDI - SYSTÈME DE CATÉGORIES AVEC FILTRAGE
// =================================

/**
 * Système complet de gestion des catégories FADIDI
 * - Chargement des catégories depuis l'API admin
 * - Affichage en grille cliquable
 * - Filtrage des produits par catégorie
 * - Interface intuitive avec navigation
 */

class FadidiCategorySystem {
    updateMenuCategories() {
        const menuCatUl = document.getElementById('menu-categories');
        if (!menuCatUl) return;
        menuCatUl.innerHTML = '';
        this.categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'menu-category-item';

            // Déterminer l'image à utiliser
            let categoryImageSrc = '';
            if (category.image) {
                if (category.image.startsWith('http')) {
                    categoryImageSrc = category.image;
                } else {
                    categoryImageSrc = `http://localhost:3000/uploads/${category.image}`;
                }
            } else {
                categoryImageSrc = 'assets/images/default-category.png'; // image par défaut
            }

            // Créer l'image
            const img = document.createElement('img');
            img.src = categoryImageSrc;
            img.alt = category.name;
            img.className = 'menu-category-cover';
            img.style.width = '32px';
            img.style.height = '32px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '6px';
            img.style.marginRight = '8px';

            const a = document.createElement('a');
            a.textContent = category.name;
            a.href = '#';
            a.onclick = (e) => {
                e.preventDefault();
                this.filterByCategory(category);
                document.getElementById('menuContent').style.display = 'none';
            };

            li.appendChild(img);
            li.appendChild(a);
            menuCatUl.appendChild(li);
        });
    }
    constructor() {
        this.categories = [];
        this.products = [];
        this.currentFilter = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) {
            console.log('⚠️ Système de catégories déjà initialisé');
            return;
        }

        console.log('🏷️ Initialisation du système de catégories FADIDI');
        
        // Charger les catégories et produits
        await this.loadCategoriesFromAPI();
        await this.loadProductsFromAPI();
        
        // Afficher les catégories
        this.displayCategories();
        this.updateMenuCategories();
        
        this.initialized = true;
        console.log('✅ Système de catégories initialisé');
    }

    async loadCategoriesFromAPI() {
        try {
            console.log('📡 Chargement des catégories depuis l\'API...');
            
            const response = await fetch('http://localhost:3000/api/categories');
            if (!response.ok) throw new Error('API catégories non disponible');
            
            this.categories = await response.json();
            console.log(`📂 ${this.categories.length} catégories chargées:`, this.categories.map(c => c.name));
            
            return this.categories;
        } catch (error) {
            console.error('❌ Erreur chargement catégories:', error);
            // Catégories par défaut si API non disponible
            this.categories = [
                { id: 'default-1', name: 'Électronique', description: 'Produits électroniques' },
                { id: 'default-2', name: 'Mode', description: 'Vêtements et accessoires' },
                { id: 'default-3', name: 'Maison', description: 'Articles pour la maison' }
            ];
            return this.categories;
        }
    }

    async loadProductsFromAPI() {
        try {
            console.log('📡 Chargement des produits pour catégories...');
            
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) throw new Error('API produits non disponible');
            
            const apiProducts = await response.json();
            
            // Conversion format
            this.products = apiProducts.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description || '',
                price: product.price,
                image: product.images?.[0] ? `http://localhost:3000/uploads/${product.images[0]}` : '1-.png',
                category_id: product.category?.id || null,
                category_name: product.category?.name || 'Sans catégorie',
                status: product.status || 'active'
            }));
            
            console.log(`📦 ${this.products.length} produits chargés pour filtrage`);
            return this.products;
        } catch (error) {
            console.error('❌ Erreur chargement produits:', error);
            // Fallback localStorage
            const stored = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
            this.products = stored;
            return this.products;
        }
    }

    displayCategories() {
        const container = document.getElementById('categories-grid');
        const countSpan = document.getElementById('categories-count');
        
        if (!container) {
            console.error('❌ Conteneur categories-grid introuvable');
            return;
        }

        // Mise à jour du compteur
        if (countSpan) {
            countSpan.textContent = `${this.categories.length} catégories`;
        }

        container.innerHTML = '';

        if (this.categories.length === 0) {
            container.innerHTML = '<p class="no-categories">Aucune catégorie disponible</p>';
            return;
        }

        this.categories.forEach(category => {
            console.log(`🏷️ Création carte pour: ${category.name}`, category);
            const categoryCard = this.createCategoryCard(category);
            container.appendChild(categoryCard);
        });

        console.log(`✅ ${this.categories.length} catégories affichées`);
    }

    createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card clickable-category';
        card.dataset.categoryId = category.id;
        card.onclick = () => this.filterByCategory(category);

        // Compter les produits de cette catégorie
        const productCount = this.products.filter(p => 
            p.category_id === category.id || p.category_name === category.name
        ).length;

        // Déterminer l'image à utiliser
        let categoryImageSrc;
        
        if (category.image) {
            // Si l'API fournit une image uploadée
            if (category.image.startsWith('http')) {
                categoryImageSrc = category.image;
            } else {
                // Images uploadées sont dans le dossier uploads de l'API
                categoryImageSrc = `http://localhost:3000/uploads/${category.image}`;
            }
        } else {
            // Image par défaut selon le nom de la catégorie (fichiers locaux)
            categoryImageSrc = this.getCategoryImage(category.name);
        }

        console.log(`🖼️ Image pour "${category.name}": ${categoryImageSrc}`);

        card.innerHTML = `
            <div class="category-image-container">
                <img src="${categoryImageSrc}" alt="${category.name}" class="category-image" 
                     onerror="this.onerror=null; this.src='${this.getCategoryImage(category.name)}';" />
                <div class="category-overlay">
                    <span class="category-click-hint">Cliquez pour voir les produits</span>
                </div>
            </div>
            <div class="category-info">
                <h3 class="category-name">${category.name}</h3>
                <p class="category-description">${category.description || 'Découvrez nos produits'}</p>
                <div class="category-product-count">
                    <i class="fas fa-box"></i>
                    <span>${productCount} produit${productCount > 1 ? 's' : ''}</span>
                </div>
            </div>
        `;

        return card;
    }

    getCategoryImage(categoryName) {
        const images = {
            'montre': 'MONTRE.jpg',
            'montres': 'MONTRE.jpg', 
            'watch': 'MONTRE.jpg',
            'watches': 'MONTRE.jpg',
            'sac': 'sac.jpg',
            'sacs': 'sac.jpg',
            'bag': 'sac.jpg',
            'bags': 'sac.jpg',
            'ordinateur': 'ORDI1.jpg',
            'ordinateurs': 'ORDI1.jpg',
            'computer': 'ORDI1.jpg',
            'computers': 'ORDI1.jpg',
            'électronique': 'ORDI1.jpg',
            'electronique': 'ORDI1.jpg',
            'electronic': 'ORDI1.jpg',
            'electronics': 'ORDI1.jpg',
            'sport': 'sport.jpg',
            'sports': 'sport.jpg',
            'chaussure': 'shoes-test-remontee-reeebok.jpg',
            'chaussures': 'shoes-test-remontee-reeebok.jpg',
            'shoe': 'shoes-test-remontee-reeebok.jpg',
            'shoes': 'shoes-test-remontee-reeebok.jpg',
            'mode': 'SAC3.jpg',
            'fashion': 'SAC3.jpg',
            'vêtement': 'SAC3.jpg',
            'vêtements': 'SAC3.jpg',
            'clothing': 'SAC3.jpg',
            'maison': 'fadidinew.png',
            'home': 'fadidinew.png'
        };

        const key = categoryName.toLowerCase().trim();
        
        // Vérifier d'abord une correspondance exacte
        if (images[key]) {
            return images[key];
        }
        
        // Chercher par mots-clés partiels
        for (const [keyword, image] of Object.entries(images)) {
            if (key.includes(keyword) || keyword.includes(key)) {
                return image;
            }
        }
        
        // Image par défaut FADIDI
        return 'fadidinew.png';
    }

    filterByCategory(category) {
        console.log(`🔍 Filtrage par catégorie: ${category.name}`);
        
        this.currentFilter = category;
        
        // Filtrer les produits
        const filteredProducts = this.products.filter(product => 
            product.category_id === category.id || product.category_name === category.name
        );

        console.log(`📋 ${filteredProducts.length} produits trouvés pour "${category.name}"`);

        // Afficher les produits filtrés
        this.displayFilteredProducts(category, filteredProducts);
        
        // Mettre à jour l'interface
        this.showFilteredSection(category);
    }

    displayFilteredProducts(category, products) {
        const container = document.getElementById('filtered-products-grid');
        
        if (!container) {
            console.error('❌ Conteneur filtered-products-grid introuvable');
            return;
        }

        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="no-products-message">
                    <h3>Aucun produit dans "${category.name}"</h3>
                    <p>Cette catégorie ne contient pas encore de produits.</p>
                    <button onclick="fadidiCategories.backToAllCategories()" class="filter-btn">
                        ← Retour aux catégories
                    </button>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const card = this.createProductCard(product);
            container.appendChild(card);
        });

        console.log(`✅ ${products.length} produits affichés pour "${category.name}"`);
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'fadidi-product-card';
        card.dataset.productId = product.id;

        card.innerHTML = `
            <div class="fadidi-card-img-container">
                <img src="${product.image}" alt="${product.name}" onclick="openImage(this)" />
                <div class="category-badge">${product.category_name}</div>
            </div>
            <div class="fadidi-card-body">
                <h3 class="fadidi-card-title">${product.name}</h3>
                <p class="fadidi-card-desc">${product.description}</p>
                <div class="fadidi-card-price">${Number(product.price).toLocaleString('fr-FR')} CFA</div>
                <button class="fadidi-card-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">
                    Ajouter au panier
                </button>
            </div>
        `;

        return card;
    }

    showFilteredSection(category) {
        // Mettre à jour le titre de la section filtrée
        const titleElement = document.getElementById('filtered-section-title');
        if (titleElement) {
            titleElement.textContent = `PRODUITS - ${category.name.toUpperCase()}`;
        }

        // Afficher la section des produits filtrés
        const filteredSection = document.getElementById('filtered-products-section');
        if (filteredSection) {
            filteredSection.style.display = 'block';
            
            // Ouvrir automatiquement l'accordéon
            const accordionContent = filteredSection.querySelector('.accordion-content');
            if (accordionContent) {
                accordionContent.style.display = 'block';
            }

            // Scroll vers la section
            filteredSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Mettre à jour les contrôles de filtre
        this.updateFilterControls(category);
    }

    updateFilterControls(category) {
        const filterInfo = document.getElementById('category-filter-info');
        const clearBtn = document.getElementById('clear-filter-btn');
        const allBtn = document.getElementById('all-products-btn');

        if (filterInfo) {
            filterInfo.textContent = `Filtre actif: ${category.name}`;
            filterInfo.classList.remove('hidden');
        }

        if (clearBtn) {
            clearBtn.classList.remove('hidden');
        }

        if (allBtn) {
            allBtn.classList.remove('active');
        }
    }

    showAllProducts() {
        console.log('📋 Affichage de tous les produits');
        
        this.currentFilter = null;
        
        // Masquer la section filtrée
        const filteredSection = document.getElementById('filtered-products-section');
        if (filteredSection) {
            filteredSection.style.display = 'none';
        }

        // Réinitialiser les contrôles
        const filterInfo = document.getElementById('category-filter-info');
        const clearBtn = document.getElementById('clear-filter-btn');
        const allBtn = document.getElementById('all-products-btn');

        if (filterInfo) filterInfo.classList.add('hidden');
        if (clearBtn) clearBtn.classList.add('hidden');
        if (allBtn) allBtn.classList.add('active');

        // Scroll vers les produits principaux
        const mainProducts = document.getElementById('fadidi-products-list');
        if (mainProducts) {
            mainProducts.scrollIntoView({ behavior: 'smooth' });
        }
    }

    clearCategoryFilter() {
        this.showAllProducts();
    }

    backToAllCategories() {
        this.showAllProducts();
        
        // Scroll vers les catégories
        const categoriesSection = document.getElementById('categories-grid');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Recharger les catégories (utile après ajout/modification)
    async reload() {
        console.log('🔄 Rechargement du système de catégories');
        this.initialized = false;
        await this.init();
        this.updateMenuCategories();
    }
}

// CSS pour les catégories
const categoryStyles = `
<style>
.clickable-category {
    cursor: pointer;
    transition: all 0.3s ease;
}

.clickable-category:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 128, 0, 0.4);
}

.category-image-container {
    position: relative;
    height: 150px;
    overflow: hidden;
    border-radius: 8px 8px 0 0;
}

.category-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.clickable-category:hover .category-image {
    transform: scale(1.1);
}

.category-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.clickable-category:hover .category-overlay {
    opacity: 1;
}

.category-click-hint {
    color: white;
    font-weight: bold;
    text-align: center;
    padding: 10px;
}

.category-info {
    padding: 15px;
}

.category-name {
    margin: 0 0 8px 0;
    color: #ff8000;
    font-size: 1.1em;
}

.category-description {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 0.9em;
    line-height: 1.4;
}

.category-product-count {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #ff8000;
    font-size: 0.9em;
    font-weight: bold;
}

.category-badge {
    position: absolute;
    top: 5px;
    left: 5px;
    background: rgba(255, 128, 0, 0.9);
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.7em;
    font-weight: bold;
}

.no-categories,
.no-products-message {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    grid-column: 1 / -1;
}

.no-products-message h3 {
    color: #ff8000;
    margin-bottom: 10px;
}

@media (max-width: 768px) {
    .category-image-container {
        height: 120px;
    }
    
    .category-info {
        padding: 10px;
    }
    
    .category-name {
        font-size: 1em;
    }
}
</style>
`;

// Injecter les styles
if (!document.querySelector('#category-system-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'category-system-styles';
    styleElement.innerHTML = categoryStyles;
    document.head.appendChild(styleElement);
}

// Créer l'instance globale
window.fadidiCategories = new FadidiCategorySystem();

// Fonctions globales pour l'interface
window.showAllProducts = function() {
    return window.fadidiCategories.showAllProducts();
};

window.clearCategoryFilter = function() {
    return window.fadidiCategories.clearCategoryFilter();
};

window.backToAllCategories = function() {
    return window.fadidiCategories.backToAllCategories();
};

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async () => {
        await window.fadidiCategories.init();
    }, 2000);
});

console.log('🏷️ Système de catégories FADIDI chargé');