/**
 * BharatTrade AI — AI Market Analyst Service (Bharat AI)
 * 
 * Secure Gateway Architecture:
 * - Directs queries to the secure Python FastAPI backend (/api/ai/chat)
 * - Protects Gemini API keys completely from frontend bundles
 * - Intelligent offline fallback engine providing rich contextual financial explanations
 */

import { stockProfiles } from '../data/market'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export const aiService = {
  /**
   * Ask Bharat AI a market or equity question
   * @param {string} prompt User prompt
   * @param {string} [contextSymbol] Optional stock symbol for focused research
   */
  askAnalyst: async (prompt, contextSymbol = null) => {
    // 1. Try secure backend first
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, symbol: contextSymbol })
      })

      if (response.ok) {
        const data = await response.json()
        return {
          answer: data.answer,
          isLiveGemini: true,
          source: 'Gemini 1.5 Pro / Flash via Secure Backend'
        }
      }
    } catch {
      // Backend not running or unreachable: use intelligent offline reasoning engine
    }

    // 2. Intelligent Offline Financial Reasoning Engine
    return aiService.generateOfflineInsight(prompt, contextSymbol)
  },

  /**
   * Generates structured financial explanations when offline
   */
  generateOfflineInsight: (prompt, contextSymbol) => {
    const q = prompt.toLowerCase()
    const targetStock = contextSymbol
      ? stockProfiles.find(s => s.symbol.toUpperCase() === contextSymbol.toUpperCase())
      : stockProfiles.find(s => q.includes(s.symbol.toLowerCase()) || q.includes(s.name.toLowerCase()))

    let answer = ''

    if (targetStock) {
      answer = `### 📊 Technical Context for ${targetStock.name} (${targetStock.symbol})

- **Current Market Price**: ₹${targetStock.price.toFixed(2)} (${targetStock.change >= 0 ? '+' : ''}${targetStock.change}% today)
- **Sector**: ${targetStock.sector} | **Market Cap**: ${targetStock.marketCap}
- **52-Week Range**: ₹${targetStock.week52Low} – ₹${targetStock.week52High}

#### 1. Key Technical Observations
${targetStock.change >= 0 ? '• Price action is exhibiting positive short-term momentum.' : '• Price action is experiencing intraday consolidation and supply pressure.'}
• Support level is estimated near ₹${(targetStock.price * 0.97).toFixed(2)}, while overhead resistance is positioned near ₹${(targetStock.price * 1.03).toFixed(2)}.
• Volume of ${targetStock.volume} suggests active institutional participation.

#### 2. Risk & Educational Disclaimer
*This technical summary is generated for educational market analysis. Never base real financial commitments solely on automated signals without comprehensive fundamental risk evaluation.*`
    } else if (q.includes('rsi') || q.includes('relative strength')) {
      answer = `### 📈 Understanding the Relative Strength Index (RSI)

The **Relative Strength Index (RSI)** is a momentum oscillator measuring the speed and velocity of directional price movements on a scale from **0 to 100**.

#### Core Reference Zones:
- **Overbought (> 70)**: Suggests strong buying exhaustion; potential pullback or consolidation may follow.
- **Oversold (< 30)**: Indicates heavy selling pressure; watch for stabilization or mean reversion.
- **Centerline (50)**: Marks the equilibrium between bull and bear momentum.

> **Pro Tip**: In strong structural uptrends, RSI often oscillates between 40 and 80, rarely dipping below 30. Look for RSI divergences (price makes higher highs while RSI makes lower highs) as early warnings of momentum loss.`
    } else if (q.includes('macd') || q.includes('moving average convergence')) {
      answer = `### 📊 Understanding MACD (Moving Average Convergence Divergence)

**MACD** is a trend-following momentum indicator calculated from two exponential moving averages (typically the 12-period and 26-period EMAs).

#### The 3 Components:
1. **MACD Line**: 12-day EMA minus 26-day EMA.
2. **Signal Line**: 9-day EMA of the MACD Line.
3. **Histogram**: Visual difference between the MACD Line and Signal Line.

#### Interpretation:
- **Bullish Signal**: When the MACD line crosses above the Signal line (Histogram turns green/positive).
- **Bearish Signal**: When the MACD line crosses below the Signal line (Histogram turns red/negative).`
    } else if (q.includes('bollinger') || q.includes('bands')) {
      answer = `### 🎯 Understanding Bollinger Bands

Developed by John Bollinger, Bollinger Bands measure market volatility using a central Moving Average flanked by two statistical volatility bands.

- **Middle Band**: Standard 20-period Simple Moving Average (SMA).
- **Upper Band**: SMA 20 + (2 × Standard Deviation).
- **Lower Band**: SMA 20 - (2 × Standard Deviation).

#### Common Strategies:
- **Volatility Squeeze**: When the bands narrow tightly, it signals impending explosive directional volatility.
- **Band Walking**: In strong trends, price can "walk" along the upper or lower band for sustained periods.`
    } else {
      answer = `### 🇮🇳 Bharat AI Market Assistant

I can help you analyze Indian equities, interpret complex technical indicators, and evaluate market dynamics across the NSE and BSE.

#### Suggestions to explore:
1. **"Analyze RELIANCE"** or any other NIFTY 50 stock.
2. **"Explain how to use MACD and RSI together."**
3. **"What does market breadth tell us about NIFTY?"**
4. **"How do moving average golden crosses work?"**

*Note: For live real-time LLM inference, start the Python backend in the \`backend/\` folder and configure your GEMINI_API_KEY.*`
    }

    return {
      answer,
      isLiveGemini: false,
      source: 'Bharat AI Financial Knowledge Engine (Offline Mode)'
    }
  }
}
