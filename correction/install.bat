@echo off
echo =================================
echo   INSTALLATION FADIDI DASHBOARD
echo =================================

echo.
echo 1. Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js detecte: 
node --version

echo.
echo 2. Verification de MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: MySQL n'est pas installe ou pas dans le PATH
    echo Veuillez installer MySQL depuis https://dev.mysql.com/downloads/
    pause
    exit /b 1
)
echo MySQL detecte:
mysql --version

echo.
echo 3. Installation des dependances de l'API...
cd api-nestjs
if not exist package.json (
    echo ERREUR: Fichier package.json non trouve
    pause
    exit /b 1
)

echo Installation en cours...
npm install
if errorlevel 1 (
    echo ERREUR lors de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo 4. Creation de la base de donnees...
cd ..
mysql -u root -p < database\setup.sql
if errorlevel 1 (
    echo ATTENTION: Erreur lors de la creation de la base de donnees
    echo Vous pouvez continuer et creer la base manuellement
)

echo.
echo 5. Creation du dossier uploads...
cd api-nestjs
if not exist uploads mkdir uploads

echo.
echo =================================
echo   INSTALLATION TERMINEE !
echo =================================
echo.
echo Pour demarrer le systeme:
echo 1. Executez: start-api.bat
echo 2. Ouvrez admin-dashboard/index.html dans votre navigateur
echo.
echo Identifiants admin par defaut:
echo Email: admin@fadidi.com
echo Mot de passe: Admin123!
echo.
pause