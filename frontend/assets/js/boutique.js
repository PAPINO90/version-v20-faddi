// Variables globales - version nettoyée
// Modifié au début du fichier: Chargez le panier depuis localStorage au démarrage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartList = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const paiementSection = document.getElementById('paiement');
const panierSection = document.getElementById('panier');
const clientInfoSection = document.getElementById('client-info');
const cartCountElement = document.getElementById('cart-count');

// Fonction pour ajouter un produit au panier (version corrigée)
function addToCart(productName, productPrice) {
    console.log("Ajout au panier:", productName, productPrice);
    
    // Assurer que le prix est un nombre
    const price = Number(productPrice);
    
    // Ajouter au panier
    cartItems.push({ name: productName, price: price });
    
    // IMPORTANT: Sauvegarder dans localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Mettre à jour l'affichage du panier
    updateCart();
    
    // Afficher une notification
    showAddedToCartNotification(productName);
}

// Modifier la fonction updateCart pour garantir qu'elle fonctionne correctement
function updateCart() {
    // Vérifier si les éléments DOM existent
    if (!cartList || !totalPriceElement || !cartCountElement) {
        console.error("Éléments DOM du panier non trouvés", {
            cartList: !!cartList,
            totalPriceElement: !!totalPriceElement,
            cartCountElement: !!cartCountElement
        });
        return;
    }
    
    // Réinitialiser la liste
    cartList.innerHTML = '';
    let totalPrice = 0;

    // Vérifier si le panier est vide
    if (cartItems.length === 0) {
        // Ajouter un message indiquant que le panier est vide
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-cart-message';
        emptyMessage.textContent = 'Votre panier est vide. Ajoutez des produits pour passer au paiement.';
        cartList.appendChild(emptyMessage);
        
        // Désactiver visuellement le bouton de paiement
        if (checkoutBtn) {
            checkoutBtn.classList.add('disabled-btn');
        }
    } else {
        // Afficher les articles
        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price} CFA</span>
                <button onclick="removeFromCart(${index})">Supprimer</button>
            `;
            cartList.appendChild(li);
            totalPrice += item.price;
        });
        
        // Activer le bouton de paiement
        if (checkoutBtn) {
            checkoutBtn.classList.remove('disabled-btn');
        }
    }

    // Mettre à jour le prix total et le compteur
    totalPriceElement.textContent = `Total : ${totalPrice} CFA`;
    cartCountElement.textContent = cartItems.length;
}

// Ajouter cette fonction au document.addEventListener('DOMContentLoaded'...)
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, initialisation des éléments de la boutique...");
    
    // IMPORTANT: Charger le panier depuis localStorage au démarrage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        console.log("Panier chargé depuis localStorage:", cartItems);
        updateCart();
    }
    
    
});



// Assurez-vous que les sélecteurs DOM sont corrects
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, initialisation du panier...");
    
    // Vérifier que ces éléments existent dans votre HTML
    const cartCountElement = document.getElementById('cart-count');
    const totalPriceElement = document.querySelector('#total-price') || document.querySelector('.total-price');
    const cartList = document.getElementById('cart-items') || document.querySelector('.cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const paiementSection = document.getElementById('paiement');
    const panierSection = document.getElementById('panier');
    const clientInfoSection = document.getElementById('client-info');
    
    console.log("Éléments DOM trouvés:", {
        cartCountElement: !!cartCountElement,
        totalPriceElement: !!totalPriceElement,
        cartList: !!cartList,
        checkoutBtn: !!checkoutBtn,
        paiementSection: !!paiementSection,
        panierSection: !!panierSection,
        clientInfoSection: !!clientInfoSection
    });
    
    // Charger le panier depuis localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        console.log("Panier chargé:", cartItems);
        updateCart(); // Mettre à jour l'affichage
    }
    
    // Gérer le bouton "Passer au paiement"
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log("Clic sur le bouton de paiement");
            // Vérifier si le panier est vide
            if (!cartItems || cartItems.length === 0) {
                alert("Votre panier est vide. Veuillez ajouter des produits avant de passer au paiement.");
                
                // Faire défiler jusqu'à la section de produits
                const productSection = document.querySelector('.product-grid');
                if (productSection) {
                    productSection.scrollIntoView({ behavior: 'smooth' });
                }
                return; // Empêcher l'affichage de la section de paiement
            }
            
            // Si le panier n'est pas vide, afficher d'abord le formulaire client
            if (panierSection) panierSection.style.display = 'none';
            if (clientInfoSection) clientInfoSection.style.display = 'block';
            
            // Faire défiler jusqu'au formulaire client
            if (clientInfoSection) {
                clientInfoSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Ajouter également un gestionnaire au bouton continuer vers le paiement
    const continueButton = document.getElementById('continue-to-payment-btn');
    if (continueButton) {
        console.log("Bouton continuer vers paiement trouvé");
        continueButton.addEventListener('click', function() {
            console.log("Clic sur continuer vers paiement");
            continueToPayment();
        });
    }

    // Gestion de l'ouverture et de la fermeture du menu
    const menuButton = document.getElementById('menuButton');
    const menuContent = document.getElementById('menuContent');
    
    if (menuButton && menuContent) {
        menuButton.addEventListener('click', () => {
            if (menuContent.style.display === 'block') {
                menuContent.style.display = 'none'; // Masquer le menu
            } else {
                menuContent.style.display = 'block'; // Afficher le menu
            }
        });
    }
    
    // Gestion du bouton de fermeture de publicité
    const closePubliciteBtn = document.getElementById('close-publicite');
    if (closePubliciteBtn) {
        closePubliciteBtn.addEventListener('click', function () {
            const publicite = document.getElementById('publicite');
            if (publicite) {
                publicite.style.display = 'none';
            }
        });
    }
    
    // Validation en temps réel des champs
    const waveNumber = document.getElementById('wave-number');
    if (waveNumber) {
        waveNumber.addEventListener('input', function() {
            const errorElement = document.getElementById('wave-error');
            // Vérifier si le numéro a entre 8 et 12 chiffres
            const isValid = /^\d{8,12}$/.test(this.value.trim());
            
            if (this.value.trim() && !isValid) {
                if (errorElement) errorElement.style.display = 'block';
                this.classList.add('invalid');
            } else {
                if (errorElement) errorElement.style.display = 'none';
                this.classList.remove('invalid');
            }
        });
    }
    
    // Validation du numéro Orange Money
    const orangeNumber = document.getElementById('orange-number');
    if (orangeNumber) {
        orangeNumber.addEventListener('input', function() {
            const errorElement = document.getElementById('orange-error');
            // Vérifier si le numéro a entre 8 et 12 chiffres
            const isValid = /^\d{8,12}$/.test(this.value.trim());
            
            if (this.value.trim() && !isValid) {
                if (errorElement) errorElement.style.display = 'block';
                this.classList.add('invalid');
            } else {
                if (errorElement) errorElement.style.display = 'none';
                this.classList.remove('invalid');
            }
        });
    }
    
    // Validation du numéro de téléphone client
    const clientPhone = document.getElementById('client-phone');
    if (clientPhone) {
        clientPhone.addEventListener('input', function() {
            const isValid = /^\d{8,12}$/.test(this.value.trim());
            
            if (this.value.trim() && !isValid) {
                this.classList.add('invalid');
                this.setCustomValidity('Le numéro de téléphone doit contenir entre 8 et 12 chiffres');
            } else {
                this.classList.remove('invalid');
                this.setCustomValidity('');
            }
        });
    }
    
    // Charger les produits
    setTimeout(function() {
        console.log("Chargement initial des produits...");
        loadPublishedProducts();
    }, 500);
    
    // Écouter les changements dans le localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'fadidiProducts') {
            console.log("Mise à jour détectée dans le localStorage");
            loadPublishedProducts();
        }
    });
    
    // DEBUG - Afficher les produits dans localStorage
    console.log("===== DEBUG PRODUITS =====");
    const debugProducts = JSON.parse(localStorage.getItem('fadidiProducts')) || [];
    console.log("Tous les produits:", debugProducts);
    console.log("Produits publiés:", debugProducts.filter(p => p.status === 'published'));
    console.log("=========================");
});

// Fonction pour ajouter un produit au panier (version déboguée)
function addToCart(productName, productPrice) {
    console.log("Ajout au panier:", productName, productPrice);
    
    // Assurer que le prix est un nombre
    const price = Number(productPrice);
    if (isNaN(price)) {
        console.error("Prix invalide:", productPrice);
        return;
    }
    
    // Récupérer les éléments actuels du panier
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Ajouter le produit au panier
    cartItems.push({ name: productName, price: price });
    console.log("Panier après ajout:", cartItems);
    
    // Enregistrer le panier mis à jour dans localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Mettre à jour l'affichage
    updateCart();
    
    // Afficher une notification
    showAddedToCartNotification(productName);
}

// Fonction pour mettre à jour l'affichage du panier
function updateCart() {
    console.log("Mise à jour du panier...");
    
    // Sélectionner les éléments DOM nécessaires
    const cartCountElement = document.getElementById('cart-count');
    const totalPriceElement = document.querySelector('#total-price') || document.querySelector('.total-price');
    const cartList = document.getElementById('cart-items') || document.querySelector('.cart-items');
    
    if (!cartCountElement) {
        console.error("Élément 'cart-count' non trouvé!");
        return;
    }
    
    // Mettre à jour le compteur d'articles
    cartCountElement.textContent = cartItems.length;
    console.log("Nombre d'articles mis à jour:", cartItems.length);
    
    // Si cartList existe, mettre à jour son contenu
    if (cartList) {
        cartList.innerHTML = ''; // Effacer le contenu actuel
        
        if (cartItems.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-cart-message';
            emptyMessage.textContent = 'Votre panier est vide.';
            cartList.appendChild(emptyMessage);
        } else {
            // Ajouter chaque produit à la liste
            cartItems.forEach((item, index) => {
                const cartItem = document.createElement('li');
                cartItem.innerHTML = `
                    <span>${item.name}</span>
                    <span>${item.price} CFA</span>
                    <button onclick="removeFromCart(${index})">Supprimer</button>
                `;
                cartList.appendChild(cartItem);
            });
        }
    }
    
    // Calculer le total
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    console.log("Total calculé:", totalPrice);
    
    // Mettre à jour l'affichage du total si l'élément existe
    if (totalPriceElement) {
        totalPriceElement.textContent = `Total : ${totalPrice} CFA`;
    }
}

// Fonction pour supprimer un élément du panier
function removeFromCart(index) {
    console.log("Suppression de l'élément à l'index:", index);
    
    // Vérifier que l'index est valide
    if (index >= 0 && index < cartItems.length) {
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }
}

// Fonction pour afficher une notification
function showAddedToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${productName} a été ajouté au panier!`;
    document.body.appendChild(notification);
    
    // Afficher la notification avec animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Masquer et supprimer après quelques secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 2000);
}
// Fonction pour revenir au panier depuis le formulaire client
function backToCart() {
    if (clientInfoSection) clientInfoSection.style.display = 'none';
    if (panierSection) panierSection.style.display = 'block';
    if (panierSection) panierSection.scrollIntoView({ behavior: 'smooth' });
}

