/**
 * Script de diagnostic et réparation des images FADIDI
 * Utiliser ce script pour identifier et corriger les problèmes d'images
 */

class FadidiImageDiagnostic {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000';
        this.issues = [];
        this.repairedImages = 0;
        this.totalImages = 0;
    }

    /**
     * Exécute un diagnostic complet des images
     */
    async runFullDiagnostic() {
        console.log('🔍 Démarrage du diagnostic des images FADIDI...');
        
        this.issues = [];
        this.repairedImages = 0;
        this.totalImages = 0;

        // 1. Vérifier la connectivité API
        await this.checkApiConnectivity();
        
        // 2. Analyser les données de produits
        this.analyzeProductData();
        
        // 3. Vérifier les images dans le DOM
        await this.checkDOMImages();
        
        // 4. Tester l'accès aux fichiers uploadés
        await this.checkUploadsAccess();
        
        // 5. Générer le rapport
        this.generateReport();
        
        return this.issues;
    }

    /**
     * Vérifie la connectivité avec l'API
     */
    async checkApiConnectivity() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/products`, { 
                method: 'HEAD',
                timeout: 5000 
            });
            
            if (response.ok) {
                console.log('✅ API accessible');
            } else {
                this.issues.push({
                    type: 'API_ERROR',
                    severity: 'HIGH',
                    message: `API inaccessible (status: ${response.status})`
                });
            }
        } catch (error) {
            this.issues.push({
                type: 'API_CONNECTIVITY',
                severity: 'HIGH',
                message: `Impossible de se connecter à l'API: ${error.message}`
            });
        }
    }

    /**
     * Analyse les données de produits dans le localStorage
     */
    analyzeProductData() {
        console.log('📊 Analyse des données de produits...');
        
        // Vérifier les produits FADIDI
        const fadidiProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
        const vendorProducts = JSON.parse(localStorage.getItem('vendorProducts') || '[]');
        
        this.analyzeProductArray(fadidiProducts, 'FADIDI');
        this.analyzeProductArray(vendorProducts, 'Vendeur');
    }

    /**
     * Analyse un tableau de produits
     */
    analyzeProductArray(products, source) {
        if (!Array.isArray(products)) {
            this.issues.push({
                type: 'DATA_STRUCTURE',
                severity: 'MEDIUM',
                message: `Les données ${source} ne sont pas un tableau valide`
            });
            return;
        }

        let productsWithoutImages = 0;
        let productsWithInvalidImages = 0;

        products.forEach((product, index) => {
            // Vérifier la présence d'images
            if (!product.images && !product.image) {
                productsWithoutImages++;
            } else {
                // Vérifier la validité des URLs d'images
                const images = product.images || [product.image];
                images.forEach(img => {
                    if (img && typeof img === 'string') {
                        if (!this.isValidImageUrl(img)) {
                            productsWithInvalidImages++;
                        }
                    }
                });
            }
        });

        if (productsWithoutImages > 0) {
            this.issues.push({
                type: 'MISSING_IMAGES',
                severity: 'MEDIUM',
                message: `${productsWithoutImages} produits ${source} sans images`
            });
        }

        if (productsWithInvalidImages > 0) {
            this.issues.push({
                type: 'INVALID_IMAGE_URLS',
                severity: 'HIGH',
                message: `${productsWithInvalidImages} URLs d'images invalides (${source})`
            });
        }

        console.log(`📈 ${source}: ${products.length} produits, ${productsWithoutImages} sans images, ${productsWithInvalidImages} URLs invalides`);
    }

    /**
     * Vérifie si une URL d'image est valide
     */
    isValidImageUrl(url) {
        if (!url || typeof url !== 'string') return false;
        
        // URL complète valide
        if (url.startsWith('http')) return true;
        
        // Nom de fichier valide
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return true;
        
        return false;
    }

    /**
     * Vérifie toutes les images dans le DOM
     */
    async checkDOMImages() {
        console.log('🖼️ Vérification des images dans le DOM...');
        
        const images = document.querySelectorAll('img');
        this.totalImages = images.length;
        
        let brokenImages = 0;
        let loadingImages = 0;

        for (const img of images) {
            // Tester le chargement de l'image
            const isLoaded = await this.testImageLoad(img.src);
            
            if (!isLoaded) {
                brokenImages++;
                // Tenter de réparer l'image
                this.repairImage(img);
            }
            
            // Vérifier si l'image est en cours de chargement
            if (img.complete === false) {
                loadingImages++;
            }
        }

        if (brokenImages > 0) {
            this.issues.push({
                type: 'BROKEN_IMAGES',
                severity: 'HIGH',
                message: `${brokenImages} images cassées détectées dans le DOM`
            });
        }

        if (loadingImages > 0) {
            this.issues.push({
                type: 'LOADING_IMAGES',
                severity: 'LOW',
                message: `${loadingImages} images encore en cours de chargement`
            });
        }
    }

    /**
     * Teste si une image peut être chargée
     */
    testImageLoad(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
            
            // Timeout après 3 secondes
            setTimeout(() => resolve(false), 3000);
        });
    }

    /**
     * Répare une image cassée
     */
    repairImage(imgElement) {
        const originalSrc = imgElement.getAttribute('data-original-src') || imgElement.src;
        const altText = imgElement.alt || 'Produit';

        // Essayer différentes stratégies de réparation
        const repairStrategies = [
            // Stratégie 1: Reconstruire l'URL depuis l'API
            () => {
                if (originalSrc.includes('uploads/')) {
                    const filename = originalSrc.split('uploads/').pop();
                    return `${this.apiBaseUrl}/uploads/${filename}`;
                }
                return null;
            },
            
            // Stratégie 2: Utiliser l'image par défaut
            () => 'assets/images/1-.png',
            
            // Stratégie 3: Placeholder d'erreur
            () => `https://via.placeholder.com/200x150/ff8c00/ffffff?text=${encodeURIComponent(altText)}`
        ];

        for (const strategy of repairStrategies) {
            const newSrc = strategy();
            if (newSrc && newSrc !== originalSrc) {
                imgElement.src = newSrc;
                imgElement.style.border = '2px dashed #ff8c00';
                imgElement.title = `Image réparée: ${altText}`;
                this.repairedImages++;
                break;
            }
        }
    }

    /**
     * Vérifie l'accès au dossier uploads
     */
    async checkUploadsAccess() {
        console.log('📁 Vérification de l\'accès au dossier uploads...');
        
        try {
            // Vérifie l'accès à un fichier existant (placeholder.jpg)
            const response = await fetch(`${this.apiBaseUrl}/uploads/placeholder.jpg`, {
                method: 'GET',
                timeout: 3000
            });
            if (response.ok) {
                console.log('✅ Fichier uploads/placeholder.jpg accessible');
            } else {
                this.issues.push({
                    type: 'UPLOADS_ACCESS',
                    severity: 'HIGH',
                    message: `Fichier uploads/placeholder.jpg inaccessible (status: ${response.status})`
                });
            }
        } catch (error) {
            this.issues.push({
                type: 'UPLOADS_CONNECTIVITY',
                severity: 'HIGH',
                message: `Impossible d'accéder au fichier uploads/placeholder.jpg: ${error.message}`
            });
        }
    }

    /**
     * Génère un rapport de diagnostic
     */
    generateReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📋 RAPPORT DE DIAGNOSTIC DES IMAGES FADIDI');
        console.log('='.repeat(50));
        
        console.log(`📊 Statistiques générales:`);
        console.log(`   - Total d'images analysées: ${this.totalImages}`);
        console.log(`   - Images réparées: ${this.repairedImages}`);
        console.log(`   - Problèmes détectés: ${this.issues.length}`);
        
        if (this.issues.length === 0) {
            console.log('\n✅ Aucun problème détecté ! Toutes les images fonctionnent correctement.');
        } else {
            console.log('\n🚨 Problèmes détectés:');
            
            const groupedIssues = this.groupIssuesBySeverity();
            
            ['HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
                const severityIssues = groupedIssues[severity] || [];
                if (severityIssues.length > 0) {
                    const icon = severity === 'HIGH' ? '🔴' : severity === 'MEDIUM' ? '🟡' : '🟢';
                    console.log(`\n${icon} Priorité ${severity}:`);
                    severityIssues.forEach(issue => {
                        console.log(`   - ${issue.message}`);
                    });
                }
            });
        }
        
        console.log('\n💡 Recommandations:');
        this.generateRecommendations();
        
        console.log('='.repeat(50));
    }

    /**
     * Groupe les problèmes par sévérité
     */
    groupIssuesBySeverity() {
        return this.issues.reduce((groups, issue) => {
            const severity = issue.severity || 'LOW';
            if (!groups[severity]) groups[severity] = [];
            groups[severity].push(issue);
            return groups;
        }, {});
    }

    /**
     * Génère des recommandations basées sur les problèmes détectés
     */
    generateRecommendations() {
        const issueTypes = [...new Set(this.issues.map(issue => issue.type))];
        
        if (issueTypes.includes('API_CONNECTIVITY') || issueTypes.includes('API_ERROR')) {
            console.log('   1. Vérifiez que l\'API NestJS est démarrée sur http://localhost:3000');
            console.log('   2. Exécutez: npm run start dans le dossier api-nestjs/');
        }
        
        if (issueTypes.includes('UPLOADS_ACCESS') || issueTypes.includes('UPLOADS_CONNECTIVITY')) {
            console.log('   3. Vérifiez les permissions du dossier uploads/');
            console.log('   4. Assurez-vous que les images sont correctement uploadées');
        }
        
        if (issueTypes.includes('BROKEN_IMAGES')) {
            console.log('   5. Utilisez la fonction repairAllImages() pour réparer les images cassées');
            console.log('   6. Rechargez les produits depuis l\'API avec forceReloadFromAPI()');
        }
        
        if (issueTypes.includes('MISSING_IMAGES')) {
            console.log('   7. Ajoutez des images par défaut pour les produits sans images');
            console.log('   8. Vérifiez l\'upload des images dans l\'interface admin');
        }
        
        if (this.issues.length === 0 || issueTypes.every(type => ['LOW', 'LOADING_IMAGES'].includes(type))) {
            console.log('   ✅ Système d\'images fonctionnel, continuez à surveiller');
        }
    }

    /**
     * Répare automatiquement tous les problèmes possibles
     */
    async autoRepair() {
        console.log('🔧 Réparation automatique en cours...');
        
        // Nettoyer les caches
        if (window.fadidiImageManager) {
            window.fadidiImageManager.clearCache();
        }
        
        // Réparer toutes les images du DOM
        const images = document.querySelectorAll('img');
        for (const img of images) {
            this.repairImage(img);
        }
        
        // Recharger les produits depuis l'API si possible
        if (window.forceReloadFromAPI) {
            try {
                await window.forceReloadFromAPI();
            } catch (error) {
                console.warn('Impossible de recharger depuis l\'API:', error);
            }
        }
        
        console.log(`✅ Réparation terminée. ${this.repairedImages} images réparées.`);
    }
}

// Créer une instance globale
window.fadidiDiagnostic = new FadidiImageDiagnostic();

// Fonctions utilitaires globales
window.runImageDiagnostic = () => window.fadidiDiagnostic.runFullDiagnostic();
window.repairAllImageIssues = () => window.fadidiDiagnostic.autoRepair();

// Diagnostic automatique au chargement (optionnel)
document.addEventListener('DOMContentLoaded', function() {
    // Attendre 3 secondes avant le diagnostic automatique
    setTimeout(() => {
        console.log('🔍 Diagnostic automatique des images...');
        window.fadidiDiagnostic.runFullDiagnostic();
    }, 3000);
});

console.log('🔧 Diagnostic des images FADIDI chargé');
console.log('💡 Utilisez runImageDiagnostic() pour un diagnostic complet');
console.log('💡 Utilisez repairAllImageIssues() pour une réparation automatique');