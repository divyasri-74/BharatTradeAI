from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timezone, timedelta
from app.services.indicators import calculate_rsi, calculate_sma, calculate_ema, calculate_bollinger_bands

router = APIRouter(prefix="/market", tags=["Market & Indicators"])

class IndicatorRequest(BaseModel):
    prices: List[float]
    rsi_period: Optional[int] = 14
    sma_period: Optional[int] = 20

@router.post("/indicators")
async def compute_indicators(req: IndicatorRequest):
    return {
        "rsi": calculate_rsi(req.prices, req.rsi_period),
        "sma": calculate_sma(req.prices, req.sma_period),
        "bollinger": calculate_bollinger_bands(req.prices)
    }

@router.get("/status")
async def get_market_status():
    ist_offset = timezone(timedelta(hours=5, minutes=30))
    now_ist = datetime.now(ist_offset)
    is_weekend = now_ist.weekday() >= 5
    open_time = now_ist.replace(hour=9, minute=15, second=0, microsecond=0)
    close_time = now_ist.replace(hour=15, minute=30, second=0, microsecond=0)
    is_open = (not is_weekend) and (open_time <= now_ist <= close_time)

    return {
        "exchange": "NSE / BSE",
        "current_time_ist": now_ist.strftime("%Y-%m-%d %I:%M:%S %p"),
        "is_open": is_open,
        "trading_hours": "09:15 - 15:30 IST"
    }
