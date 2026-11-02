import React, { useState } from 'react'
import {
  ListFilter,
  Search,
  X,
  CandlestickChart,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react'
import { SignalBadge } from '../components/common/Badge'

const money = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)

export function Watchlist({ watchlist, onRemove, onSelectStock, onTrade, onNavigate }) {
  const [search, setSearch] = useState('')

  const filtered = watchlist.filter(
    (s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">PORTFOLIO TRACKING</p>
          <h2 className="text-xl font-bold text-white">Personal Watchlist</h2>
          <p className="text-xs text-muted mt-0.5">
            Real-time price tracking with persistent storage across browser sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('screener')}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <span>Browse Screener</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* Search Filter in Watchlist */}
      {watchlist.length > 0 && (
        <div className="card p-3 flex items-center gap-2">
          <Search size={16} className="text-muted ml-1" />
          <input
            type="text"
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500 font-medium"
            placeholder="Search within your saved watchlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Main Watchlist Container */}
      <div className="card p-5">
        {watchlist.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-muted">
              <ListFilter size={28} />
            </div>
            <h3 className="text-base font-semibold text-white">Your Watchlist is Empty</h3>
            <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
              Pin Indian equities from the Dashboard or Screener to monitor their price movements and indicators.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn btn-primary text-xs"
              >
                Explore Market Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Symbol & Company</th>
                  <th className="pb-3 font-medium">Sector</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Today's Change</th>
                  <th className="pb-3 font-medium">Market Cap</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="border-b border-line/60 last:border-0 hover:bg-white/[0.02] transition"
                  >
                    <td className="py-3.5">
                      <button
                        onClick={() => onSelectStock(stock)}
                        className="text-left group"
                      >
                        <p className="text-xs font-semibold text-white group-hover:text-mint transition">
                          {stock.symbol}
                        </p>
                        <p className="text-[10px] text-muted">{stock.name}</p>
                      </button>
                    </td>
                    <td className="py-3.5 text-xs text-slate-300">{stock.sector}</td>
                    <td className="py-3.5 text-xs font-semibold text-white">
                      {money(stock.price)}
                    </td>
                    <td className={`py-3.5 text-xs font-semibold ${
                      stock.change >= 0 ? 'text-mint' : 'text-danger'
                    }`}>
                      {stock.change > 0 ? '+' : ''}{stock.change}%
                    </td>
                    <td className="py-3.5 text-xs text-slate-400">{stock.marketCap}</td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => onSelectStock(stock)}
                        className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                      >
                        Analyze
                      </button>
                      <button
                        onClick={() => onTrade(stock)}
                        className="rounded-lg bg-mint/10 border border-mint/20 px-2.5 py-1 text-[11px] font-semibold text-mint hover:bg-mint hover:text-ink transition"
                      >
                        Trade
                      </button>
                      <button
                        onClick={() => onRemove(stock.symbol)}
                        title="Remove from watchlist"
                        className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition"
                      >
                        <X size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
