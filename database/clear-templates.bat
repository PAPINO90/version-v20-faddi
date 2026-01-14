@echo off
echo ===========================================
echo SUPPRESSION DE TOUS LES TEMPLATES FADIDI
echo ===========================================
echo.
echo ⚠️  ATTENTION: Cette operation va supprimer TOUTES les donnees de test/templates!
echo    - Tous les produits
echo    - Toutes les promotions  
echo    - Toutes les categories
echo    - Toutes les commandes
echo    - Toutes les publicites flottantes
echo    - Tous les codes d'authentification
echo.
echo ❓ Les comptes utilisateur admin seront preserves.
echo.

set /p confirm="Etes-vous sur de vouloir continuer? (oui/non): "
if /i "%confirm%" NEQ "oui" (
    echo Operation annulee.
    pause
    exit /b 1
)

echo.
echo 🔄 Connexion a la base de donnees MySQL...

REM Configuration de la base de données
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=fadidi_new_db

echo 📊 Execution du script de suppression...

REM Exécuter le script SQL
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < clear-all-templates.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Templates supprimes avec succes!
    echo.
    echo 📋 Resumé:
    echo    - Base de donnees: %DB_NAME%
    echo    - Toutes les donnees de test ont ete supprimees
    echo    - Les tables sont maintenant vides
    echo    - Vous pouvez maintenant ajouter de nouvelles donnees
    echo.
) else (
    echo.
    echo ❌ Erreur lors de la suppression des templates!
    echo    Verifiez:
    echo    - Que MySQL est lance
    echo    - Que la base de donnees '%DB_NAME%' existe
    echo    - Que les parametres de connexion sont corrects
    echo.
)

echo Appuyez sur une touche pour continuer...
pause > nul