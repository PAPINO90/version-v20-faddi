const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root',
    database: 'fadidi_new_db'
  });

  try {
    // Vérifier si un admin existe déjà
    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE role = ?',
      ['admin']
    );

    if (existing.length > 0) {
      console.log('Un utilisateur admin existe déjà:', existing[0].email);
      return;
    }

    // Créer un nouvel admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminId = uuidv4();

    await connection.execute(
      `INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [adminId, 'admin@fadidi.com', hashedPassword, 'Admin', 'FADIDI', 'admin', true]
    );

    console.log('Utilisateur admin créé avec succès !');
    console.log('Email: admin@fadidi.com');
    console.log('Mot de passe: admin123');

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  } finally {
    await connection.end();
  }
}

createAdmin();