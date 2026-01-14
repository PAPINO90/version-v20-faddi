/**
 * SYSTÈME DE PANIER FADIDI
 * Utilise UNIQUEMENT l'API NestJS et la base de données fadidi_new_db
 * Toutes les commandes sont sauvegardées dans la base de données MySQL
 */

// Configuration de l'API
const API_BASE_URL = 'http://localhost:3000/api';

// Instance globale du panier
let fadidiCart;

// État global du panier
class FadidiCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('fadidi_cart_items') || '[]');
        this.isOpen = false;
        this.deliveryFee = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartDisplay();
        this.updateNavbarCart();
    }

    setupEventListeners() {
        // Boutons du panier
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-cart-action="add"]') || 
                e.target.closest('[data-cart-action="add"]')) {
                const button = e.target.matches('[data-cart-action="add"]') ? 
                               e.target : e.target.closest('[data-cart-action="add"]');
                this.addToCart(button);
            }
        });

        // Gestion des méthodes de paiement
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="payment-method"]')) {
                this.handlePaymentMethodChange(e.target.value);
            }
        });

        // Soumission de commande
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }
    }

    // Ajouter un produit au panier
    addToCart(button) {
        // 1. Essayer de lire les infos depuis les data-attributes (slider, etc)
        const name = button.getAttribute('data-product-name');
        const price = button.getAttribute('data-product-price');
        const image = button.getAttribute('data-product-image');
        let id = button.getAttribute('data-product-id');
        if (name && price) {
            // Always use string id
            id = id && id !== '' ? String(id) : String(Date.now() + Math.random());
            const product = {
                id: id,
                name: name,
                price: parseFloat(price),
                image: image || 'assets/images/1-.png',
                quantity: 1
            };
            // Vérifier si le produit existe déjà
            const existingIndex = this.items.findIndex(item => item.name === product.name && item.price === product.price);
            if (existingIndex > -1) {
                this.items[existingIndex].quantity += 1;
            } else {
                this.items.push(product);
            }
            this.saveCart();
            this.updateCartDisplay();
            this.updateNavbarCart();
            this.showAddToCartNotification(product.name);
            return;
        }
        // 2. Sinon, fallback DOM classique (cartes produits)
        const productCard = button.closest('.fadidi-product-card');
        if (!productCard) return;
        // Récupération améliorée de l'image
        const imgElement = productCard.querySelector('img');
        let productImage = 'assets/images/1-.png';
        if (imgElement && imgElement.src) {
            productImage = imgElement.src;
        }
        const product = {
            id: String(Date.now() + Math.random()),
            name: productCard.querySelector('.fadidi-card-title')?.textContent || 'Produit',
            price: this.extractPrice(productCard.querySelector('.fadidi-card-price')?.textContent || '0'),
            image: productImage,
            quantity: 1
        };
        const existingIndex = this.items.findIndex(item => item.name === product.name && item.price === product.price);
        if (existingIndex > -1) {
            this.items[existingIndex].quantity += 1;
        } else {
            this.items.push(product);
        }
        this.saveCart();
        this.updateCartDisplay();
        this.updateNavbarCart();
        this.showAddToCartNotification(product.name);
    }

    // Ajouter un produit directement (pour compatibilité avec l'ancien système)
    addItem(product) {
        // Vérifier si le produit existe déjà
        const existingIndex = this.items.findIndex(item => 
            item.name === product.name && item.price === product.price
        );

        // Always use string id
        const id = product.id ? String(product.id) : String(Date.now() + Math.random());

        if (existingIndex > -1) {
            this.items[existingIndex].quantity += (product.quantity || 1);
        } else {
            this.items.push({
                id: id,
                name: product.name,
                price: product.price,
                image: product.image || '',
                quantity: product.quantity || 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.updateNavbarCart();
        this.showAddToCartNotification(product.name);
    }

    // Supprimer un produit du panier
    removeFromCart(itemId) {
        // Always compare as string
        const idStr = String(itemId);
        this.items = this.items.filter(item => String(item.id) !== idStr);
        this.saveCart();
        this.updateCartDisplay();
        this.updateNavbarCart();
    }

    // Mettre à jour la quantité
    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = parseInt(newQuantity);
            this.saveCart();
            this.updateCartDisplay();
            this.updateNavbarCart();
        }
    }

    // Calculer les totaux
    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + this.deliveryFee;
        
        return {
            subtotal,
            deliveryFee: this.deliveryFee,
            total
        };
    }

    // Afficher le panier
    openCart() {
        const cart = document.getElementById('new-cart');
        if (cart) {
            cart.style.display = 'block';
            setTimeout(() => cart.classList.add('open'), 10);
            this.isOpen = true;
        }
    }

    // Fermer le panier
    closeCart() {
        const cart = document.getElementById('new-cart');
        if (cart) {
            cart.classList.remove('open');
            setTimeout(() => {
                cart.style.display = 'none';
                this.isOpen = false;
            }, 300);
        }
    }

    // Mettre à jour l'affichage du panier
    updateCartDisplay() {
        const emptyMessage = document.getElementById('cart-empty-message');
        const itemsList = document.getElementById('cart-items-list');
        const cartSummary = document.getElementById('cart-summary');

        if (this.items.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (itemsList) itemsList.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            if (emptyMessage) emptyMessage.style.display = 'none';
            if (itemsList) itemsList.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'block';

            this.renderCartItems();
            this.updateCartSummary();
        }
    }

    // Rendre les articles du panier
    renderCartItems() {
        const container = document.getElementById('cart-items-list');
        if (!container) return;

        container.innerHTML = this.items.map(item => {
            console.log('🖼️ Rendu de l\'item panier:', {
                name: item.name,
                image: item.image,
                imageValid: item.image && !item.image.includes('undefined'),
                imageDefault: item.image === 'assets/images/1-.png'
            });
            
            // S'assurer que l'image est valide
            let imageUrl = item.image;
            if (!imageUrl || imageUrl.includes('undefined') || imageUrl.trim() === '') {
                imageUrl = 'assets/images/1-.png';
                console.log('⚠️ Image corrigée pour:', item.name);
            }
            
            return `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${imageUrl}" alt="${item.name}" class="cart-item-image" 
                     onerror="console.error('❌ Erreur image pour ${item.name}:', this.src); this.src='assets/images/1-.png'">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)} CFA</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
               <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
               <input type="number" class="quantity-input" value="${item.quantity}" 
                   onchange="cart.updateQuantity('${item.id}', this.value)" min="1">
               <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="cart.removeFromCart('${item.id}')">
                        Supprimer
                    </button>
                </div>
            </div>
            `;
        }).join('');
    }

    // Mettre à jour le résumé du panier
    updateCartSummary() {
        const totals = this.calculateTotals();
        
        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total-amount');
        
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(totals.subtotal) + ' CFA';
        if (totalEl) totalEl.textContent = this.formatPrice(totals.total) + ' CFA';
    }

    // Mettre à jour le panier dans la navbar
    updateNavbarCart() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = `(${totalItems})`;
        }

        // Mettre à jour l'icône du panier si elle existe
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Procéder au checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            alert('Votre panier est vide');
            return;
        }

        this.closeCart();
        this.showCheckoutForm();
    }

    // Afficher le formulaire de commande
    showCheckoutForm() {
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.style.display = 'block';
            checkoutForm.scrollIntoView({ behavior: 'smooth' });
            this.updateCheckoutSummary();
        }
    }

    // Retour au panier
    backToCart() {
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.style.display = 'none';
        }
        this.openCart();
    }

    // Mettre à jour le résumé de commande
    updateCheckoutSummary() {
        const container = document.getElementById('checkout-items-summary');
        if (!container) return;

        container.innerHTML = this.items.map(item => `
            <div class="checkout-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Quantité: ${item.quantity}</div>
                </div>
                <div class="item-total">${this.formatPrice(item.price * item.quantity)} CFA</div>
            </div>
        `).join('');

        const totals = this.calculateTotals();
        
        const subtotalEl = document.getElementById('checkout-subtotal');
        const totalEl = document.getElementById('checkout-total');
        
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(totals.subtotal) + ' CFA';
        if (totalEl) totalEl.textContent = this.formatPrice(totals.total) + ' CFA';
    }

    // Gérer le changement de méthode de paiement
    handlePaymentMethodChange(method) {
        // Masquer tous les formulaires de paiement
        document.querySelectorAll('.payment-form-details').forEach(form => {
            form.style.display = 'none';
        });

        // Retirer la classe selected de tous les moyens de paiement
        document.querySelectorAll('.payment-method').forEach(pm => {
            pm.classList.remove('selected');
        });

        // Ajouter la classe selected au moyen choisi
        const selectedMethod = document.querySelector(`input[value="${method}"]`);
        if (selectedMethod) {
            selectedMethod.closest('.payment-method').classList.add('selected');
        }

        // Afficher le formulaire correspondant
        const formId = `${method}-payment-form`;
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'block';
        }
    }

    // Traiter la commande
    async processOrder() {
        try {
            const orderButton = document.getElementById('place-order-btn');
            const btnText = orderButton.querySelector('.btn-text');
            const btnLoading = orderButton.querySelector('.btn-loading');

            // Afficher le loading
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            orderButton.disabled = true;

            // Récupérer les données du formulaire
            const formData = this.collectOrderData();
            
            // Valider les données
            if (!this.validateOrderData(formData)) {
                throw new Error('Données de commande invalides');
            }

            // Créer la commande via l'API
            const order = await this.createOrder(formData);

            // Traiter le paiement
            await this.processPayment(order, formData.paymentMethod);

            // Afficher la confirmation
            this.showOrderConfirmation(order);

            // Vider le panier
            this.clearCart();

        } catch (error) {
            console.error('💥 Erreur lors du traitement de la commande:', error);
            
            // Afficher une erreur plus spécifique selon le type d'erreur
            let errorMessage = 'Erreur lors du traitement de votre commande.';
            
            if (error.message.includes('Impossible de se connecter')) {
                errorMessage = 'Problème de connexion au serveur. Vérifiez votre connexion internet.';
            } else if (error.message.includes('Données de commande invalides')) {
                errorMessage = 'Veuillez vérifier que tous les champs sont correctement remplis.';
            } else if (error.message.includes('API 400')) {
                errorMessage = 'Données de commande invalides. Vérifiez vos informations.';
            } else if (error.message.includes('API 500')) {
                errorMessage = 'Erreur serveur temporaire. Veuillez réessayer dans quelques minutes.';
            }
            
            alert(errorMessage + '\n\nDétails technique: ' + error.message);
        } finally {
            // Remettre le bouton en état normal
            const orderButton = document.getElementById('place-order-btn');
            const btnText = orderButton.querySelector('.btn-text');
            const btnLoading = orderButton.querySelector('.btn-loading');
            
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            orderButton.disabled = false;
        }
    }

    // Collecter les données du formulaire
    collectOrderData() {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
        const totals = this.calculateTotals();

        return {
            customerInfo: {
                name: document.getElementById('customer-name')?.value?.trim(),
                phone: document.getElementById('customer-phone')?.value?.trim(),
                email: document.getElementById('customer-email')?.value?.trim(),
                address: document.getElementById('delivery-address')?.value?.trim(),
                city: document.getElementById('delivery-city')?.value,
                preferredTime: document.getElementById('delivery-time')?.value,
                notes: document.getElementById('delivery-notes')?.value?.trim()
            },
            items: this.items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity
            })),
            totals,
            paymentMethod,
            paymentDetails: this.collectPaymentDetails(paymentMethod)
        };
    }

    // Collecter les détails de paiement
    collectPaymentDetails(method) {
        switch (method) {
            case 'wave':
                return {
                    phone: document.getElementById('wave-phone')?.value?.trim()
                };
            case 'orange':
                return {
                    phone: document.getElementById('orange-phone')?.value?.trim()
                };
            case 'card':
                return {
                    cardNumber: document.getElementById('card-number')?.value?.trim(),
                    expiryDate: document.getElementById('card-expiry')?.value?.trim(),
                    cvv: document.getElementById('card-cvv')?.value?.trim()
                };
            default:
                return {};
        }
    }

    // Valider les données de commande
    validateOrderData(data) {
        const { customerInfo, paymentMethod, paymentDetails } = data;

        // Validation des informations client
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
            alert('Veuillez remplir tous les champs obligatoires');
            return false;
        }

        // Validation du téléphone
        if (!/^[7][0-8][0-9]{7}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
            alert('Numéro de téléphone invalide. Format attendu: 7X XXX XX XX');
            return false;
        }

        // Validation de la méthode de paiement
        if (!paymentMethod) {
            alert('Veuillez sélectionner une méthode de paiement');
            return false;
        }

        // Validation spécifique par méthode de paiement
        switch (paymentMethod) {
            case 'wave':
            case 'orange':
                if (!paymentDetails.phone || !/^[7][0-8][0-9]{7}$/.test(paymentDetails.phone.replace(/\s/g, ''))) {
                    alert('Numéro de téléphone de paiement invalide');
                    return false;
                }
                break;
            case 'card':
                if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
                    alert('Veuillez remplir tous les champs de la carte');
                    return false;
                }
                break;
        }

        return true;
    }

    // Créer la commande via l'API
    async createOrder(orderData) {
        try {
            console.log('🚀 Envoi de la commande à l\'API:', orderData);
            
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerName: orderData.customerInfo.name,
                    customerPhone: orderData.customerInfo.phone,
                    customerEmail: orderData.customerInfo.email,
                    deliveryAddress: orderData.customerInfo.address,
                    deliveryCity: orderData.customerInfo.city,
                    deliveryTime: orderData.customerInfo.preferredTime || '',
                    deliveryNotes: orderData.customerInfo.notes || '',
                    items: orderData.items,
                    subtotal: orderData.totals.subtotal,
                    deliveryFee: orderData.totals.deliveryFee,
                    total: orderData.totals.total,
                    paymentMethod: orderData.paymentMethod,
                    status: 'pending'
                })
            });

            console.log('📡 Réponse de l\'API:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API:', response.status, errorText);
                throw new Error(`Erreur API ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Commande créée avec succès:', result);
            
            // L'API retourne { success: true, message: "...", data: order }
            // Nous retournons directement l'objet order pour simplifier l'usage
            return result.data || result;
            
        } catch (error) {
            console.error('💥 Erreur lors de la création de la commande:', error);
            
            // Si c'est une erreur de connexion
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
            }
            
            throw error;
        }
    }

    // Traiter le paiement
    async processPayment(order, paymentMethod) {
        try {
            console.log(`🔄 Traitement du paiement via ${paymentMethod} pour la commande ${order.id}`);
            
            // Simuler un délai de traitement du paiement
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Pour l'instant, nous considérons que le paiement est réussi
            // Dans un vrai projet, ici vous intégreriez les API de paiement réelles (Wave, Orange Money, etc.)
            
            console.log(`✅ Paiement ${paymentMethod} simulé avec succès pour la commande ${order.id}`);
            
            // Retourner un objet de succès sans faire de mise à jour API supplémentaire
            return {
                success: true,
                paymentMethod: paymentMethod,
                orderId: order.id,
                status: 'paid'
            };
            
        } catch (error) {
            console.error('❌ Erreur lors du traitement du paiement:', error);
            throw new Error('Erreur lors du traitement du paiement');
        }
    }

    // Afficher la confirmation de commande
    showOrderConfirmation(order) {
        console.log('🎉 Affichage de la confirmation pour la commande:', order);
        
        const checkoutForm = document.getElementById('checkout-form');
        const confirmation = document.getElementById('order-confirmation');
        
        if (checkoutForm) checkoutForm.style.display = 'none';
        if (confirmation) {
            confirmation.style.display = 'block';
            
            // Mettre à jour les détails
            const orderIdEl = document.getElementById('confirmed-order-id');
            const totalEl = document.getElementById('confirmed-total');
            const methodEl = document.getElementById('confirmed-payment-method');
            
            // Gérer le numéro de commande
            if (orderIdEl) {
                const orderId = order?.id || 'N/A';
                orderIdEl.textContent = `#${orderId}`;
                console.log('📋 ID de commande:', orderId);
            }
            
            // Gérer le total (essayer différentes propriétés)
            if (totalEl) {
                let total = order?.total || order?.totalAmount || 0;
                if (isNaN(total) || total === 0) {
                    // Calculer à partir du panier si pas disponible dans order
                    const totals = this.calculateTotals();
                    total = totals.total;
                }
                totalEl.textContent = this.formatPrice(total) + ' CFA';
                console.log('💰 Total de la commande:', total);
            }
            
            // Gérer la méthode de paiement
            if (methodEl) {
                const paymentMethod = order?.paymentMethod || 'Non spécifié';
                methodEl.textContent = this.getPaymentMethodText(paymentMethod);
                console.log('💳 Méthode de paiement:', paymentMethod);
            }
            
            confirmation.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Obtenir le texte de la méthode de paiement
    getPaymentMethodText(method) {
        switch (method) {
            case 'wave': return 'Wave';
            case 'orange': return 'Orange Money';
            case 'card': return 'Carte Bancaire';
            default: return method;
        }
    }

    // Vider le panier
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateNavbarCart();
    }

    // Continuer les achats
    continueShopping() {
        const confirmation = document.getElementById('order-confirmation');
        if (confirmation) {
            confirmation.style.display = 'none';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sauvegarder le panier
    saveCart() {
        localStorage.setItem('fadidi_cart_items', JSON.stringify(this.items));
    }

    // Extraire le prix du texte
    extractPrice(priceText) {
        const price = priceText.replace(/[^0-9]/g, '');
        return parseInt(price) || 0;
    }

    // Formater le prix
    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR').format(price);
    }

    // Afficher notification d'ajout au panier
    showAddToCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification-popup';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Produit ajouté au panier !</span>
                <div class="notification-product">${productName}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'apparition
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Suppression automatique
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialiser le panier global
let cart;

// Fonctions globales pour la compatibilité
function openCart() { cart.openCart(); }
function closeCart() { cart.closeCart(); }
function proceedToCheckout() { cart.proceedToCheckout(); }
function backToCart() { cart.backToCart(); }
function continueShopping() { cart.continueShopping(); }

// Fonction pour modifier les boutons existants
function updateAddToCartButtons() {
    document.querySelectorAll('.fadidi-card-btn').forEach(button => {
        if (button.getAttribute('onclick')) {
            // Remplacer l'ancienne fonction par la nouvelle
            button.removeAttribute('onclick');
            button.setAttribute('data-cart-action', 'add');
            button.textContent = 'Ajouter au panier';
        }
    });
}

// CSS pour les notifications
const notificationCSS = `
.cart-notification-popup {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #28a745, #20c997);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 10000;
    opacity: 0;
    transform: translateX(100px);
    transition: all 0.3s ease;
}

.cart-notification-popup.show {
    opacity: 1;
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-content i {
    font-size: 1.2em;
}

.notification-product {
    font-size: 0.9em;
    opacity: 0.9;
    margin-top: 5px;
}
`;

// Ajouter le CSS des notifications
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationCSS;
document.head.appendChild(styleSheet);

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Initialisation du nouveau système de panier FADIDI');
    
    // Créer l'instance du panier
    window.fadidiCart = new FadidiCart();
    cart = window.fadidiCart;
    
    // Modifier les boutons existants
    updateAddToCartButtons();
    
    // Ajouter l'icône du panier dans la navbar si elle n'existe pas
    const navbar = document.querySelector('.navbar .cart-info');
    if (navbar && !navbar.querySelector('.cart-icon')) {
        navbar.innerHTML = `
            <div class="cart-icon" onclick="openCart()">
                🛒 Panier : <span id="cart-count">(0)</span> produit(s)
                <div class="cart-badge">0</div>
            </div>
        `;
    }
    
    console.log('✅ Nouveau système de panier FADIDI initialisé');
});