// Fonction pour continuer vers le paiement après le formulaire client
// Fonction pour continuer vers le paiement après le formulaire client
function continueToPayment() {
    console.log("Exécution de continueToPayment()");
    
    // Récupérer les éléments DOM
    const clientInfoSection = document.getElementById('client-info');
    const paiementSection = document.getElementById('paiement');
    
    // Récupérer les valeurs des champs
    const clientName = document.getElementById('client-name')?.value.trim();
    const clientPhone = document.getElementById('client-phone')?.value.trim();
    const clientAddress = document.getElementById('client-address')?.value.trim();
    const clientCity = document.getElementById('client-city')?.value.trim();
    
    console.log("Informations client:", { clientName, clientPhone, clientAddress, clientCity });
    
    // Validation des champs
    if (!clientName) {
        alert('Veuillez indiquer votre nom complet');
        document.getElementById('client-name')?.focus();
        return;
    }
    
    if (!clientPhone) {
        alert('Veuillez indiquer votre numéro de téléphone');
        document.getElementById('client-phone')?.focus();
        return;
    }
    
    if (!clientAddress) {
        alert('Veuillez indiquer votre adresse de livraison');
        document.getElementById('client-address')?.focus();
        return;
    }
    
    if (!clientCity) {
        alert('Veuillez indiquer votre ville');
        document.getElementById('client-city')?.focus();
        return;
    }
    
    // Valider le format du numéro de téléphone
    if (!/^\d{8,12}$/.test(clientPhone)) {
        alert('Le numéro de téléphone doit contenir entre 8 et 12 chiffres');
        document.getElementById('client-phone')?.focus();
        return;
    }
    
    // Si tout est valide, passer à la section paiement
    if (clientInfoSection) clientInfoSection.style.display = 'none';
    if (paiementSection) {
        paiementSection.style.display = 'block';
        paiementSection.scrollIntoView({ behavior: 'smooth' });
        
        // Initialiser le formulaire de paiement avec aucune option sélectionnée
        const paymentFields = document.querySelectorAll('.payment-fields');
        paymentFields.forEach(field => field.style.display = 'none');
    } else {
        console.error("Section paiement non trouvée!");
    }
}

// Fonction pour sélectionner un mode de paiement
function selectPayment(method) {
    console.log("Sélection du mode de paiement:", method);
    
    // Masquer tous les champs de paiement
    const paymentFields = document.querySelectorAll('.payment-fields');
    paymentFields.forEach(field => field.style.display = 'none');
    
    // Supprimer la classe active de tous les boutons de paiement
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => option.classList.remove('active'));
    
    // Ajouter la classe active à l'option sélectionnée
    const selectedOption = document.querySelector(`.payment-option[onclick="selectPayment('${method}')"]`);
    if (selectedOption) selectedOption.classList.add('active');
    
    // Afficher les champs correspondants
    const selectedFields = document.getElementById(`${method}-fields`);
    if (selectedFields) {
        selectedFields.style.display = 'block';
        
        // Générer des QR codes si nécessaire
        if (method === 'wave') {
            generateQRCode('wave-qr-code', 'WAVE:778539090');
        } else if (method === 'orange-money') {
            generateQRCode('orange-qr-code', 'ORANGE:776543210');
        }
    }
}

// Fonction pour générer des QR codes
function generateQRCode(elementId, data) {
    const element = document.getElementById(elementId);
    if (element && typeof QRCode !== 'undefined') {
        // Effacer le contenu précédent
        element.innerHTML = '';
        
        try {
            // Générer le QR code
            new QRCode(element, {
                text: data,
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error("Erreur lors de la génération du QR code:", error);
            element.innerHTML = '<p style="color: red;">Échec de génération du QR code</p>';
        }
    }
}

// Fonction pour traiter le paiement
// SECURITE PAIEMENTTTTTTTTTT DEBUTTTTTTTTTTTTTTTTTT
function processPayment() {
    console.log("Traitement du paiement...");
    
    // Vérifier la méthode de paiement sélectionnée
    const visaFields = document.getElementById('visa-fields');
    const waveFields = document.getElementById('wave-fields');
    const orangeMoneyFields = document.getElementById('orange-money-fields');
    
    let isValid = false;
    let paymentMethod = "";
    let errorMessage = "";
    
    // Vérifier si une méthode de paiement a été sélectionnée
    if (visaFields && visaFields.style.display !== 'none') {
        const cardNumber = document.getElementById('card-number')?.value?.trim();
        const cardExpiry = document.getElementById('card-expiry')?.value?.trim();
        const cardCvv = document.getElementById('card-cvv')?.value?.trim();
        
        if (!cardNumber || !cardExpiry || !cardCvv) {
            errorMessage = "Veuillez remplir tous les champs de la carte bancaire.";
        } else {
            isValid = true;
            paymentMethod = "Visa";
        }
    } 
    else if (waveFields && waveFields.style.display !== 'none') {
        const waveNumber = document.getElementById('wave-number')?.value?.trim();
        
        if (!waveNumber) {
            errorMessage = "Veuillez entrer votre numéro Wave.";
        } else {
            isValid = true;
            paymentMethod = "Wave";
        }
    } 
    else if (orangeMoneyFields && orangeMoneyFields.style.display !== 'none') {
        const orangeNumber = document.getElementById('orange-number')?.value?.trim();
        
        if (!orangeNumber) {
            errorMessage = "Veuillez entrer votre numéro Orange Money.";
        } else {
            isValid = true;
            paymentMethod = "Orange Money";
        }
    } 
    else {
        errorMessage = "Veuillez sélectionner une méthode de paiement.";
    }
    
    if (!isValid) {
        alert(errorMessage);
        return;
    }
    
    // Génération de l'ID de commande
    const orderId = "CMD-" + Date.now();
    
    // IMPORTANT: Récupérer les informations du client
    const clientName = document.getElementById('client-name')?.value?.trim() || 'Client';
    const clientPhone = document.getElementById('client-phone')?.value?.trim() || '';
    const clientEmail = document.getElementById('client-email')?.value?.trim() || '';
    const clientAddress = document.getElementById('client-address')?.value?.trim() || '';
    const clientCity = document.getElementById('client-city')?.value?.trim() || '';
    
    // IMPORTANT: Créer l'objet commande avec les articles RÉELS du panier
    const orderItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);
    
    // AJOUT DU BLOC ESCROW ICI
    const orderObject = {
        orderId: orderId,
        customerInfo: {
            name: clientName,
            phone: clientPhone,
            email: clientEmail,
            address: clientAddress + (clientCity ? ", " + clientCity : "")
        },
        orderDate: new Date().toISOString(),
        items: orderItems,
        totalAmount: totalAmount,
        status: 'processing',
        paymentMethod: paymentMethod,
        paymentStatus: "escrow", // Ajout pour suivi du paiement sécurisé
        escrow: {
            amount: totalAmount,
            locked: true,
            released: false,
            releasedAt: null,
            refunded: false,
            refundedAt: null
        }
    };
    
    // IMPORTANT: SAUVEGARDER LA COMMANDE dans localStorage
    let existingOrders = [];
    try {
        const savedOrders = localStorage.getItem('fadidiOrders');
        if (savedOrders) {
            existingOrders = JSON.parse(savedOrders);
            if (!Array.isArray(existingOrders)) existingOrders = [];
        }
    } catch (e) {
        console.error("Erreur lors de la récupération des commandes:", e);
    }
    
    // Ajouter la nouvelle commande
    existingOrders.push(orderObject);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('fadidiOrders', JSON.stringify(existingOrders));
    console.log("Commande enregistrée avec succès:", orderObject);
    
    // Vider le panier
    cartItems = [];
    localStorage.removeItem('cartItems');
    
    // Mettre à jour tous les éléments d'affichage du panier
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = "0";
    
    const cartList = document.getElementById('cart-items');
    if (cartList) cartList.innerHTML = '<div class="empty-cart-message">Votre panier est vide.</div>';
    
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) totalPriceElement.textContent = "Total : 0 CFA";
    
    // Masquer les sections
    const panierSection = document.getElementById('panier');
    if (panierSection) panierSection.style.display = 'none';
    
    const paiementSection = document.getElementById('paiement');
    if (paiementSection) paiementSection.style.display = 'none';
    
    const clientInfoSection = document.getElementById('client-info');
    if (clientInfoSection) clientInfoSection.style.display = 'none';
    
    // Afficher la confirmation de paiement
    showConfirmationMessage(orderId);
}

// PROCESS PAIEMENTTTTTTTTTTT FNNNNNNNNNNNNNNNNNNNNNN

// Fonction pour afficher le message de confirmation de paiement
function showConfirmationMessage(orderId) {
    // Créer un nouvel élément pour la confirmation
    const confirmationSection = document.createElement('div');
    confirmationSection.id = 'payment-confirmation';
    confirmationSection.className = 'payment-confirmation';
    
    // Définir le contenu HTML avec l'animation et les détails
    confirmationSection.innerHTML = `
        <div class="confirmation-box">
            <div class="confirmation-header">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <h2>Paiement effectué avec succès!</h2>
            </div>
            <div class="confirmation-content">
                <p>Nous vous remercions pour votre commande.</p>
                <div class="order-details">
                    <p><strong>Numéro de commande:</strong> ${orderId}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <p>Un email de confirmation a été envoyé à votre adresse.</p>
                <p>Vous pouvez suivre votre commande dans la section <a href="commande.html?order=${orderId}">Suivi de commande</a>.</p>
                <button class="continue-shopping-btn" onclick="returnToShop()">Continuer mes achats</button>
            </div>
        </div>
    `;
    
    // Ajouter la section au document body
    document.body.appendChild(confirmationSection);
    
    // Faire défiler jusqu'à la confirmation
    confirmationSection.scrollIntoView({ behavior: 'smooth' });
    
    // Définir un retour automatique après un délai (10 secondes)
    setTimeout(function() {
        returnToShop();
    }, 10000); // 10 secondes
}

