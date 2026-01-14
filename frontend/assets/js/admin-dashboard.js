// =========================
// FONCTIONS UTILITAIRES GLOBALES
// =========================

// Fonction pour afficher les notifications
window.showNotification = function(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Créer une notification visuelle
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    // Couleurs selon le type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            notification.style.backgroundColor = '#FF9800';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Suppression automatique après 4 secondes
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
};

// Gestion sélection promotions
window.updateSelectedPromotions = function() {
    const checkboxes = document.querySelectorAll('.select-promotion');
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    const countSpan = document.getElementById('selected-promotions-count');
    const delBtn = document.getElementById('delete-selected-promotions');
    const selectAll = document.getElementById('select-all-promotions');
    if (countSpan) countSpan.textContent = selected.length;
    if (delBtn) {
        if (selected.length > 0) {
            delBtn.classList.remove('hide-by-default');
        } else {
            delBtn.classList.add('hide-by-default');
        }
    }
    if (selectAll) selectAll.checked = selected.length === checkboxes.length && checkboxes.length > 0;
}

window.toggleAllPromotions = function(checked) {
    document.querySelectorAll('.select-promotion').forEach(cb => { cb.checked = checked; });
    window.updateSelectedPromotions();
}

window.deleteSelectedPromotions = async function() {
    const selected = Array.from(document.querySelectorAll('.select-promotion:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    if (!confirm('Supprimer les promotions sélectionnées ?')) return;
    const delBtn = document.getElementById('delete-selected-promotions');
    if (delBtn) delBtn.disabled = true;
    try {
        for (const id of selected) {
            await deletePromotion(id, true); // true = suppression silencieuse
        }
        await loadPromotions();
    } catch (e) {
        alert('Erreur lors de la suppression groupée');
    } finally {
        if (delBtn) delBtn.disabled = false;
    }
}
// =========================
// GESTION DES ABONNÉS NOTIFICATIONS
// =========================

async function loadSubscribers() {
    const loading = document.getElementById('subscribers-loading');
    const tbody = document.getElementById('subscribers-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (loading) loading.style.display = '';
    try {
        const res = await fetch('http://localhost:3000/api/subscribers');
        const subs = await res.json();
        if (!Array.isArray(subs)) throw new Error('Format API invalide');
        subs.forEach(sub => {
            const isActive = (typeof sub.active !== 'undefined') ? sub.active : sub.isActive;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="select-subscriber" value="${sub.id}"></td>
                <td>${sub.email || ''}</td>
                <td>${sub.phone || ''}</td>
                <td><span class="${isActive ? 'status-active' : 'status-inactive'}">${isActive ? 'Actif' : 'Bloqué'}</span></td>
                <td style="display:flex; gap:10px; align-items:center; justify-content:flex-end;">
                    <button class='btn ${isActive ? 'btn-warning' : 'btn-success'}' onclick='blockSubscriber(${sub.id}, ${isActive})'>${isActive ? 'Désactiver' : 'Activer'}</button>
                    <button class="btn btn-danger" onclick="deleteSubscriber(${sub.id})">Supprimer</button>
                </td>
            `;
            tbody.appendChild(tr);
		});
		window.updateSelectedSubscribers();
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="4" style="color:red;">Erreur lors du chargement des abonnés</td></tr>';
    } finally {
        if (loading) loading.style.display = 'none';
    }
}
// Gestion sélection abonnés

window.updateSelectedSubscribers = function() {
    const checkboxes = document.querySelectorAll('.select-subscriber');
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    const countSpan = document.getElementById('selected-subscribers-count');
    const delBtn = document.getElementById('delete-selected-subscribers');
    const blockBtn = document.getElementById('block-selected-subscribers');
    const selectAll = document.getElementById('select-all-subscribers');
    if (countSpan) countSpan.textContent = selected.length;
    if (delBtn) {
        if (selected.length > 0) {
            delBtn.classList.remove('hide-by-default');
        } else {
            delBtn.classList.add('hide-by-default');
        }
    }
    if (blockBtn) {
        if (selected.length > 0) {
            blockBtn.classList.remove('hide-by-default');
        } else {
            blockBtn.classList.add('hide-by-default');
        }
    }
    if (selectAll) selectAll.checked = selected.length === checkboxes.length && checkboxes.length > 0;
}

window.toggleAllSubscribers = function(checked) {
    document.querySelectorAll('.select-subscriber').forEach(cb => { cb.checked = checked; });
    window.updateSelectedSubscribers();
}

window.deleteSelectedSubscribers = async function() {
    const selected = Array.from(document.querySelectorAll('.select-subscriber:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    if (!confirm('Supprimer les abonnés sélectionnés ?')) return;
    const delBtn = document.getElementById('delete-selected-subscribers');
    if (delBtn) delBtn.disabled = true;
    try {
        for (const id of selected) {
            await fetch(`http://localhost:3000/api/subscribers/${id}`, { method: 'DELETE' });
        }
        await loadSubscribers();
    } catch (e) {
        alert('Erreur lors de la suppression groupée');
    } finally {
        if (delBtn) delBtn.disabled = false;
    }
}

window.blockSelectedSubscribers = async function() {
    const selected = Array.from(document.querySelectorAll('.select-subscriber:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    if (!confirm('Désactiver les abonnés sélectionnés ?')) return;
    const blockBtn = document.getElementById('block-selected-subscribers');
    if (blockBtn) blockBtn.disabled = true;
    try {
        for (const id of selected) {
            await fetch(`http://localhost:3000/api/subscribers/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: false })
            });
        }
        await loadSubscribers();
    } catch (e) {
        alert('Erreur lors de la désactivation groupée');
    } finally {
        if (blockBtn) blockBtn.disabled = false;
    }
}

// Met à jour la sélection à chaque clic
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('select-subscriber')) updateSelectedSubscribers();
});

async function blockSubscriber(id, isActive) {
    const action = isActive ? 'désactiver' : 'activer';
    if (!confirm(`Voulez-vous vraiment ${action} cet abonné ?`)) return;
    try {
        const res = await fetch(`http://localhost:3000/api/subscribers/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: !isActive })
        });
        if (!res.ok) throw new Error('API error');
        // Attendre la fin de la requête avant de recharger
        await loadSubscribers();
    } catch (e) {
        alert('Erreur lors du changement de statut');
    }
}

async function deleteSubscriber(id) {
    if (!confirm('Supprimer définitivement cet abonné ?')) return;
    try {
        await fetch(`http://localhost:3000/api/subscribers/${id}`, { method: 'DELETE' });
        loadSubscribers();
    } catch (e) {
        alert('Erreur lors de la suppression');
    }
}
// ===============================
// Fonctions publicités flottantes et gestion formulaire (déplacées depuis admin.html)
// ===============================

window.refreshFloatingAdsStats = async function() {
    // ... (voir code déplacé)
};

window.openFloatingAdModal = function() {
    // ... (voir code déplacé)
};

window.closeFloatingAdModal = function() {
    // ... (voir code déplacé)
};

window.saveFloatingAd = async function() {
    // ... (voir code déplacé)
};

window.editFloatingAd = async function(id) {
    // ... (voir code déplacé)
};

window.deleteFloatingAd = async function(id) {
    // ... (voir code déplacé)
};

window.deleteAllTestAds = async function() {
    // ... (voir code déplacé)
};

// Gestionnaire pour la prévisualisation de l'image
document.getElementById('floating-ad-image').addEventListener('change', function(e) {
    // ... (voir code déplacé)
});

window.clearImagePreview = function() {
    // ... (voir code déplacé)
};

async function uploadFloatingAdImage(file) {
    // Affiche ou masque les champs selon le type de redirection choisi (publicité flottante)
    var internalSelect = document.getElementById('internal-redirect-select');
    var externalInput = document.getElementById('external-redirect-input');
    if (!internalSelect || !externalInput) return;
    if (redirectType === 'internal') {
        internalSelect.style.display = '';
        externalInput.style.display = 'none';
    } else if (redirectType === 'external') {
        internalSelect.style.display = 'none';
        externalInput.style.display = '';
    } else {
        internalSelect.style.display = 'none';
        externalInput.style.display = 'none';
    }
}

// SYSTÈME DE RECHARGEMENT AUTOMATIQUE
let autoRefreshInterval;
function startAutoRefresh() {
    // Affiche ou masque les champs selon le type de redirection choisi (publicité flottante)
    var internalSelect = document.getElementById('internal-redirect-select');
    var externalInput = document.getElementById('external-redirect-input');
    if (!internalSelect || !externalInput) return;
    var redirectType = document.querySelector('input[name="redirect-type"]:checked');
    if (redirectType && redirectType.value === 'internal') {
        internalSelect.classList.remove('hidden');
        externalInput.classList.add('hidden');
    } else if (redirectType && redirectType.value === 'external') {
        internalSelect.classList.add('hidden');
        externalInput.classList.remove('hidden');
    } else {
        internalSelect.classList.add('hidden');
        externalInput.classList.add('hidden');
    }
}
function stopAutoRefresh() {
    // Validation stricte du champ de redirection avant sauvegarde
    var redirectType = document.querySelector('input[name="redirect-type"]:checked');
    var redirectUrl = window.getRedirectUrl();
    if (redirectType) {
        if (redirectType.value === 'internal') {
            // Doit finir par .html et ne pas contenir d'espace
            if (!redirectUrl || !redirectUrl.endsWith('.html') || /\s/.test(redirectUrl)) {
                alert('Pour une page interne, choisissez une page valide se terminant par .html.');
                return;
            }
        } else if (redirectType.value === 'external') {
            // Doit être une URL complète http(s)
            if (!/^https?:\/\//i.test(redirectUrl)) {
                alert('Pour un site externe, saisissez une URL complète commençant par http:// ou https://');
                return;
            }
        } else if (redirectType.value === 'none') {
            if (redirectUrl) {
                alert('Aucune redirection ne doit être sélectionnée.');
                return;
            }
        }
    }
    // ... (voir code déplacé)
}
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(startAutoRefresh, 1000);
});
window.addEventListener('beforeunload', stopAutoRefresh);
window.startAutoRefresh = startAutoRefresh;
window.stopAutoRefresh = stopAutoRefresh;

// Fonctions pour le ciblage de pages et redirection
window.toggleAllPages = function(checkbox) {
    // ... (voir code déplacé)
};
window.updateRedirectFields = function(redirectType) {
    var internalSelect = document.getElementById('internal-redirect-select');
    var externalInput = document.getElementById('external-redirect-input');
    if (!internalSelect || !externalInput) return;
    if (redirectType === 'internal') {
        internalSelect.classList.remove('hidden');
        externalInput.classList.add('hidden');
    } else if (redirectType === 'external') {
        internalSelect.classList.add('hidden');
        externalInput.classList.remove('hidden');
    } else {
        internalSelect.classList.add('hidden');
        externalInput.classList.add('hidden');
    }
};
window.getSelectedTargetPages = function() {
    // Récupère la sélection des pages cibles pour la publicité flottante
    var allPagesCheckbox = document.getElementById('target-all-pages');
    if (allPagesCheckbox && allPagesCheckbox.checked) {
        return ['*'];
    }
    var checkedBoxes = document.querySelectorAll('input[name="target-page"]:checked');
    var selectedPages = Array.from(checkedBoxes).map(function(cb) { return cb.value; });
    return selectedPages;
};
window.setTargetPages = function(targetPages) {
    // ... (voir code déplacé)
};
window.getRedirectUrl = function() {
    // Récupère la valeur de redirection selon le type sélectionné
    var type = document.querySelector('input[name="redirect-type"]:checked');
    if (!type) return '';
    if (type.value === 'internal') {
        var select = document.getElementById('floating-ad-internal-redirect');
        var val = select ? select.value.trim() : '';
        // Pour l'API, ne pas préfixer par / (ex: 'boutique.html')
        return val;
    } else if (type.value === 'external') {
        var input = document.getElementById('floating-ad-external-redirect');
        var val = input ? input.value.trim() : '';
        // Forcer https:// si ce n'est pas vide et ne commence pas déjà par http
        if (val && !/^https?:\/\//i.test(val)) val = 'https://' + val;
        return val;
    }
    return '';
};
window.setRedirectUrl = function(redirectUrl) {
    // Détecte le type et remplit le champ approprié
    var type = 'none';
    if (redirectUrl) {
        if (/^https?:\/\//i.test(redirectUrl)) {
            type = 'external';
        } else {
            type = 'internal';
        }
    }
    // Sélectionne le bon radio
    var radios = document.querySelectorAll('input[name="redirect-type"]');
    radios.forEach(function(r) {
        r.checked = (r.value === type);
    });
    // Affiche le bon champ
    window.updateRedirectFields(type);
    // Remplit la valeur
    if (type === 'internal') {
        var select = document.getElementById('floating-ad-internal-redirect');
        if (select) {
            // Pour affichage, garder la valeur telle quelle (sans /)
            select.value = redirectUrl.startsWith('/') ? redirectUrl.slice(1) : redirectUrl;
        }
    } else if (type === 'external') {
        var input = document.getElementById('floating-ad-external-redirect');
        if (input) input.value = redirectUrl;
    }
    if (type === 'none') {
        var select = document.getElementById('floating-ad-internal-redirect');
        var input = document.getElementById('floating-ad-external-redirect');
        if (select) select.value = '';
        if (input) input.value = '';
    }
};
window.resetFloatingAdForm = function() {
    // ... (voir code déplacé)
};
window.updateSelectionStatus = function() {
    // ... (voir code déplacé)
};
document.addEventListener('DOMContentLoaded', function() {
    // ... (voir code déplacé)
});
// ===============================
// Fin du code déplacé depuis admin.html
// ===============================
// --- Script déplacé depuis admin.html ---
// Gestion du bouton Gestion Annonces
document.addEventListener('DOMContentLoaded', function() {
    var gestionBtn = document.getElementById('gestion-annonces-link');
    if (gestionBtn) {
        gestionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../gestion-annonces.html';
        });
    }
});

// Génération de code d'autorisation via API NestJS
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('generate-auth-code-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const label = document.getElementById('code-label').value;
            let expiresAt = document.getElementById('code-expiry').value;
            if (expiresAt) {
                const dateObj = new Date(expiresAt);
                expiresAt = dateObj.toISOString();
            }
            const resultDiv = document.getElementById('auth-code-result');
            resultDiv.innerHTML = 'Génération en cours...';
            try {
                const response = await fetch('http://localhost:3000/api/auth-codes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ label, expiresAt })
                });
                if (!response.ok) throw new Error('Erreur API');
                const data = await response.json();
                resultDiv.innerHTML = `<b>Code généré :</b> <span style="font-size:1.2em;">${data.code || data.generatedCode || 'Code inconnu'}</span>`;
            } catch (err) {
                resultDiv.innerHTML = '<span style="color:red;">Erreur lors de la génération du code.</span>';
            }
        });
    }
});

// Affichage du formulaire de génération de code dans paramètres
document.addEventListener('DOMContentLoaded', function() {
    var showAuthBtn = document.getElementById('show-auth-codes');
    var authCodesSection = document.getElementById('auth-codes-section');
    if (showAuthBtn && authCodesSection) {
        showAuthBtn.addEventListener('click', function() {
            if (authCodesSection.classList.contains('hidden')) {
                authCodesSection.classList.remove('hidden');
            } else {
                authCodesSection.classList.add('hidden');
            }
        });
    }
});

// --- Gestion des admins (extrait de admin-users.html, adapté) ---
document.addEventListener('DOMContentLoaded', function() {
    loadAdmins();
    // Bouton ouverture modale ajout admin
    document.getElementById('add-admin').addEventListener('click', function() {
        const modal = document.getElementById('add-admin-modal');
        modal.classList.remove('modal-hidden');
        modal.style.display = 'flex'; // Pour garder le centrage flex si besoin
    });
    // Fermeture modale ajout admin
    document.getElementById('close-add-admin').addEventListener('click', function() {
        const modal = document.getElementById('add-admin-modal');
        modal.classList.add('modal-hidden');
        modal.style.display = '';
    });
    document.getElementById('cancel-add-admin').addEventListener('click', function() {
        const modal = document.getElementById('add-admin-modal');
        modal.classList.add('modal-hidden');
        modal.style.display = '';
    });
    // Soumission formulaire ajout admin (API NestJS)
    document.getElementById('add-admin-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('new-admin-name').value.trim();
        const email = document.getElementById('new-admin-email').value.trim();
        const role = document.getElementById('new-admin-role').value;
        const password = document.getElementById('new-admin-password').value;
        const code = document.getElementById('new-admin-code').value.trim();
        const resultDiv = document.getElementById('add-admin-result');
        resultDiv.innerHTML = 'Ajout en cours...';
        let firstName = name;
        let lastName = '';
        if (name.includes(' ')) {
            const parts = name.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ');
        }
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, role, password, code })
            });
            if (response.ok) {
                const data = await response.json();
                resultDiv.innerHTML = '<span style="color:green;">Administrateur ajouté avec succès.</span>';
                document.getElementById('add-admin-form').reset();
                const modal = document.getElementById('add-admin-modal');
                modal.classList.add('modal-hidden');
                modal.style.display = '';
                loadAdmins();
            } else {
                let errorMsg = 'Erreur lors de l\'ajout de l\'administrateur.';
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMsg += ' ' + errorData.message;
                    }
                } catch {}
                resultDiv.innerHTML = `<span style="color:red;">${errorMsg}</span>`;
            }
        } catch (err) {
            resultDiv.innerHTML = `<span style="color:red;">Erreur inattendue : ${err.message}</span>`;
        }
    });
    // Gestion modales suppression/édition (inchangé)
    const deleteModal = document.getElementById('delete-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            deleteModal.classList.add('modal-hidden');
            document.getElementById('add-admin-modal').classList.add('modal-hidden');
        });
    });
    document.getElementById('cancel-delete').addEventListener('click', () => {
        deleteModal.classList.add('modal-hidden');
    });
    window.addEventListener('click', (e) => {
        if (e.target === deleteModal) deleteModal.classList.add('modal-hidden');
        if (e.target === document.getElementById('add-admin-modal')) document.getElementById('add-admin-modal').classList.add('modal-hidden');
    });
});

