// Welcome Modal - Shows once per user
// Displays maintenance notice and welcome message

(function() {
    'use strict';

    // Check if user has dismissed the welcome modal
    const STORAGE_KEY = 'academia_welcome_dismissed';
    const isDismissed = localStorage.getItem(STORAGE_KEY);

    if (isDismissed === 'true') {
        return; // Don't show modal if already dismissed
    }

    // Create modal HTML
    const modalHTML = `
        <div id="welcome-modal-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        ">
            <div id="welcome-modal-content" style="
                background: linear-gradient(135deg, #1a1f35 0%, #0f1419 100%);
                border: 2px solid rgba(122, 162, 247, 0.3);
                border-radius: 20px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.5),
                    0 0 40px rgba(122, 162, 247, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                animation: slideUp 0.4s ease-out;
                position: relative;
            ">
                <!-- Close button -->
                <button id="welcome-modal-close" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    color: #fff;
                    font-size: 18px;
                    font-weight: bold;
                ">×</button>

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="
                        font-size: 48px;
                        margin-bottom: 15px;
                        animation: float 3s ease-in-out infinite;
                    ">🎓</div>
                    <h2 style="
                        color: #7aa2f7;
                        font-size: 28px;
                        font-weight: bold;
                        margin: 0 0 10px 0;
                        text-shadow: 0 0 20px rgba(122, 162, 247, 0.5);
                    ">¡Bienvenido a la Academia!</h2>
                    <p style="
                        color: #9aa5ce;
                        font-size: 14px;
                        margin: 0;
                    ">Tu viaje de aprendizaje comienza aquí</p>
                </div>

                <!-- Progress bar -->
                <div style="
                    background: rgba(122, 162, 247, 0.1);
                    border-radius: 10px;
                    height: 8px;
                    margin-bottom: 25px;
                    overflow: hidden;
                    border: 1px solid rgba(122, 162, 247, 0.2);
                ">
                    <div style="
                        background: linear-gradient(90deg, #7aa2f7, #bb9af7);
                        height: 100%;
                        width: 65%;
                        border-radius: 10px;
                        animation: progressPulse 2s ease-in-out infinite;
                        box-shadow: 0 0 10px rgba(122, 162, 247, 0.5);
                    "></div>
                </div>

                <!-- Content -->
                <div style="
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(122, 162, 247, 0.2);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 25px;
                ">
                    <!-- Maintenance notice -->
                    <div style="
                        display: flex;
                        align-items: start;
                        gap: 12px;
                        margin-bottom: 20px;
                        padding: 15px;
                        background: rgba(255, 158, 100, 0.1);
                        border-left: 4px solid #ff9e64;
                        border-radius: 8px;
                    ">
                        <div style="font-size: 24px;">⚠️</div>
                        <div>
                            <h3 style="
                                color: #ff9e64;
                                font-size: 16px;
                                font-weight: bold;
                                margin: 0 0 8px 0;
                            ">Aviso de Mantenimiento</h3>
                            <p style="
                                color: #c0caf5;
                                font-size: 14px;
                                margin: 0;
                                line-height: 1.6;
                            ">Algunas funciones están en desarrollo y pueden no funcionar correctamente. Estamos trabajando para mejorar tu experiencia.</p>
                        </div>
                    </div>

                    <!-- Welcome message -->
                    <div style="
                        display: flex;
                        align-items: start;
                        gap: 12px;
                        padding: 15px;
                        background: rgba(122, 162, 247, 0.1);
                        border-left: 4px solid #7aa2f7;
                        border-radius: 8px;
                    ">
                        <div style="font-size: 24px;">💡</div>
                        <div>
                            <h3 style="
                                color: #7aa2f7;
                                font-size: 16px;
                                font-weight: bold;
                                margin: 0 0 8px 0;
                            ">¿Nuevo por aquí?</h3>
                            <p style="
                                color: #c0caf5;
                                font-size: 14px;
                                margin: 0 0 8px 0;
                                line-height: 1.6;
                            ">Explora nuestros cursos interactivos, completa desafíos y desbloquea logros. ¡Cada línea de código te acerca a la maestría!</p>
                            <p style="
                                color: #9aa5ce;
                                font-size: 13px;
                                margin: 0;
                                font-style: italic;
                            ">✨ Tip: Visita la tienda para personalizar tu perfil con auras exclusivas.</p>
                        </div>
                    </div>
                </div>

                <!-- Don't show again checkbox -->
                <label style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    margin-bottom: 20px;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    transition: background 0.3s;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.08)'" 
                   onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'">
                    <input type="checkbox" id="welcome-modal-dont-show" style="
                        width: 18px;
                        height: 18px;
                        cursor: pointer;
                        accent-color: #7aa2f7;
                    ">
                    <span style="
                        color: #c0caf5;
                        font-size: 14px;
                        user-select: none;
                    ">No volver a mostrar este mensaje</span>
                </label>

                <!-- Action button -->
                <button id="welcome-modal-confirm" style="
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #7aa2f7, #bb9af7);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(122, 162, 247, 0.4);
                ">¡Comenzar mi Aventura! 🚀</button>
            </div>
        </div>

        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            @keyframes progressPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            #welcome-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }

            #welcome-modal-confirm:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(122, 162, 247, 0.6);
            }

            #welcome-modal-confirm:active {
                transform: translateY(0);
            }
        </style>
    `;

    // Insert modal into page
    document.addEventListener('DOMContentLoaded', function() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        // Get elements
        const overlay = document.getElementById('welcome-modal-overlay');
        const closeBtn = document.getElementById('welcome-modal-close');
        const confirmBtn = document.getElementById('welcome-modal-confirm');
        const dontShowCheckbox = document.getElementById('welcome-modal-dont-show');

        // Close modal function
        function closeModal() {
            overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                overlay.remove();
            }, 300);

            // Save preference if checkbox is checked
            if (dontShowCheckbox.checked) {
                localStorage.setItem(STORAGE_KEY, 'true');
            }
        }

        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', closeModal);

        // Close on overlay click (but not on modal content)
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay) {
                closeModal();
            }
        });
    });
})();
