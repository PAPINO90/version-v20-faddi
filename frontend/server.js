const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Configuration CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'boutique.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 Frontend FADIDI démarré sur http://localhost:${PORT}`);
    console.log(`📱 Boutique disponible sur http://localhost:${PORT}/boutique.html`);
});