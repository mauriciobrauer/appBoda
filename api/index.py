from http.server import BaseHTTPRequestHandler
import json
import os
import requests
from datetime import datetime, timedelta

# Configuration defaults matching server.py
CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', 'dmhlpqryp')
API_KEY = os.environ.get('CLOUDINARY_API_KEY', '422427495997419')
API_SECRET = os.environ.get('CLOUDINARY_API_SECRET', 'W-SSuMTlNH_T2e4Znb6okMnui4I')
FOLDER = os.environ.get('CLOUDINARY_FOLDER', 'cdb5f9314f082dad2bbb1b92e37a9a36f5')

class handler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if '/api/photos' in self.path:
            self.handle_get_photos()
        else:
            self.send_error(404, "Not Found")

    def do_DELETE(self):
        if '/api/photos' in self.path:
            self.handle_delete_photo()
        else:
            self.send_error(404, "Not Found")

    def handle_get_photos(self):
        try:
            print(f"Fetching photos from Cloudinary. Cloud: {CLOUD_NAME}, Folder: {FOLDER}")
            
            # 1. Fetch Images
            image_url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/image'
            params = {
                'type': 'upload',
                'prefix': FOLDER,
                'max_results': 500,
                'context': 'true'
            }
            
            auth = (API_KEY, API_SECRET)
            
            all_resources = []
            
            # Get Images
            try:
                r_img = requests.get(image_url, params=params, auth=auth, timeout=10)
                if r_img.status_code == 200:
                    data_img = r_img.json()
                    all_resources.extend(data_img.get('resources', []))
                    print(f"Found {len(data_img.get('resources', []))} images")
                else:
                    print(f"Error fetching images: {r_img.text}")
            except Exception as e:
                print(f"Request Error (Images): {e}")

            # 2. Fetch Videos
            try:
                video_url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/video'
                r_vid = requests.get(video_url, params=params, auth=auth, timeout=10)
                if r_vid.status_code == 200:
                    data_vid = r_vid.json()
                    all_resources.extend(data_vid.get('resources', []))
                    print(f"Found {len(data_vid.get('resources', []))} videos")
                else:
                    print(f"Error fetching videos: {r_vid.text}")
            except Exception as e:
                print(f"Request Error (Videos): {e}")

            # Process Resources
            photos = []
            for resource in all_resources:
                context = resource.get('context', {})
                custom_context = context.get('custom', {}) if isinstance(context, dict) else {}
                
                uploader_name = custom_context.get('uploaderName', 'Invitado')
                caption = custom_context.get('caption', '')
                upload_time = custom_context.get('uploadTime', resource.get('created_at'))
                
                # Hour Logic
                hour_category = 'all'
                try:
                    if upload_time:
                        dt_utc = datetime.fromisoformat(upload_time.replace('Z', '+00:00'))
                        dt_cst = dt_utc - timedelta(hours=6)
                        hour = dt_cst.hour
                        
                        def format_hour(h):
                            if h == 0: return '12am'
                            elif h < 12: return f'{h}am'
                            elif h == 12: return '12pm'
                            else: return f'{h - 12}pm'
                        
                        next_hour = (hour + 1) % 24
                        hour_category = f'{format_hour(hour)}-{format_hour(next_hour)}'
                except:
                    pass

                photos.append({
                    'id': resource.get('public_id'),
                    'url': resource.get('secure_url'),
                    'publicId': resource.get('public_id'),
                    'resourceType': resource.get('resource_type', 'image'),
                    'uploaderName': uploader_name,
                    'caption': caption,
                    'timestamp': resource.get('created_at'),
                    'hour': hour_category
                })

            response_data = {
                'photos': photos,
                'debug_info': {
                    'version': 'v4-requests-production',
                    'source': 'resources/image+video',
                    'count': len(photos)
                }
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            # Strong Cache Busting
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())

        except Exception as e:
            import traceback
            traceback.print_exc()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def handle_delete_photo(self):
        try:
            length = int(self.headers.get('content-length'))
            body = json.loads(self.rfile.read(length))
            public_id = body.get('public_id')
            resource_type = body.get('resource_type', 'image')

            if not public_id:
                self.send_error(400, "Missing public_id")
                return

            delete_url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/{resource_type}'
            params = {'public_ids[]': [public_id]}
            auth = (API_KEY, API_SECRET)
            
            r = requests.delete(delete_url, params=params, auth=auth)
            
            if r.status_code == 200:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode())
            else:
                self.send_error(500, f"Cloudinary error: {r.text}")

        except Exception as e:
            self.send_error(500, str(e))
