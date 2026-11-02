import React, { useState, useEffect } from 'react'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { portfolioService } from '../services/portfolioService'
import { stockProfiles } from '../data/market'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const money = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)

export function PaperTrading({ onSelectStock, onTradeStock }) {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { showToast } = useToast()

  const loadData = async () => {
    try {
      const data = await portfolioService.getPortfolio(user)
      setPortfolio(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset your virtual portfolio back to ₹1,00,000? All virtual orders will be cleared.')) {
      await portfolioService.resetPortfolio()
      showToast('Virtual paper portfolio reset to ₹1,00,000.', 'info')
      loadData()
    }
  }

  if (loading || !portfolio) {
    return <div className="card p-10 text-center text-xs text-muted">Loading paper portfolio...</div>
  }

  const { cash, invested, holdingsValue, totalPortfolioValue, realizedPnL, totalReturn, totalReturnPercent, holdings, orders } = portfolio

  // Synthetic portfolio history series based on returns
  const performanceChartData = [
    { day: 'Day 1', val: 100000 },
    { day: 'Day 2', val: 100000 + (totalReturn * 0.15) },
    { day: 'Day 3', val: 100000 + (totalReturn * 0.4) },
    { day: 'Day 4', val: 100000 + (totalReturn * 0.75) },
    { day: 'Today', val: totalPortfolioValue }
  ]

  return (
    <div className="space-y-6">
      {/* Title & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">RISK-FREE SIMULATION</p>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet size={20} className="text-mint" /> Virtual Paper Trading
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Trade Indian equities with ₹1,00,000 virtual capital in real market conditions.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="btn btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
          title="Reset back to initial balance"
        >
          <RotateCcw size={13} /> Reset Portfolio
        </button>
      </div>

      {/* Portfolio Value Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <span className="text-xs text-muted font-medium">Total Portfolio Value</span>
          <p className="mt-2 text-2xl font-bold text-white">{money(totalPortfolioValue)}</p>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <span className={totalReturn >= 0 ? 'text-mint' : 'text-danger'}>
              {totalReturn >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </span>
            <span className={`font-semibold ${totalReturn >= 0 ? 'text-mint' : 'text-danger'}`}>
              {totalReturn >= 0 ? '+' : ''}{money(totalReturn)} ({totalReturnPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="card p-4">
          <span className="text-xs text-muted font-medium">Available Cash</span>
          <p className="mt-2 text-2xl font-bold text-white">{money(cash)}</p>
          <p className="mt-2 text-[10px] text-slate-500">Uncommitted virtual liquidity</p>
        </div>

        <div className="card p-4">
          <span className="text-xs text-muted font-medium">Invested Value</span>
          <p className="mt-2 text-2xl font-bold text-white">{money(invested)}</p>
          <p className="mt-2 text-[10px] text-slate-500">Current holdings mark: {money(holdingsValue)}</p>
        </div>

        <div className="card p-4">
          <span className="text-xs text-muted font-medium">Realized P&L</span>
          <p className={`mt-2 text-2xl font-bold ${realizedPnL >= 0 ? 'text-mint' : 'text-danger'}`}>
            {realizedPnL >= 0 ? '+' : ''}{money(realizedPnL)}
          </p>
          <p className="mt-2 text-[10px] text-slate-500">Booked from closed sell orders</p>
        </div>
      </div>

      {/* Performance Trajectory Chart */}
      <div className="card p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">Portfolio Valuation Trajectory</h3>
          <p className="text-xs text-muted">Simulated equity curve tracking virtual capital</p>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceChartData}>
              <defs>
                <linearGradient id="paperChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#37d6a0" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#37d6a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#263349" strokeDasharray="3 5" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#71819a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#71819a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: '#0c1422',
                  border: '1px solid #263349',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 12
                }}
                formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Portfolio Value']}
              />
              <Area type="monotone" dataKey="val" stroke="#37d6a0" strokeWidth={2.5} fill="url(#paperChartFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Current Open Holdings</h3>
            <p className="text-xs text-muted">Stocks currently held in your paper trading account</p>
          </div>
          <span className="text-xs font-semibold text-mint">{holdings.length} positions</span>
        </div>

        {holdings.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <p className="text-sm text-slate-300 font-medium">No open stock positions</p>
            <p className="text-xs text-muted">
              Explore the Market Dashboard or Screener to execute your first virtual buy trade!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Symbol & Name</th>
                  <th className="pb-3 font-medium">Qty Owned</th>
                  <th className="pb-3 font-medium">Avg Buy Price</th>
                  <th className="pb-3 font-medium">Current Price</th>
                  <th className="pb-3 font-medium">Current Value</th>
                  <th className="pb-3 font-medium">Unrealized P&L</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.symbol} className="border-b border-line/60 last:border-0 hover:bg-white/[0.02]">
                    <td className="py-3.5">
                      <button
                        onClick={() => {
                          const full = stockProfiles.find(s => s.symbol === h.symbol)
                          if (full) onSelectStock(full)
                        }}
                        className="text-left group"
                      >
                        <p className="text-xs font-semibold text-white group-hover:text-mint transition">
                          {h.symbol}
                        </p>
                        <p className="text-[10px] text-muted">{h.companyName}</p>
                      </button>
                    </td>
                    <td className="py-3.5 text-xs font-bold text-white">{h.quantity}</td>
                    <td className="py-3.5 text-xs text-slate-300">{money(h.avgPrice)}</td>
                    <td className="py-3.5 text-xs font-semibold text-white">{money(h.currentPrice)}</td>
                    <td className="py-3.5 text-xs text-slate-200">{money(h.currentValue)}</td>
                    <td className={`py-3.5 text-xs font-semibold ${
                      h.unrealizedPnL >= 0 ? 'text-mint' : 'text-danger'
                    }`}>
                      {h.unrealizedPnL >= 0 ? '+' : ''}{money(h.unrealizedPnL)} ({h.unrealizedPnLPercent > 0 ? '+' : ''}{h.unrealizedPnLPercent}%)
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          const full = stockProfiles.find(s => s.symbol === h.symbol) || {
                            symbol: h.symbol,
                            price: h.currentPrice
                          }
                          onTradeStock(full)
                        }}
                        className="rounded-lg bg-mint/10 border border-mint/20 px-3 py-1 text-xs font-semibold text-mint hover:bg-mint hover:text-ink transition"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Transaction Audit History */}
      <div className="card p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Order Execution History</h3>
          <p className="text-xs text-muted">Complete audit log of simulated market orders</p>
        </div>

        {orders.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted">No simulated orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Timestamp</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Symbol</th>
                  <th className="pb-3 font-medium">Quantity</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Total Value</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-line/60 last:border-0 text-xs">
                    <td className="py-2.5 text-slate-400 text-[11px]">{o.date}</td>
                    <td className="py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.side === 'BUY' ? 'bg-mint/15 text-mint' : 'bg-danger/15 text-danger'
                      }`}>
                        {o.side}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-white">{o.symbol}</td>
                    <td className="py-2.5 text-slate-300">{o.quantity} shares</td>
                    <td className="py-2.5 text-slate-300">{money(o.price)}</td>
                    <td className="py-2.5 font-semibold text-white">{money(o.quantity * o.price)}</td>
                    <td className="py-2.5 text-right text-mint font-medium text-[11px]">
                      Simulated
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
