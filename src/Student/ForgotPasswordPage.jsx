// ForgotPasswordPage.jsx
import { useState } from 'react'

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [step, setStep] = useState(1) // 1: details form, 2: new password form
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [verifiedUser, setVerifiedUser] = useState(null)

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type })
    setTimeout(() => setAlert(null), 6000)
  }

  // Step 1: Verify user details
  const handleVerifyUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    try {
      const payload = {
        full_name: fullName,
        email: email,
        role: role,
        ...(role === 'student' ? { registration_number: registrationNumber } : { employee_number: employeeNumber })
      }

      const response = await fetch('http://localhost:8000/api/auth/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        showAlert(data.detail || 'User verification failed. Please check your details.')
        setLoading(false)
        return
      }

      setVerifiedUser(data)
      setStep(2)

    } catch (err) {
      showAlert('Cannot reach server. Make sure Python backend is running on port 8000.')
    }

    setLoading(false)
  }

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      showAlert('Passwords do not match!')
      return
    }

    if (newPassword.length < 6) {
      showAlert('Password must be at least 6 characters long!')
      return
    }

    setLoading(true)
    setAlert(null)

    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          new_password: newPassword,
          role: role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        showAlert(data.detail || 'Password reset failed. Please try again.')
        setLoading(false)
        return
      }

      showAlert('Password reset successful! Please login with your new password.', 'success')
      
      setTimeout(() => {
        onBackToLogin()
      }, 2000)

    } catch (err) {
      showAlert('Cannot reach server. Make sure Python backend is running on port 8000.')
    }

    setLoading(false)
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --navy: #1a2e5a; --navy-dark: #0f1d3a; --gold: #c9a227; --gold-light: #e8c547; --white: #ffffff; }
        @keyframes drift { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,30px) scale(1.08); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cardIn { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        
        @media (max-width: 860px) {
          .lp-left { display: none !important; }
          .lp-right { grid-column: span 2 !important; }
        }
        
        @media (max-width: 768px) {
          .lp-right { padding: 32px 20px !important; }
          .lp-right .reset-card { padding: 28px !important; margin: 0 auto !important; }
          .lp-right .reset-card h2 { font-size: 1.3rem !important; }
          .lp-right .reset-card p { font-size: 0.8rem !important; margin-bottom: 20px !important; }
          .lp-right .reset-card .card-logo { width: 56px !important; height: 56px !important; font-size: 1.3rem !important; }
          .lp-right .reset-card form .input-group { margin-bottom: 16px !important; }
          .lp-right .reset-card form label { font-size: 0.78rem !important; }
          .lp-right .reset-card form input, 
          .lp-right .reset-card form select { padding: 10px 12px !important; font-size: 0.85rem !important; }
          .lp-right .reset-card .submit-btn { padding: 12px !important; font-size: 0.88rem !important; }
          .lp-right .reset-card .radio-group { flex-direction: column !important; gap: 10px !important; }
        }
        
        @media (max-width: 480px) {
          .lp-right { padding: 24px 16px !important; }
          .lp-right .reset-card { padding: 24px 20px !important; border-radius: 20px !important; }
          .lp-right .reset-card .card-logo { width: 48px !important; height: 48px !important; font-size: 1.2rem !important; }
          .lp-right .reset-card h2 { font-size: 1.2rem !important; }
          .lp-right .reset-card p { font-size: 0.75rem !important; }
          .lp-right .reset-card .submit-btn { padding: 10px !important; font-size: 0.85rem !important; }
        }
      `}</style>

      {/* ANIMATED BACKGROUND */}
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'linear-gradient(135deg,#0a1628 0%,#1a2e5a 40%,#0f1d3a 100%)', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
        <div style={{ position:'absolute', top:0, right:0, width:'50%', height:'100%', background:'linear-gradient(135deg,transparent 49%,rgba(201,162,39,0.04) 50%,transparent 51%)' }} />
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', filter:'blur(60px)', background:'rgba(201,162,39,0.12)', top:-100, left:-100, animation:'drift 12s ease-in-out infinite alternate', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', filter:'blur(60px)', background:'rgba(26,46,90,0.5)', bottom:-80, right:-80, animation:'drift 15s ease-in-out infinite alternate', pointerEvents:'none' }} />
      </div>

      {/* PAGE LAYOUT */}
      <div style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>

        {/* LEFT PANEL */}
        <div className="lp-left" style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 64px', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:48 }}>
            <div style={{ position:'relative', width:64, height:64 }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(201,162,39,0.4)', animation:'spin 12s linear infinite' }} />
              <div style={{ position:'absolute', inset:6, background:'linear-gradient(135deg,#c9a227,#a07a18)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:700, color:'#0f1d3a' }}>U</div>
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', color:'#fff', fontWeight:700, lineHeight:1.2 }}>AI Essay Grading System</div>
              <div style={{ fontSize:'0.72rem', color:'#e8c547', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:2 }}>University of Malawi</div>
            </div>
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#fff', lineHeight:1.25, marginBottom:20 }}>
            Reset Your <em style={{ fontStyle:'normal', color:'#e8c547' }}>Password</em>
          </h1>
          <p style={{ fontSize:'0.95rem', color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:380, marginBottom:40 }}>
            Enter your details to verify your identity and create a new password.
          </p>

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
          <div className="reset-card" style={{ background:'rgba(255,255,255,0.97)', borderRadius:24, padding:'44px', width:'100%', maxWidth:480, boxShadow:'0 24px 80px rgba(0,0,0,0.35)', animation:'cardIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards' }}>

            <div className="card-logo" style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#1a2e5a,#0f1d3a)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:'#e8c547', fontWeight:700, boxShadow:'0 8px 24px rgba(26,46,90,0.3)' }}>U</div>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:'#0f1d3a', fontWeight:700, textAlign:'center', marginBottom:4 }}>
              {step === 1 ? 'Reset Password' : 'Create New Password'}
            </h2>
            <p style={{ textAlign:'center', fontSize:'0.85rem', color:'#8a95a8', marginBottom:24 }}>
              {step === 1 ? 'Verify your identity to reset your password' : 'Enter your new password below'}
            </p>

            {alert && (
              <div style={{ padding:'10px 14px', borderRadius:8, fontSize:'0.83rem', marginBottom:16, display:'flex', alignItems:'center', gap:8, background: alert.type==='error'?'#fef0f0':'#f0fdf4', border:`1px solid ${alert.type==='error'?'#fca5a5':'#86efac'}`, color: alert.type==='error'?'#dc2626':'#16a34a' }}>
                {alert.type === 'error' ? '⚠️' : '✓'} {alert.msg}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleVerifyUser}>
                <div className="input-group" style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7 }}>Full Name</label>
                  <input
                    type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                    placeholder="Enter your full name"
                    style={{ width:'100%', padding:'12px 14px', border:'1.5px solid #dde3ef', borderRadius:10, fontSize:'0.92rem', outline:'none' }}
                    onFocus={e => { e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}
                    onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7 }}>Email Address</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="Enter your registered email"
                    style={{ width:'100%', padding:'12px 14px', border:'1.5px solid #dde3ef', borderRadius:10, fontSize:'0.92rem', outline:'none' }}
                    onFocus={e => { e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}
                    onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7 }}>Role</label>
                  <div className="radio-group" style={{ display:'flex', gap:20 }}>
                    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                      <input type="radio" name="role" value="student" checked={role === 'student'} onChange={e => { setRole(e.target.value); setRegistrationNumber(''); setEmployeeNumber('') }} style={{ width:16, height:16 }} />
                      <span>Student</span>
                    </label>
                    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                      <input type="radio" name="role" value="teacher" checked={role === 'teacher'} onChange={e => { setRole(e.target.value); setRegistrationNumber(''); setEmployeeNumber('') }} style={{ width:16, height:16 }} />
                      <span>Teacher</span>
                    </label>
                  </div>
                </div>

                {role === 'student' && (
                  <div className="input-group" style={{ marginBottom:18 }}>
                    <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7 }}>Registration Number</label>
                    <input
                      type="text" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} required
                      placeholder="Enter your registration number (e.g., BED/COM/001/22)"
                      style={{ width:'100%', padding:'12px 14px', border:'1.5px solid #dde3ef', borderRadius:10, fontSize:'0.92rem', outline:'none' }}
                      onFocus={e => { e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}
                      onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                    />
                  </div>
                )}

                {role === 'teacher' && (
                  <div className="input-group" style={{ marginBottom:18 }}>
                    <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7 }}>Employee Number</label>
                    <input
                      type="text" value={employeeNumber} onChange={e => setEmployeeNumber(e.target.value)} required
                      placeholder="Enter your employee number"
                      style={{ width:'100%', padding:'12px 14px', border:'1.5px solid #dde3ef', borderRadius:10, fontSize:'0.92rem', outline:'none' }}
                      onFocus={e => { e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}
                      onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                    />
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{
                    width:'100%', padding:14,
                    background: loading ? 'linear-gradient(135deg,#3a4a6e,#2a3a5e)' : 'linear-gradient(135deg,#1a2e5a,#1e3a6e)',
                    color:'#fff', fontWeight:700, border:'none', borderRadius:12,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  }}>
                  {loading && <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />}
                  <span>{loading ? 'Verifying...' : 'Verify & Continue →'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="input-group" style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7 }}>New Password</label>
                  <div style={{ position:'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                      placeholder="Enter new password (min. 6 characters)"
                      style={{ width:'100%', padding:'12px 14px', border:'1.5px solid #dde3ef', borderRadius:10, fontSize:'0.92rem', outline:'none' }}
                      onFocus={e => { e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}
                      onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer' }}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom:24 }}>
                  <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7 }}>Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                    placeholder="Confirm your new password"
                    style={{ width:'100%', padding:'12px 14px', border:'1.5px solid #dde3ef', borderRadius:10, fontSize:'0.92rem', outline:'none' }}
                    onFocus={e => { e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}
                    onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                  />
                </div>

                <button type="submit" disabled={loading}
                  style={{
                    width:'100%', padding:14,
                    background: loading ? 'linear-gradient(135deg,#3a4a6e,#2a3a5e)' : 'linear-gradient(135deg,#1a2e5a,#1e3a6e)',
                    color:'#fff', fontWeight:700, border:'none', borderRadius:12,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  }}>
                  {loading && <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />}
                  <span>{loading ? 'Resetting...' : 'Reset Password →'}</span>
                </button>
              </form>
            )}

            <div className="divider" style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0', color:'#ccd1dc', fontSize:'0.78rem' }}>
              <div style={{ flex:1, height:1, background:'#e8edf4' }} /> or <div style={{ flex:1, height:1, background:'#e8edf4' }} />
            </div>

            <p style={{ textAlign:'center', fontSize:'0.85rem', color:'#8a95a8' }}>
              Remember your password?{' '}
              <button onClick={onBackToLogin} style={{ color:'#1a2e5a', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>Back to Login</button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}