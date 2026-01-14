// =================================
// DIAGNOSTIC DUPLICATION FADIDI
// =================================

/**
 * Script pour diagnostiquer et corriger les problèmes de duplication
 */

function diagnoseFADIDI() {
    console.log('🔍 === DIAGNOSTIC FADIDI DUPLICATION ===');
    
    // 1. Vérifier les sections dupliquées dans le DOM
    console.log('\n📋 1. Vérification des sections dupliquées:');
    
    // Section vendeur supprimée
    
    const fadidiLists = document.querySelectorAll('#fadidi-products-list');
    console.log(`   - Conteneurs "fadidi-products-list": ${fadidiLists.length} ${fadidiLists.length > 1 ? '❌ DUPLIQUÉ' : '✅ OK'}`);
    
    // 2. Vérifier les produits dupliqués dans chaque section
    console.log('\n🔄 2. Vérification des produits dupliqués:');
    
    // Section vendeur supprimée
    
    // Section FADIDI officielle
    let fadidiDuplicates = [];
    if (fadidiLists.length > 0) {
        const fadidiProducts = fadidiLists[0].querySelectorAll('.fadidi-product-card');
        const fadidiIds = new Set();
        fadidiDuplicates = [];
        fadidiProducts.forEach(card => {
            const id = card.dataset.productId;
            if (id) {
                if (fadidiIds.has(id)) {
                    fadidiDuplicates.push(id);
                } else {
                    fadidiIds.add(id);
                }
            }
        });
        console.log(`   - Produits FADIDI: ${fadidiProducts.length} affichés, ${fadidiIds.size} uniques`);
        if (fadidiDuplicates.length > 0) {
            console.log(`   - ❌ Doublons détectés: ${fadidiDuplicates.join(', ')}`);
        } else {
            console.log(`   - ✅ Aucun doublon détecté`);
        }
    }
    
    // 3. Vérifier les variables de contrôle
    console.log('\n⚙️ 3. État des variables de contrôle:');
    
    if (window.fadidiProductManager) {
        console.log(`   - fadidiProductManager: ✅ Initialisé`);
        console.log(`   - Produits chargés: ${window.fadidiProductManager.areProductsLoaded() ? '✅ Oui' : '❌ Non'}`);
        console.log(`   - Produits en cache: ${window.fadidiProductManager.productCache.size}`);
        console.log(`   - Produits affichés: ${window.fadidiProductManager.displayedProducts.size}`);
    } else {
        console.log(`   - fadidiProductManager: ❌ Non initialisé`);
    }
    
    // Variable vendeur supprimée
    
    // 4. Recommandations
    console.log('\n💡 4. Recommandations:');
    
    if (fadidiLists.length > 1) {
        console.log('   ⚠️ Des sections FADIDI dupliquées ont été détectées dans le HTML');
        console.log('   📝 Action: Nettoyer le HTML pour supprimer les doublons');
    }
    
    // Recommandation vendeur supprimée
    
    if (fadidiDuplicates && fadidiDuplicates.length > 0) {
        console.log('   ⚠️ Des produits dupliqués ont été détectés dans "FADIDI Officiel"');
        console.log('   🔧 Action: Utiliser forceReloadProducts() pour corriger');
    }
    
    console.log('\n🏁 === FIN DU DIAGNOSTIC ===');
    
    return {
        fadidiLists: fadidiLists.length,
        fadidiDuplicates: fadidiDuplicates || []
    };
}

// Fonction pour corriger automatiquement les doublons
function autoFixDuplication() {
    console.log('🔧 === CORRECTION AUTOMATIQUE ===');
    
    // Forcer le rechargement des deux sections
    if (typeof forceReloadVendorProducts === 'function') {
        console.log('🔄 Rechargement des produits vendeurs...');
        forceReloadVendorProducts();
    }
    
    if (typeof forceReloadProducts === 'function') {
        console.log('🔄 Rechargement des produits FADIDI...');
        forceReloadProducts();
    }
    
    // Attendre et re-diagnostiquer
    setTimeout(() => {
        console.log('🔍 Re-diagnostic après correction...');
        diagnoseFADIDI();
    }, 1000);
}

// Exporter les fonctions globalement
window.diagnoseFADIDI = diagnoseFADIDI;
window.autoFixDuplication = autoFixDuplication;

// Diagnostic automatique au chargement
setTimeout(() => {
    diagnoseFADIDI();
}, 3000);

console.log('🔧 Diagnostic FADIDI chargé. Utilisez diagnoseFADIDI() ou autoFixDuplication()');