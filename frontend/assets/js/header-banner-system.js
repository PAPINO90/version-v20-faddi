// ==========================================
// SYSTÈME DE BANNIÈRES HEADER DÉFILANTES
// ==========================================

class HeaderBannerSystem {
    constructor() {
        this.banners = [];
        this.currentBannerIndex = 0;
        this.bannerContainer = null;
        this.intervalId = null;
        this.isActive = false;
        this.originalHeaderContent = '';
        
        this.init();
    }
    
    async init() {
        // Injecter les styles CSS
        this.injectStyles();
        
        // Vérifier s'il y a des bannières actives
        try {
            const hasActiveBanners = await this.checkForActiveBanners();
            
            if (hasActiveBanners) {
                await this.loadBanners();
                this.setupBannerContainer();
                this.startBannerRotation();
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des bannières header:', error);
        }
    }
    
    injectStyles() {
        if (document.getElementById('header-banner-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'header-banner-styles';
        style.textContent = `
            .header-banner-container {
                position: relative !important;
                width: 100% !important;
                height: auto !important;
                min-height: 160px !important;
                max-height: 400px !important;
                overflow: hidden !important;
                background: transparent !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 0 0 20px 20px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
            }
            
            .header-banner-slide {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                transition: opacity 0.6s ease-in-out !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 20px 40px !important;
                box-sizing: border-box !important;
            }
            
            .banner-product-image {
                width: 200px !important;
                height: 140px !important;
                object-fit: contain !important;
                border-radius: 12px !important;
                background: rgba(255,255,255,0.1) !important;
                padding: 10px !important;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
            }
            
            .banner-content {
                flex: 1 !important;
                padding-left: 40px !important;
                color: white !important;
                text-align: left !important;
            }
            
            .banner-title {
                font-size: 2.2em !important;
                font-weight: 900 !important;
                color: #FFD700 !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                margin-bottom: 8px !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
            }
            
            .banner-description {
                font-size: 1.1em !important;
                color: #ffffff !important;
                margin-bottom: 15px !important;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.7) !important;
                line-height: 1.4 !important;
            }
            
            .banner-price {
                font-size: 2.5em !important;
                font-weight: 900 !important;
                color: #FF8C00 !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                background: rgba(255,140,0,0.1) !important;
                padding: 8px 16px !important;
                border-radius: 25px !important;
                display: inline-block !important;
                border: 2px solid #FF8C00 !important;
                animation: pulse-price 2s infinite !important;
            }
            
            @keyframes pulse-price {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .header-banner-slide img.full-banner {
                width: 100% !important;
                height: auto !important;
                max-height: 400px !important;
                object-fit: contain !important;
                display: block !important;
                background: white !important;
                box-sizing: border-box !important;
            }
            
            .banner-image-full {
                width: 100% !important;
                height: auto !important;
                max-height: 250px !important;
                object-fit: contain !important;
                display: block !important;
                margin: 0 auto !important;
                background: transparent !important;
                border-radius: 10px !important;
                box-sizing: border-box !important;
            }
            
            .banner-indicators {
                position: absolute !important;
                bottom: 10px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                display: flex !important;
                gap: 8px !important;
                z-index: 10 !important;
            }
            
            .banner-indicator {
                width: 10px !important;
                height: 10px !important;
                border-radius: 50% !important;
                background: rgba(255,255,255,0.5) !important;
                cursor: pointer !important;
                transition: background 0.3s ease !important;
            }
            
            .banner-indicator.active {
                background: #fff !important;
            }
            
            @media (max-width: 768px) {
                .header-banner-container {
                    min-height: 140px !important;
                    max-height: 200px !important;
                    border-radius: 0 0 12px 12px !important;
                    overflow: hidden !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .banner-image-full {
                    max-height: 180px !important;
                    width: 100% !important;
                    object-fit: contain !important;
                    height: auto !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .header-banner-slide {
                    padding: 8px 6px !important;
                    flex-direction: column !important;
                    text-align: center !important;
                    height: auto !important;
                    min-height: 140px !important;
                    max-height: 200px !important;
                    align-items: center !important;
                    justify-content: center !important;
                    box-sizing: border-box !important;
                    margin: 0 !important;
                    overflow: hidden !important;
                }
                
                .banner-product-image {
                    width: 100px !important;
                    height: 70px !important;
                    margin-bottom: 8px !important;
                    object-fit: contain !important;
                    flex-shrink: 0 !important;
                }
                
                .banner-content {
                    padding-left: 0 !important;
                    text-align: center !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 6px !important;
                    overflow: hidden !important;
                }
                
                .banner-title {
                    font-size: 1.2em !important;
                    margin-bottom: 4px !important;
                    line-height: 1.1 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
                
                .banner-description {
                    font-size: 0.85em !important;
                    margin-bottom: 6px !important;
                    line-height: 1.2 !important;
                    max-height: 2.4em !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 2 !important;
                    -webkit-box-orient: vertical !important;
                }
                
                .banner-price {
                    font-size: 1.4em !important;
                    padding: 4px 12px !important;
                    white-space: nowrap !important;
                }
            }
            
            @media (max-width: 480px) {
                .header-banner-container {
                    min-height: 120px !important;
                    max-height: 160px !important;
                    overflow: hidden !important;
                    border-radius: 0 0 8px 8px !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .banner-image-full {
                    max-height: 140px !important;
                    width: 100% !important;
                    object-fit: contain !important;
                    height: auto !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .header-banner-slide {
                    padding: 6px 4px !important;
                    height: auto !important;
                    min-height: 120px !important;
                    max-height: 160px !important;
                    align-items: center !important;
                    justify-content: center !important;
                    box-sizing: border-box !important;
                    margin: 0 !important;
                    overflow: hidden !important;
                }
                
                .banner-product-image {
                    width: 80px !important;
                    height: 60px !important;
                    object-fit: contain !important;
                    margin-bottom: 6px !important;
                    flex-shrink: 0 !important;
                }
                
                .banner-content {
                    padding: 0 4px !important;
                    margin: 0 !important;
                    overflow: hidden !important;
                }
                
                .banner-title {
                    font-size: 1em !important;
                    line-height: 1.1 !important;
                    margin-bottom: 3px !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
                
                .banner-description {
                    font-size: 0.75em !important;
                    line-height: 1.1 !important;
                    margin-bottom: 4px !important;
                    max-height: 1.65em !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 1 !important;
                    -webkit-box-orient: vertical !important;
                }
                
                .banner-price {
                    font-size: 1.2em !important;
                    padding: 3px 8px !important;
                    white-space: nowrap !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    async checkForActiveBanners() {
        try {
            const response = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/api/header-banners/has-active`);
            if (response.ok) {
                const result = await response.json();
                return result.hasActiveBanners;
            }
        } catch (error) {
            console.debug('Pas de bannières actives ou erreur API:', error);
        }
        return false;
    }
    
    async loadBanners() {
        try {
            const response = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/api/header-banners/active`);
            if (response.ok) {
                this.banners = await response.json();
                return this.banners.length > 0;
            }
        } catch (error) {
            console.error('Erreur lors du chargement des bannières:', error);
        }
        return false;
    }
    
    setupBannerContainer() {
        if (this.banners.length === 0) return;
        
        // Obtenir le header existant
        const header = document.querySelector('header');
        if (!header) return;
        
        // Sauvegarder le contenu original du header
        this.originalHeaderContent = header.innerHTML;
        
        // Créer le conteneur des bannières - ADAPTÉ MOBILE
        this.bannerContainer = document.createElement('div');
        this.bannerContainer.id = 'header-banner-container';
        this.bannerContainer.className = 'header-banner-container';
        this.bannerContainer.style.display = 'block';
        this.bannerContainer.style.position = 'relative';
        this.bannerContainer.style.width = '100%';
        this.bannerContainer.style.maxWidth = '100vw';
        this.bannerContainer.style.padding = '0';
        this.bannerContainer.style.margin = '0';
        this.bannerContainer.style.left = '0';
        this.bannerContainer.style.right = '0';
        this.bannerContainer.style.overflow = 'hidden';
        this.bannerContainer.style.boxSizing = 'border-box';
        
        // Hauteur responsive selon l'écran
        if (window.innerWidth <= 480) {
            this.bannerContainer.style.maxHeight = '160px';
            this.bannerContainer.style.minHeight = '120px';
        } else if (window.innerWidth <= 768) {
            this.bannerContainer.style.maxHeight = '200px';
            this.bannerContainer.style.minHeight = '140px';
        } else {
            this.bannerContainer.style.maxHeight = '400px';
            this.bannerContainer.style.minHeight = '160px';
        }
        
        // Remplacer le contenu du header
        header.innerHTML = '';
        header.appendChild(this.bannerContainer);
        
        // Marquer comme actif
        this.isActive = true;
        
        // Afficher la première bannière
        this.displayCurrentBanner();
    }
    
    displayCurrentBanner() {
        if (!this.bannerContainer || this.banners.length === 0) return;
        
        const banner = this.banners[this.currentBannerIndex];
        if (!banner) return;
        
        console.log(`🎨 Affichage de la bannière: "${banner.title}" avec position: "${banner.imagePosition || 'center'}"`);
        console.log('📋 Données complètes de la bannière:', banner);
        
        // Incrémenter le compteur de vues
        this.incrementView(banner.id);
        
        // Créer l'élément bannière
        const bannerElement = document.createElement('div');
        bannerElement.className = 'header-banner-slide';
        
        // Construire une URL complète si nécessaire
        const apiBase = window.API_BASE_URL || 'http://localhost:3000';
        const fullImageUrl = banner.imageUrl && banner.imageUrl.startsWith('http') ? banner.imageUrl : apiBase.replace(/\/api\/?$/i, '') + (banner.imageUrl || '');
        
        // Vérifier si c'est une bannière avec image de produit ou bannière complète
        if (this.isProductBanner(banner)) {
            this.createProductBanner(bannerElement, banner, fullImageUrl);
        } else {
            this.createFullBanner(bannerElement, banner, fullImageUrl);
        }
        
        // Gestion du clic si lien présent
        if (banner.linkUrl) {
            bannerElement.style.cursor = 'pointer';
            bannerElement.addEventListener('click', () => {
                this.incrementClick(banner.id);
                window.open(banner.linkUrl, '_blank');
            });
        } else {
            // Même si pas de lien, on peut compter les clics sur la bannière
            bannerElement.style.cursor = 'pointer';
            bannerElement.addEventListener('click', () => {
                this.incrementClick(banner.id);
                console.log(`🖱️ Clic enregistré sur la bannière: ${banner.title}`);
            });
        }
        
        // Nettoyer le conteneur et ajouter la nouvelle bannière
        this.bannerContainer.innerHTML = '';
        this.bannerContainer.appendChild(bannerElement);
        
        // Ajouter les indicateurs si plusieurs bannières
        if (this.banners.length > 1) {
            this.addBannerIndicators();
        }
    }
    
    isProductBanner(banner) {
        // Une bannière est considérée comme "produit" si elle a un titre et une description
        // avec des mots-clés de prix ET que ce n'est pas une bannière de type "FLASH SALE" ou promo générale
        const hasPrice = banner.description && 
               (banner.description.includes('CFA') || 
                banner.description.includes('€') || 
                banner.description.includes('$') ||
                banner.description.toLowerCase().includes('prix') ||
                banner.description.toLowerCase().includes('à partir'));
        
        const isPromoBanner = banner.title && 
               (banner.title.toLowerCase().includes('flash') ||
                banner.title.toLowerCase().includes('sale') ||
                banner.title.toLowerCase().includes('promo') ||
                banner.title.toLowerCase().includes('offre') ||
                banner.title.toLowerCase().includes('%'));
        
        // Si c'est une bannière promo générale, utiliser le mode image complète
        if (isPromoBanner) return false;
        
        // Sinon, utiliser le mode produit si prix détecté
        return hasPrice && banner.title && banner.description;
    }
    
    createProductBanner(bannerElement, banner, imageUrl) {
        console.log('🚀 DÉBUT createProductBanner - Création de la bannière produit');
        console.log('📋 Données reçues:', { title: banner.title, description: banner.description, imageUrl });
        
        // Détecter si on est sur mobile
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Mode mobile : image centrée au-dessus du texte
            bannerElement.innerHTML = `
                <div class="banner-wrapper mobile-banner" style="position: relative !important; width: 100% !important; min-height: 160px !important; display: flex !important; flex-direction: column !important; align-items: center !important; padding: 10px !important; text-align: center !important;">
                    <img src="${imageUrl}" alt="${banner.title}" class="banner-product-image"
                         style="width: 120px !important; height: 90px !important; object-fit: contain !important; margin-bottom: 10px !important; position: relative !important; left: auto !important; top: auto !important; transform: none !important; z-index: 10 !important;"
                         onerror="this.style.display='none'">
                    <div class="banner-content" style="margin-left: 0 !important; padding: 0 10px !important; position: relative !important; z-index: 5 !important; text-align: center !important;">
                        <h3 style="font-size: 18px !important; font-weight: bold !important; color: #333 !important; margin: 0 0 8px 0 !important; display: block !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important; line-height: 1.2 !important;">${banner.title || 'TITRE TEST'}</h3>
                        <p style="font-size: 14px !important; color: #666 !important; margin: 0 0 8px 0 !important; display: block !important; line-height: 1.3 !important;">${banner.description || 'Description test'}</p>
                        <div style="font-size: 16px !important; font-weight: bold !important; color: #ff6b35 !important; display: block !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;">Prix: TEST</div>
                    </div>
                </div>
            `;
        } else {
            // Mode desktop : image à gauche du texte
            bannerElement.innerHTML = `
                <div class="banner-wrapper" style="position: relative !important; width: 100% !important; min-height: 140px !important; display: block !important; padding: 15px 0 !important;">
                    <img src="${imageUrl}" alt="${banner.title}" class="banner-product-image"
                         style="position: absolute !important; left: 10px !important; top: 50% !important; transform: translateY(-50%) !important; z-index: 10 !important;"
                         onerror="this.style.display='none'">
                    <div class="banner-content" style="margin-left: 210px !important; padding: 20px !important; position: relative !important; z-index: 5 !important;">
                        <h3 style="font-size: 20px !important; font-weight: bold !important; color: #333 !important; margin: 0 0 8px 0 !important; display: block !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;">${banner.title || 'TITRE TEST'}</h3>
                        <p style="font-size: 15px !important; color: #666 !important; margin: 0 0 8px 0 !important; display: block !important; line-height: 1.4 !important;">${banner.description || 'Description test'}</p>
                        <div style="font-size: 18px !important; font-weight: bold !important; color: #ff6b35 !important; display: block !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;">Prix: TEST</div>
                    </div>
                </div>
            `;
        }
        
        // Appliquer les styles CSS personnalisés
        if (banner.customStyles) {
            this.applyCustomStyles(bannerElement, banner.customStyles);
        }
    }
    
    createFullBanner(bannerElement, banner, imageUrl) {
        // Bannière avec image complète - FORCÉE À GAUCHE
        console.log(`🎯 Position FORCÉE pour full banner "${banner.title}": "left"`);
        
        bannerElement.style.padding = '10px';
        bannerElement.style.background = 'transparent';
        bannerElement.style.minHeight = '200px';
        bannerElement.style.display = 'flex';
        bannerElement.style.alignItems = 'center';
        bannerElement.style.justifyContent = 'flex-start'; // TOUJOURS À GAUCHE
        
        // Appliquer les styles CSS personnalisés AVANT la création de l'image
        // pour que le fond personnalisé soit appliqué si défini
        if (banner.customStyles) {
            this.applyCustomStyles(bannerElement, banner.customStyles);
        }
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = banner.title;
        img.className = 'banner-image-full';
        
        // Assurer que l'image se charge correctement
        img.onload = () => {
            // Ajuster la hauteur du conteneur selon l'image et la taille d'écran
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            const containerWidth = bannerElement.offsetWidth;
            
            // Hauteurs adaptatives selon la taille d'écran
            let maxHeight = 300;
            if (window.innerWidth <= 480) {
                maxHeight = 140; // Mobile - très compact
            } else if (window.innerWidth <= 768) {
                maxHeight = 180; // Tablette - compact
            }

            // Forcer des dimensions responsives strictes pour éviter tout débordement
            img.style.maxHeight = maxHeight + 'px';
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
            img.style.margin = '0';
            img.style.padding = '0';
            img.style.boxSizing = 'border-box';

            // Forcer une hauteur fixe du conteneur pour éviter les débordements
            let containerHeight = maxHeight;
            if (bannerElement.parentElement) {
                containerHeight = Math.min(containerWidth * aspectRatio, maxHeight);
                bannerElement.parentElement.style.height = containerHeight + 'px';
                bannerElement.parentElement.style.maxHeight = maxHeight + 'px';
                bannerElement.parentElement.style.overflow = 'hidden';
                bannerElement.parentElement.style.boxSizing = 'border-box';
                bannerElement.parentElement.style.margin = '0';
                bannerElement.parentElement.style.padding = '0';
            }

            console.log(`📐 Image responsive: ${img.naturalWidth}x${img.naturalHeight}, maxHeight: ${maxHeight}px, container: ${containerHeight}px`);

            // Si aucun fond personnalisé n'est défini, détecter le fond approprié
            if (!banner.customStyles || !banner.customStyles.toLowerCase().includes('background')) {
                this.detectAndApplyBackground(bannerElement, img, banner);
            }
        };
        
        img.onerror = () => {
            console.error('Erreur de chargement de l\'image:', banner.imageUrl);
            bannerElement.innerHTML = `
                <div style="color: #333; text-align: center; padding: 40px; background: rgba(255,255,255,0.9); border-radius: 10px; width: 100%;">
                    <h2 style="color: #FF8C00; margin-bottom: 10px; font-size: 2em;">${banner.title}</h2>
                    <p style="font-size: 1.2em; color: #666;">${banner.description || 'Image non disponible'}</p>
                </div>
            `;
        };
        
        bannerElement.appendChild(img);
    }
    
    extractDescription(description) {
        if (!description) return '';
        
        // Extraire la partie description (avant le prix)
        const pricePattern = /(\d+\s*(CFA|€|\$|FCFA))/i;
        const match = description.match(pricePattern);
        
        if (match) {
            const beforePrice = description.substring(0, match.index).trim();
            return beforePrice || 'Offre spéciale';
        }
        
        // Si pas de prix trouvé, utiliser toute la description mais la limiter
        return description.length > 100 ? description.substring(0, 100) + '...' : description;
    }
    
    extractPrice(description) {
        if (!description) return '';
        
        // Chercher un prix dans la description
        const pricePatterns = [
            /(\d+\s*(?:\d{3}\s*)*\s*(?:CFA|FCFA))/i,
            /(\d+\s*(?:\d{3}\s*)*\s*€)/i,
            /(\d+\s*(?:\d{3}\s*)*\s*\$)/i,
            /(à partir de\s*\d+\s*(?:\d{3}\s*)*\s*(?:CFA|FCFA|€|\$))/i
        ];
        
        for (const pattern of pricePatterns) {
            const match = description.match(pattern);
            if (match) {
                return match[1];
            }
        }
        
        // Si aucun prix trouvé, chercher juste des nombres
        const numberMatch = description.match(/(\d+\s*(?:\d{3}\s*)*)/);
        if (numberMatch) {
            return numberMatch[1] + ' CFA';
        }
        
        return 'Prix sur demande';
    }
    
    applyCustomStyles(element, customStyles) {
        if (!customStyles || typeof customStyles !== 'string') return;
        
        console.log('🎨 Application des styles personnalisés:', customStyles);
        
        try {
            // Nettoyer et parser les styles CSS
            const styles = customStyles.trim();
            
            // Si les styles contiennent des accolades, les traiter comme un bloc CSS
            if (styles.includes('{') && styles.includes('}')) {
                this.applyStyleBlock(element, styles);
            } else {
                // Traiter comme des propriétés CSS individuelles
                this.applyStyleProperties(element, styles);
            }
        } catch (error) {
            console.error('Erreur lors de l\'application des styles personnalisés:', error);
        }
    }
    
    applyStyleBlock(element, styleBlock) {
        // Extraire les propriétés CSS du bloc
        const match = styleBlock.match(/\{([^}]+)\}/);
        if (match) {
            const properties = match[1];
            this.applyStyleProperties(element, properties);
        }
    }
    
    applyStyleProperties(element, properties) {
        // Séparer les propriétés CSS et les appliquer
        const rules = properties.split(';').filter(rule => rule.trim());
        
        rules.forEach(rule => {
            const [property, value] = rule.split(':').map(part => part.trim());
            if (property && value) {
                // Convertir les propriétés CSS en camelCase pour JavaScript
                const jsProperty = this.cssPropertyToJs(property);
                element.style[jsProperty] = value;
                console.log(`✅ Style appliqué: ${property}: ${value}`);
            }
        });
    }
    
    cssPropertyToJs(cssProperty) {
        // Convertir les propriétés CSS (kebab-case) en camelCase pour JavaScript
        return cssProperty.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    }
    
    detectAndApplyBackground(bannerElement, img, banner) {
        // Créer un canvas pour analyser l'image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Taille réduite pour l'analyse (plus rapide)
        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        
        try {
            // Dessiner l'image redimensionnée sur le canvas
            context.drawImage(img, 0, 0, sampleSize, sampleSize);
            
            // Analyser les coins pour détecter la transparence
            const corners = [
                context.getImageData(0, 0, 1, 1).data, // coin haut-gauche
                context.getImageData(sampleSize-1, 0, 1, 1).data, // coin haut-droite
                context.getImageData(0, sampleSize-1, 1, 1).data, // coin bas-gauche
                context.getImageData(sampleSize-1, sampleSize-1, 1, 1).data // coin bas-droite
            ];
            
            // Vérifier si les coins sont transparents (alpha < 255)
            const hasTransparentCorners = corners.some(pixel => pixel[3] < 255);
            
            if (hasTransparentCorners) {
                // Image avec transparence détectée
                this.applyAdaptiveBackground(bannerElement, banner);
                console.log('🔍 Transparence détectée - Fond adaptatif appliqué');
            } else {
                // Image opaque - fond transparent ou subtil
                bannerElement.style.background = 'transparent';
                console.log('🔍 Image opaque détectée - Fond transparent appliqué');
            }
            
        } catch (error) {
            console.warn('Impossible d\'analyser l\'image:', error);
            // En cas d'erreur, appliquer un fond adaptatif par défaut
            this.applyAdaptiveBackground(bannerElement, banner);
        }
    }
    
    applyAdaptiveBackground(bannerElement, banner) {
        // Détecter le thème de la page
        const isDarkTheme = this.detectPageTheme();
        
        if (isDarkTheme) {
            // Thème sombre détecté
            bannerElement.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
            bannerElement.style.color = '#ffffff';
        } else {
            // Thème clair ou neutre
            bannerElement.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
            bannerElement.style.color = '#2c3e50';
        }
        
        // Ajouter une bordure subtile
        bannerElement.style.border = '1px solid rgba(0,0,0,0.1)';
        
        console.log(`🎨 Fond adaptatif appliqué: ${isDarkTheme ? 'sombre' : 'clair'}`);
    }
    
    detectPageTheme() {
        // Analyser la couleur de fond de la page
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const backgroundColor = computedStyle.backgroundColor;
        
        // Analyser si le fond est sombre
        if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            // Extraire les valeurs RGB
            const rgb = backgroundColor.match(/\d+/g);
            if (rgb) {
                const [r, g, b] = rgb.map(Number);
                const luminance = (r * 0.299 + g * 0.587 + b * 0.114);
                return luminance < 128; // Seuil pour thème sombre
            }
        }
        
        // Vérifier les classes courantes de thème sombre
        const darkThemeClasses = ['dark', 'dark-theme', 'dark-mode'];
        const hasDarkClass = darkThemeClasses.some(className => 
            body.classList.contains(className) || 
            document.documentElement.classList.contains(className)
        );
        
        return hasDarkClass;
    }    addBannerIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'banner-indicators';
        
        this.banners.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `banner-indicator ${index === this.currentBannerIndex ? 'active' : ''}`;
            
            dot.addEventListener('click', () => {
                this.goToBanner(index);
            });
            
            indicators.appendChild(dot);
        });
        
        this.bannerContainer.appendChild(indicators);
    }
    
    startBannerRotation() {
        if (this.banners.length <= 1) return;
        
        this.stopBannerRotation();
        
        const currentBanner = this.banners[this.currentBannerIndex];
        const duration = currentBanner ? currentBanner.displayDuration : 5000;
        
        this.intervalId = setTimeout(() => {
            this.nextBanner();
        }, duration);
    }
    
    stopBannerRotation() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }
    
    nextBanner() {
        if (this.banners.length <= 1) return;
        
        this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
        this.displayCurrentBanner();
        this.startBannerRotation();
    }
    
    goToBanner(index) {
        if (index >= 0 && index < this.banners.length && index !== this.currentBannerIndex) {
            this.currentBannerIndex = index;
            this.displayCurrentBanner();
            this.startBannerRotation();
        }
    }
    
    restoreOriginalHeader() {
        if (this.isActive) {
            this.stopBannerRotation();
            
            const header = document.querySelector('header');
            if (header && this.originalHeaderContent) {
                header.innerHTML = this.originalHeaderContent;
            }
            
            this.isActive = false;
            this.bannerContainer = null;
        }
    }
    
    async reload() {
        this.restoreOriginalHeader();
        await this.init();
    }
    
    // Incrémenter le compteur de vues d'une bannière
    async incrementView(bannerId) {
        try {
            const apiBase = window.API_BASE_URL || 'http://localhost:3000';
            await fetch(`${apiBase}/api/header-banners/${bannerId}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`👁️ Vue incrémentée pour la bannière ${bannerId}`);
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation des vues:', error);
        }
    }
    
