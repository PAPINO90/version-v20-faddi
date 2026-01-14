@echo off
echo ==========================================
echo MIGRATION STATISTIQUES BANNIERES HEADER
echo ==========================================
echo.
echo Cette migration ajoute les colonnes viewCount et clickCount
echo à la table header_banners pour le suivi des statistiques.
echo.
pause

echo Execution de la migration...
mysql -u root -p fadidi < migration_header_banners_stats.sql

if %ERRORLEVEL% == 0 (
    echo.
    echo ==========================================
    echo ✅ MIGRATION REUSSIE
    echo ==========================================
    echo Les colonnes de statistiques ont été ajoutées avec succès!
    echo Vous pouvez maintenant voir les vues et clics dans le dashboard admin.
    echo.
) else (
    echo.
    echo ==========================================
    echo ❌ ERREUR LORS DE LA MIGRATION
    echo ==========================================
    echo Vérifiez que:
    echo - MySQL est démarré
    echo - La base de données 'fadidi' existe
    echo - Vos identifiants MySQL sont corrects
    echo.
)

pause