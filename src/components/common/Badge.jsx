import React from 'react'

export function SignalBadge({ signal }) {
  const styles =
    signal === 'Bullish'
      ? 'text-mint bg-mint/10 border-mint/25'
      : signal === 'Bearish'
      ? 'text-danger bg-danger/10 border-danger/25'
      : 'text-gold bg-gold/10 border-gold/25'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${signal === 'Bullish' ? 'bg-mint' : signal === 'Bearish' ? 'bg-danger' : 'bg-gold'}`} />
      {signal}
    </span>
  )
}

export function ToneBadge({ tone, text }) {
  const styles =
    tone === 'green'
      ? 'text-mint bg-mint/10 border-mint/20'
      : tone === 'red'
      ? 'text-danger bg-danger/10 border-danger/20'
      : 'text-gold bg-gold/10 border-gold/20'

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${styles}`}>
      {text}
    </span>
  )
}
