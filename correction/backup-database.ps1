# Script simple pour créer le backup
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFile = "fadidi_backup_$timestamp.sql"

Write-Host "Création du backup de la base de données FADIDI..." -ForegroundColor Green
Write-Host "Fichier: $backupFile"

try {
    & "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysqldump.exe" -u root -pRoot --databases fadidi_new_db --routines --triggers | Out-File -FilePath $backupFile -Encoding UTF8
    
    if (Test-Path $backupFile) {
        $size = (Get-Item $backupFile).Length
        Write-Host "✅ Backup créé avec succès!" -ForegroundColor Green
        Write-Host "📁 Fichier: $backupFile ($size octets)" -ForegroundColor Cyan
        
        Write-Host "`n🎯 POUR MIGRER VERS UNE NOUVELLE MACHINE:" -ForegroundColor Yellow
        Write-Host "1. Copier tout le dossier FADIDI--- sur la nouvelle machine"
        Write-Host "2. Copier le fichier $backupFile sur la nouvelle machine"
        Write-Host "3. Sur la nouvelle machine, créer la base de données:"
        Write-Host "   mysql -u root -p -e `"CREATE DATABASE fadidi_new_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`""
        Write-Host "4. Restaurer les données:"
        Write-Host "   mysql -u root -p fadidi_new_db < $backupFile"
        Write-Host "5. Dans api-nestjs/: npm install && npm run build && node dist/main.js"
        Write-Host "6. Dans admin-dashboard/: node server.js"
        Write-Host "`n🎉 Tous vos produits seront présents!"
        
    } else {
        Write-Host "❌ Erreur: Le fichier de backup n'a pas été créé" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}