import React, { useState, useEffect } from 'react'
import { Menu, Bell, User, LogOut, ShieldCheck, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { marketStatus } from '../../data/market'

export function Navbar({ title, onOpenSidebar, onOpenAuth }) {
  const { user, isGuest, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)

  useEffect(() => {
    setIsOpen(marketStatus.isOpen())
    const interval = setInterval(() => {
      setIsOpen(marketStatus.isOpen())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-line bg-ink/90 px-4 backdrop-blur-xl md:px-8">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onOpenSidebar}
          className="text-muted hover:text-white lg:hidden p-1.5 rounded-lg border border-line bg-panel2"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-white tracking-tight">{title}</h1>
          <p className="text-[11px] text-muted hidden sm:block">Indian Equities Intelligence & Simulation Platform</p>
        </div>
      </div>

      {/* Right side: Market Status + Demo Badge + Auth */}
      <div className="flex items-center gap-3">
        {/* Market Status Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-line bg-[#0c1422] px-3 py-1 text-xs">
          <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-mint animate-pulse' : 'bg-gold'}`} />
          <span className="font-medium text-slate-300">
            {isOpen ? 'NSE/BSE Open' : 'Market Closed'}
          </span>
          <span className="text-[10px] text-muted">09:15 - 15:30 IST</span>
        </div>

        {/* Demo Mode Pill */}
        <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-gold/25 bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold">
          <ShieldCheck size={13} />
          <span>DEMO DATA</span>
        </div>

        {/* User Account / Auth trigger */}
        <div className="relative">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProfileDropdown(p => !p)}
                className="flex items-center gap-2 rounded-xl border border-line bg-[#162436] px-3 py-1.5 text-xs text-white hover:border-mint/50 transition"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-mint text-ink font-bold text-[11px]">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline font-medium text-slate-200">
                  {user.user_metadata?.display_name || user.email?.split('@')[0]}
                </span>
              </button>

              {profileDropdown && (
                <div className="absolute right-0 top-11 w-48 rounded-xl border border-line bg-[#0c1422] p-1.5 shadow-2xl z-30">
                  <div className="px-3 py-2 border-b border-line text-xs">
                    <p className="font-semibold text-white truncate">{user.email}</p>
                    <p className="text-[10px] text-mint">Authenticated Trader</p>
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setProfileDropdown(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-danger hover:bg-danger/10 transition mt-1"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <User size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
