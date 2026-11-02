from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.ai import router as ai_router
from app.api.market import router as market_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Secure backend gateway for BharatTrade AI: Gemini LLM proxy, technical indicators, and market status.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
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
        "docs": "/docs"
    }