// Fonction pour retourner à la boutique après la confirmation
function returnToShop() {
    console.log("Retour à la boutique...");
    
    // Supprimer la confirmation si elle existe
    const confirmationSection = document.getElementById('payment-confirmation');
    if (confirmationSection) {
        confirmationSection.remove();
    }
    
    // Recharger la page pour un état propre
    window.location.href = window.location.pathname;
}

// Ancien nom de la fonction pour la compatibilité
function finishShopping() {
    returnToShop();
}
// Fonction pour afficher la confirmation de paiement
function showPaymentConfirmation() {
    console.log("Affichage de la confirmation de paiement");
    
    // Masquer la section de paiement
    const paiementSection = document.getElementById('paiement');
    if (paiementSection) paiementSection.style.display = 'none';
    
    // Créer un élément pour la confirmation
    const confirmationSection = document.createElement('div');
    confirmationSection.id = 'payment-confirmation';
    confirmationSection.className = 'section payment-confirmation';
    
    // Générer un numéro de commande unique
    const orderNumber = 'CMD-' + Date.now().toString().substring(3);
    
    // Ajouter le contenu HTML
    confirmationSection.innerHTML = `
        <div class="confirmation-box">
            <div class="confirmation-header">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <h2>Paiement effectué avec succès!</h2>
            </div>
            <div class="confirmation-content">
                <p>Nous vous remercions pour votre commande.</p>
                <div class="order-details">
                    <p><strong>Numéro de commande:</strong> ${orderNumber}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Montant total:</strong> ${getCartTotal()} CFA</p>
                </div>
                <p>Un email de confirmation a été envoyé à votre adresse.</p>
                <p>Vous pouvez suivre votre commande dans la section <a href="commande.html">Suivi de commande</a>.</p>
                <button class="continue-shopping-btn" onclick="backToShopping()">Continuer mes achats</button>
            </div>
        </div>
    `;
    
    // Ajouter la section au document
    document.body.appendChild(confirmationSection);
    
    // Faire défiler jusqu'à la confirmation
    confirmationSection.scrollIntoView({ behavior: 'smooth' });
    
    // Vider le panier après une commande réussie
    emptyCart();
}

// Fonction pour calculer le total du panier
function getCartTotal() {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
}

// Fonction pour vider le panier
function emptyCart() {
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
}

