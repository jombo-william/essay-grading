

// import { useState, useEffect } from "react";
// import {
//   GraduationCap,
//   BookOpen,
//   Lock,
//   RefreshCw,
//   ChevronDown,
//   Upload,
//   CheckCircle2,
//   AlertTriangle,
//   Plug,
//   PlugZap,
//   Loader2,
//   Link2,
// } from "lucide-react";
// import { apiFetch } from "./api.js";

// export default function StudentClassroomTab({ assignments, showToast, onSubmitted }) {

//   // ── Google Classroom state ─────────────────────────────────────────────────
//   const [connected,      setConnected]      = useState(false);
//   const [courses,        setCourses]        = useState([]);
//   const [gcAssignments,  setGcAssignments]  = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [loading,        setLoading]        = useState(false);
//   const [submitting,     setSubmitting]     = useState(null);

//   // ── Moodle state ───────────────────────────────────────────────────────────
//   const [moodleToken,       setMoodleToken]       = useState("");
//   const [moodleSiteUrl,     setMoodleSiteUrl]     = useState("");
//   const [moodleConnected,   setMoodleConnected]   = useState(false);
//   const [moodleLoading,     setMoodleLoading]     = useState(false);
//   const [moodleSiteDisplay, setMoodleSiteDisplay] = useState("");

//   // ── Styles ─────────────────────────────────────────────────────────────────
//   const card = {
//     background: "#fff",
//     borderRadius: "14px",
//     padding: "24px",
//     border: "1px solid #e2e8f0",
//     marginBottom: "20px",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//   };

//   const platformIcon = (bg) => ({
//     width: "42px",
//     height: "42px",
//     borderRadius: "10px",
//     background: bg,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//   });

//   const btn = (bg = "#3b82f6", extra = {}) => ({
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "7px",
//     padding: "9px 18px",
//     background: bg,
//     color: "#fff",
//     border: "none",
//     borderRadius: "9px",
//     fontWeight: "600",
//     fontSize: "13px",
//     cursor: "pointer",
//     fontFamily: "inherit",
//     lineHeight: 1,
//     ...extra,
//   });

//   const selectStyle = {
//     width: "100%",
//     padding: "10px 14px",
//     borderRadius: "9px",
//     border: "1.5px solid #e2e8f0",
//     fontSize: "13px",
//     fontFamily: "inherit",
//     marginBottom: "12px",
//     boxSizing: "border-box",
//     background: "#f8fafc",
//     appearance: "none",
//     cursor: "pointer",
//   };

//   const inputStyle = {
//     width: "100%",
//     padding: "10px 14px",
//     borderRadius: "9px",
//     border: "1.5px solid #e2e8f0",
//     fontSize: "13px",
//     fontFamily: "inherit",
//     marginBottom: "12px",
//     boxSizing: "border-box",
//     outline: "none",
//   };

//   const stepLabel = {
//     fontWeight: "600",
//     fontSize: "12px",
//     color: "#64748b",
//     marginBottom: "8px",
//     textTransform: "uppercase",
//     letterSpacing: "0.05em",
//   };

//   // ── Check Moodle connection status on load ─────────────────────────────────
//   useEffect(() => {
//     apiFetch("/moodle/status")
//       .then(res => {
//         setMoodleConnected(res.connected);
//         if (res.site_url) setMoodleSiteDisplay(res.site_url);
//       })
//       .catch(() => {});
//   }, []);

//   // ── Google Classroom handlers ──────────────────────────────────────────────
//   const connectGoogle = async () => {
//     try {
//       const res = await apiFetch("/auth/google/classroom");
//       window.open(res.auth_url, "_blank", "width=600,height=700");
//       showToast("Complete login in the popup, then click 'Load My Courses'", "success");
//       setConnected(true);
//     } catch (err) {
//       showToast(err.message || "Could not connect to Google", "error");
//     }
//   };

