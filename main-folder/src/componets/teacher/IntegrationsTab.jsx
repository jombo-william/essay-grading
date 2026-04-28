
import { useState } from "react";
import { apiFetch } from "./api.js";

export default function IntegrationsTab({ selectedClass, showToast, assignments }) {

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

  // ── Moodle state ───────────────────────────────────────────────────────
  const [moodleToken,           setMoodleToken]           = useState("");
  const [moodleSiteUrl,         setMoodleSiteUrl]         = useState("https://essaygrade.moodlecloud.com");
  const [moodleCourses,         setMoodleCourses]         = useState([]);
  const [moodleAssignments,     setMoodleAssignments]     = useState([]);
  const [selectedMoodleCourse,  setSelectedMoodleCourse]  = useState(null);
  const [selectedMoodleAssign,  setSelectedMoodleAssign]  = useState(null);
  const [moodleLocalId,         setMoodleLocalId]         = useState("");
  const [moodleLoading,         setMoodleLoading]         = useState(false);
  const [moodleResults,         setMoodleResults]         = useState(null);
  const [moodleConnected,       setMoodleConnected]       = useState(false);

  const [moodleQuizzes,         setMoodleQuizzes]         = useState([]);
  const [selectedMoodleQuiz,    setSelectedMoodleQuiz]    = useState(null);
  const [quizLocalId,           setQuizLocalId]           = useState("");
  const [quizLoading,           setQuizLoading]           = useState(false);
  const [quizResults,           setQuizResults]           = useState(null);

  // ── Moodle handlers ────────────────────────────────────────────────────

  const connectMoodle = async () => {
    if (!moodleToken) {
      showToast("Please enter your Moodle token", "error");
      return;
    }
    if (!moodleSiteUrl) {
      showToast("Please enter your Moodle site URL", "error");
      return;
    }
    setMoodleLoading(true);
    try {
      const res = await apiFetch(
        `/moodle/courses?moodle_token=${moodleToken}&site_url=${encodeURIComponent(moodleSiteUrl)}`
      );
      setMoodleCourses(res.courses || []);
      setMoodleConnected(true);
      showToast(`✅ Connected! Found ${res.courses.length} courses`, "success");
    } catch (err) {
      showToast(err.message || "Failed to connect to Moodle", "error");
    } finally {
      setMoodleLoading(false);
    }
  };

  const loadMoodleAssignments = async (courseId) => {
    setSelectedMoodleCourse(courseId);
    setMoodleLoading(true);
    try {
      const res = await apiFetch(
        `/moodle/assignments?moodle_token=${moodleToken}&course_id=${courseId}&site_url=${encodeURIComponent(moodleSiteUrl)}`
      );
      const assigns = res.data?.courses?.[0]?.assignments || [];
      setMoodleAssignments(assigns);
      showToast(`Found ${assigns.length} assignments`, "success");
    } catch (err) {
      showToast(err.message || "Failed to load assignments", "error");
    } finally {
      setMoodleLoading(false);
    }
  };

  const gradeFromMoodle = async () => {
    if (!moodleToken || !selectedMoodleAssign || !moodleLocalId) {
      showToast("Please select a Moodle assignment and local assignment", "error");
      return;
    }
    setMoodleLoading(true);
    setMoodleResults(null);
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
    } finally {
      setMoodleLoading(false);
    }
  };

  const loadMoodleQuizzes = async (courseId) => {
    setMoodleLoading(true);
    try {
      const res = await apiFetch(
        `/moodle/quizzes?moodle_token=${moodleToken}&course_id=${courseId}&site_url=${encodeURIComponent(moodleSiteUrl)}`
      );
      setMoodleQuizzes(res.quizzes || []);
      showToast(`Found ${res.quizzes.length} quizzes`, "success");
    } catch (err) {
      showToast(err.message || "Failed to load quizzes", "error");
    } finally {
      setMoodleLoading(false);
    }
  };

  const gradeQuizFromMoodle = async () => {
    if (!moodleToken || !selectedMoodleQuiz || !quizLocalId) {
      showToast("Please select a quiz and local assignment", "error");
      return;
    }
    setQuizLoading(true);
    setQuizResults(null);
    try {
      const res = await apiFetch("/moodle/autograde-quiz", {
        method: "POST",
        body: JSON.stringify({
          moodle_token:        moodleToken,
          quiz_id:             parseInt(selectedMoodleQuiz),
          local_assignment_id: parseInt(quizLocalId),
          site_url:            moodleSiteUrl,
        }),
      });
      setQuizResults(res);
      showToast(`✅ Graded ${res.total_graded} quiz essays from Moodle!`, "success");
    } catch (err) {
      showToast(err.message || "Quiz grading failed", "error");
    } finally {
      setQuizLoading(false);
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
    padding:     "10px 20px",
    background:  color,
    color:       "#fff",
    border:      "none",
    borderRadius:"10px",
    fontWeight:  "700",
    fontSize:    "13px",
    cursor:      "pointer",
    fontFamily:  "inherit",
    opacity:     gcLoading || moodleLoading ? 0.7 : 1,
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

  const select = {
    ...input,
    background: "#f8fafc",
  };

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
            {gcCourses.map(course => (
              <div key={course.id} style={{
                padding: "12px", border: "1px solid #e2e8f0",
                borderRadius: "10px", marginBottom: "10px", background: "#f8fafc",
              }}>
                <p style={{ margin: "0 0 8px", fontWeight: "700", fontSize: "13px", color: "#1e293b" }}>
                  🎓 {course.name} {course.section}
                </p>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
                  <button onClick={() => linkCourseToClass(course.id)} disabled={linking}
                    style={{ ...btn("#10b981"), whiteSpace: "nowrap" }}>
                    {linking ? "Linking..." : "🔗 Link"}
                  </button>
                  <button onClick={() => loadGcAssignments(course.id)}
                    style={{ ...btn("#6366f1"), whiteSpace: "nowrap" }}>
                    View Assignments
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {gcAssignments.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={label}>Step 4 — Select the Google Classroom assignment</p>
            <select style={select} onChange={e => setSelectedGcWork(e.target.value)} defaultValue="">
              <option value="" disabled>Choose assignment from Google Classroom...</option>
              {gcAssignments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
        )}

        {gcAssignments.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={label}>Step 5 — Match to your local assignment (for rubric)</p>
            <select style={select} onChange={e => setSelectedLocalId(e.target.value)} defaultValue="">
              <option value="" disabled>Choose your local assignment...</option>
              {assignments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
        )}

        {selectedGcWork && selectedLocalId && (
          <button onClick={gradeFromClassroom} disabled={gcLoading} style={{
            ...btn("linear-gradient(135deg,#10b981,#34d399)"),
            width: "100%", padding: "14px", fontSize: "15px",
          }}>
            {gcLoading ? "⏳ Grading..." : "🤖 Grade All Submissions from Google Classroom"}
          </button>
        )}

        {gcResults && (
          <div style={{
            marginTop: "16px", background: "#f0fdf4",
            border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px",
          }}>
            <p style={{ fontWeight: "800", color: "#16a34a", margin: "0 0 8px" }}>
              ✅ Graded {gcResults.total_graded} essays successfully!
            </p>
            {gcResults.results?.map((r, i) => (
              <div key={i} style={{
                padding: "8px 12px",
                background: r.status === "graded" ? "#dcfce7" : "#fee2e2",
                borderRadius: "8px", marginBottom: "6px", fontSize: "12px",
              }}>
                {r.status === "graded"
                  ? `✅ Student ${r.google_student_id} — Score: ${r.score}`
                  : `❌ Student ${r.google_student_id} — Error: ${r.error}`}
              </div>
            ))}
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
            <p style={{ margin: 0, fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>Moodle</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Import and auto-grade from your Moodle LMS
            </p>
          </div>
        </div>

        {/* Step 1a — Site URL */}
        <p style={label}>Step 1 — Enter your Moodle site URL</p>
        <input
          style={input}
          type="text"
          placeholder="https://yoursite.moodlecloud.com"
          value={moodleSiteUrl}
          onChange={e => setMoodleSiteUrl(e.target.value)}
        />

        {/* Step 1b — Token */}
        <p style={label}>Step 2 — Enter your Moodle API token</p>
        <input
          style={input}
          type="password"
          placeholder="Paste your Moodle Web Service token here..."
          value={moodleToken}
          onChange={e => setMoodleToken(e.target.value)}
        />

        {/* Connect + Open buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          <button onClick={connectMoodle} disabled={moodleLoading}
            style={btn("linear-gradient(135deg,#f98012,#e85d04)")}>
            {moodleLoading ? "⏳ Connecting..." : "🔌 Connect to Moodle"}
          </button>
          <a
            href={moodleSiteUrl || "https://essaygrade.moodlecloud.com"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...btn("#6366f1"), textDecoration: "none", display: "inline-block" }}
          >
            🌐 Open Moodle
          </a>
        </div>

        {/* Connected badge */}
        {moodleConnected && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: "8px", padding: "6px 12px",
            fontSize: "12px", fontWeight: "700", color: "#16a34a",
            marginBottom: "16px",
          }}>
            ✅ Connected to {moodleSiteUrl}
          </div>
        )}

        {/* Step 3 — Select course */}
        {moodleConnected && moodleCourses.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={label}>Step 3 — Select your Moodle course</p>
            {moodleCourses.map(course => (
              <div key={course.id} style={{
                padding: "12px", border: "1px solid #e2e8f0",
                borderRadius: "10px", marginBottom: "10px",
                background: selectedMoodleCourse == course.id ? "#fff7ed" : "#f8fafc",
              }}>
                <p style={{ margin: "0 0 8px", fontWeight: "700", fontSize: "13px", color: "#1e293b" }}>
                  📚 {course.fullname}
                </p>
                <button onClick={() => loadMoodleAssignments(course.id)}
                  style={{ ...btn("#f98012"), whiteSpace: "nowrap" }}>
                  View Assignments
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Step 4 — Select assignment */}
        {moodleAssignments.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={label}>Step 4 — Select the Moodle assignment</p>
            <select style={select} onChange={e => setSelectedMoodleAssign(e.target.value)} defaultValue="">
              <option value="" disabled>Choose assignment from Moodle...</option>
              {moodleAssignments.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Step 5 — Match local assignment */}
        {selectedMoodleAssign && (
          <div style={{ marginBottom: "16px" }}>
            <p style={label}>Step 5 — Match to your local assignment (for rubric)</p>
            <select style={select} onChange={e => setMoodleLocalId(e.target.value)} defaultValue="">
              <option value="" disabled>Choose your local assignment...</option>
              {assignments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* Step 6 — Grade button */}
        {selectedMoodleAssign && moodleLocalId && (
          <button onClick={gradeFromMoodle} disabled={moodleLoading} style={{
            ...btn("linear-gradient(135deg,#f98012,#e85d04)"),
            width: "100%", padding: "14px", fontSize: "15px",
          }}>
            {moodleLoading ? "⏳ Grading..." : "🤖 Grade All Submissions from Moodle"}
          </button>
        )}

        {/* Results */}
        {moodleResults && (
          <div style={{
            marginTop: "16px", background: "#fff7ed",
            border: "1px solid #fed7aa", borderRadius: "12px", padding: "16px",
          }}>
            <p style={{ fontWeight: "800", color: "#ea580c", margin: "0 0 8px" }}>
              ✅ Graded {moodleResults.total_graded} essays from Moodle!
            </p>
            {moodleResults.results?.map((r, i) => (
              <div key={i} style={{
                padding: "8px 12px",
                background: r.status === "graded" ? "#dcfce7" : "#fee2e2",
                borderRadius: "8px", marginBottom: "6px", fontSize: "12px",
              }}>
                {r.status === "graded"
                  ? `✅ User ${r.moodle_user_id} — Score: ${r.score}`
                  : `❌ User ${r.moodle_user_id} — Error: ${r.error}`}
              </div>
            ))}
          </div>
        )}

        {/* ── Quiz / Exam section ──────────────────────────────────── */}
        {moodleConnected && moodleCourses.length > 0 && (
          <div style={{ marginTop: "24px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
            <p style={{ fontWeight: "800", fontSize: "14px", color: "#1e293b", marginBottom: "12px" }}>
              🎓 Grade Exams / Quizzes from Moodle
            </p>

            {moodleCourses.map(course => (
              <div key={course.id} style={{ marginBottom: "8px" }}>
                <button onClick={() => loadMoodleQuizzes(course.id)}
                  style={{ ...btn("#7c3aed"), fontSize: "12px" }}>
                  📝 Load Quizzes from {course.fullname}
                </button>
              </div>
            ))}

            {moodleQuizzes.length > 0 && (
              <div style={{ marginBottom: "16px", marginTop: "12px" }}>
                <p style={label}>Select Quiz / Exam</p>
                <select style={select} onChange={e => setSelectedMoodleQuiz(e.target.value)} defaultValue="">
                  <option value="" disabled>Choose a quiz from Moodle...</option>
                  {moodleQuizzes.map(q => (
                    <option key={q.id} value={q.id}>{q.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedMoodleQuiz && (
              <div style={{ marginBottom: "16px" }}>
                <p style={label}>Match to local assignment for rubric</p>
                <select style={select} onChange={e => setQuizLocalId(e.target.value)} defaultValue="">
                  <option value="" disabled>Choose your local assignment...</option>
                  {assignments.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedMoodleQuiz && quizLocalId && (
              <button onClick={gradeQuizFromMoodle} disabled={quizLoading} style={{
                ...btn("linear-gradient(135deg,#7c3aed,#a855f7)"),
                width: "100%", padding: "14px", fontSize: "15px",
              }}>
                {quizLoading ? "⏳ Grading..." : "🤖 Grade All Quiz Essays from Moodle"}
              </button>
            )}

            {quizResults && (
              <div style={{
                marginTop: "16px", background: "#f5f3ff",
                border: "1px solid #ddd6fe", borderRadius: "12px", padding: "16px",
              }}>
                <p style={{ fontWeight: "800", color: "#7c3aed", margin: "0 0 8px" }}>
                  ✅ Graded {quizResults.total_graded} quiz essays!
                </p>
                {quizResults.results?.map((r, i) => (
                  <div key={i} style={{
                    padding: "8px 12px",
                    background: r.status === "graded" ? "#dcfce7" : "#fee2e2",
                    borderRadius: "8px", marginBottom: "6px", fontSize: "12px",
                  }}>
                    {r.status === "graded"
                      ? `✅ User ${r.moodle_user_id} — Score: ${r.score}`
                      : `❌ User ${r.moodle_user_id} — Error: ${r.error}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}