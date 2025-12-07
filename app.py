from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

# Get Colab API URL from environment variable
COLAB_API_URL = os.getenv('API_URL', '')

print("\n" + "="*80)
print("🚀 MISTRAL MODEL - Frontend Server")
print("="*80)
print(f"Colab API URL: {COLAB_API_URL if COLAB_API_URL else '❌ NOT SET - Please configure .env file'}")
print("="*80 + "\n")

# Serve static files
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)


# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'Frontend server is running',
        'colab_api_configured': bool(COLAB_API_URL)
    })

# Generate endpoint - proxies to Colab API
@app.route('/api/generate', methods=['POST'])
def generate():
    import time
    try:
        data = request.json
        prompt = data.get('prompt', '')
        max_new_tokens = data.get('max_new_tokens', 4096)  # Increased to 4096 tokens
        temperature = data.get('temperature', 0.7)
        top_p = data.get('top_p', 0.9)
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
        
        if not COLAB_API_URL:
            return jsonify({'error': 'API_URL not configured. Please set it in .env file'}), 500
        
        print(f"\n{'='*80}", flush=True)
        print(f"🚀 NEW REQUEST - LEGAL DOCUMENT GENERATION", flush=True)
        print(f"Prompt length: {len(prompt)} characters", flush=True)
        print(f"Max tokens requested: {max_new_tokens}", flush=True)
        print(f"Forwarding to Colab API: {COLAB_API_URL}", flush=True)
        
        start_time = time.time()
        
        # Forward request to Colab API (using /api/generate endpoint)
        # No retry logic - single attempt with 10-minute timeout
        response = requests.post(
            f"{COLAB_API_URL}/api/generate",
            json={
                'prompt': prompt,
                'max_new_tokens': max_new_tokens,
                'temperature': temperature,
                'top_p': top_p
            },
            timeout=600  # 10 minutes timeout
        )
        
        if response.status_code != 200:
            error_msg = f"Colab API error: {response.status_code}"
            print(f"❌ {error_msg}", flush=True)
            return jsonify({'error': error_msg}), 500
        
        result = response.json()
        generated_text = result.get('generated_text', '')
        
        elapsed = time.time() - start_time
        
        print(f"✅ Generated in {elapsed:.2f}s", flush=True)
        print(f"📊 Response length: {len(generated_text)} characters", flush=True)
        print(f"\n📄 COMPLETE OUTPUT:", flush=True)
        print(f"{'-'*80}", flush=True)
        print(generated_text, flush=True)
        print(f"{'-'*80}\n", flush=True)
        
        return jsonify({'generated_text': generated_text})
        
    except requests.exceptions.Timeout:
        print(f"❌ ERROR: Request timeout after 10 minutes", flush=True)
        return jsonify({'error': 'timeout', 'message': 'Request took longer than 10 minutes'}), 504
        
    except requests.exceptions.ConnectionError:
        error_msg = 'Cannot connect to Colab API - Check if notebook is running'
        print(f"❌ ERROR: {error_msg}", flush=True)
        return jsonify({'error': error_msg}), 503
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}", flush=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7860))
    print(f"🌐 Starting server on http://localhost:{port}...\n")
    app.run(host='0.0.0.0', port=port, debug=False)

