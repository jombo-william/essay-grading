// // src/components/student/AssignmentDetail.jsx
// import { C, Sheet } from './shared.jsx';



// // src/components/student/AssignmentDetail.jsx
// import { C, Icon, Badge, Sheet, scoreColor } from './shared.jsx';

// // `inline` prop = renders as a side panel card instead of a bottom sheet
// export default function AssignmentDetail({ assignment, inline, onClose, onWrite, onViewEssay, onViewResult }) {
//   if (!assignment) return null;
//   const a = assignment;
//   const isPast      = a.isPast;
//   const isSubmitted = a.submitted;
//   const sub         = a.submission;
//   const pct         = sub?.final_score != null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
//   const isAI        = (sub?.ai_detection_score ?? 0) >= 50;

//   const footer = !a.submitted && !a.isPast ? (
//     <button onClick={() => { onClose(); onWrite(a); }} style={{ ...C.pBtn(false), width: '100%', display: 'block' }}>
//       ✍️ Start Writing Essay
//     </button>
//   ) : a.submitted ? (
//     <div style={{ display: 'flex', gap: '10px' }}>
//       <button
//         onClick={() => { if (a.submission) { onClose(); onViewEssay(a.submission); } }}
//         style={{ ...C.gBtn, border: '1.5px solid #8b5cf6', background: 'transparent', color: '#8b5cf6' }}
//       >
//         View My Essay
//       </button>
//       {a.submission && a.submission.final_score !== null && (
//         <button onClick={() => { onClose(); onViewResult(a.submission); }} style={C.pBtn(false)}>
//           See Results →
//         </button>
//       )}
//     </div>
//   ) : (
//     <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', margin: 0 }}>⏰ Submission deadline has passed.</p>
//   );

//   return (
//     <Sheet onClose={onClose} title={a.title}
//       subtitle={`Due ${new Date(a.due_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${a.max_score} pts`}
//       footer={footer}
//     >
//       {a.submitted && (
//         <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <span style={{ fontSize: '20px' }}>✅</span>
//           <div>
//             <p style={{ fontWeight: '700', color: '#7e22ce', fontSize: '13px', margin: 0 }}>You have submitted this assignment</p>
//             <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
//               {a.submission && a.submission.final_score !== null
//                 ? `Score: ${a.submission.final_score}/${a.max_score}`
//                 : a.submission?.status === 'pending' ? 'AI grading in progress...'
//                 : a.submission?.ai_score !== null ? 'Awaiting teacher approval'
//                 : 'Grading in progress'}
//             </p>
//           </div>
//         </div>
//       )}

//       {a.isPast && !a.submitted && (
//         <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <span style={{ fontSize: '20px' }}>⏰</span>
//           <p style={{ fontWeight: '700', color: '#dc2626', fontSize: '13px', margin: 0 }}>Deadline passed — you did not submit this assignment.</p>
//         </div>
//       )}

//       <div style={{ marginBottom: '18px' }}>
//         <p style={C.sL}>About this Assignment</p>
//         <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, margin: 0 }}>{a.description}</p>
//       </div>

//       <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
//         <p style={{ ...C.sL, color: '#92400e' }}>Full Instructions</p>
//         <p style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: 1.7 }}>{a.instructions}</p>
//       </div>

