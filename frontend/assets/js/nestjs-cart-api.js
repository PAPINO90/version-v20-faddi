// SYSTÈME DE PANIER FADIDI - API NESTJS
// Gestion complète du panier avec base de données MySQL

class FadidiCartAPI {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000/api';
        this.sessionId = this.getOrCreateSessionId();
        this.cart = {
            items: [],
            total: 0,
            subtotal: 0,
            deliveryFee: 0
        };
        
        // Charger le panier au démarrage
        this.loadCartFromStorage();
        
        // Forcer une sauvegarde pour nettoyer les anciens totaux incorrects
        this.saveCartToStorage();
        
        console.log('🛒 Système de panier NestJS initialisé - Session:', this.sessionId);
    }

    /**
     * Générer ou récupérer un ID de session unique
     */
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('fadidi_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('fadidi_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Construire l'URL complète pour les images
     */
    buildImageUrl(imagePath) {
        if (!imagePath || imagePath === 'assets/images/1-.png') {
            return `${this.API_BASE_URL.replace('/api', '')}/placeholder.svg`;
        }
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        if (imagePath.startsWith('/uploads')) {
            return `${this.API_BASE_URL.replace('/api', '')}${imagePath}`;
        }
        
        return `${this.API_BASE_URL.replace('/api', '')}/uploads/${imagePath}`;
    }

    /**
     * Ajouter un produit au panier
     */
    async addToCart(product) {
        try {
            // Normaliser les données du produit
            const normalizedProduct = {
                id: product.id || Date.now(),
                name: product.name || product.title,
                price: parseFloat(product.price || product.promoPrice || product.promotionPrice),
                originalPrice: parseFloat(product.originalPrice || product.oldPrice || 0),
                image: this.buildImageUrl(product.image),
                quantity: parseInt(product.quantity || 1),
                promotionId: product.promotionId || null,
                productId: product.productId || null,
                isPromotion: Boolean(product.isPromotion || product.promotionId),
                discountPercentage: product.discountPercentage || 0,
                category: product.category || 'Général',
                addedAt: Date.now(),
                sessionId: this.sessionId
            };

            // Vérifier si le produit existe déjà dans le panier
            const existingIndex = this.cart.items.findIndex(item => 
                (item.name === normalizedProduct.name && 
                 item.promotionId === normalizedProduct.promotionId) ||
                (item.productId && item.productId === normalizedProduct.productId)
            );

            if (existingIndex > -1) {
                // Augmenter la quantité si le produit existe
                this.cart.items[existingIndex].quantity += normalizedProduct.quantity;
                console.log('📈 Quantité augmentée:', normalizedProduct.name);
            } else {
                // Ajouter un nouveau produit
                this.cart.items.push(normalizedProduct);
                console.log('➕ Nouveau produit ajouté:', normalizedProduct.name);
            }

            // Recalculer les totaux
            this.calculateTotals();

            // Sauvegarder dans localStorage
            this.saveCartToStorage();

            // Synchroniser avec l'API
            await this.syncWithAPI(normalizedProduct);

            // Déclencher les événements de mise à jour
            this.triggerCartUpdated();

            return {
                success: true,
                product: normalizedProduct,
                cartTotal: this.cart.total,
                message: 'Produit ajouté au panier avec succès'
            };

        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout au panier:', error);
            throw new Error('Impossible d\'ajouter le produit au panier');
        }
    }

    /**
     * Supprimer un produit du panier
     */
    removeFromCart(productIndex) {
        try {
            // Valider l'index
            if (typeof productIndex !== 'number' || productIndex < 0) {
                throw new Error('Index invalide pour la suppression');
            }
            
            if (productIndex >= this.cart.items.length) {
                throw new Error(`Index ${productIndex} hors limites (panier: ${this.cart.items.length} articles)`);
            }
            
            // Sauvegarder l'article avant suppression
            const removedProduct = this.cart.items[productIndex];
            
            if (!removedProduct) {
                throw new Error('Article non trouvé à cet index');
            }
            
            // Supprimer l'article
            this.cart.items.splice(productIndex, 1);
            
            // Recalculer et sauvegarder
            this.calculateTotals();
            this.saveCartToStorage();
            
            // Déclencher les événements de mise à jour
            this.triggerCartUpdated();
            
            console.log('🗑️ Produit supprimé du panier:', removedProduct.name);
            
            // Créer une entrée de log pour la suppression (optionnel)
            this.logCartAction('remove', removedProduct);
            
            return removedProduct;
            
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            throw error;
        }
    }

    /**
     * Logger les actions du panier (pour debugging)
     */
    logCartAction(action, item, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId,
                action: action,
                item: {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                },
                cartState: {
                    totalItems: this.cart.items.length,
                    total: this.cart.total
                },
                details: details
            };
            
            // Sauvegarder dans localStorage pour debug
            const logs = JSON.parse(localStorage.getItem('fadidi_cart_logs') || '[]');
            logs.push(logEntry);
            
            // Garder seulement les 50 dernières entrées
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('fadidi_cart_logs', JSON.stringify(logs));
            
            console.log('📋 Action panier loggée:', action, item.name);
        } catch (error) {
            console.warn('⚠️ Erreur logging action panier:', error);
        }
    }

    /**
     * Mettre à jour la quantité d'un produit
     */
    updateQuantity(productIndex, newQuantity) {
        try {
            // Valider les paramètres
            if (typeof productIndex !== 'number' || productIndex < 0) {
                throw new Error('Index invalide pour la mise à jour de quantité');
            }
            
            if (productIndex >= this.cart.items.length) {
                throw new Error(`Index ${productIndex} hors limites (panier: ${this.cart.items.length} articles)`);
            }
            
            const quantity = parseInt(newQuantity);
            if (isNaN(quantity) || quantity < 0) {
                throw new Error('Quantité invalide');
            }
            
            const item = this.cart.items[productIndex];
            if (!item) {
                throw new Error('Article non trouvé à cet index');
            }
            
            const oldQuantity = item.quantity;
            
            // Si la quantité est 0, supprimer l'article
            if (quantity === 0) {
                return this.removeFromCart(productIndex);
            }
            
            // Mettre à jour la quantité
            item.quantity = quantity;
            
            // Recalculer et sauvegarder
            this.calculateTotals();
            this.saveCartToStorage();
            this.triggerCartUpdated();
            
            console.log('🔄 Quantité mise à jour:', item.name, `${oldQuantity} → ${quantity}`);
            
            // Logger l'action
            this.logCartAction('update_quantity', item, { 
                oldQuantity, 
                newQuantity: quantity 
            });
            
            return item;
            
        } catch (error) {
            console.error('❌ Erreur mise à jour quantité:', error);
            throw error;
        }
    }

    /**
     * Vider le panier complètement
     */
    clearCart() {
        this.cart.items = [];
        this.calculateTotals();
        this.saveCartToStorage();
        this.triggerCartUpdated();
        console.log('🧹 Panier vidé');
    }

    /**
     * Calculer les totaux du panier
     */
    calculateTotals() {
        this.cart.subtotal = this.cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Livraison toujours gratuite
        this.cart.deliveryFee = 0;
        // Total final
        this.cart.total = this.cart.subtotal + this.cart.deliveryFee;
        
        // Calculer les économies totales
        this.cart.totalSavings = this.cart.items.reduce((sum, item) => {
            if (item.originalPrice && item.originalPrice > item.price) {
                return sum + ((item.originalPrice - item.price) * item.quantity);
            }
            return sum;
        }, 0);
    }

    /**
     * Synchroniser avec l'API NestJS
     */
    async syncWithAPI(product) {
        try {
            // Si c'est une promotion, incrémenter le compteur vendu
            if (product.promotionId) {
                await this.incrementPromotionSold(product.promotionId, product.quantity);
            }

            // Créer une entrée de traçabilité dans orders
            await this.createCartTracker();

        } catch (error) {
            console.log('⚠️ Erreur synchronisation API (non-bloquant):', error.message);
        }
    }

    /**
     * Incrémenter le compteur de vente d'une promotion
     */
    async incrementPromotionSold(promotionId, quantity = 1) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/promotions/${promotionId}/sold`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
            });

            if (response.ok) {
                console.log('✅ Promotion sold count updated:', promotionId);
            }
        } catch (error) {
            console.log('⚠️ Erreur mise à jour promotion sold:', error.message);
        }
    }

    /**
     * Créer un tracker de panier dans la base de données
     */
    async createCartTracker() {
        if (this.cart.items.length === 0) return;

        try {
            const trackerData = {
                customerName: `Session_${this.sessionId}`,
                customerPhone: 'PANIER_TEMP',
                customerEmail: 'cart@fadidi.temp',
                deliveryAddress: 'Panier temporaire en cours',
                deliveryCity: 'FADIDI',
                deliveryNotes: `🛒 TRACKER PANIER - Session: ${this.sessionId} - ${this.cart.items.length} produit(s)`,
                items: this.cart.items.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                    image: item.image,
                    promotionId: item.promotionId || null,
                    productId: item.productId || null
                })),
                subtotal: this.cart.subtotal,
                deliveryFee: this.cart.deliveryFee,
                total: this.cart.total,
                paymentMethod: 'cart_temp',
                status: 'cart_session'
            };

            const response = await fetch(`${this.API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trackerData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('📊 Cart tracker created:', result.data?.id);
            }
        } catch (error) {
            console.log('⚠️ Erreur cart tracker:', error.message);
        }
    }

    /**
     * Finaliser une commande
     */
    async checkout(customerData) {
        if (this.cart.items.length === 0) {
            throw new Error('Le panier est vide');
        }

        try {
            const orderData = {
                customerName: customerData.name,
                customerPhone: customerData.phone,
                customerEmail: customerData.email || '',
                deliveryAddress: customerData.address,
                deliveryCity: customerData.city,
                deliveryTime: customerData.deliveryTime || '',
                deliveryNotes: customerData.notes || '',
                items: this.cart.items.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                    image: item.image,
                    promotionId: item.promotionId || null,
                    productId: item.productId || null
                })),
                subtotal: this.cart.subtotal,
                deliveryFee: this.cart.deliveryFee,
                total: this.cart.total,
                paymentMethod: customerData.paymentMethod,
                status: 'pending'
            };

            const response = await fetch(`${this.API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la création de la commande');
            }

            const result = await response.json();
            
            // Vider le panier après commande réussie
            this.clearCart();
            
            return {
                success: true,
                order: result.data,
                orderId: result.data.id,
                message: 'Commande créée avec succès'
            };

        } catch (error) {
            console.error('❌ Erreur checkout:', error);
            throw error;
        }
    }

    /**
     * Sauvegarder le panier dans localStorage
     */
    saveCartToStorage() {
        try {
            localStorage.setItem('fadidi_cart_items', JSON.stringify(this.cart.items));
            localStorage.setItem('fadidi_cart_totals', JSON.stringify({
                subtotal: this.cart.subtotal,
                deliveryFee: this.cart.deliveryFee,
                total: this.cart.total,
                totalSavings: this.cart.totalSavings
            }));
            localStorage.setItem('fadidi_cart_updated', Date.now().toString());
        } catch (error) {
            console.error('❌ Erreur sauvegarde localStorage:', error);
        }
    }

    /**
     * Charger le panier depuis localStorage
     */
    loadCartFromStorage() {
        try {
            const savedItems = localStorage.getItem('fadidi_cart_items');
            const savedTotals = localStorage.getItem('fadidi_cart_totals');
            
            if (savedItems) {
                this.cart.items = JSON.parse(savedItems);
            }
            
            // TOUJOURS recalculer les totaux depuis les items actuels
            // Cela évite les problèmes d'anciens totaux incorrects
            this.calculateTotals();
            
            console.log('📂 Panier chargé depuis localStorage:', this.cart.items.length, 'produit(s)');
        } catch (error) {
            console.error('❌ Erreur chargement localStorage:', error);
            this.cart.items = [];
            this.calculateTotals();
        }
    }

    /**
     * Déclencher les événements de mise à jour du panier
     */
    triggerCartUpdated() {
        // Événement personnalisé
        const event = new CustomEvent('cartUpdated', {
            detail: {
                cart: this.cart,
                itemCount: this.cart.items.length,
                totalQuantity: this.cart.items.reduce((sum, item) => sum + item.quantity, 0),
                total: this.cart.total
            }
        });
        window.dispatchEvent(event);

        // Mettre à jour les compteurs visuels
        this.updateCartCounters();
    }

    /**
     * Mettre à jour les compteurs visuels du panier
     */
    updateCartCounters() {
        const totalQuantity = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Compteurs dans la page promotion
        const countDisplay = document.getElementById('cart-count-display');
        if (countDisplay) {
            countDisplay.textContent = `(${totalQuantity})`;
        }
        
        const totalDisplay = document.getElementById('cart-total-display');
        if (totalDisplay && this.cart.total > 0) {
            totalDisplay.textContent = `Total: ${this.cart.total.toLocaleString()} CFA`;
            totalDisplay.style.display = 'block';
        } else if (totalDisplay) {
            totalDisplay.style.display = 'none';
        }

        // Compteur dans boutique.html
        const boutiquecounter = document.getElementById('cart-count');
        if (boutiquecounter) {
            boutiquecounter.textContent = `(${totalQuantity})`;
        }

        // Animation du compteur
        const cartCounter = document.getElementById('cart-counter');
        if (cartCounter && totalQuantity > 0) {
            cartCounter.style.animation = 'cartPulse 0.6s ease-out';
            setTimeout(() => {
                cartCounter.style.animation = '';
            }, 600);
        }
    }

    /**
     * Obtenir les statistiques du panier
     */
    getStats() {
        const promotionItems = this.cart.items.filter(item => item.isPromotion);
        const regularItems = this.cart.items.filter(item => !item.isPromotion);
        
        // Calculer les économies directement depuis les items actuels
        const totalSavings = this.cart.items.reduce((sum, item) => {
            if (item.originalPrice && item.originalPrice > item.price) {
                return sum + ((item.originalPrice - item.price) * item.quantity);
            }
            return sum;
        }, 0);
        
        return {
            totalItems: this.cart.items.length,
            totalQuantity: this.cart.items.reduce((sum, item) => sum + item.quantity, 0),
            promotionItems: promotionItems.length,
            regularItems: regularItems.length,
            subtotal: this.cart.subtotal,
            deliveryFee: this.cart.deliveryFee,
            total: this.cart.total,
            totalSavings: totalSavings,
            freeDelivery: this.cart.subtotal >= 50000
        };
    }

    /**
     * Rechercher un ordre par téléphone
     */
    async findOrdersByPhone(phone) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/orders/by-phone/${phone}`);
            if (response.ok) {
                const result = await response.json();
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('❌ Erreur recherche commandes:', error);
            return [];
        }
    }
}

// Styles CSS pour les animations
const cartStyles = document.createElement('style');
cartStyles.innerHTML = `
    @keyframes cartPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes cartBounce {
        0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
        40%, 43% { transform: translateY(-8px); }
        70% { transform: translateY(-4px); }
        90% { transform: translateY(-2px); }
    }
`;
document.head.appendChild(cartStyles);

// Export global
window.FadidiCartAPI = FadidiCartAPI;

// Instance globale
if (!window.fadidiCartAPI) {
    window.fadidiCartAPI = new FadidiCartAPI();
}

console.log('🚀 Système de panier NestJS chargé avec succès');