



// // src/components/teacher/StudentsTab.jsx
// // No external CSS — all styles inline. Uses Tabler Icons via shared.jsx Icon component.

// import { useState, useMemo } from 'react';
// import { Icon, Badge } from './shared.jsx';

// // ── HELPERS ───────────────────────────────────────────────────────────────────
// const scoreColor   = p => p >= 70 ? '#3B6D11' : p >= 50 ? '#854F0B' : '#A32D2D';
// const scoreBg      = p => p >= 70 ? '#EAF3DE' : p >= 50 ? '#FAEEDA' : '#FCEBEB';
// const scoreBorder  = p => p >= 70 ? '#C0DD97' : p >= 50 ? '#FAC775' : '#F7C1C1';

// const aiColor  = s => s >= 50 ? '#A32D2D' : s >= 30 ? '#854F0B' : '#3B6D11';
// const aiBg     = s => s >= 50 ? '#FCEBEB' : s >= 30 ? '#FAEEDA' : '#EAF3DE';
// const aiBorder = s => s >= 50 ? '#F7C1C1' : s >= 30 ? '#FAC775' : '#C0DD97';
// const aiIcon   = s => s >= 50 ? 'alert-triangle' : s >= 30 ? 'alert-circle' : 'circle-check';

// function detectAtRiskStudents(submissions) {
//   const byStudent = {};
//   submissions.forEach(sub => {
//     if (!byStudent[sub.student_name]) byStudent[sub.student_name] = [];
//     byStudent[sub.student_name].push(sub);
//   });

//   const atRisk = [];
//   Object.entries(byStudent).forEach(([name, subs]) => {
//     const reasons = [];
//     let riskScore = 0;

//     const gradedSubs     = subs.filter(s => s.final_score !== null);
//     const ungradedAiSubs = subs.filter(s => s.status === 'ai_graded' && s.final_score === null);
//     const flaggedSubs    = subs.filter(s => s.ai_detection_score >= 50);
//     const borderlineSubs = subs.filter(s => s.ai_detection_score >= 30 && s.ai_detection_score < 50);

//     if (flaggedSubs.length > 0) {
//       riskScore += 40;
//       reasons.push(`${flaggedSubs[0].ai_detection_score}% AI content detected — score auto-zeroed`);
//     }
//     if (gradedSubs.length > 0) {
//       const avgFinal = gradedSubs.reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / gradedSubs.length;
//       if (avgFinal < 60) { riskScore += 30; reasons.push(`Average final score ${Math.round(avgFinal)}% — below pass threshold`); }
//       else if (avgFinal < 70) { riskScore += 15; reasons.push(`Average final score ${Math.round(avgFinal)}% — borderline`); }
//     }
//     const aiScoredSubs = subs.filter(s => s.ai_score !== null && s.ai_detection_score < 50);
//     if (aiScoredSubs.length > 0) {
//       const avgAi = aiScoredSubs.reduce((sum, s) => sum + s.ai_score, 0) / aiScoredSubs.length;
//       if (avgAi < 60) { riskScore += 20; reasons.push(`AI score average ${Math.round(avgAi)}/100 — consistently low`); }
//     }
//     if (borderlineSubs.length > 0) { riskScore += 10; reasons.push(`${borderlineSubs[0].ai_detection_score}% AI — borderline, needs review`); }
//     if (ungradedAiSubs.length >= 2) { riskScore += 10; reasons.push(`${ungradedAiSubs.length} submissions awaiting teacher review`); }

//     const allScores = [
//       ...gradedSubs.map(s => Math.round((s.final_score / s.max_score) * 100)),
//       ...aiScoredSubs.map(s => Math.round((s.ai_score / s.max_score) * 100)),
//     ];
//     const lowestScore = allScores.length ? Math.min(...allScores) : null;

//     if (riskScore >= 30 && reasons.length > 0) {
//       atRisk.push({ name, riskScore, level: riskScore >= 40 ? 'critical' : 'watch', reasons, lowestScore, submissionCount: subs.length });
//     }
//   });
//   return atRisk.sort((a, b) => b.riskScore - a.riskScore);
// }

// // ── STATUS BADGE ─────────────────────────────────────────────────────────────
// function StatusBadge({ status, aiDetection }) {
//   if (aiDetection >= 50) return (
//     <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#FCEBEB', color: '#A32D2D', border: '1px solid #F7C1C1' }}>
//       <Icon name="alert-triangle" size={11} style={{ color: '#A32D2D' }} /> AI Flagged
//     </span>
//   );
//   if (status === 'graded') return (
//     <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#EAF3DE', color: '#3B6D11', border: '1px solid #C0DD97' }}>
//       <Icon name="circle-check" size={11} style={{ color: '#3B6D11' }} /> Graded
//     </span>
//   );
//   if (status === 'ai_graded') return (
//     <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#FAEEDA', color: '#854F0B', border: '1px solid #FAC775' }}>
//       <Icon name="clock" size={11} style={{ color: '#854F0B' }} /> Not Graded
//     </span>
//   );
//   return (
//     <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#F1EFE8', color: '#5F5E5A', border: '1px solid #D3D1C7' }}>
//       <Icon name="loader" size={11} style={{ color: '#5F5E5A' }} /> Processing
//     </span>
//   );
// }

// // ── AT-RISK PANEL ─────────────────────────────────────────────────────────────
// function AtRiskPanel({ submissions, onClose }) {
//   const atRiskList     = useMemo(() => detectAtRiskStudents(submissions), [submissions]);
//   const critical       = atRiskList.filter(s => s.level === 'critical');
//   const watch          = atRiskList.filter(s => s.level === 'watch');
//   const uniqueStudents = [...new Set(submissions.map(s => s.student_name))].length;

//   return (
//     <div style={{ background: '#fff', border: '1px solid #F7C1C1', borderRadius: 13, overflow: 'hidden', marginBottom: 14 }}>
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#FCEBEB', borderBottom: '1px solid #F7C1C1' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <Icon name="alert-triangle" size={16} style={{ color: '#A32D2D', flexShrink: 0 }} />
//           <div>
//             <p style={{ fontWeight: 700, fontSize: 13, color: '#A32D2D', margin: 0 }}>AI At-Risk Student Detection</p>
//             <p style={{ fontSize: 11, color: '#791F1F', margin: 0 }}>Based on scores, AI flags and submission patterns</p>
//           </div>
//         </div>
//         <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A32D2D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
//           <Icon name="x" size={16} style={{ color: '#A32D2D' }} />
//         </button>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '12px 16px', borderBottom: '1px solid #F1EFE8' }}>
//         {[
//           { num: critical.length, label: 'Critical risk',   color: '#A32D2D' },
//           { num: watch.length,    label: 'Watch closely',   color: '#854F0B' },
//           { num: uniqueStudents,  label: 'Students total',  color: '#185FA5' },
//         ].map(s => (
//           <div key={s.label} style={{ background: '#F8F7FF', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
//             <p style={{ fontSize: 22, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.num}</p>
//             <p style={{ fontSize: 11, color: '#8884A8', margin: '3px 0 0' }}>{s.label}</p>
//           </div>
//         ))}
//       </div>

