# Système d'Accès Restreint aux Paramètres Administrateur

## Vue d'ensemble

Ce système sécurise l'accès à la section "Paramètres" du dashboard administrateur en utilisant des codes d'accès temporaires stockés dans la base de données MySQL `fadidi_new_db`.

## Fonctionnalités

### 1. Codes d'Accès Temporaires
- **Codes générés automatiquement** : 8 caractères alphanumériques majuscules
- **Expiration configurable** : Durée de vie personnalisable
- **Usage unique** : Chaque code ne peut être utilisé qu'une seule fois
- **Stockage sécurisé** : Codes stockés dans la base de données MySQL

### 2. Code Maître Permanent
- **Code permanent** : `FADIDI2025`
- **Usage illimité** : Peut être utilisé plusieurs fois
- **Toujours valide** : Ne expire jamais

### 3. Session d'Accès
- **Durée de session** : 1 heure après authentification réussie
- **Accès automatique** : Pas besoin de re-saisir le code pendant la session
- **Expiration automatique** : Session expire après 1 heure

## Installation et Configuration

### 1. Démarrer l'API NestJS

```bash
# Option 1: Utiliser le script batch (Windows)
start-api-with-instructions.bat

# Option 2: Démarrage manuel
cd api-nestjs
npm install
npm run start:dev
```

L'API sera accessible sur `http://localhost:3000`

### 2. Vérifier la Base de Données

Assurez-vous que la table `auth_codes` existe dans `fadidi_new_db` :

```sql
CREATE TABLE auth_codes (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    label VARCHAR(255),
    expiresAt DATETIME NOT NULL,
    isUsed BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Utilisation

### 1. Génération de Codes d'Accès

```bash
# Code valide 24 heures (défaut)
node generate-access-code.js

# Code avec description personnalisée
node generate-access-code.js "Code pour maintenance" 12

# Code valide 1 heure
node generate-access-code.js "Code urgence" 1
```

**Exemple de sortie :**
```
=== CODE D'ACCÈS GÉNÉRÉ ===
Code: ABC123XY
Label: Code pour maintenance
Expire le: 02/10/2025 à 14:30:15
Valide pendant: 12h
============================
```

### 2. Accès aux Paramètres

1. **Ouvrir le Dashboard** : Accédez au dashboard administrateur
2. **Cliquer sur Paramètres** : Une modale d'authentification s'ouvre
3. **Saisir le Code** : Entrez un code valide ou le code maître
4. **Confirmation** : Accès accordé pour 1 heure

### 3. Codes Disponibles

#### Code Maître (Permanent)
- **Code** : `FADIDI2025`
- **Avantages** : Toujours valide, usage illimité
- **Usage** : Pour accès d'urgence ou tests

#### Codes Temporaires
- **Génération** : Via script `generate-access-code.js`
- **Avantages** : Sécurité renforcée, traçabilité
- **Usage** : Pour accès planifiés ou temporaires

## API Endpoints

### POST /api/auth-codes
Génère un nouveau code d'accès.

**Body :**
```json
{
  "label": "Description du code",
  "expiresAt": "2025-10-02T14:30:00.000Z"
}
```

**Réponse :**
```json
{
  "code": "ABC123XY",
  "label": "Description du code",
  "expiresAt": "2025-10-02T14:30:00.000Z"
}
```

### POST /api/auth-codes/validate
Valide un code d'accès.

**Body :**
```json
{
  "code": "ABC123XY"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Code valide"
}
```

## Sécurité

### Fonctionnalités de Sécurité

1. **Codes Usage Unique** : Codes temporaires marqués comme utilisés après validation
2. **Expiration Automatique** : Codes expirés automatiquement rejetés
3. **Session Limitée** : Accès limité à 1 heure après authentification
4. **Validation Côté Serveur** : Vérification en base de données
5. **Messages d'Erreur Appropriés** : Distinction entre codes invalides, expirés, ou utilisés

### Gestion des Erreurs

- **Code inexistant** : "Code d'autorisation invalide"
- **Code déjà utilisé** : "Code déjà utilisé" 
- **Code expiré** : "Code expiré"
- **Erreur réseau** : "Erreur de connexion. Vérifiez que l'API est démarrée"

## Interface Utilisateur

### Modale d'Authentification
- **Design sombre** : S'intègre au thème du dashboard
- **Champ sécurisé** : Type password pour masquer la saisie
- **Messages dynamiques** : Erreurs et états de chargement
- **Navigation clavier** : Support Entrée et Échap
- **Responsive** : Adaptation mobile et desktop

### Expérience Utilisateur
- **Focus automatique** : Cursor dans le champ à l'ouverture
- **Messages temporaires** : Notifications de succès
- **Loading states** : Indicateurs visuels pendant validation
- **Fermeture automatique** : Modale se ferme après succès

## Maintenance

### Nettoyage des Codes Expirés

```sql
-- Supprimer les codes expirés
DELETE FROM auth_codes 
WHERE expiresAt < NOW();

-- Supprimer les codes utilisés de plus de 30 jours
DELETE FROM auth_codes 
WHERE isUsed = true 
AND createdAt < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Monitoring

```sql
-- Voir tous les codes actifs
SELECT code, label, expiresAt, isUsed, createdAt 
FROM auth_codes 
WHERE expiresAt > NOW() 
ORDER BY createdAt DESC;

-- Statistiques d'usage
SELECT 
    COUNT(*) as total_codes,
    SUM(isUsed) as codes_used,
    COUNT(*) - SUM(isUsed) as codes_unused
FROM auth_codes;
```

## Dépannage

### L'API ne démarre pas
1. Vérifier que MySQL est démarré
2. Vérifier que la base `fadidi_new_db` existe
3. Vérifier les variables d'environnement de connexion
4. Consulter les logs dans le terminal

### La validation échoue
1. Vérifier que l'API est accessible sur `http://localhost:3000`
2. Tester l'endpoint avec Postman/curl
3. Vérifier les logs de l'API
4. S'assurer que le code n'est pas expiré

### Problème de CORS
Si vous accédez au dashboard depuis un autre domaine, ajoutez la configuration CORS dans l'API NestJS.

## Fichiers Modifiés

- `frontend/admin-dashboard/index.html` : Modale d'authentification
- `frontend/assets/css/admin-dashboard.css` : Styles de la modale
- `frontend/assets/js/admin-dashboard.js` : Logique d'authentification
- `api-nestjs/src/auth/auth-codes.controller.ts` : Endpoint de validation
- `api-nestjs/src/auth/auth-codes.service.ts` : Code maître
- `generate-access-code.js` : Script de génération
- `start-api-with-instructions.bat` : Script de démarrage

Ce système offre une sécurité robuste tout en maintenant une excellente expérience utilisateur pour l'accès aux paramètres administrateur.