// Gestion des publicités flottantes dans le dashboard admin
if (typeof API_BASE_URL === 'undefined') {
    const API_BASE_URL = 'http://localhost:3000/api';
}

// Variables globales
let floatingAds = [];
let currentFloatingAdId = null;

// Fonctions globales pour éviter les erreurs de référence
window.refreshFloatingAdsStats = function() {
    loadFloatingAds();
};

window.openFloatingAdModal = function() {
    openFloatingAdModalInternal();
};

window.closeFloatingAdModal = function() {
    closeFloatingAdModalInternal();
};

window.saveFloatingAd = function() {
    saveFloatingAdInternal();
};

window.editFloatingAd = function(id) {
    editFloatingAdInternal(id);
};

window.toggleFloatingAdStatus = function(id) {
    toggleFloatingAdStatusInternal(id);
};

window.deleteFloatingAd = function(id) {
    deleteFloatingAdInternal(id);
};

window.removeFloatingAdImage = function() {
    removeFloatingAdImageInternal();
};

window.updateDisplayModeFields = function() {
    updateDisplayModeFieldsInternal();
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Charger les publicités flottantes si on est sur cette section
    if (document.getElementById('floating-ads-section')) {
        loadFloatingAds();
    }
});

// Fonction pour charger les publicités flottantes
async function loadFloatingAds() {
    const loading = document.getElementById('floating-ads-loading');
    const table = document.getElementById('floating-ads-table');
    
    try {
        loading.style.display = 'block';
        table.classList.add('table-hidden');
        
        const response = await fetch(`${API_BASE_URL}/floating-ads`);
        if (!response.ok) throw new Error('Erreur de chargement');
        
        floatingAds = await response.json();
        displayFloatingAds();
        updateFloatingAdsStats();
        
        loading.style.display = 'none';
        table.classList.remove('table-hidden');
    } catch (error) {
        console.error('Erreur lors du chargement des publicités:', error);
        loading.style.display = 'none';
        
        // Fallback avec localStorage si l'API ne répond pas
        floatingAds = JSON.parse(localStorage.getItem('floatingAds') || '[]');
        displayFloatingAds();
        updateFloatingAdsStats();
        table.classList.remove('table-hidden');
    }
}

