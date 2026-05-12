// src/components/student/StudentDashboard.jsx

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from './api.js';
import { C, Icon, Toast } from './shared.jsx';
import AssignmentsTab from './AssignmentsTab.jsx';
import ResultsTab from './ResultsTab.jsx';
import WriteEssaySheet from './WriteEssaySheet.jsx';
import EssayViewSheet from './EssayViewSheet.jsx';
import ResultDetailSheet from './ResultDetailSheet.jsx';
import StudentClassroomTab from './StudentClassroomTab.jsx';
// import StudentQuizPage from "./StudentQuizPage";

const TABS = [
  { id: 'assignments', label: 'Assignments', icon: 'clipboard-text' },
  { id: 'results', label: 'My results', icon: 'chart-bar' },
  { id: 'classroom', label: 'Classroom', icon: 'building-community' },
];

export default function StudentDashboard({ user, onBack }) {

  const [tab, setTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [gradingStatus, setGradingStatus] = useState('');

  const [writeAssignment, setWriteAssignment] = useState(null);
  const [essayViewSub, setEssayViewSub] = useState(null);
  const [resultSub, setResultSub] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch Data ───────────────────────────────────────────────
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

  useEffect(() => {

    fetchAll();

  }, [fetchAll]);

  // ── Poll Pending Results ─────────────────────────────────────
  useEffect(() => {

    const hasPending = results.some(r => r.status === 'pending');

    if (!hasPending) return;

    const iv = setInterval(async () => {

      try {

        const rData = await apiFetch('/get_results.php');
        const updated = rData.results || [];

        setResults(updated);

        if (!updated.some(r => r.status === 'pending')) {
          clearInterval(iv);
        }

      } catch {
        // silently retry
      }

    }, 5000);

    return () => clearInterval(iv);

  }, [results]);

  // ── Derived Data ─────────────────────────────────────────────
  const enriched = assignments.map(a => ({
    ...a,
    isPast: new Date() > new Date(a.due_date),
    submission: results.find(r => r.assignment_id === a.id) || null,
    submitted: results.some(r => r.assignment_id === a.id),
  }));

  const graded = results.filter(r => r.final_score !== null);

  const avgPct = graded.length
    ? Math.round(
        graded.reduce(
          (s, r) => s + (r.final_score / r.max_score) * 100,
          0
        ) / graded.length
      )
    : null;

  const canUnsubmit = sub => {

    const a = assignments.find(a => a.id === sub.assignment_id);

    return (
      sub.final_score === null &&
      a &&
      new Date() < new Date(a.due_date)
    );

  };

  // ── Submit Essay ─────────────────────────────────────────────
  const handleSubmit = async ({
    assignment,
    submitMode,
    essayText,
    uploadFile,
    uploadText,
    activeText
  }) => {

    const wordCount = activeText
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (submitMode === 'write' && wordCount < 50) {
      showToast('Please write at least 50 words.', 'error');
      return;
    }

    if (submitMode === 'upload' && !uploadFile) {
      showToast('Please select a file to upload.', 'error');
      return;
    }

    setSubmitting(true);
    setGradingStatus('Submitting…');

    try {

      const csrfToken = sessionStorage.getItem('csrf_token') || '';

      await apiFetch('/submit_essay.php', {
        method: 'POST',
        body: JSON.stringify({
          assignment_id: assignment.id,
          essay_text: activeText,
          csrf_token: csrfToken
        }),
      });

      setWriteAssignment(null);
      setTab('results');

      showToast('Submitted and graded. Awaiting teacher approval.');

      await fetchAll();

    } catch (err) {

      showToast(
        err.message || 'Submission failed. Please try again.',
        'error'
      );

    } finally {

      setSubmitting(false);
      setGradingStatus('');

    }

  };

  // ── Unsubmit Essay ───────────────────────────────────────────
  const handleUnsubmit = async sub => {

    try {

      const csrfToken = sessionStorage.getItem('csrf_token') || '';

      await apiFetch('/unsubmit_essay.php', {
        method: 'POST',
        body: JSON.stringify({
          submission_id: sub.id,
          csrf_token: csrfToken
        }),
      });

      setEssayViewSub(null);
      setResultSub(null);

      showToast(
        'Essay unsubmitted. You can rewrite before the deadline.'
      );

      await fetchAll();

    } catch (err) {

      showToast(
        err.message || 'Could not unsubmit.',
        'error'
      );

    }

  };

  // ── Stats ────────────────────────────────────────────────────
  const stats = [
    {
      label: 'To submit',
      value: loading
        ? '…'
        : enriched.filter(a => !a.submitted && !a.isPast).length,
      icon: 'clipboard-text',
      color: '#185FA5',
      bg: '#E6F1FB',
    },

    {
      label: 'Submitted',
      value: loading ? '…' : results.length,
      icon: 'file-check',
      color: '#534AB7',
      bg: '#EEEDFE',
    },

    {
      label: 'Average score',
      value: loading
        ? '…'
        : avgPct !== null
          ? `${avgPct}%`
          : '—',
      icon: 'chart-bar',
      color: '#3B6D11',
      bg: '#EAF3DE',
    },
  ];

  return (

    <div style={C.page}>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <Toast toast={toast} />

      {/* ── Header ───────────────────────────────────────── */}

      <header style={C.header}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>

          <div style={{
            width: '36px',
            height: '36px',
            background: '#3C3489',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon
              name="pencil"
              size={18}
              style={{ color: '#EEEDFE' }}
            />
          </div>

          <div>
            <p style={{
              fontWeight: '600',
              fontSize: '14px',
              color: '#1A1830',
              margin: 0
            }}>
              EssayGrade
            </p>

            <p style={{
              fontSize: '11px',
              color: '#8884A8',
              margin: 0
            }}>
              Student Portal
            </p>
          </div>

        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: '#F8F7FF',
            border: '1px solid #E8E6FF',
            borderRadius: '20px',
            padding: '4px 12px 4px 4px',
          }}>

            <div style={{
              width: '26px',
              height: '26px',
              background: '#EEEDFE',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '600',
              color: '#3C3489',
            }}>
              {(user?.name || 'S').charAt(0).toUpperCase()}
            </div>

            <span style={{
              fontSize: '13px',
              color: '#1A1830',
              fontWeight: '500'
            }}>
              {user?.name || 'Student'}
            </span>

          </div>

          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: '1px solid #ECECF2',
              borderRadius: '8px',
              color: '#6B6890',
              fontWeight: '500',
              fontSize: '12px',
              padding: '6px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Icon name="door-exit" size={13} />
            Logout
          </button>

        </div>

      </header>

      {/* ── Main ─────────────────────────────────────────── */}

      <div style={C.main}>

        {/* ── Stats ─────────────────────────────────────── */}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '12px',
          marginBottom: '22px'
        }}>

          {stats.map(s => (

            <div
              key={s.label}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '14px 16px',
                border: '1px solid #ECECF2',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >

              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon
                  name={s.icon}
                  size={18}
                  style={{ color: s.color }}
                />
              </div>

              <div>

                <p style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1A1830',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {s.value}
                </p>

                <p style={{
                  fontSize: '11px',
                  color: '#8884A8',
                  margin: '2px 0 0',
                  fontWeight: '500'
                }}>
                  {s.label}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* ── Tabs ──────────────────────────────────────── */}

        <div style={{
          display: 'flex',
          background: '#F1EFE8',
          borderRadius: '10px',
          padding: '3px',
          marginBottom: '22px',
          gap: '2px',
          width: 'fit-content',
        }}>

          {TABS.map(t => (

            <button
              key={t.id}
              style={C.tab(tab === t.id)}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>

          ))}

        </div>

        {/* ── Assignments ───────────────────────────────── */}

        {tab === 'assignments' && (

          <AssignmentsTab
            assignments={enriched}
            loading={loading}
            onWrite={setWriteAssignment}
            onViewEssay={setEssayViewSub}
            onViewResult={setResultSub}
          />

        )}

        {/* ── Results ───────────────────────────────────── */}

        {tab === 'results' && (

          <ResultsTab
            results={results}
            loading={loading}
            onOpenResult={setResultSub}
          />

        )}

        {/* ── Classroom ─────────────────────────────────── */}

        {tab === 'classroom' && (

          <StudentClassroomTab
            assignments={assignments}
            showToast={showToast}
            onSubmitted={() => {
              fetchAll();
              setTab('results');
            }}
          />

        )}

        {/* ── Quiz Page ───────────────────────────────────

        <StudentQuizPage
          apiFetch={apiFetch}
          showToast={showToast}
        /> */}

      </div>

      {/* ── Modals ─────────────────────────────────────── */}

      <WriteEssaySheet
        assignment={writeAssignment}
        onClose={() => setWriteAssignment(null)}
        onSubmit={handleSubmit}
        submitting={submitting}
        gradingStatus={gradingStatus}
      />

      <EssayViewSheet
        sub={essayViewSub}
        user={user}
        canUnsubmit={
          essayViewSub
            ? canUnsubmit(essayViewSub)
            : false
        }
        onClose={() => setEssayViewSub(null)}
        onUnsubmit={handleUnsubmit}
      />

      <ResultDetailSheet
        sub={resultSub}
        user={user}
        canUnsubmit={
          resultSub
            ? canUnsubmit(resultSub)
            : false
        }
        onClose={() => setResultSub(null)}
        onUnsubmit={handleUnsubmit}
      />

    </div>

  );

}