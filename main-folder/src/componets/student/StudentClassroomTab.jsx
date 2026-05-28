import { useEffect, useState } from "react";
import { apiFetch } from "./api.js";
import { Icon } from "./shared.jsx";

const C = {
  blue: { bg: "#185FA5", soft: "#E6F1FB", border: "#B5D4F4", text: "#185FA5" },
  green: { bg: "#3B6D11", soft: "#EAF3DE", border: "#C0DD97", text: "#3B6D11" },
  amber: { bg: "#854F0B", soft: "#FAEEDA", border: "#FAC775", text: "#854F0B" },
  purple: { bg: "#3C3489", soft: "#EEEDFE", border: "#CECBF6", text: "#3C3489" },
  red: { bg: "#A32D2D", soft: "#FCEBEB", border: "#F7C1C1", text: "#A32D2D" },
  gray: { bg: "#5F5E5A", soft: "#F1EFE8", border: "#D3D1C7", text: "#5F5E5A" },
};

function Button({ children, icon, loading, color = "blue", fullWidth = false, disabled, onClick }) {
  const palette = C[color] || C.blue;
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        width: fullWidth ? "100%" : undefined,
        padding: "9px 16px",
        borderRadius: 9,
        border: "none",
        background: disabled || loading ? "#D3D1C7" : palette.bg,
        color: "#fff",
        fontWeight: 600,
        fontSize: 13,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      <Icon
        name={loading ? "loader-2" : icon}
        size={14}
        style={loading ? { animation: "spin 0.8s linear infinite" } : undefined}
      />
      {children}
    </button>
  );
}

function PlatformCard({ icon, color, title, subtitle, children, connected }) {
  const palette = C[color] || C.blue;
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #ECECF2", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: palette.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
          <Icon name={icon} size={21} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1A1830" }}>{title}</p>
          <p style={{ margin: 0, fontSize: 12, color: connected ? C.green.text : "#8884A8" }}>{subtitle}</p>
        </div>
        {connected && <Icon name="circle-check" size={19} style={{ color: C.green.text }} />}
      </div>
      {children}
    </div>
  );
}

