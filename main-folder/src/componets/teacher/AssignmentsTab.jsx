







// src/componets/teacher/AssignmentsTab.jsx
import { useState } from "react";
import { Badge, Icon, btn, colors } from "./shared.jsx";
import AssignmentForm from "./AssignmentForm.jsx";
import { apiFetch } from "./api.js";

// backwards-compat — shared.jsx exports COLORS but some spots may still use colors
export { colors };

const EMPTY_FORM = {
  title: "", description: "", instructions: "",
  referenceMaterial: "", rubricContent: "", max_score: 100, due_date: "",
  rubric: { content: 35, structure: 25, grammar: 20, evidence: 20 },
};

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmLabel, confirmColor = "#A32D2D", onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(15,13,40,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "28px 26px",
        maxWidth: 420, width: "90%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1830", margin: "0 0 8px" }}>{title}</p>
        <p style={{ fontSize: 13, color: "#8884A8", lineHeight: 1.6, margin: "0 0 24px" }}>{message}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{
            padding: "8px 18px", borderRadius: 9,
            border: "1px solid #D3D1C7", background: "#F1EFE8",
            color: "#5F5E5A", fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "8px 18px", borderRadius: 9, border: "none",
            background: confirmColor, color: "#fff",
            fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
          }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Assignment detail modal ───────────────────────────────────────────────────