function loadAdmins() {
    const adminsTable = document.getElementById('admins-table');
    if (!adminsTable) return;
    adminsTable.innerHTML = '';
    const defaultRow = document.createElement('tr');
    defaultRow.innerHTML = `
        <td><strong>Admin FADIDI</strong></td>
        <td>admin@fadidi.com</td>
        <td>Super Administrateur</td>
        <td>Permanent</td>
        <td><span class="status-active">Actif</span></td>
        <td><button class="btn btn-secondary" disabled><i class="fas fa-lock"></i> Compte système</button></td>
    `;
    adminsTable.appendChild(defaultRow);
    fetch('http://localhost:3000/api/users')
        .then(res => res.json())
        .then(admins => {
            localStorage.setItem('fadidiAdmins', JSON.stringify(admins));
            const currentUser = JSON.parse(localStorage.getItem('fadidiCurrentAdmin') || '{"role": "superadmin"}');
            const isSuperAdmin = currentUser.role === 'superadmin';
            admins.forEach(admin => {
                const row = document.createElement('tr');
                const statusClass = admin.isActive ? 'status-active' : 'status-inactive';
                const statusText = admin.isActive ? 'Actif' : 'Inactif';
                let actionButtons;
                // Protection pour le superadmin créé le 30/09/2025
                const isProtectedSuperadmin = admin.role === 'superadmin' && admin.email === 'superadmin@fadidi.com' && admin.createdAt && new Date(admin.createdAt).toLocaleDateString() === '30/09/2025';
                if (isProtectedSuperadmin) {
                    actionButtons = `<button class="btn btn-secondary" disabled><i class="fas fa-shield-alt"></i> Compte protégé</button>`;
                } else if (isSuperAdmin) {
                    actionButtons = `
                        <button class="btn btn-primary" onclick="showEditModal('${admin.email}')" style="margin-right: 5px;"><i class="fas fa-edit"></i> Modifier</button>
                        <button class="btn btn-danger" onclick="showDeleteModal('${admin.email}')"><i class="fas fa-trash"></i></button>
                    `;
                } else {
                    actionButtons = `
                        <button class="btn btn-secondary" disabled><i class="fas fa-edit"></i> Modifier</button>
                        <button class="btn btn-secondary" disabled><i class="fas fa-trash"></i></button>
                    `;
                }
                row.innerHTML = `
                    <td>${admin.firstName || admin.name || ''} ${admin.lastName || ''}</td>
                    <td>${admin.email}</td>
                    <td>${admin.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur'}</td>
                    <td>${admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : ''}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td>${actionButtons}</td>
                `;
                adminsTable.appendChild(row);
            });
        })
        .catch(() => {
            const admins = JSON.parse(localStorage.getItem('fadidiAdmins') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('fadidiCurrentAdmin') || '{"role": "superadmin"}');
            const isSuperAdmin = currentUser.role === 'superadmin';
            admins.forEach(admin => {
                const row = document.createElement('tr');
                const statusClass = admin.status === 'active' ? 'status-active' : 'status-inactive';
                const statusText = admin.status === 'active' ? 'Actif' : 'Inactif';
                let actionButtons;
                if (isSuperAdmin) {
                    actionButtons = `
                        <button class="btn btn-primary" onclick="showEditModal('${admin.email}')" style="margin-right: 5px;"><i class="fas fa-edit"></i> Modifier</button>
                        <button class="btn btn-danger" onclick="showDeleteModal('${admin.email}')"><i class="fas fa-trash"></i></button>
                    `;
                } else {
                    actionButtons = `
                        <button class="btn btn-secondary" disabled><i class="fas fa-edit"></i> Modifier</button>
                        <button class="btn btn-secondary" disabled><i class="fas fa-trash"></i></button>
                    `;
                }
                row.innerHTML = `
                    <td>${admin.name}</td>
                    <td>${admin.email}</td>
                    <td>${admin.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur'}</td>
                    <td>${new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td>${actionButtons}</td>
                `;
                adminsTable.appendChild(row);
            });
        });
}

function showDeleteModal(email) {
    const currentUser = JSON.parse(localStorage.getItem('fadidiCurrentAdmin') || '{"role": "superadmin"}');
    if (currentUser.role !== 'superadmin') {
        showAlert('Seuls les super administrateurs peuvent supprimer des comptes.', 'error');
        return;
    }
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('modal-hidden');
    document.getElementById('confirm-delete').onclick = async function() {
        try {
            const admins = JSON.parse(localStorage.getItem('fadidiAdmins') || '[]');
            const admin = admins.find(a => a.email === email);
            if (!admin || !admin.id) throw new Error('ID admin introuvable');
            const response = await fetch(`http://localhost:3000/api/users/${admin.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const alertContainer = document.getElementById('alert-container');
                alertContainer.innerHTML = `<div class='alert alert-success' style='margin-bottom:10px;'>Administrateur supprimé avec succès.</div>`;
                setTimeout(() => { alertContainer.innerHTML = ''; }, 4000);
                const apiAdmins = await fetch('http://localhost:3000/api/users').then(r => r.json());
                localStorage.setItem('fadidiAdmins', JSON.stringify(apiAdmins));
                loadAdmins();
            } else {
                let errorMsg = 'Erreur lors de la suppression.';
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) errorMsg += ' ' + errorData.message;
                } catch {}
                showAlert(errorMsg, 'error');
            }
        } catch (err) {
            showAlert('Erreur inattendue : ' + err.message, 'error');
        }
        modal.style.display = 'none';
    };
}

function showEditModal(email) {
    const currentUser = JSON.parse(localStorage.getItem('fadidiCurrentAdmin') || '{"role": "superadmin"}');
    if (currentUser.role !== 'superadmin') {
        showAlert('Seuls les super administrateurs peuvent modifier des comptes.', 'error');
        return;
    }
    const modal = document.getElementById('edit-modal');
    const admins = JSON.parse(localStorage.getItem('fadidiAdmins') || '[]');
    const admin = admins.find(a => a.email === email);
    if (admin) {
        let fullName = '';
        if (admin.firstName || admin.lastName) {
            fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.trim();
        } else if (admin.name) {
            fullName = admin.name;
        }
        document.getElementById('edit-name').value = fullName;
        document.getElementById('edit-email').value = admin.email;
        document.getElementById('edit-role').value = admin.role;
        document.getElementById('edit-status').value = admin.isActive ? 'active' : 'inactive';
        modal.classList.remove('modal-hidden');
        document.getElementById('edit-admin-form').onsubmit = async function(e) {
            e.preventDefault();
            const resultDiv = document.getElementById('edit-admin-result');
            resultDiv.innerHTML = 'Modification en cours...';
            const nameValue = document.getElementById('edit-name').value.trim();
            let firstName = nameValue;
            let lastName = '';
            if (nameValue.includes(' ')) {
                const parts = nameValue.split(' ');
                firstName = parts[0];
                lastName = parts.slice(1).join(' ');
            }
            const role = document.getElementById('edit-role').value;
            const isActive = document.getElementById('edit-status').value === 'active';
            try {
                const response = await fetch(`http://localhost:3000/api/users/${admin.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, role, isActive })
                });
                if (response.ok) {
                    resultDiv.innerHTML = '<span style="color:green;">Modification enregistrée.</span>';
                    loadAdmins();
                    setTimeout(() => {
                        modal.classList.add('modal-hidden');
                        modal.style.display = '';
                        resultDiv.innerHTML = '';
                    }, 1000);
                } else {
                    let errorMsg = 'Erreur lors de la modification.';
                    try {
                        const errorData = await response.json();
                        if (errorData && errorData.message) errorMsg += ' ' + errorData.message;
                    } catch {}
                    resultDiv.innerHTML = `<span style="color:red;">${errorMsg}</span>`;
                }
            } catch (err) {
                resultDiv.innerHTML = `<span style="color:red;">Erreur inattendue : ${err.message}</span>`;
            }
        };
        document.getElementById('close-edit-admin').onclick = function() {
            modal.classList.add('modal-hidden');
            modal.style.display = '';
        };
        document.getElementById('cancel-edit-admin').onclick = function() {
            modal.classList.add('modal-hidden');
            modal.style.display = '';
        };
    }
}

function updateAdmin(email) {
    const currentUser = JSON.parse(localStorage.getItem('fadidiCurrentAdmin') || '{"role": "superadmin"}');
    if (currentUser.role !== 'superadmin') {
        showAlert('Seuls les super administrateurs peuvent modifier des comptes.', 'error');
        return;
    }
    const admins = JSON.parse(localStorage.getItem('fadidiAdmins') || '[]');
    const adminIndex = admins.findIndex(a => a.email === email);
    if (adminIndex !== -1) {
        admins[adminIndex].name = document.getElementById('edit-name').value.trim();
        admins[adminIndex].role = document.getElementById('edit-role').value;
        admins[adminIndex].status = document.getElementById('edit-status').value;
        localStorage.setItem('fadidiAdmins', JSON.stringify(admins));
        loadAdmins();
        showAlert('L\'administrateur a été mis à jour avec succès.', 'success');
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    alertContainer.appendChild(alert);
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        alert.style.transition = 'opacity 0.5s, transform 0.5s';
        setTimeout(() => { alert.remove(); }, 500);
    }, 5000);
}
// =========================
// COMMANDES HAUT DE GAME
// =========================
async function loadHautGameOrders() {
    document.getElementById('hautgame-orders-loading').style.display = '';
    document.getElementById('hautgame-orders-table').classList.add('table-hidden');
    try {
        const apiResponse = await apiRequest('/orders?source=haut-game');
        const hautGameOrders = (apiResponse && apiResponse.data) ? apiResponse.data : [];
        displayHautGameOrders(hautGameOrders);
        document.getElementById('hautgame-orders-loading').style.display = 'none';
        document.getElementById('hautgame-orders-table').classList.remove('table-hidden');
    } catch (error) {
        document.getElementById('hautgame-orders-loading').style.display = 'none';
        document.getElementById('hautgame-orders-tbody').innerHTML = '<tr><td colspan="6" style="text-align:center;color:#dc3545;">Erreur lors du chargement des commandes haut de game</td></tr>';
    }
}

function displayHautGameOrders(orders) {
    const tbody = document.getElementById('hautgame-orders-tbody');
    tbody.innerHTML = '';
    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Aucune commande haut de game trouvée.</td></tr>';
        return;
    }
    orders.forEach(order => {
        const orderDate = new Date(order.createdAt || order.orderDate).toLocaleDateString('fr-FR');
        const orderId = order.id || order.orderId;
        const customerName = order.customerName || order.customerInfo?.name || 'N/A';
        const totalAmount = order.total || order.totalAmount || 0;
        const orderStatus = order.status || 'pending';
        const productsPreview = generateProductsPreview(order);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-hautgame-order" value="${orderId}" onchange="updateSelectedHautGameOrders()"></td>
            <td>#${orderId}</td>
            <td>${customerName}</td>
            <td>${productsPreview}</td>
            <td>${Number(totalAmount).toLocaleString('fr-FR')} CFA</td>
            <td>${orderDate}</td>
            <td><span class="status-badge status-${orderStatus}">${getOrderStatusText(orderStatus)}</span></td>
            <td>
                <button class="btn btn-primary" onclick="viewHautGameOrderDetails('${orderId}')" title="Voir détails">
                    <i class="fas fa-eye"></i>
                </button>
                ${orderStatus === 'pending' || orderStatus === 'processing' ? `
                <button class="btn btn-success" onclick="updateHautGameOrderStatus('${orderId}', 'shipped')" title="Expédier">
                    <i class="fas fa-shipping-fast"></i>
                </button>
                ` : ''}
                ${orderStatus === 'shipped' ? `
                <button class="btn btn-warning" onclick="updateHautGameOrderStatus('${orderId}', 'delivered')" title="Marquer comme livré">
                    <i class="fas fa-check-circle"></i>
                </button>
                ` : ''}
                <button class="btn btn-danger btn-sm" onclick="deleteHautGameOrder('${orderId}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    updateSelectedHautGameOrders();
}

function updateSelectedHautGameOrders() {
    const checkboxes = document.querySelectorAll('.select-hautgame-order');
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    document.getElementById('selected-hautgame-orders-count').textContent = selected.length;
    const deleteBtn = document.getElementById('delete-selected-hautgame-orders');
    if (deleteBtn) {
        if (selected.length > 0) {
            deleteBtn.classList.remove('hidden');
        } else {
            deleteBtn.classList.add('hidden');
        }
    }
    document.getElementById('select-all-hautgame-orders').checked = selected.length === checkboxes.length && checkboxes.length > 0;
}

function toggleAllHautGameOrders(checked) {
    document.querySelectorAll('.select-hautgame-order').forEach(cb => { cb.checked = checked; });
    updateSelectedHautGameOrders();
}

async function deleteSelectedHautGameOrders() {
    const selected = Array.from(document.querySelectorAll('.select-hautgame-order:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    if (!confirm('Supprimer les commandes sélectionnées ?')) return;
    document.getElementById('delete-selected-hautgame-orders').disabled = true;
    try {
        for (const id of selected) {
            await fetch(`${API_BASE_URL}/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        loadHautGameOrders();
        showAlert('hautgame-orders-section', 'Commandes supprimées avec succès', 'success');
    } catch (e) {
        showAlert('hautgame-orders-section', 'Erreur lors de la suppression groupée', 'error');
    } finally {
        document.getElementById('delete-selected-hautgame-orders').disabled = false;
    }
}

async function updateHautGameOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
            showAlert('hautgame-orders-section', 'Statut mis à jour', 'success');
            loadHautGameOrders();
        } else {
            showAlert('hautgame-orders-section', 'Erreur lors de la mise à jour', 'error');
        }
    } catch (e) {
        showAlert('hautgame-orders-section', 'Erreur réseau', 'error');
    }
}

async function deleteHautGameOrder(orderId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            showAlert('hautgame-orders-section', 'Commande supprimée', 'success');
            loadHautGameOrders();
        } else {
            showAlert('hautgame-orders-section', 'Erreur lors de la suppression', 'error');
        }
    } catch (e) {
        showAlert('hautgame-orders-section', 'Erreur réseau', 'error');
    }
}

// Affichage du détail d'une commande haut de game (réutilise le modal existant)
function viewHautGameOrderDetails(orderId) {
    // On recharge la liste pour être sûr d'avoir la commande
    apiRequest('/orders?source=haut-game').then(apiResponse => {
        const orders = (apiResponse && apiResponse.data) ? apiResponse.data : [];
        const order = orders.find(o => (o.id || o.orderId) == orderId);
        if (order) {
            const customerName = order.customerName || order.customerInfo?.name || 'N/A';
            const customerPhone = order.customerPhone || order.customerInfo?.phone || 'N/A';
            const customerEmail = order.customerEmail || order.customerInfo?.email || 'N/A';
            const deliveryAddress = order.deliveryAddress || order.customerInfo?.address || 'N/A';
            const total = order.total || order.totalAmount || 0;
            const paymentMethod = order.paymentMethod || 'N/A';
            showOrderModal(order, orderId, customerName, customerPhone, customerEmail, deliveryAddress, total, paymentMethod);
        } else {
            alert('Commande non trouvée.');
        }
    });
}

// Charger automatiquement à l'ouverture de la section
document.addEventListener('DOMContentLoaded', function() {
    const hautGameMenu = document.querySelector('[data-section="hautgame-orders"]');
    if (hautGameMenu) {
        hautGameMenu.addEventListener('click', loadHautGameOrders);
    }
});
// --- Gestion Ajout Multiple de Produits ---
async function openMultiProductModal() {
    // Charger les catégories si vide ou forcer le refresh à chaque ouverture
    try {
        categories = await apiRequest('/categories');
    } catch (e) {
        categories = [];
    }
    document.getElementById('multi-product-modal').classList.remove('hidden');
    resetMultiProductForm();
    addMultiProductRow();
}

function closeMultiProductModal() {
    document.getElementById('multi-product-modal').classList.add('hidden');
    resetMultiProductForm();
}

function resetMultiProductForm() {
    document.getElementById('multi-products-tbody').innerHTML = '';
}

function addMultiProductRow() {
    const tbody = document.getElementById('multi-products-tbody');
    const row = document.createElement('tr');
    // Générer les options de catégorie
    let catOptions = '<option value="">Choisir...</option>';
    if (Array.isArray(categories) && categories.length > 0) {
        for (const cat of categories) {
            catOptions += `<option value="${cat.id}">${cat.name}</option>`;
        }
    }
    row.innerHTML = `
        <td><input type="text" class="form-control multi-name" required placeholder="Nom" style="width:140px; min-width:100px; padding:8px; font-size:15px;" /></td>
        <td><input type="text" class="form-control multi-desc" placeholder="Description" style="width:180px; min-width:120px; padding:8px; font-size:15px;" /></td>
        <td><input type="number" class="form-control multi-price" min="0" required placeholder="0" style="width:100px; min-width:70px; padding:8px; font-size:15px;" /></td>
        <td><input type="number" class="form-control multi-stock" min="0" value="0" placeholder="0" style="width:80px; min-width:60px; padding:8px; font-size:15px;" /></td>
        <td>
            <select class="form-control multi-category" style="width:120px; min-width:80px; padding:8px; font-size:15px;">
                ${catOptions}
            </select>
        </td>
        <td>
            <select class="form-control multi-status" style="width:110px; min-width:80px; padding:8px; font-size:15px;">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
            </select>
        </td>
        <td style="display:flex;align-items:center;gap:8px;">
            <input type="file" class="multi-image" accept="image/*" style="width:120px; min-width:90px;" >
            <img class="multi-image-preview" src="" alt="" style="display:none;width:38px;height:38px;object-fit:cover;border-radius:4px;border:1px solid #ccc;" />
        </td>
        <td><button type="button" class="btn btn-danger" onclick="removeMultiProductRow(this)" style="padding:8px 12px;"><i class="fas fa-trash"></i></button></td>
    `;
    // Ajout de l'écouteur pour l'aperçu image
    const fileInput = row.querySelector('.multi-image');
    const imgPreview = row.querySelector('.multi-image-preview');
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            imgPreview.src = '';
            imgPreview.style.display = 'none';
        }
    });
    tbody.appendChild(row);
}

function removeMultiProductRow(btn) {
    btn.closest('tr').remove();
}

async function saveMultiProducts() {
    const rows = document.querySelectorAll('#multi-products-tbody tr');
    if (rows.length === 0) {
        alert('Ajoutez au moins une ligne de produit.');
        return;
    }
    const products = [];
    const images = [];
    for (const row of rows) {
        const name = row.querySelector('.multi-name').value.trim();
        const description = row.querySelector('.multi-desc').value.trim();
        const price = row.querySelector('.multi-price').value.trim();
    const stock = row.querySelector('.multi-stock').value.trim() || '0';
    // Correction : forcer stock en nombre
    const stockNumber = parseInt(stock, 10) || 0;
    const categoryId = row.querySelector('.multi-category').value;
        const status = row.querySelector('.multi-status').value;
        const imageInput = row.querySelector('.multi-image');
        images.push(imageInput && imageInput.files && imageInput.files[0] ? imageInput.files[0] : null);
        if (!name || name.length < 2) {
            alert('Le nom de chaque produit doit contenir au moins 2 caractères.');
            return;
        }
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            alert('Le prix de chaque produit doit être un nombre supérieur à 0.');
            return;
        }
        products.push({
            name,
            description,
            price: parseFloat(price),
            stock: stockNumber,
            categoryId: categoryId || null,
            status
        });
    }
    // Afficher un indicateur de chargement
    const saveBtn = document.querySelector('#multi-product-modal .btn-success');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
    saveBtn.disabled = true;
    try {
        const response = await fetch(`${API_BASE_URL}/products/bulk`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products })
        });
        let addedCount = 0;
        let failedProducts = [];
        let imageErrors = [];
        if (response.ok) {
            const result = await response.json();
            // Vérifier le nombre d'IDs retournés
            if (!result.ids || !Array.isArray(result.ids)) {
                alert("Réponse API invalide : aucun ID retourné.");
            } else {
                for (let i = 0; i < products.length; i++) {
                    const productId = result.ids[i];
                    if (!productId) {
                        failedProducts.push(products[i].name);
                        continue;
                    }
                    // Upload image si présente
                    if (images[i]) {
                        const formData = new FormData();
                        formData.append('images', images[i]);
                        try {
                            const imgRes = await fetch(`${API_BASE_URL}/upload/images?productId=${productId}`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${authToken}`
                                },
                                body: formData
                            });
                            if (!imgRes.ok) {
                                imageErrors.push(products[i].name);
                            }
                        } catch (imgErr) {
                            imageErrors.push(products[i].name);
                        }
                    }
                    addedCount++;
                }
                let msg = `${addedCount} produit(s) ajouté(s) avec succès.`;
                if (failedProducts.length > 0) {
                    msg += `\nProduits non ajoutés : ${failedProducts.join(', ')}`;
                }
                if (imageErrors.length > 0) {
                    msg += `\nImages non uploadées pour : ${imageErrors.join(', ')}`;
                }
                alert(msg);
                closeMultiProductModal();
                loadProducts && loadProducts();
            }
        } else {
            let errorMsg = "Erreur lors de l'ajout des produits.";
            try {
                const err = await response.json();
                if (err && err.message) {
                    errorMsg += "\n" + (Array.isArray(err.message) ? err.message.join('\n') : err.message);
                }
            } catch(e) {}
            alert(errorMsg);
        }
    } catch (e) {
        alert('Erreur réseau ou serveur : ' + (e.message || e));
    }
    saveBtn.innerHTML = originalText;
    saveBtn.disabled = false;
}
// --- Fin Ajout Multiple ---
// Configuration de l'API
const API_BASE_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('admin_token');

