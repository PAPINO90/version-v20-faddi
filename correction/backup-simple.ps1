# Backup simple de la base FADIDI
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFile = "fadidi_backup_$timestamp.sql"

Write-Host "Creation du backup de la base de donnees FADIDI..."
Write-Host "Fichier: $backupFile"

try {
    & "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysqldump.exe" -u root -pRoot --databases fadidi_new_db --routines --triggers | Out-File -FilePath $backupFile -Encoding UTF8
    
    if (Test-Path $backupFile) {
        $size = (Get-Item $backupFile).Length
        Write-Host "Backup cree avec succes!"
        Write-Host "Fichier: $backupFile"
        Write-Host "Taille: $size octets"
        
        Write-Host ""
        Write-Host "POUR MIGRER VERS UNE NOUVELLE MACHINE:"
        Write-Host "1. Copier tout le dossier FADIDI--- sur la nouvelle machine"
        Write-Host "2. Copier le fichier $backupFile sur la nouvelle machine"
        Write-Host "3. Sur la nouvelle machine, creer la base de donnees:"
        Write-Host '   mysql -u root -p -e "CREATE DATABASE fadidi_new_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"'
        Write-Host "4. Restaurer les donnees:"
        Write-Host "   mysql -u root -p fadidi_new_db < $backupFile"
        Write-Host "5. Dans api-nestjs/:"
        Write-Host "   npm install"
        Write-Host "   npm run build"
        Write-Host "   node dist/main.js"
        Write-Host "6. Dans admin-dashboard/:"
        Write-Host "   node server.js"
        Write-Host ""
        Write-Host "Tous vos produits seront presents!"
        
    } else {
        Write-Host "Erreur: Le fichier de backup n'a pas ete cree"
    }
} catch {
    Write-Host "Erreur: $($_.Exception.Message)"
}