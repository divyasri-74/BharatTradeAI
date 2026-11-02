# BharatTrade AI — Indian Stock Market Intelligence & Paper Trading Platform

A modern full-stack web platform for Indian equities research, technical indicator analysis, and risk-free paper trading.

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Python FastAPI**, designed for dual-cloud deployment on **Vercel** (frontend) and **Render** (backend).

---

## ⚠️ Platform Operating Mode

- **Current Dataset**: Illustrative demonstration and research snapshot.
- **Trading Simulator**: Educational virtual paper trading with ₹1,00,000 initial virtual capital. Zero real capital involved.
- **AI Co-pilot**: Bharat AI routes queries securely to the FastAPI server gateway. If a Gemini API key is not configured, it runs on our built-in financial knowledge reasoning engine.
- **Disclaimer**: Educational market analysis tool only. Not registered SEBI investment advice.

---

## 🛠️ Technology Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons | Responsive fintech dashboard, charts, screener |
| **Backend** | Python FastAPI, Uvicorn, Pydantic, HTTPX | Secure Gemini AI proxy, indicator math, session status |
| **Database** | Supabase PostgreSQL + LocalStorage | Dual-engine persistence for auth users and guests |
| **Deployment** | Vercel (Frontend Edge) + Render (Backend Web Service) | Production cloud hosting |

---

## 🚀 Running Locally

### 1. Frontend Setup (React + Vite)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

---

### 2. Backend Setup (Python FastAPI - Optional for Live Gemini)
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- Service Root: [http://localhost:8000/](http://localhost:8000/)

---

## 🌐 Production Deployment

Complete, step-by-step instructions for deploying to **Vercel** and **Render** can be found in:  
👉 **[DEPLOYMENT.md](file:///d:/Projects/BharatTradeAI/DEPLOYMENT.md)**

---

## 📁 Repository Structure

```
BharatTradeAI/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── api/              # AI and Market API routes
│   │   ├── core/             # Configuration & CORS settings
│   │   ├── services/         # Gemini proxy & indicator calculations
│   │   └── main.py           # FastAPI entry point
│   ├── requirements.txt
│   └── .env.example
├── docs/                     # Project Architecture & API Documentation
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   └── IMPLEMENTATION_STATUS.md
├── src/                      # React 18 Frontend
│   ├── components/           # UI components (Layout, Auth, Trading, Common)
│   ├── context/              # AuthContext, ToastContext
│   ├── data/                 # Market quotes & 65-day OHLCV series
│   ├── pages/                # Dashboard, Analyzer, Screener, Watchlist, PaperTrading, AI
│   ├── services/             # marketService, portfolioService, aiService, etc.
│   └── utils/                # technicalAnalysis.js (mathematical formulas)
├── supabase/                 # Supabase schema & migrations
│   ├── schema.sql
│   └── migrations/01_paper_trade_rpc.sql
├── DEPLOYMENT.md             # Production deployment guide
├── render.yaml               # Render Infrastructure Blueprint
└── vercel.json               # Vercel SPA routing configuration
```
