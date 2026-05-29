
// src/components/teacher/IntegrationsTab.jsx
// No external CSS — all styles inline. Uses Tabler Icons via Icon component.

import { useState } from "react";
import { apiFetch } from "./api.js";
import { Icon } from "./shared.jsx";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  blue: { bg: "#E6F1FB", border: "#B5D4F4", text: "#185FA5", dark: "#0C447C" },
  green: { bg: "#EAF3DE", border: "#C0DD97", text: "#3B6D11", dark: "#27500A" },
  amber: { bg: "#FAEEDA", border: "#FAC775", text: "#854F0B", dark: "#633806" },
  red: { bg: "#FCEBEB", border: "#F7C1C1", text: "#A32D2D", dark: "#791F1F" },
  purple: { bg: "#EEEDFE", border: "#CECBF6", text: "#3C3489", dark: "#26215C" },
  gray: { bg: "#F1EFE8", border: "#D3D1C7", text: "#5F5E5A", dark: "#2C2C2A" },
};

// ── Shared sub-components ─────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: "#8884A8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#F1EFE8", margin: "16px 0" }} />;
}

function StepBlock({ step, label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#1A1830", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {step}
        </div>
        <SectionLabel>{label}</SectionLabel>
      </div>
      {children}
    </div>
  );
}

function Btn({ onClick, disabled, loading, icon, children, color = "dark", small = false, fullWidth = false }) {
  const palettes = {
    dark: { bg: "#1A1830", hover: "#26215C" },
    blue: { bg: "#185FA5", hover: "#0C447C" },
    green: { bg: "#3B6D11", hover: "#27500A" },
    amber: { bg: "#854F0B", hover: "#633806" },
    purple: { bg: "#3C3489", hover: "#26215C" },
    red: { bg: "#A32D2D", hover: "#791F1F" },
    ghost: { bg: "#F1EFE8", hover: "#D3D1C7" },
  };
  const p = palettes[color] || palettes.dark;
  const isGhost = color === "ghost";
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: small ? "6px 12px" : "9px 16px",
        borderRadius: 9, border: isGhost ? `1px solid ${C.gray.border}` : "none",
        background: (disabled || loading) ? "#D3D1C7" : p.bg,
        color: isGhost ? C.gray.dark : "#fff",
        fontWeight: 500, fontSize: small ? 12 : 13,
        cursor: (disabled || loading) ? "not-allowed" : "pointer",
        fontFamily: "inherit", whiteSpace: "nowrap",
        width: fullWidth ? "100%" : undefined,
        transition: "background 0.15s",
      }}
    >
      {loading
        ? <Icon name="loader-2" size={13} style={{ color: isGhost ? C.gray.dark : "#fff", animation: "spin 0.8s linear infinite" }} />
        : icon && <Icon name={icon} size={13} style={{ color: isGhost ? C.gray.dark : "#fff" }} />}
      {children}
    </button>
  );
}

function SelectField({ value, onChange, placeholder, children, disabled }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%", padding: "9px 36px 9px 12px", borderRadius: 9,
          border: `1px solid ${C.gray.border}`, fontSize: 13,
          fontFamily: "inherit", background: "#F8F7FF",
          appearance: "none", cursor: disabled ? "not-allowed" : "pointer",
          color: "#1A1830", boxSizing: "border-box",
        }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <Icon name="chevron-down" size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#8884A8", pointerEvents: "none" }} />
    </div>
  );
}

