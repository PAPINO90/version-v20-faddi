const mysql = require('mysql2/promise');

async function createDatabase() {
    try {
        // Se connecter à MySQL sans spécifier de base de données
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Root',
            port: 3306
        });

        console.log('✅ Connexion à MySQL réussie !');

        // Créer la base de données
        await connection.execute('CREATE DATABASE IF NOT EXISTS fadidi_new_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        console.log('✅ Base de données fadidi_new_db créée avec succès !');

        // Vérifier que la base existe
        const [databases] = await connection.execute('SHOW DATABASES');
        console.log('\n📋 Bases de données disponibles :');
        databases.forEach(db => {
            if (db.Database === 'fadidi_new_db') {
                console.log(`✅ ${db.Database} (NOUVELLE)`);
            } else {
                console.log(`📦 ${db.Database}`);
            }
        });

        await connection.end();
        console.log('\n🎉 Configuration terminée ! Vous pouvez maintenant redémarrer le serveur NestJS.');

    } catch (error) {
        console.error('❌ Erreur :', error.message);
        process.exit(1);
    }
}

createDatabase();