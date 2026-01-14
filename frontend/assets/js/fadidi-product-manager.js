// ========================================
// FADIDI - SYSTÈME ANTI-DUPLICATION PRODUITS
// ========================================

/**
 * Système pour éviter la duplication des produits dans la boutique FADIDI
 */

class FadidiProductManager {
    constructor() {
        this.productsLoaded = false;
        this.productCache = new Map(); // Cache des produits par ID
        this.displayedProducts = new Set(); // Set des IDs des produits affichés
    }

    /**
     * Vérifier si un produit est déjà affiché
     */
    isProductDisplayed(productId) {
        return this.displayedProducts.has(productId);
    }

    /**
     * Marquer un produit comme affiché
     */
    markProductAsDisplayed(productId) {
        this.displayedProducts.add(productId);
    }

    /**
     * Nettoyer tous les produits affichés
     */
    clearDisplayedProducts() {
        this.displayedProducts.clear();
        this.productsLoaded = false;
    }

    /**
     * Ajouter un produit au cache
     */
    addToCache(product) {
        this.productCache.set(product.id, product);
    }

    /**
     * Obtenir un produit du cache
     */
    getFromCache(productId) {
        return this.productCache.get(productId);
    }

    /**
     * Vérifier si les produits sont déjà chargés
     */
    areProductsLoaded() {
        return this.productsLoaded;
    }

    /**
     * Marquer les produits comme chargés
     */
    setProductsLoaded(loaded = true) {
        this.productsLoaded = loaded;
    }

    /**
     * Afficher les produits sans duplication
     */
    displayProducts(products, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} non trouvé`);
            return false;
        }

        // Nettoyer le conteneur s'il y a déjà des produits
        if (container.children.length > 0) {
            console.log('⚠️ Conteneur non vide, nettoyage...');
            container.innerHTML = '';
            this.clearDisplayedProducts();
        }

        // Créer la grille
        const grid = document.createElement('div');
        grid.className = 'fadidi-modern-grid';

        // Afficher chaque produit unique
        products.forEach(product => {
            if (!this.isProductDisplayed(product.id)) {
                const card = this.createProductCard(product);
                grid.appendChild(card);
                this.markProductAsDisplayed(product.id);
                this.addToCache(product);
            }
        });

        container.appendChild(grid);
        this.setProductsLoaded(true);
        
        console.log(`✅ ${products.length} produits affichés sans duplication`);
        return true;
    }

    /**
     * Créer une carte produit
     */
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'fadidi-product-card';
        card.dataset.productId = product.id; // Ajouter l'ID pour référence
        
        // Debug de l'image
        console.log('🖼️ Création carte produit:', {
            name: product.name,
            image: product.image,
            imageType: typeof product.image,
            imageExists: !!product.image
        });
        
        const finalImage = product.image || 'assets/images/1-.png';
        console.log('🖼️ Image finale utilisée:', finalImage);
        
        card.innerHTML = `
            <div class="fadidi-card-img-container">
                <img src="${finalImage}" alt="${product.name || 'Produit'}" onclick="openImage(this)" />
            </div>
            <div class="fadidi-card-body">
                <h3 class="fadidi-card-title">${product.name || 'Produit FADIDI'}</h3>
                <p class="fadidi-card-desc">${product.description || ''}</p>
                <div class="fadidi-card-price">${product.price ? Number(product.price).toLocaleString('fr-FR') + ' CFA' : '23 000 CFA'}</div>
                <button class="fadidi-card-btn" data-cart-action="add">Ajouter au panier</button>
            </div>
        `;
        
        return card;
    }

    /**
     * Recharger les produits depuis l'API
     */
    async reloadFromAPI() {
        try {
            const response = await fetch('http://localhost:3000/api/products/published');
            if (!response.ok) throw new Error('API non disponible');
            
            const products = await response.json();
            
            // Convertir au format boutique
            const fadidiProducts = products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.images?.[0] ? `http://localhost:3000/uploads/${product.images[0]}` : 'assets/images/1-.png',
                status: 'published',
                category: product.category?.name || null,
                category_id: product.category?.id || null,
                createdAt: product.createdAt
            }));

            // Sauvegarder dans localStorage
            localStorage.setItem('fadidiProducts', JSON.stringify(fadidiProducts));
            
            // Forcer le rechargement
            this.clearDisplayedProducts();
            this.displayProducts(fadidiProducts, 'fadidi-products-list');
            
            return fadidiProducts;
        } catch (error) {
            console.error('Erreur lors du rechargement:', error);
            return null;
        }
    }

    /**
     * Ajouter un nouveau produit (éviter duplication)
     */
    addNewProduct(product) {
        // Vérifier si le produit existe déjà
        if (this.isProductDisplayed(product.id)) {
            console.log('⚠️ Produit déjà affiché, ignorer');
            return false;
        }

        // Ajouter au localStorage
        const existingProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
        const productExists = existingProducts.find(p => p.id === product.id);
        
        if (!productExists) {
            existingProducts.push(product);
            localStorage.setItem('fadidiProducts', JSON.stringify(existingProducts));
        }

        // Ajouter à l'affichage
        const container = document.getElementById('fadidi-products-list');
        if (container) {
            const grid = container.querySelector('.fadidi-modern-grid') || container;
            const card = this.createProductCard(product);
            grid.appendChild(card);
            this.markProductAsDisplayed(product.id);
            this.addToCache(product);
            
            console.log('✅ Nouveau produit ajouté:', product.name);
            return true;
        }
        
        return false;
    }
}

// Créer l'instance globale
window.fadidiProductManager = new FadidiProductManager();

console.log('🔧 Système anti-duplication FADIDI initialisé');