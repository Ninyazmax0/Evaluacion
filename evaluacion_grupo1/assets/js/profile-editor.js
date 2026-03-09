// ========================================
// EDITOR DE PERFILES - Profile Editing System
// ========================================
// Sistema para editar bio, tags y redes sociales de usuarios

import { db } from './firebase-config.js';
import { doc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Mostrar modal de edición
export function openEditProfileModal(userData) {
    const modalHTML = `
        <div id="edit-profile-modal" class="fixed inset-0 bg-[#0f1016]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div class="bg-[#1a1b26]/90 border border-[#414868] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                
                <!-- Header with Glass Effect -->
                <div class="sticky top-0 z-10 bg-[#1a1b26]/95 backdrop-blur-xl border-b border-[#414868] p-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Editar Identidad
                    </h2>
                    <button onclick="closeEditProfileModal()" class="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                
                <form id="edit-profile-form" class="p-8 space-y-8">
                    <!-- Bio Section -->
                    <div class="space-y-2">
                        <label class="text-sm font-semibold text-gray-300 uppercase tracking-wider">Tu Historia (Bio)</label>
                        <div class="relative group">
                            <textarea
                                id="edit-bio"
                                maxlength="200"
                                rows="3"
                                class="w-full px-5 py-4 bg-[#24283b] border border-[#414868] rounded-xl text-gray-200 resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
                                placeholder="Escribe algo legendario..."
                            >${userData.bio || ''}</textarea>
                            <div class="absolute bottom-3 right-3 text-xs text-gray-500 font-mono bg-[#1a1b26] px-2 py-1 rounded ml-auto">
                                <span id="bio-count">0</span>/200
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tags Section -->
                    <div class="space-y-2">
                        <div class="flex justify-between items-end">
                            <label class="text-sm font-semibold text-gray-300 uppercase tracking-wider">Etiquetas</label>
                            <span class="text-xs text-gray-500">Máx. 5 habilidades</span>
                        </div>
                        
                        <div class="bg-[#24283b] border border-[#414868] rounded-xl p-4 transition-all focus-within:border-purple-500/50">
                            <div id="tags-container" class="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                                <!-- Dynamic Tags Injected Here -->
                            </div>
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    id="new-tag-input"
                                    maxlength="20"
                                    class="flex-1 bg-transparent border-none text-gray-200 placeholder-gray-600 focus:ring-0 p-0"
                                    placeholder="Agrega una skill (ej. React, Python)..."
                                >
                                <button type="button" onclick="addTag()" class="text-purple-400 hover:text-purple-300 transition-colors font-medium text-sm">
                                    + AGREGAR
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Visual Identity -->
                    <div class="space-y-4">
                        <label class="text-sm font-semibold text-gray-300 uppercase tracking-wider">Identidad Visual</label>
                        
                        <!-- Avatar Selection -->
                        <div class="bg-[#24283b] p-4 rounded-xl border border-[#414868]">
                            <label class="text-xs text-gray-500 mb-2 block">Seleccionar Avatar</label>
                            <div class="flex gap-2 overflow-x-auto pb-2 mb-3" id="avatar-selector">
                                <!-- Injected via JS -->
                            </div>
                            
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-gray-500 whitespace-nowrap">O URL propia:</span>
                                <input
                                    type="url"
                                    id="edit-avatar-url"
                                    value="${userData.avatar && userData.avatar.startsWith('http') ? userData.avatar : ''}"
                                    class="w-full bg-transparent border-none text-sm text-gray-300 placeholder-gray-600 focus:ring-0 p-0"
                                    placeholder="https://..."
                                >
                            </div>
                        </div>

                        <div class="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-between">
                            <span class="text-xs text-purple-300">Los marcos se cambian desde el botón "Mis Marcos" en tu perfil.</span>
                            <i data-lucide="info" class="w-4 h-4 text-purple-400"></i>
                        </div>
                    </div>

                    <!-- Social Grid -->
                    <div class="space-y-4">
                        <label class="text-sm font-semibold text-gray-300 uppercase tracking-wider">Conexiones (Social)</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${Object.entries({
                                github: 'github',
                                instagram: 'instagram',
                                twitter: 'twitter',
                                linkedin: 'linkedin',
                                website: 'link'
                            }).map(([key, icon]) => `
                                <div class="flex items-center gap-3 bg-[#24283b] p-3 rounded-lg border border-[#414868] focus-within:border-blue-500/50 transition-colors group">
                                    <i data-lucide="${icon}" class="w-5 h-5 text-gray-500 group-focus-within:text-blue-400"></i>
                                    <input
                                        type="text"
                                        id="edit-${key}"
                                        value="${userData.socialLinks?.[key] || ''}"
                                        class="w-full bg-transparent border-none text-sm text-gray-300 focus:ring-0 p-0 placeholder-gray-600"
                                        placeholder="${key}"
                                    >
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Footer Actions -->
                    <div class="flex gap-4 pt-6 mt-8 border-t border-[#414868]">
                        <button
                            type="button"
                            onclick="closeEditProfileModal()"
                            class="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all text-sm tracking-wide"
                        >
                            GUARDAR CAMBIOS
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Populate Avatar Selector
    import('./predefined-profiles.js').then(({ PREDEFINED_AVATARS, PROFILE_AURAS }) => {
        // Avatars
        const avatarSelector = document.getElementById('avatar-selector');
        if(avatarSelector) {
            avatarSelector.innerHTML = PREDEFINED_AVATARS.map(av => `
                <img src="${av.url}" title="${av.name}" onclick="selectAvatar('${av.url}')" 
                     class="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform border-2 border-transparent hover:border-purple-500">
            `).join('');
            
            window.selectAvatar = (url) => {
                document.getElementById('edit-avatar-url').value = url;
            };
        }

        // Auras/Frames
        const frameSelector = document.getElementById('frame-selector');
        if (frameSelector && PROFILE_AURAS) {
            // Solo mostrar marcos que el usuario POSEE
            const inventory = userData.inventory?.auras || [];
            
            frameSelector.innerHTML = PROFILE_AURAS.map(aura => {
                const isOwned = inventory.includes(aura.id) || aura.price === 0; // 0 price are usually achievements/defaults
                if (!isOwned && aura.id !== 'aura-none') return '';

                if(aura.id === 'aura-none') {
                     return `
                        <div onclick="selectFrame('${aura.id}')" 
                             class="group relative w-16 h-16 rounded-xl border border-gray-700 hover:border-purple-500 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${userData.equippedAura === aura.id ? 'ring-2 ring-purple-500 bg-purple-500/20' : ''}"
                             id="frame-option-${aura.id}">
                            <i data-lucide="ban" class="w-6 h-6 text-gray-500"></i>
                            <span class="text-[10px] text-gray-400">Sin Marco</span>
                        </div>`;
                }
                return `
                <div onclick="selectFrame('${aura.id}')" 
                     class="group relative w-16 h-16 rounded-xl border border-gray-700 hover:border-purple-500 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${userData.equippedAura === aura.id ? 'ring-2 ring-purple-500 bg-purple-500/20' : ''}"
                     id="frame-option-${aura.id}">
                    <div class="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center overflow-hidden avatar-aura-container ${aura.cssClass}">
                        <div class="w-4 h-4 bg-gray-600 rounded-full"></div>
                    </div>
                    <span class="text-[10px] text-gray-400 group-hover:text-white truncate max-w-full px-1">${aura.name}</span>
                </div>
            `}).join('');

            // Helper for frames
            window.selectFrame = (id) => {
                // Update Hidden Input for saving
                const input = document.getElementById('edit-frame-input');
                if(input) input.value = id;

                // Visual Feedback
                document.querySelectorAll('[id^="frame-option-"]').forEach(el => {
                    el.classList.remove('ring-2', 'ring-purple-500', 'bg-purple-500/20');
                });
                const selected = document.getElementById(`frame-option-${id}`);
                if(selected) selected.classList.add('ring-2', 'ring-purple-500', 'bg-purple-500/20');
            };
        }
    });

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    
    // Contador de bio
    const bioTextarea = document.getElementById('edit-bio');
    const bioCount = document.getElementById('bio-count');
    bioCount.textContent = bioTextarea.value.length;
    bioTextarea.addEventListener('input', () => {
        bioCount.textContent = bioTextarea.value.length;
    });
    
    // Form submit
    document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProfileChanges(userData.id);
    });
    
    // Re-init lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Cerrar modal