    // Incrémenter le compteur de clics d'une bannière
    async incrementClick(bannerId) {
        try {
            const apiBase = window.API_BASE_URL || 'http://localhost:3000';
            await fetch(`${apiBase}/api/header-banners/${bannerId}/click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`🖱️ Clic incrémenté pour la bannière ${bannerId}`);
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation des clics:', error);
        }
    }
}

// ==========================================
// INITIALISATION
// ==========================================

// Initialiser le système quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    // Attendre un peu que les autres scripts se chargent
    setTimeout(() => {
        if (typeof window.API_BASE_URL !== 'undefined') {
            window.headerBannerSystem = new HeaderBannerSystem();
            
            // Redimensionner les bannières lors du changement de taille d'écran
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (window.headerBannerSystem && window.headerBannerSystem.isActive) {
                        console.log('🔄 Redimensionnement des bannières header...');
                        window.headerBannerSystem.displayCurrentBanner();
                    }
                }, 250);
            });
            
            // Redimensionner lors du changement d'orientation
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    if (window.headerBannerSystem && window.headerBannerSystem.isActive) {
                        console.log('🔄 Changement d\'orientation - redimensionnement des bannières...');
                        window.headerBannerSystem.displayCurrentBanner();
                    }
                }, 500);
            });
        } else {
            console.warn('API_BASE_URL non défini, les bannières header ne seront pas chargées');
        }
    }, 1000);
});

// Exposer des fonctions globales pour le contrôle externe
window.reloadHeaderBanners = function() {
    if (window.headerBannerSystem) {
        window.headerBannerSystem.reload();
    }
};

window.stopHeaderBanners = function() {
    if (window.headerBannerSystem) {
        window.headerBannerSystem.restoreOriginalHeader();
    }
};