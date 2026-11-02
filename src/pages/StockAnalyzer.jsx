import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Check,
  Wallet,
  Bot,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowUpRight,
  SlidersHorizontal
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { marketService } from '../services/marketService'
import { stockProfiles } from '../data/market'
import { SignalBadge } from '../components/common/Badge'
import { CardSkeleton } from '../components/common/Skeleton'

const money = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)

export function StockAnalyzer({ selectedStock, onSelectStock, onTrade, onToggleWatch, isWatched, onAskAI }) {
  const [query, setQuery] = useState(selectedStock?.symbol || 'RELIANCE')
  const [timeframe, setTimeframe] = useState('1M')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  const activeSymbol = selectedStock?.symbol || query

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const detail = await marketService.getStockDetail(activeSymbol, timeframe)
        setData(detail)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeSymbol, timeframe])

  const handleSearchChange = (val) => {
    setQuery(val)
    if (val.trim().length > 0) {
      const filtered = stockProfiles.filter(
        s => s.symbol.toLowerCase().includes(val.toLowerCase()) || s.name.toLowerCase().includes(val.toLowerCase())
      )
      setSuggestions(filtered)
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }

  const handleSelectSuggestion = (stock) => {
    setQuery(stock.symbol)
    setShowDropdown(false)
    if (onSelectStock) onSelectStock(stock)
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <CardSkeleton /><CardSkeleton />
      </div>
    )
  }

  const { profile, candles, indicators } = data
  const { rsi, macd, sma20, sma50, ema20, bollinger, volatility, pivotPoints, confluence } = indicators

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">EQUITY INTELLIGENCE</p>
          <h2 className="text-xl font-bold text-white">Stock Technical Analyzer</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleWatch(profile)}
            className={`btn text-xs ${
              isWatched(profile.symbol) ? 'btn-secondary text-mint' : 'btn-secondary'
            }`}
          >
            {isWatched(profile.symbol) ? <Check size={14} className="text-mint" /> : <Plus size={14} />}
            <span>{isWatched(profile.symbol) ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>
          <button
            onClick={() => onTrade(profile)}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <Wallet size={14} />
            <span>Trade Virtually</span>
          </button>
        </div>
      </div>

      {/* Symbol Search Bar with Autocomplete */}
      <div className="relative">
        <div className="card flex items-center gap-3 p-3">
          <Search className="text-muted shrink-0 ml-1" size={18} />
          <input
            type="text"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 font-medium"
            placeholder="Search Indian equities by symbol or name (e.g. RELIANCE, TCS, INFY, HDFCBANK)..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => query.trim() && setShowDropdown(true)}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setShowDropdown(false)
              }}
              className="text-xs text-muted hover:text-white px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-14 left-0 right-0 z-30 rounded-2xl border border-line bg-[#0c1422] p-2 shadow-2xl space-y-1">
            {suggestions.map((s) => (
              <button
                key={s.symbol}
                onClick={() => handleSelectSuggestion(s)}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs hover:bg-white/5 transition"
              >
                <div>
                  <span className="font-bold text-white mr-2">{s.symbol}</span>
                  <span className="text-muted">{s.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-white">{money(s.price)}</span>
                  <span className={`ml-2 font-medium ${s.change >= 0 ? 'text-mint' : 'text-danger'}`}>
                    {s.change > 0 ? '+' : ''}{s.change}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stock Header & Fundamental Overview Card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{profile.symbol}</h1>
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
                NSE Equity
              </span>
              <span className="rounded-md bg-mint/10 border border-mint/20 px-2 py-0.5 text-[11px] font-semibold text-mint">
                {profile.sector}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">{profile.name}</p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-extrabold text-white">{money(profile.price)}</p>
            <p className={`mt-1 text-xs font-semibold flex items-center justify-end gap-1 ${
              profile.change >= 0 ? 'text-mint' : 'text-danger'
            }`}>
              {profile.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {profile.change > 0 ? '+' : ''}{profile.change}% today
            </p>
          </div>
        </div>

        {/* Fundamental Metrics Bar */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 text-xs">
          <div className="rounded-xl bg-[#090e19] p-3 border border-line/60">
            <span className="text-muted block text-[10px] uppercase tracking-wider">Market Cap</span>
            <span className="font-bold text-white mt-1 block">{profile.marketCap}</span>
          </div>
          <div className="rounded-xl bg-[#090e19] p-3 border border-line/60">
            <span className="text-muted block text-[10px] uppercase tracking-wider">P/E Ratio</span>
            <span className="font-bold text-white mt-1 block">{profile.peRatio}</span>
          </div>
          <div className="rounded-xl bg-[#090e19] p-3 border border-line/60">
            <span className="text-muted block text-[10px] uppercase tracking-wider">Day High</span>
            <span className="font-bold text-white mt-1 block">{money(profile.high)}</span>
          </div>
          <div className="rounded-xl bg-[#090e19] p-3 border border-line/60">
            <span className="text-muted block text-[10px] uppercase tracking-wider">Day Low</span>
            <span className="font-bold text-white mt-1 block">{money(profile.low)}</span>
          </div>
          <div className="rounded-xl bg-[#090e19] p-3 border border-line/60">
            <span className="text-muted block text-[10px] uppercase tracking-wider">52W Range</span>
            <span className="font-bold text-white mt-1 block">₹{profile.week52Low} - ₹{profile.week52High}</span>
          </div>
          <div className="rounded-xl bg-[#090e19] p-3 border border-line/60">
            <span className="text-muted block text-[10px] uppercase tracking-wider">Volume</span>
            <span className="font-bold text-white mt-1 block">{profile.volume}</span>
          </div>
        </div>
      </div>

      {/* Interactive Price Chart with Timeframe Selector */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Historical Price Action</h3>
            <p className="text-xs text-muted">Closing price trajectory with volume participation</p>
          </div>
          <div className="flex gap-1 rounded-xl bg-[#090e19] p-1 border border-line">
            {['1D', '1W', '1M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  timeframe === tf ? 'bg-mint text-ink' : 'text-muted hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={candles}>
              <defs>
                <linearGradient id="analyzerFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#37d6a0" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#37d6a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#263349" strokeDasharray="3 5" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#71819a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#71819a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: '#0c1422',
                  border: '1px solid #263349',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 12
                }}
                formatter={(val) => [`₹${Number(val).toFixed(2)}`, 'Close Price']}
              />
              <Area type="monotone" dataKey="close" stroke="#37d6a0" strokeWidth={2.5} fill="url(#analyzerFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technical Indicators Grid (Mathematically Rigorous) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">MATHEMATICAL MODELS</p>
            <h3 className="text-base font-semibold text-white">Calculated Technical Indicators</h3>
          </div>
          <button
            onClick={() => onAskAI(`Analyze ${profile.symbol} with RSI ${rsi} and MACD ${macd?.histogram}`)}
            className="text-xs text-mint hover:underline flex items-center gap-1"
          >
            <Bot size={14} /> Ask Bharat AI about this setup →
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* RSI Card */}
          <div className="card p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted font-medium">RSI (14 Wilder)</span>
              <span className={`font-bold ${rsi > 70 ? 'text-danger' : rsi < 30 ? 'text-mint' : 'text-slate-300'}`}>
                {rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold font-mono text-white">{rsi}</p>
            <div className="mt-3 h-1.5 w-full bg-[#0a1220] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${rsi > 70 ? 'bg-danger' : rsi < 30 ? 'bg-mint' : 'bg-gold'}`}
                style={{ width: `${Math.min(rsi, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-slate-500">Ref: 30 Oversold / 70 Overbought</p>
          </div>

          {/* MACD Card */}
          <div className="card p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted font-medium">MACD (12, 26, 9)</span>
              <span className={`font-bold ${macd && macd.histogram >= 0 ? 'text-mint' : 'text-danger'}`}>
                {macd && macd.histogram >= 0 ? 'Bullish Mom.' : 'Bearish Mom.'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold font-mono text-white">
              {macd ? (macd.histogram > 0 ? `+${macd.histogram}` : macd.histogram) : 'N/A'}
            </p>
            <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
              <span>MACD: {macd?.macd}</span>
              <span>Signal: {macd?.signal}</span>
            </div>
          </div>

          {/* Moving Averages Card */}
          <div className="card p-4">
            <span className="text-muted text-xs font-medium block">Moving Averages</span>
            <div className="mt-2 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">SMA 20</span>
                <span className="font-semibold text-white">{money(sma20)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SMA 50</span>
                <span className="font-semibold text-white">{money(sma50)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">EMA 20</span>
                <span className="font-semibold text-mint">{money(ema20)}</span>
              </div>
            </div>
          </div>

          {/* Bollinger Bands & Volatility Card */}
          <div className="card p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted font-medium">Bollinger Bands (20,2)</span>
              <span className="text-slate-400 font-mono text-[11px]">Vol: {volatility}%</span>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Upper Band</span>
                <span className="font-semibold text-slate-300">{money(bollinger?.upper)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Middle Band</span>
                <span className="font-semibold text-slate-300">{money(bollinger?.middle)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lower Band</span>
                <span className="font-semibold text-slate-300">{money(bollinger?.lower)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classical Pivot Points & Technical Confluence Summary */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* Support & Resistance Pivot Points */}
        <div className="card p-5">
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Classical Support & Resistance
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-danger/10 text-danger border border-danger/20 font-medium">
              <span>Resistance 2 (R2)</span>
              <span>{money(pivotPoints.r2)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-danger/5 text-slate-300 border border-line font-medium">
              <span>Resistance 1 (R1)</span>
              <span>{money(pivotPoints.r1)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-gold/10 text-gold border border-gold/20 font-semibold">
              <span>Central Pivot (P)</span>
              <span>{money(pivotPoints.pivot)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-mint/5 text-slate-300 border border-line font-medium">
              <span>Support 1 (S1)</span>
              <span>{money(pivotPoints.s1)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-mint/10 text-mint border border-mint/20 font-medium">
              <span>Support 2 (S2)</span>
              <span>{money(pivotPoints.s2)}</span>
            </div>
          </div>
        </div>

        {/* Confluence Evaluation Card */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
                Multi-Factor Confluence Signal
              </h4>
              <SignalBadge signal={confluence.signal} />
            </div>

            <div className="rounded-xl border border-line bg-[#090e19] p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Confluence Score</span>
                <span className={`font-mono font-bold ${confluence.score >= 0 ? 'text-mint' : 'text-danger'}`}>
                  {confluence.score > 0 ? `+${confluence.score}` : confluence.score} / 5.0
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                {confluence.summary}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-3 text-[11px] text-gold flex items-start gap-2">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>
              <strong>Educational Research Disclaimer:</strong> Indicators evaluate historical price math only. Markets are subject to unpredictable macro events. Always manage risk.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
