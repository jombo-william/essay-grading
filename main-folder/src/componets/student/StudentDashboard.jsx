import { useCallback, useEffect, useMemo, useState } from "react";
import AssignmentsTab from "./AssignmentsTab.jsx";
import EssayViewSheet from "./EssayViewSheet.jsx";
import ExamsTab from "./ExamsTab.jsx";
import ExamTakeSheet from "./ExamTakeSheet.jsx";
import ResultDetailSheet from "./ResultDetailSheet.jsx";
import ResultsTab from "./ResultsTab.jsx";
import StudentClassroomTab from "./StudentClassroomTab.jsx";
import WriteEssaySheet from "./WriteEssaySheet.jsx";
import { apiFetch } from "./api.js";
import { Icon, Toast } from "./shared.jsx";

const tabs = [
  { id: "assignments", label: "Assignments", icon: "clipboard-list" },
  { id: "results", label: "Results", icon: "chart-bar" },
  { id: "exams", label: "Exams", icon: "file-text" },
  { id: "platforms", label: "Platforms", icon: "plug-connected" },
];

function normalizeAssignments(assignments = []) {
  const now = new Date();
  return assignments.map(assignment => ({
    ...assignment,
    isPast: assignment.due_date ? new Date(assignment.due_date) < now : false,
    submitted: !!assignment.submitted || !!assignment.submission,
  }));
}

export default function StudentDashboard({ user, onBack }) {
  const [tab, setTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [writeAssignment, setWriteAssignment] = useState(null);
  const [viewEssay, setViewEssay] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [examToTake, setExamToTake] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [gradingStatus, setGradingStatus] = useState("");

  const studentName = user?.full_name || user?.name || "Student";

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [assignmentRes, resultRes] = await Promise.all([
        apiFetch("/assignments"),
        apiFetch("/results"),
      ]);
      setAssignments(normalizeAssignments(assignmentRes.assignments || []));
      setResults(resultRes.results || resultRes.submissions || []);
    } catch (err) {
      showToast(err.message || "Failed to load student dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const submitted = assignments.filter(a => a.submitted).length;
    const active = assignments.filter(a => !a.submitted && !a.isPast).length;
    const graded = results.filter(r => r.final_score !== null && r.final_score !== undefined);
    const average = graded.length
      ? Math.round(graded.reduce((sum, r) => sum + (Number(r.final_score) / Number(r.max_score || 100)) * 100, 0) / graded.length)
      : null;

    return [
      { label: "To submit", value: active, icon: "clipboard-list", color: "#185FA5", bg: "#E6F1FB" },
      { label: "Submitted", value: submitted, icon: "send", color: "#3C3489", bg: "#EEEDFE" },
      { label: "Average", value: average === null ? "-" : `${average}%`, icon: "chart-bar", color: "#3B6D11", bg: "#EAF3DE" },
    ];
  }, [assignments, results]);

  const canUnsubmit = sub => {
    const assignment = assignments.find(a => a.id === sub.assignment_id);
    return !!assignment && !assignment.isPast && sub.final_score == null;
  };

  const handleSubmitEssay = async ({ assignment, submitMode, uploadFile, activeText }) => {
    setSubmitting(true);
    setGradingStatus("Submitting...");
    try {
      const res = await apiFetch("/submit", {
        method: "POST",
        body: JSON.stringify({
          assignment_id: assignment.id,
          essay_text: activeText,
          submit_mode: submitMode,
          file_name: uploadFile?.name || null,
        }),
      });
      showToast(res.message || "Essay submitted successfully.", "success");
      setWriteAssignment(null);
      await loadData();
      setTab("results");
    } catch (err) {
      showToast(err.message || "Could not submit essay.", "error");
    } finally {
      setSubmitting(false);
      setGradingStatus("");
    }
  };

  const handleUnsubmit = async sub => {
    try {
      await apiFetch("/unsubmit", {
        method: "POST",
        body: JSON.stringify({ submission_id: sub.id }),
      });
      showToast("Essay unsubmitted.", "success");
      setViewEssay(null);
      setViewResult(null);
      await loadData();
    } catch (err) {
      showToast(err.message || "Failed to unsubmit essay.", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F5FB", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 760px) {
          .student-shell { padding: 18px !important; }
          .student-nav { overflow-x: auto; justify-content: flex-start !important; }
          .student-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Toast toast={toast} />

      <header style={{ background: "#1A1830", color: "#fff", position: "sticky", top: 0, zIndex: 80, boxShadow: "0 2px 16px rgba(0,0,0,0.16)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#C9A227", color: "#1A1830", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>AI Essay Grading System</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.68)" }}>{studentName}</p>
            </div>
          </div>
          <button
            onClick={onBack}
            style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", color: "#fff", borderRadius: 9, padding: "8px 13px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="student-shell" style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 24px 56px" }}>
        <section className="student-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ background: "#fff", border: "1px solid #ECECF2", borderRadius: 14, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: stat.bg, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={stat.icon} size={21} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 23, lineHeight: 1, color: "#1A1830", fontWeight: 800 }}>{stat.value}</p>
                <p style={{ margin: "4px 0 0", color: "#8884A8", fontSize: 12, fontWeight: 600 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        <nav className="student-nav" style={{ background: "#fff", border: "1px solid #ECECF2", borderRadius: 14, padding: 6, display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
          {tabs.map(item => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "9px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: active ? "#3C3489" : "transparent",
                  color: active ? "#fff" : "#5F5E5A",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {tab === "assignments" && (
          <AssignmentsTab
            assignments={assignments}
            loading={loading}
            onWrite={setWriteAssignment}
            onViewEssay={setViewEssay}
            onViewResult={setViewResult}
          />
        )}

        {tab === "results" && (
          <ResultsTab
            results={results}
            loading={loading}
            onOpenResult={setViewResult}
            studentName={studentName}
          />
        )}

        {tab === "exams" && (
          <ExamsTab onStartExam={setExamToTake} />
        )}

        {tab === "platforms" && (
          <StudentClassroomTab
            showToast={showToast}
            onSubmitted={loadData}
          />
        )}
      </main>

      {writeAssignment && (
        <WriteEssaySheet
          assignment={writeAssignment}
          onClose={() => setWriteAssignment(null)}
          onSubmit={handleSubmitEssay}
          submitting={submitting}
          gradingStatus={gradingStatus}
        />
      )}

      {viewEssay && (
        <EssayViewSheet
          sub={viewEssay}
          user={user}
          canUnsubmit={canUnsubmit(viewEssay)}
          onClose={() => setViewEssay(null)}
          onUnsubmit={handleUnsubmit}
        />
      )}

      {viewResult && (
        <ResultDetailSheet
          sub={viewResult}
          canUnsubmit={canUnsubmit(viewResult)}
          onClose={() => setViewResult(null)}
          onUnsubmit={handleUnsubmit}
        />
      )}

      {examToTake && (
        <ExamTakeSheet
          exam={examToTake}
          onClose={() => setExamToTake(null)}
          onSubmitted={loadData}
          showToast={showToast}
        />
      )}
    </div>
  );
}
