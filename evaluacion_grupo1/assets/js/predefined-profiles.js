// ========================================
// PERFILES PREDEFINIDOS - Steven & Amelia
// ========================================
// Perfiles automáticos con privilegios admin para los fundadores

import { db } from './firebase-config.js';
import { collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Datos predefinidos para Steven
const STEVEN_PROFILE = {
    id: 'steven',
    name: 'Steven',
    password: 'admin123',
    email: 'steven@statuscode418.dev',
    avatar: 'https://i.ibb.co/9HGqpf0B/Captura-de-pantalla-2025-06-21-205156.png',
    bio: 'Frontend perfectionist. Si hay un píxel fuera de lugar, no duermo hasta arreglarlo. Fundador de Status Code 418. 💙',
    tags: ['Frontend', 'UX/UI', 'Design', 'Perfectionist', 'Coffee'],
    socialLinks: { github: '', instagram: '', twitter: '', linkedin: '', website: '' },
    isAdmin: true,
    isOnline: false,
    rank: 'Owner',
    xp: 9999,
    equippedAura: 'aura-bride-time',
    achievements: ['first_login', 'web_master', 'python_master', 'ruby_master', 'db_master', 'pixel_perfect', 'dream_architect', 'coffee_overdose', 'bug_lord', 'frontend_god', 'steven_moon', 'marriage_contract'],
    registeredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    // Desbloquear todo
    webProgress: { unlockedLevel: 99, completedLevels: Array.from({ length: 20 }, (_, i) => i), quizScores: {} },
    pythonProgress: { unlockedLevel: 99, completedLevels: Array.from({ length: 20 }, (_, i) => i), quizScores: {} },
    rubyProgress: { unlockedLevel: 99, completedLevels: Array.from({ length: 20 }, (_, i) => i), quizScores: {} },
    databaseProgress: { unlockedLevel: 99, completedLevels: Array.from({ length: 20 }, (_, i) => i), quizScores: {} },
    quizHistory: []
};

const AMELIA_PROFILE = {
    id: 'amelia',
    name: 'Amelia',
    password: 'admin123',
    email: 'amelia@statuscode418.dev',
    avatar: 'https://cdn.myanimelist.net/images/characters/8/239523.jpg',
    bio: 'Backend wizard. Drama queen con 5 copias de seguridad de tus copias de seguridad. Coffee addict. Co-fundadora de Status Code 418. 💜',
    tags: ['Backend', 'Firebase', 'Architecture', 'Coffee', 'TypeScript'],
    socialLinks: { github: '', instagram: '', twitter: '', linkedin: '', website: '' },
    isAdmin: true,
    isOnline: false,
    rank: 'Co-Owner',
    xp: 9999,
    achievements: ['first_login', 'web_master', 'python_master', 'ruby_master', 'db_master', 'backend_queen', 'database_keeper', 'logic_master', 'server_whisperer', 'security_protocol'],
    registeredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    // Desbloquear todo
    webProgress: { unlockedLevel: 99, completedLevels: Array.from({ length: 20 }, (_, i) => i), quizScores: {} },
    pythonProgress: { unlockedLevel: 99, completedLevels: Array.from({ length: 20 }, (_, i) => i), quizScores: {} },
    rubyProgress: { unlockedLevel: 99, completedLevels: Array.from({ length: 20 }, (_, i) => i), quizScores: {} },
    databaseProgress: { unlockedLevel: 99, completedLevels: Array.from({ length: 20 }, (_, i) => i), quizScores: {} },
    quizHistory: []
};

// === FUNCIONES EXPORTADAS ===

export function isSteven(username) {
    return username && (username.toLowerCase() === 'steven' || username.toLowerCase() === 'steven-founder');
}

export function isAmelia(username) {
    return username && (username.toLowerCase() === 'amelia' || username.toLowerCase() === 'amelia-founder');
}

export function getPredefinedProfile(username) {
    if (isSteven(username)) return STEVEN_PROFILE;
    if (isAmelia(username)) return AMELIA_PROFILE;
    return null;
}

/**
 * Asegura que los perfiles de Steven y Amelia existan en Firestore
 * Se llama al iniciar la app (opcional, desde index.html)
 */
export async function initializePredefinedProfiles() {
    try {
        const stevenRef = doc(db, 'users', 'steven');
        const ameliaRef = doc(db, 'users', 'amelia');

        // Check Steven
        const stevenSnap = await getDoc(stevenRef);
        if (!stevenSnap.exists()) {
            console.log('✨ Inicializando perfil de Steven...');
            await setDoc(stevenRef, { ...STEVEN_PROFILE, id: 'steven' });
        }

        // Check Amelia
        const ameliaSnap = await getDoc(ameliaRef);
        if (!ameliaSnap.exists()) {
            console.log('✨ Inicializando perfil de Amelia...');
            await setDoc(ameliaRef, { ...AMELIA_PROFILE, id: 'amelia' });
        }
        
    } catch (e) {
        console.error('Error inicializando perfiles predefinidos:', e);
        // Re-lanzar para que index.html sepa que falló (especialmente por permisos)
        throw e;
    }
}

/**
 * Mezcla los datos predefinidos con los datos del usuario
 * Asegura que Steven y Amelia siempre tengan sus badges y permisos
 */
// === COSMÉTICOS DEFINIDOS ===
// Ahora usamos "Auras" (CSS classes) en lugar de imágenes estáticas

export const PROFILE_AURAS = [
    // === TIER 1: COMMON (Cost: 500 Coins) ===
    { id: 'aura-c-1', name: 'Iron Ring', cssClass: 'aura-c-1', price: 500, rarity: 'common', desc: 'Simple y resistente.' },
    { id: 'aura-c-2', name: 'Steel Shadow', cssClass: 'aura-c-2', price: 500, rarity: 'common', desc: 'Sombra de acero.' },
    { id: 'aura-c-3', name: 'Blue Tint', cssClass: 'aura-c-3', price: 500, rarity: 'common', desc: 'Un toque de color.' },
    { id: 'aura-c-4', name: 'Green Dash', cssClass: 'aura-c-4', price: 500, rarity: 'common', desc: 'Estilo punteado.' },
    { id: 'aura-c-5', name: 'Purple Double', cssClass: 'aura-c-5', price: 500, rarity: 'common', desc: 'Doble linea, doble estilo.' },

    // === TIER 2: RARE (Cost: 2000 Coins) ===
    { id: 'aura-r-1', name: 'Breathing Blue', cssClass: 'aura-r-1', price: 2000, rarity: 'rare', desc: 'Respira contigo.' },
    { id: 'aura-r-2', name: 'Spinning Gold', cssClass: 'aura-r-2', price: 2000, rarity: 'rare', desc: 'Rotación lenta y elegante.' },
    { id: 'aura-r-3', name: 'Green Pulse', cssClass: 'aura-r-3', price: 2000, rarity: 'rare', desc: 'Energía vital pulsante.' },
    { id: 'aura-r-4', name: 'Red Alert', cssClass: 'aura-r-4', price: 2000, rarity: 'rare', desc: 'Advertencia de peligro.' },
    { id: 'aura-r-5', name: 'Frozen Shards', cssClass: 'aura-r-5', price: 2000, rarity: 'rare', desc: 'Fragmentos de hielo afilado.' },

    // === TIER 3: EPIC (Cost: 5000 Coins) ===
    { id: 'aura-e-1', name: 'Neon Orbit', cssClass: 'aura-e-1', price: 5000, rarity: 'epic', desc: 'Luz de neón orbital.' },
    { id: 'aura-e-2', name: 'Magma Core', cssClass: 'aura-e-2', price: 5000, rarity: 'epic', desc: 'Núcleo volcánico.' },
    { id: 'aura-e-3', name: 'Toxic Storm', cssClass: 'aura-e-3', price: 5000, rarity: 'epic', desc: 'Tormenta radiactiva.' },
    { id: 'aura-e-4', name: 'Electric Storm', cssClass: 'aura-e-4', price: 5000, rarity: 'epic', desc: 'Alto voltaje.' },
    { id: 'aura-e-5', name: 'Gravity Well', cssClass: 'aura-e-5', price: 5000, rarity: 'epic', desc: 'Distorsión gravitacional.' },

    // === TIER 4: LEGENDARY (Cost: 10000 Coins) ===
    { id: 'aura-l-1', name: 'Timekeeper Nightmare', cssClass: 'aura-l-1', price: 10000, rarity: 'legendary', desc: 'El tiempo se distorsiona... tick tock.' },
    { id: 'aura-l-2', name: 'Glitch King', cssClass: 'aura-l-2', price: 10000, rarity: 'legendary', desc: 'Error crítico en la realidad.' },
    { id: 'aura-l-3', name: 'Divine Ascension', cssClass: 'aura-l-3', price: 10000, rarity: 'legendary', desc: 'Luz dorada celestial.' },
    { id: 'aura-l-4', name: 'Event Horizon', cssClass: 'aura-l-4', price: 10000, rarity: 'legendary', desc: 'Nada escapa del agujero negro.' },
    { id: 'aura-l-5', name: 'Dragon Emperor', cssClass: 'aura-l-5', price: 10000, rarity: 'legendary', desc: 'El aliento de los dragones.' },
    { id: 'aura-secret-time', name: 'Chronos', cssClass: 'aura-secret-time', price: 10000, rarity: 'legendary', desc: 'El tiempo es tuyo.' },

    // === TIER 5: COURSE EXCLUSIVES (Unlock: Completed Course) ===
    { id: 'aura-course-web', name: 'Web Master', cssClass: 'aura-course-web', price: 0, rarity: 'rare', unlockCondition: 'course_web_completed', desc: 'Maestro del HTML/CSS.' },
    { id: 'aura-course-py', name: 'Python Charmer', cssClass: 'aura-course-py', price: 0, rarity: 'rare', unlockCondition: 'course_python_completed', desc: 'Encantador de serpientes.' },
    { id: 'aura-course-ruby', name: 'Ruby Keeper', cssClass: 'aura-course-ruby', price: 0, rarity: 'rare', unlockCondition: 'course_ruby_completed', desc: 'Brillo de rubí.' },
    { id: 'aura-course-db', name: 'Data Guardian', cssClass: 'aura-course-db', price: 0, rarity: 'rare', unlockCondition: 'course_db_completed', desc: 'Guardián de los datos.' },
    { id: 'aura-course-logic', name: 'Logic Brain', cssClass: 'aura-course-logic', price: 0, rarity: 'rare', unlockCondition: 'course_logic_completed', desc: 'Mente puramente lógica.' },

    // === TIER 6: ACHIEVEMENT EXCLUSIVES ===
    { id: 'aura-ach-hunter', name: 'Trophy Hunter', cssClass: 'aura-ach-hunter', price: 0, rarity: 'epic', unlockCondition: 'achievement_hunter', desc: 'Para quien lo quiere todo.' },
    { id: 'aura-ach-perfect', name: 'Perfectionist', cssClass: 'aura-ach-perfect', price: 0, rarity: 'epic', unlockCondition: 'achievement_perfect', desc: '100% o nada.' },

    // === TIER 7: OWNER GOD-TIER ===
    { id: 'aura-founder-steven', name: 'The Architect', cssClass: 'aura-founder-steven', price: 999999, rarity: 'legendary', unlockCondition: 'is_steven', desc: 'Creador del Universo.' },
    { id: 'aura-founder-amelia', name: 'The Abyss', cssClass: 'aura-founder-amelia', price: 999999, rarity: 'legendary', unlockCondition: 'is_amelia', desc: 'Reina del Caos.' },

    // === TIER 8: SECRET (Hidden Unlocks) ===
    { id: 'aura-secret-nature', name: 'Life Cycle', cssClass: 'aura-secret-nature', price: 0, rarity: 'secret', unlockCondition: 'secret_konami', desc: 'Hojas que caen eternamente.' },
    { id: 'aura-secret-fire', name: 'Eternal Flame', cssClass: 'aura-secret-fire', price: 0, rarity: 'secret', unlockCondition: 'secret_fire', desc: 'Nunca se apaga.' },
    { id: 'aura-secret-hacker', name: 'Zero Day', cssClass: 'aura-secret-hacker', price: 0, rarity: 'secret', unlockCondition: 'secret_hack', desc: '01010101.' },
    
    // === TIER 9: DIVINE (The Moon) ===
    { id: 'aura-divine-moon', name: 'Luna Eterna', cssClass: 'aura-divine-moon', price: 0, rarity: 'secret', unlockCondition: 'steven_moon', desc: 'La única luna en su cielo nocturno.' },

    // === TIER 10: BRIDAL (The Surprise) ===
    { id: 'aura-bride-time', name: 'Bride of Time', cssClass: 'aura-bride-time', price: 0, rarity: 'secret', unlockCondition: 'marriage_contract', desc: 'El juramento de las manecillas.' }
];

export const PREDEFINED_AVATARS = []; // Deprecated, keeping empty array to prevent breakages if imported

export function applyAdminPrivileges(userData, username) {
    // Normalizar ID/Username para check
    const idToCheck = (userData.id || username).toLowerCase();

    if (idToCheck === 'steven' || idToCheck === 'steven-founder') {
        const base = STEVEN_PROFILE;
        // Merge but keep user password if changed
        return { ...userData, ...base, password: userData.password || base.password, equippedAura: 'aura-founder-steven' };
    }
    
    if (idToCheck === 'amelia' || idToCheck === 'amelia-founder') {
        const base = AMELIA_PROFILE;
        return { ...userData, ...base, password: userData.password || base.password, equippedAura: 'aura-founder-amelia' };
    }

    return userData;
}