//   const loadCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await apiFetch("/classroom/courses");
//       setCourses(res.courses || []);
//       setConnected(true);
//       if ((res.courses || []).length === 0)
//         showToast("No active Google Classroom courses found.", "error");
//       else
//         showToast(`Found ${res.courses.length} course(s)`, "success");
//     } catch (err) {
//       showToast(err.message || "Failed to load courses", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAssignments = async (courseId) => {
//     setLoading(true);
//     setSelectedCourse(courseId);
//     setGcAssignments([]);
//     try {
//       const res = await apiFetch(`/classroom/courses/${courseId}/assignments`);
//       setGcAssignments(res.assignments || []);
//     } catch (err) {
//       showToast(err.message || "Failed to load assignments", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitFromClassroom = async (gcAssignment) => {
//     if (!gcAssignment.local_assignment_id) {
//       showToast("This assignment hasn't been linked by your teacher yet.", "error");
//       return;
//     }
//     setSubmitting(gcAssignment.id);
//     try {
//       const res = await apiFetch(
//         `/classroom/submit?gc_course_id=${selectedCourse}&gc_coursework_id=${gcAssignment.id}&local_assignment_id=${gcAssignment.local_assignment_id}`,
//         { method: "POST" }
//       );
//       showToast(`Submitted! AI Score: ${res.score}/${res.max_score}`, "success");
//       if (onSubmitted) onSubmitted();
//     } catch (err) {
//       showToast(err.message || "Submission failed", "error");
//     } finally {
//       setSubmitting(null);
//     }
//   };

//   // ── Moodle handlers ────────────────────────────────────────────────────────
//   const connectMoodle = async () => {
//     if (!moodleToken || !moodleSiteUrl) {
//       showToast("Please enter both Moodle site URL and token", "error");
//       return;
//     }
//     setMoodleLoading(true);
//     try {
//       await apiFetch("/moodle/connect", {
//         method: "POST",
//         body: JSON.stringify({
//           token:    moodleToken,
//           site_url: moodleSiteUrl.trim().replace(/\/$/, ""),
//         }),
//       });
//       setMoodleConnected(true);
//       setMoodleSiteDisplay(moodleSiteUrl);
//       showToast("Connected to Moodle successfully!", "success");
//     } catch (err) {
//       showToast(err.message || "Failed to connect to Moodle", "error");
//     } finally {
//       setMoodleLoading(false);
//     }
//   };

//   const disconnectMoodle = async () => {
//     try {
//       await apiFetch("/moodle/disconnect", { method: "DELETE" });
//       setMoodleConnected(false);
//       setMoodleToken("");
//       setMoodleSiteUrl("");
//       setMoodleSiteDisplay("");
//       showToast("Disconnected from Moodle", "success");
//     } catch (err) {
//       showToast(err.message || "Failed to disconnect", "error");
//     }
//   };

//   return (
//     <div>
//       <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>
//         Connected Platforms
//       </h2>

//       {/* ── Google Classroom ───────────────────────────────────────────────── */}
//       <div style={card}>
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
//           <div style={platformIcon("linear-gradient(135deg,#4285f4,#34a853)")}>
//             <GraduationCap size={20} color="#fff" />
//           </div>
//           <div>
//             <p style={{ margin: 0, fontWeight: "700", fontSize: "15px", color: "#1e293b" }}>
//               Google Classroom
//             </p>
//             <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
//               Submit assignments and sync results
//             </p>
//           </div>
//         </div>

//         {/* Step 1 */}
//         <div style={{ marginBottom: "18px" }}>
//           <p style={stepLabel}>Step 1 — Connect your Google account</p>
//           <button onClick={connectGoogle} style={btn("linear-gradient(135deg,#4285f4,#34a853)")}>
//             <Lock size={14} />
//             Connect Google Classroom
//           </button>
//         </div>

//         {/* Step 2 */}
//         <div style={{ marginBottom: "18px" }}>
//           <p style={stepLabel}>Step 2 — Load your enrolled courses</p>
//           <button onClick={loadCourses} disabled={loading} style={btn("#6366f1")}>
//             {loading
//               ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading...</>
//               : <><RefreshCw size={14} /> Load My Courses</>
//             }
//           </button>
//         </div>

//         {/* Step 3 — Course selector */}
//         {courses.length > 0 && (
//           <div style={{ marginBottom: "18px" }}>
//             <p style={stepLabel}>Step 3 — Select a course</p>
//             <div style={{ position: "relative" }}>
//               <select
//                 style={selectStyle}
//                 defaultValue=""
//                 onChange={e => loadAssignments(e.target.value)}
//               >
//                 <option value="" disabled>Choose a course...</option>
//                 {courses.map(c => (
//                   <option key={c.id} value={c.id}>{c.name} {c.section}</option>
//                 ))}
//               </select>
//               <ChevronDown
//                 size={14}
//                 style={{
//                   position: "absolute", right: "12px", top: "50%",
//                   transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8",
//                 }}
//               />
//             </div>
//           </div>
//         )}

