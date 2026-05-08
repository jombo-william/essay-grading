// // src/components/student/ResultsTab.jsx
// import { C, scoreColor, scoreLabel } from './shared.jsx';

// export default function ResultsTab({ results, loading, onOpenResult }) {
//   if (loading) {
//     return (
//       <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
//         <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
//         <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Loading results…</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px' }}>My Results</p>

//       {/* Legend */}
//       <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 16px', marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
//         {[
//           { i: '✅', l: 'Graded',          c: '#16a34a' },
//           { i: '⏳', l: 'Awaiting teacher', c: '#d97706' },
//           { i: '🚨', l: 'AI flagged',       c: '#dc2626' },
//           { i: '🤖', l: 'Grading...',       c: '#6366f1' },
//         ].map(x => (
//           <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//             <span style={{ fontSize: '13px' }}>{x.i}</span>
//             <span style={{ fontSize: '11px', color: x.c, fontWeight: '600' }}>{x.l}</span>
//           </div>
//         ))}
//       </div>

//       {results.length === 0 && (
//         <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
//           <p style={{ fontSize: '36px', margin: '0 0 10px' }}>📭</p>
//           <p style={{ fontWeight: '700', color: '#64748b', fontSize: '14px', margin: 0 }}>No submissions yet. Submit an assignment to see your results here.</p>
//         </div>
//       )}

//       {results.map(s => {
//         const pct       = s.final_score !== null ? Math.round((s.final_score / s.max_score) * 100) : null;
//         const isAI      = (s.ai_detection_score ?? 0) >= 50;
//         const isPending = s.status === 'pending';

//         return (
//           <div key={s.id}
//             style={{ ...C.card, cursor: isPending ? 'default' : 'pointer', transition: 'box-shadow 0.15s', opacity: isPending ? 0.75 : 1 }}
//             onClick={() => !isPending && onOpenResult(s)}
//             onMouseEnter={e => { if (!isPending) e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'; }}
//             onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'}
//           >
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
//               <div style={{ flex: 1 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
//                   <span style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>{s.assignment_title}</span>
//                   {s.submit_mode === 'upload' && s.file_name && <span style={C.badge('purple')}>📎 File</span>}
//                   {s.final_score !== null                               && <span style={C.badge('green')}>✅ Graded</span>}
//                   {!isPending && s.final_score === null && s.ai_score !== null && !isAI && <span style={C.badge('amber')}>⏳ Pending</span>}
//                   {!isPending && s.final_score === null && s.ai_score !== null && isAI  && <span style={C.badge('red')}>🚨 AI Flagged</span>}
//                   {isPending && <span style={C.badge('gray')}>🤖 Grading...</span>}
//                 </div>
//                 <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
//                   Submitted {new Date(s.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                 </p>
//               </div>

//               {/* Score display */}
//               <div style={{ textAlign: 'right', flexShrink: 0 }}>
//                 {s.final_score !== null ? (
//                   <div>
//                     <p style={{ fontSize: '26px', fontWeight: '900', color: scoreColor(pct), margin: 0, lineHeight: 1 }}>
//                       {s.final_score}<span style={{ fontSize: '13px', color: '#94a3b8' }}>/{s.max_score}</span>
//                     </p>
//                     <p style={{ fontSize: '12px', fontWeight: '700', color: scoreColor(pct), margin: '2px 0 0' }}>{scoreLabel(pct)} · {pct}%</p>
//                   </div>
//                 ) : isPending ? (
//                   <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//                 ) : s.ai_score !== null ? (
//                   <div>
//                     <p style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '800', margin: 0 }}>{s.ai_score}/{s.max_score}</p>
//                     <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>AI score</p>
//                   </div>
//                 ) : null}
//               </div>
//             </div>

//             {/* AI flag warning */}
//             {isAI && !isPending && (
//               <div style={{ marginTop: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
//                 <span>🚨</span>
//                 <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', margin: 0 }}>{s.ai_detection_score}% AI — automatic score: 0. Awaiting teacher review.</p>
//               </div>
//             )}

