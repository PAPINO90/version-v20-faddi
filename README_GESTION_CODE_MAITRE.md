# Gestion du Code d'Accès Maître - Documentation

## Vue d'ensemble

Cette fonctionnalité permet aux administrateurs de changer le code d'accès maître directement depuis l'interface des paramètres du dashboard, avec validation sécurisée via l'API NestJS et stockage en base de données MySQL.

## Fonctionnalités

### 1. **Interface de Gestion de Sécurité**
- **Affichage du statut** : Code par défaut vs code personnalisé
- **Date de dernière modification** : Traçabilité des changements
- **Bouton de modification** : Accès sécurisé au changement de code

### 2. **Validation Sécurisée**
- **Vérification du code actuel** : Obligation de connaître le code existant
- **Validation des nouveaux codes** : Minimum 6 caractères, confirmation obligatoire
- **Prévention des doublons** : Le nouveau code doit être différent de l'ancien
- **Validation temps réel** : Indicateur visuel de correspondance des mots de passe

### 3. **API Endpoints Sécurisés**
- **POST /security-settings/validate-current-code** : Validation du code actuel
- **POST /security-settings/update-master-code** : Mise à jour sécurisée
- **GET /security-settings/stats** : Statistiques de sécurité

## Installation et Configuration

### 1. **Migration de la Base de Données**

```bash
# Windows - Exécuter la migration
cd database
run_security_migration.bat

# Ou manuellement
mysql -u root -p fadidi_new_db < migration_security_settings.sql
```

### 2. **Redémarrer l'API NestJS**

```bash
cd api-nestjs
npm run start:dev
```

### 3. **Vérification**
- Accédez au dashboard administrateur
- Cliquez sur "Paramètres" (authentification requise)
- La section "Sécurité et Code d'Accès" doit être visible

## Utilisation

### 1. **Accès à la Section Sécurité**
1. **Se connecter** au dashboard administrateur
2. **Cliquer sur "Paramètres"** → Saisir le code d'accès actuel
3. **Voir la section "Sécurité"** en haut des paramètres

### 2. **Changer le Code Maître**
1. **Cliquer sur "Changer le code d'accès maître"**
2. **Saisir le code actuel** (validation en temps réel)
3. **Entrer le nouveau code** (minimum 6 caractères)
4. **Confirmer le nouveau code** (doit correspondre exactement)
5. **Cliquer sur "Sauvegarder"**

