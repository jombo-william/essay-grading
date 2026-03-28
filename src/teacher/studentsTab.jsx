import { useState, useMemo } from 'react';
import './students.css';
import './pending.css';

// ── SAMPLE DATA ───────────────────────────────────────────────────────────────
const ALL_SUBMISSIONS_INIT = [
  {
    id: 101, student_id: 2, assignment_id: 1, student_name: 'Limbani Chipeni',
    assignment_title: 'The good, the bad and the ugly of Internet governance', max_score: 100,
    essay_text: 'essay answer goes here',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-04T10:30:00',
    ai_score: 82, ai_detection_score: 8,
    ai_feedback: 'Content (28/35): Three clear impacts identified. Structure (22/25): Clear paragraphs. Grammar (18/20): Fluent. Evidence (14/20): Needs more statistics.\nAI Detection: Low (~8%).',
    final_score: 85, teacher_feedback: 'Excellent work!', status: 'graded',
  },
  {
    id: 102, student_id: 2, assignment_id: 2, student_name: 'Alice Mwale',
    assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: 'Artificial intelligence is rapidly transforming education...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-10T14:00:00',
    ai_score: 76, ai_detection_score: 18,
    ai_feedback: 'Argumentation (30/40): Balanced perspective. Structure (20/25): Good flow. Grammar (16/20): Minor errors. Evidence (10/15): Needs citations.\nAI Detection: Low (~18%).',
    final_score: null, teacher_feedback: null, status: 'ai_graded',
  },
  {
    id: 103, student_id: 3, assignment_id: 1, student_name: 'Brian Phiri',
    assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change represents a multifaceted global challenge...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-05T11:00:00',
    ai_score: 0, ai_detection_score: 81,
    ai_feedback: '⚠️ HIGH AI CONTENT (81%)\nUniform sentence structure, generic phrasing. Score: 0/100.',
    final_score: null, teacher_feedback: null, status: 'ai_graded',
  },
  {
    id: 104, student_id: 3, assignment_id: 2, student_name: 'Brian Phiri',
    assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: '[Content from uploaded file: AI_Education_Essay_BPhiri.pdf]',
    file_name: 'AI_Education_Essay_BPhiri.pdf', submit_mode: 'upload', submitted_at: '2026-03-12T09:30:00',
    ai_score: 71, ai_detection_score: 12,
    ai_feedback: 'Argumentation (28/40): Good. Structure (22/25): Well organised. Grammar (18/20): Strong. Evidence (3/15): Few citations.\nAI Detection: Low (~12%).',
    final_score: 68, teacher_feedback: 'Good effort Brian. Need stronger evidence.', status: 'graded',
  },
  {
    id: 105, student_id: 4, assignment_id: 1, student_name: 'Chisomo Banda',
    assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change poses existential risks to developing nations...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-15T16:45:00',
    ai_score: null, ai_detection_score: null, ai_feedback: null,
    final_score: null, teacher_feedback: null, status: 'pending',
  },
  {
    id: 106, student_id: 5, assignment_id: 2, student_name: 'Diana Tembo',
    assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: '[Content from uploaded file: diana_essay.docx]',
    file_name: 'diana_essay.docx', submit_mode: 'upload', submitted_at: '2026-03-11T10:15:00',
    ai_score: 88, ai_detection_score: 5,
    ai_feedback: 'Argumentation (38/40): Exceptional. Structure (24/25): Near perfect. Grammar (19/20): Excellent. Evidence (7/15): Needs academic sources.\nAI Detection: Very low (~5%).',
    final_score: 91, teacher_feedback: 'Outstanding Diana!', status: 'graded',
  },
  {
    id: 107, student_id: 3, assignment_id: 3, student_name: 'Brian Phiri',
    assignment_title: 'The Role of Entrepreneurs in Africa', max_score: 100,
    essay_text: 'Entrepreneurship in Africa is often discussed in the context of M-Pesa...',
    file_name: null, submit_mode: 'write', submitted_at: '2026-01-28T20:00:00',
    ai_score: 63, ai_detection_score: 31,
    ai_feedback: 'Content (20/30): Good examples but shallow. Structure (18/25): Needs transitions. Grammar (16/20): Several errors. Examples (9/25): More detail needed.\nAI Detection: Borderline (~31%).',
    final_score: null, teacher_feedback: null, status: 'ai_graded',
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const scoreColorClass = p => p >= 70 ? 'score--green' : p >= 50 ? 'score--amber' : 'score--red';

const btnPrimary = {
  flex: 1, background: '#2563eb', color: '#fff', border: 'none',
  borderRadius: 10, padding: '13px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
};
const btnGhost = {
  flex: 1, background: '#f1f5f9', color: '#475569',
  border: '1.5px solid #e2e8f0', borderRadius: 10,
  padding: '13px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
};

// ── AT-RISK DETECTION LOGIC ───────────────────────────────────────────────────
// Analyses each student's submissions and assigns a risk level + reasons.
function detectAtRiskStudents(submissions) {
  // Group by student name
  const byStudent = {};
  submissions.forEach(sub => {
    if (!byStudent[sub.student_name]) byStudent[sub.student_name] = [];
    byStudent[sub.student_name].push(sub);
  });

  const atRisk = [];

  Object.entries(byStudent).forEach(([name, subs]) => {
    const reasons = [];
    let riskScore = 0; // higher = more at risk

    const gradedSubs = subs.filter(s => s.final_score !== null);
    const ungradedAiSubs = subs.filter(s => s.status === 'ai_graded' && s.final_score === null);
    const flaggedSubs = subs.filter(s => s.ai_detection_score >= 50);
    const borderlineSubs = subs.filter(s => s.ai_detection_score >= 30 && s.ai_detection_score < 50);

    // Rule 1: High AI detection (critical)
    if (flaggedSubs.length > 0) {
      riskScore += 40;
      reasons.push(`${flaggedSubs[0].ai_detection_score}% AI content detected — score auto-zeroed`);
    }

    // Rule 2: Low final scores (below 60%)
    if (gradedSubs.length > 0) {
      const avgFinal = gradedSubs.reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / gradedSubs.length;
      if (avgFinal < 60) {
        riskScore += 30;
        reasons.push(`Average final score ${Math.round(avgFinal)}% — below pass threshold`);
      } else if (avgFinal < 70) {
        riskScore += 15;
        reasons.push(`Average final score ${Math.round(avgFinal)}% — borderline`);
      }
    }

    // Rule 3: Low AI scores even when original
    const aiScoredSubs = subs.filter(s => s.ai_score !== null && s.ai_detection_score < 50);
    if (aiScoredSubs.length > 0) {
      const avgAi = aiScoredSubs.reduce((sum, s) => sum + s.ai_score, 0) / aiScoredSubs.length;
      if (avgAi < 60) {
        riskScore += 20;
        reasons.push(`AI score average ${Math.round(avgAi)}/100 — consistently low`);
      }
    }

    // Rule 4: Borderline AI — possible academic integrity concern
    if (borderlineSubs.length > 0) {
      riskScore += 10;
      reasons.push(`${borderlineSubs[0].ai_detection_score}% AI — borderline, needs review`);
    }

    // Rule 5: Multiple ungraded submissions stacking up
    if (ungradedAiSubs.length >= 2) {
      riskScore += 10;
      reasons.push(`${ungradedAiSubs.length} submissions awaiting teacher review`);
    }

    // Best score to show (lowest final or lowest ai)
    const allScores = [
      ...gradedSubs.map(s => Math.round((s.final_score / s.max_score) * 100)),
      ...aiScoredSubs.map(s => Math.round((s.ai_score / s.max_score) * 100)),
    ];
    const lowestScore = allScores.length ? Math.min(...allScores) : null;

    if (riskScore >= 30 && reasons.length > 0) {
      atRisk.push({
        name,
        riskScore,
        level: riskScore >= 40 ? 'critical' : 'watch',
        reasons,
        lowestScore,
        submissionCount: subs.length,
      });
    }
  });

  return atRisk.sort((a, b) => b.riskScore - a.riskScore);
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function StatusBadge({ status, aiDetection }) {
  if (aiDetection >= 50) return <span className="badge badge--flagged">🚨 AI Flagged</span>;
  if (status === 'graded') return <span className="badge badge--graded">✅ Graded</span>;
  if (status === 'ai_graded') return <span className="badge badge--pending">⏳ Not Graded</span>;
  return <span className="badge badge--process">🤖 Processing</span>;
}

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

// ── AT-RISK PANEL COMPONENT ───────────────────────────────────────────────────
function AtRiskPanel({ submissions, onClose }) {
  const atRiskList = useMemo(() => detectAtRiskStudents(submissions), [submissions]);
  const critical = atRiskList.filter(s => s.level === 'critical');
  const watch = atRiskList.filter(s => s.level === 'watch');
  const uniqueStudents = [...new Set(submissions.map(s => s.student_name))].length;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #fca5a5',
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 14,
    }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: '#fef2f2', borderBottom: '1px solid #fecaca',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#991b1b', margin: 0 }}>
              AI At-Risk Student Detection
            </p>
            <p style={{ fontSize: 11, color: '#b91c1c', margin: 0 }}>
              Based on scores, AI flags and submission patterns
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', fontSize: 20, color: '#b91c1c',
          cursor: 'pointer', lineHeight: 1, padding: '2px 6px', borderRadius: 6,
        }}>×</button>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
        {[
          { num: critical.length, label: 'Critical risk', color: '#dc2626' },
          { num: watch.length, label: 'Watch closely', color: '#d97706' },
          { num: uniqueStudents, label: 'Students total', color: '#2563eb' },
        ].map(s => (
          <div key={s.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.num}</p>
            <p style={{ fontSize: 11, color: '#64748b', margin: '3px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Student rows */}
      <div style={{ padding: '6px 16px 14px' }}>
        {atRiskList.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: '20px 0' }}>
            ✅ No students flagged as at-risk.
          </p>
        ) : (
          atRiskList.map((student, idx) => {
            const isCritical = student.level === 'critical';
            return (
              <div key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '11px 0',
                borderBottom: idx < atRiskList.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14,
                  background: isCritical ? '#fee2e2' : '#fef3c7',
                  color: isCritical ? '#dc2626' : '#d97706',
                }}>
                  {student.name.charAt(0)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', margin: '0 0 2px' }}>
                    {student.name}
                  </p>
                  {student.reasons.map((r, i) => (
                    <p key={i} style={{ fontSize: 11, color: '#64748b', margin: '1px 0 0', lineHeight: 1.4 }}>
                      • {r}
                    </p>
                  ))}
                </div>

                {/* Score + badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                    background: isCritical ? '#fecaca' : '#fde68a',
                    color: isCritical ? '#7f1d1d' : '#78350f',
                  }}>
                    {isCritical ? '🚨 Critical' : '⚠️ Watch'}
                  </span>
                  {student.lowestScore !== null && (
                    <>
                      {/* Score bar */}
                      <div style={{ width: 70, height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          width: `${Math.min(student.lowestScore, 100)}%`,
                          background: isCritical ? '#ef4444' : '#f59e0b',
                        }} />
                      </div>
                      <p style={{
                        fontSize: 13, fontWeight: 800, margin: 0,
                        color: isCritical ? '#dc2626' : '#d97706',
                      }}>
                        {student.lowestScore}/100
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function StudentsTab({ onBack }) {
  const [submissions, setSubmissions] = useState(ALL_SUBMISSIONS_INIT);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAtRisk, setShowAtRisk] = useState(false);
  const [toast, setToast] = useState(null);
  const [gradeModal, setGradeModal] = useState(null);
  const [editGradeModal, setEditGradeModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const atRiskCount = useMemo(() => detectAtRiskStudents(submissions).length, [submissions]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openGrade = sub => {
    setGradeModal(sub);
    setGradeScore(sub.ai_score ?? '');
    setGradeFeedback('');
  };

  const openEditGrade = sub => {
    setEditGradeModal(sub);
    setGradeScore(sub.final_score ?? '');
    setGradeFeedback(sub.teacher_feedback || '');
  };

  const openFeedback = sub => {
    setFeedbackModal(sub);
    setGradeFeedback(sub.teacher_feedback || '');
  };

  const saveGrade = () => {
    const score = parseInt(gradeScore);
    if (isNaN(score) || score < 0 || score > gradeModal.max_score) {
      showToast('Invalid score. Enter a number between 0 and ' + gradeModal.max_score + '.', 'error');
      return;
    }
    const studentName = gradeModal.student_name;
    setSubmissions(prev =>
      prev.map(s => s.id === gradeModal.id
        ? { ...s, final_score: score, teacher_feedback: gradeFeedback, status: 'graded' }
        : s
      )
    );
    setGradeModal(null);
    showToast(`✅ Grade saved for ${studentName}.`);
  };

  const saveEditGrade = () => {
    const score = parseInt(gradeScore);
    if (isNaN(score) || score < 0 || score > editGradeModal.max_score) {
      showToast('Invalid score. Enter a number between 0 and ' + editGradeModal.max_score + '.', 'error');
      return;
    }
    const studentName = editGradeModal.student_name;
    setSubmissions(prev =>
      prev.map(s => s.id === editGradeModal.id
        ? { ...s, final_score: score, teacher_feedback: gradeFeedback, status: 'graded' }
        : s
      )
    );
    setEditGradeModal(null);
    showToast(`✅ Grade updated for ${studentName}.`);
  };

  const saveFeedback = () => {
    const studentName = feedbackModal.student_name;
    setSubmissions(prev =>
      prev.map(s => s.id === feedbackModal.id
        ? { ...s, teacher_feedback: gradeFeedback }
        : s
      )
    );
    setFeedbackModal(null);
    showToast(`✅ Feedback saved for ${studentName}.`);
  };

  const rows = [...submissions]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .filter(sub => sub.student_name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="pg-page">

      {/* ── TOAST ── */}
      {toast && <div className={`pg-toast pg-toast--${toast.type}`}>{toast.msg}</div>}

      {/* ── HEADER ── */}
      <header className="pg-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pg-header-logo">✍️</div>
          <div>
            <p className="pg-header-title">EssayGrade AI</p>
            <p className="pg-header-sub">Students</p>
          </div>
        </div>

        {/* Search + At-Risk button side by side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '7px 12px', borderRadius: 8,
              border: '1.5px solid #e2e8f0', fontSize: 13,
              color: '#0f172a', background: '#f8fafc',
              outline: 'none', width: 180,
            }}
          />

          {/* ── AI AT-RISK DETECTION BUTTON ── */}
          <button
            onClick={() => setShowAtRisk(prev => !prev)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 13px', borderRadius: 8, cursor: 'pointer',
              border: showAtRisk ? '1.5px solid #dc2626' : '1.5px solid #fca5a5',
              background: showAtRisk ? '#fee2e2' : '#fff5f5',
              color: '#991b1b', fontSize: 13, fontWeight: 700,
              transition: 'all 0.15s',
            }}
          >
            {/* Pulsing dot */}
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#ef4444',
              animation: 'atRiskPulse 1.4s ease-in-out infinite',
              flexShrink: 0,
            }} />
            ⚠️ At-Risk
            {/* Count badge */}
            {atRiskCount > 0 && (
              <span style={{
                background: '#dc2626', color: '#fff',
                fontSize: 11, fontWeight: 700,
                padding: '1px 7px', borderRadius: 20,
              }}>
                {atRiskCount}
              </span>
            )}
          </button>

          {onBack && (
            <button onClick={onBack} className="pg-back-btn">Home</button>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="pg-main">

        {/* ── AT-RISK PANEL (shown/hidden by button) ── */}
        {showAtRisk && (
          <AtRiskPanel
            submissions={submissions}
            onClose={() => setShowAtRisk(false)}
          />
        )}

        {/* CSS for pulsing dot */}
        <style>{`
          @keyframes atRiskPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.35); }
          }
        `}</style>

        <p className="pg-page-title">Students</p>

        <div className="pg-table-wrap">
          <div style={{ overflowX: 'auto' }}>
            <table className="pg-table">
              <thead>
                <tr>
                  <th className="pg-th">Student</th>
                  <th className="pg-th">Assignment Submitted</th>
                  <th className="pg-th">Status</th>
                  <th className="pg-th">AI Score</th>
                  <th className="pg-th">Final Score</th>
                  <th className="pg-th">AI Flag</th>
                  <th className="pg-th" style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: 13 }}>
                      No students match your search.
                    </td>
                  </tr>
                ) : (
                  rows.map(sub => {
                    const isFlagged = sub.ai_detection_score >= 50;
                    const finalPct = sub.final_score !== null
                      ? Math.round((sub.final_score / sub.max_score) * 100)
                      : null;
                    return (
                      <tr key={sub.id} className="pg-tr">
                        <td className="pg-td">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className={`pg-avatar ${isFlagged ? 'pg-avatar--red' : 'pg-avatar--blue'}`}>
                              {sub.student_name.charAt(0)}
                            </div>
                            <p style={{ fontWeight: 700, color: 'var(--text)', margin: 0, fontSize: 13, whiteSpace: 'nowrap' }}>
                              {sub.student_name}
                            </p>
                          </div>
                        </td>
                        <td className="pg-td">
                          <p style={{ fontWeight: 600, color: 'var(--text)', margin: '0 0 2px', fontSize: 13 }}>
                            {sub.assignment_title}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: 0 }}>
                            {new Date(sub.submitted_at).toLocaleDateString()}
                            {sub.file_name && (
                              <span style={{ color: 'var(--blue)', marginLeft: 6 }}>📎 {sub.file_name}</span>
                            )}
                          </p>
                        </td>
                        <td className="pg-td">
                          <StatusBadge status={sub.status} aiDetection={sub.ai_detection_score} />
                        </td>
                        <td className="pg-td">
                          {sub.ai_score !== null
                            ? <span className={isFlagged ? 'score--red' : 'score--blue'}>
                              {isFlagged ? 0 : sub.ai_score}/{sub.max_score}
                            </span>
                            : <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>—</span>
                          }
                        </td>
                        <td className="pg-td">
                          {sub.final_score !== null
                            ? <span className={scoreColorClass(finalPct)}>
                              {sub.final_score}/{sub.max_score}
                            </span>
                            : <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>—</span>
                          }
                        </td>
                        <td className="pg-td">
                          {sub.ai_detection_score !== null
                            ? <span className={`ai-pill ${isFlagged ? 'ai-pill--red'
                                : sub.ai_detection_score >= 30 ? 'ai-pill--amber'
                                  : 'ai-pill--green'
                              }`}>
                              {isFlagged ? '🚨' : sub.ai_detection_score >= 30 ? '⚠️' : '✅'} {sub.ai_detection_score}%
                            </span>
                            : <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>—</span>
                          }
                        </td>
                        <td className="pg-td" style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'nowrap' }}>
                            {sub.status === 'ai_graded' && (
                              <button onClick={() => openGrade(sub)} className="btn-sm-grade">✏️ Grade</button>
                            )}
                            {sub.status === 'graded' && (
                              <button onClick={() => openEditGrade(sub)} className="btn-outline-blue">🔁 Edit Grade</button>
                            )}
                            {(sub.status === 'graded' || sub.status === 'ai_graded') && (
                              <button onClick={() => openFeedback(sub)} className="btn-sm-ghost">💬 Feedback</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          GRADE MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {gradeModal && (
        <Sheet
          onClose={() => setGradeModal(null)}
          title={gradeModal.student_name}
          subtitle={gradeModal.assignment_title}
          footer={
            <>
              <button onClick={() => setGradeModal(null)} style={btnGhost}>Cancel</button>
              <button onClick={saveGrade} style={btnPrimary}>💾 Save Grade</button>
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
                <p className="info-box__sub">
                  You can accept or override below. AI detection: {gradeModal.ai_detection_score}%
                </p>
              </div>
            </div>
          )}
          <div className="essay-box">
            <span className="pg-label">Essay Submitted</span>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
              {gradeModal.essay_text}
            </p>
          </div>
          {gradeModal.ai_feedback && (
            <div className="ai-feedback-box">
              <span className="pg-label" style={{ color: 'var(--blue)' }}>🤖 AI Feedback</span>
              <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {gradeModal.ai_feedback}
              </p>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label className="pg-label">Final Score (out of {gradeModal.max_score}) *</label>
            <input
              className="pg-input"
              style={{ width: 160 }}
              type="number"
              min="0"
              max={gradeModal.max_score}
              value={gradeScore}
              onChange={e => setGradeScore(e.target.value)}
              placeholder={`0 – ${gradeModal.max_score}`}
            />
          </div>
          <div>
            <label className="pg-label">Feedback to Student</label>
            <textarea
              className="pg-input"
              value={gradeFeedback}
              onChange={e => setGradeFeedback(e.target.value)}
              rows={4}
              placeholder="Write personalised feedback..."
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </Sheet>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          EDIT GRADE MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {editGradeModal && (
        <Sheet
          onClose={() => setEditGradeModal(null)}
          title="Edit Grade"
          subtitle={`${editGradeModal.student_name} — ${editGradeModal.assignment_title}`}
          footer={
            <>
              <button onClick={() => setEditGradeModal(null)} style={btnGhost}>Cancel</button>
              <button onClick={saveEditGrade} style={btnPrimary}>💾 Update Grade</button>
            </>
          }
        >
          <div className="info-box info-box--amber">
            <span className="info-box__icon">✏️</span>
            <p style={{ fontSize: 13, color: '#92400e', fontWeight: 600, margin: 0 }}>
              Current grade: <strong>{editGradeModal.final_score}/{editGradeModal.max_score}</strong>{' '}
              ({Math.round((editGradeModal.final_score / editGradeModal.max_score) * 100)}%). You are overriding this.
            </p>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="pg-label">New Score (out of {editGradeModal.max_score})</label>
            <input
              className="pg-input"
              style={{ width: 160 }}
              type="number"
              min="0"
              max={editGradeModal.max_score}
              value={gradeScore}
              onChange={e => setGradeScore(e.target.value)}
            />
          </div>
          <div>
            <label className="pg-label">Updated Feedback</label>
            <textarea
              className="pg-input"
              value={gradeFeedback}
              onChange={e => setGradeFeedback(e.target.value)}
              rows={4}
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </Sheet>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          FEEDBACK MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {feedbackModal && (
        <Sheet
          onClose={() => setFeedbackModal(null)}
          title="Give Feedback"
          subtitle={`${feedbackModal.student_name} — ${feedbackModal.assignment_title}`}
          footer={
            <>
              <button onClick={() => setFeedbackModal(null)} style={btnGhost}>Cancel</button>
              <button onClick={saveFeedback} style={btnPrimary}>💾 Save Feedback</button>
            </>
          }
        >
          {feedbackModal.ai_feedback && (
            <div className="ai-feedback-box">
              <span className="pg-label" style={{ color: 'var(--blue)' }}>🤖 AI Feedback (for reference)</span>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {feedbackModal.ai_feedback}
              </p>
            </div>
          )}
          {feedbackModal.teacher_feedback && (
            <div className="info-box info-box--green" style={{ display: 'block' }}>
              <span className="pg-label" style={{ color: 'var(--green)' }}>👨‍🏫 Current Feedback</span>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.8 }}>
                {feedbackModal.teacher_feedback}
              </p>
            </div>
          )}
          <div>
            <label className="pg-label">
              {feedbackModal.teacher_feedback ? 'Update Feedback' : 'Write Feedback to Student'}
            </label>
            <textarea
              className="pg-input"
              value={gradeFeedback}
              onChange={e => setGradeFeedback(e.target.value)}
              rows={5}
              placeholder="Write personalised feedback for the student..."
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </Sheet>
      )}

    </div>
  );
}
