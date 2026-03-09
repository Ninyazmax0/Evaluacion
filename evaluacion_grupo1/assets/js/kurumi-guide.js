
/**
 * Professional Guide System
 * Tour funcional y claro para la interfaz de la academia.
 */

const GUIDE_COMPLETED_KEY = 'kurumi_academy_guide_v3_professional';

const TOUR_STEPS = [
    {
        target: null, // Centro
        title: "Bienvenido a la Academia",
        text: "Esta es tu plataforma de aprendizaje interactivo. <br>A continuación, una breve guía sobre las herramientas disponibles.",
        position: 'center'
    },
    {
        target: "[onclick*='sandbox.html']", 
        title: "Entorno de Desarrollo (Sandbox)",
        text: "Accede a un editor de código completo. <br>Aquí puedes practicar libremente en <strong>Python</strong>, <strong>Ruby</strong> y tecnologías <strong>Web</strong> (HTML/CSS/JS) sin afectar tu progreso.",
        position: 'right'
    },
    {
        target: "[onclick*='leaderboard.html']", 
        title: "Tabla de Clasificación",
        text: "Consulta tu posición global. <br>Compite con otros estudiantes basándote en la experiencia (XP) ganada al completar lecciones y desafíos.",
        position: 'right'
    },
    {
        target: "[onclick*='story.html']", 
        title: "Lore de la Academia",
        text: "Explora el transfondo narrativo. <br>Descubre la historia oculta detrás de nuestra institución y sus fundadores.",
        position: 'right'
    },
    {
        target: "[onclick*='tienda.html']", 
        title: "Tienda de Recompensas",
        text: "Personaliza tu experiencia. <br>Canjea tus puntos acumulados por marcos de avatar, efectos visuales y títulos exclusivos.",
        position: 'right'
    },
    {
        target: "[onclick*='perfil_usuario.html']", 
        title: "Perfil de Estudiante",
        text: "Tu centro de control personal. <br>Visualiza tus estadísticas detalladas, medallas obtenidas, nivel actual y gestiona tu avatar.",
        position: 'right'
    },
    {
        target: ".theme-switch", 
        title: "Preferencia Visual",
        text: "Ajuste de tema. <br>Alterna entre el modo claro y oscuro para adaptar la interfaz a tu entorno de lectura.",
        position: 'bottom'
    },
    {
        target: "[title='Ayuda / Tour']", // Campana
        title: "Centro de Ayuda",
        text: "Acceso rápido a esta guía. <br>Si necesitas repasar las funciones de la interfaz, puedes reactivar este tour en cualquier momento.",
        position: 'bottom'
    }
];