// État global de l'application
let currentSection = 'dashboard';
let products = [];
let categories = [];
let orders = [];
let promotions = [];
let editingProductId = null;
let editingCategoryId = null;
let editingPromotionId = null;

// =========================
// FONCTIONS DE CALCUL DES REVENUS
// =========================

function calculateRevenue(orders) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay()); // Début de la semaine
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let total = 0;
    let daily = 0;
    let weekly = 0;
    let monthly = 0;

    // Récupérer la liste locale des commandes livrées supprimées
    let deletedDelivered = JSON.parse(localStorage.getItem('deletedDeliveredOrders') || '[]');
    let deletedDeliveredAmounts = JSON.parse(localStorage.getItem('deletedDeliveredAmounts') || '{}');

    orders.forEach(order => {
        // Si la commande est livrée et supprimée, elle peut ne plus être dans le tableau orders
        // On ignore ici, on traite plus bas
        if (order.deleted && order.status !== 'delivered') {
            return;
        }
        // Debug: Afficher toutes les commandes pour diagnostic
        if (order.id >= 16) {
            console.log('🔍 Debug commande récente:', {
                id: order.id,
                status: order.status,
                total: order.total,
                paymentMethod: order.paymentMethod,
                notes: order.deliveryNotes,
                date: new Date(order.createdAt).toLocaleDateString(),
                customerName: order.customerName
            });
        }

        // Compter les commandes payées/confirmées ET les ventes de promotion
        const isValidOrder = order.status === 'confirmed' ||
            order.status === 'paid' ||
            order.status === 'delivered' ||
            order.status === 'promotion-sale' ||
            (order.deliveryNotes && (
                order.deliveryNotes.includes('VENTE PROMOTION') ||
                order.deliveryNotes.includes('Produit en promotion') ||
                order.deliveryNotes.includes('Vente promotion') ||
                order.deliveryNotes.includes('promotion:') ||
                order.deliveryNotes.includes('Promo ID:')
            )) ||
            order.paymentMethod === 'promotion' ||
            (order.customerName && order.customerName.includes('Page Loum'));

        if (isValidOrder) {
            const orderDate = new Date(order.createdAt);
            const orderTotal = parseFloat(order.total) || 0;

            total += orderTotal;
            if (orderDate >= today) daily += orderTotal;
            if (orderDate >= thisWeekStart) weekly += orderTotal;
            if (orderDate >= thisMonthStart) monthly += orderTotal;
        }
    });

    // Ajouter les montants des commandes livrées supprimées qui ne sont plus dans orders
    deletedDelivered.forEach(orderId => {
        if (!orders.find(o => (o.id || o.orderId) == orderId)) {
            // Si le montant est stocké, on l'ajoute au CA
            const amount = deletedDeliveredAmounts[orderId];
            if (amount) {
                total += parseFloat(amount);
            }
        }
    });

    return {
        total,
        daily,
        weekly,
        monthly
    };
}

function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price || 0);
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Vérifier l'authentification
    if (!authToken) {
        showLoginModal();
        return;
    }

    // Initialiser les événements
    initializeEvents();
    
    // Charger les données initiales
    loadDashboardData();
    
    // Afficher la section tableau de bord par défaut
    showSection('dashboard');
}

function initializeEvents() {
    // Menu abonnés notifications
    document.querySelectorAll('.menu-item[data-section="subscribers"]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('subscribers');
            setActiveMenuItem(item);
            loadSubscribers();
        });
    });
    // Navigation du menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Ne pas intercepter le lien vers la boutique
            if (item.id === 'boutique-link') {
                return; // Laisser le comportement par défaut du lien
            }
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
            setActiveMenuItem(item);
        });
    });

    // Événements des formulaires
    document.getElementById('product-images').addEventListener('change', handleProductImages);
    document.getElementById('category-image').addEventListener('change', handleCategoryImage);
    document.getElementById('promotion-image').addEventListener('change', handlePromotionImage);
    
    // Déconnexion
    // Masquer la modale de déconnexion au chargement
    var logoutModal = document.getElementById('logout-modal');
    if (logoutModal) logoutModal.classList.add('logout-modal-hidden');

    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        var modal = document.getElementById('logout-modal');
        if (modal) modal.classList.remove('logout-modal-hidden');
    });
    // Gestion modale déconnexion
    const closeLogout = document.getElementById('close-logout-modal');
    const cancelLogout = document.getElementById('cancel-logout');
    const confirmLogout = document.getElementById('confirm-logout');
    if (closeLogout) closeLogout.onclick = function() {
        var modal = document.getElementById('logout-modal');
        if (modal) modal.classList.add('logout-modal-hidden');
    };
    if (cancelLogout) cancelLogout.onclick = function() {
        var modal = document.getElementById('logout-modal');
        if (modal) modal.classList.add('logout-modal-hidden');
    };
    if (confirmLogout) confirmLogout.onclick = function() { logout(); };

    // Événements des modals
    initializeModalEvents();
}

function initializeModalEvents() {
    // Fermeture des modals en cliquant sur l'arrière-plan
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Événements des formulaires
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }

    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCategory();
        });
    }
}

function closeAllModals() {
    document.getElementById('product-modal').classList.add('hidden');
    document.getElementById('category-modal').classList.add('hidden');
    resetProductForm();
    resetCategoryForm();
    editingProductId = null;
    editingCategoryId = null;
}

// =========================
// GESTION DE L'AUTHENTIFICATION
// =========================

function showLoginModal() {
    const loginModal = `
        <div id="login-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Connexion Admin</h3>
                </div>
                
                <form id="login-form" class="form-grid">
                    <div id="login-alert"></div>
                    
                    <div class="form-group">
                        <label for="login-email">Email</label>
                        <input type="email" id="login-email" class="form-control" required value="admin@fadidi.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="login-password">Mot de passe</label>
                        <input type="password" id="login-password" class="form-control" required value="Admin123!">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Se connecter
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loginModal);
    
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            authToken = data.access_token;
            localStorage.setItem('admin_token', authToken);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            // Synchronise fadidiCurrentAdmin avec l'objet complet du user (depuis l'API)
            localStorage.setItem('fadidiCurrentAdmin', JSON.stringify(data.user));
            document.getElementById('login-modal').remove();
            initializeApp();
        } else {
            showAlert('login-alert', 'Identifiants incorrects', 'error');
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('login-alert', 'Erreur de connexion au serveur', 'error');
    }
}

function logout() {
    // Suppression de la confirmation native, la modale personnalisée gère la validation
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('fadidiCurrentAdmin');
    window.location.reload();
}

// =========================
// NAVIGATION ET UI
// =========================

function showSection(sectionName) {
    // Masquer toutes les sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Afficher la section demandée
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.remove('hidden');
        currentSection = sectionName;
        
        // Charger les données de la section
        loadSectionData(sectionName);
    }
}

function setActiveMenuItem(activeItem) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'feedbacks':
            loadFeedbacks();
            break;
        case 'promotions':
            loadPromotions();
            break;
        case 'floating-ads':
            if (typeof loadFloatingAds === 'function') {
                loadFloatingAds();
            }
            break;
        case 'header-banners':
            if (typeof loadHeaderBanners === 'function') {
                loadHeaderBanners();
            }
            break;
    }
}

// =========================
// GESTION DES DONNÉES DU TABLEAU DE BORD
// =========================

async function loadDashboardData() {
    try {
        console.log('🔄 Rechargement complet des statistiques du dashboard...');
        
        // Charger les statistiques depuis l'API NestJS
        const [productsStats, categoriesCount, ordersData, promotionsData, subscribers] = await Promise.all([
            apiRequest('/products/stats'),
            apiRequest('/categories').then(cats => cats.length),
            apiRequest('/orders').catch(() => ({ data: getOrdersFromLocalStorage() })),
            apiRequest('/promotions').catch(() => []),
            fetch('http://localhost:3000/api/subscribers').then(r => r.ok ? r.json() : []).catch(() => [])
        ]);
        
        // Mettre à jour les promotions globales pour findProductImage
        if (Array.isArray(promotionsData)) {
            promotions = promotionsData;
        }
        
        // Mettre à jour les statistiques
        let ordersArray = ordersData.data || ordersData || [];
        // Réintégrer les commandes livrées supprimées locales
        let deletedDelivered = JSON.parse(localStorage.getItem('deletedDeliveredOrders') || '[]');
        let missingDelivered = [];
        deletedDelivered.forEach(id => {
            if (!ordersArray.some(o => (o.id || o.orderId) == id)) {
                // Chercher dans le localStorage si la commande existe
                let localOrders = JSON.parse(localStorage.getItem('fadidiOrders') || '[]');
                let found = localOrders.find(o => (o.id || o.orderId) == id && o.status === 'delivered');
                if (found) missingDelivered.push(found);
            }
        });
        ordersArray = ordersArray.concat(missingDelivered);
        // Calculer les chiffres d'affaires
        const revenue = calculateRevenue(ordersArray);
        
    document.getElementById('stat-products').textContent = productsStats.total || 0;
    document.getElementById('stat-categories').textContent = categoriesCount || 0;
    document.getElementById('stat-orders').textContent = ordersArray.length || 0;
    document.getElementById('stat-revenue').textContent = formatPrice(revenue.total) + ' CFA';
    document.getElementById('stat-subscribers').textContent = Array.isArray(subscribers) ? subscribers.length : 0;
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Valeurs par défaut en cas d'erreur
        document.getElementById('stat-products').textContent = '0';
        document.getElementById('stat-categories').textContent = '0';
        document.getElementById('stat-orders').textContent = '0';
        document.getElementById('stat-revenue').textContent = '0 CFA';
    }
}



// Fonction pour utiliser les revenus sauvegardés au chargement
function loadSavedRevenue() {
    try {
        const saved = localStorage.getItem('fadidi_revenue');
        if (saved) {
            const revenue = JSON.parse(saved);
            document.getElementById('stat-revenue').textContent = formatPrice(revenue.total) + ' CFA';
            console.log('💾 Revenus chargés depuis localStorage:', revenue);
            return true;
        }
    } catch (error) {
        console.log('⚠️ Impossible de charger les revenus sauvegardés');
    }
    return false;
}

// =========================
// GESTION DES PRODUITS
// =========================

async function loadProducts() {
    showLoading('products-loading');
    hideTable('products-table');
    
    try {
        products = await apiRequest('/products');
        await loadCategoriesForSelect(); // Charger les catégories pour le formulaire
        displayProducts();
        hideLoading('products-loading');
        showTable('products-table');
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        hideLoading('products-loading');
        showAlert('main-content', 'Erreur lors du chargement des produits', 'error');
    }
}

function displayProducts() {
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-product" value="${product.id}" onchange="updateSelectedProducts()"></td>
            <td>
                <img src="${getProductImage(product)}" alt="${product.name}" onerror="this.src='${API_BASE_URL.replace('/api', '')}/placeholder.svg'">
            </td>
            <td>${product.name}</td>
            <td>${Number(product.price).toLocaleString('fr-FR')} CFA</td>
            <td>${product.stock || 0}</td>
            <td>
                <span class="status-badge status-${product.status}">
                    ${getStatusText(product.status)}
                </span>
            </td>
            <td>
                <button class="btn btn-primary" onclick="editProduct('${product.id}')" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteProduct('${product.id}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    updateSelectedProducts();
}

function updateSelectedProducts() {
    const checkboxes = document.querySelectorAll('.select-product');
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    document.getElementById('selected-products-count').textContent = selected.length;
    const delBtn = document.getElementById('delete-selected-products');
    if (delBtn) {
        if (selected.length > 0) {
            delBtn.classList.remove('hide-by-default');
        } else {
            delBtn.classList.add('hide-by-default');
        }
    }
    document.getElementById('select-all-products').checked = selected.length === checkboxes.length && checkboxes.length > 0;
}

function toggleAllProducts(checked) {
    document.querySelectorAll('.select-product').forEach(cb => { cb.checked = checked; });
    updateSelectedProducts();
}

async function deleteSelectedProducts() {
    const selected = Array.from(document.querySelectorAll('.select-product:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    if (!confirm('Supprimer les produits sélectionnés ?')) return;
    document.getElementById('delete-selected-products').disabled = true;
    try {
        for (const id of selected) {
            await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        loadProducts();
        showAlert('main-content', 'Produits supprimés avec succès', 'success');
        await syncWithBoutique();
    } catch (e) {
        showAlert('main-content', 'Erreur lors de la suppression groupée', 'error');
    } finally {
        document.getElementById('delete-selected-products').disabled = false;
    }
}

function getProductImage(product) {
    if (product.images && product.images.length > 0) {
        return `${API_BASE_URL.replace('/api', '')}/uploads/${product.images[0]}`;
    }
    return `${API_BASE_URL.replace('/api', '')}/placeholder.svg`;
}

function getPromotionImageUrl(imageUrl) {
    if (!imageUrl) {
        return `${API_BASE_URL.replace('/api', '')}/placeholder.svg`;
    }
    
    // Si l'URL commence déjà par http, la retourner telle quelle
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // Si l'URL commence par /uploads, construire l'URL complète
    if (imageUrl.startsWith('/uploads')) {
        return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
    }
    
    // Sinon, supposer que c'est juste le nom de fichier
    return `${API_BASE_URL.replace('/api', '')}/uploads/${imageUrl}`;
}

function getStatusText(status) {
    const statusMap = {
        'draft': 'Brouillon',
        'published': 'Publié',
        'archived': 'Archivé'
    };
    return statusMap[status] || status;
}

// =========================
// MODAL PRODUIT
// =========================

function openProductModal(productId = null) {
    editingProductId = productId;
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        fillProductForm(product);
        document.getElementById('product-modal-title').textContent = 'Modifier le produit';
    } else {
        resetProductForm();
        document.getElementById('product-modal-title').textContent = 'Ajouter un produit';
    }
    
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    resetProductForm();
    editingProductId = null;
}

function resetProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('image-preview').innerHTML = '';
}

function fillProductForm(product) {
    document.getElementById('product-name').value = product.name || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-price').value = product.price || '';
    document.getElementById('product-stock').value = product.stock || 0;
    document.getElementById('product-category').value = product.categoryId || '';
    document.getElementById('product-status').value = product.status || 'draft';
    
    // Afficher les images existantes
    if (product.images && product.images.length > 0) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = '';
        product.images.forEach(image => {
            const img = document.createElement('img');
            img.src = `${API_BASE_URL.replace('/api', '')}/uploads/${image}`;
            img.alt = product.name;
            preview.appendChild(img);
        });
    }
}

async function saveProduct() {
    // Validation côté client
    const productName = document.getElementById('product-name').value?.trim();
    const productDescription = document.getElementById('product-description').value?.trim() || '';
    const productPrice = document.getElementById('product-price').value?.trim();
    const productStock = document.getElementById('product-stock').value?.trim() || '0';
    const categoryId = document.getElementById('product-category').value?.trim() || '';
    const status = document.getElementById('product-status').value?.trim() || 'draft';
    
    if (!productName || productName.length === 0) {
        alert('Le nom du produit est requis et ne peut pas être vide');
        return;
    }

    if (productName.length < 2) {
        alert('Le nom du produit doit contenir au moins 2 caractères');
        return;
    }
    
    if (!productPrice || isNaN(parseFloat(productPrice)) || parseFloat(productPrice) <= 0) {
        alert('Le prix doit être un nombre supérieur à 0');
        return;
    }

    // Afficher un indicateur de chargement
    const saveButton = document.querySelector('#product-modal .btn-primary');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
    saveButton.disabled = true;

    try {
        // Préparer les données au format JSON
        const productData = {
            name: String(productName),
            description: String(productDescription),
            price: parseFloat(productPrice),
            stock: parseInt(productStock, 10) || 0,
            categoryId: categoryId || null,
            status: String(status)
        };

        console.log('Données produit à envoyer:', productData);
        
        let response;
        let productId = editingProductId;
        
        if (editingProductId) {
            response = await fetch(`${API_BASE_URL}/products/${editingProductId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (response.ok) {
            const result = await response.json();
            productId = result.id || productId;
            
            // Gérer l'upload des images si elles existent
            const imageFiles = document.getElementById('product-images').files;
            if (imageFiles && imageFiles.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < imageFiles.length; i++) {
                    formData.append('images', imageFiles[i]);
                }
                
                const uploadResponse = await fetch(`${API_BASE_URL}/upload/images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: formData
                });
                
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    console.log('Upload result:', uploadResult);
                    
                    // Extraire les noms de fichiers des URLs
                    const imageFilenames = uploadResult.files.map(file => file.filename);
                    console.log('Image filenames:', imageFilenames);
                    
                    // Mettre à jour le produit avec les noms des fichiers
                    await fetch(`${API_BASE_URL}/products/${productId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ images: imageFilenames })
                    });
                }
            }
            
            closeProductModal();
            loadProducts();
            alert('Produit enregistré avec succès !');
            
            // Synchroniser avec la boutique FADIDI
            await syncWithBoutique();
        } else {
            let errorMessage = 'Erreur lors de l\'enregistrement';
            try {
                const error = await response.json();
                console.error('Erreur API complète:', error);
                console.error('Status:', response.status, 'StatusText:', response.statusText);
                
                // Gérer les différents types d'erreurs
                if (error.message) {
                    if (typeof error.message === 'string') {
                        if (error.message.includes('name') || error.message.includes('Name must be a string')) {
                            errorMessage = 'Le nom du produit doit être une chaîne de caractères valide.';
                        } else if (error.message.includes('price')) {
                            errorMessage = 'Le prix du produit est invalide.';
                        } else if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                            errorMessage = 'Un produit avec ce nom existe déjà.';
                        } else if (error.message.includes('validation')) {
                            errorMessage = 'Données de validation incorrectes. Vérifiez vos informations.';
                        } else {
                            errorMessage = error.message;
                        }
                    } else if (Array.isArray(error.message)) {
                        errorMessage = error.message.join(', ');
                    }
                } else if (error.errors && Array.isArray(error.errors)) {
                    errorMessage = error.errors.map(err => err.message || err).join(', ');
                } else if (error.statusCode && error.error) {
                    errorMessage = `${error.error}: ${error.message || 'Erreur inconnue'}`;
                }
            } catch (parseError) {
                console.error('Erreur lors du parsing de la réponse:', parseError);
                errorMessage = `Erreur ${response.status}: ${response.statusText || 'Erreur de communication avec le serveur'}`;
            }
            
            console.error('Message d\'erreur final:', errorMessage);
            alert('Erreur: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur. Vérifiez que l\'API est démarrée.');
    } finally {
        // Restaurer le bouton
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    }
}

