// import { useState } from 'react';
// import './pending.css';
// import { apiFetch } from './api.js';

// const aiLabel = score => score >= 50 ? 'High AI' : score >= 30 ? 'Borderline' : 'Original';

// const btnPrimary = {
//   background: '#2563eb', color: '#fff', border: 'none',
//   borderRadius: 10, padding: '11px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
// };
// const btnGhost = {
//   background: '#f1f5f9', color: '#475569',
//   border: '1.5px solid #e2e8f0', borderRadius: 10,
//   padding: '11px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
// };

// export default function PendingTab({ pending = [], loading, onViewEssay, onGrade }) {
//   const [gradeModal, setGradeModal] = useState(null);
//   const [gradeScore, setGradeScore] = useState('');
//   const [gradeFeedback, setGradeFeedback] = useState('');
//   const [saving, setSaving] = useState(false);

//   const openGrade = sub => {
//     setGradeModal(sub);
//     setGradeScore(sub.ai_score ?? '');
//     setGradeFeedback('');
//   };

  

// const handleSave = async () => {
//   if (!gradeScore) return;
//   setSaving(true);
//   try {
//     await apiFetch('/submissions/grade', {
//       method: 'POST',
//       body: JSON.stringify({
//         submission_id: gradeModal.id,
//         score:         Number(gradeScore),
//         feedback:      gradeFeedback,
//       }),
//     });
//     setGradeModal(null);
//     // Trigger parent refresh
//     onGrade(null);
//   } catch (err) {
//     alert(err.message);
//   } finally {
//     setSaving(false);
//   }
// };



//   return (
//     <div>
//       <p style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 20 }}>
//         Pending Review{' '}
//         {pending.length > 0 && (
//           <span style={{ fontSize: 14, color: '#d97706', fontWeight: 700 }}>({pending.length})</span>
//         )}
//       </p>

//       {pending.length === 0 ? (
//         <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', padding: '64px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
//           <p style={{ fontSize: 48, margin: '0 0 14px' }}>✅</p>
//           <p style={{ fontWeight: 700, color: '#64748b', fontSize: 16, margin: '0 0 6px' }}>All caught up!</p>
//           <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No essays pending your review.</p>
//         </div>
//       ) : pending.map(sub => (
//         <div key={sub.id} className={`pg-card ${sub.ai_detection_score >= 50 ? 'pg-card-flagged' : 'pg-card-warn'}`}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ display: 'flex', gap: 12, flex: 1 }}>
//               <div className={`pg-avatar-lg ${sub.ai_detection_score >= 50 ? 'pg-avatar-lg--red' : 'pg-avatar-lg--amber'}`}>
//                 {sub.student_name?.charAt(0)}
//               </div>
//               <div>
//                 <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', margin: '0 0 2px' }}>{sub.student_name}</p>
//                 <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 4px' }}>{sub.assignment_title}</p>
//                 <p style={{ fontSize: 12, color: 'var(--text-faint)', margin: 0 }}>
//                   Submitted {new Date(sub.submitted_at).toLocaleString()}
//                   {sub.file_name ? ` · 📎 ${sub.file_name}` : ''}
//                 </p>
//               </div>
//             </div>
//             <div style={{ textAlign: 'right', flexShrink: 0 }}>
//               <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '0 0 2px', fontWeight: 600 }}>AI Score</p>
//               <p style={{ fontSize: 20, fontWeight: 800, color: sub.ai_detection_score >= 50 ? 'var(--red)' : 'var(--blue)', margin: 0, lineHeight: 1 }}>
//                 {sub.ai_detection_score >= 50 ? 0 : (sub.ai_score ?? '—')}/{sub.max_score}
//               </p>
//               <div style={{ marginTop: 5 }}>
//                 <span className={`ai-pill ${sub.ai_detection_score >= 50 ? 'ai-pill--red' : sub.ai_detection_score >= 30 ? 'ai-pill--amber' : 'ai-pill--green'}`}>
//                   <span style={{ fontSize: 9 }}>{sub.ai_detection_score >= 50 ? '🚨' : sub.ai_detection_score >= 30 ? '⚠️' : '✅'}</span>
//                   {sub.ai_detection_score}% AI
//                 </span>
//               </div>
//             </div>
//           </div>