//         {/* Step 4 — Assignments list */}
//         {gcAssignments.length > 0 && (
//           <div>
//             <p style={stepLabel}>Step 4 — Import and submit an assignment</p>
//             {gcAssignments.map(a => (
//               <div
//                 key={a.id}
//                 style={{
//                   padding: "13px 16px",
//                   border: `1px solid ${a.local_assignment_id ? "#bbf7d0" : "#e2e8f0"}`,
//                   borderRadius: "10px",
//                   marginBottom: "8px",
//                   background: a.local_assignment_id ? "#f0fdf4" : "#f8fafc",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   gap: "10px",
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1 }}>
//                   <div style={{
//                     marginTop: "2px",
//                     color: a.local_assignment_id ? "#16a34a" : "#94a3b8",
//                     flexShrink: 0,
//                   }}>
//                     {a.local_assignment_id
//                       ? <CheckCircle2 size={15} />
//                       : <AlertTriangle size={15} />
//                     }
//                   </div>
//                   <div>
//                     <p style={{ margin: "0 0 2px", fontWeight: "600", fontSize: "13px", color: "#1e293b" }}>
//                       {a.title}
//                     </p>
//                     <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
//                       {a.local_assignment_id
//                         ? "Linked — ready to submit"
//                         : "Not yet linked by teacher"}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => submitFromClassroom(a)}
//                   disabled={!a.local_assignment_id || submitting === a.id}
//                   style={{
//                     ...btn(
//                       a.local_assignment_id
//                         ? "linear-gradient(135deg,#10b981,#34d399)"
//                         : "#cbd5e1"
//                     ),
//                     cursor: !a.local_assignment_id ? "not-allowed" : "pointer",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {submitting === a.id
//                     ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</>
//                     : <><Upload size={13} /> Import & Submit</>
//                   }
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── Moodle ────────────────────────────────────────────────────────── */}
//       <div style={card}>
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
//           <div style={platformIcon("linear-gradient(135deg,#f98012,#e85d04)")}>
//             <BookOpen size={20} color="#fff" />
//           </div>
//           <div>
//             <p style={{ margin: 0, fontWeight: "700", fontSize: "15px", color: "#1e293b" }}>
//               Moodle
//             </p>
//             <p style={{ margin: 0, fontSize: "12px", color: moodleConnected ? "#16a34a" : "#94a3b8" }}>
//               {moodleConnected
//                 ? `Connected to ${moodleSiteDisplay}`
//                 : "Connect to sync submissions with Moodle"}
//             </p>
//           </div>
//           {moodleConnected && (
//             <div style={{ marginLeft: "auto" }}>
//               <CheckCircle2 size={18} color="#16a34a" />
//             </div>
//           )}
//         </div>

//         {!moodleConnected ? (
//           <>
//             <div style={{ marginBottom: "14px" }}>
//               <p style={stepLabel}>Step 1 — Moodle site URL</p>
//               <input
//                 style={inputStyle}
//                 placeholder="https://yourschool.moodlecloud.com"
//                 value={moodleSiteUrl}
//                 onChange={e => setMoodleSiteUrl(e.target.value)}
//               />
//             </div>

//             <div style={{ marginBottom: "16px" }}>
//               <p style={stepLabel}>Step 2 — Web service token</p>
//               <input
//                 style={inputStyle}
//                 type="password"
//                 placeholder="Paste your Moodle token..."
//                 value={moodleToken}
//                 onChange={e => setMoodleToken(e.target.value)}
//               />
//             </div>

//             <button
//               onClick={connectMoodle}
//               disabled={moodleLoading}
//               style={{
//                 ...btn("linear-gradient(135deg,#f98012,#e85d04)"),
//                 width: "100%",
//                 justifyContent: "center",
//                 padding: "11px",
//               }}
//             >
//               {moodleLoading
//                 ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Connecting...</>
//                 : <><PlugZap size={14} /> Connect to Moodle</>
//               }
//             </button>
//           </>
//         ) : (
//           <div>
//             <div style={{
//               background: "#fff7ed",
//               border: "1px solid #fed7aa",
//               borderRadius: "10px",
//               padding: "13px 16px",
//               marginBottom: "12px",
//               display: "flex",
//               gap: "10px",
//               alignItems: "flex-start",
//             }}>
//               <Link2 size={15} color="#ea580c" style={{ marginTop: "1px", flexShrink: 0 }} />
//               <div>
//                 <p style={{ margin: "0 0 3px", fontWeight: "600", fontSize: "13px", color: "#ea580c" }}>
//                   Moodle connected
//                 </p>
//                 <p style={{ margin: 0, fontSize: "12px", color: "#92400e", lineHeight: 1.5 }}>
//                   Submissions will automatically sync to Moodle when linked by your teacher.
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={disconnectMoodle}
//               style={{
//                 ...btn("#ef4444"),
//                 fontSize: "12px",
//                 padding: "8px 14px",
//               }}
//             >
//               <Plug size={13} />
//               Disconnect Moodle
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Spinner keyframe — injected once */}
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }












