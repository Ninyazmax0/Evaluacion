// Profile Viewer - Supports viewing other users' profiles via URL parameters
// Usage: perfil_usuario.html?id=userId or perfil_usuario.html?user=userName

import { db } from './firebase-config.js';
import { doc, getDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getPredefinedProfile } from './predefined-profiles.js';

export async function initProfileViewer() {
    // Check if viewing another user's profile via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const viewingUserId = urlParams.get('id') || urlParams.get('user');
    
    let user;
    let isViewingOtherProfile = false;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (viewingUserId) {
        // Viewing another user's profile
        isViewingOtherProfile = true;
        user = await loadUserById(viewingUserId);

        if (!user) {
            showGlobalToast('Error 404', 'Usuario no encontrado.', 'error');
            setTimeout(() => window.location.href = 'leaderboard.html', 2000);
            return null;
        }

        // Hide edit button when viewing other profiles
        const actionButtons = document.getElementById('action-buttons');
        if (actionButtons) {
            actionButtons.style.display = 'none';
        }

        // Add "Back to Leaderboard" button
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            const backButton = document.createElement('div');
            backButton.className = 'mb-4';
            backButton.innerHTML = `
                <button onclick="window.location.href='leaderboard.html'" 
                        class="px-6 py-3 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition font-semibold flex items-center gap-2">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i> Volver al Ranking
                </button>
            `;
            profileCard.insertBefore(backButton, profileCard.firstChild);
            if (window.lucide) lucide.createIcons();
        }

    } else {
        // Viewing own profile
        if (!currentUser) {
            showGlobalToast('Error', 'Debes iniciar sesión para ver tu perfil.', 'error');
            window.location.href = 'index.html';
            return null;
        }

        user = await loadUserById(currentUser.id);

        if (!user) {
            showGlobalToast('Error 404', 'Usuario no encontrado en la base de datos.', 'error');
            window.location.href = 'index.html';
            return null;
        }
    }

    return { user, isViewingOtherProfile };
}

async function loadUserById(userId) {
    // 1. Check Predefined Profiles (Founders/Admins)
    // This ensures we always get the latest "Code-defined" version of Steven/Amelia
    const predefined = getPredefinedProfile(userId);
    if (predefined) {
        return predefined;
    }

    // Try to load from Firestore by ID first
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
    } catch (error) {
        console.error('Error loading user by ID:', error);
    }

    // Try to find by name
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('name', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        }
    } catch (error) {
        console.error('Error loading user by name:', error);
    }

    return null;
}
