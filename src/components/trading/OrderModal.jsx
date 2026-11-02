import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { portfolioService } from '../../services/portfolioService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { ArrowUpRight, ArrowDownRight, Wallet, AlertCircle } from 'lucide-react'

const money = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)

export function OrderModal({ isOpen, onClose, stock, onOrderExecuted }) {
  const [side, setSide] = useState('BUY')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [portfolio, setPortfolio] = useState(null)
  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen) {
      portfolioService.getPortfolio(user).then(setPortfolio)
    }
  }, [isOpen, user])

  if (!stock) return null

  const qty = Math.max(1, parseInt(quantity, 10) || 1)
  const estimatedCost = qty * stock.price
  const availableCash = portfolio ? portfolio.cash : 100000
  const ownedHolding = portfolio?.holdings.find(h => h.symbol === stock.symbol)
  const ownedQty = ownedHolding ? ownedHolding.quantity : 0

  const handleTrade = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await portfolioService.executeTrade({
        symbol: stock.symbol,
        side,
        quantity: qty,
        price: stock.price,
        user
      })
      showToast(res.message, 'success')
      if (onOrderExecuted) onOrderExecuted()
      onClose()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Place Simulated Order: ${stock.symbol}`}>
      <form onSubmit={handleTrade} className="space-y-4">
        {/* Buy/Sell Selector */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#090e19] p-1 border border-line">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
              side === 'BUY'
                ? 'bg-mint text-ink shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight size={14} /> Buy Virtually
          </button>
          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
              side === 'SELL'
                ? 'bg-danger text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight size={14} /> Sell Virtually
          </button>
        </div>

        {/* Stock Info Snapshot */}
        <div className="rounded-xl border border-line bg-[#090e19] p-3.5 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted">Market Price</span>
            <span className="font-semibold text-white text-sm">{money(stock.price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Virtual Cash Available</span>
            <span className="font-medium text-mint">{money(availableCash)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Currently Owned Shares</span>
            <span className="font-medium text-slate-200">{ownedQty} shares</span>
          </div>
        </div>

        {/* Quantity Field */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Quantity (Shares)
          </label>
          <input
            type="number"
            min="1"
            className="field"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        {/* Order Value summary */}
        <div className="rounded-xl bg-[#0e1b2b] border border-line p-3 flex justify-between items-center">
          <span className="text-xs text-slate-300">Total Order Value</span>
          <span className="text-base font-bold text-white">{money(estimatedCost)}</span>
        </div>

        {side === 'BUY' && estimatedCost > availableCash && (
          <div className="flex items-center gap-2 text-xs text-danger">
            <AlertCircle size={14} /> Insufficient virtual cash balance for this quantity.
          </div>
        )}

        {side === 'SELL' && qty > ownedQty && (
          <div className="flex items-center gap-2 text-xs text-danger">
            <AlertCircle size={14} /> You cannot sell more shares than you currently own.
          </div>
        )}

        {/* Action button */}
        <button
          type="submit"
          disabled={loading || (side === 'BUY' && estimatedCost > availableCash) || (side === 'SELL' && qty > ownedQty)}
          className={`btn w-full mt-2 font-semibold ${
            side === 'BUY' ? 'btn-primary' : 'bg-danger hover:bg-rose-600 text-white'
          }`}
        >
          {loading ? 'Executing...' : `Confirm ${side} Order`}
        </button>

        <p className="text-center text-[10px] text-slate-500">
          Simulated trade only. Zero real capital involved.
        </p>
      </form>
    </Modal>
  )
}
