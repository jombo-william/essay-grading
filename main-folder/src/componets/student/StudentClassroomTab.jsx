import { useState, useEffect } from "react";
import { apiFetch } from "./api.js";

export default function StudentClassroomTab({ assignments, showToast, onSubmitted }) {

  // ── Google Classroom state ─────────────────────────────────────────────────
  const [connected,      setConnected]      = useState(false);
  const [courses,        setCourses]        = useState([]);
  const [gcAssignments,  setGcAssignments]  = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [submitting,     setSubmitting]     = useState(null);

  // ── Moodle state ───────────────────────────────────────────────────────────
  const [moodleToken,      setMoodleToken]      = useState("");
  const [moodleSiteUrl,    setMoodleSiteUrl]    = useState("");
  const [moodleConnected,  setMoodleConnected]  = useState(false);
  const [moodleLoading,    setMoodleLoading]    = useState(false);
  const [moodleSiteDisplay,setMoodleSiteDisplay]= useState("");

  // ── Styles ─────────────────────────────────────────────────────────────────
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
  const input = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "13px",
    fontFamily: "inherit", marginBottom: "12px",
    boxSizing: "border-box",
  };

  // ── Check Moodle connection status on load ─────────────────────────────────
  useEffect(() => {
    apiFetch("/moodle/status")
      .then(res => {
        setMoodleConnected(res.connected);
        if (res.site_url) setMoodleSiteDisplay(res.site_url);
      })
      .catch(() => {});
  }, []);

  // ── Google Classroom handlers ──────────────────────────────────────────────
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

  // ── Moodle handlers ────────────────────────────────────────────────────────
  const connectMoodle = async () => {
    if (!moodleToken || !moodleSiteUrl) {
      showToast("Please enter both Moodle site URL and token", "error");
      return;
    }
    setMoodleLoading(true);
    try {
      await apiFetch("/moodle/connect", {
        method: "POST",
        body: JSON.stringify({
          token:    moodleToken,
          site_url: moodleSiteUrl.trim().replace(/\/$/, ""),
        }),
      });
      setMoodleConnected(true);
      setMoodleSiteDisplay(moodleSiteUrl);
      showToast("✅ Connected to Moodle successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to connect to Moodle", "error");
    } finally {
      setMoodleLoading(false);
    }
  };

  const disconnectMoodle = async () => {
    try {
      await apiFetch("/moodle/disconnect", { method: "DELETE" });
      setMoodleConnected(false);
      setMoodleToken("");
      setMoodleSiteUrl("");
      setMoodleSiteDisplay("");
      showToast("Disconnected from Moodle", "success");
    } catch (err) {
      showToast(err.message || "Failed to disconnect", "error");
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>
        🔗 Connected Platforms
      </h2>

      {/* ── Google Classroom ───────────────────────────────────────────────── */}
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
              Submit assignments and sync results with Google Classroom
            </p>
          </div>
        </div>

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
              Step 4 — Import and submit an assignment
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
                    {submitting === a.id ? "⏳ Submitting..." : "📤 Import and Submit"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Moodle ────────────────────────────────────────────────────────── */}
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
              {moodleConnected
                ? `✅ Connected to ${moodleSiteDisplay}`
                : "Connect to sync your submissions with Moodle"}
            </p>
          </div>
        </div>

        {!moodleConnected ? (
          <>
            <p style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
              Step 1 — Enter your Moodle site URL
            </p>
            <input
              style={input}
              placeholder="e.g. https://yourschool.moodlecloud.com"
              value={moodleSiteUrl}
              onChange={e => setMoodleSiteUrl(e.target.value)}
            />

            <p style={{ fontWeight: "700", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
              Step 2 — Enter your Moodle web service token
            </p>
            <input
              style={input}
              type="password"
              placeholder="Paste your Moodle token here..."
              value={moodleToken}
              onChange={e => setMoodleToken(e.target.value)}
            />

            <button
              onClick={connectMoodle}
              disabled={moodleLoading}
              style={{
                ...btn("linear-gradient(135deg,#f98012,#e85d04)"),
                width: "100%",
                padding: "12px",
              }}
            >
              {moodleLoading ? "⏳ Connecting..." : "🔌 Connect to Moodle"}
            </button>

            <div style={{
              marginTop: "12px", background: "#fff7ed",
              border: "1px solid #fed7aa", borderRadius: "10px",
              padding: "10px 14px",
            }}>
              {/* <p style={{ margin: 0, fontSize: "12px", color: "#92400e" }}>
                💡 Ask your teacher for your Moodle token. Once connected, any assignment
                you submit here will automatically appear in Moodle too.
              </p> */}
            </div>
          </>
        ) : (
          <div>
            <div style={{
              background: "#fff7ed", border: "1px solid #fed7aa",
              borderRadius: "12px", padding: "14px 16px", marginBottom: "12px",
            }}>
              <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "13px", color: "#ea580c" }}>
                ✅ Moodle Connected
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#92400e" }}>
                Your submissions in EssayGrade AI will automatically sync to Moodle
                when the assignment is linked to Moodle by your teacher.
              </p>
            </div>
            <button
              onClick={disconnectMoodle}
              style={{
                ...btn("#ef4444"),
                fontSize: "12px",
                padding: "8px 16px",
              }}
            >
              🔌 Disconnect Moodle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}