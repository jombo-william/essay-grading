


// // src/componets/student/AssignmentDetail.jsx
// import { useState } from 'react';
// import { C, Sheet } from './shared.jsx';

// export default function AssignmentDetail({ assignment, onClose, onWrite, onViewEssay, onViewResult }) {
//   if (!assignment) return null;
//   const a = assignment;

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
//       {/* Submitted banner */}
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

//       {/* Past due + not submitted */}
//       {a.isPast && !a.submitted && (
//         <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <span style={{ fontSize: '20px' }}>⏰</span>
//           <p style={{ fontWeight: '700', color: '#dc2626', fontSize: '13px', margin: 0 }}>Deadline passed — you did not submit this assignment.</p>
//         </div>
//       )}

//       {/* Description */}
//       <div style={{ marginBottom: '18px' }}>
//         <p style={C.sL}>About this Assignment</p>
//         <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, margin: 0 }}>{a.description}</p>
//       </div>

//       {/* Instructions */}
//       <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
//         <p style={{ ...C.sL, color: '#92400e' }}>Full Instructions</p>
//         <p style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: 1.7 }}>{a.instructions}</p>
//       </div>

//       {/* Reference Material from teacher */}
//       {a.reference_material && a.reference_material.trim() && (
//         <ReferenceSection text={a.reference_material} />
//       )}

//       {/* Rubric */}
//       {a.rubric && (
//         <div style={{ marginBottom: '16px' }}>
//           <p style={C.sL}>Grading Rubric</p>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//             {Object.entries(a.rubric).map(([k, v]) => (
//               <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <span style={{ fontSize: '13px', color: '#475569', textTransform: 'capitalize', fontWeight: '600', width: '100px', flexShrink: 0 }}>{k}</span>
//                 <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
//                   <div style={{ height: '100%', width: `${v}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: '4px' }} />
//                 </div>
//                 <span style={{ fontSize: '13px', color: '#8b5cf6', fontWeight: '800', width: '36px', textAlign: 'right' }}>{v}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Info grid */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
//         {[
//           { label: 'Maximum Score', value: `${a.max_score} points`, icon: '🏆' },
//           { label: 'Deadline',      value: new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), icon: '📅' },
//           { label: 'Submission',    value: a.submitted ? 'Submitted ✅' : a.isPast ? 'Not submitted' : 'Not yet submitted', icon: '📝' },
//           { label: 'AI Grading',    value: 'Automatic on submit', icon: '🤖' },
//         ].map(d => (
//           <div key={d.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
//             <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 3px' }}>{d.label}</p>
//             <p style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600', margin: 0 }}>{d.icon} {d.value}</p>
//           </div>
//         ))}
//       </div>
//     </Sheet>
//   );
// }

// // ── Reference Material collapsible section ────────────────────────────────────
// function ReferenceSection({ text }) {
//   const [expanded, setExpanded] = useState(false);
//   const hasMore = text.length > 300;

//   return (
//     <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <p style={{ fontSize: '12px', fontWeight: '800', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
//           📚 Reference Material
//         </p>
//         <span style={{ fontSize: '11px', color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '20px', fontWeight: '700' }}>
//           From Teacher
//         </span>
//       </div>
//       <p style={{ fontSize: '12px', color: '#0369a1', margin: '0 0 10px', fontStyle: 'italic' }}>
//         Use this material to guide and support your essay.
//       </p>
//       <div style={{
//         fontSize: '13px', color: '#1e293b', lineHeight: '1.75',
//         whiteSpace: 'pre-wrap', wordBreak: 'break-word',
//         maxHeight: expanded ? 'none' : '180px',
//         overflow: 'hidden',
//         position: 'relative',
//       }}>
//         {expanded ? text : text.slice(0, 300)}
//         {!expanded && hasMore && (
//           <div style={{
//             position: 'absolute', bottom: 0, left: 0, right: 0,
//             height: '60px',
//             background: 'linear-gradient(to bottom, transparent, #f0f9ff)',
//           }} />
//         )}
//       </div>
//       {hasMore && (
//         <button
//           onClick={() => setExpanded(e => !e)}
//           style={{
//             marginTop: '10px', background: 'none', border: '1.5px solid #7dd3fc',
//             borderRadius: '8px', padding: '5px 14px', color: '#0284c7',
//             fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
//           }}
//         >
//           {expanded ? '▲ Show less' : '▼ Read full reference'}
//         </button>
//       )}
//     </div>
//   );
// }




