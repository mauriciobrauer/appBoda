/* 
 * Configuración de la Aplicación de Boda
 * Edita estos valores para personalizar tu evento
 */

// ========================================
// 1. INFORMACIÓN DEL EVENTO
// ========================================

// En index.html, línea 44-46, cambia:
const COUPLE_NAMES = "María & Carlos";
const WELCOME_MESSAGE = "Bienvenidos a nuestra boda";
const WEDDING_DATE = "29 de Diciembre, 2025";

// ========================================
// 2. CLOUDINARY (Almacenamiento de Medios)
// ========================================

// En app.js, línea 6, actualiza:
const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";  // Obtén de cloudinary.com/console
const CLOUDINARY_API_KEY = "422427495997419";
const CLOUDINARY_API_SECRET = "W-SSuMTlNH_T2e4Znb6okMnui4I";

// Para configurar el upload preset:
// 1. Ve a Cloudinary Dashboard → Settings → Upload
// 2. Crea un nuevo preset "wedding_uploads"
// 3. Cambia a "Unsigned" en Signing Mode
// 4. Opcional: añade carpeta "wedding-photos"

// ========================================
// 3. CATEGORÍAS DE HORA
// ========================================

// En app.js, línea 169-178, personaliza las categorías:
function getCurrentHourCategory() {
    const hour = new Date().getHours();

    // Personaliza según tu horario de evento:
    if (hour < 14) return 'Ceremonia';      // Antes de 2pm
    if (hour < 16) return 'Cocktail';       // 2-4pm
    if (hour < 19) return 'Recepción';      // 4-7pm
    if (hour < 22) return 'Fiesta';         // 7-10pm
    return 'After Party';                    // Después de 10pm
}

// ========================================
// 4. COLORES DEL TEMA
// ========================================

// En styles.css, línea 3-15, cambia los colores:
:root {
    /* Paleta Púrpura y Rosa (Actual) */
    --primary - purple: #6B4E9B;
    --accent - pink: #E91E63;
    --bg - dark: #1A0F2E;

    /* Alternativas de Paletas de Color: */

    /* Opción 1: Azul Elegante & Dorado */
    /*
    --primary-purple: #1A4D8F;
    --accent-pink: #D4AF37;
    --bg-dark: #0A1929;
    */

    /* Opción 2: Verde Esmeralda & Oro */
    /*
    --primary-purple: #2E7D5F;
    --accent-pink: #FFD700;
    --bg-dark: #0F1F1A;
    */

    /* Opción 3: Borgoña & Champagne */
    /*
    --primary-purple: #6B2C3E;
    --accent-pink: #F5E6D3;
    --bg-dark: #1A0E14;
    */

    /* Opción 4: Coral & Menta */
    /*
    --primary-purple: #FF6B6B;
    --accent-pink: #4ECDC4;
    --bg-dark: #1A1A2E;
    */
}

// ========================================
// 5. OPCIONES AVANZADAS
// ========================================

// Intervalo de actualización automática (milisegundos)
// En app.js, línea 549, cambia:
const AUTO_REFRESH_INTERVAL = 30000; // 30 segundos (puedes cambiar a 60000 para 1 minuto)

// Habilitar modo offline
// En app.js, línea 559, descomenta:
// if ('serviceWorker' in navigator) { ... }

// Límite de archivos por subida
const MAX_FILES_PER_UPLOAD = 10; // Puedes cambiar en app.js si lo necesitas

// ========================================
// 6. TEXTOS DE LA INTERFAZ
// ========================================

// Puedes buscar y reemplazar estos textos en index.html:

const UI_TEXTS = {
    uploadButton: "Sube tu foto",
    uploadDescription: "Comparte los momentos especiales de este día inolvidable",
    galleryButton: "Ver fotos de todos",
    galleryDescription: "Explora la galería compartida del evento",
    messagesButton: "Muro de mensajes",
    messagesDescription: "Lee los mensajes de amor y buenos deseos",
    writeButton: "Escribe un mensaje",
    writeDescription: "Comparte tus felicitaciones con los novios",
    footerText: "❤️ Gracias por compartir este momento con nosotros"
};

// ========================================
// 7. EMOJIS PERSONALIZADOS
// ========================================

// Cambia los emojis en index.html y app.js:
const EMOJIS = {
    main: "💍",           // Emoji principal
    upload: "📸",         // Subir foto
    gallery: "🎉",        // Galería
    messages: "💌",       // Mensajes
    write: "✍️",          // Escribir
    home: "🏠"           // Inicio
};

// ========================================
// 8. MODO DEMO (Sin Cloudinary)
// ========================================

// Para probar sin configurar Cloudinary, reemplaza la función
// uploadToCloudinary en app.js con:

/*
async function uploadToCloudinary(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve({
                secure_url: reader.result,
                public_id: Date.now() + '-' + file.name,
                resource_type: file.type.startsWith('video/') ? 'video' : 'image'
            });
        };
        reader.readAsDataURL(file);
    });
}
*/

// NOTA: En modo demo, las imágenes solo estarán en el navegador local
// y se perderán al limpiar caché

// ========================================
// 9. SEGURIDAD Y PRIVACIDAD
// ========================================

// Esta app NO tiene autenticación por diseño
// Para añadir protección básica:

// Opción A: Protección con contraseña simple (no recomendado para producción)
/*
const EVENT_PASSWORD = "bodamaria2025";

window.onload = function() {
    const entered = localStorage.getItem('eventAccess');
    if (entered !== EVENT_PASSWORD) {
        const pass = prompt('Contraseña del evento:');
        if (pass === EVENT_PASSWORD) {
            localStorage.setItem('eventAccess', EVENT_PASSWORD);
        } else {
            alert('Contraseña incorrecta');
            window.location.href = 'about:blank';
        }
    }
};
*/

// Opción B: Usa un URL difícil de adivinar al desplegar
// Ejemplo: tu-boda-82f4a9c3.netlify.app

// ========================================
// 10. DESCARGAR TODAS LAS FOTOS
// ========================================

// Añade este botón en index.html donde quieras:
/*
<button class="btn btn-secondary" onclick="downloadAllPhotos()">
    📥 Descargar todas las fotos
</button>
*/

// Y añade esta función en app.js:
/*
async function downloadAllPhotos() {
    showLoading(true);
    for (const photo of AppState.photos) {
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = `wedding-${photo.id}.${photo.resourceType === 'video' ? 'mp4' : 'jpg'}`;
        link.click();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    showLoading(false);
    showToast('✅ Descarga iniciada', 'success');
}
*/

// ========================================
// ¡TODO LISTO!
// ========================================

// Después de personalizar:
// 1. Guarda todos los archivos
// 2. Ejecuta: ./start.sh
// 3. Abre: http://localhost:8000
// 4. ¡Disfruta tu día especial! 💍✨
