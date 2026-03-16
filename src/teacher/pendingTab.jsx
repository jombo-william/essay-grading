import { useState } from 'react';

const ALL_SUBMISSIONS_INIT = [
  {
    id: 101, student_id: 2, assignment_id: 1, student_name: 'Alice Mwale', assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change is one of the most pressing global challenges... [full essay content would appear here, demonstrating the student\'s analysis of food insecurity, economic losses, and mass displacement across developing nations with references to IPCC, World Bank, and IOM reports]',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-04T10:30:00',
    ai_score: 82, ai_detection_score: 8,
    ai_feedback: 'Content (28/35): Three clear impacts identified with relevant examples. Structure (22/25): Clear paragraphs. Grammar (18/20): Fluent writing. Evidence (14/20): Good citations but needs more statistics.\nAI Detection: Low (~8%). Appears authentically written.',
    final_score: 85, teacher_feedback: 'Excellent work Alice! Strong analysis with good examples. Watch citation formatting.', status: 'graded'
  },

  {
    id: 102, student_id: 2, assignment_id: 2, student_name: 'Alice Mwale', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: 'Artificial intelligence is rapidly transforming education... [essay presenting balanced arguments on AI integration in secondary schools]',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-10T14:00:00',
    ai_score: 76, ai_detection_score: 18,
    ai_feedback: 'Argumentation (30/40): Balanced perspective. Structure (20/25): Good flow. Grammar (16/20): Minor errors. Evidence (10/15): Needs more specific citations.\nAI Detection: Low (~18%). Original work.',
    final_score: null, teacher_feedback: null, status: 'ai_graded'
  },

  {
    id: 103, student_id: 3, assignment_id: 1, student_name: 'Brian Phiri', assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change represents a multifaceted global challenge with profound socio-economic implications...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-05T11:00:00',
    ai_score: 0, ai_detection_score: 81,
    ai_feedback: '⚠️ HIGH AI CONTENT (81%)\nUniform sentence structure, generic phrasing, no local examples, vocabulary patterns consistent with LLMs. Score: 0/100.',
    final_score: null, teacher_feedback: null, status: 'ai_graded'
  },

  {
    id: 104, student_id: 3, assignment_id: 2, student_name: 'Brian Phiri', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: '[Content from uploaded file: AI_Education_Essay_BPhiri.pdf]',
    file_name: 'AI_Education_Essay_BPhiri.pdf', submit_mode: 'upload', submitted_at: '2026-03-12T09:30:00',
    ai_score: 71, ai_detection_score: 12,
    ai_feedback: 'Argumentation (28/40): Good but needs stronger counterarguments. Structure (22/25): Well organised. Grammar (18/20): Strong. Evidence (3/15): Very few citations.\nAI Detection: Low (~12%). Authentic writing.',
    final_score: 68, teacher_feedback: 'Good effort Brian. Need much stronger evidence.', status: 'graded'
  },

  {
    id: 107, student_id: 3, assignment_id: 3, student_name: 'Brian Phiri', assignment_title: 'The Role of Entrepreneurs in Africa', max_score: 100,
    essay_text: 'Entrepreneurship in Africa is often discussed in the context of M-Pesa in Kenya...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-01-28T20:00:00',
    ai_score: 63, ai_detection_score: 31,
    ai_feedback: 'Content (20/30): Good examples but shallow analysis. Structure (18/25): Needs better transitions. Grammar (16/20): Several errors. Examples (9/25): More country-specific detail needed.\nAI Detection: Borderline (~31%).',
    final_score: null, teacher_feedback: null, status: 'ai_graded'
  },
];

const C = {
  page: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
  header: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '24px 16px 60px' },
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' },
  sL: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
  pBtn: { padding: '11px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 2px 10px rgba(99,102,241,0.35)' },
  gBtn: { padding: '11px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: 'none', background: '#f1f5f9', color: '#475569' },
  input: { width: '100%', padding: '10px 14px', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#1e293b', outline: 'none', fontFamily: 'inherit', background: '#fff' },
};

function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(3px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '700px', maxHeight: '96vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}>
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

export default function PendingTab({ onBack }) {
  const [submissions, setSubmissions] = useState(ALL_SUBMISSIONS_INIT);
  const [toast, setToast] = useState(null);
  const [gradeModal, setGradeModal] = useState(null);
  const [viewModal, setViewModal] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const pending = submissions.filter(s => s.status === 'ai_graded' && s.final_score === null);

  const openGrade = sub => { setGradeModal(sub); setGradeScore(sub.ai_score ?? ''); setGradeFeedback(sub.teacher_feedback || ''); };

  const saveGrade = () => {
    const score = parseInt(gradeScore);
    if (isNaN(score) || score < 0 || score > gradeModal.max_score) { showToast('Invalid score.', 'error'); return; }
    setSubmissions(prev => prev.map(s => s.id === gradeModal.id ? { ...s, final_score: score, teacher_feedback: gradeFeedback, status: 'graded' } : s));
    setGradeModal(null);
    showToast('✅ Grade saved and visible to student.');
  };

  const aiColor = score => score >= 50 ? '#dc2626' : score >= 30 ? '#d97706' : '#16a34a';
  const aiLabel = score => score >= 50 ? 'High AI' : score >= 30 ? 'Borderline' : 'Original';

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
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Pending Review</p>
          </div>
        </div>
        {onBack && <button onClick={onBack} style={{ background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: '600', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>← Home</button>}
      </header>

      <div style={C.main}>
        <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px' }}>
          Pending Review {pending.length > 0 && <span style={{ fontSize: '14px', color: '#d97706', fontWeight: '700' }}>({pending.length})</span>}
        </p>

        {pending.length === 0 ? (
          <div style={{ ...C.card, textAlign: 'center', padding: '56px 24px' }}>
            <p style={{ fontSize: '40px', margin: '0 0 10px' }}>✅</p>
            <p style={{ fontWeight: '700', color: '#64748b', fontSize: '15px', margin: '0 0 4px' }}>All caught up!</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>No essays pending your review.</p>
          </div>
        ) : pending.map(sub => (
          <div key={sub.id} style={{ ...C.card, borderLeft: `4px solid ${sub.ai_detection_score >= 50 ? '#ef4444' : '#f59e0b'}` }}>
            {/* Card top: avatar + name/assignment + AI score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                <div style={{ width: '42px', height: '42px', background: sub.ai_detection_score >= 50 ? '#fee2e2' : '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color: sub.ai_detection_score >= 50 ? '#dc2626' : '#d97706', flexShrink: 0 }}>
                  {sub.student_name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', margin: '0 0 2px' }}>{sub.student_name}</p>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px' }}>{sub.assignment_title}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                    Submitted {new Date(sub.submitted_at).toLocaleString()}
                    {sub.file_name ? ` · 📎 ${sub.file_name}` : ''}
                  </p>
                </div>
              </div>

              {/* AI Score % badge - prominent on card */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 2px', fontWeight: '600' }}>AI Score</p>
                <p style={{ fontSize: '20px', fontWeight: '800', color: sub.ai_detection_score >= 50 ? '#dc2626' : '#6366f1', margin: 0, lineHeight: 1 }}>
                  {sub.ai_detection_score >= 50 ? 0 : sub.ai_score}/{sub.max_score}
                </p>
                {/* AI detection % pill */}
                <div style={{ marginTop: '5px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: sub.ai_detection_score >= 50 ? '#fef2f2' : sub.ai_detection_score >= 30 ? '#fff7ed' : '#f0fdf4', border: `1px solid ${sub.ai_detection_score >= 50 ? '#fecaca' : sub.ai_detection_score >= 30 ? '#fed7aa' : '#bbf7d0'}`, borderRadius: '20px', padding: '2px 8px' }}>
                  <span style={{ fontSize: '9px' }}>{sub.ai_detection_score >= 50 ? '🚨' : sub.ai_detection_score >= 30 ? '⚠️' : '✅'}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: aiColor(sub.ai_detection_score) }}>{sub.ai_detection_score}% AI</span>
                </div>
              </div>
            </div>

            {/* High AI warning banner */}
            {sub.ai_detection_score >= 50 && (
              <div style={{ marginTop: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span>🚨</span>
                <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', margin: 0 }}>HIGH AI CONTENT — {sub.ai_detection_score}% detected. Score auto-set to 0. Review required.</p>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => setViewModal(sub)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                👁 View Essay
              </button>
              <button onClick={() => openGrade(sub)} style={{ ...C.pBtn, padding: '8px 18px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                ✏️ Grade Essay
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── VIEW ESSAY MODAL ─── */}
      {viewModal && (
        <Sheet
          onClose={() => setViewModal(null)}
          title={viewModal.assignment_title}
          subtitle={`${viewModal.student_name} · Submitted ${new Date(viewModal.submitted_at).toLocaleString()}`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              {viewModal.status === 'ai_graded' && (
                <button onClick={() => { setViewModal(null); openGrade(viewModal); }} style={C.pBtn}>
                  ✏️ Grade Essay
                </button>
              )}
              <button onClick={() => setViewModal(null)} style={C.gBtn}>Close</button>
            </div>
          }
        >
          {/* Metadata row: assignment, date/time, AI score, AI detection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Assignment', value: viewModal.assignment_title },
              { label: 'Date & Time Submitted', value: new Date(viewModal.submitted_at).toLocaleString() },
              { label: 'AI Score', value: viewModal.ai_detection_score >= 50 ? `0/${viewModal.max_score}` : viewModal.ai_score !== null ? `${viewModal.ai_score}/${viewModal.max_score}` : '—' },
              { label: 'AI Detection', value: viewModal.ai_detection_score !== null ? `${viewModal.ai_detection_score}% — ${aiLabel(viewModal.ai_detection_score)}${viewModal.ai_detection_score >= 50 ? ' 🚨' : viewModal.ai_detection_score >= 30 ? ' ⚠️' : ' ✅'}` : '—' },
            ].map(d => (
              <div key={d.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
                <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 3px' }}>{d.label}</p>
                <p style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600', margin: 0 }}>{d.value}</p>
              </div>
            ))}
          </div>

          {/* High AI alert */}
          {viewModal.ai_detection_score >= 50 && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', gap: '8px' }}>
              <span>🚨</span>
              <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', margin: 0 }}>{viewModal.ai_detection_score}% AI content detected. Score automatically set to 0.</p>
            </div>
          )}

          {/* AI Feedback (Grammar, Argumentation, etc.) */}
          {viewModal.ai_feedback && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
              <p style={{ ...C.sL, color: '#1d4ed8' }}>🤖 AI Feedback</p>
              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{viewModal.ai_feedback}</p>
            </div>
          )}

          {/* Essay text */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <p style={C.sL}>Essay Text</p>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.85', margin: 0, whiteSpace: 'pre-wrap' }}>{viewModal.essay_text}</p>
          </div>
        </Sheet>
      )}

      {/* ─── GRADE ESSAY MODAL ─── */}
      {gradeModal && (
        <Sheet
          onClose={() => setGradeModal(null)}
          title={gradeModal.student_name}
          subtitle={gradeModal.assignment_title}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setGradeModal(null)} style={C.gBtn}>Cancel</button>
              <button onClick={saveGrade} style={C.pBtn}>💾 Save Grade</button>
            </div>
          }
        >
          {/* AI Score summary */}
          {gradeModal.ai_score !== null && (
            <div style={{ background: gradeModal.ai_detection_score >= 50 ? '#fef2f2' : '#eff6ff', border: `1px solid ${gradeModal.ai_detection_score >= 50 ? '#fecaca' : '#bfdbfe'}`, borderRadius: '12px', padding: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{gradeModal.ai_detection_score >= 50 ? '🚨' : '🤖'}</span>
              <div>
                <p style={{ fontWeight: '700', color: gradeModal.ai_detection_score >= 50 ? '#dc2626' : '#1d4ed8', fontSize: '14px', margin: '0 0 2px' }}>
                  AI Score: {gradeModal.ai_detection_score >= 50 ? 0 : gradeModal.ai_score}/{gradeModal.max_score}
                  {gradeModal.ai_detection_score >= 50 && ' · AI Flagged'}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                  You can accept or override below. AI detection: {gradeModal.ai_detection_score}%
                </p>
              </div>
            </div>
          )}

          {/* Essay submitted */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '16px', maxHeight: '160px', overflow: 'auto' }}>
            <p style={C.sL}>Essay Submitted</p>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-wrap' }}>{gradeModal.essay_text}</p>
          </div>

          {/* Final Score input */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ ...C.sL, display: 'block', marginBottom: '6px' }}>Final Score (out of {gradeModal.max_score}) *</label>
            <input
              style={{ ...C.input, width: '160px' }}
              type="number"
              min="0"
              max={gradeModal.max_score}
              value={gradeScore}
              onChange={e => setGradeScore(e.target.value)}
              placeholder={`0 – ${gradeModal.max_score}`}
            />
          </div>

          {/* Feedback input */}
          <div>
            <label style={{ ...C.sL, display: 'block', marginBottom: '6px' }}>Feedback on Final Score</label>
            <textarea
              value={gradeFeedback}
              onChange={e => setGradeFeedback(e.target.value)}
              rows={4}
              placeholder="Write personalised feedback for the student..."
              style={{ ...C.input, resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>
        </Sheet>
      )}

    </div>
  );
}
