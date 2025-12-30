from http.server import BaseHTTPRequestHandler
import json
import os
import requests
from urllib.parse import parse_qs, urlparse
from datetime import datetime, timedelta

# Configuration from Environment Variables
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
        # Only handle API requests
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
            # Setup Cloudinary API URL
            url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/search'
             
            # Parameters for search
            params = {
                'expression': f'folder:{FOLDER} AND resource_type:image',
                'max_results': 500,
                'sort_by': 'created_at:desc',
                'context': 'true'
            }
            
            # Make request
            response = requests.get(url, params=params, auth=(API_KEY, API_SECRET))
            
            if response.status_code != 200:
                print(f"Error from Cloudinary: {response.text}")
                self.send_response(500)
                self.end_headers()
                return

            data = response.json()
            resources = data.get('resources', [])
            
            # Process resources similar to local server
            photos = []
            for resource in resources:
                context = resource.get('context', {})
                custom_context = context.get('custom', {})
                
                uploader_name = custom_context.get('uploaderName', 'Invitado')
                caption = custom_context.get('caption', '')
                upload_time = custom_context.get('uploadTime', resource.get('created_at'))
                
                # Calculate hour category (UTC to CST)
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
                    'timestamp': resource.get('created_at'),
                    'uploaderName': uploader_name,
                    'caption': caption,
                    'hour': hour_category
                })
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'photos': photos}).encode())
            
        except Exception as e:
            self.send_error(500, str(e))

    def handle_delete_photo(self):
        try:
            length = int(self.headers.get('content-length'))
            body = json.loads(self.rfile.read(length))
            public_id = body.get('public_id')
            resource_type = body.get('resource_type', 'image')

            if not public_id:
                self.send_error(400, "Missing public_id")
                return

            # Admin API delete
            delete_url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/{resource_type}'
            
            params = {
                'public_ids[]': [public_id]
            }
            
            response = requests.delete(
                delete_url,
                params=params, 
                auth=(API_KEY, API_SECRET)
            )

            if response.status_code == 200:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode())
            else:
                self.send_error(500, "Deletion failed")

        except Exception as e:
            self.send_error(500, str(e))
