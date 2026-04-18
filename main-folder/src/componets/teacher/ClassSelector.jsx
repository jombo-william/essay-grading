// src/components/teacher/ClassSelector.jsx
// Shown right after login — teacher picks (or creates) a class before entering the dashboard.

import { useState, useEffect } from "react";
import { apiFetch } from "./api.js";

const SUBJECT_ICONS = {
  english:   "📖", math: "➗", science: "🔬", history: "🏛️",
  geography: "🌍", biology: "🧬", chemistry: "⚗️", physics: "⚡",
  default:   "📚",
};

function subjectIcon(subject) {
  if (!subject) return SUBJECT_ICONS.default;
  const s = subject.toLowerCase();
  for (const [k, v] of Object.entries(SUBJECT_ICONS)) {
    if (s.includes(k)) return v;
  }
  return SUBJECT_ICONS.default;
}

const PALETTES = [
  { bg: "linear-gradient(135deg,#3b82f6,#38bdf8)", text: "#fff" },
  { bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)", text: "#fff" },
  { bg: "linear-gradient(135deg,#10b981,#34d399)", text: "#fff" },
  { bg: "linear-gradient(135deg,#f59e0b,#fbbf24)", text: "#fff" },
  { bg: "linear-gradient(135deg,#ef4444,#f87171)", text: "#fff" },
  { bg: "linear-gradient(135deg,#06b6d4,#67e8f9)", text: "#fff" },
];

function palette(idx) {
  return PALETTES[idx % PALETTES.length];
}

function Spinner() {
  return (
    <div style={{
      width: "18px", height: "18px",
      border: "2px solid rgba(255,255,255,0.4)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      display: "inline-block",
    }} />
  );
}

