export function purgeLocalStorage() {
    console.log('🔥 EJECUTANDO LIMPIEZA AGRESIVA DE LOCALSTORAGE...');
    
    // Lista blanca de keys que NO debemos borrar (configuración de UI)
    const whitelist = ['theme']; 
    
    // Obtenemos todas las keys antes de empezar a borrar
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
    }
    
    let count = 0;
    keys.forEach(key => {
        if (!whitelist.includes(key)) {
            localStorage.removeItem(key);
            console.log(`🗑️ Eliminado LocalStorage: ${key}`);
            count++;
        }
    });
    
    console.log(`✅ Limpieza completada. ${count} elementos eliminados.`);
    
    // Opcional: Si queremos forzar un reload limpio si se detectó basura crítica
    // window.location.reload(); 
}

// Auto-ejecutar solo si se detecta corrupción extrema o por comando manual
window.purgeLocalStorage = purgeLocalStorage;

// En este modo estricto, limpiamos al inicio para evitar lecturas de datos viejos
// PERO cuidado de no borrar la sesión si ya existía válida? 
// No, el plan dice "Firebase Only". La sesión se recupera de Firebase Auth o ID en memoria/URL,
// no deberíamos confiar en un 'currentUser' de localStorage que podría estar desincronizado.
// Sin embargo, para persistencia de sesión simple, a veces se usa. 
// EL USUARIO DIJO: "borra todo registro de usuario anteriores... que interfiera".
// Así que borraremos todo. La sesión se validará contra Firebase cada vez.
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // En un SPA normal, borraríamos todo solo al cerrar sesión.
        // Pero para "limpiar datos corruptos anteriores", lo ejecutaremos UNA VEZ o verificaremos flag.
        // Por ahora, exportamos la función para uso manual o controlado.
        console.log('🧹 Modulo de limpieza listo. Ejecuta window.purgeLocalStorage() si es necesario.');
    });
}
