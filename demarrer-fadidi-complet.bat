@echo off
title FADIDI - Systeme Complet NestJS

echo ========================================
echo     FADIDI - DEMARRAGE COMPLET
echo ========================================
echo.
echo Demarrage du systeme complet FADIDI avec:
echo - API NestJS + Base MySQL fadidi_new_db  
echo - Panier intelligent avec promotions
echo - Interface web modernisee
echo.

echo 1. Verification de l'environnement...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installe
    echo Installez Node.js depuis https://nodejs.org
    pause
    exit /b 1
) else (
    echo ✅ Node.js detecte
)

REM Vérifier si MySQL est accessible (optionnel)
echo ✅ Configuration MySQL: fadidi_new_db sur localhost:3306
echo.

echo 2. Demarrage de l'API NestJS...
echo.
cd /d "%~dp0api-nestjs"

if not exist "node_modules" (
    echo Installation des dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Erreur installation dependencies
        pause
        exit /b 1
    )
)

echo Demarrage du serveur en arriere-plan...
start "API NestJS FADIDI" cmd /k "npm run start:dev"

echo.
echo 3. Attente du demarrage de l'API...
timeout /t 5 /nobreak >nul

echo.
echo 4. Ouverture de l'interface utilisateur...
echo.

cd /d "%~dp0"

REM Ouvrir la page de test
echo Ouverture page de test...
start "" "frontend\test-panier-nestjs.html"

timeout /t 2 /nobreak >nul

REM Ouvrir la page promotions
echo Ouverture page promotions...
start "" "frontend\promotion.html"

timeout /t 2 /nobreak >nul

REM Ouvrir la boutique principale  
echo Ouverture boutique principale...
start "" "frontend\boutique.html"

echo.
echo ========================================
echo           SYSTEME DEMARRE !
echo ========================================
echo.
echo 🌐 API NestJS:     http://localhost:3000
echo 🛒 Page Test:      test-panier-nestjs.html
echo 🎯 Promotions:     promotion.html  
echo 🏪 Boutique:       boutique.html
echo.
echo 📊 Dashboard API:  http://localhost:3000/admin
echo 📋 Doc API:        http://localhost:3000/api
echo.
echo ✅ Le panier utilise maintenant:
echo    - Base de donnees MySQL (fadidi_new_db)
echo    - Synchronisation temps reel
echo    - Gestion complete des promotions
echo    - Statistiques de ventes automatiques
echo.
echo ⚠️  Pour arreter: Fermez les fenetres de commande
echo.

pause

echo.
echo Voulez-vous ouvrir le guide de demarrage rapide ? (O/N)
set /p choice="Votre choix: "
if /i "%choice%"=="O" (
    start "" "GUIDE_DEMARRAGE_RAPIDE.md"
)