
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


function AssignmentDetailModal({ assignment, submissions, onClose, onEdit, onExport }) {
  const subCount    = submissions.filter(s => s.assignment_id === assignment.id).length;
  const gradedCount = submissions.filter(s => s.assignment_id === assignment.id && s.final_score !== null).length;
  const isPast      = new Date() > new Date(assignment.due_date);
  const isArchived  = assignment.is_active === false;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: "24px",
        width: "100%", maxWidth: "680px", maxHeight: "90vh",
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 16px 60px rgba(0,0,0,0.2)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
              <span style={{
                fontSize: "10px", fontWeight: "800", textTransform: "uppercase",
                letterSpacing: "0.5px", color: "#3b82f6",
                background: "#eff6ff", padding: "3px 10px", borderRadius: "20px",
              }}>
                {isArchived ? "📦 Archived" : isPast ? "Closed" : "✅ Active"}
              </span>
              <span style={{
                fontSize: "10px", fontWeight: "700", color: "#7c3aed",
                background: "#f5f3ff", padding: "3px 10px", borderRadius: "20px",
              }}>
                {assignment.max_score} pts
              </span>
            </div>
            <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "900", color: "#1e293b" }}>
              {assignment.title}
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
              📅 Due {assignment.due_date
                ? new Date(assignment.due_date.replace(" ", "T")).toLocaleDateString("en-GB", {
                    timeZone: "Africa/Blantyre", day: "numeric", month: "long",
                    year: "numeric", hour: "2-digit", minute: "2-digit",
                  })
                : "No date"
              }
            </p>
          </div>
          <button onClick={onClose} style={{
            width: "36px", height: "36px", borderRadius: "10px",
            border: "1px solid #e2e8f0", background: "#f8fafc",
            color: "#64748b", fontSize: "18px", fontWeight: "700",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>×</button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px", background: "#e2e8f0", borderBottom: "1px solid #e2e8f0",
        }}>
          {[
            { label: "Submissions", value: subCount, icon: "📝" },
            { label: "Graded",      value: gradedCount, icon: "✅" },
            { label: "Pending",     value: subCount - gradedCount, icon: "⏳" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "#f8fafc", padding: "14px 20px", textAlign: "center",
            }}>
              <p style={{ margin: "0 0 2px", fontSize: "20px", fontWeight: "900", color: "#1e293b" }}>
                {stat.icon} {stat.value}
              </p>
              <p style={{ margin: 0, fontSize: "11px", fontWeight: "600", color: "#94a3b8" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Description */}
          {assignment.description && (
            <div>
              <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Description
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.7" }}>
                {assignment.description}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div>
            <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Essay Instructions
            </p>
            <div style={{
              background: "#f8fafc", borderRadius: "14px", padding: "18px 20px",
              border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b",
              lineHeight: "1.8", whiteSpace: "pre-wrap",
            }}>
              {assignment.instructions}
            </div>
          </div>

          {/* Rubric */}
          {assignment.rubric && (
            <div>
              <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Grading Rubric
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {Object.entries(assignment.rubric).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569", textTransform: "capitalize", width: "90px", flexShrink: 0 }}>{k}</span>
                    <div style={{ flex: 1, height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "8px", background: "linear-gradient(90deg,#3b82f6,#38bdf8)", borderRadius: "4px", width: `${v}%` }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#3b82f6", width: "36px", textAlign: "right" }}>{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference material */}
          {assignment.reference_material && (
            <div>
              <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                🤖 AI Reference Material
              </p>
              <div style={{
                background: "#faf5ff", borderRadius: "14px", padding: "16px 18px",
                border: "1px solid #e9d5ff", fontSize: "13px", color: "#6b21a8",
                lineHeight: "1.7", maxHeight: "160px", overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}>
                {assignment.reference_material}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: "18px 28px", borderTop: "1px solid #e2e8f0",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px",
        }}>
          <button onClick={() => onExport(assignment)} style={{
            padding: "9px 18px", borderRadius: "10px",
            border: "1.5px solid #3b82f6", background: "#eff6ff",
            color: "#3b82f6", fontSize: "13px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            📄 Export as PDF
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onClose} style={{
              padding: "9px 18px", borderRadius: "10px",
              border: "1px solid #e2e8f0", background: "#f8fafc",
              color: "#64748b", fontSize: "13px", fontWeight: "700",
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Close
            </button>
            {!isArchived && (
              <button onClick={() => { onClose(); onEdit(assignment); }} style={{
                padding: "9px 18px", borderRadius: "10px",
                border: "none", background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
                color: "#fff", fontSize: "13px", fontWeight: "700",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                ✏️ Edit Assignment
              </button>
            )}
          </div>
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
  const [viewTarget, setViewTarget] = useState(null);   // assignment detail view
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


// ── Export assignment as PDF (print dialog) ───────────────────────────────
const handleExport = (a) => {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head>
        <title>${a.title}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 750px; margin: 40px auto; color: #1e293b; line-height: 1.7; }
          h1 { font-size: 24px; font-weight: 900; margin-bottom: 4px; }
          .meta { color: #64748b; font-size: 13px; margin-bottom: 28px; }
          .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin: 24px 0 8px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; font-size: 14px; white-space: pre-wrap; }
          .rubric-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .rubric-row:last-child { border-bottom: none; }
        </style>
      </head>
      <body>
        <h1>${a.title}</h1>
        <p class="meta">Max Score: ${a.max_score} pts &nbsp;|&nbsp; Due: ${a.due_date ? new Date(a.due_date.replace(" ","T")).toLocaleString() : "N/A"}</p>
        ${a.description ? `<p class="section-title">Description</p><p>${a.description}</p>` : ""}
        <p class="section-title">Essay Instructions</p>
        <div class="box">${a.instructions}</div>
        ${a.rubric ? `
          <p class="section-title">Grading Rubric</p>
          <div class="box">
            ${Object.entries(a.rubric).map(([k, v]) => `<div class="rubric-row"><span style="text-transform:capitalize">${k}</span><strong>${v}%</strong></div>`).join("")}
          </div>` : ""}
      </body>
    </html>
  `);
  win.document.close();
  win.print();
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
              {/* <span style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>{a.title}</span>
              */}
              <span
                      onClick={() => setViewTarget(a)}
                      style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textDecorationColor: "#94a3b8" }}
                    >
                      {a.title}
                    </span>
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

            {/* ── Assignment Detail Modal ── */}
      {viewTarget && (
        <AssignmentDetailModal
          assignment={viewTarget}
          submissions={submissions}
          onClose={() => setViewTarget(null)}
          onEdit={(a) => { openEdit(a); }}
          onExport={handleExport}
        />
      )}
    </div>
  );
}