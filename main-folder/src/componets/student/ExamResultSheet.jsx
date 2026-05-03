// src/components/student/ExamResultSheet.jsx
// Full-screen exam result viewer — shows score, every Q&A, MCQ correct/wrong, AI feedback.

import { useState, useEffect } from 'react';
import { apiFetch } from './api.js';

const OPTIONS = ['A', 'B', 'C', 'D'];

function scoreColor(pct) {
  if (pct >= 70) return '#16a34a';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}
function scoreLabel(pct) {
  if (pct >= 90) return 'Excellent';
  if (pct >= 75) return 'Good';
  if (pct >= 60) return 'Satisfactory';
  if (pct >= 40) return 'Weak';
  return 'Poor';
}

// ── MCQ answer review ──────────────────────────────────────────────────────────
function MCQReview({ question, answer }) {
  const selected = answer?.selected_option;
  const correct  = answer?.correct_option;
  const options  = answer?.options || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {OPTIONS.map((letter, i) => {
        const text        = options[i] || '';
        const isSelected  = selected === letter;
        const isCorrect   = correct  === letter;

        let bg      = '#f8fafc';
        let border  = '1.5px solid #e2e8f0';
        let color   = '#475569';
        let icon    = null;

        if (isCorrect) {
          bg     = '#f0fdf4';
          border = '1.5px solid #86efac';
          color  = '#15803d';
          icon   = '✅';
        }
        if (isSelected && !isCorrect) {
          bg     = '#fef2f2';
          border = '1.5px solid #fca5a5';
          color  = '#dc2626';
          icon   = '❌';
        }
        if (isSelected && isCorrect) {
          bg     = '#f0fdf4';
          border = '2px solid #22c55e';
          color  = '#15803d';
          icon   = '✅';
        }

        return (
          <div key={letter} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 16px', borderRadius: '12px',
            background: bg, border, transition: 'none',
          }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '800', fontSize: '12px',
              background: isCorrect ? '#dcfce7' : isSelected ? '#fee2e2' : '#e2e8f0',
              color: isCorrect ? '#15803d' : isSelected ? '#dc2626' : '#64748b',
            }}>
              {letter}
            </span>
            <span style={{ fontSize: '13px', fontWeight: isSelected || isCorrect ? '700' : '500', color, flex: 1 }}>
              {text}
            </span>
            {icon && <span style={{ fontSize: '14px', flexShrink: 0 }}>{icon}</span>}
          </div>
        );
      })}

      {/* If student didn't answer */}
      {!selected && (
        <p style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600', margin: '4px 0 0' }}>
          ⚠️ Not answered
        </p>
      )}
    </div>
  );
}

