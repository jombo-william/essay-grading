



// src/components/student/ResultDetailSheet.jsx

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

  const pct =
    sub.final_score !== null
      ? Math.round((sub.final_score / sub.max_score) * 100)
      : null;

  const isAI = (sub.ai_detection_score ?? 0) >= 50;

  return (
    <Sheet
      onClose={onClose}
      title={sub.assignment_title}
      subtitle={new Date(sub.submitted_at).toLocaleDateString()}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          {canUnsubmit && (
            <button
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
    </Sheet>
  );
}