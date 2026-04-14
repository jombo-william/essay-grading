

// src/components/student/ExamsTab.jsx
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from './api.js';
import ExamResultSheet from './ExamResultSheet.jsx';

function scoreColor(pct) {
  if (pct >= 70) return '#16a34a';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}

function StatusPill({ exam, submission }) {
  if (submission?.status === 'graded') {
    const pct = Math.round((submission.total_score / exam.total_marks) * 100);
    return (
      <span style={{
        padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
        background: pct >= 70 ? '#f0fdf4' : pct >= 50 ? '#fffbeb' : '#fef2f2',
        color:      pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626',
      }}>
        ✅ {submission.total_score}/{exam.total_marks} ({pct}%)
      </span>
    );
  }
  if (submission?.status === 'submitted') {
    return (
      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', background: '#eff6ff', color: '#2563eb' }}>
        ⏳ Submitted — awaiting review
      </span>
    );
  }
  const isPast = new Date() > new Date(exam.due_date);
  if (isPast) {
    return (
      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', background: '#f8fafc', color: '#94a3b8' }}>
        🔒 Closed
      </span>
    );
  }
  return (
    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', background: '#f0fdf4', color: '#16a34a' }}>
      🟢 Open
    </span>
  );
}

export default function ExamsTab({ onStartExam }) {
  const [exams,       setExams]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState(null);
  const [viewResult,  setViewResult]  = useState(null); // { exam, submission }

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await apiFetch('/exams');
      setExams(data.exams || []);
    } catch (err) {
      setFetchError(err.message || 'Failed to load exams.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const fmtDate = raw => {
    if (!raw) return '—';
    return new Date(raw.replace(' ', 'T')).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // ── Result sheet open ──────────────────────────────────────────────────────
  if (viewResult) {
    return (
      <ExamResultSheet
        exam={viewResult.exam}
        submission={viewResult.submission}
        onClose={() => setViewResult(null)}
      />
    );
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  if (fetchError) return (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
      <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '13px', margin: '0 0 12px' }}>⚠️ {fetchError}</p>
      <button onClick={fetchExams} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', background: '#dc2626', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
        Retry
      </button>
    </div>
  );

  if (exams.length === 0) return (
    <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', padding: '64px 24px' }}>
      <p style={{ fontSize: '44px', margin: '0 0 12px' }}>📝</p>
      <p style={{ fontWeight: '700', color: '#64748b', fontSize: '15px', margin: '0 0 4px' }}>No exams yet</p>
      <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Your teacher hasn't published any exams yet.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {exams.map(exam => {
        const isPast     = new Date() > new Date(exam.due_date);
        const submission = exam.my_submission || null;
        const canStart   = !isPast && !submission;
        const hasResult  = !!submission;
        const mcqCount   = (exam.questions || []).filter(q => q.type === 'mcq').length;
        const strCount   = (exam.questions || []).filter(q => q.type === 'structured').length;

        const pct = submission?.status === 'graded' && exam.total_marks
          ? Math.round((submission.total_score / exam.total_marks) * 100)
          : null;

        return (
          <div key={exam.id} style={{
            background: '#fff', borderRadius: '18px',
            border: '1px solid #e2e8f0',
            borderLeft: `5px solid ${
              submission?.status === 'graded'
                ? (pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444')
                : isPast ? '#cbd5e1' : '#6366f1'
            }`,
            padding: '18px 20px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            cursor: hasResult ? 'pointer' : 'default',
            transition: 'box-shadow 0.15s',
          }}
            onClick={() => hasResult && setViewResult({ exam, submission })}
            onMouseEnter={e => { if (hasResult) e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'; }}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                {/* Title + status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>{exam.title}</span>
                  <StatusPill exam={exam} submission={submission} />
                </div>

                {exam.description && (
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', lineHeight: '1.5' }}>
                    {exam.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>📅 Due {fmtDate(exam.due_date)}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>⏱ {exam.time_limit} min</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>🔵 {mcqCount} MCQ · 📝 {strCount} Written</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>🏆 {exam.total_marks} marks</span>
                </div>
              </div>

              {/* Right side — score OR start button */}
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                {submission?.status === 'graded' && pct !== null ? (
                  <div>
                    <p style={{ fontSize: '26px', fontWeight: '900', color: scoreColor(pct), margin: 0, lineHeight: 1 }}>
                      {submission.total_score}
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>/{exam.total_marks}</span>
                    </p>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: scoreColor(pct), margin: '2px 0 0' }}>{pct}%</p>
                  </div>
                ) : canStart ? (
                  <button
                    onClick={e => { e.stopPropagation(); onStartExam(exam); }}
                    style={{
                      padding: '10px 20px', borderRadius: '12px', border: 'none',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      color: '#fff', fontWeight: '700', fontSize: '13px',
                      cursor: 'pointer', flexShrink: 0,
                      boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                    }}
                  >
                    Start Exam →
                  </button>
                ) : null}
              </div>
            </div>

            {/* Tap to view results hint */}
            {hasResult && (
              <p style={{ fontSize: '12px', color: '#8b5cf6', margin: '10px 0 0', fontWeight: '600' }}>
                Tap to view results →
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}