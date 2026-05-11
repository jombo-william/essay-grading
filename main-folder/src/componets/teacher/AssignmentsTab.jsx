
// // src/componets/teacher/AssignmentsTab.jsx
// import { useState } from "react";
// import { Badge, Sheet, btn, colors } from "./shared.jsx";
// import AssignmentForm from "./AssignmentForm.jsx";
// import { apiFetch } from "./api.js";

// const EMPTY_FORM = {
//   title: "", description: "", instructions: "",
//   referenceMaterial: "", max_score: 100, due_date: "",
//   rubric: { content: 35, structure: 25, grammar: 20, evidence: 20 },
// };

// // ── Confirmation modal ────────────────────────────────────────────────────────
// function ConfirmModal({ title, message, confirmLabel, confirmColor = "#ef4444", onConfirm, onCancel }) {
//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 500,
//       background: "rgba(0,0,0,0.45)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//     }}>
//       <div style={{
//         background: "#fff", borderRadius: "20px", padding: "32px 28px",
//         maxWidth: "420px", width: "90%",
//         boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}>
//         <p style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: "0 0 10px" }}>
//           {title}
//         </p>
//         <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: "0 0 28px" }}>
//           {message}
//         </p>
//         <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
//           <button onClick={onCancel} style={{
//             padding: "9px 20px", borderRadius: "10px",
//             border: "1px solid #e2e8f0", background: "#f8fafc",
//             color: "#64748b", fontSize: "13px", fontWeight: "700",
//             cursor: "pointer", fontFamily: "inherit",
//           }}>
//             Cancel
//           </button>
//           <button onClick={onConfirm} style={{
//             padding: "9px 20px", borderRadius: "10px",
//             border: "none", background: confirmColor,
//             color: "#fff", fontSize: "13px", fontWeight: "700",
//             cursor: "pointer", fontFamily: "inherit",
//           }}>
//             {confirmLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// function AssignmentDetailModal({ assignment, submissions, onClose, onEdit, onExport }) {
//   const subCount    = submissions.filter(s => s.assignment_id === assignment.id).length;
//   const gradedCount = submissions.filter(s => s.assignment_id === assignment.id && s.final_score !== null).length;
//   const isPast      = new Date() > new Date(assignment.due_date);
//   const isArchived  = assignment.is_active === false;

//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 400,
//       background: "rgba(0,0,0,0.5)",
//       display: "flex", alignItems: "stretch", justifyContent: "center",
//       padding: "20px",
//     }}>
//       <div style={{
//         background: "#fff", borderRadius: "20px",
//         width: "100%", maxWidth: "1100px",
//         display: "flex", flexDirection: "column",
//         overflow: "hidden",
//         boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}>

//         {/* ── Header ── */}
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "16px 24px", borderBottom: "1px solid #e2e8f0",
//           background: "#f8fafc", flexShrink: 0,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{
//               width: 40, height: 40, borderRadius: "12px",
//               background: isArchived
//                 ? "linear-gradient(135deg,#94a3b8,#cbd5e1)"
//                 : isPast
//                   ? "linear-gradient(135deg,#f59e0b,#fbbf24)"
//                   : "linear-gradient(135deg,#3b82f6,#38bdf8)",
//               color: "#fff", fontSize: 18,
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//               {isArchived ? "📦" : isPast ? "🔒" : "📋"}
//             </div>
//             <div>
//               <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", margin: 0 }}>{assignment.title}</p>
//               <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
//                 {isArchived ? "Archived" : isPast ? "Closed" : "Active"} &nbsp;·&nbsp; {assignment.max_score} pts &nbsp;·&nbsp;
//                 Due {assignment.due_date
//                   ? new Date(assignment.due_date.replace(" ", "T")).toLocaleDateString("en-GB", {
//                       timeZone: "Africa/Blantyre", day: "numeric", month: "short", year: "numeric",
//                     })
//                   : "No date"}
//               </p>
//             </div>
//           </div>
//           <button onClick={onClose} style={{
//             width: 36, height: 36, borderRadius: 10,
//             border: "1px solid #e2e8f0", background: "#fff",
//             fontSize: 18, cursor: "pointer", color: "#64748b",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>×</button>
//         </div>

//         {/* ── Body — side by side ── */}
//         <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

