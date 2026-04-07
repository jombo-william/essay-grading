// src/components/student/ResultDetailSheet.jsx
import { C, Sheet, scoreColor, scoreLabel } from './shared.jsx';
import ChatPanel from '../ChatPanel.jsx';

export default function ResultDetailSheet({ sub, user, canUnsubmit, onClose, onUnsubmit }) {
  if (!sub) return null;

  const pct   = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
  const isAI  = (sub.ai_detection_score ?? 0) >= 50;

  return (
    <Sheet
      onClose={onClose}
      title={sub.assignment_title}
      subtitle={`Submitted ${new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      footer={
        <div style={{ display: 'flex', gap: '10px' }}>
          {canUnsubmit && (
            <button onClick={() => { if (window.confirm('Unsubmit?')) onUnsubmit(sub); }} style={C.dBtn}>↩ Unsubmit</button>
          )}
          <button onClick={onClose} style={C.gBtn}>Close</button>
        </div>
      }
    >
      {/* ── Score banner ── */}
      {sub.final_score !== null ? (() => {
        const bg = pct >= 70 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : pct >= 50 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#ef4444,#dc2626)';
        return (
          <div style={{ background: bg, borderRadius: '18px', padding: '28px', textAlign: 'center', marginBottom: '18px', boxShadow: '0 4px 24px rgba(99,102,241,0.2)' }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Final Score</p>
            <p style={{ color: '#fff', fontSize: '62px', fontWeight: '900', margin: 0, lineHeight: 1 }}>
              {sub.final_score}<span style={{ fontSize: '22px', opacity: 0.55 }}>/{sub.max_score}</span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', fontWeight: '700' }}>{pct}%</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>{scoreLabel(pct)}</span>
            </div>
          </div>
        );
      })() : isAI ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
          <p style={{ fontSize: '26px', margin: '0 0 8px' }}>🚨</p>
          <p style={{ fontWeight: '800', color: '#dc2626', fontSize: '15px', margin: '0 0 4px' }}>AI Content Detected</p>
          <p style={{ fontSize: '13px', color: '#b91c1c', margin: '0 0 4px' }}>{sub.ai_detection_score}% AI-generated — Automatic score: 0</p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Awaiting teacher review</p>
        </div>
      ) : sub.ai_score !== null ? (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
          <p style={{ fontSize: '24px', margin: '0 0 6px' }}>⏳</p>
          <p style={{ fontWeight: '800', color: '#92400e', fontSize: '15px', margin: '0 0 4px' }}>Awaiting Teacher Approval</p>
          <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>AI suggested <strong>{sub.ai_score}/{sub.max_score}</strong></p>
        </div>
      ) : (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
          <p style={{ fontWeight: '700', color: '#1e40af', margin: 0 }}>🤖 Grading in progress...</p>
        </div>
      )}

      {/* ── AI Detection bar ── */}
      {sub.ai_detection_score !== null && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <p style={C.sL}>AI Content Detection</p>
            <span style={{ fontSize: '13px', fontWeight: '800', color: isAI ? '#dc2626' : '#16a34a' }}>{sub.ai_detection_score}%</span>
          </div>
          <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${sub.ai_detection_score}%`, background: isAI ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: '4px' }} />
            <div style={{ position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%', background: '#94a3b8' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>0% Human</span>
            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700' }}>50% limit</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>100% AI</span>
          </div>
        </div>
      )}

      {/* ── AI Feedback ── */}
      {sub.ai_feedback && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
          <p style={{ ...C.sL, color: '#1d4ed8' }}>🤖 AI Feedback</p>
          <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.85', whiteSpace: 'pre-wrap' }}>{sub.ai_feedback}</p>
        </div>
      )}

      {/* ── Teacher Feedback ── */}
      {sub.teacher_feedback && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
          <p style={{ ...C.sL, color: '#15803d' }}>👨‍🏫 Teacher Feedback</p>
          <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.85' }}>{sub.teacher_feedback}</p>
        </div>
      )}

      {/* ── Essay text ── */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <p style={C.sL}>Your Submission</p>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {sub.essay_text?.trim().split(/\s+/).filter(Boolean).length} words
            {sub.file_name ? ` · 📎 ${sub.file_name}` : ''}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.85', margin: 0, whiteSpace: 'pre-wrap' }}>{sub.essay_text}</p>
      </div>

      <ChatPanel submissionId={sub.id ?? sub.submission_id} user={user} />
    </Sheet>
  );
}