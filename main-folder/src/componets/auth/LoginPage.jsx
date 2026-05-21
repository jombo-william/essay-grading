


// src/components/auth/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../teacher/api.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [showPwd,  setShowPwd]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res  = await fetch('http://localhost:8000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Invalid email or password')
        return
      }

      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.csrf_token) {
        localStorage.setItem('csrf_token', data.csrf_token)
        sessionStorage.setItem('csrf_token', data.csrf_token)
      }

      if (data.session_token) {
        localStorage.setItem('session_token', data.session_token)
        setAuthToken(data.session_token)
      }

      navigate(data.user.role === 'teacher' ? '/teacher-dashboard' : '/dashboard')

    } catch {
      setError('Cannot reach server. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1628 0%, #1a2e5a 50%, #0f1d3a 100%)',
      fontFamily: "'DM Sans', sans-serif",
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13,
            background: '#1a2e5a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: 24, color: '#c9a227' }} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#0f1d3a', fontWeight: 700 }}>
            EssayGrade
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#9aa3b4' }}>
            University of Malawi
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: 8, padding: '10px 14px',
            fontSize: '0.83rem', color: '#dc2626', marginBottom: 18,
          }}>
            <i className="ti ti-alert-circle" aria-hidden="true" style={{ fontSize: 15, marginTop: 1, flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-mail" aria-hidden="true" style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 15, color: '#9aa3b4', pointerEvents: 'none',
              }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={{
                  width: '100%', padding: '10px 14px 10px 36px',
                  border: '1.5px solid #e2e8f0', borderRadius: 8,
                  fontSize: '0.92rem', color: '#0f1d3a',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 26 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-lock" aria-hidden="true" style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 15, color: '#9aa3b4', pointerEvents: 'none',
              }} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '10px 40px 10px 36px',
                  border: '1.5px solid #e2e8f0', borderRadius: 8,
                  fontSize: '0.92rem', color: '#0f1d3a',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(s => !s)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9aa3b4', display: 'flex', alignItems: 'center', padding: 4,
                }}
              >
                <i
                  className={`ti ${showPwd ? 'ti-eye-off' : 'ti-eye'}`}
                  aria-hidden="true"
                  style={{ fontSize: 16 }}
                />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? '#93a3c0' : '#1a2e5a',
              color: '#fff', fontSize: '0.92rem', fontWeight: 600,
              border: 'none', borderRadius: 9, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'inherit',
            }}
          >
            {loading ? (
              <>
                <i className="ti ti-loader-2" aria-hidden="true" style={{ fontSize: 15, animation: 'spin 1s linear infinite' }} />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 15 }} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#c5cad6', marginTop: 22 }}>
          Fourth Year Project — Group 30
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
