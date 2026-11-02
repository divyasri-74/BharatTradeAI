import React, { useState, useEffect } from 'react'
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CandlestickChart,
  Wallet,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  Check
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { marketService } from '../services/marketService'
import { SignalBadge } from '../components/common/Badge'
import { CardSkeleton } from '../components/common/Skeleton'

const money = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)

export function Dashboard({ onNavigate, onSelectStock, onTradeStock, onToggleWatch, isWatched }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [stocks, setStocks] = useState([])
  const [period, setPeriod] = useState('1D')

  useEffect(() => {
    async function load() {
      try {
        const [overview, stockList] = await Promise.all([
          marketService.getMarketOverview(),
          marketService.getStockList()
        ])
        setData(overview)
        setStocks(stockList)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    )
  }

  const { status, indices, sectors, intradayChart } = data
  const topGainers = [...stocks].sort((a, b) => b.change - a.change).slice(0, 5)

  return (
    <div className="space-y-7">
      {/* Hero Welcome Banner */}
      <div className="grid-bg relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#14283a] via-panel to-panel p-6 md:p-8">
        <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-mint/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-3 py-1 text-[11px] font-semibold text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            INDIAN EQUITIES RESEARCH & TRADING LAB
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
            See the market.<br />
            <span className="text-mint">Understand the signal.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Professional Indian equities intelligence with mathematical indicators, live sentiment, and risk-free paper trading.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => onNavigate('analyzer')}>
              <CandlestickChart size={16} /> Analyse a stock
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('paper')}>
              <Wallet size={16} /> Try paper trading
            </button>
          </div>
        </div>

        <div className="absolute bottom-5 right-6 hidden text-right lg:block">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-end">
            <Clock size={12} /> Last updated: {status.timestamp}
          </div>
          <p className="mt-1 text-xs font-semibold text-gold">DEMO STREAM ACTIVE</p>
          <p className="text-[10px] text-slate-500">Illustrative exchange dataset</p>
        </div>
      </div>

      {/* Benchmark Indices Grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase text-slate-400">
            Market Benchmarks
          </h2>
          <span className="text-xs text-muted">NSE / BSE Live Quotes Demo</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {indices.map((idx) => (
            <div key={idx.name} className="card p-4 hover:border-slate-600 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">{idx.name}</span>
                <span className="rounded-lg bg-white/5 p-1.5 text-muted">
                  <Activity size={14} />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white">{idx.value}</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <span className={idx.positive ? 'text-mint' : 'text-danger'}>
                  {idx.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </span>
                <span className={`font-semibold ${idx.positive ? 'text-mint' : 'text-danger'}`}>
                  {idx.change} ({idx.points})
                </span>
                <span className="text-slate-500 text-[11px]">today</span>
              </div>
              <div className="mt-3 border-t border-line/60 pt-2 flex justify-between text-[10px] text-slate-500">
                <span>Open: {idx.open?.toLocaleString('en-IN')}</span>
                <span>High: {idx.high?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts & Market Pulse Section */}
      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        {/* NIFTY 50 Intraday Chart Card */}
        <div className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-muted">NIFTY 50 · INTRADAY TIMELINE</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">24,812.35</span>
                <span className="text-xs font-semibold text-mint">+0.62% (+152.80)</span>
              </div>
            </div>
            <div className="flex gap-1 rounded-xl bg-[#0b1320] p-1 border border-line">
              {['1D', '1W', '1M', '1Y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                    period === p ? 'bg-mint text-ink font-semibold' : 'text-muted hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intradayChart}>
                <defs>
                  <linearGradient id="dashboardChartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#37d6a0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#37d6a0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#263349" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#71819a', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={['dataMin - 80', 'dataMax + 60']}
                  tick={{ fill: '#71819a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={54}
                />
                <Tooltip
                  contentStyle={{
                    background: '#111a2a',
                    border: '1px solid #263349',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 12
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'NIFTY 50']}
                />
                <Area type="monotone" dataKey="price" stroke="#37d6a0" strokeWidth={2.5} fill="url(#dashboardChartFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[10px] text-slate-500">
            Intraday benchmark series · Illustrative continuous feed
          </p>
        </div>

        {/* AI Briefing Card */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">AI BRIEFING</p>
                <h2 className="text-base font-semibold text-white">Market Pulse</h2>
              </div>
              <span className="rounded-lg bg-mint/10 p-2 text-mint">
                <Sparkles size={16} />
              </span>
            </div>

            <div className="rounded-xl border border-mint/20 bg-mint/[.05] p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-mint">
                <Activity size={15} /> Tech and Healthcare Momentum
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                Indian IT majors (INFY, TCS) and specialty pharma (SUNPHARMA) show resilient accumulation, while auto dispatches note selective margin pressures.
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                { t: 'Sector Breadth', d: '6 out of 8 benchmark sectors are in net positive territory.' },
                { t: 'Volatility Check', d: 'India VIX at 13.82 signals benign systemic risk premiums.' },
                { t: 'Actionable Step', d: 'Inspect RSI & MACD setups in the Stock Analyzer.' }
              ].map((x) => (
                <div key={x.t} className="flex gap-2.5 text-xs">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mint shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{x.t}: </span>
                    <span className="text-muted">{x.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn btn-secondary mt-5 w-full text-xs flex items-center justify-center gap-2"
            onClick={() => onNavigate('analyst')}
          >
            Ask Bharat AI for In-depth Insights <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Market Movers & Sector Snapshot */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        {/* Top Gainers & Movers */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">TOP PERFORMERS</p>
              <h2 className="text-base font-semibold text-white">Stocks in Focus</h2>
            </div>
            <button onClick={() => onNavigate('screener')} className="text-xs text-mint hover:underline">
              View full screener →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Change</th>
                  <th className="pb-3 font-medium">RSI (14)</th>
                  <th className="pb-3 font-medium">Signal</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topGainers.map((s) => (
                  <tr key={s.symbol} className="border-b border-line/60 last:border-0 hover:bg-white/[0.02]">
                    <td className="py-3">
                      <button
                        onClick={() => onSelectStock(s)}
                        className="text-left group"
                      >
                        <p className="text-xs font-semibold text-white group-hover:text-mint transition">
                          {s.symbol}
                        </p>
                        <p className="text-[10px] text-muted">{s.name}</p>
                      </button>
                    </td>
                    <td className="py-3 text-xs font-medium text-white">{money(s.price)}</td>
                    <td className={`py-3 text-xs font-semibold ${s.change >= 0 ? 'text-mint' : 'text-danger'}`}>
                      {s.change > 0 ? '+' : ''}{s.change.toFixed(2)}%
                    </td>
                    <td className="py-3 text-xs text-slate-300 font-mono">{s.rsi}</td>
                    <td className="py-3">
                      <SignalBadge signal={s.signal} />
                    </td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => onToggleWatch(s)}
                        title={isWatched(s.symbol) ? 'Saved in Watchlist' : 'Add to Watchlist'}
                        className={`rounded-lg p-1.5 transition ${
                          isWatched(s.symbol)
                            ? 'bg-mint/15 text-mint'
                            : 'text-muted hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {isWatched(s.symbol) ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                      <button
                        onClick={() => onTradeStock(s)}
                        className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-mint hover:bg-mint hover:text-ink transition"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Snapshot */}
        <div className="card p-5">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">SECTOR ROTATION</p>
            <h2 className="text-base font-semibold text-white">Sector Performance</h2>
          </div>
          <div className="space-y-4">
            {sectors.map((sec) => (
              <div key={sec.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{sec.name}</span>
                  <span className={`font-semibold ${sec.value >= 0 ? 'text-mint' : 'text-danger'}`}>
                    {sec.value > 0 ? '+' : ''}{sec.value.toFixed(2)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#0a1220]">
                  <div
                    className={`h-full rounded-full transition-all ${sec.value >= 0 ? 'bg-mint' : 'bg-danger'}`}
                    style={{ width: `${Math.min(Math.abs(sec.value) * 35, 100)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                  <span>Lead: {sec.leader}</span>
                  <span>A/D: {sec.advance}/{sec.decline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
