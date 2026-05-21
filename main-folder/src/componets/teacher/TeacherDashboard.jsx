import { useState, useEffect, useCallback } from "react";
import { Toast, Icon } from "./shared.jsx";
import { apiFetch } from "./api.js";
import PendingTab from "./PendingTab.jsx";
import AssignmentsTab from "./AssignmentsTab.jsx";
import StudentsTab from "./StudentsTab.jsx";
import { GradeModal, EditGradeModal } from "./GradeModals.jsx";
import SubmissionDetail from "./SubmissionDetail.jsx";
import IntegrationsTab from "./IntegrationsTab.jsx";
import { GoGraph } from "react-icons/go";

const TABS = [
  { id: "assignments", label: "Assignments", icon: "clipboard-list" },
  { id: "pending", label: "Pending review", icon: "clock" },
  { id: "students", label: "Students", icon: "users" },
  { id: "integrations", label: "Integrations", icon: "plug" },
];

const CLASS_PALETTES = [
  { border: "#185FA5", bg: "#E6F1FB", accent: "#185FA5", icon: "building" },
  { border: "#3B6D11", bg: "#EAF3DE", accent: "#3B6D11", icon: "school" },
  { border: "#854F0B", bg: "#FAEEDA", accent: "#854F0B", icon: "books" },
  { border: "#3C3489", bg: "#EEEDFE", accent: "#3C3489", icon: "crown" },
];

// MOCK DATA for when API fails
const MOCK_CLASSES = [
  { id: 1, name: "Form 4A", subject: "English Literature", total_students: 45, section: "A" },
  { id: 2, name: "Form 4B", subject: "English Literature", total_students: 42, section: "B" },
  { id: 3, name: "Form 3A", subject: "English Language", total_students: 48, section: "A" },
];

const MOCK_ASSIGNMENTS = [
  { id: 1, title: "Introduction to Essay Writing", description: "Write a basic essay on any topic", instructions: "Write a 500-word essay introducing yourself and your writing style...", max_score: 100, due_date: new Date(Date.now() + 7*24*60*60*1000).toISOString(), is_active: true, rubric: { content: 40, structure: 30, grammar: 20, vocabulary: 10 } },
  { id: 2, title: "Argumentative Essay", description: "Take a stance on a controversial topic", instructions: "Write an 800-word argumentative essay with at least 3 supporting points...", max_score: 100, due_date: new Date(Date.now() + 14*24*60*60*1000).toISOString(), is_active: true, rubric: { content: 40, structure: 30, grammar: 20, vocabulary: 10 } },
  { id: 3, title: "Descriptive Essay", description: "Describe a place or person", instructions: "Write a 600-word descriptive essay using sensory details...", max_score: 100, due_date: new Date(Date.now() - 2*24*60*60*1000).toISOString(), is_active: true, rubric: { content: 40, structure: 30, grammar: 20, vocabulary: 10 } },
];

const MOCK_SUBMISSIONS = [
  { id: 1, assignment_id: 1, student_id: 101, student_name: "John Doe", student_email: "john@example.com", essay_text: "This is my essay about writing...", status: "submitted", submitted_at: new Date().toISOString(), max_score: 100 },
  { id: 2, assignment_id: 1, student_id: 102, student_name: "Jane Smith", student_email: "jane@example.com", essay_text: "Writing has always been my passion...", status: "ai_graded", ai_score: 78, ai_detection_score: 25, submitted_at: new Date().toISOString(), max_score: 100 },
  { id: 3, assignment_id: 2, student_id: 103, student_name: "Mike Johnson", student_email: "mike@example.com", essay_text: "Climate change is the biggest challenge...", status: "submitted", submitted_at: new Date().toISOString(), max_score: 100 },
  { id: 4, assignment_id: 2, student_id: 101, student_name: "John Doe", student_email: "john@example.com", essay_text: "Social media has both positive and negative effects...", status: "ai_graded", ai_score: 82, ai_detection_score: 15, final_score: 82, teacher_feedback: "Great work! Keep it up.", submitted_at: new Date().toISOString(), max_score: 100 },
];