// Fonction pour retourner à la boutique
function backToShopping() {
    const confirmationSection = document.getElementById('payment-confirmation');
    if (confirmationSection) document.body.removeChild(confirmationSection);
    
    // Afficher la section des produits
    window.scrollTo({ top: 0, behavior: 'smooth' });
    location.reload();
}
// Fonction pour sélectionner un mode de paiement
function selectPayment(method) {
    console.log("Sélection du mode de paiement:", method);
    
    // Masquer tous les champs de paiement
    document.querySelectorAll('.payment-fields').forEach(field => {
        field.style.display = 'none';
    });

    // Afficher uniquement les champs correspondant au mode de paiement sélectionné
    if (method === 'visa') {
        const visaFields = document.getElementById('visa-fields');
        if (visaFields) visaFields.style.display = 'block';
    } else if (method === 'wave') {
        const waveFields = document.getElementById('wave-fields');
        if (waveFields) waveFields.style.display = 'block';
        generateQRCode('wave-qr-code', 'https://wave.com/payment-link');
    } else if (method === 'orange-money') {
        const orangeMoneyFields = document.getElementById('orange-money-fields');
        if (orangeMoneyFields) orangeMoneyFields.style.display = 'block';
        generateQRCode('orange-qr-code', 'https://orange-money.com/payment-link');
    }
    
    // Mettre en évidence l'option sélectionnée
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Ajouter la classe 'selected' à l'option sélectionnée
    const selectedOption = document.querySelector(`.payment-option[onclick*="selectPayment('${method}')"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
}

// Fonction pour générer un QR code
function generateQRCode(elementId, data) {
    const qrCodeContainer = document.getElementById(elementId);
    if (!qrCodeContainer) {
        console.error("Conteneur QR code non trouvé:", elementId);
        return;
    }
    
    qrCodeContainer.innerHTML = ''; // Réinitialiser le conteneur

    // Vérifier si QRCode est défini (bibliothèque chargée)
    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(qrCodeContainer, data, { width: 150, height: 150 }, function (error) {
            if (error) {
                console.error('Erreur lors de la génération du QR code :', error);
            }
        });
    } else {
        console.error("La bibliothèque QRCode n'est pas chargée");
        qrCodeContainer.textContent = "QR Code non disponible";
    }
}

// Fonction pour traiter le paiement
// Fo// Fonction pour traiter le paiement - complètement simplifiée
// Fonction pour traiter le paiement avec sauvegarde des commandes
function processPayment() {
    // Validation du formulaire de paiement
    const visaFields = document.getElementById('visa-fields');
    const waveFields = document.getElementById('wave-fields');
    const orangeMoneyFields = document.getElementById('orange-money-fields');
    
    // Simple validation - si besoin d'une validation plus complète, vous pouvez la réintégrer
    if ((visaFields && visaFields.style.display === 'block') || 
        (waveFields && waveFields.style.display === 'block') || 
        (orangeMoneyFields && orangeMoneyFields.style.display === 'block')) {
        
        // Créer ID de commande
        const orderId = "CMD-" + Date.now();
        
        // Déterminer le mode de paiement sélectionné
        let paymentMethod = "Non spécifié";
        if (visaFields && visaFields.style.display === 'block') paymentMethod = "Carte bancaire";
        if (waveFields && waveFields.style.display === 'block') paymentMethod = "Wave";
        if (orangeMoneyFields && orangeMoneyFields.style.display === 'block') paymentMethod = "Orange Money";
        
        // Récupérer les informations du client
        const clientName = document.getElementById('client-name')?.value?.trim() || 'Client';
        const clientPhone = document.getElementById('client-phone')?.value?.trim() || '';
        const clientEmail = document.getElementById('client-email')?.value?.trim() || '';
        const clientAddress = document.getElementById('client-address')?.value?.trim() || '';
        const clientCity = document.getElementById('client-city')?.value?.trim() || '';
        
        // Récupérer les articles du panier
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
        
        // Créer l'objet commande
        const orderObject = {
            orderId: orderId,
            orderDate: new Date().toISOString(),
            status: 'processing',
            customerInfo: {
                name: clientName,
                phone: clientPhone,
                email: clientEmail,
                address: clientAddress + (clientCity ? ", " + clientCity : "")
            },
            items: cartItems,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod
        };
        
        // IMPORTANT: Sauvegarder la commande dans localStorage
        let existingOrders = [];
        try {
            const savedOrders = localStorage.getItem('fadidiOrders');
            if (savedOrders) {
                existingOrders = JSON.parse(savedOrders);
                if (!Array.isArray(existingOrders)) existingOrders = [];
            }
        } catch (e) {
            console.error("Erreur lors du chargement des commandes:", e);
            existingOrders = [];
        }
        
        // Ajouter la nouvelle commande
        existingOrders.push(orderObject);
        localStorage.setItem('fadidiOrders', JSON.stringify(existingOrders));
        console.log("Commande enregistrée avec ID:", orderId);
        
        // ÉTAPE 1 : VIDER COMPLÈTEMENT LE PANIER
        clearCartCompletely();
        
        // ÉTAPE 2 : AFFICHER LA CONFIRMATION
        showOrderConfirmation(orderId);
        
        // ÉTAPE 3 : PROGRAMMER LA REDIRECTION AUTOMATIQUE
        setTimeout(() => {
            // Redirection complète vers la page d'accueil
            window.location.href = window.location.pathname;
        }, 10000);
    } else {
        alert("Veuillez sélectionner un mode de paiement");
    }
}




// Fonction pour effacer COMPLÈTEMENT le panier - ne laisse aucune trace
function clearCartCompletely() {
    // 1. Vider le tableau en mémoire
    window.cartItems = [];
    
    // 2. Supprimer du localStorage (ne pas utiliser setItem avec tableau vide)
    localStorage.removeItem('cartItems');
    
    // 3. Réinitialiser tous les compteurs et éléments visuels
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = "0";
    
    const cartList = document.getElementById('cart-items');
    if (cartList) cartList.innerHTML = '<div class="empty-cart-message">Votre panier est vide.</div>';
    
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) totalPriceElement.textContent = "Total : 0 CFA";
    
    // 4. Masquer toutes les sections de commande pour qu'elles ne soient plus visibles
    const sections = ['panier', 'client-info', 'paiement'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.style.display = 'none';
    });
}

// Fonction pour afficher la confirmation de commande
function showOrderConfirmation(orderId) {
    // Supprimer toute confirmation existante
    const existingConfirmation = document.getElementById('payment-confirmation');
    if (existingConfirmation) existingConfirmation.remove();
    
    // Créer la confirmation
    const confirmation = document.createElement('div');
    confirmation.id = 'payment-confirmation';
    confirmation.style.position = 'fixed';
    confirmation.style.top = '0';
    confirmation.style.left = '0';
    confirmation.style.width = '100%';
    confirmation.style.height = '100%';
    confirmation.style.backgroundColor = 'rgba(0,0,0,0.85)';
    confirmation.style.display = 'flex';
    confirmation.style.justifyContent = 'center';
    confirmation.style.alignItems = 'center';
    confirmation.style.zIndex = '9999';
    
    // Contenu
    confirmation.innerHTML = `
        <div style="background: white; max-width: 500px; width: 90%; padding: 30px; border-radius: 10px; text-align: center;">
            <svg width="80" height="80" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" stroke="#4CAF50" stroke-width="2" style="stroke-dasharray: 166; stroke-dashoffset: 0; animation: circle-fill 0.6s ease-in-out;"></circle>
                <path d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="#4CAF50" stroke-width="2" style="stroke-dasharray: 48; stroke-dashoffset: 0; animation: check-stroke 0.6s ease-in-out;"></path>
            </svg>
            
            <h2 style="color: #4CAF50; margin-top: 15px;">Paiement effectué avec succès!</h2>
            
            <div style="margin: 20px 0; text-align: center;">
                <p>Nous vous remercions pour votre commande.</p>
                <div style="background:rgba(0, 0, 0, 0.8);; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: left;">
                    <p><strong>Numéro de commande:</strong> ${orderId}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
            
            <button onclick="window.location.href = window.location.pathname" style="background: #ff8c00; color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; cursor: pointer;">
                Continuer mes achats
            </button>
        </div>
    `;
    
    // Ajouter au document
    document.body.appendChild(confirmation);
    
    // Style pour les animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes circle-fill {
            0% { stroke-dashoffset: 166; }
            100% { stroke-dashoffset: 0; }
        }
        @keyframes check-stroke {
            0% { stroke-dashoffset: 48; }
            100% { stroke-dashoffset: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Méthode de compatibilité 
function returnToShop() {
    window.location.href = window.location.pathname;
}
// Fonction auxiliaire pour ajouter une animation de secousse
function addShakeAnimation(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }
}

// Fonction pour réinitialiser le panier
function resetCart() {
    // Vider le tableau
    cartItems = [];
    
    // Réinitialiser l'affichage
    if (cartList) cartList.innerHTML = '';
    if (totalPriceElement) totalPriceElement.textContent = 'Total : 0 CFA';
    if (cartCountElement) cartCountElement.textContent = '0';

    // Réafficher la section du panier
    if (panierSection) panierSection.style.display = 'block';

    // Masquer les autres sections
    if (paiementSection) paiementSection.style.display = 'none';
    if (clientInfoSection) clientInfoSection.style.display = 'none';
    
    // Mettre à jour le localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Appeler updateCart pour mettre à jour l'interface
    updateCart();
}

// Fonction pour rechercher un produit via l'API
async function searchProduct() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchText = searchInput.value.trim();
    
    // Vérification stricte du nom de page avant toute recherche produit
    const knownPages = [
        'index.html',
        'boutique.html',
        'promotion.html',
        'suivi-commande.html',
        'haut-game.html',
        'vehicules.html'
    ];
    // Redirection uniquement si le texte correspond exactement (case sensitive) à un nom de page
    for (let i = 0; i < knownPages.length; i++) {
        if (searchText === knownPages[i]) {
            if (window.confirm(`Voulez-vous ouvrir la page : ${searchText} ?`)) {
                window.location.href = searchText;
                return;
            } else {
                return;
            }
        }
    }
    // Vérifier la longueur minimale de la requête
    const minLength = (window.API_CONFIG && window.API_CONFIG.SEARCH.MIN_QUERY_LENGTH) || 2;
    // Si le texte de recherche est vide ou trop court, afficher tous les produits
    if (!searchText || searchText.length < minLength) {
        clearSearchResults();
        showAllProducts();
        return;
    }

    // Afficher un indicateur de chargement
    showSearchLoading(true);
    
    try {
        // Vérifier si l'API est disponible
        const apiAvailable = await checkApiAvailability();
        
        if (!apiAvailable) {
            throw new Error('API indisponible');
        }
        
        // Construire l'URL de recherche
        const searchUrl = buildApiUrl(window.API_CONFIG.ENDPOINTS.PRODUCTS_SEARCH, { q: searchText });
        
        // Appel à l'API de recherche avec timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), window.API_CONFIG.TIMEOUTS.SEARCH || 5000);
        
        const response = await fetch(searchUrl, {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
        }
        
        const searchResults = await response.json();
        
        // Log pour debugging
        console.log(`🔍 Recherche API réussie: "${searchText}" - ${searchResults.length} résultat(s)`);
        
        // Afficher les résultats de recherche
        displaySearchResults(searchResults, searchText);
        
    } catch (error) {
        console.warn('Erreur lors de la recherche API:', error);
        // Désactiver le fallback local : afficher un message d'erreur à l'utilisateur
        showNoResultsMessage('API indisponible ou erreur de connexion. La recherche nécessite la connexion à la base de données.');
    } finally {
        showSearchLoading(false);
    }
}

// Fonction de recherche locale (fallback)


// Afficher les résultats de recherche de l'API
function displaySearchResults(products, searchQuery) {
    // Masquer toutes les sections existantes
    hideAllProductSections();
    // Masquer tous les produits HTML existants (hors résultats API)
    const allProductCards = document.querySelectorAll('.product-item, .fadidi-product-card');
    allProductCards.forEach(card => {
        // On ne masque pas les cartes qui sont dans la section search-results-section
        if (!card.closest('#search-results-section')) {
            card.style.display = 'none';
        }
    });
    
    // Créer ou afficher la section de résultats de recherche
    let searchSection = document.getElementById('search-results-section');
    if (!searchSection) {
        searchSection = createSearchResultsSection();
    }
    
    const resultsContainer = searchSection.querySelector('.search-results-grid');
    const searchTitle = searchSection.querySelector('.search-results-title');
    
    // Mettre à jour le titre
    searchTitle.textContent = `Résultats pour "${searchQuery}" (${products.length} produit${products.length > 1 ? 's' : ''})`;
    
    // Vider le conteneur précédent
    resultsContainer.innerHTML = '';
    
    if (products.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results-message">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3>Aucun produit trouvé</h3>
                <p>Votre recherche "${searchQuery}" n'a donné aucun résultat.</p>
                <button onclick="clearSearchResults()" class="btn-clear-search">
                    Voir tous les produits
                </button>
            </div>
        `;
        return;
    }
    
    // Afficher les produits trouvés
    products.forEach(product => {
        const productCard = createProductCard(product);
        resultsContainer.appendChild(productCard);
    });
    
    // Faire défiler vers les résultats
    searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Créer la section des résultats de recherche
function createSearchResultsSection() {
    const searchSection = document.createElement('div');
    searchSection.id = 'search-results-section';
    searchSection.className = 'search-results-section';
    searchSection.innerHTML = `
        <div class="section-header">
            <h2 class="search-results-title">Résultats de recherche</h2>
            <button onclick="clearSearchResults()" class="btn-clear-search">
                <i class="fas fa-times"></i> Effacer la recherche
            </button>
        </div>
        <div class="search-results-grid fadidi-modern-grid"></div>
    `;
    
    // Insérer après la navigation
    const nav = document.querySelector('nav');
    nav.parentNode.insertBefore(searchSection, nav.nextSibling);
    
    return searchSection;
}

// Créer une carte produit pour les résultats de recherche
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'fadidi-product-card search-result-card';
    
    // Construire l'URL de l'image avec la configuration
    const imageUrl = product.images && product.images.length > 0 
        ? buildUploadUrl(product.images[0])
        : (window.API_CONFIG ? window.API_CONFIG.DEFAULT_IMAGES.PRODUCT : 'assets/images/1-.png');
    
    // Nettoyer et sécuriser les données
    const productName = (product.name || '').replace(/'/g, "&#39;");
    const productDescription = product.description ? 
        `<p class="product-description">${product.description}</p>` : '';
    const productPrice = Number(product.price) || 0;
    
    card.innerHTML = `
        <div class="fadidi-card-img-container">
            <img src="${imageUrl}" alt="${productName}" 
                 onclick="openImage(this)" 
                 onerror="this.src='${window.API_CONFIG ? window.API_CONFIG.DEFAULT_IMAGES.PRODUCT : 'assets/images/1-.png'}'">
        </div>
        <div class="fadidi-card-body">
            <h3 class="fadidi-card-title">${productName}</h3>
            ${productDescription}
            <div class="fadidi-card-price">${productPrice.toLocaleString('fr-FR')} CFA</div>
            <button onclick="addToCart('${product.id}', '${productName}', ${productPrice}, '${imageUrl}', 1)" 
                    class="fadidi-card-btn">
                Ajouter au panier
            </button>
        </div>
    `;
    
    return card;
}

// Masquer toutes les sections de produits
function hideAllProductSections() {
    const sections = document.querySelectorAll('.accordion-item, .category-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

// Afficher toutes les sections de produits
function showAllProducts() {
    const sections = document.querySelectorAll('.accordion-item, .category-section');
    sections.forEach(section => {
        section.style.display = 'block';
    });
}

// Effacer les résultats de recherche
function clearSearchResults() {
    const searchSection = document.getElementById('search-results-section');
    if (searchSection) {
        searchSection.style.display = 'none';
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    showAllProducts();
    
    // Réinitialiser les styles des produits
    const productItems = document.querySelectorAll('.product-item, .fadidi-product-card');
    productItems.forEach(item => {
        item.style.border = 'none';
        item.style.display = 'block';
    });
}

// Afficher/masquer l'indicateur de chargement
function showSearchLoading(show) {
    let loadingElement = document.getElementById('search-loading');
    if (show && !loadingElement) {
        loadingElement = document.createElement('div');
        loadingElement.id = 'search-loading';
        loadingElement.className = 'search-loading';
        loadingElement.innerHTML = `
            <div class="search-loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Recherche en cours...</span>
            </div>
        `;
        
        const searchButton = document.getElementById('search-button');
        searchButton.parentNode.insertBefore(loadingElement, searchButton.nextSibling);
    } else if (!show && loadingElement) {
        loadingElement.remove();
    }
}

// Afficher un message d'absence de résultats
function showNoResultsMessage(searchQuery) {
    // Créer ou afficher la section de résultats vides
    displaySearchResults([], searchQuery);
}

// Fonction pour basculer l'affichage des catégories
function toggleAccordion(button) {
    const content = button.nextElementSibling;
    if (!content) return;

    // Fermer toutes les autres catégories
    const allContents = document.querySelectorAll('.accordion-content');
    allContents.forEach(item => {
        if (item !== content) {
            item.style.display = 'none';
        }
    });

    // Basculer l'affichage de la catégorie actuelle
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

// Fonction pour ouvrir une image dans un modal
function openImage(imgElement) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    
    if (!modal || !modalImg) return;
    
    modal.style.display = "block";
    modalImg.src = imgElement.src;
}

// Fonction pour fermer l'image modale
function closeImage() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Fonction pour charger les produits publiés dans la boutique
// Variable pour éviter les chargements multiples
let vendorProductsLoaded = false;

// Fonction pour forcer le rechargement des produits des vendeurs
function forceReloadVendorProducts() {
    vendorProductsLoaded = false;
    const productsContainer = document.getElementById('vendor-product-list');
    if (productsContainer) {
        productsContainer.innerHTML = '';
    }
    loadPublishedProducts();
}

function loadPublishedProducts() {
    console.log("Chargement des produits publiés...");
    
    // Éviter la duplication - ne charger qu'une fois
    if (vendorProductsLoaded) {
        console.log("⚠️ Produits des vendeurs déjà chargés, éviter la duplication");
        return;
    }
    
    // Récupérer tous les produits depuis localStorage (produits FADIDI ET vendeurs)
    const fadidiProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
    const vendorProducts = JSON.parse(localStorage.getItem('vendorProducts') || '[]');
    
    // Combiner les deux sources de produits
    const allProducts = [
        ...fadidiProducts.filter(product => product.status === 'published'),
        ...vendorProducts.filter(product => product.status === 'published')
    ];
    
    console.log("Total des produits publiés trouvés:", allProducts.length, 
                "(FADIDI:", fadidiProducts.length, "- Vendeurs:", vendorProducts.length, ")");
    
    // Récupérer le conteneur où afficher les produits
    const productsContainer = document.querySelector('.product-grid') || 
                             document.querySelector('.products-container') ||
                             document.getElementById('products-container') ||
                             document.getElementById('vendor-product-list');
    
    if (!productsContainer) {
        console.error("Conteneur de produits introuvable dans la boutique");
        return;
    }
    
    // Vérifier si des produits sont déjà affichés
    if (productsContainer.children.length > 0) {
        console.log("⚠️ Produits déjà affichés dans le conteneur des vendeurs");
        vendorProductsLoaded = true;
        return;
    }
    
    // Vider le conteneur existant
    productsContainer.innerHTML = '';
    
    // Marquer comme chargé
    vendorProductsLoaded = true;
    
    if (allProducts.length === 0) {
        // Afficher un message si aucun produit n'est publié
        productsContainer.innerHTML = '';
    } else {
        // Afficher chaque produit publié
        allProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    }
}

// Fonction pour créer une carte de produit
function createProductCard(product) {
    // Création de la carte moderne FADIDI
    const card = document.createElement('div');
    card.className = 'fadidi-product-card';

    // Utiliser l'image du produit ou une image par défaut
    const productImage = product.image || "1-.png";

    // Badge vendeur si besoin
    const vendorBadge = product.vendorId ? `<div class="vendor-badge">${product.vendorName || 'Vendeur'}</div>` : '';

    card.innerHTML = `
        <div class="fadidi-card-img-container">
            <img src="${productImage}" alt="${product.name || 'Produit'}" onclick="openImage(this)" />
            ${vendorBadge}
        </div>
        <div class="fadidi-card-body">
            <h3 class="fadidi-card-title">${product.name || 'Produit FADIDI'}</h3>
            <p class="fadidi-card-desc">${product.description ? product.description : ''}</p>
            <div class="fadidi-card-price">${product.price ? Number(product.price).toLocaleString('fr-FR') + ' CFA' : '23 000 CFA'}</div>
            <button class="fadidi-card-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${Number(product.price)})">Ajouter au panier</button>
        </div>
    `;
    return card;
}


// Écouter les changements dans le localStorage pour les produits vendeur
window.addEventListener('storage', function(e) {
    if (e.key === 'vendorProducts') {
        console.log("Mise à jour détectée dans les produits vendeur");
        loadPublishedProducts();
    }
});



// Version améliorée de la fonction addToCart
function addToCart(productName, productPrice) {
    console.log("Ajout au panier:", productName, productPrice);
    
    // Assurer que le prix est un nombre
    const price = Number(productPrice);
    
    // Ajouter au panier
    cartItems.push({ name: productName, price: price });
    
    // Enregistrer dans localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Mettre à jour l'affichage du panier
    updateCart();
    
    // Afficher une notification
    showAddedToCartNotification(productName);
}

// Fonction pour afficher une notification
function showAddedToCartNotification(productName) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${productName} a été ajouté au panier!`;
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Disparition après 2 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 2000);
}
// Fonction pour enregistrer une commande
function saveOrder() {
    console.log("Enregistrement de la commande...");
    
    // Vérifier s'il y a des articles dans le panier
    if (cartItems.length === 0) {
        console.error("Tentative de sauvegarde d'une commande avec un panier vide");
        return;
    }
    
    // Créer un ID unique pour la commande
    const orderId = "CMD-" + Date.now();
    
    // Identifier les produits par vendeur
    const orderByVendor = {};
    
    // Récupérer tous les produits
    const allProducts = JSON.parse(localStorage.getItem('fadidiProducts')) || [];
    
    // Pour chaque article du panier
    cartItems.forEach(item => {
        // Trouver le produit correspondant dans la liste des produits
        const product = allProducts.find(p => p.name === item.name && parseInt(p.price) === parseInt(item.price));
        
        if (product) {
            // Si le produit appartient à un vendeur (a un vendorId)
            const vendorId = product.vendorId || 'store-owner';
            
            // Ajouter au groupe de ce vendeur
            if (!orderByVendor[vendorId]) {
                orderByVendor[vendorId] = {
                    vendorId: vendorId,
                    items: [],
                    totalAmount: 0,
                    status: 'pending',
                    orderDate: new Date().toISOString()
                };
            }
            
            orderByVendor[vendorId].items.push({
                productId: product.id,
                name: product.name,
                price: parseInt(product.price),
                quantity: 1 // Vous pourriez ajouter la gestion des quantités
            });
            
            orderByVendor[vendorId].totalAmount += parseInt(product.price);
        } else {
            // Produit non trouvé, considérer comme un produit de la boutique principale
            const vendorId = 'store-owner';
            
            if (!orderByVendor[vendorId]) {
                orderByVendor[vendorId] = {
                    vendorId: vendorId,
                    items: [],
                    totalAmount: 0,
                    status: 'pending',
                    orderDate: new Date().toISOString()
                };
            }
            
            orderByVendor[vendorId].items.push({
                name: item.name,
                price: parseInt(item.price),
                quantity: 1
            });
            
            orderByVendor[vendorId].totalAmount += parseInt(item.price);
        }
    });
    
    // Récupérer les informations du client depuis le formulaire (utiliser les IDs corrects)
    const customerName = document.getElementById('client-name')?.value?.trim() || 'Client';
    const customerEmail = document.getElementById('client-email')?.value?.trim() || '';
    const customerPhone = document.getElementById('client-phone')?.value?.trim() || '';
    const customerAddress = document.getElementById('client-address')?.value?.trim() || '';
    const customerCity = document.getElementById('client-city')?.value?.trim() || '';
    const customerNotes = document.getElementById('client-notes')?.value?.trim() || '';
    
    // Créer la commande complète
    const order = {
        orderId: orderId,
        customerInfo: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: `${customerAddress}, ${customerCity}`,
            notes: customerNotes
        },
        orderDate: new Date().toISOString(),
        totalAmount: cartItems.reduce((total, item) => total + parseInt(item.price), 0),
        status: 'paid',
        items: cartItems.map(item => ({
            name: item.name,
            price: parseInt(item.price)
        })),
        vendorOrders: Object.values(orderByVendor),
        paymentMethod: getSelectedPaymentMethod()
    };
    
    // Récupérer les commandes existantes
    let orders = JSON.parse(localStorage.getItem('fadidiOrders')) || [];
    
    // Ajouter la nouvelle commande
    orders.push(order);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('fadidiOrders', JSON.stringify(orders));
    
    // Déclencher un événement pour notifier d'autres pages
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'fadidiOrders',
        newValue: JSON.stringify(orders)
    }));
    
    console.log("Commande enregistrée avec succès:", order);
    
    // Retourner l'ID de commande pour référence
    return orderId;
}

// Fonction pour déterminer le mode de paiement sélectionné
function getSelectedPaymentMethod() {
    const visaFields = document.getElementById('visa-fields');
    const waveFields = document.getElementById('wave-fields');
    const orangeMoneyFields = document.getElementById('orange-money-fields');
    
    if (visaFields && visaFields.style.display === 'block') {
        return 'Carte bancaire';
    } else if (waveFields && waveFields.style.display === 'block') {
        return 'Wave';
    } else if (orangeMoneyFields && orangeMoneyFields.style.display === 'block') {
        return 'Orange Money';
    }
    
    return 'Méthode inconnue';
}

// Fonction pour gérer le succès du paiement et afficher le lien de suivi
function handleCheckoutSuccess(orderId) {
    console.log("Paiement réussi, affichage confirmation pour commande:", orderId);
    
    // Afficher la confirmation avec un lien vers le suivi
    if (!paiementSection) {
        console.error("Section paiement introuvable pour afficher la confirmation");
        alert(`Paiement effectué avec succès ! Votre commande #${orderId} a été enregistrée.`);
        return;
    }
    
    paiementSection.innerHTML = `
        <div class="order-confirmation">
            <div class="confirmation-icon">✅</div>
            <h2>Commande confirmée!</h2>
            <p>Votre commande <strong>#${orderId}</strong> a été enregistrée avec succès.</p>
            <p>Un e-mail de confirmation a été envoyé à votre adresse.</p>
            <div class="order-actions">
                <a href="commande.html?orderId=${orderId}" class="tracking-button">
                    <span class="icon">🚚</span> Suivre ma commande
                </a>
                <button class="continue-shopping" onclick="continueShoppingAfterCheckout()">
                    Continuer mes achats
                </button>
            </div>
        </div>
    `;
    paiementSection.style.display = 'block';
    
    // Vider le panier
    cartItems = [];
    updateCart();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Fonction pour continuer les achats après la commande
function continueShoppingAfterCheckout() {
    if (paiementSection) paiementSection.style.display = 'none';
    if (panierSection) panierSection.style.display = 'none';
    window.scrollTo(0, 0);
}

// Animation pour le widget "Devenir vendeur"
document.addEventListener('DOMContentLoaded', function() {
    // Créer des particules pour l'animation
    function createParticles(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Vider le conteneur
        container.innerHTML = '';
        
        // Créer nouvelles particules
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Position initiale aléatoire
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            particle.style.left = x + '%';
            particle.style.top = y + '%';
            
            // Direction aléatoire
            const xDir = (Math.random() - 0.5) * 50;
            const yDir = (Math.random() - 0.5) * 50;
            particle.style.setProperty('--x', xDir + 'px');
            particle.style.setProperty('--y', yDir + 'px');
            
            // Taille aléatoire
            const size = Math.random() * 6 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Délai d'animation
            particle.style.animationDelay = (Math.random() * 2) + 's';
            
            container.appendChild(particle);
        }
    }
    
    // Créer les particules initiales
    createParticles('particles1');
    createParticles('particles2');
    
    // Régénérer les particules périodiquement
    setInterval(function() {
        createParticles('particles1');
        createParticles('particles2');
    }, 3000);
    
    // Animation spéciale d'attention toutes les 30 secondes
    setInterval(function() {
        const widget = document.getElementById('becomeSeller');
        if (widget) {
            widget.style.transform = 'scale(1.2)';
            setTimeout(() => {
                widget.style.transform = '';
            }, 500);
        }
    }, 30000);
    
    // Animation lorsqu'on survole le widget
    const sellerWidget = document.getElementById('becomeSeller');
    if (sellerWidget) {
        sellerWidget.addEventListener('mouseenter', function() {
            document.querySelectorAll('.widget-icon').forEach(icon => {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            });
        });
        
        sellerWidget.addEventListener('mouseleave', function() {
            document.querySelectorAll('.widget-icon').forEach(icon => {
                icon.style.transform = '';
            });
        });
    }
});




function showCategoryManager() {
    // Récupérer les catégories
    const categories = loadCategories();
    
    let categoriesListHTML = '';
    categories.forEach(cat => {
        categoriesListHTML += `
            <tr>
                <td>${cat.name}</td>
                <td>${cat.order || '-'}</td>
                <td>
                    <button class="action-btn" onclick="editCategory('${cat.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="if(deleteCategory('${cat.id}')) this.closest('tr').remove()"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    
    // Créer la modal
    const modalHTML = `
        <div class="modal-content">
            <h2>Gestion des catégories</h2>
            
            <button class="action-btn" style="margin-bottom: 15px;" onclick="editCategory()">
                <i class="fas fa-plus"></i> Nouvelle catégorie
            </button>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Ordre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${categoriesListHTML || '<tr><td colspan="3" style="text-align:center">Aucune catégorie définie</td></tr>'}
                </tbody>
            </table>
            
            <div class="btn-group" style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Fermer</button>
            </div>
        </div>
    `;
    
    // Afficher la modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = modalHTML;
    document.body.appendChild(modalOverlay);
}

function editCategory(categoryId = null) {
    const categories = loadCategories();
    let category = { id: '', name: '', order: '' };
    
    if (categoryId) {
        const existingCategory = categories.find(c => c.id === categoryId);
        if (existingCategory) {
            category = existingCategory;
        }
    }
    
    // Créer la modal d'édition
    const modalHTML = `
        <div class="modal-content">
            <h2>${categoryId ? 'Modifier' : 'Ajouter'} une catégorie</h2>
            
            <div class="form-group">
                <label>Nom de la catégorie:</label>
                <input type="text" id="category-name" class="form-control" value="${category.name}">
            </div>
            
            <div class="form-group">
                <label>Ordre d'affichage:</label>
                <input type="number" id="category-order" class="form-control" value="${category.order || ''}">
            </div>
            
            <div class="btn-group">
                <button class="btn btn-cancel" onclick="this.closest('.modal-overlay').remove()">Annuler</button>
                <button class="btn btn-primary" onclick="saveEditedCategory('${category.id}')">Enregistrer</button>
            </div>
        </div>
    `;
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = modalHTML;
    document.body.appendChild(modalOverlay);
}

function saveEditedCategory(categoryId) {
    const name = document.getElementById('category-name').value.trim();
    const order = document.getElementById('category-order').value.trim();
    
    if (!name) {
        alert("Le nom de la catégorie est obligatoire");
        return;
    }
    
    const category = {
        id: categoryId || 'cat-' + Date.now(),
        name: name,
        order: order ? parseInt(order) : null
    };
    
    saveCategory(category);
    
    // Fermer la modal et rafraîchir la liste
    document.querySelector('.modal-overlay').remove();
    showCategoryManager();
}


// Fonction modifiée pour le suivi de commande - VERSION QUI FONCTIONNE VRAIMENT
// Fonction pour rechercher une commande réelle
function trackAnyOrder() {
    // 1. Récupérer la valeur saisie
    const orderInput = document.getElementById('order-id');
    const orderId = orderInput.value.trim();
    
    // 2. Vérifier si l'input est vide
    if (!orderId) {
        showError("Veuillez saisir un numéro de commande");
        return;
    }
    
    console.log("Recherche de la commande:", orderId);
    
    // 3. Récupérer TOUTES les commandes du localStorage
    let orders = [];
    
    try {
        // Essayer de charger depuis fadidiOrders (votre stockage principal)
        const fadidiOrders = localStorage.getItem('fadidiOrders');
        if (fadidiOrders) {
            orders = JSON.parse(fadidiOrders);
            console.log("Commandes trouvées dans fadidiOrders:", orders.length);
        }
        
        // Vérifier également dans 'orders' (format alternatif)
        const otherOrders = localStorage.getItem('orders');
        if (otherOrders) {
            const moreOrders = JSON.parse(otherOrders);
            if (Array.isArray(moreOrders)) {
                orders = [...orders, ...moreOrders];
                console.log("Commandes supplémentaires trouvées dans orders:", moreOrders.length);
            }
        }
        
        // Vérifier dans d'autres emplacements possibles
        const cartOrders = localStorage.getItem('cartOrders');
        if (cartOrders) {
            const moreOrders = JSON.parse(cartOrders);
            if (Array.isArray(moreOrders)) {
                orders = [...orders, ...moreOrders];
                console.log("Commandes supplémentaires trouvées dans cartOrders:", moreOrders.length);
            }
        }
        
        console.log("Total des commandes trouvées:", orders.length);
    } catch (e) {
        console.error("Erreur lors de la récupération des commandes:", e);
    }
    
    // 4. Recherche plus flexible de la commande par ID
    let foundOrder = null;
    
    // Afficher toutes les commandes dans la console pour le débogage
    console.log("Détail de toutes les commandes trouvées:", orders);
    
    for (let order of orders) {
        console.log("Vérification de la commande:", order);
        
        // Vérifier plusieurs formats possibles d'ID de commande
        if (order.orderId === orderId || 
            order.orderId === "CMD-" + orderId || 
            orderId === "CMD-" + order.orderId ||
            (order.orderId && order.orderId.includes(orderId)) ||
            (orderId && orderId.includes(order.orderId)) ||
            order.id === orderId ||
            order.orderNumber === orderId) {
            
            foundOrder = order;
            console.log("Commande trouvée!", foundOrder);
            break;
        }
    }
    
    // MODIFICATION: Suppression des étapes 5 et 6 qui créaient des fausses commandes
    
    // NOUVEAU: Si aucune commande n'est trouvée, afficher un message d'erreur
    if (!foundOrder) {
        showError("Commande non trouvée. Veuillez vérifier votre numéro de commande.");
        return; // Arrêter l'exécution
    }
    
    // 7. Afficher uniquement les détails d'une commande réelle
    displayOrderDetails(foundOrder);
}

// Fonction pour afficher un message d'erreur
function showError(message) {
    const resultDiv = document.getElementById('tracking-result');
    resultDiv.innerHTML = `
        <div class="tracking-error">
            ${message}
        </div>
    `;
}
// Fonction pour afficher un message d'erreur
function showError(message) {
    const resultDiv = document.getElementById('tracking-result');
    resultDiv.innerHTML = `
        <div class="tracking-error">
            ${message}
        </div>
    `;
}



// Fonction pour créer une commande de démonstration
function createDemoOrder(orderId) {
    console.log("Création d'une commande de démonstration avec ID:", orderId);
    
    return {
        orderId: orderId,
        customerInfo: {
            name: "Client Démonstration",
            phone: "771234567",
            address: "123 Rue Principale, Dakar",
            email: "client@exemple.com"
        },
        orderDate: new Date().toISOString(),
        totalAmount: 25000,
        status: 'processing',
        items: [
            {name: "Smartphone Android Premium", price: 15000},
            {name: "Coque de protection renforcée", price: 2000},
            {name: "Écouteurs sans fil Bluetooth", price: 8000}
        ],
        paymentMethod: "Wave"
    };
}

// Fonction pour afficher le résultat de la recherche
function showTrackingResult(message, isError = false) {
    console.log(`Affichage du résultat: ${message} (erreur: ${isError})`);
    
    const trackingResult = document.getElementById('tracking-result');
    if (!trackingResult) {
        console.error("ERREUR: Élément 'tracking-result' non trouvé");
        alert(message);
        return;
    }
    
    trackingResult.innerHTML = '';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'tracking-error' : 'tracking-success';
    messageDiv.style.padding = '15px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.margin = '15px 0';
    messageDiv.style.color = isError ? '#721c24' : '#155724';
    messageDiv.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    messageDiv.style.border = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
    messageDiv.style.fontWeight = 'bold';
    messageDiv.textContent = message;
    
    trackingResult.appendChild(messageDiv);
}

// Fonction pour afficher un message d'erreur ou de succès
function showTrackingResult(message, isError = false) {
    const trackingResult = document.getElementById('tracking-result');
    if (!trackingResult) return;
    
    if (isError) {
        trackingResult.innerHTML = `<div class="tracking-error">${message}</div>`;
    } else {
        trackingResult.innerHTML = `<div class="tracking-success">${message}</div>`;
    }
}

// Fonction pour afficher les détails d'une commande
function displayOrderDetails(order) {
    const resultDiv = document.getElementById('tracking-result');
    
    // Vérification complète de l'objet order
    if (!order) {
        showError("Impossible d'afficher les détails de la commande : données invalides");
        return;
    }
    
    // Formater la date (avec gestion des erreurs)
    let dateFormatted = "Date inconnue";
    try {
        if (order.orderDate) {
            const orderDate = new Date(order.orderDate);
            dateFormatted = orderDate.toLocaleDateString('fr-FR') + ' à ' + 
                          orderDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
        }
    } catch (e) {
        console.error("Erreur de formatage de date:", e);
    }
    
    // Déterminer le statut et les étapes complétées
    let statusText, statusClass;
    let donePreparing = false;
    let doneShipping = false;
    let doneDelivering = false;
    
    // Gestion plus robuste du statut
    const status = order.status || 'processing';
    
    switch (status) {
        case 'pending':
            statusText = 'En attente';
            statusClass = 'status-pending';
            break;
        case 'processing':
            statusText = 'En préparation';
            statusClass = 'status-processing';
            donePreparing = false;
            break;
        case 'shipped':
            statusText = 'En livraison';
            statusClass = 'status-shipped';
            donePreparing = true;
            doneShipping = false;
            break;
        case 'delivered':
            statusText = 'Livrée';
            statusClass = 'status-delivered';
            donePreparing = true;
            doneShipping = true;
            doneDelivering = true;
            break;
        default:
            statusText = 'En préparation';
            statusClass = 'status-processing';
    }
    
    // Générer le HTML des produits avec gestion d'erreurs
    let productsHtml = '';
    let totalCalculated = 0;
    
    // Vérifier que les items existent et sont bien un tableau
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
        order.items.forEach(item => {
            const itemPrice = Number(item.price) || 0;
            productsHtml += `
                <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #444;">
                    <span>${item.name || 'Produit sans nom'}</span>
                    <span>${itemPrice.toLocaleString('fr-FR')} CFA</span>
                </div>
            `;
            totalCalculated += itemPrice;
        });
    } else if (order.vendorOrders && Array.isArray(order.vendorOrders) && order.vendorOrders.length > 0) {
        // Gestion du cas où les items sont dans vendorOrders[0].items
        try {
            const vendorOrder = order.vendorOrders[0];
            if (vendorOrder && vendorOrder.items && Array.isArray(vendorOrder.items)) {
                vendorOrder.items.forEach(item => {
                    const itemPrice = Number(item.price) || 0;
                    productsHtml += `
                        <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #444;">
                            <span>${item.name || 'Produit sans nom'}</span>
                            <span>${itemPrice.toLocaleString('fr-FR')} CFA</span>
                        </div>
                    `;
                    totalCalculated += itemPrice;
                });
            }
        } catch (e) {
            console.error("Erreur lors du traitement des vendorOrders:", e);
        }
    } else {
        productsHtml = '<p>Détails des articles indisponibles</p>';
    }
    
    // Utiliser le total calculé si celui de la commande semble incorrect
    let totalToDisplay = 0;
    try {
        totalToDisplay = Number(order.totalAmount) || totalCalculated || 0;
    } catch (e) {
        totalToDisplay = totalCalculated || 0;
    }
    
    // Vérifier si les informations client sont disponibles
    const customerInfo = order.customerInfo || {};
    
    resultDiv.innerHTML = `
        <div class="order-details">
            <div class="order-header">
                <h2>Commande #${order.orderId || 'Inconnue'}</h2>
                <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            
            <p><strong>Date:</strong> ${dateFormatted}</p>
            
            <div class="tracking-steps">
                <div class="step done">
                    <div class="step-icon">✓</div>
                    <div>Commande reçue</div>
                </div>
                <div class="step-connector"></div>
                <div class="step ${donePreparing ? 'done' : (status === 'processing' ? 'active' : '')}">
                    <div class="step-icon">📦</div>
                    <div>En préparation</div>
                </div>
                <div class="step-connector"></div>
                <div class="step ${doneShipping ? 'done' : (status === 'shipped' ? 'active' : '')}">
                    <div class="step-icon">🚚</div>
                    <div>En livraison</div>
                </div>
                <div class="step-connector"></div>
                <div class="step ${doneDelivering ? 'done' : ''}">
                    <div class="step-icon">🏠</div>
                    <div>Livré</div>
                </div>
            </div>
            
            <div style="margin: 20px 0;">
                <h3>Informations client</h3>
                <p><strong>Nom:</strong> ${customerInfo.name || 'Non spécifié'}</p>
                <p><strong>Téléphone:</strong> ${customerInfo.phone || 'Non spécifié'}</p>
                <p><strong>Adresse:</strong> ${customerInfo.address || 'Non spécifiée'}</p>
                ${customerInfo.email ? `<p><strong>Email:</strong> ${customerInfo.email}</p>` : ''}
            </div>
            
            <div style="margin: 20px 0;">
                <h3>Articles commandés</h3>
                ${productsHtml}
            </div>
            
            <div style="margin-top: 20px; text-align: right; font-size: 18px;">
                <strong>Total:</strong> ${totalToDisplay.toLocaleString('fr-FR')} CFA
            </div>
            
            <div style="margin-top: 10px; text-align: right;">
                <strong>Moyen de paiement:</strong> ${order.paymentMethod || 'Non spécifié'}
            </div>
        </div>
    `;

    // Ajouter un débogage pour voir l'affichage
    console.log("Détails de la commande affichés:", order);
}




// Fonction pour afficher les détails d'une commande avec un meilleur suivi de l'état
function displayOrderDetails(order) {
    const trackingResult = document.getElementById('tracking-result');
    if (!trackingResult) return;
    
    // Formater la date
    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString('fr-FR') + 
                         ' à ' + orderDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
    
    // Calculer le temps écoulé depuis la commande pour simuler la progression
    const now = new Date();
    const hoursSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60));
    
    // Déterminer le statut de la commande en fonction du temps écoulé et du statut actuel
    let statusText, statusClass;
    let preparation = false;
    let expedition = false;
    let livraison = false;
    
    // Si la commande est marquée comme "livrée" dans les données
    if (order.status === 'delivered') {
        statusText = 'Livrée';
        statusClass = 'status-delivered';
        preparation = true;
        expedition = true;
        livraison = true;
    }
    // Si la commande est marquée comme "expédiée" dans les données
    else if (order.status === 'shipped') {
        statusText = 'En livraison';
        statusClass = 'status-shipped';
        preparation = true;
        expedition = true;
    }
    // Pour les commandes payées, estimer la progression en fonction du temps écoulé
    else if (order.status === 'paid' || order.status === 'processing') {
        if (hoursSinceOrder < 2) {
            statusText = 'En préparation';
            statusClass = 'status-processing';
            preparation = true;
        } else if (hoursSinceOrder < 24) {
            statusText = 'Expédiée';
            statusClass = 'status-shipped';
            preparation = true;
            expedition = true;
        } else {
            statusText = 'En livraison';
            statusClass = 'status-shipped';
            preparation = true;
            expedition = true;
        }
        
        // Si plus de 48 heures ont passé, considérer comme livrée (à adapter selon vos besoins)
        if (hoursSinceOrder > 48) {
            statusText = 'Livrée';
            statusClass = 'status-delivered';
            livraison = true;
        }
    }
    // Commandes en attente
    else if (order.status === 'pending') {
        statusText = 'En attente';
        statusClass = 'status-pending';
    }
    // Autres statuts
    else {
        statusText = 'Statut inconnu';
        statusClass = 'status-unknown';
    }
    
    // Générer le HTML pour les produits commandés
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price} CFA</div>
            </div>
        `;
    });
    
    // Générer étapes de suivi avec les états calculés
    const stepsHTML = `
        <div class="tracking-steps">
            <div class="step done">
                <div class="step-icon">✓</div>
                <div class="step-label">Commande reçue</div>
            </div>
            <div class="step-connector"></div>
            <div class="step ${preparation ? 'done' : ''}">
                <div class="step-icon">📦</div>
                <div class="step-label">En préparation</div>
            </div>
            <div class="step-connector"></div>
            <div class="step ${expedition ? 'done' : ''}">
                <div class="step-icon">🚚</div>
                <div class="step-label">Expédiée</div>
            </div>
            <div class="step-connector"></div>
            <div class="step ${livraison ? 'done' : ''}">
                <div class="step-icon">🏠</div>
                <div class="step-label">Livrée</div>
            </div>
        </div>
    `;
    
    // Estimer une date de livraison
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // Livraison estimée à J+3
    const formattedEstimatedDelivery = estimatedDelivery.toLocaleDateString('fr-FR');
    
    // Afficher les détails complets
    trackingResult.innerHTML = `
        <div class="order-details">
            <div class="order-header">
                <h3>Commande #${order.orderId}</h3>
                <div class="order-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="order-date">
                <strong>Date de commande :</strong> ${formattedDate}
            </div>
            
            <div class="estimated-delivery">
                <strong>Date de livraison estimée :</strong> ${formattedEstimatedDelivery}
            </div>
            
            ${stepsHTML}
            
            <div class="order-customer">
                <h4>Informations client</h4>
                <p><strong>Nom :</strong> ${order.customerInfo.name}</p>
                <p><strong>Téléphone :</strong> ${order.customerInfo.phone}</p>
                <p><strong>Adresse :</strong> ${order.customerInfo.address}</p>
                ${order.customerInfo.email ? `<p><strong>Email :</strong> ${order.customerInfo.email}</p>` : ''}
            </div>
            
            <div class="order-items">
                <h4>Articles commandés</h4>
                ${itemsHTML}
            </div>
            
            <div class="order-total">
                <strong>Total :</strong> ${order.totalAmount} CFA
            </div>
            
            <div class="order-payment">
                <strong>Moyen de paiement :</strong> ${order.paymentMethod}
            </div>
        </div>
    `;
}

// Fonction pour rechercher et afficher une commande
function trackOrder() {
    const orderIdInput = document.getElementById('order-id');
    if (!orderIdInput) {
        console.error("Élément 'order-id' non trouvé");
        return;
    }
    
    // Nettoyer l'ID de commande (enlever le # si présent)
    let orderId = orderIdInput.value.trim();
    if (orderId.startsWith('#')) {
        orderId = orderId.substring(1);
    }
    
    if (!orderId) {
        showTrackingResult("Veuillez entrer un numéro de commande.", true);
        return;
    }
    
    // Récupérer les commandes du localStorage
    const orders = JSON.parse(localStorage.getItem('fadidiOrders')) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
        showTrackingResult("Commande non trouvée. Veuillez vérifier le numéro de commande.", true);
        return;
    }
    
    // Afficher les détails de la commande
    displayOrderDetails(order);
}

// Fonction pour afficher un message d'erreur ou de succès
function showTrackingResult(message, isError = false) {
    const trackingResult = document.getElementById('tracking-result');
    if (!trackingResult) return;
    
    if (isError) {
        trackingResult.innerHTML = `<div class="tracking-error">${message}</div>`;
    } else {
        trackingResult.innerHTML = `<div class="tracking-success">${message}</div>`;
    }
}



// Ajouter cette fonction à votre fichier boutique.js
function loadAndDisplayFadidiProducts() {
    // Récupérer les produits FADIDI depuis localStorage
    const fadidiProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
    
    // S'il n'y a pas de produits, ne rien faire
    if (!fadidiProducts.length) return;
    
    // Déterminer la section où afficher les produits FADIDI
    // Vous pouvez adapter ceci selon votre structure HTML
    const electronicsSection = document.querySelector('.accordion-item:nth-child(1) .product-list');
    const clothingSection = document.querySelector('.accordion-item:nth-child(2) .product-list');
    const accessoriesSection = document.querySelector('.accordion-item:nth-child(3) .product-list');
    
    // Parcourir les produits et les afficher dans les sections appropriées
    fadidiProducts.forEach(product => {
        // Créer l'élément de produit
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        // Déterminer le contenu HTML du produit
        productItem.innerHTML = `
            <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" onclick="openImage(this)">
            <h3>${product.name}</h3>
            <p class="price">${Number(product.price).toLocaleString('fr-FR')} CFA</p>
            <button class="add-to-cart" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image || 'placeholder.jpg'}')">
                Ajouter au panier
            </button>
        `;
        
        // Ajouter le produit à la section correspondante selon sa catégorie
        switch (product.category) {
            case 'electronics':
                electronicsSection?.appendChild(productItem);
                break;
            case 'clothing':
                clothingSection?.appendChild(productItem);
                break;
            case 'accessories':
                accessoriesSection?.appendChild(productItem);
                break;
            default:
                // Par défaut, ajouter à la section électronique
                electronicsSection?.appendChild(productItem);
        }
    });
}

// Appeler cette fonction au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Vos fonctions d'initialisation existantes
    
    // Ajouter l'appel pour charger les produits FADIDI
    loadAndDisplayFadidiProducts();
});






