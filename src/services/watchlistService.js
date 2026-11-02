/**
 * BharatTrade AI — Watchlist Service
 * 
 * Manages user watchlists with dual persistence:
 * - LocalStorage for guest users
 * - Supabase PostgreSQL table `watchlists` for authenticated users
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { stockProfiles } from '../data/market'

const STORAGE_KEY = 'bharattrade_watchlist_v2'
const DEFAULT_SYMBOLS = ['RELIANCE', 'HDFCBANK', 'INFY']

function getLocalWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SYMBOLS
    return JSON.parse(raw)
  } catch {
    return DEFAULT_SYMBOLS
  }
}

function saveLocalWatchlist(symbols) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols))
  } catch (err) {
    console.error('Error saving watchlist to local storage:', err)
  }
}

export const watchlistService = {
  /**
   * Fetch all watchlist stock profiles
   */
  getWatchlist: async (user = null) => {
    let symbols = getLocalWatchlist()

    if (user && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('watchlists')
          .select('symbol')
          .eq('user_id', user.id)

        if (!error && data && data.length > 0) {
          symbols = data.map(d => d.symbol)
        }
      } catch (err) {
        console.warn('Supabase watchlist fetch failed, using local:', err)
      }
    }

    return symbols
      .map(sym => stockProfiles.find(s => s.symbol.toUpperCase() === sym.toUpperCase()))
      .filter(Boolean)
  },

  /**
   * Check if a symbol is on the watchlist
   */
  isWatched: (symbol, watchlist = []) => {
    return watchlist.some(s => s.symbol.toUpperCase() === symbol.toUpperCase())
  },

  /**
   * Add a stock to the watchlist
   */
  addStock: async (stock, user = null) => {
    const symbol = stock.symbol.toUpperCase()
    const current = getLocalWatchlist()

    if (!current.includes(symbol)) {
      const updated = [...current, symbol]
      saveLocalWatchlist(updated)
    }

    if (user && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('watchlists')
          .upsert({
            user_id: user.id,
            symbol,
            exchange: 'NSE',
            company_name: stock.name
          }, { onConflict: 'user_id,symbol,exchange' })
      } catch (err) {
        console.warn('Supabase watchlist sync failed:', err)
      }
    }

    return watchlistService.getWatchlist(user)
  },

  /**
   * Remove a stock from the watchlist
   */
  removeStock: async (symbol, user = null) => {
    const sym = symbol.toUpperCase()
    const current = getLocalWatchlist()
    const updated = current.filter(s => s !== sym)
    saveLocalWatchlist(updated)

    if (user && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('watchlists')
          .delete()
          .eq('user_id', user.id)
          .eq('symbol', sym)
      } catch (err) {
        console.warn('Supabase watchlist delete failed:', err)
      }
    }

    return watchlistService.getWatchlist(user)
  }
}
