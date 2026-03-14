// src/componets/teacher/TeacherDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { Toast, btn } from "./shared.jsx";
import { apiFetch } from "./api.js";
import PendingTab        from "./PendingTab.jsx";
import AssignmentsTab    from "./AssignmentsTab.jsx";
import StudentsTab       from "./StudentsTab.jsx";
import { GradeModal, EditGradeModal } from "./GradeModals.jsx";
import SubmissionDetail  from "./SubmissionDetail.jsx";

const TABS = [
  { id: "pending",     icon: "⏳", label: "Pending"     },
  { id: "assignments", icon: "📋", label: "Assignments"  },
  { id: "students",    icon: "👥", label: "Students"     },
];

export default function TeacherDashboard({ user, onBack }) {
  const [tab,         setTab]         = useState("pending");
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState(null);

  // Modals
  const [gradeSub,     setGradeSub]     = useState(null);
  const [editGradeSub, setEditGradeSub] = useState(null);
  const [viewSub,      setViewSub]      = useState(null);
  const [gradeScore,   setGradeScore]   = useState("");
  const [gradeFB,      setGradeFB]      = useState("");
  const [editScore,    setEditScore]    = useState("");
  const [editFB,       setEditFB]       = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [aData, sData] = await Promise.all([
        apiFetch("/get_assignments.php"),
        apiFetch("/get_submissions.php"),
      ]);
      setAssignments(aData.assignments || []);
      setSubmissions(sData.submissions || []);
    } catch (err) {
      showToast(err.message || "Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Derived data
  
const pending = submissions.filter(s =>
  s.status !== "graded" && !s.final_score
);
 
const students = Array.from(
    submissions.reduce((map, s) => {
      if (!map.has(s.student_id)) map.set(s.student_id, { id: s.student_id, name: s.student_name, email: s.student_email });
      return map;
    }, new Map()).values()
  );
  const gradedSubs = submissions.filter(s => s.final_score !== null);
  const classAvg   = gradedSubs.length > 0
    ? Math.round(gradedSubs.reduce((acc, s) => acc + (s.final_score / s.max_score) * 100, 0) / gradedSubs.length)
    : null;

  // Grade handlers
  const openGrade = sub => { setGradeSub(sub); setGradeScore(sub.ai_score ?? ""); setGradeFB(sub.ai_feedback || ""); };
  const openEdit  = sub => { setEditGradeSub(sub); setEditScore(sub.final_score ?? ""); setEditFB(sub.teacher_feedback || ""); };

  const saveGrade = async () => {
    if (!gradeScore) { showToast("Please enter a score.", "error"); return; }
    try {
      await apiFetch("/override_grade.php", {
        method: "POST",
        body: JSON.stringify({ submission_id: gradeSub.id, score: gradeScore, feedback: gradeFB }),
      });
      setGradeSub(null);
      showToast("✅ Essay graded successfully.");
      fetchAll();
    } catch (err) { showToast(err.message, "error"); }
  };

  const saveEditGrade = async () => {
    if (!editScore) { showToast("Please enter a score.", "error"); return; }
    try {
      await apiFetch("/override_grade.php", {
        method: "POST",
        body: JSON.stringify({ submission_id: editGradeSub.id, score: editScore, feedback: editFB }),
      });
      setEditGradeSub(null);
      showToast("✅ Grade updated.");
      fetchAll();
    } catch (err) { showToast(err.message, "error"); }
  };

  const stats = [
    { icon: "📋", label: "Assignments", value: assignments.length },
    { icon: "⏳", label: "Pending",     value: pending.length     },
    { icon: "📝", label: "Submissions", value: submissions.length  },
    { icon: "📊", label: "Class Avg",   value: classAvg !== null ? `${classAvg}%` : "—" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Top nav */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>☁️</div>
          <div>
            <p style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b", margin: 0, lineHeight: 1.2 }}>EssayGrade AI</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Teacher Portal</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #38bdf8)", color: "#fff", fontWeight: "800", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {user?.name?.charAt(0) || "T"}
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{user?.name || "Teacher"}</span>
          </div>
          <button onClick={onBack}
            style={{ padding: "7px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
            ← Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "28px 20px" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: "18px", padding: "20px 22px",
              border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              <p style={{ fontSize: "26px", margin: "0 0 8px" }}>{s.icon}</p>
              <p style={{ fontSize: "26px", fontWeight: "900", color: "#1e293b", margin: "0 0 3px", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "6px",
          background: "#fff", borderRadius: "16px", padding: "6px",
          border: "1px solid #e2e8f0", marginBottom: "24px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: "10px 16px", borderRadius: "12px", border: "none",
                  background: active ? "linear-gradient(135deg, #3b82f6, #38bdf8)" : "transparent",
                  color: active ? "#fff" : "#64748b",
                  fontWeight: "700", fontSize: "13px", cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}
              >
                {t.icon} {t.label}
                {t.id === "pending" && pending.length > 0 && (
                  <span style={{ background: active ? "rgba(255,255,255,0.3)" : "#fbbf24", color: active ? "#fff" : "#fff", borderRadius: "10px", fontSize: "11px", fontWeight: "800", padding: "1px 7px", marginLeft: "2px" }}>
                    {pending.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "pending" && (
          <PendingTab pending={pending} loading={loading} onViewEssay={setViewSub} onGrade={openGrade} />
        )}
        {tab === "assignments" && (
          <AssignmentsTab
            assignments={assignments} submissions={submissions} loading={loading}
            onCreated={fetchAll} onUpdated={fetchAll} showToast={showToast}
          />
        )}
        {tab === "students" && (
          <StudentsTab students={students} submissions={submissions} assignments={assignments} loading={loading} />
        )}
      </div>

      {/* Modals */}
      {viewSub && (
        <SubmissionDetail sub={viewSub} onClose={() => setViewSub(null)} onGrade={openGrade} onEditGrade={openEdit} />
      )}
      {gradeSub && (
        <GradeModal sub={gradeSub} score={gradeScore} setScore={setGradeScore} feedback={gradeFB} setFeedback={setGradeFB} onSave={saveGrade} onClose={() => setGradeSub(null)} />
      )}
      {editGradeSub && (
        <EditGradeModal sub={editGradeSub} score={editScore} setScore={setEditScore} feedback={editFB} setFeedback={setEditFB} onSave={saveEditGrade} onClose={() => setEditGradeSub(null)} />
      )}

      <Toast toast={toast} />
    </div>
  );
}