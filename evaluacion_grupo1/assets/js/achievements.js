/**
 * Achievements System for Status Code 418
 * Contains definitions and tracking logic.
 */

import { doc, updateDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

// === ACHIEVEMENT DEFINITIONS ===
export const achievements = [
    // --- LOGIN & BASICS ---
    { id: 'first_login', name: 'Hola Mundo', desc: 'Inicia sesión por primera vez.', hint: 'El primer paso siempre es el más difícil.', rarity: 'common', icon: 'log-in' },
    { id: 'night_owl', name: 'Night Owl', desc: 'Inicia sesión entre la 1 AM y las 4 AM.', hint: 'Los programadores no duermen.', rarity: 'epic', icon: 'moon' },
    { id: 'early_bird', name: 'Madrugador', desc: 'Inicia sesión entre las 5 AM y las 7 AM.', hint: 'Al que madruga Dios lo ayuda (a compilar).', rarity: 'rare', icon: 'sun' },
    
    // --- COURSES ---
    { id: 'polyglot_starter', name: 'Políglota Curioso', desc: 'Inicia los 4 cursos.', hint: 'Python, Ruby, Web, DB... ¿por qué elegir?', rarity: 'common', icon: 'languages' },
    { id: 'web_master', name: 'Lord of the DOM', desc: 'Completa el curso de Desarrollo Web.', hint: 'Domina el HTML y CSS.', rarity: 'rare', icon: 'globe' },
    { id: 'python_master', name: 'Parsel Tongue', desc: 'Completa el curso de Python.', hint: 'Habla con las serpientes.', rarity: 'rare', icon: 'code-2' },
    { id: 'ruby_master', name: 'Gem Collector', desc: 'Completa el curso de Ruby.', hint: 'Brilla como un rubí.', rarity: 'rare', icon: 'gem' },
    { id: 'db_master', name: 'Query King', desc: 'Completa el curso de Bases de Datos.', hint: 'SELECT * FROM knowledge.', rarity: 'rare', icon: 'database' },
    
    // --- LEVELING ---
    { id: 'level_5', name: 'Aprendiz', desc: 'Alcanza el nivel 5 global.', hint: 'Poco a poco.', rarity: 'common', icon: 'sprout' },
    { id: 'level_20', name: 'Junior Dev', desc: 'Alcanza el nivel 20 global.', hint: 'Ya no eres tan novato.', rarity: 'common', icon: 'briefcase' },
    { id: 'level_50', name: 'Senior Dev', desc: 'Alcanza el nivel 50 global.', hint: 'Respeto.', rarity: 'rare', icon: 'medal' },
    { id: 'level_80', name: 'Leyenda', desc: 'Alcanza el nivel 80 global.', hint: 'Tocando el cielo.', rarity: 'epic', icon: 'crown' },
    
    // --- EASTER EGGS ---
    { id: 'konami_code', name: 'Retro Gamer', desc: 'Introduce el código Konami.', hint: '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', rarity: 'epic', icon: 'gamepad-2' },
    { id: 'founder_stalker', name: 'Stalker', desc: 'Visita los perfiles de Steven y Amelia.', hint: 'Conoce a tus creadores.', rarity: 'rare', icon: 'eye' },
    { id: 'social_butterfly', name: 'Social Butterfly', desc: 'Clickea en 5 enlaces sociales distintos.', hint: '¡Haz amigos!', rarity: 'common', icon: 'share-2' },
    { id: 'teapot', name: 'I\'m a Teapot', desc: 'Encuentra la referencia al error 418.', hint: 'Busca en la historia.', rarity: 'epic', icon: 'coffee' },
    { id: 'quiz_genius', name: 'Genio', desc: 'Obtén 10/10 en cualquier quiz.', hint: 'Perfección absoluta.', rarity: 'rare', icon: 'star' },
    { id: 'veteran', name: 'Veterano', desc: 'Visita la plataforma 3 días seguidos.', hint: 'La constancia es clave.', rarity: 'rare', icon: 'calendar-check' },
    { id: 'streak_3', name: 'Racha de Fuego', desc: 'Mantén una racha de 3 días.', hint: 'No rompas la cadena.', rarity: 'rare', icon: 'flame' },
    { id: 'python_apprentice', name: 'Encantador de Serpientes', desc: 'Completa el nivel 5 de Python.', hint: 'Tus primeros pasos.', rarity: 'common', icon: 'code' },
    
    { id: 'secret_konami', name: 'Life Cycle', desc: 'Hojas que caen eternamente.', hint: 'El viejo truco de los 90...', rarity: 'legendary', icon: 'leaf' },
    { id: 'secret_time', name: 'Chronos', desc: 'El tiempo es tuyo.', hint: 'El desafío de la medianoche.', rarity: 'legendary', icon: 'clock' },
    { id: 'secret_fire', name: 'Eternal Flame', desc: 'Nunca se apaga.', hint: 'La constancia de una semana entera.', rarity: 'legendary', icon: 'flame' },
    { id: 'secret_hack', name: 'Zero Day', desc: '01010101.', hint: 'Un mensaje en el vacío del código.', rarity: 'legendary', icon: 'binary' },
    
    // --- STEVEN EXCLUSIVE (OWNER) ---
    { id: 'pixel_perfect', name: 'Pixel Perfect', desc: 'Alinear cada div a la perfección.', hint: 'Obsesión por los detalles.', rarity: 'legendary', icon: 'layout' },
    { id: 'dream_architect', name: 'Arquitecto de Sueños', desc: 'Imaginar Status Code 418.', hint: 'Todo empieza con una idea.', rarity: 'legendary', icon: 'cloud-rain' },
    { id: 'coffee_overdose', name: 'Sobredosis de Cafeína', desc: 'El código es 90% café.', hint: 'Más espresso, menos depresso.', rarity: 'legendary', icon: 'coffee' },
    { id: 'bug_lord', name: 'Señor de los Bugs', desc: 'No son bugs, son features sorpresas.', hint: 'Caos controlado.', rarity: 'legendary', icon: 'bug' },
    { id: 'frontend_god', name: 'Dios del Frontend', desc: 'Dominar el DOM a voluntad.', hint: 'HTML, CSS y JS se inclinan ante ti.', rarity: 'legendary', icon: 'monitor' },

    // --- AMELIA EXCLUSIVE (CO-OWNER) ---
    { id: 'backend_queen', name: 'Reina del Backend', desc: 'Donde ocurre la magia real.', hint: 'Lo invisible es esencial.', rarity: 'legendary', icon: 'server' },
    { id: 'database_keeper', name: 'Guardiana de Datos', desc: 'Ningún bit se pierde bajo su guardia.', hint: 'SELECT * FROM secrets.', rarity: 'legendary', icon: 'database' },
    { id: 'logic_master', name: 'Maestra de la Lógica', desc: '0 y 1 son sus juguetes favoritos.', hint: 'If this, then amazing.', rarity: 'legendary', icon: 'cpu' },
    { id: 'server_whisperer', name: 'Susurradora de Servidores', desc: 'Mantiene la nube flotando.', hint: 'Uptime: 99.999%.', rarity: 'legendary', icon: 'wifi' },
    { id: 'security_protocol', name: 'Protocolo de Seguridad', desc: 'Hackearla es matemáticamente imposible.', hint: 'Access Denied.', rarity: 'legendary', icon: 'shield-check' },

    // --- DIVINE ACHIEVEMENTS ---
    { id: 'steven_moon', name: 'Mi Luna', desc: 'Solo hay una luna en este cielo...', hint: 'Una recompensa por un momento especial.', rarity: 'legendary', icon: 'moon-star' },
    { id: 'marriage_contract', name: 'Mi Prometido', desc: 'Un juramento que el tiempo no podrá borrar.', hint: 'Para el dueño de mis latidos.', rarity: 'legendary', icon: 'heart' }
];

// === LOGIC ===

export async function checkAchievement(achievementId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.id) return;

    // Check localStorage first for speed
    let userAchievements = currentUser.achievements || [];
    if (userAchievements.includes(achievementId)) return; // Already unlocked

    // Add to list
    userAchievements.push(achievementId);
    currentUser.achievements = userAchievements;

    // AWARD COINS BASED ON RARITY
    const ach = achievements.find(a => a.id === achievementId);
    let reward = 100; // Default Common
    if (ach) {
        if (ach.rarity === 'rare') reward = 300;
        if (ach.rarity === 'epic') reward = 500;
        if (ach.rarity === 'legendary') reward = 1000;
    }
    
    // Init coins if missing
    if (!currentUser.coins) currentUser.coins = 0;
    currentUser.coins += reward;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Show Notification
    showToast(achievementId, reward);

    // Sync to Firestore
    try {
        const userRef = doc(db, 'users', currentUser.id);
        await updateDoc(userRef, {
            achievements: userAchievements,
            coins: currentUser.coins
        });
    } catch (e) {
        console.error("Error syncing achievement:", e);
    }
}