// Exports pour l'utilisation dans d'autres scripts
window.FadidiCart = FadidiCart;
window.cart = cart;

// ============= FONCTION DE COMPATIBILITÉ =============
// Pour que les anciens boutons onclick="addToCart()" fonctionnent
window.addToCart = function(productName, productPrice, productImage = '', productId = null) {
    console.log('🔄 Fonction de compatibilité addToCart appelée:', { 
        productName, 
        productPrice, 
        productImage,
        imageType: typeof productImage,
        imageEmpty: productImage === '',
        imageTrimmed: productImage ? productImage.trim() : 'N/A'
    });
    
    // Attendre que fadidiCart soit initialisé
    if (!window.fadidiCart) {
        setTimeout(() => {
            window.addToCart(productName, productPrice, productImage, productId);
        }, 100);
        return;
    }

    // TOUJOURS rechercher l'image dans le DOM pour s'assurer qu'on a la bonne
    let finalImage = 'assets/images/1-.png'; // Image par défaut
    
    console.log('🔍 Recherche de l\'image dans le DOM pour le produit:', productName);
    
    // Recherche de l'image dans le DOM (plus robuste)
    const allProducts = document.querySelectorAll('.fadidi-product-card');
    let imageFound = false;
    
    for (const card of allProducts) {
        const cardName = card.querySelector('.fadidi-card-title')?.textContent?.trim();
        const cardPriceEl = card.querySelector('.fadidi-card-price');
        
        if (!cardName || !cardPriceEl) continue;
        
        // Extraire le prix numérique de la carte
        const cardPriceText = cardPriceEl.textContent;
        const cardPriceNum = parseInt(cardPriceText.replace(/[^0-9]/g, ''));
        
        console.log('🔍 Comparaison:', {
            cardName,
            productName,
            cardPriceNum,
            productPrice: parseInt(productPrice),
            nameMatch: cardName === productName,
            priceMatch: cardPriceNum === parseInt(productPrice)
        });
        
        // Correspondance exacte du nom et du prix
        if (cardName === productName && cardPriceNum === parseInt(productPrice)) {
            const cardImage = card.querySelector('img')?.src;
            if (cardImage && !cardImage.includes('1-.png')) {
                finalImage = cardImage;
                imageFound = true;
                console.log('✅ Image trouvée dans le DOM:', finalImage);
                break;
            }
        }
    }
    
    // Si pas trouvé dans le DOM, utiliser l'image fournie (si valide)
    if (!imageFound && productImage && typeof productImage === 'string' && productImage.trim() !== '' && !productImage.includes('undefined')) {
        finalImage = productImage.trim();
        console.log('🖼️ Utilisation de l\'image fournie:', finalImage);
    }
    
    if (!imageFound && (!productImage || productImage.includes('undefined'))) {
        console.log('⚠️ Image par défaut utilisée');
    }

    const product = {
        id: productId || Date.now(),
        name: productName,
        price: parseFloat(productPrice),
        image: finalImage,
        quantity: 1
    };

    // Utiliser la méthode addItem du nouveau système
    window.fadidiCart.addItem(product);
    
    // Feedback visuel
    console.log('✅ Produit ajouté via fonction de compatibilité:', product);
};

// Fonctions globales pour l'ouverture/fermeture du panier
window.openCart = function() {
    if (window.fadidiCart) {
        window.fadidiCart.openCart();
    }
};

window.closeCart = function() {
    if (window.fadidiCart) {
        window.fadidiCart.closeCart();
    }
};

// Fonction pour aller au checkout
window.goToCheckout = function() {
    if (window.fadidiCart) {
        window.fadidiCart.goToCheckout();
    }
};

// Fonction pour retourner au panier
window.backToCart = function() {
    if (window.fadidiCart) {
        window.fadidiCart.backToCart();
    }
};