// BharatTrade AI — Curated Indian Market Dataset & Realistic Historical Time Series
// Clearly labelled illustrative financial dataset for educational research & paper trading.

export const marketStatus = {
  exchange: 'NSE / BSE',
  timezone: 'Asia/Kolkata',
  tradingHours: '09:15 - 15:30 IST',
  isOpen: () => {
    try {
      const now = new Date()
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
      const ist = new Date(utc + (3600000 * 5.5))
      const day = ist.getDay()
      if (day === 0 || day === 6) return false // Weekend
      const hour = ist.getHours()
      const minute = ist.getMinutes()
      const totalMinutes = hour * 60 + minute
      return totalMinutes >= (9 * 60 + 15) && totalMinutes <= (15 * 60 + 30)
    } catch {
      return false
    }
  }
}

export const indices = [
  { name: 'NIFTY 50', value: '24,812.35', change: '+0.62%', points: '+152.80', positive: true, sub: 'NSE BENCHMARK', open: 24680.10, high: 24855.40, low: 24650.25 },
  { name: 'SENSEX', value: '81,204.18', change: '+0.48%', points: '+388.20', positive: true, sub: 'BSE BENCHMARK', open: 80890.30, high: 81320.00, low: 80810.15 },
  { name: 'BANK NIFTY', value: '56,340.70', change: '-0.21%', points: '-118.50', positive: false, sub: 'BANKING SECTOR', open: 56490.00, high: 56580.40, low: 56210.30 },
  { name: 'INDIA VIX', value: '13.82', change: '-2.15%', points: '-0.30', positive: true, sub: 'VOLATILITY INDEX', open: 14.12, high: 14.45, low: 13.60 }
]

export const sectors = [
  { name: 'IT & Tech', value: 2.14, leader: 'INFY (+1.14%)', advance: 8, decline: 2 },
  { name: 'Pharmaceuticals', value: 1.42, leader: 'SUNPHARMA (+0.82%)', advance: 7, decline: 3 },
  { name: 'Energy & Oil', value: 1.15, leader: 'RELIANCE (+1.82%)', advance: 6, decline: 4 },
  { name: 'FMCG', value: 0.73, leader: 'ITC (+0.26%)', advance: 5, decline: 5 },
  { name: 'Infrastructure', value: 0.48, leader: 'LT (+1.56%)', advance: 6, decline: 4 },
  { name: 'Banking & Financials', value: -0.31, leader: 'HDFCBANK (+0.93%)', advance: 4, decline: 8 },
  { name: 'Automobile', value: -1.24, leader: 'TATAMOTORS (-2.05%)', advance: 3, decline: 7 },
  { name: 'Metals & Mining', value: -0.65, leader: 'TATASTEEL (-0.88%)', advance: 4, decline: 6 }
]

// 60-day historical base price sequences to support genuine indicator calculations
const generateCandleSeries = (basePrice, trend = 0.002, volatility = 0.015, count = 60) => {
  const candles = []
  let price = basePrice * (1 - (count * trend * 0.4))
  const now = new Date()

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    // skip weekends roughly
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const changePercent = (Math.sin(i * 0.6) * volatility) + (Math.cos(i * 1.3) * volatility * 0.7) + trend
    const open = price
    const close = Number((open * (1 + changePercent)).toFixed(2))
    const high = Number((Math.max(open, close) * (1 + Math.abs(volatility * 0.5))).toFixed(2))
    const low = Number((Math.min(open, close) * (1 - Math.abs(volatility * 0.5))).toFixed(2))
    const volume = Math.floor(1000000 + (Math.sin(i) * 500000) + 1200000)

    candles.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    })
    price = close
  }
  return candles
}

