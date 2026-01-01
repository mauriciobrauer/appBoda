// Cloudinary Configuration
// NOTE: Please update cloudName with your actual Cloudinary cloud name
// The API Key is: 422427495997419
// The API Secret is: W-SSuMTlNH_T2e4Znb6okMnui4I
const CLOUDINARY_CONFIG = {
    cloudName: 'dmhlpqryp',
    apiKey: '422427495997419',
    apiSecret: 'W-SSuMTlNH_T2e4Znb6okMnui4I',
    uploadPreset: 'Wedding',
    folder: 'cdb5f9314f082dad2bbb1b92e37a9a36f5'
};

// App State
const AppState = {
    currentScreen: 'home',
    photos: [],
    messages: [],
    categories: new Set(['all'])
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 Wedding App Initialized');
    loadData();

    // Aggressively seed messages for demo
    if (AppState.messages.length < 5) {
        AppState.messages = [];
        seedDemoMessages();
    }

    // Fetch Real Photos
    loadPhotosFromCloudinary().then(() => {
        if (AppState.currentScreen === 'gallery') {
            const hour = document.getElementById('hourFilter')?.value || 'all';
            const name = document.getElementById('nameFilter')?.value || 'all';
            renderGallery(hour, name);
        }
    });

    setupEventListeners();
    checkForUpdates();
});

function seedDemoMessages() {
    if (AppState.messages.length > 5) return;

    const demoMessages = [
        { id: 1, name: 'Tía Rosa', text: '¡Qué boda tan hermosa! ❤️', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, name: 'Primo Juan', text: 'Fiesta increíble 🎉', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 3, name: 'Sofía', text: '¡Vivan los novios! 👰🤵', timestamp: new Date(Date.now() - 10800000).toISOString() },
        { id: 4, name: 'Carlos', text: 'Gracias a todos', timestamp: new Date(Date.now() - 14400000).toISOString() },
        { id: 5, name: 'Laura', text: 'El vestido 😍', timestamp: new Date(Date.now() - 18000000).toISOString() },
        { id: 6, name: 'Abuela', text: 'Bendiciones', timestamp: new Date().toISOString() },
        { id: 7, name: 'Pedro', text: '¡Salud! 🥂', timestamp: new Date(Date.now() - 500000).toISOString() },
        { id: 8, name: 'Ana', text: 'Rico pastel 🍰', timestamp: new Date(Date.now() - 900000).toISOString() },
        { id: 9, name: 'Luis', text: 'Gran ambiente 🕺', timestamp: new Date(Date.now() - 1200000).toISOString() },
        { id: 10, name: 'Andrea', text: 'Felicidades 💕', timestamp: new Date(Date.now() - 150000).toISOString() }
    ];

    demoMessages[0].image = 'couple.png';
    AppState.messages = demoMessages;
    saveData();
}

// Load Photos from Cloudinary
async function loadPhotosFromCloudinary() {
    try {
        const response = await fetch('/api/photos');
        if (!response.ok) throw new Error('API Error ' + response.status);

        const data = await response.json();
        const photos = data.photos || [];

        // Always use real data (even if empty)
        AppState.photos = photos;
        console.log(`✅ Loaded ${photos.length} real photos`);

    } catch (error) {
        console.error('API Error:', error);
        // seedMockGallery(); // DISABLED by user request
    }
}


function seedMockGallery() {
    // Safety net: Show mock photos ensuring gallery is NEVER empty during demo
    const mockPhotos = [];
    const keywords = ['Boda', 'Novios', 'Fiesta', 'Baile', 'Pastel'];
    for (let i = 0; i < 25; i++) {
        mockPhotos.push({
            id: 'mock_' + i,
            publicId: 'mock_' + i,
            url: `https://placehold.co/600x800/6B4E9B/FFF?text=${keywords[i % 5]}+${i + 1}`,
            resourceType: 'image',
            uploaderName: ['Tía Rosa', 'Juan', 'Sofia', 'Carlos', 'Invitado'][i % 5],
            caption: 'Foto de prueba ' + (i + 1),
            timestamp: new Date(Date.now() - (i * 1000 * 60 * 30)).toISOString(),
            hour: 'all'
        });
    }

    // Calculate simulated hours
    mockPhotos.forEach(p => {
        const h = new Date(p.timestamp).getHours();
        const nextH = (h + 1) % 24;
        const format = h => h === 0 ? '12am' : (h < 12 ? h + 'am' : (h === 12 ? '12pm' : (h - 12) + 'pm'));
        p.hour = `${format(h)}-${format(nextH)}`;
    });

    AppState.photos = mockPhotos;
    console.log('✅ Mock Gallery Seeded with 25 photos (Fallback)');
}

