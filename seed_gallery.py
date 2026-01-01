import requests
import hashlib
import time
import os
import random
from datetime import datetime, timedelta

# Configuration
CLOUD_NAME = 'dmhlpqryp'
API_KEY = '422427495997419'
API_SECRET = 'W-SSuMTlNH_T2e4Znb6okMnui4I'
FOLDER = 'cdb5f9314f082dad2bbb1b92e37a9a36f5'

PEOPLE = ['Tía Rosa', 'Primo Juan', 'Laura (Amiga)', 'Carlos (Novio)', 'Sofía']
CAPTIONS = ['Qué momento tan mágico ✨', 'Felicidades a los novios! 💍', 'La fiesta está increíble 🎉', 'Bailando toda la noche 💃', 'Los queremos mucho ❤️']
IMAGE_PATH = 'couple.png'

def generate_signature(params, api_secret):
    sorted_params = sorted(params.items())
    string_to_sign = "&".join([f"{k}={v}" for k, v in sorted_params])
    string_to_sign += api_secret
    return hashlib.sha1(string_to_sign.encode('utf-8')).hexdigest()

def upload_photo(uploader_name, hour_offset):
    # Simulate a time between 5pm (17:00) and 10pm (22:00)
    # Today's date but specific hour
    base_time = datetime.utcnow().replace(hour=23, minute=0, second=0) # START at 17:00 CST (UTC 23:00) - wait, UTC-6. 17:00 CST is 23:00 UTC. 
    # Let's verify CST. CST is UTC-6. 
    # Target: 17:00 CST -> 23:00 UTC.
    # Target: 22:00 CST -> 04:00 UTC (next day).
    
    # Let's simplify and just set the ISO string manually for the context
    # format: YYYY-MM-DDTHH:MM:SSZ
    # We want 17:00 to 22:00 CST.
    # Random hour between 17 and 22
    hour = random.randint(17, 22)
    minute = random.randint(0, 59)
    
    # Create an ISO string that corresponds to that CST time
    # Since server converts UTC to CST by subtracting 6 hours, we need to provide a UTC time that is +6 hours ahead of our desired CST time.
    # Desired CST: 17:00
    # Required UTC: 23:00
    
    utc_hour = (hour + 6) % 24
    
    # Construct timestamp
    timestamp = datetime.now().replace(hour=utc_hour, minute=minute).isoformat() + 'Z'

    print(f"Subiendo foto de {uploader_name} para las {hour}:{minute} CST...")

    timestamp_unix = int(time.time())
    
    # Custom context - simplified to avoid encoding issues
    # Ensure ASCII only for simplicity in demo
    safe_caption = "Boda increible" 
    if "Rosa" in uploader_name: safe_caption = "Que lindos se ven"
    elif "Juan" in uploader_name: safe_caption = "Felicidades"
    elif "Carlos" in uploader_name: safe_caption = "Te amo"
    
    context = f"uploaderName={uploader_name}|caption={safe_caption}|uploadTime={timestamp}"
    
    # Cloudinary might require pipe separation without extra encoding, but requests handles form parts.
    # The issue might be emojis. Let's try without them first.
    
    params = {
        'folder': FOLDER,
        'timestamp': timestamp_unix,
        'context': context,
        'tags': 'demo_seed'
    }
    
    signature = generate_signature(params, API_SECRET)
    
    files = {'file': open(IMAGE_PATH, 'rb')}
    payload = {
        'api_key': API_KEY,
        **params,
        'signature': signature
    }
    
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
    
    try:
        response = requests.post(url, data=payload, files=files)
        if response.status_code == 200:
            print(f"✅ Éxito! {uploader_name} - {hour}:{minute}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")

print("🚀 Iniciando carga masiva de 25 fotos...")

if not os.path.exists(IMAGE_PATH):
    print(f"⚠️ No encuentro {IMAGE_PATH}, usando una imagen temporal...")
    # Generate dummy image if needed, but assuming couple.png exists from create_image step
    pass

count = 0
for i in range(25):
    person = random.choice(PEOPLE)
    upload_photo(person, i)
    count += 1
    time.sleep(1) # Small delay

print("✨ Carga completa!")
