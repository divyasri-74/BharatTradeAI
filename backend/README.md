# BharatTrade AI — Python FastAPI Backend

This backend acts as a secure server-side microservice for BharatTrade AI. It protects your Gemini API credentials, computes server-side technical indicators, and exposes clean REST endpoints for the React frontend.

---

## 1. Setup & Installation

### Step 1: Navigate to the backend folder
```bash
cd backend
```

### Step 2: Create a virtual environment (Recommended)
```bash
python -m venv venv
```

Activate it:
- **Windows (PowerShell)**: `venv\Scripts\Activate.ps1`
- **Windows (CMD)**: `venv\Scripts\activate.bat`
- **macOS / Linux**: `source venv/bin/activate`

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

---

## 2. Configuration

Copy the example environment file:
```bash
copy .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_from_ai_studio
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=8000
```

> **Security Note**: Never expose your `GEMINI_API_KEY` in frontend code. It stays safely on this backend server.

---

## 3. Start the Server

```bash
uvicorn app.main:app --reload --port 8000
```

- **Interactive API Documentation (Swagger)**: Open [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/](http://localhost:8000/)

---

## 4. Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Service health status |
| `POST` | `/api/ai/chat` | AI market analyst query gateway (Gemini proxy) |
| `POST` | `/api/market/indicators` | Mathematical indicator calculations |
| `GET` | `/api/market/status` | Indian market (NSE/BSE) trading session status |