//       {a.rubric && (
//         <div style={{ marginBottom: '16px' }}>
//           <span style={C.sL}>Grading rubric</span>
//           {Object.entries(a.rubric).map(([k, v]) => (
//             <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
//               <span style={{ fontSize: '12px', color: '#6B6890', textTransform: 'capitalize', fontWeight: '500', width: '100px', flexShrink: 0 }}>
//                 {k.replace(/_/g, ' ')}
//               </span>
//               <div style={{ flex: 1, height: '6px', background: '#EEEDFE', borderRadius: '3px', overflow: 'hidden' }}>
//                 <div style={{ height: '100%', width: `${v}%`, background: '#3C3489', borderRadius: '3px' }} />
//               </div>
//               <span style={{ fontSize: '12px', color: '#3C3489', fontWeight: '600', width: '32px', textAlign: 'right' }}>
//                 {v}%
//               </span>
//             </div>
//           ))}
//         </div>
//       )}

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
//         {[
//           { label: 'Max score',  value: `${a.max_score} pts`, icon: 'trophy'    },
//           { label: 'Deadline',   value: new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), icon: 'calendar' },
//           { label: 'Status',     value: isSubmitted ? 'Submitted' : isPast ? 'Not submitted' : 'Not yet submitted', icon: 'file-text' },
//           { label: 'Grading',    value: 'Automatic on submit', icon: 'check'    },
//         ].map(d => (
//           <div key={d.label} style={{
//             background: '#F8F7FF', border: '1px solid #ECECF2',
//             borderRadius: '10px', padding: '10px 12px',
//           }}>
//             <p style={{ fontSize: '11px', color: '#8884A8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
//               {d.label}
//             </p>
//             <p style={{ fontSize: '13px', color: '#1A1830', fontWeight: '500', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
//               <Icon name={d.icon} size={14} style={{ color: '#3C3489' }} />
//               {d.value}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const footer = !isSubmitted && !isPast ? (
//     <div style={{ display: 'flex', gap: '10px' }}>
//       <button style={C.gBtn} onClick={onClose}>Close</button>
//       <button style={C.pBtn(false)} onClick={() => { onClose(); onWrite(a); }}>
//         <Icon name="writing" size={16} />
//         Start writing
//       </button>
//     </div>
//   ) : isSubmitted ? (
//     <div style={{ display: 'flex', gap: '10px' }}>
//       <button style={C.gBtn} onClick={onClose}>Close</button>
//       {sub && (
//         <button
//           style={{ ...C.pBtn(false), background: '#EEEDFE', color: '#3C3489', boxShadow: 'none' }}
//           onClick={() => { onClose(); onViewEssay(sub); }}
//         >
//           <Icon name="file-text" size={16} />
//           View my essay
//         </button>
//       )}
//       {sub?.final_score != null && (
//         <button style={C.pBtn(false)} onClick={() => { onClose(); onViewResult(sub); }}>
//           <Icon name="chart-bar" size={16} />
//           See results
//         </button>
//       )}
//     </div>
//   ) : (
//     <div style={{ display: 'flex', gap: '10px' }}>
//       <button style={C.pBtn(false)} onClick={onClose}>
//         <Icon name="x" size={16} />
//         Close
//       </button>
//     </div>
//   );

//   // ── Inline side panel ──────────────────────────────────────────────────────
//   if (inline) {
//     return (
//       <div style={{
//         background: '#fff',
//         borderRadius: '14px',
//         border: '1px solid #ECECF2',
//         overflow: 'hidden',
//         boxShadow: '0 4px 24px rgba(60,52,137,0.08)',
//       }}>
//         {/* Panel header */}
//         <div style={{
//           padding: '16px 20px',
//           borderBottom: '1px solid #F0EFF8',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'flex-start',
//           gap: '12px',
//         }}>
//           <div style={{ flex: 1 }}>
//             <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1A1830', margin: '0 0 3px', lineHeight: 1.3 }}>
//               {a.title}
//             </h2>
//             <p style={{ fontSize: '12px', color: '#8884A8', margin: 0 }}>
//               Due {new Date(a.due_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {a.max_score} pts
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             aria-label="Close panel"
//             style={{
//               background: '#F1EFE8', border: 'none', borderRadius: '50%',
//               width: '28px', height: '28px', cursor: 'pointer', color: '#5F5E5A',
//               flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
//             }}
//           >
//             <Icon name="x" size={14} />
//           </button>
//         </div>

//         {/* Body */}
//         <div style={{ padding: '20px', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
//           {body}
//         </div>

//         {/* Footer */}
//         <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #F0EFF8' }}>
//           {footer}
//         </div>
//       </div>
//     );
//   }

//   // ── Bottom sheet (mobile / modal fallback) ─────────────────────────────────
//   return (
//     <Sheet
//       onClose={onClose}
//       title={a.title}
//       subtitle={`Due ${new Date(a.due_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${a.max_score} pts`}
//       footer={footer}
//     >
//       {body}
//     </Sheet>
//   );
// }






// src/components/student/AssignmentDetail.jsx

import { C, Icon, Sheet } from './shared.jsx';

