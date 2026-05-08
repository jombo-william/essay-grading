


// // src/components/teacher/TeacherDashboard.jsx
// import { useState, useEffect, useCallback } from "react";
// import { Toast } from "./shared.jsx";
// import { apiFetch } from "./api.js";
// import PendingTab        from "./PendingTab.jsx";
// import AssignmentsTab    from "./AssignmentsTab.jsx";
// import StudentsTab       from "./StudentsTab.jsx";
// import { GradeModal, EditGradeModal } from "./GradeModals.jsx";
// import SubmissionDetail  from "./SubmissionDetail.jsx";
// // import ExamsTab from "./ExamsTab.jsx";
// import IntegrationsTab from "./IntegrationsTab.jsx";
// import { GoGraph } from "react-icons/go";

// const TABS = [
//   { id: "pending",     icon: "⏳", label: "Pending"     },
//   { id: "assignments", icon: "📋", label: "Assignments"  },
//   { id: "students",    icon: "👥", label: "Students"     },
//   // { id: "exams", icon: "📝", label: "Exams" },
//   { id: "archived",     icon: "📦", label: "Archived"      },
//   { id: "integrations", icon: "🔗", label: "Integrations" },
// ];

// const CLASS_PALETTES = [
//   { bg: "linear-gradient(135deg,#3b82f6,#38bdf8)" },
//   { bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)" },
//   { bg: "linear-gradient(135deg,#10b981,#34d399)" },
//   { bg: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
//   { bg: "linear-gradient(135deg,#ef4444,#f87171)" },
//   { bg: "linear-gradient(135deg,#06b6d4,#67e8f9)" },
// ];

// export default function TeacherDashboard({ user, selectedClass, classIndex = 0, onBack, onChangeClass }) {
//   const [tab,         setTab]         = useState("pending");
//   const [assignments, setAssignments] = useState([]);
//   const [submissions, setSubmissions] = useState([]);
//   const [loading,     setLoading]     = useState(true);
//   const [fetchError,  setFetchError]  = useState(null);   // ← FIX #4: persistent error state
//   const [toast,       setToast]       = useState(null);

//   // Modals
//   const [gradeSub,     setGradeSub]     = useState(null);
//   const [editGradeSub, setEditGradeSub] = useState(null);
//   const [viewSub,      setViewSub]      = useState(null);
//   const [gradeScore,   setGradeScore]   = useState("");
//   const [gradeFB,      setGradeFB]      = useState("");
//   const [editScore,    setEditScore]    = useState("");
//   const [editFB,       setEditFB]       = useState("");

//   const palette = CLASS_PALETTES[classIndex % CLASS_PALETTES.length];

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   // ── FIX #4: fetchAll now sets a visible, persistent error state ─────────
//   const fetchAll = useCallback(async () => {
//     setLoading(true);
//     setFetchError(null);
//     try {
//       const classParam = `?class_id=${selectedClass.id}`;
//       const [aData, sData] = await Promise.all([
//         apiFetch(`/assignments${classParam}`),
//         apiFetch(`/submissions${classParam}`),
//       ]);
//       setAssignments(aData.assignments || []);
//       setSubmissions(sData.submissions || []);
//     } catch (err) {
//       // Show in UI persistently — not just a toast that vanishes
//       const msg = err.message || "Failed to load data. Check your connection.";
//       setFetchError(msg);
//       showToast(msg, "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedClass.id]);

//   useEffect(() => {
//     setTab("pending");
//     fetchAll();
//   }, [fetchAll]);

//   // ── FIX #3: only count submissions that are actually ready for teacher review
//   const pending = submissions.filter(
//     s => (s.status === "submitted" || s.status === "ai_graded") && s.final_score === null
//   );

//   const students = Array.from(
//     submissions.reduce((map, s) => {
//       if (!map.has(s.student_id))
//         map.set(s.student_id, {
//           id:    s.student_id,
//           name:  s.student_name,
//           email: s.student_email,
//         });
//       return map;
//     }, new Map()).values()
//   );

//   const gradedSubs = submissions.filter(s => s.final_score !== null);
//   const classAvg   = gradedSubs.length > 0
//     ? Math.round(gradedSubs.reduce((acc, s) => acc + (s.final_score / s.max_score) * 100, 0) / gradedSubs.length)
//     : null;