//           {/* LEFT — Assignment content */}
//           <div style={{
//             flex: 1, overflowY: "auto", padding: "24px",
//             borderRight: "1px solid #e2e8f0",
//           }}>
//             <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
//               Essay Instructions
//             </p>

//             {assignment.description && (
//               <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>
//                 {assignment.description}
//               </p>
//             )}

//             {/* Instructions rendered like a document */}
//             <div style={{
//               background: "#fffef7",
//               border: "1px solid #e2e8f0",
//               borderRadius: 12,
//               padding: "28px 32px",
//               fontSize: 14,
//               lineHeight: "1.9",
//               color: "#1e293b",
//               whiteSpace: "pre-wrap",
//               minHeight: "300px",
//               fontFamily: "Georgia, serif",
//               boxShadow: "inset 0 1px 4px rgba(0,0,0,0.03)",
//               marginBottom: 20,
//             }}>
//               {assignment.instructions}
//             </div>

//             {/* Reference material */}
//             {assignment.reference_material && (
//               <details style={{
//                 background: "#faf5ff", border: "1px solid #e9d5ff",
//                 borderRadius: 12, padding: "12px 16px",
//               }}>
//                 <summary style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", cursor: "pointer", userSelect: "none" }}>
//                   🤖 View AI Reference Material
//                 </summary>
//                 <p style={{ fontSize: 13, color: "#6b21a8", lineHeight: 1.7, margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
//                   {assignment.reference_material}
//                 </p>
//               </details>
//             )}
//           </div>

//           {/* RIGHT — Details & actions panel */}
//           <div style={{
//             width: "300px", flexShrink: 0,
//             overflowY: "auto", padding: "24px",
//             background: "#f8fafc",
//             display: "flex", flexDirection: "column", gap: 16,
//           }}>
//             <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
//               Overview
//             </p>

//             {/* Stats */}
//             {[
//               { icon: "📝", label: "Submissions", value: subCount, color: "#2563eb" },
//               { icon: "✅", label: "Graded",      value: gradedCount, color: "#16a34a" },
//               { icon: "⏳", label: "Pending",     value: subCount - gradedCount, color: "#d97706" },
//             ].map(stat => (
//               <div key={stat.label} style={{
//                 background: "#fff", border: "1px solid #e2e8f0",
//                 borderRadius: 12, padding: "14px 16px",
//                 display: "flex", alignItems: "center", gap: 12,
//               }}>
//                 <span style={{ fontSize: 22 }}>{stat.icon}</span>
//                 <div>
//                   <p style={{ fontSize: 22, fontWeight: 900, color: stat.color, margin: 0, lineHeight: 1 }}>{stat.value}</p>
//                   <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0" }}>{stat.label}</p>
//                 </div>
//               </div>
//             ))}

//             {/* Rubric */}
//             {assignment.rubric && (
//               <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
//                 <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 12px" }}>Rubric</p>
//                 {Object.entries(assignment.rubric).map(([k, v]) => (
//                   <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                     <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "capitalize", width: 70, flexShrink: 0 }}>{k}</span>
//                     <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
//                       <div style={{ height: "100%", borderRadius: 3, width: `${v}%`, background: "linear-gradient(90deg,#3b82f6,#38bdf8)" }} />
//                     </div>
//                     <span style={{ fontSize: 12, fontWeight: 800, color: "#3b82f6", width: 32, textAlign: "right" }}>{v}%</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── Footer ── */}
//         <div style={{
//           display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
//           padding: "14px 24px", borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc", flexShrink: 0,
//         }}>
//           <button onClick={() => onExport(assignment)} style={{
//             padding: "9px 18px", borderRadius: 10,
//             border: "1.5px solid #3b82f6", background: "#eff6ff",
//             color: "#3b82f6", fontSize: 13, fontWeight: 700,
//             cursor: "pointer", fontFamily: "inherit",
//           }}>
//             📄 Export as PDF
//           </button>

