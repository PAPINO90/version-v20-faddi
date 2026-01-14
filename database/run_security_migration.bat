@echo off
echo ========================================
echo   MIGRATION SECURITY SETTINGS
echo ========================================
echo.

echo Creation de la table security_settings...
echo.

mysql -u root -p fadidi_new_db < "%~dp0migration_security_settings.sql"

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors de l'execution de la migration
    echo Verifiez que MySQL est demarre et que vous avez les bonnes permissions
    pause
    exit /b 1
)

echo.
echo ✅ Migration executee avec succes !
echo La table security_settings a ete creee dans fadidi_new_db
echo.
pause