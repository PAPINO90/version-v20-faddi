@echo off
title FADIDI API Server
echo ==========================================
echo      FADIDI API SERVER - DEMARRAGE
echo ==========================================
echo.

cd /d "%~dp0api-nestjs"

echo Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou introuvable
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo Node.js detecte: 
node --version

echo.
echo Installation/Mise a jour des dependances...
npm install

echo.
echo Verification de la base de donnees...
echo IMPORTANT: Assurez-vous que MySQL est demarre et que la base 'fadidi_new_db' existe

echo.
echo Demarrage du serveur API FADIDI...
echo L'API sera disponible sur: http://localhost:3000
echo Documentation API: http://localhost:3000/api
echo.

npm run start:dev

echo.
echo Le serveur API s'est arrete.
pause