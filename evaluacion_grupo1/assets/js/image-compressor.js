/**
 * Módulo de Compresión de Imágenes
 * Redimensiona y comprime imágenes para guardarlas como texto (Base64) en Firestore
 * Evita el uso de Firebase Storage (y su requerimiento de tarjeta de crédito)
 */

export async function compressImage(file, maxWidth = 300, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = () => {
                // Calcular nuevas dimensiones
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxWidth) {
                        width *= maxWidth / height;
                        height = maxWidth;
                    }
                }
                
                // Crear canvas para redimensionar
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convertir a Base64 comprimido (JPEG)
                // Esto reduce drásticamente el tamaño (ej: 5MB -> 30KB)
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                
                // Validar tamaño final (< 800KB para seguridad en Firestore)
                if (compressedBase64.length > 800 * 1024) {
                    reject(new Error('La imagen sigue siendo muy pesada incluso comprimida. Intenta con otra.'));
                } else {
                    resolve(compressedBase64);
                }
            };
            
            img.onerror = (error) => reject(error);
        };
        
        reader.onerror = (error) => reject(error);
    });
}