// ── Create-class modal ────────────────────────────────────────────────────────
function CreateClassModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", subject: "", section: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.name.trim()) { setError("Class name is required."); return; }
    setSaving(true); setError("");
    try {
      // ✅ Short path — BASE_URL already contains /api/teacher
      //    Final URL → http://127.0.0.1:8000/api/teacher/classes/create
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

  const overlay = {
    position: "fixed", inset: 0,
    background: "rgba(15,23,42,0.55)",
    backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200,
  };
  const card = {
    background: "#fff", borderRadius: "24px", padding: "36px 32px",
    width: "100%", maxWidth: "460px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
  };
  const labelStyle = {
    fontSize: "12px", fontWeight: "700", color: "#64748b",
    display: "block", marginBottom: "6px",
  };
  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "12px",
    border: "1.5px solid #e2e8f0", fontSize: "14px",
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    marginBottom: "18px", color: "#1e293b",
  };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={card}>
        <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "800", color: "#1e293b" }}>
          ➕ Create New Class
        </h2>
        <p style={{ margin: "0 0 28px", fontSize: "13px", color: "#94a3b8" }}>
          Fill in the details below to set up your class.
        </p>

        <label style={labelStyle}>Class Name *</label>
        <input style={inputStyle} placeholder="e.g. Form 3 English" value={form.name}
          onChange={e => set("name", e.target.value)} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Subject</label>
            <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="e.g. English"
              value={form.subject} onChange={e => set("subject", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Section / Group</label>
            <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="e.g. 3A"
              value={form.section} onChange={e => set("section", e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: "18px" }}>
          <label style={labelStyle}>Description (optional)</label>
          <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }}
            placeholder="Brief description…" value={form.description}
            onChange={e => set("description", e.target.value)} />
        </div>

        {error && (
          <p style={{ color: "#ef4444", fontSize: "13px", margin: "-8px 0 12px", fontWeight: "600" }}>
            ⚠️ {error}
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 22px", borderRadius: "12px", border: "1.5px solid #e2e8f0",
            background: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "13px",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Cancel
          </button>
          <button onClick={handleCreate} disabled={saving} style={{
            padding: "10px 28px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
            color: "#fff", fontWeight: "700", fontSize: "13px",
            cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {saving ? <Spinner /> : null}
            {saving ? "Creating…" : "Create Class"}
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

  const fetchClasses = async () => {
    setLoading(true); setError("");
    try {
      // ✅ Short path — becomes http://127.0.0.1:8000/api/teacher/classes
      const data = await apiFetch("/classes");
      setClasses(data.classes || []);
    } catch (err) {
      setError(err.message || "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreated = (newClass) => {
    setClasses(prev => [newClass, ...prev]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#f0f7ff 0%,#f8fafc 60%,#eff6ff 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .class-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.13) !important;
        }
        .class-card { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: "0 28px", height: "62px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>☁️</div>
          <div>
            <p style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b", margin: 0, lineHeight: 1.2 }}>
              EssayGrade AI
            </p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Teacher Portal</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
              color: "#fff", fontWeight: "800", fontSize: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {user?.name?.charAt(0) || "T"}
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
              {user?.name || "Teacher"}
            </span>
          </div>
          <button onClick={onBack} style={{
            padding: "7px 16px", borderRadius: "10px",
            border: "1px solid #e2e8f0", background: "#f8fafc",
            color: "#64748b", fontSize: "12px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            ← Logout
          </button>
        </div>
      </nav>

      {/* Page body */}
      <div style={{
        maxWidth: "860px", margin: "0 auto",
        padding: "52px 24px 0",
        animation: "fadeUp 0.5s ease both",
      }}>
        <h1 style={{
          fontSize: "32px", fontWeight: "900", color: "#0f172a",
          margin: "0 0 8px", letterSpacing: "-0.5px",
        }}>
          👋 Welcome back, {user?.name?.split(" ")[0] || "Teacher"}!
        </h1>
        <p style={{ fontSize: "16px", color: "#64748b", margin: "0 0 40px" }}>
          Select a class to manage assignments, pending submissions, and students.
        </p>

        {/* Action bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#1e293b" }}>
            Your Classes
            {!loading && (
              <span style={{ marginLeft: "10px", fontSize: "13px", fontWeight: "700", color: "#94a3b8" }}>
                ({classes.length})
              </span>
            )}
          </h2>
          {/* <button onClick={() => setShowForm(true)} style={{
            padding: "10px 22px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
            color: "#fff", fontWeight: "700", fontSize: "13px",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
            display: "flex", alignItems: "center", gap: "7px",
          }}>
            ➕ New Class
          </button> */}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
            <div style={{
              width: "36px", height: "36px", margin: "0 auto 14px",
              border: "3px solid #e2e8f0", borderTopColor: "#3b82f6",
              borderRadius: "50%", animation: "spin 0.7s linear infinite",
            }} />
            <p style={{ fontSize: "14px", fontWeight: "600" }}>Loading your classes…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: "16px", padding: "24px", textAlign: "center", color: "#dc2626",
          }}>
            <p style={{ margin: "0 0 12px", fontWeight: "700" }}>⚠️ {error}</p>
            <button onClick={fetchClasses} style={{
              padding: "8px 20px", borderRadius: "10px",
              border: "none", background: "#dc2626", color: "#fff",
              fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
            }}>Retry</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && classes.length === 0 && (
          <div style={{
            background: "#fff", border: "2px dashed #cbd5e1",
            borderRadius: "24px", padding: "72px 40px", textAlign: "center",
          }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>🏫</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "800", color: "#1e293b" }}>
              No classes yet
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#94a3b8" }}>
              Create your first class to start giving assignments.
            </p>
            <button onClick={() => setShowForm(true)} style={{
              padding: "12px 28px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg,#3b82f6,#38bdf8)",
              color: "#fff", fontWeight: "700", fontSize: "14px",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
            }}>
              ➕ Create First Class
            </button>
          </div>
        )}

        {/* Class cards grid */}
        {!loading && !error && classes.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "18px",
            paddingBottom: "48px",
          }}>
            {classes.map((cls, idx) => {
              const pal  = palette(idx);
              const icon = subjectIcon(cls.subject);
              return (
                <div
                  key={cls.id}
                  className="class-card"
                  // ✅ passes the class object AND its index (for palette colouring in dashboard)
                  onClick={() => onSelectClass(cls, idx)}
                  style={{
                    borderRadius: "22px", overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    animation: `fadeUp 0.4s ease ${idx * 0.07}s both`,
                  }}
                >
                  {/* Coloured header */}
                  <div style={{ background: pal.bg, padding: "28px 24px 22px", color: pal.text }}>
                    <div style={{ fontSize: "36px", marginBottom: "10px" }}>{icon}</div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "800", lineHeight: 1.2 }}>
                      {cls.name}
                    </h3>
                    {cls.section && (
                      <span style={{
                        fontSize: "11px", fontWeight: "700",
                        background: "rgba(255,255,255,0.25)",
                        padding: "2px 10px", borderRadius: "20px",
                      }}>
                        {cls.section}
                      </span>
                    )}
                  </div>

                  {/* White body */}
                  <div style={{ background: "#fff", padding: "20px 24px" }}>
                    {cls.subject && (
                      <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
                        📚 {cls.subject}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "#1e293b" }}>
                          {cls.total_assignments}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
                          Assignments
                        </p>
                      </div>
                      <div style={{ width: "1px", background: "#f1f5f9" }} />
                      <div>
                        <p style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "#1e293b" }}>
                          {cls.total_students}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
                          Students
                        </p>
                      </div>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "10px 0", borderTop: "1px solid #f1f5f9",
                      color: "#3b82f6", fontWeight: "700", fontSize: "13px", gap: "6px",
                    }}>
                      Open Class →
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