@echo off
echo ==============================================
echo    MIGRATION: Ajout Position Image Bannières
echo ==============================================
echo.

echo Exécution de la migration pour ajouter la colonne imagePosition...
echo.

mysql -u root -p fadidi < migration_add_image_position.sql

if %errorlevel% == 0 (
    echo.
    echo ✅ Migration terminée avec succès !
    echo ✅ La colonne imagePosition a été ajoutée à la table header_banners
    echo.
    echo 📋 Nouvelles fonctionnalités disponibles :
    echo    • Position Gauche : Images alignées à gauche
    echo    • Position Centre : Images centrées (par défaut)
    echo    • Position Droite : Images alignées à droite
    echo.
) else (
    echo.
    echo ❌ Erreur lors de l'exécution de la migration
    echo ❌ Vérifiez les logs ci-dessus pour plus de détails
)

echo.
pause