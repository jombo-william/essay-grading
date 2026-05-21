
// src/componets/teacher/SubmissionDetail.jsx
import { Sheet, ScoreBar, btn, label, colors } from "./shared.jsx";

// src/components/teacher/SubmissionDetail.jsx
// No external CSS — all styles inline. Uses Tabler Icons via shared.jsx Icon component.

import { Icon, Sheet, ScoreBar } from "./shared.jsx";
import ChatPanel from "../ChatPanel.jsx";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  blue:  { bg: "#E6F1FB", border: "#B5D4F4", text: "#185FA5" },
  green: { bg: "#EAF3DE", border: "#C0DD97", text: "#3B6D11", dark: "#27500A" },
  red:   { bg: "#FCEBEB", border: "#F7C1C1", text: "#A32D2D" },
  gray:  { bg: "#F1EFE8", border: "#D3D1C7", text: "#5F5E5A" },
};

const labelStyle = {
  fontSize: 10, fontWeight: 700, color: "#8884A8",
  textTransform: "uppercase", letterSpacing: "0.07em",
  margin: "0 0 6px", display: "block",
};

export default function SubmissionDetail({ sub, user, onClose, onGrade, onEditGrade }) {

  const aiPct   = sub.ai_detection_score ?? 0;
  const flagged = aiPct >= 50;


  return (
    <Sheet
      onClose={onClose}
      title={sub.student_name}
      subtitle={sub.assignment_title}
      footer={
        <>
          {sub.status === "ai_graded" && (
            <button
              onClick={() => { onClose(); onGrade(sub); }}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 18px", borderRadius: 9, border: "none", background: "#1A1830", color: "#fff", fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
            >
              <Icon name="pencil" size={14} style={{ color: "#EEEDFE" }} />
              Grade this essay
            </button>
          )}
          {sub.status === "graded" && (
            <button
              onClick={() => { onClose(); onEditGrade(sub); }}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 18px", borderRadius: 9, border: `1px solid ${C.blue.border}`, background: C.blue.bg, color: C.blue.text, fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
            >
              <Icon name="refresh" size={14} style={{ color: C.blue.text }} />
              Edit grade
            </button>
          )}
          <button
            onClick={onClose}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 18px", borderRadius: 9, border: `1px solid ${C.gray.border}`, background: C.gray.bg, color: C.gray.text, fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
          >
            <Icon name="x" size={14} style={{ color: C.gray.text }} />
            Close
          </button>
        </>
      }
    >
      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          {
            icon: "calendar",
            label: "Submitted",
            value: new Date(sub.submitted_at).toLocaleString(),
          },
          {
            icon: sub.file_name ? "paperclip" : "writing",
            label: "Submit mode",
            value: sub.file_name ? sub.file_name : "Written in app",
          },
          {
            icon: "chart-bar",
            label: "AI score",
            value: sub.ai_score !== null ? `${sub.ai_score}/${sub.max_score}` : "—",
          },
          {
            icon: flagged ? "alert-triangle" : "shield-check",
            label: "AI detection",
            value: sub.ai_detection_score !== null ? `${sub.ai_detection_score}%` : "—",
            color: flagged ? C.red.text : aiPct >= 30 ? "#854F0B" : C.green.text,
          },
        ].map(d => (
          <div key={d.label} style={{ background: "#F8F7FF", border: "1px solid #ECECF2", borderRadius: 11, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
              <Icon name={d.icon} size={12} style={{ color: d.color || "#B0AECB" }} />
              <span style={labelStyle}>{d.label}</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: d.color || "#1A1830", margin: 0 }}>{d.value}</p>
          </div>
        ))}
      </div>

      {/* Final grade */}
      {sub.final_score !== null && (
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 11, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Icon name="circle-check" size={13} style={{ color: C.green.text }} />
            <span style={{ ...labelStyle, marginBottom: 0, color: C.green.text }}>Final grade</span>
          </div>
          <ScoreBar value={sub.final_score} max={sub.max_score} />
        </div>
      )}

      {/* AI flag warning */}
      {flagged && (
        <div style={{ background: C.red.bg, border: `1px solid ${C.red.border}`, borderRadius: 11, padding: "13px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="alert-triangle" size={15} style={{ color: C.red.text, flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: C.red.text, margin: 0, lineHeight: 1.5 }}>
            {aiPct}% AI content detected. Score auto-set to 0. Your review determines the final outcome.
          </p>
        </div>
      )}

      {/* AI feedback */}
      {sub.ai_feedback && (
        <div style={{ background: C.blue.bg, border: `1px solid ${C.blue.border}`, borderRadius: 11, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Icon name="robot" size={13} style={{ color: C.blue.text }} />
            <span style={{ ...labelStyle, marginBottom: 0, color: C.blue.text }}>AI feedback</span>
          </div>
          <p style={{ fontSize: 13, color: "#1A1830", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
            {sub.ai_feedback}
          </p>
        </div>
      )}

      {/* Teacher feedback */}
      {sub.teacher_feedback && (
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 11, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Icon name="school" size={13} style={{ color: C.green.text }} />
            <span style={{ ...labelStyle, marginBottom: 0, color: C.green.text }}>Your feedback</span>
          </div>
          <p style={{ fontSize: 13, color: "#1A1830", lineHeight: 1.8, margin: 0 }}>
            {sub.teacher_feedback}
          </p>
        </div>
      )}

      {/* Essay text */}
      <div style={{ background: "#FDFCF7", border: `1px solid ${C.gray.border}`, borderRadius: 11, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <Icon name="file-text" size={13} style={{ color: "#B0AECB" }} />
          <span style={labelStyle}>Essay text</span>
        </div>
        <p style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }}>
          {sub.essay_text}
        </p>
      </div>
    </Sheet>
  );
}