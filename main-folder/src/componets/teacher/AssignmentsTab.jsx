import { useState, useEffect } from "react";
import { Badge, btn } from "./shared.jsx";
import AssignmentForm from "./AssignmentForm.jsx";
import { apiFetch } from "./api.js";

const EMPTY_FORM = {
  title: "", description: "", instructions: "",
  referenceMaterial: "", max_score: 100, due_date: "",
  rubric: { content: 35, structure: 25, grammar: 20, evidence: 20 },
  moodle_course_id: null,
};

function ConfirmModal({ title, message, confirmLabel, confirmColor = "#ef4444", onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "32px 28px", maxWidth: "420px", width: "90%" }}>
        <p style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: "0 0 10px" }}>{title}</p>
        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: "0 0 28px" }}>{message}</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "9px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "9px 20px", borderRadius: "10px", border: "none", background: confirmColor, color: "#fff", cursor: "pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function AssignmentsTab({ assignments, submissions, loading, onCreated, onUpdated, showToast, selectedClassId, selectedClass, archivedOnly = false }) {
  const classId = selectedClassId ?? selectedClass?.id;
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [attachments, setAttachments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [moodleCourses, setMoodleCourses] = useState([]);
  const [moodleConnected, setMoodleConnected] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [syncingAssignment, setSyncingAssignment] = useState(null);
  const [moodleToken, setMoodleToken] = useState(null);
  const [showCourseSelect, setShowCourseSelect] = useState(null);

  useEffect(() => {
    loadMoodleCourses();
    const token = localStorage.getItem('moodle_token');
    if (token) setMoodleToken(token);
  }, []);

  const loadMoodleCourses = async () => {
    const moodleToken = localStorage.getItem('moodle_token');
    const moodleSiteUrl = localStorage.getItem('moodle_site_url');
    if (!moodleToken || !moodleSiteUrl) return;
    try {
      const response = await apiFetch(`/moodle/courses?moodle_token=${moodleToken}&site_url=${encodeURIComponent(moodleSiteUrl)}`);
      if (response.success && response.courses) {
        setMoodleCourses(response.courses);
        setMoodleConnected(true);
      }
    } catch (error) {
      console.error("Failed to load Moodle courses:", error);
    }
  };

  const openCreate = () => { setForm(EMPTY_FORM); setAttachments([]); setCreateOpen(true); };
  const openEdit = a => { setForm({ ...a, referenceMaterial: a.reference_material || "", moodle_course_id: a.moodle_course_id || null }); setAttachments(a.attachments || []); setEditTarget(a); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiFetch("/assignments/delete", { method: "POST", body: JSON.stringify({ id: deleteTarget.id }) });
      setDeleteTarget(null);
      showToast("✅ Assignment deleted.");
      onUpdated();
    } catch (err) { showToast(err.message, "error"); }
    finally { setActionLoading(false); }
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setActionLoading(true);
    try {
      await apiFetch("/assignments/archive", { method: "POST", body: JSON.stringify({ id: archiveTarget.id }) });
      setArchiveTarget(null);
      showToast("✅ Done.");
      onUpdated();
    } catch (err) { showToast(err.message, "error"); }
    finally { setActionLoading(false); }
  };

  const handleSyncToMoodle = async (assignment, courseId) => {
    setSyncingAssignment(assignment.id);
    try {
      const response = await apiFetch("/moodle/sync-assignment", {
        method: "POST",
        body: JSON.stringify({
          assignment_id: assignment.id,
          moodle_course_id: courseId,
          moodle_token: moodleToken
        })
      });
      
      if (response.success) {
        showToast(`✅ ${response.message}`, "success");
        onUpdated();
      } else {
        showToast(response.message || "Sync failed", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to sync to Moodle", "error");
    } finally {
      setSyncingAssignment(null);
      setShowCourseSelect(null);
    }
  };

  const handleExport = (a) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>${a.title}</title>
      <style>body { font-family: sans-serif; max-width: 750px; margin: 40px auto; }</style>
      </head><body>
      <h1>${a.title}</h1>
      <p>Max Score: ${a.max_score} pts</p>
      <div>${a.instructions}</div>
      </body></html>
    `);
    win.document.close();
  };

  const filteredAssignments = (assignments || []).filter(a => archivedOnly ? a.is_active === false : a.is_active !== false);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: "18px" }}>⏳ Loading assignments...</div>;
  }

  return (
    <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0 }}>
            {archivedOnly ? "📦 Archived Assignments" : "📋 Assignments"}
          </h3>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>
            {filteredAssignments.length} total
          </p>
        </div>
        {!archivedOnly && (
          <button onClick={openCreate} style={{ padding: "8px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
            + Create Assignment
          </button>
        )}
      </div>

      {filteredAssignments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          📭 No assignments found
        </div>
      ) : (
        <div>
          {filteredAssignments.map(a => {
            const submissionCount = (submissions || []).filter(s => s.assignment_id === a.id).length;
            const gradedCount = (submissions || []).filter(s => s.assignment_id === a.id && s.final_score !== null).length;
            
            return (
              <div key={a.id} style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "800", margin: 0 }}>{a.title}</h4>
                      {a.is_active === false && (
                        <span style={{ fontSize: "10px", background: "#e2e8f0", padding: "2px 8px", borderRadius: "12px" }}>Archived</span>
                      )}
                      {a.synced_to_moodle && (
                        <span style={{ fontSize: "10px", background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: "12px" }}>✅ Synced to Moodle</span>
                      )}
                    </div>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px" }}>
                      📊 Max Score: {a.max_score} pts • 📝 {submissionCount} submissions • ✅ {gradedCount} graded
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => openEdit(a)} style={{ padding: "5px 12px", fontSize: "11px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>✏️ Edit</button>
                      <button onClick={() => handleExport(a)} style={{ padding: "5px 12px", fontSize: "11px", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>📄 Export</button>
                      
                      {!a.synced_to_moodle && moodleConnected && moodleCourses.length > 0 && (
                        showCourseSelect === a.id ? (
                          <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                            <select 
                              onChange={(e) => handleSyncToMoodle(a, parseInt(e.target.value))}
                              style={{ padding: "5px 10px", fontSize: "11px", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                              defaultValue=""
                            >
                              <option value="" disabled>Select course...</option>
                              {moodleCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.fullname}</option>
                              ))}
                            </select>
                            <button onClick={() => setShowCourseSelect(null)} style={{ padding: "5px 10px", fontSize: "11px", background: "#94a3b8", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowCourseSelect(a.id)} 
                            disabled={syncingAssignment === a.id}
                            style={{ padding: "5px 12px", fontSize: "11px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                          >
                            {syncingAssignment === a.id ? "⏳ Syncing..." : "🔄 Sync to Moodle"}
                          </button>
                        )
                      )}
                      
                      {!archivedOnly && a.is_active !== false && (
                        <button onClick={() => setArchiveTarget(a)} style={{ padding: "5px 12px", fontSize: "11px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>📦 Archive</button>
                      )}
                      <button onClick={() => setDeleteTarget(a)} style={{ padding: "5px 12px", fontSize: "11px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal title="Delete Assignment" message={`Are you sure you want to delete "${deleteTarget.title}"? This will also delete all submissions.`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      {archiveTarget && (
        <ConfirmModal title="Archive Assignment" message={`Archive "${archiveTarget.title}"? It will be hidden from active assignments.`} confirmLabel="Archive" confirmColor="#f59e0b" onConfirm={handleArchive} onCancel={() => setArchiveTarget(null)} />
      )}

      {(createOpen || editTarget) && (
        <AssignmentForm isOpen={true} onClose={() => { setCreateOpen(false); setEditTarget(null); }} initialData={form} isEdit={!!editTarget} attachments={attachments} classId={classId} onSuccess={() => { onCreated(); setCreateOpen(false); setEditTarget(null); showToast(editTarget ? "✅ Assignment updated." : "✅ Assignment created."); }} />
      )}
    </div>
  );
}
