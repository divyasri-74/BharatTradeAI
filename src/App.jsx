import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { Dashboard } from './pages/Dashboard'
import { StockAnalyzer } from './pages/StockAnalyzer'
import { AIAnalyst } from './pages/AIAnalyst'
import { NewsPage } from './pages/News'
import { Screener } from './pages/Screener'
import { Watchlist } from './pages/Watchlist'
import { PaperTrading } from './pages/PaperTrading'
import { AuthModal } from './components/auth/AuthModal'
import { OrderModal } from './components/trading/OrderModal'
import { watchlistService } from './services/watchlistService'
import { stockProfiles } from './data/market'

function MainLayout() {
  const [page, setPage] = useState('dashboard')
  const [selectedStock, setSelectedStock] = useState(stockProfiles[0])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [tradingStock, setTradingStock] = useState(null)
  const [aiInitialPrompt, setAiInitialPrompt] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const { user } = useAuth()
  const { showToast } = useToast()

  // Load watchlist on mount and auth state change
  useEffect(() => {
    watchlistService.getWatchlist(user).then(setWatchlist)
  }, [user])

  const titles = {
    dashboard: 'Market Overview',
    analyzer: 'Stock Technical Analyzer',
    analyst: 'Bharat AI Market Analyst',
    news: 'Indian News & Sentiment',
    screener: 'Indian Equities Screener',
    watchlist: 'My Watchlist',
    paper: 'Virtual Paper Trading'
  }

  const navigateTo = (targetPage) => {
    setPage(targetPage)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectStock = (stock) => {
    const fullStock = stockProfiles.find(s => s.symbol.toUpperCase() === stock.symbol.toUpperCase()) || stock
    setSelectedStock(fullStock)
    setPage('analyzer')
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTradeStock = (stock) => {
    const fullStock = stockProfiles.find(s => s.symbol.toUpperCase() === stock.symbol.toUpperCase()) || stock
    setTradingStock(fullStock)
  }

  const handleToggleWatch = async (stock) => {
    const isAlready = watchlistService.isWatched(stock.symbol, watchlist)
    let updated = []
    if (isAlready) {
      updated = await watchlistService.removeStock(stock.symbol, user)
      showToast(`Removed ${stock.symbol} from watchlist.`, 'info')
    } else {
      updated = await watchlistService.addStock(stock, user)
      showToast(`Added ${stock.symbol} to watchlist.`, 'success')
    }
    setWatchlist(updated)
  }

  const handleAskAI = (promptText) => {
    setAiInitialPrompt(promptText)
    setPage('analyst')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isWatched = (sym) => watchlistService.isWatched(sym, watchlist)

  return (
    <div className="min-h-screen bg-ink text-slate-100 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        page={page}
        onNavigate={navigateTo}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        watchlistCount={watchlist.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Sticky Header Navbar */}
        <Navbar
          title={titles[page]}
          onOpenSidebar={() => setMobileOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 mx-auto max-w-[1500px] w-full p-4 md:p-8">
          {page === 'dashboard' && (
            <Dashboard
              onNavigate={navigateTo}
              onSelectStock={handleSelectStock}
              onTradeStock={handleTradeStock}
              onToggleWatch={handleToggleWatch}
              isWatched={isWatched}
            />
          )}

          {page === 'analyzer' && (
            <StockAnalyzer
              selectedStock={selectedStock}
              onSelectStock={handleSelectStock}
              onTrade={handleTradeStock}
              onToggleWatch={handleToggleWatch}
              isWatched={isWatched}
              onAskAI={handleAskAI}
            />
          )}

          {page === 'analyst' && (
            <AIAnalyst
              initialPrompt={aiInitialPrompt}
              initialSymbol={selectedStock?.symbol}
            />
          )}

          {page === 'news' && (
            <NewsPage onSelectStock={handleSelectStock} />
          )}

          {page === 'screener' && (
            <Screener
              onSelectStock={handleSelectStock}
              onTrade={handleTradeStock}
              onToggleWatch={handleToggleWatch}
              isWatched={isWatched}
            />
          )}

          {page === 'watchlist' && (
            <Watchlist
              watchlist={watchlist}
              onRemove={(sym) => handleToggleWatch({ symbol: sym })}
              onSelectStock={handleSelectStock}
              onTrade={handleTradeStock}
              onNavigate={navigateTo}
            />
          )}

          {page === 'paper' && (
            <PaperTrading
              onSelectStock={handleSelectStock}
              onTradeStock={handleTradeStock}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-line py-6 text-center text-xs text-slate-500">
          <p className="font-medium text-slate-400">
            BharatTrade AI — Next-Generation Indian Equities Market Intelligence & Paper Simulation
          </p>
          <p className="mt-1 text-[11px] text-slate-600 max-w-xl mx-auto px-4">
            Educational research platform. Demo prices and simulated technical indicators are for analytical practice only. Not registered investment advice.
          </p>
        </footer>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <OrderModal
        isOpen={Boolean(tradingStock)}
        onClose={() => setTradingStock(null)}
        stock={tradingStock}
        onOrderExecuted={() => {
          // Trigger updates if necessary
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </AuthProvider>
  )
}