// Fonction pour charger et afficher les sections de la boutique
function loadShopSections() {
    console.log("Chargement des sections de la boutique...");
    
    // Récupérer les sections depuis localStorage
    const shopSections = JSON.parse(localStorage.getItem('fadidiShopSections') || '[]');
    
    if (!shopSections.length) {
        console.log("Aucune section de boutique trouvée");
        return;
    }
    
    console.log(`${shopSections.length} sections trouvées`);
    
    // Récupérer tous les produits
    const fadidiProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
    const vendorProducts = JSON.parse(localStorage.getItem('vendorProducts') || '[]');
    const allProducts = [...fadidiProducts, ...vendorProducts];
    
    // MODIFICATION : Chercher l'accordéon pour placer nos sections
    const accordion = document.querySelector('.accordion');
    
    if (!accordion) {
        console.error("Élément accordéon non trouvé");
        return;
    }
    
    // Créer ou vider le conteneur pour les sections
    let sectionsContainer = document.getElementById('shop-sections');
    if (!sectionsContainer) {
        sectionsContainer = document.createElement('div');
        sectionsContainer.id = 'shop-sections';
        
        // CORRECTION IMPORTANTE : Insérer les sections AVANT l'accordéon
        // au lieu de les insérer après
        accordion.parentNode.insertBefore(sectionsContainer, accordion);
        console.log("Conteneur de sections créé et placé avant l'accordéon");
    } else {
        // Vider le conteneur existant
        sectionsContainer.innerHTML = '';
        console.log("Conteneur de sections existant vidé");
    }
    
    // Générer le HTML pour chaque section
    shopSections.forEach(section => {
        const sectionElement = document.createElement('section');
        sectionElement.className = 'shop-section';
        sectionElement.id = `section-${section.id}`;
        
        // Déterminer le type de section et la structure HTML appropriée
        switch (section.type) {
            case 'accordion':
                createAccordionSection(sectionElement, section, allProducts);
                break;
                
            case 'grid':
                createGridSection(sectionElement, section, allProducts);
                break;
                
            case 'carousel':
                createCarouselSection(sectionElement, section, allProducts);
                break;
                
            case 'featured':
                createFeaturedSection(sectionElement, section, allProducts);
                break;
                
            default:
                createDefaultSection(sectionElement, section, allProducts);
        }
        
        // Ajouter la section au conteneur
        sectionsContainer.appendChild(sectionElement);
    });
}
// Fonctions auxiliaires pour créer différents types de sections
function createAccordionSection(container, section, allProducts) {
    container.innerHTML = `
        <div class="accordion-item custom-section">
            <button class="accordion-header" onclick="toggleAccordion(this)">${section.title}</button>
            <div class="accordion-content">
                <div class="product-list section-products">
                    ${generateProductsHTML(section.products, allProducts)}
                </div>
            </div>
        </div>
    `;
}

