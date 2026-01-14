// Gestion des bannières header
let headerBanners = [];
let currentHeaderBannerEdit = null;

// Fonction utilitaire pour les headers d'authentification
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        // Pas d'authentification pour le moment - peut être ajoutée plus tard
    };
}

// Initialisation des bannières header
function initHeaderBanners() {
    loadHeaderBanners();
}

// Helper: retourne l'URL complète d'une image uploadée
function getFullUploadUrl(imageUrl) {
    if (!imageUrl) return imageUrl;
    if (imageUrl.startsWith('http')) return imageUrl;
    // Utiliser la configuration API centralisée
    const baseUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL.replace('/api', '') : 'http://localhost:3000';
    return baseUrl + imageUrl;
}

// Charger toutes les bannières header
async function loadHeaderBanners() {
    try {
        showLoading('header-banners-loading');
        
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/header-banners`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            headerBanners = await response.json();
            console.log('✅ Bannières chargées:', headerBanners);
            // Vérifier les positions d'images
            headerBanners.forEach(banner => {
                console.log(`🎯 Bannière "${banner.title}": imagePosition = "${banner.imagePosition || 'undefined'}"`);
            });
            // Debug: vérifier les URLs des images
            headerBanners.forEach(banner => {
                if (banner.imageUrl) {
                    const baseUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL.replace('/api', '') : 'http://localhost:3000';
                    console.log(`🖼️ Bannière ${banner.id}: imageUrl = "${banner.imageUrl}"`);
                    console.log(`🔗 URL complète: "${banner.imageUrl.startsWith('http') ? banner.imageUrl : baseUrl + banner.imageUrl}"`);
                }
            });
            displayHeaderBanners();
            updateHeaderBannersStats();
        } else {
            throw new Error('Erreur lors du chargement des bannières');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des bannières header', 'error');
    } finally {
        hideLoading('header-banners-loading');
    }
}

// Afficher les bannières dans le tableau
function displayHeaderBanners() {
    const tbody = document.getElementById('header-banners-tbody');
    
    if (!headerBanners.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-image"></i>
                        <p>Aucune bannière header trouvée</p>
                        <button class="btn btn-primary" onclick="openHeaderBannerModal()">
                            <i class="fas fa-plus"></i> Créer la première bannière
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = headerBanners.map(banner => `
        <tr>
            <td>
                <div class="banner-preview">
                    ${banner.imageUrl ? 
                        `<img src="${getFullUploadUrl(banner.imageUrl)}" 
                              alt="${banner.title}" 
                              style="width: 120px; height: 60px; object-fit: contain; border-radius: 4px; cursor: pointer; border: 1px solid #ddd;"
                              onclick="showImagePreview('${getFullUploadUrl(banner.imageUrl)}', '${banner.title}')"
                              onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCAzMEg1MlYzMkg1MFYzMFpNNTIgMzJINTRWMzRINTJWMzJaTTU0IDM0SDU2VjM2SDU0VjM0Wk01NiAzNkg1OFYzOEg1NlYzNlpNNTggMzhINjBWNDBINThWMzhaTTYwIDQwSDYyVjQySDYwVjQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'; console.error('❌ Erreur chargement image:', this.src);">` : 
                        '<div style="width: 120px; height: 60px; background: #f8f9fa; border-radius: 4px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image text-muted"></i></div>'
                    }
                </div>
            </td>
            <td>
                <div class="banner-title">
                    <strong>${banner.title}</strong>
                    ${banner.linkUrl ? `<small><i class="fas fa-external-link-alt"></i> ${banner.linkUrl}</small>` : ''}
                </div>
            </td>
            <td>
                <small class="text-muted">${banner.description || 'Aucune description'}</small>
            </td>
            <td>
                <span class="position-badge position-${banner.imagePosition || 'center'}">
                    ${banner.imagePosition === 'left' ? '⬅️ Gauche' : 
                      banner.imagePosition === 'right' ? '➡️ Droite' : 
                      '🏠 Centre'}
                </span>
            </td>
            <td>
                <span class="badge badge-secondary">${banner.displayOrder}</span>
            </td>
            <td>
                <span class="duration-badge">${banner.displayDuration}ms</span>
            </td>
            <td>
                <span class="status-badge ${banner.isActive ? 'status-active' : 'status-inactive'}">
                    <i class="fas fa-circle"></i>
                    ${banner.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="stats-info">
                    <div><i class="fas fa-eye"></i> ${banner.viewCount || 0} vues</div>
                    <div><i class="fas fa-mouse-pointer"></i> ${banner.clickCount || 0} clics</div>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="editHeaderBanner(${banner.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm ${banner.isActive ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleHeaderBannerStatus(${banner.id})" 
                            title="${banner.isActive ? 'Désactiver' : 'Activer'}">
                        <i class="fas ${banner.isActive ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteHeaderBanner(${banner.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Mettre à jour les statistiques
async function updateHeaderBannersStats() {
    try {
        // Essayer de récupérer les statistiques depuis l'API
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/header-banners/statistics/all`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const stats = await response.json();
            document.getElementById('stat-header-banners-total').textContent = stats.total || 0;
            document.getElementById('stat-header-banners-active').textContent = stats.active || 0;
            document.getElementById('stat-header-banners-views').textContent = stats.totalViews || 0;
            document.getElementById('stat-header-banners-clicks').textContent = stats.totalClicks || 0;
        } else {
            // Fallback: calcul local des statistiques
            updateHeaderBannersStatsLocal();
        }
    } catch (error) {
        console.warn('API non disponible, calcul local des stats:', error);
        updateHeaderBannersStatsLocal();
    }
}

// Calcul local des statistiques
function updateHeaderBannersStatsLocal() {
    const total = headerBanners.length;
    const active = headerBanners.filter(banner => banner.isActive).length;
    const totalViews = headerBanners.reduce((sum, banner) => sum + (banner.viewCount || 0), 0);
    const totalClicks = headerBanners.reduce((sum, banner) => sum + (banner.clickCount || 0), 0);
    
    document.getElementById('stat-header-banners-total').textContent = total;
    document.getElementById('stat-header-banners-active').textContent = active;
    document.getElementById('stat-header-banners-views').textContent = totalViews;
    document.getElementById('stat-header-banners-clicks').textContent = totalClicks;
}

// Ouvrir la modale pour ajouter/modifier une bannière
function openHeaderBannerModal(bannerId = null) {
    const modal = document.getElementById('header-banner-modal');
    const title = document.getElementById('header-banner-modal-title');
    const form = document.getElementById('header-banner-form');
    
    // Reset du formulaire
    form.reset();
    document.getElementById('header-banner-id').value = '';
    document.getElementById('header-banner-image-preview').innerHTML = '';
    document.getElementById('header-banner-position').value = 'center';
    
    if (bannerId) {
        const banner = headerBanners.find(b => b.id === bannerId);
        if (banner) {
            title.textContent = 'Modifier la bannière header';
            fillHeaderBannerForm(banner);
            currentHeaderBannerEdit = bannerId;
        }
    } else {
        title.textContent = 'Ajouter une bannière header';
        currentHeaderBannerEdit = null;
    }
    
    modal.classList.remove('hidden');
}

// Fermer la modale
function closeHeaderBannerModal() {
    document.getElementById('header-banner-modal').classList.add('hidden');
    currentHeaderBannerEdit = null;
}

// Remplir le formulaire avec les données d'une bannière
function fillHeaderBannerForm(banner) {
    document.getElementById('header-banner-id').value = banner.id;
    document.getElementById('header-banner-title').value = banner.title;
    document.getElementById('header-banner-description').value = banner.description || '';
    document.getElementById('header-banner-link').value = banner.linkUrl || '';
    document.getElementById('header-banner-order').value = banner.displayOrder;
    document.getElementById('header-banner-duration').value = banner.displayDuration;
    document.getElementById('header-banner-styles').value = banner.customStyles || '';
    document.getElementById('header-banner-position').value = banner.imagePosition || 'center';
    document.getElementById('header-banner-active').checked = banner.isActive;
    
    // Afficher l'aperçu de l'image
    if (banner.imageUrl) {
        const fullUrl = getFullUploadUrl(banner.imageUrl);
        document.getElementById('header-banner-image-preview').innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${fullUrl}" alt="Aperçu" 
                     style="max-width: 300px; max-height: 150px; object-fit: contain; border-radius: 4px; border: 1px solid #ddd; cursor: pointer;"
                     onclick="showImagePreview('${fullUrl}', '${banner.title}')">
                <div style="position: absolute; bottom: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">
                    Cliquer pour agrandir
                </div>
            </div>
        `;
    }
}

// Sauvegarder une bannière
async function saveHeaderBanner() {
    const form = document.getElementById('header-banner-form');
    const formData = new FormData();
    
    // Données de base
    const data = {
        title: document.getElementById('header-banner-title').value.trim(),
        description: document.getElementById('header-banner-description').value.trim(),
        linkUrl: document.getElementById('header-banner-link').value.trim(),
        displayOrder: parseInt(document.getElementById('header-banner-order').value) || 0,
        displayDuration: parseInt(document.getElementById('header-banner-duration').value) || 5000,
        customStyles: document.getElementById('header-banner-styles').value.trim(),
        imagePosition: document.getElementById('header-banner-position').value || 'center',
        isActive: document.getElementById('header-banner-active').checked
    };
    
    // Validation
    if (!data.title) {
        showNotification('Le titre est requis', 'error');
        return;
    }
    
    const imageFile = document.getElementById('header-banner-image').files[0];
    const bannerId = document.getElementById('header-banner-id').value;
    
    // L'image est optionnelle - les bannières peuvent être créées avec du texte seul
    
    try {
        let imageUrl = '';
        
        // Upload de l'image si nécessaire
        if (imageFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', imageFile);
            
            const apiUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';
            const uploadResponse = await fetch(`${apiUrl}/upload/header-banner`, {
                method: 'POST',
                body: uploadFormData
            });
            
            if (uploadResponse.ok) {
                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.url;
                console.log('✅ Image uploadée:', imageUrl);
            } else {
                const errorText = await uploadResponse.text();
                console.error('❌ Erreur upload:', errorText);
                throw new Error(`Erreur lors de l'upload de l'image: ${errorText}`);
            }
        } else {
            console.log('ℹ️ Pas d\'image à uploader, création de bannière avec texte seul');
        }
        
        // Ajouter l'URL de l'image si nécessaire
        if (imageUrl) {
            data.imageUrl = imageUrl;
        }
        
        // Envoyer les données
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';
        const url = bannerId ? 
            `${apiUrl}/header-banners/${bannerId}` : 
            `${apiUrl}/header-banners`;
        
        const method = bannerId ? 'PATCH' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification(
                bannerId ? 'Bannière modifiée avec succès' : 'Bannière créée avec succès', 
                'success'
            );
            closeHeaderBannerModal();
            loadHeaderBanners();
        } else {
            const error = await response.text();
            throw new Error(error || 'Erreur lors de la sauvegarde');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la sauvegarde de la bannière', 'error');
    }
}

// Modifier une bannière
function editHeaderBanner(bannerId) {
    openHeaderBannerModal(bannerId);
}

// Basculer le statut d'une bannière
async function toggleHeaderBannerStatus(bannerId) {
    try {
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/header-banners/${bannerId}/toggle-active`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showNotification('Statut de la bannière mis à jour', 'success');
            loadHeaderBanners();
        } else {
            throw new Error('Erreur lors de la mise à jour du statut');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la mise à jour du statut', 'error');
    }
}

// Supprimer une bannière
async function deleteHeaderBanner(bannerId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
        return;
    }
    
    try {
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/header-banners/${bannerId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showNotification('Bannière supprimée avec succès', 'success');
            loadHeaderBanners();
        } else {
            throw new Error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression de la bannière', 'error');
    }
}

// Actualiser les bannières
function refreshHeaderBanners() {
    loadHeaderBanners();
}

// Incrémenter le compteur de vues d'une bannière
async function incrementHeaderBannerView(bannerId) {
    try {
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';
        await fetch(`${apiUrl}/header-banners/${bannerId}/view`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation des vues:', error);
    }
}

// Incrémenter le compteur de clics d'une bannière
async function incrementHeaderBannerClick(bannerId) {
    try {
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';
        await fetch(`${apiUrl}/header-banners/${bannerId}/click`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation des clics:', error);
    }
}

// Gestion de l'aperçu d'image
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('header-banner-image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('header-banner-image-preview');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `
                        <div style="position: relative; display: inline-block;">
                            <img src="${e.target.result}" alt="Aperçu" 
                                 style="max-width: 300px; max-height: 150px; object-fit: contain; border-radius: 4px; border: 1px solid #ddd; cursor: pointer;"
                                 onclick="showImagePreview('${e.target.result}', 'Nouvel aperçu')">
                            <div style="position: absolute; bottom: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">
                                Cliquer pour agrandir
                            </div>
                            <div style="margin-top: 5px; font-size: 12px; color: #666;">
                                📁 ${file.name} (${(file.size / 1024).toFixed(1)} KB)
                            </div>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = '';
            }
        });
    }
});

// Afficher l'aperçu d'image en grand
function showImagePreview(imageUrl, title) {
    // Créer la modale d'aperçu si elle n'existe pas
    let modal = document.getElementById('image-preview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-preview-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        
        // Fermer en cliquant sur la modale
        modal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Afficher l'image
    const img = modal.querySelector('img');
    img.src = imageUrl;
    img.alt = title;
    modal.style.display = 'flex';
}

// Fermer la modale en cliquant à l'extérieur
document.addEventListener('click', function(e) {
    const modal = document.getElementById('header-banner-modal');
    if (e.target === modal) {
        closeHeaderBannerModal();
    }
});