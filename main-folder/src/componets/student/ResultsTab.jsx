// src/components/student/ResultsTab.jsx
import { C, Icon, Badge, scoreColor, scoreLabel, scoreBg } from './shared.jsx';

function ResultCard({ s, onClick }) {
  const pct = s.final_score !== null ? Math.round((s.final_score / s.max_score) * 100) : null;
  const isAI = (s.ai_detection_score ?? 0) >= 50;
  const isPending = s.status === 'pending' || (s.ai_detection_score === null && s.ai_score === null);

  return (
    <div
      style={{
        ...C.card,
        cursor: isPending ? 'default' : 'pointer',
        opacity: isPending ? 0.8 : 1,
        transition: 'box-shadow 0.15s',
      }}
      onClick={() => !isPending && onClick(s)}
      onMouseEnter={e => { if (!isPending) e.currentTarget.style.boxShadow = '0 2px 12px rgba(60,52,137,0.09)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title + badges */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontWeight: '500', fontSize: '14px', color: '#1A1830' }}>{s.assignment_title}</span>
            {s.submit_mode === 'upload' && s.file_name && <Badge color="purple" icon="paperclip">File</Badge>}
            {s.final_score !== null && <Badge color="green" icon="circle-check">Graded</Badge>}
            {!isPending && s.final_score === null && s.ai_score !== null && !isAI && <Badge color="amber" icon="clock">Pending</Badge>}
            {!isPending && s.final_score === null && s.ai_score !== null && isAI && <Badge color="red" icon="alert-triangle">AI flagged</Badge>}
            {isPending && <Badge color="gray" icon="loader-2">Grading…</Badge>}
          </div>

          <p style={{ fontSize: '12px', color: '#8884A8', margin: 0 }}>
            Submitted {new Date(s.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {pct !== null ? (
            <div>
              <p style={{ fontSize: '24px', fontWeight: '600', color: scoreColor(pct), margin: 0, lineHeight: 1 }}>
                {s.final_score}
                <span style={{ fontSize: '13px', color: '#8884A8' }}>/{s.max_score}</span>
              </p>
              <p style={{ fontSize: '12px', fontWeight: '500', color: scoreColor(pct), margin: '2px 0 0' }}>
                {scoreLabel(pct)} · {pct}%
              </p>
            </div>
          ) : isPending ? (
            <Icon name="loader-2" size={22} style={{ color: '#3C3489', animation: 'spin 0.8s linear infinite' }} />
          ) : s.ai_score !== null ? (
            <div>
              <p style={{ fontSize: '14px', color: '#3C3489', fontWeight: '500', margin: 0 }}>
                {s.ai_score}/{s.max_score}
              </p>
              <p style={{ fontSize: '11px', color: '#8884A8', margin: '2px 0 0' }}>AI score</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* AI warning */}
      {isAI && !isPending && (
        <div style={{
          marginTop: '10px', background: '#FCEBEB', border: '1px solid #F7C1C1',
          borderRadius: '8px', padding: '8px 12px',
          display: 'flex', gap: '6px', alignItems: 'center',
        }}>
          <Icon name="alert-triangle" size={14} style={{ color: '#A32D2D', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: '#791F1F', fontWeight: '500', margin: 0 }}>
            {s.ai_detection_score}% AI detected — automatic score: 0. Awaiting teacher review.
          </p>
        </div>
      )}

      {/* Teacher feedback preview */}
      {s.teacher_feedback && (
        <div style={{
          marginTop: '10px', background: '#EAF3DE', border: '1px solid #C0DD97',
          borderRadius: '8px', padding: '8px 12px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#3B6D11', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="message-circle" size={12} />Teacher feedback
          </p>
          <p style={{ fontSize: '12px', color: '#27500A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {s.teacher_feedback}
          </p>
        </div>
      )}

      {!isPending && (
        <p style={{ fontSize: '12px', color: '#3C3489', margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Icon name="arrow-right" size={13} />
          View full details
        </p>
      )}
      {isPending && (
        <p style={{ fontSize: '12px', color: '#8884A8', margin: '10px 0 0' }}>
          Reviewing your essay, please wait…
        </p>
      )}
    </div>
  );
}

// ─── RESULTS TAB (main export) ─────────────────────────────────────────────
export default function ResultsTab({ results, loading, onOpenResult, studentName }) {
  if (loading) {
    return (
      <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'48px 24px', textAlign:'center' }}>
        <div style={{ width:32, height:32, border:`3px solid #e2e8f0`, borderTopColor:NAVY, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
        <p style={{ color:'#94a3b8', fontSize:14, margin:0 }}>Loading results…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header + legend */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <p style={{ fontSize:20, fontWeight:800, color:'#1e293b', margin:0 }}>My Results</p>
          <p style={{ fontSize:13, color:'#94a3b8', margin:'2px 0 0' }}>Click any card to view full feedback</p>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          {[{i:'✅',l:'Graded',c:'#16a34a'},{i:'⏳',l:'Pending',c:'#d97706'},{i:'🚨',l:'AI flagged',c:'#dc2626'},{i:'🤖',l:'Grading',c:NAVY}].map(x => (
            <div key={x.l} style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:12 }}>{x.i}</span>
              <span style={{ fontSize:11, color:x.c, fontWeight:600 }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>

      {results.length === 0 && (
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'48px 24px', textAlign:'center' }}>
          <p style={{ fontSize:36, margin:'0 0 10px' }}>📭</p>
          <p style={{ fontWeight:700, color:'#64748b', fontSize:14, margin:0 }}>No submissions yet. Submit an assignment to see your results here.</p>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(480px,1fr))', gap:0 }}>
        {results.map(s => (
          <ResultCard key={s.id} s={s} onClick={onOpenResult} />
        ))}
      </div>

      {/* AI Learning Progress Tracker */}
      <LearningProgressTracker submissions={results} studentName={studentName || 'Student'} />
    </div>
  );
}