// Navigation
function navigateTo(screen) {
    // Hide all screens
    const screens = ['homeScreen', 'uploadScreen', 'galleryScreen', 'messagesScreen', 'writeMessageScreen'];
    screens.forEach(s => {
        document.getElementById(s).classList.add('hidden');
    });

    // Show selected screen
    const screenMap = {
        'home': 'homeScreen',
        'upload': 'uploadScreen',
        'gallery': 'galleryScreen',
        'messages': 'messagesScreen',
        'writeMessage': 'writeMessageScreen'
    };

    const targetScreen = screenMap[screen];
    console.log('🔍 navigateTo called with screen:', screen);
    console.log('🔍 Target screen element:', targetScreen);

    if (targetScreen) {
        document.getElementById(targetScreen).classList.remove('hidden');
        AppState.currentScreen = screen;

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Refresh content
        if (screen === 'gallery') {
            loadPhotosFromCloudinary().then(() => renderGallery());
        } else if (screen === 'messages') {
            console.log('🔍 About to call renderMessages()');
            renderMessages();
            console.log('🔍 renderMessages() completed');

            // Check if button exists after render
            const writeButton = document.querySelector('button[onclick*="writeMessage"]');
            console.log('🔍 Write button found:', writeButton);
            if (writeButton) {
                console.log('🔍 Button text:', writeButton.textContent);
                console.log('🔍 Button styles:', window.getComputedStyle(writeButton).display);
                console.log('🔍 Button position:', writeButton.getBoundingClientRect());
            }
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Upload Form
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }

    // File Input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Message Form
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
    }

    // Message File Input
    const messageFileInput = document.getElementById('messageFileInput');
    if (messageFileInput) {
        messageFileInput.addEventListener('change', handleMessageFileSelect);
    }
}

// File Selection Handler
let selectedFiles = [];

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    selectedFiles = [...selectedFiles, ...files];
    displayFilePreview();
}

function displayFilePreview() {
    const preview = document.getElementById('filePreview');
    preview.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-preview-item';

        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.type.startsWith('image/')) {
                item.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="file-remove" onclick="removeFile(${index})">×</button>
                `;
            } else if (file.type.startsWith('video/')) {
                item.innerHTML = `
                    <video src="${e.target.result}"></video>
                    <button type="button" class="file-remove" onclick="removeFile(${index})">×</button>
                `;
            }
        };
        reader.readAsDataURL(file);

        preview.appendChild(item);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    displayFilePreview();
}

// Message File Handler
let selectedMessageFile = null;

function handleMessageFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedMessageFile = file;
        displayMessageFilePreview();
    }
}

function displayMessageFilePreview() {
    const preview = document.getElementById('messageFilePreview');
    preview.innerHTML = '';

    if (selectedMessageFile) {
        const item = document.createElement('div');
        item.className = 'file-preview-item';

        const reader = new FileReader();
        reader.onload = (e) => {
            if (selectedMessageFile.type.startsWith('image/')) {
                item.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="file-remove" onclick="removeMessageFile()">×</button>
                `;
            } else if (selectedMessageFile.type.startsWith('video/')) {
                item.innerHTML = `
                    <video src="${e.target.result}"></video>
                    <button type="button" class="file-remove" onclick="removeMessageFile()">×</button>
                `;
            }
        };
        reader.readAsDataURL(selectedMessageFile);

        preview.appendChild(item);
    }
}

function removeMessageFile() {
    selectedMessageFile = null;
    displayMessageFilePreview();
    document.getElementById('messageFileInput').value = '';
}

// Upload Handler
async function handleUpload(event) {
    event.preventDefault();

    const name = document.getElementById('uploaderName').value.trim();

    if (selectedFiles.length === 0) {
        showToast('Por favor selecciona al menos un archivo', 'error');
        return;
    }

    showLoading(true);

    try {
        const uploadPromises = selectedFiles.map(file => uploadToCloudinary(file, name, ''));
        const uploadedFiles = await Promise.all(uploadPromises);

        uploadedFiles.forEach(fileData => {
            const photo = {
                id: Date.now() + Math.random(),
                uploaderName: name,
                caption: '',
                url: fileData.secure_url,
                publicId: fileData.public_id,
                resourceType: fileData.resource_type,
                timestamp: new Date().toISOString(),
                hour: getCurrentHourCategory()
            };

            AppState.photos.push(photo);
            AppState.categories.add(photo.hour);
        });

        saveData();
        showToast(`✨ ${uploadedFiles.length} archivo(s) subido(s) exitosamente!`, 'success');

        // Reset form
        document.getElementById('uploadForm').reset();
        selectedFiles = [];
        displayFilePreview();

        // Navigate to gallery
        setTimeout(() => {
            navigateTo('gallery');
        }, 1000);

    } catch (error) {
        console.error('Upload error:', error);
        showToast('Error al subir archivos. Por favor intenta de nuevo.', 'error');
    } finally {
        showLoading(false);
    }
}

