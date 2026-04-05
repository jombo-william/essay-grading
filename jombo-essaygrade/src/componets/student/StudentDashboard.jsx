// src/components/student/StudentDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { apiFetch }         from './api.js';
import { C, Toast }         from './shared.jsx';
import AssignmentsTab       from './AssignmentsTab.jsx';
import ResultsTab           from './ResultsTab.jsx';
import AssignmentDetail     from './AssignmentDetail.jsx';
import WriteEssaySheet      from './WriteEssaySheet.jsx';
import EssayViewSheet       from './EssayViewSheet.jsx';
import ResultDetailSheet    from './ResultDetailSheet.jsx';

const TABS = [
  { id: 'assignments', label: '📋 Assignments' },
  { id: 'results',     label: '📊 My Results'  },
];

export default function StudentDashboard({ user, onBack }) {
  const [tab,         setTab]         = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [results,     setResults]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [gradingStatus, setGradingStatus] = useState('');

  // Modals
  const [detailAssignment, setDetailAssignment] = useState(null);
  const [writeAssignment,  setWriteAssignment]  = useState(null);
  const [essayViewSub,     setEssayViewSub]     = useState(null);
  const [resultSub,        setResultSub]        = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [aData, rData] = await Promise.all([
        apiFetch('/get_assignments.php'),
        apiFetch('/get_results.php'),
      ]);
      setAssignments(aData.assignments || []);
      setResults(rData.results || []);
    } catch (err) {
      showToast(err.message || 'Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Poll while submissions are pending ──────────────────────────────────
  useEffect(() => {
    const hasPending = results.some(r => r.status === 'pending');
    if (!hasPending) return;
    const interval = setInterval(async () => {
      try {
        const rData  = await apiFetch('/get_results.php');
        const updated = rData.results || [];
        setResults(updated);
        if (!updated.some(r => r.status === 'pending')) clearInterval(interval);
      } catch { /* silently retry */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [results]);

  // ── Derived ─────────────────────────────────────────────────────────────
  const enrichedAssignments = assignments.map(a => ({
    ...a,
    isPast:     new Date() > new Date(a.due_date),
    submission: results.find(r => r.assignment_id === a.id) || null,
  }));

  const graded = results.filter(r => r.final_score !== null);
  const avgPct = graded.length
    ? Math.round(graded.reduce((sum, r) => sum + (r.final_score / r.max_score) * 100, 0) / graded.length)
    : null;

  const canUnsubmit = sub => {
    const a = assignments.find(a => a.id === sub.assignment_id);
    return sub.final_score === null && a && new Date() < new Date(a.due_date);
  };

  // ── Submit essay ────────────────────────────────────────────────────────
  const handleSubmit = async ({ assignment, submitMode, essayText, uploadFile, uploadText, activeText }) => {
    const wordCount = activeText.trim().split(/\s+/).filter(Boolean).length;
    if (submitMode === 'write'  && wordCount < 50) { showToast('Please write at least 50 words.', 'error'); return; }
    if (submitMode === 'upload' && !uploadFile)    { showToast('Please select a file to upload.', 'error'); return; }

    setSubmitting(true);
    setGradingStatus('📤 Submitting...');

    try {
      setGradingStatus('🤖 AI is grading your essay...');

      const csrfToken = sessionStorage.getItem('csrf_token') || '';

      const data = await apiFetch('/submit_essay.php', {
        method: 'POST',
        body: JSON.stringify({
          assignment_id: assignment.id,
          essay_text:    activeText,
          csrf_token:    csrfToken,
        }),
      });

      setWriteAssignment(null);
      setTab('results');

      showToast('✅ Submitted and AI-graded! Awaiting teacher approval.');

      await fetchAll();
    } catch (err) {
      showToast(err.message || 'Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
      setGradingStatus('');
    }
  };

  // ── Unsubmit essay ──────────────────────────────────────────────────────
  const handleUnsubmit = async sub => {
    try {
      const csrfToken = sessionStorage.getItem('csrf_token') || '';
      await apiFetch('/unsubmit_essay.php', {
        method: 'POST',
        body: JSON.stringify({
          submission_id: sub.id,
          csrf_token:    csrfToken,
        }),
      });
      setEssayViewSub(null);
      setResultSub(null);
      showToast('↩ Essay unsubmitted. You can rewrite before the deadline.');
      await fetchAll();
    } catch (err) {
      showToast(err.message || 'Could not unsubmit. Please try again.', 'error');
    }
  };

  const stats = [
    { label: 'To Submit', value: loading ? '…' : enrichedAssignments.filter(a => !a.submitted && !a.isPast).length, icon: '📋', bg: '#eff6ff', fg: '#3b82f6' },
    { label: 'Submitted', value: loading ? '…' : results.length,                                                     icon: '📝', bg: '#fdf4ff', fg: '#9333ea' },
    { label: 'Avg Score', value: loading ? '…' : avgPct !== null ? `${avgPct}%` : '—',                               icon: '⭐', bg: '#f0fdf4', fg: '#16a34a' },
  ];

  return (
    <div style={C.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input[type=file] { display: none; }`}</style>

      <Toast toast={toast} />

      {/* ── Nav ── */}
      <header style={C.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>✍️</div>
          <div>
            <p style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', margin: 0 }}>EssayGrade AI</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Student Portal</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '4px 12px 4px 4px' }}>
            <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>🎓</div>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>{user?.name || 'Student'}</span>
          </div>
          <button onClick={onBack} style={{ background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: '600', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>← Logout</button>
        </div>
      </header>

      <div style={C.main}>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '24px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '16px', padding: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: s.bg, color: s.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0', fontWeight: '500' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '20px', gap: '2px', width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.id} style={C.tab(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ── Tab content ── */}
        {tab === 'assignments' && (
          <AssignmentsTab
            assignments={enrichedAssignments}
            loading={loading}
            onOpenDetail={setDetailAssignment}
          />
        )}
        {tab === 'results' && (
          <ResultsTab
            results={results}
            loading={loading}
            onOpenResult={setResultSub}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <AssignmentDetail
        assignment={detailAssignment}
        onClose={() => setDetailAssignment(null)}
        onWrite={a  => { setDetailAssignment(null); setWriteAssignment(a); }}
        onViewEssay={sub => { setDetailAssignment(null); setEssayViewSub(sub); }}
        onViewResult={sub => { setDetailAssignment(null); setResultSub(sub); }}
      />

      <WriteEssaySheet
        assignment={writeAssignment}
        onClose={() => setWriteAssignment(null)}
        onSubmit={handleSubmit}
        submitting={submitting}
        gradingStatus={gradingStatus}
      />

      <EssayViewSheet
        sub={essayViewSub}
        canUnsubmit={essayViewSub ? canUnsubmit(essayViewSub) : false}
        onClose={() => setEssayViewSub(null)}
        onUnsubmit={handleUnsubmit}
      />

      <ResultDetailSheet
        sub={resultSub}
        canUnsubmit={resultSub ? canUnsubmit(resultSub) : false}
        onClose={() => setResultSub(null)}
        onUnsubmit={handleUnsubmit}
      />
    </div>
  );
}