//           <div style={{ display: "flex", gap: 8 }}>
//             <button onClick={onClose} style={{
//               padding: "9px 18px", borderRadius: 10,
//               border: "1px solid #e2e8f0", background: "#fff",
//               color: "#64748b", fontSize: 13, fontWeight: 700,
//               cursor: "pointer", fontFamily: "inherit",
//             }}>
//               Close
//             </button>
//             {!isArchived && (
//               <button onClick={() => { onClose(); onEdit(assignment); }} style={{
//                 padding: "9px 18px", borderRadius: 10,
//                 border: "none", background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
//                 color: "#fff", fontSize: 13, fontWeight: 700,
//                 cursor: "pointer", fontFamily: "inherit",
//               }}>
//                 ✏️ Edit Assignment
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// //export default function AssignmentsTab({ assignments, submissions, loading, onCreated, onUpdated, showToast, selectedClassId, selectedClass }) {
//   export default function AssignmentsTab({ assignments, submissions, loading, onCreated, onUpdated, showToast, selectedClassId, selectedClass, archivedOnly = false }) {
//    const classId = selectedClassId ?? selectedClass?.id;
//   const [createOpen, setCreateOpen]   = useState(false);
//   const [editTarget, setEditTarget]   = useState(null);
//   const [form, setForm]               = useState(EMPTY_FORM);
//   const [attachments, setAttachments] = useState([]);
//   const [saving, setSaving]           = useState(false);

//   // ── Delete / archive state ────────────────────────────────────────────────
//   const [deleteTarget,  setDeleteTarget]  = useState(null);   // assignment to delete
//   const [archiveTarget, setArchiveTarget] = useState(null);   // assignment to archive/restore
//   const [actionLoading, setActionLoading] = useState(false);
//   const [viewTarget, setViewTarget] = useState(null);   // assignment detail view
//   const [showArchived,  setShowArchived]  = useState(false);

//   const handleAttachFile = e => {
//     const files = Array.from(e.target.files);
//     setAttachments(prev => [...prev, ...files.map(f => ({
//       name: f.name, size: f.size, type: f.type,
//       url: URL.createObjectURL(f),
//       icon: f.type.startsWith("image/") ? "🖼️" : f.type.startsWith("video/") ? "🎬" : f.type === "application/pdf" ? "📄" : f.type.includes("word") ? "📝" : "📎",
//     }))]);
//     e.target.value = "";
//   };

//   const openCreate = () => { setForm(EMPTY_FORM); setAttachments([]); setCreateOpen(true); };
//   const openEdit   = a  => { setForm({ ...a, referenceMaterial: a.reference_material || "" }); setAttachments(a.attachments || []); setEditTarget(a); };

//   // ── Delete handler ────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     setActionLoading(true);
//     try {
//       const data = await apiFetch("/assignments/delete", {
//         method: "POST",
//         body: JSON.stringify({ id: deleteTarget.id }),
//       });
//       setDeleteTarget(null);
//       showToast(data.message || "✅ Assignment deleted.");
//       onUpdated();
//     } catch (err) {
//       showToast(err.message, "error");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ── Archive/restore handler ───────────────────────────────────────────────
//   const handleArchive = async () => {
//     if (!archiveTarget) return;
//     setActionLoading(true);
//     try {
//       const data = await apiFetch("/assignments/archive", {
//         method: "POST",
//         body: JSON.stringify({ id: archiveTarget.id }),
//       });
//       setArchiveTarget(null);
//       showToast(data.message || "✅ Done.");
//       onUpdated();
//     } catch (err) {
//       showToast(err.message, "error");
//     } finally {
//       setActionLoading(false);
//     }
//   };


// // ── Export assignment as PDF (print dialog) ───────────────────────────────
// const handleExport = (a) => {
//   const win = window.open("", "_blank");
//   win.document.write(`
//     <html>
//       <head>
//         <title>${a.title}</title>
//         <style>
//           body { font-family: 'Segoe UI', sans-serif; max-width: 750px; margin: 40px auto; color: #1e293b; line-height: 1.7; }
//           h1 { font-size: 24px; font-weight: 900; margin-bottom: 4px; }
//           .meta { color: #64748b; font-size: 13px; margin-bottom: 28px; }
//           .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin: 24px 0 8px; }
//           .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; font-size: 14px; white-space: pre-wrap; }
//           .rubric-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
//           .rubric-row:last-child { border-bottom: none; }
//         </style>
//       </head>
//       <body>
//         <h1>${a.title}</h1>
//         <p class="meta">Max Score: ${a.max_score} pts &nbsp;|&nbsp; Due: ${a.due_date ? new Date(a.due_date.replace(" ","T")).toLocaleString() : "N/A"}</p>
//         ${a.description ? `<p class="section-title">Description</p><p>${a.description}</p>` : ""}
//         <p class="section-title">Essay Instructions</p>
//         <div class="box">${a.instructions}</div>
//         ${a.rubric ? `
//           <p class="section-title">Grading Rubric</p>
//           <div class="box">
//             ${Object.entries(a.rubric).map(([k, v]) => `<div class="rubric-row"><span style="text-transform:capitalize">${k}</span><strong>${v}%</strong></div>`).join("")}
//           </div>` : ""}
//       </body>
//     </html>
//   `);
//   win.document.close();
//   win.print();
// };



