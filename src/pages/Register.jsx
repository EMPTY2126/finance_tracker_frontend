import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(userName, email, password)
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (err) {
      setError(err.message || 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
            <Leaf className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <p className="text-2xl font-bold text-ink">FinanceTracker</p>
          <p className="mt-1 text-sm text-muted">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-muted">Name</label>
            <input
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded-lg border border-border bg-app px-3 py-2 text-sm text-ink focus:border-brand focus:bg-surface"
              placeholder="Jordan Rivera"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-app px-3 py-2 text-sm text-ink focus:border-brand focus:bg-surface"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-5">
            <label className="mb-1 block text-xs font-medium text-muted">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-app px-3 py-2 text-sm text-ink focus:border-brand focus:bg-surface"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="mb-4 text-xs text-rose">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-bright disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand hover:text-brand-bright">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