//   // ── Grade handlers ───────────────────────────────────────────────────────
//   const openGrade = sub => {
//     setGradeSub(sub);
//     setGradeScore(sub.ai_score ?? "");
//     setGradeFB(sub.ai_feedback || "");
//   };
//   const openEdit = sub => {
//     setEditGradeSub(sub);
//     setEditScore(sub.final_score ?? "");
//     setEditFB(sub.teacher_feedback || "");
//   };

//   // ── FIX #1: use short paths — apiFetch already prepends BASE_URL ────────
//   const saveGrade = async () => {
//     if (!gradeScore) { showToast("Please enter a score.", "error"); return; }
//     try {
//       await apiFetch("/submissions/grade", {          // ← was "/api/teacher/submissions/grade"
//         method: "POST",
//         body: JSON.stringify({
//           submission_id: gradeSub.id,
//           score:         Number(gradeScore),
//           feedback:      gradeFB,
//         }),
//       });
//       setGradeSub(null);
//       showToast("✅ Essay graded successfully.");
//       fetchAll();
//     } catch (err) { showToast(err.message, "error"); }
//   };

//   const saveEditGrade = async () => {
//     if (!editScore) { showToast("Please enter a score.", "error"); return; }
//     try {
//       await apiFetch("/submissions/grade", {          // ← was "/api/teacher/submissions/grade"
//         method: "POST",
//         body: JSON.stringify({
//           submission_id: editGradeSub.id,
//           score:         Number(editScore),
//           feedback:      editFB,
//         }),
//       });
//       setEditGradeSub(null);
//       showToast("✅ Grade updated.");
//       fetchAll();
//     } catch (err) { showToast(err.message, "error"); }
//   };

//   const stats = [
//     { icon: "📋", label: "Assignments", value: assignments.length },
//     { icon: "⏳", label: "Pending",     value: pending.length     },
//     { icon: "📝", label: "Submissions", value: submissions.length  },
//     { icon:<GoGraph />, label: "Class Avg",   value: classAvg !== null ? `${classAvg}%` : "—" },
//   ];

//   return (
//     <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', system-ui, sans-serif" }}>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

//       {/* ── Top nav ──────────────────────────────────────────────────────── */}
//       <nav style={{
//         background: "#fff", borderBottom: "1px solid #e2e8f0",
//         padding: "0 24px", height: "60px",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         position: "sticky", top: 0, zIndex: 100,
//         boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <div style={{
//             width: "34px", height: "34px", borderRadius: "10px",
//             background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
//             display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
//           }}>☁️</div>
//           <div>
//             <p style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b", margin: 0, lineHeight: 1.2 }}>
//               EssayGrade AI
//             </p>
//             <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Teacher Portal</p>
//           </div>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <div style={{
//               width: "34px", height: "34px", borderRadius: "50%",
//               background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
//               color: "#fff", fontWeight: "800", fontSize: "14px",
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//               {user?.name?.charAt(0) || "T"}
//             </div>
//             <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
//               {user?.name || "Teacher"}
//             </span>
//           </div>

//           <button onClick={onChangeClass} style={{
//             padding: "7px 14px", borderRadius: "10px",
//             border: "1.5px solid #3b82f6", background: "#eff6ff",
//             color: "#3b82f6", fontSize: "12px", fontWeight: "700",
//             cursor: "pointer", fontFamily: "inherit",
//             display: "flex", alignItems: "center", gap: "5px",
//           }}>
//             🏫 Switch Class
//           </button>

//           <button onClick={onBack} style={{
//             padding: "7px 14px", borderRadius: "10px",
//             border: "1px solid #e2e8f0", background: "#f8fafc",
//             color: "#64748b", fontSize: "12px", fontWeight: "700",
//             cursor: "pointer", fontFamily: "inherit",
//           }}>
//             ← Logout
//           </button>
//         </div>
//       </nav>