window.closeEditProfileModal = function() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) modal.remove();
};

// Agregar tag
let currentTags = [];
window.addTag = function() {
    const input = document.getElementById('new-tag-input');
    const tag = input.value.trim();
    
    if (!tag) return;
    if (currentTags.length >= 5) {
        alert('Máximo 5 etiquetas permitidas');
        return;
    }
    if (currentTags.includes(tag)) {
        alert('Esta etiqueta ya existe');
        return;
    }
    
    currentTags.push(tag);
    input.value = '';
    renderTags();
};

// Remover tag
window.removeTag = function(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    renderTags();
};

// Renderizar tags
export function renderTags() {
    const container = document.getElementById('tags-container');
    if (!container) return console.warn('Tags container not found');

    container.innerHTML = currentTags.map(tag => `
        <span class="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center gap-2">
            ${tag}
            <button type="button" onclick="removeTag('${tag}')" class="hover:text-red-400">
                <i data-lucide="x" class="w-3 h-3"></i>
            </button>
        </span>
    `).join('');

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Guardar cambios
export async function saveProfileChanges(userId) {
    const bio = document.getElementById('edit-bio').value.trim();
    const avatarUrl = document.getElementById('edit-avatar-url').value.trim();
    const github = document.getElementById('edit-github').value.trim();
    const instagram = document.getElementById('edit-instagram').value.trim();
    const twitter = document.getElementById('edit-twitter').value.trim();
    const linkedin = document.getElementById('edit-linkedin').value.trim();
    const website = document.getElementById('edit-website').value.trim();
    
    const updatedData = {
        bio,
        tags: currentTags,
        socialLinks: {
            github,
            instagram,
            twitter,
            linkedin,
            website
        },
        equippedAura: document.getElementById('edit-frame-input').value,
        // Si hay URL de avatar manual, actualizar también
        ...(avatarUrl ? { avatar: avatarUrl } : {})
    };
    
    try {
        // Actualizar Firebase
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, updatedData);
        
        // Actualizar localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.id === userId) {
            Object.assign(currentUser, updatedData);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        console.log('✅ Perfil actualizado');
        closeEditProfileModal();
        
        // Recargar página para ver cambios
        window.location.reload();
    } catch (error) {
        console.error('Error al guardar perfil:', error);
        alert('Error al guardar cambios. Intenta de nuevo.');
    }
}

// Inicializar tags del modal
export function initializeModalTags(tags) {
    currentTags = tags || [];
    renderTags();
}
