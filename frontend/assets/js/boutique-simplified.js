/**
 * BOUTIQUE FADIDI - Fonctions principales (sans panier)
 * Le panier est maintenant géré par new-cart.js
 */

// =========================
// GESTION DES ACCORDÉONS
// =========================
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

// =========================
// GESTION DES IMAGES MODALES
// =========================
function openImage(imgElement) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    
    if (!modal || !modalImg) return;
    
    modal.style.display = "block";
    modalImg.src = imgElement.src;
}

function closeImage() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// =========================
// SYSTÈME DE RECHERCHE
// =========================
function searchProduct() {
    const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
    if (!searchInput) return;
    
    // Réinitialiser les résultats précédents
    resetSearchResults();
    
    
    // Variables pour stocker les résultats
    let foundProducts = [];
    let foundSections = [];
    let foundMenuItems = [];
    let productsWithSameName = [];
    
    // Recherche dans les produits
    const productItems = Array.from(document.querySelectorAll('.product-item'));
    const fadidiCards = Array.from(document.querySelectorAll('.fadidi-product-card'));
    const allProductElements = productItems.concat(fadidiCards);
    const productGroups = {};

    allProductElements.forEach(item => {
        let productName = '';
        let productPrice = '';
        let productDescription = '';
        
        if (item.classList.contains('fadidi-product-card')) {
            productName = item.querySelector('.fadidi-card-title')?.textContent.toLowerCase() || '';
            productPrice = item.querySelector('.fadidi-card-price')?.textContent.toLowerCase() || '';
            productDescription = item.querySelector('.fadidi-card-desc')?.textContent.toLowerCase() || '';
        } else {
            productName = item.querySelector('span:first-of-type, h3')?.textContent.toLowerCase() || '';
            productPrice = item.querySelector('span:nth-of-type(2), .price')?.textContent.toLowerCase() || '';
            productDescription = item.querySelector('.product-description')?.textContent.toLowerCase() || '';
        }

        if (productName.includes(searchInput)) {
            foundProducts.push(item);
            item.classList.add('search-highlight');
            item.style.display = 'block';
            openParentSection(item);

            const cleanName = productName.replace(/[^a-z0-9]/g, '');
            if (!productGroups[cleanName]) {
                productGroups[cleanName] = [];
            }
            productGroups[cleanName].push(item);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Identifier les groupes de produits du même nom
    Object.values(productGroups).forEach(group => {
        if (group.length > 1) {
            productsWithSameName = productsWithSameName.concat(group);
        }
    });
    
    // Recherche dans les sections/catégories
    const sections = ['electronique', 'mode', 'sport', 'divers', 'vitrine', 'fadidi-products'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section && sectionId.toLowerCase().includes(searchInput)) {
            foundSections.push(section);
            section.classList.add('search-highlight');
        }
    });
    
    // Recherche dans les titres d'accordéon
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        if (header.textContent.toLowerCase().includes(searchInput)) {
            foundSections.push(header.parentElement);
            header.classList.add('search-highlight');
            const accordionContent = header.nextElementSibling;
            if (accordionContent) {
                accordionContent.style.display = 'block';
            }
        }
    });
    
    // Recherche dans les éléments du menu
    const menuItems = document.querySelectorAll('#menuContent a');
    menuItems.forEach(item => {
        if (item.textContent.toLowerCase().includes(searchInput)) {
            foundMenuItems.push(item);
            item.classList.add('search-highlight');
        }
    });
    
    // Afficher les résultats
    if (foundProducts.length === 0 && foundSections.length === 0 && foundMenuItems.length === 0) {
        showNoResultsMessage(searchInput);
    } else {
        showAdvancedSearchSummary(searchInput, foundProducts.length, foundSections.length, foundMenuItems.length, productsWithSameName.length);
        
        if (productsWithSameName.length > 0) {
            showSameNameProducts(productsWithSameName);
        }
        
        if (foundProducts.length > 0) {
            foundProducts[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (foundSections.length > 0) {
            foundSections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Fonctions utilitaires pour la recherche
function resetSearchResults() {
    const allProducts = document.querySelectorAll('.product-item, .fadidi-product-card');
    allProducts.forEach(product => {
        product.classList.remove('search-highlight', 'same-name-highlight');
        product.style.border = '';
        product.style.boxShadow = '';
        product.style.transform = '';
        product.style.zIndex = '';
    });
    
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        section.classList.remove('search-highlight');
    });
    
    const allMenuItems = document.querySelectorAll('#menuContent a');
    allMenuItems.forEach(item => {
        item.classList.remove('search-highlight');
    });
    
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.classList.remove('search-highlight');
        header.style.background = '';
        header.style.color = '';
    });
    
    const existingMessage = document.getElementById('search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const infoMessages = document.querySelectorAll('.same-name-info');
    infoMessages.forEach(msg => msg.remove());
}

function showNoResultsMessage(searchTerm) {
    const messageContainer = document.createElement('div');
    messageContainer.id = 'search-results-message';
    messageContainer.className = 'search-results-message no-results';
    messageContainer.innerHTML = `
        <p>Aucun résultat trouvé pour "<strong>${searchTerm}</strong>"</p>
        <p>Essayez avec d'autres mots-clés ou parcourez nos catégories.</p>
    `;
    const searchBar = document.querySelector('.search-bar');
    searchBar.parentNode.insertBefore(messageContainer, searchBar.nextSibling);
}

function showAdvancedSearchSummary(searchTerm, productsCount, sectionsCount, menuItemsCount, sameNameCount) {
    const messageContainer = document.createElement('div');
    messageContainer.id = 'search-results-message';
    messageContainer.className = 'search-results-message';
    let resultsText = `Résultats pour "<strong>${searchTerm}</strong>" : `;
    let details = [];
    
    if (productsCount > 0) {
        details.push(`${productsCount} produit${productsCount > 1 ? 's' : ''}`);
    }
    if (sectionsCount > 0) {
        details.push(`${sectionsCount} catégorie${sectionsCount > 1 ? 's' : ''}`);
    }
    if (menuItemsCount > 0) {
        details.push(`${menuItemsCount} élément${menuItemsCount > 1 ? 's' : ''} de menu`);
    }
    if (sameNameCount > 0) {
        details.push(`${sameNameCount} produit${sameNameCount > 1 ? 's' : ''} similaire${sameNameCount > 1 ? 's' : ''}`);
    }
    
    resultsText += details.join(', ');
    messageContainer.innerHTML = `<p>${resultsText}</p>`;
    
    const searchBar = document.querySelector('.search-bar');
    searchBar.parentNode.insertBefore(messageContainer, searchBar.nextSibling);
}

function showRedirectMessage(searchTerm, targetPage) {
    const messageContainer = document.createElement('div');
    messageContainer.id = 'search-results-message';
    messageContainer.className = 'search-results-message redirect-message';
    messageContainer.style.background = '#4CAF50';
    messageContainer.style.color = 'white';
    messageContainer.style.border = '2px solid #45a049';
    
    const pageNames = {
        'promotion.html': 'Promotions',
        'haut-game.html': 'Haut de Gamme',
        'index.html': 'Accueil',
        'suivi-commande.html': 'Suivi de Commande',
        'vendeur-register.html': 'Espace Vendeur'
    };
    
    const pageName = pageNames[targetPage] || targetPage;
    messageContainer.innerHTML = `
        <p>🎯 Recherche détectée pour "<strong>${searchTerm}</strong>"</p>
        <p>Redirection vers la page <strong>${pageName}</strong> dans 2 secondes...</p>
        <div style="margin-top: 10px;">
            <button onclick="window.location.href='${targetPage}'" style="background: white; color: #4CAF50; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Y aller maintenant</button>
            <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Annuler</button>
        </div>
    `;
    
    const searchBar = document.querySelector('.search-bar');
    searchBar.parentNode.insertBefore(messageContainer, searchBar.nextSibling);
}

function showSameNameProducts(sameNameProducts) {
    sameNameProducts.forEach(product => {
        product.classList.add('same-name-highlight');
        product.style.border = '3px solid #00ff00';
        product.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
        product.style.transform = 'scale(1.05)';
        product.style.zIndex = '10';
    });
    
    const infoMessage = document.createElement('div');
    infoMessage.className = 'same-name-info';
    infoMessage.style.position = 'fixed';
    infoMessage.style.top = '50%';
    infoMessage.style.left = '50%';
    infoMessage.style.transform = 'translate(-50%, -50%)';
    infoMessage.style.background = 'rgba(0, 0, 0, 0.9)';
    infoMessage.style.color = 'white';
    infoMessage.style.padding = '20px';
    infoMessage.style.borderRadius = '10px';
    infoMessage.style.zIndex = '9999';
    infoMessage.style.maxWidth = '400px';
    infoMessage.style.textAlign = 'center';
    
    infoMessage.innerHTML = `
        <h3>✨ Produits similaires trouvés !</h3>
        <p>Nous avons trouvé ${sameNameProducts.length} produits correspondant à votre recherche.</p>
    <p>Ils sont maintenant mis en évidence avec un contour orange.</p>
        <button onclick="this.parentElement.remove()" style="background: #ff8c00; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">OK, compris !</button>
    `;
    
    document.body.appendChild(infoMessage);
    
    setTimeout(() => {
        if (infoMessage.parentElement) {
            infoMessage.remove();
        }
    }, 5000);
}

function openParentSection(productElement) {
    let accordionContent = productElement.closest('.accordion-content');
    if (accordionContent) {
        accordionContent.style.display = 'block';
        accordionContent.style.maxHeight = 'none';
        
        const accordionHeader = accordionContent.previousElementSibling;
        if (accordionHeader && accordionHeader.classList.contains('accordion-header')) {
            accordionHeader.classList.add('active');
            accordionHeader.style.background = '#ff8c00';
            accordionHeader.style.color = 'white';
            setTimeout(() => {
                accordionHeader.style.background = '';
                accordionHeader.style.color = '';
            }, 3000);
        }
    }
    
    let parentSection = productElement.closest('section');
    if (parentSection && getComputedStyle(parentSection).display === 'none') {
        parentSection.style.display = 'block';
    }
    
    let parentDiv = productElement.closest('div[style*="display: none"], div[style*="display:none"]');
    if (parentDiv) {
        parentDiv.style.display = 'block';
    }
    
    let carousel = productElement.closest('.carousel, .slideshow, .fadidi-slideshow');
    if (carousel) {
        carousel.style.display = 'flex';
        carousel.style.visibility = 'visible';
    }
    
    let tab = productElement.closest('.tab-content, .tab-pane');
    if (tab) {
        tab.style.display = 'block';
        tab.classList.add('active', 'show');
    }
}

// =========================
// CHARGEMENT DES PRODUITS API
// =========================
// Utiliser la configuration globale API_CONFIG
let useApiMode = true;

async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/products/published`);
        if (!response.ok) throw new Error('API non disponible');
        
        const products = await response.json();
        console.log('✅ Produits chargés depuis l\'API:', products.length);
        
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
        
        localStorage.setItem('fadidiProducts', JSON.stringify(fadidiProducts));
        forceReloadProducts();
        
        return true;
    } catch (error) {
        console.warn('⚠️ API non disponible, utilisation du localStorage:', error.message);
        useApiMode = false;
        loadAndDisplayFadidiProducts();
        return false;
    }
}

function loadAndDisplayFadidiProducts() {
    const fadidiProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
    
    if (!fadidiProducts.length) {
        console.log('⚠️ Aucun produit à afficher');
        return;
    }
    
    if (window.fadidiProductManager) {
        window.fadidiProductManager.displayProducts(fadidiProducts, 'fadidi-products-list');
    } else {
        setTimeout(() => loadAndDisplayFadidiProducts(), 100);
    }
}

function forceReloadProducts() {
    if (window.fadidiProductManager) {
        window.fadidiProductManager.reloadFromAPI();
    } else {
        const fadidiSection = document.getElementById('fadidi-products-list');
        if (fadidiSection) {
            fadidiSection.innerHTML = '';
        }
        loadAndDisplayFadidiProducts();
    }
}

// =========================
// SLIDESHOW DES PRODUITS
// =========================
let currentSlideIndex = 0;
let slides = [];

function initSlideshow() {
    const products = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
    slides = products.filter(p => p.status === 'published').slice(0, 10);
    
    if (slides.length > 0) {
        showSlide(0);
    }
}

function changeSlide(direction) {
    if (slides.length === 0) return;
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    showSlide(currentSlideIndex);
}

function showSlide(index) {
    if (!slides[index]) return;
    
    const slideContent = document.getElementById('slideshow-content');
    if (!slideContent) return;
    
    const product = slides[index];
    slideContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="fadidi-slide-img" onclick="openImage(this)">
        <div class="fadidi-slide-title">${product.name}</div>
        <div class="fadidi-slide-price">${Number(product.price).toLocaleString('fr-FR')} CFA</div>
        <button data-cart-action="add" class="fadidi-card-btn"
            data-product-name="${product.name.replace(/'/g, '&#39;')}"
            data-product-price="${product.price}"
            data-product-image="${product.image}"
            data-product-id="${product.id || ''}">
            Ajouter au panier
        </button>
    `;
}

// =========================
// INITIALISATION
// =========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de la boutique FADIDI');
    
    // Charger les produits depuis l'API
    loadProductsFromAPI().then(success => {
        if (success) {
            console.log('✅ Produits chargés depuis l\'API');
        } else {
            console.log('⚠️ Utilisation du localStorage en fallback');
        }
    });
    
    // Initialiser le slideshow
    initSlideshow();
    
    // Gestion du menu
    const menuButton = document.getElementById('menuButton');
    const menuContent = document.getElementById('menuContent');
    
    if (menuButton && menuContent) {
        menuButton.addEventListener('click', () => {
            if (menuContent.style.display === 'block') {
                menuContent.style.display = 'none';
            } else {
                menuContent.style.display = 'block';
            }
        });
    }
    
    // Ajouter écouteur pour la recherche avec Entrée
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchProduct();
            }
        });
    }
    
    console.log('✅ Boutique FADIDI initialisée');
});