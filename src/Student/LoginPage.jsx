import { useState } from 'react'

export default function LoginPage({ onSelect, onForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type })
    setTimeout(() => setAlert(null), 6000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        showAlert(data.detail || 'Invalid email or password')
        setLoading(false)
        return
      }

      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('token', data.token)

      onSelect(data.role, data)

    } catch (err) {
      showAlert('Cannot reach server. Make sure Python backend is running on port 8000.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --navy: #1a2e5a; --navy-dark: #0f1d3a; --gold: #c9a227; --gold-light: #e8c547; --white: #ffffff; }
        @keyframes drift   { from { transform: translate(0,0) scale(1); }  to { transform: translate(30px,30px) scale(1.08); } }
        @keyframes spin    { from { transform: rotate(0deg); }             to { transform: rotate(360deg); } }
        @keyframes cardIn  { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        
        @media (max-width: 1024px) {
          .lp-left { padding: 48px 40px !important; }
          .lp-left h1 { font-size: 2rem !important; }
          .lp-left p { font-size: 0.9rem !important; max-width: 320px !important; }
          .lp-left .feature-pills { gap: 10px !important; }
          .lp-left .feature-pills > div { gap: 10px !important; }
          .lp-left .feature-pills > div > div { width: 32px !important; height: 32px !important; font-size: 0.9rem !important; }
          .lp-left .feature-pills > div span { font-size: 0.82rem !important; }
          .lp-left .credit-badge { left: 40px !important; bottom: 24px !important; }
          .lp-right { padding: 40px 32px !important; }
          .lp-right .login-card { padding: 36px !important; max-width: 400px !important; }
        }
        
        @media (max-width: 860px) { 
          .lp-left { display: none !important; }
          .lp-right { grid-column: span 2 !important; }
        }
        
        @media (max-width: 768px) {
          .lp-right { padding: 32px 20px !important; }
          .lp-right .login-card { padding: 28px !important; margin: 0 auto !important; }
          .lp-right .login-card h2 { font-size: 1.3rem !important; }
          .lp-right .login-card p { font-size: 0.8rem !important; margin-bottom: 20px !important; }
          .lp-right .login-card .card-logo { width: 56px !important; height: 56px !important; font-size: 1.3rem !important; margin-bottom: 4px !important; }
          .lp-right .login-card .alert { padding: 8px 12px !important; font-size: 0.78rem !important; margin-bottom: 14px !important; gap: 6px !important; }
          .lp-right .login-card .info-tip { padding: 8px 12px !important; margin-bottom: 18px !important; gap: 6px !important; }
          .lp-right .login-card .info-tip span:first-child { font-size: 13px !important; }
          .lp-right .login-card .info-tip p { font-size: 11px !important; margin-bottom: 0 !important; }
          .lp-right .login-card form .input-group { margin-bottom: 16px !important; }
          .lp-right .login-card form label { font-size: 0.78rem !important; margin-bottom: 5px !important; }
          .lp-right .login-card form input { padding: 10px 12px 10px 38px !important; font-size: 0.85rem !important; }
          .lp-right .login-card form .input-icon { left: 12px !important; font-size: 0.9rem !important; }
          .lp-right .login-card form .password-toggle { right: 12px !important; font-size: 0.9rem !important; }
          .lp-right .login-card .remember-forgot { margin-bottom: 18px !important; }
          .lp-right .login-card .remember-forgot label { font-size: 0.78rem !important; gap: 6px !important; }
          .lp-right .login-card .remember-forgot a { font-size: 0.78rem !important; }
          .lp-right .login-card .submit-btn { padding: 12px !important; font-size: 0.88rem !important; }
          .lp-right .login-card .divider { margin: 18px 0 !important; font-size: 0.75rem !important; }
          .lp-right .login-card .register-text { font-size: 0.8rem !important; }
          .lp-right .login-card .security-badge { margin-top: 20px !important; padding-top: 16px !important; font-size: 0.68rem !important; }
        }
        
        @media (max-width: 480px) {
          .lp-right { padding: 24px 16px !important; }
          .lp-right .login-card { padding: 24px 20px !important; border-radius: 20px !important; }
          .lp-right .login-card .card-logo { width: 48px !important; height: 48px !important; font-size: 1.2rem !important; }
          .lp-right .login-card h2 { font-size: 1.2rem !important; }
          .lp-right .login-card p { font-size: 0.75rem !important; margin-bottom: 18px !important; }
          .lp-right .login-card .alert { padding: 7px 10px !important; font-size: 0.75rem !important; }
          .lp-right .login-card .info-tip { padding: 7px 10px !important; }
          .lp-right .login-card .info-tip p { font-size: 10px !important; }
          .lp-right .login-card form .input-group { margin-bottom: 14px !important; }
          .lp-right .login-card form label { font-size: 0.75rem !important; margin-bottom: 4px !important; }
          .lp-right .login-card form input { padding: 9px 10px 9px 36px !important; font-size: 0.82rem !important; }
          .lp-right .login-card form .input-icon { left: 10px !important; font-size: 0.85rem !important; }
          .lp-right .login-card form .password-toggle { right: 10px !important; }
          .lp-right .login-card .submit-btn { padding: 10px !important; font-size: 0.85rem !important; }
          .lp-right .login-card .security-badge { gap: 4px !important; }
        }
        
        @media (max-width: 380px) {
          .lp-right { padding: 20px 12px !important; }
          .lp-right .login-card { padding: 20px 16px !important; }
          .lp-right .login-card .card-logo { width: 44px !important; height: 44px !important; font-size: 1.1rem !important; }
          .lp-right .login-card h2 { font-size: 1.1rem !important; }
          .lp-right .login-card .info-tip p { font-size: 9px !important; }
          .lp-right .login-card form input { padding: 8px 8px 8px 34px !important; font-size: 0.8rem !important; }
          .lp-right .login-card .submit-btn { padding: 9px !important; font-size: 0.82rem !important; }
          .lp-right .login-card .register-text { font-size: 0.75rem !important; }
        }
        
        @media (hover: none) and (pointer: coarse) {
          button, input, a, .password-toggle {
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
          .submit-btn:active { transform: scale(0.98); }
        }
      `}</style>

      {/* ANIMATED BACKGROUND */}
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'linear-gradient(135deg,#0a1628 0%,#1a2e5a 40%,#0f1d3a 100%)', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
        <div style={{ position:'absolute', top:0, right:0, width:'50%', height:'100%', background:'linear-gradient(135deg,transparent 49%,rgba(201,162,39,0.04) 50%,transparent 51%)' }} />
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', filter:'blur(60px)', background:'rgba(201,162,39,0.12)', top:-100, left:-100, animation:'drift 12s ease-in-out infinite alternate', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', filter:'blur(60px)', background:'rgba(26,46,90,0.5)', bottom:-80, right:-80, animation:'drift 15s ease-in-out infinite alternate', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:250, height:250, borderRadius:'50%', filter:'blur(60px)', background:'rgba(201,162,39,0.07)', top:'50%', right:'20%', animation:'drift 9s ease-in-out infinite alternate', pointerEvents:'none' }} />
      </div>

      {/* PAGE LAYOUT */}
      <div style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>

        {/* LEFT PANEL */}
        <div className="lp-left" style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 64px', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:48, textDecoration:'none' }}>
            <div style={{ position:'relative', width:64, height:64 }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(201,162,39,0.4)', animation:'spin 12s linear infinite' }} />
              <div style={{ position:'absolute', inset:6, background:'linear-gradient(135deg,#c9a227,#a07a18)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:700, color:'#0f1d3a' }}>U</div>
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', color:'#fff', fontWeight:700, lineHeight:1.2 }}>AI Essay Grading System</div>
              <div style={{ fontSize:'0.72rem', color:'#e8c547', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:2 }}>University of Malawi</div>
            </div>
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.4rem', color:'#fff', lineHeight:1.25, marginBottom:20 }}>
            Welcome to <em style={{ fontStyle:'normal', color:'#e8c547' }}>Smarter</em> Essay Grading
          </h1>
          <p style={{ fontSize:'0.95rem', color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:380, marginBottom:40 }}>
            Sign in with your email and password. The system automatically detects whether you are a student or a teacher and takes you to the right place.
          </p>

          <div className="feature-pills" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { icon:'🔍', text: 'Auto-detects your role from the database' },
              { icon:'⚡', text: <span>Essays graded in under <strong>2 minutes</strong></span> },
              { icon:'🎯', text: <span><strong>85%+ accuracy</strong> vs human grading</span> },
              { icon:'🇲🇼', text: <span>Aligned with <strong>MSCE curriculum</strong> standards</span> },
            ].map((p, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, color:'rgba(255,255,255,0.75)', fontSize:'0.88rem' }}>
                <div style={{ width:36, height:36, background:'rgba(201,162,39,0.12)', border:'1px solid rgba(201,162,39,0.25)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{p.icon}</div>
                <span>{p.text}</span>
              </div>
            ))}
          </div>

          <div className="credit-badge" style={{ position:'absolute', bottom:32, left:64, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem' }}>🏛️</div>
            <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', lineHeight:1.4 }}>
              <strong style={{ color:'rgba(255,255,255,0.65)' }}>University of Malawi</strong><br />
              Fourth Year Project — BED/COM 2021–2022
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lp-right" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 48px' }}>
          <div className="login-card" style={{ background:'rgba(255,255,255,0.97)', borderRadius:24, padding:'44px', width:'100%', maxWidth:440, boxShadow:'0 24px 80px rgba(0,0,0,0.35)', animation:'cardIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards' }}>

            <div className="card-logo" style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#1a2e5a,#0f1d3a)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:'#e8c547', fontWeight:700, boxShadow:'0 8px 24px rgba(26,46,90,0.3)' }}>U</div>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:'#0f1d3a', fontWeight:700, textAlign:'center', marginBottom:4 }}>Sign In to Portal</h2>
            <p style={{ textAlign:'center', fontSize:'0.85rem', color:'#8a95a8', marginBottom:24 }}>
              Your role is detected automatically
            </p>

            {alert && (
              <div className="alert" style={{ padding:'10px 14px', borderRadius:8, fontSize:'0.83rem', marginBottom:16, display:'flex', alignItems:'center', gap:8, background: alert.type==='error'?'#fef0f0':'#f0fdf4', border:`1px solid ${alert.type==='error'?'#fca5a5':'#86efac'}`, color: alert.type==='error'?'#dc2626':'#16a34a' }}>
                ⚠️ {alert.msg}
              </div>
            )}

            <div className="info-tip" style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, padding:'10px 14px', marginBottom:20, display:'flex', gap:8, alignItems:'flex-start' }}>
              <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>💡</span>
              <p style={{ fontSize:12, color:'#92400e', margin:0, lineHeight:1.6 }}>
                No need to select your role. Just enter your email and password — the system will detect whether you are a <strong>student</strong> or <strong>teacher</strong> automatically.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group" style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7, letterSpacing:'0.02em' }}>
                  Email Address
                </label>
                <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
                  <span className="input-icon" style={{ position:'absolute', left:14, color:'#aab3c6', fontSize:'1rem', pointerEvents:'none' }}>✉️</span>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="Enter your email address"
                    disabled={loading}
                    style={{ width:'100%', padding:'12px 14px 12px 42px', border:'1.5px solid #dde3ef', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:'0.92rem', color:'#0f1d3a', background: loading?'#f8fafc':'#fafbfd', outline:'none', transition:'all 0.2s' }}
                    onFocus={e => { if(!loading){ e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}}
                    onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7, letterSpacing:'0.02em' }}>
                  Password
                </label>
                <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
                  <span className="input-icon" style={{ position:'absolute', left:14, color:'#aab3c6', fontSize:'1rem', pointerEvents:'none' }}>🔒</span>
                  <input
                    type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Enter your password"
                    disabled={loading}
                    style={{ width:'100%', padding:'12px 42px 12px 42px', border:'1.5px solid #dde3ef', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:'0.92rem', color:'#0f1d3a', background: loading?'#f8fafc':'#fafbfd', outline:'none', transition:'all 0.2s' }}
                    onFocus={e => { if(!loading){ e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}}
                    onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPwd(s => !s)}
                    style={{ position:'absolute', right:14, background:'none', border:'none', cursor:'pointer', color:'#aab3c6', fontSize:'0.95rem', padding:4 }}>
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="remember-forgot" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'#6b7a99', cursor:'pointer' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    style={{ width:16, height:16, accentColor:'#1a2e5a', cursor:'pointer' }} />
                  Remember me
                </label>
                <button 
                  type="button"
                  onClick={onForgotPassword}
                  style={{ fontSize:'0.82rem', color:'#1a2e5a', textDecoration:'none', fontWeight:500, background:'none', border:'none', cursor:'pointer' }}
                >
                  Forgot password?
                </button>
              </div>

              <button className="submit-btn" type="submit" disabled={loading}
                style={{
                  width:'100%', padding:14,
                  background: loading ? 'linear-gradient(135deg,#3a4a6e,#2a3a5e)' : 'linear-gradient(135deg,#1a2e5a,#1e3a6e)',
                  color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', fontWeight:700,
                  border:'none', borderRadius:12,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  boxShadow:'0 6px 20px rgba(26,46,90,0.3)', transition:'all 0.4s',
                }}>
                {loading && (
                  <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                )}
                <span>{loading ? 'Signing in...' : 'Sign In →'}</span>
              </button>
            </form>

            <div className="divider" style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0', color:'#ccd1dc', fontSize:'0.78rem' }}>
              <div style={{ flex:1, height:1, background:'#e8edf4' }} /> or <div style={{ flex:1, height:1, background:'#e8edf4' }} />
            </div>

            <p className="register-text" style={{ textAlign:'center', fontSize:'0.85rem', color:'#8a95a8' }}>
              Don't have an account?{' '}
              <a href="#" style={{ color:'#1a2e5a', fontWeight:600, textDecoration:'none' }}>Register here</a>
            </p>

            <div className="security-badge" style={{ marginTop:24, paddingTop:20, borderTop:'1px solid #eef0f5', display:'flex', justifyContent:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.72rem', color:'#b0b9cc' }}>
                <span style={{ color:'#28a745' }}>🔒</span> Secured with SSL — University of Malawi Portal
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}