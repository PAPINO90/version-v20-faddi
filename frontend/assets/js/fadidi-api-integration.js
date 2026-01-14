/**
 * SCRIPT D'INTÉGRATION API FADIDI
 * 
 * Ce script permet de connecter la boutique FADIDI existante
 * avec la nouvelle API NestJS et le dashboard admin.
 * 
 * À inclure dans boutique.html avant la balise </body>
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        API_URL: 'http://localhost:3000/api',
        SYNC_INTERVAL: 30000, // 30 secondes
        ENABLE_API: true,
        DEBUG: true
    };

    // Logger
    const log = (message, ...args) => {
        if (CONFIG.DEBUG) {
            console.log(`[FADIDI API] ${message}`, ...args);
        }
    };

    // État de l'application
    let apiAvailable = false;
    let lastSyncTime = null;

    /**
     * Vérifier la disponibilité de l'API
     */
    async function checkApiHealth() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/products/published`, {
                method: 'HEAD',
                timeout: 5000
            });
            apiAvailable = response.ok;
            return apiAvailable;
        } catch (error) {
            apiAvailable = false;
            return false;
        }
    }

    /**
     * Charger les produits depuis l'API
     */
    async function loadProductsFromAPI() {
        try {
            log('Chargement des produits depuis l\'API...');
            
            const response = await fetch(`${CONFIG.API_URL}/products/published`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const apiProducts = await response.json();
            log('✅ Produits reçus de l\'API:', apiProducts.length);
            
            // Convertir au format FADIDI existant
            const fadidiProducts = apiProducts.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description || '',
                price: product.price,
                image: getProductImageUrl(product),
                status: 'published',
                category: product.category?.name || null,
                createdAt: product.createdAt,
                source: 'api' // Identifier la source
            }));

            // Fusionner avec les produits existants (localStorage)
            const existingProducts = getExistingProducts();
            const mergedProducts = mergeProducts(fadidiProducts, existingProducts);

            // Sauvegarder dans localStorage
            localStorage.setItem('fadidiProducts', JSON.stringify(mergedProducts));
            
            // Déclencher la mise à jour de l'affichage
            triggerProductsUpdate();
            
            lastSyncTime = new Date();
            log('✅ Synchronisation terminée:', mergedProducts.length, 'produits total');
            
            return true;

        } catch (error) {
            log('❌ Erreur API:', error.message);
            apiAvailable = false;
            return false;
        }
    }

    /**
     * Obtenir l'URL complète d'une image de produit
     */
    function getProductImageUrl(product) {
        if (product.images && product.images.length > 0) {
            return `${CONFIG.API_URL.replace('/api', '')}/uploads/${product.images[0]}`;
        }
        return '1-.png'; // Image par défaut FADIDI
    }

    /**
     * Récupérer les produits existants (localStorage)
     */
    function getExistingProducts() {
        try {
            const stored = localStorage.getItem('fadidiProducts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            log('❌ Erreur lecture localStorage:', error);
            return [];
        }
    }

    /**
     * Fusionner les produits API avec les produits existants
     */
    function mergeProducts(apiProducts, existingProducts) {
        // Séparer les produits par source
        const localProducts = existingProducts.filter(p => p.source !== 'api');
        
        // Combiner : API + Local
        return [...apiProducts, ...localProducts];
    }

    /**
     * Déclencher la mise à jour de l'affichage des produits
     */
    function triggerProductsUpdate() {
        // Déclencher l'événement storage pour réveiller les listeners existants
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'fadidiProducts',
            newValue: localStorage.getItem('fadidiProducts'),
            storageArea: localStorage
        }));

        // Appeler directement la fonction d'affichage si elle existe
        if (typeof loadAndDisplayFadidiProducts === 'function') {
            loadAndDisplayFadidiProducts();
        }
    }

    /**
     * Synchronisation périodique
     */
    function startPeriodicSync() {
        if (!CONFIG.ENABLE_API) return;

        setInterval(async () => {
            if (document.hidden) return; // Ne pas synchroniser si l'onglet n'est pas actif
            
            const isHealthy = await checkApiHealth();
            if (isHealthy) {
                await loadProductsFromAPI();
            }
        }, CONFIG.SYNC_INTERVAL);
    }

    /**
     * Ajouter les indicateurs visuels de statut API
     */
    function addApiStatusIndicator() {
        // Créer l'indicateur de statut
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'fadidi-api-status';
        statusIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 9999;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        
        // Fonction pour mettre à jour le statut
        window.updateApiStatus = function(isOnline) {
            if (isOnline) {
                statusIndicator.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                statusIndicator.style.color = 'white';
                statusIndicator.textContent = '🟢 API Connectée';
                statusIndicator.title = `API connectée - Dernière sync: ${lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Jamais'}`;
            } else {
                statusIndicator.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                statusIndicator.style.color = 'white';
                statusIndicator.textContent = '🔴 API Déconnectée';
                statusIndicator.title = 'API non disponible - Mode local uniquement';
            }
        };

        // Clic pour forcer la synchronisation
        statusIndicator.addEventListener('click', async () => {
            statusIndicator.textContent = '🔄 Synchronisation...';
            const success = await loadProductsFromAPI();
            updateApiStatus(success);
        });

        document.body.appendChild(statusIndicator);
        updateApiStatus(false); // État initial
    }

    /**
     * Initialisation du système
     */
    async function initialize() {
        log('🚀 Initialisation de l\'intégration API FADIDI...');

        // Ajouter l'indicateur de statut
        addApiStatusIndicator();

        if (!CONFIG.ENABLE_API) {
            log('⚠️ API désactivée dans la configuration');
            return;
        }

        // Vérification initiale de l'API
        const isHealthy = await checkApiHealth();
        updateApiStatus(isHealthy);

        if (isHealthy) {
            // Charger les produits depuis l'API
            await loadProductsFromAPI();
            
            // Démarrer la synchronisation périodique
            startPeriodicSync();
        } else {
            log('⚠️ API non disponible, utilisation du mode local uniquement');
        }

        log('✅ Initialisation terminée');
    }

    // Exposer les fonctions utiles globalement
    window.FadidiAPI = {
        sync: loadProductsFromAPI,
        checkHealth: checkApiHealth,
        getStatus: () => ({ apiAvailable, lastSyncTime }),
        config: CONFIG
    };

    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();