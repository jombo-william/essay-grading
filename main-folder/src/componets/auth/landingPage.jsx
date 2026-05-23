// src/componets/auth/landingPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

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
        .hero { background: linear-gradient(160deg, #0f1d3a 0%, #1a2e5a 60%, #0e2244 100%); padding: 90px 24px 100px; text-align: center; }
        .hero-inner { max-width: 640px; margin: 0 auto; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(201,162,39,0.15); border: 1px solid rgba(201,162,39,0.35); color: #e8c547; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 24px; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(1.9rem, 5vw, 3rem); color: #fff; line-height: 1.25; margin-bottom: 18px; }
        .hero h1 span { color: #e8c547; }
        .hero p { color: rgba(255,255,255,0.6); font-size: 1rem; line-height: 1.75; max-width: 480px; margin: 0 auto 36px; }
        .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-primary { display: inline-flex; align-items: center; gap: 7px; background: #c9a227; color: #0f1d3a; font-weight: 700; font-size: 0.95rem; padding: 13px 26px; border-radius: 10px; text-decoration: none; transition: all 0.25s; box-shadow: 0 6px 24px rgba(201,162,39,0.35); }
        .btn-primary:hover { background: #e8c547; transform: translateY(-2px); }
        .btn-outline { display: inline-flex; align-items: center; gap: 7px; background: transparent; color: #fff; font-weight: 600; font-size: 0.95rem; padding: 12px 22px; border-radius: 10px; text-decoration: none; border: 1.5px solid rgba(255,255,255,0.25); transition: all 0.25s; }
        .btn-outline:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.07); }
        .hero-stats { display: grid; grid-template-columns: repeat(3, 1fr); max-width: 560px; margin: 60px auto 0; background: rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .stat { padding: 22px 12px; text-align: center; border-right: 1px solid rgba(255,255,255,0.08); }
        .stat:last-child { border-right: none; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #e8c547; font-weight: 700; }
        .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.45); margin-top: 4px; }
        section { padding: 80px 24px; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-label { display: inline-flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
        .section-label::before { content: ''; width: 28px; height: 2px; background: var(--gold); }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3vw, 2.2rem); color: var(--navy); margin-bottom: 14px; line-height: 1.25; }
        .section-desc { font-size: 1rem; color: var(--text-muted); max-width: 560px; line-height: 1.7; margin-bottom: 48px; }
        .how-section { background: var(--light-bg); }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 28px; }
        .step-card { background: var(--white); border-radius: 16px; padding: 32px 28px; position: relative; box-shadow: 0 2px 20px rgba(26,46,90,0.07); border: 1px solid rgba(26,46,90,0.06); transition: all 0.3s; }
        .step-card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(26,46,90,0.12); }
        .step-num { font-family: 'Playfair Display', serif; font-size: 3.5rem; color: rgba(201,162,39,0.15); font-weight: 700; line-height: 1; position: absolute; top: 20px; right: 24px; }
        .step-icon { width: 52px; height: 52px; background: linear-gradient(135deg, var(--navy), var(--navy-dark)); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 20px; }
        .step-title { font-weight: 700; font-size: 1rem; color: var(--navy); margin-bottom: 10px; }
        .step-text { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; }
        .features-section { background: var(--white); }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .feature-card { display: flex; gap: 14px; padding: 20px; border: 1px solid rgba(26,46,90,0.08); border-radius: 12px; align-items: flex-start; transition: all 0.3s; }
        .feature-card:hover { border-color: var(--gold); box-shadow: 0 6px 24px rgba(201,162,39,0.1); }
        .feature-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
        .feature-title { font-weight: 700; font-size: 0.92rem; color: var(--navy); margin-bottom: 4px; }
        .feature-text { font-size: 0.83rem; color: var(--text-muted); line-height: 1.6; margin: 0; }
        .who-section { background: var(--navy); }
        .who-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
        .who-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 28px 24px; transition: all 0.3s; }
        .who-card:hover { background: rgba(255,255,255,0.09); border-color: rgba(201,162,39,0.4); transform: translateY(-4px); }
        .who-icon-wrap { width: 42px; height: 42px; border-radius: 10px; background: rgba(201,162,39,0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .who-title { font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 8px; }
        .who-text { font-size: 0.83rem; color: rgba(255,255,255,0.55); line-height: 1.65; margin: 0; }
        .cta-section { background: #0f1d3a; text-align: center; }
        .cta-section h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3.5vw, 2.2rem); color: #fff; margin-bottom: 14px; }
        .cta-section p { color: rgba(255,255,255,0.55); font-size: 0.95rem; line-height: 1.75; margin-bottom: 34px; max-width: 440px; margin-left: auto; margin-right: auto; }
        footer { background: #0a1425; padding: 24px 20px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
        footer p { font-size: 0.78rem; color: rgba(255,255,255,0.3); }
        @media (max-width: 860px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .nav-links.open { display: flex !important; flex-direction: column; position: absolute; top: 68px; left: 0; right: 0; background: var(--navy); padding: 16px; gap: 4px; z-index: 999; }
        }
        @media (max-width: 560px) {
          .hero-stats { grid-template-columns: 1fr; }
          .stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .stat:last-child { border-bottom: none; }
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
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <i className="ti ti-school" aria-hidden="true" style={{ fontSize: 13 }} />
            University of Malawi · Group 30
          </div>
          <h1>
            Essay Grading Powered by{' '}
            <span>Artificial Intelligence</span>
          </h1>
          <p>
            Submit your essay and receive detailed AI feedback in under 2 minutes.
            Built for Malawian schools, aligned with the MSCE curriculum.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary">
              Get Started
              <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 15 }} />
            </Link>
            <a href="#how-it-works" className="btn-outline">
              <i className="ti ti-play" aria-hidden="true" style={{ fontSize: 14 }} />
              How It Works
            </a>
          </div>
          <div className="hero-stats">
            {[
              { n: '85%+', l: 'Accuracy' },
              { n: '< 2 min', l: 'Per Essay' },
              { n: '70%', l: 'Less Workload' },
            ].map(({ n, l }) => (
              <div key={l} className="stat">
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
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
              { num: '01', icon: '📤', title: 'Student Submits Essay', text: 'Students log in and upload their essay in the portal. Supports English and Chichewa.' },
              { num: '02', icon: '🤖', title: 'AI Analyses the Text', text: 'Google Gemini AI & Hugging Face evaluates grammar, content, structure and vocabulary against the grading rubric.' },
              { num: '03', icon: '📊', title: 'Grade & Feedback Generated', text: "A detailed score breakdown and personalised feedback is generated instantly and shown to the student after the teacher's approval." },
              { num: '04', icon: '✅', title: 'Teacher Reviews & Approves', text: 'Teachers can review AI grades, make adjustments, and monitor class performance from their dashboard.' },
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
      <section className="features-section" id="features">
        <div className="section-inner">
          <div className="section-label">Features</div>
          <h2 className="section-title">Built for Malawian Schools</h2>
          <p className="section-desc">Tools designed around the MSCE curriculum and local needs.</p>
          <div className="features-grid">
            {[
              { icon: '⚡', title: 'Instant Grading', text: 'Results in under 2 minutes, no more waiting weeks.' },
              { icon: '🎯', title: '85%+ Accuracy', text: 'Matches human teacher assessments, validated on MSCE rubrics.' },
              { icon: '📋', title: 'Custom Rubrics', text: 'Teachers set grading criteria per assignment.' },
              { icon: '🔍', title: 'Plagiarism Detection', text: 'Flags copied or suspicious content automatically.' },
              { icon: '📈', title: 'Progress Tracking', text: 'Visual dashboards show student improvement over time.' },
              { icon: '📱', title: 'Mobile Friendly', text: 'Works on smartphones, even on low-bandwidth connections.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-text">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="who-section" id="who">
        <div className="section-inner">
          <div className="section-label" style={{ color: '#e8c547' }}>Beneficiaries</div>
          <h2 className="section-title" style={{ color: '#fff' }}>Who Is It For?</h2>
          <p className="section-desc" style={{ color: 'rgba(255,255,255,0.5)' }}>Designed for every stakeholder in the classroom.</p>
          <div className="who-grid">
            {[
              { icon: 'ti-user-graduate', title: 'Students', text: 'Submit essays, get instant feedback, and track your writing improvement.' },
              { icon: 'ti-chalkboard', title: 'Teachers', text: 'Review AI grades, set rubrics, and focus on actual teaching.' },
              { icon: 'ti-building', title: 'Administrators', text: 'Monitor school-wide performance with easy-to-read analytics.' },
            ].map(w => (
              <div key={w.title} className="who-card">
                <div className="who-icon-wrap">
                  <i className={`ti ${w.icon}`} aria-hidden="true" style={{ fontSize: 20, color: '#e8c547' }} />
                </div>
                <div className="who-title">{w.title}</div>
                <p className="who-text">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <h2>Ready to Get Started?</h2>
          <p>Sign in with your school account and start grading smarter today.</p>
          <Link to="/login" className="btn-primary" style={{ justifyContent: 'center' }}>
            Sign In to Portal
            <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 16 }} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 AI Essay Grading System · University of Malawi · Group 30</p>
      </footer>
    </>
  )
}
