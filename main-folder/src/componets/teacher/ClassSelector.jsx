// // src/components/teacher/ClassSelector.jsx
// // Shown right after login — teacher picks (or creates) a class before entering the dashboard.

// import { useState, useEffect } from "react";
// import { apiFetch } from "./api.js";

// const SUBJECT_ICONS = {
//   english:   "📖", math: "➗", science: "🔬", history: "🏛️",
//   geography: "🌍", biology: "🧬", chemistry: "⚗️", physics: "⚡",
//   default:   "📚",
// };

// function subjectIcon(subject) {
//   if (!subject) return SUBJECT_ICONS.default;
//   const s = subject.toLowerCase();
//   for (const [k, v] of Object.entries(SUBJECT_ICONS)) {
//     if (s.includes(k)) return v;
//   }
//   return SUBJECT_ICONS.default;
// }

// const PALETTES = [
//   { bg: "linear-gradient(135deg,#3b82f6,#38bdf8)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#10b981,#34d399)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#f59e0b,#fbbf24)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#ef4444,#f87171)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#06b6d4,#67e8f9)", text: "#fff" },
// ];

// function palette(idx) {
//   return PALETTES[idx % PALETTES.length];
// }

// function Spinner() {
//   return (
//     <div style={{
//       width: "18px", height: "18px",
//       border: "2px solid rgba(255,255,255,0.4)",
//       borderTopColor: "#fff",
//       borderRadius: "50%",
//       animation: "spin 0.7s linear infinite",
//       display: "inline-block",
//     }} />
//   );
// }

