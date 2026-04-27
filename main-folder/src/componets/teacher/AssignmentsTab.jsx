
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

// ── Confirmation modal ────────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmLabel, confirmColor = "#ef4444", onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "32px 28px",
        maxWidth: "420px", width: "90%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <p style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: "0 0 10px" }}>
          {title}
        </p>
        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: "0 0 28px" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{
            padding: "9px 20px", borderRadius: "10px",
            border: "1px solid #e2e8f0", background: "#f8fafc",
            color: "#64748b", fontSize: "13px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            padding: "9px 20px", borderRadius: "10px",
            border: "none", background: confirmColor,
            color: "#fff", fontSize: "13px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

//export default function AssignmentsTab({ assignments, submissions, loading, onCreated, onUpdated, showToast, selectedClassId, selectedClass }) {
  export default function AssignmentsTab({ assignments, submissions, loading, onCreated, onUpdated, showToast, selectedClassId, selectedClass, archivedOnly = false }) {
   const classId = selectedClassId ?? selectedClass?.id;
  const [createOpen, setCreateOpen]   = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [attachments, setAttachments] = useState([]);
  const [saving, setSaving]           = useState(false);

  // ── Delete / archive state ────────────────────────────────────────────────
  const [deleteTarget,  setDeleteTarget]  = useState(null);   // assignment to delete
  const [archiveTarget, setArchiveTarget] = useState(null);   // assignment to archive/restore
  const [actionLoading, setActionLoading] = useState(false);
  const [showArchived,  setShowArchived]  = useState(false);

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

  // ── Delete handler ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const data = await apiFetch("/assignments/delete", {
        method: "POST",
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      setDeleteTarget(null);
      showToast(data.message || "✅ Assignment deleted.");
      onUpdated();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Archive/restore handler ───────────────────────────────────────────────
  const handleArchive = async () => {
    if (!archiveTarget) return;
    setActionLoading(true);
    try {
      const data = await apiFetch("/assignments/archive", {
        method: "POST",
        body: JSON.stringify({ id: archiveTarget.id }),
      });
      setArchiveTarget(null);
      showToast(data.message || "✅ Done.");
      onUpdated();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Create / Edit handlers (unchanged) ───────────────────────────────────
  const handleCreate = async () => {
    if (!form.title || !form.instructions || !form.due_date) {
      showToast("Please fill in Title, Instructions, and Due Date.", "error"); return;
    }
    if (Object.values(form.rubric).reduce((a, b) => a + b, 0) !== 100) {
      showToast("Rubric weights must total 100%.", "error"); return;
    }
    if (!classId) {
      showToast("No class selected. Please select a class first.", "error"); return;
    }
    setSaving(true);
    try {
      const data = await apiFetch("/assignments/create", {
        method: "POST",
        body: JSON.stringify({
          class_id:           classId,
          title:              form.title,
          description:        form.description       || "",
          instructions:       form.instructions,
          reference_material: form.referenceMaterial || "",
          max_score:          form.max_score         || 100,
          due_date:           form.due_date,
          rubric:             form.rubric,
        }),
      });
      setCreateOpen(false);
      showToast("✅ Assignment created.");
      onCreated(data.id);
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleEditSave = async () => {
    if (!form.title || !form.instructions || !form.due_date) {
      showToast("Please fill in Title, Instructions, and Due Date.", "error"); return;
    }
    if (Object.values(form.rubric || {}).reduce((a, b) => a + b, 0) !== 100) {
      showToast("Rubric weights must total 100%.", "error"); return;
    }
    setSaving(true);
    try {
      await apiFetch("/assignments/update", {
        method: "POST",
        body: JSON.stringify({
          id:                 editTarget.id,
          title:              form.title,
          description:        form.description       || "",
          instructions:       form.instructions,
          reference_material: form.referenceMaterial || "",
          max_score:          form.max_score         || 100,
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

  // Split active vs archived
  const activeAssignments   = assignments.filter(a => a.is_active !== false);
  const archivedAssignments = assignments.filter(a => a.is_active === false);

  const renderAssignment = (a) => {
    const subCount    = submissions.filter(s => s.assignment_id === a.id).length;
    const gradedCount = submissions.filter(s => s.assignment_id === a.id && s.final_score !== null).length;
    const isPast      = new Date() > new Date(a.due_date);
    const hasRef      = a.reference_material && a.reference_material.trim().length > 0;
    const isArchived  = a.is_active === false;

    return (
      <div key={a.id} style={{
        background: isArchived ? "#f8fafc" : "#fff",
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
        borderLeft: `5px solid ${isArchived ? "#94a3b8" : isPast ? "#cbd5e1" : "#3b82f6"}`,
        padding: "20px 22px", marginBottom: "14px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        opacity: isArchived ? 0.75 : 1,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
              <span style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>{a.title}</span>
              <Badge color="blue">{a.max_score} pts</Badge>
              {isArchived
                ? <Badge color="gray">📦 Archived</Badge>
                : isPast
                  ? <Badge color="gray">Closed</Badge>
                  : <Badge color="green">Active</Badge>
              }
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

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            {!isArchived && (
              <button style={btn.small} onClick={() => openEdit(a)}>✏️ Edit</button>
            )}
            <button
              onClick={() => setArchiveTarget(a)}
              title={isArchived ? "Restore assignment" : "Archive assignment"}
              style={{
                padding: "7px 12px", borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: isArchived ? "#f0fdf4" : "#f8fafc",
                color: isArchived ? "#16a34a" : "#64748b",
                fontSize: "12px", fontWeight: "700",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {isArchived ? "↩️ Restore" : "📦 Archive"}
            </button>
            <button
              onClick={() => setDeleteTarget(a)}
              title="Delete assignment"
              style={{
                padding: "7px 12px", borderRadius: "10px",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#dc2626",
                fontSize: "12px", fontWeight: "700",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Assignments</p>
        <div style={{ display: "flex", gap: "8px" }}>
          {archivedAssignments.length > 0 && (
            <button
              onClick={() => setShowArchived(v => !v)}
              style={{
                padding: "9px 16px", borderRadius: "10px",
                border: "1px solid #e2e8f0", background: "#f8fafc",
                color: "#64748b", fontSize: "12px", fontWeight: "700",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {showArchived ? "Hide Archived" : `📦 Archived (${archivedAssignments.length})`}
            </button>
          )}
          <button style={btn.primary} onClick={openCreate}>+ New Assignment</button>
        </div>
      </div>

      {/* Active assignments
      {activeAssignments.length === 0 && !showArchived && (
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "center", padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: "48px", margin: "0 0 14px" }}>📋</p>
          <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: "0 0 6px" }}>No assignments yet</p>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Create your first assignment to get started.</p>
        </div>
      )} */}


        {/* Active assignments */}
      {activeAssignments.length === 0 && !showArchived && !archivedOnly && (
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "center", padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: "48px", margin: "0 0 14px" }}>📋</p>
          <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: "0 0 6px" }}>No assignments yet</p>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Create your first assignment to get started.</p>
        </div>
      )}

      {/* Archived tab empty state */}
      {archivedOnly && assignments.length === 0 && (
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "center", padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: "48px", margin: "0 0 14px" }}>📦</p>
          <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: 0 }}>No archived assignments</p>
        </div>
      )}


      {activeAssignments.map(renderAssignment)}

      {/* Archived section */}
      {showArchived && archivedAssignments.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>
            📦 Archived Assignments
          </p>
          {archivedAssignments.map(renderAssignment)}
        </div>
      )}

      {/* ── Create Modal ── */}
      {createOpen && (
        <Sheet onClose={() => setCreateOpen(false)} title="Create New Assignment"
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={btn.ghost} onClick={() => setCreateOpen(false)}>Cancel</button>
              <button style={btn.primary} onClick={handleCreate} disabled={saving}>{saving ? "Publishing…" : "✅ Publish Assignment"}</button>
            </div>
          }>
          <AssignmentForm
            form={form} setForm={setForm}
            attachments={attachments} setAttachments={setAttachments}
            onAttachFile={handleAttachFile} assignmentId={null}
          />
        </Sheet>
      )}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <Sheet onClose={() => setEditTarget(null)} title="Edit Assignment"
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={btn.ghost} onClick={() => setEditTarget(null)}>Cancel</button>
              <button style={btn.primary} onClick={handleEditSave} disabled={saving}>{saving ? "Saving…" : "💾 Save Changes"}</button>
            </div>
          }>
          <AssignmentForm
            form={form} setForm={setForm}
            attachments={attachments} setAttachments={setAttachments}
            onAttachFile={handleAttachFile} assignmentId={editTarget.id}
          />
        </Sheet>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Assignment?"
          message={
            deleteTarget.gc_coursework_id
              ? `"${deleteTarget.title}" will be permanently deleted from EssayGrade AND from Google Classroom. This cannot be undone.`
              : `"${deleteTarget.title}" and all its submissions will be permanently deleted. This cannot be undone.`
          }
          confirmLabel={actionLoading ? "Deleting…" : "🗑️ Yes, Delete"}
          confirmColor="#dc2626"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Archive Confirmation ── */}
      {archiveTarget && (
        <ConfirmModal
          title={archiveTarget.is_active === false ? "Restore Assignment?" : "Archive Assignment?"}
          message={
            archiveTarget.is_active === false
              ? `"${archiveTarget.title}" will be made active again and visible to students.`
              : `"${archiveTarget.title}" will be hidden from students and moved to the archive. Submissions are kept.`
          }
          confirmLabel={actionLoading ? "Working…" : archiveTarget.is_active === false ? "↩️ Restore" : "📦 Archive"}
          confirmColor={archiveTarget.is_active === false ? "#16a34a" : "#64748b"}
          onConfirm={handleArchive}
          onCancel={() => setArchiveTarget(null)}
        />
      )}
    </div>
  );
}