export const stockProfiles = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Limited',
    sector: 'Energy',
    price: 1468.25,
    change: 1.82,
    open: 1442.00,
    high: 1474.50,
    low: 1438.10,
    volume: '8.4M',
    marketCap: '₹19.82 Lakh Cr',
    peRatio: 26.4,
    week52High: 1608.80,
    week52Low: 1220.10,
    description: 'India\'s largest private sector enterprise with businesses in energy, petrochemicals, retail, telecommunications and digital services.',
    candles: generateCandleSeries(1468.25, 0.003, 0.014, 65)
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'IT',
    price: 3892.60,
    change: -0.74,
    open: 3920.00,
    high: 3935.00,
    low: 3878.50,
    volume: '2.1M',
    marketCap: '₹14.08 Lakh Cr',
    peRatio: 30.1,
    week52High: 4592.25,
    week52Low: 3313.00,
    description: 'Global leader in IT services, consulting, and business solutions operating in over 50 countries.',
    candles: generateCandleSeries(3892.60, -0.001, 0.012, 65)
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    sector: 'Banking',
    price: 1762.40,
    change: 0.93,
    open: 1746.00,
    high: 1768.90,
    low: 1742.00,
    volume: '6.8M',
    marketCap: '₹13.41 Lakh Cr',
    peRatio: 18.9,
    week52High: 1794.00,
    week52Low: 1363.55,
    description: 'India\'s largest private sector bank by assets and market capitalization, providing comprehensive banking services.',
    candles: generateCandleSeries(1762.40, 0.002, 0.011, 65)
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'IT',
    price: 1845.70,
    change: 1.14,
    open: 1825.00,
    high: 1856.00,
    low: 1822.10,
    volume: '3.7M',
    marketCap: '₹7.66 Lakh Cr',
    peRatio: 28.3,
    week52High: 1991.45,
    week52Low: 1358.35,
    description: 'Pioneering global digital services and consulting firm helping enterprises navigate digital transformations.',
    candles: generateCandleSeries(1845.70, 0.0035, 0.015, 65)
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Limited',
    sector: 'Banking',
    price: 1298.90,
    change: -1.12,
    open: 1313.50,
    high: 1318.00,
    low: 1292.00,
    volume: '5.2M',
    marketCap: '₹9.14 Lakh Cr',
    peRatio: 17.6,
    week52High: 1362.40,
    week52Low: 980.15,
    description: 'Leading multinational banking and financial services company with widespread retail and corporate operations.',
    candles: generateCandleSeries(1298.90, -0.002, 0.013, 65)
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking',
    price: 812.30,
    change: 0.37,
    open: 809.50,
    high: 816.00,
    low: 807.00,
    volume: '9.1M',
    marketCap: '₹7.25 Lakh Cr',
    peRatio: 10.8,
    week52High: 912.10,
    week52Low: 590.20,
    description: 'Fortune 500 public sector banking and financial services statutory body with over 200 years of heritage.',
    candles: generateCandleSeries(812.30, 0.001, 0.016, 65)
  },
  {
    symbol: 'ITC',
    name: 'ITC Limited',
    sector: 'FMCG',
    price: 432.15,
    change: 0.26,
    open: 431.00,
    high: 434.50,
    low: 429.80,
    volume: '4.4M',
    marketCap: '₹5.39 Lakh Cr',
    peRatio: 25.4,
    week52High: 528.55,
    week52Low: 399.30,
    description: 'Diversified conglomerate spanning FMCG, Hotels, Paperboards & Packaging, Agri-Business and Information Technology.',
    candles: generateCandleSeries(432.15, 0.0005, 0.009, 65)
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    sector: 'Auto',
    price: 684.80,
    change: -2.05,
    open: 699.00,
    high: 702.40,
    low: 681.10,
    volume: '7.3M',
    marketCap: '₹2.51 Lakh Cr',
    peRatio: 8.5,
    week52High: 1179.05,
    week52Low: 660.00,
    description: 'Global automotive manufacturing company designing cars, utility vehicles, trucks, buses and defence vehicles (including Jaguar Land Rover).',
    candles: generateCandleSeries(684.80, -0.004, 0.022, 65)
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Limited',
    sector: 'Infrastructure',
    price: 3542.10,
    change: 1.56,
    open: 3487.50,
    high: 3560.00,
    low: 3475.00,
    volume: '1.9M',
    marketCap: '₹4.87 Lakh Cr',
    peRatio: 36.2,
    week52High: 3919.90,
    week52Low: 2980.00,
    description: 'Major Indian technology, engineering, construction, manufacturing and financial services conglomerate.',
    candles: generateCandleSeries(3542.10, 0.0028, 0.013, 65)
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries',
    sector: 'Pharma',
    price: 1734.50,
    change: 0.82,
    open: 1720.00,
    high: 1745.00,
    low: 1715.00,
    volume: '2.8M',
    marketCap: '₹4.16 Lakh Cr',
    peRatio: 38.5,
    week52High: 1960.35,
    week52Low: 1115.00,
    description: 'Leading global specialty generic pharmaceutical company, ranked No. 1 in the Indian pharmaceuticals market.',
    candles: generateCandleSeries(1734.50, 0.002, 0.012, 65)
  }
]

