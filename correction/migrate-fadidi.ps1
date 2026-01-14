# Script de Migration Automatique FADIDI
# Usage: ./migrate-fadidi.ps1

Write-Host "🚀 Démarrage de la migration FADIDI..." -ForegroundColor Green

# 1. Créer le backup de la base de données
Write-Host "📊 Création du backup MySQL..." -ForegroundColor Yellow
$backupPath = "fadidi_complete_backup_$(Get-Date -Format 'yyyy-MM-dd_HH-mm').sql"

try {
    & "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysqldump.exe" -u root -pRoot --databases fadidi_new_db --routines --triggers | Out-File -FilePath $backupPath -Encoding UTF8
    Write-Host "✅ Backup créé: $backupPath" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du backup: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Copier les fichiers de configuration
Write-Host "📁 Préparation des fichiers..." -ForegroundColor Yellow
$migrationFiles = @(
    "api-nestjs/",
    "admin-dashboard/",
    "boutique.html",
    "boutique.js", 
    "boutique.css",
    "*.jpg",
    "*.png"
)

Write-Host "✅ Fichiers prêts pour la migration:" -ForegroundColor Green
foreach ($file in $migrationFiles) {
    Write-Host "   - $file" -ForegroundColor Cyan
}

# 3. Instructions pour la nouvelle machine
Write-Host @"

🎯 ÉTAPES POUR LA NOUVELLE MACHINE:

1️⃣ Copier ces éléments sur la nouvelle machine:
   - Tout le dossier FADIDI---/
   - Le fichier: $backupPath

2️⃣ Sur la nouvelle machine, exécuter:
   mysql -u root -p -e "CREATE DATABASE fadidi_new_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p fadidi_new_db < $backupPath

3️⃣ Dans le dossier api-nestjs:
   npm install
   npm run build
   node dist/main.js

4️⃣ Dans le dossier admin-dashboard:
   node server.js

5️⃣ Tester:
   - API: http://localhost:3000
   - Dashboard: http://localhost:8081
   - Boutique: Ouvrir boutique.html

🎉 Tous vos produits seront présents sur la nouvelle machine!

"@ -ForegroundColor Cyan

Write-Host "✅ Migration preparée avec succès!" -ForegroundColor Green