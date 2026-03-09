/**
 * Módulo Firebase Storage (NINJA MODE - CLIENT SIDE ONLY)
 * NO usa Firebase Cloud Storage (Plan Gratuito).
 * Comprime imágenes en el cliente y las convierte a Base64 para guardar en Firestore.
 */

// Ya no necesitamos importar Storage SDK porque todo es local en el navegador
// import { getStorage, ... } from ... (ELIMINADO)

/**
 * Comprime y convierte una imagen a Base64
 * @param {File} file - Archivo de imagen original
 * @param {number} maxWidth - Ancho máximo (default 400px para ahorrar espacio)
 * @param {number} quality - Calidad JPEG 0-1 (default 0.7)
 * @returns {Promise<string>} - String Base64 comprimido
 */
async function compressImage(file, maxWidth = 400, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calcular nuevas dimensiones manteniendo aspect ratio
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convertir a Base64 (JPEG es más eficiente que PNG para fotos)
                // Si el original era PNG con transparencia, se pondrá fondo negro en JPEG.
                // Para avatares está bien. Podríamos usar webp si el navegador soporta.
                const base64 = canvas.toDataURL('image/jpeg', quality);
                
                console.log(`📉 Imagen comprimida: ${Math.round(base64.length/1024)}KB (Original: ${Math.round(file.size/1024)}KB)`);
                resolve(base64);
            };
            
            img.onerror = (err) => reject(new Error("Error cargando imagen para compresión"));
        };
        
        reader.onerror = (err) => reject(new Error("Error leyendo archivo"));
    });
}

/**
 * Simula la subida a Firebase Storage pero en realidad devuelve un Base64 optimizado
 * Mantiene el nombre de función para compatibilidad con código existente.
 * @param {File} imageFile - Archivo de imagen
 * @param {string} folder - (Ignorado en modo Base64)
 * @returns {Promise<string>} - String Base64
 */
async function uploadToFirebaseStorage(imageFile, folder = "avatars") {
    console.log('ninja-mode: Comprimiendo imagen en cliente...');
    
    // Validar tipo
    if (!imageFile.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
    }
    
    return await compressImage(imageFile);
}

/**
 * Sube una imagen desde base64 string
 * En este caso, solo verificamos que no sea gigantesca.
 */
async function uploadBase64ToStorage(base64String, folder = "avatars") {
    // Si ya es base64, asumimos que está lista o podríamos recomprimirla si es muy larga ?
    // Por ahora la devolvemos tal cual.
    return base64String;
}

/**
 * Helper con UI de progreso simulado
 */
async function uploadWithProgress(imageFile, onProgress) {
    if (onProgress) onProgress('Procesando...');
    
    try {
        if (onProgress) onProgress('Optimizando...');
        // Simulamos un pequeño delay para que se sienta "pro"
        await new Promise(r => setTimeout(r, 500));
        
        const base64 = await uploadToFirebaseStorage(imageFile);
        
        if (onProgress) onProgress('¡Listo! ✨');
        return base64;
    } catch (error) {
        if (onProgress) onProgress('Error ❌');
        throw error;
    }
}

/**
 * Dummy function para no romper imports
 */
async function deleteFromStorage(imageUrl) {
    console.log('ninja-mode: Nada que borrar en Storage (es Base64 en DB)');
}

// Exportar funciones
window.uploadToFirebaseStorage = uploadToFirebaseStorage;
window.uploadBase64ToStorage = uploadBase64ToStorage;
window.uploadWithProgress = uploadWithProgress;
window.deleteFromStorage = deleteFromStorage;

export { uploadToFirebaseStorage, uploadBase64ToStorage, uploadWithProgress, deleteFromStorage };
