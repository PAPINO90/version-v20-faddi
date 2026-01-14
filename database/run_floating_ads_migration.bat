@echo off
echo ====================================
echo Migration des publicites flottantes
echo ====================================
echo.

REM Configuration de la base de donnees
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=fadidi_new_db

echo Execution de la migration pour les publicites flottantes...
echo.

REM Executer la migration SQL
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < migration_floating_ads.sql

if %errorlevel% equ 0 (
    echo.
    echo ✓ Migration executee avec succes!
    echo ✓ Table 'floating_ads' creee dans la base de donnees '%DB_NAME%'
    echo ✓ Donnees d'exemple inserees
    echo.
    echo Les publicites flottantes sont maintenant disponibles dans:
    echo - Dashboard admin: Section "Publicites flottantes"
    echo - API: http://localhost:3000/api/floating-ads
    echo.
) else (
    echo.
    echo ✗ Erreur lors de l'execution de la migration
    echo Verifiez vos parametres de connexion a la base de donnees
    echo.
)

echo Appuyez sur une touche pour continuer...
pause > nul