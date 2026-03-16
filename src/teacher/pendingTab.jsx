import { useState } from 'react';
import './pending.css';

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

const aiColor = score => score >= 50 ? 'var(--red)' : score >= 30 ? 'var(--amber)' : 'var(--green)';
const aiLabel = score => score >= 50 ? 'High AI' : score >= 30 ? 'Borderline' : 'Original';

function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div className="pg-sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pg-sheet">
        <div className="pg-sheet-handle"><div className="pg-sheet-handle-bar" /></div>
        <div className="pg-sheet-header">
          <div style={{ flex: 1 }}>
            <h2 className="pg-sheet-title">{title}</h2>
            {subtitle && <p className="pg-sheet-sub">{subtitle}</p>}
          </div>
          <button className="pg-sheet-close" onClick={onClose}>×</button>
        </div>
        <div className="pg-sheet-body">{children}</div>
        {footer && <div className="pg-sheet-footer">{footer}</div>}
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

  return (
    <div className="pg-page">

      {toast && <div className={`pg-toast pg-toast--${toast.type}`}>{toast.msg}</div>}

      <header className="pg-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pg-header-logo">✍️</div>
          <div>
            <p className="pg-header-title">EssayGrade AI</p>
            <p className="pg-header-sub">Pending Review</p>
          </div>
        </div>
        {onBack && <button onClick={onBack} className="pg-back-btn">← Home</button>}
      </header>

      <div className="pg-main">
        <p className="pg-page-title">
          Pending Review{' '}
          {pending.length > 0 && <span style={{ fontSize: 14, color: 'var(--amber)', fontWeight: 700 }}>({pending.length})</span>}
        </p>

        {pending.length === 0 ? (
          <div className="pg-card pg-empty">
            <p className="pg-empty__icon">✅</p>
            <p className="pg-empty__title">All caught up!</p>
            <p className="pg-empty__sub">No essays pending your review.</p>
          </div>
        ) : pending.map(sub => (
          <div key={sub.id} className={`pg-card ${sub.ai_detection_score >= 50 ? 'pg-card-flagged' : 'pg-card-warn'}`}>
            {/* Card top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                <div className={`pg-avatar-lg ${sub.ai_detection_score >= 50 ? 'pg-avatar-lg--red' : 'pg-avatar-lg--amber'}`}>
                  {sub.student_name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', margin: '0 0 2px' }}>{sub.student_name}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 4px' }}>{sub.assignment_title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-faint)', margin: 0 }}>
                    Submitted {new Date(sub.submitted_at).toLocaleString()}
                    {sub.file_name ? ` · 📎 ${sub.file_name}` : ''}
                  </p>
                </div>
              </div>

              {/* AI Score badge */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '0 0 2px', fontWeight: 600 }}>AI Score</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: sub.ai_detection_score >= 50 ? 'var(--red)' : 'var(--blue)', margin: 0, lineHeight: 1 }}>
                  {sub.ai_detection_score >= 50 ? 0 : sub.ai_score}/{sub.max_score}
                </p>
                <div style={{ marginTop: 5 }}>
                  <span className={`ai-pill ${sub.ai_detection_score >= 50 ? 'ai-pill--red' : sub.ai_detection_score >= 30 ? 'ai-pill--amber' : 'ai-pill--green'}`}>
                    <span style={{ fontSize: 9 }}>{sub.ai_detection_score >= 50 ? '🚨' : sub.ai_detection_score >= 30 ? '⚠️' : '✅'}</span>
                    {sub.ai_detection_score}% AI
                  </span>
                </div>
              </div>
            </div>

            {/* High AI warning */}
            {sub.ai_detection_score >= 50 && (
              <div className="alert-red">
                <span>🚨</span>
                <p>HIGH AI CONTENT — {sub.ai_detection_score}% detected. Score auto-set to 0. Review required.</p>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button onClick={() => setViewModal(sub)} className="btn-sm-view">👁 View Essay</button>
              <button onClick={() => openGrade(sub)} className="btn-sm-grade">✏️ Grade Essay</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── VIEW ESSAY MODAL ── */}
      {viewModal && (
        <Sheet
          onClose={() => setViewModal(null)}
          title={viewModal.assignment_title}
          subtitle={`${viewModal.student_name} · Submitted ${new Date(viewModal.submitted_at).toLocaleString()}`}
          footer={
            <>
              {viewModal.status === 'ai_graded' && (
                <button onClick={() => { setViewModal(null); openGrade(viewModal); }} className="btn-primary">✏️ Grade Essay</button>
              )}
              <button onClick={() => setViewModal(null)} className="btn-ghost">Close</button>
            </>
          }
        >
          {/* Metadata grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Assignment', value: viewModal.assignment_title },
              { label: 'Date & Time', value: new Date(viewModal.submitted_at).toLocaleString() },
              { label: 'AI Score', value: viewModal.ai_detection_score >= 50 ? `0/${viewModal.max_score}` : viewModal.ai_score !== null ? `${viewModal.ai_score}/${viewModal.max_score}` : '—' },
              { label: 'AI Detection', value: viewModal.ai_detection_score !== null ? `${viewModal.ai_detection_score}% — ${aiLabel(viewModal.ai_detection_score)}${viewModal.ai_detection_score >= 50 ? ' 🚨' : viewModal.ai_detection_score >= 30 ? ' ⚠️' : ' ✅'}` : '—' },
            ].map(d => (
              <div key={d.label} style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 3px' }}>{d.label}</p>
                <p style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, margin: 0 }}>{d.value}</p>
              </div>
            ))}
          </div>

          {viewModal.ai_detection_score >= 50 && (
            <div className="info-box info-box--red" style={{ marginBottom: 14 }}>
              <span>🚨</span>
              <p style={{ fontSize: 12, color: 'var(--red)', fontWeight: 700, margin: 0 }}>{viewModal.ai_detection_score}% AI content detected. Score automatically set to 0.</p>
            </div>
          )}

          {viewModal.ai_feedback && (
            <div className="ai-feedback-box">
              <span className="pg-label" style={{ color: 'var(--blue)' }}>🤖 AI Feedback</span>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{viewModal.ai_feedback}</p>
            </div>
          )}

          <div className="essay-box" style={{ maxHeight: 'none' }}>
            <span className="pg-label">Essay Text</span>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.85, margin: 0, whiteSpace: 'pre-wrap' }}>{viewModal.essay_text}</p>
          </div>
        </Sheet>
      )}

      {/* ── GRADE ESSAY MODAL ── */}
      {gradeModal && (
        <Sheet
          onClose={() => setGradeModal(null)}
          title={gradeModal.student_name}
          subtitle={gradeModal.assignment_title}
          footer={
            <>
              <button onClick={() => setGradeModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={saveGrade} className="btn-primary">💾 Save Grade</button>
            </>
          }
        >
          {gradeModal.ai_score !== null && (
            <div className={`info-box ${gradeModal.ai_detection_score >= 50 ? 'info-box--red' : 'info-box--blue'}`}>
              <span className="info-box__icon">{gradeModal.ai_detection_score >= 50 ? '🚨' : '🤖'}</span>
              <div>
                <p className={`info-box__title ${gradeModal.ai_detection_score >= 50 ? 'info-box__title--red' : 'info-box__title--blue'}`}>
                  AI Score: {gradeModal.ai_detection_score >= 50 ? 0 : gradeModal.ai_score}/{gradeModal.max_score}
                  {gradeModal.ai_detection_score >= 50 && ' · AI Flagged'}
                </p>
                <p className="info-box__sub">You can accept or override below. AI detection: {gradeModal.ai_detection_score}%</p>
              </div>
            </div>
          )}

          <div className="essay-box">
            <span className="pg-label">Essay Submitted</span>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{gradeModal.essay_text}</p>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="pg-label">Final Score (out of {gradeModal.max_score}) *</label>
            <input className="pg-input" style={{ width: 160 }} type="number" min="0" max={gradeModal.max_score}
              value={gradeScore} onChange={e => setGradeScore(e.target.value)} placeholder={`0 – ${gradeModal.max_score}`} />
          </div>

          <div>
            <label className="pg-label">Feedback on Final Score</label>
            <textarea className="pg-input" value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)}
              rows={4} placeholder="Write personalised feedback for the student..."
              style={{ resize: 'vertical', lineHeight: 1.6 }} />
          </div>
        </Sheet>
      )}

    </div>
  );
}
