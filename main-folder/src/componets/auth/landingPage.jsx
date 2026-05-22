// src/components/auth/LandingPage.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'

export default function LandingPage() {
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchXRef = useRef(0);
  const totalSlides = 3;
  const autoInterval = useRef(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  useEffect(() => {
    // Auto-slide every 8 seconds
    autoInterval.current = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(autoInterval.current);
  }, []);

  useEffect(() => {
    // Reset progress bar on slide change
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [current]);

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
        .nav-links { display: flex; align-items: center; gap: 8px; list-style: none; margin: 0; padding: 0; }
        .nav-links li { list-style: none; }
        .nav-links a { color: rgba(255,255,255,0.82); text-decoration: none; font-size: 0.88rem; font-weight: 500; padding: 8px 14px; border-radius: 6px; transition: all 0.2s; }
        .nav-links a:hover { color: var(--white); background: rgba(255,255,255,0.1); }
        .nav-links .btn-nav { background: var(--gold); color: var(--navy-dark); font-weight: 600; border-radius: 8px; padding: 8px 20px; }
        .nav-links .btn-nav:hover { background: var(--gold-light); transform: translateY(-1px); }
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
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(160px) rotate(0deg); } to { transform: rotate(360deg) translateX(160px) rotate(-360deg); } }
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
        .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); cursor: pointer; transition: all 0.3s; border: none; padding: 0; }
        .dot.active { background: var(--gold); width: 8px; height: 28px; border-radius: 4px; }
        .slide-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; z-index: 30; backdrop-filter: blur(8px); font-size: 1.1rem; }
        .slide-arrow:hover { background: rgba(201,162,39,0.3); border-color: var(--gold); }
        .arrow-prev { left: 24px; }
        .arrow-next { right: 24px; }
        @media (max-width: 860px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .nav-links.open { display: flex !important; flex-direction: column; position: absolute; top: 68px; left: 0; right: 0; background: var(--navy); padding: 16px; gap: 4px; z-index: 999; }
          .hero-stats { display: none; }
          .slide-dots { display: none; }
          .slide-content { padding: 0 24px; }
          .slide-arrow { width: 36px; height: 36px; }
        }
      `}</style>

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
          <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#who">Who It's For</a></li>
            <li><Link to="/login" className="btn-nav">Sign In →</Link></li>
          </ul>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO SLIDER */}
      <section className="hero"
        onTouchStart={e => { touchXRef.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchXRef.current;
          if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
        }}>
        <div className="slides-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>

          {/* SLIDE 1 */}
          <div className="slide slide-1">
            <div className="geo-shape" style={{ width: 420, height: 420, background: 'radial-gradient(ellipse at 30% 40%, rgba(201,162,39,0.35), rgba(201,162,39,0.05) 70%)', right: '6%', top: '5%', animationDuration: '7s', border: '1px solid rgba(201,162,39,0.2)' }} />
            <div className="geo-shape" style={{ width: 220, height: 220, background: 'radial-gradient(ellipse, rgba(255,255,255,0.12), transparent 70%)', right: '30%', top: '55%', animationDuration: '5s', border: '1px solid rgba(255,255,255,0.1)' }} />
            <div className={`slide-content ${current === 0 ? 'slide-animate' : ''}`}>
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
            <div className="geo-shape" style={{ width: 380, height: 380, background: 'radial-gradient(ellipse,rgba(100,200,80,0.2),transparent 70%)', right: '8%', top: '8%', animationDuration: '6.5s', border: '1px solid rgba(100,200,80,0.15)' }} />
            <div className={`slide-content ${current === 1 ? 'slide-animate' : ''}`}>
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
            <div className="geo-shape" style={{ width: 400, height: 400, background: 'radial-gradient(ellipse,rgba(230,120,60,0.25),transparent 70%)', right: '6%', top: '6%', animationDuration: '7.5s', border: '1px solid rgba(230,120,60,0.2)' }} />
            <div className={`slide-content ${current === 2 ? 'slide-animate' : ''}`}>
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
          {[0, 1, 2].map(i => (
            <button key={i} className={`dot ${current === i ? 'active' : ''}`} onClick={() => goToSlide(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>

        {/* Arrows */}
        <button className="slide-arrow arrow-prev" onClick={prevSlide} aria-label="Previous">←</button>
        <button className="slide-arrow arrow-next" onClick={nextSlide} aria-label="Next">→</button>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, background: '#c9a227', width: `${progress}%`, zIndex: 50, transition: 'width 0.1s linear' }} />

        {/* Stats ribbon */}
        <div className="hero-stats">
          {[['85%+', 'Grading Accuracy'], ['<2 min', 'Per Essay'], ['70%', 'Workload Reduction'], ['500+', 'Students']].map(([num, label]) => (
            <div key={label} className="stat-item">
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works" style={{ padding: '80px 24px', background: '#f5f7fb' }}>
        <div className="section-inner" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a227', marginBottom: 12 }}>
            <span style={{ width: 28, height: 2, background: '#c9a227' }} /> Process
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#1a2e5a', marginBottom: 16 }}>How It Works</h2>
          <p style={{ color: '#6b7a99', fontSize: '1rem', maxWidth: 560, lineHeight: 1.7, marginBottom: 48 }}>From essay submission to detailed feedback in under 2 minutes — here's the simple 4-step process.</p>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
            {[
              { num: '01', icon: '📤', title: 'Student Submits Essay', text: "Students log in and upload their essay in the portal. Supports English and Chichewa." },
              { num: '02', icon: '🤖', title: 'AI Analyses the Text', text: "Google Gemini AI evaluates grammar, content, structure and vocabulary against the grading rubric." },
              { num: '03', icon: '📊', title: 'Grade & Feedback Generated', text: "A detailed score breakdown and personalised feedback is generated instantly." },
              { num: '04', icon: '✅', title: 'Teacher Reviews & Approves', text: "Teachers can review AI grades, make adjustments, and monitor class performance." },
            ].map(s => (
              <div key={s.num} style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', position: 'relative', boxShadow: '0 2px 20px rgba(26,46,90,0.07)', border: '1px solid rgba(26,46,90,0.06)', transition: 'all 0.3s' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', color: 'rgba(201,162,39,0.15)', fontWeight: 700, lineHeight: 1, position: 'absolute', top: 20, right: 24 }}>{s.num}</div>
                <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #1a2e5a, #0f1d3a)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 20 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a2e5a', marginBottom: 10 }}>{s.title}</div>
                <p style={{ fontSize: '0.88rem', color: '#6b7a99', lineHeight: 1.6, margin: 0 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '72px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a227', marginBottom: 12 }}>
            <span style={{ width: 28, height: 2, background: '#c9a227' }} /> Features
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1a2e5a', marginBottom: 8 }}>Built for Malawian Schools</h2>
          <p style={{ color: '#6b7a99', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 44 }}>Tools designed around the MSCE curriculum and local needs.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {[
              { icon: '⚡', title: 'Instant Grading', text: 'Results in under 2 minutes, no more waiting weeks.' },
              { icon: '🎯', title: '85%+ Accuracy', text: 'Matches human teacher assessments, validated on MSCE rubrics.' },
              { icon: '📋', title: 'Custom Rubrics', text: 'Teachers set grading criteria per assignment.' },
              { icon: '🔍', title: 'Plagiarism Detection', text: 'Flags copied or suspicious content automatically.' },
              { icon: '📈', title: 'Progress Tracking', text: 'Visual dashboards show student improvement over time.' },
              { icon: '📱', title: 'Mobile Friendly', text: 'Works on smartphones, even on low-bandwidth connections.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 14, padding: '18px', border: '1px solid rgba(26,46,90,0.08)', borderRadius: 10, alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a2e5a', marginBottom: 4 }}>{f.title}</div>
                  <p style={{ fontSize: '0.83rem', color: '#6b7a99', lineHeight: 1.6, margin: 0 }}>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section id="who" style={{ padding: '72px 20px', background: '#1a2e5a' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e8c547', marginBottom: 12 }}>
            <span style={{ width: 28, height: 2, background: '#e8c547' }} /> Beneficiaries
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#fff', marginBottom: 8 }}>Who Is It For?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 44 }}>Designed for every stakeholder in the classroom.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { icon: '🎓', title: 'Students', text: 'Submit essays, get instant feedback, and track your writing improvement.' },
              { icon: '📚', title: 'Teachers', text: 'Review AI grades, set rubrics, and focus on actual teaching.' },
              { icon: '🏛️', title: 'Administrators', text: 'Monitor school-wide performance with easy-to-read analytics.' },
            ].map(w => (
              <div key={w.title} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '24px 20px', transition: 'all 0.3s' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 16 }}>{w.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#fff', marginBottom: 10 }}>{w.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 20px', background: '#0f1d3a', textAlign: 'center' }}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#fff', marginBottom: 14 }}>Ready to Get Started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: 34 }}>Sign in with your school account and start grading smarter today.</p>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#c9a227', color: '#0f1d3a', fontWeight: 700, fontSize: '0.95rem', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', transition: 'all 0.25s' }}>
            Sign In to Portal →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a1425', padding: '24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
          © 2026 AI Essay Grading System · University of Malawi · Group 30
        </p>
      </footer>
    </>
  );
}