//       <div style={{ padding: '6px 16px 14px' }}>
//         {atRiskList.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
//             <Icon name="circle-check" size={14} style={{ color: '#3B6D11' }} />
//             <p style={{ color: '#8884A8', fontSize: 13, margin: 0 }}>No students flagged as at-risk.</p>
//           </div>
//         ) : atRiskList.map((student, idx) => {
//           const isCritical = student.level === 'critical';
//           return (
//             <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 0', borderBottom: idx < atRiskList.length - 1 ? '1px solid #F1EFE8' : 'none' }}>
//               <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, background: isCritical ? '#FCEBEB' : '#FAEEDA', color: isCritical ? '#A32D2D' : '#854F0B' }}>
//                 {student.name.charAt(0)}
//               </div>
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <p style={{ fontWeight: 700, fontSize: 13, color: '#1A1830', margin: '0 0 2px' }}>{student.name}</p>
//                 {student.reasons.map((r, i) => (
//                   <p key={i} style={{ fontSize: 11, color: '#8884A8', margin: '1px 0 0', lineHeight: 1.4 }}>{r}</p>
//                 ))}
//               </div>
//               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
//                 <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: isCritical ? '#FCEBEB' : '#FAEEDA', color: isCritical ? '#791F1F' : '#633806', border: `1px solid ${isCritical ? '#F7C1C1' : '#FAC775'}` }}>
//                   <Icon name={isCritical ? 'alert-triangle' : 'alert-circle'} size={10} style={{ color: isCritical ? '#A32D2D' : '#854F0B' }} />
//                   {isCritical ? 'Critical' : 'Watch'}
//                 </span>
//                 {student.lowestScore !== null && (
//                   <>
//                     <div style={{ width: 70, height: 4, background: '#F1EFE8', borderRadius: 2, overflow: 'hidden' }}>
//                       <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(student.lowestScore, 100)}%`, background: isCritical ? '#A32D2D' : '#854F0B' }} />
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: isCritical ? '#A32D2D' : '#854F0B' }}>{student.lowestScore}/100</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ── SHEET (bottom drawer) ─────────────────────────────────────────────────────
// function Sheet({ onClose, title, subtitle, children, footer }) {
//   return (
//     <div
//       onClick={e => e.target === e.currentTarget && onClose()}
//       style={{ position: 'fixed', inset: 0, background: 'rgba(15,13,40,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }}
//     >
//       <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 720, maxHeight: '94vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -8px 40px rgba(0,0,0,0.14)' }}>
//         <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
//           <div style={{ width: 36, height: 4, background: '#D3D1C7', borderRadius: 2 }} />
//         </div>
//         <div style={{ padding: '10px 22px 14px', borderBottom: '1px solid #ECECF2', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
//           <div style={{ flex: 1 }}>
//             <h2 style={{ fontWeight: 700, fontSize: 17, color: '#1A1830', margin: '0 0 2px', lineHeight: 1.3 }}>{title}</h2>
//             {subtitle && <p style={{ fontSize: 12, color: '#8884A8', margin: 0 }}>{subtitle}</p>}
//           </div>
//           <button onClick={onClose} aria-label="Close" style={{ background: '#F1EFE8', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: '#5F5E5A', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <Icon name="x" size={16} />
//           </button>
//         </div>
//         <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>{children}</div>
//         {footer && (
//           <div style={{ padding: '14px 22px 22px', borderTop: '1px solid #ECECF2', display: 'flex', gap: 10 }}>{footer}</div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── EXPORT ────────────────────────────────────────────────────────────────────
// function handleExportStudents(submissions) {
//   const byStudent = {};
//   submissions.forEach(sub => {
//     const key = sub.student_name;
//     if (!byStudent[key]) byStudent[key] = { name: sub.student_name, email: sub.student_email, assignments: [] };
//     byStudent[key].assignments.push(sub);
//   });

//   const sorted = Object.values(byStudent).sort((a, b) => a.name.localeCompare(b.name));

//   const rows = sorted.map((student, idx) => {
//     const assignmentRows = student.assignments
//       .sort((a, b) => a.assignment_title.localeCompare(b.assignment_title))
//       .map(sub => {
//         const isFlagged  = sub.ai_detection_score >= 50;
//         const aiScore    = sub.ai_score !== null ? (isFlagged ? `0/${sub.max_score}` : `${sub.ai_score}/${sub.max_score}`) : '—';
//         const finalScore = sub.final_score !== null ? `${sub.final_score}/${sub.max_score}` : '—';
//         const status     = sub.status === 'graded' ? 'Graded' : sub.status === 'ai_graded' ? 'Pending' : 'Processing';
//         return `
//           <tr>
//             <td style="padding:8px 12px;border-bottom:1px solid #F1EFE8;font-size:13px;color:#5F5E5A;">${sub.assignment_title}</td>
//             <td style="padding:8px 12px;border-bottom:1px solid #F1EFE8;font-size:13px;text-align:center;">${status}</td>
//             <td style="padding:8px 12px;border-bottom:1px solid #F1EFE8;font-size:13px;text-align:center;font-weight:700;color:${isFlagged ? '#A32D2D' : '#185FA5'};">${aiScore}</td>
//             <td style="padding:8px 12px;border-bottom:1px solid #F1EFE8;font-size:13px;text-align:center;font-weight:700;color:${sub.final_score !== null ? '#3B6D11' : '#8884A8'};">${finalScore}</td>
//           </tr>`;
//       }).join('');

//     const bgColor = idx % 2 === 0 ? '#ffffff' : '#F8F7FF';
//     return `
//       <tr>
//         <td colspan="4" style="padding:0;background:${bgColor};">
//           <div style="padding:14px 16px 4px;">
//             <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
//               <div style="width:34px;height:34px;border-radius:50%;background:#1A1830;color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
//                 ${student.name.charAt(0)}
//               </div>
//               <div>
//                 <p style="font-weight:700;font-size:14px;color:#1A1830;margin:0;">${student.name}</p>
//                 <p style="font-size:11px;color:#8884A8;margin:0;">${student.assignments.length} assignment${student.assignments.length !== 1 ? 's' : ''}</p>
//               </div>
//             </div>
//             <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
//               <thead>
//                 <tr style="background:#F1EFE8;">
//                   <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#5F5E5A;text-align:left;text-transform:uppercase;letter-spacing:0.4px;">Assignment</th>
//                   <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#5F5E5A;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">Status</th>
//                   <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#5F5E5A;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">AI Score</th>
//                   <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#5F5E5A;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">Final Score</th>
//                 </tr>
//               </thead>
//               <tbody>${assignmentRows}</tbody>
//             </table>
//           </div>
//         </td>
//       </tr>`;
//   }).join('');

//   const win = window.open('', '_blank');
//   win.document.write(`
//     <html>
//       <head>
//         <title>Student Report</title>
//         <style>
//           * { box-sizing: border-box; margin: 0; padding: 0; }
//           body { font-family: 'DM Sans','Segoe UI',sans-serif; background: #F1EFE8; padding: 32px 24px; color: #1A1830; }
//           .page { max-width: 820px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; }
//           .header { background: #1A1830; padding: 28px 32px; color: #fff; }
//           .header h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
//           .header p { font-size: 13px; opacity: 0.65; }
//           .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #D3D1C7; border-bottom: 1px solid #D3D1C7; }
//           .stat { background: #F8F7FF; padding: 16px 20px; text-align: center; }
//           .stat-num { font-size: 26px; font-weight: 700; color: #1A1830; }
//           .stat-label { font-size: 11px; font-weight: 600; color: #8884A8; margin-top: 2px; }
//           @media print { body { background: #fff; padding: 0; } .no-print { display: none; } }
//         </style>
//       </head>
//       <body>
//         <div class="page">
//           <div class="header">
//             <h1>EssayGrade AI — Student Report</h1>
//             <p>Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} &nbsp;·&nbsp; ${sorted.length} students &nbsp;·&nbsp; ${submissions.length} total submissions</p>
//           </div>
//           <div class="stats">
//             <div class="stat"><div class="stat-num">${sorted.length}</div><div class="stat-label">Students</div></div>
//             <div class="stat"><div class="stat-num">${submissions.filter(s => s.final_score !== null).length}</div><div class="stat-label">Graded</div></div>
//             <div class="stat"><div class="stat-num">${submissions.filter(s => s.ai_detection_score >= 50).length}</div><div class="stat-label">AI Flagged</div></div>
//           </div>
//           <table style="width:100%;border-collapse:collapse;"><tbody>${rows}</tbody></table>
//         </div>
//         <div class="no-print" style="text-align:center;margin-top:24px;">
//           <button onclick="window.print()" style="padding:12px 32px;background:#1A1830;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;">Print / Save as PDF</button>
//         </div>
//       </body>
//     </html>
//   `);
//   win.document.close();
// }

// // ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// export default function StudentsTab({ students, submissions, assignments, loading, onGrade, onEditGrade }) {
//   const [searchQuery,   setSearchQuery]   = useState('');
//   const [showAtRisk,    setShowAtRisk]    = useState(false);
//   const [feedbackModal, setFeedbackModal] = useState(null);
//   const [gradeFeedback, setGradeFeedback] = useState('');

//   const atRiskCount = useMemo(() => detectAtRiskStudents(submissions), [submissions]).length;
//   const openFeedback = sub => { setFeedbackModal(sub); setGradeFeedback(sub.teacher_feedback || ''); };

//   if (loading) return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
//       <div style={{ width: 28, height: 28, border: '2px solid #E8E6FF', borderTopColor: '#3C3489', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginBottom: 12 }} />
//       <p style={{ fontSize: 13, color: '#8884A8', fontWeight: 500 }}>Loading students…</p>
//     </div>
//   );

//   return (
//     <div style={{ minHeight: '100vh', background: '#F1EFE8', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

//       {/* ── Header ── */}
//       <div style={{ background: '#022aa4', padding: '0 20px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(2,42,164,0.35)' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.18)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//             <Icon name="writing" size={19} style={{ color: '#fff' }} />
//           </div>
//           <div>
//             <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', margin: 0 }}>EssayGrade AI</p>
//             <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: 0 }}>Students</p>
//           </div>
//         </div>

//         <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           {/* Search */}
//           <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//             <Icon name="search" size={13} style={{ position: 'absolute', left: 9, color: '#8884A8', pointerEvents: 'none' }} />
//             <input
//               type="text"
//               placeholder="Search student…"
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//               style={{ padding: '7px 12px 7px 28px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', fontSize: 13, color: '#1A1830', background: '#fff', outline: 'none', width: 180, fontFamily: 'inherit' }}
//             />
//           </div>

//           {/* Export */}
//           <button
//             onClick={() => handleExportStudents(submissions)}
//             style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, cursor: 'pointer', border: '1px solid #C0DD97', background: '#EAF3DE', color: '#3B6D11', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}
//           >
//             <Icon name="file-export" size={14} style={{ color: '#3B6D11' }} />
//             Export PDF
//           </button>

//           {/* Watchlist */}
//           <button
//             onClick={() => setShowAtRisk(prev => !prev)}
//             style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, cursor: 'pointer', border: showAtRisk ? '1px solid #F7C1C1' : '1px solid rgba(247,193,193,0.6)', background: showAtRisk ? '#FCEBEB' : 'rgba(252,235,235,0.85)', color: '#A32D2D', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.15s' }}
//           >
//             <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A32D2D', flexShrink: 0, animation: 'atRiskPulse 1.4s ease-in-out infinite' }} />
//             <Icon name="users-group" size={14} style={{ color: '#A32D2D' }} />
//             Watchlist
//             {atRiskCount > 0 && (
//               <span style={{ background: '#A32D2D', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>{atRiskCount}</span>
//             )}
//           </button>
//         </div>
//       </div>

//       <style>{`@keyframes atRiskPulse { 0%, 100% { opacity:1; transform:scale(1); } 50% { opacity:0.45; transform:scale(1.4); } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

//       {/* ── Main ── */}
//       <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 16px 64px' }}>

//         {showAtRisk && <AtRiskPanel submissions={submissions} onClose={() => setShowAtRisk(false)} />}

//         <p style={{ fontSize: 17, fontWeight: 700, color: '#1A1830', margin: '0 0 18px' }}>Students</p>

//         {submissions.length === 0 ? (
//           <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECECF2', textAlign: 'center', padding: '64px 24px' }}>
//             <div style={{ width: 50, height: 50, borderRadius: 13, background: '#E6F1FB', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <Icon name="users" size={24} style={{ color: '#185FA5' }} />
//             </div>
//             <p style={{ fontWeight: 700, color: '#1A1830', fontSize: 15, margin: '0 0 5px' }}>No students yet</p>
//             <p style={{ fontSize: 13, color: '#8884A8', margin: 0 }}>Students will appear here once they submit essays.</p>
//           </div>
//         ) : (() => {
//           const byStudent = {};
//           submissions.forEach(sub => {
//             if (!byStudent[sub.student_name]) {
//               byStudent[sub.student_name] = { name: sub.student_name, email: sub.student_email, assignments: [] };
//             }
//             byStudent[sub.student_name].assignments.push(sub);
//           });

//           const sorted = Object.values(byStudent)
//             .sort((a, b) => a.name.localeCompare(b.name))
//             .filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));

//           if (sorted.length === 0) return (
//             <div style={{ background: '#fff', borderRadius: 13, border: '1px solid #ECECF2', textAlign: 'center', padding: '40px 24px' }}>
//               <p style={{ color: '#8884A8', fontSize: 13, margin: 0 }}>No students match your search.</p>
//             </div>
//           );

//           return (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//               {sorted.map(student => {
//                 const gradedCount  = student.assignments.filter(s => s.final_score !== null).length;
//                 const flaggedCount = student.assignments.filter(s => s.ai_detection_score >= 50).length;
//                 const avgFinal     = gradedCount > 0
//                   ? Math.round(student.assignments.filter(s => s.final_score !== null).reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / gradedCount)
//                   : null;

//                 const accentColor = flaggedCount > 0 ? '#A32D2D' : avgFinal !== null && avgFinal < 60 ? '#854F0B' : '#185FA5';

//                 return (
//                   <div key={student.name} style={{ background: '#fff', borderRadius: 13, border: '1px solid #ECECF2', borderLeft: `4px solid ${accentColor}`, overflow: 'hidden' }}>

//                     {/* Student header */}
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#F8F7FF', borderBottom: '1px solid #ECECF2', gap: 12, flexWrap: 'wrap' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                         <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: flaggedCount > 0 ? '#FCEBEB' : '#E6F1FB', color: flaggedCount > 0 ? '#A32D2D' : '#185FA5', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                           {student.name.charAt(0)}
//                         </div>
//                         <div>
//                           <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1830', margin: 0 }}>{student.name}</p>
//                           <p style={{ fontSize: 11, color: '#8884A8', margin: 0 }}>{student.email}</p>
//                         </div>
//                       </div>