// Cloudinary Upload
async function uploadToCloudinary(file, uploaderName = 'Invitado', caption = '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder);

    // Save metadata in Cloudinary context
    formData.append('context', `uploaderName=${uploaderName}|caption=${caption}|uploadTime=${new Date().toISOString()}`);

    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    return await response.json();
}

// Message Submit Handler
async function handleMessageSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('messageName').value.trim();
    const text = document.getElementById('messageText').value.trim();

    showLoading(true);

    try {
        let mediaUrl = null;
        let mediaType = null;

        if (selectedMessageFile) {
            const uploadedFile = await uploadToCloudinary(selectedMessageFile);
            mediaUrl = uploadedFile.secure_url;
            mediaType = uploadedFile.resource_type;
        }

        const message = {
            id: Date.now() + Math.random(),
            name: name,
            text: text,
            mediaUrl: mediaUrl,
            mediaType: mediaType,
            timestamp: new Date().toISOString()
        };

        AppState.messages.unshift(message); // Add to beginning
        saveData();

        showToast('💌 ¡Mensaje enviado con éxito!', 'success');

        // Reset form
        document.getElementById('messageForm').reset();
        removeMessageFile();

        // Navigate to messages
        setTimeout(() => {
            navigateTo('messages');
        }, 1000);

    } catch (error) {
        console.error('Message error:', error);
        showToast('Error al enviar mensaje. Por favor intenta de nuevo.', 'error');
    } finally {
        showLoading(false);
    }
}

// Get Hour Category
function getCurrentHourCategory() {
    const now = new Date();
    const hour = now.getHours();

    // Format hour in 12-hour format
    const formatHour = (h) => {
        if (h === 0) return '12am';
        if (h < 12) return `${h}am`;
        if (h === 12) return '12pm';
        return `${h - 12}pm`;
    };

    const nextHour = (hour + 1) % 24;
    return `${formatHour(hour)}-${formatHour(nextHour)}`;
}


