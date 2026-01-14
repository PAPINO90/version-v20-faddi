@echo off
echo ========================================
echo    DEMARRAGE API NESTJS FADIDI
echo ========================================
echo.

cd /d "%~dp0api-nestjs"

echo Verification de l'installation des dependencies...
if not exist "node_modules" (
    echo Installation des dependencies npm...
    npm install
    if errorlevel 1 (
        echo ERREUR: Impossible d'installer les dependencies
        pause
        exit /b 1
    )
)

echo.
echo Demarrage du serveur NestJS...
echo API disponible sur: http://localhost:3000
echo Dashboard admin: http://localhost:3000/admin
echo API Swagger: http://localhost:3000/api
echo.

npm run start:dev

pause