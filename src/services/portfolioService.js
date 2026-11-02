/**
 * BharatTrade AI — Paper Trading & Portfolio Management Service
 * 
 * Supports:
 * - Client-side localStorage for guest demo trading
 * - Supabase PostgreSQL RPC execution for authenticated accounts
 * - Real-time valuation, Average Buy Price, Realized P&L, Unrealized P&L calculation
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { stockProfiles } from '../data/market'

const STORAGE_KEY = 'bharattrade_paper_portfolio_v2'

const INITIAL_STATE = {
  cash: 100000,
  initialCapital: 100000,
  realizedPnL: 0,
  holdings: {}, // { [symbol]: { quantity, avgPrice, totalCost } }
  orders: []
}

function getLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading paper trading state:', err)
    return INITIAL_STATE
  }
}

function saveLocalState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('Error saving paper trading state:', err)
  }
}

export const portfolioService = {
  /**
   * Load portfolio summary with live mark-to-market prices
   */
  getPortfolio: async (user = null) => {
    // If user is authenticated and Supabase is configured
    if (user && isSupabaseConfigured && supabase) {
      try {
        const { data: portfolio } = await supabase
          .from('paper_portfolios')
          .select('*')
          .eq('user_id', user.id)
          .single()

        const { data: orders } = await supabase
          .from('paper_orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (portfolio && orders) {
          // Recompute holdings and P&L from executed orders
          return portfolioService.computeValuation({
            cash: Number(portfolio.virtual_cash),
            initialCapital: 100000,
            orders: orders.map(o => ({
              id: o.id,
              symbol: o.symbol,
              side: o.side,
              quantity: o.quantity,
              price: Number(o.price),
              date: new Date(o.created_at).toLocaleString('en-IN')
            }))
          })
        }
      } catch (err) {
        console.warn('Supabase portfolio fetch error, using local fallback:', err)
      }
    }

    // Default to localStorage
    const local = getLocalState()
    return portfolioService.computeValuation(local)
  },

  /**
   * Recompute holdings, avg price, unrealized/realized P&L, and portfolio totals
   */
  computeValuation: (state) => {
    const holdings = {}
    let realizedPnL = 0

    // Process orders in chronological order
    const chronological = [...(state.orders || [])].reverse()

    for (const order of chronological) {
      const sym = order.symbol
      if (!holdings[sym]) {
        holdings[sym] = { quantity: 0, avgPrice: 0, totalCost: 0 }
      }

      if (order.side === 'BUY') {
        const prevQty = holdings[sym].quantity
        const prevCost = holdings[sym].totalCost
        const addCost = order.quantity * order.price

        holdings[sym].quantity = prevQty + order.quantity
        holdings[sym].totalCost = prevCost + addCost
        holdings[sym].avgPrice = holdings[sym].totalCost / holdings[sym].quantity
      } else if (order.side === 'SELL') {
        const sellQty = order.quantity
        const avgBuy = holdings[sym].avgPrice
        const profit = sellQty * (order.price - avgBuy)
        realizedPnL += profit

        holdings[sym].quantity = Math.max(0, holdings[sym].quantity - sellQty)
        holdings[sym].totalCost = holdings[sym].quantity * avgBuy
        if (holdings[sym].quantity === 0) {
          holdings[sym].avgPrice = 0
        }
      }
    }

    // Mark to market using current prices from stockProfiles
    let totalInvested = 0
    let currentHoldingsValue = 0

    const enrichedHoldings = Object.entries(holdings)
      .filter(([, h]) => h.quantity > 0)
      .map(([symbol, h]) => {
        const stock = stockProfiles.find(s => s.symbol === symbol) || { price: h.avgPrice }
        const currentPrice = stock.price
        const currentValue = h.quantity * currentPrice
        const investedValue = h.quantity * h.avgPrice
        const unrealizedPnL = currentValue - investedValue
        const unrealizedPnLPercent = investedValue > 0 ? (unrealizedPnL / investedValue) * 100 : 0

        totalInvested += investedValue
        currentHoldingsValue += currentValue

        return {
          symbol,
          companyName: stock.name || symbol,
          quantity: h.quantity,
          avgPrice: Number(h.avgPrice.toFixed(2)),
          currentPrice,
          investedValue: Number(investedValue.toFixed(2)),
          currentValue: Number(currentValue.toFixed(2)),
          unrealizedPnL: Number(unrealizedPnL.toFixed(2)),
          unrealizedPnLPercent: Number(unrealizedPnLPercent.toFixed(2))
        }
      })

    const totalPortfolioValue = state.cash + currentHoldingsValue
    const totalReturn = totalPortfolioValue - (state.initialCapital || 100000)
    const totalReturnPercent = ((totalReturn / (state.initialCapital || 100000)) * 100)

    return {
      cash: Number(state.cash.toFixed(2)),
      invested: Number(totalInvested.toFixed(2)),
      holdingsValue: Number(currentHoldingsValue.toFixed(2)),
      totalPortfolioValue: Number(totalPortfolioValue.toFixed(2)),
      realizedPnL: Number(realizedPnL.toFixed(2)),
      totalReturn: Number(totalReturn.toFixed(2)),
      totalReturnPercent: Number(totalReturnPercent.toFixed(2)),
      holdings: enrichedHoldings,
      orders: state.orders || []
    }
  },

  /**
   * Execute a paper trade (BUY or SELL)
   */
  executeTrade: async ({ symbol, side, quantity, price, user = null }) => {
    const qty = Math.max(1, parseInt(quantity, 10))
    const totalCost = qty * price

    // 1. Authenticated Supabase Execution via RPC
    if (user && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('execute_paper_trade', {
          p_symbol: symbol,
          p_side: side,
          p_quantity: qty,
          p_price: price
        })

        if (error) throw error
        return { success: true, message: `Simulated ${side} order executed for ${qty} shares of ${symbol}.` }
      } catch (err) {
        console.warn('Supabase RPC trade error, falling back to local trade:', err.message)
      }
    }

    // 2. Local Storage Execution for Guests
    const state = getLocalState()
    const valuation = portfolioService.computeValuation(state)
    const existingHolding = valuation.holdings.find(h => h.symbol === symbol)
    const ownedQty = existingHolding ? existingHolding.quantity : 0

    if (side === 'BUY') {
      if (totalCost > state.cash) {
        throw new Error(`Insufficient virtual cash. Required: ₹${totalCost.toLocaleString('en-IN')}, Available: ₹${state.cash.toLocaleString('en-IN')}`)
      }
      state.cash -= totalCost
    } else if (side === 'SELL') {
      if (qty > ownedQty) {
        throw new Error(`Insufficient holdings. You own ${ownedQty} shares of ${symbol}, cannot sell ${qty}.`)
      }
      state.cash += totalCost
    }

    const newOrder = {
      id: 'ord_' + Date.now(),
      symbol,
      side,
      quantity: qty,
      price,
      date: new Date().toLocaleString('en-IN')
    }

    state.orders = [newOrder, ...(state.orders || [])]
    saveLocalState(state)

    return {
      success: true,
      message: `Simulated ${side} order placed for ${qty} shares of ${symbol} at ₹${price.toFixed(2)}.`
    }
  },

  /**
   * Reset virtual portfolio back to ₹1,00,000
   */
  resetPortfolio: async () => {
    localStorage.removeItem(STORAGE_KEY)
    return INITIAL_STATE
  }
}
