import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Lock, Mail, User, Sparkles } from 'lucide-react'

export function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, isConfigured } = useAuth()
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      showToast('Please fill in all required fields.', 'error')
      return
    }

    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password, name)
        showToast('Account created! Please check your email for confirmation.', 'success')
      } else {
        await signIn(email, password)
        showToast('Signed in successfully!', 'success')
      }
      onClose()
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isSignUp ? 'Create your BharatTrade Account' : 'Sign in to BharatTrade AI'}>
      {!isConfigured && (
        <div className="mb-4 rounded-xl border border-gold/20 bg-gold/5 p-3 text-xs text-gold">
          <strong>Demo Mode Active:</strong> Supabase environment variables (<code className="text-[11px] font-mono">VITE_SUPABASE_URL</code>) are not yet configured. The platform is currently operating in <strong>Local Storage Guest Mode</strong>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-muted" size={16} />
              <input
                type="text"
                className="field pl-10"
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-muted" size={16} />
            <input
              type="email"
              className="field pl-10"
              placeholder="trader@bharattrade.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-muted" size={16} />
            <input
              type="password"
              className="field pl-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isConfigured}
          className="btn btn-primary w-full mt-2"
        >
          {loading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in'}
        </button>

        <div className="pt-2 text-center text-xs text-muted">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-mint font-semibold hover:underline"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Need an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-mint font-semibold hover:underline"
              >
                Sign up free
              </button>
            </span>
          )}
        </div>
      </form>
    </Modal>
  )
}
