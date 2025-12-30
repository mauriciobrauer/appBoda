# 🎨 Características Adicionales Opcionales

Este documento contiene ideas y código para mejorar tu aplicación de boda con características adicionales.

---

## 📊 1. Contador de Fotos en Tiempo Real

Muestra cuántas fotos se han subido en total.

### Implementación

**En `index.html`, agrega en la sección de inicio:**
```html
<div class="text-center mt-4" style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg);">
    <div style="font-size: 3rem; font-weight: 700; color: var(--accent-pink);" id="photoCount">0</div>
    <div style="color: var(--text-secondary);">Momentos Compartidos 📸</div>
</div>
```

**En `app.js`, agrega:**
```javascript
function updatePhotoCount() {
    const countEl = document.getElementById('photoCount');
    if (countEl) {
        countEl.textContent = AppState.photos.length;
    }
}

// Llama después de cada subida
// En handleUpload(), después de saveData():
updatePhotoCount();

// En loadData():
updatePhotoCount();
```

---

## ❤️ 2. Sistema de "Me Gusta" para Fotos

Permite a los invitados dar "like" a sus fotos favoritas.

### Implementación

**Modifica la estructura de datos en `app.js`:**
```javascript
const photo = {
    id: Date.now() + Math.random(),
    uploaderName: name,
    caption: caption,
    url: fileData.secure_url,
    publicId: fileData.public_id,
    resourceType: fileData.resource_type,
    timestamp: new Date().toISOString(),
    hour: getCurrentHourCategory(),
    likes: [] // Nuevo: array de nombres que dieron like
};
```

**Agrega función de like:**
```javascript
function toggleLike(photoId) {
    const photo = AppState.photos.find(p => p.id === photoId);
    if (!photo) return;
    
    // Usa un ID único del dispositivo (simple)
    const deviceId = getDeviceId();
    
    if (!photo.likes) photo.likes = [];
    
    const index = photo.likes.indexOf(deviceId);
    if (index > -1) {
        photo.likes.splice(index, 1); // Unlike
    } else {
        photo.likes.push(deviceId); // Like
    }
    
    saveData();
    renderGallery();
}

function getDeviceId() {
    let id = localStorage.getItem('deviceId');
    if (!id) {
        id = 'device-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', id);
    }
    return id;
}
```

**Actualiza el modal de fotos:**
```javascript
// En openPhotoModal(), después del título:
const likeBtn = document.createElement('button');
likeBtn.className = 'btn btn-icon';
likeBtn.innerHTML = photo.likes && photo.likes.includes(getDeviceId()) 
    ? '❤️ ' + photo.likes.length 
    : '🤍 ' + (photo.likes ? photo.likes.length : 0);
likeBtn.onclick = () => {
    toggleLike(photo.id);
    openPhotoModal(photo); // Reabrir para actualizar
};
modalHeader.appendChild(likeBtn);
```

---

## 🎵 3. Playlist de Spotify Integrada

Muestra la música del evento.

### Implementación

**En `index.html`, agrega una nueva sección:**
```html
<div id="musicScreen" class="section hidden">
    <div class="container">
        <header class="header">
            <h1>🎵 Música del Evento</h1>
            <div class="subtitle">La banda sonora de nuestro día especial</div>
        </header>
        
        <div class="card">
            <iframe 
                style="border-radius:12px; width: 100%; height: 380px;" 
                src="https://open.spotify.com/embed/playlist/TU_PLAYLIST_ID?utm_source=generator" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
        </div>
    </div>
</div>
```

**Agrega botón de navegación en el menú inferior.**

---

## 📍 4. Mapa de Ubicación del Evento

Ayuda a los invitados a llegar al venue.

### Implementación

**En `index.html`:**
```html
<div id="locationScreen" class="section hidden">
    <div class="container">
        <header class="header">
            <h1>📍 Ubicación</h1>
            <div class="subtitle">Cómo llegar al evento</div>
        </header>
        
        <div class="card">
            <h3>Hacienda Los Sueños</h3>
            <p style="color: var(--text-secondary); margin: 1rem 0;">
                Camino Real 123, Colonia Centro<br>
                Ciudad de México, CDMX 12345
            </p>
            
            <!-- Google Maps Embed -->
            <div style="border-radius: var(--radius-md); overflow: hidden; margin-top: 1rem;">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18..." 
                    width="100%" 
                    height="400" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy">
                </iframe>
            </div>
            
            <a 
                href="https://maps.google.com/?q=TU_DIRECCION" 
                target="_blank" 
                class="btn btn-primary" 
                style="width: 100%; margin-top: 1rem;">
                🗺️ Abrir en Google Maps
            </a>
        </div>
        
        <div class="card mt-3">
            <h3>Información de Estacionamiento</h3>
            <p style="color: var(--text-secondary);">
                ✅ Estacionamiento gratuito disponible<br>
                🚗 Capacidad para 100 vehículos<br>
                🚕 También hay servicio de valet
            </p>
        </div>
    </div>
</div>
```

