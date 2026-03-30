
import { C, Sheet, scoreColor, scoreLabel } from './shared.jsx';

export default function AssignmentsTab({
  assignments,   
  loading,
  onOpenDetail,  
}) {
  if (loading) {
    return (
      <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Loading assignments…</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px' }}>Your Assignments</p>

      {assignments.length === 0 && (
        <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontSize: '36px', margin: '0 0 10px' }}>📭</p>
          <p style={{ fontWeight: '700', color: '#64748b', fontSize: '14px', margin: 0 }}>No assignments available yet.</p>
        </div>
      )}

      {assignments.map(a => (
        <div key={a.id}
          onClick={() => onOpenDetail(a)}
          style={{ ...C.card, borderLeft: `4px solid ${a.submitted ? '#8b5cf6' : a.isPast ? '#ef4444' : '#6366f1'}`, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '5px' }}>
                <span style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>{a.title}</span>
                {a.submitted  && <span style={C.badge('purple')}>✅ Submitted</span>}
                {a.isPast && !a.submitted && <span style={C.badge('red')}>⏰ Past Due</span>}
                {!a.submitted && !a.isPast && <span style={C.badge('blue')}>📬 Open</span>}
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.5 }}>{a.description}</p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>📅 Due {new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>🏆 {a.max_score} pts</span>
              </div>
            </div>
            <span style={{ fontSize: '18px', color: '#94a3b8', flexShrink: 0 }}>→</span>
          </div>

          {}
          {a.submitted && a.submission && (() => {
            const sub = a.submission;
            const isAI = (sub.ai_detection_score ?? 0) >= 50;
            return (
              <div
                style={{ marginTop: '10px', background: isAI ? '#fef2f2' : '#faf5ff', border: `1px solid ${isAI ? '#fecaca' : '#e9d5ff'}`, borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>
                    {sub.final_score !== null ? '✅' : isAI ? '🚨' : sub.status === 'pending' ? '⏳' : sub.ai_score !== null ? '🔍' : '⏳'}
                  </span>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: isAI ? '#dc2626' : '#6d28d9', margin: 0 }}>
                      {sub.final_score !== null
                        ? `Graded: ${sub.final_score}/${sub.max_score} (${Math.round((sub.final_score / sub.max_score) * 100)}%)`
                        : isAI     ? `AI Flagged (${sub.ai_detection_score}%) — Score: 0`
                        : sub.status === 'pending' ? 'Grading in progress...'
                        : 'AI graded — awaiting teacher'}
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Submitted {new Date(sub.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {sub.final_score !== null && <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '700' }}>See feedback →</span>}
                </div>
              </div>
            );
          })()}
        </div>
      ))}
    </div>
  );
}