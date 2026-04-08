import { C, scoreColor, scoreLabel } from './shared.jsx';

export default function ResultsTab({ results, loading, onOpenResult }) {
  if (loading) {
    return (
      <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px'
        }} />
        <p style={{ color: '#ffffff', fontSize: '14px', margin: 0 }}>Loading results…</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: '0 0 12px' }}>My Results</p>

      {/* Legend */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '10px 16px',
        marginBottom: '14px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {[
          { i: '✅', l: 'Graded',          c: '#16a34a' },
          { i: '⏳', l: 'Awaiting teacher', c: '#d97706' },
          { i: '🚨', l: 'AI flagged',       c: '#dc2626' },
          { i: '🤖', l: 'Grading...',       c: '#6366f1' },
        ].map(x => (
          <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '13px' }}>{x.i}</span>
            <span style={{ fontSize: '11px', color: '#1a2e5a', fontWeight: '600' }}>{x.l}</span>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontSize: '36px', margin: '0 0 10px' }}>📭</p>
          <p style={{
            fontWeight: '700',
            color: '#ffffff',
            fontSize: '14px',
            margin: 0
          }}>No submissions yet. Submit an assignment to see your results here.</p>
        </div>
      )}

      {results.map(s => {
        const pct       = s.final_score !== null ? Math.round((s.final_score / s.max_score) * 100) : null;
        const isAI      = (s.ai_detection_score ?? 0) >= 50;
        const isPending = s.status === 'pending';

        return (
          <div key={s.id}
            style={{
              ...C.card,
              cursor: isPending ? 'default' : 'pointer',
              transition: 'box-shadow 0.15s',
              opacity: isPending ? 0.75 : 1
            }}
            onClick={() => !isPending && onOpenResult(s)}
            onMouseEnter={e => { if (!isPending) e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'; }}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', fontSize: '15px', color: '#ffffff' }}>{s.assignment_title}</span>
                  {s.submit_mode === 'upload' && s.file_name && <span style={C.badge('purple')}>📎 File</span>}
                  {s.final_score !== null                               && <span style={C.badge('green')}>✅ Graded</span>}
                  {!isPending && s.final_score === null && s.ai_score !== null && !isAI && <span style={C.badge('amber')}>⏳ Pending</span>}
                  {!isPending && s.final_score === null && s.ai_score !== null && isAI  && <span style={C.badge('red')}>🚨 AI Flagged</span>}
                  {isPending && <span style={C.badge('gray')}>🤖 Grading...</span>}
                </div>
                <p style={{ fontSize: '12px', color: '#ffffff', margin: 0 }}>
                  Submitted {new Date(s.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              {/* Score display */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {s.final_score !== null ? (
                  <div>
                    <p style={{
                      fontSize: '26px',
                      fontWeight: '900',
                      color: scoreColor(pct),
                      margin: 0,
                      lineHeight: 1
                    }}>
                      {s.final_score}<span style={{ fontSize: '13px', color: '#ffffff' }}>/{s.max_score}</span>
                    </p>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: scoreColor(pct),
                      margin: '2px 0 0'
                    }}>{scoreLabel(pct)} · {pct}%</p>
                  </div>
                ) : isPending ? (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    border: '3px solid #e2e8f0',
                    borderTopColor: '#8b5cf6',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                ) : s.ai_score !== null ? (
                  <div>
                    <p style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '800', margin: 0 }}>{s.ai_score}/{s.max_score}</p>
                    <p style={{ fontSize: '11px', color: '#1a2e5a', margin: '2px 0 0' }}>AI score</p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* AI flag warning */}
            {isAI && !isPending && (
              <div style={{
                marginTop: '10px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center'
              }}>
                <span>🚨</span>
                <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', margin: 0 }}>
                  {s.ai_detection_score}% AI — automatic score: 0. Awaiting teacher review.
                </p>
              </div>
            )}

            {/* Teacher feedback preview */}
            {s.teacher_feedback && (
              <div style={{
                marginTop: '10px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '8px 12px'
              }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#15803d', margin: '0 0 2px' }}>👨‍🏫 Teacher Feedback</p>
                <p style={{
                  fontSize: '12px',
                  color: '#166534',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{s.teacher_feedback}</p>
              </div>
            )}

            {!isPending && <p style={{ fontSize: '12px', color: '#8b5cf6', margin: '10px 0 0', fontWeight: '600' }}>Tap to view full details →</p>}
            {isPending  && <p style={{ fontSize: '12px', color: '#94a3b8', margin: '10px 0 0' }}>AI is reviewing your essay, please wait...</p>}
          </div>
        );
      })}
    </div>
  );
}