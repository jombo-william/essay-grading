// // src/components/student/EssayViewSheet.jsx
// import { C, Sheet } from './shared.jsx';

// export default function EssayViewSheet({ sub, canUnsubmit, onClose, onUnsubmit }) {
//   if (!sub) return null;

//   return (
//     <Sheet
//       onClose={onClose}
//       title="Your Submitted Essay"
//       subtitle={sub.assignment_title}
//       footer={
//         <div style={{ display: 'flex', gap: '10px' }}>
//           {canUnsubmit && (
//             <button
//               onClick={() => { if (window.confirm('Unsubmit? You can rewrite before the deadline.')) onUnsubmit(sub); }}
//               style={C.dBtn}
//             >
//               ↩ Unsubmit
//             </button>
//           )}
//           <button onClick={onClose} style={C.gBtn}>Close</button>
//         </div>
//       }
//     >
//       {/* Meta row */}
//       <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
//         <div>
//           <p style={{ fontSize: '11px', fontWeight: '700', color: '#7e22ce', margin: '0 0 2px' }}>SUBMITTED</p>
//           <p style={{ fontSize: '13px', color: '#6d28d9', fontWeight: '600', margin: 0 }}>{new Date(sub.submitted_at).toLocaleString()}</p>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <p style={{ fontSize: '11px', fontWeight: '700', color: '#7e22ce', margin: '0 0 2px' }}>MODE</p>
//           <p style={{ fontSize: '13px', color: '#6d28d9', fontWeight: '600', margin: 0 }}>{sub.file_name ? `📎 ${sub.file_name}` : '✏️ Written'}</p>
//         </div>
//       </div>

//       {/* Unsubmit hint */}
//       {canUnsubmit && (
//         <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', gap: '8px' }}>
//           <span>💡</span>
//           <p style={{ fontSize: '12px', color: '#c2410c', margin: 0, lineHeight: 1.5 }}>
//             You can unsubmit and rewrite before the deadline. Once graded, unsubmit is no longer available.
//           </p>
//         </div>
//       )}

//       {/* Essay text */}
//       <p style={{ ...C.sL, marginBottom: '8px' }}>
//         Essay Content · {sub.essay_text?.trim().split(/\s+/).filter(Boolean).length} words
//       </p>
//       <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', fontSize: '14px', color: '#374151', lineHeight: '1.85', whiteSpace: 'pre-wrap' }}>
//         {sub.essay_text}
//       </div>
//     </Sheet>
//   );
// }



