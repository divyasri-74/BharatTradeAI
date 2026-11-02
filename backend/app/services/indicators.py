import math
from typing import List, Optional, Dict, Any

def calculate_sma(prices: List[float], period: int) -> Optional[float]:
    if not prices or len(prices) < period or period <= 0:
        return None
    return round(sum(prices[-period:]) / period, 2)

def calculate_ema(prices: List[float], period: int) -> Optional[float]:
    if not prices or len(prices) < period or period <= 0:
        return None
    multiplier = 2 / (period + 1)
    ema = sum(prices[:period]) / period
    for p in prices[period:]:
        ema = (p - ema) * multiplier + ema
    return round(ema, 2)

def calculate_rsi(prices: List[float], period: int = 14) -> Optional[float]:
    if not prices or len(prices) <= period:
        return None
    gains = []
    losses = []
    for i in range(1, len(prices)):
        diff = prices[i] - prices[i - 1]
        gains.append(diff if diff > 0 else 0.0)
        losses.append(abs(diff) if diff < 0 else 0.0)
    
    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period

    for i in range(period, len(gains)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period

    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return round(100 - (100 / (1 + rs)), 2)

def calculate_bollinger_bands(prices: List[float], period: int = 20, multiplier: float = 2.0) -> Optional[Dict[str, float]]:
    if not prices or len(prices) < period:
        return None
    slice_prices = prices[-period:]
    sma = sum(slice_prices) / period
    variance = sum((p - sma) ** 2 for p in slice_prices) / period
    std_dev = math.sqrt(variance)
    upper = sma + (multiplier * std_dev)
    lower = sma - (multiplier * std_dev)
    bandwidth = ((upper - lower) / sma) * 100
    return {
        "middle": round(sma, 2),
        "upper": round(upper, 2),
        "lower": round(lower, 2),
        "bandwidth": round(bandwidth, 2)
    }
