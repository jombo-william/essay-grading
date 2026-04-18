import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0f1d3a', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: '#1a2e5a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: '#c9a227', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0f1d3a', fontSize: '1rem' }}>U</div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>AI Essay Grading</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#how" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.88rem', padding: '6px 12px', borderRadius: 6 }}>How It Works</a>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.88rem', padding: '6px 12px', borderRadius: 6 }}>Features</a>
            <Link to="/login" style={{ background: '#c9a227', color: '#0f1d3a', fontWeight: 700, fontSize: '0.88rem', padding: '8px 20px', borderRadius: 8, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(160deg, #0f1d3a 0%, #1a2e5a 60%, #0e2244 100%)', padding: '72px 20px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }} className="fade-up">
          <div style={{ display: 'inline-block', background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.35)', color: '#e8c547', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 20 }}>
            University of Malawi · Group 30
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
            Essay Grading Powered by <span style={{ color: '#e8c547' }}>Artificial Intelligence</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Submit your essay and receive detailed AI feedback in under 2 minutes. Built for Malawian schools, aligned with the MSCE curriculum.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ background: '#c9a227', color: '#0f1d3a', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: 10, textDecoration: 'none' }}>
              Get Started →
            </Link>
            <a href="#how" style={{ background: 'transparent', color: '#fff', fontWeight: 600, fontSize: '0.95rem', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              How It Works
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1, maxWidth: 600, margin: '56px auto 0', background: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          {[['85%+', 'Accuracy'], ['< 2 min', 'Per Essay'], ['70%', 'Less Workload']].map(([n, l]) => (
            <div key={l} style={{ padding: '20px 12px', textAlign: 'center', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#e8c547', fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '64px 20px', background: '#f5f7fb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a227', marginBottom: 8 }}>Process</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1a2e5a', marginBottom: 8 }}>How It Works</h2>
          <p style={{ color: '#6b7a99', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 40 }}>Four simple steps from submission to grade.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { n: '01', icon: '📤', title: 'Submit Essay', text: 'Students log in and upload or type their essay directly in the portal.' },
              { n: '02', icon: '🤖', title: 'AI Analysis', text: 'The AI evaluates grammar, content, structure, and vocabulary against the rubric.' },
              { n: '03', icon: '📊', title: 'Feedback Generated', text: 'A detailed score and personalised feedback is ready within 2 minutes.' },
              { n: '04', icon: '✅', title: 'Teacher Reviews', text: 'Teachers review AI grades, make adjustments, and track class performance.' },
            ].map(s => (
              <div key={s.n} style={{ background: '#fff', borderRadius: 12, padding: '24px 20px', border: '1px solid rgba(26,46,90,0.07)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, right: 20, fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'rgba(201,162,39,0.12)', fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a2e5a', marginBottom: 6 }}>{s.title}</div>
                <p style={{ fontSize: '0.85rem', color: '#6b7a99', lineHeight: 1.6, margin: 0 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '64px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a227', marginBottom: 8 }}>Features</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1a2e5a', marginBottom: 8 }}>Built for Malawian Schools</h2>
          <p style={{ color: '#6b7a99', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 40 }}>Tools designed around the MSCE curriculum and local needs.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
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
      <section style={{ padding: '64px 20px', background: '#1a2e5a' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8c547', marginBottom: 8 }}>Beneficiaries</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#fff', marginBottom: 8 }}>Who Is It For?</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 40 }}>Designed for every stakeholder in the classroom.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { icon: '🧑‍🎓', title: 'Students', text: 'Submit essays, get instant feedback, and track your writing improvement.' },
              { icon: '👩‍🏫', title: 'Teachers', text: 'Review AI grades, set rubrics, and focus on actual teaching.' },
              { icon: '🏫', title: 'Administrators', text: 'Monitor school-wide performance with easy-to-read analytics.' },
            ].map(w => (
              <div key={w.title} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '24px 20px' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>{w.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>{w.title}</div>
                <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 20px', background: '#0f1d3a', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#fff', marginBottom: 12 }}>Ready to Get Started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 32 }}>Sign in with your school account and start grading smarter today.</p>
          <Link to="/login" style={{ display: 'inline-block', background: '#c9a227', color: '#0f1d3a', fontWeight: 700, fontSize: '0.95rem', padding: '14px 36px', borderRadius: 10, textDecoration: 'none' }}>
            Sign In to Portal →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a1425', padding: '24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
          © 2026 AI Essay Grading System · University of Malawi · Fourth Year Project — Group 30
        </p>
      </footer>
    </div>
  )
}