//           {sub.ai_detection_score >= 50 && (
//             <div className="alert-red">
//               <span>🚨</span>
//               <p>HIGH AI CONTENT — {sub.ai_detection_score}% detected. Score auto-set to 0. Review required.</p>
//             </div>
//           )}

//           <div style={{ marginTop: 14 }}>
//             <button onClick={() => openGrade(sub)} className="btn-sm-grade">✏️ Grade Essay</button>
//           </div>
//         </div>
//       ))}

//       {/* ── FULL-SCREEN GRADE MODAL ── */}
//       {gradeModal && (
//         <div style={{
//           position: 'fixed', inset: 0, zIndex: 500,
//           background: 'rgba(0,0,0,0.5)',
//           display: 'flex', alignItems: 'stretch', justifyContent: 'center',
//           padding: '20px',
//         }}>
//           <div style={{
//             background: '#fff', borderRadius: '20px',
//             width: '100%', maxWidth: '1100px',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
//             fontFamily: "'Inter', system-ui, sans-serif",
//           }}>

//             {/* Header */}
//             <div style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '16px 24px', borderBottom: '1px solid #e2e8f0',
//               background: '#f8fafc', flexShrink: 0,
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                 <div style={{
//                   width: 40, height: 40, borderRadius: '50%',
//                   background: gradeModal.ai_detection_score >= 50
//                     ? 'linear-gradient(135deg,#ef4444,#f87171)'
//                     : 'linear-gradient(135deg,#3b82f6,#38bdf8)',
//                   color: '#fff', fontWeight: 800, fontSize: 16,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 }}>
//                   {gradeModal.student_name?.charAt(0)}
//                 </div>
//                 <div>
//                   <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', margin: 0 }}>{gradeModal.student_name}</p>
//                   <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{gradeModal.assignment_title}</p>
//                 </div>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                 <span className={`ai-pill ${gradeModal.ai_detection_score >= 50 ? 'ai-pill--red' : gradeModal.ai_detection_score >= 30 ? 'ai-pill--amber' : 'ai-pill--green'}`}>
//                   {gradeModal.ai_detection_score >= 50 ? '🚨' : gradeModal.ai_detection_score >= 30 ? '⚠️' : '✅'} {gradeModal.ai_detection_score}% AI
//                 </span>
//                 <button onClick={() => setGradeModal(null)} style={{
//                   width: 36, height: 36, borderRadius: 10,
//                   border: '1px solid #e2e8f0', background: '#fff',
//                   fontSize: 18, cursor: 'pointer', color: '#64748b',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 }}>×</button>
//               </div>
//             </div>

//             {/* Body — side by side */}
//             <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

//               {/* LEFT — Essay */}
//               <div style={{
//                 flex: 1, overflowY: 'auto', padding: '24px',
//                 borderRight: '1px solid #e2e8f0',
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                   <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
//                     Student Essay
//                   </p>
//                   <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
//                     <span>📅 {new Date(gradeModal.submitted_at).toLocaleDateString()}</span>
//                     <span>📊 AI: {gradeModal.ai_detection_score >= 50 ? 0 : (gradeModal.ai_score ?? '—')}/{gradeModal.max_score}</span>
//                     {gradeModal.file_name && <span>📎 {gradeModal.file_name}</span>}
//                   </div>
//                 </div>

//                 {gradeModal.ai_detection_score >= 50 && (
//                   <div style={{
//                     background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
//                     padding: '10px 14px', marginBottom: 16,
//                     display: 'flex', gap: 8, alignItems: 'center',
//                   }}>
//                     <span>🚨</span>
//                     <p style={{ fontSize: 12, color: '#dc2626', fontWeight: 700, margin: 0 }}>
//                       {gradeModal.ai_detection_score}% AI content detected — score auto-set to 0
//                     </p>
//                   </div>
//                 )}

//                 {/* Essay text rendered like a document */}
//                 <div style={{
//                   background: '#fffef7',
//                   border: '1px solid #e2e8f0',
//                   borderRadius: 12,
//                   padding: '28px 32px',
//                   fontSize: 14,
//                   lineHeight: '1.9',
//                   color: '#1e293b',
//                   whiteSpace: 'pre-wrap',
//                   minHeight: '400px',
//                   fontFamily: 'Georgia, serif',
//                   boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.03)',
//                 }}>
//                   {gradeModal.essay_text || 'No essay text available.'}
//                 </div>
//               </div>

//               {/* RIGHT — Grading panel */}
//               <div style={{
//                 width: '320px', flexShrink: 0,
//                 overflowY: 'auto', padding: '24px',
//                 background: '#f8fafc',
//                 display: 'flex', flexDirection: 'column', gap: 16,
//               }}>
//                 <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
//                   Grading
//                 </p>

//                 {/* AI score summary */}
//                 {gradeModal.ai_score !== null && (
//                   <div style={{
//                     background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px',
//                   }}>
//                     <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', margin: '0 0 4px', textTransform: 'uppercase' }}>AI Suggested Score</p>
//                     <p style={{ fontSize: 24, fontWeight: 900, color: gradeModal.ai_detection_score >= 50 ? '#dc2626' : '#2563eb', margin: 0 }}>
//                       {gradeModal.ai_detection_score >= 50 ? 0 : gradeModal.ai_score}/{gradeModal.max_score}
//                     </p>
//                     <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>
//                       {aiLabel(gradeModal.ai_detection_score)} · {gradeModal.ai_detection_score}% AI detected
//                     </p>
//                   </div>
//                 )}

//                 {/* Score input */}
//                 <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 8 }}>
//                     Final Score * (max {gradeModal.max_score})
//                   </label>
//                   <input
//                     type="number" min="0" max={gradeModal.max_score}
//                     value={gradeScore}
//                     onChange={e => setGradeScore(e.target.value)}
//                     placeholder={`0 – ${gradeModal.max_score}`}
//                     style={{
//                       width: '100%', padding: '10px 14px',
//                       border: '1.5px solid #e2e8f0', borderRadius: 10,
//                       fontSize: 20, fontWeight: 800, color: '#1e293b',
//                       outline: 'none', fontFamily: 'inherit',
//                       textAlign: 'center',
//                     }}
//                   />
//                   {gradeScore !== '' && (
//                     <div style={{ marginTop: 10 }}>
//                       <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
//                         <div style={{
//                           height: '100%', borderRadius: 4,
//                           width: `${Math.min((gradeScore / gradeModal.max_score) * 100, 100)}%`,
//                           background: gradeScore / gradeModal.max_score >= 0.7 ? '#16a34a' : gradeScore / gradeModal.max_score >= 0.5 ? '#f59e0b' : '#ef4444',
//                           transition: 'width 0.2s',
//                         }} />
//                       </div>
//                       <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: '6px 0 0', textAlign: 'center' }}>
//                         {Math.round((gradeScore / gradeModal.max_score) * 100)}%
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Feedback */}
//                 <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', flex: 1 }}>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 8 }}>
//                     Feedback to Student
//                   </label>
//                   <textarea
//                     value={gradeFeedback}
//                     onChange={e => setGradeFeedback(e.target.value)}
//                     rows={5}
//                     placeholder="Write personalised feedback..."
//                     style={{
//                       width: '100%', padding: '10px 12px',
//                       border: '1.5px solid #e2e8f0', borderRadius: 10,
//                       fontSize: 13, lineHeight: 1.6, resize: 'vertical',
//                       fontFamily: 'inherit', outline: 'none', color: '#1e293b',
//                       boxSizing: 'border-box',
//                     }}
//                   />
//                 </div>

//                 {/* AI feedback — collapsed/small */}
//                 {gradeModal.ai_feedback && (
//                   <details style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '12px 14px' }}>
//                     <summary style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', cursor: 'pointer', userSelect: 'none' }}>
//                       🤖 View AI Feedback
//                     </summary>
//                     <p style={{ fontSize: 12, color: '#1e293b', lineHeight: 1.7, margin: '10px 0 0', whiteSpace: 'pre-wrap' }}>
//                       {gradeModal.ai_feedback}
//                     </p>
//                   </details>
//                 )}
//               </div>
//             </div>

//             {/* Footer */}
//             <div style={{
//               display: 'flex', justifyContent: 'flex-end', gap: 10,
//               padding: '14px 24px', borderTop: '1px solid #e2e8f0',
//               background: '#f8fafc', flexShrink: 0,
//             }}>
//               <button onClick={() => setGradeModal(null)} style={btnGhost}>Cancel</button>
             
//                               <button
//               onClick={handleSave}
//               disabled={!gradeScore || saving}
//               style={{ ...btnPrimary, opacity: (gradeScore && !saving) ? 1 : 0.5, cursor: (gradeScore && !saving) ? 'pointer' : 'not-allowed' }}
//             >
//               {saving ? '⏳ Saving…' : '💾 Save Grade'}
//             </button>


//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










import { useState } from 'react';
import { apiFetch } from './api.js';
import { Icon, Badge } from './shared.jsx';

const aiLabel  = s => s >= 50 ? 'High AI'    : s >= 30 ? 'Borderline' : 'Original';
const aiColor  = s => s >= 50 ? '#A32D2D'    : s >= 30 ? '#854F0B'    : '#3B6D11';
const aiBg     = s => s >= 50 ? '#FCEBEB'    : s >= 30 ? '#FAEEDA'    : '#EAF3DE';
const aiBorder = s => s >= 50 ? '#F7C1C1'    : s >= 30 ? '#FAC775'    : '#C0DD97';
const aiIcon   = s => s >= 50 ? 'alert-triangle' : s >= 30 ? 'alert-circle' : 'circle-check';

function ScoreBar({ value, max }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const color = pct >= 70 ? '#3B6D11' : pct >= 50 ? '#854F0B' : '#A32D2D';
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 5, background: '#F1EFE8', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.25s' }} />
      </div>
      <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color, textAlign: 'center' }}>{pct}%</p>
    </div>
  );
}