// Fonction pour afficher les publicités dans le tableau
function displayFloatingAds() {
    const tbody = document.getElementById('floating-ads-tbody');
    
    if (!floatingAds || floatingAds.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Aucune publicité trouvée</td></tr>';
        return;
    }
    
    tbody.innerHTML = floatingAds.map(ad => {
        const isActive = ad.isActive && (!ad.endDate || new Date(ad.endDate) > new Date());
        const statusClass = isActive ? 'status-active' : 'status-inactive';
        const statusText = isActive ? 'Actif' : 'Inactif';
        
        const startDate = ad.startDate ? new Date(ad.startDate).toLocaleDateString() : '-';
        const endDate = ad.endDate ? new Date(ad.endDate).toLocaleDateString() : '-';
        
        return `
            <tr>
                <td>
                    <div style="font-weight: bold;">${ad.title}</div>
                    <small style="color: #666;">${ad.content.substring(0, 50)}${ad.content.length > 50 ? '...' : ''}</small>
                </td>
                <td>
                    <span class="badge badge-${ad.displayMode}">
                        ${ad.displayMode === 'toast' ? 'Toast' : ad.displayMode === 'popup' ? 'Popup' : 'Bannière'}
                    </span>
                </td>
                <td>${getPositionLabel(ad.position)}</td>
                <td>
                    <small>${ad.targetPages === '*' ? 'Toutes les pages' : ad.targetPages}</small>
                </td>
                <td>
                    <div>${startDate}</div>
                    <div>${endDate}</div>
                </td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>
                    <div style="font-size: 12px;">
                        <div><i class="fas fa-eye"></i> ${ad.viewCount || 0} vues</div>
                        <div><i class="fas fa-mouse-pointer"></i> ${ad.clickCount || 0} clics</div>
                    </div>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editFloatingAd(${ad.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-${isActive ? 'warning' : 'success'} btn-sm" onclick="toggleFloatingAdStatus(${ad.id})" title="${isActive ? 'Désactiver' : 'Activer'}">
                        <i class="fas fa-${isActive ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFloatingAd(${ad.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Fonction pour obtenir le libellé de la position
function getPositionLabel(position) {
    const positions = {
        'top-left': 'Haut à gauche',
        'top-right': 'Haut à droite', 
        'top-center': 'Haut au centre',
        'bottom-left': 'Bas à gauche',
        'bottom-right': 'Bas à droite',
        'bottom-center': 'Bas au centre',
        'center': 'Centre'
    };
    return positions[position] || position;
}

// Fonction pour mettre à jour les statistiques
async function updateFloatingAdsStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/floating-ads/statistics`);
        if (response.ok) {
            const stats = await response.json();
            
            document.getElementById('stat-floating-ads-total').textContent = stats.total || 0;
            document.getElementById('stat-floating-ads-active').textContent = stats.active || 0;
            document.getElementById('stat-floating-ads-views').textContent = stats.totalViews || 0;
            document.getElementById('stat-floating-ads-clicks').textContent = stats.totalClicks || 0;
        }
    } catch (error) {
        // Calcul local des statistiques si l'API ne répond pas
        const total = floatingAds.length;
        const active = floatingAds.filter(ad => ad.isActive).length;
        const totalViews = floatingAds.reduce((sum, ad) => sum + (ad.viewCount || 0), 0);
        const totalClicks = floatingAds.reduce((sum, ad) => sum + (ad.clickCount || 0), 0);
        
        document.getElementById('stat-floating-ads-total').textContent = total;
        document.getElementById('stat-floating-ads-active').textContent = active;
        document.getElementById('stat-floating-ads-views').textContent = totalViews;
        document.getElementById('stat-floating-ads-clicks').textContent = totalClicks;
    }
}

// Fonction pour ouvrir le modal de création
function openFloatingAdModalInternal() {
    currentFloatingAdId = null;
    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    };
    const setChecked = (id, checked) => {
        const el = document.getElementById(id);
        if (el) el.checked = checked;
    };
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    setText('floating-ad-modal-title', 'Ajouter une publicité flottante');
    const form = document.getElementById('floating-ad-form');
    if (form) form.reset();
    setValue('floating-ad-id', '');
    setValue('floating-ad-width', '300px');
    setValue('floating-ad-height', '200px');
    setValue('floating-ad-duration', '5000');
    setValue('floating-ad-bg-color', '#ffffff');
    setValue('floating-ad-text-color', '#000000');
    setValue('floating-ad-target-pages', ''); // Par défaut, aucune page ciblée
    setChecked('floating-ad-active', true);
    const imagePreview = document.getElementById('floating-ad-image-preview');
    if (imagePreview) imagePreview.innerHTML = '';
    const modal = document.getElementById('floating-ad-modal');
    if (modal) modal.classList.remove('hidden');
}

// Fonction pour fermer le modal
function closeFloatingAdModalInternal() {
    document.getElementById('floating-ad-modal').classList.add('hidden');
    currentFloatingAdId = null;
}

