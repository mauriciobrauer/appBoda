from http.server import BaseHTTPRequestHandler
import json
import os
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
            # Try minimal dependencies approach (urllib instead of requests)
            import urllib.request
            import base64
            
            # Setup Cloudinary API URL
            url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/search'
             
            # Parameters for search (manual query string construction)
            # DEBUG: REMOVE FOLDER FILTER TO FIND ANY PHOTOS
            query_params = {
                'expression': 'resource_type:image', 
                'max_results': '500',
                'sort_by': 'created_at:desc',
                'context': 'true'
            }
            
            # Encode params
            from urllib.parse import urlencode
            full_url = f"{url}?{urlencode(query_params)}"
            
            # Create Request
            req = urllib.request.Request(full_url)
            
            # Basic Auth Header
            auth_str = f"{API_KEY}:{API_SECRET}"
            auth_b64 = base64.b64encode(auth_str.encode()).decode()
            req.add_header("Authorization", f"Basic {auth_b64}")
            
            # Make request
            with urllib.request.urlopen(req) as response:
                response_body = response.read()
                data = json.loads(response_body)
            
            resources = data.get('resources', [])
            
            # Process resources similar to local server (keep existing logic)
            
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
                
                # Copy existing logic but ensure safe access
                context = resource.get('context', {}).get('custom', {})
                photos.append({
                    'id': resource.get('public_id'),
                    'url': resource.get('secure_url'),
                    'width': resource.get('width'),
                    'height': resource.get('height'),
                    'format': resource.get('format'),
                    'uploaderName': context.get('uploader', 'Anónimo'),
                    'caption': context.get('caption', ''),
                    'timestamp': resource.get('created_at'),
                    'publicId': resource.get('public_id'),
                    'resourceType': resource.get('resource_type')
                })
            
            response_data = {
                'photos': photos,
                'debug_info': {
                    'connected_cloud_name': CLOUD_NAME,
                    'target_folder': FOLDER,
                    'search_expression': query_params['expression']
                }
            }
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Server Error: {str(e)}")
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': str(e),
                'details': error_details,
                'config': {
                    'cloud_name': CLOUD_NAME,
                    'api_key': API_KEY,
                    'folder': FOLDER,
                    'secret_len': len(API_SECRET) if API_SECRET else 0
                }
            }).encode())

    def handle_delete_photo(self):
        try:
            length = int(self.headers.get('content-length'))
            body = json.loads(self.rfile.read(length))
            public_id = body.get('public_id')
            resource_type = body.get('resource_type', 'image')

            if not public_id:
                self.send_error(400, "Missing public_id")
                return

            # Admin API delete using urllib
            delete_url_base = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/{resource_type}'
            
            from urllib.parse import urlencode, quote
            # Cloudinary expects repeated keys 'public_ids[]' for array. 
            # urlencode supports list of tuples or dict with list values if doseq=True
            
            delete_params = {
                'public_ids[]': public_id
            }
            query_string = urlencode(delete_params)
            full_delete_url = f"{delete_url_base}?{query_string}"
            
            import urllib.request
            import base64
            
            req = urllib.request.Request(full_delete_url, method='DELETE')
            
            # Auth
            auth_str = f"{API_KEY}:{API_SECRET}"
            auth_b64 = base64.b64encode(auth_str.encode()).decode()
            req.add_header("Authorization", f"Basic {auth_b64}")
            
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True}).encode())
                else:
                    raise Exception(f"Delete Failed: {response.status}")

        except Exception as e:
            self.send_error(500, str(e))
