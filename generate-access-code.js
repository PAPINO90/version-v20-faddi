/**
 * Script pour générer des codes d'accès administrateur
 * Usage: node generate-access-code.js [label] [durée-en-heures]
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function generateAccessCode(label = 'Code d\'accès admin', hoursValid = 24) {
    try {
        const expiresAt = new Date(Date.now() + (hoursValid * 60 * 60 * 1000));
        
        const response = await fetch(`${API_BASE_URL}/auth-codes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                label: label,
                expiresAt: expiresAt.toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        
        console.log('\n=== CODE D\'ACCÈS GÉNÉRÉ ===');
        console.log(`Code: ${result.code}`);
        console.log(`Label: ${result.label}`);
        console.log(`Expire le: ${new Date(result.expiresAt).toLocaleString('fr-FR')}`);
        console.log(`Valide pendant: ${hoursValid}h`);
        console.log('============================\n');
        
        return result;
        
    } catch (error) {
        console.error('Erreur lors de la génération du code:', error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n❌ L\'API NestJS ne semble pas démarrée.');
            console.log('💡 Démarrez l\'API avec: npm start dans le dossier api-nestjs/');
        }
        
        process.exit(1);
    }
}

// Récupération des arguments de ligne de commande
const args = process.argv.slice(2);
const label = args[0] || 'Code d\'accès admin';
const hours = parseInt(args[1]) || 24;

// Génération du code
generateAccessCode(label, hours);