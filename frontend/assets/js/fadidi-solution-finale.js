// =================================
// FADIDI - SOLUTION FINALE ANTI-DUPLICATION
// =================================

/**
 * Solution définitive pour éliminer la duplication des produits
 * Utilise uniquement l'API et le système anti-duplication
 */

class FadidiProductSolution {
    constructor() {
        this.initialized = false;
        this.loadingInProgress = false;
        this.productsBySection = new Map();
    }

    async init() {
        if (this.initialized) {
            console.log('⚠️ Solution déjà initialisée');
            return;
        }

        console.log('🚀 Initialisation de la solution anti-duplication FADIDI');
        
        // Nettoyer tous les anciens produits
        this.clearAllProducts();
        
        // Charger les produits depuis l'API une seule fois
        await this.loadAllProductsFromAPI();
        
        this.initialized = true;
        console.log('✅ Solution initialisée avec succès');
    }

    clearAllProducts() {
        console.log('🧹 Nettoyage de tous les conteneurs de produits');
        
        // Nettoyer tous les conteneurs possibles
        const containers = [
            'fadidi-products-list',
            'vendor-product-list',
            'products-container'
        ];

        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '';
                console.log(`   - Conteneur ${id} nettoyé`);
            }
        });

        // Réinitialiser les variables de contrôle
        if (typeof vendorProductsLoaded !== 'undefined') {
            window.vendorProductsLoaded = false;
        }
        if (window.fadidiProductManager) {
            window.fadidiProductManager.clearDisplayedProducts();
        }
    }

    async loadAllProductsFromAPI() {
        if (this.loadingInProgress) {
            console.log('⚠️ Chargement déjà en cours...');
            return;
        }

        this.loadingInProgress = true;

        try {
            console.log('📡 Chargement des produits depuis l\'API...');
            
            const response = await fetch('http://localhost:3000/api/products/published');
            if (!response.ok) throw new Error('API non disponible');
            
            const apiProducts = await response.json();
            console.log(`📦 ${apiProducts.length} produits récupérés depuis l'API`);

            // Convertir au format boutique
            const formattedProducts = apiProducts.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description || '',
                price: product.price,
                image: product.images?.[0] ? `http://localhost:3000/uploads/${product.images[0]}` : '1-.png',
                status: 'published',
                category: product.category?.name || 'Non catégorisé',
                category_id: product.category?.id || null,
                createdAt: product.createdAt,
                isVendorProduct: !!product.vendorId,
                vendorName: product.vendorName || null
            }));

            // Séparer les produits FADIDI officiels et les produits des vendeurs
            const fadidiProducts = formattedProducts.filter(p => !p.isVendorProduct);
            const vendorProducts = formattedProducts.filter(p => p.isVendorProduct);

            console.log(`📊 Répartition: ${fadidiProducts.length} FADIDI officiels, ${vendorProducts.length} vendeurs`);

            // Sauvegarder dans localStorage
            localStorage.setItem('fadidiProducts', JSON.stringify(fadidiProducts));
            localStorage.setItem('vendorProducts', JSON.stringify(vendorProducts));

            // Afficher uniquement dans la section FADIDI officielle
            this.displayProductsInSection('fadidi-products-list', formattedProducts);

            this.loadingInProgress = false;
            return formattedProducts;

        } catch (error) {
            console.error('❌ Erreur lors du chargement:', error);
            this.loadingInProgress = false;
            
            // Fallback vers localStorage
            this.loadFromLocalStorage();
        }
    }

    displayProductsInSection(containerId, products) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Conteneur ${containerId} introuvable`);
            return;
        }

        // Vider le conteneur
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p>Aucun produit disponible</p>';
            return;
        }

        // Créer la grille
        const grid = document.createElement('div');
        grid.className = 'fadidi-modern-grid';

        // Ajouter chaque produit une seule fois
        products.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        console.log(`✅ ${products.length} produits affichés dans ${containerId}`);
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'fadidi-product-card';
        card.dataset.productId = product.id;
        
        // Badge pour les produits des vendeurs
        const vendorBadge = product.isVendorProduct 
            ? `<div class="vendor-badge">À LA UNE</div>` 
            : '';

        card.innerHTML = `
            <div class="fadidi-card-img-container">
                <img src="${product.image}" alt="${product.name}" onclick="openImage(this)" />
                ${vendorBadge}
            </div>
            <div class="fadidi-card-body">
                <h3 class="fadidi-card-title">${product.name}</h3>
                <p class="fadidi-card-desc">${product.description}</p>
                <div class="fadidi-card-price">${Number(product.price).toLocaleString('fr-FR')} CFA</div>
                <button class="fadidi-card-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">Ajouter au panier</button>
            </div>
        `;
        
        return card;
    }

    loadFromLocalStorage() {
        console.log('📂 Chargement depuis localStorage (fallback)');
        
        const fadidiProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
        const vendorProducts = JSON.parse(localStorage.getItem('vendorProducts') || '[]');
        
        const allProducts = [...fadidiProducts, ...vendorProducts];
        
        if (allProducts.length > 0) {
            this.displayProductsInSection('fadidi-products-list', allProducts);
        }
    }

    // Méthode pour forcer le rechargement
    async forceReload() {
        console.log('🔄 Rechargement forcé des produits');
        this.initialized = false;
        await this.init();
    }
}

// CSS pour le badge "À LA UNE"
const vendorBadgeStyles = `
<style>
.vendor-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #ff6600, #ff4400);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.7em;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(255, 68, 0, 0.4);
    z-index: 10;
}

.fadidi-card-img-container {
    position: relative;
}
</style>
`;

// Injecter les styles
if (!document.querySelector('#vendor-badge-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'vendor-badge-styles';
    styleElement.innerHTML = vendorBadgeStyles;
    document.head.appendChild(styleElement);
}

// Créer l'instance globale
window.fadidiSolution = new FadidiProductSolution();

// Désactiver complètement l'ancienne logique
window.loadPublishedProducts = function() {
    console.log('⚠️ Ancienne fonction loadPublishedProducts() désactivée - utilise fadidiSolution');
};

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async () => {
        await window.fadidiSolution.init();
    }, 1000);
});

// Fonction globale pour rechargement manuel
window.reloadFadidiProducts = function() {
    return window.fadidiSolution.forceReload();
};

console.log('🔧 Solution finale FADIDI chargée - Duplication éliminée');