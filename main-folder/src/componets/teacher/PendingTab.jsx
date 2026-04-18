



import { useState } from 'react';
import './pending.css';

const aiLabel = score => score >= 50 ? 'High AI' : score >= 30 ? 'Borderline' : 'Original';

const btnPrimary = {
  flex: 1, background: '#2563eb', color: '#fff', border: 'none',
  borderRadius: 10, padding: '13px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
};
const btnGhost = {
  flex: 1, background: '#f1f5f9', color: '#475569',
  border: '1.5px solid #e2e8f0', borderRadius: 10,
  padding: '13px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
};

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
        <div className="pg-sheet-body">
          {children}
          {footer && (
            <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PendingTab({ pending = [], loading, onViewEssay, onGrade }) {
  const [gradeModal, setGradeModal] = useState(null);
  const [viewModal,  setViewModal]  = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const openGrade = sub => {
    setGradeModal(sub);
    setGradeScore(sub.ai_score ?? '');
    setGradeFeedback(sub.teacher_feedback || '');
  };

  // Loading spinner
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ width: 36, height: 36, border: '4px solid #bfdbfe', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <p className="pg-page-title" style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 20 }}>
        Pending Review{' '}
        {pending.length > 0 && (
          <span style={{ fontSize: 14, color: '#d97706', fontWeight: 700 }}>({pending.length})</span>
        )}
      </p>

      {pending.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', padding: '64px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: 48, margin: '0 0 14px' }}>✅</p>
          <p style={{ fontWeight: 700, color: '#64748b', fontSize: 16, margin: '0 0 6px' }}>All caught up!</p>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No essays pending your review.</p>
        </div>
      ) : pending.map(sub => (
        <div key={sub.id} className={`pg-card ${sub.ai_detection_score >= 50 ? 'pg-card-flagged' : 'pg-card-warn'}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, flex: 1 }}>
              <div className={`pg-avatar-lg ${sub.ai_detection_score >= 50 ? 'pg-avatar-lg--red' : 'pg-avatar-lg--amber'}`}>
                {sub.student_name?.charAt(0)}
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
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '0 0 2px', fontWeight: 600 }}>AI Score</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: sub.ai_detection_score >= 50 ? 'var(--red)' : 'var(--blue)', margin: 0, lineHeight: 1 }}>
                {sub.ai_detection_score >= 50 ? 0 : (sub.ai_score ?? '—')}/{sub.max_score}
              </p>
              <div style={{ marginTop: 5 }}>
                <span className={`ai-pill ${sub.ai_detection_score >= 50 ? 'ai-pill--red' : sub.ai_detection_score >= 30 ? 'ai-pill--amber' : 'ai-pill--green'}`}>
                  <span style={{ fontSize: 9 }}>{sub.ai_detection_score >= 50 ? '🚨' : sub.ai_detection_score >= 30 ? '⚠️' : '✅'}</span>
                  {sub.ai_detection_score}% AI
                </span>
              </div>
            </div>
          </div>

          {sub.ai_detection_score >= 50 && (
            <div className="alert-red">
              <span>🚨</span>
              <p>HIGH AI CONTENT — {sub.ai_detection_score}% detected. Score auto-set to 0. Review required.</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => setViewModal(sub)} className="btn-sm-view">👁 View Essay</button>
            <button onClick={() => openGrade(sub)} className="btn-sm-grade">✏️ Grade Essay</button>
          </div>
        </div>
      ))}

      {/* VIEW ESSAY MODAL */}
      {viewModal && (
        <Sheet
          onClose={() => setViewModal(null)}
          title={viewModal.assignment_title}
          subtitle={`${viewModal.student_name} · Submitted ${new Date(viewModal.submitted_at).toLocaleString()}`}
          footer={
            <>
              {viewModal.status === 'ai_graded' && (
                <button onClick={() => { setViewModal(null); openGrade(viewModal); }} style={btnPrimary}>
                  ✏️ Grade Essay
                </button>
              )}
              <button onClick={() => setViewModal(null)} style={btnGhost}>Close</button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Assignment',   value: viewModal.assignment_title },
              { label: 'Date & Time',  value: new Date(viewModal.submitted_at).toLocaleString() },
              { label: 'AI Score',     value: viewModal.ai_detection_score >= 50 ? `0/${viewModal.max_score}` : viewModal.ai_score !== null ? `${viewModal.ai_score}/${viewModal.max_score}` : '—' },
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
              <p style={{ fontSize: 12, color: 'var(--red)', fontWeight: 700, margin: 0 }}>
                {viewModal.ai_detection_score}% AI content detected. Score automatically set to 0.
              </p>
            </div>
          )}

          {viewModal.ai_feedback && (
            <div className="ai-feedback-box">
              <span className="pg-label" style={{ color: 'var(--blue)' }}>🤖 AI Feedback</span>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{viewModal.ai_feedback}</p>
            </div>
          )}

          <div className="essay-box">
            <span className="pg-label">Essay Text</span>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.85, margin: 0, whiteSpace: 'pre-wrap' }}>{viewModal.essay_text}</p>
          </div>
        </Sheet>
      )}

      {/* GRADE ESSAY MODAL */}
      {gradeModal && (
        <Sheet
          onClose={() => setGradeModal(null)}
          title={gradeModal.student_name}
          subtitle={gradeModal.assignment_title}
          footer={
            <>
              <button onClick={() => setGradeModal(null)} style={btnGhost}>Cancel</button>
              <button onClick={() => onGrade(gradeModal)} style={btnPrimary}>💾 Save Grade</button>
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

          {gradeModal.ai_feedback && (
            <div className="ai-feedback-box">
              <span className="pg-label" style={{ color: 'var(--blue)' }}>🤖 AI Feedback</span>
              <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{gradeModal.ai_feedback}</p>
            </div>
          )}
        </Sheet>
      )}
    </div>
  );
}