@echo off
echo =================================
echo   DEMARRAGE DASHBOARD ADMIN
echo =================================

cd admin-dashboard

echo Demarrage du serveur local pour le dashboard...
echo URL: http://localhost:3001
echo.
echo Pour arreter le serveur, appuyez sur Ctrl+C
echo.

where python >nul 2>&1
if not errorlevel 1 (
    echo Utilisation de Python...
    python -m http.server 3001
) else (
    where node >nul 2>&1
    if not errorlevel 1 (
        echo Installation de 'serve' si necessaire...
        npm install -g serve >nul 2>&1
        echo Utilisation de Node.js serve...
        npx serve -p 3001
    ) else (
        echo ERREUR: Ni Python ni Node.js ne sont disponibles
        echo Veuillez ouvrir admin-dashboard/index.html manuellement dans votre navigateur
        pause
        exit /b 1
    )
)

pause