//                       <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
//                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#E6F1FB', color: '#185FA5', border: '1px solid #B5D4F4' }}>
//                           <Icon name="file-text" size={11} style={{ color: '#185FA5' }} />
//                           {student.assignments.length} submission{student.assignments.length !== 1 ? 's' : ''}
//                         </span>
//                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#EAF3DE', color: '#3B6D11', border: '1px solid #C0DD97' }}>
//                           <Icon name="circle-check" size={11} style={{ color: '#3B6D11' }} />
//                           {gradedCount} graded
//                         </span>
//                         {avgFinal !== null && (
//                           <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: scoreBg(avgFinal), color: scoreColor(avgFinal), border: `1px solid ${scoreBorder(avgFinal)}` }}>
//                             <Icon name="chart-bar" size={11} style={{ color: scoreColor(avgFinal) }} />
//                             Avg {avgFinal}%
//                           </span>
//                         )}
//                         {flaggedCount > 0 && (
//                           <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#FCEBEB', color: '#A32D2D', border: '1px solid #F7C1C1' }}>
//                             <Icon name="alert-triangle" size={11} style={{ color: '#A32D2D' }} />
//                             {flaggedCount} flagged
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Assignments table */}
//                     <div style={{ overflowX: 'auto' }}>
//                       <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//                         <thead>
//                           <tr style={{ background: '#F1EFE8' }}>
//                             {['Assignment', 'Submitted', 'Status', 'AI Score', 'Final Score', 'AI Flag', 'Actions'].map(h => (
//                               <th key={h} style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: '#5F5E5A', textAlign: h === 'Assignment' ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {student.assignments
//                             .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
//                             .map((sub, subIdx) => {
//                               const isFlagged = sub.ai_detection_score >= 50;
//                               const finalPct  = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
//                               const isLast    = subIdx === student.assignments.length - 1;
//                               const aiPct     = sub.ai_detection_score ?? 0;
//                               return (
//                                 <tr key={sub.id} style={{ borderBottom: isLast ? 'none' : '1px solid #F1EFE8' }}>
//                                   <td style={{ padding: '12px 14px' }}>
//                                     <p style={{ fontWeight: 600, fontSize: 13, color: '#1A1830', margin: '0 0 2px' }}>{sub.assignment_title}</p>
//                                     {sub.file_name && (
//                                       <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#185FA5' }}>
//                                         <Icon name="paperclip" size={11} style={{ color: '#185FA5' }} />
//                                         {sub.file_name}
//                                       </span>
//                                     )}
//                                   </td>
//                                   <td style={{ padding: '12px', textAlign: 'center', fontSize: 12, color: '#8884A8', whiteSpace: 'nowrap' }}>
//                                     <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
//                                       <Icon name="calendar" size={11} style={{ color: '#B0AECB' }} />
//                                       {new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
//                                     </span>
//                                   </td>
//                                   <td style={{ padding: '12px', textAlign: 'center' }}>
//                                     <StatusBadge status={sub.status} aiDetection={sub.ai_detection_score} />
//                                   </td>
//                                   <td style={{ padding: '12px', textAlign: 'center' }}>
//                                     {sub.ai_score !== null
//                                       ? <span style={{ fontWeight: 700, fontSize: 13, color: isFlagged ? '#A32D2D' : '#185FA5' }}>{isFlagged ? 0 : sub.ai_score}/{sub.max_score}</span>
//                                       : <span style={{ color: '#B0AECB', fontSize: 12 }}>—</span>}
//                                   </td>
//                                   <td style={{ padding: '12px', textAlign: 'center' }}>
//                                     {sub.final_score !== null
//                                       ? <span style={{ fontWeight: 700, fontSize: 13, color: scoreColor(finalPct) }}>{sub.final_score}/{sub.max_score}</span>
//                                       : <span style={{ color: '#B0AECB', fontSize: 12 }}>—</span>}
//                                   </td>
//                                   <td style={{ padding: '12px', textAlign: 'center' }}>
//                                     {sub.ai_detection_score !== null ? (
//                                       <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: aiBg(aiPct), color: aiColor(aiPct), border: `1px solid ${aiBorder(aiPct)}` }}>
//                                         <Icon name={aiIcon(aiPct)} size={11} style={{ color: aiColor(aiPct) }} />
//                                         {aiPct}%
//                                       </span>
//                                     ) : <span style={{ color: '#B0AECB', fontSize: 12 }}>—</span>}
//                                   </td>
//                                   <td style={{ padding: '12px', textAlign: 'center' }}>
//                                     <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
//                                       {sub.status === 'ai_graded' && (
//                                         <button onClick={() => onGrade(sub)} style={{ padding: '5px 11px', borderRadius: 7, border: 'none', background: '#1A1830', color: '#fff', fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
//                                           <Icon name="pencil" size={11} style={{ color: '#EEEDFE' }} /> Grade
//                                         </button>
//                                       )}
//                                       {sub.status === 'graded' && onEditGrade && (
//                                         <button onClick={() => onEditGrade(sub)} style={{ padding: '5px 11px', borderRadius: 7, border: '1px solid #B5D4F4', background: '#E6F1FB', color: '#185FA5', fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
//                                           <Icon name="refresh" size={11} style={{ color: '#185FA5' }} /> Edit
//                                         </button>
//                                       )}
//                                       {(sub.status === 'graded' || sub.status === 'ai_graded') && (
//                                         <button onClick={() => openFeedback(sub)} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #D3D1C7', background: '#F1EFE8', color: '#5F5E5A', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
//                                           <Icon name="message-circle" size={13} style={{ color: '#5F5E5A' }} />
//                                         </button>
//                                       )}
//                                     </div>
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })()}
//       </div>

//       {/* ── Feedback sheet ── */}
//       {feedbackModal && (
//         <Sheet
//           onClose={() => setFeedbackModal(null)}
//           title="Give Feedback"
//           subtitle={`${feedbackModal.student_name} — ${feedbackModal.assignment_title}`}
//           footer={
//             <>
//               <button onClick={() => setFeedbackModal(null)} style={{ flex: 1, padding: '10px 18px', borderRadius: 9, border: '1px solid #D3D1C7', background: '#F1EFE8', color: '#5F5E5A', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
//                 Cancel
//               </button>
//               <button onClick={() => setFeedbackModal(null)} style={{ flex: 1, padding: '10px 18px', borderRadius: 9, border: 'none', background: '#1A1830', color: '#fff', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
//                 <Icon name="device-floppy" size={14} style={{ color: '#EEEDFE' }} /> Save Feedback
//               </button>
//             </>
//           }
//         >
//           {feedbackModal.ai_feedback && (
//             <div style={{ background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
//                 <Icon name="robot" size={13} style={{ color: '#185FA5' }} />
//                 <span style={{ fontSize: 10, fontWeight: 700, color: '#185FA5', textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI Feedback (for reference)</span>
//               </div>
//               <p style={{ fontSize: 13, color: '#1A1830', margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{feedbackModal.ai_feedback}</p>
//             </div>
//           )}
//           {feedbackModal.teacher_feedback && (
//             <div style={{ background: '#EAF3DE', border: '1px solid #C0DD97', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
//                 <Icon name="school" size={13} style={{ color: '#3B6D11' }} />
//                 <span style={{ fontSize: 10, fontWeight: 700, color: '#3B6D11', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Current Feedback</span>
//               </div>
//               <p style={{ fontSize: 13, color: '#1A1830', margin: 0, lineHeight: 1.8 }}>{feedbackModal.teacher_feedback}</p>
//             </div>
//           )}
//           <div>
//             <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8884A8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
//               {feedbackModal.teacher_feedback ? 'Update Feedback' : 'Write Feedback to Student'}
//             </label>
//             <textarea
//               value={gradeFeedback}
//               onChange={e => setGradeFeedback(e.target.value)}
//               rows={5}
//               placeholder="Write personalised feedback for the student…"
//               style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', border: '1px solid #D3D1C7', borderRadius: 9, fontSize: 13, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', outline: 'none', color: '#1A1830' }}
//             />
//           </div>
//         </Sheet>
//       )}
//     </div>
//   );
// }








