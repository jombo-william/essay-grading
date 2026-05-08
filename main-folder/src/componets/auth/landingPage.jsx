

// src/components/auth/LandingPage.jsx
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0f1d3a', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        a.nav-link:hover { color: #fff !important; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ background: '#1a2e5a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, background: '#c9a227', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: 17, color: '#0f1d3a' }} />
            </div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>EssayGrade</span>
          </Link>

          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <a href="#how" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.88rem', padding: '6px 12px', borderRadius: 6 }}>How It Works</a>
            <a href="#features" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.88rem', padding: '6px 12px', borderRadius: 6 }}>Features</a>
            <Link to="/login" style={{ background: '#c9a227', color: '#0f1d3a', fontWeight: 700, fontSize: '0.88rem', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-login" aria-hidden="true" style={{ fontSize: 14 }} />
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(160deg, #0f1d3a 0%, #1a2e5a 60%, #0e2244 100%)', padding: '80px 20px 88px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }} className="fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.35)', color: '#e8c547', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 24 }}>
            <i className="ti ti-school" aria-hidden="true" style={{ fontSize: 13 }} />
            University of Malawi · Group 30
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#fff', lineHeight: 1.25, marginBottom: 18 }}>
            Essay Grading Powered by{' '}
            <span style={{ color: '#e8c547' }}>Artificial Intelligence</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.75, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Submit your essay and receive detailed AI feedback in under 2 minutes. Built for Malawian schools, aligned with the MSCE curriculum.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#c9a227', color: '#0f1d3a', fontWeight: 700, fontSize: '0.95rem', padding: '13px 26px', borderRadius: 10, textDecoration: 'none' }}>
              Get Started
              <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 15 }} />
            </Link>
            <a href="#how" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', color: '#fff', fontWeight: 600, fontSize: '0.95rem', padding: '12px 22px', borderRadius: 10, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <i className="ti ti-play" aria-hidden="true" style={{ fontSize: 14 }} />
              How It Works
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 560, margin: '60px auto 0', background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { n: '85%+', l: 'Accuracy', icon: 'ti-target' },
            { n: '< 2 min', l: 'Per Essay', icon: 'ti-clock' },
            { n: '70%', l: 'Less Workload', icon: 'ti-trending-down' },
          ].map(({ n, l, icon }) => (
            <div key={l} style={{ padding: '22px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 18, color: 'rgba(232,197,71,0.6)', display: 'block', marginBottom: 6 }} />
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#e8c547', fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '72px 20px', background: '#f5f7fb' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a227', marginBottom: 8 }}>Process</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1a2e5a', marginBottom: 8 }}>How It Works</h2>
          <p style={{ color: '#6b7a99', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 44 }}>Four simple steps from submission to grade.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {[
              { n: '01', icon: 'ti-upload',        title: 'Submit Essay',       text: 'Students log in and upload or type their essay directly in the portal.' },
              { n: '02', icon: 'ti-cpu',            title: 'AI Analysis',        text: 'The AI evaluates grammar, content, structure, and vocabulary against the rubric.' },
              { n: '03', icon: 'ti-chart-bar',      title: 'Feedback Generated', text: 'A detailed score and personalised feedback is ready within 2 minutes.' },
              { n: '04', icon: 'ti-circle-check',   title: 'Teacher Reviews',    text: 'Teachers review AI grades, make adjustments, and track class performance.' },
            ].map(s => (
              <div key={s.n} style={{ background: '#fff', borderRadius: 12, padding: '24px 20px', border: '1px solid rgba(26,46,90,0.07)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 14, right: 18, fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', color: 'rgba(201,162,39,0.1)', fontWeight: 700, lineHeight: 1, userSelect: 'none' }}>{s.n}</div>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <i className={`ti ${s.icon}`} aria-hidden="true" style={{ fontSize: 18, color: '#1a2e5a' }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1a2e5a', marginBottom: 6 }}>{s.title}</div>
                <p style={{ fontSize: '0.83rem', color: '#6b7a99', lineHeight: 1.65, margin: 0 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '72px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a227', marginBottom: 8 }}>Features</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1a2e5a', marginBottom: 8 }}>Built for Malawian Schools</h2>
          <p style={{ color: '#6b7a99', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 44 }}>Tools designed around the MSCE curriculum and local needs.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {[
              { icon: 'ti-bolt',          title: 'Instant Grading',      text: 'Results in under 2 minutes, no more waiting weeks.' },
              { icon: 'ti-rosette',       title: '85%+ Accuracy',        text: 'Matches human teacher assessments, validated on MSCE rubrics.' },
              { icon: 'ti-list-check',    title: 'Custom Rubrics',       text: 'Teachers set grading criteria per assignment.' },
              { icon: 'ti-zoom-check',    title: 'AI Detection',         text: 'Flags AI-generated or suspicious content automatically.' },
              { icon: 'ti-trending-up',   title: 'Progress Tracking',    text: 'Visual dashboards show student improvement over time.' },
              { icon: 'ti-device-mobile', title: 'Mobile Friendly',      text: 'Works on smartphones, even on low-bandwidth connections.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 14, padding: '16px 18px', border: '1px solid rgba(26,46,90,0.08)', borderRadius: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`ti ${f.icon}`} aria-hidden="true" style={{ fontSize: 17, color: '#1a2e5a' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a2e5a', marginBottom: 4 }}>{f.title}</div>
                  <p style={{ fontSize: '0.82rem', color: '#6b7a99', lineHeight: 1.65, margin: 0 }}>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section style={{ padding: '72px 20px', background: '#1a2e5a' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8c547', marginBottom: 8 }}>Beneficiaries</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#fff', marginBottom: 8 }}>Who Is It For?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 44 }}>Designed for every stakeholder in the classroom.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { icon: 'ti-user-graduate', title: 'Students',       text: 'Submit essays, get instant feedback, and track your writing improvement.' },
              { icon: 'ti-chalkboard',    title: 'Teachers',        text: 'Review AI grades, set rubrics, and focus on actual teaching.' },
              { icon: 'ti-building',      title: 'Administrators',  text: 'Monitor school-wide performance with easy-to-read analytics.' },
            ].map(w => (
              <div key={w.title} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '24px 20px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 9, background: 'rgba(201,162,39,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <i className={`ti ${w.icon}`} aria-hidden="true" style={{ fontSize: 20, color: '#e8c547' }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff', marginBottom: 6 }}>{w.title}</div>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '72px 20px', background: '#0f1d3a', textAlign: 'center' }}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#fff', marginBottom: 14 }}>Ready to Get Started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: 34 }}>Sign in with your school account and start grading smarter today.</p>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#c9a227', color: '#0f1d3a', fontWeight: 700, fontSize: '0.95rem', padding: '14px 32px', borderRadius: 10, textDecoration: 'none' }}>
            Sign In to Portal
            <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 16 }} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a1425', padding: '22px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)' }}>
          © 2026 AI Essay Grading System · University of Malawi · Fourth Year Project — Group 30
        </p>
      </footer>
    </div>
  )
}