const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function resetPassword(email, newPassword) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root',
    database: 'fadidi_new_db'
  });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );
    if (result.affectedRows > 0) {
      console.log(`Mot de passe réinitialisé pour ${email}. Nouveau mot de passe : ${newPassword}`);
    } else {
      console.log(`Utilisateur non trouvé : ${email}`);
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation :', error);
  } finally {
    await connection.end();
  }
}

// Exemple d’utilisation :
resetPassword('superadmin@fadidi.com', 'superadmin123');
