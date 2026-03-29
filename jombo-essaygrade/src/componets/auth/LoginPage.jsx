// // src/componets/auth/LoginPage.jsx
// import { useState, useEffect, useRef } from "react";

// const API_BASE = "https://jombo-essaygrade.fly.dev/api";  

// export default function LoginPage({ onSelect }) {
//   const [email, setEmail]       = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError]       = useState("");
//   const [loading, setLoading]   = useState(false);
//   const [shake, setShake]       = useState(false);
//   const emailRef = useRef(null);

//   useEffect(() => { emailRef.current?.focus(); }, []);

//   const triggerShake = () => {
//     setShake(true);
//     setTimeout(() => setShake(false), 600);
//   };

//   const handleLogin = async () => {
//     setError("");
//     if (!email || !password) {
//       setError("Please fill in both fields.");
//       triggerShake();
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/auth/login`, {   
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: email.trim(), password }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         // Store csrf_token for use in API calls
//         sessionStorage.setItem("csrf_token", data.csrf_token);
//         sessionStorage.setItem("user", JSON.stringify(data.user));
//         onSelect(data.user.role, data.user);
//       } else {
//         setError(data.message || "Invalid email or password.");
//         triggerShake();
//         setLoading(false);
//       }
//     } catch {
//       setError("Cannot reach server. Make sure Python backend is running on port 8080.");
//       triggerShake();
//       setLoading(false);
//     }
//   };

//   const fillDemo = (role) => {
//     setEmail(role === "teacher" ? "william.jombo@essaygrade.com" : "alice.mwale@student.edu");
//     setPassword("password");
//     setError("");
//   };
  
//   const onKey = (e) => { if (e.key === "Enter") handleLogin(); };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #e0f0ff 0%, #f8fbff 50%, #e8f4ff 100%)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "40px 20px",
//         fontFamily: "'Segoe UI', system-ui, sans-serif",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Background blobs */}
//       <div style={{ position:"absolute", top:"-80px", left:"-80px", width:"400px", height:"400px", borderRadius:"50%", background:"rgba(99,179,237,0.15)", filter:"blur(60px)", pointerEvents:"none" }} />
//       <div style={{ position:"absolute", bottom:"-80px", right:"-80px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(147,197,253,0.2)", filter:"blur(60px)", pointerEvents:"none" }} />

//       <style>{`
//         @keyframes shake {
//           0%,100% { transform: translateX(0); }
//           15% { transform: translateX(-8px); }
//           30% { transform: translateX(8px); }
//           45% { transform: translateX(-5px); }
//           60% { transform: translateX(5px); }
//           75% { transform: translateX(-3px); }
//           90% { transform: translateX(3px); }
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .login-input {
//           width: 100%;
//           padding: 13px 16px;
//           border: 1.5px solid #dbeafe;
//           border-radius: 12px;
//           font-size: 14px;
//           color: #1e3a5f;
//           background: #f0f7ff;
//           outline: none;
//           box-sizing: border-box;
//           transition: border-color 0.2s, box-shadow 0.2s;
//           font-family: inherit;
//         }
//         .login-input:focus {
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
//           background: #fff;
//         }
//         .login-input::placeholder { color: #93c5fd; }
//         .login-btn {
//           width: 100%;
//           padding: 14px;
//           border: none;
//           border-radius: 12px;
//           background: linear-gradient(135deg, #3b82f6, #38bdf8);
//           color: white;
//           font-size: 15px;
//           font-weight: 600;
//           cursor: pointer;
//           box-shadow: 0 4px 20px rgba(59,130,246,0.35);
//           transition: all 0.2s;
//           font-family: inherit;
//           letter-spacing: 0.02em;
//         }
//         .login-btn:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 24px rgba(59,130,246,0.45);
//         }
//         .login-btn:active:not(:disabled) { transform: translateY(0); }
//         .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
//         .demo-card {
//           flex: 1;
//           padding: 14px 16px;
//           border-radius: 12px;
//           border: 1.5px solid #dbeafe;
//           background: #f0f7ff;
//           cursor: pointer;
//           text-align: left;
//           transition: all 0.2s;
//           font-family: inherit;
//         }
//         .demo-card:hover { border-color: #3b82f6; background: #eff6ff; transform: translateY(-1px); }
//         .spinner {
//           width: 16px; height: 16px;
//           border: 2px solid rgba(255,255,255,0.4);
//           border-top-color: white;
//           border-radius: 50%;
//           animation: spin 0.65s linear infinite;
//           display: inline-block;
//           vertical-align: middle;
//           margin-right: 6px;
//         }
//       `}</style>

//       {/* Card */}
//       <div
//         style={{
//           background: "white",
//           borderRadius: "24px",
//           boxShadow: "0 12px 60px rgba(59,130,246,0.12), 0 2px 16px rgba(0,0,0,0.06)",
//           border: "1px solid #e0f0ff",
//           padding: "48px 44px",
//           width: "100%",
//           maxWidth: "460px",
//           position: "relative",
//           zIndex: 1,
//           animation: shake ? "shake 0.5s ease-in-out" : "none",
//         }}
//       >
//         {/* Brand */}
//         <div style={{ textAlign: "center", marginBottom: "40px" }}>
//           <div style={{
//             width: "72px", height: "72px",
//             background: "linear-gradient(135deg, #3b82f6, #38bdf8)",
//             borderRadius: "20px",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: "34px",
//             margin: "0 auto 20px",
//             boxShadow: "0 8px 28px rgba(59,130,246,0.3)",
//           }}>✍️</div>
//           <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1e3a5f", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
//             EssayGrade AI
//           </h1>
//           <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
//             Sign in to your portal
//           </p>
//         </div>

//         {/* Email field */}
//         <div style={{ marginBottom: "20px" }}>
//           <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
//             Email Address
//           </label>
//           <input
//             ref={emailRef}
//             type="email"
//             placeholder="you@essaygrade.com"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             onKeyDown={onKey}
//             autoComplete="email"
//             className="login-input"
//           />
//         </div>

//         {/* Password field */}
//         <div style={{ marginBottom: "24px" }}>
//           <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
//             Password
//           </label>
//           <div style={{ position: "relative" }}>
//             <input
//               type={showPass ? "text" : "password"}
//               placeholder="Enter your password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               onKeyDown={onKey}
//               autoComplete="current-password"
//               className="login-input"
//               style={{ paddingRight: "48px" }}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPass(v => !v)}
//               style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#93c5fd", padding: 0, lineHeight: 1 }}
//             >
//               {showPass ? "🙈" : "👁️"}
//             </button>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
//             <span style={{ fontSize: "15px", lineHeight: 1.4 }}>⚠️</span>
//             <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: "600", margin: 0, lineHeight: 1.5 }}>{error}</p>
//           </div>
//         )}

//         {/* Sign in button */}
//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="login-btn"
//           style={{ marginBottom: "28px" }}
//         >
//           {loading ? <><span className="spinner" />Signing in…</> : "Sign In →"}
//         </button>

//         {/* Divider */}
//         <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
//           <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
//           <span style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: "500", whiteSpace: "nowrap" }}>Quick demo access</span>
//           <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
//         </div>

//         {/* Demo cards */}
//         <div style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
//           <button className="demo-card" onClick={() => fillDemo("teacher")}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
//               <span style={{ fontSize: "20px" }}>👨‍🏫</span>
//               <span style={{ fontSize: "13px", fontWeight: "700", color: "#3b82f6" }}>Teacher</span>
//             </div>
//             <p style={{ fontSize: "13px", fontWeight: "600", color: "#1e3a5f", margin: "0 0 3px" }}>Mr. William Jombo</p>
//             <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>william.jombo@essaygrade.com</p>
//           </button>

//           <button className="demo-card" onClick={() => fillDemo("student")}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
//               <span style={{ fontSize: "20px" }}>🎓</span>
//               <span style={{ fontSize: "13px", fontWeight: "700", color: "#0ea5e9" }}>Student</span>
//             </div>
//             <p style={{ fontSize: "13px", fontWeight: "600", color: "#1e3a5f", margin: "0 0 3px" }}>Alice Mwale</p>
//             <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>alice.mwale@student.edu</p>
//           </button>
//         </div>

//         <p style={{ textAlign: "center", fontSize: "12px", color: "#cbd5e1", margin: 0 }}>
//           Demo password: <span style={{ fontWeight: "700", color: "#94a3b8" }}>password</span>
//         </p>
//       </div>

//       <p style={{ position: "absolute", bottom: "20px", fontSize: "12px", color: "#94a3b8" }}>
//         Final Year Project by group 30· EssayGrade AI
//       </p>
//     </div>
//   );
// }



// src/componets/auth/LoginPage.jsx


import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [remember, setRemember]       = useState(false)
  const [showPwd, setShowPwd]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const [alert, setAlert]             = useState(null)
  const [detectedRole, setDetectedRole] = useState(null) // 'student' | 'teacher' | null

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type })
    setTimeout(() => setAlert(null), 6000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)
    setDetectedRole(null)

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

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('token', data.token)

      setDetectedRole(data.role)

      // Redirect based on role detected from database
      setTimeout(() => {
        navigate(data.role === 'teacher' ? '/teacher-dashboard' : '/dashboard')
      }, 900)

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
        @keyframes drift   { from { transform: translate(0,0) scale(1); }  to { transform: translate(30px,30px) scale(1.08); } }
        @keyframes spin    { from { transform: rotate(0deg); }             to { transform: rotate(360deg); } }
        @keyframes cardIn  { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes reveal  { from { opacity:0; transform:scale(0.85) translateY(-6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @media (max-width: 860px) { .lp-left { display: none !important; } }
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

        {/* ── LEFT PANEL ── */}
        <div className="lp-left" style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 64px', position:'relative' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:16, marginBottom:48, textDecoration:'none' }}>
            <div style={{ position:'relative', width:64, height:64 }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(201,162,39,0.4)', animation:'spin 12s linear infinite' }} />
              <div style={{ position:'absolute', inset:6, background:'linear-gradient(135deg,#c9a227,#a07a18)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:700, color:'#0f1d3a' }}>U</div>
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', color:'#fff', fontWeight:700, lineHeight:1.2 }}>AI Essay Grading System</div>
              <div style={{ fontSize:'0.72rem', color:'#e8c547', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:2 }}>University of Malawi</div>
            </div>
          </Link>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.4rem', color:'#fff', lineHeight:1.25, marginBottom:20 }}>
            Welcome to <em style={{ fontStyle:'normal', color:'#e8c547' }}>Smarter</em> Essay Grading
          </h1>
          <p style={{ fontSize:'0.95rem', color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:380, marginBottom:40 }}>
            Sign in with your email and password. The system automatically detects whether you are a student or a teacher and takes you to the right place.
          </p>

          {/* Feature pills */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
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

          {/* UNIMA credit */}
          <div style={{ position:'absolute', bottom:32, left:64, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem' }}>🏛️</div>
            <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', lineHeight:1.4 }}>
              <strong style={{ color:'rgba(255,255,255,0.65)' }}>University of Malawi</strong><br />
              Fourth Year Project — BED/COM 2021–2022
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (card) ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 48px' }}>
          <div style={{ background:'rgba(255,255,255,0.97)', borderRadius:24, padding:'44px', width:'100%', maxWidth:440, boxShadow:'0 24px 80px rgba(0,0,0,0.35)', animation:'cardIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards' }}>

            {/* Card logo */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#1a2e5a,#0f1d3a)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:'#e8c547', fontWeight:700, boxShadow:'0 8px 24px rgba(26,46,90,0.3)' }}>U</div>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:'#0f1d3a', fontWeight:700, textAlign:'center', marginBottom:4 }}>Sign In to Portal</h2>
            <p style={{ textAlign:'center', fontSize:'0.85rem', color:'#8a95a8', marginBottom:24 }}>
              Your role is detected automatically
            </p>

            {/* Role detected success banner */}
            {detectedRole && (
              <div style={{ background: detectedRole==='student'?'#f0fdf4':'#eff6ff', border:`1px solid ${detectedRole==='student'?'#86efac':'#bfdbfe'}`, borderRadius:12, padding:'14px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:12, animation:'reveal 0.4s ease' }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background: detectedRole==='student'?'#dcfce7':'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {detectedRole === 'student' ? '🧑‍🎓' : '👩‍🏫'}
                </div>
                <div>
                  <p style={{ fontWeight:800, fontSize:13, color: detectedRole==='student'?'#15803d':'#1d4ed8', margin:'0 0 2px' }}>
                    {detectedRole === 'student' ? 'Student account detected!' : 'Teacher account detected!'}
                  </p>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Redirecting you to your dashboard...</p>
                </div>
              </div>
            )}

            {/* Error / info alert */}
            {alert && (
              <div style={{ padding:'10px 14px', borderRadius:8, fontSize:'0.83rem', marginBottom:16, display:'flex', alignItems:'center', gap:8, background: alert.type==='error'?'#fef0f0':'#f0fdf4', border:`1px solid ${alert.type==='error'?'#fca5a5':'#86efac'}`, color: alert.type==='error'?'#dc2626':'#16a34a' }}>
                ⚠️ {alert.msg}
              </div>
            )}

            {/* Info tip */}
            {!detectedRole && (
              <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, padding:'10px 14px', marginBottom:20, display:'flex', gap:8, alignItems:'flex-start' }}>
                <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>💡</span>
                <p style={{ fontSize:12, color:'#92400e', margin:0, lineHeight:1.6 }}>
                  No need to select your role. Just enter your email and password — the system will detect whether you are a <strong>student</strong> or <strong>teacher</strong> automatically.
                </p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7, letterSpacing:'0.02em' }}>
                  Email Address
                </label>
                <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
                  <span style={{ position:'absolute', left:14, color:'#aab3c6', fontSize:'1rem', pointerEvents:'none' }}>✉️</span>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="Enter your email address"
                    disabled={!!detectedRole}
                    style={{ width:'100%', padding:'12px 14px 12px 42px', border:'1.5px solid #dde3ef', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:'0.92rem', color:'#0f1d3a', background: detectedRole?'#f8fafc':'#fafbfd', outline:'none', transition:'all 0.2s' }}
                    onFocus={e => { if(!detectedRole){ e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}}
                    onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#1a2e5a', marginBottom:7, letterSpacing:'0.02em' }}>
                  Password
                </label>
                <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
                  <span style={{ position:'absolute', left:14, color:'#aab3c6', fontSize:'1rem', pointerEvents:'none' }}>🔒</span>
                  <input
                    type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Enter your password"
                    disabled={!!detectedRole}
                    style={{ width:'100%', padding:'12px 42px 12px 42px', border:'1.5px solid #dde3ef', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:'0.92rem', color:'#0f1d3a', background: detectedRole?'#f8fafc':'#fafbfd', outline:'none', transition:'all 0.2s' }}
                    onFocus={e => { if(!detectedRole){ e.target.style.borderColor='#1a2e5a'; e.target.style.boxShadow='0 0 0 3px rgba(26,46,90,0.08)' }}}
                    onBlur={e => { e.target.style.borderColor='#dde3ef'; e.target.style.boxShadow='none' }}
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)}
                    style={{ position:'absolute', right:14, background:'none', border:'none', cursor:'pointer', color:'#aab3c6', fontSize:'0.95rem', padding:4 }}>
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'#6b7a99', cursor:'pointer' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    style={{ width:16, height:16, accentColor:'#1a2e5a', cursor:'pointer' }} />
                  Remember me
                </label>
                <a href="#" style={{ fontSize:'0.82rem', color:'#1a2e5a', textDecoration:'none', fontWeight:500 }}>Forgot password?</a>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading || !!detectedRole}
                style={{
                  width:'100%', padding:14,
                  background: detectedRole
                    ? (detectedRole==='student' ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#1d4ed8,#1e40af)')
                    : 'linear-gradient(135deg,#1a2e5a,#1e3a6e)',
                  color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', fontWeight:700,
                  border:'none', borderRadius:12,
                  cursor: (loading || !!detectedRole) ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  boxShadow:'0 6px 20px rgba(26,46,90,0.3)', transition:'all 0.4s',
                }}>
                {loading && !detectedRole && (
                  <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                )}
                <span>
                  {detectedRole === 'student'
                    ? '🧑‍🎓 Redirecting to Student Dashboard...'
                    : detectedRole === 'teacher'
                    ? '👩‍🏫 Redirecting to Teacher Dashboard...'
                    : loading
                    ? 'Detecting your account...'
                    : 'Sign In →'}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0', color:'#ccd1dc', fontSize:'0.78rem' }}>
              <div style={{ flex:1, height:1, background:'#e8edf4' }} /> or <div style={{ flex:1, height:1, background:'#e8edf4' }} />
            </div>

            <p style={{ textAlign:'center', fontSize:'0.85rem', color:'#8a95a8' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'#1a2e5a', fontWeight:600, textDecoration:'none' }}>Register here</Link>
            </p>

            <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid #eef0f5', display:'flex', justifyContent:'center' }}>
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


export default function LoginPage({ onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", gap: "24px", fontFamily: "system-ui, sans-serif" }}>
      
      <p style={{ fontSize: "18px", fontWeight: "600", color: "#64748b", textAlign: "center" }}>
        Will be done by Taona Nyasulu
      </p>

      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={() => onSelect('teacher', { name: 'William Jombo' })}
          style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #3b82f6, #38bdf8)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
        >
          👨‍🏫 Teacher
        </button>

        <button
          onClick={() => onSelect('student', { name: 'Alice Mwale' })}
          style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #10b981, #34d399)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
        >
          🎓 Student
        </button>
      </div>

    </div>
  );
}