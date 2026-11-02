import React, { useState, useEffect } from 'react'
import {
  Filter,
  Search,
  ArrowUpDown,
  Plus,
  Check,
  Wallet,
  CandlestickChart,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react'
import { marketService } from '../services/marketService'
import { SignalBadge } from '../components/common/Badge'

const money = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)

export function Screener({ onSelectStock, onTrade, onToggleWatch, isWatched }) {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('All')
  const [signal, setSignal] = useState('All')
  const [maxRsi, setMaxRsi] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // Sort State
  const [sortField, setSortField] = useState('marketCap')
  const [sortAsc, setSortAsc] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const list = await marketService.getStockList()
        setStocks(list)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const resetFilters = () => {
    setSearch('')
    setSector('All')
    setSignal('All')
    setMaxRsi('')
    setMinPrice('')
    setMaxPrice('')
  }

  // Filter logic
  const filtered = stocks.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!s.symbol.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false
    }
    if (sector !== 'All' && s.sector !== sector) return false
    if (signal !== 'All' && s.signal !== signal) return false
    if (maxRsi !== '' && s.rsi > Number(maxRsi)) return false
    if (minPrice !== '' && s.price < Number(minPrice)) return false
    if (maxPrice !== '' && s.price > Number(maxPrice)) return false
    return true
  })

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]
    if (typeof aVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortAsc ? aVal - bVal : bVal - aVal
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const sectors = ['All', 'Banking', 'IT', 'Energy', 'FMCG', 'Auto', 'Infrastructure', 'Pharma']
  const signals = ['All', 'Bullish', 'Bearish', 'Neutral']

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">MARKET DISCOVERY</p>
          <h2 className="text-xl font-bold text-white">Indian Equities Screener</h2>
          <p className="text-xs text-muted mt-0.5">
            Filter by sector, technical signals, price thresholds, and momentum parameters.
          </p>
        </div>
        <button
          onClick={resetFilters}
          className="btn btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
        >
          <RotateCcw size={13} /> Reset Filters
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="card p-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Company / Ticker</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-muted" size={15} />
              <input
                type="text"
                className="field pl-9 py-2 text-xs"
                placeholder="e.g. INFY, Reliance..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Sector</label>
            <select
              className="field py-2 text-xs"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Signal */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Technical Signal</label>
            <select
              className="field py-2 text-xs"
              value={signal}
              onChange={(e) => setSignal(e.target.value)}
            >
              {signals.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 pt-2 border-t border-line/60">
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Maximum RSI (14)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="field py-2 text-xs"
              placeholder="e.g. 50 for pullback/value"
              value={maxRsi}
              onChange={(e) => setMaxRsi(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Min Price (₹)</label>
            <input
              type="number"
              className="field py-2 text-xs"
              placeholder="e.g. 500"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Max Price (₹)</label>
            <input
              type="number"
              className="field py-2 text-xs"
              placeholder="e.g. 3000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="font-semibold text-white">
            Matching Equities ({sorted.length} results)
          </span>
          <span className="text-muted">Sorted by {sortField} ({sortAsc ? 'Asc' : 'Desc'})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-wider text-slate-500">
                <th
                  onClick={() => handleSort('symbol')}
                  className="pb-3 font-medium cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">Company <ArrowUpDown size={12} /></span>
                </th>
                <th
                  onClick={() => handleSort('sector')}
                  className="pb-3 font-medium cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">Sector <ArrowUpDown size={12} /></span>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="pb-3 font-medium cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">Price <ArrowUpDown size={12} /></span>
                </th>
                <th
                  onClick={() => handleSort('change')}
                  className="pb-3 font-medium cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">Change <ArrowUpDown size={12} /></span>
                </th>
                <th
                  onClick={() => handleSort('rsi')}
                  className="pb-3 font-medium cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">RSI (14) <ArrowUpDown size={12} /></span>
                </th>
                <th className="pb-3 font-medium">Signal</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-xs text-muted">
                    No stocks match the selected screener criteria. Try broadening your filter parameters.
                  </td>
                </tr>
              ) : (
                sorted.map((s) => (
                  <tr key={s.symbol} className="border-b border-line/60 last:border-0 hover:bg-white/[0.02]">
                    <td className="py-3.5">
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
                    <td className="py-3.5 text-xs text-slate-300">{s.sector}</td>
                    <td className="py-3.5 text-xs font-medium text-white">{money(s.price)}</td>
                    <td className={`py-3.5 text-xs font-semibold ${s.change >= 0 ? 'text-mint' : 'text-danger'}`}>
                      {s.change > 0 ? '+' : ''}{s.change.toFixed(2)}%
                    </td>
                    <td className="py-3.5 text-xs font-mono text-slate-300">{s.rsi}</td>
                    <td className="py-3.5">
                      <SignalBadge signal={s.signal} />
                    </td>
                    <td className="py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => onToggleWatch(s)}
                        title={isWatched(s.symbol) ? 'In Watchlist' : 'Add to Watchlist'}
                        className={`rounded-lg p-1.5 transition ${
                          isWatched(s.symbol)
                            ? 'bg-mint/15 text-mint'
                            : 'text-muted hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {isWatched(s.symbol) ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                      <button
                        onClick={() => onSelectStock(s)}
                        className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                      >
                        Analyze
                      </button>
                      <button
                        onClick={() => onTrade(s)}
                        className="rounded-lg bg-mint/10 border border-mint/20 px-2.5 py-1 text-[11px] font-semibold text-mint hover:bg-mint hover:text-ink transition"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
