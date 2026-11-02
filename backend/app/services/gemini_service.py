import httpx
from typing import Optional
from app.core.config import settings

GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

SYSTEM_INSTRUCTION = """You are Bharat AI, an elite financial research assistant specializing in Indian Equities (NSE and BSE), technical analysis, market breadth, and economic developments.
Guidelines:
1. Provide structured, educational market intelligence.
2. Formulate clear technical analysis explaining indicators like RSI, MACD, Moving Averages, Support & Resistance.
3. Distinguish educational analysis from financial advisory. Never guarantee trading profits.
4. Keep answers professional, concise, and formatted in clean markdown.
"""

async def query_gemini_analyst(prompt: str, symbol: Optional[str] = None) -> dict:
    key = settings.GEMINI_API_KEY
    if not key or key == "YOUR_GEMINI_API_KEY_HERE":
        return {
            "answer": (
                f"### 🤖 Bharat AI Backend Notice\n\n"
                f"The server-side Gemini integration is ready, but `GEMINI_API_KEY` is not yet configured in `backend/.env`.\n\n"
                f"**How to enable live Gemini AI:**\n"
                f"1. Get a free API key at [Google AI Studio](https://aistudio.google.com).\n"
                f"2. Add it to `backend/.env` as `GEMINI_API_KEY=your_key`.\n"
                f"3. Restart the FastAPI server (`uvicorn app.main:app --reload`).\n\n"
                f"*In the meantime, our deterministic market reasoning engine continues to evaluate queries.*"
            ),
            "is_live": False
        }

    user_content = prompt
    if symbol:
        user_content = f"Context equity symbol: {symbol}\n\nUser Question: {prompt}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{SYSTEM_INSTRUCTION}\n\n{user_content}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 800
        }
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{GEMINI_API_ENDPOINT}?key={key}",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            data = response.json()
            candidates = data.get("candidates", [])
            if candidates:
                text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                return {"answer": text, "is_live": True}
            return {
                "answer": "Received an empty response from the Gemini API gateway.",
                "is_live": False
            }
    except Exception as e:
        return {
            "answer": f"Backend AI gateway temporary exception: {str(e)}. Please check your internet connectivity and API key quota.",
            "is_live": False
        }
