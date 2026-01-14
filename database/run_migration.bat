@echo off
echo Execution de la migration pour les retours clients...
echo.

REM Chemin vers MySQL (adapter selon votre installation)
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

REM Si MySQL n'est pas dans ce chemin, essayer d'autres emplacements
if not exist %MYSQL_PATH% (
    set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe"
)

if not exist %MYSQL_PATH% (
    set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
)

if not exist %MYSQL_PATH% (
    set MYSQL_PATH="mysql"
)

echo Execution de la migration...
%MYSQL_PATH% -u root -p fadidi_new_db < "migration_feedback.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Migration executee avec succes !
    echo Les colonnes pour les retours clients ont ete ajoutees.
) else (
    echo.
    echo ❌ Erreur lors de la migration.
    echo Veuillez verifier la connexion MySQL et les permissions.
)

pause