function Step({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={{
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        color: "#8884A8",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        marginBottom: 8,
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#F1EFE8", margin: "16px 0" }} />;
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #D3D1C7",
  fontSize: 13,
  fontFamily: "inherit",
  background: "#F8F7FF",
  color: "#1A1830",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle = {
  ...inputStyle,
  paddingRight: 36,
  appearance: "none",
  cursor: "pointer",
};

export default function StudentClassroomTab({ showToast, onSubmitted }) {
  const [courses, setCourses] = useState([]);
  const [gcAssignments, setGcAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(null);

  const [moodleToken, setMoodleToken] = useState("");
  const [moodleSiteUrl, setMoodleSiteUrl] = useState("");
  const [moodleConnected, setMoodleConnected] = useState(false);
  const [moodleLoading, setMoodleLoading] = useState(false);
  const [moodleSiteDisplay, setMoodleSiteDisplay] = useState("");

  useEffect(() => {
    apiFetch("/moodle/status")
      .then(res => {
        setMoodleConnected(!!res.connected);
        if (res.site_url) setMoodleSiteDisplay(res.site_url);
      })
      .catch(() => {});
  }, []);

  const connectGoogle = async () => {
    const popup = window.open("", "_blank", "width=600,height=700");
    if (!popup) {
      showToast("Popup was blocked. Please allow popups and try again.", "error");
      return;
    }
    popup.document.write("<p style='font-family:sans-serif;padding:24px'>Connecting to Google Classroom...</p>");

    try {
      const res = await apiFetch("/auth/google/classroom");
      popup.location.href = res.auth_url;
      showToast("Complete Google login, then load your courses.", "success");
    } catch (err) {
      popup.close();
      showToast(err.message || "Could not connect to Google", "error");
    }
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/classroom/courses");
      const nextCourses = res.courses || [];
      setCourses(nextCourses);
      showToast(nextCourses.length ? `Found ${nextCourses.length} course(s)` : "No active Google Classroom courses found.", nextCourses.length ? "success" : "error");
    } catch (err) {
      showToast(err.message || "Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async courseId => {
    setSelectedCourse(courseId);
    setGcAssignments([]);
    if (!courseId) return;

    setLoading(true);
    try {
      const res = await apiFetch(`/classroom/courses/${courseId}/assignments`);
      setGcAssignments(res.assignments || []);
    } catch (err) {
      showToast(err.message || "Failed to load assignments", "error");
    } finally {
      setLoading(false);
    }
  };

  const submitFromClassroom = async assignment => {
    if (!assignment.local_assignment_id) {
      showToast("This assignment has not been linked by your teacher yet.", "error");
      return;
    }

    setSubmitting(assignment.id);
    try {
      const res = await apiFetch(
        `/classroom/submit?gc_course_id=${selectedCourse}&gc_coursework_id=${assignment.id}&local_assignment_id=${assignment.local_assignment_id}`,
        { method: "POST" }
      );
      showToast(`Submitted. Score: ${res.score}/${res.max_score}`, "success");
      onSubmitted?.();
    } catch (err) {
      showToast(err.message || "Submission failed", "error");
    } finally {
      setSubmitting(null);
    }
  };

  const connectMoodle = async () => {
    const siteUrl = moodleSiteUrl.trim().replace(/\/$/, "");
    if (!siteUrl || !moodleToken.trim()) {
      showToast("Please enter both Moodle site URL and token.", "error");
      return;
    }

    setMoodleLoading(true);
    try {
      await apiFetch("/moodle/connect", {
        method: "POST",
        body: JSON.stringify({ site_url: siteUrl, token: moodleToken.trim() }),
      });
      setMoodleConnected(true);
      setMoodleSiteDisplay(siteUrl);
      setMoodleToken("");
      showToast("Connected to Moodle successfully.", "success");
    } catch (err) {
      showToast(err.message || "Failed to connect to Moodle", "error");
    } finally {
      setMoodleLoading(false);
    }
  };

  const disconnectMoodle = async () => {
    setMoodleLoading(true);
    try {
      await apiFetch("/moodle/disconnect", { method: "DELETE" });
      setMoodleConnected(false);
      setMoodleSiteUrl("");
      setMoodleSiteDisplay("");
      showToast("Disconnected from Moodle.", "success");
    } catch (err) {
      showToast(err.message || "Failed to disconnect Moodle", "error");
    } finally {
      setMoodleLoading(false);
    }
  };

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1830", margin: "0 0 16px" }}>
        Connected platforms
      </p>

      <PlatformCard
        icon="brand-google"
        color="blue"
        title="Google Classroom"
        subtitle="Submit linked classroom assignments through EssayGrade"
      >
        <Step label="Step 1 - Connect your Google account">
          <Button icon="lock" color="blue" onClick={connectGoogle}>Connect Google Classroom</Button>
        </Step>

        <Divider />

        <Step label="Step 2 - Load your enrolled courses">
          <Button icon="refresh" color="purple" loading={loading} onClick={loadCourses}>
            {loading ? "Loading..." : "Load my courses"}
          </Button>
        </Step>

        {courses.length > 0 && (
          <>
            <Divider />
            <Step label="Step 3 - Select a course">
              <div style={{ position: "relative" }}>
                <select value={selectedCourse} onChange={e => loadAssignments(e.target.value)} style={selectStyle}>
                  <option value="">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name} {course.section}</option>
                  ))}
                </select>
                <Icon name="chevron-down" size={14} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "#8884A8", pointerEvents: "none" }} />
              </div>
            </Step>
          </>
        )}

        {gcAssignments.length > 0 && (
          <>
            <Divider />
            <Step label="Step 4 - Import and submit">
              {gcAssignments.map(assignment => {
                const linked = !!assignment.local_assignment_id;
                return (
                  <div
                    key={assignment.id}
                    style={{
                      padding: "12px 14px",
                      border: `1px solid ${linked ? C.green.border : "#ECECF2"}`,
                      borderRadius: 10,
                      marginBottom: 8,
                      background: linked ? C.green.soft : "#F8F7FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 9, flex: 1, minWidth: 220 }}>
                      <Icon name={linked ? "circle-check" : "alert-triangle"} size={16} style={{ color: linked ? C.green.text : "#8884A8", marginTop: 1 }} />
                      <div>
                        <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 13, color: "#1A1830" }}>{assignment.title}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#8884A8" }}>
                          {linked ? "Linked and ready to submit" : "Not yet linked by your teacher"}
                        </p>
                      </div>
                    </div>
                    <Button
                      icon="upload"
                      color={linked ? "green" : "gray"}
                      loading={submitting === assignment.id}
                      disabled={!linked}
                      onClick={() => submitFromClassroom(assignment)}
                    >
                      {submitting === assignment.id ? "Submitting..." : "Import & submit"}
                    </Button>
                  </div>
                );
              })}
            </Step>
          </>
        )}
      </PlatformCard>

      <PlatformCard
        icon="book-2"
        color="amber"
        title="Moodle"
        subtitle={moodleConnected ? `Connected to ${moodleSiteDisplay}` : "Connect your Moodle account for teacher-linked sync"}
        connected={moodleConnected}
      >
        {!moodleConnected ? (
          <>
            <Step label="Step 1 - Moodle site URL">
              <input
                value={moodleSiteUrl}
                onChange={e => setMoodleSiteUrl(e.target.value)}
                placeholder="https://yourschool.moodlecloud.com"
                style={inputStyle}
              />
            </Step>
            <Step label="Step 2 - Web service token">
              <input
                value={moodleToken}
                onChange={e => setMoodleToken(e.target.value)}
                type="password"
                placeholder="Paste your Moodle token..."
                style={inputStyle}
              />
            </Step>
            <Button icon="plug-connected" color="amber" fullWidth loading={moodleLoading} onClick={connectMoodle}>
              {moodleLoading ? "Connecting..." : "Connect to Moodle"}
            </Button>
          </>
        ) : (
          <div>
            <div style={{
              background: C.green.soft,
              border: `1px solid ${C.green.border}`,
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 12,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}>
              <Icon name="link" size={16} style={{ color: C.green.text, marginTop: 1 }} />
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 13, color: C.green.text }}>
                  Moodle connected
                </p>
                <p style={{ margin: 0, fontSize: 12, color: C.green.bg, lineHeight: 1.5 }}>
                  Teacher-linked Moodle submissions can now sync with your EssayGrade account.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={moodleSiteDisplay || "https://essaygrade2.moodlecloud.com"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 14px",
                  borderRadius: 9,
                  background: C.gray.soft,
                  color: C.gray.text,
                  border: `1px solid ${C.gray.border}`,
                  fontWeight: 600,
                  fontSize: 12,
                  textDecoration: "none",
                }}
              >
                <Icon name="external-link" size={14} />
                Open Moodle
              </a>
              <Button icon="plug" color="red" loading={moodleLoading} onClick={disconnectMoodle}>
                Disconnect Moodle
              </Button>
            </div>
          </div>
        )}
      </PlatformCard>
    </div>
  );
}