//       {/* ── Class banner ─────────────────────────────────────────────────── */}
//       <div style={{
//         background: palette.bg,
//         padding: "20px 24px",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//       }}>
//         <div>
//           <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.75)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
//             Current Class
//           </p>
//           <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "#fff" }}>
//             {selectedClass.name}
//             {selectedClass.section && (
//               <span style={{
//                 marginLeft: "10px", fontSize: "12px", fontWeight: "700",
//                 background: "rgba(255,255,255,0.25)", padding: "2px 10px", borderRadius: "20px",
//               }}>
//                 {selectedClass.section}
//               </span>
//             )}
//           </h2>
//           {selectedClass.subject && (
//             <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>
//               📚 {selectedClass.subject}
//             </p>
//           )}
//         </div>
//         <div style={{ textAlign: "right" }}>
//           <p style={{ margin: 0, fontSize: "28px", fontWeight: "900", color: "#fff" }}>
//             {selectedClass.total_students ?? students.length}
//           </p>
//           <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.75)", fontWeight: "600" }}>
//             Students Enrolled
//           </p>
//         </div>
//       </div>

//       <div style={{ maxWidth: "880px", margin: "0 auto", padding: "28px 20px" }}>

//         {/* ── FIX #4: Persistent fetch error banner ────────────────────── */}
//         {fetchError && (
//           <div style={{
//             background: "#fef2f2", border: "1px solid #fecaca",
//             borderRadius: "16px", padding: "16px 20px",
//             marginBottom: "20px",
//             display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
//           }}>
//             <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#dc2626" }}>
//               ⚠️ {fetchError}
//             </p>
//             <button onClick={fetchAll} style={{
//               padding: "7px 16px", borderRadius: "10px", border: "none",
//               background: "#dc2626", color: "#fff",
//               fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
//               flexShrink: 0,
//             }}>
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Stats row */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
//           {stats.map(s => (
//             <div key={s.label} style={{
//               background: "#fff", borderRadius: "18px", padding: "20px 22px",
//               border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
//             }}>
//               <p style={{ fontSize: "26px", margin: "0 0 8px" }}>{s.icon}</p>
//               <p style={{ fontSize: "26px", fontWeight: "900", color: "#1e293b", margin: "0 0 3px", lineHeight: 1 }}>
//                 {s.value}
//               </p>
//               <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", margin: 0 }}>{s.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Tabs */}
//         <div style={{
//           display: "flex", gap: "6px",
//           background: "#fff", borderRadius: "16px", padding: "6px",
//           border: "1px solid #e2e8f0", marginBottom: "24px",
//           boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
//         }}>
//           {TABS.map(t => {
//             const active = tab === t.id;
//             return (
//               <button key={t.id} onClick={() => setTab(t.id)} style={{
//                 flex: 1, padding: "10px 16px", borderRadius: "12px", border: "none",
//                 background: active ? palette.bg : "transparent",
//                 color: active ? "#fff" : "#64748b",
//                 fontWeight: "700", fontSize: "13px", cursor: "pointer",
//                 fontFamily: "inherit", transition: "all 0.2s",
//                 display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//               }}>
//                 {t.icon} {t.label}
//                 {t.id === "pending" && pending.length > 0 && (
//                   <span style={{
//                     background: active ? "rgba(255,255,255,0.3)" : "#fbbf24",
//                     color: "#fff", borderRadius: "10px",
//                     fontSize: "11px", fontWeight: "800",
//                     padding: "1px 7px", marginLeft: "2px",
//                   }}>
//                     {pending.length}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Tab content */}
//         {tab === "pending" && (
         
//           <PendingTab
//             pending={pending}
//             loading={loading}
//             onViewEssay={setViewSub}
//             onGrade={() => fetchAll()}
//              classId={selectedClass.id}
//           />

//         )}
       

//       {tab === "assignments" && (
//           <AssignmentsTab
//             assignments={assignments.filter(a => a.is_active !== false && a.is_active !== 0)}
//             submissions={submissions}
//             loading={loading}
//             selectedClass={selectedClass}
//             onCreated={fetchAll}
//             onUpdated={fetchAll}
//             showToast={showToast}
//           />
//         )}


//         {tab === "students" && (
//           <StudentsTab
//             students={students}
//             submissions={submissions}
//             assignments={assignments}
//             loading={loading}
//             selectedClass={selectedClass}
//             onGrade={openGrade}
//             onEditGrade={openEdit}
//           />
//         )}

