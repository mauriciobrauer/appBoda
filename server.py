#!/usr/bin/env python3
"""
Simple server for Wedding App with Cloudinary integration
Uses requests library with basic auth
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json

try:
    import requests
except ImportError:
    print("Installing requests...")
    import subprocess
    subprocess.check_call(['pip3', 'install', 'requests'])
    import requests

# Cloudinary Configuration
CLOUD_NAME = 'dmhlpqryp'
API_KEY = '422427495997419'
API_SECRET = 'W-SSuMTlNH_T2e4Znb6okMnui4I'
FOLDER = 'cdb5f9314f082dad2bbb1b92e37a9a36f5'

class WeddingAppHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/photos':
            self.get_cloudinary_photos()
        else:
            # Serve static files
            super().do_GET()

    def get_cloudinary_photos(self):
        """Fetch all photos from Cloudinary folder using Admin API"""
        try:
            all_resources = []
            
            # Fetch images
            url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/image'
            params = {
                'type': 'upload',
                'prefix': FOLDER,
                'max_results': 500,
                'context': 'true'  # Include context metadata
            }
            
            print(f'Fetching from Cloudinary with folder: {FOLDER}')
            response = requests.get(
                url,
                params=params,
                auth=(API_KEY, API_SECRET),
                timeout=15
            )
            
            print(f'Response status: {response.status_code}')
            if response.status_code == 200:
                data = response.json()
                all_resources = data.get('resources', [])
                print(f'Found {len(all_resources)} images')
            else:
                print(f'Error response: {response.text}')
                response.raise_for_status()
            
            # Also fetch videos
            try:
                video_url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/video'
                video_response = requests.get(
                    video_url,
                    params=params,
                    auth=(API_KEY, API_SECRET),
                    timeout=15
                )
                if video_response.status_code == 200:
                    video_data = video_response.json()
                    videos = video_data.get('resources', [])
                    all_resources += videos
                    print(f'Found {len(videos)} videos')
            except Exception as e:
                print(f'Warning: Could not fetch videos: {e}')
            
            # Format response
            photos = []
            for resource in all_resources:
                # Parse context to get uploader name and caption
                context = resource.get('context', {})
                custom_context = context.get('custom', {}) if isinstance(context, dict) else {}
                
                # Extract metadata from context
                uploader_name = custom_context.get('uploaderName', 'Invitado')
                caption = custom_context.get('caption', '')
                upload_time = custom_context.get('uploadTime', resource.get('created_at'))
                
                # Calculate hour category from timestamp (convert UTC to CST)
                hour_category = 'all'
                try:
                    from datetime import datetime, timedelta
                    if upload_time:
                        # Parse UTC time
                        dt_utc = datetime.fromisoformat(upload_time.replace('Z', '+00:00'))
                        # Convert to CST (UTC-6)
                        dt_cst = dt_utc - timedelta(hours=6)
                        hour = dt_cst.hour
                        
                        # Format hour in 12-hour format
                        def format_hour(h):
                            if h == 0:
                                return '12am'
                            elif h < 12:
                                return f'{h}am'
                            elif h == 12:
                                return '12pm'
                            else:
                                return f'{h - 12}pm'
                        
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
            
            print(f'✅ Returning {len(photos)} total resources')
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.end_headers()
            
            response_data = {
                'photos': photos,
                'debug_info': {
                    'version': 'v3-no-cache',
                    'connected_cloud_name': CLOUD_NAME,
                    'target_folder': FOLDER
                }
            }
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            print(f'❌ Error getting photos: {e}')
            self.send_error(500, str(e))

    def do_DELETE(self):
        if '/api/photos' not in self.path:
            self.send_error(404, "Not Found")
            return

        try:
            length = int(self.headers.get('content-length'))
            body = json.loads(self.rfile.read(length))
            public_id = body.get('public_id')
            resource_type = body.get('resource_type', 'image')

            if not public_id:
                self.send_error(400, "Missing public_id")
                return

            print(f'🗑️ Deleting {resource_type}: {public_id}')

            # Use Cloudinary Admin API to delete resources
            # Documentation: https://cloudinary.com/documentation/admin_api#delete_resources
            # Correct endpoint for deleting by public ID via Admin API
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
                print('✅ Deleted successfully')
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode())
            else:
                print(f'❌ Cloudinary delete failed: {response.status_code} - {response.text}')
                self.send_error(500, "Deletion failed")

        except Exception as e:
            print(f'❌ Error deleting photo: {e}')
            self.send_error(500, str(e))

    def log_message(self, format, *args):
        # Custom logging
        # Handle cases where args[0] might not be a string (e.g. status code)
        try:
            if args and isinstance(args[0], str) and '/api/' in args[0]:
                super().log_message(format, *args)
            elif args and not isinstance(args[0], str): 
                # Log non-string args (like status codes)
                super().log_message(format, *args)
        except:
            pass

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, WeddingAppHandler)
    print(f'🎉 Wedding App Server running on http://localhost:{port}')
    print(f'📸 Cloudinary integration enabled')
    print(f'📁 Folder: {FOLDER}')
    print(f'🔑 Using API Key: {API_KEY}')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
