// C:\PROJECTS\Essay-Grader\src\Student\landingPage.jsx
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const timerRef = useRef(null)
  const progressRef = useRef(null)
  const startRef = useRef(null)
  const DURATION = 5000
  const total = 3

  const goToSlide = (n) => {
    setCurrent(n)
  }
  const nextSlide = () => setCurrent(c => (c + 1) % total)
  const prevSlide = () => setCurrent(c => (c - 1 + total) % total)

  useEffect(() => {
    clearInterval(progressRef.current)
    clearTimeout(timerRef.current)
    setProgress(0)
    startRef.current = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setProgress(Math.min((elapsed / DURATION) * 100, 100))
    }, 50)
    timerRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % total)
    }, DURATION)
    return () => {
      clearInterval(progressRef.current)
      clearTimeout(timerRef.current)
    }
  }, [current])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const touchXRef = useRef(0)

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #1a2e5a; --navy-dark: #0f1d3a; --gold: #c9a227;
          --gold-light: #e8c547; --white: #ffffff; --light-bg: #f5f7fb;
          --text-muted: #6b7a99;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; color: var(--navy-dark); background: var(--white); overflow-x: hidden; }
        .topbar { background: var(--navy-dark); color: rgba(255,255,255,0.75); font-size: 0.78rem; padding: 6px 0; display: flex; justify-content: center; gap: 24px; letter-spacing: 0.03em; }
        .topbar a { color: rgba(255,255,255,0.75); text-decoration: none; }
        .topbar a:hover { color: var(--gold-light); }
        nav { background: var(--navy); position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 16px rgba(0,0,0,0.18); }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 68px; }
        .nav-brand { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .nav-logo { width: 46px; height: 46px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--navy-dark); flex-shrink: 0; }
        .nav-brand-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--white); line-height: 1.2; font-weight: 700; }
        .nav-brand-sub { font-size: 0.68rem; color: var(--gold-light); letter-spacing: 0.08em; text-transform: uppercase; }
        .nav-links { display: flex; align-items: center; gap: 8px; list-style: none; }
        .nav-links a { color: rgba(255,255,255,0.82); text-decoration: none; font-size: 0.88rem; font-weight: 500; padding: 8px 14px; border-radius: 6px; transition: all 0.2s; }
        .nav-links a:hover { color: var(--white); background: rgba(255,255,255,0.1); }
        .nav-links .btn-nav { background: var(--gold); color: var(--navy-dark); font-weight: 600; border-radius: 8px; padding: 8px 20px; }
        .nav-links .btn-nav:hover { background: var(--gold-light); }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; background: none; border: none; }
        .hamburger span { width: 24px; height: 2px; background: white; border-radius: 2px; display: block; transition: 0.3s; }
        .hero { position: relative; height: 92vh; min-height: 580px; overflow: hidden; background: var(--navy-dark); }
        .slides-wrapper { display: flex; height: 100%; transition: transform 0.9s cubic-bezier(0.77,0,0.175,1); }
        .slide { min-width: 100%; height: 100%; position: relative; display: flex; align-items: center; overflow: hidden; }
        .slide-1 { background: linear-gradient(135deg, #0f1d3a 0%, #1a3a6b 50%, #0e2a52 100%); }
        .slide-2 { background: linear-gradient(135deg, #1a2e10 0%, #2d5a1a 50%, #1f3d0e 100%); }
        .slide-3 { background: linear-gradient(135deg, #3a1a0f 0%, #6b2d1a 50%, #4a1a0a 100%); }
        .geo-shape { position: absolute; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; animation: float3d 6s ease-in-out infinite; }
        @keyframes float3d { 0%,100% { transform: translateY(0) scale(1); } 33% { transform: translateY(-22px) scale(1.03); } 66% { transform: translateY(10px) scale(0.97); } }
        .s1-shape1 { width: 420px; height: 420px; background: radial-gradient(ellipse at 30% 40%, rgba(201,162,39,0.35), rgba(201,162,39,0.05) 70%); right: 6%; top: 5%; animation-duration: 7s; border: 1px solid rgba(201,162,39,0.2); box-shadow: 0 0 80px rgba(201,162,39,0.15), inset 0 0 60px rgba(201,162,39,0.08); }
        .s1-shape2 { width: 220px; height: 220px; background: radial-gradient(ellipse, rgba(255,255,255,0.12), transparent 70%); right: 30%; top: 55%; animation-duration: 5s; border: 1px solid rgba(255,255,255,0.1); }
        .s1-shape3 { width: 120px; height: 120px; background: rgba(201,162,39,0.2); right: 10%; bottom: 12%; animation-duration: 4s; border-radius: 50%; border: 2px solid rgba(201,162,39,0.4); }
        .slide-content { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 0 48px; width: 100%; }
        .slide-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(201,162,39,0.15); border: 1px solid rgba(201,162,39,0.4); color: var(--gold-light); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; }
        .slide-badge::before { content: ''; width: 6px; height: 6px; background: var(--gold); border-radius: 50%; }
        .slide-heading { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4.5vw, 3.6rem); color: var(--white); line-height: 1.15; max-width: 600px; margin-bottom: 20px; }
        .slide-heading em { font-style: normal; color: var(--gold-light); position: relative; }
        .slide-heading em::after { content: ''; position: absolute; bottom: 2px; left: 0; right: 0; height: 3px; background: var(--gold); opacity: 0.5; border-radius: 2px; }
        .slide-desc { font-size: 1.05rem; color: rgba(255,255,255,0.7); max-width: 480px; line-height: 1.7; margin-bottom: 36px; }
        .slide-actions { display: flex; gap: 16px; flex-wrap: wrap; }
        .slide-animate .slide-badge { animation: slideUp 0.8s 0.3s both; }
        .slide-animate .slide-heading { animation: slideUp 0.8s 0.5s both; }
        .slide-animate .slide-desc { animation: slideUp 0.8s 0.7s both; }
        .slide-animate .slide-actions { animation: slideUp 0.8s 0.9s both; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        .btn-primary-hero { background: var(--gold); color: var(--navy-dark); font-weight: 700; font-size: 0.95rem; padding: 14px 32px; border-radius: 10px; text-decoration: none; border: none; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 6px 24px rgba(201,162,39,0.35); }
        .btn-primary-hero:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201,162,39,0.45); }
        .btn-outline-hero { background: transparent; color: var(--white); font-weight: 600; font-size: 0.95rem; padding: 13px 28px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.35); text-decoration: none; transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-outline-hero:hover { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.08); }
        .hero-stats { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(10,20,45,0.75); backdrop-filter: blur(12px); border-top: 1px solid rgba(201,162,39,0.2); display: flex; justify-content: center; z-index: 20; }
        .stat-item { flex: 1; max-width: 240px; padding: 18px 24px; text-align: center; border-right: 1px solid rgba(255,255,255,0.08); }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--gold-light); font-weight: 700; line-height: 1; }
        .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.55); margin-top: 4px; letter-spacing: 0.05em; text-transform: uppercase; }
        .slide-dots { position: absolute; bottom: 90px; right: 48px; display: flex; flex-direction: column; gap: 10px; z-index: 30; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); cursor: pointer; transition: all 0.3s; border: none; }
        .dot.active { background: var(--gold); width: 8px; height: 28px; border-radius: 4px; }
        .slide-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; z-index: 30; backdrop-filter: blur(8px); font-size: 1.1rem; }
        .slide-arrow:hover { background: rgba(201,162,39,0.3); border-color: var(--gold); }
        .arrow-prev { left: 24px; }
        .arrow-next { right: 24px; }
        section { padding: 80px 24px; }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-label { display: inline-flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
        .section-label::before { content: ''; width: 28px; height: 2px; background: var(--gold); }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3vw, 2.4rem); color: var(--navy); margin-bottom: 16px; line-height: 1.25; }
        .section-desc { font-size: 1rem; color: var(--text-muted); max-width: 560px; line-height: 1.7; }
        .how-section { background: var(--light-bg); }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 28px; margin-top: 48px; }
        .step-card { background: var(--white); border-radius: 16px; padding: 32px 28px; position: relative; box-shadow: 0 2px 20px rgba(26,46,90,0.07); border: 1px solid rgba(26,46,90,0.06); transition: all 0.3s; }
        .step-card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(26,46,90,0.12); }
        .step-num { font-family: 'Playfair Display', serif; font-size: 3.5rem; color: rgba(201,162,39,0.15); font-weight: 700; line-height: 1; position: absolute; top: 20px; right: 24px; }
        .step-icon { width: 52px; height: 52px; background: linear-gradient(135deg, var(--navy), var(--navy-dark)); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 20px; }
        .step-title { font-weight: 700; font-size: 1rem; color: var(--navy); margin-bottom: 10px; }
        .step-text { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 48px; }
        .feature-card { background: var(--white); border-radius: 16px; padding: 28px; border: 1px solid rgba(26,46,90,0.08); box-shadow: 0 2px 16px rgba(26,46,90,0.05); display: flex; gap: 18px; transition: all 0.3s; }
        .feature-card:hover { border-color: var(--gold); box-shadow: 0 8px 32px rgba(201,162,39,0.1); }
        .feature-icon-wrap { width: 48px; height: 48px; background: linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05)); border: 1px solid rgba(201,162,39,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
        .feature-body h3 { font-size: 0.95rem; font-weight: 700; color: var(--navy); margin-bottom: 6px; }
        .feature-body p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin: 0; }
        .who-section { background: var(--navy); }
        .who-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 48px; }
        .who-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; transition: all 0.3s; }
        .who-card:hover { background: rgba(255,255,255,0.09); border-color: rgba(201,162,39,0.4); transform: translateY(-4px); }
        .who-icon { font-size: 2.2rem; margin-bottom: 16px; }
        .who-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--white); margin-bottom: 10px; }
        .who-text { font-size: 0.85rem; color: rgba(255,255,255,0.6); line-height: 1.7; margin: 0; }
        .cta-section { background: linear-gradient(135deg, var(--navy-dark) 0%, #1e3a6e 100%); text-align: center; }
        .cta-section h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); color: var(--white); margin-bottom: 16px; }
        .cta-section p { color: rgba(255,255,255,0.65); font-size: 1rem; max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
        .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        footer { background: var(--navy-dark); border-top: 1px solid rgba(255,255,255,0.07); padding: 48px 24px 24px; }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .footer-brand p { font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.7; margin-top: 12px; max-width: 280px; }
        .footer-col h4 { font-size: 0.82rem; font-weight: 700; color: var(--gold-light); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px; }
        .footer-col ul { list-style: none; padding: 0; margin: 0; }
        .footer-col ul li { margin-bottom: 10px; }
        .footer-col ul li a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.85rem; transition: color 0.2s; }
        .footer-col ul li a:hover { color: var(--gold-light); }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .footer-bottom p { font-size: 0.78rem; color: rgba(255,255,255,0.35); margin: 0; }
        .footer-badge { display: flex; gap: 8px; }
        .badge-item { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45); font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(160px) rotate(0deg); } to { transform: rotate(360deg) translateX(160px) rotate(-360deg); } }
        @media (max-width: 860px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .nav-links.open { display: flex !important; flex-direction: column; position: absolute; top: 68px; left: 0; right: 0; background: var(--navy); padding: 16px; gap: 4px; z-index: 999; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .topbar { display: none; }
        }
        @media (max-width: 768px) { .features-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; }
          .slide-content { padding: 0 24px; }
          .hero-stats { display: none; }
          .slide-dots { display: none; }
        }
      `}</style>

      {/* TOPBAR
      <div className="topbar">
        <a href="#">Student Portal</a>
        <a href="#">Staff Portal</a>
        <a href="#">UNIMA Moodle</a>
        <a href="#">Admissions</a>
        <a href="#">Contact</a>
      </div> */}

      {/* NAVBAR */}
      <nav>
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <div className="nav-logo">U</div>
            <div>
              <div className="nav-brand-title">Essay Grading System Leveraging AI</div>
              <div className="nav-brand-sub">University of Malawi</div>
            </div>
          </Link>
          <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#who">Who It's For</a></li>
            <li><Link to="/login" className="btn-nav">Sign In →</Link></li>
          </ul>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO SLIDER */}
      <section className="hero"
        onTouchStart={e => { touchXRef.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchXRef.current
          if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide()
        }}>
        <div className="slides-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>

          {/* SLIDE 1 */}
          <div className={`slide slide-1`}>
            <div className="geo-shape s1-shape1" />
            <div className="geo-shape s1-shape2" />
            <div className="geo-shape s1-shape3" />
            <div style={{ position:'absolute', right:'4%', top:'50%', transform:'translateY(-50%)', zIndex:3, pointerEvents:'none' }}>
              <div style={{ width:'340px', height:'340px', position:'relative' }}>
                <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(201,162,39,0.3)', animation:'spin 18s linear infinite' }} />
                <div style={{ position:'absolute', inset:20, borderRadius:'50%', border:'1px dashed rgba(201,162,39,0.15)', animation:'spin 10s linear infinite reverse' }} />
                <div style={{ position:'absolute', inset:40, background:'rgba(201,162,39,0.08)', backdropFilter:'blur(4px)', borderRadius:20, border:'1px solid rgba(201,162,39,0.25)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, textAlign:'center' }}>
                  <div style={{ fontSize:'3rem', marginBottom:8 }}>📝</div>
                  <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.8)', fontWeight:600 }}>Essay Submitted</div>
                  <div style={{ width:'80%', height:2, background:'linear-gradient(90deg,transparent,rgba(201,162,39,0.6),transparent)', margin:'12px 0' }} />
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#e8c547', fontWeight:700 }}>92%</div>
                  <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.5)' }}>AI Grade</div>
                </div>
                <div style={{ position:'absolute', width:12, height:12, background:'#c9a227', borderRadius:'50%', top:8, left:'50%', marginLeft:-6, boxShadow:'0 0 12px rgba(201,162,39,0.8)', animation:'orbit 4s linear infinite' }} />
              </div>
            </div>
            <div className={`slide-content${current === 0 ? ' slide-animate' : ''}`} key={`s0-${current === 0}`}>
              <div className="slide-badge">AI-Powered Grading</div>
              <h1 className="slide-heading">Grade Essays with <em>Artificial Intelligence</em></h1>
              <p className="slide-desc">Instantly evaluate student essays with 85%+ accuracy. Reduce teacher workload and deliver consistent, detailed feedback in seconds.</p>
              <div className="slide-actions">
                <Link to="/login" className="btn-primary-hero">Get Started →</Link>
                <a href="#how-it-works" className="btn-outline-hero">▶ How It Works</a>
              </div>
            </div>
          </div>

          {/* SLIDE 2 */}
          <div className="slide slide-2">
            <div className="geo-shape" style={{ width:380, height:380, background:'radial-gradient(ellipse,rgba(100,200,80,0.2),transparent 70%)', right:'8%', top:'8%', animationDuration:'6.5s', border:'1px solid rgba(100,200,80,0.15)' }} />
            <div className="geo-shape" style={{ width:180, height:180, background:'rgba(255,255,255,0.06)', right:'35%', bottom:'20%', animationDuration:'4.5s', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%' }} />
            <div style={{ position:'absolute', right:'5%', top:'50%', transform:'translateY(-50%)', zIndex:3, pointerEvents:'none', width:300 }}>
              <div style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(10px)', borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', padding:24 }}>
                <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16 }}>📊 Feedback Summary</div>
                {[['Grammar','88%','#64c850','#a8e090'],['Content','91%','#64c850','#a8e090'],['Structure','85%','#e8c547','#f5d76e'],['Vocabulary','79%','#e87c47','#f5a96e']].map(([label,val,c1,c2]) => (
                  <div key={label} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'rgba(255,255,255,0.7)', marginBottom:4 }}><span>{label}</span><span>{val}</span></div>
                    <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:val, background:`linear-gradient(90deg,${c1},${c2})`, borderRadius:3 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)', fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:'#e8c547', fontWeight:700, textAlign:'center' }}>86% <span style={{ fontSize:'0.8rem', fontFamily:"'DM Sans',sans-serif", color:'rgba(255,255,255,0.5)', fontWeight:400 }}>Overall</span></div>
              </div>
            </div>
            <div className={`slide-content${current === 1 ? ' slide-animate' : ''}`} key={`s1-${current === 1}`}>
              <div className="slide-badge">Detailed Feedback</div>
              <h1 className="slide-heading">Instant, <em>Detailed</em> Writing Feedback</h1>
              <p className="slide-desc">Students receive comprehensive breakdowns of grammar, content, structure and vocabulary within 2 minutes of submission.</p>
              <div className="slide-actions">
                <Link to="/login" className="btn-primary-hero">Try It Now →</Link>
                <a href="#features" className="btn-outline-hero">See Features</a>
              </div>
            </div>
          </div>

          {/* SLIDE 3 */}
          <div className="slide slide-3">
            <div className="geo-shape" style={{ width:400, height:400, background:'radial-gradient(ellipse,rgba(230,120,60,0.25),transparent 70%)', right:'6%', top:'6%', animationDuration:'7.5s', border:'1px solid rgba(230,120,60,0.2)' }} />
            <div style={{ position:'absolute', right:'5%', top:'50%', transform:'translateY(-50%)', zIndex:3, pointerEvents:'none', width:310 }}>
              <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)', borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', padding:24 }}>
                <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16 }}>🏫 Class Performance</div>
                <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:80, marginBottom:12 }}>
                  {[60,80,50,100,70,65].map((h, i) => (
                    <div key={i} style={{ flex:1, background:`rgba(201,162,39,${0.4+h/200})`, borderRadius:'4px 4px 0 0', height:`${h}%` }} />
                  ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:8 }}>
                  {[['47','Essays Graded'],['2 min','Avg. Grade Time']].map(([n,l]) => (
                    <div key={l} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:10, textAlign:'center' }}>
                      <div style={{ fontSize:'1.3rem', fontFamily:"'Playfair Display',serif", color:'#e8c547', fontWeight:700 }}>{n}</div>
                      <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={`slide-content${current === 2 ? ' slide-animate' : ''}`} key={`s2-${current === 2}`}>
              <div className="slide-badge">Teacher Dashboard</div>
              <h1 className="slide-heading">Empower <em>Teachers</em> to Teach More</h1>
              <p className="slide-desc">Free up 70% of grading time. Powerful analytics help teachers track class progress and focus on students who need the most support.</p>
              <div className="slide-actions">
                <Link to="/login" className="btn-primary-hero">Teacher Login →</Link>
                <a href="#who" className="btn-outline-hero">Learn More</a>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="slide-dots">
          {[0,1,2].map(i => (
            <button key={i} className={`dot${current === i ? ' active' : ''}`} onClick={() => goToSlide(i)} />
          ))}
        </div>

        {/* Arrows */}
        <button className="slide-arrow arrow-prev" onClick={prevSlide} aria-label="Previous">&#8592;</button>
        <button className="slide-arrow arrow-next" onClick={nextSlide} aria-label="Next">&#8594;</button>

        {/* Progress bar */}
        <div style={{ position:'absolute', bottom:0, left:0, height:3, background:'#c9a227', width:`${progress}%`, zIndex:50, transition:'width 0.1s linear' }} />

        {/* Stats ribbon */}
        <div className="hero-stats">
          {[['85%+','Grading Accuracy'],['<2 min','Per Essay'],['70%','Workload Reduction'],['500+','Students in Pilot']].map(([num, label]) => (
            <div key={label} className="stat-item">
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-inner">
          <div className="section-label">Process</div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-desc">From essay submission to detailed feedback in under 2 minutes — here's the simple 4-step process.</p>
          <div className="steps-grid">
            {[
              { num:'01', icon:'📤', title:'Student Submits Essay', text:"Students log in and upload their essay in the portal. Supports English and Chichewa." },
              { num:'02', icon:'🤖', title:'AI Analyses the Text', text:"Google Gemini AI & Hugging face evaluates grammar, content, structure and vocabulary against the grading rubric." },
              { num:'03', icon:'📊', title:'Grade & Feedback Generated', text:"A detailed score breakdown and personalised feedback is generated instantly and shown to the student after the teachers feedback." },
              { num:'04', icon:'✅', title:'Teacher Reviews & Approves', text:"Teachers can review AI grades, make adjustments, and monitor class performance from their dashboard." },
            ].map(s => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-text">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="section-inner">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
            <div>
              <div className="section-label">Features</div>
              <h2 className="section-title">Everything You Need for Smarter Grading</h2>
              <p className="section-desc">Built specifically for the Malawian School curriculum, with tools for both students and teachers.</p>
            </div>
            <div />
          </div>
          <div className="features-grid">
            {[
              { icon:'⚡', title:'Instant Grading', text:"Essays are graded in under 2 minutes — no more waiting 2–3 weeks for feedback. Learning happens in real-time." },
              { icon:'🎯', title:'85%+ Accuracy', text:"AI grading matches human teacher assessments with over 85% accuracy, validated against actual MSCE rubrics." },
              { icon:'📋', title:'Custom Rubrics', text:"Teachers set custom grading criteria per assignment, aligned with the Malawi curriculum and MSCE standards." },
              { icon:'🔍', title:'Plagiarism Detection', text:"Automatically flags copied or suspicious content, ensuring academic integrity across all submissions." },
              { icon:'📈', title:'Progress Tracking', text:"Visual dashboards show student improvement over time, helping teachers identify who needs extra support." },
              { icon:'📱', title:'Mobile Friendly', text:"Fully responsive on smartphones and tablets — accessible even on low-bandwidth connections in rural areas." },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon-wrap">{f.icon}</div>
                <div className="feature-body">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="who-section" id="who">
        <div className="section-inner">
          <div className="section-label" style={{ color:'var(--gold-light)' }}>Beneficiaries</div>
          <h2 className="section-title" style={{ color:'white' }}>Who Is It For?</h2>
          <p className="section-desc" style={{ color:'rgba(255,255,255,0.6)' }}>Designed to serve every stakeholder in the Education ecosystem.</p>
          <div className="who-cards">
            {[
              { icon:'🧑‍🎓', title:'Students', text:"Submit essays, receive instant detailed feedback, track your writing improvement and resubmit to improve your score." },
              { icon:'👩‍🏫', title:'Computer Teachers', text:"Review AI grades, set rubrics, assign writing tasks, and spend more time on actual classroom teaching." },
              { icon:'🏫', title:'School Administrators', text:"Monitor school-wide writing performance with analytics, track progress and generate reports effortlessly." },
            ].map(w => (
              <div key={w.title} className="who-card">
                <div className="who-icon">{w.icon}</div>
                <div className="who-title">{w.title}</div>
                <p className="who-text">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-inner">
          <h2>Ready to Transform Essay Grading?</h2>
          <p>Join the pilot programme and help shape the future of AI-powered education in Malawi.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn-primary-hero">Sign In to Portal →</Link>
            <Link to="/register" className="btn-outline-hero">Register Your School</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <div style={{ width:40, height:40, background:'#c9a227', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, color:'#0f1d3a' }}>U</div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'0.95rem', color:'white', fontWeight:600 }}>AI Essay Grading System</span>
              </div>
              <p>An AI-powered essay grading platform developed for Malawian schools by students of the University of Malawi.</p>
            </div>
            {[
              { title:'Platform', links:['Student Portal','Teacher Dashboard','Admin Panel','Login'] },
              { title:'Project', links:['About','Methodology','Documentation','GitHub'] },
              { title:'UNIMA', links:['unima.ac.mw','School of Education','Student Resources','Contact'] },
            ].map(col => (
              <div key={col.title} className="footer-col">
                <h4>{col.title}</h4>
                <ul>{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p>© 2026 AI Essay Grading System — University of Malawi Fourth Year Project</p>
            <div className="footer-badge">
              <span className="badge-item">React + Supabase</span>
              <span className="badge-item">Gemini AI & Hugging Face AI</span>
              <span className="badge-item">BED/COM 2021–2022</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
