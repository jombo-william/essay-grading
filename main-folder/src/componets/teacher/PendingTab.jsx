


import { useState } from 'react';
import './pending.css';
import { apiFetch } from './api.js';

const aiLabel = score => score >= 50 ? 'High AI' : score >= 30 ? 'Borderline' : 'Original';

const btnPrimary = {
  background: '#2563eb', color: '#fff', border: 'none',
  borderRadius: 10, padding: '11px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
};
const btnGhost = {
  background: '#f1f5f9', color: '#475569',
  border: '1.5px solid #e2e8f0', borderRadius: 10,
  padding: '11px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
};

export default function PendingTab({ pending = [], loading, onViewEssay, onGrade }) {
  const [gradeModal, setGradeModal] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const openGrade = sub => {
    setGradeModal(sub);
    setGradeScore(sub.ai_score ?? '');
    setGradeFeedback('');
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
    // Trigger parent refresh
    onGrade(null);
  } catch (err) {
    alert(err.message);
  } finally {
    setSaving(false);
  }
};



  return (
    <div>
      <p style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 20 }}>
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

          <div style={{ marginTop: 14 }}>
            <button onClick={() => openGrade(sub)} className="btn-sm-grade">✏️ Grade Essay</button>
          </div>
        </div>
      ))}

      {/* ── FULL-SCREEN GRADE MODAL ── */}
      {gradeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'stretch', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px',
            width: '100%', maxWidth: '1100px',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: gradeModal.ai_detection_score >= 50
                    ? 'linear-gradient(135deg,#ef4444,#f87171)'
                    : 'linear-gradient(135deg,#3b82f6,#38bdf8)',
                  color: '#fff', fontWeight: 800, fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {gradeModal.student_name?.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', margin: 0 }}>{gradeModal.student_name}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{gradeModal.assignment_title}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`ai-pill ${gradeModal.ai_detection_score >= 50 ? 'ai-pill--red' : gradeModal.ai_detection_score >= 30 ? 'ai-pill--amber' : 'ai-pill--green'}`}>
                  {gradeModal.ai_detection_score >= 50 ? '🚨' : gradeModal.ai_detection_score >= 30 ? '⚠️' : '✅'} {gradeModal.ai_detection_score}% AI
                </span>
                <button onClick={() => setGradeModal(null)} style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: '1px solid #e2e8f0', background: '#fff',
                  fontSize: 18, cursor: 'pointer', color: '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>×</button>
              </div>
            </div>

            {/* Body — side by side */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

              {/* LEFT — Essay */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '24px',
                borderRight: '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Student Essay
                  </p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
                    <span>📅 {new Date(gradeModal.submitted_at).toLocaleDateString()}</span>
                    <span>📊 AI: {gradeModal.ai_detection_score >= 50 ? 0 : (gradeModal.ai_score ?? '—')}/{gradeModal.max_score}</span>
                    {gradeModal.file_name && <span>📎 {gradeModal.file_name}</span>}
                  </div>
                </div>

                {gradeModal.ai_detection_score >= 50 && (
                  <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
                    padding: '10px 14px', marginBottom: 16,
                    display: 'flex', gap: 8, alignItems: 'center',
                  }}>
                    <span>🚨</span>
                    <p style={{ fontSize: 12, color: '#dc2626', fontWeight: 700, margin: 0 }}>
                      {gradeModal.ai_detection_score}% AI content detected — score auto-set to 0
                    </p>
                  </div>
                )}

                {/* Essay text rendered like a document */}
                <div style={{
                  background: '#fffef7',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '28px 32px',
                  fontSize: 14,
                  lineHeight: '1.9',
                  color: '#1e293b',
                  whiteSpace: 'pre-wrap',
                  minHeight: '400px',
                  fontFamily: 'Georgia, serif',
                  boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.03)',
                }}>
                  {gradeModal.essay_text || 'No essay text available.'}
                </div>
              </div>

              {/* RIGHT — Grading panel */}
              <div style={{
                width: '320px', flexShrink: 0,
                overflowY: 'auto', padding: '24px',
                background: '#f8fafc',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  Grading
                </p>

                {/* AI score summary */}
                {gradeModal.ai_score !== null && (
                  <div style={{
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px',
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', margin: '0 0 4px', textTransform: 'uppercase' }}>AI Suggested Score</p>
                    <p style={{ fontSize: 24, fontWeight: 900, color: gradeModal.ai_detection_score >= 50 ? '#dc2626' : '#2563eb', margin: 0 }}>
                      {gradeModal.ai_detection_score >= 50 ? 0 : gradeModal.ai_score}/{gradeModal.max_score}
                    </p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>
                      {aiLabel(gradeModal.ai_detection_score)} · {gradeModal.ai_detection_score}% AI detected
                    </p>
                  </div>
                )}

                {/* Score input */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 8 }}>
                    Final Score * (max {gradeModal.max_score})
                  </label>
                  <input
                    type="number" min="0" max={gradeModal.max_score}
                    value={gradeScore}
                    onChange={e => setGradeScore(e.target.value)}
                    placeholder={`0 – ${gradeModal.max_score}`}
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1.5px solid #e2e8f0', borderRadius: 10,
                      fontSize: 20, fontWeight: 800, color: '#1e293b',
                      outline: 'none', fontFamily: 'inherit',
                      textAlign: 'center',
                    }}
                  />
                  {gradeScore !== '' && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 4,
                          width: `${Math.min((gradeScore / gradeModal.max_score) * 100, 100)}%`,
                          background: gradeScore / gradeModal.max_score >= 0.7 ? '#16a34a' : gradeScore / gradeModal.max_score >= 0.5 ? '#f59e0b' : '#ef4444',
                          transition: 'width 0.2s',
                        }} />
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: '6px 0 0', textAlign: 'center' }}>
                        {Math.round((gradeScore / gradeModal.max_score) * 100)}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Feedback */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 8 }}>
                    Feedback to Student
                  </label>
                  <textarea
                    value={gradeFeedback}
                    onChange={e => setGradeFeedback(e.target.value)}
                    rows={5}
                    placeholder="Write personalised feedback..."
                    style={{
                      width: '100%', padding: '10px 12px',
                      border: '1.5px solid #e2e8f0', borderRadius: 10,
                      fontSize: 13, lineHeight: 1.6, resize: 'vertical',
                      fontFamily: 'inherit', outline: 'none', color: '#1e293b',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* AI feedback — collapsed/small */}
                {gradeModal.ai_feedback && (
                  <details style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '12px 14px' }}>
                    <summary style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', cursor: 'pointer', userSelect: 'none' }}>
                      🤖 View AI Feedback
                    </summary>
                    <p style={{ fontSize: 12, color: '#1e293b', lineHeight: 1.7, margin: '10px 0 0', whiteSpace: 'pre-wrap' }}>
                      {gradeModal.ai_feedback}
                    </p>
                  </details>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              padding: '14px 24px', borderTop: '1px solid #e2e8f0',
              background: '#f8fafc', flexShrink: 0,
            }}>
              <button onClick={() => setGradeModal(null)} style={btnGhost}>Cancel</button>
             
                              <button
              onClick={handleSave}
              disabled={!gradeScore || saving}
              style={{ ...btnPrimary, opacity: (gradeScore && !saving) ? 1 : 0.5, cursor: (gradeScore && !saving) ? 'pointer' : 'not-allowed' }}
            >
              {saving ? '⏳ Saving…' : '💾 Save Grade'}
            </button>


            </div>
          </div>
        </div>
      )}
    </div>
  );
}