import { useState, useEffect } from "react";
import { apiFetch } from "./api.js";

export default function IntegrationsTab({ 
  selectedClass, 
  showToast, 
  assignments,
  // Moodle props from parent
  moodleToken,
  moodleSiteUrl,
  moodleCourses,
  moodleConnected,
  moodleLoading,
  onConnectMoodle
}) {

  // ── Google Classroom state ─────────────────────────────────────────────
  const [gcCourses,       setGcCourses]       = useState([]);
  const [gcAssignments,   setGcAssignments]   = useState([]);
  const [selectedCourse,  setSelectedCourse]  = useState(null);
  const [selectedGcWork,  setSelectedGcWork]  = useState(null);
  const [selectedLocalId, setSelectedLocalId] = useState("");
  const [gcLoading,       setGcLoading]       = useState(false);
  const [gcResults,       setGcResults]       = useState(null);
  const [linkClassId,     setLinkClassId]     = useState("");
  const [linking,         setLinking]         = useState(false);
  const [classes,         setClasses]         = useState([]);

  // Local input state for Moodle connection
  const [localMoodleToken, setLocalMoodleToken] = useState(moodleToken || "");
  const [localMoodleSiteUrl, setLocalMoodleSiteUrl] = useState(moodleSiteUrl || "https://essaygrade.moodlecloud.com");

  // ── Moodle assignment state ───────────────────────────────────────────
  const [moodleAssignments,     setMoodleAssignments]     = useState([]);
  const [selectedMoodleCourse,  setSelectedMoodleCourse]  = useState(null);
  const [selectedMoodleAssign,  setSelectedMoodleAssign]  = useState(null);
  const [moodleLocalId,         setMoodleLocalId]         = useState("");
  const [moodleResults,         setMoodleResults]         = useState(null);

  // Update local inputs when props change
  useEffect(() => {
    setLocalMoodleToken(moodleToken);
    setLocalMoodleSiteUrl(moodleSiteUrl);
  }, [moodleToken, moodleSiteUrl]);

  const loadMoodleAssignments = async (courseId) => {
    setSelectedMoodleCourse(courseId);
    setMoodleAssignments([]);
    try {
      const res = await apiFetch(
        `/moodle/assignments?moodle_token=${moodleToken}&course_id=${courseId}&site_url=${encodeURIComponent(moodleSiteUrl)}`
      );
      const assigns = res.data?.courses?.[0]?.assignments || [];
      setMoodleAssignments(assigns);
      showToast(`Found ${assigns.length} assignments`, "success");
    } catch (err) {
      showToast(err.message || "Failed to load assignments", "error");
    }
  };

  const gradeFromMoodle = async () => {
    if (!moodleToken || !selectedMoodleAssign || !moodleLocalId) {
      showToast("Please select a Moodle assignment and local assignment", "error");
      return;
    }
    try {
      const res = await apiFetch("/moodle/autograde", {
        method: "POST",
        body: JSON.stringify({
          moodle_token:         moodleToken,
          moodle_assignment_id: parseInt(selectedMoodleAssign),
          local_assignment_id:  parseInt(moodleLocalId),
          site_url:             moodleSiteUrl,
        }),
      });
      setMoodleResults(res);
      showToast(`✅ Graded ${res.total_graded} essays from Moodle!`, "success");
    } catch (err) {
      showToast(err.message || "Moodle grading failed", "error");
    }
  };

  // ── Google Classroom handlers ──────────────────────────────────────────

  const connectGoogle = async () => {
    try {
      const res = await apiFetch("/auth/google/classroom");
      window.open(res.auth_url, "_blank", "width=600,height=700");
      showToast("Complete login in the popup window", "success");
    } catch (err) {
      showToast(err.message || "Could not connect to Google", "error");
    }
  };

  const loadGcCourses = async () => {
    setGcLoading(true);
    try {
      const [gcRes, clsRes] = await Promise.all([
        apiFetch("/classroom/courses"),
        apiFetch("/classes"),
      ]);
      setGcCourses(gcRes.courses || []);
      setClasses(clsRes.classes || []);
      showToast(`Found ${gcRes.courses.length} courses`, "success");
    } catch (err) {
      showToast(err.message || "Failed to load courses", "error");
    } finally {
      setGcLoading(false);
    }
  };

  const loadGcAssignments = async (courseId) => {
    setGcLoading(true);
    setSelectedCourse(courseId);
    try {
      const res = await apiFetch(`/classroom/courses/${courseId}/assignments`);
      setGcAssignments(res.assignments || []);
    } catch (err) {
      showToast(err.message || "Failed to load assignments", "error");
    } finally {
      setGcLoading(false);
    }
  };

  const syncFromGc = async (courseId) => {
    setGcLoading(true);
    try {
      const res = await apiFetch(
        `/classroom/courses/${courseId}/sync`,
        { method: "POST" }
      );
      showToast(`✅ ${res.message}`, "success");
    } catch (err) {
      showToast(err.message || "Sync failed", "error");
    } finally {
      setGcLoading(false);
    }
  };

  const gradeFromClassroom = async () => {
    if (!selectedCourse || !selectedGcWork || !selectedLocalId) {
      showToast("Please select a course, assignment, and local assignment", "error");
      return;
    }
    setGcLoading(true);
    setGcResults(null);
    try {
      const res = await apiFetch(
        `/classroom/courses/${selectedCourse}/assignments/${selectedGcWork}/grade?local_assignment_id=${selectedLocalId}`,
        { method: "POST" }
      );
      setGcResults(res);
      showToast(`✅ Graded ${res.total_graded} essays from Google Classroom!`, "success");
    } catch (err) {
      showToast(err.message || "Grading failed", "error");
    } finally {
      setGcLoading(false);
    }
  };

  const linkCourseToClass = async (courseId) => {
    if (!linkClassId) {
      showToast("Please select a class to link", "error");
      return;
    }
    setLinking(true);
    try {
      await apiFetch(`/classes/${linkClassId}/link-google`, {
        method: "POST",
        body: JSON.stringify({ gc_course_id: courseId }),
      });
      showToast("✅ Course linked to class! Assignments will now sync.", "success");
    } catch (err) {
      showToast(err.message || "Failed to link", "error");
    } finally {
      setLinking(false);
    }
  };

  // ── Styles ─────────────────────────────────────────────────────────────
  const card = {
    background:   "#fff",
    borderRadius: "18px",
    padding:      "24px",
    border:       "1px solid #e2e8f0",
    marginBottom: "20px",
    boxShadow:    "0 1px 6px rgba(0,0,0,0.04)",
  };

  const btn = (color = "#3b82f6") => ({
    padding:      "10px 20px",
    background:   color,
    color:        "#fff",
    border:       "none",
    borderRadius: "10px",
    fontWeight:   "700",
    fontSize:     "13px",
    cursor:       "pointer",
    fontFamily:   "inherit",
  });

  const input = {
    width:        "100%",
    padding:      "10px 14px",
    borderRadius: "10px",
    border:       "1.5px solid #e2e8f0",
    fontSize:     "13px",
    fontFamily:   "inherit",
    marginBottom: "12px",
    boxSizing:    "border-box",
  };

  const select = { ...input, background: "#f8fafc" };
  const label = {
    fontWeight:   "700",
    fontSize:     "13px",
    color:        "#374151",
    marginBottom: "8px",
    display:      "block",
  };

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>
        🔗 External Integrations
      </h2>

      {/* ── Google Classroom ─────────────────────────────────────────── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "linear-gradient(135deg,#4285f4,#34a853)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}>🎓</div>
          <div>
            <p style={{ margin: 0, fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>
              Google Classroom
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Import and auto-grade student submissions
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <p style={label}>Step 1 — Connect your Google account</p>
          <button onClick={connectGoogle} style={btn("linear-gradient(135deg,#4285f4,#34a853)")}>
            🔐 Connect Google Classroom
          </button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <p style={label}>Step 2 — Load your courses</p>
          <button onClick={loadGcCourses} disabled={gcLoading} style={btn("#6366f1")}>
            {gcLoading ? "⏳ Loading..." : "📚 Load My Courses"}
          </button>
        </div>

        {gcCourses.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={label}>Step 3 — Link each course to a local class</p>
            {gcCourses.slice(0, 3).map(course => (
              <div key={course.id} style={{
                padding: "12px", border: "1px solid #e2e8f0",
                borderRadius: "10px", marginBottom: "10px", background: "#f8fafc",
              }}>
                <p style={{ margin: "0 0 8px", fontWeight: "700", fontSize: "13px", color: "#1e293b" }}>
                  🎓 {course.name} {course.section}
                </p>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <select
                    onChange={e => setLinkClassId(e.target.value)}
                    defaultValue=""
                    style={{ ...select, marginBottom: 0, flex: 1 }}
                  >
                    <option value="" disabled>Select local class to link...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} — {c.subject}</option>
                    ))}
                  </select>
                  <button onClick={() => linkCourseToClass(course.id)} disabled={linking} style={{ ...btn("#10b981"), whiteSpace: "nowrap" }}>
                    🔗 Link
                  </button>
                  <button onClick={() => loadGcAssignments(course.id)} disabled={gcLoading} style={{ ...btn("#6366f1"), whiteSpace: "nowrap" }}>
                    📋 View Assignments
                  </button>
                  <button onClick={() => syncFromGc(course.id)} disabled={gcLoading} style={{ ...btn("#f59e0b"), whiteSpace: "nowrap" }}>
                    🔄 Sync
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {gcAssignments.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={label}>Step 4 — Select Google Classroom assignment</p>
            <select style={select} onChange={e => setSelectedGcWork(e.target.value)} defaultValue="">
              <option value="" disabled>Choose assignment...</option>
              {gcAssignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
        )}

        {gcAssignments.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={label}>Step 5 — Match to your local assignment</p>
            <select style={select} onChange={e => setSelectedLocalId(e.target.value)} defaultValue="">
              <option value="" disabled>Choose local assignment...</option>
              {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
        )}

        {selectedGcWork && selectedLocalId && (
          <button onClick={gradeFromClassroom} disabled={gcLoading} style={{ ...btn("linear-gradient(135deg,#10b981,#34d399)"), width: "100%", padding: "14px" }}>
            🤖 Grade Submissions from Google Classroom
          </button>
        )}

        {gcResults && (
          <div style={{ marginTop: "16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px" }}>
            <p style={{ fontWeight: "800", color: "#16a34a" }}>✅ Graded {gcResults.total_graded} essays</p>
          </div>
        )}
      </div>

      {/* ── Moodle ───────────────────────────────────────────────────── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "linear-gradient(135deg,#f98012,#e85d04)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}>📚</div>
          <div>
            <p style={{ margin: 0, fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>
              Moodle
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Import and auto-grade from Moodle
            </p>
          </div>
        </div>

        <p style={label}>Moodle Site URL</p>
        <input
          style={input}
          type="text"
          placeholder="https://yoursite.moodlecloud.com"
          value={localMoodleSiteUrl}
          onChange={e => setLocalMoodleSiteUrl(e.target.value)}
        />

        <p style={label}>Moodle API Token</p>
        <input
          style={input}
          type="password"
          placeholder="Your Moodle web service token"
          value={localMoodleToken}
          onChange={e => setLocalMoodleToken(e.target.value)}
        />

        <button 
          onClick={() => onConnectMoodle(localMoodleToken, localMoodleSiteUrl)} 
          disabled={moodleLoading} 
          style={{ ...btn("linear-gradient(135deg,#f98012,#e85d04)"), width: "100%" }}
        >
          {moodleLoading ? "⏳ Connecting..." : moodleConnected ? "✅ Connected to Moodle" : "🔌 Connect to Moodle"}
        </button>

        {moodleConnected && moodleCourses.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <p style={label}>Select Moodle Course</p>
            {moodleCourses.slice(0, 3).map(course => (
              <div key={course.id} style={{ marginBottom: "10px" }}>
                <button 
                  onClick={() => loadMoodleAssignments(course.id)} 
                  style={{ ...btn("#f98012"), width: "100%", textAlign: "left", padding: "10px" }}
                >
                  📚 {course.fullname}
                </button>
              </div>
            ))}
          </div>
        )}

        {moodleAssignments.length > 0 && (
          <>
            <p style={label}>Select Moodle Assignment</p>
            <select style={select} onChange={e => setSelectedMoodleAssign(e.target.value)} defaultValue="">
              <option value="">Choose assignment...</option>
              {moodleAssignments.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <p style={label}>Match to Local Assignment</p>
            <select style={select} onChange={e => setMoodleLocalId(e.target.value)} defaultValue="">
              <option value="">Choose local assignment...</option>
              {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>

            <button onClick={gradeFromMoodle} style={{ ...btn("#f98012"), width: "100%", marginTop: "10px" }}>
              🤖 Grade Submissions from Moodle
            </button>
          </>
        )}

        {moodleResults && (
          <div style={{ marginTop: "16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "12px", padding: "16px" }}>
            <p style={{ fontWeight: "800", color: "#ea580c" }}>✅ Graded {moodleResults.total_graded} essays</p>
          </div>
        )}
      </div>
    </div>
  );
}
