// src/componets/student/StudentDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { apiFetch }         from './api.js';
import { C, Toast, globalStyles, COLORS }  from './shared.jsx';
import AssignmentsTab       from './AssignmentsTab.jsx';
import ResultsTab           from './ResultsTab.jsx';
import AssignmentDetail     from './AssignmentDetail.jsx';
import WriteEssaySheet      from './WriteEssaySheet.jsx';
import EssayViewSheet       from './EssayViewSheet.jsx';
import ResultDetailSheet    from './ResultDetailSheet.jsx';

const TABS = [
  { id: 'assignments', label: '📋 Assignments' },
  { id: 'results',     label: '📊 My Results'  },
  { id: 'messages',    label: '💬 Messages'   },
];

export default function StudentDashboard({ user, onBack }) {
  const [tab,         setTab]         = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [results,     setResults]     = useState([]);
  const [messages,    setMessages]    = useState([]);
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
      const [aData, rData, mData] = await Promise.all([
        apiFetch('/api/students/assignments'),
        apiFetch('/api/students/results'),
        apiFetch('/api/students/messages'),
      ]);
      setAssignments(aData.assignments || []);
      setResults(rData.results || []);
      setMessages(mData.messages || []);
    } catch (err) {
      showToast(err.message || 'Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Poll while submissions are pending ──────────────────────────────────
  useEffect(() => {
    const hasPending = results.some(r => r.status === 'ai_graded' && r.final_score === null);
    if (!hasPending) return;
    const interval = setInterval(async () => {
      try {
        const rData  = await apiFetch('/api/students/results');
        const updated = rData.results || [];
        setResults(updated);
        if (!updated.some(r => r.status === 'ai_graded' && r.final_score === null)) clearInterval(interval);
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
    ? Math.round(graded.reduce((sum, r) => sum + (r.final_score) * 100, 0) / graded.length)
    : null;

  const canUnsubmit = sub => {
    const a = assignments.find(a => a.id === sub.assignment_id);
    return sub.final_score === null && a && new Date() < new Date(a.due_date);
  };

  // ── Submit essay ────────────────────────────────────────────────────────
  const handleSubmit = async ({ assignment, submitMode, uploadFile, activeText }) => {
    const wordCount = activeText.trim().split(/\s+/).filter(Boolean).length;
    if (submitMode === 'write'  && wordCount < 50) { showToast('Please write at least 50 words.', 'error'); return; }
    if (submitMode === 'upload' && !uploadFile)    { showToast('Please select a file to upload.', 'error'); return; }

    setSubmitting(true);
    setGradingStatus('📤 Submitting...');
    try {
      setGradingStatus('🤖 AI is grading your essay...');
      await apiFetch('/api/students/submit-essay', {
        method: 'POST',
        body: JSON.stringify({
          assignment_id: assignment.id,
          essay_text:    activeText,
          submit_mode:   submitMode,
          file_name:     uploadFile ? uploadFile.name : null,
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

  // ── Send message ────────────────────────────────────────────────────────
  const handleSendMessage = async (receiverId, content) => {
    try {
      await apiFetch('/api/students/send-message', {
        method: 'POST',
        body: JSON.stringify({
          receiver_id: parseInt(receiverId),
          content: content,
          message_type: 'question',
        }),
      });
      showToast('Message sent successfully!');
      await fetchAll();
    } catch (err) {
      showToast(err.message || 'Failed to send message.', 'error');
    }
  };

  // ── Unsubmit essay ──────────────────────────────────────────────────────
  const handleUnsubmit = async () => {
    // TODO: Implement unsubmit functionality
    showToast('Unsubmit functionality not implemented yet', 'error');
  };

  const stats = [
    { label: 'To Submit', value: loading ? '…' : enrichedAssignments.filter(a => !a.submitted && !a.isPast).length, icon: '📋', bg: '#e0e7ff', fg: COLORS.NAVY_PRIMARY },
    { label: 'Submitted', value: loading ? '…' : results.length,                                                     icon: '📝', bg: '#dbeafe', fg: '#2563eb' },
    { label: 'Avg Score', value: loading ? '…' : avgPct !== null ? `${avgPct}%` : '—',                               icon: '⭐', bg: '#d1fae5', fg: COLORS.SUCCESS },
  ];

  return (
    <div style={C.page}>
      <style>{globalStyles}</style>
      <style>{`input[type=file] { display: none; }`}</style>

      <Toast toast={toast} />

      {/* ── Nav ── */}
      <header style={C.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', background: `linear-gradient(135deg, ${COLORS.NAVY_PRIMARY} 0%, ${COLORS.NAVY_LIGHT} 100%)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px', boxShadow: `0 4px 12px rgba(26, 46, 90, 0.25)` }}>✍️</div>
          <div>
            <p style={{ fontWeight: '800', fontSize: '16px', color: COLORS.NAVY_PRIMARY, margin: 0 }}>EssayGrade AI</p>
            <p style={{ fontSize: '12px', color: COLORS.GRAY_600, margin: 0 }}>Student Portal</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: COLORS.GRAY_100, border: `2px solid ${COLORS.NAVY_PRIMARY}`, borderRadius: '20px', padding: '6px 14px 6px 6px' }}>
            <div style={{ width: '30px', height: '30px', background: `linear-gradient(135deg, ${COLORS.NAVY_PRIMARY} 0%, ${COLORS.NAVY_LIGHT} 100%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎓</div>
            <span style={{ fontSize: '14px', color: COLORS.NAVY_PRIMARY, fontWeight: '700' }}>{user?.name || 'Student'}</span>
          </div>
          <button 
            onClick={onBack} 
            style={{ 
              background: COLORS.GRAY_100, 
              border: `2px solid ${COLORS.NAVY_PRIMARY}`, 
              borderRadius: '8px', 
              color: COLORS.NAVY_PRIMARY, 
              fontWeight: '700', 
              fontSize: '13px', 
              padding: '8px 14px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = COLORS.NAVY_PRIMARY;
              e.currentTarget.style.color = COLORS.WHITE;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = COLORS.GRAY_100;
              e.currentTarget.style.color = COLORS.NAVY_PRIMARY;
            }}
          >
            ← Logout
          </button>
        </div>
      </header>

      <div style={C.main}>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {stats.map(s => (
            <div 
              key={s.label} 
              style={{ 
                background: COLORS.WHITE, 
                borderRadius: '14px', 
                padding: '20px', 
                border: `2px solid ${COLORS.GRAY_200}`,
                display: 'flex', 
                alignItems: 'center', 
                gap: '14px', 
                boxShadow: `0 2px 8px rgba(26, 46, 90, 0.06)`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(26, 46, 90, 0.12)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 8px rgba(26, 46, 90, 0.06)`;
              }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: s.bg, color: s.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '900', color: COLORS.NAVY_PRIMARY, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '12px', color: COLORS.GRAY_600, margin: '4px 0 0', fontWeight: '600' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', background: '#f9fafb', borderRadius: '999px', padding: '8px', marginBottom: '28px', gap: '8px', border: `1px solid ${COLORS.GRAY_200}`, boxShadow: `0 2px 10px rgba(30, 58, 138, 0.08)` }}>
          {TABS.map(t => (
            <button 
              key={t.id} 
              style={C.tab(tab === t.id)} 
              onClick={() => setTab(t.id)}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.NAVY_LIGHT}
              onMouseLeave={e => e.currentTarget.style.background = COLORS.NAVY_PRIMARY}
            >
              {t.label}
            </button>
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
        {tab === 'messages' && (
          <MessagesTab
            messages={messages}
            loading={loading}
            onSendMessage={handleSendMessage}
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

// ── Messages Tab Component ────────────────────────────────────────────────
function MessagesTab({ messages, loading, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading messages...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Messages List */}
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '16px', color: COLORS.NAVY_PRIMARY }}>Messages</h3>
          {messages.length === 0 ? (
            <p style={{ color: COLORS.GRAY_600, textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '18px', border: `1px solid ${COLORS.GRAY_200}` }}>No messages yet</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{
                background: '#f8fbff',
                borderRadius: '18px',
                padding: '18px',
                marginBottom: '14px',
                border: `1px solid ${COLORS.GRAY_200}`,
                boxShadow: '0 8px 20px rgba(30, 58, 138, 0.06)',
                color: COLORS.NAVY_DARK
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '12px', alignItems: 'center' }}>
                  <strong style={{ color: COLORS.NAVY_DARK, fontSize: '14px' }}>{msg.sender_name} → {msg.receiver_name}</strong>
                  <span style={{ fontSize: '12px', color: COLORS.GRAY_600 }}>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                {msg.subject && <div style={{ fontWeight: '700', marginBottom: '8px', color: COLORS.NAVY_PRIMARY }}>{msg.subject}</div>}
                <div style={{ color: COLORS.NAVY_DARK, lineHeight: 1.75 }}>{msg.content}</div>
              </div>
            ))
          )}
        </div>

        {/* Send Message */}
        <div style={{ width: '300px' }}>
          <h3 style={{ marginBottom: '16px', color: COLORS.NAVY_PRIMARY }}>Ask a Question</h3>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${COLORS.GRAY_200}`,
            boxShadow: '0 8px 20px rgba(30, 58, 138, 0.06)'
          }}>
            <select
              value={selectedTeacher || ''}
              onChange={e => setSelectedTeacher(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '16px',
                border: `1px solid ${COLORS.GRAY_200}`,
                marginBottom: '14px',
                background: '#ffffff',
                color: COLORS.NAVY_DARK,
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="">Select a teacher</option>
              {/* TODO: Fetch teachers list - for now hardcode */}
              <option value="2">Teacher 1</option>
            </select>
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Ask your question here..."
              style={{
                width: '100%',
                height: '110px',
                padding: '14px',
                borderRadius: '18px',
                border: `1px solid ${COLORS.GRAY_200}`,
                marginBottom: '14px',
                resize: 'vertical',
                background: '#ffffff',
                color: COLORS.NAVY_DARK,
                fontSize: '14px',
                lineHeight: 1.6,
                outline: 'none'
              }}
            />
            <button
              onClick={() => {
                if (selectedTeacher && newMessage.trim()) {
                  onSendMessage(selectedTeacher, newMessage);
                  setNewMessage('');
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: COLORS.NAVY_LIGHT,
                color: COLORS.WHITE,
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.18)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Send Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}