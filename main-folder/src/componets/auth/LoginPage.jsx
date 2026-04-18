import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [showPwd, setShowPwd]   = useState(false)

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

      localStorage.setItem('user',          JSON.stringify(data.user))
      localStorage.setItem('token',         data.csrf_token)
      localStorage.setItem('session_token', data.session_token)
      sessionStorage.setItem('csrf_token',    data.csrf_token)
      sessionStorage.setItem('session_token', data.session_token)

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
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a2e5a, #0f1d3a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', color: '#e8c547', fontWeight: 700,
            margin: '0 auto 12px',
          }}>U</div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f1d3a', fontWeight: 700 }}>
            AI Essay Grading
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>
            University of Malawi
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: 8, padding: '10px 14px',
            fontSize: '0.83rem', color: '#dc2626', marginBottom: 16,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a2e5a', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                width: '100%', padding: '11px 14px', border: '1.5px solid #dde3ef',
                borderRadius: 8, fontSize: '0.92rem', color: '#0f1d3a',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a2e5a', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #dde3ef',
                  borderRadius: 8, fontSize: '0.92rem', color: '#0f1d3a',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(s => !s)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#aab3c6',
                }}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#93a3c0' : 'linear-gradient(135deg, #1a2e5a, #1e3a6e)',
              color: '#fff', fontSize: '0.95rem', fontWeight: 700,
              border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#bbb', marginTop: 20 }}>
          Fourth Year Project — GROUP 30
        </p>
      </div>
    </div>
  )
}