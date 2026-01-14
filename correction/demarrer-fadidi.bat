@echo off
cls
echo ===============================================
echo         🚀 FADIDI - DEMARRAGE COMPLET 🚀
echo ===============================================
echo.

echo 📋 Ce script va demarrer :
echo   1. API NestJS (Backend)
echo   2. Dashboard Admin
echo   3. Boutique FADIDI
echo.

pause

echo.
echo 🔄 Verification des dossiers...
if not exist "api-nestjs" (
    echo ❌ Erreur: Dossier api-nestjs introuvable !
    echo    Assurez-vous d'avoir execute l'installation complete.
    pause
    exit /b 1
)

if not exist "admin-dashboard" (
    echo ❌ Erreur: Dossier admin-dashboard introuvable !
    pause
    exit /b 1
)

echo ✅ Dossiers trouves !
echo.

echo 🎯 Demarrage de l'API NestJS...
cd api-nestjs

echo 📦 Installation des dependances (si necessaire)...
call npm install --silent

echo 🚀 Demarrage du serveur API...
start "FADIDI API Server" cmd /k "npm run start:dev"

echo ⏳ Attente du demarrage de l'API...
timeout /t 5 /nobreak > nul

cd ..

echo 📊 Ouverture du Dashboard Admin...
start "" "admin-dashboard\index.html"

echo 🛍️ Ouverture de la Boutique FADIDI...
start "" "boutique.html"

echo.
echo ===============================================
echo ✅ SYSTEME FADIDI DEMARRE AVEC SUCCES !
echo ===============================================
echo.
echo 🌐 Services actifs :
echo   • API Backend    : http://localhost:3000
echo   • Dashboard Admin: Ouvert dans le navigateur
echo   • Boutique      : Ouvert dans le navigateur
echo.
echo 👤 Connexion Admin par defaut :
echo   Email    : admin@fadidi.com
echo   Password : admin123
echo.
echo 💡 Conseils :
echo   • Connectez-vous au dashboard pour ajouter des produits
echo   • Les produits apparaitront automatiquement dans la boutique
echo   • Surveillez l'indicateur de statut API (coin haut droit)
echo.
echo 🔧 Pour arreter les services :
echo   • Fermez la fenetre "FADIDI API Server"
echo   • Fermez les onglets du navigateur
echo.

pause