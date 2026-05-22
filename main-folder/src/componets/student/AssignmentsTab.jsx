// // src/components/student/AssignmentsTab.jsx
// import { C } from './shared.jsx';

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
//     <div style={{ display: 'grid', gridTemplateColumns: selectedAssignment ? '340px 1fr' : '1fr', gap: '20px', alignItems: 'start' }}>

//       {/* ── Left: list ── */}
//       <div>
//         <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1830', margin: '0 0 14px' }}>
//           Your assignments
//         </p>

//         {assignments.length === 0 && (
//           <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
//             <Icon name="inbox" size={36} style={{ color: '#C0DD97', marginBottom: '12px' }} />
//             <p style={{ color: '#8884A8', fontSize: '14px' }}>No assignments yet.</p>
//           </div>
//         )}

//         {assignments.map((a, idx) => {
//           const isActive = selectedAssignment?.id === a.id;
//           return (
//             <div key={a.id ?? idx}>

//               {/* Submission status row */}
//               {a.submitted && a.submission && (() => {
//                 const sub = a.submission;
//                 const isAI = (sub.ai_detection_score ?? 0) >= 50;
//                 return (
//                   <div
//                     style={{ marginTop: '10px', background: isAI ? '#fef2f2' : '#faf5ff', border: `1px solid ${isAI ? '#fecaca' : '#e9d5ff'}`, borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
//                   >
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                       <span style={{ fontSize: '16px' }}>
//                         {sub.final_score !== null ? '✅' : isAI ? '🚨' : sub.status === 'pending' ? '⏳' : sub.ai_score !== null ? '🔍' : '⏳'}
//                       </span>
//                       <div>
//                         <p style={{ fontSize: '12px', fontWeight: '700', color: isAI ? '#dc2626' : '#6d28d9', margin: 0 }}>
//                           {sub.final_score !== null
//                             ? `Graded: ${sub.final_score}/${sub.max_score} (${Math.round((sub.final_score / sub.max_score) * 100)}%)`
//                             : isAI     ? `AI Flagged (${sub.ai_detection_score}%) — Score: 0`
//                             : sub.status === 'pending' ? 'Grading in progress...'
//                             : 'AI graded — awaiting teacher'}
//                         </p>
//                         <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Submitted {new Date(sub.submitted_at).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                     <Icon name={isActive ? 'chevron-right' : 'chevron-right'} size={16} style={{ color: '#C0BDEA', flexShrink: 0, marginTop: '2px', transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
//                   </div>
//                 );
//               })()}

//               {/* Submission preview row */}
//               {a.submitted && a.submission && (() => {
//                 const sub = a.submission;
//                 const isAI = (sub.ai_detection_score ?? 0) >= 50;
//                 const pct  = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
//                 return (
//                   <div style={{
//                     marginTop: '10px',
//                     paddingTop: '10px',
//                     borderTop: '1px solid #F0EFF8',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                     gap: '8px',
//                   }}>
//                     <span style={{ fontSize: '12px', color: '#8884A8', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                       <Icon name="clock" size={13} />
//                       {new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
//                     </span>
//                     {pct !== null ? (
//                       <span style={{ fontSize: '13px', fontWeight: '500', color: scoreColor(pct) }}>
//                         {sub.final_score}/{sub.max_score} · {pct}%
//                       </span>
//                     ) : isAI ? (
//                       <Badge color="red" icon="alert-triangle">AI flagged</Badge>
//                     ) : sub.status === 'pending' ? (
//                       <Badge color="gray" icon="loader-2">Grading…</Badge>
//                     ) : (
//                       <Badge color="amber" icon="clock">Awaiting teacher</Badge>
//                     )}
//                   </div>
//                 );
//               })()}

//             </div>
//           );
//         })}
//       </div>

//       {/* ── Right: detail panel ── */}
//       {selectedAssignment && (
//         <div style={{ position: 'sticky', top: '80px' }}>
//           <AssignmentDetail
//             assignment={selectedAssignment}
//             inline
//             onClose={() => setSelected(null)}
//             onWrite={a => { setSelected(null); onWrite(a); }}
//             onViewEssay={sub => { setSelected(null); onViewEssay(sub); }}
//             onViewResult={sub => { setSelected(null); onViewResult(sub); }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }






// src/components/student/AssignmentsTab.jsx
import { useState } from 'react';
import { C, Icon } from './shared.jsx';
import AssignmentDetail from './AssignmentDetail.jsx';

// ── Helpers ──────────────────────────────────────────────────
function scoreColor(pct) {
  if (pct >= 75) return '#3B6D11';
  if (pct >= 50) return '#B45309';
  return '#DC2626';
}

function Badge({ color, icon, children }) {
  const colors = {
    red:   { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    amber: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    gray:  { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontSize: '11px', fontWeight: '600', padding: '2px 8px',
      borderRadius: '20px', background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      <Icon name={icon} size={11} />
      {children}
    </span>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function AssignmentsTab({
  assignments,
  loading,
  onWrite,
  onViewEssay,
  onViewResult,
}) {
  const [selectedAssignment, setSelected] = useState(null);

  if (loading) {
    return (
      <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
        <div style={{
          width: '32px', height: '32px',
          border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px',
        }} />
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Loading assignments…
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: selectedAssignment ? '340px 1fr' : '1fr',
      gap: '20px',
      alignItems: 'start',
    }}>

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

        {assignments.map((a, idx) => {
          const isActive = selectedAssignment?.id === a.id;
          return (
            <div
              key={a.id ?? idx}
              onClick={() => setSelected(isActive ? null : a)}
              style={{ cursor: 'pointer' }}
            >
              {/* Submission status row */}
              {a.submitted && a.submission && (() => {
                const sub = a.submission;
                const isAI = (sub.ai_detection_score ?? 0) >= 50;
                return (
                  <div style={{
                    marginTop: '10px',
                    background: isAI ? '#fef2f2' : '#faf5ff',
                    border: `1px solid ${isAI ? '#fecaca' : '#e9d5ff'}`,
                    borderRadius: '10px', padding: '10px 14px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>
                        {sub.final_score !== null ? '✅'
                          : isAI ? '🚨'
                          : sub.status === 'pending' ? '⏳'
                          : sub.ai_score !== null ? '🔍' : '⏳'}
                      </span>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: isAI ? '#dc2626' : '#6d28d9', margin: 0 }}>
                          {sub.final_score !== null
                            ? `Graded: ${sub.final_score}/${sub.max_score} (${Math.round((sub.final_score / sub.max_score) * 100)}%)`
                            : isAI     ? `AI Flagged (${sub.ai_detection_score}%) — Score: 0`
                            : sub.status === 'pending' ? 'Grading in progress...'
                            : 'AI graded — awaiting teacher'}
                        </p>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                          Submitted {new Date(sub.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Icon
                      name="chevron-right" size={16}
                      style={{
                        color: '#C0BDEA', flexShrink: 0, marginTop: '2px',
                        transform: isActive ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.15s',
                      }}
                    />
                  </div>
                );
              })()}

              {/* Submission preview row */}
              {a.submitted && a.submission && (() => {
                const sub = a.submission;
                const isAI = (sub.ai_detection_score ?? 0) >= 50;
                const pct  = sub.final_score !== null
                  ? Math.round((sub.final_score / sub.max_score) * 100)
                  : null;
                return (
                  <div style={{
                    marginTop: '10px', paddingTop: '10px',
                    borderTop: '1px solid #F0EFF8',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '8px',
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