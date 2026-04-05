


// src/componets/teacher/AssignmentsTab.jsx
import { useState } from "react";
import { Badge, Sheet, btn, colors } from "./shared.jsx";
import AssignmentForm from "./AssignmentForm.jsx";
import { apiFetch } from "./api.js";

const EMPTY_FORM = {
  title: "", description: "", instructions: "",
  referenceMaterial: "", max_score: 100, due_date: "",
  rubric: { content: 35, structure: 25, grammar: 20, evidence: 20 },
};

export default function AssignmentsTab({ assignments, submissions, loading, onCreated, onUpdated, showToast }) {
  const [createOpen, setCreateOpen]   = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [attachments, setAttachments] = useState([]);
  const [saving, setSaving]           = useState(false);

  const handleAttachFile = e => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files.map(f => ({
      name: f.name, size: f.size, type: f.type,
      url: URL.createObjectURL(f),
      icon: f.type.startsWith("image/") ? "🖼️" : f.type.startsWith("video/") ? "🎬" : f.type === "application/pdf" ? "📄" : f.type.includes("word") ? "📝" : "📎",
    }))]);
    e.target.value = "";
  };

  const openCreate = () => { setForm(EMPTY_FORM); setAttachments([]); setCreateOpen(true); };
  const openEdit   = a  => { setForm({ ...a, referenceMaterial: a.reference_material || "" }); setAttachments(a.attachments || []); setEditTarget(a); };

  const handleCreate = async () => {
    if (!form.title || !form.instructions || !form.due_date) { showToast("Please fill in Title, Instructions, and Due Date.", "error"); return; }
    if (Object.values(form.rubric).reduce((a, b) => a + b, 0) !== 100) { showToast("Rubric weights must total 100%.", "error"); return; }
    setSaving(true);
    try {
      const data = await apiFetch("/create_assignment.php", {
        method: "POST",
        body: JSON.stringify({
          title:              form.title,
          description:        form.description,
          instructions:       form.instructions,
          reference_material: form.referenceMaterial,
          max_score:          form.max_score,
          due_date:           form.due_date,
          rubric:             form.rubric,
        }),
      });
      setCreateOpen(false);
      showToast("✅ Assignment created. You can now edit it to upload reference files.");
      onCreated(data.id);
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleEditSave = async () => {
    if (!form.title || !form.instructions || !form.due_date) { showToast("Please fill in Title, Instructions, and Due Date.", "error"); return; }
    if (Object.values(form.rubric || {}).reduce((a, b) => a + b, 0) !== 100) { showToast("Rubric weights must total 100%.", "error"); return; }
    setSaving(true);
    try {
      await apiFetch("/update_assignment.php", {
        method: "POST",
        body: JSON.stringify({
          id:                 editTarget.id,
          title:              form.title,
          description:        form.description,
          instructions:       form.instructions,
          reference_material: form.referenceMaterial,
          max_score:          form.max_score,
          due_date:           form.due_date,
          rubric:             form.rubric,
        }),
      });
      setEditTarget(null);
      showToast("✅ Assignment updated.");
      onUpdated();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <div style={{ width: "36px", height: "36px", border: "4px solid #bfdbfe", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Assignments</p>
        <button style={btn.primary} onClick={openCreate}>+ New Assignment</button>
      </div>

      {assignments.length === 0 && (
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "center", padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: "48px", margin: "0 0 14px" }}>📋</p>
          <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: "0 0 6px" }}>No assignments yet</p>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Create your first assignment to get started.</p>
        </div>
      )}

      {assignments.map(a => {
        const subCount    = submissions.filter(s => s.assignment_id === a.id).length;
        const gradedCount = submissions.filter(s => s.assignment_id === a.id && s.final_score !== null).length;
        const isPast      = new Date() > new Date(a.due_date);
        const hasRef      = a.reference_material && a.reference_material.trim().length > 0;
        return (
          <div key={a.id} style={{
            background: "#fff", borderRadius: "18px",
            border: "1px solid #e2e8f0",
            borderLeft: `5px solid ${isPast ? "#cbd5e1" : "#3b82f6"}`,
            padding: "20px 22px", marginBottom: "14px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>{a.title}</span>
                  <Badge color="blue">{a.max_score} pts</Badge>
                  {isPast ? <Badge color="gray">Closed</Badge> : <Badge color="green">Active</Badge>}
                  {hasRef && <Badge color="purple">🤖 AI Reference Set</Badge>}
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 10px", lineHeight: "1.6" }}>{a.description}</p>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    📅 Due {a.due_date ? new Date(a.due_date.replace(" ", "T")).toLocaleDateString("en-GB", { timeZone: "Africa/Blantyre", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "No date"}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    📝 {subCount} submitted · ✅ {gradedCount} graded
                  </span>
                </div>
              </div>
              <button style={btn.small} onClick={() => openEdit(a)}>✏️ Edit</button>
            </div>
          </div>
        );
      })}

      {/* Create Modal */}
      {createOpen && (
        <Sheet onClose={() => setCreateOpen(false)} title="Create New Assignment"
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={btn.ghost} onClick={() => setCreateOpen(false)}>Cancel</button>
              <button style={btn.primary} onClick={handleCreate} disabled={saving}>{saving ? "Publishing…" : "✅ Publish Assignment"}</button>
            </div>
          }>
          {/* assignmentId is null for new assignments */}
          <AssignmentForm
            form={form}
            setForm={setForm}
            attachments={attachments}
            setAttachments={setAttachments}
            onAttachFile={handleAttachFile}
            assignmentId={null}
          />
        </Sheet>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Sheet onClose={() => setEditTarget(null)} title="Edit Assignment"
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={btn.ghost} onClick={() => setEditTarget(null)}>Cancel</button>
              <button style={btn.primary} onClick={handleEditSave} disabled={saving}>{saving ? "Saving…" : "💾 Save Changes"}</button>
            </div>
          }>
          {/* Pass assignmentId so file uploads go to the right endpoint */}
          <AssignmentForm
            form={form}
            setForm={setForm}
            attachments={attachments}
            setAttachments={setAttachments}
            onAttachFile={handleAttachFile}
            assignmentId={editTarget.id}
          />
        </Sheet>
      )}
    </div>
  );
}