// ── Structured answer review ───────────────────────────────────────────────────
function StructuredReview({ answer }) {
  const text = answer?.answer_text || '';
  return (
    <div>
      <div style={{
        background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px',
        padding: '14px 16px', minHeight: '80px',
        fontSize: '14px', color: text ? '#1e293b' : '#94a3b8',
        lineHeight: '1.7', whiteSpace: 'pre-wrap',
      }}>
        {text || 'No answer provided.'}
      </div>
      {answer?.ai_feedback && (
        <div style={{ marginTop: '10px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px 14px' }}>
          <p style={{ fontSize: '11px', fontWeight: '800', color: '#0369a1', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🤖 AI Feedback
          </p>
          <p style={{ fontSize: '13px', color: '#0c4a6e', margin: 0, lineHeight: '1.6' }}>
            {answer.ai_feedback}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ExamResultSheet({ exam, submission, onClose }) {
  const [results,  setResults]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    apiFetch('/exams/results')
      .then(data => {
        // Find the result matching this submission
        const found = (data.results || []).find(r => r.submission_id === submission.id);
        setResults(found || null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [submission.id]);

  const fmtDate = raw => {
    if (!raw) return '—';
    return new Date(raw.replace(' ', 'T')).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const pct = results && results.total_score !== null && results.total_marks
    ? Math.round((results.total_score / results.total_marks) * 100)
    : null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: '#f8fafc', overflowY: 'auto',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '0 20px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onClose} style={{
            width: '34px', height: '34px', borderRadius: '10px',
            border: '1.5px solid #e2e8f0', background: '#f8fafc',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: '#64748b',
          }}>←</button>
          <div>
            <p style={{ fontWeight: '800', fontSize: '14px', color: '#1e293b', margin: 0 }}>
              {exam?.title || 'Exam Results'}
            </p>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              Submitted {fmtDate(submission?.submitted_at)}
            </p>
          </div>
        </div>

        {/* Score pill in header */}
        {pct !== null && (
          <div style={{
            padding: '6px 16px', borderRadius: '20px',
            background: pct >= 70 ? '#f0fdf4' : pct >= 50 ? '#fffbeb' : '#fef2f2',
            border: `1.5px solid ${pct >= 70 ? '#86efac' : pct >= 50 ? '#fcd34d' : '#fca5a5'}`,
          }}>
            <p style={{ fontSize: '13px', fontWeight: '900', color: scoreColor(pct), margin: 0 }}>
              {results.total_score}/{results.total_marks} · {pct}%
            </p>
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 16px 60px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>Loading results…</p>
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '13px', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && results && (
          <>
            {/* ── Score summary card ──────────────────────────────────────── */}
            <div style={{
              background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0',
              padding: '28px 24px', marginBottom: '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              textAlign: 'center',
            }}>
              {pct !== null ? (
                <>
                  <p style={{ fontSize: '52px', fontWeight: '900', color: scoreColor(pct), margin: '0 0 4px', lineHeight: 1 }}>
                    {results.total_score}
                    <span style={{ fontSize: '22px', color: '#94a3b8', fontWeight: '600' }}>/{results.total_marks}</span>
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: scoreColor(pct), margin: '0 0 8px' }}>
                    {scoreLabel(pct)} · {pct}%
                  </p>
                  {/* Score bar */}
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', margin: '0 auto 12px', maxWidth: '300px' }}>
                    <div style={{
                      height: '100%', borderRadius: '4px',
                      width: `${pct}%`,
                      background: pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                    Graded {fmtDate(results.graded_at)}
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '36px', margin: '0 0 8px' }}>⏳</p>
                  <p style={{ fontWeight: '800', color: '#d97706', fontSize: '15px', margin: '0 0 4px' }}>
                    Awaiting Teacher Review
                  </p>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Some answers are being reviewed manually.
                  </p>
                </>
              )}

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {(() => {
                  const mcqAnswers        = results.answers.filter(a => a.type === 'mcq');
                  const correctCount      = mcqAnswers.filter(a => a.is_correct).length;
                  const structuredAnswers = results.answers.filter(a => a.type === 'structured');
                  return [
                    mcqAnswers.length > 0 && { label: 'MCQ Correct',  val: `${correctCount}/${mcqAnswers.length}`,        color: '#16a34a' },
                    mcqAnswers.length > 0 && { label: 'MCQ Wrong',    val: `${mcqAnswers.length - correctCount}/${mcqAnswers.length}`, color: '#dc2626' },
                    structuredAnswers.length > 0 && { label: 'Written', val: `${structuredAnswers.length} question${structuredAnswers.length !== 1 ? 's' : ''}`, color: '#6366f1' },
                  ].filter(Boolean).map(stat => (
                    <div key={stat.label} style={{
                      background: '#f8fafc', borderRadius: '12px', padding: '10px 16px', textAlign: 'center',
                      border: '1px solid #e2e8f0',
                    }}>
                      <p style={{ fontSize: '18px', fontWeight: '900', color: stat.color, margin: 0 }}>{stat.val}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, fontWeight: '600' }}>{stat.label}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* ── Question by question ────────────────────────────────────── */}
            <p style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', margin: '0 0 12px' }}>
              Question Breakdown
            </p>

            {results.answers.map((ans, idx) => {
              const isCorrect  = ans.type === 'mcq' ? ans.is_correct : null;
              const scored     = ans.score_awarded ?? 0;
              const maxMarks   = ans.marks;
              const scorePct   = maxMarks > 0 ? Math.round((scored / maxMarks) * 100) : 0;

              return (
                <div key={ans.question_id} style={{
                  background: '#fff', borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  borderLeft: `5px solid ${
                    ans.type === 'mcq'
                      ? (isCorrect ? '#22c55e' : '#ef4444')
                      : (scored >= maxMarks * 0.6 ? '#6366f1' : '#f59e0b')
                  }`,
                  padding: '20px 20px 16px',
                  marginBottom: '12px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                }}>
                  {/* Question header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                          color: '#fff', fontWeight: '800', fontSize: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{
                          fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                          borderRadius: '20px',
                          background: ans.type === 'mcq' ? '#eff6ff' : '#faf5ff',
                          color:      ans.type === 'mcq' ? '#2563eb' : '#7c3aed',
                        }}>
                          {ans.type === 'mcq' ? '🔵 MCQ' : '📝 Written'}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {ans.prompt}
                      </p>
                    </div>

                    {/* Score badge */}
                    <div style={{
                      flexShrink: 0, textAlign: 'center',
                      padding: '8px 14px', borderRadius: '12px',
                      background: ans.score_awarded === null
                        ? '#fafafa'
                        : scorePct >= 60 ? '#f0fdf4' : '#fef2f2',
                      border: `1.5px solid ${
                        ans.score_awarded === null
                          ? '#e2e8f0'
                          : scorePct >= 60 ? '#86efac' : '#fca5a5'
                      }`,
                    }}>
                      {ans.score_awarded !== null ? (
                        <>
                          <p style={{ fontSize: '20px', fontWeight: '900', margin: 0, lineHeight: 1, color: scoreColor(scorePct) }}>
                            {ans.score_awarded}
                          </p>
                          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, fontWeight: '600' }}>
                            /{maxMarks} marks
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: '13px', margin: 0, color: '#94a3b8' }}>—</p>
                          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>pending</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Answer body */}
                  {ans.type === 'mcq'
                    ? <MCQReview question={ans} answer={ans} />
                    : <StructuredReview answer={ans} />
                  }
                </div>
              );
            })}
          </>
        )}

        {!loading && !error && !results && (
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '36px', margin: '0 0 10px' }}>📭</p>
            <p style={{ fontWeight: '700', color: '#64748b', fontSize: '14px', margin: 0 }}>
              Results not found. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}