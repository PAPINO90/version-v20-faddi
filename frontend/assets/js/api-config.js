/**
 * Configuration API pour FADIDI
 * Centralise toutes les URLs et paramètres de l'API
 */

// Configuration de l'environnement
const API_CONFIG = {
    // URL de base de l'API NestJS
    BASE_URL: 'http://localhost:3000/api',
    
    // URL de base pour les fichiers uploadés
    UPLOADS_URL: 'http://localhost:3000/uploads',
    
    // Endpoints de l'API
    ENDPOINTS: {
        PRODUCTS: '/products',
        PRODUCTS_SEARCH: '/products/search',
        PRODUCTS_PUBLISHED: '/products/published',
        CATEGORIES: '/categories',
        ORDERS: '/orders',
        AUTH: '/auth',
        UPLOAD: '/upload'
    },
    
    // Configuration de la recherche
    SEARCH: {
        MIN_QUERY_LENGTH: 2,
        DEBOUNCE_DELAY: 500,
        MAX_RESULTS: 50
    },
    
    // Images par défaut
    DEFAULT_IMAGES: {
        PRODUCT: 'assets/images/1-.png',
        CATEGORY: 'assets/images/default-category.png',
    PLACEHOLDER: 'http://localhost:3000/uploads/placeholder.jpg'
    },
    
    // Timeouts
    TIMEOUTS: {
        SEARCH: 5000,
        API_REQUEST: 10000
    }
};

// Fonction helper pour construire les URLs
function buildApiUrl(endpoint, params = {}) {
    let url = API_CONFIG.BASE_URL + endpoint;
    
    // Ajouter les paramètres de requête
    if (Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
    }
    
    return url;
}

// Fonction helper pour construire l'URL des uploads
function buildUploadUrl(filename) {
    if (!filename) return API_CONFIG.DEFAULT_IMAGES.PRODUCT;
    return `${API_CONFIG.UPLOADS_URL}/${filename}`;
}

// Fonction pour vérifier si l'API est disponible
async function checkApiAvailability() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
            method: 'HEAD',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.warn('API non disponible, utilisation du mode local:', error.message);
        return false;
    }
}

// Export pour utilisation dans les autres fichiers
window.API_CONFIG = API_CONFIG;
window.buildApiUrl = buildApiUrl;
window.buildUploadUrl = buildUploadUrl;
window.checkApiAvailability = checkApiAvailability;

console.log('🔧 Configuration API FADIDI chargée');
console.log('📡 URL de base:', API_CONFIG.BASE_URL);
console.log('📁 URL uploads:', API_CONFIG.UPLOADS_URL);