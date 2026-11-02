/**
 * BharatTrade AI — Financial News & Sentiment Service
 * 
 * Provides curated Indian equity headlines with sentiment classification,
 * sector tagging, and source verification.
 */

import { news } from '../data/market'

export const newsService = {
  /**
   * Fetch all news articles with optional filters
   */
  getNews: async ({ sector = 'All', sentiment = 'All', symbol = '', search = '' } = {}) => {
    let list = [...news]

    if (sector && sector !== 'All') {
      list = list.filter(n => n.sector === sector)
    }

    if (sentiment && sentiment !== 'All') {
      list = list.filter(n => n.sentiment.toLowerCase() === sentiment.toLowerCase())
    }

    if (symbol) {
      const symUpper = symbol.toUpperCase()
      list = list.filter(n => n.symbols && n.symbols.includes(symUpper))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.source.toLowerCase().includes(q)
      )
    }

    return list
  }
}
