// SYNCHRONISATION PROMOTIONS ↔ BOUTIQUE
// Ce script aide à synchroniser les données entre les promotions et la boutique

/**
 * Synchronise les promotions avec le système de panier de la boutique
 */
class PromotionCartSync {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    /**
     * Convertir une promotion en format produit panier
     */
    promotionToCartItem(promotion) {
        return {
            id: `promo_${promotion.id}`,
            name: promotion.name,
            price: promotion.promotionPrice || promotion.promoPrice,
            originalPrice: promotion.originalPrice || promotion.oldPrice,
            image: this.getPromotionImageUrl(promotion.image),
            category: promotion.category,
            promotionId: promotion.id,
            discountPercentage: promotion.discount_percentage || promotion.discountPercentage,
            isPromotion: true,
            quantity: 1
        };
    }

    /**
     * Construire l'URL de l'image de promotion
     */
    getPromotionImageUrl(imageUrl) {
        if (!imageUrl) {
            return 'assets/images/1-.png';
        }
        
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        
        if (imageUrl.startsWith('/uploads')) {
            return `${this.API_BASE_URL.replace('/api', '')}${imageUrl}`;
        }
        
        return `${this.API_BASE_URL.replace('/api', '')}/uploads/${imageUrl}`;
    }

    /**
     * S'assurer que l'URL de l'image est complète pour NestJS
     */
    ensureFullImageUrl(imageUrl) {
        if (!imageUrl || imageUrl === 'assets/images/1-.png') {
            return `${this.API_BASE_URL.replace('/api', '')}/placeholder.svg`;
        }
        
        // Si c'est déjà une URL complète
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        
        // Si c'est un chemin d'upload NestJS
        if (imageUrl.startsWith('/uploads')) {
            return `${this.API_BASE_URL.replace('/api', '')}${imageUrl}`;
        }
        
        // Si c'est juste un nom de fichier
        return `${this.API_BASE_URL.replace('/api', '')}/uploads/${imageUrl}`;
    }

    /**
     * Ajouter un produit en promotion au panier
     */
    async addPromotionToCart(promotionId, productName, price, imageUrl = '') {
        try {
            console.log('🔄 Synchronisation promotion → panier:', { promotionId, productName, price });

            // Créer l'objet produit compatible avec le système de panier
            const cartProduct = {
                id: `promo_${promotionId}_${Date.now()}`,
                name: productName,
                price: parseFloat(price),
                image: imageUrl || 'assets/images/1-.png',
                promotionId: promotionId,
                isPromotion: true,
                quantity: 1
            };

            // Ajouter au panier local (compatible avec new-cart.js)
            let localCart = JSON.parse(localStorage.getItem('fadidi_cart_items') || '[]');
            
            // Vérifier si le produit existe déjà
            const existingIndex = localCart.findIndex(item => 
                item.name === productName && item.promotionId === promotionId
            );
            
            if (existingIndex > -1) {
                localCart[existingIndex].quantity += 1;
                console.log('📈 Quantité augmentée pour:', productName);
            } else {
                localCart.push(cartProduct);
                console.log('➕ Nouveau produit ajouté:', productName);
            }
            
            localStorage.setItem('fadidi_cart_items', JSON.stringify(localCart));

            // Mettre à jour les compteurs de panier si on est sur boutique.html
            if (window.fadidiCart) {
                window.fadidiCart.items = localCart;
                window.fadidiCart.updateNavbarCart();
            }

            // Incrémenter la quantité vendue via l'API promotions
            await this.incrementPromotionSold(promotionId);

            // Créer une pré-commande dans l'API orders (optionnel)
            await this.createPreOrder(cartProduct);

            return {
                success: true,
                product: cartProduct,
                message: 'Produit ajouté au panier avec succès'
            };

        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout au panier:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Incrémenter la quantité vendue d'une promotion
     */
    async incrementPromotionSold(promotionId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/promotions/${promotionId}/sold`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: 1 })
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            console.log('✅ Quantité vendue mise à jour pour la promotion', promotionId);
        } catch (error) {
            console.log('⚠️ Erreur mise à jour quantité vendue:', error.message);
        }
    }

    /**
     * Créer une pré-commande pour traçabilité avec NestJS
     */
    async createPreOrder(product) {
        try {
            // S'assurer que l'image a une URL complète pour NestJS
            const fullImageUrl = this.ensureFullImageUrl(product.image);
            
            const orderData = {
                customerName: `Page Loum`, // Nom client pour les ventes de promotion
                customerPhone: 'Promotion',
                customerEmail: 'promotion@fadidi.com',
                deliveryAddress: 'Vente en ligne - Promotion',
                deliveryCity: 'FADIDI',
                deliveryTime: new Date().toISOString(),
                deliveryNotes: `🎯 VENTE PROMOTION: ${product.name} (Promo ID: ${product.promotionId}) - Vente directe`,
                items: [{
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    total: product.price * product.quantity,
                    image: fullImageUrl, // Image complète pour le dashboard
                    promotionId: product.promotionId // Référence à la promotion
                }],
                subtotal: product.price,
                deliveryFee: 0,
                total: product.price,
                paymentMethod: 'promotion',
                status: 'confirmed', // Statut confirmé pour comptabilisation immédiate
                paymentDate: new Date().toISOString() // Date de paiement pour traçabilité
            };

            const response = await fetch(`${this.API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Pré-commande créée:', result.data?.id || 'N/A');
            }

        } catch (error) {
            console.log('⚠️ Erreur pré-commande (ignorée):', error.message);
        }
    }

    /**
     * Obtenir les statistiques du panier avec promotions
     */
    getCartStats() {
        const localCart = JSON.parse(localStorage.getItem('fadidi_cart_items') || '[]');
        
        const stats = {
            totalItems: localCart.length,
            totalQuantity: localCart.reduce((sum, item) => sum + item.quantity, 0),
            promotionItems: localCart.filter(item => item.isPromotion).length,
            regularItems: localCart.filter(item => !item.isPromotion).length,
            totalValue: localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            promotionSavings: localCart
                .filter(item => item.isPromotion && item.originalPrice)
                .reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0)
        };

        return stats;
    }

    /**
     * Nettoyer les anciens éléments du panier
     */
    cleanOldCartItems(maxAge = 24 * 60 * 60 * 1000) { // 24h par défaut
        const localCart = JSON.parse(localStorage.getItem('fadidi_cart_items') || '[]');
        const now = Date.now();
        
        const cleanCart = localCart.filter(item => {
            // Garder les éléments récents ou sans timestamp
            if (!item.addedAt) return true;
            return (now - item.addedAt) < maxAge;
        });
        
        if (cleanCart.length !== localCart.length) {
            localStorage.setItem('fadidi_cart_items', JSON.stringify(cleanCart));
            console.log(`🧹 Nettoyage panier: ${localCart.length - cleanCart.length} éléments supprimés`);
        }
    }
}

// Export global
window.PromotionCartSync = PromotionCartSync;

// Instance globale
if (!window.promotionSync) {
    window.promotionSync = new PromotionCartSync();
}

// Fonction helper pour l'ajout depuis promotion.html
window.addPromotionToFadidiCart = async function(promotionId, productName, price, imageUrl) {
    const result = await window.promotionSync.addPromotionToCart(promotionId, productName, price, imageUrl);
    
    if (result.success) {
        console.log('✅ Promotion ajoutée au panier FADIDI');
        return result.product;
    } else {
        console.error('❌ Erreur ajout promotion:', result.error);
        throw new Error(result.error);
    }
};

console.log('🔄 Module de synchronisation Promotions ↔ Panier chargé');