### 3. **Validation et Sécurité**
- ✅ **Code actuel vérifié** avant toute modification
- ✅ **Nouveau code validé** (longueur, correspondance)
- ✅ **Prévention des erreurs** (messages d'erreur contextuels)
- ✅ **Confirmation visuelle** (messages de succès)

## Interface Utilisateur

### **Section Sécurité (Paramètres)**
```
┌─────────────────────────────────────────────────┐
│ 🛡️ Sécurité et Code d'Accès                    │
├─────────────────────────────────────────────────┤
│ Code d'accès maître actuel: [Code personnalisé] │
│ Dernière modification: 01/10/2025 à 15:30:22   │
│                                                 │
│                    [🔑 Changer le code d'accès] │
└─────────────────────────────────────────────────┘
```

### **Modale de Changement**
```
┌─────────────────────────────────────────────────┐
│ 🔑 Changer le Code d'Accès Maître          [×] │
├─────────────────────────────────────────────────┤
│ Code d'accès actuel                             │
│ [••••••••••••••••••••••••••••••••••••••••••••] │
│                                                 │
│ Nouveau code d'accès                            │
│ [••••••••••••••••••••••••••••••••••••••••••••] │
│ Le code doit contenir au moins 6 caractères     │
│                                                 │
│ Confirmer le nouveau code                       │
│ [••••••••••••••••••••••••••••••••••••••••••••] │
│                                                 │
│                        [Annuler] [💾 Sauvegarder] │
└─────────────────────────────────────────────────┘
```

## Sécurité et Validation

### **Validations Côté Client**
- ✅ Tous les champs obligatoires
- ✅ Nouveau code minimum 6 caractères
- ✅ Confirmation des mots de passe identiques
- ✅ Nouveau code différent de l'ancien

### **Validations Côté Serveur**
- ✅ Vérification du code actuel en base de données
- ✅ Validation de la longueur du nouveau code
- ✅ Vérification de la correspondance des confirmations
- ✅ Prévention des doublons (ancien = nouveau)

### **Sécurité de l'API**
- 🔒 Validation en base de données MySQL
- 🔒 Messages d'erreur contextuels sans révéler d'informations sensibles
- 🔒 Traçabilité des modifications (dates de création/modification)
- 🔒 Stockage sécurisé dans la table `security_settings`

## Base de Données

### **Table `security_settings`**
```sql
CREATE TABLE security_settings (
    id VARCHAR(36) PRIMARY KEY,           -- UUID unique
    settingKey VARCHAR(255) UNIQUE,       -- 'MASTER_ACCESS_CODE'
    settingValue TEXT,                    -- Le code d'accès
    description TEXT,                     -- Description de la modification
    createdAt TIMESTAMP,                  -- Date de création
    updatedAt TIMESTAMP                   -- Date de modification
);
```

### **Exemple d'enregistrement**
```sql
INSERT INTO security_settings VALUES (
    'uuid-example',
    'MASTER_ACCESS_CODE',
    'MonNouveauCode2025',
    'Code maître mis à jour le 01/10/2025 à 15:30:22',
    '2025-10-01 15:30:22',
    '2025-10-01 15:30:22'
);
```

## API Endpoints

### **1. Valider le Code Actuel**
```http
POST /api/security-settings/validate-current-code
Content-Type: application/json

{
  "code": "FADIDI2025"
}
```

**Réponse :**
```json
{
  "success": true,
  "valid": true
}
```

### **2. Mettre à Jour le Code Maître**
```http
POST /api/security-settings/update-master-code
Content-Type: application/json

{
  "currentCode": "FADIDI2025",
  "newCode": "MonNouveauCode2025",
  "confirmCode": "MonNouveauCode2025"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Code d'accès maître mis à jour avec succès"
}
```

### **3. Statistiques de Sécurité**
```http
GET /api/security-settings/stats
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "masterCodeLastUpdated": "2025-10-01T15:30:22.000Z",
    "totalSettings": 1,
    "hasCustomMasterCode": true
  }
}
```

## Gestion des Erreurs

### **Erreurs Communes**
- ❌ **"Code d'accès actuel incorrect"** → Le code saisi ne correspond pas au code en base
- ❌ **"Le nouveau code doit contenir au moins 6 caractères"** → Longueur insuffisante
- ❌ **"Les nouveaux codes ne correspondent pas"** → Confirmation incorrecte
- ❌ **"Le nouveau code doit être différent de l'ancien"** → Tentative de réutilisation
- ❌ **"Erreur de connexion"** → API non disponible

### **Messages de Succès**
- ✅ **"Code d'accès maître mis à jour avec succès !"** → Modification réussie
- ✅ **Status mis à jour** : "Code par défaut" → "Code personnalisé"
- ✅ **Date de modification mise à jour** dans l'interface

## Maintenance et Monitoring

### **Vérification en Base de Données**
```sql
-- Voir le code actuel
SELECT settingValue as 'Code Actuel', 
       updatedAt as 'Dernière Modification'
FROM security_settings 
WHERE settingKey = 'MASTER_ACCESS_CODE';

-- Historique des modifications (si vous ajoutez un système de logs)
SELECT * FROM security_settings 
WHERE settingKey = 'MASTER_ACCESS_CODE'
ORDER BY updatedAt DESC;
```

### **Reset du Code en Cas d'Urgence**
```sql
-- Remettre le code par défaut
UPDATE security_settings 
SET settingValue = 'FADIDI2025',
    description = 'Reset d\'urgence'
WHERE settingKey = 'MASTER_ACCESS_CODE';
```

## Fichiers Modifiés/Créés

### **Backend (API NestJS)**
- `src/auth/entities/security-settings.entity.ts` - Entité TypeORM
- `src/auth/security-settings.service.ts` - Service de gestion
- `src/auth/security-settings.controller.ts` - Contrôleur API
- `src/auth/auth-codes.service.ts` - Mise à jour pour code dynamique
- `src/auth/auth.module.ts` - Ajout des nouveaux services

### **Frontend**
- `frontend/admin-dashboard/index.html` - Section sécurité + modale
- `frontend/assets/css/admin-dashboard.css` - Styles de la section
- `frontend/assets/js/admin-dashboard.js` - Logique de gestion

### **Base de Données**
- `database/migration_security_settings.sql` - Script de migration
- `database/run_security_migration.bat` - Script d'exécution

Cette fonctionnalité offre une gestion sécurisée et intuitive du code d'accès maître, avec une interface utilisateur moderne et des validations robustes côté client et serveur.