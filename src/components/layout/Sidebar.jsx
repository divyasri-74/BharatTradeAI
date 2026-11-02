import React from 'react'
import {
  LayoutDashboard,
  CandlestickChart,
  Bot,
  Newspaper,
  Filter,
  ListFilter,
  Wallet,
  X,
  ShieldCheck,
  CircleHelp,
  Sparkles
} from 'lucide-react'

export function Sidebar({ page, onNavigate, mobileOpen, onCloseMobile, watchlistCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Stock Analyzer', icon: CandlestickChart },
    { id: 'analyst', label: 'AI Analyst', icon: Bot, badge: 'AI' },
    { id: 'news', label: 'News & Sentiment', icon: Newspaper },
    { id: 'screener', label: 'Stock Screener', icon: Filter },
    { id: 'watchlist', label: 'Watchlist', icon: ListFilter, count: watchlistCount },
    { id: 'paper', label: 'Paper Trading', icon: Wallet }
  ]

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-[#0c1422] transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-[74px] items-center gap-3 border-b border-line px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-ink shadow-md shadow-mint/20">
            <CandlestickChart size={22} />
          </div>
          <div>
            <p className="font-bold tracking-tight text-white text-base">
              BharatTrade <span className="text-mint">AI</span>
            </p>
            <p className="text-[9px] font-bold tracking-[0.2em] text-muted">
              MARKET INTELLIGENCE
            </p>
          </div>
          <button
            className="ml-auto text-muted hover:text-white lg:hidden p-1 rounded-lg"
            onClick={onCloseMobile}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="px-3.5 pt-6 flex-1 overflow-y-auto">
          <p className="mb-2.5 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon, badge, count }) => {
              const active = page === id
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-medium transition-all ${
                    active
                      ? 'bg-mint/10 text-mint font-semibold border border-mint/20 shadow-sm'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-mint' : 'text-slate-400'} />
                  <span>{label}</span>
                  {badge && (
                    <span className="ml-auto flex items-center gap-0.5 rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-bold text-mint">
                      <Sparkles size={10} /> {badge}
                    </span>
                  )}
                  {count !== undefined && count > 0 && (
                    <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="mt-auto p-4 border-t border-line/60 space-y-3">
          <div className="rounded-xl border border-mint/15 bg-mint/[.04] p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-mint text-xs">
              <ShieldCheck size={14} /> Paper Mode Active
            </div>
            <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
              Zero real capital involved. Virtual simulated equity testing.
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <CircleHelp size={12} /> v2.0.0
            </span>
            <span>NSE / BSE Demo</span>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  )
}