// src/components/student/StudentClassroomTab.jsx
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
  const [moodleToken,       setMoodleToken]       = useState("");
  const [moodleSiteUrl,     setMoodleSiteUrl]     = useState("");
  const [moodleConnected,   setMoodleConnected]   = useState(false);
  const [moodleLoading,     setMoodleLoading]     = useState(false);
  const [moodleSiteDisplay, setMoodleSiteDisplay] = useState("");

  // ── Styles ─────────────────────────────────────────────────────────────────
  const card = {
    background: "#fff",
    borderRadius: "14px",
    padding: "22px",
    border: "1px solid #ECECF2",
    marginBottom: "16px",
  };

  const platformBadge = (bg) => ({
    width: "40px", height: "40px", borderRadius: "10px",
    background: bg, display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: "18px",
  });

  const btn = (bg = "#3b82f6", extra = {}) => ({
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "9px 16px", background: bg, color: "#fff",
    border: "none", borderRadius: "8px", fontWeight: "600",
    fontSize: "13px", cursor: "pointer", fontFamily: "inherit", lineHeight: 1,
    ...extra,
  });

  const selectStyle = {
    width: "100%", padding: "9px 36px 9px 12px",
    borderRadius: "8px", border: "1px solid #ECECF2",
    fontSize: "13px", fontFamily: "inherit",
    background: "#F8F7FF", appearance: "none", cursor: "pointer",
    color: "#1A1830",
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    borderRadius: "8px", border: "1px solid #ECECF2",
    fontSize: "13px", fontFamily: "inherit",
    background: "#F8F7FF", color: "#1A1830", outline: "none",
    boxSizing: "border-box",
  };

  const stepLabel = {
    fontWeight: "600", fontSize: "11px", color: "#8884A8",
    marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em",
    display: "block",
  };

  const divider = { height: "1px", background: "#F1EFE8", margin: "16px 0" };

  // ── Moodle status on load ──────────────────────────────────────────────────
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
      showToast(`Submitted! Score: ${res.score}/${res.max_score}`, "success");
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
      showToast("Connected to Moodle successfully!", "success");
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
      <p style={{ fontSize: "16px", fontWeight: "600", color: "#1A1830", marginBottom: "16px" }}>
        Connected Platforms
      </p>

      {/* ── Google Classroom ── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
          <div style={platformBadge("#185FA5")}>
            <i className="ti ti-school" aria-hidden="true" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#1A1830" }}>
              Google Classroom
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#8884A8" }}>
              Submit assignments and sync results
            </p>
          </div>
        </div>

        {/* Step 1 */}
        <div style={{ marginBottom: "14px" }}>
          <span style={stepLabel}>Step 1 — Connect your Google account</span>
          <button onClick={connectGoogle} style={btn("#185FA5")}>
            <i className="ti ti-lock" aria-hidden="true" style={{ fontSize: "13px" }} />
            Connect Google Classroom
          </button>
        </div>

        <div style={divider} />

        {/* Step 2 */}
        <div style={{ marginBottom: courses.length > 0 ? 0 : undefined }}>
          <span style={stepLabel}>Step 2 — Load your enrolled courses</span>
          <button onClick={loadCourses} disabled={loading} style={btn("#534AB7")}>
            <i
              className={`ti ${loading ? "ti-loader-2" : "ti-refresh"}`}
              aria-hidden="true"
              style={{ fontSize: "13px", ...(loading ? { animation: "spin 1s linear infinite" } : {}) }}
            />
            {loading ? "Loading..." : "Load My Courses"}
          </button>
        </div>

        {/* Step 3 — Course selector */}
        {courses.length > 0 && (
          <>
            <div style={divider} />
            <div>
              <span style={stepLabel}>Step 3 — Select a course</span>
              <div style={{ position: "relative" }}>
                <select style={selectStyle} defaultValue="" onChange={e => loadAssignments(e.target.value)}>
                  <option value="" disabled>Choose a course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                  ))}
                </select>
                <i
                  className="ti ti-chevron-down"
                  aria-hidden="true"
                  style={{
                    position: "absolute", right: "10px", top: "50%",
                    transform: "translateY(-50%)", fontSize: "14px",
                    color: "#8884A8", pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Step 4 — Assignments */}
        {gcAssignments.length > 0 && (
          <>
            <div style={divider} />
            <span style={stepLabel}>Step 4 — Import and submit</span>
            {gcAssignments.map(a => (
              <div
                key={a.id}
                style={{
                  padding: "11px 14px",
                  border: `1px solid ${a.local_assignment_id ? "#C0DD97" : "#ECECF2"}`,
                  borderRadius: "9px", marginBottom: "8px",
                  background: a.local_assignment_id ? "#EAF3DE" : "#F8F7FF",
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "9px", flex: 1 }}>
                  <i
                    className={`ti ${a.local_assignment_id ? "ti-circle-check" : "ti-alert-triangle"}`}
                    aria-hidden="true"
                    style={{
                      fontSize: "15px", marginTop: "1px", flexShrink: 0,
                      color: a.local_assignment_id ? "#3B6D11" : "#8884A8",
                    }}
                  />
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: "600", fontSize: "13px", color: "#1A1830" }}>
                      {a.title}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#8884A8" }}>
                      {a.local_assignment_id ? "Linked — ready to submit" : "Not yet linked by teacher"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => submitFromClassroom(a)}
                  disabled={!a.local_assignment_id || submitting === a.id}
                  style={{
                    ...btn(a.local_assignment_id ? "#3B6D11" : "#D3D1C7"),
                    cursor: !a.local_assignment_id ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i
                    className={`ti ${submitting === a.id ? "ti-loader-2" : "ti-upload"}`}
                    aria-hidden="true"
                    style={{ fontSize: "13px", ...(submitting === a.id ? { animation: "spin 1s linear infinite" } : {}) }}
                  />
                  {submitting === a.id ? "Submitting..." : "Import & Submit"}
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Moodle ── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
          <div style={platformBadge("#854F0B")}>
            <i className="ti ti-book-2" aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#1A1830" }}>Moodle</p>
            <p style={{ margin: 0, fontSize: "12px", color: moodleConnected ? "#3B6D11" : "#8884A8" }}>
              {moodleConnected
                ? `Connected to ${moodleSiteDisplay}`
                : "Connect to sync submissions with Moodle"}
            </p>
          </div>
          {moodleConnected && (
            <i className="ti ti-circle-check" aria-hidden="true" style={{ fontSize: "18px", color: "#3B6D11" }} />
          )}
        </div>

        {!moodleConnected ? (
          <>
            <div style={{ marginBottom: "12px" }}>
              <span style={stepLabel}>Step 1 — Moodle site URL</span>
              <input
                style={inputStyle}
                placeholder="https://yourschool.moodlecloud.com"
                value={moodleSiteUrl}
                onChange={e => setMoodleSiteUrl(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <span style={stepLabel}>Step 2 — Web service token</span>
              <input
                style={inputStyle}
                type="password"
                placeholder="Paste your Moodle token..."
                value={moodleToken}
                onChange={e => setMoodleToken(e.target.value)}
              />
            </div>
            <button
              onClick={connectMoodle}
              disabled={moodleLoading}
              style={{ ...btn("#854F0B"), width: "100%", justifyContent: "center", padding: "10px" }}
            >
              <i
                className={`ti ${moodleLoading ? "ti-loader-2" : "ti-plug-connected"}`}
                aria-hidden="true"
                style={{ fontSize: "14px", ...(moodleLoading ? { animation: "spin 1s linear infinite" } : {}) }}
              />
              {moodleLoading ? "Connecting..." : "Connect to Moodle"}
            </button>
          </>
        ) : (
          <div>
            <div style={{
              background: "#EAF3DE", border: "1px solid #C0DD97",
              borderRadius: "9px", padding: "12px 14px", marginBottom: "12px",
              display: "flex", gap: "10px", alignItems: "flex-start",
            }}>
              <i className="ti ti-link" aria-hidden="true" style={{ fontSize: "15px", color: "#3B6D11", marginTop: "1px", flexShrink: 0 }} />
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: "600", fontSize: "13px", color: "#3B6D11" }}>
                  Moodle connected
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#27500A", lineHeight: 1.5 }}>
                  Submissions will sync to Moodle when linked by your teacher.
                </p>
              </div>
            </div>
            <button
              onClick={disconnectMoodle}
              style={{ ...btn("#A32D2D"), fontSize: "12px", padding: "7px 14px" }}
            >
              <i className="ti ti-plug" aria-hidden="true" style={{ fontSize: "13px" }} />
              Disconnect Moodle
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}