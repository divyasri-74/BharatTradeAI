from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.gemini_service import query_gemini_analyst

router = APIRouter(prefix="/ai", tags=["AI Analyst"])

class ChatRequest(BaseModel):
    prompt: str
    symbol: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    is_live: bool

@router.post("/chat", response_model=ChatResponse)
async def chat_with_analyst(payload: ChatRequest):
    result = await query_gemini_analyst(payload.prompt, payload.symbol)
    return ChatResponse(
        answer=result["answer"],
        is_live=result.get("is_live", False)
    )