export function initKurumiGuide(force = false) {
    // Verificar si ya se completó, a menos que sea forzado
    if (!force && localStorage.getItem(GUIDE_COMPLETED_KEY)) return;

    // Evitar múltiples instancias
    if (document.getElementById('guide-overlay')) return;

    // Crear elementos del DOM
    const overlay = document.createElement('div');
    overlay.id = 'guide-overlay';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999;
        opacity: 0; transition: opacity 0.3s; pointer-events: auto;
    `;

    const guideBox = document.createElement('div');
    guideBox.id = 'guide-box';
    guideBox.className = 'guide-dialog';
    guideBox.innerHTML = `
        <div class="guide-content">
            <h3 id="guide-title"></h3>
            <p id="guide-text"></p>
            <div class="guide-actions">
                <button id="guide-skip-btn" class="secondary">Saltar</button>
                <div class="flex-spacer"></div>
                <span id="guide-progress" class="progress-text">1/${TOUR_STEPS.length}</span>
                <button id="guide-next-btn" class="primary">Siguiente ➝</button>
            </div>
        </div>
    `;

    // Estilos CSS inyectados
    const style = document.createElement('style');
    style.textContent = `
        .guide-dialog {
            position: fixed;
            background: #1a1b26;
            border: 1px solid #414868;
            border-top: 3px solid #7aa2f7;
            border-radius: 8px;
            padding: 24px;
            width: 380px;
            max-width: 90vw;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 16px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: #c0caf5;
            font-family: 'Inter', sans-serif;
        }

        .guide-content h3 {
            color: #fff;
            margin: 0 0 8px 0;
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 0.02em;
        }

        .guide-content p {
            margin: 0;
            line-height: 1.6;
            font-size: 0.9rem;
            color: #a9b1d6;
        }

        .guide-actions {
            display: flex;
            align-items: center;
            margin-top: 8px;
            gap: 12px;
        }

        .flex-spacer {
            flex: 1;
        }

        .progress-text {
            font-size: 0.8rem;
            color: #565f89;
            font-family: 'JetBrains Mono', monospace;
        }

        button.primary {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }

        button.primary:hover {
            background: #2563eb;
        }

        button.secondary {
            background: transparent;
            color: #565f89;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: color 0.2s;
        }

        button.secondary:hover {
            color: #a9b1d6;
            background: rgba(255,255,255,0.05);
        }

        /* Highlight Logic */
        .guide-highlight {
            position: relative;
            z-index: 10001 !important;
            box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.3) !important;
            border-radius: 6px;
            background: #1f2937; /* Ensure readability against dark overlay if transparent */
            transition: all 0.3s;
        }
    `;

    if (!document.getElementById('guide-styles')) {
        style.id = 'guide-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(overlay);
    document.body.appendChild(guideBox);

    // Lógica de Pasos
    let currentStepIndex = 0;

    function showStep(index) {
        if (index >= TOUR_STEPS.length) {
            finishTour();
            return;
        }

        const step = TOUR_STEPS[index];
        const titleEl = document.getElementById('guide-title');
        const textEl = document.getElementById('guide-text');
        const nextBtn = document.getElementById('guide-next-btn');
        const progressEl = document.getElementById('guide-progress');

        // Reset highlights
        document.querySelectorAll('.guide-highlight').forEach(el => el.classList.remove('guide-highlight'));

        // Update content
        titleEl.textContent = step.title;
        textEl.innerHTML = step.text;
        nextBtn.textContent = index === TOUR_STEPS.length - 1 ? "Finalizar" : "Siguiente";
        progressEl.textContent = `${index + 1}/${TOUR_STEPS.length}`;

        // Positioning
        if (step.target) {
            const targetEl = document.querySelector(step.target);
            if (targetEl) {
                targetEl.classList.add('guide-highlight');
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Calcular posición del cuadro
                const rect = targetEl.getBoundingClientRect();
                
                // Logic based on requested position
                if (step.position === 'right') {
                    guideBox.style.top = `${rect.top}px`; // Align top
                    guideBox.style.left = `${rect.right + 20}px`;
                } else if (step.position === 'bottom') {
                    guideBox.style.top = `${rect.bottom + 20}px`;
                    guideBox.style.left = `${rect.left}px`; // Align left
                } else {
                     // Default center fallback logic if not specified correctly
                     guideBox.style.top = '50%';
                     guideBox.style.left = '50%';
                     guideBox.style.transform = 'translate(-50%, -50%)';
                }
                
                // Edge detection simple fix
                const boxRect = guideBox.getBoundingClientRect();
                
                // Check right edge
                if (guideBox.style.left !== '50%' && (parseFloat(guideBox.style.left) + 380 > window.innerWidth)) {
                    // Flip to left if possible
                    guideBox.style.left = 'auto';
                    guideBox.style.right = '20px';
                }
                
                // Check bottom edge
                if (guideBox.style.top !== '50%' && (parseFloat(guideBox.style.top) + 200 > window.innerHeight)) {
                    guideBox.style.top = 'auto'; // Let it flow up
                    guideBox.style.bottom = '20px';
                }

                // Reset transform for non-center items
                if (step.target) guideBox.style.transform = 'translateY(0)';

            } else {
                // Fallback if target not found
                console.warn('Target not found:', step.target);
                // Center it
                 guideBox.style.top = '50%';
                 guideBox.style.left = '50%';
                 guideBox.style.transform = 'translate(-50%, -50%)';
            }
        } else {
            // Center
            guideBox.style.top = '50%';
            guideBox.style.left = '50%';
            guideBox.style.transform = 'translate(-50%, -50%)';
        }

        // Show
        overlay.style.opacity = '1';
        guideBox.style.opacity = '1';
    }

    function finishTour() {
        localStorage.setItem(GUIDE_COMPLETED_KEY, 'true');
        closeGuide();
    }

    function closeGuide() {
        const overlay = document.getElementById('guide-overlay');
        const box = document.getElementById('guide-box');
        if (overlay) overlay.style.opacity = '0';
        if (box) box.style.opacity = '0';
        
        setTimeout(() => {
            if (overlay) overlay.remove();
            if (box) box.remove();
            // Clean highlights
            document.querySelectorAll('.guide-highlight').forEach(el => el.classList.remove('guide-highlight'));
        }, 300);
    }

    // Event Listeners
    document.getElementById('guide-next-btn').onclick = () => {
        currentStepIndex++;
        showStep(currentStepIndex);
    };

    document.getElementById('guide-skip-btn').onclick = () => {
        finishTour(); // Skip implies "done" for now, or just close
    };

    // Close on overlay click? Usually tours force interaction or skip. Let's allow skip on overlay for usability.
    /*
    document.getElementById('guide-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'guide-overlay') closeGuide();
    });
    */

    // Start
    setTimeout(() => showStep(0), 500); // Small delay for load
}