function AssignmentDetailModal({ assignment, submissions, onClose, onEdit, onExport }) {
  const subCount = submissions.filter(s => s.assignment_id === assignment.id).length;
  const gradedCount = submissions.filter(s => s.assignment_id === assignment.id && s.final_score !== null).length;
  const isPast = new Date() > new Date(assignment.due_date);
  const isArchived = assignment.is_active === false;

  const stats = [
    { icon: "file-text", label: "Submissions", value: subCount, color: "#185FA5", bg: "#E6F1FB" },
    { icon: "circle-check", label: "Graded", value: gradedCount, color: "#3B6D11", bg: "#EAF3DE" },
    { icon: "clock-hour-4", label: "Pending", value: subCount - gradedCount, color: "#854F0B", bg: "#FAEEDA" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(15,13,40,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "stretch", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 18,
        width: "100%", maxWidth: 1100,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 22px", borderBottom: "1px solid #ECECF2",
          background: "#F8F7FF", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: isArchived ? "#F1EFE8" : isPast ? "#FAEEDA" : "#E6F1FB",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon
                name={isArchived ? "archive" : isPast ? "lock" : "clipboard-list"}
                size={18}
                style={{ color: isArchived ? "#5F5E5A" : isPast ? "#854F0B" : "#185FA5" }}
              />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#1A1830", margin: 0 }}>{assignment.title}</p>
              <p style={{ fontSize: 12, color: "#8884A8", margin: 0 }}>
                {isArchived ? "Archived" : isPast ? "Closed" : "Active"} &nbsp;·&nbsp; {assignment.max_score} pts &nbsp;·&nbsp;
                Due {assignment.due_date
                  ? new Date(assignment.due_date.replace(" ", "T")).toLocaleDateString("en-GB", {
                    timeZone: "Africa/Blantyre", day: "numeric", month: "short", year: "numeric",
                  })
                  : "No date"}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            border: "1px solid #ECECF2", background: "#fff",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="x" size={15} style={{ color: "#5F5E5A" }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

          {/* LEFT — essay content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24, borderRight: "1px solid #ECECF2" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#B0AECB", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 14px" }}>
              Essay instructions
            </p>

            {assignment.description && (
              <p style={{ fontSize: 13, color: "#8884A8", margin: "0 0 14px", lineHeight: 1.6 }}>
                {assignment.description}
              </p>
            )}

            <div style={{
              background: "#FDFCF7", border: "1px solid #ECECF2", borderRadius: 12,
              padding: "24px 28px", fontSize: 14, lineHeight: 1.9, color: "#1A1830",
              whiteSpace: "pre-wrap", minHeight: 300, fontFamily: "Georgia, serif",
              marginBottom: 18,
            }}>
              {assignment.instructions}
            </div>

            {assignment.reference_material && (
              <details style={{ background: "#E6F1FB", border: "1px solid #B5D4F4", borderRadius: 11, padding: "11px 14px" }}>
                <summary style={{ fontSize: 12, fontWeight: 600, color: "#185FA5", cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="robot" size={13} style={{ color: "#185FA5" }} />
                  View AI reference material
                </summary>
                <p style={{ fontSize: 13, color: "#1A1830", lineHeight: 1.7, margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
                  {assignment.reference_material}
                </p>
              </details>
            )}
          </div>

          {/* RIGHT — details panel */}
          <div style={{
            width: 290, flexShrink: 0,
            overflowY: "auto", padding: 22,
            background: "#F8F7FF",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#B0AECB", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>
              Overview
            </p>

            {stats.map(s => (
              <div key={s.label} style={{
                background: "#fff", border: "1px solid #ECECF2",
                borderRadius: 11, padding: "13px 15px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon name={s.icon} size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#1A1830", margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#8884A8", margin: "2px 0 0", fontWeight: 500 }}>{s.label}</p>
                </div>
              </div>
            ))}

            {assignment.rubric && (
              <div style={{ background: "#fff", border: "1px solid #ECECF2", borderRadius: 11, padding: "13px 15px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#B0AECB", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 12px" }}>
                  Rubric
                </p>
                {Object.entries(assignment.rubric).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#5F5E5A", textTransform: "capitalize", width: 66, flexShrink: 0 }}>{k}</span>
                    <div style={{ flex: 1, height: 5, background: "#F1EFE8", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, width: `${v}%`, background: "#1A3A6B" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", width: 30, textAlign: "right" }}>{v}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
          padding: "12px 22px", borderTop: "1px solid #ECECF2",
          background: "#F8F7FF", flexShrink: 0,
        }}>
          <button onClick={() => onExport(assignment)} style={{
            padding: "8px 16px", borderRadius: 9,
            border: "1px solid #B5D4F4", background: "#E6F1FB",
            color: "#185FA5", fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Icon name="file-export" size={14} style={{ color: "#185FA5" }} />
            Export as PDF
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{
              padding: "8px 16px", borderRadius: 9,
              border: "1px solid #D3D1C7", background: "#F1EFE8",
              color: "#5F5E5A", fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
            }}>Close</button>
            {!isArchived && (
              <button onClick={() => { onClose(); onEdit(assignment); }} style={{
                padding: "8px 16px", borderRadius: 9, border: "none",
                background: "#1A1830", color: "#fff",
                fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Icon name="pencil" size={13} style={{ color: "#EEEDFE" }} />
                Edit assignment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



function ModalShell({ title, subtitle, iconName, iconBg, iconColor, onClose, onSave, saveLabel, saving, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(15,13,40,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "stretch", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 18,
        width: "100%", maxWidth: 1100,
        display: "flex", flexDirection: "column",
        overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 22px", borderBottom: "1px solid #ECECF2",
          background: "#F8F7FF", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={iconName} size={18} style={{ color: iconColor }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#1A1830", margin: 0 }}>{title}</p>
              {subtitle && <p style={{ fontSize: 12, color: "#8884A8", margin: 0 }}>{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8, border: "1px solid #ECECF2",
            background: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="x" size={15} style={{ color: "#5F5E5A" }} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "26px 30px" }}>{children}</div>
        <div style={{
          display: "flex", justifyContent: "flex-end", gap: 8,
          padding: "12px 22px", borderTop: "1px solid #ECECF2",
          background: "#F8F7FF", flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: 9, border: "1px solid #D3D1C7",
            background: "#F1EFE8", color: "#5F5E5A", fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={onSave} disabled={saving} style={{
            padding: "9px 22px", borderRadius: 9, border: "none",
            background: saving ? "#8884A8" : "#1A1830",
            color: "#fff", fontSize: 13, fontWeight: 500,
            cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {saving
              ? <><Icon name="loader" size={13} style={{ color: "#fff" }} /> Saving…</>
              : <><Icon name="device-floppy" size={13} style={{ color: "#fff" }} /> {saveLabel}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Main component ────────────────────────────────────────────────────────────
export default function AssignmentsTab({ assignments, submissions, loading, onCreated, onUpdated, showToast, selectedClassId, selectedClass, archivedOnly = false }) {
  const classId = selectedClassId ?? selectedClass?.id;
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [attachments, setAttachments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const handleAttachFile = e => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files.map(f => ({
      name: f.name, size: f.size, type: f.type,
      url: URL.createObjectURL(f),
    }))]);
    e.target.value = "";
  };

  const openCreate = () => { setForm(EMPTY_FORM); setAttachments([]); setCreateOpen(true); };
  const openEdit = a => { setForm({ ...a, referenceMaterial: a.reference_material || "", rubricContent: a.rubric_content || "" }); setAttachments(a.attachments || []); setEditTarget(a); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const data = await apiFetch("/assignments/delete", { method: "POST", body: JSON.stringify({ id: deleteTarget.id }) });
      setDeleteTarget(null);
      showToast(data.message || "Assignment deleted.");
      onUpdated();
    } catch (err) { showToast(err.message, "error"); }
    finally { setActionLoading(false); }
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setActionLoading(true);
    try {
      const data = await apiFetch("/assignments/archive", { method: "POST", body: JSON.stringify({ id: archiveTarget.id }) });
      setArchiveTarget(null);
      showToast(data.message || "Done.");
      onUpdated();
    } catch (err) { showToast(err.message, "error"); }
    finally { setActionLoading(false); }
  };

  const handleExport = (a) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>${a.title}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; max-width: 750px; margin: 40px auto; color: #1e293b; line-height: 1.7; }
        h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
        .meta { color: #64748b; font-size: 13px; margin-bottom: 28px; }
        .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; margin: 22px 0 7px; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 14px 16px; font-size: 14px; white-space: pre-wrap; }
        .rubric-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        .rubric-row:last-child { border-bottom: none; }
      </style></head><body>
        <h1>${a.title}</h1>
        <p class="meta">Max Score: ${a.max_score} pts &nbsp;|&nbsp; Due: ${a.due_date ? new Date(a.due_date.replace(" ", "T")).toLocaleString() : "N/A"}</p>
        ${a.description ? `<p class="section-title">Description</p><p>${a.description}</p>` : ""}
        <p class="section-title">Essay Instructions</p>
        <div class="box">${a.instructions}</div>
        ${a.rubric ? `<p class="section-title">Grading Rubric</p><div class="box">${Object.entries(a.rubric).map(([k, v]) => `<div class="rubric-row"><span style="text-transform:capitalize">${k}</span><strong>${v}%</strong></div>`).join("")}</div>` : ""}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const handleCreate = async () => {
    if (!form.title || !form.instructions || !form.due_date) { showToast("Please fill in Title, Instructions, and Due Date.", "error"); return; }
    if (!classId) { showToast("No class selected.", "error"); return; }
    setSaving(true);
    try {
      const data = await apiFetch("/assignments/create", {
        method: "POST",
        body: JSON.stringify({
          class_id: classId, title: form.title, description: form.description || "",
          instructions: form.instructions, reference_material: form.referenceMaterial || "",
          rubric_content: form.rubricContent || "", max_score: form.max_score || 100, due_date: form.due_date, rubric: form.rubric,
        }),
      });
      setCreateOpen(false);
      showToast("Assignment published.");
      onCreated(data.id);
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleEditSave = async () => {
    if (!form.title || !form.instructions || !form.due_date) { showToast("Please fill in Title, Instructions, and Due Date.", "error"); return; }
    setSaving(true);
    try {
      await apiFetch("/assignments/update", {
        method: "POST",
        body: JSON.stringify({
          id: editTarget.id, title: form.title, description: form.description || "",
          instructions: form.instructions, reference_material: form.referenceMaterial || "",
          rubric_content: form.rubricContent || "", max_score: form.max_score || 100, due_date: form.due_date, rubric: form.rubric,
        }),
      });
      setEditTarget(null);
      showToast("Assignment updated.");
      onUpdated();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <div style={{ width: 28, height: 28, border: "2px solid #E8E6FF", borderTopColor: "#3C3489", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );

  const activeAssignments = assignments.filter(a => a.is_active !== false);
  const archivedAssignments = assignments.filter(a => a.is_active === false);

  // ── Shared modal wrapper ──────────────────────────────────────────────────

  const renderAssignment = (a) => {
    const subCount = submissions.filter(s => s.assignment_id === a.id).length;
    const gradedCount = submissions.filter(s => s.assignment_id === a.id && s.final_score !== null).length;
    const isPast = new Date() > new Date(a.due_date);
    const hasRef = a.reference_material && a.reference_material.trim().length > 0;
    const isArchived = a.is_active === false;
    const leftColor = isArchived ? "#D3D1C7" : isPast ? "#D3D1C7" : "#1A3A6B";

    return (
      <div key={a.id} style={{
        background: isArchived ? "#FAFAF8" : "#fff",
        borderRadius: 13, border: "1px solid #ECECF2",
        borderLeft: `4px solid ${leftColor}`,
        padding: "18px 20px", marginBottom: 10,
        opacity: isArchived ? 0.8 : 1,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
          <div style={{ flex: 1 }}>
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
              <span
                onClick={() => setViewTarget(a)}
                style={{
                  fontWeight: 700, fontSize: 14, color: "#1A1830", cursor: "pointer",
                  textDecoration: "underline", textDecorationStyle: "dotted", textDecorationColor: "#B0AECB"
                }}
              >
                {a.title}
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                background: "#E6F1FB", color: "#185FA5", border: "1px solid #B5D4F4",
              }}>{a.max_score} pts</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                background: isArchived ? "#F1EFE8" : isPast ? "#F1EFE8" : "#EAF3DE",
                color: isArchived ? "#5F5E5A" : isPast ? "#5F5E5A" : "#3B6D11",
                border: `1px solid ${isArchived ? "#D3D1C7" : isPast ? "#D3D1C7" : "#C0DD97"}`,
              }}>
                <Icon
                  name={isArchived ? "archive" : isPast ? "lock" : "circle-check"}
                  size={10}
                  style={{ color: isArchived ? "#5F5E5A" : isPast ? "#5F5E5A" : "#3B6D11" }}
                />
                {isArchived ? "Archived" : isPast ? "Closed" : "Active"}
              </span>
              {hasRef && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                  background: "#EEEDFE", color: "#3C3489", border: "1px solid #CECBF6",
                }}>
                  <Icon name="robot" size={10} style={{ color: "#3C3489" }} />
                  AI reference set
                </span>
              )}
            </div>

            {a.description && (
              <p style={{ fontSize: 12, color: "#8884A8", margin: "0 0 8px", lineHeight: 1.5 }}>{a.description}</p>
            )}

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#B0AECB", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="calendar" size={11} style={{ color: "#B0AECB" }} />
                Due {a.due_date
                  ? new Date(a.due_date.replace(" ", "T")).toLocaleDateString("en-GB", {
                    timeZone: "Africa/Blantyre", day: "numeric", month: "short", year: "numeric",
                  })
                  : "No date"}
              </span>
              <span style={{ fontSize: 11, color: "#B0AECB", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="file-text" size={11} style={{ color: "#B0AECB" }} />
                {subCount} submitted
              </span>
              <span style={{ fontSize: 11, color: "#B0AECB", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="circle-check" size={11} style={{ color: "#B0AECB" }} />
                {gradedCount} graded
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {!isArchived && (
              <button
                onClick={() => openEdit(a)}
                style={{
                  padding: "6px 12px", borderRadius: 8, border: "1px solid #D3D1C7",
                  background: "#F1EFE8", color: "#5F5E5A", fontSize: 12, fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <Icon name="pencil" size={12} style={{ color: "#5F5E5A" }} />
                Edit
              </button>
            )}
            <button
              onClick={() => setArchiveTarget(a)}
              style={{
                padding: "6px 12px", borderRadius: 8,
                border: `1px solid ${isArchived ? "#C0DD97" : "#D3D1C7"}`,
                background: isArchived ? "#EAF3DE" : "#F1EFE8",
                color: isArchived ? "#3B6D11" : "#5F5E5A",
                fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <Icon name={isArchived ? "arrow-back-up" : "archive"} size={12} style={{ color: isArchived ? "#3B6D11" : "#5F5E5A" }} />
              {isArchived ? "Restore" : "Archive"}
            </button>
            <button
              onClick={() => setDeleteTarget(a)}
              style={{
                padding: "6px 12px", borderRadius: 8,
                border: "1px solid #F7C1C1", background: "#FCEBEB",
                color: "#A32D2D", fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <Icon name="trash" size={12} style={{ color: "#A32D2D" }} />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1A1830" }}>Assignments</h2>
          {!archivedOnly && (
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8884A8" }}>
              {activeAssignments.length} active
              {archivedAssignments.length > 0 && ` · ${archivedAssignments.length} archived`}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!archivedOnly && archivedAssignments.length > 0 && (
            <button
              onClick={() => setShowArchived(v => !v)}
              style={{
                padding: "8px 14px", borderRadius: 9,
                border: "1px solid #D3D1C7", background: "#F1EFE8",
                color: "#5F5E5A", fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <Icon name="archive" size={13} style={{ color: "#5F5E5A" }} />
              {showArchived ? "Hide archived" : `Archived (${archivedAssignments.length})`}
            </button>
          )}
          {!archivedOnly && (
            <button
              onClick={openCreate}
              style={{
                padding: "8px 16px", borderRadius: 9, border: "none",
                background: "#1A1830", color: "#fff",
                fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <Icon name="plus" size={14} style={{ color: "#fff" }} />
              New assignment
            </button>
          )}
        </div>
      </div>

      {/* Empty states */}
      {activeAssignments.length === 0 && !showArchived && !archivedOnly && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px dashed #D3D1C7", textAlign: "center", padding: "60px 24px" }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: "#E6F1FB", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="clipboard-list" size={22} style={{ color: "#185FA5" }} />
          </div>
          <p style={{ fontWeight: 700, color: "#1A1830", fontSize: 15, margin: "0 0 5px" }}>No assignments yet</p>
          <p style={{ fontSize: 13, color: "#8884A8", margin: 0 }}>Create your first assignment to get started.</p>
        </div>
      )}

      {archivedOnly && assignments.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px dashed #D3D1C7", textAlign: "center", padding: "60px 24px" }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: "#F1EFE8", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="archive" size={22} style={{ color: "#5F5E5A" }} />
          </div>
          <p style={{ fontWeight: 700, color: "#1A1830", fontSize: 15, margin: 0 }}>No archived assignments</p>
        </div>
      )}

      {/* Cards */}
      {archivedOnly
        ? assignments.map(renderAssignment)
        : activeAssignments.map(renderAssignment)
      }

      {showArchived && !archivedOnly && archivedAssignments.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#B0AECB", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="archive" size={12} style={{ color: "#B0AECB" }} />
            Archived assignments
          </p>
          {archivedAssignments.map(renderAssignment)}
        </div>
      )}

      {/* Create modal */}
      {createOpen && (
        <ModalShell
          title="New assignment"
          subtitle="Fill in the details and publish"
          iconName="clipboard-list"
          iconBg="#E6F1FB"
          iconColor="#185FA5"
          onClose={() => setCreateOpen(false)}
          saving={saving}
          onSave={handleCreate}
          saveLabel="Publish assignment"
        >
          <AssignmentForm
            form={form} setForm={setForm}
            attachments={attachments} setAttachments={setAttachments}
            onAttachFile={handleAttachFile} assignmentId={null}
          />
        </ModalShell>
      )}

      {/* Edit modal */}
      {editTarget && (
        <ModalShell
          title="Edit assignment"
          subtitle={editTarget?.title}
          iconName="pencil"
          iconBg="#FAEEDA"
          iconColor="#854F0B"
          onClose={() => setEditTarget(null)}
          saving={saving}
          onSave={handleEditSave}
          saveLabel="Save changes"
        >
          <AssignmentForm
            form={form} setForm={setForm}
            attachments={attachments} setAttachments={setAttachments}
            onAttachFile={handleAttachFile} assignmentId={editTarget.id}
          />
        </ModalShell>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete assignment?"
          message={
            deleteTarget.gc_coursework_id
              ? `"${deleteTarget.title}" will be permanently deleted from EssayGrade and Google Classroom. This cannot be undone.`
              : `"${deleteTarget.title}" and all its submissions will be permanently deleted. This cannot be undone.`
          }
          confirmLabel={
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="trash" size={13} style={{ color: "#fff" }} />
              {actionLoading ? "Deleting…" : "Yes, delete"}
            </span>
          }
          confirmColor="#A32D2D"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Archive confirm */}
      {archiveTarget && (
        <ConfirmModal
          title={archiveTarget.is_active === false ? "Restore assignment?" : "Archive assignment?"}
          message={
            archiveTarget.is_active === false
              ? `"${archiveTarget.title}" will be made active again and visible to students.`
              : `"${archiveTarget.title}" will be hidden from students. Submissions are kept.`
          }
          confirmLabel={
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name={archiveTarget.is_active === false ? "arrow-back-up" : "archive"} size={13} style={{ color: "#fff" }} />
              {actionLoading ? "Working…" : archiveTarget.is_active === false ? "Restore" : "Archive"}
            </span>
          }
          confirmColor={archiveTarget.is_active === false ? "#3B6D11" : "#5F5E5A"}
          onConfirm={handleArchive}
          onCancel={() => setArchiveTarget(null)}
        />
      )}

      {/* Detail view */}
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