// Fonction pour éditer une publicité
async function editFloatingAdInternal(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/floating-ads/${id}`);
        if (!response.ok) throw new Error('Publicité non trouvée');
        
        const ad = await response.json();
        currentFloatingAdId = id;
        
        // Remplir le formulaire
        document.getElementById('floating-ad-modal-title').textContent = 'Modifier la publicité';
        document.getElementById('floating-ad-id').value = ad.id;
        document.getElementById('floating-ad-title').value = ad.title;
        document.getElementById('floating-ad-content').value = ad.content;
    document.getElementById('floating-ad-display-mode').value = ad.displayMode;
    // Décoder la position pour remplir le champ position et le champ fixe/flottant
    let pos = ad.position || '';
    if (pos.endsWith('-fixed')) {
        document.getElementById('floating-ad-position').value = pos.replace('-fixed', '');
        if (document.getElementById('floating-ad-fixed')) document.getElementById('floating-ad-fixed').value = 'fixed';
    } else {
        document.getElementById('floating-ad-position').value = pos;
        if (document.getElementById('floating-ad-fixed')) document.getElementById('floating-ad-fixed').value = 'floating';
    }
    document.getElementById('floating-ad-width').value = ad.width;
    document.getElementById('floating-ad-height').value = ad.height;
    document.getElementById('floating-ad-duration').value = ad.displayDuration;
    document.getElementById('floating-ad-bg-color').value = ad.backgroundColor;
    document.getElementById('floating-ad-text-color').value = ad.textColor;
    document.getElementById('floating-ad-active').checked = ad.isActive;
        
        // Utiliser les nouvelles fonctions pour définir les pages cibles et la redirection
        const targetPagesArray = ad.targetPages ? ad.targetPages.split(',').map(p => p.trim()) : ['*'];
        window.setTargetPages(targetPagesArray);
        window.setRedirectUrl(ad.redirectUrl || '');
        
        // Dates
        if (ad.startDate) {
            const startDate = new Date(ad.startDate);
            document.getElementById('floating-ad-start-date').value = startDate.toISOString().slice(0, 16);
        }
        if (ad.endDate) {
            const endDate = new Date(ad.endDate);
            document.getElementById('floating-ad-end-date').value = endDate.toISOString().slice(0, 16);
        }
        
        // Aperçu de l'image
        if (ad.imageUrl) {
            document.getElementById('floating-ad-image-preview').innerHTML = 
                `<div class="image-item"><img src="${ad.imageUrl}" alt="Aperçu"><button type="button" onclick="removeFloatingAdImage()">×</button></div>`;
        }
        
        document.getElementById('floating-ad-modal').classList.remove('hidden');
    } catch (error) {
        console.error('Erreur lors du chargement de la publicité:', error);
        alert('Erreur lors du chargement de la publicité');
    }
}

// Fonction pour sauvegarder une publicité
async function saveFloatingAdInternal() {
    const form = document.getElementById('floating-ad-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Utiliser les nouvelles fonctions pour récupérer les pages cibles et la redirection
    let selectedPages = window.getSelectedTargetPages();
    // Si aucune page n'est sélectionnée, on empêche la sauvegarde et affiche une alerte
    if (!Array.isArray(selectedPages) || selectedPages.length === 0 || selectedPages.includes('*')) {
        alert('Veuillez sélectionner au moins une page cible pour la publicité flottante.');
        return;
    }
    // Convertir en string pour l'API (ex: "page1,page2")
    const targetPagesString = selectedPages.join(',');
    const redirectUrl = window.getRedirectUrl();

    const formData = new FormData();
    // Gérer la couleur de fond : si "transparent" est choisi dans le select, on force la valeur "transparent"
    let bgColor = document.getElementById('floating-ad-bg-color').value;
    const bgColorSelect = document.getElementById('floating-ad-bg-color-select');
    if (bgColorSelect && bgColorSelect.value === 'transparent') {
        bgColor = 'transparent';
    }
    // Validation supplémentaire pour éviter les erreurs 400
    const title = document.getElementById('floating-ad-title').value.trim();
    const content = document.getElementById('floating-ad-content').value.trim();
    let positionValue = document.getElementById('floating-ad-position').value;
    const fixedType = document.getElementById('floating-ad-fixed') ? document.getElementById('floating-ad-fixed').value : 'floating';
    if (!title) {
        alert('Le titre de la publicité est obligatoire.');
        return;
    }
    // Le contenu n'est plus obligatoire
    if (!positionValue) {
        alert('La position de la publicité est obligatoire.');
        return;
    }
    if (!fixedType) {
        alert("Le type d'ancrage est obligatoire.");
        return;
    }
    // Ne jamais ajouter '-fixed' à la position envoyée à l'API
    // On peut stocker le type d'ancrage ailleurs si besoin, mais l'API n'accepte que les valeurs simples
    if (positionValue.endsWith('-fixed')) {
        positionValue = positionValue.replace('-fixed', '');
    }
    const data = {
        title: title,
        content: content,
        displayMode: document.getElementById('floating-ad-display-mode').value,
        position: positionValue,
        width: document.getElementById('floating-ad-width').value,
        height: document.getElementById('floating-ad-height').value,
        // Durée d'affichage en millisecondes (champ du modal)
        displayDuration: parseInt(document.getElementById('floating-ad-duration').value, 10) || 0,
        backgroundColor: bgColor,
        textColor: document.getElementById('floating-ad-text-color').value,
        targetPages: targetPagesString, // ENVOYER COMME STRING
        redirectUrl: redirectUrl || null,
        isActive: document.getElementById('floating-ad-active').checked,
        startDate: document.getElementById('floating-ad-start-date').value || null,
        endDate: document.getElementById('floating-ad-end-date').value || null
    };
    // Note: on envoie explicitement displayDuration en ms au backend
    
    try {
        let response;
        if (currentFloatingAdId) {
            // Modification
            response = await fetch(`${API_BASE_URL}/floating-ads/${currentFloatingAdId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Création
            response = await fetch(`${API_BASE_URL}/floating-ads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
        }
        
        const savedAd = await response.json();
        
        // Gérer l'upload d'image si nécessaire
        const imageFile = document.getElementById('floating-ad-image').files[0];
        if (imageFile) {
            await uploadFloatingAdImage(savedAd.id, imageFile);
            // Recharge les publicités pour afficher l'image uploadée
            loadFloatingAds();
        }
        
        alert(currentFloatingAdId ? 'Publicité modifiée avec succès' : 'Publicité créée avec succès');
        closeFloatingAdModalInternal();
        loadFloatingAds();
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde: ' + error.message);
    }
}

// Fonction pour uploader une image
async function uploadFloatingAdImage(adId, file) {
    const formData = new FormData();
    formData.append('file', file);
    // Vérification de adId
    if (!adId) {
        throw new Error('ID de la publicité manquant pour l’upload d’image');
    }
    try {
        const response = await fetch(`${API_BASE_URL}/upload/floating-ad/${adId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });
        if (!response.ok) throw new Error('Erreur upload image');
        return await response.json();
    } catch (error) {
        console.error('Erreur upload image:', error);
        throw error;
    }
}

