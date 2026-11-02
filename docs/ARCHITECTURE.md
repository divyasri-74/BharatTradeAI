# BharatTrade AI — System Architecture & Design

## 1. Architectural Philosophy

BharatTrade AI follows a **Decoupled Resilient Architecture (DRA)**:
1. **Frontend-First Usability**: The client is fully self-sufficient. Even in offline mode or when backend services/API keys are not configured, the frontend computes technical indicators mathematically from historical series, provides local storage paper trading, and explains market concepts.
2. **Server-Side Security**: Secret API credentials (such as Google Gemini API keys and Supabase service-role keys) never touch the client bundle or `VITE_` variables. All AI requests pass through a secure FastAPI backend.
3. **Dual Persistence Layer**:
   - **Guest Traders**: All paper orders, cash balances, and watchlists are persisted immediately in browser `localStorage`.
   - **Authenticated Users**: The frontend seamlessly syncs data with Supabase PostgreSQL via Row Level Security (RLS) policies and atomic Stored Procedures (RPCs).

---

## 2. Component Structure & Data Flow

```
+-------------------------------------------------------------+
|                      React UI Layer                         |
|   (Dashboard, Analyzer, Screener, Watchlist, PaperTrading)  |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|               State & Context Management                    |
|   (AuthContext, ToastContext, Active Navigation State)      |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                      Service Layer                          |
|   - marketService.js    (Quotes, OHLCV, Indicator formulas) |
|   - portfolioService.js (Paper orders, Holdings, P&L)       |
|   - watchlistService.js (Watchlist management)              |
|   - aiService.js        (Backend proxy + Offline engine)    |
+--------------+-------------------------------+--------------+
               |                               |
               v                               v
+-------------------------------+  +--------------------------+
|      Local Storage Engine     |  |   Remote API & Database  |
|   (Offline / Guest State)     |  |   - Supabase PostgreSQL  |
|                               |  |   - FastAPI / Gemini AI  |
+-------------------------------+  +--------------------------+
```

---

## 3. Financial Engine & Indicator Calculations

Unlike mock prototypes that hardcode indicator figures, BharatTrade AI implements rigorous formulas in `src/utils/technicalAnalysis.js` (and mirrored in the Python backend):

1. **Relative Strength Index (RSI - 14 period)**:
   $$\text{RSI} = 100 - \left( \frac{100}{1 + \text{RS}} \right)$$
   where $\text{RS} = \frac{\text{Smoothed Average Gain}}{\text{Smoothed Average Loss}}$ using Wilder's exponential smoothing method.

2. **Moving Average Convergence Divergence (MACD 12, 26, 9)**:
   - $\text{MACD Line} = \text{EMA}_{12}(\text{Close}) - \text{EMA}_{26}(\text{Close})$
   - $\text{Signal Line} = \text{EMA}_9(\text{MACD Line})$
   - $\text{Histogram} = \text{MACD Line} - \text{Signal Line}$

3. **Bollinger Bands (20 periods, 2 standard deviations)**:
   - $\text{Middle Band} = \text{SMA}_{20}(\text{Close})$
   - $\text{Upper Band} = \text{Middle Band} + 2 \times \sigma_{20}$
   - $\text{Lower Band} = \text{Middle Band} - 2 \times \sigma_{20}$

4. **Support & Resistance Levels**:
   Calculated from standard high/low/close pivot definitions:
   - Pivot $(P) = \frac{\text{High} + \text{Low} + \text{Close}}{3}$
   - Resistance 1 $(R_1) = (2 \times P) - \text{Low}$
   - Support 1 $(S_1) = (2 \times P) - \text{High}$

---

## 4. Database Schema & Concurrency Safety

Supabase tables maintain strict relational integrity with `auth.users(id)`:
- `profiles`: User metadata and display names.
- `watchlists`: Unique constraint on `(user_id, symbol, exchange)`.
- `paper_portfolios`: Stores `virtual_cash` (default ₹1,00,000) with non-negative constraints.
- `paper_orders`: Stores historical transactions with side, quantity, price, and timestamp.
- **Atomic Execution**: Stored procedure `execute_paper_trade` locks the portfolio row during order execution to prevent race conditions.