function editProduct(productId) {
    openProductModal(productId);
}

async function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }
    
    console.log('Tentative de suppression du produit:', productId);
    
    // Afficher un indicateur de chargement
    const deleteButton = document.querySelector(`button[onclick="deleteProduct('${productId}')"]`);
    const originalHtml = deleteButton?.innerHTML;
    if (deleteButton) {
        deleteButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        deleteButton.disabled = true;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        
        console.log('Réponse suppression produit:', response.status, response.statusText);
        
        if (response.ok) {
            console.log('Produit supprimé avec succès');
            loadProducts();
            showAlert('main-content', 'Produit supprimé avec succès', 'success');
            
            // Synchroniser avec la boutique FADIDI
            await syncWithBoutique();
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erreur API suppression produit:', errorData);
            showAlert('main-content', `Erreur lors de la suppression: ${errorData.message || 'Erreur inconnue'}`, 'error');
        }
    } catch (error) {
        console.error('Erreur réseau suppression produit:', error);
        showAlert('main-content', `Erreur de connexion: ${error.message}`, 'error');
    } finally {
        // Restaurer le bouton
        if (deleteButton) {
            deleteButton.innerHTML = originalHtml;
            deleteButton.disabled = false;
        }
    }
}

// =========================
// GESTION DES CATÉGORIES
// =========================

async function loadCategories() {
    showLoading('categories-loading');
    hideTable('categories-table');
    
    try {
        categories = await apiRequest('/categories');
        displayCategories();
        hideLoading('categories-loading');
        showTable('categories-table');
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        hideLoading('categories-loading');
        showAlert('main-content', 'Erreur lors du chargement des catégories', 'error');
    }
}

async function loadCategoriesForSelect() {
    try {
        const cats = await apiRequest('/categories');
        const select = document.getElementById('product-category');
        select.innerHTML = '<option value="">Aucune catégorie</option>';
        
        cats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

function displayCategories() {
    const tbody = document.getElementById('categories-tbody');
    tbody.innerHTML = '';
    
    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-category" value="${category.id}" onchange="updateSelectedCategories()"></td>
            <td>
                <img src="${getCategoryImage(category)}" alt="${category.name}" onerror="this.src='${API_BASE_URL.replace('/api', '')}/placeholder.svg'">
            </td>
            <td>${category.name}</td>
            <td>${category.description || '-'} </td>
            <td>${category.products?.length || 0}</td>
            <td>
                <button class="btn btn-primary" onclick="editCategory('${category.id}')" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteCategory('${category.id}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    updateSelectedCategories();
}

function updateSelectedCategories() {
    const checkboxes = document.querySelectorAll('.select-category');
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    document.getElementById('selected-categories-count').textContent = selected.length;
    const delBtn = document.getElementById('delete-selected-categories');
    if (delBtn) {
        if (selected.length > 0) {
            delBtn.classList.remove('hide-by-default');
        } else {
            delBtn.classList.add('hide-by-default');
        }
    }
    document.getElementById('select-all-categories').checked = selected.length === checkboxes.length && checkboxes.length > 0;
}

function toggleAllCategories(checked) {
    document.querySelectorAll('.select-category').forEach(cb => { cb.checked = checked; });
    updateSelectedCategories();
}

async function deleteSelectedCategories() {
    const selected = Array.from(document.querySelectorAll('.select-category:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    if (!confirm('Supprimer les catégories sélectionnées ?')) return;
    document.getElementById('delete-selected-categories').disabled = true;
    try {
        for (const id of selected) {
            await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        await loadCategories();
        showAlert('main-content', 'Catégories supprimées avec succès', 'success');
    } catch (e) {
        showAlert('main-content', 'Erreur lors de la suppression groupée', 'error');
    } finally {
        document.getElementById('delete-selected-categories').disabled = false;
    }
}

function getCategoryImage(category) {
    if (category.image) {
        return `${API_BASE_URL.replace('/api', '')}/uploads/${category.image}`;
    }
    return `${API_BASE_URL.replace('/api', '')}/placeholder.svg`;
}

// =========================
// MODAL CATÉGORIE
// =========================

function openCategoryModal(categoryId = null) {
    editingCategoryId = categoryId;
    
    if (categoryId) {
        const category = categories.find(c => c.id === categoryId);
        fillCategoryForm(category);
        document.getElementById('category-modal-title').textContent = 'Modifier la catégorie';
    } else {
        resetCategoryForm();
        document.getElementById('category-modal-title').textContent = 'Ajouter une catégorie';
    }
    
    document.getElementById('category-modal').classList.remove('hidden');
}

function closeCategoryModal() {
    document.getElementById('category-modal').classList.add('hidden');
    resetCategoryForm();
    editingCategoryId = null;
}

function resetCategoryForm() {
    document.getElementById('category-form').reset();
    document.getElementById('category-image-preview').innerHTML = '';
}

function fillCategoryForm(category) {
    document.getElementById('category-name').value = category.name || '';
    document.getElementById('category-description').value = category.description || '';
    
    if (category.image) {
        const preview = document.getElementById('category-image-preview');
        preview.innerHTML = '';
        const img = document.createElement('img');
        img.src = getCategoryImage(category);
        img.alt = category.name;
        preview.appendChild(img);
    }
}

async function saveCategory() {
    // Validation côté client
    const categoryName = document.getElementById('category-name').value?.trim();
    const categoryDescription = document.getElementById('category-description').value?.trim() || '';
    
    if (!categoryName || categoryName.length === 0) {
        alert('Le nom de la catégorie est requis et ne peut pas être vide');
        return;
    }

    if (categoryName.length < 2) {
        alert('Le nom de la catégorie doit contenir au moins 2 caractères');
        return;
    }

    // Afficher un indicateur de chargement
    const saveButton = document.querySelector('#category-modal .btn-primary');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
    saveButton.disabled = true;

    try {
        // Préparer les données au format JSON
        const categoryData = {
            name: String(categoryName),
            description: String(categoryDescription)
        };

        console.log('Données à envoyer:', categoryData);
        
        let response;
        if (editingCategoryId) {
            response = await fetch(`${API_BASE_URL}/categories/${editingCategoryId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });
        }
        
        if (response.ok) {
            const result = await response.json();
            let categoryId = result.id || editingCategoryId;
            
            // Gérer l'upload de l'image si elle existe
            const imageFile = document.getElementById('category-image').files[0];
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                
                const uploadResponse = await fetch(`${API_BASE_URL}/upload/image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: formData
                });
                
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    console.log('Category upload result:', uploadResult);
                    
                    // Mettre à jour la catégorie avec le nom du fichier
                    await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: uploadResult.filename })
                    });
                }
            }
            
            closeCategoryModal();
            loadCategories();
            loadDashboardData(); // Recharger les statistiques
            alert('Catégorie enregistrée avec succès !');
        } else {
            let errorMessage = 'Erreur lors de l\'enregistrement';
            try {
                const error = await response.json();
                console.error('Erreur API complète:', error);
                console.error('Status:', response.status, 'StatusText:', response.statusText);
                
                // Gérer les différents types d'erreurs
                if (error.message) {
                    if (typeof error.message === 'string') {
                        if (error.message.includes('name') || error.message.includes('Name must be a string')) {
                            errorMessage = 'Le nom de la catégorie doit être une chaîne de caractères valide.';
                        } else if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                            errorMessage = 'Une catégorie avec ce nom existe déjà.';
                        } else if (error.message.includes('validation')) {
                            errorMessage = 'Données de validation incorrectes. Vérifiez vos informations.';
                        } else {
                            errorMessage = error.message;
                        }
                    } else if (Array.isArray(error.message)) {
                        errorMessage = error.message.join(', ');
                    }
                } else if (error.errors && Array.isArray(error.errors)) {
                    errorMessage = error.errors.map(err => err.message || err).join(', ');
                } else if (error.statusCode && error.error) {
                    errorMessage = `${error.error}: ${error.message || 'Erreur inconnue'}`;
                }
            } catch (parseError) {
                console.error('Erreur lors du parsing de la réponse:', parseError);
                errorMessage = `Erreur ${response.status}: ${response.statusText || 'Erreur de communication avec le serveur'}`;
            }
            
            console.error('Message d\'erreur final:', errorMessage);
            alert('Erreur: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur. Vérifiez que l\'API est démarrée et que l\'URL est correcte.');
    } finally {
        // Restaurer le bouton
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    }
}

function editCategory(categoryId) {
    openCategoryModal(categoryId);
}

async function deleteCategory(categoryId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        return;
    }
    
    // Afficher un indicateur de chargement
    const deleteButton = document.querySelector(`button[onclick="deleteCategory('${categoryId}')"]`);
    const originalHtml = deleteButton?.innerHTML;
    if (deleteButton) {
        deleteButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        deleteButton.disabled = true;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            // Recharger les données
            await loadCategories();
            await loadDashboardData();
            showAlert('main-content', 'Catégorie supprimée avec succès', 'success');
        } else {
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
            }
            
            const errorMessage = errorData?.message || errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
            showAlert('main-content', `Erreur lors de la suppression: ${errorMessage}`, 'error');
        }
    } catch (error) {
        console.error('Erreur suppression catégorie:', error);
        showAlert('main-content', `Erreur de connexion: ${error.message}`, 'error');
    } finally {
        // Restaurer le bouton
        if (deleteButton) {
            deleteButton.innerHTML = originalHtml;
            deleteButton.disabled = false;
        }
    }
}

// =========================
// GESTION DES COMMANDES
// =========================

async function loadOrders() {
    showLoading('orders-loading');
    hideTable('orders-table');
    
    try {
        // Charger les commandes depuis l'API (nouveau système)
        const apiResponse = await apiRequest('/orders');
        if (apiResponse && apiResponse.data) {
            orders = apiResponse.data;
        } else {
            orders = [];
        }
        displayOrders();
        hideLoading('orders-loading');
        showTable('orders-table');
    } catch (error) {
        console.error('Erreur lors du chargement des commandes depuis l\'API:', error);
        // Fallback vers localStorage si l'API n'est pas disponible
        try {
            orders = getOrdersFromLocalStorage();
            displayOrders();
            hideLoading('orders-loading');
            showTable('orders-table');
            showAlert('main-content', 'Commandes chargées depuis le cache local (API indisponible)', 'warning');
        } catch (localError) {
            console.error('Erreur lors du chargement depuis localStorage:', localError);
            hideLoading('orders-loading');
            showAlert('main-content', 'Erreur lors du chargement des commandes', 'error');
        }
    }
}

function getOrdersFromLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem('fadidiOrders')) || [];
    } catch (error) {
        console.error('Erreur lors de la lecture des commandes:', error);
        return [];
    }
}

// Variable globale pour les commandes filtrées
let filteredOrders = [];