//   // ── Create / Edit handlers (unchanged) ───────────────────────────────────
//   const handleCreate = async () => {
//     if (!form.title || !form.instructions || !form.due_date) {
//       showToast("Please fill in Title, Instructions, and Due Date.", "error"); return;
//     }
//     if (Object.values(form.rubric).reduce((a, b) => a + b, 0) !== 100) {
//       showToast("Rubric weights must total 100%.", "error"); return;
//     }
//     if (!classId) {
//       showToast("No class selected. Please select a class first.", "error"); return;
//     }
//     setSaving(true);
//     try {
//       const data = await apiFetch("/assignments/create", {
//         method: "POST",
//         body: JSON.stringify({
//           class_id:           classId,
//           title:              form.title,
//           description:        form.description       || "",
//           instructions:       form.instructions,
//           reference_material: form.referenceMaterial || "",
//           max_score:          form.max_score         || 100,
//           due_date:           form.due_date,
//           rubric:             form.rubric,
//         }),
//       });
//       setCreateOpen(false);
//       showToast("✅ Assignment created.");
//       onCreated(data.id);
//     } catch (err) { showToast(err.message, "error"); }
//     finally { setSaving(false); }
//   };

//   const handleEditSave = async () => {
//     if (!form.title || !form.instructions || !form.due_date) {
//       showToast("Please fill in Title, Instructions, and Due Date.", "error"); return;
//     }
//     if (Object.values(form.rubric || {}).reduce((a, b) => a + b, 0) !== 100) {
//       showToast("Rubric weights must total 100%.", "error"); return;
//     }
//     setSaving(true);
//     try {
//       await apiFetch("/assignments/update", {
//         method: "POST",
//         body: JSON.stringify({
//           id:                 editTarget.id,
//           title:              form.title,
//           description:        form.description       || "",
//           instructions:       form.instructions,
//           reference_material: form.referenceMaterial || "",
//           max_score:          form.max_score         || 100,
//           due_date:           form.due_date,
//           rubric:             form.rubric,
//         }),
//       });
//       setEditTarget(null);
//       showToast("✅ Assignment updated.");
//       onUpdated();
//     } catch (err) { showToast(err.message, "error"); }
//     finally { setSaving(false); }
//   };

//   if (loading) return (
//     <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
//       <div style={{ width: "36px", height: "36px", border: "4px solid #bfdbfe", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
//     </div>
//   );

//   // Split active vs archived
//   const activeAssignments   = assignments.filter(a => a.is_active !== false);
//   const archivedAssignments = assignments.filter(a => a.is_active === false);

//   const renderAssignment = (a) => {
//     const subCount    = submissions.filter(s => s.assignment_id === a.id).length;
//     const gradedCount = submissions.filter(s => s.assignment_id === a.id && s.final_score !== null).length;
//     const isPast      = new Date() > new Date(a.due_date);
//     const hasRef      = a.reference_material && a.reference_material.trim().length > 0;
//     const isArchived  = a.is_active === false;