// Fonction pour supprimer l'image dans le modal
function removeFloatingAdImageInternal() {
    document.getElementById('floating-ad-image-preview').innerHTML = '';
    document.getElementById('floating-ad-image').value = '';
}

// Fonction pour basculer le statut d'une publicité
async function toggleFloatingAdStatusInternal(id) {
    try {
        const ad = floatingAds.find(a => a.id === id);
        if (!ad) throw new Error('Publicité non trouvée');
        
        const response = await fetch(`${API_BASE_URL}/floating-ads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !ad.isActive })
        });
        
        if (!response.ok) throw new Error('Erreur lors de la modification du statut');
        
        loadFloatingAds();
    } catch (error) {
        console.error('Erreur lors du changement de statut:', error);
        alert('Erreur lors du changement de statut');
    }
}

// Fonction pour supprimer une publicité
async function deleteFloatingAdInternal(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/floating-ads/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        alert('Publicité supprimée avec succès');
        loadFloatingAds();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
    }
}

// Fonction pour mettre à jour les champs selon le mode d'affichage
function updateDisplayModeFieldsInternal() {
    const displayMode = document.getElementById('floating-ad-display-mode').value;
    const durationGroup = document.getElementById('floating-ad-duration').closest('.form-group');
    
    // Pour les popups, on peut masquer le temps d'affichage automatique
    if (displayMode === 'popup') {
        durationGroup.style.display = 'none';
    } else {
        durationGroup.style.display = 'block';
    }
}

// Gestion de l'aperçu d'image
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('floating-ad-image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('floating-ad-image-preview').innerHTML = 
                        `<div class="image-item"><img src="${e.target.result}" alt="Aperçu"><button type="button" onclick="removeFloatingAdImage()">×</button></div>`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});