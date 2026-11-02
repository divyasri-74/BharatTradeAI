// Clearly labelled illustrative demo data. Not live prices or investment advice.
export const indices = [
  { name: 'NIFTY 50', value: '24,812.35', change: '+0.62%', positive: true, sub: 'DEMO SNAPSHOT' },
  { name: 'SENSEX', value: '81,204.18', change: '+0.48%', positive: true, sub: 'DEMO SNAPSHOT' },
  { name: 'BANK NIFTY', value: '56,340.70', change: '-0.21%', positive: false, sub: 'DEMO SNAPSHOT' },
  { name: 'INDIA VIX', value: '14.82', change: '-2.15%', positive: true, sub: 'DEMO SNAPSHOT' }
]
export const stocks = [
  { symbol:'RELIANCE', name:'Reliance Industries', sector:'Energy', price:1468.25, change:1.82, volume:'8.4M', rsi:58, signal:'Bullish', marketCap:'₹19.8T' },
  { symbol:'TCS', name:'Tata Consultancy Services', sector:'IT', price:3892.6, change:-0.74, volume:'2.1M', rsi:46, signal:'Neutral', marketCap:'₹14.1T' },
  { symbol:'HDFCBANK', name:'HDFC Bank', sector:'Banking', price:1762.4, change:0.93, volume:'6.8M', rsi:54, signal:'Bullish', marketCap:'₹13.4T' },
  { symbol:'INFY', name:'Infosys', sector:'IT', price:1845.7, change:1.14, volume:'3.7M', rsi:62, signal:'Bullish', marketCap:'₹7.6T' },
  { symbol:'ICICIBANK', name:'ICICI Bank', sector:'Banking', price:1298.9, change:-1.12, volume:'5.2M', rsi:41, signal:'Bearish', marketCap:'₹9.1T' },
  { symbol:'SBIN', name:'State Bank of India', sector:'Banking', price:812.3, change:0.37, volume:'9.1M', rsi:51, signal:'Neutral', marketCap:'₹7.2T' },
  { symbol:'ITC', name:'ITC Limited', sector:'FMCG', price:432.15, change:0.26, volume:'4.4M', rsi:49, signal:'Neutral', marketCap:'₹5.4T' },
  { symbol:'TATAMOTORS', name:'Tata Motors', sector:'Auto', price:684.8, change:-2.05, volume:'7.3M', rsi:32, signal:'Bearish', marketCap:'₹2.5T' },
  { symbol:'LT', name:'Larsen & Toubro', sector:'Infrastructure', price:3542.1, change:1.56, volume:'1.9M', rsi:64, signal:'Bullish', marketCap:'₹4.9T' },
  { symbol:'SUNPHARMA', name:'Sun Pharmaceutical', sector:'Pharma', price:1734.5, change:0.82, volume:'2.8M', rsi:57, signal:'Bullish', marketCap:'₹4.2T' }
]
export const history = [
  { day:'09:15', price:24080 }, { day:'10:00', price:24115 }, { day:'10:45', price:24092 },
  { day:'11:30', price:24170 }, { day:'12:15', price:24135 }, { day:'13:00', price:24210 },
  { day:'13:45', price:24188 }, { day:'14:30', price:24255 }, { day:'15:15', price:24290 }
]
export const news = [
  { title:'RBI policy watch: markets assess the interest-rate outlook', source:'Market Desk', time:'Today · Demo item', sentiment:'Mixed', tone:'gold', summary:'Policy expectations can influence banking, rate-sensitive sectors and broader market sentiment.' },
  { title:'IT sector in focus as investors track global technology spending', source:'Business Wire', time:'Today · Demo item', sentiment:'Positive', tone:'green', summary:'Technology spending commentary may affect sentiment across large-cap IT companies.' },
  { title:'Auto stocks monitored amid changing demand expectations', source:'Equity Brief', time:'Yesterday · Demo item', sentiment:'Negative', tone:'red', summary:'Demand, input costs and financing conditions are important variables for the auto sector.' }
]
export const sectors = [
  { name:'IT', value:2.1 }, { name:'Pharma', value:1.4 }, { name:'Energy', value:1.1 },
  { name:'FMCG', value:0.7 }, { name:'Banking', value:-0.3 }, { name:'Auto', value:-1.2 }
]
