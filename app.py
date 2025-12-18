from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os

app = Flask(__name__, static_folder='static')
CORS(app)

print("\n" + "="*80)
print("🚀 MISTRAL MODEL - Frontend Server")
print("="*80)
print("API URL will be provided from frontend settings")
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
        'message': 'Frontend server is running'
    })

# Generate endpoint - proxies to Colab API
@app.route('/api/generate', methods=['POST'])
def generate():
    import time
    try:
        data = request.json
        prompt = data.get('prompt', '')
        max_new_tokens = data.get('max_new_tokens', 2048)
        temperature = data.get('temperature', 0.5)
        top_p = data.get('top_p', 0.9)
        colab_api_url = data.get('colab_api_url', '')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
        
        if not colab_api_url:
            return jsonify({'error': 'API URL not configured. Please set it in the frontend settings.'}), 400
        
        print(f"\n{'='*80}", flush=True)
        print(f"🚀 NEW REQUEST - LEGAL DOCUMENT GENERATION", flush=True)
        print(f"Prompt length: {len(prompt)} characters", flush=True)
        print(f"Max tokens requested: {max_new_tokens}", flush=True)
        print(f"Forwarding to Colab API: {colab_api_url}", flush=True)
        
        start_time = time.time()
        
        # Forward request to Colab API (using /api/generate endpoint)
        response = requests.post(
            f"{colab_api_url}/api/generate",
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
        print(f"\n📄 OUTPUT:", flush=True)
        print(f"{'-'*80}", flush=True)
        print(generated_text[:500] + "..." if len(generated_text) > 500 else generated_text, flush=True)
        print(f"{'-'*80}\n", flush=True)
        
        return jsonify({'generated_text': generated_text})
        
    except requests.exceptions.Timeout:
        print(f"❌ ERROR: Request timeout after 10 minutes", flush=True)
        return jsonify({'error': 'Request took longer than 10 minutes'}), 504
        
    except requests.exceptions.ConnectionError:
        error_msg = 'Cannot connect to Colab API - Check if notebook is running and URL is correct'
        print(f"❌ ERROR: {error_msg}", flush=True)
        return jsonify({'error': error_msg}), 503
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}", flush=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7860))
    print(f"🌐 Starting server on http://localhost:{port}...\n")
    app.run(host='0.0.0.0', port=port, debug=False)

