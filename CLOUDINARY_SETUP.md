# Configuración de Cloudinary

## Paso 1: Obtener tu Cloud Name

1. Ve a tu [Cloudinary Dashboard](https://cloudinary.com/console)
2. En la parte superior verás "Cloud name" - ejemplo: `dmwexample`
3. Copia ese valor

## Paso 2: Actualizar la configuración

En el archivo `app.js`, línea 6, reemplaza:

```javascript
cloudName: 'YOUR_CLOUD_NAME'
```

Con tu cloud name real:

```javascript
cloudName: 'dmwexample'  // Usa tu cloud name aquí
```

## Paso 3: Configurar Upload Preset (Opcional)

Si quieres usar un preset personalizado:

1. Ve a Settings → Upload → Upload presets
2. Haz clic en "Add upload preset"
3. Configuración recomendada:
   - **Preset name**: `wedding_uploads`
   - **Signing mode**: Unsigned
   - **Folder**: `wedding-photos` (opcional)
   - **Use filename**: Yes
   - **Unique filename**: Yes
   - **Overwrite**: No
4. Guarda

Luego actualiza en `app.js`:

```javascript
uploadPreset: 'wedding_uploads'
```

## Alternativa: Modo Demo (Sin Cloudinary)

Si quieres probar la app sin configurar Cloudinary, puedes usar el modo demo que guarda las imágenes solo en el navegador (no persistente):

En `app.js`, cambia la función `uploadToCloudinary` por:

```javascript
async function uploadToCloudinary(file) {
    // Demo mode - convert to base64 for local viewing
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
```

**Nota**: En modo demo, las imágenes solo estarán disponibles en ese navegador específico y se perderán al limpiar el caché.

## Credenciales Actuales

- **API Key**: 422427495997419
- **API Secret**: W-SSuMTlNH_T2e4Znb6okMnui4I
- **Cloud Name**: ⚠️ NECESARIO - Por favor obtén de tu dashboard

## Troubleshooting

### Error: "Upload failed"
- Verifica que el cloud name sea correcto
- Asegúrate de que el preset sea "Unsigned"
- Revisa la consola del navegador para más detalles

### Error: "Invalid API key"
- Las credenciales están en el código
- El cloud name es lo único que necesitas actualizar

### Las imágenes no se ven
- Verifica tu conexión a internet
- Asegúrate de que Cloudinary esté configurado correctamente
- Usa el modo demo para pruebas locales
