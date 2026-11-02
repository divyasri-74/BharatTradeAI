/**
 * BharatTrade AI — Technical Analysis Mathematical Engine
 * 
 * Provides mathematically accurate indicator calculations from OHLCV series.
 * Formulas adhere to standard financial market methodologies (Wilder RSI, EMA MACD, etc.)
 */

/**
 * Calculates Simple Moving Average (SMA)
 * @param {number[]} prices Array of close prices
 * @param {number} period Lookback period
 * @returns {number|null}
 */
export function calculateSMA(prices, period) {
  if (!prices || prices.length < period || period <= 0) return null
  const slice = prices.slice(-period)
  const sum = slice.reduce((acc, val) => acc + val, 0)
  return Number((sum / period).toFixed(2))
}

/**
 * Calculates Exponential Moving Average (EMA)
 * @param {number[]} prices Array of close prices
 * @param {number} period Lookback period
 * @returns {number|null}
 */
export function calculateEMA(prices, period) {
  if (!prices || prices.length < period || period <= 0) return null
  const multiplier = 2 / (period + 1)
  
  // Seed with initial SMA
  let ema = prices.slice(0, period).reduce((acc, val) => acc + val, 0) / period

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema
  }
  return Number(ema.toFixed(2))
}

/**
 * Calculates Relative Strength Index (RSI) using Wilder's Smoothed Moving Average
 * @param {number[]} prices Array of close prices
 * @param {number} period Lookback period (default 14)
 * @returns {number|null} RSI value between 0 and 100
 */
export function calculateRSI(prices, period = 14) {
  if (!prices || prices.length <= period) return null

  let gains = []
  let losses = []

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1]
    gains.push(diff > 0 ? diff : 0)
    losses.push(diff < 0 ? Math.abs(diff) : 0)
  }

  // Initial average gain and loss
  let avgGain = gains.slice(0, period).reduce((acc, v) => acc + v, 0) / period
  let avgLoss = losses.slice(0, period).reduce((acc, v) => acc + v, 0) / period

  // Wilder's smoothing
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period
  }

  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  const rsi = 100 - (100 / (1 + rs))
  return Number(rsi.toFixed(2))
}

/**
 * Calculates MACD (12, 26, 9)
 * @param {number[]} prices Array of close prices
 * @param {number} fastPeriod Fast EMA period (default 12)
 * @param {number} slowPeriod Slow EMA period (default 26)
 * @param {number} signalPeriod Signal EMA period (default 9)
 * @returns {{ macd: number, signal: number, histogram: number }|null}
 */
export function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (!prices || prices.length < slowPeriod + signalPeriod) return null

  const fastMultiplier = 2 / (fastPeriod + 1)
  const slowMultiplier = 2 / (slowPeriod + 1)
  const signalMultiplier = 2 / (signalPeriod + 1)

  // Calculate full EMA series for fast and slow
  let fastEma = prices.slice(0, fastPeriod).reduce((a, b) => a + b, 0) / fastPeriod
  let slowEma = prices.slice(0, slowPeriod).reduce((a, b) => a + b, 0) / slowPeriod

  const macdSeries = []

  for (let i = 0; i < prices.length; i++) {
    if (i >= fastPeriod) {
      fastEma = (prices[i] - fastEma) * fastMultiplier + fastEma
    }
    if (i >= slowPeriod) {
      slowEma = (prices[i] - slowEma) * slowMultiplier + slowEma
      macdSeries.push(fastEma - slowEma)
    }
  }

  if (macdSeries.length < signalPeriod) return null

  let signalEma = macdSeries.slice(0, signalPeriod).reduce((a, b) => a + b, 0) / signalPeriod
  for (let i = signalPeriod; i < macdSeries.length; i++) {
    signalEma = (macdSeries[i] - signalEma) * signalMultiplier + signalEma
  }

  const latestMacd = macdSeries[macdSeries.length - 1]
  const histogram = latestMacd - signalEma

  return {
    macd: Number(latestMacd.toFixed(2)),
    signal: Number(signalEma.toFixed(2)),
    histogram: Number(histogram.toFixed(2))
  }
}

/**
 * Calculates Bollinger Bands (20 periods, 2 standard deviations)
 * @param {number[]} prices Array of close prices
 * @param {number} period Lookback period (default 20)
 * @param {number} multiplier Std Dev multiplier (default 2)
 * @returns {{ middle: number, upper: number, lower: number, bandwidth: number }|null}
 */