// src/components/teacher/StudentsTab.jsx
// No external CSS — all styles inline. Uses Tabler Icons via shared.jsx Icon component.

import { useState, useMemo } from 'react';
import { Icon, Badge } from './shared.jsx';

// ── HELPERS ───────────────────────────────────────────────────────────────────
const scoreColor   = p => p >= 70 ? '#3B6D11' : p >= 50 ? '#854F0B' : '#A32D2D';
const scoreBg      = p => p >= 70 ? '#EAF3DE' : p >= 50 ? '#FAEEDA' : '#FCEBEB';
const scoreBorder  = p => p >= 70 ? '#C0DD97' : p >= 50 ? '#FAC775' : '#F7C1C1';

const aiColor  = s => s >= 50 ? '#A32D2D' : s >= 30 ? '#854F0B' : '#3B6D11';
const aiBg     = s => s >= 50 ? '#FCEBEB' : s >= 30 ? '#FAEEDA' : '#EAF3DE';
const aiBorder = s => s >= 50 ? '#F7C1C1' : s >= 30 ? '#FAC775' : '#C0DD97';
const aiIcon   = s => s >= 50 ? 'alert-triangle' : s >= 30 ? 'alert-circle' : 'circle-check';

function detectAtRiskStudents(submissions) {
  const byStudent = {};
  submissions.forEach(sub => {
    if (!byStudent[sub.student_name]) byStudent[sub.student_name] = [];
    byStudent[sub.student_name].push(sub);
  });

  const atRisk = [];
  Object.entries(byStudent).forEach(([name, subs]) => {
    const reasons = [];
    let riskScore = 0;

    const gradedSubs     = subs.filter(s => s.final_score !== null);
    const ungradedAiSubs = subs.filter(s => s.status === 'ai_graded' && s.final_score === null);
    const flaggedSubs    = subs.filter(s => s.ai_detection_score >= 50);
    const borderlineSubs = subs.filter(s => s.ai_detection_score >= 30 && s.ai_detection_score < 50);

    if (flaggedSubs.length > 0) {
      riskScore += 40;
      reasons.push(`${flaggedSubs[0].ai_detection_score}% AI content detected — score auto-zeroed`);
    }
    if (gradedSubs.length > 0) {
      const avgFinal = gradedSubs.reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / gradedSubs.length;
      if (avgFinal < 60) { riskScore += 30; reasons.push(`Average final score ${Math.round(avgFinal)}% — below pass threshold`); }
      else if (avgFinal < 70) { riskScore += 15; reasons.push(`Average final score ${Math.round(avgFinal)}% — borderline`); }
    }
    const aiScoredSubs = subs.filter(s => s.ai_score !== null && s.ai_detection_score < 50);
    if (aiScoredSubs.length > 0) {
      const avgAi = aiScoredSubs.reduce((sum, s) => sum + s.ai_score, 0) / aiScoredSubs.length;
      if (avgAi < 60) { riskScore += 20; reasons.push(`AI score average ${Math.round(avgAi)}/100 — consistently low`); }
    }
    if (borderlineSubs.length > 0) { riskScore += 10; reasons.push(`${borderlineSubs[0].ai_detection_score}% AI — borderline, needs review`); }
    if (ungradedAiSubs.length >= 2) { riskScore += 10; reasons.push(`${ungradedAiSubs.length} submissions awaiting teacher review`); }

    const allScores = [
      ...gradedSubs.map(s => Math.round((s.final_score / s.max_score) * 100)),
      ...aiScoredSubs.map(s => Math.round((s.ai_score / s.max_score) * 100)),
    ];
    const lowestScore = allScores.length ? Math.min(...allScores) : null;

    if (riskScore >= 30 && reasons.length > 0) {
      atRisk.push({ name, riskScore, level: riskScore >= 40 ? 'critical' : 'watch', reasons, lowestScore, submissionCount: subs.length });
    }
  });
  return atRisk.sort((a, b) => b.riskScore - a.riskScore);
}

// ── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status, aiDetection }) {
  if (aiDetection >= 50) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#FCEBEB', color: '#A32D2D', border: '1px solid #F7C1C1' }}>
      <Icon name="alert-triangle" size={11} style={{ color: '#A32D2D' }} /> AI Flagged
    </span>
  );
  if (status === 'graded') return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#EAF3DE', color: '#3B6D11', border: '1px solid #C0DD97' }}>
      <Icon name="circle-check" size={11} style={{ color: '#3B6D11' }} /> Graded
    </span>
  );
  if (status === 'ai_graded') return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#FAEEDA', color: '#854F0B', border: '1px solid #FAC775' }}>
      <Icon name="clock" size={11} style={{ color: '#854F0B' }} /> Pending
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#F1EFE8', color: '#5F5E5A', border: '1px solid #D3D1C7' }}>
      <Icon name="loader" size={11} style={{ color: '#5F5E5A' }} /> Processing
    </span>
  );
}

