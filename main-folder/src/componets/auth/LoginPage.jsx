// src/componets/auth/LoginPage.jsx
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
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',  // Important for cookies
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          setError('Invalid email or password. Please check your credentials.')
        } else if (res.status === 500) {
          setError('Server error. Please try again later.')
        } else {
          setError(data.detail || 'Login failed. Please try again.')
        }
        return
      }

      // ✅ Handle both master (session_token) and promise (token) response structures
      const token = data.token || data.session_token
      if (token) {
        localStorage.setItem('token', token)
        sessionStorage.setItem('token', token)
      }

      // ✅ Save csrf_token for authenticated API calls
      if (data.csrf_token) {
        localStorage.setItem('csrf_token', data.csrf_token)
      }

      // ✅ Handle both flat and nested user response structures
      const user = data.user || {}
      const userData = {
        id:                  user.id   || data.user_id || data.id,
        name:                user.name || data.full_name || data.name,
        email:               user.email || data.email,
        role:                user.role  || data.role,
        registration_number: user.registration_number || data.registration_number,
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(userData))

      // ✅ Use userData.role for redirect (works for both response structures)
      if (userData.role === 'teacher') {
        navigate('/teacher-dashboard')
      } else {
        navigate('/dashboard')
      }

    } catch (err) {
      console.error('Login error:', err)
      setError('Cannot reach server. Make sure the backend is running on http://127.0.0.1:8000')
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

        {/* Test Credentials Hint */}
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16,
          fontSize: '0.75rem', color: '#15803d',
        }}>
          <strong>💡 Test Credentials:</strong><br />
          Student: test@example.com / password123<br />
          Teacher: teacher@example.com / teacher123
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