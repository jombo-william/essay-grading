// src/componets/teacher/ExamQuestions.jsx
// Question builder — handles both MCQ and Structured question types.
// Pure UI: receives `questions` array and `setQuestions` setter from parent.

const OPTIONS = ["A", "B", "C", "D"];

function MCQQuestion({ q, idx, onChange, onRemove }) {
  const set = (field, value) => onChange(idx, { ...q, [field]: value });
  const setOption = (optIdx, value) => {
    const options = [...(q.options || ["", "", "", ""])];
    options[optIdx] = value;
    onChange(idx, { ...q, options });
  };

  return (
    <div style={styles.qCard}>
      <div style={styles.qHeader}>
        <span style={styles.qNum}>Q{idx + 1} · Multiple Choice</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={styles.marksLabel}>Marks</label>
          <input
            type="number" min="1" max="100"
            value={q.marks ?? 1}
            onChange={e => set("marks", Number(e.target.value))}
            style={{ ...styles.marksInput }}
          />
          <button onClick={() => onRemove(idx)} style={styles.removeBtn}>✕</button>
        </div>
      </div>

      {/* Question prompt */}
      <textarea
        value={q.prompt || ""}
        onChange={e => set("prompt", e.target.value)}
        placeholder="Enter the question..."
        rows={2}
        style={styles.textarea}
      />

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
        {OPTIONS.map((letter, oi) => (
          <div key={letter} style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: q.correct_option === letter ? "#f0fdf4" : "#f8fafc",
            border: `1.5px solid ${q.correct_option === letter ? "#86efac" : "#e2e8f0"}`,
            borderRadius: "10px", padding: "8px 10px",
          }}>
            <button
              onClick={() => set("correct_option", letter)}
              title="Mark as correct"
              style={{
                width: "22px", height: "22px", borderRadius: "50%", border: "none",
                flexShrink: 0, cursor: "pointer", fontSize: "11px", fontWeight: "800",
                background: q.correct_option === letter ? "#16a34a" : "#e2e8f0",
                color: q.correct_option === letter ? "#fff" : "#64748b",
              }}
            >
              {letter}
            </button>
            <input
              value={(q.options || ["", "", "", ""])[oi] || ""}
              onChange={e => setOption(oi, e.target.value)}
              placeholder={`Option ${letter}`}
              style={styles.optionInput}
            />
          </div>
        ))}
      </div>
      <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0" }}>
        Click the letter button to mark the correct answer.
      </p>
    </div>
  );
}

function StructuredQuestion({ q, idx, onChange, onRemove }) {
  const set = (field, value) => onChange(idx, { ...q, [field]: value });

  return (
    <div style={styles.qCard}>
      <div style={styles.qHeader}>
        <span style={styles.qNum}>Q{idx + 1} · Structured</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={styles.marksLabel}>Marks</label>
          <input
            type="number" min="1" max="100"
            value={q.marks ?? 5}
            onChange={e => set("marks", Number(e.target.value))}
            style={styles.marksInput}
          />
          <button onClick={() => onRemove(idx)} style={styles.removeBtn}>✕</button>
        </div>
      </div>

      {/* Question prompt */}
      <textarea
        value={q.prompt || ""}
        onChange={e => set("prompt", e.target.value)}
        placeholder="Enter the question or instruction..."
        rows={3}
        style={styles.textarea}
      />

      {/* Marking guide (for AI grading) */}
      <label style={{ ...styles.marksLabel, display: "block", marginTop: "10px", marginBottom: "6px" }}>
        Marking Guide <span style={{ fontWeight: "500", textTransform: "none", color: "#94a3b8" }}>(used by AI to grade this question)</span>
      </label>
      <textarea
        value={q.marking_guide || ""}
        onChange={e => set("marking_guide", e.target.value)}
        placeholder="Describe what a good answer should include, key points, expected depth..."
        rows={3}
        style={{ ...styles.textarea, background: "#fffbeb", borderColor: "#fde68a" }}
      />
    </div>
  );
}