// `inline` prop = renders as a side panel card instead of a bottom sheet
export default function AssignmentDetail({
  assignment,
  inline,
  onClose,
  onWrite,
  onViewEssay,
  onViewResult,
}) {
  if (!assignment) return null;

  const a = assignment;
  const isPast = a.isPast;
  const isSubmitted = a.submitted;
  const sub = a.submission;

  // ───────────────── Footer ─────────────────
  const footer = !isSubmitted && !isPast ? (
    <button
      onClick={() => {
        onClose();
        onWrite(a);
      }}
      style={{
        ...C.pBtn(false),
        width: '100%',
        display: 'block',
      }}
    >
      ✍️ Start Writing Essay
    </button>
  ) : isSubmitted ? (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={() => {
          if (sub) {
            onClose();
            onViewEssay(sub);
          }
        }}
        style={{
          ...C.gBtn,
          border: '1.5px solid #8b5cf6',
          background: 'transparent',
          color: '#8b5cf6',
        }}
      >
        View My Essay
      </button>

      {sub?.final_score != null && (
        <button
          onClick={() => {
            onClose();
            onViewResult(sub);
          }}
          style={C.pBtn(false)}
        >
          See Results →
        </button>
      )}
    </div>
  ) : (
    <p
      style={{
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '13px',
        margin: 0,
      }}
    >
      ⏰ Submission deadline has passed.
    </p>
  );

  // ───────────────── Body ─────────────────
  const body = (
    <>
      {isSubmitted && (
        <div
          style={{
            background: '#faf5ff',
            border: '1px solid #e9d5ff',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '20px' }}>✅</span>

          <div>
            <p
              style={{
                fontWeight: '700',
                color: '#7e22ce',
                fontSize: '13px',
                margin: 0,
              }}
            >
              You have submitted this assignment
            </p>

            <p
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                margin: 0,
              }}
            >
              {sub?.final_score != null
                ? `Score: ${sub.final_score}/${a.max_score}`
                : sub?.status === 'pending'
                ? 'AI grading in progress...'
                : 'Grading in progress'}
            </p>
          </div>
        </div>
      )}

      {isPast && !isSubmitted && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '20px' }}>⏰</span>

          <p
            style={{
              fontWeight: '700',
              color: '#dc2626',
              fontSize: '13px',
              margin: 0,
            }}
          >
            Deadline passed — you did not submit this assignment.
          </p>
        </div>
      )}

      {/* About */}
      <div style={{ marginBottom: '18px' }}>
        <p style={C.sL}>About this Assignment</p>

        <p
          style={{
            fontSize: '14px',
            color: '#475569',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {a.description}
        </p>
      </div>

      {/* Instructions */}
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <p style={{ ...C.sL, color: '#92400e' }}>
          Full Instructions
        </p>

        <p
          style={{
            fontSize: '14px',
            color: '#78350f',
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {a.instructions}
        </p>
      </div>

      {/* Rubric */}
      {a.rubric && (
        <div style={{ marginBottom: '16px' }}>
          <span style={C.sL}>Grading Rubric</span>

          {Object.entries(a.rubric).map(([k, v]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: '#6B6890',
                  textTransform: 'capitalize',
                  fontWeight: '500',
                  width: '100px',
                  flexShrink: 0,
                }}
              >
                {k.replace(/_/g, ' ')}
              </span>

              <div
                style={{
                  flex: 1,
                  height: '6px',
                  background: '#EEEDFE',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${v}%`,
                    background: '#3C3489',
                  }}
                />
              </div>

              <span
                style={{
                  fontSize: '12px',
                  color: '#3C3489',
                  fontWeight: '600',
                  width: '32px',
                  textAlign: 'right',
                }}
              >
                {v}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Info Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}
      >
        {[
          {
            label: 'Max score',
            value: `${a.max_score} pts`,
            icon: 'trophy',
          },
          {
            label: 'Deadline',
            value: new Date(a.due_date).toLocaleDateString(
              'en-GB',
              {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }
            ),
            icon: 'calendar',
          },
          {
            label: 'Status',
            value: isSubmitted
              ? 'Submitted'
              : isPast
              ? 'Not submitted'
              : 'Not yet submitted',
            icon: 'file-text',
          },
        ].map((d) => (
          <div
            key={d.label}
            style={{
              background: '#F8F7FF',
              border: '1px solid #ECECF2',
              borderRadius: '10px',
              padding: '10px 12px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#8884A8',
                fontWeight: '500',
                textTransform: 'uppercase',
                margin: '0 0 4px',
              }}
            >
              {d.label}
            </p>

            <p
              style={{
                fontSize: '13px',
                color: '#1A1830',
                fontWeight: '500',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icon
                name={d.icon}
                size={14}
                style={{ color: '#3C3489' }}
              />

              {d.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );

  // ───────────────── Inline Panel ─────────────────
  if (inline) {
    return (
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #ECECF2',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(60,52,137,0.08)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F0EFF8',
          }}
        >
          <h2
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1A1830',
              margin: '0 0 4px',
            }}
          >
            {a.title}
          </h2>

          <p
            style={{
              fontSize: '12px',
              color: '#8884A8',
              margin: 0,
            }}
          >
            Due{' '}
            {new Date(a.due_date).toLocaleDateString('en-GB')}
          </p>
        </div>

        <div
          style={{
            padding: '20px',
            maxHeight: 'calc(100vh - 220px)',
            overflowY: 'auto',
          }}
        >
          {body}
        </div>

        <div
          style={{
            padding: '12px 20px 16px',
            borderTop: '1px solid #F0EFF8',
          }}
        >
          {footer}
        </div>
      </div>
    );
  }

  // ───────────────── Modal / Sheet ─────────────────
  return (
    <Sheet
      onClose={onClose}
      title={a.title}
      subtitle={`Due ${new Date(a.due_date).toLocaleDateString(
        'en-GB',
        {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      )} · ${a.max_score} pts`}
      footer={footer}
    >
      {body}
    </Sheet>
  );
}