---

## 💬 5. Chat en Vivo Simple

Permite conversaciones en tiempo real (requiere backend).

### Implementación Básica con Local Storage

**En `app.js`:**
```javascript
// Simple chat usando localStorage y polling
const Chat = {
    messages: [],
    currentUser: null,
    
    init() {
        this.loadMessages();
        setInterval(() => this.loadMessages(), 5000); // Poll cada 5 seg
    },
    
    sendMessage(text) {
        if (!this.currentUser) {
            this.currentUser = prompt('Tu nombre:');
        }
        
        const message = {
            id: Date.now(),
            user: this.currentUser,
            text: text,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(message);
        localStorage.setItem('weddingChat', JSON.stringify(this.messages));
        this.renderMessages();
    },
    
    loadMessages() {
        const stored = localStorage.getItem('weddingChat');
        if (stored) {
            const newMessages = JSON.parse(stored);
            if (newMessages.length !== this.messages.length) {
                this.messages = newMessages;
                this.renderMessages();
            }
        }
    },
    
    renderMessages() {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        
        container.innerHTML = this.messages.map(msg => `
            <div class="message-card">
                <strong>${msg.user}</strong>: ${msg.text}
                <small style="color: var(--text-muted);">${formatTimestamp(msg.timestamp, true)}</small>
            </div>
        `).join('');
        
        container.scrollTop = container.scrollHeight;
    }
};
```

**Nota:** Para chat real-time robusto, considera usar Firebase Realtime Database o Socket.io.

---

## 🎁 6. Mesa de Regalos

Integra enlaces a tu mesa de regalos.

### Implementación

**En `index.html`:**
```html
<div class="card" onclick="window.open('https://tu-mesa-regalos.com', '_blank')">
    <h2 style="margin-bottom: 1rem; font-size: 1.8rem;">🎁 Mesa de Regalos</h2>
    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
        Tu presencia es nuestro mejor regalo, pero si deseas hacernos un obsequio...
    </p>
    <button class="btn btn-secondary">
        Ver Mesa de Regalos
    </button>
</div>
```

---

## 📸 7. Photobooth Virtual

Permite a los invitados tomar selfies con marcos personalizados.

### Implementación

**Requiere Canvas API:**
```javascript
async function openPhotobooth() {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        video.srcObject = stream;
        video.play();
        
        // Mostrar vista previa
        // Agregar marco con nombres de novios
        // Botón para capturar foto
        
    } catch (error) {
        showToast('No se pudo acceder a la cámara', 'error');
    }
}
```

**Marcos personalizados:**
```javascript
function addWeddingFrame(ctx, canvas) {
    // Marco superior
    ctx.fillStyle = 'rgba(107, 78, 155, 0.9)';
    ctx.fillRect(0, 0, canvas.width, 100);
    
    // Texto
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px Playfair Display';
    ctx.textAlign = 'center';
    ctx.fillText('María & Carlos', canvas.width / 2, 60);
    
    // Fecha
    ctx.font = '20px Inter';
    ctx.fillText('29 Dic 2025', canvas.width / 2, 90);
}
```

---

## 🏆 8. Concurso de Mejor Foto

Vota por las mejores fotos del evento.

### Implementación

**Agrega categorías de concurso:**
```javascript
const CONTEST_CATEGORIES = [
    { id: 'mejor-selfie', name: '🤳 Mejor Selfie', emoji: '🤳' },
    { id: 'momento-divertido', name: '😂 Momento Más Divertido', emoji: '😂' },
    { id: 'foto-romantica', name: '💕 Foto Más Romántica', emoji: '💕' },
    { id: 'baile-loco', name: '🕺 Baile Más Loco', emoji: '🕺' }
];
```

**Al subir foto, permite seleccionar categoría:**
```html
<div class="form-group">
    <label>Categoría del concurso (opcional)</label>
    <select id="contestCategory" class="form-input">
        <option value="">Ninguna</option>
        <option value="mejor-selfie">🤳 Mejor Selfie</option>
        <option value="momento-divertido">😂 Momento Más Divertido</option>
        <option value="foto-romantica">💕 Foto Más Romántica</option>
        <option value="baile-loco">🕺 Baile Más Loco</option>
    </select>
</div>
```

