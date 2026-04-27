

import { useState, useMemo } from 'react';
import './students.css';
import './pending.css';

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

function detectAtRiskStudents(submissions) {
  const byStudent = {};
  submissions.forEach(sub => {
    if (!byStudent[sub.student_name]) byStudent[sub.student_name] = [];
    byStudent[sub.student_name].push(sub);
  });

  const atRisk = [];
  Object.entries(byStudent).forEach(([name, subs]) => {
    const reasons = [];
    let riskScore = 0;

    const gradedSubs     = subs.filter(s => s.final_score !== null);
    const ungradedAiSubs = subs.filter(s => s.status === 'ai_graded' && s.final_score === null);
    const flaggedSubs    = subs.filter(s => s.ai_detection_score >= 50);
    const borderlineSubs = subs.filter(s => s.ai_detection_score >= 30 && s.ai_detection_score < 50);

    if (flaggedSubs.length > 0) {
      riskScore += 40;
      reasons.push(`${flaggedSubs[0].ai_detection_score}% AI content detected — score auto-zeroed`);
    }
    if (gradedSubs.length > 0) {
      const avgFinal = gradedSubs.reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / gradedSubs.length;
      if (avgFinal < 60) { riskScore += 30; reasons.push(`Average final score ${Math.round(avgFinal)}% — below pass threshold`); }
      else if (avgFinal < 70) { riskScore += 15; reasons.push(`Average final score ${Math.round(avgFinal)}% — borderline`); }
    }
    const aiScoredSubs = subs.filter(s => s.ai_score !== null && s.ai_detection_score < 50);
    if (aiScoredSubs.length > 0) {
      const avgAi = aiScoredSubs.reduce((sum, s) => sum + s.ai_score, 0) / aiScoredSubs.length;
      if (avgAi < 60) { riskScore += 20; reasons.push(`AI score average ${Math.round(avgAi)}/100 — consistently low`); }
    }
    if (borderlineSubs.length > 0) { riskScore += 10; reasons.push(`${borderlineSubs[0].ai_detection_score}% AI — borderline, needs review`); }
    if (ungradedAiSubs.length >= 2) { riskScore += 10; reasons.push(`${ungradedAiSubs.length} submissions awaiting teacher review`); }

    const allScores = [
      ...gradedSubs.map(s => Math.round((s.final_score / s.max_score) * 100)),
      ...aiScoredSubs.map(s => Math.round((s.ai_score / s.max_score) * 100)),
    ];
    const lowestScore = allScores.length ? Math.min(...allScores) : null;

    if (riskScore >= 30 && reasons.length > 0) {
      atRisk.push({ name, riskScore, level: riskScore >= 40 ? 'critical' : 'watch', reasons, lowestScore, submissionCount: subs.length });
    }
  });
  return atRisk.sort((a, b) => b.riskScore - a.riskScore);
}