// ── AT-RISK PANEL ─────────────────────────────────────────────────────────────
function AtRiskPanel({ submissions, onClose }) {
  const atRiskList     = useMemo(() => detectAtRiskStudents(submissions), [submissions]);
  const critical       = atRiskList.filter(s => s.level === 'critical');
  const watch          = atRiskList.filter(s => s.level === 'watch');
  const uniqueStudents = [...new Set(submissions.map(s => s.student_name))].length;

  return (
    <div style={{ background: '#fff', border: '1px solid #F7C1C1', borderRadius: 13, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#FCEBEB', borderBottom: '1px solid #F7C1C1', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Icon name="alert-triangle" size={16} style={{ color: '#A32D2D', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#A32D2D', margin: 0 }}>AI At-Risk Detection</p>
            <p style={{ fontSize: 11, color: '#791F1F', margin: 0 }}>Scores, AI flags & submission patterns</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A32D2D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0 }}>
          <Icon name="x" size={16} style={{ color: '#A32D2D' }} />
        </button>
      </div>

      {/* Stats — 3 cols on all sizes, compact on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '12px 16px', borderBottom: '1px solid #F1EFE8' }}>
        {[
          { num: critical.length, label: 'Critical',      color: '#A32D2D' },
          { num: watch.length,    label: 'Watch',         color: '#854F0B' },
          { num: uniqueStudents,  label: 'Total students',color: '#185FA5' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F8F7FF', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.num}</p>
            <p style={{ fontSize: 11, color: '#8884A8', margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        {atRiskList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon name="circle-check" size={14} style={{ color: '#3B6D11' }} />
            <p style={{ color: '#8884A8', fontSize: 13, margin: 0 }}>No students flagged as at-risk.</p>
          </div>
        ) : atRiskList.map((student, idx) => {
          const isCritical = student.level === 'critical';
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 0', borderBottom: idx < atRiskList.length - 1 ? '1px solid #F1EFE8' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, background: isCritical ? '#FCEBEB' : '#FAEEDA', color: isCritical ? '#A32D2D' : '#854F0B' }}>
                {student.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#1A1830', margin: 0 }}>{student.name}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: isCritical ? '#FCEBEB' : '#FAEEDA', color: isCritical ? '#791F1F' : '#633806', border: `1px solid ${isCritical ? '#F7C1C1' : '#FAC775'}` }}>
                    <Icon name={isCritical ? 'alert-triangle' : 'alert-circle'} size={10} style={{ color: isCritical ? '#A32D2D' : '#854F0B' }} />
                    {isCritical ? 'Critical' : 'Watch'}
                  </span>
                </div>
                {student.reasons.map((r, i) => (
                  <p key={i} style={{ fontSize: 11, color: '#8884A8', margin: '1px 0 0', lineHeight: 1.4 }}>{r}</p>
                ))}
                {student.lowestScore !== null && (
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: '#F1EFE8', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(student.lowestScore, 100)}%`, background: isCritical ? '#A32D2D' : '#854F0B' }} />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: isCritical ? '#A32D2D' : '#854F0B', flexShrink: 0 }}>{student.lowestScore}/100</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SHEET (bottom drawer) ─────────────────────────────────────────────────────
function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,13,40,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }}
    >
      <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 720, maxHeight: '94vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -8px 40px rgba(0,0,0,0.14)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
          <div style={{ width: 36, height: 4, background: '#D3D1C7', borderRadius: 2 }} />
        </div>
        <div style={{ padding: '10px 22px 14px', borderBottom: '1px solid #ECECF2', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontWeight: 700, fontSize: 17, color: '#1A1830', margin: '0 0 2px', lineHeight: 1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 12, color: '#8884A8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: '#F1EFE8', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: '#5F5E5A', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>{children}</div>
        {footer && (
          <div style={{ padding: '14px 22px 22px', borderTop: '1px solid #ECECF2', display: 'flex', gap: 10 }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

// ── EXPORT ────────────────────────────────────────────────────────────────────
function handleExportStudents(submissions) {
  const byStudent = {};
  submissions.forEach(sub => {
    const key = sub.student_name;
    if (!byStudent[key]) byStudent[key] = { name: sub.student_name, email: sub.student_email, assignments: [] };
    byStudent[key].assignments.push(sub);
  });

  const sorted = Object.values(byStudent).sort((a, b) => a.name.localeCompare(b.name));

  const rows = sorted.map((student, idx) => {
    const assignmentRows = student.assignments
      .sort((a, b) => a.assignment_title.localeCompare(b.assignment_title))
      .map(sub => {
        const isFlagged  = sub.ai_detection_score >= 50;
        const aiScore    = sub.ai_score !== null ? (isFlagged ? `0/${sub.max_score}` : `${sub.ai_score}/${sub.max_score}`) : '—';
        const finalScore = sub.final_score !== null ? `${sub.final_score}/${sub.max_score}` : '—';
        const status     = sub.status === 'graded' ? 'Graded' : sub.status === 'ai_graded' ? 'Pending' : 'Processing';
        return `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #F1EFE8;font-size:13px;color:#5F5E5A;">${sub.assignment_title}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #F1EFE8;font-size:13px;text-align:center;">${status}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #F1EFE8;font-size:13px;text-align:center;font-weight:700;color:${isFlagged ? '#A32D2D' : '#185FA5'};">${aiScore}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #F1EFE8;font-size:13px;text-align:center;font-weight:700;color:${sub.final_score !== null ? '#3B6D11' : '#8884A8'};">${finalScore}</td>
          </tr>`;
      }).join('');

    const bgColor = idx % 2 === 0 ? '#ffffff' : '#F8F7FF';
    return `
      <tr>
        <td colspan="4" style="padding:0;background:${bgColor};">
          <div style="padding:14px 16px 4px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div style="width:34px;height:34px;border-radius:50%;background:#1A1830;color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${student.name.charAt(0)}
              </div>
              <div>
                <p style="font-weight:700;font-size:14px;color:#1A1830;margin:0;">${student.name}</p>
                <p style="font-size:11px;color:#8884A8;margin:0;">${student.assignments.length} assignment${student.assignments.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
              <thead>
                <tr style="background:#F1EFE8;">
                  <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#5F5E5A;text-align:left;text-transform:uppercase;letter-spacing:0.4px;">Assignment</th>
                  <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#5F5E5A;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">Status</th>
                  <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#5F5E5A;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">AI Score</th>
                  <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#5F5E5A;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">Final Score</th>
                </tr>
              </thead>
              <tbody>${assignmentRows}</tbody>
            </table>
          </div>
        </td>
      </tr>`;
  }).join('');

  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>Student Report</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans','Segoe UI',sans-serif; background: #F1EFE8; padding: 32px 24px; color: #1A1830; }
          .page { max-width: 820px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; }
          .header { background: #1A1830; padding: 28px 32px; color: #fff; }
          .header h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
          .header p { font-size: 13px; opacity: 0.65; }
          .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #D3D1C7; border-bottom: 1px solid #D3D1C7; }
          .stat { background: #F8F7FF; padding: 16px 20px; text-align: center; }
          .stat-num { font-size: 26px; font-weight: 700; color: #1A1830; }
          .stat-label { font-size: 11px; font-weight: 600; color: #8884A8; margin-top: 2px; }
          @media print { body { background: #fff; padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>EssayGrade AI — Student Report</h1>
            <p>Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} &nbsp;·&nbsp; ${sorted.length} students &nbsp;·&nbsp; ${submissions.length} total submissions</p>
          </div>
          <div class="stats">
            <div class="stat"><div class="stat-num">${sorted.length}</div><div class="stat-label">Students</div></div>
            <div class="stat"><div class="stat-num">${submissions.filter(s => s.final_score !== null).length}</div><div class="stat-label">Graded</div></div>
            <div class="stat"><div class="stat-num">${submissions.filter(s => s.ai_detection_score >= 50).length}</div><div class="stat-label">AI Flagged</div></div>
          </div>
          <table style="width:100%;border-collapse:collapse;"><tbody>${rows}</tbody></table>
        </div>
        <div class="no-print" style="text-align:center;margin-top:24px;">
          <button onclick="window.print()" style="padding:12px 32px;background:#1A1830;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;">Print / Save as PDF</button>
        </div>
      </body>
    </html>
  `);
  win.document.close();
}

// ── SUBMISSION CARD (mobile) — replaces table row on small screens ─────────────
function SubmissionCard({ sub, onGrade, onEditGrade, onFeedback }) {
  const isFlagged = sub.ai_detection_score >= 50;
  const aiPct     = sub.ai_detection_score ?? 0;
  const finalPct  = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;

  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1EFE8' }}>
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: 13, color: '#1A1830', margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {sub.assignment_title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="calendar" size={11} style={{ color: '#B0AECB' }} />
            <span style={{ fontSize: 11, color: '#B0AECB' }}>
              {new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
            {sub.file_name && (
              <>
                <span style={{ color: '#D3D1C7', fontSize: 11 }}>·</span>
                <Icon name="paperclip" size={11} style={{ color: '#185FA5' }} />
                <span style={{ fontSize: 11, color: '#185FA5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{sub.file_name}</span>
              </>
            )}
          </div>
        </div>
        <StatusBadge status={sub.status} aiDetection={sub.ai_detection_score} />
      </div>

      {/* Score row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {/* AI Score */}
        <div style={{ background: '#F8F7FF', borderRadius: 8, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#B0AECB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: isFlagged ? '#A32D2D' : '#185FA5' }}>
            {sub.ai_score !== null ? `${isFlagged ? 0 : sub.ai_score}/${sub.max_score}` : '—'}
          </span>
        </div>

        {/* Final Score */}
        <div style={{ background: '#F8F7FF', borderRadius: 8, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#B0AECB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: finalPct !== null ? scoreColor(finalPct) : '#B0AECB' }}>
            {sub.final_score !== null ? `${sub.final_score}/${sub.max_score}` : '—'}
          </span>
        </div>

        {/* AI Flag */}
        {sub.ai_detection_score !== null && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: aiBg(aiPct), color: aiColor(aiPct), border: `1px solid ${aiBorder(aiPct)}` }}>
            <Icon name={aiIcon(aiPct)} size={11} style={{ color: aiColor(aiPct) }} />
            {aiPct}% AI
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        {sub.status === 'ai_graded' && (
          <button onClick={() => onGrade(sub)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: 'none', background: '#1A1830', color: '#fff', fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon name="pencil" size={11} style={{ color: '#EEEDFE' }} /> Grade
          </button>
        )}
        {sub.status === 'graded' && onEditGrade && (
          <button onClick={() => onEditGrade(sub)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: '1px solid #B5D4F4', background: '#E6F1FB', color: '#185FA5', fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon name="refresh" size={11} style={{ color: '#185FA5' }} /> Edit grade
          </button>
        )}
        {(sub.status === 'graded' || sub.status === 'ai_graded') && (
          <button onClick={() => onFeedback(sub)} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid #D3D1C7', background: '#F1EFE8', color: '#5F5E5A', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon name="message-circle" size={13} style={{ color: '#5F5E5A' }} /> Feedback
          </button>
        )}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function StudentsTab({ students, submissions, assignments, loading, onGrade, onEditGrade }) {
  const [searchQuery,   setSearchQuery]   = useState('');
  const [showAtRisk,    setShowAtRisk]    = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [showSearch,    setShowSearch]    = useState(false);

  const atRiskCount = useMemo(() => detectAtRiskStudents(submissions), [submissions]).length;
  const openFeedback = sub => { setFeedbackModal(sub); setGradeFeedback(sub.teacher_feedback || ''); };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ width: 28, height: 28, border: '2px solid #E8E6FF', borderTopColor: '#3C3489', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginBottom: 12 }} />
      <p style={{ fontSize: 13, color: '#8884A8', fontWeight: 500 }}>Loading students…</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F1EFE8', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      <style>{`
        @keyframes atRiskPulse { 0%, 100% { opacity:1; transform:scale(1); } 50% { opacity:0.45; transform:scale(1.4); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Desktop header: single row */
        .st-header-actions { display: flex; align-items: center; gap: 8px; }
        .st-search-wrap { position: relative; display: flex; align-items: center; }
        .st-search-desktop { display: flex; }
        .st-search-mobile-btn { display: none; }
        .st-search-mobile-bar { display: none; }

        /* Hide table / show cards on mobile */
        .st-table-wrap { display: block; }
        .st-cards-wrap  { display: none; }

        @media (max-width: 639px) {
          .st-header-actions { gap: 6px; }

          /* Replace text labels with icon-only on very small screens */
          .st-btn-label { display: none; }
          .st-search-desktop { display: none; }
          .st-search-mobile-btn { display: flex; }

          /* Full-width search bar below header when open */
          .st-search-mobile-bar { display: flex; }

          /* Table → cards */
          .st-table-wrap { display: none; }
          .st-cards-wrap  { display: block; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: '#022aa4', padding: '0 16px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(2,42,164,0.35)', gap: 10 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.18)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="writing" size={19} style={{ color: '#fff' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>EssayGrade AI</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: 0 }}>Students</p>
          </div>
        </div>

        {/* Actions */}
        <div className="st-header-actions" style={{ flexShrink: 0 }}>

          {/* Desktop search */}
          <div className="st-search-wrap st-search-desktop">
            <Icon name="search" size={13} style={{ position: 'absolute', left: 9, color: '#8884A8', pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="text"
              placeholder="Search student…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '7px 12px 7px 28px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', fontSize: 13, color: '#1A1830', background: '#fff', outline: 'none', width: 180, fontFamily: 'inherit' }}
            />
          </div>

          {/* Mobile search icon toggle */}
          <button
            className="st-search-mobile-btn"
            onClick={() => setShowSearch(s => !s)}
            style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: showSearch ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name={showSearch ? 'x' : 'search'} size={15} style={{ color: '#fff' }} />
          </button>

          {/* Export */}
          <button
            onClick={() => handleExportStudents(submissions)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 8, cursor: 'pointer', border: '1px solid #C0DD97', background: '#EAF3DE', color: '#3B6D11', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', flexShrink: 0 }}
          >
            <Icon name="file-export" size={14} style={{ color: '#3B6D11' }} />
            <span className="st-btn-label">Export PDF</span>
          </button>

          {/* Watchlist */}
          <button
            onClick={() => setShowAtRisk(prev => !prev)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 8, cursor: 'pointer', border: showAtRisk ? '1px solid #F7C1C1' : '1px solid rgba(247,193,193,0.6)', background: showAtRisk ? '#FCEBEB' : 'rgba(252,235,235,0.85)', color: '#A32D2D', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0 }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A32D2D', flexShrink: 0, animation: 'atRiskPulse 1.4s ease-in-out infinite' }} />
            <Icon name="users-group" size={14} style={{ color: '#A32D2D' }} />
            <span className="st-btn-label">Watchlist</span>
            {atRiskCount > 0 && (
              <span style={{ background: '#A32D2D', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>{atRiskCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar (below header) */}
      {showSearch && (
        <div className="st-search-mobile-bar" style={{ background: '#0230b8', padding: '8px 16px 12px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8884A8', pointerEvents: 'none' }} />
            <input
              autoFocus
              type="text"
              placeholder="Search student…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 30px', borderRadius: 9, border: 'none', fontSize: 14, color: '#1A1830', background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 12px 64px' }}>

        {showAtRisk && <AtRiskPanel submissions={submissions} onClose={() => setShowAtRisk(false)} />}

        <p style={{ fontSize: 17, fontWeight: 700, color: '#1A1830', margin: '0 0 14px' }}>Students</p>

        {submissions.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECECF2', textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ width: 50, height: 50, borderRadius: 13, background: '#E6F1FB', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="users" size={24} style={{ color: '#185FA5' }} />
            </div>
            <p style={{ fontWeight: 700, color: '#1A1830', fontSize: 15, margin: '0 0 5px' }}>No students yet</p>
            <p style={{ fontSize: 13, color: '#8884A8', margin: 0 }}>Students will appear here once they submit essays.</p>
          </div>
        ) : (() => {
          const byStudent = {};
          submissions.forEach(sub => {
            if (!byStudent[sub.student_name]) {
              byStudent[sub.student_name] = { name: sub.student_name, email: sub.student_email, assignments: [] };
            }
            byStudent[sub.student_name].assignments.push(sub);
          });

          const sorted = Object.values(byStudent)
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));

          if (sorted.length === 0) return (
            <div style={{ background: '#fff', borderRadius: 13, border: '1px solid #ECECF2', textAlign: 'center', padding: '40px 24px' }}>
              <p style={{ color: '#8884A8', fontSize: 13, margin: 0 }}>No students match your search.</p>
            </div>
          );

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sorted.map(student => {
                const gradedCount  = student.assignments.filter(s => s.final_score !== null).length;
                const flaggedCount = student.assignments.filter(s => s.ai_detection_score >= 50).length;
                const avgFinal     = gradedCount > 0
                  ? Math.round(student.assignments.filter(s => s.final_score !== null).reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / gradedCount)
                  : null;

                const accentColor = flaggedCount > 0 ? '#A32D2D' : avgFinal !== null && avgFinal < 60 ? '#854F0B' : '#185FA5';

                return (
                  <div key={student.name} style={{ background: '#fff', borderRadius: 13, border: '1px solid #ECECF2', borderLeft: `4px solid ${accentColor}`, overflow: 'hidden' }}>

                    {/* Student header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#F8F7FF', borderBottom: '1px solid #ECECF2', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: flaggedCount > 0 ? '#FCEBEB' : '#E6F1FB', color: flaggedCount > 0 ? '#A32D2D' : '#185FA5', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {student.name.charAt(0)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1830', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.name}</p>
                          <p style={{ fontSize: 11, color: '#8884A8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.email}</p>
                        </div>
                      </div>

                      {/* Badges — scroll horizontally rather than wrap on very small screens */}
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 2 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#E6F1FB', color: '#185FA5', border: '1px solid #B5D4F4', whiteSpace: 'nowrap' }}>
                          <Icon name="file-text" size={11} style={{ color: '#185FA5' }} />
                          {student.assignments.length} sub{student.assignments.length !== 1 ? 's' : ''}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#EAF3DE', color: '#3B6D11', border: '1px solid #C0DD97', whiteSpace: 'nowrap' }}>
                          <Icon name="circle-check" size={11} style={{ color: '#3B6D11' }} />
                          {gradedCount} graded
                        </span>
                        {avgFinal !== null && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: scoreBg(avgFinal), color: scoreColor(avgFinal), border: `1px solid ${scoreBorder(avgFinal)}`, whiteSpace: 'nowrap' }}>
                            <Icon name="chart-bar" size={11} style={{ color: scoreColor(avgFinal) }} />
                            Avg {avgFinal}%
                          </span>
                        )}
                        {flaggedCount > 0 && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#FCEBEB', color: '#A32D2D', border: '1px solid #F7C1C1', whiteSpace: 'nowrap' }}>
                            <Icon name="alert-triangle" size={11} style={{ color: '#A32D2D' }} />
                            {flaggedCount} flagged
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DESKTOP — table */}
                    <div className="st-table-wrap" style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: '#F1EFE8' }}>
                            {['Assignment', 'Submitted', 'Status', 'AI Score', 'Final Score', 'AI Flag', 'Actions'].map(h => (
                              <th key={h} style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: '#5F5E5A', textAlign: h === 'Assignment' ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {student.assignments
                            .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
                            .map((sub, subIdx) => {
                              const isFlagged = sub.ai_detection_score >= 50;
                              const finalPct  = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
                              const isLast    = subIdx === student.assignments.length - 1;
                              const aiPct     = sub.ai_detection_score ?? 0;
                              return (
                                <tr key={sub.id} style={{ borderBottom: isLast ? 'none' : '1px solid #F1EFE8' }}>
                                  <td style={{ padding: '12px 14px' }}>
                                    <p style={{ fontWeight: 600, fontSize: 13, color: '#1A1830', margin: '0 0 2px' }}>{sub.assignment_title}</p>
                                    {sub.file_name && (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#185FA5' }}>
                                        <Icon name="paperclip" size={11} style={{ color: '#185FA5' }} />
                                        {sub.file_name}
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center', fontSize: 12, color: '#8884A8', whiteSpace: 'nowrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                      <Icon name="calendar" size={11} style={{ color: '#B0AECB' }} />
                                      {new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <StatusBadge status={sub.status} aiDetection={sub.ai_detection_score} />
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {sub.ai_score !== null
                                      ? <span style={{ fontWeight: 700, fontSize: 13, color: isFlagged ? '#A32D2D' : '#185FA5' }}>{isFlagged ? 0 : sub.ai_score}/{sub.max_score}</span>
                                      : <span style={{ color: '#B0AECB', fontSize: 12 }}>—</span>}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {sub.final_score !== null
                                      ? <span style={{ fontWeight: 700, fontSize: 13, color: scoreColor(finalPct) }}>{sub.final_score}/{sub.max_score}</span>
                                      : <span style={{ color: '#B0AECB', fontSize: 12 }}>—</span>}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {sub.ai_detection_score !== null ? (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: aiBg(aiPct), color: aiColor(aiPct), border: `1px solid ${aiBorder(aiPct)}` }}>
                                        <Icon name={aiIcon(aiPct)} size={11} style={{ color: aiColor(aiPct) }} />
                                        {aiPct}%
                                      </span>
                                    ) : <span style={{ color: '#B0AECB', fontSize: 12 }}>—</span>}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                                      {sub.status === 'ai_graded' && (
                                        <button onClick={() => onGrade(sub)} style={{ padding: '5px 11px', borderRadius: 7, border: 'none', background: '#1A1830', color: '#fff', fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                          <Icon name="pencil" size={11} style={{ color: '#EEEDFE' }} /> Grade
                                        </button>
                                      )}
                                      {sub.status === 'graded' && onEditGrade && (
                                        <button onClick={() => onEditGrade(sub)} style={{ padding: '5px 11px', borderRadius: 7, border: '1px solid #B5D4F4', background: '#E6F1FB', color: '#185FA5', fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                          <Icon name="refresh" size={11} style={{ color: '#185FA5' }} /> Edit
                                        </button>
                                      )}
                                      {(sub.status === 'graded' || sub.status === 'ai_graded') && (
                                        <button onClick={() => openFeedback(sub)} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #D3D1C7', background: '#F1EFE8', color: '#5F5E5A', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <Icon name="message-circle" size={13} style={{ color: '#5F5E5A' }} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE — cards */}
                    <div className="st-cards-wrap">
                      {student.assignments
                        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
                        .map(sub => (
                          <SubmissionCard
                            key={sub.id}
                            sub={sub}
                            onGrade={onGrade}
                            onEditGrade={onEditGrade}
                            onFeedback={openFeedback}
                          />
                        ))}
                    </div>

                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* ── Feedback sheet ── */}
      {feedbackModal && (
        <Sheet
          onClose={() => setFeedbackModal(null)}
          title="Give Feedback"
          subtitle={`${feedbackModal.student_name} — ${feedbackModal.assignment_title}`}
          footer={
            <>
              <button onClick={() => setFeedbackModal(null)} style={{ flex: 1, padding: '10px 18px', borderRadius: 9, border: '1px solid #D3D1C7', background: '#F1EFE8', color: '#5F5E5A', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={() => setFeedbackModal(null)} style={{ flex: 1, padding: '10px 18px', borderRadius: 9, border: 'none', background: '#1A1830', color: '#fff', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="device-floppy" size={14} style={{ color: '#EEEDFE' }} /> Save Feedback
              </button>
            </>
          }
        >
          {feedbackModal.ai_feedback && (
            <div style={{ background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <Icon name="robot" size={13} style={{ color: '#185FA5' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#185FA5', textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI Feedback (for reference)</span>
              </div>
              <p style={{ fontSize: 13, color: '#1A1830', margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{feedbackModal.ai_feedback}</p>
            </div>
          )}
          {feedbackModal.teacher_feedback && (
            <div style={{ background: '#EAF3DE', border: '1px solid #C0DD97', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <Icon name="school" size={13} style={{ color: '#3B6D11' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#3B6D11', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Current Feedback</span>
              </div>
              <p style={{ fontSize: 13, color: '#1A1830', margin: 0, lineHeight: 1.8 }}>{feedbackModal.teacher_feedback}</p>
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8884A8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
              {feedbackModal.teacher_feedback ? 'Update Feedback' : 'Write Feedback to Student'}
            </label>
            <textarea
              value={gradeFeedback}
              onChange={e => setGradeFeedback(e.target.value)}
              rows={5}
              placeholder="Write personalised feedback for the student…"
              style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', border: '1px solid #D3D1C7', borderRadius: 9, fontSize: 13, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', outline: 'none', color: '#1A1830' }}
            />
          </div>
        </Sheet>
      )}
    </div>
  );
}