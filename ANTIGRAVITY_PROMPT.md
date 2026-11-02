# Antigravity build prompt

Open this project folder in Antigravity and paste the following prompt:

You are the senior full-stack engineer continuing the BharatTrade AI project.

First read README.md, inspect the complete source code, and understand the existing React + Vite + Tailwind architecture and Supabase schema.

Rules:
- Preserve the current visual design and working screens.
- Do not invent live market data.
- Keep DEMO DATA visibly labelled until a licensed provider is configured.
- Do not add real-money order execution.
- Never expose Supabase service_role keys, broker secrets, or AI API keys in frontend code.
- Implement one feature at a time and run npm run build after each meaningful change.

Next tasks, in order:
1. Implement Supabase Auth (sign up, sign in, sign out, session handling).
2. Persist user watchlists to Supabase.
3. Implement secure paper portfolio persistence and atomic simulated buy/sell operations using a Postgres RPC function or trusted backend.
4. Add a server-side market-data provider adapter. Start in mock mode; only enable live mode after credentials and display permissions are confirmed.
5. Add a server-side AI analyst endpoint that receives verified technical indicators and source-linked news, then returns validated structured explanations.
6. Add tests, error states and deployment documentation.

Before coding, list the files you intend to change and explain the implementation plan. Then implement the first task only.