export function calculateBollingerBands(prices, period = 20, multiplier = 2) {
  if (!prices || prices.length < period) return null

  const slice = prices.slice(-period)
  const sma = slice.reduce((a, b) => a + b, 0) / period
  const variance = slice.reduce((acc, val) => acc + Math.pow(val - sma, 2), 0) / period
  const stdDev = Math.sqrt(variance)

  const upper = sma + (multiplier * stdDev)
  const lower = sma - (multiplier * stdDev)
  const bandwidth = ((upper - lower) / sma) * 100

  return {
    middle: Number(sma.toFixed(2)),
    upper: Number(upper.toFixed(2)),
    lower: Number(lower.toFixed(2)),
    bandwidth: Number(bandwidth.toFixed(2))
  }
}

/**
 * Calculates Classical Pivot Points from High, Low, Close
 * @param {number} high
 * @param {number} low
 * @param {number} close
 * @returns {{ pivot: number, r1: number, r2: number, s1: number, s2: number }}
 */
export function calculatePivotPoints(high, low, close) {
  const pivot = (high + low + close) / 3
  const r1 = (2 * pivot) - low
  const s1 = (2 * pivot) - high
  const r2 = pivot + (high - low)
  const s2 = pivot - (high - low)

  return {
    pivot: Number(pivot.toFixed(2)),
    r1: Number(r1.toFixed(2)),
    r2: Number(r2.toFixed(2)),
    s1: Number(s1.toFixed(2)),
    s2: Number(s2.toFixed(2))
  }
}

/**
 * Calculates Historical Volatility (Annualized, based on daily log returns)
 * @param {number[]} prices Array of close prices
 * @param {number} period Lookback period
 * @returns {number|null} Volatility as a percentage (e.g. 18.45%)
 */
export function calculateVolatility(prices, period = 14) {
  if (!prices || prices.length < period + 1) return null

  const logReturns = []
  const slice = prices.slice(-(period + 1))
  for (let i = 1; i < slice.length; i++) {
    logReturns.push(Math.log(slice[i] / slice[i - 1]))
  }

  const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length
  const variance = logReturns.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (logReturns.length - 1)
  const dailyStdDev = Math.sqrt(variance)
  const annualized = dailyStdDev * Math.sqrt(252) * 100 // 252 trading days

  return Number(annualized.toFixed(2))
}

/**
 * Evaluates comprehensive technical confluence to generate a robust signal
 * @param {{ rsi: number, macd: object, price: number, sma20: number, sma50: number, bollinger: object }} indicators
 * @returns {{ signal: 'Bullish'|'Bearish'|'Neutral', score: number, summary: string }}
 */
export function evaluateConfluence(indicators) {
  let score = 0
  const reasons = []

  const { rsi, macd, price, sma20, sma50, bollinger } = indicators

  // 1. RSI Rules
  if (rsi !== null) {
    if (rsi < 30) {
      score += 2
      reasons.push('RSI is in oversold territory (< 30)')
    } else if (rsi > 70) {
      score -= 2
      reasons.push('RSI is in overbought territory (> 70)')
    } else if (rsi > 50) {
      score += 1
      reasons.push('RSI is in positive momentum territory (> 50)')
    } else {
      score -= 1
      reasons.push('RSI is below 50 midpoint')
    }
  }

  // 2. MACD Rules
  if (macd) {
    if (macd.histogram > 0) {
      score += 1.5
      reasons.push('MACD histogram is positive (bullish momentum)')
    } else {
      score -= 1.5
      reasons.push('MACD histogram is negative (bearish pressure)')
    }
  }

  // 3. Moving Average Rules
  if (sma20 && sma50) {
    if (price > sma20 && sma20 > sma50) {
      score += 2
      reasons.push('Price is trading above rising 20-day and 50-day SMAs (Golden Alignment)')
    } else if (price < sma20 && sma20 < sma50) {
      score -= 2
      reasons.push('Price is trading below declining 20-day and 50-day SMAs (Death Alignment)')
    } else if (price > sma20) {
      score += 1
      reasons.push('Price is trading above 20-day SMA')
    } else {
      score -= 1
      reasons.push('Price is trading below 20-day SMA')
    }
  }

  // 4. Bollinger Band Rules
  if (bollinger) {
    if (price <= bollinger.lower) {
      score += 1
      reasons.push('Price is testing lower Bollinger Band support')
    } else if (price >= bollinger.upper) {
      score -= 1
      reasons.push('Price is testing upper Bollinger Band resistance')
    }
  }

  let signal = 'Neutral'
  if (score >= 2.5) signal = 'Bullish'
  else if (score <= -2.5) signal = 'Bearish'

  return {
    signal,
    score: Number(score.toFixed(1)),
    summary: reasons.slice(0, 3).join('. ') + '.'
  }
}