function createGridSection(container, section, allProducts) {
    container.innerHTML = `
        <h2>${section.title}</h2>
        ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
        <div class="product-grid section-products">
            ${generateProductsHTML(section.products, allProducts)}
        </div>
    `;
}

function createCarouselSection(container, section, allProducts) {
    container.innerHTML = `
        <h2>${section.title}</h2>
        ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
        <div class="product-carousel">
            <div class="carousel-container">
                <div class="carousel-track section-products">
                    ${generateProductsHTML(section.products, allProducts, 'carousel-item')}
                </div>
            </div>
        </div>
    `;
}

function createFeaturedSection(container, section, allProducts) {
    // Pour un produit vedette, on prend seulement le premier produit
    const productId = section.products && section.products.length > 0 ? section.products[0] : null;
    const product = productId ? allProducts.find(p => p.id === productId) : null;
    
    if (!product) {
        container.innerHTML = `<h2>${section.title}</h2><p>Produit non disponible</p>`;
        return;
    }
    
    container.innerHTML = `
        <div class="featured-product">
            <h2>${section.title}</h2>
            ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
            <div class="featured-product-content">
                <div class="featured-product-image">
                    <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" onclick="openImage(this)">
                </div>
                <div class="featured-product-details">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <p class="product-price">${Number(product.price).toLocaleString('fr-FR')} CFA</p>
                    <button onclick="addToCart('${product.name}', ${product.price})">Ajouter au panier</button>
                </div>
            </div>
        </div>
    `;
}

