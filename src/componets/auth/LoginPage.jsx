// src/componets/auth/LoginPage.jsx
import { useState } from 'react';

const API_BASE = 'http://localhost:8000/api/auth';

export default function LoginPage({ onSelect }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onSelect(data.role, data.user);
      } else {
        setError(data.detail || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Cannot reach server. Make sure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f0ff 0%, #f8fbff 50%, #e8f4ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 12px 60px rgba(59,130,246,0.12)',
        border: '1px solid #e0f0ff',
        padding: '48px 44px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #3b82f6, #38bdf8)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '34px',
            margin: '0 auto 20px',
            boxShadow: '0 8px 28px rgba(59,130,246,0.3)',
          }}>✍️</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e3a5f', margin: '0 0 8px' }}>
            EssayGrade AI
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Sign in to your portal
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@essaygrade.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '13px 16px',
              border: '1.5px solid #dbeafe',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#1e3a5f',
              background: '#f0f7ff',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '13px 16px',
              border: '1.5px solid #dbeafe',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#1e3a5f',
              background: '#f0f7ff',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: '15px' }}>⚠️</span>
            <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6, #38bdf8)',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
            Demo: student@test.com / password
          </p>
        </div>
      </div>
    </div>
  );
}