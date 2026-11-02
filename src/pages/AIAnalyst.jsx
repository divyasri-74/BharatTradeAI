import React, { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Server,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react'
import { aiService } from '../services/aiService'

export function AIAnalyst({ initialPrompt = '', initialSymbol = null }) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: `### 🇮🇳 Namaste! I am Bharat AI
Your Indian financial intelligence co-pilot. I analyze equities across NSE and BSE, interpret complex indicator set-ups, and explain macroeconomic trends.

**How can I assist your market research today?**`,
      source: 'Bharat AI Financial Engine'
    }
  ])
  const messagesEndRef = useRef(null)

  const quickPrompts = [
    'How do I interpret an RSI reading above 70?',
    'Explain how MACD crossovers generate signals.',
    'Analyze technical structure of RELIANCE.',
    'What does high India VIX mean for option traders?',
    'How do Bollinger Bands help identify breakouts?',
    'What is market breadth and advance-decline ratio?'
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  const handleSend = async (textToSend) => {
    const q = (textToSend || prompt).trim()
    if (!q || busy) return

    setPrompt('')
    const userMsgId = 'u_' + Date.now()
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: q }])
    setBusy(true)

    try {
      const res = await aiService.askAnalyst(q, initialSymbol)
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: res.answer,
          source: res.source,
          isLiveGemini: res.isLiveGemini
        }
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: 'Apologies, I encountered an issue processing that query. Please try again or rephrase your question.',
          source: 'Error Handler'
        }
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">GENERATIVE FINANCE</p>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot size={22} className="text-mint" /> Bharat AI Market Analyst
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-full border border-mint/20 bg-mint/10 px-3 py-1 font-medium text-mint">
            <Cpu size={13} /> Dual AI Engine (Gemini + Offline)
          </span>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div>
        <p className="mb-2 text-xs text-muted font-medium">Suggested Research Questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              onClick={() => handleSend(qp)}
              disabled={busy}
              className="rounded-xl border border-line bg-panel px-3 py-2 text-left text-xs text-slate-300 hover:border-mint/40 hover:text-white transition flex items-center gap-1.5"
            >
              <span>{qp}</span>
              <ArrowUpRight size={12} className="text-muted shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="card grid-bg p-5 min-h-[440px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user'
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-mint/20 bg-mint/10 text-mint">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-mint text-ink font-semibold rounded-br-xs'
                    : 'border border-line bg-[#0c1422] text-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-2">
                  {m.text}
                </div>
                {!isUser && m.source && (
                  <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Engine: {m.source}</span>
                    <span>Educational Output</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {busy && (
          <div className="flex gap-3 items-center text-xs text-muted">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-mint/20 bg-mint/10 text-mint animate-pulse">
              <Sparkles size={16} />
            </div>
            <div className="rounded-2xl border border-line bg-[#0c1422] p-3 text-xs text-mint flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-mint animate-ping" />
              <span>Bharat AI is analyzing technical indicators and formulating insights...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="card p-2 flex items-center gap-2"
      >
        <input
          type="text"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 font-medium"
          placeholder="Ask Bharat AI about Indian equities, indicators, or sector trends..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !prompt.trim()}
          className="btn btn-primary px-4 py-2 text-xs flex items-center gap-1.5 shrink-0"
        >
          <span>Ask</span>
          <Send size={14} />
        </button>
      </form>

      {/* Production AI Gateway Checklist & Disclaimer */}
      <div className="card p-4 rounded-xl border border-line bg-[#0a111c] text-xs space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <Server size={14} className="text-mint" />
          <span>Secure Server-Side AI Architecture</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          In production, Gemini API keys are never stored on client machines. Bharat AI routes requests to the Python FastAPI backend (<code className="font-mono text-mint">backend/app/main.py</code>) running locally or in cloud microservices. If offline, our built-in mathematical knowledge engine provides immediate contextual support.
        </p>
        <div className="flex items-center gap-2 pt-1 text-[10px] text-gold font-medium">
          <AlertTriangle size={13} className="shrink-0" />
          <span>Never present AI outputs as guaranteed return forecasts or registered investment advisory.</span>
        </div>
      </div>
    </div>
  )
}
