// src/componets/auth/LoginPage.jsx
import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:8080/api";   // ← Python backend

export default function LoginPage({ onSelect }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);
  const emailRef = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in both fields.");
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {   // ← /auth/login (no .php)
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        // Store csrf_token for use in API calls
        sessionStorage.setItem("csrf_token", data.csrf_token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        onSelect(data.user.role, data.user);
      } else {
        setError(data.message || "Invalid email or password.");
        triggerShake();
        setLoading(false);
      }
    } catch {
      setError("Cannot reach server. Make sure Python backend is running on port 8080.");
      triggerShake();
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setEmail(role === "teacher" ? "william.jombo@essaygrade.com" : "alice.mwale@student.edu");
    setPassword("password");
    setError("");
  };

  const onKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f0ff 0%, #f8fbff 50%, #e8f4ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <div style={{ position:"absolute", top:"-80px", left:"-80px", width:"400px", height:"400px", borderRadius:"50%", background:"rgba(99,179,237,0.15)", filter:"blur(60px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-80px", right:"-80px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(147,197,253,0.2)", filter:"blur(60px)", pointerEvents:"none" }} />

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #dbeafe;
          border-radius: 12px;
          font-size: 14px;
          color: #1e3a5f;
          background: #f0f7ff;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .login-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
          background: #fff;
        }
        .login-input::placeholder { color: #93c5fd; }
        .login-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #38bdf8);
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(59,130,246,0.35);
          transition: all 0.2s;
          font-family: inherit;
          letter-spacing: 0.02em;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(59,130,246,0.45);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .demo-card {
          flex: 1;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #dbeafe;
          background: #f0f7ff;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          font-family: inherit;
        }
        .demo-card:hover { border-color: #3b82f6; background: #eff6ff; transform: translateY(-1px); }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
        }
      `}</style>

      {/* Card */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 12px 60px rgba(59,130,246,0.12), 0 2px 16px rgba(0,0,0,0.06)",
          border: "1px solid #e0f0ff",
          padding: "48px 44px",
          width: "100%",
          maxWidth: "460px",
          position: "relative",
          zIndex: 1,
          animation: shake ? "shake 0.5s ease-in-out" : "none",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "72px", height: "72px",
            background: "linear-gradient(135deg, #3b82f6, #38bdf8)",
            borderRadius: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "34px",
            margin: "0 auto 20px",
            boxShadow: "0 8px 28px rgba(59,130,246,0.3)",
          }}>✍️</div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1e3a5f", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            EssayGrade AI
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
            Sign in to your portal
          </p>
        </div>

        {/* Email field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Email Address
          </label>
          <input
            ref={emailRef}
            type="email"
            placeholder="you@essaygrade.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={onKey}
            autoComplete="email"
            className="login-input"
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={onKey}
              autoComplete="current-password"
              className="login-input"
              style={{ paddingRight: "48px" }}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#93c5fd", padding: 0, lineHeight: 1 }}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "15px", lineHeight: 1.4 }}>⚠️</span>
            <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: "600", margin: 0, lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        {/* Sign in button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="login-btn"
          style={{ marginBottom: "28px" }}
        >
          {loading ? <><span className="spinner" />Signing in…</> : "Sign In →"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          <span style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: "500", whiteSpace: "nowrap" }}>Quick demo access</span>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        </div>

        {/* Demo cards */}
        <div style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
          <button className="demo-card" onClick={() => fillDemo("teacher")}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px" }}>👨‍🏫</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#3b82f6" }}>Teacher</span>
            </div>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#1e3a5f", margin: "0 0 3px" }}>Mr. William Jombo</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>william.jombo@essaygrade.com</p>
          </button>

          <button className="demo-card" onClick={() => fillDemo("student")}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px" }}>🎓</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#0ea5e9" }}>Student</span>
            </div>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#1e3a5f", margin: "0 0 3px" }}>Alice Mwale</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>alice.mwale@student.edu</p>
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#cbd5e1", margin: 0 }}>
          Demo password: <span style={{ fontWeight: "700", color: "#94a3b8" }}>password</span>
        </p>
      </div>

      <p style={{ position: "absolute", bottom: "20px", fontSize: "12px", color: "#94a3b8" }}>
        Final Year Project · EssayGrade AI
      </p>
    </div>
  );
}