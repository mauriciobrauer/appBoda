# 🚀 Guía de Despliegue - Aplicación de Boda

Esta guía te ayudará a poner tu aplicación en línea para que los invitados puedan acceder desde cualquier dispositivo.

## 🎯 Antes de Desplegar

### Lista de Verificación Pre-Despliegue

- [ ] ✅ Cloudinary configurado (cloud name en `app.js`)
- [ ] ✅ Nombres de novios actualizados en `index.html`
- [ ] ✅ Fecha del evento correcta
- [ ] ✅ Colores personalizados (opcional)
- [ ] ✅ Probado localmente con `./start.sh`
- [ ] ✅ Subido al menos 1 foto de prueba

---

## 🌐 Opción 1: Netlify (Recomendado - MÁS FÁCIL)

### Ventajas
- ✅ 100% Gratis
- ✅ HTTPS automático
- ✅ Deploy en segundos
- ✅ URL personalizada gratis
- ✅ Sin necesidad de Git

### Pasos

1. **Crear cuenta en Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Crea una cuenta gratis (con GitHub, Google o email)

2. **Desplegar tu sitio**
   
   **Método A - Drag & Drop (Más fácil)**
   - Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
   - Arrastra y suelta la carpeta `wedding-app` completa
   - ¡Listo! Tu sitio estará en línea en segundos

   **Método B - Desde el Dashboard**
   - Click en "Add new site" → "Deploy manually"
   - Arrastra la carpeta `wedding-app`
   - Espera a que termine el deploy

3. **Personalizar URL**
   - Click en "Site settings" → "Change site name"
   - Ejemplo: `boda-maria-carlos.netlify.app`
   - Guarda el cambio

4. **Dominio personalizado (Opcional)**
   - Si tienes un dominio propio: `www.bodamaria.com`
   - Ve a "Domain settings" → "Add custom domain"
   - Sigue las instrucciones para configurar DNS

### URL Final
```
https://boda-maria-carlos.netlify.app
```

---

## 🔷 Opción 2: Vercel

### Ventajas
- ✅ Gratis
- ✅ Muy rápido
- ✅ HTTPS automático
- ✅ Integración con Git

### Pasos

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Desplegar**
   ```bash
   cd wedding-app
   vercel
   ```

3. **Seguir el wizard**
   - Login con GitHub/GitLab/Email
   - Confirmar configuración
   - ¡Listo!

### Comandos útiles
```bash
# Ver deployments
vercel ls

# Deploy a producción
vercel --prod

# Abrir el sitio
vercel open
```

---

## 📘 Opción 3: GitHub Pages

### Ventajas
- ✅ Gratis
- ✅ Integrado con Git
- ✅ Fácil de actualizar

### Pasos