// Backward-compatible stocks array for existing UI consumers
export const stocks = stockProfiles.map(s => {
  const closePrices = s.candles.map(c => c.close)
  // Compute basic initial indicators
  const diffs = closePrices.slice(-15)
  let gains = 0, losses = 0
  for (let i = 1; i < diffs.length; i++) {
    const d = diffs[i] - diffs[i-1]
    if (d > 0) gains += d
    else losses += Math.abs(d)
  }
  const rs = losses === 0 ? 100 : gains / losses
  const rsi = Math.round(100 - (100 / (1 + rs)))
  const signal = rsi > 55 ? 'Bullish' : rsi < 45 ? 'Bearish' : 'Neutral'

  return {
    symbol: s.symbol,
    name: s.name,
    sector: s.sector,
    price: s.price,
    change: s.change,
    volume: s.volume,
    rsi,
    signal,
    marketCap: s.marketCap,
    peRatio: s.peRatio
  }
})

export const history = [
  { day: '09:15', price: 24690 },
  { day: '10:00', price: 24730 },
  { day: '10:45', price: 24715 },
  { day: '11:30', price: 24765 },
  { day: '12:15', price: 24740 },
  { day: '13:00', price: 24795 },
  { day: '13:45', price: 24770 },
  { day: '14:30', price: 24825 },
  { day: '15:15', price: 24812 }
]

export const news = [
  {
    id: 'n1',
    title: 'RBI Monetary Policy: MPC maintains benchmark repo rate at 6.5%, focuses on inflation trajectory',
    source: 'LiveMint',
    sourceUrl: 'https://www.livemint.com',
    time: '2 hours ago',
    sector: 'Banking',
    symbols: ['HDFCBANK', 'ICICIBANK', 'SBIN'],
    sentiment: 'Neutral',
    tone: 'gold',
    summary: 'The Reserve Bank of India\'s Monetary Policy Committee decided to keep the policy repo rate unchanged, emphasizing price stability while supporting sustainable economic expansion.'
  },
  {
    id: 'n2',
    title: 'IT Sector Q3 Outlook: Generative AI deals and digital transformation ramp up order pipelines',
    source: 'The Economic Times',
    sourceUrl: 'https://economictimes.indiatimes.com',
    time: '4 hours ago',
    sector: 'IT',
    symbols: ['TCS', 'INFY'],
    sentiment: 'Positive',
    tone: 'green',
    summary: 'Top Indian IT exporters report steady renewal rates and growing client exploration of enterprise artificial intelligence pilots, supporting mid-term revenue visibility.'
  },
  {
    id: 'n3',
    title: 'Auto dispatches show mixed signals as passenger vehicles surge while commercial segment softens',
    source: 'Business Standard',
    sourceUrl: 'https://www.business-standard.com',
    time: '6 hours ago',
    sector: 'Auto',
    symbols: ['TATAMOTORS'],
    sentiment: 'Negative',
    tone: 'red',
    summary: 'Monthly wholesale figures reflect differing fortunes: strong utility vehicle demand countered by moderated heavy commercial fleet procurement.'
  },
  {
    id: 'n4',
    title: 'Renewable energy investments accelerate as conglomerate unveils multi-gigawatt solar infrastructure',
    source: 'Moneycontrol',
    sourceUrl: 'https://www.moneycontrol.com',
    time: '8 hours ago',
    sector: 'Energy',
    symbols: ['RELIANCE', 'LT'],
    sentiment: 'Positive',
    tone: 'green',
    summary: 'Capital expenditure commitments across green hydrogen, high-efficiency solar cells, and energy storage ecosystems signal long-term structural tailwinds.'
  },
  {
    id: 'n5',
    title: 'Pharmaceutical exports expand to emerging markets as regulatory approvals gain momentum',
    source: 'Financial Express',
    sourceUrl: 'https://www.financialexpress.com',
    time: '12 hours ago',
    sector: 'Pharma',
    symbols: ['SUNPHARMA'],
    sentiment: 'Positive',
    tone: 'green',
    summary: 'Specialty generic drugmakers record robust traction in Latin America and Southeast Asia, offsetting competitive pricing pressures in conventional formulations.'
  }
]
