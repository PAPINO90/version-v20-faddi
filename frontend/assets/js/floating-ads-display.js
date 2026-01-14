// Système d'affichage des publicités flottantes
class FloatingAdsDisplay {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api/floating-ads';
        this.displayedAds = new Set();
        this.init();
    }

    async init() {
        try {
            await this.loadAndDisplayAds();
        } catch (error) {
            console.error('Erreur lors du chargement des publicités:', error);
            console.log('API non disponible, pas de fallback localStorage pour éviter les conflits');
            // Pas de fallback localStorage pour éviter l'affichage d'images par défaut
            // this.loadFromLocalStorage();
        }
    }

    async loadAndDisplayAds() {
        const currentPage = this.getCurrentPageName();
        
        try {
            const response = await fetch(`${this.apiUrl}/active?page=${currentPage}`);
            if (!response.ok) throw new Error('Erreur API');
            
            const ads = await response.json();
            
            ads.forEach(ad => this.displayAd(ad));
        } catch (error) {
            throw error;
        }
    }

    loadFromLocalStorage() {
        const ads = JSON.parse(localStorage.getItem('floatingAds') || '[]');
        const currentPage = this.getCurrentPageName();
        
        const activeAds = ads.filter(ad => {
            return ad.isActive && 
                   (!ad.endDate || new Date(ad.endDate) > new Date()) &&
                   (!ad.startDate || new Date(ad.startDate) <= new Date()) &&
                   (ad.targetPages === '*' || ad.targetPages.includes(currentPage));
        });

        activeAds.forEach(ad => this.displayAd(ad));
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop() || 'index.html';
        return pageName;
    }

    displayAd(ad) {
        if (this.displayedAds.has(ad.id)) return;
        
        this.displayedAds.add(ad.id);
        
        // Incrémenter le compteur de vues
        this.incrementView(ad.id);
        
        switch (ad.displayMode) {
            case 'toast':
                this.displayToast(ad);
                break;
            case 'popup':
                this.displayPopup(ad);
                break;
            case 'banner':
                this.displayBanner(ad);
                break;
        }
    }

    displayToast(ad) {
        const toast = document.createElement('div');
        toast.className = 'floating-ad-toast';
        toast.innerHTML = this.getAdContent(ad);
        this.styleAd(toast, ad);
        this.positionAd(toast, ad);
        
        document.body.appendChild(toast);
        
        // Animation d'entrée
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto-fermeture
        if (ad.displayDuration > 0) {
            setTimeout(() => this.removeAd(toast), ad.displayDuration);
        }
        
        // Bouton de fermeture
        this.addCloseButton(toast, ad);
    }

    displayPopup(ad) {
        const overlay = document.createElement('div');
        overlay.className = 'floating-ad-popup-overlay';
        overlay.style.background = 'transparent';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'flex-start';
        overlay.style.justifyContent = 'flex-start';

        const popup = document.createElement('div');
        popup.className = 'floating-ad-popup';
        popup.innerHTML = this.getAdContent(ad);
        this.styleAd(popup, ad);

        // Positionnement du popup selon ad.position
        popup.style.position = 'absolute';
        const margin = '20px';
        switch (ad.position) {
            case 'top-left':
                popup.style.top = margin;
                popup.style.left = margin;
                break;
            case 'top-right':
                popup.style.top = margin;
                popup.style.right = margin;
                break;
            case 'top-center':
                popup.style.top = margin;
                popup.style.left = '50%';
                popup.style.transform = 'translateX(-50%)';
                break;
            case 'bottom-left':
                popup.style.bottom = margin;
                popup.style.left = margin;
                break;
            case 'bottom-right':
                popup.style.bottom = margin;
                popup.style.right = margin;
                break;
            case 'bottom-center':
                popup.style.bottom = margin;
                popup.style.left = '50%';
                popup.style.transform = 'translateX(-50%)';
                break;
            case 'center':
            default:
                popup.style.top = '50%';
                popup.style.left = '50%';
                popup.style.transform = 'translate(-50%, -50%)';
                break;
        }

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Animation d'entrée
        setTimeout(() => overlay.classList.add('show'), 100);

        // Fermeture sur clic overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.removeAd(overlay);
            }
        });

        // Bouton de fermeture
        this.addCloseButton(popup, ad, overlay);
    }

    displayBanner(ad) {
        const banner = document.createElement('div');
        banner.className = 'floating-ad-banner';
        banner.innerHTML = this.getAdContent(ad);
        this.styleAd(banner, ad);
        this.positionAd(banner, ad);
        
        document.body.appendChild(banner);
        
        // Animation d'entrée
        setTimeout(() => banner.classList.add('show'), 100);
        
        // Auto-fermeture
        if (ad.displayDuration > 0) {
            setTimeout(() => this.removeAd(banner), ad.displayDuration);
        }
        
        // Bouton de fermeture
        this.addCloseButton(banner, ad);
    }

    getAdContent(ad) {
        console.log('Affichage publicité:', ad.title, 'imageUrl:', ad.imageUrl);
        let content = `<div class="floating-ad-content">`;
        
        // Ne pas afficher d'image si imageUrl est null, undefined ou égal à l'image par défaut
        if (ad.imageUrl && 
            ad.imageUrl !== null && 
            ad.imageUrl !== 'null' && 
            ad.imageUrl !== 'assets/images/1-.png' && 
            ad.imageUrl !== 'frontend/assets/images/1-.png' &&
            ad.imageUrl.trim() !== '') {
            
            // Construire l'URL complète pour l'image
            let fullImageUrl = ad.imageUrl;
            if (ad.imageUrl.startsWith('/uploads/')) {
                // Si c'est un chemin relatif vers uploads, construire l'URL complète
                fullImageUrl = `http://localhost:3000${ad.imageUrl}`;
                console.log('URL image construite:', fullImageUrl);
            }
            
            // Créer l'image avec protection contre boutique.js
            content += `<img src="${fullImageUrl}" alt="${ad.title}" class="floating-ad-image floating-ad-protected" 
                        data-original-src="${fullImageUrl}"
                        onload="this.dataset.loaded='true'"
                        onerror="if(!this.dataset.loaded) { console.log('Image publicité échouée:', this.src); this.style.display='none'; }">`;
        }
        
        content += `
            <div class="floating-ad-text">
                <h4 class="floating-ad-title">${ad.title}</h4>
                <p class="floating-ad-description">${ad.content}</p>
            </div>
        </div>`;
        
        return content;
    }

    styleAd(element, ad) {
        // Appliquer la couleur de fond ou le gradient si fourni
        if (ad.backgroundColor === 'transparent') {
            element.style.background = 'transparent';
            element.style.boxShadow = 'none';
            element.style.border = 'none';
            element.style.borderRadius = '0';
            element.style.padding = '0';
        } else if (ad.backgroundColor) {
            if (/^linear-gradient/i.test(ad.backgroundColor)) {
                element.style.background = ad.backgroundColor;
            } else {
                element.style.background = '';
                element.style.backgroundColor = ad.backgroundColor;
            }
            element.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            element.style.borderRadius = '8px';
            element.style.padding = '15px';
        } else {
            element.style.background = '';
            element.style.backgroundColor = '';
            element.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            element.style.borderRadius = '8px';
            element.style.padding = '15px';
        }
        element.style.color = ad.textColor;
        element.style.width = ad.width;
        element.style.height = ad.height;
        // Gestion du type d’ancrage (fixe/flottant)
        // On stocke le choix dans ad.anchorType ou ad.fixed (non envoyé à l’API)
        let anchorType = ad.anchorType || ad.fixed || null;
        if (!anchorType && window.localStorage) {
            // Essaye de retrouver le type d’ancrage localement si possible
            try {
                const localAds = JSON.parse(localStorage.getItem('floatingAds') || '[]');
                const found = localAds.find(a => a.id === ad.id);
                if (found && (found.anchorType || found.fixed)) {
                    anchorType = found.anchorType || (found.fixed ? 'fixed' : 'floating');
                }
            } catch (e) {}
        }
        if (anchorType === 'fixed') {
            element.style.position = 'fixed';
        } else {
            element.style.position = 'absolute';
        }
        element.style.zIndex = '10000';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.cursor = ad.redirectUrl ? 'pointer' : 'default';
        element.style.transition = 'all 0.3s ease';

        // Gestion du clic pour redirection
        if (ad.redirectUrl) {
            element.addEventListener('click', (e) => {
                if (!e.target.classList.contains('floating-ad-close')) {
                    this.incrementClick(ad.id);
                    // Si c'est une URL externe (http/https), ouvrir dans un nouvel onglet
                    if (/^https?:\/\//i.test(ad.redirectUrl)) {
                        window.open(ad.redirectUrl, '_blank');
                    } else {
                        // Sinon, c'est une page interne, rediriger dans le même onglet
                        window.location.href = ad.redirectUrl;
                    }
                }
            });
        }
    }

    positionAd(element, ad) {
        const margin = '20px';
        
        switch (ad.position) {
            case 'top-left':
                element.style.top = margin;
                element.style.left = margin;
                break;
            case 'top-right':
                element.style.top = margin;
                element.style.right = margin;
                break;
            case 'top-center':
                element.style.top = margin;
                element.style.left = '50%';
                element.style.transform = 'translateX(-50%)';
                break;
            case 'bottom-left':
                element.style.bottom = margin;
                element.style.left = margin;
                break;
            case 'bottom-right':
                element.style.bottom = margin;
                element.style.right = margin;
                break;
            case 'bottom-center':
                element.style.bottom = margin;
                element.style.left = '50%';
                element.style.transform = 'translateX(-50%)';
                break;
            case 'center':
                element.style.top = '50%';
                element.style.left = '50%';
                element.style.transform = 'translate(-50%, -50%)';
                break;
        }
    }

    addCloseButton(element, ad, overlay = null) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'floating-ad-close';
        closeBtn.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 10001;
            background: transparent;
            border: none;
            border-radius: 50%;
            font-size: 22px;
            cursor: pointer;
            color: ${ad.textColor || '#111'};
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: none;
            ${ad.backgroundColor === 'transparent' ? 'margin-right: 16px;' : ''}
        `;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeAd(overlay || element);
        });
        element.appendChild(closeBtn);
    }

    removeAd(element) {
        if (element && element.parentNode) {
            element.style.opacity = '0';
            element.style.transform = element.style.transform + ' scale(0.95)';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }
    }

    async incrementView(adId) {
        try {
            await fetch(`${this.apiUrl}/${adId}/view`, { method: 'POST' });
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation des vues:', error);
        }
    }

    async incrementClick(adId) {
        try {
            await fetch(`${this.apiUrl}/${adId}/click`, { method: 'POST' });
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation des clics:', error);
        }
    }
}

// Styles CSS pour les publicités flottantes
const floatingAdsCSS = `
.floating-ad-toast,
.floating-ad-banner {
    opacity: 0;
    transform: translateY(20px);
}

