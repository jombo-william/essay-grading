



// src/componets/teacher/SubmissionDetail.jsx
import { Sheet, ScoreBar, btn, label, colors } from "./shared.jsx";
import ChatPanel from "../ChatPanel.jsx";

export default function SubmissionDetail({ sub, user, onClose, onGrade, onEditGrade }) {
  return (
    <Sheet onClose={onClose} title={sub.student_name} subtitle={sub.assignment_title}
      footer={
        <div style={{ display: "flex", gap: "12px" }}>
          {sub.status === "ai_graded" && (
            <button style={btn.primary} onClick={() => { onClose(); onGrade(sub); }}>Grade This Essay →</button>
          )}
          {sub.status === "graded" && (
            <button onClick={() => { onClose(); onEditGrade(sub); }}
              style={{ ...btn.ghost, color: "#3b82f6", borderColor: "#bfdbfe", background: "#eff6ff" }}>
              ✏️ Edit Grade
            </button>
          )}
          <button style={btn.ghost} onClick={onClose}>Close</button>
        </div>
      }
    >
      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Submitted",    value: new Date(sub.submitted_at).toLocaleString() },
          { label: "Submit Mode",  value: sub.file_name ? `📎 ${sub.file_name}` : "✏️ Written in app" },
          { label: "AI Score",     value: sub.ai_score !== null ? `${sub.ai_score}/${sub.max_score}` : "—" },
          { label: "AI Detection", value: sub.ai_detection_score !== null ? `${sub.ai_detection_score}%${sub.ai_detection_score >= 50 ? " 🚨" : ""}` : "—" },
        ].map(d => (
          <div key={d.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 16px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{d.label}</p>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", margin: 0 }}>{d.value}</p>
          </div>
        ))}
      </div>

      {/* Final score */}
      {sub.final_score !== null && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>✅ Final Grade</p>
          <ScoreBar value={sub.final_score} max={sub.max_score} />
        </div>
      )}

      {/* AI flag */}
      {sub.ai_detection_score >= 50 && (
        <div style={{ background: colors.red.bg, border: `1px solid ${colors.red.border}`, borderRadius: "14px", padding: "14px 18px", marginBottom: "20px", display: "flex", gap: "10px" }}>
          <span>🚨</span>
          <p style={{ fontSize: "13px", fontWeight: "700", color: colors.red.text, margin: 0 }}>
            {sub.ai_detection_score}% AI content detected. Score auto-set to 0. Your review determines the final outcome.
          </p>
        </div>
      )}

      {/* AI feedback */}
      {sub.ai_feedback && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>🤖 AI Feedback</p>
          <p style={{ fontSize: "13px", color: "#1e293b", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap" }}>{sub.ai_feedback}</p>
        </div>
      )}

      {/* Teacher feedback */}
      {sub.teacher_feedback && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>👨‍🏫 Your Feedback</p>
          <p style={{ fontSize: "13px", color: "#1e293b", lineHeight: "1.8", margin: 0 }}>{sub.teacher_feedback}</p>
        </div>
      )}

      {/* Essay text */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>Essay Text</p>
        <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.9", margin: 0, whiteSpace: "pre-wrap" }}>{sub.essay_text}</p>
      </div>

      <ChatPanel submissionId={sub.id ?? sub.submission_id} user={user} />
    </Sheet>
  );
}