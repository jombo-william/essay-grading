
// src/componets/teacher/GradeModals.jsx
import { Sheet, ScoreBar, btn, inp, label, colors } from "./shared.jsx";

export function GradeModal({ sub, score, setScore, feedback, setFeedback, onSave, onClose }) {
  const flagged = sub.ai_detection_score >= 50;
  const c = flagged ? colors.red : colors.blue;

  return (
    <Sheet onClose={onClose} title="Review & Grade"
      subtitle={`${sub.student_name} — ${sub.assignment_title}`}
      footer={
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={btn.ghost} onClick={onClose}>Cancel</button>
          <button style={btn.primary} onClick={onSave}>💾 Save Grade</button>
        </div>
      }
    >
      {/* AI banner */}
      {sub.ai_score !== null && (
        <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "26px" }}>{flagged ? "🚨" : "🤖"}</span>
          <div>
            <p style={{ fontWeight: "700", fontSize: "14px", color: c.text, margin: "0 0 3px" }}>
              AI Score: {sub.ai_score}/{sub.max_score}{flagged && " · High AI Content Flagged"}
            </p>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
              AI detection: {sub.ai_detection_score}% — you can accept or override below.
            </p>
          </div>
        </div>
      )}

      {/* Essay preview */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px", marginBottom: "20px", maxHeight: "150px", overflowY: "auto" }}>
        <p style={{ ...label, marginBottom: "8px" }}>Student Essay</p>
        <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap" }}>{sub.essay_text}</p>
      </div>

      {/* AI feedback */}
      {sub.ai_feedback && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ ...label, color: "#1d4ed8", marginBottom: "8px" }}>🤖 AI Feedback</p>
          <p style={{ fontSize: "13px", color: "#1e293b", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap" }}>{sub.ai_feedback}</p>
        </div>
      )}

      {/* Score */}
      <div style={{ marginBottom: "20px" }}>
        <label style={label}>Final Score (out of {sub.max_score}) *</label>
        <input style={{ ...inp, width: "150px" }} type="number" min="0" max={sub.max_score}
          value={score} onChange={e => setScore(e.target.value)} placeholder={`0–${sub.max_score}`} />
      </div>

      {/* Feedback */}
      <div>
        <label style={label}>Your Feedback to Student</label>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4}
          placeholder="Write personalised feedback for the student..."
          style={{ ...inp, resize: "vertical", lineHeight: "1.65" }} />
      </div>
    </Sheet>
  );
}

export function EditGradeModal({ sub, score, setScore, feedback, setFeedback, onSave, onClose }) {
  return (
    <Sheet onClose={onClose} title="Edit Grade"
      subtitle={`${sub.student_name} — ${sub.assignment_title}`}
      footer={
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={btn.ghost} onClick={onClose}>Cancel</button>
          <button style={btn.primary} onClick={onSave}>💾 Update Grade</button>
        </div>
      }
    >
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "14px", padding: "14px 18px", marginBottom: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
        <span>✏️</span>
        <p style={{ fontSize: "13px", color: "#92400e", fontWeight: "600", margin: 0 }}>
          Current grade: <strong>{sub.final_score}/{sub.max_score}</strong> ({Math.round((sub.final_score / sub.max_score) * 100)}%). You are overriding this.
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={label}>New Score (out of {sub.max_score})</label>
        <div style={{ marginBottom: "12px" }}>
          <ScoreBar value={parseInt(score) || 0} max={sub.max_score} />
        </div>
        <input style={{ ...inp, width: "150px" }} type="number" min="0" max={sub.max_score}
          value={score} onChange={e => setScore(e.target.value)} />
      </div>

      <div>
        <label style={label}>Updated Feedback</label>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4}
          style={{ ...inp, resize: "vertical", lineHeight: "1.65" }} />
      </div>
    </Sheet>
  );
}// GradeModals - Modal dialogs for grading essays
