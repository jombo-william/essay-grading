// src/components/auth/LandingPage.jsx
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        color: '#0f1d3a',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-up {
          animation: fadeUp 0.7s ease forwards;
        }

        a.nav-link:hover {
          color: #fff !important;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav
        style={{
          background: '#1a2e5a',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 60,
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: '#c9a227',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className="ti ti-pencil"
                aria-hidden="true"
                style={{ fontSize: 17, color: '#0f1d3a' }}
              />
            </div>

            <span
              style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              EssayGrade
            </span>
          </Link>

          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <a
              href="#how"
              className="nav-link"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                padding: '6px 12px',
                borderRadius: 6,
              }}
            >
              How It Works
            </a>

            <a
              href="#features"
              className="nav-link"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                padding: '6px 12px',
                borderRadius: 6,
              }}
            >
              Features
            </a>

            <Link
              to="/login"
              style={{
                background: '#c9a227',
                color: '#0f1d3a',
                fontWeight: 700,
                fontSize: '0.88rem',
                padding: '8px 18px',
                borderRadius: 8,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <i
                className="ti ti-login"
                aria-hidden="true"
                style={{ fontSize: 14 }}
              />
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          background:
            'linear-gradient(160deg, #0f1d3a 0%, #1a2e5a 60%, #0e2244 100%)',
          padding: '80px 20px 88px',
          textAlign: 'center',
        }}
      >
        <div
          style={{ maxWidth: 620, margin: '0 auto' }}
          className="fade-up"
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(201,162,39,0.15)',
              border: '1px solid rgba(201,162,39,0.35)',
              color: '#e8c547',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '5px 14px',
              borderRadius: 20,
              marginBottom: 24,
            }}
          >
            <i
              className="ti ti-school"
              aria-hidden="true"
              style={{ fontSize: 13 }}
            />
            University of Malawi · Group 30
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              color: '#fff',
              lineHeight: 1.25,
              marginBottom: 18,
            }}
          >
            Essay Grading Powered by{' '}
            <span style={{ color: '#e8c547' }}>
              Artificial Intelligence
            </span>
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1rem',
              lineHeight: 1.75,
              maxWidth: 480,
              margin: '0 auto 36px',
            }}
          >
            Submit your essay and receive detailed AI feedback in under 2
            minutes. Built for Malawian schools, aligned with the MSCE
            curriculum.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: '#c9a227',
                color: '#0f1d3a',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '13px 26px',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              Get Started
              <i
                className="ti ti-arrow-right"
                aria-hidden="true"
                style={{ fontSize: 15 }}
              />
            </Link>

            <a
              href="#how"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'transparent',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '12px 22px',
                borderRadius: 10,
                textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.25)',
              }}
            >
              <i
                className="ti ti-play"
                aria-hidden="true"
                style={{ fontSize: 14 }}
              />
              How It Works
            </a>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            maxWidth: 560,
            margin: '60px auto 0',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {[
            { n: '85%+', l: 'Accuracy', icon: 'ti-target' },
            { n: '< 2 min', l: 'Per Essay', icon: 'ti-clock' },
            { n: '70%', l: 'Less Workload', icon: 'ti-trending-down' },
          ].map(({ n, l, icon }) => (
            <div
              key={l}
              style={{
                padding: '22px 12px',
                textAlign: 'center',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <i
                className={`ti ${icon}`}
                aria-hidden="true"
                style={{
                  fontSize: 18,
                  color: 'rgba(232,197,71,0.6)',
                  display: 'block',
                  marginBottom: 6,
                }}
              />

              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  color: '#e8c547',
                  fontWeight: 700,
                }}
              >
                {n}
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.45)',
                  marginTop: 4,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how"
        style={{
          padding: '72px 20px',
          background: '#f5f7fb',
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#c9a227',
              marginBottom: 8,
            }}
          >
            Process
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              color: '#1a2e5a',
              marginBottom: 8,
            }}
          >
            How It Works
          </h2>

          <p
            style={{
              color: '#6b7a99',
              fontSize: '0.92rem',
              lineHeight: 1.7,
              marginBottom: 44,
            }}
          >
            Four simple steps from submission to grade.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: '#0a1425',
          padding: '22px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.28)',
          }}
        >
          © 2026 AI Essay Grading System · University of Malawi · Group 30
        </p>
      </footer>
    </div>
  )
}