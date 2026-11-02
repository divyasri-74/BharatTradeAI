import React, { useState, useEffect } from 'react'
import {
  Newspaper,
  Search,
  ExternalLink,
  Clock,
  Filter,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { newsService } from '../services/newsService'
import { ToneBadge } from '../components/common/Badge'

export function NewsPage({ onSelectStock }) {
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState('All')
  const [sentiment, setSentiment] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      try {
        const data = await newsService.getNews({ sector, sentiment, search })
        setNewsList(data)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [sector, sentiment, search])

  const sectors = ['All', 'Banking', 'IT', 'Energy', 'Auto', 'Pharma']
  const sentiments = ['All', 'Positive', 'Negative', 'Neutral']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">FINANCIAL INTELLIGENCE</p>
        <h2 className="text-xl font-bold text-white">Indian Market News & Sentiment</h2>
        <p className="mt-1 text-xs text-muted">
          Curated headlines from verified financial publications with automated sentiment tagging.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 grid gap-3 sm:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-muted" size={16} />
          <input
            type="text"
            className="field pl-9 py-2 text-xs"
            placeholder="Search headlines or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sector Filter */}
        <div>
          <select
            className="field py-2 text-xs"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                Sector: {s}
              </option>
            ))}
          </select>
        </div>

        {/* Sentiment Filter */}
        <div>
          <select
            className="field py-2 text-xs"
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
          >
            {sentiments.map((s) => (
              <option key={s} value={s}>
                Sentiment: {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News Feed List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="card p-10 text-center text-xs text-muted">Loading financial intelligence feed...</div>
        ) : newsList.length === 0 ? (
          <div className="card p-12 text-center">
            <Newspaper className="mx-auto text-muted mb-3" size={32} />
            <p className="text-sm font-semibold text-white">No articles match your filters</p>
            <p className="text-xs text-muted mt-1">Try clearing your search query or selecting 'All' sectors.</p>
          </div>
        ) : (
          newsList.map((item) => (
            <article key={item.id} className="card p-5 hover:border-slate-600 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-300">{item.source}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-muted flex items-center gap-1 text-[11px]">
                    <Clock size={12} /> {item.time}
                  </span>
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-400 font-semibold">
                    {item.sector}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ToneBadge tone={item.tone} text={`${item.sentiment} Sentiment`} />
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-mint transition p-1"
                      title="View on publisher website"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="mt-3 text-base font-semibold text-white leading-snug">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {item.summary}
              </p>

              {item.symbols && item.symbols.length > 0 && (
                <div className="mt-4 pt-3 border-t border-line/60 flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Related Equities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.symbols.map((sym) => (
                      <button
                        key={sym}
                        onClick={() => onSelectStock && onSelectStock({ symbol: sym })}
                        className="rounded-md bg-[#0a1220] border border-line px-2 py-0.5 text-[11px] font-semibold text-mint hover:border-mint transition"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  )
}
