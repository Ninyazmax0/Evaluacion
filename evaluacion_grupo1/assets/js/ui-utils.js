/**
 * UI Utilities for Status Code 418
 * Handles global notifications (Toasts) and common DOM manipulations.
 */

export function showGlobalToast(title, message, type = 'info') {
    // Ensure container exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    
    // Config values based on type
    const config = {
        error: {
            borderColor: 'border-red-500',
            icon: 'alert-triangle',
            iconColor: 'text-red-500',
            bg: 'bg-gray-900/95'
        },
        success: {
            borderColor: 'border-green-500',
            icon: 'check-circle',
            iconColor: 'text-green-500',
            bg: 'bg-gray-900/95'
        },
        warning: {
            borderColor: 'border-yellow-500',
            icon: 'alert-circle',
            iconColor: 'text-yellow-500',
            bg: 'bg-gray-900/95'
        },
        info: {
            borderColor: 'border-accent',
            icon: 'info',
            iconColor: 'text-accent',
            bg: 'bg-gray-900/95'
        }
    };

    const style = config[type] || config.info;

    // Tailwind classes
    toast.className = `
        min-w-[300px] max-w-md p-4 rounded-xl shadow-2xl border ${style.borderColor} ${style.bg} 
        backdrop-blur-md text-white flex gap-4 transform translate-y-20 opacity-0 
        transition-all duration-500 pointer-events-auto
    `;
    
    toast.innerHTML = `
        <div class="${style.iconColor} shrink-0">
            <i data-lucide="${style.icon}" class="w-6 h-6"></i>
        </div>
        <div>
            <h4 class="font-bold text-sm mb-1">${title}</h4>
            <p class="text-xs text-gray-300 leading-relaxed">${message}</p>
        </div>
        <button class="ml-auto text-gray-400 hover:text-white transition-colors" onclick="this.parentElement.remove()">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    `;

    container.appendChild(toast);
    
    // Initialize icons for this toast
    if (window.lucide) window.lucide.createIcons({ root: toast });

    // Animate In
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-20', 'opacity-0');
    });

    // Auto Remove (longer for errors)
    const duration = type === 'error' ? 8000 : 5000;
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => { 
                if(toast.parentElement) toast.remove(); 
            }, 500);
        }
    }, duration);
}

// Expose to window for legacy scripts
window.showGlobalToast = showGlobalToast;
