



// src/components/student/ResultDetailSheet.jsx
<<<<<<< HEAD
import { useState } from 'react';
import { C, Icon, Sheet, scoreColor, scoreLabel, scoreBg } from './shared.jsx';
=======
>>>>>>> HomePage

import { useState, useEffect } from 'react';
import { C, Sheet, scoreLabel } from './shared.jsx';

// ─────────────────────────────────────────────────────────────
// THEME TOKENS
// ─────────────────────────────────────────────────────────────
const NAVY = '#1a2e5a';
const NAVY_DARK = '#0f1d3a';
const GOLD = '#c9a227';

// ─────────────────────────────────────────────────────────────
// RADAR CHART (Rubric visualisation)
// ─────────────────────────────────────────────────────────────
function RadarChart({ breakdown, size = 200 }) {
  if (!breakdown?.length) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const n = breakdown.length;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const points = breakdown.map((b, i) => {
    const ratio = b.pct / 100;
    return {
      x: cx + r * ratio * Math.cos(angle(i)),
      y: cy + r * ratio * Math.sin(angle(i)),
      gridX: cx + r * Math.cos(angle(i)),
      gridY: cy + r * Math.sin(angle(i)),
      labelX: cx + (r + 22) * Math.cos(angle(i)),
      labelY: cy + (r + 22) * Math.sin(angle(i)),
      label: b.criterion,
      pct: b.pct,
    };
  });

  const polygon = (pts) => pts.map((p) => `${p.x},${p.y}`).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((lvl, i) => (
        <polygon
          key={i}
          points={polygon(
            breakdown.map((_, idx) => ({
              x: cx + r * lvl * Math.cos(angle(idx)),
              y: cy + r * lvl * Math.sin(angle(idx)),
            }))
          )}
          fill="none"
          stroke="#e2e8f0"
        />
      ))}

      {points.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.gridX} y2={p.gridY} stroke="#e2e8f0" />
      ))}

      <polygon
        points={polygon(points)}
        fill={`${NAVY}22`}
        stroke={NAVY}
        strokeWidth="2"
      />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={NAVY} />
      ))}

      {points.map((p, i) => (
        <text
          key={i}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          fontSize="9"
          fill="#475569"
        >
          {p.label}
          <tspan x={p.labelX} dy="12" fontSize="8" fill={NAVY}>
            {p.pct}%
          </tspan>
        </text>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SENTENCE AI ANALYSIS
// ─────────────────────────────────────────────────────────────
function analyzeSentences(text, aiPct) {
  if (!text) return [];

  const sentences = text.split(/(?<=[.!?])\s+/);

  return sentences.map((sentence, i) => {
    const lower = sentence.toLowerCase();

    const generic = [
      'furthermore',
      'in conclusion',
      'it is important',
      'on the other hand',
      'significantly',
    ];

    const hasGeneric = generic.some((g) => lower.includes(g));

    let risk = 10;
    if (hasGeneric) risk += 35;
    if (sentence.length > 120) risk += 15;

    risk = Math.min(95, Math.round(risk * ((aiPct || 0) / 50)));

    return { sentence, risk, i };
  });
}

function SentenceHighlighter({ text, aiPct }) {
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = useState([]);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    setData(analyzeSentences(text, aiPct));
  }, [text, aiPct]);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={C.sL}>Your Submission</span>

        {aiPct > 0 && (
          <button
            onClick={() => setEnabled(!enabled)}
            style={{
              padding: '5px 10px',
              borderRadius: 20,
              border: `1px solid ${NAVY}`,
              background: enabled ? '#fef2f2' : '#f1f5f9',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            🔬 AI Scan
          </button>
        )}
      </div>

      <p style={{ fontSize: 13, lineHeight: 1.8 }}>
        {data.map((s, i) => (
          <span
            key={i}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(null)}
            style={{
              background: enabled && s.risk > 40 ? '#fee2e2' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {s.sentence + ' '}
          </span>
        ))}
      </p>

      {hover && hover.risk > 40 && (
        <div
          style={{
            position: 'fixed',
            top: 100,
            left: 100,
            background: '#111',
            color: '#fff',
            padding: 6,
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          AI Risk: {hover.risk}%
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// IMPROVEMENT COACH
// ─────────────────────────────────────────────────────────────
function ImprovementCoach({ submission }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: 12,
          background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`,
          color: '#fff',
          borderRadius: 10,
          border: 'none',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        🧠 AI Writing Coach
      </button>

      {open && (
        <div style={{ marginTop: 10, padding: 12, background: '#f8fafc' }}>
          <p style={{ fontSize: 13 }}>
            AI coaching feature placeholder (Gemini integration already in your
            original logic).
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ResultDetailSheet({
  sub,
  canUnsubmit,
  onClose,
  onUnsubmit,
}) {
  const [tab, setTab] = useState('overview');

  if (!sub) return null;

<<<<<<< HEAD
  const [showFeedback, setShowFeedback] = useState(false);

  const pct   = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
  const isAI  = (sub.ai_detection_score ?? 0) >= 50;
  const words = sub.essay_text?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const hasFeedback = sub.ai_feedback || sub.teacher_feedback;
=======
  const pct =
    sub.final_score !== null
      ? Math.round((sub.final_score / sub.max_score) * 100)
      : null;

  const isAI = (sub.ai_detection_score ?? 0) >= 50;
>>>>>>> HomePage

  return (
    <Sheet
      onClose={onClose}
      title={sub.assignment_title}
      subtitle={new Date(sub.submitted_at).toLocaleDateString()}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          {canUnsubmit && (
            <button
<<<<<<< HEAD
              style={C.dBtn}
              onClick={() => { if (window.confirm('Unsubmit this essay?')) onUnsubmit(sub); }}
            >
              <Icon name="arrow-back-up" size={15} />
              Unsubmit
            </button>
          )}
          <button style={C.gBtn} onClick={onClose}>Close</button>
        </div>
      }
    >

      {/* ── Compact score banner ── */}
      {pct !== null ? (
        <div style={{
          background: scoreBg(pct),
          border: `1px solid ${pct >= 70 ? '#C0DD97' : pct >= 50 ? '#FAC775' : '#F7C1C1'}`,
          borderRadius: '12px', padding: '14px 18px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: scoreColor(pct), textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>
              Final score
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: scoreColor(pct), margin: 0, lineHeight: 1 }}>
              {sub.final_score}
              <span style={{ fontSize: '15px', opacity: 0.6 }}>/{sub.max_score}</span>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '22px', fontWeight: '600', color: scoreColor(pct), margin: '0 0 2px' }}>{pct}%</p>
            <span style={{
              background: '#fff', color: scoreColor(pct),
              fontSize: '11px', fontWeight: '500', padding: '2px 10px', borderRadius: '20px',
            }}>
              {scoreLabel(pct)}
            </span>
          </div>
        </div>

      ) : isAI ? (
        <div style={{
          background: '#FCEBEB', border: '1px solid #F7C1C1',
          borderRadius: '12px', padding: '12px 16px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <Icon name="alert-triangle" size={20} style={{ color: '#A32D2D', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: '600', color: '#791F1F', fontSize: '13px', margin: '0 0 2px' }}>AI content detected</p>
            <p style={{ fontSize: '12px', color: '#A32D2D', margin: 0 }}>
              {sub.ai_detection_score}% AI · automatic score: 0 · awaiting teacher review
            </p>
          </div>
        </div>

      ) : sub.ai_score !== null ? (
        <div style={{
          background: '#FAEEDA', border: '1px solid #FAC775',
          borderRadius: '12px', padding: '12px 16px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <Icon name="clock" size={20} style={{ color: '#854F0B', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: '600', color: '#633806', fontSize: '13px', margin: '0 0 2px' }}>Awaiting teacher approval</p>
            <p style={{ fontSize: '12px', color: '#854F0B', margin: 0 }}>
              Suggested score: {sub.ai_score}/{sub.max_score}
            </p>
          </div>
        </div>

      ) : (
        <div style={{
          background: '#EEEDFE', border: '1px solid #CECBF6',
          borderRadius: '12px', padding: '12px 16px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <Icon name="loader-2" size={18} style={{ color: '#3C3489', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
          <p style={{ fontWeight: '600', color: '#26215C', margin: 0, fontSize: '13px' }}>Grading in progress…</p>
        </div>
      )}

      {/* ── AI detection bar (compact) ── */}
      {sub.ai_detection_score !== null && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={C.sL}>AI detection</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: isAI ? '#A32D2D' : '#3B6D11' }}>
              {sub.ai_detection_score}%
            </span>
          </div>
          <div style={{ height: '5px', background: '#F1EFE8', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${sub.ai_detection_score}%`, background: isAI ? '#A32D2D' : '#3B6D11', borderRadius: '3px' }} />
            <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: '#D3D1C7' }} />
          </div>
        </div>
      )}

      {/* ── Collapsible feedback ── */}
      {hasFeedback && (
        <div style={{ marginBottom: '14px' }}>
          <button
            onClick={() => setShowFeedback(v => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#F8F7FF', border: '1px solid #ECECF2', borderRadius: showFeedback ? '10px 10px 0 0' : '10px',
              padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#3C3489', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="message-2" size={14} style={{ color: '#3C3489' }} />
              View feedback
            </span>
            <Icon name={showFeedback ? 'chevron-up' : 'chevron-down'} size={14} style={{ color: '#8884A8' }} />
          </button>

          {showFeedback && (
            <div style={{ border: '1px solid #ECECF2', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
              {sub.ai_feedback && (
                <div style={{ padding: '12px 14px', background: '#E6F1FB', borderBottom: sub.teacher_feedback ? '1px solid #B5D4F4' : 'none' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
                    AI feedback
                  </p>
                  <p style={{ fontSize: '13px', color: '#1A1830', margin: 0, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                    {sub.ai_feedback}
                  </p>
                </div>
              )}
              {sub.teacher_feedback && (
                <div style={{ padding: '12px 14px', background: '#EAF3DE' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#3B6D11', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
                    Teacher feedback
                  </p>
                  <p style={{ fontSize: '13px', color: '#1A1830', margin: 0, lineHeight: 1.75 }}>
                    {sub.teacher_feedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Essay text ── */}
      <div style={{ background: '#F8F7FF', border: '1px solid #ECECF2', borderRadius: '12px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={C.sL}>Your submission</span>
          <span style={{ fontSize: '11px', color: '#8884A8' }}>
            {words} words{sub.file_name ? ` · ${sub.file_name}` : ''}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#44425C', lineHeight: 1.85, margin: 0, whiteSpace: 'pre-wrap' }}>
          {sub.essay_text}
        </p>
      </div>

=======
              onClick={() => onUnsubmit(sub)}
              style={C.dBtn}
            >
              ↩ Unsubmit
            </button>
          )}
          <button onClick={onClose} style={C.gBtn}>
            Close
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {['overview', 'ai', 'coach'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 8,
              border: 'none',
              background: tab === t ? NAVY : '#f1f5f9',
              color: tab === t ? '#fff' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <>
          <div
            style={{
              background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`,
              color: '#fff',
              padding: 20,
              borderRadius: 14,
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: 48, margin: 0 }}>
              {sub.final_score ?? '—'}/{sub.max_score}
            </h1>
            <p>{pct}% • {scoreLabel(pct)}</p>
          </div>

          <SentenceHighlighter text={sub.essay_text} aiPct={0} />
        </>
      )}

      {/* AI TAB */}
      {tab === 'ai' && (
        <SentenceHighlighter
          text={sub.essay_text}
          aiPct={sub.ai_detection_score}
        />
      )}

      {/* COACH TAB */}
      {tab === 'coach' && (
        <ImprovementCoach submission={sub} />
      )}
>>>>>>> HomePage
    </Sheet>
  );
}