//     return (
//       <div key={a.id} style={{
//         background: isArchived ? "#f8fafc" : "#fff",
//         borderRadius: "18px",
//         border: "1px solid #e2e8f0",
//         borderLeft: `5px solid ${isArchived ? "#94a3b8" : isPast ? "#cbd5e1" : "#3b82f6"}`,
//         padding: "20px 22px", marginBottom: "14px",
//         boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
//         opacity: isArchived ? 0.75 : 1,
//       }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
//           <div style={{ flex: 1 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
//               {/* <span style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>{a.title}</span>
//               */}
//               <span
//                       onClick={() => setViewTarget(a)}
//                       style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textDecorationColor: "#94a3b8" }}
//                     >
//                       {a.title}
//                     </span>
//               <Badge color="blue">{a.max_score} pts</Badge>
//               {isArchived
//                 ? <Badge color="gray">📦 Archived</Badge>
//                 : isPast
//                   ? <Badge color="gray">Closed</Badge>
//                   : <Badge color="green">Active</Badge>
//               }
//               {hasRef && <Badge color="purple">🤖 AI Reference Set</Badge>}
//             </div>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 10px", lineHeight: "1.6" }}>{a.description}</p>
//             <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//               <span style={{ fontSize: "12px", color: "#94a3b8" }}>
//                 📅 Due {a.due_date ? new Date(a.due_date.replace(" ", "T")).toLocaleDateString("en-GB", { timeZone: "Africa/Blantyre", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "No date"}
//               </span>
//               <span style={{ fontSize: "12px", color: "#94a3b8" }}>
//                 📝 {subCount} submitted · ✅ {gradedCount} graded
//               </span>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
//             {!isArchived && (
//               <button style={btn.small} onClick={() => openEdit(a)}>✏️ Edit</button>
//             )}
//             <button
//               onClick={() => setArchiveTarget(a)}
//               title={isArchived ? "Restore assignment" : "Archive assignment"}
//               style={{
//                 padding: "7px 12px", borderRadius: "10px",
//                 border: "1px solid #e2e8f0",
//                 background: isArchived ? "#f0fdf4" : "#f8fafc",
//                 color: isArchived ? "#16a34a" : "#64748b",
//                 fontSize: "12px", fontWeight: "700",
//                 cursor: "pointer", fontFamily: "inherit",
//               }}
//             >
//               {isArchived ? "↩️ Restore" : "📦 Archive"}
//             </button>
//             <button
//               onClick={() => setDeleteTarget(a)}
//               title="Delete assignment"
//               style={{
//                 padding: "7px 12px", borderRadius: "10px",
//                 border: "1px solid #fecaca",
//                 background: "#fef2f2",
//                 color: "#dc2626",
//                 fontSize: "12px", fontWeight: "700",
//                 cursor: "pointer", fontFamily: "inherit",
//               }}
//             >
//               🗑️ Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//         <p style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Assignments</p>
//         <div style={{ display: "flex", gap: "8px" }}>
//           {archivedAssignments.length > 0 && (
//             <button
//               onClick={() => setShowArchived(v => !v)}
//               style={{
//                 padding: "9px 16px", borderRadius: "10px",
//                 border: "1px solid #e2e8f0", background: "#f8fafc",
//                 color: "#64748b", fontSize: "12px", fontWeight: "700",
//                 cursor: "pointer", fontFamily: "inherit",
//               }}
//             >
//               {showArchived ? "Hide Archived" : `📦 Archived (${archivedAssignments.length})`}
//             </button>
//           )}
//           <button style={btn.primary} onClick={openCreate}>+ New Assignment</button>
//         </div>
//       </div>




//         {/* Active assignments */}
//       {activeAssignments.length === 0 && !showArchived && !archivedOnly && (
//         <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "center", padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
//           <p style={{ fontSize: "48px", margin: "0 0 14px" }}>📋</p>
//           <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: "0 0 6px" }}>No assignments yet</p>
//           <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Create your first assignment to get started.</p>
//         </div>
//       )}

//       {/* Archived tab empty state */}
//       {archivedOnly && assignments.length === 0 && (
//         <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "center", padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
//           <p style={{ fontSize: "48px", margin: "0 0 14px" }}>📦</p>
//           <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: 0 }}>No archived assignments</p>
//         </div>
//       )}


//       {activeAssignments.map(renderAssignment)}

//       {/* Archived section */}
//       {showArchived && archivedAssignments.length > 0 && (
//         <div style={{ marginTop: "24px" }}>
//           <p style={{ fontSize: "13px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>
//             📦 Archived Assignments
//           </p>
//           {archivedAssignments.map(renderAssignment)}
//         </div>
//       )}