1. **Crear repositorio en GitHub**
   - Ve a [github.com/new](https://github.com/new)
   - Nombre: `wedding-app`
   - Público o Privado (tu elección)
   - Crear repositorio

2. **Subir código**
   ```bash
   cd wedding-app
   git init
   git add .
   git commit -m "Initial wedding app"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/wedding-app.git
   git push -u origin main
   ```

3. **Activar GitHub Pages**
   - Ve a Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` / folder: `/ (root)`
   - Save

4. **Esperar 2-3 minutos**
   - Tu sitio estará en: `https://TU-USUARIO.github.io/wedding-app/`

### Actualizar contenido
```bash
git add .
git commit -m "Update photos"
git push
```

---

## 🔧 Opción 4: Servidor Propio (VPS)

### Para usuarios avanzados

Si tienes un VPS o servidor web:

1. **Subir archivos vía FTP/SFTP**
   - Usa FileZilla o similar
   - Sube todos los archivos a `/var/www/html/wedding/`

2. **Configurar servidor web**

   **Nginx:**
   ```nginx
   server {
       listen 80;
       server_name boda.tudominio.com;
       root /var/www/html/wedding;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   **Apache:**
   ```apache
   <VirtualHost *:80>
       ServerName boda.tudominio.com
       DocumentRoot /var/www/html/wedding
       <Directory /var/www/html/wedding>
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

3. **Configurar HTTPS con Let's Encrypt**
   ```bash
   sudo certbot --nginx -d boda.tudominio.com
   ```

---

## 📱 Después del Despliegue

### 1. Generar Código QR

Usa estos servicios para crear un QR code del URL:
- [qr-code-generator.com](https://www.qr-code-generator.com/)
- [qr.io](https://qr.io/)

**Tips:**
- Descarga en alta resolución
- Incluye el URL debajo del QR
- Imprímelo en varios lugares del evento

### 2. Crear Cartel para Invitados

Diseña un cartel con:
```
📸 ¡Comparte tus fotos!

1. Escanea el código QR
   [Código QR aquí]

2. Sube tus fotos y videos

3. ¡Aparecerán en tiempo real!

URL: boda-maria-carlos.netlify.app

💕 Gracias por compartir este momento con nosotros
```

### 3. Compartir el Enlace

**WhatsApp - Mensaje sugerido:**
```
¡Hola! 🎉

Los invitamos a usar nuestra galería digital de boda:

🔗 https://boda-maria-carlos.netlify.app

Pueden:
📸 Subir fotos y videos del evento
🎊 Ver todas las fotos en tiempo real
💌 Dejar mensajes para los novios

¡No olviden compartir sus mejores momentos!

Con amor,
María & Carlos 💍
```

**Email:**
```html
Asunto: 📸 Galería Digital - Nuestra Boda

Queridos invitados,

Hemos creado una galería digital especial para nuestra boda.

Visita: https://boda-maria-carlos.netlify.app

Ahí podrás:
• Subir tus fotos y videos favoritos del día
• Ver las fotos que otros han compartido
• Escribir mensajes para nosotros

¡Queremos ver el evento desde tus ojos!

Con cariño,
María & Carlos ❤️
```

### 4. Durante el Evento

**Setup recomendado:**
- 📺 Proyecta la galería en una pantalla/TV
- 🖥️ Navega a la sección "Galería"
- ✨ Se actualizará automáticamente cada 30 segundos
- 🎬 Modo "pantalla completa" en el navegador (F11)

**Script para la proyección:**
```javascript
// Pega esto en la consola del navegador (F12)
document.querySelector('.fixed-bottom-nav').style.display = 'none'; // Oculta navegación
setInterval(() => location.reload(), 60000); // Recarga cada minuto
```

### 5. Después del Evento

**Descargar todas las fotos:**

1. Abre la consola del navegador (F12)
2. Pega este código:

```javascript
// Descargar JSON con todos los datos
const data = {
    photos: JSON.parse(localStorage.getItem('weddingPhotos')),
    messages: JSON.parse(localStorage.getItem('weddingMessages'))
};
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'wedding-data-backup.json';
a.click();
```

3. Guarda el archivo JSON con todos los URLs de Cloudinary
4. Descarga las fotos de Cloudinary o usa su panel de administración

**Desde Cloudinary:**
1. Ve a [cloudinary.com/console/media_library](https://cloudinary.com/console/media_library)
2. Selecciona todas las fotos del evento
3. Click en "Download" o usa la API de Cloudinary

---

## 🔒 Seguridad y Privacidad

### Opciones de Protección

**Nivel 1: URL Difícil de Adivinar**
```
boda-maria-carlos-82f4a9c3.netlify.app
```
Añade un hash aleatorio al final del nombre

**Nivel 2: Protección con Contraseña Simple**

Agrega esto al inicio de `app.js`:
```javascript
const EVENT_PASSWORD = "bodamaria2025";

window.addEventListener('DOMContentLoaded', () => {
    const entered = sessionStorage.getItem('eventAccess');
    if (entered !== EVENT_PASSWORD) {
        const pass = prompt('🔐 Contraseña del evento:');
        if (pass === EVENT_PASSWORD) {
            sessionStorage.setItem('eventAccess', EVENT_PASSWORD);
        } else {
            alert('❌ Contraseña incorrecta');
            window.location.href = 'about:blank';
        }
    }
});
```

**Nivel 3: Cloudinary Privado**

En Cloudinary Dashboard:
- Settings → Security → Restricted media types
- Activa "Require authentication"
- Solo tú podrás ver/descargar las fotos después

---

## 📊 Monitoreo y Analytics

### Google Analytics (Opcional)

1. Ve a [analytics.google.com](https://analytics.google.com)
2. Crea una propiedad
3. Añade este código antes del `</head>` en `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Podrás ver:
- Número de visitas
- Fotos subidas
- Dispositivos usados
- Horarios de mayor actividad

---

## ⚡ Optimizaciones de Rendimiento

### Para eventos grandes (100+ invitados)

1. **Activar CDN en Cloudinary**
   - Ya está activado por defecto
   - Las imágenes se sirven desde el servidor más cercano

2. **Compresión de imágenes**
   
   En `app.js`, modifica el URL de Cloudinary:
   ```javascript
   const optimizedUrl = photo.url.replace('/upload/', '/upload/q_auto,f_auto/');
   ```

3. **Lazy Loading**
   
   Ya está implementado en las imágenes:
   ```html
   <img loading="lazy" src="...">
   ```

---

## 🆘 Troubleshooting

### Problema: "Las fotos no se suben"
- ✅ Verifica que el Cloud Name sea correcto
- ✅ Revisa que el upload preset sea "Unsigned"
- ✅ Checa la consola del navegador (F12) para errores
- ✅ Prueba con una imagen más pequeña

### Problema: "No veo las fotos de otros"
- ✅ Asegúrate de estar en la misma URL
- ✅ Recarga la página (Cmd/Ctrl + R)
- ✅ Limpia el caché del navegador

### Problema: "El sitio es muy lento"
- ✅ Verifica tu conexión WiFi en el venue
- ✅ Activa la compresión de Cloudinary (ver arriba)
- ✅ Reduce la calidad de las fotos al subir

---

## 📞 Soporte Post-Despliegue

Si necesitas ayuda después de desplegar:

1. **Cloudinary Support**: support@cloudinary.com
2. **Netlify Community**: community.netlify.com
3. **Consola del navegador**: Presiona F12 para ver errores

---

## ✅ Checklist el Día del Evento

El día de la boda, verifica:

- [ ] WiFi del venue está funcionando
- [ ] URL está accesible desde varios dispositivos
- [ ] QR codes están visibles en varios lugares
- [ ] Pantalla/proyector configurado (si aplica)
- [ ] Mensaje de WhatsApp enviado a invitados
- [ ] Una persona designada para ayudar a invitados con dudas
- [ ] Backup de las credenciales de Cloudinary
- [ ] Batería del dispositivo de proyección cargada

---

## 🎊 ¡Disfruta tu Evento!

Tu aplicación está lista para capturar todos los momentos especiales de tu boda.

**¡Felicidades y que sea un día inolvidable!** 💍✨

---

*¿Preguntas? Revisa el README.md principal o los archivos CONFIG.js y CLOUDINARY_SETUP.md*
