

// src/componets/teacher/TeacherDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { C, Icon, Toast } from '../student/shared.jsx';
import { apiFetch } from "./api.js";
import PendingTab        from "./PendingTab.jsx";
import AssignmentsTab    from "./AssignmentsTab.jsx";
import StudentsTab       from "./StudentsTab.jsx";
import { GradeModal, EditGradeModal } from "./GradeModals.jsx";
import SubmissionDetail  from "./SubmissionDetail.jsx";
import IntegrationsTab   from "./IntegrationsTab.jsx";

const TABS = [
  { id: "assignments",  icon: "clipboard-list", label: "Assignments"  },
  { id: "pending",      icon: "clock-hour-4",   label: "Pending"      },
  { id: "students",     icon: "users",          label: "Students"     },
  { id: "archived",     icon: "archive",        label: "Archived"     },
  { id: "integrations", icon: "plug-connected", label: "Integrations" },
];

const CLASS_PALETTES = [
  { bg: "#1A3A6B", accent: "#E6F1FB" },
  { bg: "#3C3489", accent: "#EEEDFE" },
  { bg: "#1A5C3A", accent: "#EAF3DE" },
  { bg: "#854F0B", accent: "#FAEEDA" },
  { bg: "#7B1F1F", accent: "#FCEBEB" },
  { bg: "#0A4A5C", accent: "#E0F5FA" },
];

const css = `
  @keyframes spin { to { transform: rotate(360deg); } }

  .td-root {
    min-height: 100vh;
    background: #F8F7FF;
    font-family: 'DM Sans','Segoe UI',sans-serif;
  }

  .td-nav {
    background: #fff;
    border-bottom: 1px solid #E8E6FF;
    padding: 0 20px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 0 #E8E6FF;
    gap: 8px;
    box-sizing: border-box;
  }
  .td-nav-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .td-nav-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

  .td-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 8px;
    font-size: 12px; font-weight: 500; cursor: pointer;
    font-family: inherit; white-space: nowrap; flex-shrink: 0;
  }
  .td-btn-ghost { background: none; border: 1px solid #ECECF2; color: #6B6890; }
  .td-btn-muted { background: #F1EFE8; border: 1px solid #D3D1C7; color: #5F5E5A; }
  .td-lbl { display: inline; }

  .td-banner {
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .td-main {
    max-width: 920px;
    margin: 0 auto;
    padding: 20px 16px 64px;
    box-sizing: border-box;
  }

  .td-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .td-stat {
    background: #fff;
    border-radius: 12px;
    padding: 14px 16px;
    border: 1px solid #ECECF2;
    box-sizing: border-box;
  }
  .td-stat-icon {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
  }

  .td-tabbar {
    display: flex;
    gap: 2px;
    background: #F1EFE8;
    border-radius: 11px;
    padding: 3px;
    margin-bottom: 20px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    box-sizing: border-box;
    width: 100%;
  }
  .td-tabbar::-webkit-scrollbar { display: none; }

  .td-tab {
    padding: 7px 13px;
    border-radius: 9px;
    border: none;
    font-size: 13px;
    cursor: pointer;
    font-family: inherit;
    display: flex; align-items: center; gap: 5px;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.12s;
  }
  .td-badge {
    font-size: 10px; font-weight: 700;
    padding: 1px 6px; border-radius: 8px;
    background: #FAEEDA; color: #854F0B;
  }

  .td-error {
    background: #FCEBEB; border: 1px solid #F7C1C1;
    border-radius: 12px; padding: 12px 16px; margin-bottom: 18px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 10px; flex-wrap: wrap;
  }

  /* ── Tablet ── */
  @media (max-width: 700px) {
    .td-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  }

  /* ── Mobile ── */
  @media (max-width: 480px) {
    .td-nav { padding: 0 12px; }
    .td-lbl { display: none; }
    .td-btn { padding: 6px 9px; }

    .td-banner { padding: 14px 14px; gap: 8px; }

    .td-main { padding: 14px 10px 64px; }

    .td-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 14px; }
    .td-stat { padding: 11px 12px; }
    .td-stat-icon { width: 30px; height: 30px; margin-bottom: 8px; }

    .td-tab { padding: 7px 10px; font-size: 12px; }
    .td-tabbar { border-radius: 9px; }
  }

  @media (max-width: 340px) {
    .td-tab { padding: 6px 8px; font-size: 11px; gap: 3px; }
  }
`;

