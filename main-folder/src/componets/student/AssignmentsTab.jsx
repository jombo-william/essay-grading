
// import { C, Sheet, scoreColor, scoreLabel } from './shared.jsx';

// export default function AssignmentsTab({
//   assignments,   
//   loading,
//   onOpenDetail,  
// }) {
//   if (loading) {
//     return (
//       <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
//         <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
//         <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Loading assignments…</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px' }}>Your Assignments</p>

//       {assignments.length === 0 && (
//         <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
//           <p style={{ fontSize: '36px', margin: '0 0 10px' }}>📭</p>
//           <p style={{ fontWeight: '700', color: '#64748b', fontSize: '14px', margin: 0 }}>No assignments available yet.</p>
//         </div>
//       )}

//       {assignments.map(a => (
//         <div key={a.id}
//           onClick={() => onOpenDetail(a)}
//           style={{ ...C.card, borderLeft: `4px solid ${a.submitted ? '#8b5cf6' : a.isPast ? '#ef4444' : '#6366f1'}`, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
//           onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'}
//           onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'}
//         >
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
//             <div style={{ flex: 1 }}>
//               <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '5px' }}>
//                 <span style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>{a.title}</span>
//                 {a.submitted  && <span style={C.badge('purple')}>✅ Submitted</span>}
//                 {a.isPast && !a.submitted && <span style={C.badge('red')}>⏰ Past Due</span>}
//                 {!a.submitted && !a.isPast && <span style={C.badge('blue')}>📬 Open</span>}
//               </div>
//               <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.5 }}>{a.description}</p>
//               <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
//                 <span style={{ fontSize: '12px', color: '#94a3b8' }}>📅 Due {new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                 <span style={{ fontSize: '12px', color: '#94a3b8' }}>🏆 {a.max_score} pts</span>
//               </div>
//             </div>
//             <span style={{ fontSize: '18px', color: '#94a3b8', flexShrink: 0 }}>→</span>
//           </div>

//           {}
//           {a.submitted && a.submission && (() => {
//             const sub = a.submission;
//             const isAI = (sub.ai_detection_score ?? 0) >= 50;
//             return (
//               <div
//                 style={{ marginTop: '10px', background: isAI ? '#fef2f2' : '#faf5ff', border: `1px solid ${isAI ? '#fecaca' : '#e9d5ff'}`, borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
//               >
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <span style={{ fontSize: '16px' }}>
//                     {sub.final_score !== null ? '✅' : isAI ? '🚨' : sub.status === 'pending' ? '⏳' : sub.ai_score !== null ? '🔍' : '⏳'}
//                   </span>
//                   <div>
//                     <p style={{ fontSize: '12px', fontWeight: '700', color: isAI ? '#dc2626' : '#6d28d9', margin: 0 }}>
//                       {sub.final_score !== null
//                         ? `Graded: ${sub.final_score}/${sub.max_score} (${Math.round((sub.final_score / sub.max_score) * 100)}%)`
//                         : isAI     ? `AI Flagged (${sub.ai_detection_score}%) — Score: 0`
//                         : sub.status === 'pending' ? 'Grading in progress...'
//                         : 'AI graded — awaiting teacher'}
//                     </p>
//                     <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Submitted {new Date(sub.submitted_at).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: '6px' }}>
//                   {sub.final_score !== null && <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '700' }}>See feedback →</span>}
//                 </div>
//               </div>
//             );
//           })()}
//         </div>
//       ))}
//     </div>
//   );
// }




// src/components/student/AssignmentsTab.jsx
import { useState } from 'react';
import { C, Icon, Badge, scoreColor, scoreLabel, scoreBg } from './shared.jsx';
import AssignmentDetail from './AssignmentDetail.jsx';

const STATUS = {
  open:      { color: 'purple', icon: 'circle-dot',  label: 'Open'      },
  submitted: { color: 'green',  icon: 'circle-check', label: 'Submitted' },
  past:      { color: 'red',    icon: 'clock-off',    label: 'Past due'  },
};