// {/* ── Create Modal ── */}
//       {createOpen && (
//         <div style={{
//           position: "fixed", inset: 0, zIndex: 500,
//           background: "rgba(0,0,0,0.5)",
//           display: "flex", alignItems: "stretch", justifyContent: "center",
//           padding: "20px",
//         }}>
//           <div style={{
//             background: "#fff", borderRadius: "20px",
//             width: "100%", maxWidth: "1100px",
//             display: "flex", flexDirection: "column",
//             overflow: "hidden",
//             boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//             fontFamily: "'Inter', system-ui, sans-serif",
//           }}>
//             {/* Header */}
//             <div style={{
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//               padding: "16px 24px", borderBottom: "1px solid #e2e8f0",
//               background: "#f8fafc", flexShrink: 0,
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{
//                   width: 40, height: 40, borderRadius: "12px",
//                   background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
//                   color: "#fff", fontSize: 18,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>📋</div>
//                 <div>
//                   <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", margin: 0 }}>Create New Assignment</p>
//                   <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Fill in the details below and publish</p>
//                 </div>
//               </div>
//               <button onClick={() => setCreateOpen(false)} style={{
//                 width: 36, height: 36, borderRadius: 10,
//                 border: "1px solid #e2e8f0", background: "#fff",
//                 fontSize: 18, cursor: "pointer", color: "#64748b",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>×</button>
//             </div>

//             {/* Body */}
//             <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
//               <AssignmentForm
//                 form={form} setForm={setForm}
//                 attachments={attachments} setAttachments={setAttachments}
//                 onAttachFile={handleAttachFile} assignmentId={null}
//               />
//             </div>

//             {/* Footer */}
//             <div style={{
//               display: "flex", justifyContent: "flex-end", gap: 10,
//               padding: "14px 24px", borderTop: "1px solid #e2e8f0",
//               background: "#f8fafc", flexShrink: 0,
//             }}>
//               <button onClick={() => setCreateOpen(false)} style={{
//                 padding: "10px 20px", borderRadius: 10,
//                 border: "1px solid #e2e8f0", background: "#fff",
//                 color: "#64748b", fontSize: 13, fontWeight: 700,
//                 cursor: "pointer", fontFamily: "inherit",
//               }}>Cancel</button>
//               <button onClick={handleCreate} disabled={saving} style={{
//                 padding: "10px 22px", borderRadius: 10, border: "none",
//                 background: saving ? "#93c5fd" : "linear-gradient(135deg,#3b82f6,#38bdf8)",
//                 color: "#fff", fontSize: 13, fontWeight: 700,
//                 cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
//               }}>
//                 {saving ? "Publishing…" : "✅ Publish Assignment"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}






// {/* ── Edit Modal ── */}
//       {editTarget && (
//         <div style={{
//           position: "fixed", inset: 0, zIndex: 500,
//           background: "rgba(0,0,0,0.5)",
//           display: "flex", alignItems: "stretch", justifyContent: "center",
//           padding: "20px",
//         }}>
//           <div style={{
//             background: "#fff", borderRadius: "20px",
//             width: "100%", maxWidth: "1100px",
//             display: "flex", flexDirection: "column",
//             overflow: "hidden",
//             boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//             fontFamily: "'Inter', system-ui, sans-serif",
//           }}>
//             {/* Header */}
//             <div style={{
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//               padding: "16px 24px", borderBottom: "1px solid #e2e8f0",
//               background: "#f8fafc", flexShrink: 0,
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{
//                   width: 40, height: 40, borderRadius: "12px",
//                   background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
//                   color: "#fff", fontSize: 18,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>✏️</div>
//                 <div>
//                   <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", margin: 0 }}>Edit Assignment</p>
//                   <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{editTarget?.title}</p>
//                 </div>
//               </div>
//               <button onClick={() => setEditTarget(null)} style={{
//                 width: 36, height: 36, borderRadius: 10,
//                 border: "1px solid #e2e8f0", background: "#fff",
//                 fontSize: 18, cursor: "pointer", color: "#64748b",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>×</button>
//             </div>

//             {/* Body */}
//             <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
//               <AssignmentForm
//                 form={form} setForm={setForm}
//                 attachments={attachments} setAttachments={setAttachments}
//                 onAttachFile={handleAttachFile} assignmentId={editTarget.id}
//               />
//             </div>

//             {/* Footer */}
//             <div style={{
//               display: "flex", justifyContent: "flex-end", gap: 10,
//               padding: "14px 24px", borderTop: "1px solid #e2e8f0",
//               background: "#f8fafc", flexShrink: 0,
//             }}>
//               <button onClick={() => setEditTarget(null)} style={{
//                 padding: "10px 20px", borderRadius: 10,
//                 border: "1px solid #e2e8f0", background: "#fff",
//                 color: "#64748b", fontSize: 13, fontWeight: 700,
//                 cursor: "pointer", fontFamily: "inherit",
//               }}>Cancel</button>
//               <button onClick={handleEditSave} disabled={saving} style={{
//                 padding: "10px 22px", borderRadius: 10, border: "none",
//                 background: saving ? "#93c5fd" : "linear-gradient(135deg,#3b82f6,#38bdf8)",
//                 color: "#fff", fontSize: 13, fontWeight: 700,
//                 cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
//               }}>
//                 {saving ? "Saving…" : "💾 Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


//       {/* ── Delete Confirmation ── */}
//       {deleteTarget && (
//         <ConfirmModal
//           title="Delete Assignment?"
//           message={
//             deleteTarget.gc_coursework_id
//               ? `"${deleteTarget.title}" will be permanently deleted from EssayGrade AND from Google Classroom. This cannot be undone.`
//               : `"${deleteTarget.title}" and all its submissions will be permanently deleted. This cannot be undone.`
//           }
//           confirmLabel={actionLoading ? "Deleting…" : "🗑️ Yes, Delete"}
//           confirmColor="#dc2626"
//           onConfirm={handleDelete}
//           onCancel={() => setDeleteTarget(null)}
//         />
//       )}

//       {/* ── Archive Confirmation ── */}
//       {archiveTarget && (
//         <ConfirmModal
//           title={archiveTarget.is_active === false ? "Restore Assignment?" : "Archive Assignment?"}
//           message={
//             archiveTarget.is_active === false
//               ? `"${archiveTarget.title}" will be made active again and visible to students.`
//               : `"${archiveTarget.title}" will be hidden from students and moved to the archive. Submissions are kept.`
//           }
//           confirmLabel={actionLoading ? "Working…" : archiveTarget.is_active === false ? "↩️ Restore" : "📦 Archive"}
//           confirmColor={archiveTarget.is_active === false ? "#16a34a" : "#64748b"}
//           onConfirm={handleArchive}
//           onCancel={() => setArchiveTarget(null)}
//         />
//       )}

//             {/* ── Assignment Detail Modal ── */}
//       {viewTarget && (
//         <AssignmentDetailModal
//           assignment={viewTarget}
//           submissions={submissions}
//           onClose={() => setViewTarget(null)}
//           onEdit={(a) => { openEdit(a); }}
//           onExport={handleExport}
//         />
//       )}
//     </div>
//   );
// }











// src/componets/teacher/AssignmentsTab.jsx
import { useState } from "react";
import { Badge, Icon, btn, colors } from "./shared.jsx";
import AssignmentForm from "./AssignmentForm.jsx";
import { apiFetch } from "./api.js";

// backwards-compat — shared.jsx exports COLORS but some spots may still use colors
export { colors };

const EMPTY_FORM = {
  title: "", description: "", instructions: "",
  referenceMaterial: "", max_score: 100, due_date: "",
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

// ── Shared modal wrapper ──────────────────────────────────────────────────────
// IMPORTANT: defined at module scope (outside AssignmentsTab) so React never
// re-creates this component type on re-render, which would unmount the form
// and drop focus after every keystroke.
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
        {/* Header */}
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
        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "26px 30px" }}>{children}</div>
        {/* Footer */}
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
  const openEdit = a => { setForm({ ...a, referenceMaterial: a.reference_material || "" }); setAttachments(a.attachments || []); setEditTarget(a); };

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
    if (Object.values(form.rubric).reduce((a, b) => a + b, 0) !== 100) { showToast("Rubric weights must total 100%.", "error"); return; }
    if (!classId) { showToast("No class selected.", "error"); return; }
    setSaving(true);
    try {
      const data = await apiFetch("/assignments/create", {
        method: "POST",
        body: JSON.stringify({
          class_id: classId, title: form.title, description: form.description || "",
          instructions: form.instructions, reference_material: form.referenceMaterial || "",
          max_score: form.max_score || 100, due_date: form.due_date, rubric: form.rubric,
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
    if (Object.values(form.rubric || {}).reduce((a, b) => a + b, 0) !== 100) { showToast("Rubric weights must total 100%.", "error"); return; }
    setSaving(true);
    try {
      await apiFetch("/assignments/update", {
        method: "POST",
        body: JSON.stringify({
          id: editTarget.id, title: form.title, description: form.description || "",
          instructions: form.instructions, reference_material: form.referenceMaterial || "",
          max_score: form.max_score || 100, due_date: form.due_date, rubric: form.rubric,
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
          onSave={handleCreate}
          saveLabel="Publish assignment"
          saving={saving}
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
          onSave={handleEditSave}
          saveLabel="Save changes"
          saving={saving}
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
