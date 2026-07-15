import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      login(data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'white', borderRadius: '1.5rem',
          padding: '2.5rem', width: '100%', maxWidth: '400px',
          boxShadow: '0 8px 40px rgba(16,185,129,0.12)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🦷</div>
          <h1 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: '1.5rem', color: '#111827' }}>
            PureSmile <span style={{ color: '#10B981' }}>Admin</span>
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 500, fontSize: '0.875rem', color: '#374151', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                border: error ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                fontSize: '0.9rem', color: '#111827', outline: 'none', fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#10B981'}
              onBlur={e => e.target.style.borderColor = error ? '#EF4444' : '#E5E7EB'}
            />
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.5rem', padding: '0.75rem', color: '#DC2626', fontSize: '0.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-mint" style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, marginTop: '0.25rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          Default password: <code style={{ backgroundColor: '#F3F4F6', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>admin123</code>
        </p>
      </motion.div>
    </div>
  )
}
