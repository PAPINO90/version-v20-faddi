@echo off
echo ====================================
echo    DEMARRAGE API FADIDI (NestJS)
echo ====================================
echo.

cd /d "%~dp0api-nestjs"

echo Verification de l'installation des dependances...
if not exist "node_modules" (
    echo Installation des dependances...
    npm install
    if errorlevel 1 (
        echo Erreur lors de l'installation des dependances
        pause
        exit /b 1
    )
)

echo.
echo Demarrage de l'API NestJS...
echo L'API sera accessible sur: http://localhost:3000
echo.
echo Pour generer un code d'acces, utilisez dans un autre terminal:
echo node generate-access-code.js "Description du code" 24
echo.

npm run start:dev

if errorlevel 1 (
    echo.
    echo Erreur lors du demarrage de l'API
    echo Verifiez que MySQL est demarre et que la base fadidi_new_db existe
    pause
)