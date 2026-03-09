/**
 * Background Manager - Sistema de fondo de pantalla local
 * Permite cambiar el fondo de pantalla de todas las páginas usando localStorage
 * No requiere Firebase, todo es local
 */

// Configuración por defecto
const DEFAULT_BACKGROUNDS = {
    dark: 'https://i.pinimg.com/originals/4c/23/98/4c2398e6be397bb08b5cb70b2192d730.gif',
    light: 'https://i.pinimg.com/originals/71/f1/b9/71f1b924a56150104ec16828f2d31b7f.gif'
};

// Clase principal del Background Manager
class BackgroundManager {
    constructor() {
        this.customBackground = null;
        this.init();
    }

    init() {
        // Inicializar variables CSS con valores por defecto antes de cargar
        this.initializeCSSVariables();

        // Cargar configuración guardada
        this.loadSettings();

        // Aplicar fondo actual
        this.applyBackground();

        // Escuchar cambios de tema
        this.setupThemeListener();
    }

    initializeCSSVariables() {
        // Establecer valores por defecto en las variables CSS
        document.documentElement.style.setProperty('--bg-day', `url('${DEFAULT_BACKGROUNDS.light}')`);
        document.documentElement.style.setProperty('--bg-night', `url('${DEFAULT_BACKGROUNDS.dark}')`);
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('customBackground');
            if (saved) {
                this.customBackground = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading background settings:', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('customBackground', JSON.stringify(this.customBackground));
        } catch (e) {
            console.error('Error saving background settings:', e);
        }
    }

    applyBackground() {
        const bgDay = document.querySelector('.background-day');
        const bgNight = document.querySelector('.background-night');

        if (!bgDay || !bgNight) return;

        if (this.customBackground) {
            // Aplicar fondo personalizado usando variables CSS
            document.documentElement.style.setProperty('--bg-day', `url('${this.customBackground}')`);
            document.documentElement.style.setProperty('--bg-night', `url('${this.customBackground}')`);
        } else {
            // Usar fondos por defecto
            document.documentElement.style.setProperty('--bg-day', `url('${DEFAULT_BACKGROUNDS.light}')`);
            document.documentElement.style.setProperty('--bg-night', `url('${DEFAULT_BACKGROUNDS.dark}')`);
        }
    }

    setCustomBackground(imageData) {
        this.customBackground = imageData;
        this.applyBackground();
        this.saveSettings();
    }

    removeCustomBackground() {
        this.customBackground = null;
        this.applyBackground();
        this.saveSettings();
    }

    hasCustomBackground() {
        return this.customBackground !== null;
    }

    getCustomBackground() {
        return this.customBackground;
    }

    setupThemeListener() {
        // Escuchar cambios de tema para asegurar que el fondo correcto se muestre
        // Usamos debounce para evitar múltiples actualizaciones rápidas
        let debounceTimer = null;

        const observer = new MutationObserver(() => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.applyBackground();
            }, 100);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Instancia global
const backgroundManager = new BackgroundManager();

// Exportar para uso en otros archivos
window.BackgroundManager = BackgroundManager;
window.backgroundManager = backgroundManager;
window.DEFAULT_BACKGROUNDS = DEFAULT_BACKGROUNDS;
