/**
 * Gestionnaire d'images FADIDI
 * Résout les problèmes de suppression et d'affichage d'images
 */

class FadidiImageManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000';
        this.defaultImages = {
            product: 'assets/images/1-.png',
            placeholder: 'http://localhost:3000/uploads/placeholder.jpg'
        };
        this.imageCache = new Map();
        this.failedImages = new Set();
        
        console.log('🖼️ Gestionnaire d\'images FADIDI initialisé');
    }

    /**
     * Construit une URL d'image sécurisée avec fallback
     */
    buildImageUrl(imageData) {
        if (!imageData) {
            return this.defaultImages.product;
        }

        // Si c'est déjà une URL complète (http/https)
        if (typeof imageData === 'string' && imageData.startsWith('http')) {
            return imageData;
        }

        // Si c'est un nom de fichier
        if (typeof imageData === 'string') {
            // Nettoyer le nom de fichier
            const cleanFilename = imageData.replace(/^\/+/, '').replace(/^uploads\//, '');
            return `${this.apiBaseUrl}/uploads/${cleanFilename}`;
        }

        // Si c'est un tableau (images multiples)
        if (Array.isArray(imageData) && imageData.length > 0) {
            return this.buildImageUrl(imageData[0]);
        }

        // Fallback par défaut
        return this.defaultImages.product;
    }

    /**
     * Vérifie si une image existe et est accessible
     */
    async verifyImageExists(imageUrl) {
        // Vérifier le cache local
        if (this.imageCache.has(imageUrl)) {
            return this.imageCache.get(imageUrl);
        }

        // Vérifier si cette image a déjà échoué
        if (this.failedImages.has(imageUrl)) {
            return false;
        }

        try {
            const response = await fetch(imageUrl, { method: 'HEAD', timeout: 3000 });
            const exists = response.ok;
            
            // Mettre en cache le résultat
            this.imageCache.set(imageUrl, exists);
            
            if (!exists) {
                this.failedImages.add(imageUrl);
            }
            
            return exists;
        } catch (error) {
            console.warn(`Image non accessible: ${imageUrl}`, error);
            this.failedImages.add(imageUrl);
            this.imageCache.set(imageUrl, false);
            return false;
        }
    }

    /**
     * Applique une image sécurisée à un élément IMG avec gestion d'erreur
     */
    async setImageSafely(imgElement, imageData, options = {}) {
        if (!imgElement) return;

        const {
            showLoading = true,
            retryCount = 2,
            onError = null,
            onSuccess = null
        } = options;

        // Afficher un placeholder pendant le chargement
        if (showLoading) {
            imgElement.src = this.defaultImages.placeholder;
            imgElement.classList.add('loading');
        }

        // Construire l'URL de l'image
        const imageUrl = this.buildImageUrl(imageData);
        
        // Fonction pour gérer l'erreur de chargement
        const handleError = () => {
            console.warn(`Échec du chargement de l'image: ${imageUrl}`);
            imgElement.src = this.defaultImages.product;
            imgElement.classList.remove('loading');
            imgElement.classList.add('error');
            
            if (onError) onError();
        };

        // Fonction pour gérer le succès
        const handleSuccess = () => {
            imgElement.classList.remove('loading', 'error');
            if (onSuccess) onSuccess();
        };

        // Configurer les gestionnaires d'événements
        imgElement.onerror = handleError;
        imgElement.onload = handleSuccess;

        // Tenter de charger l'image
        try {
            // Vérifier d'abord si l'image existe
            const exists = await this.verifyImageExists(imageUrl);
            
            if (exists) {
                imgElement.src = imageUrl;
            } else {
                handleError();
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'image:', error);
            handleError();
        }
    }

    /**
     * Répare toutes les images d'un conteneur
     */
    async repairImagesInContainer(container) {
        if (!container) return;

        const images = container.querySelectorAll('img');
        console.log(`🔧 Réparation de ${images.length} images dans le conteneur`);

        for (const img of images) {
            // Récupérer la source originale ou l'attribut data-src
            const originalSrc = img.getAttribute('data-original-src') || img.src;
            
            if (originalSrc && !originalSrc.includes('placeholder') && !originalSrc.includes('1-.png')) {
                await this.setImageSafely(img, originalSrc, {
                    onError: () => {
                        console.warn(`Image réparée avec fallback: ${img.alt || 'Sans nom'}`);
                    }
                });
            }
        }
    }

    /**
     * Précharge les images d'un produit
     */
    async preloadProductImages(product) {
        if (!product || !product.images) return;

        const imagePromises = product.images.map(async (imageData) => {
            const imageUrl = this.buildImageUrl(imageData);
            try {
                await this.verifyImageExists(imageUrl);
                return imageUrl;
            } catch (error) {
                return this.defaultImages.product;
            }
        });

        return await Promise.all(imagePromises);
    }

    /**
     * Nettoie le cache d'images
     */
    clearCache() {
        this.imageCache.clear();
        this.failedImages.clear();
        console.log('🧹 Cache d\'images nettoyé');
    }

    /**
     * Force la revalidation de toutes les images
     */
    async revalidateImages() {
        console.log('🔄 Revalidation des images en cours...');
        
        // Nettoyer le cache
        this.clearCache();
        
        // Rechercher toutes les images dans la page
        const allImages = document.querySelectorAll('img');
        
        for (const img of allImages) {
            if (img.src && !img.src.includes('placeholder')) {
                // Sauvegarder la source originale
                img.setAttribute('data-original-src', img.src);
                
                // Recharger l'image
                await this.setImageSafely(img, img.src);
            }
        }
        
        console.log('✅ Revalidation terminée');
    }

    /**
     * Crée un élément image sécurisé
     */
    createSecureImage(imageData, altText = '', className = '') {
        const img = document.createElement('img');
        img.alt = altText;
        if (className) img.className = className;
        
        // Appliquer l'image de manière sécurisée
        this.setImageSafely(img, imageData);
        
        return img;
    }

    /**
     * Répare les URLs d'images dans les données de produits
     */
    repairProductImageUrls(products) {
        if (!Array.isArray(products)) return products;

        return products.map(product => {
            if (product.images && Array.isArray(product.images)) {
                product.images = product.images.map(img => this.buildImageUrl(img));
            } else if (product.image) {
                product.image = this.buildImageUrl(product.image);
            }
            return product;
        });
    }
}

// Créer une instance globale
window.fadidiImageManager = new FadidiImageManager();

// Fonction utilitaire globale pour créer des images sécurisées
window.createSecureProductImage = function(imageData, altText = '', className = '') {
    return window.fadidiImageManager.createSecureImage(imageData, altText, className);
};

// Fonction utilitaire pour réparer toutes les images de la page
window.repairAllImages = async function() {
    await window.fadidiImageManager.revalidateImages();
};

// Auto-réparation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.fadidiImageManager.repairImagesInContainer(document.body);
    }, 1000);
});

console.log('🖼️ Gestionnaire d\'images FADIDI chargé et prêt');