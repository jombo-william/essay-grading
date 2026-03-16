import { useState } from 'react';

const MOCK_STUDENTS = [
  { id: 2, name: 'Alice Mwale', email: 'alice@example.com' },
  { id: 3, name: 'Brian Phiri', email: 'brian@example.com' },
  { id: 4, name: 'Chisomo Banda', email: 'chisomo@example.com' },
  { id: 5, name: 'Diana Tembo', email: 'diana@example.com' },
];

const ALL_SUBMISSIONS_INIT = [
  {
    id: 101, student_id: 2, assignment_id: 1, student_name: 'Alice Mwale', assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change is one of the most pressing global challenges...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-04T10:30:00',
    ai_score: 82, ai_detection_score: 8,
    ai_feedback: 'Content (28/35): Three clear impacts identified. Structure (22/25): Clear paragraphs. Grammar (18/20): Fluent. Evidence (14/20): Needs more statistics.\nAI Detection: Low (~8%).',
    final_score: 85, teacher_feedback: 'Excellent work Alice!', status: 'graded'
  },
  {
    id: 102, student_id: 2, assignment_id: 2, student_name: 'Alice Mwale', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: 'Artificial intelligence is rapidly transforming education...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-10T14:00:00',
    ai_score: 76, ai_detection_score: 18,
    ai_feedback: 'Argumentation (30/40): Balanced perspective. Structure (20/25): Good flow. Grammar (16/20): Minor errors. Evidence (10/15): Needs citations.\nAI Detection: Low (~18%).',
    final_score: null, teacher_feedback: null, status: 'ai_graded'
  },
  {
    id: 103, student_id: 3, assignment_id: 1, student_name: 'Brian Phiri', assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change represents a multifaceted global challenge...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-05T11:00:00',
    ai_score: 0, ai_detection_score: 81,
    ai_feedback: '⚠️ HIGH AI CONTENT (81%)\nUniform sentence structure, generic phrasing. Score: 0/100.',
    final_score: null, teacher_feedback: null, status: 'ai_graded'
  },
  {
    id: 104, student_id: 3, assignment_id: 2, student_name: 'Brian Phiri', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: '[Content from uploaded file: AI_Education_Essay_BPhiri.pdf]',
    file_name: 'AI_Education_Essay_BPhiri.pdf', submit_mode: 'upload', submitted_at: '2026-03-12T09:30:00',
    ai_score: 71, ai_detection_score: 12,
    ai_feedback: 'Argumentation (28/40): Good. Structure (22/25): Well organised. Grammar (18/20): Strong. Evidence (3/15): Few citations.\nAI Detection: Low (~12%).',
    final_score: 68, teacher_feedback: 'Good effort Brian. Need stronger evidence.', status: 'graded'
  },
  {
    id: 105, student_id: 4, assignment_id: 1, student_name: 'Chisomo Banda', assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change poses existential risks to developing nations...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-15T16:45:00',
    ai_score: null, ai_detection_score: null, ai_feedback: null,
    final_score: null, teacher_feedback: null, status: 'pending'
  },
  {
    id: 106, student_id: 5, assignment_id: 2, student_name: 'Diana Tembo', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: '[Content from uploaded file: diana_essay.docx]',
    file_name: 'diana_essay.docx', submit_mode: 'upload', submitted_at: '2026-03-11T10:15:00',
    ai_score: 88, ai_detection_score: 5,
    ai_feedback: 'Argumentation (38/40): Exceptional. Structure (24/25): Near perfect. Grammar (19/20): Excellent. Evidence (7/15): Needs academic sources.\nAI Detection: Very low (~5%).',
    final_score: 91, teacher_feedback: 'Outstanding Diana!', status: 'graded'
  },
  {
    id: 107, student_id: 3, assignment_id: 3, student_name: 'Brian Phiri', assignment_title: 'The Role of Entrepreneurs in Africa', max_score: 100,
    essay_text: 'Entrepreneurship in Africa is often discussed in the context of M-Pesa...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-01-28T20:00:00',
    ai_score: 63, ai_detection_score: 31,
    ai_feedback: 'Content (20/30): Good examples but shallow. Structure (18/25): Needs transitions. Grammar (16/20): Several errors. Examples (9/25): More detail needed.\nAI Detection: Borderline (~31%).',
    final_score: null, teacher_feedback: null, status: 'ai_graded'
  },
];