function displayOrders() {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';
    
    // Utiliser les commandes filtrées s'il y en a, sinon toutes les commandes
    const ordersToShow = filteredOrders.length > 0 ? filteredOrders : orders;
    
    ordersToShow.forEach(order => {
        const row = document.createElement('tr');
        // Adapter au nouveau format API
        const orderDate = new Date(order.createdAt || order.orderDate).toLocaleDateString('fr-FR');
        const orderId = order.id || order.orderId;
        const customerName = order.customerName || order.customerInfo?.name || 'N/A';
        const totalAmount = order.total || order.totalAmount || 0;
        const orderStatus = order.status || 'pending';
        
        // Générer l'aperçu des produits
        const productsPreview = generateProductsPreview(order);
        
        // Ajouter une classe pour identifier les commandes traitées (livrées, expédiées)
        const isProcessed = orderStatus === 'delivered' || orderStatus === 'shipped';
        const rowClass = isProcessed ? 'processed-order' : '';
        
        row.className = rowClass;
        row.innerHTML = `
            <td>
                <input type="checkbox" class="order-checkbox" data-order-id="${orderId}" onchange="updateSelectedCount()">
            </td>
            <td>#${orderId}</td>
            <td>${customerName}</td>
            <td>${productsPreview}</td>
            <td>${Number(totalAmount).toLocaleString('fr-FR')} CFA</td>
            <td>${orderDate}</td>
            <td>
                <span class="status-badge status-${orderStatus}">
                    ${getOrderStatusText(orderStatus)}
                </span>
            </td>
            <td>
                <button class="btn btn-primary" onclick="viewOrderDetails('${orderId}')" title="Voir détails">
                    <i class="fas fa-eye"></i>
                </button>
                ${orderStatus === 'pending' || orderStatus === 'processing' ? `
                <button class="btn btn-success" onclick="updateOrderStatus('${orderId}', 'shipped')" title="Expédier">
                    <i class="fas fa-shipping-fast"></i>
                </button>
                ` : ''}
                ${orderStatus === 'shipped' ? `
                <button class="btn btn-warning" onclick="updateOrderStatus('${orderId}', 'delivered')" title="Marquer comme livré">
                    <i class="fas fa-check-circle"></i>
                </button>
                ` : ''}
                ${isProcessed ? `
                <button class="btn btn-danger btn-sm" onclick="deleteOrder('${orderId}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Réinitialiser les sélections
    setTimeout(updateSelectedCount, 0);
}

function generateProductsPreview(order) {
    let items = [];
    
    // Parser les items selon leur format
    if (order.items) {
        if (typeof order.items === 'string') {
            try {
                items = JSON.parse(order.items);
            } catch (e) {
                return '<span style="color: #dc3545;">Erreur</span>';
            }
        } else if (Array.isArray(order.items)) {
            items = order.items;
        }
    }
    
    if (!items.length) {
        return '<span style="color: #6c757d;">Aucun produit</span>';
    }
    
    // Limiter à 3 premiers produits pour l'aperçu
    const previewItems = items.slice(0, 3);
    const remainingCount = Math.max(0, items.length - 3);
    
    const imagesHTML = previewItems.map(item => {
        const productImage = item.image || findProductImage(item.name, item.price);
        const quantity = item.quantity || 1;
        
        return `
            <div style="display: inline-block; position: relative; margin: 0 2px;">
                <img src="${productImage}" 
                     alt="${item.name}" 
                     title="${item.name} (x${quantity})"
                     style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;"
                     onerror="this.src='../assets/images/1-.png'">
                ${quantity > 1 ? `<span style="position: absolute; top: -5px; right: -5px; background: #ff8c00; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${quantity}</span>` : ''}
            </div>
        `;
    }).join('');
    
    const moreText = remainingCount > 0 ? `<span style="color: #6c757d; font-size: 12px;">+${remainingCount} autre${remainingCount > 1 ? 's' : ''}</span>` : '';
    
    return `
        <div style="display: flex; align-items: center; gap: 5px;">
            ${imagesHTML}
            ${moreText}
        </div>
    `;
}

function getOrderStatusText(status) {
    const statusMap = {
        'pending': 'En attente',
        'processing': 'En cours',
        'shipped': 'Expédié',
        'delivered': 'Livré',
        'cancelled': 'Annulé'
    };
    return statusMap[status] || status;
}

async function viewOrderDetails(orderId) {
    console.log('🔍 Recherche commande ID:', orderId);

    // Normaliser l'ID (accepter des strings comme "#3" ou des nombres)
    const parsedId = Number(String(orderId).replace(/\D/g, ''));
    if (!parsedId) {
        console.error('❌ ID commande invalide:', orderId);
        alert('ID de commande invalide');
        return;
    }

    console.log('📋 Commandes disponibles (local):', (orders || []).length);

    // Chercher localement dans les commandes chargées
    let order = (orders || []).find(o => Number(o.id || o.orderId) === parsedId);

    // Si on ne trouve pas, chercher dans les retours (qui contiennent des commandes avec deliveryNotes)
    if (!order && (allFeedbacks || []).length) {
        order = allFeedbacks.find(o => Number(o.id || o.orderId) === parsedId);
    }

    // Si toujours pas trouvé, tenter de récupérer depuis l'API
    if (!order) {
        console.log('🔔 Commande non trouvée localement, requête à l\'API...', parsedId);
        try {
            const res = await fetch(`${API_BASE_URL}/orders/${parsedId}`);
            const result = await res.json();
            if (result && result.success && result.data) {
                order = result.data;
            }
        } catch (err) {
            console.error('Erreur lors de la récupération de la commande:', err);
        }
    }

    if (order) {
        // Adapter au nouveau format API
        const customerName = order.customerName || order.customerInfo?.name || 'N/A';
        const customerPhone = order.customerPhone || order.customerInfo?.phone || 'N/A';
        const customerEmail = order.customerEmail || order.customerInfo?.email || 'N/A';
        const deliveryAddress = order.deliveryAddress || order.customerInfo?.address || 'N/A';
        const total = order.total || order.totalAmount || 0;
        const paymentMethod = order.paymentMethod || 'N/A';

        showOrderModal(order, parsedId, customerName, customerPhone, customerEmail, deliveryAddress, total, paymentMethod);
    } else {
        console.error('❌ Commande non trouvée pour ID:', parsedId);
        alert(`Commande #${parsedId} non trouvée. Essayez de recharger la page.`);
    }
}

function showOrderModal(order, orderId, customerName, customerPhone, customerEmail, deliveryAddress, total, paymentMethod) {
    // Créer le modal avec les images des produits
    const modalHTML = `
        <div id="order-details-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>Détails de la commande #${orderId}</h3>
                    <button class="close-btn" onclick="closeOrderModal()">&times;</button>
                </div>
                
                <div class="order-details-content" style="padding: 20px;">
                    <!-- Informations client -->
                    <div class="order-section">
                        <h4 style="color: #ff8c00; margin-bottom: 10px;">👤 Informations Client</h4>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p><strong>Nom:</strong> ${customerName}</p>
                            <p><strong>Téléphone:</strong> ${customerPhone}</p>
                            <p><strong>Email:</strong> ${customerEmail}</p>
                            <p><strong>Adresse:</strong> ${deliveryAddress}</p>
                        </div>
                    </div>
                    
                    <!-- Informations de paiement -->
                    <div class="order-section">
                        <h4 style="color: #ff8c00; margin-bottom: 10px;">💳 Paiement</h4>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p><strong>Méthode:</strong> ${paymentMethod}</p>
                            <p><strong>Total:</strong> <span style="color: #28a745; font-weight: bold;">${Number(total).toLocaleString('fr-FR')} CFA</span></p>
                        </div>
                    </div>
                    
                    <!-- Articles commandés avec images -->
                    <div class="order-section">
                        <h4 style="color: #ff8c00; margin-bottom: 10px;">🛒 Articles Commandés</h4>
                        <div id="order-items-container">
                            ${generateOrderItemsHTML(order)}
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer" style="padding: 15px; border-top: 1px solid #dee2e6; text-align: right;">
                    <button class="btn btn-primary" onclick="closeOrderModal()">Fermer</button>
                </div>
            </div>
        </div>
    `;
    
    // Injecter le modal dans le body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function generateOrderItemsHTML(order) {
    let itemsHTML = '<div style="color: #6c757d;">Aucun article</div>';
    
    if (order.items) {
        let items = [];
        
        // Parser les items selon leur format
        if (typeof order.items === 'string') {
            try {
                items = JSON.parse(order.items);
            } catch (e) {
                return '<div style="color: #dc3545;">Erreur lors du chargement des articles</div>';
            }
        } else if (Array.isArray(order.items)) {
            items = order.items;
        }
        
        if (items.length > 0) {
            itemsHTML = items.map(item => {
                const itemName = item.name || 'Produit sans nom';
                const itemPrice = Number(item.price || 0);
                const itemQuantity = item.quantity || 1;
                const itemTotal = itemPrice * itemQuantity;
                
                // Trouver l'image du produit - d'abord vérifier si elle est dans l'item
                const productImage = item.image || findProductImage(itemName, itemPrice);
                
                return `
                    <div style="display: flex; align-items: center; padding: 15px; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 10px; background: white;">
                        <div style="flex-shrink: 0; margin-right: 15px;">
                            <img src="${productImage}" 
                                 alt="${itemName}" 
                                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid #ff8c00;"
                                 onerror="this.src='../assets/images/1-.png'">
                        </div>
                        <div style="flex-grow: 1;">
                            <h5 style="margin: 0 0 5px 0; color: #333;">${itemName}</h5>
                            <p style="margin: 0; color: #6c757d; font-size: 14px;">
                                Prix unitaire: <strong>${itemPrice.toLocaleString('fr-FR')} CFA</strong> × ${itemQuantity}
                            </p>
                        </div>
                        <div style="flex-shrink: 0; text-align: right;">
                            <div style="font-size: 16px; font-weight: bold; color: #28a745;">
                                ${itemTotal.toLocaleString('fr-FR')} CFA
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
    
    return itemsHTML;
}

function findProductImage(productName, productPrice) {
    // Chercher d'abord dans les produits API actuels
    if (products && products.length > 0) {
        const product = products.find(p => 
            p.name === productName && Number(p.price) === Number(productPrice)
        );
        if (product) {
            return getProductImage(product);
        }
    }
    
    // Chercher dans les promotions API (données déjà chargées)
    if (promotions && promotions.length > 0) {
        const promotion = promotions.find(p => 
            p.title === productName && Number(p.promotionPrice) === Number(productPrice)
        );
        if (promotion) {
            return getPromotionImageUrl(promotion.image);
        }
    }
    
    // Chercher dans les produits du panier FADIDI pour les images des promotions
    try {
        const cartItems = JSON.parse(localStorage.getItem('fadidi_cart_items') || '[]');
        const cartProduct = cartItems.find(p => 
            p.name === productName && Number(p.price) === Number(productPrice)
        );
        if (cartProduct && cartProduct.image) {
            // Si l'image est déjà une URL complète, la retourner
            if (cartProduct.image.startsWith('http') || cartProduct.image.startsWith('/')) {
                return cartProduct.image;
            }
            return cartProduct.image;
        }
    } catch (e) {
        console.warn('Erreur lors de la lecture du panier:', e);
    }
    
    // Chercher dans les produits stockés localement (boutique FADIDI)
    try {
        const fadidiProducts = JSON.parse(localStorage.getItem('fadidiProducts') || '[]');
        const localProduct = fadidiProducts.find(p => 
            p.name === productName && Number(p.price) === Number(productPrice)
        );
        if (localProduct && localProduct.image) {
            return localProduct.image;
        }
    } catch (e) {
        console.warn('Erreur lors de la lecture des produits locaux:', e);
    }
    
    // Rechercher dans l'historique des commandes pour récupérer l'image
    try {
        const orderHistory = JSON.parse(localStorage.getItem('fadidiOrders') || '[]');
        for (const order of orderHistory) {
            if (order.items) {
                let items = [];
                if (typeof order.items === 'string') {
                    items = JSON.parse(order.items);
                } else if (Array.isArray(order.items)) {
                    items = order.items;
                }
                
                const historyItem = items.find(item => 
                    item.name === productName && Number(item.price) === Number(productPrice) && item.image
                );
                if (historyItem && historyItem.image) {
                    return historyItem.image;
                }
            }
        }
    } catch (e) {
        console.warn('Erreur lors de la lecture de l\'historique:', e);
    }
    
    // Image par défaut si aucune correspondance
    return '../assets/images/1-.png';
}

function closeOrderModal() {
    const modal = document.getElementById('order-details-modal');
    if (modal) {
        modal.remove();
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await updateOrderStatusById(orderId, newStatus);
        displayOrders();
        
        const statusText = getOrderStatusText(newStatus);
        showAlert('main-content', `Commande marquée comme "${statusText}"`, 'success');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        showAlert('main-content', 'Erreur lors de la mise à jour du statut', 'error');
    }
}

async function updateOrderStatusById(orderId, newStatus) {
    try {
        // Mettre à jour via l'API
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            // Mettre à jour localement
            const orderIndex = orders.findIndex(o => (o.id || o.orderId) == orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = newStatus;
            }
        } else {
            throw new Error(`Erreur API: ${response.status}`);
        }
    } catch (error) {
        console.error('Erreur API, tentative de mise à jour locale:', error);
        // Fallback vers localStorage si l'API n'est pas disponible
        const orderIndex = orders.findIndex(o => (o.id || o.orderId) == orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem('fadidiOrders', JSON.stringify(orders));
        } else {
            throw new Error(`Commande ${orderId} introuvable`);
        }
    }
}

// =========================
// GESTION DES SÉLECTIONS ET SUPPRESSIONS
// =========================

// Correction : forcer la mise à jour du bouton au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Correction : forcer l'affichage du bouton si des commandes sont déjà cochées
    setTimeout(function() {
        updateSelectedCount();
        // Correction supplémentaire : retire tout style display:none
        var btn = document.getElementById('delete-selected-orders');
        if (btn) {
            btn.style.display = '';
        }
    }, 150);
});

function toggleAllOrders(checked) {
    const checkboxes = document.querySelectorAll('.order-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
    updateSelectedCount();
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.order-checkbox:checked');
    const count = checkboxes.length;
    
    // Compter les commandes expédiées sélectionnées (peuvent être marquées comme livrées)
    let shippedCount = 0;
    checkboxes.forEach(checkbox => {
        const orderId = checkbox.dataset.orderId;
        const order = orders.find(o => (o.id || o.orderId) == orderId);
        if (order && order.status === 'shipped') {
            shippedCount++;
        }
    });
    
    const countElement = document.getElementById('selected-count');
    const deliverCountElement = document.getElementById('deliver-count');
    const deleteButton = document.getElementById('delete-selected-orders');
    const deliverButton = document.getElementById('deliver-selected-orders');
    const selectAllCheckbox = document.getElementById('select-all-orders');
    
    if (countElement) {
        countElement.textContent = count;
    }
    
    if (deliverCountElement) {
        deliverCountElement.textContent = shippedCount;
    }
    
    if (deleteButton) {
        if (count > 0) {
            deleteButton.classList.remove('hidden');
        } else {
            deleteButton.classList.add('hidden');
        }
    }
    
    if (deliverButton) {
        if (shippedCount > 0) {
            deliverButton.classList.remove('hidden');
        } else {
            deliverButton.classList.add('hidden');
        }
    }
    
    // Mettre à jour la case "Tout sélectionner"
    const allCheckboxes = document.querySelectorAll('.order-checkbox');
    if (selectAllCheckbox && allCheckboxes.length > 0) {
        selectAllCheckbox.checked = count === allCheckboxes.length;
        selectAllCheckbox.indeterminate = count > 0 && count < allCheckboxes.length;
    }
}

async function deleteSelectedOrders() {
    const checkboxes = document.querySelectorAll('.order-checkbox:checked');
    const selectedOrderIds = Array.from(checkboxes).map(cb => cb.dataset.orderId);
    
    if (selectedOrderIds.length === 0) {
        showAlert('main-content', 'Aucune commande sélectionnée', 'warning');
        return;
    }
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedOrderIds.length} commande(s) ? Cette action est irréversible.`)) {
        return;
    }
    
    // Afficher un indicateur de chargement
    const deleteButton = document.getElementById('delete-selected-orders');
    const originalText = deleteButton.innerHTML;
    deleteButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Suppression...';
    deleteButton.disabled = true;
    
    let successCount = 0;
    let errorCount = 0;
    
    try {
        for (const orderId of selectedOrderIds) {
            try {
                await deleteOrderById(orderId);
                successCount++;
            } catch (error) {
                console.error(`Erreur lors de la suppression de la commande ${orderId}:`, error);
                errorCount++;
            }
        }
        
        // Recharger les commandes et les statistiques
        await loadOrders();
        await loadDashboardData(); // Mettre à jour les statistiques
        
        // Afficher le résultat
        if (successCount > 0) {
            showAlert('main-content', `${successCount} commande(s) supprimée(s) avec succès`, 'success');
        }
        if (errorCount > 0) {
            showAlert('main-content', `Erreur lors de la suppression de ${errorCount} commande(s)`, 'error');
        }
        
    } catch (error) {
        console.error('Erreur lors de la suppression en lot:', error);
        showAlert('main-content', 'Erreur lors de la suppression des commandes', 'error');
    } finally {
        // Restaurer le bouton
        deleteButton.innerHTML = originalText;
        deleteButton.disabled = false;
        updateSelectedCount();
    }
}

async function deliverSelectedOrders() {
    const checkboxes = document.querySelectorAll('.order-checkbox:checked');
    const selectedOrderIds = [];
    
    // Filtrer pour ne garder que les commandes expédiées
    checkboxes.forEach(checkbox => {
        const orderId = checkbox.dataset.orderId;
        const order = orders.find(o => (o.id || o.orderId) == orderId);
        if (order && order.status === 'shipped') {
            selectedOrderIds.push(orderId);
        }
    });
    
    if (selectedOrderIds.length === 0) {
        showAlert('main-content', 'Aucune commande expédiée sélectionnée', 'warning');
        return;
    }
    
    if (!confirm(`Marquer ${selectedOrderIds.length} commande(s) comme livrée(s) ?`)) {
        return;
    }
    
    // Afficher un indicateur de chargement
    const deliverButton = document.getElementById('deliver-selected-orders');
    const originalText = deliverButton.innerHTML;
    deliverButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Livraison...';
    deliverButton.disabled = true;
    
    let successCount = 0;
    let errorCount = 0;
    
    try {
        for (const orderId of selectedOrderIds) {
            try {
                await updateOrderStatusById(orderId, 'delivered');
                successCount++;
            } catch (error) {
                console.error(`Erreur lors de la livraison de la commande ${orderId}:`, error);
                errorCount++;
            }
        }
        
        // Recharger les commandes et les statistiques
        await loadOrders();
        await loadDashboardData(); // Mettre à jour les statistiques
        
        // Afficher le résultat
        if (successCount > 0) {
            showAlert('main-content', `${successCount} commande(s) marquée(s) comme livrée(s)`, 'success');
        }
        if (errorCount > 0) {
            showAlert('main-content', `Erreur lors de la livraison de ${errorCount} commande(s)`, 'error');
        }
        
    } catch (error) {
        console.error('Erreur lors de la livraison en lot:', error);
        showAlert('main-content', 'Erreur lors de la mise à jour des commandes', 'error');
    } finally {
        // Restaurer le bouton
        deliverButton.innerHTML = originalText;
        deliverButton.disabled = false;
        updateSelectedCount();
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
        return;
    }
    
    try {
        await deleteOrderById(orderId);
        await loadOrders();
        await loadDashboardData(); // Mettre à jour les statistiques
        showAlert('main-content', 'Commande supprimée avec succès', 'success');
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showAlert('main-content', 'Erreur lors de la suppression de la commande', 'error');
    }
}

async function deleteOrderById(orderId) {
    try {
        // Tenter de supprimer via l'API
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            // Supprimer de la liste locale
            const orderIndex = orders.findIndex(o => (o.id || o.orderId) == orderId);
            if (orderIndex !== -1) {
                // NE PAS RETIRER le montant du CA si la commande était livrée
                // On conserve le CA déjà comptabilisé, même après suppression
                if (orders[orderIndex].status === 'delivered') {
                    let deletedDelivered = JSON.parse(localStorage.getItem('deletedDeliveredOrders') || '[]');
                    let deletedDeliveredAmounts = JSON.parse(localStorage.getItem('deletedDeliveredAmounts') || '{}');
                    const id = orders[orderIndex].id || orders[orderIndex].orderId;
                    if (!deletedDelivered.includes(id)) {
                        deletedDelivered.push(id);
                        localStorage.setItem('deletedDeliveredOrders', JSON.stringify(deletedDelivered));
                    }
                    // Sauvegarder le montant de la commande livrée supprimée
                    deletedDeliveredAmounts[id] = orders[orderIndex].total || orders[orderIndex].totalAmount || 0;
                    localStorage.setItem('deletedDeliveredAmounts', JSON.stringify(deletedDeliveredAmounts));
                    // On ne retire pas la commande du tableau pour le calcul CA
                } else {
                    orders.splice(orderIndex, 1);
                }
            }
            console.log(`Commande ${orderId} supprimée via API (CA inchangé si livrée)`);
        } else {
            throw new Error(`Erreur API: ${response.status}`);
        }
    } catch (error) {
        console.error('Erreur API, tentative de suppression locale:', error);
        // Fallback vers localStorage si l'API n'est pas disponible
        const orderIndex = orders.findIndex(o => (o.id || o.orderId) == orderId);
        if (orderIndex !== -1) {
            // NE PAS RETIRER le montant du CA si la commande était livrée
            if (orders[orderIndex].status === 'delivered') {
                let deletedDelivered = JSON.parse(localStorage.getItem('deletedDeliveredOrders') || '[]');
                let deletedDeliveredAmounts = JSON.parse(localStorage.getItem('deletedDeliveredAmounts') || '{}');
                const id = orders[orderIndex].id || orders[orderIndex].orderId;
                if (!deletedDelivered.includes(id)) {
                    deletedDelivered.push(id);
                    localStorage.setItem('deletedDeliveredOrders', JSON.stringify(deletedDelivered));
                }
                // Sauvegarder le montant de la commande livrée supprimée
                deletedDeliveredAmounts[id] = orders[orderIndex].total || orders[orderIndex].totalAmount || 0;
                localStorage.setItem('deletedDeliveredAmounts', JSON.stringify(deletedDeliveredAmounts));
                // On ne retire pas la commande du tableau pour le calcul CA
            } else {
                orders.splice(orderIndex, 1);
            }
            localStorage.setItem('fadidiOrders', JSON.stringify(orders));
            console.log(`Commande ${orderId} supprimée localement (CA inchangé si livrée)`);
        } else {
            throw new Error(`Commande ${orderId} introuvable`);
        }
    }
}

function filterOrdersByStatus(status) {
    if (status === '') {
        // Afficher toutes les commandes
        filteredOrders = [];
    } else {
        // Filtrer par statut
        filteredOrders = orders.filter(order => (order.status || 'pending') === status);
    }
    
    displayOrders();
    
    // Afficher un message si aucune commande ne correspond au filtre
    if (status !== '' && filteredOrders.length === 0) {
        showAlert('main-content', `Aucune commande trouvée avec le statut "${getOrderStatusText(status)}"`, 'info');
    }
}

// =========================
// GESTION DES FICHIERS
// =========================

function handleProductImages(event) {
    const files = event.target.files;
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

function handleCategoryImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('category-image-preview');
    preview.innerHTML = '';
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

// =========================
// SYNCHRONISATION AVEC LA BOUTIQUE FADIDI
// =========================

async function syncWithBoutique() {
    try {
        // Récupérer tous les produits publiés
        const publishedProducts = await apiRequest('/products/published');
        
        // Convertir au format attendu par la boutique FADIDI
        const fadidiProducts = publishedProducts.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: getProductImage(product),
            status: 'published',
            category: product.category?.name || null,
            createdAt: product.createdAt
        }));
        
        // Sauvegarder dans localStorage pour la boutique FADIDI
        localStorage.setItem('fadidiProducts', JSON.stringify(fadidiProducts));
        
        console.log('Synchronisation avec la boutique FADIDI réussie:', fadidiProducts.length, 'produits');
        
    } catch (error) {
        console.error('Erreur lors de la synchronisation:', error);
    }
}

// =========================
// UTILITAIRES
// =========================

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };
    
    // Ne pas définir Content-Type pour FormData
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    
    const response = await fetch(url, config);
    
    if (response.status === 401) {
        // Token expiré, tenter de se reconnecter automatiquement
        console.log('Token expiré, tentative de reconnexion...');
        const reconnected = await attemptAutoLogin();
        if (reconnected) {
            // Retry the request with new token
            config.headers['Authorization'] = `Bearer ${authToken}`;
            const retryResponse = await fetch(url, config);
            if (!retryResponse.ok) {
                const errorData = await retryResponse.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${retryResponse.status}`);
            }
            return retryResponse.json();
        } else {
            throw new Error('Authentication failed - please refresh the page');
        }
    }
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

async function attemptAutoLogin() {
    try {
        // Utiliser les identifiants par défaut admin
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: 'admin@fadidi.com', 
                password: 'Admin123!' 
            }),
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.access_token;
            localStorage.setItem('admin_token', authToken);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            console.log('Reconnexion automatique réussie');
            return true;
        } else {
            console.error('Échec de la reconnexion automatique - identifiants incorrects');
        }
    } catch (error) {
        console.error('Échec de la reconnexion automatique:', error);
    }
    return false;
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.style.display = 'flex';
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.style.display = 'none';
}

function showTable(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'table';
        element.classList.remove('table-hidden');
    }
}

function hideTable(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
        element.classList.add('table-hidden');
    }
}

function showAlert(containerId, message, type = 'success') {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.querySelector(`.${containerId}`) || document.body;
    }
    
    // Supprimer toute alerte existante
    const existingAlert = container.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Créer la nouvelle alerte avec styles inline
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        padding: 12px 16px;
        margin: 10px 0;
        border-radius: 4px;
        font-weight: 500;
        ${type === 'success' ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
        ${type === 'error' ? 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
        ${type === 'warning' ? 'background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7;' : ''}
    `;
    alert.textContent = message;
    
    container.insertBefore(alert, container.firstChild);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// =========================
// GESTION DES PROMOTIONS
// =========================

async function loadPromotions() {
    showLoading('promotions-loading');
    hideTable('promotions-table');
    
    try {
        const response = await fetch(`${API_BASE_URL}/promotions`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            promotions = await response.json();
            displayPromotions();
            
            // Toujours calculer les stats localement pour s'assurer de la précision
            calculatePromotionStatsLocally();
            
            // Essayer aussi de charger depuis l'API (pour comparaison)
            loadPromotionStats();
        } else {
            throw new Error('Erreur lors du chargement des promotions');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('promotions-section', 'Erreur lors du chargement des promotions', 'error');
    } finally {
        hideLoading('promotions-loading');
    }
}

async function loadPromotionStats() {
    try {
        // Essayer d'abord de charger depuis l'API
        const response = await fetch(`${API_BASE_URL}/promotions/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            document.getElementById('active-promotions').textContent = stats.active;
            document.getElementById('total-promotions').textContent = stats.total;
            document.getElementById('expired-promotions').textContent = stats.expired;
            return;
        }
    } catch (error) {
        console.warn('API non disponible, calcul local des stats:', error);
    }
    
    // Fallback : calculer les statistiques localement
    calculatePromotionStatsLocally();
}

function calculatePromotionStatsLocally() {
    if (!promotions || !Array.isArray(promotions)) {
        console.warn('Aucune promotion chargée pour calculer les stats');
        return;
    }
    
    const now = new Date();
    let activeCount = 0;
    let expiredCount = 0;
    let totalCount = promotions.length;
    
    promotions.forEach(promotion => {
        if (!promotion.startDate || !promotion.endDate) {
            console.warn('Promotion sans dates:', promotion);
            return;
        }
        
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);
        
        // Vérifier si la promotion est expirée
        if (now > endDate) {
            expiredCount++;
        } 
        // Vérifier si la promotion est active (dans la période ET statut actif)
        else if (promotion.status === 'active' && now >= startDate && now <= endDate) {
            activeCount++;
        }
    });
    
    // Mettre à jour l'affichage
    document.getElementById('active-promotions').textContent = activeCount;
    document.getElementById('total-promotions').textContent = totalCount;
    document.getElementById('expired-promotions').textContent = expiredCount;
    
    console.log(`📊 Stats promotions: ${activeCount} actives, ${expiredCount} expirées, ${totalCount} total`);
}

function displayPromotions() {
    const tbody = document.getElementById('promotions-tbody');
    tbody.innerHTML = '';
    
    if (promotions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">Aucune promotion trouvée</td></tr>';
        showTable('promotions-table');
        return;
    }
    
    promotions.forEach(promotion => {
        const row = document.createElement('tr');
        // Calcul du statut d'affichage basé sur les dates réelles
        const now = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);
        let statusClass = 'badge-secondary';
        let statusText = promotion.status;
        // Vérifier d'abord si la promotion est expirée (priorité sur le statut)
        if (now > endDate) {
            statusClass = 'badge-danger';
            statusText = 'Expirée';
        } 
        else if (promotion.status === 'active') {
            if (now < startDate) {
                statusClass = 'badge-warning';
                statusText = 'En attente';
            } else if (now >= startDate && now <= endDate) {
                statusClass = 'badge-success';
                statusText = 'Active';
            }
        }
        else if (promotion.status === 'draft') {
            statusClass = 'badge-secondary';
            statusText = 'Brouillon';
        }
        else if (promotion.status === 'paused') {
            statusClass = 'badge-warning';
            statusText = 'En pause';
        }
        row.innerHTML = `
            <td><input type="checkbox" class="select-promotion" value="${promotion.id}" onchange="updateSelectedPromotions()"></td>
            <td>
                ${promotion.image ? 
                    `<img src="${getPromotionImageUrl(promotion.image)}" alt="${promotion.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : 
                    '<div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image text-muted"></i></div>'
                }
            </td>
            <td>
                <strong>${promotion.title}</strong>
                ${promotion.description ? `<br><small class="text-muted">${promotion.description.substring(0, 50)}...</small>` : ''}
            </td>
            <td>${promotion.category ? promotion.category.name : '<em>Aucune</em>'}</td>
            <td>${promotion.originalPrice.toLocaleString()} CFA</td>
            <td><strong class="text-danger">${promotion.promotionPrice.toLocaleString()} CFA</strong></td>
            <td><span class="badge badge-info">-${promotion.discountPercentage}%</span></td>
            <td>
                <small>${new Date(promotion.startDate).toLocaleDateString()}</small><br>
                <small>à ${new Date(promotion.endDate).toLocaleDateString()}</small>
                <div class="promotion-countdown" data-end-date="${promotion.endDate}">
                    <small class="text-muted">${calculateTimeRemaining(promotion.endDate)}</small>
                </div>
            </td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td class="actions">
                <button onclick="editPromotion('${promotion.id}')" class="btn btn-sm btn-primary">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deletePromotion('${promotion.id}')" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateSelectedPromotions();
    
    showTable('promotions-table');
    
    // Démarrer la mise à jour du temps restant
    updatePromotionCountdowns();
}

function calculateTimeRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Expirée';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j ${hours}h restant${days > 1 ? 's' : ''}`;
    return `${hours}h restant${hours > 1 ? 's' : ''}`;
}

function updatePromotionCountdowns() {
    let statsChanged = false;
    const countdowns = document.querySelectorAll('.promotion-countdown');
    
    countdowns.forEach(countdown => {
        const endDate = countdown.dataset.endDate;
        const remaining = calculateTimeRemaining(endDate);
        countdown.querySelector('small').textContent = remaining;
        
        // Vérifier si une promotion vient d'expirer
        if (remaining.includes('Expirée') && !countdown.classList.contains('expired')) {
            countdown.classList.add('expired');
            statsChanged = true;
        }
    });
    
    // Mettre à jour les statistiques si une promotion a expiré
    if (statsChanged) {
        console.log('🔄 Mise à jour des stats - promotion(s) expirée(s) détectée(s)');
        calculatePromotionStatsLocally();
        
        // Mettre aussi à jour les badges de statut dans le tableau
        updatePromotionStatusBadges();
    }
}

// Fonction pour mettre à jour les badges de statut en temps réel
function updatePromotionStatusBadges() {
    const tbody = document.getElementById('promotions-tbody');
    const rows = tbody.querySelectorAll('tr');
    const now = new Date();
    
    if (!promotions || promotions.length === 0) return;
    
    rows.forEach((row, index) => {
        if (index < promotions.length) {
            const promotion = promotions[index];
            const endDate = new Date(promotion.endDate);
            const badge = row.querySelector('.badge');
            
            if (badge && now > endDate) {
                // La promotion a expiré, mettre à jour le badge
                badge.className = 'badge badge-danger';
                badge.textContent = 'Expirée';
            }
        }
    });
}

// Mettre à jour les comptes à rebours et statistiques toutes les minutes
setInterval(updatePromotionCountdowns, 60000);

// Fonction pour actualiser manuellement les statistiques de promotions
function refreshPromotionStats() {
    console.log('🔄 Actualisation manuelle des statistiques de promotions...');
    
    // Recalculer les statistiques localement
    calculatePromotionStatsLocally();
    
    // Mettre à jour les badges dans le tableau
    updatePromotionStatusBadges();
    
    // Afficher une notification de confirmation
    showAlert('promotions-section', 'Statistiques actualisées avec succès', 'success');
    
    // Log pour debugging
    const now = new Date();
    const expiredCount = promotions ? promotions.filter(p => new Date(p.endDate) < now).length : 0;
    console.log(`✅ Actualisation terminée - ${expiredCount} promotions expirées détectées`);
}

function openPromotionModal() {
    editingPromotionId = null;
    document.getElementById('promotion-modal-title').textContent = 'Ajouter une promotion';
    document.getElementById('promotion-form').reset();
    document.getElementById('promotion-image-preview').innerHTML = '';
    
    // Charger les catégories et produits pour les listes déroulantes
    loadCategoriesForPromotion();
    loadProductsForPromotion();
    
    // Définir les dates par défaut
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    document.getElementById('promotion-start-date').value = formatDateTimeLocal(now);
    document.getElementById('promotion-end-date').value = formatDateTimeLocal(nextWeek);
    
    // Afficher le modal
    document.getElementById('promotion-modal').classList.remove('hidden');
}

function closePromotionModal() {
    document.getElementById('promotion-modal').classList.add('hidden');
    editingPromotionId = null;
}

async function loadCategoriesForPromotion() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const cats = await response.json();
            const select = document.getElementById('promotion-category');
            select.innerHTML = '<option value="">Aucune catégorie</option>';
            
            cats.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

async function loadProductsForPromotion() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const prods = await response.json();
            const select = document.getElementById('promotion-product');
            select.innerHTML = '<option value="">Aucun produit</option>';
            
            prods.forEach(prod => {
                select.innerHTML += `<option value="${prod.id}">${prod.name} - ${prod.price} CFA</option>`;
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
    }
}

function calculateDiscount() {
    const originalPrice = parseFloat(document.getElementById('promotion-original-price').value) || 0;
    const promotionPrice = parseFloat(document.getElementById('promotion-price').value) || 0;
    
    if (originalPrice > 0 && promotionPrice >= 0 && promotionPrice < originalPrice) {
        const discount = Math.round(((originalPrice - promotionPrice) / originalPrice) * 100);
        document.getElementById('promotion-discount').value = discount;
    } else {
        document.getElementById('promotion-discount').value = '';
    }
}

function handlePromotionImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('promotion-image-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="image-item">
                    <img src="${e.target.result}" alt="Aperçu">
                    <button type="button" onclick="removePromotionImage()" class="remove-image">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function removePromotionImage() {
    document.getElementById('promotion-image').value = '';
    document.getElementById('promotion-image-preview').innerHTML = '';
}

async function savePromotion() {
    const form = document.getElementById('promotion-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData();
    
    // Ajouter les données de base
    formData.append('title', document.getElementById('promotion-title').value);
    formData.append('description', document.getElementById('promotion-description').value);
    formData.append('originalPrice', document.getElementById('promotion-original-price').value);
    formData.append('promotionPrice', document.getElementById('promotion-price').value);
    formData.append('discountPercentage', document.getElementById('promotion-discount').value);
    formData.append('startDate', document.getElementById('promotion-start-date').value);
    formData.append('endDate', document.getElementById('promotion-end-date').value);
    formData.append('status', document.getElementById('promotion-status').value);
    formData.append('maxQuantity', document.getElementById('promotion-max-quantity').value || 0);
    formData.append('isFeatured', document.getElementById('promotion-featured').checked);
    
    // Ajouter les IDs optionnels
    const categoryId = document.getElementById('promotion-category').value;
    const productId = document.getElementById('promotion-product').value;
    if (categoryId) formData.append('categoryId', categoryId);
    if (productId) formData.append('productId', productId);
    
    // Ajouter l'image si présente
    const imageFile = document.getElementById('promotion-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    try {
        // D'abord uploader l'image si nécessaire
        let imageUrl = null;
        if (imageFile) {
            const uploadResponse = await fetch(`${API_BASE_URL}/upload/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: (() => {
                    const uploadFormData = new FormData();
                    uploadFormData.append('image', imageFile);
                    return uploadFormData;
                })()
            });
            
            if (uploadResponse.ok) {
                const uploadResult = await uploadResponse.json();
                // Construire l'URL complète
                imageUrl = `${API_BASE_URL.replace('/api', '')}${uploadResult.url}`;
            } else {
                console.error('Erreur upload:', await uploadResponse.text());
            }
        }
        
        // Préparer les données de la promotion
        const promotionData = {
            title: document.getElementById('promotion-title').value,
            description: document.getElementById('promotion-description').value,
            originalPrice: parseFloat(document.getElementById('promotion-original-price').value),
            promotionPrice: parseFloat(document.getElementById('promotion-price').value),
            discountPercentage: parseInt(document.getElementById('promotion-discount').value),
            startDate: document.getElementById('promotion-start-date').value,
            endDate: document.getElementById('promotion-end-date').value,
            status: document.getElementById('promotion-status').value,
            maxQuantity: parseInt(document.getElementById('promotion-max-quantity').value) || 0,
            isFeatured: document.getElementById('promotion-featured').checked
        };
        
        if (categoryId) promotionData.categoryId = categoryId;
        if (productId) promotionData.productId = productId;
        if (imageUrl) promotionData.image = imageUrl;
        
        // Sauvegarder la promotion
        const url = editingPromotionId 
            ? `${API_BASE_URL}/promotions/${editingPromotionId}`
            : `${API_BASE_URL}/promotions`;
        
        const method = editingPromotionId ? 'PATCH' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(promotionData)
        });
        
        if (response.ok) {
            showAlert('promotions-section', 
                editingPromotionId ? 'Promotion modifiée avec succès' : 'Promotion créée avec succès', 
                'success'
            );
            closePromotionModal();
            loadPromotions();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('promotion-modal', error.message, 'error');
    }
}

async function editPromotion(id) {
    const promotion = promotions.find(p => p.id === id);
    if (!promotion) return;
    
    editingPromotionId = id;
    document.getElementById('promotion-modal-title').textContent = 'Modifier la promotion';
    
    // Remplir le formulaire
    document.getElementById('promotion-title').value = promotion.title;
    document.getElementById('promotion-description').value = promotion.description || '';
    document.getElementById('promotion-original-price').value = promotion.originalPrice;
    document.getElementById('promotion-price').value = promotion.promotionPrice;
    document.getElementById('promotion-discount').value = promotion.discountPercentage;
    document.getElementById('promotion-start-date').value = formatDateTimeLocal(new Date(promotion.startDate));
    document.getElementById('promotion-end-date').value = formatDateTimeLocal(new Date(promotion.endDate));
    document.getElementById('promotion-status').value = promotion.status;
    document.getElementById('promotion-max-quantity').value = promotion.maxQuantity || 0;
    document.getElementById('promotion-featured').checked = promotion.isFeatured;
    
    // Charger les listes déroulantes
    await loadCategoriesForPromotion();
    await loadProductsForPromotion();
    
    // Sélectionner les valeurs
    if (promotion.categoryId) {
        document.getElementById('promotion-category').value = promotion.categoryId;
    }
    if (promotion.productId) {
        document.getElementById('promotion-product').value = promotion.productId;
    }
    
    // Afficher l'image existante
    if (promotion.image) {
        document.getElementById('promotion-image-preview').innerHTML = `
            <div class="image-item">
                <img src="${promotion.image}" alt="Image actuelle">
                <button type="button" onclick="removePromotionImage()" class="remove-image">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    
    document.getElementById('promotion-modal').classList.remove('hidden');
}

async function deletePromotion(id) {
    const promotion = promotions.find(p => p.id === id);
    if (!promotion) return;
    // Ajout d'un paramètre silent pour la suppression groupée
    if (arguments.length > 1 && arguments[1] === true) {
        // Suppression silencieuse (pas de confirmation, pas d'alerte)
        try {
            await fetch(`${API_BASE_URL}/promotions/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` } });
        } catch (e) {}
        return;
    }
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la promotion "${promotion.title}" ?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (response.ok) {
            showAlert('promotions-section', 'Promotion supprimée avec succès', 'success');
            loadPromotions();
        } else {
            throw new Error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('promotions-section', 'Erreur lors de la suppression', 'error');
    }
}

function formatDateTimeLocal(date) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
}

// ==================== GESTION DES RETOURS CLIENTS ====================

let allFeedbacks = [];

async function loadFeedbacks() {
    document.getElementById('feedbacks-loading').style.display = 'block';
    
    try {
        // Charger toutes les commandes et filtrer celles avec des retours
        const response = await fetch(`${API_BASE_URL}/orders`);
        const result = await response.json();
        
        if (result.success) {
            // Filtrer les commandes avec des retours dans deliveryNotes
            const ordersWithFeedback = result.data.filter(order => {
                return order.deliveryNotes && 
                       (order.deliveryNotes.includes('confirmée par le client') || 
                        order.deliveryNotes.includes('PROBLÈME SIGNALÉ') ||
                        (order.deliveryNotes && order.deliveryNotes.includes('PROBLÈME SIGNALÉ')));
            });
            
            allFeedbacks = ordersWithFeedback;
            displayFeedbacks(allFeedbacks);
            updateFeedbacksStats(allFeedbacks);
        } else {
            showAlert('feedbacks-section', 'Erreur lors du chargement des retours', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('feedbacks-section', 'Erreur de connexion à l\'API', 'error');
    }
    
    document.getElementById('feedbacks-loading').style.display = 'none';
}

function updateFeedbacksStats(feedbacks) {
    const totalFeedbacks = feedbacks.length;
    const confirmations = feedbacks.filter(f => 
        f.deliveryNotes && f.deliveryNotes.includes('confirmée par le client')
    ).length;
    const problems = feedbacks.filter(f => 
        f.deliveryNotes && f.deliveryNotes.includes('PROBLÈME SIGNALÉ')
    ).length;
    
    document.getElementById('total-feedbacks').textContent = totalFeedbacks;
    document.getElementById('confirmed-orders').textContent = confirmations;
    document.getElementById('dispute-orders').textContent = problems;
}

function displayFeedbacks(feedbacks) {
    const feedbacksList = document.getElementById('feedbacks-list');

    // Sauvegarder les IDs sélectionnés avant le rechargement
    const selectedIds = Array.from(document.querySelectorAll('.feedback-select:checked')).map(cb => cb.value);

    if (feedbacks.length === 0) {
        feedbacksList.innerHTML = '<div class="no-data">Aucun retour client pour le moment</div>';
        // Masquer les contrôles de sélection groupée s'il n'y a pas de feedbacks
        const bulkActions = document.getElementById('bulk-actions');
        if (bulkActions) bulkActions.classList.add('hide-by-default');
        return;
    }

    let html = '';

    feedbacks.forEach(feedback => {
        const orderDate = new Date(feedback.createdAt).toLocaleDateString('fr-FR');

        // Déterminer le type de retour basé sur deliveryNotes et status
        const isConfirmation = feedback.deliveryNotes && feedback.deliveryNotes.includes('confirmée par le client');
        const isProblem = feedback.deliveryNotes && feedback.deliveryNotes.includes('PROBLÈME SIGNALÉ');

        const badgeClass = isConfirmation ? 'status-delivered' : 
                          isProblem ? 'status-error' : 'status-warning';

        const badgeIcon = isConfirmation ? 'fa-check-circle' : 
                         isProblem ? 'fa-exclamation-triangle' : 'fa-clock';

        const badgeText = isConfirmation ? 'Confirmé' : 
                         isProblem ? 'Problème' : 'En attente';

        // Extraire le message du client depuis deliveryNotes
        let customerMessage = 'Aucun message spécifique';
        if (feedback.deliveryNotes) {
            if (isConfirmation) {
                customerMessage = 'Client a confirmé la réception de sa commande';
            } else if (isProblem) {
                // Extraire le message après "PROBLÈME SIGNALÉ: "
                const match = feedback.deliveryNotes.match(/PROBLÈME SIGNALÉ: (.+)/);
                if (match) {
                    customerMessage = match[1];
                }
            }
        }

        // Ajout : cocher la case si l'ID est dans selectedIds
        const checkedAttr = selectedIds.includes(String(feedback.id)) ? 'checked' : '';

        html += `
            <div class="feedback-card" data-feedback-id="${feedback.id}">
                <div class="feedback-header">
                    <div class="feedback-checkbox">
                        <input type="checkbox" class="feedback-select" value="${feedback.id}" onchange="updateSelectionCount()" ${checkedAttr}>
                    </div>
                    <div class="feedback-info">
                        <h4>Commande #${feedback.id}</h4>
                        <p><i class="fas fa-calendar"></i> Commandé le ${orderDate}</p>
                        <p><i class="fas fa-user"></i> ${feedback.customerName} - ${feedback.customerPhone}</p>
                    </div>
                    <div class="feedback-status">
                        <span class="status-badge ${badgeClass}">
                            <i class="fas ${badgeIcon}"></i> ${badgeText}
                        </span>
                        <p class="feedback-date">Statut: ${feedback.status}</p>
                    </div>
                </div>

                <div class="feedback-content">
                    <div class="customer-feedback">
                        <h5><i class="fas fa-comment"></i> Message du client :</h5>
                        <p>${customerMessage}</p>
                    </div>

                    <div class="feedback-actions">
                        <button class="btn btn-secondary" onclick="viewOrderDetails(${feedback.id})">
                            <i class="fas fa-eye"></i> Voir la commande
                        </button>
                        ${isProblem ? `
                            <button class="btn btn-primary" onclick="resolveDispute(${feedback.id})">
                                <i class="fas fa-check"></i> Marquer comme résolu
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    feedbacksList.innerHTML = html;

    // Réinitialiser les sélections après le rechargement
    const selectAll = document.getElementById('select-all-feedbacks');
    const bulkActions = document.getElementById('bulk-actions');
    if (selectAll) {
        // Si toutes les cases sont cochées, cocher "Tout sélectionner"
        const allCheckboxes = document.querySelectorAll('.feedback-select');
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
        selectAll.checked = allChecked && allCheckboxes.length > 0;
        selectAll.indeterminate = !allChecked && selectedIds.length > 0;
    }
    if (bulkActions) {
        bulkActions.classList.add('hide-by-default');
    }

    // Correction : forcer la mise à jour du compteur et de l'affichage des boutons
    updateSelectionCount();
}

function filterFeedbacks() {
    const filter = document.getElementById('feedback-filter').value;
    let filteredFeedbacks = allFeedbacks;
    
    switch (filter) {
        case 'confirmation':
            filteredFeedbacks = allFeedbacks.filter(f => 
                f.deliveryNotes && f.deliveryNotes.includes('confirmée par le client')
            );
            break;
        case 'problem':
            filteredFeedbacks = allFeedbacks.filter(f => 
                f.deliveryNotes && f.deliveryNotes.includes('PROBLÈME SIGNALÉ')
            );
            break;
        default:
            // Tous les retours (déjà filtrés dans loadFeedbacks)
            filteredFeedbacks = allFeedbacks;
    }
    
    displayFeedbacks(filteredFeedbacks);
}

async function resolveDispute(orderId) {
    if (!confirm('Marquer ce litige comme résolu ?')) {
        return;
    }
    
    try {
        const updateData = {
            status: 'delivered',
            deliveryNotes: `Litige résolu par l'administrateur le ${new Date().toLocaleString('fr-FR')}`
        };
        
        const apiResponse = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (apiResponse.ok) {
            showAlert('feedbacks-section', 'Litige marqué comme résolu', 'success');
            loadFeedbacks(); // Recharger les retours
        } else {
            throw new Error('Erreur lors de la résolution');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('feedbacks-section', 'Erreur lors de la résolution du litige', 'error');
    }
}

// Fonction viewOrderDetails supprimée car dupliquée - utilise la version originale ligne 1214

function refreshFeedbacks() {
    loadFeedbacks();
}

// ==================== FONCTIONS DE SÉLECTION GROUPÉE ====================
// Correction : écouteur global pour les cases à cocher feedbacks
document.addEventListener('DOMContentLoaded', function() {
    const feedbacksList = document.getElementById('feedbacks-list');
    if (feedbacksList) {
        feedbacksList.addEventListener('change', function(e) {
            if (e.target && e.target.classList.contains('feedback-select')) {
                updateSelectionCount();
            }
        });
    }
});

function updateSelectionCount() {
    const checkboxes = document.querySelectorAll('.feedback-select');
    const checked = document.querySelectorAll('.feedback-select:checked');
    const bulkActions = document.getElementById('bulk-actions');
    const selectedCount = document.getElementById('selected-count');
    const selectAll = document.getElementById('select-all-feedbacks');
    
    // Mettre à jour la variable globale des IDs sélectionnés
    window.selectedFeedbackIds = Array.from(checked).map(cb => cb.value);
    // Mettre à jour le compteur
    selectedCount.textContent = `${checked.length} sélectionné(s)`;
    
    // Afficher/masquer les actions groupées
    if (checked.length > 0) {
        bulkActions.classList.remove('hide-by-default');
        bulkActions.classList.remove('d-none');
        bulkActions.style.display = 'flex';
    } else {
        bulkActions.classList.add('hide-by-default');
        bulkActions.style.removeProperty('display');
    }
    
    // Mettre à jour l'état de "Tout sélectionner"
    if (checked.length === checkboxes.length && checkboxes.length > 0) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
    } else if (checked.length > 0) {
        selectAll.checked = false;
        selectAll.indeterminate = true;
    } else {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    }
}

function toggleAllFeedbacks() {
    const selectAll = document.getElementById('select-all-feedbacks');
    const checkboxes = document.querySelectorAll('.feedback-select');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    updateSelectionCount();
}

function getSelectedFeedbackIds() {
    const checked = document.querySelectorAll('.feedback-select:checked');
    return Array.from(checked).map(checkbox => parseInt(checkbox.value));
}

async function markSelectedAsResolved() {
    const selectedIds = getSelectedFeedbackIds();
    
    if (selectedIds.length === 0) {
        alert('Veuillez sélectionner au moins un retour à marquer comme traité.');
        return;
    }
    
    if (!confirm(`Voulez-vous vraiment marquer ${selectedIds.length} retour(s) comme traité(s) ?`)) {
        return;
    }
    
    try {
        let successCount = 0;
        let errorCount = 0;
        
        for (const orderId of selectedIds) {
            try {
                // Récupérer les détails de la commande
                const orderResponse = await fetch(`${API_BASE_URL}/orders`);
                const orderResult = await orderResponse.json();
                const order = orderResult.data.find(o => o.id === orderId);
                
                if (order) {
                    // Mettre à jour les notes de livraison pour marquer comme traité
                    let updatedNotes = order.deliveryNotes || '';
                    if (!updatedNotes.includes('TRAITÉ')) {
                        updatedNotes += ` - TRAITÉ PAR ADMIN le ${new Date().toLocaleString('fr-FR')}`;
                    }
                    
                    const updateResponse = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            deliveryNotes: updatedNotes
                        })
                    });
                    
                    if (updateResponse.ok) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                }
            } catch (error) {
                console.error(`Erreur pour la commande ${orderId}:`, error);
                errorCount++;
            }
        }
        
        if (successCount > 0) {
            showAlert('feedbacks-section', `${successCount} retour(s) marqué(s) comme traité(s)`, 'success');
            loadFeedbacks(); // Recharger la liste
        }
        
        if (errorCount > 0) {
            showAlert('feedbacks-section', `Erreur lors du traitement de ${errorCount} retour(s)`, 'error');
        }
        
    } catch (error) {
        console.error('Erreur lors du marquage comme traité:', error);
        showAlert('feedbacks-section', 'Erreur lors du marquage comme traité', 'error');
    }
}

async function deleteSelectedFeedbacks() {
    const selectedIds = getSelectedFeedbackIds();
    
    if (selectedIds.length === 0) {
        alert('Veuillez sélectionner au moins un retour à supprimer.');
        return;
    }
    
    if (!confirm(`Voulez-vous vraiment supprimer définitivement ${selectedIds.length} retour(s) client(s) ?\n\nCette action supprimera les notes de retour mais gardera les commandes.`)) {
        return;
    }
    
    try {
        let successCount = 0;
        let errorCount = 0;
        
        for (const orderId of selectedIds) {
            try {
                // Récupérer les détails de la commande
                const orderResponse = await fetch(`${API_BASE_URL}/orders`);
                const orderResult = await orderResponse.json();
                const order = orderResult.data.find(o => o.id === orderId);
                
                if (order) {
                    // Supprimer les notes de retour client des deliveryNotes
                    let updatedNotes = order.deliveryNotes || '';
                    
                    // Retirer les messages de retour client mais garder le reste
                    updatedNotes = updatedNotes
                        .replace(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} - Livraison confirmée par le client via suivi de commande/g, '')
                        .replace(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} - PROBLÈME SIGNALÉ:.*?(?=\d{2}\/\d{2}\/\d{4}|$)/g, '')
                        .replace(/\s*-\s*TRAITÉ PAR ADMIN.*?(?=\d{2}\/\d{2}\/\d{4}|$)/g, '')
                        .trim();
                    
                    // Si les notes sont vides, les mettre à null
                    if (!updatedNotes) {
                        updatedNotes = null;
                    }
                    
                    const updateResponse = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            deliveryNotes: updatedNotes
                        })
                    });
                    
                    if (updateResponse.ok) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                }
            } catch (error) {
                console.error(`Erreur pour la commande ${orderId}:`, error);
                errorCount++;
            }
        }
        
        if (successCount > 0) {
            showAlert('feedbacks-section', `${successCount} retour(s) supprimé(s) avec succès`, 'success');
            loadFeedbacks(); // Recharger la liste
        }
        
        if (errorCount > 0) {
            showAlert('feedbacks-section', `Erreur lors de la suppression de ${errorCount} retour(s)`, 'error');
        }
        
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showAlert('feedbacks-section', 'Erreur lors de la suppression des retours', 'error');
    }
}

// Synchronisation initiale au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Synchroniser les produits existants après un délai
    setTimeout(syncWithBoutique, 2000);
    
    // Intercepter l'accès aux paramètres
    setupSettingsAccess();
    
    // Initialiser la gestion de la sécurité
    initSecurityManagement();
});

// =========================
// SYSTÈME D'ACCÈS RESTREINT AUX PARAMÈTRES
// =========================

// Session d'accès aux paramètres
let settingsAccessGranted = false;
let settingsAccessExpiry = null;

function setupSettingsAccess() {
    const settingsMenuItem = document.querySelector('[data-section="settings"]');
    if (settingsMenuItem) {
        // Supprimer l'ancien gestionnaire d'événements
        settingsMenuItem.removeEventListener('click', handleSettingsAccess);
        // Ajouter le nouveau gestionnaire
        settingsMenuItem.addEventListener('click', handleSettingsAccess);
    }
}

function handleSettingsAccess(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Vérifier si l'accès est déjà accordé et non expiré
    if (settingsAccessGranted && settingsAccessExpiry && new Date() < settingsAccessExpiry) {
        showSection('settings');
        return;
    }
    
    // Réinitialiser l'accès et demander l'authentification
    settingsAccessGranted = false;
    settingsAccessExpiry = null;
    openAccessModal();
}

// Ouvre la modale d'accès
function openAccessModal() {
    const modal = document.getElementById('access-modal');
    if (modal) {
    modal.classList.remove('modal-hidden');
    modal.style.display = 'flex';
    document.getElementById('access-code').value = '';
    document.getElementById('access-error').classList.add('hidden');
    document.getElementById('access-loading').classList.add('hidden');
        
        // Focus sur le champ de saisie
        setTimeout(() => {
            document.getElementById('access-code').focus();
        }, 100);
    }
}

// Ferme la modale d'accès et redirige vers le tableau de bord
function closeAccessModal() {
    const modal = document.getElementById('access-modal');
    if (modal) {
        // Cacher proprement la modale
        modal.classList.add('modal-hidden');
        modal.style.display = 'none';

        // Réinitialiser le formulaire et les états
        document.getElementById('access-code').value = '';
        document.getElementById('access-error').classList.add('hidden');
        document.getElementById('access-loading').classList.add('hidden');

        // Réinitialiser l'état d'accès (annulation explicite)
        settingsAccessGranted = false;
        settingsAccessExpiry = null;

        // Rediriger vers le tableau de bord principal
        showSection('dashboard');

        // Mettre à jour le menu actif
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('[data-section="dashboard"]').classList.add('active');
    }
}

// Vérifie le code d'accès via l'API
async function validateAccessCode() {
    const codeInput = document.getElementById('access-code');
    const errorDiv = document.getElementById('access-error');
    const loadingDiv = document.getElementById('access-loading');
    const confirmBtn = document.querySelector('#access-modal .action-btn');
    
    const code = codeInput.value.trim();
    
    if (!code) {
        showAccessError('Veuillez entrer un code d\'accès.');
        return;
    }
    
    // Afficher le loading et désactiver le bouton
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Vérification...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth-codes/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Si la modale a été fermée entre-temps (Annuler), ne pas accorder l'accès
            const modalNow = document.getElementById('access-modal');
            if (!modalNow || modalNow.style.display === 'none' || modalNow.classList.contains('modal-hidden')) {
                // Ne rien faire si l'utilisateur a annulé
                return;
            }
            // Accès accordé pour 1 heure
            settingsAccessGranted = true;
            settingsAccessExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
            
            closeAccessModal();
            showSection('settings');
            
            // Afficher un message de succès temporaire
            showTemporaryMessage('Accès autorisé aux paramètres administrateur !', 'success');
            
        } else {
            showAccessError(result.message || 'Code d\'accès incorrect.');
        }
        
    } catch (error) {
        console.error('Erreur lors de la validation:', error);
        showAccessError('Erreur de connexion. Vérifiez que l\'API est démarrée.');
    } finally {
        // Réactiver le bouton et masquer le loading
    loadingDiv.classList.add('hidden');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirmer';
    }
}

