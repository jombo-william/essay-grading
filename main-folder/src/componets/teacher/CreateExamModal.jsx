// src/componets/teacher/CreateExamModal.jsx
import { useState } from "react";
import { Sheet, btn, inp, label as labelStyle } from "./shared.jsx";
import ExamQuestions from "./ExamQuestions.jsx";
import { apiFetch } from "./api.js";

const EMPTY_FORM = {
  title:        "",
  description:  "",
  instructions: "",
  due_date:     "",
  time_limit:   60,   // minutes
};

export default function CreateExamModal({ selectedClass, onClose, onSaved, showToast, examToEdit = null }) {
  const isEditing = !!examToEdit;

  const [form,      setForm]      = useState(isEditing ? {
    title:        examToEdit.title        || "",
    description:  examToEdit.description  || "",
    instructions: examToEdit.instructions || "",
    due_date:     examToEdit.due_date     || "",
    time_limit:   examToEdit.time_limit   ?? 60,
  } : EMPTY_FORM);

  const [questions, setQuestions] = useState(isEditing ? (examToEdit.questions || []) : []);
  const [saving,    setSaving]    = useState(false);
  const [step,      setStep]      = useState(1);   // 1 = details, 2 = questions

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateDetails = () => {
    if (!form.title.trim())        { showToast("Please enter an exam title.", "error");        return false; }
    if (!form.due_date)            { showToast("Please set a due date.",      "error");        return false; }
    if (!form.instructions.trim()) { showToast("Please add exam instructions.", "error");      return false; }
    return true;
  };

  const validateQuestions = () => {
    if (questions.length === 0) { showToast("Add at least one question.", "error"); return false; }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt?.trim()) {
        showToast(`Question ${i + 1} has no prompt.`, "error"); return false;
      }
      if (q.type === "mcq") {
        const opts = q.options || [];
        if (opts.some(o => !o.trim())) {
          showToast(`Question ${i + 1}: fill in all 4 options.`, "error"); return false;
        }
        if (!q.correct_option) {
          showToast(`Question ${i + 1}: select the correct answer.`, "error"); return false;
        }
      }
      if (q.type === "structured" && !q.marking_guide?.trim()) {
        showToast(`Question ${i + 1}: add a marking guide for AI grading.`, "error"); return false;
      }
    }
    return true;
  };

  const goToQuestions = () => { if (validateDetails()) setStep(2); };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validateQuestions()) return;
    setSaving(true);
    try {
      const payload = {
        class_id:     selectedClass.id,
        title:        form.title.trim(),
        description:  form.description.trim(),
        instructions: form.instructions.trim(),
        due_date:     form.due_date,
        time_limit:   form.time_limit,
        questions,
        ...(isEditing ? { id: examToEdit.id } : {}),
      };

      await apiFetch(isEditing ? "/exams/update" : "/exams/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showToast(isEditing ? "✅ Exam updated." : "✅ Exam published.");
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to save exam.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Sheet
      wide
      onClose={onClose}
      title={isEditing ? "Edit Exam" : "Create New Exam"}
      subtitle={selectedClass.name + (selectedClass.section ? ` · ${selectedClass.section}` : "")}
      footer={
        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
          {step === 2 && (
            <button style={btn.ghost} onClick={() => setStep(1)}>← Back</button>
          )}
          <button style={btn.ghost} onClick={onClose}>Cancel</button>
          {step === 1
            ? <button style={{ ...btn.primary, marginLeft: "auto" }} onClick={goToQuestions}>
                Next: Add Questions →
              </button>
            : <button style={{ ...btn.primary, marginLeft: "auto" }} onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : isEditing ? "💾 Save Changes" : "✅ Publish Exam"}
              </button>
          }
        </div>
      }
    >
      {/* ── Step indicator ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {["Exam Details", "Questions"].map((s, i) => {
          const active  = step === i + 1;
          const done    = step > i + 1;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "800",
                background: active ? "#3b82f6" : done ? "#16a34a" : "#e2e8f0",
                color: active || done ? "#fff" : "#94a3b8",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: "12px", fontWeight: "700",
                color: active ? "#1e293b" : "#94a3b8",
              }}>
                {s}
              </span>
              {i < 1 && <span style={{ color: "#e2e8f0", fontSize: "16px" }}>›</span>}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Exam details ─────────────────────────────────────────── */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          <div>
            <label style={labelStyle}>Exam Title *</label>
            <input
              style={inp} value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="e.g. Mid-Term Comprehension Exam"
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <input
              style={inp} value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Brief overview of the exam (optional)"
            />
          </div>

          <div>
            <label style={labelStyle}>Instructions *</label>
            <textarea
              style={{ ...inp, resize: "vertical", lineHeight: "1.65" }}
              rows={4} value={form.instructions}
              onChange={e => set("instructions", e.target.value)}
              placeholder="e.g. Answer all questions. For MCQ, select one answer only..."
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Due Date & Time *</label>
              <input
                style={inp} type="datetime-local"
                value={form.due_date}
                onChange={e => set("due_date", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Time Limit (minutes)</label>
              <input
                style={inp} type="number" min="5" max="300"
                value={form.time_limit}
                onChange={e => set("time_limit", Number(e.target.value))}
                placeholder="60"
              />
            </div>
          </div>

        </div>
      )}

      {/* ── Step 2: Questions ────────────────────────────────────────────── */}
      {step === 2 && (
        <ExamQuestions questions={questions} setQuestions={setQuestions} />
      )}
    </Sheet>
  );
}