function showToast(achId, reward) {
    const ach = achievements.find(a => a.id === achId);
    if (!ach) return;

    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 border border-yellow-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 transform translate-y-20 opacity-0 transition-all duration-500 z-50';
    toast.innerHTML = `
        <div class="p-2 bg-yellow-500/20 rounded-full text-yellow-500">
            <i data-lucide="${ach.icon}"></i>
        </div>
        <div>
            <h4 class="font-bold text-sm text-yellow-400">¡Logro Desbloqueado!</h4>
            <p class="font-bold">${ach.name}</p>
            <p class="text-xs text-gray-400">+${reward} Monedas</p>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Initialize icon
    if(window.lucide) window.lucide.createIcons();

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-20', 'opacity-0');
    });

    // Remove after 4s
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// === GLOBAL LISTENERS ===
export function initAchievementListeners() {
    // 1. NIGHT OWL / EARLY BIRD (Check on load)
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 4) checkAchievement('night_owl');
    if (hour >= 5 && hour < 7) checkAchievement('early_bird');

    // 2. LOGO CLICKS
    const logo = document.querySelector('.logo-trigger'); // Add this class to logo
    if (logo) {
        let clicks = 0;
        logo.addEventListener('click', () => {
            clicks++;
            if (clicks === 10) checkAchievement('click_spammer');
        });
    }

    // 3. KONAMI CODE
    let konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let currentPos = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konami[currentPos]) {
            currentPos++;
            if (currentPos === konami.length) {
                checkAchievement('secret_konami'); // Reemplazamos konami_code por secret_konami para el aura
                currentPos = 0;
            }
        } else {
            currentPos = 0;
        }
    });

    // 4. CHRONOS (Medianoche + Desafío)
    // Esta se llama desde el motor de desafíos al ganar, pero podemos poner un chequeo aquí también
    const checkMidnight = () => {
        const now = new Date();
        if (now.getHours() === 0) {
            // Si está en un desafío, esto se activará
            if (window.location.href.includes('challenges/')) {
                // El motor de desafíos llamará a checkAchievement('secret_time') al ganar
            }
        }
    };
    setInterval(checkMidnight, 60000);

    // 5. ETERNAL FLAME (Racha de 7 días)
    const checkStreak7 = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.streak >= 7) {
            checkAchievement('secret_fire');
        }
    };
    checkStreak7();


    window.unlock_secrets = () => {
        console.log("%c[SYSTEM] %cIntentas hackear el sistema? %cInteresante...", "color: #0f0; font-weight: bold", "color: #fff", "color: #f0f");
        checkAchievement('secret_hack');
        return "Acceso concedido.";
    };

    // 4. FOUNDER STALKER CHECK
    if (window.location.href.includes('perfil_usuario.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id === 'steven-founder' || id === 'amelia-founder') {
            let viewed = JSON.parse(localStorage.getItem('viewedFounders') || '[]');
            if (!viewed.includes(id)) viewed.push(id);
            localStorage.setItem('viewedFounders', JSON.stringify(viewed));
            
            if (viewed.includes('steven-founder') && viewed.includes('amelia-founder')) {
                checkAchievement('founder_stalker');
            }
        }
    }
}