function StatusBadge({ status, aiDetection }) {
  if (aiDetection >= 50)      return <span className="badge badge--flagged">🚨 AI Flagged</span>;
  if (status === 'graded')    return <span className="badge badge--graded">✅ Graded</span>;
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

function AtRiskPanel({ submissions, onClose }) {
  const atRiskList     = useMemo(() => detectAtRiskStudents(submissions), [submissions]);
  const critical       = atRiskList.filter(s => s.level === 'critical');
  const watch          = atRiskList.filter(s => s.level === 'watch');
  const uniqueStudents = [...new Set(submissions.map(s => s.student_name))].length;

  return (
    <div style={{ background: '#fff', border: '1px solid #fca5a5', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#991b1b', margin: 0 }}>AI At-Risk Student Detection</p>
            <p style={{ fontSize: 11, color: '#b91c1c', margin: 0 }}>Based on scores, AI flags and submission patterns</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#b91c1c', cursor: 'pointer', lineHeight: 1, padding: '2px 6px', borderRadius: 6 }}>×</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
        {[
          { num: critical.length, label: 'Critical risk', color: '#dc2626' },
          { num: watch.length,    label: 'Watch closely', color: '#d97706' },
          { num: uniqueStudents,  label: 'Students total', color: '#2563eb' },
        ].map(s => (
          <div key={s.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.num}</p>
            <p style={{ fontSize: 11, color: '#64748b', margin: '3px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 16px 14px' }}>
        {atRiskList.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: '20px 0' }}>✅ No students flagged as at-risk.</p>
        ) : atRiskList.map((student, idx) => {
          const isCritical = student.level === 'critical';
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 0', borderBottom: idx < atRiskList.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, background: isCritical ? '#fee2e2' : '#fef3c7', color: isCritical ? '#dc2626' : '#d97706' }}>
                {student.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', margin: '0 0 2px' }}>{student.name}</p>
                {student.reasons.map((r, i) => (
                  <p key={i} style={{ fontSize: 11, color: '#64748b', margin: '1px 0 0', lineHeight: 1.4 }}>• {r}</p>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: isCritical ? '#fecaca' : '#fde68a', color: isCritical ? '#7f1d1d' : '#78350f' }}>
                  {isCritical ? '🚨 Critical' : '⚠️ Watch'}
                </span>
                {student.lowestScore !== null && (
                  <>
                    <div style={{ width: 70, height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(student.lowestScore, 100)}%`, background: isCritical ? '#ef4444' : '#f59e0b' }} />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 800, margin: 0, color: isCritical ? '#dc2626' : '#d97706' }}>{student.lowestScore}/100</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function StudentsTab({ students, submissions, assignments, loading, onGrade, onEditGrade }) {
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showAtRisk,     setShowAtRisk]     = useState(false);
  const [feedbackModal,  setFeedbackModal]  = useState(null);
  const [gradeFeedback,  setGradeFeedback]  = useState('');

  const atRiskCount = useMemo(() => detectAtRiskStudents(submissions), [submissions]).length;

  const openFeedback = sub => { setFeedbackModal(sub); setGradeFeedback(sub.teacher_feedback || ''); };

const handleExportStudents = () => {
  // Build one entry per student with all their assignments
  const byStudent = {};
  submissions.forEach(sub => {
    const key = sub.student_name;
    if (!byStudent[key]) byStudent[key] = { name: sub.student_name, email: sub.student_email, assignments: [] };
    byStudent[key].assignments.push(sub);
  });

  // Sort students alphabetically
  const sorted = Object.values(byStudent).sort((a, b) => a.name.localeCompare(b.name));

  const rows = sorted.map((student, idx) => {
    const assignmentRows = student.assignments
      .sort((a, b) => a.assignment_title.localeCompare(b.assignment_title))
      .map(sub => {
        const isFlagged  = sub.ai_detection_score >= 50;
        const aiScore    = sub.ai_score !== null ? (isFlagged ? `0/${sub.max_score} 🚨` : `${sub.ai_score}/${sub.max_score}`) : '—';
        const finalScore = sub.final_score !== null ? `${sub.final_score}/${sub.max_score}` : '—';
        const status     = sub.status === 'graded' ? '✅ Graded' : sub.status === 'ai_graded' ? '⏳ Pending' : '🔄 Processing';
        return `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569;">${sub.assignment_title}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:center;">${status}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:center;font-weight:700;color:${isFlagged ? '#dc2626' : '#2563eb'};">${aiScore}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:center;font-weight:700;color:${sub.final_score !== null ? '#16a34a' : '#94a3b8'};">${finalScore}</td>
          </tr>`;
      }).join('');

    const bgColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    return `
      <tr>
        <td colspan="4" style="padding:0;background:${bgColor};">
          <div style="padding:14px 16px 4px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#38bdf8);color:#fff;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${student.name.charAt(0)}
              </div>
              <div>
                <p style="font-weight:800;font-size:14px;color:#0f172a;margin:0;">${student.name}</p>
                <p style="font-size:11px;color:#94a3b8;margin:0;">${student.assignments.length} assignment${student.assignments.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
              <thead>
                <tr style="background:#f1f5f9;">
                  <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#64748b;text-align:left;text-transform:uppercase;letter-spacing:0.4px;">Assignment</th>
                  <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#64748b;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">Status</th>
                  <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#64748b;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">AI Score</th>
                  <th style="padding:7px 12px;font-size:11px;font-weight:700;color:#64748b;text-align:center;text-transform:uppercase;letter-spacing:0.4px;">Final Score</th>
                </tr>
              </thead>
              <tbody>${assignmentRows}</tbody>
            </table>
          </div>
        </td>
      </tr>`;
  }).join('');

  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>Student Report</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; padding: 32px 24px; color: #1e293b; }
          .page { max-width: 820px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg,#3b82f6,#38bdf8); padding: 28px 32px; color: #fff; }
          .header h1 { font-size: 22px; font-weight: 900; margin-bottom: 4px; }
          .header p { font-size: 13px; opacity: 0.85; }
          .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #e2e8f0; border-bottom: 1px solid #e2e8f0; }
          .stat { background: #f8fafc; padding: 16px 20px; text-align: center; }
          .stat-num { font-size: 26px; font-weight: 900; color: #1e293b; }
          .stat-label { font-size: 11px; font-weight: 600; color: #94a3b8; margin-top: 2px; }
          .content { padding: 0; }
          table.outer { width: 100%; border-collapse: collapse; }
          @media print {
            body { background: #fff; padding: 0; }
            .page { box-shadow: none; border-radius: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>☁️ EssayGrade AI — Student Report</h1>
            <p>Generated ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })} &nbsp;·&nbsp; ${sorted.length} students &nbsp;·&nbsp; ${submissions.length} total submissions</p>
          </div>
          <div class="stats">
            <div class="stat">
              <div class="stat-num">${sorted.length}</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat">
              <div class="stat-num">${submissions.filter(s => s.final_score !== null).length}</div>
              <div class="stat-label">Graded</div>
            </div>
            <div class="stat">
              <div class="stat-num">${submissions.filter(s => s.ai_detection_score >= 50).length}</div>
              <div class="stat-label">AI Flagged</div>
            </div>
          </div>
          <div class="content">
            <table class="outer">
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
        <div class="no-print" style="text-align:center;margin-top:24px;">
          <button onclick="window.print()" style="padding:12px 32px;background:#2563eb;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;">🖨️ Print / Save as PDF</button>
        </div>
      </body>
    </html>
  `);
  win.document.close();
};


  const rows = [...submissions]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .filter(sub => sub.student_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{ width: 36, height: 36, border: '4px solid #bfdbfe', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  return (
    <div className="pg-page">
      <style>{`@keyframes atRiskPulse { 0%, 100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.35); } }`}</style>

      <header className="pg-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pg-header-logo">✍️</div>
          <div>
            <p className="pg-header-title">EssayGrade AI</p>
            <p className="pg-header-sub">Students</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Search student..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', background: '#f8fafc', outline: 'none', width: 180 }}
          />

           <button onClick={handleExportStudents} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 13px', borderRadius: 8, cursor: 'pointer',
        border: '1.5px solid #16a34a', background: '#f0fdf4',
        color: '#15803d', fontSize: 13, fontWeight: 700,
      }}>
        📄 Export PDF
      </button> 

          <button onClick={() => setShowAtRisk(prev => !prev)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, cursor: 'pointer', border: showAtRisk ? '1.5px solid #dc2626' : '1.5px solid #fca5a5', background: showAtRisk ? '#fee2e2' : '#fff5f5', color: '#991b1b', fontSize: 13, fontWeight: 700, transition: 'all 0.15s' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'atRiskPulse 1.4s ease-in-out infinite', flexShrink: 0 }} />
            ⚠️ WatchList
            {atRiskCount > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>{atRiskCount}</span>}
          </button>
        </div>
      </header>

      <div className="pg-main">
        {showAtRisk && <AtRiskPanel submissions={submissions} onClose={() => setShowAtRisk(false)} />}

        <p className="pg-page-title">Students</p>

        {submissions.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', padding: '64px 24px' }}>
            <p style={{ fontSize: 48, margin: '0 0 14px' }}>👥</p>
            <p style={{ fontWeight: 700, color: '#64748b', fontSize: 16, margin: '0 0 6px' }}>No students yet</p>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Students will appear here once they submit essays.</p>
          </div>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(() => {
              const byStudent = {};
              submissions.forEach(sub => {
                if (!byStudent[sub.student_name]) {
                  byStudent[sub.student_name] = { name: sub.student_name, email: sub.student_email, assignments: [] };
                }
                byStudent[sub.student_name].assignments.push(sub);
              });

              const sorted = Object.values(byStudent)
                .sort((a, b) => a.name.localeCompare(b.name))
                .filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));

              if (sorted.length === 0) return (
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', textAlign: 'center', padding: '40px 24px' }}>
                  <p style={{ color: '#94a3b8', fontSize: 13 }}>No students match your search.</p>
                </div>
              );

              return sorted.map((student) => {
                const gradedCount  = student.assignments.filter(s => s.final_score !== null).length;
                const flaggedCount = student.assignments.filter(s => s.ai_detection_score >= 50).length;
                const avgFinal     = gradedCount > 0
                  ? Math.round(student.assignments.filter(s => s.final_score !== null).reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / gradedCount)
                  : null;

                return (
                  <div key={student.name} style={{
                    background: '#fff', borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    borderLeft: `5px solid ${flaggedCount > 0 ? '#ef4444' : avgFinal !== null && avgFinal < 60 ? '#f59e0b' : '#3b82f6'}`,
                    overflow: 'hidden',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                  }}>
                    {/* Student header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', background: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0', gap: '12px', flexWrap: 'wrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                          background: flaggedCount > 0
                            ? 'linear-gradient(135deg,#ef4444,#f87171)'
                            : 'linear-gradient(135deg,#3b82f6,#38bdf8)',
                          color: '#fff', fontWeight: 800, fontSize: 15,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', margin: 0 }}>{student.name}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{student.email}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#eff6ff', color: '#2563eb' }}>
                          📝 {student.assignments.length} submission{student.assignments.length !== 1 ? 's' : ''}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a' }}>
                          ✅ {gradedCount} graded
                        </span>
                        {avgFinal !== null && (
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                            background: avgFinal >= 70 ? '#f0fdf4' : avgFinal >= 50 ? '#fefce8' : '#fef2f2',
                            color: avgFinal >= 70 ? '#16a34a' : avgFinal >= 50 ? '#ca8a04' : '#dc2626',
                          }}>
                            📊 Avg {avgFinal}%
                          </span>
                        )}
                        {flaggedCount > 0 && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#fef2f2', color: '#dc2626' }}>
                            🚨 {flaggedCount} flagged
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Assignments table */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9' }}>
                            <th style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Assignment</th>
                            <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Submitted</th>
                            <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Status</th>
                            <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>AI Score</th>
                            <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Final Score</th>
                            <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>AI Flag</th>
                            <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.assignments
                            .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
                            .map((sub, subIdx) => {
                              const isFlagged = sub.ai_detection_score >= 50;
                              const finalPct  = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
                              const isLast    = subIdx === student.assignments.length - 1;
                              return (
                                <tr key={sub.id} style={{ borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '12px 16px' }}>
                                    <p style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', margin: '0 0 2px' }}>{sub.assignment_title}</p>
                                    {sub.file_name && <p style={{ fontSize: 11, color: '#3b82f6', margin: 0 }}>📎 {sub.file_name}</p>}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                                    {new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <StatusBadge status={sub.status} aiDetection={sub.ai_detection_score} />
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {sub.ai_score !== null
                                      ? <span className={isFlagged ? 'score--red' : 'score--blue'}>{isFlagged ? 0 : sub.ai_score}/{sub.max_score}</span>
                                      : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {sub.final_score !== null
                                      ? <span className={scoreColorClass(finalPct)}>{sub.final_score}/{sub.max_score}</span>
                                      : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {sub.ai_detection_score !== null
                                      ? <span className={`ai-pill ${isFlagged ? 'ai-pill--red' : sub.ai_detection_score >= 30 ? 'ai-pill--amber' : 'ai-pill--green'}`}>
                                          {isFlagged ? '🚨' : sub.ai_detection_score >= 30 ? '⚠️' : '✅'} {sub.ai_detection_score}%
                                        </span>
                                      : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'nowrap' }}>
                                      {sub.status === 'ai_graded' && (
                                        <button onClick={() => onGrade(sub)} className="btn-sm-grade">✏️ Grade</button>
                                      )}
                                      {sub.status === 'graded' && onEditGrade && (
                                        <button onClick={() => onEditGrade(sub)} className="btn-outline-blue">🔁 Edit</button>
                                      )}
                                      {(sub.status === 'graded' || sub.status === 'ai_graded') && (
                                        <button onClick={() => openFeedback(sub)} className="btn-sm-ghost">💬</button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>


      {/* FEEDBACK MODAL — local only, no API needed */}
      {feedbackModal && (
        <Sheet
          onClose={() => setFeedbackModal(null)}
          title="Give Feedback"
          subtitle={`${feedbackModal.student_name} — ${feedbackModal.assignment_title}`}
          footer={
            <>
              <button onClick={() => setFeedbackModal(null)} style={btnGhost}>Cancel</button>
              <button onClick={() => { setFeedbackModal(null); }} style={btnPrimary}>💾 Save Feedback</button>
            </>
          }
        >
          {feedbackModal.ai_feedback && (
            <div className="ai-feedback-box">
              <span className="pg-label" style={{ color: 'var(--blue)' }}>🤖 AI Feedback (for reference)</span>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{feedbackModal.ai_feedback}</p>
            </div>
          )}
          {feedbackModal.teacher_feedback && (
            <div className="info-box info-box--green" style={{ display: 'block' }}>
              <span className="pg-label" style={{ color: 'var(--green)' }}>👨‍🏫 Current Feedback</span>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.8 }}>{feedbackModal.teacher_feedback}</p>
            </div>
          )}
          <div>
            <label className="pg-label">{feedbackModal.teacher_feedback ? 'Update Feedback' : 'Write Feedback to Student'}</label>
            <textarea
              className="pg-input" value={gradeFeedback}
              onChange={e => setGradeFeedback(e.target.value)}
              rows={5} placeholder="Write personalised feedback for the student..."
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </Sheet>
      )}
    </div>
  );
}