function createDefaultSection(container, section, allProducts) {
    container.innerHTML = `
        <h2>${section.title}</h2>
        ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
        <div class="product-list section-products">
            ${generateProductsHTML(section.products, allProducts)}
        </div>
    `;
}

function generateProductsHTML(productIds, allProducts, className = 'fadidi-product-card') {
    if (!productIds || !productIds.length) {
        return '<p>Aucun produit dans cette section</p>';
    }
    return productIds.map(productId => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return '';
        return `
            <div class="fadidi-product-card">
                <div class="fadidi-card-img-container">
                    <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" onclick="openImage(this)">
                </div>
                <div class="fadidi-card-body">
                    <div class="fadidi-card-title">${product.name}</div>
                    <div class="fadidi-card-desc">${product.description ? product.description : ''}</div>
                    <div class="fadidi-card-price">Prix : ${Number(product.price).toLocaleString('fr-FR')} CFA</div>
                    <button class="fadidi-card-btn" onclick="addToCart('${product.name}', ${product.price})">Ajouter au panier</button>
                </div>
            </div>
        `;
    }).join('');
}
// Fonction pour forcer le positionnement des sections
// Ajouter cette fonction à votre code
function forceRepositionSections() {
    setTimeout(() => {
        console.log("Repositionnement forcé des sections...");
        
        const sectionsContainer = document.getElementById('shop-sections');
        if (!sectionsContainer) {
            console.log("Conteneur de sections non trouvé, création impossible");
            return;
        }
        
        // Trouver l'accordéon existant
        const accordion = document.querySelector('.accordion');
        if (!accordion) {
            console.log("Accordéon non trouvé");
            return;
        }
        
        // Supprimer le conteneur de son emplacement actuel
        sectionsContainer.parentNode.removeChild(sectionsContainer);
        
        // Le placer avant l'accordéon
        accordion.parentNode.insertBefore(sectionsContainer, accordion);
        
        console.log("Repositionnement terminé");
    }, 500); // Laisser le temps au DOM de se charger complètement
}