//         {tab === "archived" && (
//             <AssignmentsTab
//               //assignments={assignments.filter(a => a.is_active === false)}
//               assignments={assignments.filter(a => a.is_active === false || a.is_active === 0)}
//               submissions={submissions}
//               loading={loading}
//               selectedClass={selectedClass}
//               onCreated={fetchAll}
//               onUpdated={fetchAll}
//               showToast={showToast}
//               archivedOnly={true}
//             />
//           )}

//         {/* {tab === "exams" && (
//         <ExamsTab selectedClass={selectedClass} showToast={showToast} />
//           )} */}
//               {tab === "integrations" && (
//                   <IntegrationsTab
//                     selectedClass={selectedClass}
//                     showToast={showToast}
//                     assignments={assignments}
//                   />
//                 )}
//       </div>

//       {/* Modals */}
//       {viewSub && (
//         <SubmissionDetail
//           sub={viewSub}
//           user={user}
//           onClose={() => setViewSub(null)}
//           onGrade={openGrade}
//           onEditGrade={openEdit}
//         />
//       )}
//       {gradeSub && (
//         <GradeModal
//           sub={gradeSub}
//           score={gradeScore}
//           setScore={setGradeScore}
//           feedback={gradeFB}
//           setFeedback={setGradeFB}
//           onSave={saveGrade}
//           onClose={() => setGradeSub(null)}
//         />
//       )}
//       {editGradeSub && (
//         <EditGradeModal
//           sub={editGradeSub}
//           score={editScore}
//           setScore={setEditScore}
//           feedback={editFB}
//           setFeedback={setEditFB}
//           onSave={saveEditGrade}
//           onClose={() => setEditGradeSub(null)}
//         />
//       )}

//       <Toast toast={toast} />
//     </div>
//   );
// }










// src/componets/teacher/TeacherDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { Toast, Icon } from "./shared.jsx";
import { apiFetch } from "./api.js";
import PendingTab        from "./PendingTab.jsx";
import AssignmentsTab    from "./AssignmentsTab.jsx";
import StudentsTab       from "./StudentsTab.jsx";
import { GradeModal, EditGradeModal } from "./GradeModals.jsx";
import SubmissionDetail  from "./SubmissionDetail.jsx";
import IntegrationsTab   from "./IntegrationsTab.jsx";

const TABS = [
  { id: "pending",      icon: "clock-hour-4",     label: "Pending"      },
  { id: "assignments",  icon: "clipboard-list",   label: "Assignments"  },
  { id: "students",     icon: "users",            label: "Students"     },
  { id: "archived",     icon: "archive",          label: "Archived"     },
  { id: "integrations", icon: "plug-connected",   label: "Integrations" },
];