// // ── Create-class modal ────────────────────────────────────────────────────────
// function CreateClassModal({ onClose, onCreate }) {
//   const [form, setForm] = useState({ name: "", subject: "", section: "", description: "" });
//   const [saving, setSaving] = useState(false);
//   const [error,  setError]  = useState("");

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const handleCreate = async () => {
//     if (!form.name.trim()) { setError("Class name is required."); return; }
//     setSaving(true); setError("");
//     try {
//       // ✅ Short path — BASE_URL already contains /api/teacher
//       //    Final URL → http://127.0.0.1:8000/api/teacher/classes/create
//       const data = await apiFetch("/classes/create", {
//         method: "POST",
//         body: JSON.stringify(form),
//       });
//       onCreate(data.class);
//       onClose();
//     } catch (err) {
//       setError(err.message || "Failed to create class.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const overlay = {
//     position: "fixed", inset: 0,
//     background: "rgba(15,23,42,0.55)",
//     backdropFilter: "blur(4px)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     zIndex: 200,
//   };
//   const card = {
//     background: "#fff", borderRadius: "24px", padding: "36px 32px",
//     width: "100%", maxWidth: "460px",
//     boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
//   };
//   const labelStyle = {
//     fontSize: "12px", fontWeight: "700", color: "#64748b",
//     display: "block", marginBottom: "6px",
//   };
//   const inputStyle = {
//     width: "100%", padding: "11px 14px", borderRadius: "12px",
//     border: "1.5px solid #e2e8f0", fontSize: "14px",
//     fontFamily: "inherit", outline: "none", boxSizing: "border-box",
//     marginBottom: "18px", color: "#1e293b",
//   };

//   return (
//     <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
//       <div style={card}>
//         <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "800", color: "#1e293b" }}>
//           ➕ Create New Class
//         </h2>
//         <p style={{ margin: "0 0 28px", fontSize: "13px", color: "#94a3b8" }}>
//           Fill in the details below to set up your class.
//         </p>

//         <label style={labelStyle}>Class Name *</label>
//         <input style={inputStyle} placeholder="e.g. Form 3 English" value={form.name}
//           onChange={e => set("name", e.target.value)} />

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
//           <div>
//             <label style={labelStyle}>Subject</label>
//             <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="e.g. English"
//               value={form.subject} onChange={e => set("subject", e.target.value)} />
//           </div>
//           <div>
//             <label style={labelStyle}>Section / Group</label>
//             <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="e.g. 3A"
//               value={form.section} onChange={e => set("section", e.target.value)} />
//           </div>
//         </div>

//         <div style={{ marginTop: "18px" }}>
//           <label style={labelStyle}>Description (optional)</label>
//           <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }}
//             placeholder="Brief description…" value={form.description}
//             onChange={e => set("description", e.target.value)} />
//         </div>

//         {error && (
//           <p style={{ color: "#ef4444", fontSize: "13px", margin: "-8px 0 12px", fontWeight: "600" }}>
//             ⚠️ {error}
//           </p>
//         )}

//         <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
//           <button onClick={onClose} style={{
//             padding: "10px 22px", borderRadius: "12px", border: "1.5px solid #e2e8f0",
//             background: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "13px",
//             cursor: "pointer", fontFamily: "inherit",
//           }}>
//             Cancel
//           </button>
//           <button onClick={handleCreate} disabled={saving} style={{
//             padding: "10px 28px", borderRadius: "12px", border: "none",
//             background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
//             color: "#fff", fontWeight: "700", fontSize: "13px",
//             cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
//             display: "flex", alignItems: "center", gap: "8px",
//           }}>
//             {saving ? <Spinner /> : null}
//             {saving ? "Creating…" : "Create Class"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main ClassSelector ────────────────────────────────────────────────────────
// export default function ClassSelector({ user, onSelectClass, onBack }) {
//   const [classes,  setClasses]  = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [error,    setError]    = useState("");

//   const fetchClasses = async () => {
//     setLoading(true); setError("");
//     try {
//       // ✅ Short path — becomes http://127.0.0.1:8000/api/teacher/classes
//       const data = await apiFetch("/classes");
//       setClasses(data.classes || []);
//     } catch (err) {
//       setError(err.message || "Failed to load classes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchClasses(); }, []);

//   const handleCreated = (newClass) => {
//     setClasses(prev => [newClass, ...prev]);
//   };

//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "linear-gradient(160deg,#f0f7ff 0%,#f8fafc 60%,#eff6ff 100%)",
//       fontFamily: "'Inter', system-ui, sans-serif",
//     }}>
//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(18px); }
//           to   { opacity: 1; transform: translateY(0);    }
//         }
//         .class-card:hover {
//           transform: translateY(-4px) !important;
//           box-shadow: 0 20px 50px rgba(0,0,0,0.13) !important;
//         }
//         .class-card { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
//       `}</style>

//       {/* Nav */}
//       <nav style={{
//         background: "#fff", borderBottom: "1px solid #e2e8f0",
//         padding: "0 28px", height: "62px",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <div style={{
//             width: "36px", height: "36px", borderRadius: "10px",
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
//         <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
//           <button onClick={onBack} style={{
//             padding: "7px 16px", borderRadius: "10px",
//             border: "1px solid #e2e8f0", background: "#f8fafc",
//             color: "#64748b", fontSize: "12px", fontWeight: "700",
//             cursor: "pointer", fontFamily: "inherit",
//           }}>
//             ← Logout
//           </button>
//         </div>
//       </nav>

//       {/* Page body */}
//       <div style={{
//         maxWidth: "860px", margin: "0 auto",
//         padding: "52px 24px 0",
//         animation: "fadeUp 0.5s ease both",
//       }}>
//         <h1 style={{
//           fontSize: "32px", fontWeight: "900", color: "#0f172a",
//           margin: "0 0 8px", letterSpacing: "-0.5px",
//         }}>
//           👋 Welcome back, {user?.name?.split(" ")[0] || "Teacher"}!
//         </h1>
//         <p style={{ fontSize: "16px", color: "#64748b", margin: "0 0 40px" }}>
//           Select a class to manage assignments, pending submissions, and students.
//         </p>

//         {/* Action bar */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
//           <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#1e293b" }}>
//             Your Classes
//             {!loading && (
//               <span style={{ marginLeft: "10px", fontSize: "13px", fontWeight: "700", color: "#94a3b8" }}>
//                 ({classes.length})
//               </span>
//             )}
//           </h2>
          
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
//             <div style={{
//               width: "36px", height: "36px", margin: "0 auto 14px",
//               border: "3px solid #e2e8f0", borderTopColor: "#3b82f6",
//               borderRadius: "50%", animation: "spin 0.7s linear infinite",
//             }} />
//             <p style={{ fontSize: "14px", fontWeight: "600" }}>Loading your classes…</p>
//           </div>
//         )}

//         {/* Error */}
//         {!loading && error && (
//           <div style={{
//             background: "#fef2f2", border: "1px solid #fecaca",
//             borderRadius: "16px", padding: "24px", textAlign: "center", color: "#dc2626",
//           }}>
//             <p style={{ margin: "0 0 12px", fontWeight: "700" }}>⚠️ {error}</p>
//             <button onClick={fetchClasses} style={{
//               padding: "8px 20px", borderRadius: "10px",
//               border: "none", background: "#dc2626", color: "#fff",
//               fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
//             }}>Retry</button>
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && !error && classes.length === 0 && (
//           <div style={{
//             background: "#fff", border: "2px dashed #cbd5e1",
//             borderRadius: "24px", padding: "72px 40px", textAlign: "center",
//           }}>
//             <div style={{ fontSize: "52px", marginBottom: "16px" }}>🏫</div>
//             <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "800", color: "#1e293b" }}>
//               No classes yet
//             </h3>
//             <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#94a3b8" }}>
//               Create your first class to start giving assignments.
//             </p>
//             <button onClick={() => setShowForm(true)} style={{
//               padding: "12px 28px", borderRadius: "14px", border: "none",
//               background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
//               color: "#fff", fontWeight: "700", fontSize: "14px",
//               cursor: "pointer", fontFamily: "inherit",
//               boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
//             }}>
//               ➕ Create First Class
//             </button>
//           </div>
//         )}

//         {/* Class cards grid */}
//         {!loading && !error && classes.length > 0 && (
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//             gap: "18px",
//             paddingBottom: "48px",
//           }}>
//             {classes.map((cls, idx) => {
//               const pal  = palette(idx);
//               const icon = subjectIcon(cls.subject);
//               return (
//                 <div
//                   key={cls.id}
//                   className="class-card"
//                   // ✅ passes the class object AND its index (for palette colouring in dashboard)
//                   onClick={() => onSelectClass(cls, idx)}
//                   style={{
//                     borderRadius: "22px", overflow: "hidden",
//                     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//                     cursor: "pointer",
//                     animation: `fadeUp 0.4s ease ${idx * 0.07}s both`,
//                   }}
//                 >
//                   {/* Coloured header */}
//                   <div style={{ background: pal.bg, padding: "28px 24px 22px", color: pal.text }}>
//                     <div style={{ fontSize: "36px", marginBottom: "10px" }}>{icon}</div>
//                     <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "800", lineHeight: 1.2 }}>
//                       {cls.name}
//                     </h3>
//                     {cls.section && (
//                       <span style={{
//                         fontSize: "11px", fontWeight: "700",
//                         background: "rgba(255,255,255,0.25)",
//                         padding: "2px 10px", borderRadius: "20px",
//                       }}>
//                         {cls.section}
//                       </span>
//                     )}
//                   </div>

//                   {/* White body */}
//                   <div style={{ background: "#fff", padding: "20px 24px" }}>
//                     {cls.subject && (
//                       <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
//                         📚 {cls.subject}
//                       </p>
//                     )}
//                     <div style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
//                       <div>
//                         <p style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "#1e293b" }}>
//                           {cls.total_assignments}
//                         </p>
//                         <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
//                           Assignments
//                         </p>
//                       </div>
//                       <div style={{ width: "1px", background: "#f1f5f9" }} />
//                       <div>
//                         <p style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "#1e293b" }}>
//                           {cls.total_students}
//                         </p>
//                         <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
//                           Students
//                         </p>
//                       </div>
//                     </div>
//                     <div style={{
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       padding: "10px 0", borderTop: "1px solid #f1f5f9",
//                       color: "#3b82f6", fontWeight: "700", fontSize: "13px", gap: "6px",
//                     }}>
//                       Open Class →
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {showForm && (
//         <CreateClassModal onClose={() => setShowForm(false)} onCreate={handleCreated} />
//       )}
//     </div>
//   );
// }









// src/componets/teacher/ClassSelector.jsx
import { useState, useEffect } from "react";
import { apiFetch } from "./api.js";
import { Icon, Toast } from "./shared.jsx";

const SUBJECT_MAP = {
  english:   { icon: "book",           color: "#185FA5", bg: "#E6F1FB" },
  math:      { icon: "math-function",  color: "#3B6D11", bg: "#EAF3DE" },
  science:   { icon: "microscope",     color: "#0A4A5C", bg: "#E0F5FA" },
  history:   { icon: "timeline",       color: "#854F0B", bg: "#FAEEDA" },
  geography: { icon: "map",            color: "#3C3489", bg: "#EEEDFE" },
  biology:   { icon: "dna",            color: "#3B6D11", bg: "#EAF3DE" },
  chemistry: { icon: "flask",          color: "#7B1F1F", bg: "#FCEBEB" },
  physics:   { icon: "atom",           color: "#0A4A5C", bg: "#E0F5FA" },
  default:   { icon: "books",          color: "#5F5E5A", bg: "#F1EFE8" },
};

function subjectMeta(subject) {
  if (!subject) return SUBJECT_MAP.default;
  const s = subject.toLowerCase();
  for (const [k, v] of Object.entries(SUBJECT_MAP)) {
    if (k !== "default" && s.includes(k)) return v;
  }
  return SUBJECT_MAP.default;
}

const STRIPE_COLORS = [
  "#1A3A6B", "#3C3489", "#1A5C3A", "#854F0B", "#7B1F1F", "#0A4A5C",
];

function Spinner({ size = 18, color = "#fff" }) {
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`,
      border: `2px solid ${color}33`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      display: "inline-block", flexShrink: 0,
    }} />
  );
}

// ── Create class modal ────────────────────────────────────────────────────────
function CreateClassModal({ onClose, onCreate }) {
  const [form,   setForm]   = useState({ name: "", subject: "", section: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.name.trim()) { setError("Class name is required."); return; }
    setSaving(true); setError("");
    try {
      const data = await apiFetch("/classes/create", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onCreate(data.class);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create class.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px", boxSizing: "border-box",
    border: "1px solid #D3D1C7", borderRadius: "9px",
    fontSize: "14px", color: "#1A1830", outline: "none",
    fontFamily: "inherit", background: "#fff",
    marginBottom: "16px", transition: "border-color 0.15s",
  };
  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: "600",
    color: "#8884A8", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: "5px",
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,13,40,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: "18px", padding: "32px 28px",
        width: "100%", maxWidth: "460px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.16)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1A1830" }}>
              New class
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#8884A8" }}>
              Fill in the details to get started
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "#F1EFE8", border: "none", borderRadius: "50%",
            width: "30px", height: "30px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="x" size={15} style={{ color: "#5F5E5A" }} />
          </button>
        </div>

        <label style={labelStyle}>Class name *</label>
        <input
          style={inputStyle}
          placeholder="e.g. Form 3 English"
          value={form.name}
          onChange={e => set("name", e.target.value)}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Subject</label>
            <input
              style={{ ...inputStyle, marginBottom: 0 }}
              placeholder="e.g. English"
              value={form.subject}
              onChange={e => set("subject", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Section</label>
            <input
              style={{ ...inputStyle, marginBottom: 0 }}
              placeholder="e.g. 3A"
              value={form.section}
              onChange={e => set("section", e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, height: "76px", resize: "vertical" }}
            placeholder="Optional short description…"
            value={form.description}
            onChange={e => set("description", e.target.value)}
          />
        </div>

        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "#FCEBEB", border: "1px solid #F7C1C1",
            borderRadius: "8px", padding: "9px 12px", marginBottom: "14px",
          }}>
            <Icon name="alert-circle" size={13} style={{ color: "#A32D2D", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "12px", color: "#A32D2D", fontWeight: "500" }}>{error}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: "9px",
            border: "1px solid #D3D1C7", background: "#F1EFE8",
            color: "#5F5E5A", fontWeight: "500", fontSize: "13px",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Cancel
          </button>
          <button onClick={handleCreate} disabled={saving} style={{
            padding: "9px 22px", borderRadius: "9px", border: "none",
            background: saving ? "#8884A8" : "#1A1830",
            color: "#fff", fontWeight: "500", fontSize: "13px",
            cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "7px",
          }}>
            {saving ? <Spinner size={14} /> : <Icon name="plus" size={14} style={{ color: "#fff" }} />}
            {saving ? "Creating…" : "Create class"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ClassSelector ────────────────────────────────────────────────────────
export default function ClassSelector({ user, onSelectClass, onBack }) {
  const [classes,  setClasses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error,    setError]    = useState("");
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchClasses = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/classes");
      setClasses(data.classes || []);
    } catch (err) {
      setError(err.message || "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreated = newClass => {
    setClasses(prev => [newClass, ...prev]);
    showToast("Class created successfully.");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8F7FF",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .class-card { transition: box-shadow 0.18s ease, transform 0.18s ease !important; }
        .class-card:hover { transform: translateY(-3px) !important; box-shadow: 0 10px 32px rgba(0,0,0,0.11) !important; }
      `}</style>

      <Toast toast={toast} />

      {/* Nav */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #E8E6FF",
        padding: "0 28px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 0 #E8E6FF",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#1A1830",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="pencil" size={17} style={{ color: "#EEEDFE" }} />
          </div>
          <div>
            <p style={{ fontWeight: "600", fontSize: "14px", color: "#1A1830", margin: 0 }}>EssayGrade</p>
            <p style={{ fontSize: "11px", color: "#8884A8", margin: 0 }}>Teacher Portal</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: "#F8F7FF", border: "1px solid #E8E6FF",
            borderRadius: "20px", padding: "4px 12px 4px 4px",
          }}>
            <div style={{
              width: "26px", height: "26px", background: "#1A1830", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "600", color: "#EEEDFE",
            }}>
              {(user?.name || "T").charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: "13px", color: "#1A1830", fontWeight: "500" }}>
              {user?.name || "Teacher"}
            </span>
          </div>

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

      {/* Page body */}
      <div style={{
        maxWidth: "880px", margin: "0 auto",
        padding: "44px 24px 60px",
        animation: "fadeUp 0.4s ease both",
      }}>
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "600", color: "#8884A8", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Welcome back
            </p>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1A1830", margin: 0, lineHeight: 1.2 }}>
              {user?.name?.split(" ")[0] || "Teacher"}'s classes
            </h1>
          </div>

          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "9px 18px", borderRadius: "10px", border: "none",
              background: "#1A1830", color: "#fff",
              fontWeight: "500", fontSize: "13px",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: "7px",
            }}
          >
            <Icon name="plus" size={15} style={{ color: "#fff" }} />
            New class
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Spinner size={28} color="#8884A8" />
            <p style={{ marginTop: "14px", fontSize: "13px", color: "#8884A8", fontWeight: "500" }}>
              Loading your classes…
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            background: "#FCEBEB", border: "1px solid #F7C1C1",
            borderRadius: "14px", padding: "24px", textAlign: "center",
          }}>
            <Icon name="alert-circle" size={28} style={{ color: "#A32D2D", marginBottom: "10px" }} />
            <p style={{ margin: "0 0 14px", fontWeight: "600", fontSize: "14px", color: "#A32D2D" }}>{error}</p>
            <button onClick={fetchClasses} style={{
              padding: "8px 20px", borderRadius: "9px", border: "none",
              background: "#A32D2D", color: "#fff",
              fontWeight: "500", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
              display: "inline-flex", alignItems: "center", gap: "6px",
            }}>
              <Icon name="refresh" size={13} style={{ color: "#fff" }} />
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && classes.length === 0 && (
          <div style={{
            background: "#fff", border: "1.5px dashed #D3D1C7",
            borderRadius: "18px", padding: "64px 40px", textAlign: "center",
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: "#F1EFE8", margin: "0 auto 18px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="building-community" size={26} style={{ color: "#8884A8" }} />
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "700", color: "#1A1830" }}>
              No classes yet
            </h3>
            <p style={{ margin: "0 0 22px", fontSize: "13px", color: "#8884A8" }}>
              Create your first class to start giving assignments.
            </p>
            <button onClick={() => setShowForm(true)} style={{
              padding: "10px 22px", borderRadius: "10px", border: "none",
              background: "#1A1830", color: "#fff",
              fontWeight: "500", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
              display: "inline-flex", alignItems: "center", gap: "7px",
            }}>
              <Icon name="plus" size={14} style={{ color: "#fff" }} />
              Create first class
            </button>
          </div>
        )}

        {/* Class cards grid */}
        {!loading && !error && classes.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "14px",
          }}>
            {classes.map((cls, idx) => {
              const stripeColor = STRIPE_COLORS[idx % STRIPE_COLORS.length];
              const meta = subjectMeta(cls.subject);
              return (
                <div
                  key={cls.id}
                  className="class-card"
                  onClick={() => onSelectClass(cls, idx)}
                  style={{
                    background: "#fff", borderRadius: "14px",
                    border: "1px solid #ECECF2",
                    overflow: "hidden", cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    animation: `fadeUp 0.35s ease ${idx * 0.06}s both`,
                  }}
                >
                  {/* Top stripe */}
                  <div style={{ height: "5px", background: stripeColor }} />

                  {/* Card body */}
                  <div style={{ padding: "20px" }}>
                    {/* Icon + section row */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "11px",
                        background: meta.bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon name={meta.icon} size={20} style={{ color: meta.color }} />
                      </div>
                      {cls.section && (
                        <span style={{
                          fontSize: "10px", fontWeight: "600", color: "#8884A8",
                          background: "#F1EFE8", border: "1px solid #D3D1C7",
                          padding: "2px 8px", borderRadius: "6px",
                        }}>
                          {cls.section}
                        </span>
                      )}
                    </div>

                    <h3 style={{ margin: "0 0 3px", fontSize: "15px", fontWeight: "700", color: "#1A1830", lineHeight: 1.3 }}>
                      {cls.name}
                    </h3>
                    {cls.subject && (
                      <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#8884A8", fontWeight: "400" }}>
                        {cls.subject}
                      </p>
                    )}

                    {/* Stats row */}
                    <div style={{
                      display: "flex", gap: "16px",
                      padding: "12px 0 14px",
                      borderTop: "1px solid #F1EFE8",
                    }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1A1830", lineHeight: 1 }}>
                          {cls.total_assignments ?? 0}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "10px", color: "#8884A8", fontWeight: "500" }}>
                          assignments
                        </p>
                      </div>
                      <div style={{ width: "1px", background: "#F1EFE8" }} />
                      <div>
                        <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1A1830", lineHeight: 1 }}>
                          {cls.total_students ?? 0}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "10px", color: "#8884A8", fontWeight: "500" }}>
                          students
                        </p>
                      </div>
                    </div>

                    {/* CTA row */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: "10px", borderTop: "1px solid #F1EFE8",
                    }}>
                      <span style={{ fontSize: "12px", color: "#8884A8", fontWeight: "400" }}>
                        Open class
                      </span>
                      <div style={{
                        width: "26px", height: "26px", borderRadius: "7px",
                        background: "#F1EFE8",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon name="arrow-right" size={14} style={{ color: "#5F5E5A" }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <CreateClassModal onClose={() => setShowForm(false)} onCreate={handleCreated} />
      )}
    </div>
  );
}