function ResultsBox({ results, total, color = "green" }) {
  const c = C[color] || C.green;
  return (
    <div style={{ marginTop: 16, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 11, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <Icon name="circle-check" size={15} style={{ color: c.text }} />
        <p style={{ fontWeight: 700, color: c.text, margin: 0, fontSize: 13 }}>
          Graded {total} essays successfully
        </p>
      </div>
      {results?.map((r, i) => {
        // Use real name if available, fallback to ID
        const displayName = r.student_name && r.student_name !== "Unknown"
          ? r.student_name
          : r.student_name || r.google_student_id || `User ${r.moodle_user_id}`;

        return (
          <div key={i} style={{
            padding: "7px 11px", borderRadius: 8, marginBottom: 6, fontSize: 12,
            background: r.status === "graded" ? C.green.bg : C.red.bg,
            border: `1px solid ${r.status === "graded" ? C.green.border : C.red.border}`,
            color: r.status === "graded" ? C.green.text : C.red.text,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Icon
              name={r.status === "graded" ? "circle-check" : "circle-x"}
              size={12}
              style={{ color: r.status === "graded" ? C.green.text : C.red.text, flexShrink: 0 }}
            />
            <span style={{ fontWeight: 600 }}>{displayName}</span>
            {r.status === "graded"
              ? <span style={{ marginLeft: "auto" }}>Score: <strong>{r.score}</strong></span>
              : <span style={{ marginLeft: "auto", color: C.red.text }}>{r.error}</span>
            }
          </div>
        );
      })}
    </div>
  );
}

function PlatformCard({ icon, iconColor, title, subtitle, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #ECECF2", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={20} style={{ color: "#fff" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1A1830" }}>{title}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#8884A8" }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function IntegrationsTab({ selectedClass, showToast, assignments }) {

  // ── Google Classroom state ─────────────────────────────────────────────
  const [gcCourses, setGcCourses] = useState([]);
  const [gcAssignments, setGcAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGcWork, setSelectedGcWork] = useState("");
  const [selectedLocalId, setSelectedLocalId] = useState("");
  const [gcLoading, setGcLoading] = useState(false);
  const [gcResults, setGcResults] = useState(null);
  const [linkClassId, setLinkClassId] = useState("");
  const [linking, setLinking] = useState(false);
  const [classes, setClasses] = useState([]);

  // ── Moodle state ───────────────────────────────────────────────────────
  const [moodleToken,          setMoodleToken]          = useState("");
  const [moodleSiteUrl,        setMoodleSiteUrl]        = useState("https://essaygrade2.moodlecloud.com");
  const [moodleCourses,        setMoodleCourses]        = useState([]);
  const [moodleAssignments,    setMoodleAssignments]    = useState([]);
  const [selectedMoodleCourse, setSelectedMoodleCourse] = useState(null);
  const [selectedMoodleAssign, setSelectedMoodleAssign] = useState("");
  const [moodleLocalId, setMoodleLocalId] = useState("");
  const [moodleLoading, setMoodleLoading] = useState(false);
  const [moodleResults, setMoodleResults] = useState(null);
  const [moodleConnected, setMoodleConnected] = useState(false);
  const [moodleQuizzes, setMoodleQuizzes] = useState([]);
  const [selectedMoodleQuiz, setSelectedMoodleQuiz] = useState("");
  const [quizLocalId, setQuizLocalId] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // ── Moodle handlers ────────────────────────────────────────────────────
  const connectMoodle = async () => {
    if (!moodleToken) { showToast("Please enter your Moodle token", "error"); return; }
    if (!moodleSiteUrl) { showToast("Please enter your Moodle site URL", "error"); return; }
    setMoodleLoading(true);
    try {
      const res = await apiFetch(`/moodle/courses?moodle_token=${moodleToken}&site_url=${encodeURIComponent(moodleSiteUrl)}`);
      setMoodleCourses(res.courses || []);
      setMoodleConnected(true);
      showToast(`Connected — found ${res.courses.length} courses`, "success");
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
      const res = await apiFetch(`/moodle/assignments?moodle_token=${moodleToken}&course_id=${courseId}&site_url=${encodeURIComponent(moodleSiteUrl)}`);
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
        body: JSON.stringify({ moodle_token: moodleToken, moodle_assignment_id: parseInt(selectedMoodleAssign), local_assignment_id: parseInt(moodleLocalId), site_url: moodleSiteUrl }),
      });
      setMoodleResults(res);
      showToast(`Graded ${res.total_graded} essays from Moodle`, "success");
    } catch (err) {
      showToast(err.message || "Moodle grading failed", "error");
    } finally {
      setMoodleLoading(false);
    }
  };

  const loadMoodleQuizzes = async (courseId) => {
    setSelectedMoodleCourse(courseId);
    setMoodleLoading(true);
    try {
      const res = await apiFetch(`/moodle/quizzes?moodle_token=${moodleToken}&course_id=${courseId}&site_url=${encodeURIComponent(moodleSiteUrl)}`);
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
    const payload = {
      moodle_token: moodleToken,
      quiz_id: parseInt(selectedMoodleQuiz),
      course_id: parseInt(selectedMoodleCourse),
      local_assignment_id: parseInt(quizLocalId),
      site_url: moodleSiteUrl,
    };
    setQuizLoading(true);
    setQuizResults(null);
    try {
      const res = await apiFetch("/moodle/autograde-quiz", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setQuizResults(res);
      showToast(`Graded ${res.total_graded} quiz essays from Moodle`, "success");
    } catch (err) {
      showToast(err.message || "Quiz grading failed", "error");
    } finally {
      setQuizLoading(false);
    }
  };

  // ── Google Classroom handlers ──────────────────────────────────────────
  const connectGoogle = async () => {
    // Must open the popup SYNCHRONOUSLY before any await — browsers block
    // window.open() if it isn't called as a direct result of a user gesture.
    const popup = window.open("", "_blank", "width=600,height=700");
    if (!popup) {
      showToast("Popup was blocked — please allow popups for this site and try again", "error");
      return;
    }
    popup.document.write(`
      <html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#F8F7FF">
        <p style="color:#1A1830;font-size:15px">Connecting to Google…</p>
      </body></html>
    `);
    try {
      const res = await apiFetch("/auth/google/classroom");
      popup.location.href = res.auth_url;
      showToast("Complete login in the popup window", "success");
    } catch (err) {
      popup.close();
      showToast(err.message || "Could not connect to Google", "error");
    }
  };

  const loadGcCourses = async () => {
    setGcLoading(true);
    try {
      const [gcRes, clsRes] = await Promise.all([apiFetch("/classroom/courses"), apiFetch("/classes")]);
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

  // const syncFromGc = async (courseId) => {
  //   setGcLoading(true);
  //   try {
  //     const res = await apiFetch(`/classroom/courses/${courseId}/sync`, { method: "POST" });
  //     showToast(res.message, "success");
  //   } catch (err) {
  //     showToast(err.message || "Sync failed", "error");
  //   } finally {
  //     setGcLoading(false);
  //   }
  // };



  const syncFromGc = async (courseId) => {
    if (!linkClassId) {
      showToast("Please select a local class to link before syncing", "error");
      return;
    }
    setGcLoading(true);
    try {
      const res = await apiFetch(
        `/classroom/courses/${courseId}/sync?local_class_id=${linkClassId}`,
        { method: "POST" }
      );
      showToast(res.message, "success");
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
      showToast(`Graded ${res.total_graded} essays from Google Classroom`, "success");
    } catch (err) {
      showToast(err.message || "Grading failed", "error");
    } finally {
      setGcLoading(false);
    }
  };

  const linkCourseToClass = async (courseId) => {
    if (!linkClassId) { showToast("Please select a class to link", "error"); return; }
    setLinking(true);
    try {
      await apiFetch(`/classes/${linkClassId}/link-google`, {
        method: "POST",
        body: JSON.stringify({ gc_course_id: courseId }),
      });
      showToast("Course linked — assignments will now sync", "success");
    } catch (err) {
      showToast(err.message || "Failed to link", "error");
    } finally {
      setLinking(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1830", margin: "0 0 20px" }}>
        External integrations
      </p>

      {/* ── Google Classroom ─────────────────────────────────────────────── */}
      <PlatformCard icon="brand-google" iconColor="#185FA5" title="Google Classroom" subtitle="Import and auto-grade student submissions">

        {/* Step 1 */}
        <StepBlock step={1} label="Connect your Google account">
          <Btn icon="lock" color="blue" onClick={connectGoogle}>Connect Google Classroom</Btn>
        </StepBlock>

        <Divider />

        {/* Step 2 */}
        <StepBlock step={2} label="Load your courses">
          <Btn icon="books" color="purple" loading={gcLoading} onClick={loadGcCourses}>
            {gcLoading ? "Loading…" : "Load my courses"}
          </Btn>
        </StepBlock>

        {/* Step 3 — course list */}
        {gcCourses.length > 0 && (
          <>
            <Divider />
            <StepBlock step={3} label="Link each course to a local class">
              {gcCourses.map(course => (
                <div key={course.id} style={{ padding: 14, border: `1px solid ${C.gray.border}`, borderRadius: 10, marginBottom: 10, background: "#F8F7FF" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <Icon name="school" size={14} style={{ color: C.blue.text }} />
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1A1830" }}>{course.name} {course.section}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <SelectField value={linkClassId} onChange={setLinkClassId} placeholder="Select local class to link…">
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} — {c.subject}</option>)}
                      </SelectField>
                    </div>
                    <Btn icon="link" color="green" small loading={linking} onClick={() => linkCourseToClass(course.id)}>Link</Btn>
                    <Btn icon="list" color="purple" small loading={gcLoading} onClick={() => loadGcAssignments(course.id)}>Assignments</Btn>
                    {/* <Btn icon="refresh" color="amber" small loading={gcLoading} onClick={() => syncFromGc(course.id)}>Sync</Btn> */}
                  <Btn icon="refresh" color="amber" small loading={gcLoading} onClick={() => {
                        if (!linkClassId) { showToast("Select a local class first, then click Sync", "error"); return; }
                        syncFromGc(course.id);
                      }}>Sync</Btn>
                  </div>
                </div>
              ))}
            </StepBlock>
          </>
        )}

        {/* Step 4 — GC assignment */}
        {gcAssignments.length > 0 && (
          <>
            <Divider />
            <StepBlock step={4} label="Select the Google Classroom assignment">
              <SelectField value={selectedGcWork} onChange={setSelectedGcWork} placeholder="Choose assignment from Google Classroom…">
                {gcAssignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </SelectField>
            </StepBlock>
          </>
        )}

        {/* Step 5 — local assignment */}
        {gcAssignments.length > 0 && (
          <>
            <Divider />
            <StepBlock step={5} label="Match to your local assignment (for rubric)">
              <SelectField value={selectedLocalId} onChange={setSelectedLocalId} placeholder="Choose your local assignment…">
                {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </SelectField>
            </StepBlock>
          </>
        )}

        {/* Grade button */}
        {selectedGcWork && selectedLocalId && (
          <>
            <Divider />
            <Btn icon="robot" color="green" fullWidth loading={gcLoading} onClick={gradeFromClassroom}>
              {gcLoading ? "Grading…" : "Grade all submissions from Google Classroom"}
            </Btn>
          </>
        )}

        {gcResults && <ResultsBox results={gcResults.results} total={gcResults.total_graded} color="green" />}
      </PlatformCard>

      {/* ── Moodle ───────────────────────────────────────────────────────── */}
      <PlatformCard icon="school" iconColor="#854F0B" title="Moodle" subtitle="Import and auto-grade from your Moodle LMS">

        {/* Step 1 — site URL */}
        <StepBlock step={1} label="Moodle site URL">
          <input
            type="text"
            placeholder="https://yoursite.moodlecloud.com"
            value={moodleSiteUrl}
            onChange={e => setMoodleSiteUrl(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1px solid ${C.gray.border}`, fontSize: 13, fontFamily: "inherit", background: "#F8F7FF", color: "#1A1830", outline: "none", boxSizing: "border-box" }}
          />
        </StepBlock>

        <Divider />

        {/* Step 2 — token */}
        <StepBlock step={2} label="Moodle API token">
          <input
            type="password"
            placeholder="Paste your Moodle Web Service token…"
            value={moodleToken}
            onChange={e => setMoodleToken(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1px solid ${C.gray.border}`, fontSize: 13, fontFamily: "inherit", background: "#F8F7FF", color: "#1A1830", outline: "none", boxSizing: "border-box" }}
          />
        </StepBlock>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <Btn icon="plug-connected" color="amber" loading={moodleLoading} onClick={connectMoodle}>
            {moodleLoading ? "Connecting…" : "Connect to Moodle"}
          </Btn>
          <a href={moodleSiteUrl || "https://essaygrade2.moodlecloud.com"} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9, background: C.purple.bg, color: C.purple.text, border: `1px solid ${C.purple.border}`, fontWeight: 500, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
            <Icon name="external-link" size={13} style={{ color: C.purple.text }} />
            Open Moodle
          </a>
        </div>

        {moodleConnected && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: C.green.text, marginBottom: 16 }}>
            <Icon name="circle-check" size={13} style={{ color: C.green.text }} />
            Connected to {moodleSiteUrl}
          </div>
        )}

        {/* Step 3 — courses */}
        {moodleConnected && moodleCourses.length > 0 && (
          <>
            <Divider />
            <StepBlock step={3} label="Select your Moodle course">
              {moodleCourses.map(course => (
                <div key={course.id} style={{ padding: 14, border: `1px solid ${selectedMoodleCourse == course.id ? C.amber.border : C.gray.border}`, borderRadius: 10, marginBottom: 10, background: selectedMoodleCourse == course.id ? C.amber.bg : "#F8F7FF" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <Icon name="books" size={14} style={{ color: C.amber.text }} />
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1A1830" }}>{course.fullname}</p>
                  </div>
                  <Btn icon="list" color="amber" small loading={moodleLoading} onClick={() => loadMoodleAssignments(course.id)}>
                    View assignments
                  </Btn>
                </div>
              ))}
            </StepBlock>
          </>
        )}

        {/* Step 4 — Moodle assignment */}
        {moodleAssignments.length > 0 && (
          <>
            <Divider />
            <StepBlock step={4} label="Select the Moodle assignment">
              <SelectField value={selectedMoodleAssign} onChange={setSelectedMoodleAssign} placeholder="Choose assignment from Moodle…">
                {moodleAssignments.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </SelectField>
            </StepBlock>
          </>
        )}

        {/* Step 5 — local assignment */}
        {selectedMoodleAssign && (
          <>
            <Divider />
            <StepBlock step={5} label="Match to your local assignment (for rubric)">
              <SelectField value={moodleLocalId} onChange={setMoodleLocalId} placeholder="Choose your local assignment…">
                {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </SelectField>
            </StepBlock>
          </>
        )}

        {selectedMoodleAssign && moodleLocalId && (
          <>
            <Divider />
            <Btn icon="robot" color="amber" fullWidth loading={moodleLoading} onClick={gradeFromMoodle}>
              {moodleLoading ? "Grading…" : "Grade all submissions from Moodle"}
            </Btn>
          </>
        )}

        {moodleResults && <ResultsBox results={moodleResults.results} total={moodleResults.total_graded} color="amber" />}

        {/* ── Quiz / Exam section (not implemented) ────────────────────── */}
        {/* {moodleConnected && moodleCourses.length > 0 && (
          <>
            <div style={{ height: 1, background: "#D3D1C7", margin: "24px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Icon name="file-certificate" size={16} style={{ color: C.purple.text }} />
              <p style={{ fontWeight: 700, fontSize: 14, color: "#1A1830", margin: 0 }}>Grade exams and quizzes from Moodle</p>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {moodleCourses.map(course => (
                <Btn key={course.id} icon="clipboard-list" color="purple" small loading={moodleLoading} onClick={() => loadMoodleQuizzes(course.id)}>
                  Load quizzes — {course.fullname}
                </Btn>
              ))}
            </div>

            {moodleQuizzes.length > 0 && (
              <>
                <Divider />
                <div style={{ marginBottom: 16 }}>
                  <SectionLabel>Select quiz or exam</SectionLabel>
                  <SelectField value={selectedMoodleQuiz} onChange={setSelectedMoodleQuiz} placeholder="Choose a quiz from Moodle…">
                    {moodleQuizzes.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                  </SelectField>
                </div>
              </>
            )}

            {selectedMoodleQuiz && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <SectionLabel>Match to local assignment for rubric</SectionLabel>
                  <SelectField value={quizLocalId} onChange={setQuizLocalId} placeholder="Choose your local assignment…">
                    {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                  </SelectField>
                </div>
              </>
            )}

            {selectedMoodleQuiz && quizLocalId && (
              <Btn icon="robot" color="purple" fullWidth loading={quizLoading} onClick={gradeQuizFromMoodle}>
                {quizLoading ? "Grading…" : "Grade all quiz essays from Moodle"}
              </Btn>
            )}

            {quizResults && <ResultsBox results={quizResults.results} total={quizResults.total_graded} color="purple" />}
          </>
        )} */}

      </PlatformCard>
    </div>
  );
}