export default function TeacherDashboard({ user, selectedClass, classIndex = 0, onBack, onChangeClass }) {
  const [tab,         setTab]         = useState("pending");
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState(null);
  const [toast,       setToast]       = useState(null);

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

  const pending = submissions.filter(
    s => (s.status === "submitted" || s.status === "ai_graded") && s.final_score === null
  );

  const students = Array.from(
    submissions.reduce((map, s) => {
      if (!map.has(s.student_id))
        map.set(s.student_id, { id: s.student_id, name: s.student_name, email: s.student_email });
      return map;
    }, new Map()).values()
  );

  const gradedSubs = submissions.filter(s => s.final_score !== null);
  const classAvg = gradedSubs.length > 0
    ? Math.round(gradedSubs.reduce((acc, s) => acc + (s.final_score / s.max_score) * 100, 0) / gradedSubs.length)
    : null;

  const openGrade = sub => { setGradeSub(sub); setGradeScore(sub.ai_score ?? ""); setGradeFB(sub.ai_feedback || ""); };
  const openEdit  = sub => { setEditGradeSub(sub); setEditScore(sub.final_score ?? ""); setEditFB(sub.teacher_feedback || ""); };

  const saveGrade = async () => {
    if (!gradeScore) { showToast("Please enter a score.", "error"); return; }
    try {
      await apiFetch("/submissions/grade", {
        method: "POST",
        body: JSON.stringify({ submission_id: gradeSub.id, score: Number(gradeScore), feedback: gradeFB }),
      });
      setGradeSub(null);
      showToast("Grade saved successfully.");
      fetchAll();
    } catch (err) { showToast(err.message, "error"); }
  };

  const saveEditGrade = async () => {
    if (!editScore) { showToast("Please enter a score.", "error"); return; }
    try {
      await apiFetch("/submissions/grade", {
        method: "POST",
        body: JSON.stringify({ submission_id: editGradeSub.id, score: Number(editScore), feedback: editFB }),
      });
      setEditGradeSub(null);
      showToast("Grade updated.");
      fetchAll();
    } catch (err) { showToast(err.message, "error"); }
  };

  const stats = [
    { icon: "clipboard-list", label: "Assignments", value: assignments.length,                   color: "#185FA5", bg: "#E6F1FB" },
    { icon: "clock-hour-4",   label: "Pending",     value: pending.length,                       color: "#854F0B", bg: "#FAEEDA" },
    { icon: "file-text",      label: "Submissions", value: submissions.length,                    color: "#3C3489", bg: "#EEEDFE" },
    { icon: "chart-bar",      label: "Class Avg",   value: classAvg !== null ? `${classAvg}%` : "—", color: "#3B6D11", bg: "#EAF3DE" },
  ];

  return (
    <div className="td-root">
      <style>{css}</style>
      <Toast toast={toast} />

      {/* ── Nav ── */}
      <nav className="td-nav">
        <div className="td-nav-brand">
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: palette.bg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon name="pencil" size={16} style={{ color: palette.accent }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: "#1A1830", margin: 0, lineHeight: 1.2 }}>EssayGrade</p>
            <p style={{ fontSize: 11, color: "#8884A8", margin: 0 }}>Teacher Portal</p>
          </div>
        </div>

        <div className="td-nav-actions">
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#F8F7FF", border: "1px solid #E8E6FF",
            borderRadius: 20, padding: "4px 10px 4px 4px", flexShrink: 0,
          }}>
            <div style={{
              width: 24, height: 24, background: palette.bg, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: palette.accent,
            }}>
              {(user?.name || "T").charAt(0).toUpperCase()}
            </div>
            <span className="td-lbl" style={{ fontSize: 13, color: "#1A1830", fontWeight: 500 }}>
              {user?.name || "Teacher"}
            </span>
          </div>

          <button className="td-btn td-btn-muted" onClick={onChangeClass}>
            <Icon name="building-community" size={13} />
            <span className="td-lbl">Switch class</span>
          </button>

          <button className="td-btn td-btn-ghost" onClick={onBack}>
            <Icon name="door-exit" size={13} />
            <span className="td-lbl">Logout</span>
          </button>
        </div>
      </nav>

      {/* ── Banner ── */}
      <div className="td-banner" style={{ background: palette.bg }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 600, color: `${palette.accent}99`, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Current class
          </p>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: palette.accent, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {selectedClass.name}
            {selectedClass.section && (
              <span style={{
                fontSize: 11, fontWeight: 600,
                background: "rgba(255,255,255,0.15)", color: palette.accent,
                padding: "2px 9px", borderRadius: 20,
                border: `1px solid ${palette.accent}33`,
              }}>
                {selectedClass.section}
              </span>
            )}
          </h2>
          {selectedClass.subject && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: `${palette.accent}CC`, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="book" size={13} style={{ color: `${palette.accent}99` }} />
              {selectedClass.subject}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: palette.accent, lineHeight: 1 }}>
            {selectedClass.total_students ?? students.length}
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 11, color: `${palette.accent}99`, fontWeight: 500 }}>
            students
          </p>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="td-main">

        {fetchError && (
          <div className="td-error">
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <Icon name="alert-circle" size={16} style={{ color: "#A32D2D", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#A32D2D" }}>{fetchError}</p>
            </div>
            <button onClick={fetchAll} style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: "#A32D2D", color: "#fff", fontSize: 12, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
            }}>
              <Icon name="refresh" size={12} style={{ color: "#fff" }} />
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="td-stats">
          {stats.map(s => (
            <div key={s.label} className="td-stat">
              <div className="td-stat-icon" style={{ background: s.bg }}>
                <Icon name={s.icon} size={16} style={{ color: s.color }} />
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1A1830", margin: "0 0 2px", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#8884A8", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="td-tabbar">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                className="td-tab"
                onClick={() => setTab(t.id)}
                style={{
                  background: active ? "#fff" : "transparent",
                  color: active ? "#1A1830" : "#6B6890",
                  fontWeight: active ? 600 : 400,
                  boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                <Icon name={t.icon} size={14} />
                {t.label}
                {t.id === "pending" && pending.length > 0 && (
                  <span className="td-badge">{pending.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {tab === "pending" && (
          <PendingTab
            pending={pending}
            loading={loading}
            onViewEssay={setViewSub}
            onGrade={() => fetchAll()}
            classId={selectedClass.id}
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
          sub={viewSub} user={user}
          onClose={() => setViewSub(null)}
          onGrade={openGrade} onEditGrade={openEdit}
        />
      )}
      {gradeSub && (
        <GradeModal
          sub={gradeSub} score={gradeScore} setScore={setGradeScore}
          feedback={gradeFB} setFeedback={setGradeFB}
          onSave={saveGrade} onClose={() => setGradeSub(null)}
        />
      )}
      {editGradeSub && (
        <EditGradeModal
          sub={editGradeSub} score={editScore} setScore={setEditScore}
          feedback={editFB} setFeedback={setEditFB}
          onSave={saveEditGrade} onClose={() => setEditGradeSub(null)}
        />
      )}
    </div>
  );
}