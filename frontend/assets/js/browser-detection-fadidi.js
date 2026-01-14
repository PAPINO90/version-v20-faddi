// DÉTECTION AUTOMATIQUE DU NAVIGATEUR ET CHARGEMENT DES STYLES OPTIMISÉS
// Spécialement conçu pour corriger les problèmes de compatibilité Samsung Internet

(function() {
    'use strict';
    
    console.log('🔍 Détection du navigateur pour optimisations FADIDI...');
    
    // Fonction de détection du navigateur
    function detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        const vendor = navigator.vendor.toLowerCase();
        
        // Détection Samsung Internet
        if (userAgent.includes('samsungbrowser') || userAgent.includes('samsung')) {
            return {
                name: 'Samsung Internet',
                mobile: /android|mobile/i.test(userAgent),
                version: getSamsungVersion(userAgent)
            };
        }
        
        // Détection Chrome Android
        if (userAgent.includes('chrome') && userAgent.includes('android')) {
            return {
                name: 'Chrome Android',
                mobile: true,
                version: getChromeVersion(userAgent)
            };
        }
        
        // Détection Safari iOS
        if (userAgent.includes('safari') && userAgent.includes('mobile') && !userAgent.includes('chrome')) {
            return {
                name: 'Safari iOS',
                mobile: true,
                version: getSafariVersion(userAgent)
            };
        }
        
        // Détection Firefox Mobile
        if (userAgent.includes('firefox') && userAgent.includes('mobile')) {
            return {
                name: 'Firefox Mobile',
                mobile: true,
                version: getFirefoxVersion(userAgent)
            };
        }
        
        // Navigateur desktop ou non identifié
        return {
            name: 'Desktop/Autre',
            mobile: /android|iphone|ipad|mobile/i.test(userAgent),
            version: 'inconnu'
        };
    }
    
    // Extraction version Samsung Internet
    function getSamsungVersion(ua) {
        const match = ua.match(/samsungbrowser\/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    
    // Extraction version Chrome
    function getChromeVersion(ua) {
        const match = ua.match(/chrome\/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    
    // Extraction version Safari
    function getSafariVersion(ua) {
        const match = ua.match(/version\/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    
    // Extraction version Firefox
    function getFirefoxVersion(ua) {
        const match = ua.match(/firefox\/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    
    // Chargement conditionnel des CSS
    function loadOptimizedCSS(browser) {
        const head = document.head;
        
        // CSS de base mobile (toujours charger)
        if (!document.querySelector('link[href*="promotion-mobile-optimized"]')) {
            const baseCss = document.createElement('link');
            baseCss.rel = 'stylesheet';
            baseCss.href = 'assets/css/promotion-mobile-optimized.css';
            baseCss.id = 'fadidi-mobile-base';
            head.appendChild(baseCss);
            console.log('✅ CSS mobile de base chargé');
        }
        
        // CSS spécifique Samsung Internet
        if (browser.name === 'Samsung Internet') {
            const samsungCss = document.createElement('link');
            samsungCss.rel = 'stylesheet';
            samsungCss.href = 'assets/css/samsung-internet-fix.css';
            samsungCss.id = 'fadidi-samsung-fix';
            head.appendChild(samsungCss);
            console.log('✅ CSS Samsung Internet Fix chargé');
            
            // Ajouter classe au body pour ciblage CSS
            document.body.classList.add('samsung-internet');
            
            // Fixes JavaScript pour Samsung Internet
            applySamsungFixes();
        }
        
        // CSS pour autres navigateurs mobiles
        if (browser.mobile && browser.name !== 'Samsung Internet') {
            document.body.classList.add('mobile-browser');
            console.log('✅ Mode mobile standard activé');
        }
    }
    
    // Corrections JavaScript spécifiques Samsung Internet
    function applySamsungFixes() {
        // Fix pour fit-content non supporté
        setTimeout(() => {
            const categoryBtns = document.querySelectorAll('.category-btn');
            categoryBtns.forEach(btn => {
                // Si fit-content ne fonctionne pas, utiliser width auto
                const computedStyle = getComputedStyle(btn);
                if (computedStyle.minWidth === '0px' || computedStyle.minWidth === 'auto') {
                    btn.style.minWidth = '80px';
                    btn.style.width = 'auto';
                }
            });
        }, 100);
        
        // Fix pour line-clamp non supporté
        setTimeout(() => {
            const titles = document.querySelectorAll('.promo-title');
            titles.forEach(title => {
                // Simuler line-clamp avec JavaScript si nécessaire
                if (title.scrollHeight > title.clientHeight * 1.5) {
                    const text = title.textContent;
                    const words = text.split(' ');
                    let truncated = '';
                    
                    for (let i = 0; i < words.length; i++) {
                        const testText = truncated + words[i] + ' ';
                        title.textContent = testText;
                        
                        if (title.scrollHeight > title.clientHeight * 1.5) {
                            title.textContent = truncated.trim() + '...';
                            break;
                        }
                        
                        truncated = testText;
                    }
                }
            });
        }, 200);
        
        console.log('🔧 Corrections JavaScript Samsung Internet appliquées');
    }
    
    // Test des fonctionnalités CSS
    function testCSSSupport() {
        const support = {
            grid: CSS.supports('display', 'grid'),
            flexbox: CSS.supports('display', 'flex'),
            objectFit: CSS.supports('object-fit', 'cover'),
            fitContent: CSS.supports('width', 'fit-content'),
            lineClamp: CSS.supports('-webkit-line-clamp', '2')
        };
        
        console.log('🧪 Support CSS:', support);
        
        // Appliquer des fallbacks si nécessaire
        if (!support.grid) {
            document.body.classList.add('no-grid');
            console.log('⚠️ CSS Grid non supporté - Fallback Flexbox');
        }
        
        if (!support.fitContent) {
            document.body.classList.add('no-fit-content');
            console.log('⚠️ fit-content non supporté - Largeurs fixes');
        }
        
        if (!support.objectFit) {
            document.body.classList.add('no-object-fit');
            console.log('⚠️ object-fit non supporté - Styles alternatifs');
        }
        
        return support;
    }
    
    // Fonction principale d'initialisation
    function init() {
        const browser = detectBrowser();
        
        console.log('📱 Navigateur détecté:', browser);
        
        // Tester le support CSS
        const cssSupport = testCSSSupport();
        
        // Charger les CSS optimisés
        loadOptimizedCSS(browser);
        
        // Ajouter des informations au localStorage pour debug
        localStorage.setItem('fadidi-browser-info', JSON.stringify({
            browser: browser,
            cssSupport: cssSupport,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        }));
        
        // Exposer les infos globalement pour debug
        window.fadidiBrowserInfo = {
            browser: browser,
            cssSupport: cssSupport,
            redetect: init
        };
        
        console.log('🎯 Optimisations FADIDI initialisées pour', browser.name);
    }
    
    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Réinitialiser si la taille de l'écran change
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log('📐 Taille écran changée - Vérification optimisations...');
            // Réappliquer les fixes si nécessaire
            const browser = detectBrowser();
            if (browser.name === 'Samsung Internet') {
                applySamsungFixes();
            }
        }, 250);
    });
    
})();

// Style CSS d'urgence en cas de problème de chargement
const emergencyCSS = `
    <style id="fadidi-emergency-css">
        /* CSS d'urgence pour Samsung Internet */
        @media (max-width: 768px) {
            .promo-list { 
                display: flex !important; 
                flex-wrap: wrap !important; 
                gap: 8px !important; 
            }
            .promo-card { 
                width: calc(50% - 4px) !important; 
                flex: 0 0 calc(50% - 4px) !important;
                max-width: calc(50% - 4px) !important;
            }
            .category-btn { 
                min-width: 70px !important; 
                width: auto !important; 
            }
        }
    </style>
`;

// Injecter le CSS d'urgence si les autres ne se chargent pas
setTimeout(() => {
    if (!document.querySelector('#fadidi-mobile-base')) {
        document.head.insertAdjacentHTML('beforeend', emergencyCSS);
        console.log('🚨 CSS d\'urgence FADIDI injecté');
    }
}, 1000);