//             {/* Teacher feedback preview */}
//             {s.teacher_feedback && (
//               <div style={{ marginTop: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 12px' }}>
//                 <p style={{ fontSize: '11px', fontWeight: '700', color: '#15803d', margin: '0 0 2px' }}>👨‍🏫 Teacher Feedback</p>
//                 <p style={{ fontSize: '12px', color: '#166534', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.teacher_feedback}</p>
//               </div>
//             )}

//             {!isPending && <p style={{ fontSize: '12px', color: '#8b5cf6', margin: '10px 0 0', fontWeight: '600' }}>Tap to view full details →</p>}
//             {isPending  && <p style={{ fontSize: '12px', color: '#94a3b8', margin: '10px 0 0' }}>AI is reviewing your essay, please wait...</p>}
//           </div>
//         );
//       })}
//     </div>
//   );
// }








// src/components/student/ResultsTab.jsx
import { C, Icon, Badge, scoreColor, scoreLabel, scoreBg } from './shared.jsx';

export default function ResultsTab({ results, loading, onOpenResult }) {
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '10px', color: '#8884A8' }}>
      <Icon name="loader-2" size={20} style={{ animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: '14px' }}>Loading results…</span>
    </div>
  );

  return (
    <div>
      <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1830', margin: '0 0 14px' }}>My results</p>

      {/* Legend */}
      <div style={{
        background: '#fff', border: '1px solid #ECECF2', borderRadius: '10px',
        padding: '10px 14px', marginBottom: '14px',
        display: 'flex', flexWrap: 'wrap', gap: '14px',
      }}>
        {[
          { color: 'green', icon: 'circle-check', label: 'Graded'          },
          { color: 'amber', icon: 'clock',         label: 'Awaiting teacher'},
          { color: 'red',   icon: 'alert-triangle', label: 'AI flagged'    },
          { color: 'gray',  icon: 'loader-2',      label: 'Grading…'       },
        ].map(x => (
          <Badge key={x.label} color={x.color} icon={x.icon}>{x.label}</Badge>
        ))}
      </div>

      {results.length === 0 && (
        <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
          <Icon name="inbox" size={36} style={{ color: '#C0DD97', marginBottom: '12px' }} />
          <p style={{ color: '#8884A8', fontSize: '14px', margin: 0 }}>
            No submissions yet. Submit an assignment to see results here.
          </p>
        </div>
      )}

      {results.map(s => {
        const pct       = s.final_score !== null ? Math.round((s.final_score / s.max_score) * 100) : null;
        const isAI      = (s.ai_detection_score ?? 0) >= 50;
        const isPending = s.status === 'pending';

        return (
          <div
            key={s.id}
            style={{
              ...C.card,
              cursor: isPending ? 'default' : 'pointer',
              opacity: isPending ? 0.8 : 1,
              transition: 'box-shadow 0.15s',
            }}
            onClick={() => !isPending && onOpenResult(s)}
            onMouseEnter={e => { if (!isPending) e.currentTarget.style.boxShadow = '0 2px 12px rgba(60,52,137,0.09)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Title + badges */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '500', fontSize: '14px', color: '#1A1830' }}>{s.assignment_title}</span>
                  {s.submit_mode === 'upload' && s.file_name && <Badge color="purple" icon="paperclip">File</Badge>}
                  {s.final_score !== null                                            && <Badge color="green" icon="circle-check">Graded</Badge>}
                  {!isPending && s.final_score === null && s.ai_score !== null && !isAI && <Badge color="amber" icon="clock">Pending</Badge>}
                  {!isPending && s.final_score === null && s.ai_score !== null && isAI  && <Badge color="red" icon="alert-triangle">AI flagged</Badge>}
                  {isPending                                                          && <Badge color="gray" icon="loader-2">Grading…</Badge>}
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
      })}
    </div>
  );
}