// Appeler cette fonction après le chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // ...autres initialisations...
    
    // Charger les sections
    loadShopSections();
    
    // Forcer leur repositionnement si nécessaire
    forceRepositionSections();
});





// AJOUT PANIER PROMO.HTMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
// AJOUT PANIER PROMO.HTMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('fadidiCart') || '[]');
    const cartDiv = document.getElementById('cart-list');
    if (!cartDiv) return;
    if (cart.length === 0) {
        cartDiv.innerHTML = "<p>Votre panier est vide.</p>";
        return;
    }
    cartDiv.innerHTML = cart.map(p => `
        <div style="border-bottom:1px solid #eee;padding:10px 0;">
            <strong>${p.title}</strong><br>
            <span>${p.promoPrice ? p.promoPrice.toLocaleString() : ''} CFA</span>
        </div>
    `).join('');
}
document.addEventListener('DOMContentLoaded', renderCart);




function generateProductsHTML(productIds, allProducts, className = 'product-item') {
    if (!productIds || !productIds.length) {
        return '<p>Aucun produit dans cette section</p>';
    }
    
    return productIds.map(productId => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return '';
        
        return `
            <div class="${className}">
                <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" onclick="openImage(this)">
                <span>${product.name}</span>
                <span>Prix : ${Number(product.price).toLocaleString('fr-FR')} CFA</span>
                <button onclick="addToCart('${product.name}', ${product.price})">Ajouter au panier</button>
            </div>
        `;
    }).join('');
}


function createCarouselSection(container, section, allProducts) {
    const productsHTML = generateProductsHTML(section.products, allProducts, 'carousel-item');
    container.innerHTML = `
        <div class="carousel-viewport" style="overflow:hidden;position:relative;width:100%;">
            <div class="carousel-track" style="display:flex;width:max-content;">
                ${productsHTML}
            </div>
        </div>
    `;

    // Animation fluide
    const track = container.querySelector('.carousel-track');
    let offset = 0;
    let speed = 1.2; // Plus grand = plus rapide (exemple : 1.2 pour accélérer)

    function animate() {
        offset -= speed;
        // Largeur totale du track
        const trackWidth = track.scrollWidth;
        // Largeur du viewport
        const viewportWidth = container.querySelector('.carousel-viewport').offsetWidth;
        // Si tout est passé, on recommence
        if (-offset > trackWidth - viewportWidth) offset = 0;
        track.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(animate);
    }
    animate();
}








// DIAPORAMA PRODUIT FADIDI FADIDI FADIDI FADIDI
// DIAPORAMA PRODUIT FADIDI FADIDI FADIDI FADIDI
// DIAPORAMA PRODUIT FADIDI FADIDI FADIDI FADIDI
let fadidiSlides = [];
let currentSlide = 0;

function showSlide(index) {
    if (!fadidiSlides.length) return;
    currentSlide = (index + fadidiSlides.length) % fadidiSlides.length;
    const product = fadidiSlides[currentSlide];
    const content = document.getElementById('slideshow-content');
    content.innerHTML = `
        <img src="${product.image || 'placeholder.jpg'}" class="fadidi-slide-img" alt="${product.name}">
        <div class="fadidi-slide-title">${product.name}</div>
        <div class="fadidi-slide-price">${Number(product.price).toLocaleString('fr-FR')} CFA</div>
        <button onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">Ajouter au panier</button>
    `;
}

function changeSlide(delta) {
    showSlide(currentSlide + delta);
}

// Charger les produits FADIDI pour le diaporama
document.addEventListener('DOMContentLoaded', function() {
    fadidiSlides = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
    if (fadidiSlides.length) {
        showSlide(0);
        // Optionnel : défilement automatique toutes les 5 secondes
        setInterval(() => changeSlide(1), 5000);
    } else {
        document.getElementById('fadidi-slideshow').style.display = 'none';
    }
});

if (typeof ad !== 'undefined' && ad && ad.contentType === 'image-slideshow') {
    const images = ad.content.images || [];
    const width = ad.content.width || 320;
    div.innerHTML = `
        <div class="fadidi-animated-slideshow" style="position:relative;">
            <img src="${images[0] || ''}" class="slideshow-img" style="width:${width}px;max-width:100%;border-radius:12px;">
            ${ad.content.mode === 'manual' && images.length > 1 ? `
                <button class="slideshow-prev" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);">‹</button>
                <button class="slideshow-next" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);">›</button>
            ` : ''}
        </div>
    `;
    // ...reste du JS pour le diaporama...
}

// ...PRODUIT HAUTE GAME FADIDI...
