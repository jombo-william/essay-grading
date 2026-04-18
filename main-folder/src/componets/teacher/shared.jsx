


// src/componets/teacher/shared.jsx

export const colors = {
  blue:   { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  green:  { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  amber:  { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  red:    { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  purple: { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
  gray:   { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
};

export function Badge({ color = "gray", children }) {
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "3px",
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: "700",
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  const c = toast.type === "error" ? colors.red : colors.green;
  return (
    <div style={{
      position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
      zIndex: 999, padding: "12px 24px", borderRadius: "14px",
      fontSize: "13px", fontWeight: "700",
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxWidth: "90vw", textAlign: "center",
    }}>
      {toast.msg}
    </div>
  );
}

export function Sheet({ onClose, title, subtitle, children, footer, wide = false }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.55)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        zIndex: 200, backdropFilter: "blur(3px)",
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: "24px 24px 0 0",
        width: "100%",
        maxWidth: wide ? "900px" : "680px",
        maxHeight: "94vh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 6px" }}>
          <div style={{ width: "40px", height: "4px", background: "#e2e8f0", borderRadius: "2px" }} />
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          gap: "12px", padding: "6px 28px 18px", borderBottom: "1px solid #f1f5f9",
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: "800", fontSize: "18px", color: "#1e293b", margin: "0 0 4px", lineHeight: 1.3 }}>
              {title}
            </h2>
            {subtitle && <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "#f1f5f9", border: "none", cursor: "pointer",
            fontSize: "20px", color: "#64748b", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>{children}</div>
        {footer && (
          <div style={{ padding: "16px 28px 24px", borderTop: "1px solid #f1f5f9" }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

export function scoreColor(pct) {
  if (pct >= 70) return "#16a34a";
  if (pct >= 50) return "#d97706";
  return "#dc2626";
}

export function ScoreBar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const col = scoreColor(pct);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontSize: "14px", fontWeight: "800", color: col, minWidth: "60px" }}>
        {value}/{max}
      </span>
      <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "6px", background: col, borderRadius: "3px", width: `${pct}%`, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: "700", color: col }}>{pct}%</span>
    </div>
  );
}

export const btn = {
  primary: {
    padding: "11px 22px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #3b82f6, #38bdf8)",
    color: "#fff", fontSize: "13px", fontWeight: "700",
    cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
    transition: "all 0.2s", fontFamily: "inherit",
  },
  ghost: {
    padding: "11px 22px", borderRadius: "12px",
    border: "1.5px solid #e2e8f0", background: "#f8fafc",
    color: "#64748b", fontSize: "13px", fontWeight: "700",
    cursor: "pointer", fontFamily: "inherit",
  },
  small: {
    padding: "7px 14px", borderRadius: "9px",
    border: "1px solid #e2e8f0", background: "#f8fafc",
    color: "#64748b", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },
  smallPrimary: {
    padding: "7px 14px", borderRadius: "9px", border: "none",
    background: "linear-gradient(135deg, #3b82f6, #38bdf8)",
    color: "#fff", fontSize: "12px", fontWeight: "700",
    cursor: "pointer", fontFamily: "inherit",
  },
};

export const inp = {
  width: "100%", padding: "12px 16px", boxSizing: "border-box",
  border: "1.5px solid #e2e8f0", borderRadius: "12px",
  fontSize: "14px", color: "#1e293b", outline: "none",
  fontFamily: "inherit", background: "#fff", transition: "border-color 0.2s",
};

export const label = {
  display: "block", fontSize: "11px", fontWeight: "700",
  color: "#94a3b8", textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: "8px",
};