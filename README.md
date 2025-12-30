# 💍 Wedding Photo & Message App

Una aplicación web moderna y elegante para bodas que permite a los invitados compartir fotos, videos y mensajes en tiempo real.

## ✨ Características

- 📸 **Subida de fotos y videos** desde cámara o galería
- 🎉 **Galería compartida** con organización por horas
- 💌 **Muro de mensajes** interactivo
- 🌙 **Diseño elegante** con tema oscuro y efectos glassmorphism
- 📱 **100% Responsive** - optimizado para móviles y tablets
- ⚡ **Sin autenticación** - acceso directo para todos los invitados
- 🔄 **Actualización automática** cada 30 segundos
- 💾 **Offline-ready** con Service Worker
- ☁️ **Cloudinary** para almacenamiento de medios

## 🚀 Inicio Rápido

### 1. Configuración de Cloudinary

Antes de usar la aplicación, necesitas configurar tu cuenta de Cloudinary:

1. Ve a [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copia tus credenciales (Cloud Name, API Key, API Secret)
3. En el archivo `app.js`, actualiza la configuración:

```javascript
const CLOUDINARY_CONFIG = {
    cloudName: 'TU_CLOUD_NAME',
    uploadPreset: 'wedding_uploads',
    apiKey: 'TU_API_KEY'
};
```

### 2. Crear Upload Preset en Cloudinary

1. Ve a Settings → Upload → Upload presets
2. Crea un nuevo preset llamado `wedding_uploads`
3. Configura:
   - **Signing Mode**: Unsigned
   - **Folder**: wedding-photos (opcional)
   - **Access mode**: Public
   - Guarda los cambios

### 3. Ejecutar Localmente

Opción A - Python HTTP Server:
```bash
cd wedding-app
python3 -m http.server 8000
```

Opción B - Node.js HTTP Server:
```bash
npx http-server wedding-app -p 8000
```

Opción C - VS Code Live Server:
- Instala la extensión "Live Server"
- Click derecho en `index.html` → "Open with Live Server"

### 4. Abrir en el Navegador

Visita: `http://localhost:8000`

## 📱 Uso

### Para Invitados

1. **Subir Fotos/Videos**
   - Toca "Sube tu foto"
   - Ingresa tu nombre
   - Selecciona archivos (múltiples permitidos)
   - Agrega un mensaje opcional
   - Toca "Subir archivos"

2. **Ver Galería**
   - Toca "Ver fotos de todos"
   - Filtra por hora usando las pestañas
   - Toca cualquier foto para verla en grande

3. **Escribir Mensajes**
   - Toca "Escribe un mensaje"
   - Ingresa tu nombre y mensaje
   - Opcionalmente agrega una foto
   - Toca "Enviar mensaje"

### Para Novios/Organizadores

**Personalización en `index.html`:**

```html
<!-- Línea 44: Nombres de los novios -->
<h1 id="coupleNames">María & Carlos</h1>

<!-- Línea 46: Fecha de la boda -->
<div class="date" id="weddingDate">29 de Diciembre, 2025</div>
```

**Modo Pantalla/Proyector:**
- Navega a la galería o muro de mensajes
- La página se actualiza automáticamente cada 30 segundos
- Ideal para mostrar en tiempo real durante el evento

## 🎨 Personalización

### Colores del Tema

Edita las variables CSS en `styles.css`:

```css
:root {
  --primary-purple: #6B4E9B;
  --accent-pink: #E91E63;
  --bg-dark: #1A0F2E;
  /* ... más colores */
}
```

### Categorías de Hora

Las fotos se organizan automáticamente por hora. Puedes modificar las categorías en `app.js`:

```javascript
function getCurrentHourCategory() {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Mañana';
    if (hour < 14) return '12-2pm';
    // ... personaliza según tu evento
}
```

## 🌐 Despliegue a Producción

### Opción 1: Netlify (Recomendado)

1. Crear cuenta en [Netlify](https://netlify.com)
2. Arrastra y suelta la carpeta `wedding-app`
3. Tu sitio estará en línea en segundos
4. URL ejemplo: `tu-boda.netlify.app`

### Opción 2: Vercel

```bash
npx vercel wedding-app
```

### Opción 3: GitHub Pages

1. Sube el código a GitHub
2. Ve a Settings → Pages
3. Selecciona la rama y carpeta
4. Tu sitio estará en `username.github.io/wedding-app`

## 📊 Gestión de Datos

### Almacenamiento Local

Los datos se guardan en `localStorage` del navegador:
- `weddingPhotos` - Array de fotos/videos
- `weddingMessages` - Array de mensajes
- `weddingCategories` - Categorías de hora

### Exportar Datos

Abre la consola del navegador y ejecuta:

```javascript
// Exportar fotos
console.log(JSON.stringify(AppState.photos, null, 2));

// Exportar mensajes
console.log(JSON.stringify(AppState.messages, null, 2));
```

### Limpiar Datos

```javascript
localStorage.clear();
location.reload();
```

## 🔐 Privacidad y Seguridad

- ⚠️ Esta app no tiene autenticación por diseño
- Todos pueden ver y subir contenido
- No compartir el enlace públicamente si deseas privacidad
- Considera usar un enlace personalizado difícil de adivinar
- Cloudinary almacena todos los medios de forma segura

## 📱 Compatibilidad

- ✅ iOS Safari 12+
- ✅ Android Chrome 80+
- ✅ Desktop Chrome, Firefox, Safari, Edge
- ✅ Tablets y dispositivos móviles
- ✅ Funciona offline (después de la primera carga)

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Almacenamiento**: Cloudinary (medios) + localStorage (datos)
- **Estilos**: CSS Grid, Flexbox, Custom Properties
- **Fuentes**: Google Fonts (Playfair Display, Inter)
- **PWA**: Service Worker para funcionalidad offline

## 💡 Tips para el Evento

1. **Prueba antes del día**: Sube algunas fotos de prueba
2. **WiFi estable**: Asegura buena conexión en el venue
3. **QR Code**: Crea un código QR con el enlace para fácil acceso
4. **Cartel**: Imprime instrucciones simples para los invitados
5. **Modo avión OFF**: Recuerda a los invitados tener datos/WiFi activado
6. **Backup**: Descarga todas las fotos después del evento

## 📞 Soporte

Para preguntas o problemas:
- Revisa la consola del navegador (F12)
- Verifica las credenciales de Cloudinary
- Asegúrate de tener conexión a internet

## 📄 Licencia

MIT License - Libre para uso personal y comercial

---

**¡Hecho con ❤️ para tu día especial!** 💍✨

Disfruta tu boda y que tus invitados capturen cada momento inolvidable 📸🎉
