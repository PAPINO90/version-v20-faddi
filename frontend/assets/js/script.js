

/* Styles carousel */
const images = document.querySelector('.carousel-images');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let index = 0;

function showSlide(n) {
    // Vérifier que l'élément existe avant d'y accéder
    if (!images || !images.children.length) return;
    index = (n + images.children.length) % images.children.length;
    images.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() { showSlide(index + 1); }
function prevSlide() { showSlide(index - 1); }

// Ajouter les event listeners seulement si les éléments existent
if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}
if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

// Démarrer le défilement automatique seulement si le carousel existe
if (images && images.children.length > 0) {
    setInterval(nextSlide, 3000); // Défilement automatique
}



document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const feedback = document.getElementById('feedback');
    const submitRating = document.getElementById('submitRating');
    const commentsList = document.getElementById('commentsList');
    let selectedRating = 0;

    // Liste des mots interdits
    const bannedWords = ['insulte', 'racisme', 'injure', 'discrimination', 'stupide', 'idiot', 'nul', 'bête', 'imbécile', 'con', 'conne', 'idiote', 'abruti', 'abrutie', 'débile', 'crétin', 'crétine', 'malpoli', 'malpolie', 'grossier', 'grossière', 'doul', 'merde', 'voleur', 'escroc', 'arnaqueur', 'arnaqueuse', 'escroquerie', 'escroc', 'foutre', 'putain', 'salope', 'salopard', 'connard', 'connasse', 'pute', 'cul', 'bite', 'sexe', 'sexe', 'laid', 'ndey', 'ndeye', 'menteur', 'menteuse', 'menteur', 'mente', 'mensonge', 'putain', 'salop', 'salope', 'put'];

    // Gérer la sélection des étoiles
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = star.getAttribute('data-value');
            stars.forEach(s => s.classList.remove('selected'));
            star.classList.add('selected');
        });
    });

    // Ajouter un commentaire et une note
    if (submitRating) {
        submitRating.addEventListener('click', () => {
            const commentText = feedback.value.trim();

            if (selectedRating === 0) {
                alert('Veuillez sélectionner une note.');
                return;
            }

            if (!commentText) {
                alert('Veuillez écrire un commentaire.');
                return;
            }

            // Vérifier les mots interdits
            const containsBannedWords = bannedWords.some(word => commentText.toLowerCase().includes(word));
            if (containsBannedWords) {
                alert('Votre commentaire contient des mots inappropriés. Veuillez le modifier.');
                return;
            }

            // Créer un élément de commentaire
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p>${commentText}</p>
                <div class="rating-display">${'★'.repeat(selectedRating)}${'☆'.repeat(5 - selectedRating)}</div>
                <button class="delete-btn">Supprimer</button>
            `;

            // Ajouter l'événement de suppression
            commentElement.querySelector('.delete-btn').addEventListener('click', () => {
                commentsList.removeChild(commentElement);
            });

            // Ajouter le commentaire à la liste
            commentsList.appendChild(commentElement);

            // Réinitialiser le formulaire
            feedback.value = '';
            stars.forEach(s => s.classList.remove('selected'));
            selectedRating = 0;

            alert('Merci pour votre commentaire et votre note !');
        });
    }
});




  



// Exemple de contrôle vidéo avec JavaScript
const video = document.querySelector('video');

// Lecture / pause au clic sur la vidéo seulement si elle existe
if (video) {
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
}




function redirectToBoutique() {
    window.location.href = "boutique.html"; // Remplacez par le lien de votre boutique
}



// Redirection vers la boutique
function redirectToBoutique() {
    window.location.href = "boutique.html"; // Remplacez par le lien de votre boutique
}



// Ouvrir le formulaire d'abonnement
const subscribeButton = document.getElementById('subscribe-button');
if (subscribeButton) {
    subscribeButton.addEventListener('click', function () {
        const formContainer = document.getElementById('subscribe-form-container');
        if (formContainer) {
            formContainer.style.display = 'flex';
        }
    });
}

// Fermer le formulaire d'abonnement
const closeSubscribeForm = document.getElementById('close-subscribe-form');
if (closeSubscribeForm) {
    closeSubscribeForm.addEventListener('click', function () {
        const formContainer = document.getElementById('subscribe-form-container');
        if (formContainer) {
            formContainer.style.display = 'none';
        }
    });
}

// Gérer la soumission du formulaire
const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = document.getElementById('subscribe-email');
        const phoneInput = document.getElementById('subscribe-phone');
        if (!emailInput) return;
        const email = emailInput.value;
        const phone = phoneInput ? phoneInput.value : '';
        if (!email) {
            // Afficher le toast d'erreur via le formulaire principal (déjà géré dans index.html)
            return;
        }
        // Ici, on ne fait rien, le toast est géré par le JS principal
        subscribeForm.reset();
        const formContainer = document.getElementById('subscribe-form-container');
        if (formContainer) {
            formContainer.style.display = 'none';
        }
    });
}



function redirectToBoutique() {
    // Rediriger directement vers la boutique
    window.location.href = "boutique.html"; // Remplacez par l'URL de votre boutique
}


function redirectToBoutique() {
    // Rediriger vers la boutique
    window.location.href = "boutique.html"; // Remplacez par l'URL de votre boutique
}



document.addEventListener('DOMContentLoaded', () => {
    const letters = document.querySelectorAll('.letter');

    letters.forEach(letter => {
        // Générer des valeurs aléatoires pour les déplacements
        const randomX = Math.random();
        const randomY = Math.random();

        // Appliquer les valeurs aléatoires en tant que variables CSS
        letter.style.setProperty('--random-x', randomX);
        letter.style.setProperty('--random-y', randomY);

        // Ajouter un délai d'animation aléatoire pour chaque lettre
        const delay = Math.random() * 2; // Délai entre 0 et 2 secondes
        letter.style.animationDelay = `${delay}s`;
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.carousel-3d-item');
    const totalItems = items.length;
    let currentIndex = 0;

    function updateCarousel() {
        const angle = 360 / totalItems;

        items.forEach((item, index) => {
            const rotation = angle * (index - currentIndex);
            item.style.transform = `rotateY(${rotation}deg) translateZ(300px)`;
            item.style.opacity = index === currentIndex ? '1' : '0.5';
        });
    }

    // Initialisation
    updateCarousel();

    // Rotation automatique toutes les 3 secondes
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 3000);
});




document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});






// ===============================
//// ASSISTANT IA FADIDI
// // ===============================
// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.style.display = 'flex';
        chatbotToggle.style.display = 'none';
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
        chatbotToggle.style.display = 'block';
    });

    // Handle sending messages
    chatbotSend.addEventListener('click', () => {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user-message');
            chatbotInput.value = '';
            setTimeout(() => {
                respondToMessage(userMessage);
            }, 1000);
        }
    });

    // Permettre l'envoi avec la touche Entrée
    chatbotInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            chatbotSend.click();
        }
    });

    // Add message to the chat
    function addMessage(text, className) {
        const message = document.createElement('div');
        message.className = `message ${className}`;
        message.innerHTML = text; // Utilisation de innerHTML pour inclure des liens
        chatbotMessages.appendChild(message);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Fonction de similarité (distance de Levenshtein)
    function isSimilar(str1, str2) {
        str1 = str1.replace(/\s+/g, '').toLowerCase();
        str2 = str2.replace(/\s+/g, '').toLowerCase();
        if (str1 === str2) return true;
        if (str1.includes(str2) || str2.includes(str1)) return true;
        function levenshtein(a, b) {
            const matrix = [];
            for (let i = 0; i <= b.length; i++) matrix[i] = [i];
            for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            return matrix[b.length][a.length];
        }
        return levenshtein(str1, str2) <= Math.max(2, Math.floor(str2.length / 4));
    }

    // Respond to user messages
    function respondToMessage(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase().trim();

        let response = "Je suis désolé, je ne comprends pas votre question. Voici quelques exemples de questions que vous pouvez poser :<br>" +
            "- Comment rejoindre la boutique ?<br>" +
            "- Comment rejoindre la promotion ?<br>" +
            "- Quels sont vos produits ?<br>" +
            "- Quels sont vos horaires ?<br>" +
            "- Comment vous contacter ?<br>" +
            "- Comment payer ?";

        // Base de connaissances avec variantes/fautes courantes
        const faq = {
            // Localisation et lieu du siège
            "lieu": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "siège": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "siege": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "où se trouve": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "ou se trouve": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "emplacement": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "localisation": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "position": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "adresse": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "whatsapp": "Voici notre WhatsApp : <a href='https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0' target='_blank'>Cliquez ici</a>",
            "whatshapp": "Voici notre WhatsApp : <a href='https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0' target='_blank'>Cliquez ici</a>",
            "watsapp": "Voici notre WhatsApp : <a href='https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0' target='_blank'>Cliquez ici</a>",
            "contact": "Voici nos moyens de contact :<br>" +
                "- WhatsApp : <a href='https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0' target='_blank'>Cliquez ici</a><br>" +
                "- Instagram : <a href='https://www.instagram.com/' target='_blank'>Cliquez ici</a><br>" +
                "- Facebook : <a href='https://www.facebook.com/' target='_blank'>Cliquez ici</a><br>" +
                "- Gmail : <a href='mailto:example@gmail.com'>Cliquez ici</a>",
            "contacter": "Voici nos moyens de contact :<br>" +
                "- WhatsApp : <a href='https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0' target='_blank'>Cliquez ici</a><br>" +
                "- Instagram : <a href='https://www.instagram.com/' target='_blank'>Cliquez ici</a><br>" +
                "- Facebook : <a href='https://www.facebook.com/' target='_blank'>Cliquez ici</a><br>" +
                "- Gmail : <a href='mailto:example@gmail.com'>Cliquez ici</a>",
            "contatc": "Voici nos moyens de contact :<br>" +
                "- WhatsApp : <a href='https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0' target='_blank'>Cliquez ici</a><br>" +
                "- Instagram : <a href='https://www.instagram.com/' target='_blank'>Cliquez ici</a><br>" +
                "- Facebook : <a href='https://www.facebook.com/' target='_blank'>Cliquez ici</a><br>" +
                "- Gmail : <a href='mailto:example@gmail.com'>Cliquez ici</a>",
            // Vos autres questions/réponses existantes :
            "quels sont vos produits": "Vous pouvez consulter nos produits publicitaires en cliquant ici : <a href='#publicite-produits'>Produits Publicitaires</a>.",
            "comment vous contacter": "Voici nos moyens de contact :<br>" +
                "- WhatsApp : <a href='https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0' target='_blank'>Cliquez ici</a><br>" +
                "- Instagram : <a href='https://www.instagram.com/' target='_blank'>Cliquez ici</a><br>" +
                "- Facebook : <a href='https://www.facebook.com/' target='_blank'>Cliquez ici</a><br>" +
                "- Gmail : <a href='mailto:example@gmail.com'>Cliquez ici</a>",
            "comment tu va": "Je vais très bien, Mashallah Alhamdoulilah, par la grâce de Dieu. Merci ! 😊",
            "comment vous allez": "Je vais très bien, Mashallah Alhamdoulilah, par la grâce de Dieu. Merci ! 😊",
            "bonjour": "Bonjour et bienvenue sur FADIDI ! Comment puis-je vous aider aujourd'hui ? 😊",
            "salut": "Salut ! Je suis là pour répondre à toutes vos questions. Que puis-je faire pour vous ?",
            "hello": "Hello ! Bienvenue sur FADIDI. Posez-moi une question, je suis là pour vous aider.",
            "comment rejoindre la boutique": "Vous pouvez rejoindre la boutique en cliquant sur ce lien : <a href='boutique.html'>Boutique</a>.",
            "comment rejoindre la promotion": "Vous pouvez rejoindre la promotion en cliquant sur ce lien : <a href='promotion.html'>promotion</a>.",
            "comment payer": "Nous acceptons les paiements via Wave, Orange Money et Visa. Consultez la section <a href='#paiement'>Paiement</a> pour plus de détails.",
            "quelles sont vos offres": "Actuellement, nous offrons sur tous les produits et la livraison gratuite pour les commandes de plus de 50 000 CFA.",
            "où êtes-vous situé": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "comment laisser un avis": "Vous pouvez laisser un avis dans la section 'Donnez-nous une note' en bas de la page.",
            "quels sont vos horaires": "Notre site est disponible 24h/24 et 7j/7 pour vos achats en ligne.",
            "comment s'abonner": "Cliquez sur le bouton 'S'abonner' dans le menu pour recevoir des notifications sur nos nouveaux produits et promotions.",
            "comment fonctionne le panier": "Ajoutez des produits au panier en cliquant sur 'Ajouter au panier'. Vous pouvez consulter votre panier en haut de la page.",
            "comment voir les promotions": "Les promotions sont affichées dans la section 'Offres spéciales ou la page promotion' sur la page principale.",
            "comment accéder à la section contact": "Cliquez sur 'Contact' dans le menu pour accéder à nos informations de contact.",
            "comment fonctionne le carousel": "Le carousel affiche nos produits en vedette. Vous pouvez naviguer avec les flèches ou attendre le défilement automatique.",
            "comment fonctionne le formulaire de paiement": "Remplissez vos informations personnelles et choisissez un mode de paiement pour finaliser votre commande.",
            "comment fonctionne l'abonnement": "Entrez votre email et votre numéro de téléphone dans le formulaire d'abonnement pour recevoir des notifications.",
            "comment voir les avis": "Les avis des clients sont affichés dans la section 'Reviews' sur la page principale.",
            "comment fonctionne la livraison": "Nous livrons partout au Sénégal. Les frais de livraison sont calculés lors de la commande.",
                        
            "comment suivre ma commande": "Pour suivre votre commande, cliquez sur le lien <a href='suivi-commande.html'>Suivi de commande</a> dans le menu en haut de la page. Entrez le numéro de votre commande pour voir son statut en temps réel (en préparation, expédiée, livrée, etc.). Si besoin, contactez-nous pour plus d'informations.",
            "suivi de commande": "Pour suivre votre commande, cliquez sur <a href='suivi-commande.html'>Suivi de commande</a> dans le menu. Saisissez votre numéro de commande pour voir l'état d'avancement de votre livraison.",
            "comment fonctionne le suivi de commande": "Après avoir passé une commande, vous recevez un numéro de commande. Rendez-vous sur la page <a href='suivi-commande.html'>Suivi de commande</a>, entrez ce numéro et vous verrez le statut de votre commande (préparation, expédition, livraison). Si vous avez des questions, contactez notre service client.",
            
            "comment voir les détails d'un produit": "Cliquez sur un produit dans la boutique pour voir ses détails, y compris le prix, les tailles disponibles et les couleurs.",
            "boutique": "Vous pouvez rejoindre la boutique en cliquant sur ce lien : <a href='boutique.html'>Boutique</a>.",
            "promotin": "Vous pouvez rejoindre la page promotion en cliquant sur ce lien : <a href='promotion.html'>promotion</a>.",
            "payer": "Nous acceptons les paiements via Wave, Orange Money et Visa. Consultez la section <a href='#paiement'>Paiement</a> pour plus de détails.",
            "paiement": "Nous acceptons les paiements via Wave, Orange Money et Visa. Consultez la section <a href='#paiement'>Paiement</a> pour plus de détails.",
            "situé": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "localisation": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "adresse": "Nous sommes une boutique en ligne et nous livrons partout au Sénégal.",
            "avis": "Vous pouvez laisser un avis dans la section 'Donnez-nous une note' en bas de la page.",
            "review": "Vous pouvez laisser un avis dans la section 'Donnez-nous une note' en bas de la page.",
            "commentaire": "Vous pouvez laisser un avis dans la section 'Donnez-nous une note' en bas de la page.",
            "abonne": "Cliquez sur le bouton 'S'abonner' dans le menu pour recevoir des notifications sur nos nouveaux produits et promotions.",
            "newsletter": "Cliquez sur le bouton 'S'abonner' dans le menu pour recevoir des notifications sur nos nouveaux produits et promotions.",
            "horaire": "Notre site est disponible 24h/24 et 7j/7 pour vos achats en ligne.",
            "heure": "Notre site est disponible 24h/24 et 7j/7 pour vos achats en ligne.",
            "ouvert": "Notre site est disponible 24h/24 et 7j/7 pour vos achats en ligne.",
            "panier": "Ajoutez des produits au panier en cliquant sur 'Ajouter au panier'. Vous pouvez consulter votre panier en haut de la page.",
            "cart": "Ajoutez des produits au panier en cliquant sur 'Ajouter au panier'. Vous pouvez consulter votre panier en haut de la page.",
            "livraison": "Nous livrons partout au Sénégal. Les frais de livraison sont calculés lors de la commande.",
            "frais": "Nous livrons partout au Sénégal. Les frais de livraison sont calculés lors de la commande."
        };

        // 1. Chercher une correspondance exacte ou très proche sur la question entière
        let bestMatch = null;
        let bestLength = 0;
        for (const question in faq) {
            if (isSimilar(lowerCaseMessage, question)) {
                if (question.length > bestLength) {
                    bestMatch = faq[question];
                    bestLength = question.length;
                }
            }
        }

        // 2. Si aucune correspondance exacte, chercher le mot-clé le plus pertinent dans la question
        if (!bestMatch) {
            for (const question in faq) {
                if (lowerCaseMessage.split(' ').some(word => isSimilar(word, question))) {
                    if (question.length > bestLength) {
                        bestMatch = faq[question];
                        bestLength = question.length;
                    }
                }
            }
        }

        if (bestMatch) {
            response = bestMatch;
        }

        addMessage(response, 'bot-message');
    }
});

function closeWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.style.animation = 'fadeOut 1s ease-in-out';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
    }, 1000); // Correspond à la durée de l'animation fadeOut
}


// desactivation du clique droit section securite commence ici
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e) {
    // Désactiver Ctrl+U (afficher le code source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        alert('Cette action est désactivée.');
    }

    // Désactiver Ctrl+C (copier)
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        alert('Le copier est désactivé.');
    }

    // Désactiver Ctrl+S (enregistrer la page)
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        alert('L’enregistrement de cette page est désactivé.');
    }
});// section securite fin ici




// ===============================
//// WIDGET AJOUTER DEPUI DASHBOARD DEBUTTTTTTT
// // ===============================

// ==================== REDIRECTION VERS LA BOUTIQUE CAROUSELLLL ====================

function createIndexCarousel(sectionId, products) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const track = section.querySelector('.custom-carousel-track');
    if (!track) return;
    track.innerHTML = products.map(product => `
        <div class="carousel-item" style="cursor:pointer;" onclick="window.location.href='boutique.html'">
            <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" style="width:120px;height:120px;object-fit:contain;">
            <div style="text-align:center;color:#222;font-weight:bold;">${product.name}</div>
        </div>
    `).join('');

    // Animation fluide JS
    let offset = 0;
    let speed = 1.5;
    function animate() {
        offset -= speed;
        const trackWidth = track.scrollWidth;
        const viewportWidth = section.querySelector('.custom-carousel-viewport').offsetWidth;
        if (-offset > trackWidth - viewportWidth) offset = 0;
        track.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(animate);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', function() {
    // Récupère les produits du localStorage (priorité à fadidiIndexCarouselProducts)
    const products = JSON.parse(localStorage.getItem('fadidiIndexCarouselProducts') || '[]');
    if (products.length > 0) {
        createIndexCarousel('carousel-section-1', products);
    } else {
        const allProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]').slice(0, 10);
        createIndexCarousel('carousel-section-1', allProducts);
    }
});




// ===============================
//// WIDGET AJOUTER DEPUI DASHBOARD FINNNNNNNNNN
// // ===============================
