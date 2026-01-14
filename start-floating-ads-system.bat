@echo off
title FADIDI - Demarrage systeme de publicites flottantes
color 0E

echo =====================================================
echo           FADIDI - PUBLICITES FLOTTANTES
echo =====================================================
echo.

REM Verification que nous sommes dans le bon repertoire
if not exist "api-nestjs" (
    echo ❌ Erreur: Repertoire api-nestjs non trouve
    echo Assurez-vous d'executer ce script depuis le repertoire racine FADIDI
    pause
    exit /b 1
)

if not exist "database" (
    echo ❌ Erreur: Repertoire database non trouve
    echo Assurez-vous d'executer ce script depuis le repertoire racine FADIDI
    pause
    exit /b 1
)

echo 📋 Etape 1/4: Verification des dependances...
echo.

REM Verification de Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installe ou non accessible
    echo Installez Node.js depuis https://nodejs.org
    pause
    exit /b 1
) else (
    echo ✅ Node.js detecte
)

REM Verification de MySQL
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL n'est pas installe ou non accessible
    echo Installez MySQL et ajoutez-le au PATH
    pause
    exit /b 1
) else (
    echo ✅ MySQL detecte
)

echo.
echo 📋 Etape 2/4: Migration de la base de donnees...
echo.

REM Executer la migration des publicites flottantes
cd database
call run_floating_ads_migration.bat
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la migration de la base de donnees
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo 📋 Etape 3/4: Installation des dependances API...
echo.

REM Installation des dependances NestJS
cd api-nestjs
if not exist "node_modules" (
    echo Installation des modules npm...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dependances
        cd ..
        pause
        exit /b 1
    )
) else (
    echo ✅ Modules npm deja installes
)

echo.
echo 📋 Etape 4/4: Demarrage de l'API NestJS...
echo.

echo ✅ Configuration terminee!
echo.
echo 🌐 Services disponibles:
echo    - API: http://localhost:3000/api
echo    - Dashboard admin: frontend/admin-dashboard/index.html
echo    - Boutique: frontend/boutique.html
echo.
echo 📚 Documentation: DOCUMENTATION_PUBLICITES_FLOTTANTES.md
echo 🎯 Exemples: frontend/assets/js/exemples-publicites-flottantes.js
echo.
echo ⚡ L'API va demarrer automatiquement...
echo    Appuyez sur Ctrl+C pour arreter l'API
echo.

REM Demarrer l'API NestJS en mode développement
npm run start:dev

REM Si on arrive ici, l'API s'est arretee
cd ..
echo.
echo ℹ️  L'API s'est arretee.
echo.
pause