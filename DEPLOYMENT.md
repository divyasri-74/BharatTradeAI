# BharatTrade AI — Production Deployment Guide

This guide details the exact step-by-step procedure to deploy BharatTrade AI to production:
- **Backend (Python FastAPI)**: Deployed on **Render** (Free / Starter Web Service).
- **Frontend (React + Vite)**: Deployed on **Vercel** (Global Edge CDN).

---

## 1. Environment Variables Reference

### Frontend Environment Variables (Vercel)
These variables are baked into the frontend build at bundle time. All frontend variables **must** begin with `VITE_`.

| Variable Name | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `VITE_BACKEND_URL` | **Yes** (in production) | `https://bharattrade-backend.onrender.com` | Base URL of your deployed Render FastAPI backend. Do not include trailing slashes. (Defaults to `http://localhost:8000` locally). |
| `VITE_SUPABASE_URL` | Optional | `https://YOUR_PROJECT.supabase.co` | Your Supabase project URL. If omitted, the app operates seamlessly in **Local Storage Guest Mode**. |
| `VITE_SUPABASE_ANON_KEY` | Optional | `eyJh...` | Your Supabase anonymous public key. |

> **Important**: Never add private database passwords, Supabase `service_role` keys, or Gemini API keys to Vercel environment variables.

---

### Backend Environment Variables (Render)
These variables remain secure on the server side and are never exposed to browsers.

| Variable Name | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `ALLOWED_ORIGINS` | **Yes** (in production) | `http://localhost:5173,https://your-app.vercel.app` | Comma-separated list of allowed frontend origins for CORS. |
| `GEMINI_API_KEY` | Optional | `AIza...` | Google Gemini API key from [Google AI Studio](https://aistudio.google.com). If omitted, the backend returns a clear status message and the frontend falls back to its deterministic market intelligence engine. |
| `PORT` | Auto-set by Render | `10000` (locally `8000`) | Network port to bind the server. Automatically supplied by Render's environment. |

---

## 2. Part 1: Deploy Backend on Render

Deploy the backend first so you have your Render URL ready for the frontend.

### Step-by-Step Settings:
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub / GitLab repository containing `BharatTradeAI`.
4. Fill in the exact settings:

| Setting Field | Exact Value to Enter |
| :--- | :--- |
| **Name** | `bharattrade-backend` (or your preferred name) |
| **Language / Runtime** | `Python` |
| **Region** | Singapore (`ap-southeast-1`) or Oregon/Frankfurt |
| **Branch** | `master` (or `main`) |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

5. Under **Environment Variables**, add:
   - `ALLOWED_ORIGINS`: `http://localhost:5173,https://localhost:3000` *(You will append your Vercel URL here once created)*
   - `GEMINI_API_KEY`: *(Optional: paste your Gemini API key, or leave blank to run in offline demo mode)*
   - `PYTHON_VERSION`: `3.11.9`
6. Click **Deploy Web Service**.
7. Wait 2–3 minutes. Once live, Render displays your URL:  
   `https://bharattrade-backend.onrender.com`
8. Verify it in your browser:  
   Visiting `https://bharattrade-backend.onrender.com/` should display:
   ```json
   { "status": "online", "service": "BharatTrade AI Backend Gateway", "version": "2.0.0" }
   ```

---

## 3. Part 2: Deploy Frontend on Vercel

### Step-by-Step Settings:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your `BharatTradeAI` repository.
4. Configure the project:

| Setting Field | Exact Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` (leave blank / root) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

5. Expand **Environment Variables** and add:
   - `VITE_BACKEND_URL`: `https://bharattrade-backend.onrender.com` *(Use your exact Render URL from Part 1)*
   - *(Optional)* `VITE_SUPABASE_URL`: `https://YOUR_PROJECT.supabase.co`
   - *(Optional)* `VITE_SUPABASE_ANON_KEY`: `YOUR_ANON_KEY`
6. Click **Deploy**.
7. In about 40–60 seconds, your site will be live at `https://your-project.vercel.app`.

---

## 4. Part 3: Connect CORS on Render

Once Vercel gives you your production frontend domain (e.g., `https://bharattrade.vercel.app`):
1. Go back to **Render Dashboard** → **bharattrade-backend** → **Environment**.
2. Update `ALLOWED_ORIGINS` to include your Vercel domain:
   ```
   http://localhost:5173,https://bharattrade.vercel.app
   ```
3. Click **Save Changes**. Render will automatically redeploy with the updated CORS policy.

---

## 5. Verification Checklist

- [ ] Visit your Vercel site in a browser.
- [ ] Open the browser developer console (`F12` → Console) to verify zero CORS or 404 errors.
- [ ] Go to **AI Analyst** and ask a question. If Gemini is configured, it will stream live responses from the Render backend. If not configured, it will gracefully show informative educational analysis.
- [ ] Test **Paper Trading**: Buy virtual shares, check holdings, and verify that data persists across refreshes.
