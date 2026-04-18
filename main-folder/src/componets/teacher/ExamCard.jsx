// src/componets/teacher/ExamCard.jsx
import { Badge, btn } from "./shared.jsx";

export default function ExamCard({ exam, onEdit }) {
  const isPast    = new Date() > new Date(exam.due_date);
  const mcqCount  = (exam.questions || []).filter(q => q.type === "mcq").length;
  const strCount  = (exam.questions || []).filter(q => q.type === "structured").length;
  const totalMark = (exam.questions || []).reduce((sum, q) => sum + (q.marks || 0), 0);

  const fmtDate = raw => {
    if (!raw) return "No date";
    return new Date(raw.replace(" ", "T")).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: "18px",
      border: "1px solid #e2e8f0",
      borderLeft: `5px solid ${isPast ? "#cbd5e1" : "#8b5cf6"}`,
      padding: "20px 22px",
      marginBottom: "14px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
        <div style={{ flex: 1 }}>

          {/* Title + badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
            <span style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>
              {exam.title}
            </span>
            <Badge color="purple">{totalMark} pts</Badge>
            {isPast
              ? <Badge color="gray">Closed</Badge>
              : <Badge color="green">Active</Badge>
            }
          </div>

          {/* Description */}
          {exam.description && (
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 10px", lineHeight: "1.6" }}>
              {exam.description}
            </p>
          )}

          {/* Meta row */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              📅 Due {fmtDate(exam.due_date)}
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              🔵 {mcqCount} MCQ · 📝 {strCount} Structured
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              📊 {exam.submission_count ?? 0} submitted
            </span>
          </div>
        </div>

        <button style={btn.small} onClick={() => onEdit(exam)}>✏️ Edit</button>
      </div>
    </div>
  );
}