function getStatus(a) {
  if (a.submitted) return 'submitted';
  if (a.isPast)    return 'past';
  return 'open';
}

const BORDER = { open: '#3C3489', submitted: '#3B6D11', past: '#A32D2D' };

export default function AssignmentsTab({ assignments, loading, onWrite, onViewEssay, onViewResult }) {
  const [selected, setSelected] = useState(null);

  const selectedAssignment = assignments.find(a => a.id === selected) || null;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '10px', color: '#8884A8' }}>
      <Icon name="loader-2" size={20} style={{ animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: '14px' }}>Loading assignments…</span>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedAssignment ? '340px 1fr' : '1fr', gap: '20px', alignItems: 'start' }}>

      {/* ── Left: list ── */}
      <div>
        <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1830', margin: '0 0 14px' }}>
          Your assignments
        </p>

        {assignments.length === 0 && (
          <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
            <Icon name="inbox" size={36} style={{ color: '#C0DD97', marginBottom: '12px' }} />
            <p style={{ color: '#8884A8', fontSize: '14px' }}>No assignments yet.</p>
          </div>
        )}

        {assignments.map(a => {
          const st   = getStatus(a);
          const s    = STATUS[st];
          const isActive = selected === a.id;

          return (
            <div
              key={a.id}
              onClick={() => setSelected(isActive ? null : a.id)}
              style={{
                ...C.card,
                borderLeft: `3px solid ${BORDER[st]}`,
                cursor: 'pointer',
                transition: 'box-shadow 0.15s, border-color 0.15s',
                outline: isActive ? `2px solid ${BORDER[st]}` : 'none',
                outlineOffset: '0px',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.boxShadow = '0 2px 12px rgba(60,52,137,0.09)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '500', fontSize: '14px', color: '#1A1830' }}>{a.title}</span>
                    <Badge color={s.color} icon={s.icon}>{s.label}</Badge>
                  </div>
                  <p style={{ fontSize: '12px', color: '#8884A8', margin: '0 0 8px', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.description}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#8884A8' }}>
                      <Icon name="calendar" size={13} />
                      {new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#8884A8' }}>
                      <Icon name="trophy" size={13} />
                      {a.max_score} pts
                    </span>
                  </div>
                </div>
                <Icon name={isActive ? 'chevron-right' : 'chevron-right'} size={16} style={{ color: '#C0BDEA', flexShrink: 0, marginTop: '2px', transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
              </div>

              {/* Submission preview row */}
              {a.submitted && a.submission && (() => {
                const sub = a.submission;
                const isAI = (sub.ai_detection_score ?? 0) >= 50;
                const pct  = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
                return (
                  <div style={{
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '1px solid #F0EFF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}>
                    <span style={{ fontSize: '12px', color: '#8884A8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Icon name="clock" size={13} />
                      {new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    {pct !== null ? (
                      <span style={{ fontSize: '13px', fontWeight: '500', color: scoreColor(pct) }}>
                        {sub.final_score}/{sub.max_score} · {pct}%
                      </span>
                    ) : isAI ? (
                      <Badge color="red" icon="alert-triangle">AI flagged</Badge>
                    ) : sub.status === 'pending' ? (
                      <Badge color="gray" icon="loader-2">Grading…</Badge>
                    ) : (
                      <Badge color="amber" icon="clock">Awaiting teacher</Badge>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* ── Right: detail panel ── */}
      {selectedAssignment && (
        <div style={{ position: 'sticky', top: '80px' }}>
          <AssignmentDetail
            assignment={selectedAssignment}
            inline
            onClose={() => setSelected(null)}
            onWrite={a => { setSelected(null); onWrite(a); }}
            onViewEssay={sub => { setSelected(null); onViewEssay(sub); }}
            onViewResult={sub => { setSelected(null); onViewResult(sub); }}
          />
        </div>
      )}
    </div>
  );
}