// Affiche une erreur dans la modale
function showAccessError(message) {
    const errorDiv = document.getElementById('access-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

// Affiche un message temporaire
function showTemporaryMessage(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} temporary-alert`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        background-color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    // Animation d'entrée
    setTimeout(() => {
        alertDiv.style.opacity = '1';
        alertDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique après 3 secondes
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, 3000);
}

// Gestion de la fermeture avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('access-modal');
        if (modal && modal.style.display === 'flex') {
            closeAccessModal();
        }
    }
});

// Gestion de l'appui sur Entrée dans le champ de code
document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('access-code');
    if (codeInput) {
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validateAccessCode();
            }
        });
    }
});

// =========================
// GESTION DU CODE D'ACCÈS MAÎTRE
// =========================

function initSecurityManagement() {
    // Charger les informations de sécurité
    loadSecurityStats();
    
    // Event listener pour le bouton de changement de code maître
    const changeCodeBtn = document.getElementById('change-master-code');
    if (changeCodeBtn) {
        changeCodeBtn.addEventListener('click', async function(e) {
            const currentUser = JSON.parse(localStorage.getItem('fadidiCurrentAdmin') || '{}');
            let isProtectedSuperadmin = false;
            let dbSuperadmin = null;
            try {
                // Vérification API : charger l'utilisateur depuis la base
                const res = await fetch('http://localhost:3000/api/users');
                const users = await res.json();
                dbSuperadmin = users.find(u => u.email === 'superadmin@fadidi.com' && u.role === 'superadmin');
                console.log('DEBUG currentUser:', currentUser);
                console.log('DEBUG dbSuperadmin:', dbSuperadmin);
                if (dbSuperadmin && currentUser.email === dbSuperadmin.email && currentUser.role === dbSuperadmin.role) {
                    isProtectedSuperadmin = true;
                }
            } catch (err) {
                console.error('Erreur API vérification superadmin:', err);
            }
            if (!isProtectedSuperadmin) {
                e.preventDefault();
                showAlert('alert-container', "Vous n'êtes pas autorisé à modifier le code d'accès maître. Seul le superadmin protégé peut effectuer cette action.", 'error');
                return;
            }
            openMasterCodeModal();
        });
    }

    // Event listener pour le bouton de changement mot de passe superadmin
    const changeSuperadminBtn = document.getElementById('change-superadmin-password');
    if (changeSuperadminBtn) {
        changeSuperadminBtn.addEventListener('click', openSuperadminPasswordModal);
    }

    // Event listener pour le formulaire de changement code maître
    const form = document.getElementById('change-master-code-form');
    if (form) {
        form.addEventListener('submit', handleMasterCodeChange);
    }

    // Event listener pour le formulaire de changement mot de passe superadmin
    const superadminForm = document.getElementById('change-superadmin-password-form');
    if (superadminForm) {
        superadminForm.addEventListener('submit', handleSuperadminPasswordChange);
    }

    // Boutons fermeture/annulation modale superadmin
    const closeSuperadminBtn = document.getElementById('close-superadmin-password-modal');
    const cancelSuperadminBtn = document.getElementById('cancel-superadmin-password');
    if (closeSuperadminBtn) closeSuperadminBtn.addEventListener('click', closeSuperadminPasswordModal);
    if (cancelSuperadminBtn) cancelSuperadminBtn.addEventListener('click', closeSuperadminPasswordModal);
// Ouvre la modale de changement mot de passe superadmin
function openSuperadminPasswordModal() {
    const modal = document.getElementById('change-superadmin-password-modal');
    if (modal) {
        modal.classList.remove('modal-hidden');
        modal.style.display = 'flex'; // Pour garder le centrage flex si besoin
        document.getElementById('change-superadmin-password-form').reset();
        document.getElementById('superadmin-password-error').style.display = 'none';
        document.getElementById('superadmin-password-result').innerHTML = '';
        setTimeout(() => {
            document.getElementById('current-superadmin-password').focus();
        }, 100);
    }
}

function closeSuperadminPasswordModal() {
    const modal = document.getElementById('change-superadmin-password-modal');
    if (modal) {
        modal.classList.add('modal-hidden');
        modal.style.display = '';
    }
}

// Handler submit (à compléter pour l'appel API)
async function handleSuperadminPasswordChange(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('superadmin-password-error');
    const resultDiv = document.getElementById('superadmin-password-result');
    errorDiv.style.display = 'none';
    resultDiv.innerHTML = '';

    const selectedEmail = document.getElementById('superadmin-email').value;
    const currentPassword = document.getElementById('current-superadmin-password').value.trim();
    const newPassword = document.getElementById('new-superadmin-password').value.trim();
    const confirmPassword = document.getElementById('confirm-superadmin-password').value.trim();

    // Validation côté client
    if (!selectedEmail || !currentPassword || !newPassword || !confirmPassword) {
        errorDiv.textContent = 'Tous les champs sont requis.';
        errorDiv.style.display = 'block';
        return;
    }
    if (newPassword.length < 6) {
        errorDiv.textContent = 'Le nouveau mot de passe doit contenir au moins 6 caractères.';
        errorDiv.style.display = 'block';
        return;
    }
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'Les mots de passe ne correspondent pas.';
        errorDiv.style.display = 'block';
        return;
    }
    if (newPassword === currentPassword) {
        errorDiv.textContent = 'Le nouveau mot de passe doit être différent de l\'ancien.';
        errorDiv.style.display = 'block';
        return;
    }

    // Utiliser l'email sélectionné
    const superadminEmail = selectedEmail;
    try {
        // Vérifier le mot de passe actuel via login
        const loginRes = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: superadminEmail, password: currentPassword })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok || !loginData.access_token) {
            errorDiv.textContent = 'Mot de passe actuel incorrect.';
            errorDiv.style.display = 'block';
            return;
        }
        // Récupérer l'id du superadmin
        const userRes = await fetch(`http://localhost:3000/api/users`);
        const users = await userRes.json();
        const superadmin = users.find(u => u.email === superadminEmail);
        if (!superadmin) {
            errorDiv.textContent = 'Superadmin introuvable.';
            errorDiv.style.display = 'block';
            return;
        }
        // Changer le mot de passe via l'API
        const updateRes = await fetch(`http://localhost:3000/api/users/${superadmin.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword })
        });
        if (updateRes.ok) {
            resultDiv.innerHTML = '<span style="color:#27ae60">Mot de passe modifié avec succès !</span>';
            setTimeout(closeSuperadminPasswordModal, 1200);
        } else {
            let errorMsg = 'Erreur lors de la modification.';
            try {
                const errorData = await updateRes.json();
                if (errorData && errorData.message) errorMsg += ' ' + errorData.message;
            } catch {}
            errorDiv.textContent = errorMsg;
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'Erreur inattendue : ' + err.message;
        errorDiv.style.display = 'block';
    }
}
}

async function loadSecurityStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/security-settings/stats`);
        const result = await response.json();
        
        if (result.success) {
            updateSecurityDisplay(result.data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques de sécurité:', error);
    }
}

function updateSecurityDisplay(stats) {
    const statusElement = document.getElementById('current-master-status');
    const dateElement = document.getElementById('last-update-date');
    
    if (statusElement) {
        if (stats.hasCustomMasterCode) {
            statusElement.innerHTML = '<span class="security-status custom">Code personnalisé</span>';
        } else {
            statusElement.innerHTML = '<span class="security-status default">Code par défaut</span>';
        }
    }
    
    if (dateElement) {
        if (stats.masterCodeLastUpdated) {
            const date = new Date(stats.masterCodeLastUpdated);
            dateElement.textContent = date.toLocaleString('fr-FR');
        } else {
            dateElement.textContent = 'Jamais modifié';
        }
    }
}

function openMasterCodeModal() {
    const modal = document.getElementById('change-master-code-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Reset du formulaire
        document.getElementById('change-master-code-form').reset();
        document.getElementById('master-code-error').style.display = 'none';
        document.getElementById('master-code-loading').style.display = 'none';
        
        // Focus sur le premier champ
        setTimeout(() => {
            document.getElementById('current-master-code').focus();
        }, 100);
    }
}

function closeMasterCodeModal() {
    const modal = document.getElementById('change-master-code-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function handleMasterCodeChange(e) {
    e.preventDefault();
    
    const currentCode = document.getElementById('current-master-code').value.trim();
    const newCode = document.getElementById('new-master-code').value.trim();
    const confirmCode = document.getElementById('confirm-master-code').value.trim();
    
    const errorDiv = document.getElementById('master-code-error');
    const loadingDiv = document.getElementById('master-code-loading');
    const submitBtn = document.getElementById('save-master-code');
    
    // Validation côté client
    if (!currentCode || !newCode || !confirmCode) {
        showMasterCodeError('Tous les champs sont requis.');
        return;
    }
    
    if (newCode.length < 6) {
        showMasterCodeError('Le nouveau code doit contenir au moins 6 caractères.');
        return;
    }
    
    if (newCode !== confirmCode) {
        showMasterCodeError('Les nouveaux codes ne correspondent pas.');
        return;
    }
    
    if (newCode === currentCode) {
        showMasterCodeError('Le nouveau code doit être différent de l\'ancien.');
        return;
    }
    
    // Afficher le loading
    errorDiv.style.display = 'none';
    loadingDiv.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mise à jour...';
    
    try {
        // D'abord valider le code actuel
        const validateResponse = await fetch(`${API_BASE_URL}/security-settings/validate-current-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: currentCode })
        });
        
        const validateResult = await validateResponse.json();
        
        if (!validateResult.success || !validateResult.valid) {
            showMasterCodeError('Le code d\'accès actuel est incorrect.');
            return;
        }
        
        // Ensuite mettre à jour le code
        const updateResponse = await fetch(`${API_BASE_URL}/security-settings/update-master-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentCode: currentCode,
                newCode: newCode,
                confirmCode: confirmCode
            })
        });
        
        const updateResult = await updateResponse.json();
        
        if (updateResult.success) {
            // Succès
            closeMasterCodeModal();
            showTemporaryMessage('Code d\'accès maître mis à jour avec succès !', 'success');
            
            // Recharger les stats de sécurité
            setTimeout(() => {
                loadSecurityStats();
            }, 500);
            
        } else {
            showMasterCodeError(updateResult.message || 'Erreur lors de la mise à jour du code.');
        }
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        showMasterCodeError('Erreur de connexion. Vérifiez que l\'API est démarrée.');
    } finally {
        // Réactiver le bouton
        loadingDiv.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Sauvegarder';
    }
}