// Render Gallery
function renderGallery(hourFilter = 'all', nameFilter = 'all') {
    const grid = document.getElementById('photoGrid');
    const filtersContainer = document.getElementById('galleryFilters');

    // Filter photos by hour AND name
    let filteredPhotos = AppState.photos.filter(p => {
        const hourMatch = hourFilter === 'all' || p.hour === hourFilter;
        const nameMatch = nameFilter === 'all' || p.uploaderName === nameFilter;
        return hourMatch && nameMatch;
    });

    // Sort by timestamp (newest first)
    filteredPhotos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Get unique hours and names
    const hours = ['all', ...new Set(AppState.photos.map(p => p.hour).filter(h => h && h !== 'all'))];
    const names = ['all', ...new Set(AppState.photos.map(p => p.uploaderName).filter(n => n))];

    // Render filter dropdowns
    filtersContainer.innerHTML = `
        <div class="filter-group">
            <label for="hourFilter">
                <span style="font-size: 1.2rem;">🕐</span> Hora
            </label>
            <select id="hourFilter" class="filter-select">
                ${hours.map(h => `
                    <option value="${h}" ${h === hourFilter ? 'selected' : ''}>
                        ${h === 'all' ? 'Todas las horas' : h}
                    </option>
                `).join('')}
            </select>
        </div>
        
        <div class="filter-group">
            <label for="nameFilter">
                <span style="font-size: 1.2rem;">👤</span> Persona
            </label>
            <select id="nameFilter" class="filter-select">
                ${names.map(n => `
                    <option value="${n}" ${n === nameFilter ? 'selected' : ''}>
                        ${n === 'all' ? 'Todas las personas' : n}
                    </option>
                `).join('')}
            </select>
        </div>
    `;

    // Add event listeners to dropdowns
    document.getElementById('hourFilter').addEventListener('change', (e) => {
        const newNameFilter = document.getElementById('nameFilter').value;
        renderGallery(e.target.value, newNameFilter);
    });

    document.getElementById('nameFilter').addEventListener('change', (e) => {
        const newHourFilter = document.getElementById('hourFilter').value;
        renderGallery(newHourFilter, e.target.value);
    });

    // Render photos
    if (filteredPhotos.length === 0) {
        grid.innerHTML = `
            <div class="text-center" style="grid-column: 1/-1; padding: 3rem; color: var(--text-muted);">
                <p style="font-size: 3rem; margin-bottom: 1rem;">📷</p>
                <p>No hay fotos que coincidan con los filtros seleccionados</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    filteredPhotos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.onclick = () => openPhotoModal(photo);

        const mediaElement = photo.resourceType === 'video'
            ? `<video src="${photo.url}" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>`
            : `<img src="${photo.url}" alt="${photo.caption || 'Foto'}" loading="lazy">`;

        card.innerHTML = `
            ${mediaElement}
            <div class="photo-overlay">
                <div class="photo-info">
                    <span>${getAvatarEmoji(photo.uploaderName)}</span>
                    <span>${photo.uploaderName}</span>
                </div>
            </div>
            <button class="delete-photo-btn" onclick="event.stopPropagation(); deletePhoto('${photo.publicId}', '${photo.resourceType}', '${photo.id}')" title="Eliminar foto">
                🗑️
            </button>
        `;

        grid.appendChild(card);
    });
}

// Delete Photo
async function deletePhoto(publicId, resourceType, localId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto permanentemente?')) {
        return;
    }

    try {
        // If it's a Cloudinary photo (has publicId)
        if (publicId && publicId !== 'undefined') {
            const response = await fetch('/api/photos', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    public_id: publicId,
                    resource_type: resourceType || 'image'
                })
            });

            if (!response.ok) {
                throw new Error('Error eliminando de Cloudinary');
            }
        }

        // Remove from local state
        AppState.photos = AppState.photos.filter(p => p.id !== localId && p.publicId !== publicId);

        // Update UI
        renderGallery(document.getElementById('hourFilter').value, document.getElementById('nameFilter').value);

        showToast('🗑️ Foto eliminada', 'success');

    } catch (error) {
        console.error('Error deleting photo:', error);
        showToast('Error al eliminar la foto', 'error');
    }
}

// Render Messages
function renderMessages() {
    console.log('🔍 renderMessages() function started');
    const container = document.getElementById('messagesContainer');
    console.log('🔍 messagesContainer found:', container);
    console.log('🔍 Number of messages:', AppState.messages.length);

    if (AppState.messages.length === 0) {
        console.log('🔍 No messages, showing empty state');
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem; color: var(--text-muted);">
                <p style="font-size: 3rem; margin-bottom: 1rem;">💭</p>
                <p>Aún no hay mensajes. ¡Sé el primero en escribir!</p>
            </div>
        `;
        console.log('🔍 Empty state HTML set');
        return;
    }

    container.innerHTML = '';

    AppState.messages.forEach(message => {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';

        const mediaHtml = message.mediaUrl
            ? `<div class="message-image">
                ${message.mediaType === 'video'
                ? `<video src="${message.mediaUrl}" controls></video>`
                : `<img src="${message.mediaUrl}" alt="Imagen del mensaje" loading="lazy">`
            }
               </div>`
            : '';

        messageCard.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${getAvatarEmoji(message.name)}</div>
                <div class="message-meta">
                    <div class="message-name">${message.name}</div>
                    <div class="message-time">${formatTimestamp(message.timestamp)}</div>
                </div>
                <button class="delete-message-btn" onclick="deleteMessage('${message.id}')" title="Eliminar mensaje">
                    🗑️
                </button>
            </div>
            <div class="message-content">
                <div class="message-text">${escapeHtml(message.text)}</div>
                ${mediaHtml}
                <div class="message-reactions">
                    <button class="reaction-btn">❤️ Me encanta</button>
                    <button class="reaction-btn">😊 ${formatTimestamp(message.timestamp, true)}</button>
                </div>
            </div>
        `;

        container.appendChild(messageCard);
    });
}

// Delete Message
function deleteMessage(messageId) {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
        // Remove from array
        AppState.messages = AppState.messages.filter(m => m.id != messageId);

        // Save to localStorage
        saveData();

        // Re-render messages
        renderMessages();

        showToast('🗑️ Mensaje eliminado', 'success');
    }
}

// Photo Modal
function openPhotoModal(photo) {
    const modal = document.getElementById('photoModal');
    const nameEl = document.getElementById('modalUploaderName');
    const timestampEl = document.getElementById('modalTimestamp');
    const mediaContainer = document.getElementById('modalMediaContainer');
    const captionEl = document.getElementById('modalCaption');

    nameEl.textContent = photo.uploaderName;
    timestampEl.textContent = formatTimestamp(photo.timestamp);

    if (photo.resourceType === 'video') {
        mediaContainer.innerHTML = `<video src="${photo.url}" controls style="width: 100%; border-radius: var(--radius-md);"></video>`;
    } else {
        mediaContainer.innerHTML = `<img src="${photo.url}" alt="${photo.caption || 'Foto'}" style="width: 100%; border-radius: var(--radius-md);">`;
    }

    captionEl.textContent = photo.caption || '';
    captionEl.style.display = photo.caption ? 'block' : 'none';

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePhotoModal(event) {
    if (event && event.target !== document.getElementById('photoModal')) {
        return;
    }

    const modal = document.getElementById('photoModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Utility Functions
function getAvatarEmoji(name) {
    const emojis = ['👨', '👩', '🧑', '👦', '👧', '🧒'];
    const index = name.charCodeAt(0) % emojis.length;
    return emojis[index];
}

function formatTimestamp(timestamp, short = false) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (short) {
        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `${diffMins}min`;
        if (diffHours < 24) return `${diffHours}h`;
        return `${diffDays}d`;
    }

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins === 1) return 'Hace 1 minuto';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours === 1) return 'Hace 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">${type === 'success' ? '✅' : '❌'}</span>
            <div>${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Data Persistence
function saveData() {
    try {
        localStorage.setItem('weddingPhotos', JSON.stringify(AppState.photos));
        localStorage.setItem('weddingMessages', JSON.stringify(AppState.messages));
        localStorage.setItem('weddingCategories', JSON.stringify(Array.from(AppState.categories)));
        console.log('✅ Data saved');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function loadData() {
    try {
        const photos = localStorage.getItem('weddingPhotos');
        const messages = localStorage.getItem('weddingMessages');
        const categories = localStorage.getItem('weddingCategories');

        if (photos) {
            AppState.photos = JSON.parse(photos);
        }

        if (messages) {
            AppState.messages = JSON.parse(messages);
        }

        if (categories) {
            AppState.categories = new Set(JSON.parse(categories));
        }

        console.log(`✅ Data loaded: ${AppState.photos.length} photos, ${AppState.messages.length} messages`);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load Photos from Cloudinary
async function loadPhotosFromCloudinary() {
    try {
        const response = await fetch('/api/photos');
        if (!response.ok) {
            throw new Error('Failed to fetch photos from Cloudinary');
        }

        const data = await response.json();
        const cloudinaryPhotos = data.photos || [];

        // Replace AppState.photos with ONLY Cloudinary photos (ignore localStorage)
        AppState.photos = cloudinaryPhotos;

        console.log(`✅ Loaded ${cloudinaryPhotos.length} photos from Cloudinary`);
        console.log(`📸 Total photos in gallery: ${AppState.photos.length}`);
    } catch (error) {
        console.error('Error loading photos from Cloudinary:', error);
        // Keep existing localStorage photos if Cloudinary fails
    }
}

// Auto-refresh (check for new content every 30 seconds)
function checkForUpdates() {
    // Poll for new content
    setInterval(() => {
        if (AppState.currentScreen === 'gallery') {
            loadPhotosFromCloudinary().then(() => {
                const hourFilter = document.getElementById('hourFilter') ? document.getElementById('hourFilter').value : 'all';
                const nameFilter = document.getElementById('nameFilter') ? document.getElementById('nameFilter').value : 'all';
                renderGallery(hourFilter, nameFilter);
            });
        }
    }, 15000); // Check every 15s

    // Check for App Updates (Service Worker)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('✅ Service Worker registered');

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available
                        showUpdateNotification();
                    }
                });
            });
        }).catch(err => console.log('Service Worker registration failed', err));
    }
}

function showUpdateNotification() {
    const toast = document.createElement('div');
    toast.className = 'update-toast';
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: var(--accent-pink); color: white; padding: 15px 25px;
        border-radius: 50px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        z-index: 10000; cursor: pointer; font-weight: bold; animation: slideUp 0.5s ease;
    `;
    toast.innerHTML = '🔄 Nueva versión disponible. Pulsa para actualizar.';
    toast.onclick = () => {
        // Clear cache and reload
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
        window.location.reload(true);
    };
    document.body.appendChild(toast);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePhotoModal();
    }
});
