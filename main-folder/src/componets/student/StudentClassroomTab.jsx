import { useState } from "react";
import { apiFetch } from "./api.js";

export default function StudentClassroomTab({ assignments, showToast, onSubmitted }) {
  const [connected,    setConnected]    = useState(false);
  const [courses,      setCourses]      = useState([]);
  const [gcAssignments,setGcAssignments]= useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [submitting,   setSubmitting]   = useState(null); // gc assignment id being submitted

  const card = {
    background: "#fff", borderRadius: "18px", padding: "24px",
    border: "1px solid #e2e8f0", marginBottom: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  };
  const btn = (color = "#3b82f6") => ({
    padding: "10px 20px", background: color, color: "#fff",
    border: "none", borderRadius: "10px", fontWeight: "700",
    fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
  });
  const select = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "13px",
    fontFamily: "inherit", marginBottom: "12px",
    boxSizing: "border-box", background: "#f8fafc",
  };

  const connectGoogle = async () => {
    try {
      const res = await apiFetch("/auth/google/classroom");
      window.open(res.auth_url, "_blank", "width=600,height=700");
      showToast("Complete login in the popup, then click 'Load My Courses'", "success");
      setConnected(true);
    } catch (err) {
      showToast(err.message || "Could not connect to Google", "error");
    }
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/classroom/courses");
      setCourses(res.courses || []);
      setConnected(true);
      if ((res.courses || []).length === 0)
        showToast("No active Google Classroom courses found.", "error");
      else
        showToast(`Found ${res.courses.length} course(s)`, "success");
    } catch (err) {
      showToast(err.message || "Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async (courseId) => {
    setLoading(true);
    setSelectedCourse(courseId);
    setGcAssignments([]);
    try {
      const res = await apiFetch(`/classroom/courses/${courseId}/assignments`);
      setGcAssignments(res.assignments || []);
    } catch (err) {
      showToast(err.message || "Failed to load assignments", "error");
    } finally {
      setLoading(false);
    }
  };

  const submitFromClassroom = async (gcAssignment) => {
    if (!gcAssignment.local_assignment_id) {
      showToast("This assignment hasn't been linked by your teacher yet.", "error");
      return;
    }
    setSubmitting(gcAssignment.id);
    try {
      const res = await apiFetch(
        `/classroom/submit?gc_course_id=${selectedCourse}&gc_coursework_id=${gcAssignment.id}&local_assignment_id=${gcAssignment.local_assignment_id}`,
        { method: "POST" }
      );
      showToast(`✅ Submitted! AI Score: ${res.score}/${res.max_score}`, "success");
      if (onSubmitted) onSubmitted();
    } catch (err) {
      showToast(err.message || "Submission failed", "error");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>
        🎓 Google Classroom
      </h2>

      <div style={card}>
        {/* Step 1 */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
            Step 1 — Connect your Google account
          </p>
          <button onClick={connectGoogle} style={btn("linear-gradient(135deg,#4285f4,#34a853)")}>
            🔐 Connect Google Classroom
          </button>
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
            Step 2 — Load your enrolled courses
          </p>
          <button onClick={loadCourses} disabled={loading} style={btn("#6366f1")}>
            {loading ? "⏳ Loading..." : "📚 Load My Courses"}
          </button>
        </div>

        {/* Courses */}
        {courses.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
              Step 3 — Select a course to see its assignments
            </p>
            <select style={select} defaultValue="" onChange={e => loadAssignments(e.target.value)}>
              <option value="" disabled>Choose a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.section}</option>
              ))}
            </select>
          </div>
        )}

        {/* Assignments */}
        {gcAssignments.length > 0 && (
          <div>
            <p style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "10px" }}>
              Step 4 — Import & submit an assignment
            </p>
            {gcAssignments.map(a => (
              <div key={a.id} style={{
                padding: "14px 16px",
                border: `1px solid ${a.local_assignment_id ? "#bbf7d0" : "#e2e8f0"}`,
                borderRadius: "12px", marginBottom: "10px",
                background: a.local_assignment_id ? "#f0fdf4" : "#f8fafc",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "13px", color: "#1e293b" }}>
                      {a.title}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                      {a.local_assignment_id
                        ? "✅ Linked to local assignment — ready to submit"
                        : "⚠️ Not yet linked by teacher"}
                    </p>
                  </div>
                  <button
                    onClick={() => submitFromClassroom(a)}
                    disabled={!a.local_assignment_id || submitting === a.id}
                    style={{
                      ...btn(a.local_assignment_id ? "linear-gradient(135deg,#10b981,#34d399)" : "#94a3b8"),
                      opacity: !a.local_assignment_id ? 0.5 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {submitting === a.id ? "⏳ Submitting..." : "📤 Import & Submit"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}