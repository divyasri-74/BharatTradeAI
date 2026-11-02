import os
import sys
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Ensure backend root is always in sys.path
backend_root = Path(__file__).resolve().parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

load_dotenv()

def parse_allowed_origins() -> list[str]:
    raw = os.getenv("ALLOWED_ORIGINS", "")
    if raw.strip():
        # Split by comma and strip whitespace
        origins = [o.strip() for o in raw.split(",") if o.strip()]
        if origins:
            return origins
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]

class Settings(BaseModel):
    PROJECT_NAME: str = "BharatTrade AI Backend Gateway"
    API_V1_STR: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", 8000))
    ALLOWED_ORIGINS: list[str] = parse_allowed_origins()

settings = Settings()
