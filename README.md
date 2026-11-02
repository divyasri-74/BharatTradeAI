# BharatTrade AI

A React + Vite + Tailwind + Supabase starter for an Indian stock-market research dashboard and paper-trading simulator.

## Important

- This project currently runs in **DEMO DATA** mode.
- The sample index values, stock prices, indicators, chart values and news are illustrative only.
- No live NSE/BSE feed is connected.
- No real broker orders are placed.
- The AI analyst currently returns a demo response. It is not connected to Gemini/OpenAI yet.
- Do not use demo values for investment decisions.

## Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm
- Antigravity, VS Code, or another code editor

## Run locally

1. Extract the ZIP.
2. Open the `BharatTradeAI` folder in Antigravity.
3. Open its terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed in the terminal (normally `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Supabase setup (optional for this demo)

1. Create a project at https://supabase.com.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the contents of `supabase/schema.sql`.
4. Open Project Settings → API and copy the Project URL and anon/public key.
5. Copy `.env.example` to `.env`.
6. Set:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

7. Restart `npm run dev`.

The current UI uses local in-memory demo state and does not yet persist application actions to Supabase. The schema is provided as the database foundation for the next integration step.

## Suggested next implementation steps

1. Add Supabase Auth (sign up, sign in, sign out).
2. Persist watchlists and paper portfolios using the supplied schema.
3. Move paper-trade execution into a secure Postgres function or backend transaction. Never rely on client-side balance updates for production.
4. Select a market-data provider (for example, Upstox or Zerodha Kite Connect) and verify API access, market-data licensing and display permissions.
5. Create a secure backend or Supabase Edge Function for provider credentials. Do not put broker secrets or LLM API keys in `VITE_` variables.
6. Integrate a news provider and retain original source URLs and timestamps.
7. Add a server-side Gemini/OpenAI integration for evidence-grounded explanations.
8. Add tests for indicator calculations and paper-trading accounting.

## Project structure

```text
BharatTradeAI/
├── src/
│   ├── data/market.js
│   ├── lib/supabase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/schema.sql
├── .env.example
├── package.json
└── README.md
```

## Disclaimer

This software is an educational market-research and paper-trading starter. It is not investment advice, a registered advisory service, or an automated real-money trading system. Real-time market data may require a paid subscription and explicit redistribution/display permissions. Review applicable SEBI, exchange and broker requirements before offering trading-related services.