const CLASS_PALETTES = [
  { bg: "#1A3A6B", accent: "#E6F1FB" },
  { bg: "#3C3489", accent: "#EEEDFE" },
  { bg: "#1A5C3A", accent: "#EAF3DE" },
  { bg: "#854F0B", accent: "#FAEEDA" },
  { bg: "#7B1F1F", accent: "#FCEBEB" },
  { bg: "#0A4A5C", accent: "#E0F5FA" },
];

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
    { icon: "clipboard-list", label: "Assignments", value: assignments.length, color: "#185FA5", bg: "#E6F1FB" },
    { icon: "clock-hour-4",   label: "Pending",     value: pending.length,     color: "#854F0B", bg: "#FAEEDA" },
    { icon: "file-text",      label: "Submissions",  value: submissions.length, color: "#3C3489", bg: "#EEEDFE" },
    { icon: "chart-bar",      label: "Class Avg",    value: classAvg !== null ? `${classAvg}%` : "—", color: "#3B6D11", bg: "#EAF3DE" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8F7FF",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Top nav ── */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #E8E6FF",
        padding: "0 24px",
        height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 0 #E8E6FF",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: palette.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="pencil" size={17} style={{ color: palette.accent }} />
          </div>
          <div>
            <p style={{ fontWeight: "600", fontSize: "14px", color: "#1A1830", margin: 0, lineHeight: 1.2 }}>
              EssayGrade
            </p>
            <p style={{ fontSize: "11px", color: "#8884A8", margin: 0 }}>Teacher Portal</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* User chip */}
          <div style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: "#F8F7FF", border: "1px solid #E8E6FF",
            borderRadius: "20px", padding: "4px 12px 4px 4px",
          }}>
            <div style={{
              width: "26px", height: "26px",
              background: palette.bg, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "600", color: palette.accent,
            }}>
              {(user?.name || "T").charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: "13px", color: "#1A1830", fontWeight: "500" }}>
              {user?.name || "Teacher"}
            </span>
          </div>

          <button onClick={onChangeClass} style={{
            padding: "6px 13px", borderRadius: "8px",
            border: "1px solid #D3D1C7", background: "#F1EFE8",
            color: "#5F5E5A", fontSize: "12px", fontWeight: "500",
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <Icon name="building-community" size={13} />
            Switch class
          </button>

          <button onClick={onBack} style={{
            background: "none", border: "1px solid #ECECF2",
            borderRadius: "8px", color: "#6B6890",
            fontWeight: "500", fontSize: "12px",
            padding: "6px 12px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <Icon name="door-exit" size={13} />
            Logout
          </button>
        </div>
      </nav>

      {/* ── Class banner ── */}
      <div style={{
        background: palette.bg,
        padding: "22px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{
            margin: "0 0 4px", fontSize: "10px", fontWeight: "600",
            color: `${palette.accent}99`, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Current Class
          </p>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: palette.accent, display: "flex", alignItems: "center", gap: "10px" }}>
            {selectedClass.name}
            {selectedClass.section && (
              <span style={{
                fontSize: "11px", fontWeight: "600",
                background: "rgba(255,255,255,0.15)",
                color: palette.accent,
                padding: "2px 10px", borderRadius: "20px",
                border: `1px solid ${palette.accent}33`,
              }}>
                {selectedClass.section}
              </span>
            )}
          </h2>
          {selectedClass.subject && (
            <p style={{ margin: "5px 0 0", fontSize: "13px", color: `${palette.accent}CC`, fontWeight: "400", display: "flex", alignItems: "center", gap: "5px" }}>
              <Icon name="book" size={13} style={{ color: `${palette.accent}99` }} />
              {selectedClass.subject}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: palette.accent, lineHeight: 1 }}>
            {selectedClass.total_students ?? students.length}
          </p>
          <p style={{ margin: "3px 0 0", fontSize: "11px", color: `${palette.accent}99`, fontWeight: "500" }}>
            students enrolled
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "24px 20px" }}>

        {/* Fetch error banner */}
        {fetchError && (
          <div style={{
            background: "#FCEBEB", border: "1px solid #F7C1C1",
            borderRadius: "12px", padding: "14px 18px",
            marginBottom: "20px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="alert-circle" size={16} style={{ color: "#A32D2D" }} />
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "500", color: "#A32D2D" }}>{fetchError}</p>
            </div>
            <button onClick={fetchAll} style={{
              padding: "6px 14px", borderRadius: "8px", border: "none",
              background: "#A32D2D", color: "#fff",
              fontSize: "12px", fontWeight: "500", cursor: "pointer", fontFamily: "inherit",
              flexShrink: 0, display: "flex", alignItems: "center", gap: "5px",
            }}>
              <Icon name="refresh" size={12} style={{ color: "#fff" }} />
              Retry
            </button>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "22px" }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: "12px",
              padding: "16px 18px", border: "1px solid #ECECF2",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "9px",
                background: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "12px",
              }}>
                <Icon name={s.icon} size={17} style={{ color: s.color }} />
              </div>
              <p style={{ fontSize: "22px", fontWeight: "700", color: "#1A1830", margin: "0 0 2px", lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontSize: "11px", fontWeight: "500", color: "#8884A8", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "2px",
          background: "#F1EFE8", borderRadius: "11px", padding: "3px",
          marginBottom: "22px", width: "fit-content",
        }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "8px 15px", borderRadius: "9px", border: "none",
                background: active ? "#fff" : "transparent",
                color: active ? "#1A1830" : "#6B6890",
                fontWeight: active ? "600" : "400",
                fontSize: "13px", cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "6px",
                boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}>
                <Icon name={t.icon} size={14} />
                {t.label}
                {t.id === "pending" && pending.length > 0 && (
                  <span style={{
                    background: active ? "#FAEEDA" : "#FAC775",
                    color: "#854F0B",
                    borderRadius: "8px",
                    fontSize: "10px", fontWeight: "700",
                    padding: "1px 6px", marginLeft: "1px",
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