export default function TeacherDashboard({ user, selectedClass: propSelectedClass, classes: propClasses, onSelectClass, onLogout }) {
  // All hooks at the top level
  const [tab, setTab] = useState("pending");
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  
  // Use mock data if props are empty
  const classes = propClasses && propClasses.length > 0 ? propClasses : MOCK_CLASSES;
  const [selectedClass, setSelectedClass] = useState(propSelectedClass || (classes[0] || null));

  const [gradeSub, setGradeSub] = useState(null);
  const [editGradeSub, setEditGradeSub] = useState(null);
  const [viewSub, setViewSub] = useState(null);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFB, setGradeFB] = useState("");
  const [editScore, setEditScore] = useState("");
  const [editFB, setEditFB] = useState("");

  const palette = selectedClass && classes.length > 0 
    ? CLASS_PALETTES[classes.findIndex(c => c?.id === selectedClass?.id) % CLASS_PALETTES.length] 
    : CLASS_PALETTES[0];

  const showToastMessage = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    if (!selectedClass?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError(null);
    
    // If using mock data, just load it directly
    if (useMockData) {
      console.log("Using mock data");
      setTimeout(() => {
        setAssignments(MOCK_ASSIGNMENTS);
        setSubmissions(MOCK_SUBMISSIONS);
        setLoading(false);
      }, 500);
      return;
    }
    
    try {
      const classParam = `?class_id=${selectedClass.id}`;
      const [aData, sData] = await Promise.all([
        apiFetch(`/assignments${classParam}`),
        apiFetch(`/submissions${classParam}`),
      ]);
      setAssignments(aData.assignments || []);
      setSubmissions(sData.submissions || []);
      setUseMockData(false);
    } catch (err) {
      const msg = err?.message || "Failed to load data. Using mock data for testing.";
      setFetchError(msg);
      showToastMessage(msg, "error");
      // Fallback to mock data
      setAssignments(MOCK_ASSIGNMENTS);
      setSubmissions(MOCK_SUBMISSIONS);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, useMockData]);

  useEffect(() => {
    if (selectedClass) {
      setTab("pending");
      fetchAll();
    }
  }, [fetchAll, selectedClass]);

  // Filter data based on selected class
  const filteredAssignments = assignments.filter(a => a.is_active !== false && a.is_active !== 0);
  const pending = submissions.filter(
    s => (s.status === "submitted" || s.status === "ai_graded") && s.final_score == null
  );

  const students = Array.from(
    submissions.reduce((map, s) => {
      if (!map.has(s.student_id))
        map.set(s.student_id, { id: s.student_id, name: s.student_name, email: s.student_email });
      return map;
    }, new Map()).values()
  );

  const gradedSubs = submissions.filter(s => s.final_score != null);
  const classAvg = gradedSubs.length > 0
    ? Math.round(gradedSubs.reduce((acc, s) => acc + (s.final_score / (s.max_score || 1)) * 100, 0) / gradedSubs.length)
    : null;

  const openGrade = sub => { setGradeSub(sub); setGradeScore(sub.ai_score ?? ""); setGradeFB(sub.ai_feedback || ""); };
  const openEdit = sub => { setEditGradeSub(sub); setEditScore(sub.final_score ?? ""); setEditFB(sub.teacher_feedback || ""); };

  const saveGrade = async () => {
    if (gradeScore === "" || gradeScore == null) { showToastMessage("Please enter a score.", "error"); return; }
    if (useMockData) {
      // Handle mock data save
      const updated = submissions.map(s => 
        s.id === gradeSub.id ? { ...s, final_score: Number(gradeScore), teacher_feedback: gradeFB, status: "graded" } : s
      );
      setSubmissions(updated);
      setGradeSub(null);
      showToastMessage("Grade saved (mock mode).");
      return;
    }
    try {
      await apiFetch("/submissions/grade", {
        method: "POST",
        body: JSON.stringify({ submission_id: gradeSub.id, score: Number(gradeScore), feedback: gradeFB }),
      });
      setGradeSub(null);
      showToastMessage("Grade saved successfully.");
      fetchAll();
    } catch (err) { showToastMessage(err?.message || "Save failed", "error"); }
  };

  const saveEditGrade = async () => {
    if (editScore === "" || editScore == null) { showToastMessage("Please enter a score.", "error"); return; }
    if (useMockData) {
      const updated = submissions.map(s => 
        s.id === editGradeSub.id ? { ...s, final_score: Number(editScore), teacher_feedback: editFB } : s
      );
      setSubmissions(updated);
      setEditGradeSub(null);
      showToastMessage("Grade updated (mock mode).");
      return;
    }
    try {
      await apiFetch("/submissions/grade", {
        method: "POST",
        body: JSON.stringify({ submission_id: editGradeSub.id, score: Number(editScore), feedback: editFB }),
      });
      setEditGradeSub(null);
      showToastMessage("Grade updated.");
      fetchAll();
    } catch (err) { showToastMessage(err?.message || "Update failed", "error"); }
  };

  const handleChangeClass = () => {
    setShowClassSelector(true);
  };

  const handleSelectClass = (classObj) => {
    setSelectedClass(classObj);
    if (onSelectClass) onSelectClass(classObj);
    setShowClassSelector(false);
  };

  const stats = [
    { icon: <Icon name="clipboard-list" size={24} style={{ color: "#185FA5" }} />, label: "Assignments", value: filteredAssignments.length, color: "#185FA5", bg: "#E6F1FB" },
    { icon: <Icon name="clock-hour-4" size={24} style={{ color: "#854F0B" }} />, label: "Pending", value: pending.length, color: "#854F0B", bg: "#FAEEDA" },
    { icon: <Icon name="file-text" size={24} style={{ color: "#3C3489" }} />, label: "Submissions", value: submissions.length, color: "#3C3489", bg: "#EEEDFE" },
    { icon: <GoGraph size={24} style={{ color: "#3B6D11" }} />, label: "Class Avg", value: classAvg !== null ? `${classAvg}%` : "—", color: "#3B6D11", bg: "#EAF3DE" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Mock Data Indicator */}
      {useMockData && (
        <div style={{ background: "#FAEEDA", borderBottom: "1px solid #FAC775", padding: "6px 20px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#854F0B" }}>
            ⚠️ Using mock data - Backend connection failed. UI is functional for testing.
          </p>
        </div>
      )}

      {/* Navigation Bar */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E8E6FF", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
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
              {user?.name?.charAt(0) || "W"}
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{user?.name || "William Jombo"}</span>
          </div>
          <button onClick={onLogout} style={{ padding: "7px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "24px 20px" }}>
        {/* Class Selection Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#F8F7FF", border: "1px solid #E8E6FF", borderRadius: "20px", padding: "4px 12px 4px 4px" }}>
            <div style={{ width: "26px", height: "26px", background: palette.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "600", color: palette.accent }}>
              {selectedClass?.name?.charAt(0) || "C"}
            </div>
            <span style={{ fontSize: "13px", color: "#1A1830", fontWeight: "500" }}>{selectedClass?.name || "Select a Class"}</span>
          </div>

          <button onClick={handleChangeClass} style={{ padding: "6px 13px", borderRadius: "8px", border: "1px solid #D3D1C7", background: "#F1EFE8", color: "#5F5E5A", fontSize: "12px", fontWeight: "500", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "5px" }}>
            <Icon name="building-community" size={13} />
            Switch class
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: "12px", padding: "16px 18px", border: "1px solid #ECECF2", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ marginBottom: "8px" }}>{s.icon}</div>
              <p style={{ fontSize: "26px", fontWeight: "900", color: "#1e293b", margin: "0 0 3px", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Class Banner */}
        {selectedClass && (
          <div style={{ background: palette.bg, padding: "20px 24px", borderRadius: 12, marginBottom: 24, border: `1px solid ${palette.accent}20` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: "600", color: `${palette.accent}99`, letterSpacing: "0.08em", textTransform: "uppercase" }}>Current Class</p>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: palette.accent, display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {selectedClass?.name}
                  {selectedClass?.section && (
                    <span style={{ fontSize: "11px", fontWeight: "600", background: "rgba(255,255,255,0.15)", color: palette.accent, padding: "2px 10px", borderRadius: "20px", border: `1px solid ${palette.accent}33` }}>{selectedClass.section}</span>
                  )}
                </h2>
                {selectedClass?.subject && (
                  <p style={{ margin: "5px 0 0", fontSize: "13px", color: `${palette.accent}CC`, fontWeight: "400", display: "flex", alignItems: "center", gap: "5px" }}>
                    <Icon name="book" size={13} style={{ color: `${palette.accent}99` }} />
                    {selectedClass.subject}
                  </p>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: palette.accent, lineHeight: 1 }}>{selectedClass?.total_students ?? students.length}</p>
                <p style={{ margin: "3px 0 0", fontSize: "11px", color: `${palette.accent}99`, fontWeight: "500" }}>students enrolled</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {fetchError && !useMockData && (
          <div style={{ background: "#FCEBEB", border: "1px solid #F7C1C1", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="alert-circle" size={16} style={{ color: "#A32D2D" }} />
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "500", color: "#A32D2D" }}>{fetchError}</p>
            </div>
            <button onClick={fetchAll} style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "#A32D2D", color: "#fff", fontSize: "12px", fontWeight: "500", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, display: "flex", alignItems: "center", gap: "5px" }}>
              <Icon name="refresh" size={12} style={{ color: "#fff" }} />
              Retry
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2px", background: "#F1EFE8", borderRadius: "11px", padding: "3px", marginBottom: "22px", width: "fit-content", flexWrap: "wrap" }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 15px", borderRadius: "9px", border: "none", background: active ? "#fff" : "transparent", color: active ? "#1A1830" : "#6B6890", fontWeight: active ? "600" : "400", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px", boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                <Icon name={t.icon} size={14} />
                {t.label}
                {t.id === "pending" && pending.length > 0 && (
                  <span style={{ background: active ? "#FAEEDA" : "#FAC775", color: "#854F0B", borderRadius: "8px", fontSize: "10px", fontWeight: "700", padding: "1px 6px", marginLeft: "1px" }}>{pending.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <div style={{ width: 28, height: 28, border: "2px solid #E8E6FF", borderTopColor: "#3C3489", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          </div>
        )}

        {!loading && (
          <>
            {tab === "pending" && <PendingTab pending={pending} loading={loading} onViewEssay={setViewSub} onGrade={() => fetchAll()} classId={selectedClass?.id} />}

            {tab === "assignments" && (
              <AssignmentsTab assignments={filteredAssignments} submissions={submissions} loading={loading} selectedClass={selectedClass} onCreated={fetchAll} onUpdated={fetchAll} showToast={showToastMessage} />
            )}

            {tab === "students" && (
              <StudentsTab students={students} submissions={submissions} assignments={assignments} loading={loading} selectedClass={selectedClass} onGrade={openGrade} onEditGrade={openEdit} />
            )}

            {tab === "integrations" && <IntegrationsTab selectedClass={selectedClass} showToast={showToastMessage} assignments={assignments} />}
          </>
        )}
      </div>

      {/* Modals */}
      {viewSub && <SubmissionDetail sub={viewSub} user={user} onClose={() => setViewSub(null)} onGrade={openGrade} onEditGrade={openEdit} />}
      {gradeSub && <GradeModal sub={gradeSub} score={gradeScore} setScore={setGradeScore} feedback={gradeFB} setFeedback={setGradeFB} onSave={saveGrade} onClose={() => setGradeSub(null)} />}
      {editGradeSub && <EditGradeModal sub={editGradeSub} score={editScore} setScore={setEditScore} feedback={editFB} setFeedback={setEditFB} onSave={saveEditGrade} onClose={() => setEditGradeSub(null)} />}

      {/* Class Selector Modal */}
      {showClassSelector && classes.length > 0 && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(15,13,40,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #ECECF2", background: "#F8F7FF" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1830" }}>Select a class</h3>
            </div>
            <div style={{ padding: 16, maxHeight: 400, overflowY: "auto" }}>
              {classes.map((cls, idx) => {
                const p = CLASS_PALETTES[idx % CLASS_PALETTES.length];
                return (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls)}
                    style={{ width: "100%", padding: "14px 16px", marginBottom: 8, borderRadius: 12, border: `1px solid ${p.accent}20`, background: p.bg, textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "transform 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  >
                    <p style={{ fontWeight: 700, margin: 0, color: p.accent }}>{cls.name}</p>
                    <p style={{ fontSize: 12, color: `${p.accent}99`, margin: "4px 0 0" }}>{cls.subject || "No subject"} · {cls.total_students || 0} students</p>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid #ECECF2", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowClassSelector(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #D3D1C7", background: "#F1EFE8", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}