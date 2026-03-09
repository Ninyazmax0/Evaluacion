/**
 * Módulo Firebase Config - Configuración centralizada de Firestore
 * Funciones helper para sincronización en tiempo real
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, updateDoc, deleteDoc, query, orderBy, addDoc, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

import { ENV } from './env.js';

// Configuración de Firebase
const firebaseConfig = ENV.FIREBASE_CONFIG;

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportar al objeto global para acceso desde HTML
window.firebaseApp = app;
window.firebaseAnalytics = analytics;
window.firebaseDb = db;
window.firebaseStorage = storage;

console.log('🔥 Firebase inicializado correctamente');

// ==================== FUNCIONES DE USUARIOS ====================

/**
 * Sincroniza un usuario a Firestore
 * @param {Object} user - Objeto usuario con todos los datos
 */
async function syncUserToFirestore(user) {
    try {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, {
            ...user,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        
        console.log('✅ Usuario sincronizado a Firestore:', user.name);
    } catch (error) {
        console.error('❌ Error al sincronizar usuario:', error);
        throw error;
    }
}

/**
 * Obtiene un usuario desde Firestore
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object|null>} - Datos del usuario o null
 */
async function getUserFromFirestore(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('❌ Error al obtener usuario:', error);
        return null;
    }
}

/**
 * Obtiene todos los usuarios desde Firestore
 * @returns {Promise<Array>} - Array de usuarios
 */
async function getAllUsersFromFirestore() {
    try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        
        return users;
    } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        return [];
    }
}

/**
 * Listener en tiempo real para todos los usuarios
 * @param {Function} callback - Función que se ejecuta cuando hay cambios
 * @returns {Function} - Función para detener el listener
 */
function listenToUsers(callback) {
    try {
        const usersRef = collection(db, 'users');
        
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                users.push(doc.data());
            });
            
            console.log('🔥 Actualización en tiempo real detectada:', users.length, 'usuarios');
            callback(users);
        });
        
        return unsubscribe;
    } catch (error) {
        console.error('❌ Error al configurar listener:', error);
        return () => {};
    }
}

// ==================== FUNCIONES DE PROGRESO ====================

/**
 * Actualiza el progreso de un curso para un usuario
 * @param {string} userId - ID del usuario
 * @param {string} courseKey - Clave del curso (webProgress, pythonProgress, etc)
 * @param {Object} progressData - Datos del progreso
 */
async function updateCourseProgress(userId, courseKey, progressData) {
    try {
        const userRef = doc(db, 'users', userId);
        
        await updateDoc(userRef, {
            [courseKey]: progressData,
            lastUpdated: new Date().toISOString()
        });
        
        console.log(`✅ Progreso de ${courseKey} actualizado`);
    } catch (error) {
        console.error('❌ Error al actualizar progreso:', error);
        throw error;
    }
}

/**
 * Actualiza el timestamp de última conexión del usuario (Heartbeat)
 * @param {string} userId - ID del usuario
 */
async function updateHeartbeat(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            lastSeen: new Date().toISOString(),
            isOnline: true
        });
        // Console log removed to avoid spam
    } catch (error) {
        // Silent fail for heartbeat
    }
}

/**
 * Marca al usuario como offline
 * @param {string} userId - ID del usuario
 */
async function setOffline(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            isOnline: false
        });
    } catch (error) {
        // Silent fail
    }
}

/**
 * Verifica si un usuario está online basado en su lastSeen timestamp
 * @param {Object} user - Objeto usuario
 * @param {number} timeoutMinutes - Tiempo en minutos para considerar offline (default: 5)
 * @returns {boolean}
 */
function isUserOnline(user, timeoutMinutes = 5) {
    if (!user.lastSeen) return false;
    const lastSeen = new Date(user.lastSeen);
    const now = new Date();
    const diffMinutes = (now - lastSeen) / (1000 * 60);
    return diffMinutes < timeoutMinutes;
}

/**
 * Elimina un usuario de Firestore
 * @param {string} userId - ID del usuario a eliminar
 */
async function deleteUserFromFirestore(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        await deleteDoc(userRef);
        console.log('🗑️ Usuario eliminado de Firestore:', userId);
    } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        throw error;
    }
}

// ==================== UI HELPERS (LOADING STATE) ====================

/**
 * Muestra el overlay de carga global
 * @param {string} message - Mensaje opcional
 */
function showLoading(message = 'Cargando...') {
    const overlay = document.getElementById('loading-overlay');
    const msgEl = document.getElementById('loading-message');
    if (overlay) {
        if (msgEl) msgEl.textContent = message;
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
    }
}

/**
 * Oculta el overlay de carga global
 */
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }
}

/**
 * Verifica conexión a internet/Firebase
 * @returns {boolean}
 */
function checkConnection() {
    if (!navigator.onLine) {
        if (window.showGlobalToast) {
            window.showGlobalToast('Sin Conexión', 'No tienes conexión a Internet.', 'error');
        } else {
            console.warn('Sin conexión a Internet');
        }
        return false;
    }
    return true;
}

// Exportar helpers de UI
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.checkConnection = checkConnection;

/**
 * Guarda una submission de desafío en Firestore
 * @param {Object} submission - Objeto de submission
 * @returns {Promise<string>} ID del documento
 */
async function saveSubmission(submission) {
    try {
        const submissionsRef = collection(db, 'submissions');
        // Aseguramos fecha de servidor para ordenamiento fiable si se requiere, 
        // pero por ahora usamos la fecha del cliente o simple string ISO.
        const docRef = await addDoc(submissionsRef, submission);
        console.log('✅ Submission guardada en Firestore:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error guardando submission:', error);
        throw error;
    }
}

// Exportar funciones
window.saveSubmission = saveSubmission;
window.syncUserToFirestore = syncUserToFirestore;
window.getUserFromFirestore = getUserFromFirestore;
window.getAllUsersFromFirestore = getAllUsersFromFirestore;
window.listenToUsers = listenToUsers;
window.updateCourseProgress = updateCourseProgress;
window.updateHeartbeat = updateHeartbeat;
window.setOffline = setOffline;
window.isUserOnline = isUserOnline;
window.deleteUserFromFirestore = deleteUserFromFirestore;

export {
    syncUserToFirestore,
    getUserFromFirestore,
    getAllUsersFromFirestore,
    listenToUsers,
    updateCourseProgress,
    updateHeartbeat,
    setOffline,
    isUserOnline,
    deleteUserFromFirestore,
    showLoading,
    hideLoading,
    checkConnection,
    checkFirestoreConnection,
    db,       // Exportar instancia de Firestore
    app,      // Exportar app
    storage,  // Exportar storage
    // Funciones de Firebase Firestore
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    onSnapshot,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    addDoc,
    serverTimestamp,
    where
};

/**
 * Verifica la conexión específica con Firestore intentando una lectura ligera
 * @returns {Promise<boolean>}
 */
async function checkFirestoreConnection() {
    try {
        // Intentamos leer el documento 'steven' que sé que "debería" estar o crearse.
        // Esto validará si tenemos permisos de lectura.
        const docRef = doc(db, 'users', 'steven');
        await getDoc(docRef); 
        return true;
    } catch (error) {
        console.error("🔥 Firestore Check Failed:", error.code, error.message);
        return false;
    }
}
