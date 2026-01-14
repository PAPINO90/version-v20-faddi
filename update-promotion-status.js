const fetch = require('node-fetch');

async function updatePromotionOrdersStatus() {
    console.log('🔄 Mise à jour du statut des commandes de promotions...');
    
    try {
        // IDs des commandes de promotions à mettre à jour
        const promotionOrderIds = [16, 17, 18];
        
        for (const orderId of promotionOrderIds) {
            try {
                console.log(`\n📋 Mise à jour commande #${orderId}...`);
                
                const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'confirmed'
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log(`✅ Commande #${orderId} mise à jour: ${result.data?.status || 'N/A'}`);
                } else {
                    const error = await response.text();
                    console.log(`❌ Erreur commande #${orderId}: ${response.status} - ${error}`);
                }
                
                // Attendre un peu entre les requêtes
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.log(`❌ Erreur commande #${orderId}:`, error.message);
            }
        }
        
        // Vérifier les nouvelles statistiques
        console.log('\n📊 Vérification des nouvelles statistiques...');
        const statsResponse = await fetch('http://localhost:3000/api/orders/stats');
        
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            console.log('\n=== NOUVELLES STATISTIQUES ===');
            console.log(`Total des commandes: ${statsData.data.totalOrders}`);
            console.log(`Commandes en attente: ${statsData.data.pendingOrders}`);
            console.log(`Commandes terminées: ${statsData.data.completedOrders}`);
            console.log(`💰 CHIFFRE D'AFFAIRES TOTAL: ${statsData.data.totalRevenue} CFA`);
            
            // Calculer le gain des promotions
            const oldRevenue = 26600;
            const newRevenue = parseFloat(statsData.data.totalRevenue);
            const promotionRevenue = newRevenue - oldRevenue;
            
            console.log(`\n🎯 Revenus des promotions: ${promotionRevenue.toFixed(2)} CFA`);
            console.log(`📈 Augmentation: +${((promotionRevenue/oldRevenue)*100).toFixed(1)}%`);
        }
        
    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

updatePromotionOrdersStatus();