export default function ExamQuestions({ questions, setQuestions }) {
  const addMCQ = () => setQuestions(prev => [
    ...prev,
    { type: "mcq", prompt: "", options: ["", "", "", ""], correct_option: null, marks: 1 },
  ]);

  const addStructured = () => setQuestions(prev => [
    ...prev,
    { type: "structured", prompt: "", marking_guide: "", marks: 5 },
  ]);

  const updateQuestion = (idx, updated) =>
    setQuestions(prev => prev.map((q, i) => i === idx ? updated : q));

  const removeQuestion = idx =>
    setQuestions(prev => prev.filter((_, i) => i !== idx));

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  const mcqCount   = questions.filter(q => q.type === "mcq").length;
  const strCount   = questions.filter(q => q.type === "structured").length;

  return (
    <div>
      {/* Summary bar */}
      {questions.length > 0 && (
        <div style={{
          display: "flex", gap: "14px", flexWrap: "wrap",
          background: "#f8fafc", border: "1px solid #e2e8f0",
          borderRadius: "12px", padding: "10px 16px",
          marginBottom: "16px",
        }}>
          <span style={styles.pill}>🔵 {mcqCount} MCQ</span>
          <span style={styles.pill}>📝 {strCount} Structured</span>
          <span style={{ ...styles.pill, background: "#eff6ff", color: "#2563eb" }}>
            Total: {totalMarks} marks
          </span>
        </div>
      )}

      {/* Question list */}
      {questions.length === 0 && (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          background: "#f8fafc", borderRadius: "16px",
          border: "2px dashed #e2e8f0", marginBottom: "16px",
        }}>
          <p style={{ fontSize: "32px", margin: "0 0 8px" }}>📋</p>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
            No questions yet. Add MCQ or structured questions below.
          </p>
        </div>
      )}

      {questions.map((q, idx) =>
        q.type === "mcq"
          ? <MCQQuestion key={idx} q={q} idx={idx} onChange={updateQuestion} onRemove={removeQuestion} />
          : <StructuredQuestion key={idx} q={q} idx={idx} onChange={updateQuestion} onRemove={removeQuestion} />
      )}

      {/* Add buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={addMCQ} style={styles.addBtn("#eff6ff", "#2563eb", "#bfdbfe")}>
          + Add MCQ Question
        </button>
        <button onClick={addStructured} style={styles.addBtn("#fdf4ff", "#9333ea", "#e9d5ff")}>
          + Add Structured Question
        </button>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  qCard: {
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "14px",
    padding: "16px 18px",
    marginBottom: "12px",
  },
  qHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "10px",
  },
  qNum: {
    fontSize: "12px", fontWeight: "800", color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  marksLabel: {
    fontSize: "11px", fontWeight: "700", color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  marksInput: {
    width: "60px", padding: "6px 10px", borderRadius: "8px",
    border: "1.5px solid #e2e8f0", fontSize: "13px", fontWeight: "700",
    color: "#1e293b", textAlign: "center", outline: "none",
    fontFamily: "inherit",
  },
  removeBtn: {
    width: "28px", height: "28px", borderRadius: "8px",
    border: "none", background: "#fef2f2",
    color: "#dc2626", fontSize: "14px", fontWeight: "700",
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  textarea: {
    width: "100%", padding: "10px 12px", boxSizing: "border-box",
    border: "1.5px solid #e2e8f0", borderRadius: "10px",
    fontSize: "13px", color: "#1e293b", lineHeight: "1.6",
    fontFamily: "inherit", outline: "none", resize: "vertical",
    background: "#f8fafc",
  },
  optionInput: {
    flex: 1, border: "none", background: "transparent",
    fontSize: "13px", color: "#1e293b", outline: "none",
    fontFamily: "inherit",
  },
  pill: {
    fontSize: "12px", fontWeight: "700", color: "#64748b",
    background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px",
  },
  addBtn: (bg, color, border) => ({
    flex: 1, padding: "11px 0", borderRadius: "12px",
    border: `1.5px solid ${border}`,
    background: bg, color: color,
    fontSize: "13px", fontWeight: "700",
    cursor: "pointer", fontFamily: "inherit",
  }),
};