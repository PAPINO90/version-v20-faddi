@echo off
title FADIDI - Démarrage du système de promotions

echo ========================================
echo    FADIDI - Système de Promotions
echo ========================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installé ou pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Node.js detecté
echo [INFO] Démarrage de l'API FADIDI...
echo.

REM Se déplacer dans le dossier de l'API
cd /d "%~dp0api-nestjs"

REM Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo [INFO] Installation des dépendances npm...
    npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] Échec de l'installation des dépendances
        pause
        exit /b 1
    )
)

echo [INFO] Lancement de l'API en mode développement...
echo [INFO] L'API sera disponible sur http://localhost:3000
echo.
echo [DASHBOARD ADMIN] Ouvrir frontend/admin-dashboard/index.html
echo [PAGE PROMOTIONS] Ouvrir frontend/promotion.html
echo.
echo Appuyez sur Ctrl+C pour arrêter l'API
echo ========================================
echo.

REM Démarrer l'API
npm run start:dev

pause