export default function PendingTab({ pending = [], loading, onViewEssay, onGrade, classId }) {
  const [gradeModal,    setGradeModal]    = useState(null);
  const [gradeScore,    setGradeScore]    = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [saving,        setSaving]        = useState(false);
  const [approvingAll,  setApprovingAll]  = useState(false);

  const approvable = pending.filter(s => s.ai_score !== null && s.ai_score !== undefined);

  const openGrade = sub => {
    setGradeModal(sub);
    setGradeScore(sub.ai_score ?? '');
    setGradeFeedback(sub.teacher_feedback || '');
  };

  const handleSave = async () => {
    if (!gradeScore) return;
    setSaving(true);
    try {
      await apiFetch('/submissions/grade', {
        method: 'POST',
        body: JSON.stringify({
          submission_id: gradeModal.id,
          score:         Number(gradeScore),
          feedback:      gradeFeedback,
        }),
      });
      setGradeModal(null);
      onGrade(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApproveAll = async () => {
    if (approvable.length === 0) return;
    if (!window.confirm(`Approve all ${approvable.length} AI-graded submission(s)? This will release scores to students.`)) return;
    setApprovingAll(true);
    try {
      const res = await apiFetch('/submissions/approve-all', {
        method: 'POST',
        body: JSON.stringify({ class_id: classId ?? null }),
      });
      alert(res.message);
      onGrade(null);
    } catch (err) {
      alert(err.message || 'Failed to approve all.');
    } finally {
      setApprovingAll(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── Header row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1A1830' }}>
            Pending review
          </h2>
          {pending.length > 0 && (
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#8884A8', fontWeight: 400 }}>
              {pending.length} submission{pending.length !== 1 ? 's' : ''} waiting
            </p>
          )}
        </div>

        {approvable.length > 0 && (
          <button
            onClick={handleApproveAll}
            disabled={approvingAll}
            style={{
              padding: '8px 16px', borderRadius: 9, border: 'none',
              background: approvingAll ? '#8884A8' : '#1A5C3A',
              color: '#fff', fontWeight: 500, fontSize: 13,
              cursor: approvingAll ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {approvingAll
              ? <><Icon name="loader" size={13} style={{ color: '#fff' }} /> Approving…</>
              : <><Icon name="checks" size={13} style={{ color: '#fff' }} /> Approve all ({approvable.length})</>
            }
          </button>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{
            width: 28, height: 28, margin: '0 auto 12px',
            border: '2px solid #E8E6FF', borderTopColor: '#3C3489',
            borderRadius: '50%', animation: 'spin 0.7s linear infinite',
          }} />
          <p style={{ fontSize: 13, color: '#8884A8', fontWeight: 500 }}>Loading submissions…</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && pending.length === 0 && (
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #ECECF2',
          textAlign: 'center', padding: '64px 24px',
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: 13,
            background: '#EAF3DE', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="circle-check" size={24} style={{ color: '#3B6D11' }} />
          </div>
          <p style={{ fontWeight: 700, color: '#1A1830', fontSize: 15, margin: '0 0 5px' }}>All caught up</p>
          <p style={{ fontSize: 13, color: '#8884A8', margin: 0 }}>No essays pending your review.</p>
        </div>
      )}

      {/* ── Submission cards ── */}
      {!loading && pending.map(sub => {
        const hasAiScore = sub.ai_score !== null && sub.ai_score !== undefined;
        const aiPct      = sub.ai_detection_score ?? 0;
        const isHighAI   = aiPct >= 50;
        const leftColor  = isHighAI ? '#A32D2D' : hasAiScore ? '#854F0B' : '#B5D4F4';

        return (
          <div key={sub.id} style={{
            background: '#fff',
            borderRadius: 13,
            border: '1px solid #ECECF2',
            borderLeft: `4px solid ${leftColor}`,
            padding: '18px 20px',
            marginBottom: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>

              {/* Left — student info */}
              <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: isHighAI ? '#FCEBEB' : hasAiScore ? '#FAEEDA' : '#E6F1FB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, flexShrink: 0,
                  color: isHighAI ? '#A32D2D' : hasAiScore ? '#854F0B' : '#185FA5',
                }}>
                  {sub.student_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1830', margin: '0 0 2px' }}>
                    {sub.student_name}
                  </p>
                  <p style={{ fontSize: 12, color: '#8884A8', margin: '0 0 5px' }}>
                    {sub.assignment_title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="clock" size={11} style={{ color: '#B0AECB' }} />
                    <p style={{ fontSize: 11, color: '#B0AECB', margin: 0 }}>
                      {new Date(sub.submitted_at).toLocaleString()}
                      {sub.file_name ? ` · ${sub.file_name}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — score + AI badge */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 10, color: '#B0AECB', margin: '0 0 3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI score
                </p>
                {hasAiScore ? (
                  <p style={{ fontSize: 19, fontWeight: 700, color: isHighAI ? '#A32D2D' : '#185FA5', margin: 0, lineHeight: 1 }}>
                    {isHighAI ? 0 : sub.ai_score}/{sub.max_score}
                  </p>
                ) : (
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#B0AECB', margin: 0 }}>
                    Not graded
                  </p>
                )}
                {sub.ai_detection_score !== null && sub.ai_detection_score !== undefined && (
                  <div style={{ marginTop: 5 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 20,
                      fontSize: 11, fontWeight: 600,
                      background: aiBg(aiPct), color: aiColor(aiPct),
                      border: `1px solid ${aiBorder(aiPct)}`,
                    }}>
                      <Icon name={aiIcon(aiPct)} size={11} style={{ color: aiColor(aiPct) }} />
                      {aiPct}% AI
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* High AI warning */}
            {isHighAI && (
              <div style={{
                marginTop: 12, background: '#FCEBEB',
                border: '1px solid #F7C1C1', borderRadius: 8,
                padding: '9px 12px', display: 'flex', gap: 7, alignItems: 'center',
              }}>
                <Icon name="alert-triangle" size={14} style={{ color: '#A32D2D', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#A32D2D', fontWeight: 600, margin: 0 }}>
                  High AI content detected ({aiPct}%) — score auto-set to 0. Review required.
                </p>
              </div>
            )}

            {/* Awaiting grading notice */}
            {!hasAiScore && !isHighAI && (
              <div style={{
                marginTop: 10, background: '#F8F7FF',
                border: '1px solid #E8E6FF', borderRadius: 8,
                padding: '8px 12px', display: 'flex', gap: 7, alignItems: 'center',
              }}>
                <Icon name="clock-hour-4" size={13} style={{ color: '#8884A8' }} />
                <p style={{ fontSize: 12, color: '#8884A8', margin: 0 }}>
                  Submitted — awaiting AI grading via Google Classroom.
                </p>
              </div>
            )}

            {/* Action button */}
            <div style={{ marginTop: 14 }}>
              <button
                onClick={() => openGrade(sub)}
                style={{
                  padding: '7px 15px', borderRadius: 8, border: 'none',
                  background: '#1A1830', color: '#fff',
                  fontWeight: 500, fontSize: 12, cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <Icon name="pencil" size={12} style={{ color: '#EEEDFE' }} />
                Grade essay
              </button>
            </div>
          </div>
        );
      })}

      {/* ── Grade modal ── */}
      {gradeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(15,13,40,0.55)',
          display: 'flex', alignItems: 'stretch', justifyContent: 'center',
          padding: 20, backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#fff', borderRadius: 18,
            width: '100%', maxWidth: 1100,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            fontFamily: "'DM Sans','Segoe UI',sans-serif",
          }}>

            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 22px', borderBottom: '1px solid #ECECF2',
              background: '#F8F7FF', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: (gradeModal.ai_detection_score ?? 0) >= 50 ? '#FCEBEB' : '#E6F1FB',
                  color: (gradeModal.ai_detection_score ?? 0) >= 50 ? '#A32D2D' : '#185FA5',
                  fontWeight: 700, fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {gradeModal.student_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1830', margin: 0 }}>
                    {gradeModal.student_name}
                  </p>
                  <p style={{ fontSize: 12, color: '#8884A8', margin: 0 }}>{gradeModal.assignment_title}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {gradeModal.ai_detection_score !== null && gradeModal.ai_detection_score !== undefined && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 20,
                    fontSize: 11, fontWeight: 600,
                    background: aiBg(gradeModal.ai_detection_score ?? 0),
                    color: aiColor(gradeModal.ai_detection_score ?? 0),
                    border: `1px solid ${aiBorder(gradeModal.ai_detection_score ?? 0)}`,
                  }}>
                    <Icon name={aiIcon(gradeModal.ai_detection_score ?? 0)} size={11} style={{ color: aiColor(gradeModal.ai_detection_score ?? 0) }} />
                    {gradeModal.ai_detection_score}% AI · {aiLabel(gradeModal.ai_detection_score ?? 0)}
                  </span>
                )}
                <button onClick={() => setGradeModal(null)} style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: '1px solid #ECECF2', background: '#fff',
                  cursor: 'pointer', color: '#5F5E5A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="x" size={15} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

              {/* LEFT — essay */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, borderRight: '1px solid #ECECF2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#B0AECB', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                    Student essay
                  </p>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#8884A8', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="calendar" size={12} style={{ color: '#B0AECB' }} />
                      {new Date(gradeModal.submitted_at).toLocaleDateString()}
                    </span>
                    {gradeModal.ai_score !== null && gradeModal.ai_score !== undefined && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="chart-bar" size={12} style={{ color: '#B0AECB' }} />
                        AI: {(gradeModal.ai_detection_score ?? 0) >= 50 ? 0 : gradeModal.ai_score}/{gradeModal.max_score}
                      </span>
                    )}
                    {gradeModal.file_name && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="paperclip" size={12} style={{ color: '#B0AECB' }} />
                        {gradeModal.file_name}
                      </span>
                    )}
                  </div>
                </div>

                {(gradeModal.ai_detection_score ?? 0) >= 50 && (
                  <div style={{
                    background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: 9,
                    padding: '10px 14px', marginBottom: 14,
                    display: 'flex', gap: 8, alignItems: 'center',
                  }}>
                    <Icon name="alert-triangle" size={14} style={{ color: '#A32D2D', flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: '#A32D2D', fontWeight: 600, margin: 0 }}>
                      {gradeModal.ai_detection_score}% AI content detected — score auto-set to 0
                    </p>
                  </div>
                )}

                <div style={{
                  background: '#FDFCF7', border: '1px solid #ECECF2', borderRadius: 12,
                  padding: '24px 28px', fontSize: 14, lineHeight: 1.9, color: '#1A1830',
                  whiteSpace: 'pre-wrap', minHeight: 400, fontFamily: 'Georgia, serif',
                }}>
                  {gradeModal.essay_text || 'No essay text available.'}
                </div>
              </div>

              {/* RIGHT — grading panel */}
              <div style={{
                width: 300, flexShrink: 0, overflowY: 'auto', padding: 22,
                background: '#F8F7FF', display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#B0AECB', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                  Grading
                </p>

                {/* AI suggested score */}
                {gradeModal.ai_score !== null && gradeModal.ai_score !== undefined ? (
                  <div style={{ background: '#fff', border: '1px solid #ECECF2', borderRadius: 11, padding: '13px 15px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#B0AECB', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      AI suggested score
                    </p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: (gradeModal.ai_detection_score ?? 0) >= 50 ? '#A32D2D' : '#185FA5', margin: 0 }}>
                      {(gradeModal.ai_detection_score ?? 0) >= 50 ? 0 : gradeModal.ai_score}
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#8884A8' }}>/{gradeModal.max_score}</span>
                    </p>
                  </div>
                ) : (
                  <div style={{ background: '#FAEEDA', border: '1px solid #FAC775', borderRadius: 11, padding: '13px 15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Icon name="clock-hour-4" size={13} style={{ color: '#854F0B' }} />
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#854F0B', margin: 0 }}>Not yet AI graded</p>
                    </div>
                    <p style={{ fontSize: 11, color: '#92400E', margin: 0 }}>
                      Grade manually below, or process via Google Classroom first.
                    </p>
                  </div>
                )}

                {/* Score input */}
                <div style={{ background: '#fff', border: '1px solid #ECECF2', borderRadius: 11, padding: '13px 15px' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#8884A8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
                    Final score — max {gradeModal.max_score}
                  </label>
                  <input
                    type="number" min="0" max={gradeModal.max_score}
                    value={gradeScore}
                    onChange={e => setGradeScore(e.target.value)}
                    placeholder={`0 – ${gradeModal.max_score}`}
                    style={{
                      width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                      border: '1px solid #D3D1C7', borderRadius: 9,
                      fontSize: 22, fontWeight: 700, color: '#1A1830',
                      outline: 'none', fontFamily: 'inherit', textAlign: 'center',
                    }}
                  />
                  {gradeScore !== '' && (
                    <ScoreBar value={Number(gradeScore)} max={gradeModal.max_score} />
                  )}
                </div>

                {/* Feedback */}
                <div style={{ background: '#fff', border: '1px solid #ECECF2', borderRadius: 11, padding: '13px 15px', flex: 1 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#8884A8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
                    Feedback to student
                  </label>
                  <textarea
                    value={gradeFeedback}
                    onChange={e => setGradeFeedback(e.target.value)}
                    rows={5}
                    placeholder="Write personalised feedback…"
                    style={{
                      width: '100%', padding: '9px 11px', boxSizing: 'border-box',
                      border: '1px solid #D3D1C7', borderRadius: 9,
                      fontSize: 13, lineHeight: 1.6, resize: 'vertical',
                      fontFamily: 'inherit', outline: 'none', color: '#1A1830',
                    }}
                  />
                </div>

                {/* AI feedback */}
                {gradeModal.ai_feedback && (
                  <details style={{ background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 11, padding: '11px 13px' }}>
                    <summary style={{ fontSize: 12, fontWeight: 600, color: '#185FA5', cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="robot" size={13} style={{ color: '#185FA5' }} />
                      View AI feedback
                    </summary>
                    <p style={{ fontSize: 12, color: '#1A1830', lineHeight: 1.7, margin: '10px 0 0', whiteSpace: 'pre-wrap' }}>
                      {gradeModal.ai_feedback}
                    </p>
                  </details>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 8,
              padding: '12px 22px', borderTop: '1px solid #ECECF2',
              background: '#F8F7FF', flexShrink: 0,
            }}>
              <button onClick={() => setGradeModal(null)} style={{
                padding: '9px 20px', borderRadius: 9,
                border: '1px solid #D3D1C7', background: '#F1EFE8',
                color: '#5F5E5A', fontWeight: 500, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!gradeScore || saving}
                style={{
                  padding: '9px 22px', borderRadius: 9, border: 'none',
                  background: (!gradeScore || saving) ? '#8884A8' : '#1A1830',
                  color: '#fff', fontWeight: 500, fontSize: 13,
                  cursor: (!gradeScore || saving) ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                {saving
                  ? <><Icon name="loader" size={13} style={{ color: '#fff' }} /> Saving…</>
                  : <><Icon name="device-floppy" size={13} style={{ color: '#fff' }} /> Save grade</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}