const C = {
  page: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
  header: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' },
  main: { maxWidth: '1000px', margin: '0 auto', padding: '24px 16px 60px' },
  sL: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
  pBtn: { padding: '11px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 2px 10px rgba(99,102,241,0.35)' },
  gBtn: { padding: '11px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: 'none', background: '#f1f5f9', color: '#475569' },
  input: { width: '100%', padding: '10px 14px', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#1e293b', outline: 'none', fontFamily: 'inherit', background: '#fff' },
};

const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';

function StatusBadge({ status, aiDetection }) {
  if (aiDetection >= 50) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
      🚨 AI Flagged
    </span>
  );
  if (status === 'graded') return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
      ✅ Graded
    </span>
  );
  if (status === 'ai_graded') return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
      ⏳ Not Graded
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
      🤖 Processing
    </span>
  );
}

function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(3px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '720px', maxHeight: '96vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
        </div>
        <div style={{ padding: '8px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: '800', fontSize: '17px', color: '#1e293b', margin: '0 0 2px', lineHeight: 1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer', color: '#64748b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div>
        {footer && <div style={{ padding: '14px 20px 20px', borderTop: '1px solid #f1f5f9' }}>{footer}</div>}
      </div>
    </div>
  );
}

export default function StudentsTab({ onBack }) {
  const [submissions, setSubmissions] = useState(ALL_SUBMISSIONS_INIT);
  const [toast, setToast] = useState(null);
  const [gradeModal, setGradeModal] = useState(null);
  const [editGradeModal, setEditGradeModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const openGrade = sub => { setGradeModal(sub); setGradeScore(sub.ai_score ?? ''); setGradeFeedback(''); };
  const openEditGrade = sub => { setEditGradeModal(sub); setGradeScore(sub.final_score ?? ''); setGradeFeedback(sub.teacher_feedback || ''); };
  const openFeedback = sub => { setFeedbackModal(sub); setGradeFeedback(sub.teacher_feedback || ''); };

  const saveGrade = () => {
    const score = parseInt(gradeScore);
    if (isNaN(score) || score < 0 || score > gradeModal.max_score) { showToast('Invalid score.', 'error'); return; }
    setSubmissions(prev => prev.map(s => s.id === gradeModal.id ? { ...s, final_score: score, teacher_feedback: gradeFeedback, status: 'graded' } : s));
    setGradeModal(null);
    showToast('✅ Grade saved and visible to student.');
  };

  const saveEditGrade = () => {
    const score = parseInt(gradeScore);
    if (isNaN(score) || score < 0 || score > editGradeModal.max_score) { showToast('Invalid score.', 'error'); return; }
    setSubmissions(prev => prev.map(s => s.id === editGradeModal.id ? { ...s, final_score: score, teacher_feedback: gradeFeedback, status: 'graded' } : s));
    setEditGradeModal(null);
    showToast('✅ Grade updated.');
  };

  const saveFeedback = () => {
    setSubmissions(prev => prev.map(s => s.id === feedbackModal.id ? { ...s, teacher_feedback: gradeFeedback } : s));
    setFeedbackModal(null);
    showToast('✅ Feedback saved.');
  };

  // Flatten all submissions into rows with student info, sorted by submitted_at desc
  const rows = submissions
    .map(sub => ({ ...sub }))
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const thStyle = { padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '1px solid #e2e8f0' };
  const tdStyle = { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' };

  return (
    <div style={C.page}>

      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: toast.type === 'error' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#bbf7d0'}`, color: toast.type === 'error' ? '#dc2626' : '#15803d', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', maxWidth: '90vw', textAlign: 'center' }}>
          {toast.msg}
        </div>
      )}

      <header style={C.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px' }}>✍️</div>
          <div>
            <p style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', margin: 0 }}>EssayGrade AI</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Students Overview</p>
          </div>
        </div>
        {onBack && <button onClick={onBack} style={{ background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: '600', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>← Home</button>}
      </header>

      <div style={C.main}>
        <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px' }}>Students Overview</p>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Assignment Submitted</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>AI Score</th>
                  <th style={thStyle}>Final Score</th>
                  <th style={thStyle}>AI Flag</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(sub => {
                  const isFlagged = sub.ai_detection_score >= 50;
                  const finalPct = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;

                  return (
                    <tr key={sub.id}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafe'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                      {/* Student */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '30px', height: '30px', background: isFlagged ? '#fee2e2' : 'linear-gradient(135deg,#8b5cf6,#a78bfa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isFlagged ? '#dc2626' : '#fff', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>
                            {sub.student_name.charAt(0)}
                          </div>
                          <p style={{ fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '13px', whiteSpace: 'nowrap' }}>{sub.student_name}</p>
                        </div>
                      </td>

                      {/* Assignment Submitted */}
                      <td style={tdStyle}>
                        <p style={{ fontWeight: '600', color: '#1e293b', margin: '0 0 2px', fontSize: '13px' }}>{sub.assignment_title}</p>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                          {new Date(sub.submitted_at).toLocaleDateString()}
                          {sub.file_name && <span style={{ color: '#8b5cf6', marginLeft: '6px' }}>📎 {sub.file_name}</span>}
                        </p>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <StatusBadge status={sub.status} aiDetection={sub.ai_detection_score} />
                      </td>

                      {/* AI Score */}
                      <td style={tdStyle}>
                        {sub.ai_score !== null
                          ? <span style={{ fontWeight: '700', color: isFlagged ? '#dc2626' : '#6366f1', fontSize: '13px' }}>{isFlagged ? 0 : sub.ai_score}/{sub.max_score}</span>
                          : <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>}
                      </td>

                      {/* Final Score */}
                      <td style={tdStyle}>
                        {sub.final_score !== null
                          ? <span style={{ fontWeight: '800', color: scoreColor(finalPct), fontSize: '13px' }}>{sub.final_score}/{sub.max_score}</span>
                          : <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>}
                      </td>

                      {/* AI Flag */}
                      <td style={tdStyle}>
                        {sub.ai_detection_score !== null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: isFlagged ? '#dc2626' : sub.ai_detection_score >= 30 ? '#d97706' : '#16a34a' }}>
                              {isFlagged ? '🚨' : sub.ai_detection_score >= 30 ? '⚠️' : '✅'} {sub.ai_detection_score}%
                            </span>
                          </div>
                        ) : <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>}
                      </td>

                      {/* Actions */}
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'nowrap' }}>
                          {/* Grade — only for ai_graded */}
                          {sub.status === 'ai_graded' && (
                            <button onClick={() => openGrade(sub)}
                              style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              ✏️ Grade
                            </button>
                          )}
                          {/* Edit Grade — only for graded */}
                          {sub.status === 'graded' && (
                            <button onClick={() => openEditGrade(sub)}
                              style={{ padding: '5px 10px', borderRadius: '7px', border: '1px solid #c7d2fe', background: '#eff6ff', color: '#4f46e5', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              🔁 Edit Grade
                            </button>
                          )}
                          {/* Feedback — always available if graded or ai_graded */}
                          {(sub.status === 'graded' || sub.status === 'ai_graded') && (
                            <button onClick={() => openFeedback(sub)}
                              style={{ padding: '5px 10px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              💬 Feedback
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
        </div>
      </div>

      {/* ─── GRADE MODAL ─── */}
      {gradeModal && (
        <Sheet onClose={() => setGradeModal(null)} title={gradeModal.student_name} subtitle={gradeModal.assignment_title}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setGradeModal(null)} style={C.gBtn}>Cancel</button>
              <button onClick={saveGrade} style={C.pBtn}>💾 Save Grade</button>
            </div>
          }>

          {/* AI Score summary */}
          {gradeModal.ai_score !== null && (
            <div style={{ background: gradeModal.ai_detection_score >= 50 ? '#fef2f2' : '#eff6ff', border: `1px solid ${gradeModal.ai_detection_score >= 50 ? '#fecaca' : '#bfdbfe'}`, borderRadius: '12px', padding: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{gradeModal.ai_detection_score >= 50 ? '🚨' : '🤖'}</span>
              <div>
                <p style={{ fontWeight: '700', color: gradeModal.ai_detection_score >= 50 ? '#dc2626' : '#1d4ed8', fontSize: '14px', margin: '0 0 2px' }}>
                  AI Score: {gradeModal.ai_detection_score >= 50 ? 0 : gradeModal.ai_score}/{gradeModal.max_score}
                  {gradeModal.ai_detection_score >= 50 && ' · AI Flagged'}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>You can accept or override below. AI detection: {gradeModal.ai_detection_score}%</p>
              </div>
            </div>
          )}

          {/* Essay */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '16px', maxHeight: '150px', overflow: 'auto' }}>
            <p style={C.sL}>Essay Submitted</p>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-wrap' }}>{gradeModal.essay_text}</p>
          </div>

          {/* AI Feedback */}
          {gradeModal.ai_feedback && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
              <p style={{ ...C.sL, color: '#1d4ed8' }}>🤖 AI Feedback</p>
              <p style={{ fontSize: '12px', color: '#1e293b', margin: 0, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{gradeModal.ai_feedback}</p>
            </div>
          )}

          {/* Final score */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ ...C.sL, display: 'block', marginBottom: '6px' }}>Final Score (out of {gradeModal.max_score}) *</label>
            <input style={{ ...C.input, width: '160px' }} type="number" min="0" max={gradeModal.max_score} value={gradeScore} onChange={e => setGradeScore(e.target.value)} placeholder={`0 – ${gradeModal.max_score}`} />
          </div>

          {/* Feedback */}
          <div>
            <label style={{ ...C.sL, display: 'block', marginBottom: '6px' }}>Feedback to Student</label>
            <textarea value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} rows={4} placeholder="Write personalised feedback..."
              style={{ ...C.input, resize: 'vertical', lineHeight: '1.6' }} />
          </div>
        </Sheet>
      )}

      {/* ─── EDIT GRADE MODAL ─── */}
      {editGradeModal && (
        <Sheet onClose={() => setEditGradeModal(null)} title="Edit Grade" subtitle={`${editGradeModal.student_name} — ${editGradeModal.assignment_title}`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setEditGradeModal(null)} style={C.gBtn}>Cancel</button>
              <button onClick={saveEditGrade} style={C.pBtn}>💾 Update Grade</button>
            </div>
          }>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>✏️</span>
            <p style={{ fontSize: '13px', color: '#92400e', fontWeight: '600', margin: 0 }}>
              Current grade: <strong>{editGradeModal.final_score}/{editGradeModal.max_score}</strong> ({Math.round((editGradeModal.final_score / editGradeModal.max_score) * 100)}%). You are overriding this.
            </p>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ ...C.sL, display: 'block', marginBottom: '6px' }}>New Score (out of {editGradeModal.max_score})</label>
            <input style={{ ...C.input, width: '160px' }} type="number" min="0" max={editGradeModal.max_score} value={gradeScore} onChange={e => setGradeScore(e.target.value)} />
          </div>

          <div>
            <label style={{ ...C.sL, display: 'block', marginBottom: '6px' }}>Updated Feedback</label>
            <textarea value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} rows={4}
              style={{ ...C.input, resize: 'vertical', lineHeight: '1.6' }} />
          </div>
        </Sheet>
      )}

      {/* ─── FEEDBACK MODAL ─── */}
      {feedbackModal && (
        <Sheet onClose={() => setFeedbackModal(null)} title="Give Feedback" subtitle={`${feedbackModal.student_name} — ${feedbackModal.assignment_title}`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setFeedbackModal(null)} style={C.gBtn}>Cancel</button>
              <button onClick={saveFeedback} style={C.pBtn}>💾 Save Feedback</button>
            </div>
          }>

          {/* Existing AI feedback for reference */}
          {feedbackModal.ai_feedback && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <p style={{ ...C.sL, color: '#1d4ed8' }}>🤖 AI Feedback (for reference)</p>
              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{feedbackModal.ai_feedback}</p>
            </div>
          )}

          {/* Existing teacher feedback */}
          {feedbackModal.teacher_feedback && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <p style={{ ...C.sL, color: '#15803d' }}>👨‍🏫 Current Feedback</p>
              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.8' }}>{feedbackModal.teacher_feedback}</p>
            </div>
          )}

          <div>
            <label style={{ ...C.sL, display: 'block', marginBottom: '6px' }}>
              {feedbackModal.teacher_feedback ? 'Update Feedback' : 'Write Feedback to Student'}
            </label>
            <textarea value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} rows={5}
              placeholder="Write personalised feedback for the student..."
              style={{ ...C.input, resize: 'vertical', lineHeight: '1.6' }} />
          </div>
        </Sheet>
      )}

    </div>
  );
}
