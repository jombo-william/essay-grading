



// src/components/student/ResultDetailSheet.jsx
import { useState } from 'react';
import { C, Icon, Sheet, scoreColor, scoreLabel, scoreBg } from './shared.jsx';

export default function ResultDetailSheet({ sub, user, canUnsubmit, onClose, onUnsubmit }) {
  if (!sub) return null;

  const [showFeedback, setShowFeedback] = useState(false);

  const pct   = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
  const isAI  = (sub.ai_detection_score ?? 0) >= 50;
  const words = sub.essay_text?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const hasFeedback = sub.ai_feedback || sub.teacher_feedback;

  return (
    <Sheet
      onClose={onClose}
      title={sub.assignment_title}
      subtitle={`Submitted ${new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      footer={
        <div style={{ display: 'flex', gap: '10px' }}>
          {canUnsubmit && (
            <button
              style={C.dBtn}
              onClick={() => { if (window.confirm('Unsubmit this essay?')) onUnsubmit(sub); }}
            >
              <Icon name="arrow-back-up" size={15} />
              Unsubmit
            </button>
          )}
          <button style={C.gBtn} onClick={onClose}>Close</button>
        </div>
      }
    >

      {/* ── Compact score banner ── */}
      {pct !== null ? (
        <div style={{
          background: scoreBg(pct),
          border: `1px solid ${pct >= 70 ? '#C0DD97' : pct >= 50 ? '#FAC775' : '#F7C1C1'}`,
          borderRadius: '12px', padding: '14px 18px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: scoreColor(pct), textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>
              Final score
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: scoreColor(pct), margin: 0, lineHeight: 1 }}>
              {sub.final_score}
              <span style={{ fontSize: '15px', opacity: 0.6 }}>/{sub.max_score}</span>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '22px', fontWeight: '600', color: scoreColor(pct), margin: '0 0 2px' }}>{pct}%</p>
            <span style={{
              background: '#fff', color: scoreColor(pct),
              fontSize: '11px', fontWeight: '500', padding: '2px 10px', borderRadius: '20px',
            }}>
              {scoreLabel(pct)}
            </span>
          </div>
        </div>

      ) : isAI ? (
        <div style={{
          background: '#FCEBEB', border: '1px solid #F7C1C1',
          borderRadius: '12px', padding: '12px 16px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <Icon name="alert-triangle" size={20} style={{ color: '#A32D2D', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: '600', color: '#791F1F', fontSize: '13px', margin: '0 0 2px' }}>AI content detected</p>
            <p style={{ fontSize: '12px', color: '#A32D2D', margin: 0 }}>
              {sub.ai_detection_score}% AI · automatic score: 0 · awaiting teacher review
            </p>
          </div>
        </div>

      ) : sub.ai_score !== null ? (
        <div style={{
          background: '#FAEEDA', border: '1px solid #FAC775',
          borderRadius: '12px', padding: '12px 16px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <Icon name="clock" size={20} style={{ color: '#854F0B', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: '600', color: '#633806', fontSize: '13px', margin: '0 0 2px' }}>Awaiting teacher approval</p>
            <p style={{ fontSize: '12px', color: '#854F0B', margin: 0 }}>
              Suggested score: {sub.ai_score}/{sub.max_score}
            </p>
          </div>
        </div>

      ) : (
        <div style={{
          background: '#EEEDFE', border: '1px solid #CECBF6',
          borderRadius: '12px', padding: '12px 16px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <Icon name="loader-2" size={18} style={{ color: '#3C3489', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
          <p style={{ fontWeight: '600', color: '#26215C', margin: 0, fontSize: '13px' }}>Grading in progress…</p>
        </div>
      )}

      {/* ── AI detection bar (compact) ── */}
      {sub.ai_detection_score !== null && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={C.sL}>AI detection</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: isAI ? '#A32D2D' : '#3B6D11' }}>
              {sub.ai_detection_score}%
            </span>
          </div>
          <div style={{ height: '5px', background: '#F1EFE8', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${sub.ai_detection_score}%`, background: isAI ? '#A32D2D' : '#3B6D11', borderRadius: '3px' }} />
            <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: '#D3D1C7' }} />
          </div>
        </div>
      )}

      {/* ── Collapsible feedback ── */}
      {hasFeedback && (
        <div style={{ marginBottom: '14px' }}>
          <button
            onClick={() => setShowFeedback(v => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#F8F7FF', border: '1px solid #ECECF2', borderRadius: showFeedback ? '10px 10px 0 0' : '10px',
              padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#3C3489', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="message-2" size={14} style={{ color: '#3C3489' }} />
              View feedback
            </span>
            <Icon name={showFeedback ? 'chevron-up' : 'chevron-down'} size={14} style={{ color: '#8884A8' }} />
          </button>

          {showFeedback && (
            <div style={{ border: '1px solid #ECECF2', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
              {sub.ai_feedback && (
                <div style={{ padding: '12px 14px', background: '#E6F1FB', borderBottom: sub.teacher_feedback ? '1px solid #B5D4F4' : 'none' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
                    AI feedback
                  </p>
                  <p style={{ fontSize: '13px', color: '#1A1830', margin: 0, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                    {sub.ai_feedback}
                  </p>
                </div>
              )}
              {sub.teacher_feedback && (
                <div style={{ padding: '12px 14px', background: '#EAF3DE' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#3B6D11', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
                    Teacher feedback
                  </p>
                  <p style={{ fontSize: '13px', color: '#1A1830', margin: 0, lineHeight: 1.75 }}>
                    {sub.teacher_feedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Essay text ── */}
      <div style={{ background: '#F8F7FF', border: '1px solid #ECECF2', borderRadius: '12px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={C.sL}>Your submission</span>
          <span style={{ fontSize: '11px', color: '#8884A8' }}>
            {words} words{sub.file_name ? ` · ${sub.file_name}` : ''}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#44425C', lineHeight: 1.85, margin: 0, whiteSpace: 'pre-wrap' }}>
          {sub.essay_text}
        </p>
      </div>

    </Sheet>
  );
}