function showMasterCodeError(message) {
    const errorDiv = document.getElementById('master-code-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Gestion des événements clavier pour la modale
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('change-master-code-modal');
    if (modal && modal.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeMasterCodeModal();
        }
    }
});

// Validation en temps réel des mots de passe
document.addEventListener('DOMContentLoaded', function() {
    const newCodeInput = document.getElementById('new-master-code');
    const confirmCodeInput = document.getElementById('confirm-master-code');
    
    if (newCodeInput && confirmCodeInput) {
        function validatePasswords() {
            const newCode = newCodeInput.value;
            const confirmCode = confirmCodeInput.value;
            
            if (confirmCode && newCode !== confirmCode) {
                confirmCodeInput.style.borderColor = '#e74c3c';
            } else {
                confirmCodeInput.style.borderColor = '#ddd';
            }
        }
        
        newCodeInput.addEventListener('input', validatePasswords);
        confirmCodeInput.addEventListener('input', validatePasswords);
    }
});



    // Chargement et sauvegarde de la bannière dynamique
    // Synchronisation entre input color et input text pour la couleur
    function syncBannerColorInputs() {
        const colorInput = document.getElementById('banner-color');
        const colorText = document.getElementById('banner-color-text');
        colorInput.addEventListener('input', () => {
            colorText.value = colorInput.value;
        });
        colorText.addEventListener('input', () => {
            // Si la valeur est un code hex ou rgb valide, appliquer à l'input color
            let val = colorText.value.trim();
            if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val)) {
                colorInput.value = val;
            } else if (/^rgb\s*\((\s*\d+\s*,){2}\s*\d+\s*\)$/i.test(val)) {
                // Convertir rgb en hex pour l'input color
                let rgb = val.match(/\d+/g);
                if (rgb && rgb.length === 3) {
                    let hex = '#' + rgb.map(x => (+x).toString(16).padStart(2, '0')).join('');
                    colorInput.value = hex;
                }
            } else if (/^linear-gradient/i.test(val)) {
                // Si c'est un gradient, ne rien faire sur l'input color (il restera sur la dernière couleur)
            }
        });
    }
    async function loadBannerForAdmin() {
        try {
            const res = await fetch('http://localhost:3000/api/annonces');
            if (!res.ok) throw new Error('API indisponible');
            const annonces = await res.json();
            const banner = annonces.find(a => a.active && (a.type === 'banner' || a.pageCible === 'boutique'));
            if (banner) {
                document.getElementById('banner-title').value = banner.titre || '';
                document.getElementById('banner-description').value = banner.description || '';
                let icon = '';
                if (banner.titre && /[\u2190-\u2BFF\u2600-\u27BF\uE000-\uF8FF\uD83C-\uDBFF\uDC00-\uDFFF]/.test(banner.titre)) {
                    icon = banner.titre.match(/[\u2190-\u2BFF\u2600-\u27BF\uE000-\uF8FF\uD83C-\uDBFF\uDC00-\uDFFF]/)?.[0] || '';
                }
                document.getElementById('banner-icon').value = icon;
                document.getElementById('banner-animation').value = banner.animation || '';
                // Couleur, police, taille (si stockées dans description sous forme JSON)
                let color = '#ff9900', font = 'inherit', fontSize = 32;
                if (banner.description && banner.description.startsWith('{')) {
                    try {
                        const descObj = JSON.parse(banner.description);
                        if (descObj.color) color = descObj.color;
                        if (descObj.font) font = descObj.font;
                        if (descObj.fontSize) fontSize = descObj.fontSize;
                        document.getElementById('banner-description').value = descObj.text || '';
                    } catch {}
                }
                document.getElementById('banner-color').value = color;
                document.getElementById('banner-color-text').value = color;
                document.getElementById('banner-font').value = font;
                document.getElementById('banner-fontsize').value = fontSize;
            }
        } catch (e) {}
    }
    async function saveBanner() {
        const titre = document.getElementById('banner-title').value.trim();
        const description = document.getElementById('banner-description').value.trim();
        const icon = document.getElementById('banner-icon').value;
        const animation = document.getElementById('banner-animation').value;
        // Prendre la couleur depuis l'input texte si non vide, sinon depuis l'input color
        let color = document.getElementById('banner-color-text').value.trim() || document.getElementById('banner-color').value;
        const font = document.getElementById('banner-font').value;
        const fontSize = parseInt(document.getElementById('banner-fontsize').value, 10) || 32;
        if (!titre) {
            document.getElementById('banner-form-result').innerHTML = '<span style="color:red">Le texte principal est requis.</span>';
            return;
        }
        let titreFinal = icon && !titre.includes(icon) ? icon + ' ' + titre : titre;
        let bannerId = null;
        try {
            const res = await fetch('http://localhost:3000/api/annonces');
            if (res.ok) {
                const annonces = await res.json();
                const banner = annonces.find(a => a.type === 'banner' || a.pageCible === 'boutique');
                if (banner) bannerId = banner.id;
            }
        } catch {}
        // On encode la couleur/police/taille dans description (JSON)
        const descObj = { text: description, color, font, fontSize };
        // Ajout image base64 si présente, avec champs obligatoires
        let images = [];
        const imgBase64 = document.getElementById('banner-image-base64').value;
        if (imgBase64) {
            images.push({
                titre: 'Bannière boutique',
                description: '',
                type: 'image',
                imageBase64: imgBase64
            });
        }
        const dto = {
            type: 'banner',
            titre: titreFinal,
            description: JSON.stringify(descObj),
            pageCible: 'boutique',
            animation,
            active: true,
            images
        };
        let method = bannerId ? 'PATCH' : 'POST';
        let url = bannerId ? `http://localhost:3000/api/annonces/${bannerId}` : 'http://localhost:3000/api/annonces';
        const res2 = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (res2.ok) {
            document.getElementById('banner-form-result').innerHTML = '<span style="color:green">Bannière enregistrée !</span>';
        } else {
            document.getElementById('banner-form-result').innerHTML = '<span style="color:red">Erreur lors de l\'enregistrement.</span>';
        }
    }
// Gestion du champ image pour la bannière (base64 preview)
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('banner-image');
    if (input) {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('banner-image-preview');
            const hidden = document.getElementById('banner-image-base64');
            if (!file) {
                preview.innerHTML = '';
                hidden.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(evt) {
                hidden.value = evt.target.result;
                preview.innerHTML = `<img src="${evt.target.result}" alt="Aperçu" style="max-width:200px;max-height:100px;">`;
            };
            reader.readAsDataURL(file);
        });
    }
});
    document.addEventListener('DOMContentLoaded', () => { loadBannerForAdmin(); syncBannerColorInputs(); });



      
    // Navigation sidebar pour la section bannière
    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
            if (section === 'banner') {
                document.getElementById('banner-section').classList.remove('hidden');
            } else if (document.getElementById(section+'-section')) {
                document.getElementById(section+'-section').classList.remove('hidden');
            }
            document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
        });
    });
    