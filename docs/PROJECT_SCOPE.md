# BharatTrade AI — MVP Scope

## Product
Indian equity market research dashboard with technical analysis, AI-assisted explanations and virtual paper trading.

## Included in this starter
- Responsive dashboard navigation
- Demo index overview and chart
- Demo stock universe and stock analyzer
- Indicator explanation cards
- AI analyst interaction UI with explicitly demo response
- Demo news and sentiment cards
- Stock screener with filters
- Local watchlist state
- Local paper trading simulator with virtual cash
- Supabase schema for profiles, watchlists and paper trading
- Setup and Antigravity continuation prompts

## Not yet implemented
- Live NSE/BSE market data
- Real news provider
- Live LLM inference
- Supabase Auth UI and persistence
- Server-side trade execution and database persistence
- Real-money broker integration
- Backtesting engine

## MVP acceptance checks
- `npm install` completes
- `npm run dev` starts the app
- All seven navigation pages render
- Screener filters change results
- Watchlist add/remove works during the browser session
- Paper buy/sell updates the in-memory virtual balance and holdings
- `npm run build` completes

## Data and financial safety
All bundled market numbers are illustrative. The app is for education and paper trading only. Do not represent sample data as live exchange data or use it for investment decisions.