.floating-ad-toast.show,
.floating-ad-banner.show {
    opacity: 1;
    transform: translateY(0);
}

.floating-ad-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.floating-ad-popup-overlay.show {
    opacity: 1;
}

.floating-ad-popup {
    position: relative;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.floating-ad-popup-overlay.show .floating-ad-popup {
    transform: scale(1);
}

.floating-ad-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.floating-ad-image {
    max-width: 80px;
    max-height: 80px;
    object-fit: cover;
    border-radius: 4px;
}

.floating-ad-title {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: bold;
}

.floating-ad-description {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
}

.floating-ad-close:hover {
    opacity: 0.7;
}

@media (max-width: 768px) {
    .floating-ad-toast,
    .floating-ad-banner {
        width: calc(100% - 20px) !important;
        max-width: 350px;
        margin: 10px;
        font-size: 14px;
    }
    
    .floating-ad-popup {
        width: calc(100% - 40px) !important;
        max-width: 400px;
        margin: 20px;
    }
    
    .floating-ad-content {
        flex-direction: column;
        text-align: center;
    }
    
    .floating-ad-image {
        max-width: 100px;
        max-height: 100px;
    }
}
`;

// Injecter les styles CSS
function injectFloatingAdsStyles() {
    const style = document.createElement('style');
    style.textContent = floatingAdsCSS;
    document.head.appendChild(style);
}

// Protection contre les interférences d'autres scripts
function protectFloatingAdsImages() {
    // Surveiller les changements d'images des publicités
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const img = mutation.target;
                if (img.classList.contains('floating-ad-protected')) {
                    // Si l'image a été changée vers l'image par défaut, la restaurer
                    if (img.src.includes('1-.png') && img.dataset.originalSrc) {
                        console.log('Protection: Restauration image publicité');
                        img.src = img.dataset.originalSrc;
                    }
                }
            }
        });
    });
    
    // Observer tous les changements d'attributs sur les images
    observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['src']
    });
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    injectFloatingAdsStyles();
    new FloatingAdsDisplay();
    protectFloatingAdsImages();
});