---

## 📅 9. Cronograma del Evento

Muestra el itinerario del día.

### Implementación

**En `index.html`:**
```html
<div id="scheduleScreen" class="section hidden">
    <div class="container">
        <header class="header">
            <h1>📅 Cronograma</h1>
            <div class="subtitle">Programa del día</div>
        </header>
        
        <div class="timeline">
            <div class="timeline-item">
                <div class="timeline-time">3:00 PM</div>
                <div class="timeline-content card">
                    <h3>💒 Ceremonia</h3>
                    <p>Capilla de la Hacienda</p>
                </div>
            </div>
            
            <div class="timeline-item">
                <div class="timeline-time">4:30 PM</div>
                <div class="timeline-content card">
                    <h3>🥂 Cocktail</h3>
                    <p>Jardín principal</p>
                </div>
            </div>
            
            <div class="timeline-item">
                <div class="timeline-time">6:00 PM</div>
                <div class="timeline-content card">
                    <h3>🍽️ Cena</h3>
                    <p>Salón de banquetes</p>
                </div>
            </div>
            
            <div class="timeline-item">
                <div class="timeline-time">8:00 PM</div>
                <div class="timeline-content card">
                    <h3>💃 Baile</h3>
                    <p>¡A bailar toda la noche!</p>
                </div>
            </div>
        </div>
    </div>
</div>
```

**Agrega CSS para timeline en `styles.css`:**
```css
.timeline {
    position: relative;
    padding: 2rem 0;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 50px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--accent-pink);
}

.timeline-item {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    align-items: flex-start;
}

.timeline-time {
    width: 80px;
    font-weight: 600;
    color: var(--accent-pink);
    position: relative;
}

.timeline-time::after {
    content: '';
    position: absolute;
    right: -26px;
    top: 5px;
    width: 12px;
    height: 12px;
    background: var(--accent-pink);
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--bg-dark);
}

.timeline-content {
    flex: 1;
}
```

---

## 🎨 10. Filtros de Instagram para Fotos

Aplica filtros antes de subir.

### Implementación

**Usa la librería CamanJS:**
```html
<!-- En index.html -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/camanjs/4.1.2/caman.full.min.js"></script>
```

**En `app.js`:**
```javascript
function applyFilter(file, filterName) {
    return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            Caman(canvas, function() {
                switch(filterName) {
                    case 'vintage':
                        this.vintage();
                        break;
                    case 'lomo':
                        this.lomo();
                        break;
                    case 'clarity':
                        this.clarity();
                        break;
                    case 'sincity':
                        this.sinCity();
                        break;
                }
                
                this.render(() => {
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, { type: file.type }));
                    });
                });
            });
        };
        
        const reader = new FileReader();
        reader.onload = (e) => img.src = e.target.result;
        reader.readAsDataURL(file);
    });
}
```

---

## 🔔 11. Notificaciones Push

Notifica cuando alguien sube una foto nueva (requiere Service Worker).

### Implementación

**Solicitar permiso:**
```javascript
async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
}

function sendNotification(title, body, icon) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: icon || '💍',
            badge: '💍'
        });
    }
}

// Después de subir foto:
sendNotification(
    '¡Nueva foto! 📸',
    `${uploaderName} acaba de compartir un momento`,
    photo.url
);
```

---

## 📊 12. Dashboard de Estadísticas

Panel para los novios con métricas del evento.

### Implementación

```javascript
function renderDashboard() {
    const stats = {
        totalPhotos: AppState.photos.length,
        totalMessages: AppState.messages.length,
        totalLikes: AppState.photos.reduce((sum, p) => sum + (p.likes?.length || 0), 0),
        topUploader: getMostActiveUploader(),
        peakHour: getMostActiveHour(),
        videoCount: AppState.photos.filter(p => p.resourceType === 'video').length
    };
    
    return `
        <div class="grid-2">
            <div class="card"><h2>${stats.totalPhotos}</h2><p>Fotos Totales 📸</p></div>
            <div class="card"><h2>${stats.totalMessages}</h2><p>Mensajes 💌</p></div>
            <div class="card"><h2>${stats.totalLikes}</h2><p>Me Gusta ❤️</p></div>
            <div class="card"><h2>${stats.videoCount}</h2><p>Videos 🎥</p></div>
        </div>
    `;
}
```

---

## 🎊 Próximos Pasos

¿Qué características te gustaría implementar?

1. Selecciona las que más te interesen
2. Copia el código correspondiente
3. Personaliza según tus necesidades
4. Prueba localmente antes de desplegar

**¡Que disfrutes tu día especial!** 💍✨
