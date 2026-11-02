# BharatTrade AI — API Documentation

## 1. Overview

BharatTrade AI employs a resilient, hybrid API architecture:
- **Client Services**: Directly interacts with Supabase for user authentication, watchlists, and paper portfolio execution.
- **Python FastAPI Gateway**: Handles server-side AI processing (Gemini API) and indicator calculations.

---

## 2. FastAPI Endpoints

### 2.1 AI Analyst Gateway
- **URL**: `/api/ai/chat`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "prompt": "Analyze technical momentum for RELIANCE",
    "symbol": "RELIANCE"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "answer": "### Technical Momentum Analysis for RELIANCE...",
    "is_live": true
  }
  ```

---

### 2.2 Technical Indicators Calculation
- **URL**: `/api/market/indicators`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "prices": [1420.5, 1425.0, 1432.1, 1440.0, 1435.5, 1450.0, 1468.25],
    "rsi_period": 14,
    "sma_period": 20
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "rsi": 58.24,
    "sma": 1438.45,
    "bollinger": {
      "middle": 1438.45,
      "upper": 1472.10,
      "lower": 1404.80,
      "bandwidth": 4.68
    }
  }
  ```

---

### 2.3 Market Session Status
- **URL**: `/api/market/status`
- **Method**: `GET`
- **Success Response (200 OK)**:
  ```json
  {
    "exchange": "NSE / BSE",
    "current_time_ist": "2026-11-02 08:35:00 PM",
    "is_open": false,
    "trading_hours": "09:15 - 15:30 IST"
  }
  ```

---

## 3. Supabase Stored Procedures (RPC)

### 3.1 `execute_paper_trade`
- **Description**: Atomically validates user balances, executes the simulated transaction, and updates order audit history.
- **Signature**:
  ```sql
  execute_paper_trade(
    p_symbol text,
    p_side text,       -- 'BUY' or 'SELL'
    p_quantity integer,
    p_price numeric
  ) returns jsonb
  ```
- **Return Object**:
  ```json
  {
    "success": true,
    "order_id": "8f8b3c94-1a5e-4c7b-a320-94f4c4a6b281",
    "symbol": "RELIANCE",
    "side": "BUY",
    "quantity": 5,
    "price": 1468.25,
    "new_cash": 92658.75
  }
  ```
