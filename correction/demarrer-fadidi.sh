#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo -e "${CYAN}===============================================${NC}"
echo -e "${CYAN}         🚀 FADIDI - DÉMARRAGE COMPLET 🚀${NC}"
echo -e "${CYAN}===============================================${NC}"
echo ""

echo -e "${BLUE}📋 Ce script va démarrer :${NC}"
echo -e "${BLUE}   1. API NestJS (Backend)${NC}"
echo -e "${BLUE}   2. Dashboard Admin${NC}"
echo -e "${BLUE}   3. Boutique FADIDI${NC}"
echo ""

read -p "Appuyez sur Entrée pour continuer..."

echo ""
echo -e "${YELLOW}🔄 Vérification des dossiers...${NC}"

if [ ! -d "api-nestjs" ]; then
    echo -e "${RED}❌ Erreur: Dossier api-nestjs introuvable !${NC}"
    echo -e "${RED}   Assurez-vous d'avoir exécuté l'installation complète.${NC}"
    exit 1
fi

if [ ! -d "admin-dashboard" ]; then
    echo -e "${RED}❌ Erreur: Dossier admin-dashboard introuvable !${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dossiers trouvés !${NC}"
echo ""

echo -e "${PURPLE}🎯 Démarrage de l'API NestJS...${NC}"
cd api-nestjs

echo -e "${YELLOW}📦 Installation des dépendances (si nécessaire)...${NC}"
npm install --silent

echo -e "${GREEN}🚀 Démarrage du serveur API...${NC}"

# Démarrer l'API en arrière-plan
npm run start:dev > ../api.log 2>&1 &
API_PID=$!

echo -e "${CYAN}⏳ Attente du démarrage de l'API...${NC}"
sleep 5

cd ..

echo -e "${PURPLE}📊 Ouverture du Dashboard Admin...${NC}"
if command -v xdg-open > /dev/null; then
    xdg-open admin-dashboard/index.html
elif command -v open > /dev/null; then
    open admin-dashboard/index.html
else
    echo -e "${YELLOW}⚠️  Veuillez ouvrir manuellement: admin-dashboard/index.html${NC}"
fi

echo -e "${PURPLE}🛍️ Ouverture de la Boutique FADIDI...${NC}"
if command -v xdg-open > /dev/null; then
    xdg-open boutique.html
elif command -v open > /dev/null; then
    open boutique.html
else
    echo -e "${YELLOW}⚠️  Veuillez ouvrir manuellement: boutique.html${NC}"
fi

echo ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}✅ SYSTÈME FADIDI DÉMARRÉ AVEC SUCCÈS !${NC}"
echo -e "${GREEN}===============================================${NC}"
echo ""
echo -e "${BLUE}🌐 Services actifs :${NC}"
echo -e "${BLUE}   • API Backend    : http://localhost:3000${NC}"
echo -e "${BLUE}   • Dashboard Admin: Ouvert dans le navigateur${NC}"
echo -e "${BLUE}   • Boutique      : Ouvert dans le navigateur${NC}"
echo ""
echo -e "${YELLOW}👤 Connexion Admin par défaut :${NC}"
echo -e "${YELLOW}   Email    : admin@fadidi.com${NC}"
echo -e "${YELLOW}   Password : admin123${NC}"
echo ""
echo -e "${CYAN}💡 Conseils :${NC}"
echo -e "${CYAN}   • Connectez-vous au dashboard pour ajouter des produits${NC}"
echo -e "${CYAN}   • Les produits apparaîtront automatiquement dans la boutique${NC}"
echo -e "${CYAN}   • Surveillez l'indicateur de statut API (coin haut droit)${NC}"
echo ""
echo -e "${PURPLE}🔧 Pour arrêter les services :${NC}"
echo -e "${PURPLE}   kill $API_PID${NC}"
echo ""

# Attendre Ctrl+C pour arrêter
trap "echo -e '\n${RED}🛑 Arrêt des services...${NC}'; kill $API_PID 2>/dev/null; exit 0" INT

echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter tous les services...${NC}"
wait