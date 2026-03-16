


// src/componets/teacher/AssignmentForm.jsx
import { useRef } from "react";
import { inp, label } from "./shared.jsx";

const FILE_TYPES = [
  { label: "📄 PDF / Word", accept: ".pdf,.doc,.docx", bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  { label: "🖼️ Image",      accept: "image/*",          bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff" },
  { label: "🎬 Video",      accept: "video/*",          bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  { label: "📎 Any File",   accept: "*",                bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
];

export default function AssignmentForm({ form, setForm, attachments, setAttachments, onAttachFile }) {
  const fileRef = useRef();
  const rubricTotal = Object.values(form.rubric || {}).reduce((a, b) => a + b, 0);

  const triggerUpload = (accept) => {
    fileRef.current.accept = accept;
    fileRef.current.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={onAttachFile} />

      {/* Title */}
      <div>
        <label style={label}>Title *</label>
        <input style={inp} value={form.title || ""} placeholder="e.g. Climate Change & Society"
          onChange={e => setForm({ ...form, title: e.target.value })} />
      </div>

      {/* Description */}
      <div>
        <label style={label}>Description</label>
        <input style={inp} value={form.description || ""} placeholder="Brief overview shown to students..."
          onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>

      {/* Instructions */}
      <div>
        <label style={label}>Essay Instructions *</label>
        <textarea style={{ ...inp, resize: "vertical", lineHeight: "1.65", minHeight: "90px" }}
          rows={3} placeholder="Detailed instructions for students..."
          value={form.instructions || ""}
          onChange={e => setForm({ ...form, instructions: e.target.value })} />
      </div>

      {/* Reference material */}
      <div>
        <label style={label}>Reference Material (for AI grading)</label>
        <textarea style={{ ...inp, resize: "vertical", lineHeight: "1.65", minHeight: "90px" }}
          rows={3} placeholder="Key facts, model answers, or study notes the AI uses when grading..."
          value={form.referenceMaterial || ""}
          onChange={e => setForm({ ...form, referenceMaterial: e.target.value })} />
        <p style={{ fontSize: "12px", color: "#8b5cf6", marginTop: "6px", fontWeight: "500" }}>
          🤖 The AI uses this to assess accuracy and relevance of student essays.
        </p>
      </div>

      {/* Max score + due date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={label}>Max Score *</label>
          <input style={inp} type="number" min="1" value={form.max_score || 100}
            onChange={e => setForm({ ...form, max_score: parseInt(e.target.value) || 100 })} />
        </div>
        <div>
          <label style={label}>Due Date *</label>
          <input style={inp} type="datetime-local" value={form.due_date || ""}
            onChange={e => setForm({ ...form, due_date: e.target.value })} />
        </div>
      </div>

      {/* Rubric */}
      <div>
        <label style={label}>Grading Rubric</label>
        <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "18px", border: "1px solid #e2e8f0" }}>
          {Object.entries(form.rubric || {}).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600", textTransform: "capitalize", width: "100px", flexShrink: 0 }}>{k}</span>
              <input type="number" min="0" max="100" value={v}
                onChange={e => setForm({ ...form, rubric: { ...form.rubric, [k]: parseInt(e.target.value) || 0 } })}
                style={{ width: "64px", padding: "7px 10px", border: "1.5px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", fontWeight: "700", outline: "none", textAlign: "center", fontFamily: "inherit" }} />
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>%</span>
              <div style={{ flex: 1, height: "7px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "7px", background: "linear-gradient(90deg,#3b82f6,#38bdf8)", borderRadius: "4px", width: `${v}%`, transition: "width 0.2s" }} />
              </div>
            </div>
          ))}
          <p style={{ fontSize: "12px", fontWeight: "700", margin: "4px 0 0", color: rubricTotal !== 100 ? "#dc2626" : "#16a34a" }}>
            Total: {rubricTotal}% {rubricTotal !== 100 && "⚠️ Must equal 100"}
          </p>
        </div>
      </div>

      {/* File attachments */}
      <div>
        <label style={label}>Attach Files for Students</label>
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 12px" }}>
          Attach reading materials, PDFs, images, videos — any file type.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {FILE_TYPES.map(ft => (
            <button key={ft.label} type="button" onClick={() => triggerUpload(ft.accept)}
              style={{ padding: "8px 16px", borderRadius: "10px", border: `1px solid ${ft.border}`, background: ft.bg, color: ft.color, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
              {ft.label}
            </button>
          ))}
        </div>
        {attachments.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {attachments.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "6px 12px" }}>
                <span style={{ fontSize: "14px" }}>{f.icon}</span>
                <span style={{ fontSize: "12px", color: "#4f46e5", fontWeight: "600", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>{(f.size / 1024).toFixed(0)}KB</span>
                <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px", fontWeight: "700", padding: 0, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}