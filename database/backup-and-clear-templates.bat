@echo off
echo ===========================================
echo SAUVEGARDE + SUPPRESSION TEMPLATES FADIDI
echo ===========================================
echo.
echo Ce script va:
echo 1. 💾 Créer une sauvegarde de la base actuelle
echo 2. 🗑️  Supprimer tous les templates/données de test
echo.

REM Configuration
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=fadidi_new_db

REM Créer un nom de fichier avec timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"

set BACKUP_FILE=fadidi_backup_before_clear_%timestamp%.sql

echo 📊 Etape 1: Sauvegarde de la base de donnees...
echo Fichier: %BACKUP_FILE%

mysqldump -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% > %BACKUP_FILE%

if %errorlevel% equ 0 (
    echo ✅ Sauvegarde terminee: %BACKUP_FILE%
    echo.
    
    echo 📊 Etape 2: Suppression des templates...
    
    set /p confirm="Continuer avec la suppression? (oui/non): "
    if /i "!confirm!" EQU "oui" (
        mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < clear-all-templates.sql
        
        if !errorlevel! equ 0 (
            echo.
            echo ✅ Operation terminee avec succes!
            echo.
            echo 📋 Resumé:
            echo    - Sauvegarde: %BACKUP_FILE%
            echo    - Templates supprimes de: %DB_NAME%
            echo    - Pour restaurer: mysql -u %DB_USER% -p %DB_NAME% ^< %BACKUP_FILE%
            echo.
        ) else (
            echo ❌ Erreur lors de la suppression!
        )
    ) else (
        echo Operation de suppression annulee.
        echo La sauvegarde %BACKUP_FILE% a ete conservee.
    )
) else (
    echo ❌ Erreur lors de la sauvegarde!
    echo Impossible de continuer sans sauvegarde.
)

echo.
echo Appuyez sur une touche pour continuer...
pause > nul