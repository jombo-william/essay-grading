


// src/components/teacher/TeacherDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { Toast } from "./shared.jsx";
import { apiFetch } from "./api.js";
import PendingTab        from "./PendingTab.jsx";
import AssignmentsTab    from "./AssignmentsTab.jsx";
import StudentsTab       from "./StudentsTab.jsx";
import { GradeModal, EditGradeModal } from "./GradeModals.jsx";
import SubmissionDetail  from "./SubmissionDetail.jsx";
// import ExamsTab from "./ExamsTab.jsx";
import IntegrationsTab from "./IntegrationsTab.jsx";

const TABS = [
  { id: "pending",     icon: "⏳", label: "Pending"     },
  { id: "assignments", icon: "📋", label: "Assignments"  },
  { id: "students",    icon: "👥", label: "Students"     },
  // { id: "exams", icon: "📝", label: "Exams" },
  { id: "archived",     icon: "📦", label: "Archived"      },
  { id: "integrations", icon: "🔗", label: "Integrations" },
];

const CLASS_PALETTES = [
  { bg: "linear-gradient(135deg,#3b82f6,#38bdf8)" },
  { bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)" },
  { bg: "linear-gradient(135deg,#10b981,#34d399)" },
  { bg: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
  { bg: "linear-gradient(135deg,#ef4444,#f87171)" },
  { bg: "linear-gradient(135deg,#06b6d4,#67e8f9)" },
];

export default function TeacherDashboard({ user, selectedClass, classIndex = 0, onBack, onChangeClass }) {
  const [tab,         setTab]         = useState("pending");
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState(null);   // ← FIX #4: persistent error state
  const [toast,       setToast]       = useState(null);

  // Modals
  const [gradeSub,     setGradeSub]     = useState(null);
  const [editGradeSub, setEditGradeSub] = useState(null);
  const [viewSub,      setViewSub]      = useState(null);
  const [gradeScore,   setGradeScore]   = useState("");
  const [gradeFB,      setGradeFB]      = useState("");
  const [editScore,    setEditScore]    = useState("");
  const [editFB,       setEditFB]       = useState("");

  const palette = CLASS_PALETTES[classIndex % CLASS_PALETTES.length];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── FIX #4: fetchAll now sets a visible, persistent error state ─────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const classParam = `?class_id=${selectedClass.id}`;
      const [aData, sData] = await Promise.all([
        apiFetch(`/assignments${classParam}`),
        apiFetch(`/submissions${classParam}`),
      ]);
      setAssignments(aData.assignments || []);
      setSubmissions(sData.submissions || []);
    } catch (err) {
      // Show in UI persistently — not just a toast that vanishes
      const msg = err.message || "Failed to load data. Check your connection.";
      setFetchError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [selectedClass.id]);

  useEffect(() => {
    setTab("pending");
    fetchAll();
  }, [fetchAll]);

  // ── FIX #3: only count submissions that are actually ready for teacher review
  const pending = submissions.filter(
    s => (s.status === "submitted" || s.status === "ai_graded") && s.final_score === null
  );

  const students = Array.from(
    submissions.reduce((map, s) => {
      if (!map.has(s.student_id))
        map.set(s.student_id, {
          id:    s.student_id,
          name:  s.student_name,
          email: s.student_email,
        });
      return map;
    }, new Map()).values()
  );

  const gradedSubs = submissions.filter(s => s.final_score !== null);
  const classAvg   = gradedSubs.length > 0
    ? Math.round(gradedSubs.reduce((acc, s) => acc + (s.final_score / s.max_score) * 100, 0) / gradedSubs.length)
    : null;

  // ── Grade handlers ───────────────────────────────────────────────────────
  const openGrade = sub => {
    setGradeSub(sub);
    setGradeScore(sub.ai_score ?? "");
    setGradeFB(sub.ai_feedback || "");
  };
  const openEdit = sub => {
    setEditGradeSub(sub);
    setEditScore(sub.final_score ?? "");
    setEditFB(sub.teacher_feedback || "");
  };

  // ── FIX #1: use short paths — apiFetch already prepends BASE_URL ────────
  const saveGrade = async () => {
    if (!gradeScore) { showToast("Please enter a score.", "error"); return; }
    try {
      await apiFetch("/submissions/grade", {          // ← was "/api/teacher/submissions/grade"
        method: "POST",
        body: JSON.stringify({
          submission_id: gradeSub.id,
          score:         Number(gradeScore),
          feedback:      gradeFB,
        }),
      });
      setGradeSub(null);
      showToast("✅ Essay graded successfully.");
      fetchAll();
    } catch (err) { showToast(err.message, "error"); }
  };

  const saveEditGrade = async () => {
    if (!editScore) { showToast("Please enter a score.", "error"); return; }
    try {
      await apiFetch("/submissions/grade", {          // ← was "/api/teacher/submissions/grade"
        method: "POST",
        body: JSON.stringify({
          submission_id: editGradeSub.id,
          score:         Number(editScore),
          feedback:      editFB,
        }),
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

      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>☁️</div>
          <div>
            <p style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b", margin: 0, lineHeight: 1.2 }}>
              EssayGrade AI
            </p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Teacher Portal</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
              color: "#fff", fontWeight: "800", fontSize: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {user?.name?.charAt(0) || "T"}
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
              {user?.name || "Teacher"}
            </span>
          </div>

          <button onClick={onChangeClass} style={{
            padding: "7px 14px", borderRadius: "10px",
            border: "1.5px solid #3b82f6", background: "#eff6ff",
            color: "#3b82f6", fontSize: "12px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            🏫 Switch Class
          </button>

          <button onClick={onBack} style={{
            padding: "7px 14px", borderRadius: "10px",
            border: "1px solid #e2e8f0", background: "#f8fafc",
            color: "#64748b", fontSize: "12px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            ← Logout
          </button>
        </div>
      </nav>

      {/* ── Class banner ─────────────────────────────────────────────────── */}
      <div style={{
        background: palette.bg,
        padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.75)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Current Class
          </p>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "#fff" }}>
            {selectedClass.name}
            {selectedClass.section && (
              <span style={{
                marginLeft: "10px", fontSize: "12px", fontWeight: "700",
                background: "rgba(255,255,255,0.25)", padding: "2px 10px", borderRadius: "20px",
              }}>
                {selectedClass.section}
              </span>
            )}
          </h2>
          {selectedClass.subject && (
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>
              📚 {selectedClass.subject}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "28px", fontWeight: "900", color: "#fff" }}>
            {selectedClass.total_students ?? students.length}
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.75)", fontWeight: "600" }}>
            Students Enrolled
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "28px 20px" }}>

        {/* ── FIX #4: Persistent fetch error banner ────────────────────── */}
        {fetchError && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: "16px", padding: "16px 20px",
            marginBottom: "20px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
          }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#dc2626" }}>
              ⚠️ {fetchError}
            </p>
            <button onClick={fetchAll} style={{
              padding: "7px 16px", borderRadius: "10px", border: "none",
              background: "#dc2626", color: "#fff",
              fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
              flexShrink: 0,
            }}>
              Retry
            </button>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: "18px", padding: "20px 22px",
              border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              <p style={{ fontSize: "26px", margin: "0 0 8px" }}>{s.icon}</p>
              <p style={{ fontSize: "26px", fontWeight: "900", color: "#1e293b", margin: "0 0 3px", lineHeight: 1 }}>
                {s.value}
              </p>
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
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: "10px 16px", borderRadius: "12px", border: "none",
                background: active ? palette.bg : "transparent",
                color: active ? "#fff" : "#64748b",
                fontWeight: "700", fontSize: "13px", cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              }}>
                {t.icon} {t.label}
                {t.id === "pending" && pending.length > 0 && (
                  <span style={{
                    background: active ? "rgba(255,255,255,0.3)" : "#fbbf24",
                    color: "#fff", borderRadius: "10px",
                    fontSize: "11px", fontWeight: "800",
                    padding: "1px 7px", marginLeft: "2px",
                  }}>
                    {pending.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "pending" && (
         
          <PendingTab
            pending={pending}
            loading={loading}
            onViewEssay={setViewSub}
            onGrade={() => fetchAll()}
          />

        )}
       

      {tab === "assignments" && (
          <AssignmentsTab
            assignments={assignments.filter(a => a.is_active !== false && a.is_active !== 0)}
            submissions={submissions}
            loading={loading}
            selectedClass={selectedClass}
            onCreated={fetchAll}
            onUpdated={fetchAll}
            showToast={showToast}
          />
        )}


        {tab === "students" && (
          <StudentsTab
            students={students}
            submissions={submissions}
            assignments={assignments}
            loading={loading}
            selectedClass={selectedClass}
            onGrade={openGrade}
            onEditGrade={openEdit}
          />
        )}

        {tab === "archived" && (
            <AssignmentsTab
              //assignments={assignments.filter(a => a.is_active === false)}
              assignments={assignments.filter(a => a.is_active === false || a.is_active === 0)}
              submissions={submissions}
              loading={loading}
              selectedClass={selectedClass}
              onCreated={fetchAll}
              onUpdated={fetchAll}
              showToast={showToast}
              archivedOnly={true}
            />
          )}

        {/* {tab === "exams" && (
        <ExamsTab selectedClass={selectedClass} showToast={showToast} />
          )} */}
              {tab === "integrations" && (
                  <IntegrationsTab
                    selectedClass={selectedClass}
                    showToast={showToast}
                    assignments={assignments}
                  />
                )}
      </div>

      {/* Modals */}
      {viewSub && (
        <SubmissionDetail
          sub={viewSub}
          user={user}
          onClose={() => setViewSub(null)}
          onGrade={openGrade}
          onEditGrade={openEdit}
        />
      )}
      {gradeSub && (
        <GradeModal
          sub={gradeSub}
          score={gradeScore}
          setScore={setGradeScore}
          feedback={gradeFB}
          setFeedback={setGradeFB}
          onSave={saveGrade}
          onClose={() => setGradeSub(null)}
        />
      )}
      {editGradeSub && (
        <EditGradeModal
          sub={editGradeSub}
          score={editScore}
          setScore={setEditScore}
          feedback={editFB}
          setFeedback={setEditFB}
          onSave={saveEditGrade}
          onClose={() => setEditGradeSub(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}