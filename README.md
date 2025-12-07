# 🤖 Mistral Fine-tuned Model - Colab + Local Frontend

A Flask-based frontend server that connects to a Mistral model running on Google Colab. The model runs on Colab's GPU, and your local Flask server provides a beautiful web interface.

**Model:** [`KASHH-4/Mistral-Model-Legal-Advisor`](https://huggingface.co/KASHH-4/Mistral-Model-Legal-Advisor)

## ⚠️ Important Security Notice

This project requires sensitive tokens and API URLs:
- **Never commit** your `.env` file (it's already in `.gitignore`)
- **Keep private:** Hugging Face tokens, ngrok tokens, and API URLs
- See [🔐 Security Notes](#-security-notes) section for details

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Web Browser   │ ◄─────► │  Flask Server    │ ◄─────► │  Colab Model    │
│  (Your Local)   │         │  (Your Local)    │         │  (Cloud GPU)    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
     index.html              app.py proxies                Mistral Model
     app.js                  requests to Colab             on GPU
     style.css
```

## 📁 Project Structure

```
e:\EDI\hf-node-app\
├── app.py                      # Flask server (proxies to Colab)
├── colab_model_server.ipynb    # Run this on Google Colab
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── .env                        # Configuration (create this)
└── static/
    ├── index.html              # Frontend UI
    ├── app.js                  # Frontend logic
    └── style.css               # Styling
```

## 🚀 Setup Instructions

### Step 1: Setup Colab Model Server

1. Open `colab_model_server.ipynb` in Google Colab
2. Get your tokens:
   - **Hugging Face Token**: https://huggingface.co/settings/tokens
   - **ngrok Token**: https://dashboard.ngrok.com/get-started/your-authtoken
3. Run all cells in the notebook:
   - Install dependencies
   - Login to Hugging Face
   - Configure ngrok
   - Load the Mistral model
   - Start the Flask API server
4. **Copy the ngrok URL** (looks like: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)

### Step 2: Setup Local Frontend

1. **Create `.env` file** in the project root:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Then edit .env and add your ngrok URL:
   API_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
   PORT=7860
   ```
   
   **⚠️ Important:** Never commit your `.env` file - it's already in `.gitignore`

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask server**:
   ```bash
   python app.py
   ```

4. **Open your browser**:
   ```
   http://localhost:7860
   ```

## 🎯 How It Works

1. **User enters a prompt** in the web interface
2. **Frontend** (app.js) sends a POST request to local Flask server
3. **Flask server** (app.py) proxies the request to Colab via ngrok URL
4. **Colab** processes the prompt using the Mistral model on GPU
5. **Response flows back**: Colab → Flask → Browser
6. **Generated text** is displayed in the UI

## 🔌 API Endpoints

### Local Flask Server (http://localhost:7860)

#### `GET /`
Serves the frontend web interface

#### `GET /api/health`
Check if the server is running and Colab API is configured

**Response:**
```json
{
  "status": "ok",
  "message": "Frontend server is running",
  "colab_api_configured": true
}
```

#### `POST /api/generate`
Generate text using the model (proxies to Colab)

**Request:**
```json
{
  "prompt": "Write a short story about a robot",
  "max_new_tokens": 256,
  "temperature": 0.7,
  "top_p": 0.9
}
```

**Response:**
```json
{
  "generated_text": "Once upon a time, there was a robot..."
}
```

### Colab API Server (via ngrok)

The Colab notebook runs a Flask server that exposes:

#### `POST /generate`
Direct model inference endpoint

## ⚙️ Configuration

### Environment Variables (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `API_URL` | ngrok URL from Colab | `https://xxxx.ngrok-free.app` |
| `PORT` | Local server port | `7860` |

### Model Parameters

Adjust these in the web interface:

- **Max Tokens**: 50-512 (how much text to generate)
- **Temperature**: 0.1-2.0 (creativity level)
- **Top P**: 0.1-1.0 (nucleus sampling)

## 🛠️ Troubleshooting

### "Cannot connect to Colab API"
- ✅ Check if Colab notebook is running
- ✅ Verify ngrok URL is correct in `.env`
- ✅ Make sure ngrok cell in Colab has run successfully

### "API_URL not configured"
- ✅ Create `.env` file in project root
- ✅ Add `API_URL=your_ngrok_url`

### "Request timeout"
- ✅ Model is loading (first request takes longer)
- ✅ Colab GPU might be slow
- ✅ Increase timeout in `app.py` if needed

### Frontend not loading
- ✅ Check if Flask server is running
- ✅ Visit `http://localhost:7860` (not file://)
- ✅ Check browser console for errors

## 📝 Notes

- **Colab session expires** after inactivity (~12 hours on free tier)
- **ngrok URL changes** each time you restart the Colab notebook
- **Update `.env`** with the new ngrok URL after restarting
- **Free Colab** has usage limits - consider Colab Pro for heavy use
- **Model:** [`KASHH-4/Mistral-Model-Legal-Advisor`](https://huggingface.co/KASHH-4/Mistral-Model-Legal-Advisor) loaded with 4-bit quantization

## 🎨 Frontend Features

- ✨ Modern, responsive UI
- ⚙️ Advanced settings (temperature, tokens, top_p)
- 🎯 Real-time status updates
- 📊 Loading indicators
- ❌ Error handling with clear messages
- 🔄 Ctrl+Enter to generate

## 🔐 Security Notes

- Keep your **Hugging Face token** private (never commit to git)
- Keep your **ngrok token** private (never commit to git)
- Don't commit `.env` file to git (already in `.gitignore`)
- ngrok URLs are public but temporary
- **Important:** The `.env` file contains sensitive API URLs and should never be shared or committed to version control

## 📄 License

This project is licensed under a Custom Software License Agreement. See the [LICENSE](LICENSE) file for details.

**Summary:**
- ✅ Free for personal and educational use
- ✅ Study and learn from the code
- ❌ No commercial use without permission
- ❌ No redistribution

**Legal Disclaimer:** This software is for educational purposes only and does not constitute legal advice. Consult a qualified attorney for legal matters.

## 📦 Dependencies

- **Flask**: Web server framework
- **Flask-CORS**: Cross-origin resource sharing
- **requests**: HTTP library for API calls
- **python-dotenv**: Environment variable management

## 🚀 Production Tips

For production deployment:
1. Use a permanent API endpoint (not ngrok)
2. Add authentication
3. Implement rate limiting
4. Set up proper logging
5. Use a production WSGI server (gunicorn)
6. Add request queuing for multiple users

---

**Model by:** KASHH-4 (organisation)  
**Model:** [`KASHH-4/Mistral-Model-Legal-Advisor`](https://huggingface.co/KASHH-4/Mistral-Model-Legal-Advisor)  
**Platform:** Google Colab + Local Flask

