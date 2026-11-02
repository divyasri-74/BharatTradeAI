import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.api.ai import router as ai_router
from app.api.market import router as market_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Secure backend gateway for BharatTrade AI: Gemini LLM proxy, technical indicators, and market status.",
    version="2.0.0"
)

# Handle wildcard vs specific origins for CORS credentials compatibility
is_wildcard = "*" in settings.ALLOWED_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=not is_wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(market_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "2.0.0",
        "docs": "/docs",
        "allowed_origins": settings.ALLOWED_ORIGINS
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", settings.PORT))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
