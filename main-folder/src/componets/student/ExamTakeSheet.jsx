// src/componets/student/ExamTakeSheet.jsx
// Full-screen exam experience — one question at a time, countdown timer, MCQ + structured.

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from './api.js';

const OPTIONS = ['A', 'B', 'C', 'D'];

// ── Countdown timer hook ───────────────────────────────────────────────────────
function useCountdown(minutes, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const expired = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!expired.current) { expired.current = true; onExpire(); }
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, onExpire]);

  const mm  = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss  = String(secondsLeft % 60).padStart(2, '0');
  const pct = Math.round((secondsLeft / (minutes * 60)) * 100);
  const urgent = secondsLeft <= 120; // last 2 minutes

  return { display: `${mm}:${ss}`, pct, urgent, secondsLeft };
}

// ── MCQ question renderer ──────────────────────────────────────────────────────
function MCQQuestion({ question, answer, onChange }) {
  return (
    <div>
      <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', lineHeight: '1.7', margin: '0 0 20px', whiteSpace: 'pre-wrap' }}>
        {question.prompt}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPTIONS.map((letter, i) => {
          const optionText = question.options?.[i] || '';
          const selected   = answer?.selected_option === letter;
          return (
            <button
              key={letter}
              onClick={() => onChange({ selected_option: letter })}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 18px', borderRadius: '14px', border: 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                background: selected ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f8fafc',
                boxShadow: selected ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                transition: 'all 0.15s',
                outline: selected ? 'none' : '1.5px solid #e2e8f0',
              }}
            >
              <span style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '13px',
                background: selected ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                color: selected ? '#fff' : '#64748b',
              }}>
                {letter}
              </span>
              <span style={{ fontSize: '14px', fontWeight: selected ? '700' : '500', color: selected ? '#fff' : '#1e293b', lineHeight: '1.5' }}>
                {optionText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Structured question renderer ───────────────────────────────────────────────
function StructuredQuestion({ question, answer, onChange }) {
  const text      = answer?.answer_text || '';
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div>
      <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', lineHeight: '1.7', margin: '0 0 16px', whiteSpace: 'pre-wrap' }}>
        {question.prompt}
      </p>
      <textarea
        value={text}
        onChange={e => onChange({ answer_text: e.target.value })}
        placeholder="Write your answer here..."
        rows={8}
        style={{
          width: '100%', padding: '14px 16px', boxSizing: 'border-box',
          border: '1.5px solid #e2e8f0', borderRadius: '14px',
          fontSize: '14px', color: '#1e293b', lineHeight: '1.7',
          fontFamily: 'inherit', outline: 'none', resize: 'vertical',
          background: '#f8fafc', transition: 'border-color 0.2s',
        }}
        onFocus={e  => e.target.style.borderColor = '#6366f1'}
        onBlur={e   => e.target.style.borderColor = '#e2e8f0'}
      />
      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0', textAlign: 'right' }}>
        {wordCount} word{wordCount !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ExamTakeSheet({ exam, onClose, onSubmitted, showToast }) {
  if (!exam) return null;

  const questions  = exam.questions || [];
  const total      = questions.length;

  // answers: { [questionId]: { selected_option?, answer_text? } }
  const [answers,     setAnswers]     = useState({});
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [submitting,  setSubmitting]  = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentQ = questions[currentIdx];

  const handleExpire = useCallback(() => {
    showToast('⏰ Time is up! Submitting your exam automatically.', 'error');
    handleSubmit(true);
  }, [answers]);

  const { display: timerDisplay, pct: timerPct, urgent } = useCountdown(exam.time_limit, handleExpire);

  const setAnswer = (qId, value) =>
    setAnswers(prev => ({ ...prev, [qId]: { ...(prev[qId] || {}), ...value } }));

  const answeredCount = questions.filter(q => {
    const a = answers[q.id];
    if (q.type === 'mcq')        return !!a?.selected_option;
    if (q.type === 'structured') return !!a?.answer_text?.trim();
    return false;
  }).length;

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (autoSubmit = false) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        exam_id: exam.id,
        answers: questions.map(q => ({
          question_id:     q.id,
          selected_option: answers[q.id]?.selected_option || null,
          answer_text:     answers[q.id]?.answer_text     || null,
        })),
      };
      await apiFetch('/exams/submit', { method: 'POST', body: JSON.stringify(payload) });
      if (!autoSubmit) showToast('✅ Exam submitted successfully!');
      onSubmitted();
      onClose();
    } catch (err) {
      showToast(err.message || 'Submission failed. Please try again.', 'error');
      setSubmitting(false);
    }
  };

  // ── Breadcrumb dots ────────────────────────────────────────────────────────
  const dots = questions.map((q, i) => {
    const answered = q.type === 'mcq'
      ? !!answers[q.id]?.selected_option
      : !!answers[q.id]?.answer_text?.trim();
    return (
      <button
        key={q.id}
        onClick={() => setCurrentIdx(i)}
        title={`Q${i + 1}`}
        style={{
          width: '10px', height: '10px', borderRadius: '50%', border: 'none',
          cursor: 'pointer', padding: 0, flexShrink: 0,
          background: i === currentIdx
            ? '#6366f1'
            : answered ? '#86efac' : '#e2e8f0',
          transform: i === currentIdx ? 'scale(1.4)' : 'scale(1)',
          transition: 'all 0.15s',
        }}
      />
    );
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: '#f8fafc',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflowY: 'auto',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '0 20px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}>
        {/* Exam title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: '800', fontSize: '14px', color: '#1e293b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {exam.title}
          </p>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
            {answeredCount}/{total} answered
          </p>
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '6px 16px', borderRadius: '12px',
          background: urgent ? '#fef2f2' : '#f0fdf4',
          border: `1.5px solid ${urgent ? '#fca5a5' : '#86efac'}`,
          minWidth: '90px',
        }}>
          <p style={{ fontSize: '20px', fontWeight: '900', margin: 0, lineHeight: 1, color: urgent ? '#dc2626' : '#16a34a', fontVariantNumeric: 'tabular-nums' }}>
            {timerDisplay}
          </p>
          <div style={{ width: '70px', height: '3px', background: '#e2e8f0', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '2px', width: `${timerPct}%`, background: urgent ? '#ef4444' : '#22c55e', transition: 'width 1s linear' }} />
          </div>
        </div>
      </div>

      {/* ── Progress dots ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '12px 20px', background: '#fff',
        borderBottom: '1px solid #f1f5f9',
        flexWrap: 'wrap',
      }}>
        {dots}
        <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>
          {answeredCount} of {total} answered
        </span>
      </div>

      {/* ── Question area ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: '680px', margin: '0 auto', width: '100%', padding: '32px 20px' }}>

        {/* Question header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', fontWeight: '800', fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {currentIdx + 1}
            </span>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Question {currentIdx + 1} of {total}
              </p>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: currentQ.type === 'mcq' ? '#2563eb' : '#9333ea' }}>
                {currentQ.type === 'mcq' ? '🔵 Multiple Choice' : '📝 Structured'} · {currentQ.marks} mark{currentQ.marks !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Question content */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
          {currentQ.type === 'mcq' ? (
            <MCQQuestion
              question={currentQ}
              answer={answers[currentQ.id]}
              onChange={val => setAnswer(currentQ.id, val)}
            />
          ) : (
            <StructuredQuestion
              question={currentQ}
              answer={answers[currentQ.id]}
              onChange={val => setAnswer(currentQ.id, val)}
            />
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            style={{
              padding: '11px 22px', borderRadius: '12px',
              border: '1.5px solid #e2e8f0', background: '#f8fafc',
              color: currentIdx === 0 ? '#cbd5e1' : '#64748b',
              fontWeight: '700', fontSize: '13px',
              cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← Prev
          </button>

          {currentIdx < total - 1 ? (
            <button
              onClick={() => setCurrentIdx(i => Math.min(total - 1, i + 1))}
              style={{
                flex: 1, padding: '11px 22px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              style={{
                flex: 1, padding: '11px 22px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg,#10b981,#34d399)',
                color: '#fff', fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
              }}
            >
              ✅ Review & Submit
            </button>
          )}
        </div>

        {/* Unanswered warning */}
        {answeredCount < total && (
          <p style={{ fontSize: '12px', color: '#f59e0b', textAlign: 'center', margin: '14px 0 0', fontWeight: '600' }}>
            ⚠️ {total - answeredCount} question{total - answeredCount !== 1 ? 's' : ''} unanswered
          </p>
        )}
      </div>

      {/* ── Confirm submit modal ───────────────────────────────────────────── */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 400, backdropFilter: 'blur(4px)', padding: '20px',
        }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '36px 32px', width: '100%', maxWidth: '400px', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <p style={{ fontSize: '32px', textAlign: 'center', margin: '0 0 12px' }}>📋</p>
            <h2 style={{ fontWeight: '900', fontSize: '18px', color: '#1e293b', textAlign: 'center', margin: '0 0 8px' }}>
              Submit Exam?
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', margin: '0 0 20px', lineHeight: '1.6' }}>
              You have answered <strong>{answeredCount}</strong> of <strong>{total}</strong> questions.
              {answeredCount < total && <span style={{ color: '#f59e0b' }}> {total - answeredCount} unanswered.</span>}
              {' '}You cannot change your answers after submitting.
            </p>

            {/* Answer summary */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <div style={{ flex: 1, background: '#f0fdf4', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '22px', fontWeight: '900', color: '#16a34a', margin: 0 }}>{answeredCount}</p>
                <p style={{ fontSize: '11px', color: '#16a34a', margin: 0, fontWeight: '600' }}>Answered</p>
              </div>
              <div style={{ flex: 1, background: '#fef2f2', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '22px', fontWeight: '900', color: '#dc2626', margin: 0 }}>{total - answeredCount}</p>
                <p style={{ fontSize: '11px', color: '#dc2626', margin: 0, fontWeight: '600' }}>Skipped</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Review Again
              </button>
              <button
                onClick={() => { setShowConfirm(false); handleSubmit(); }}
                disabled={submitting}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#10b981,#34d399)', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
              >
                {submitting ? 'Submitting…' : 'Submit ✅'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}