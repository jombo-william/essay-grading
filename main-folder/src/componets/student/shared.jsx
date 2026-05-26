import {
  TbAlertTriangle,
  TbArrowBackUp,
  TbBook2,
  TbBooks,
  TbBrandGoogle,
  TbCalendar,
  TbChartBar,
  TbCheck,
  TbChevronDown,
  TbCircleCheck,
  TbCircleX,
  TbClipboardList,
  TbClock,
  TbClockOff,
  TbExternalLink,
  TbEye,
  TbFile,
  TbFileText,
  TbFileTypeDoc,
  TbFileTypePdf,
  TbFileTypeTxt,
  TbInbox,
  TbInfoCircle,
  TbLink,
  TbList,
  TbLoader2,
  TbLock,
  TbPaperclip,
  TbPencil,
  TbPlug,
  TbPlugConnected,
  TbPlus,
  TbRefresh,
  TbRobot,
  TbSchool,
  TbSend,
  TbStar,
  TbTrophy,
  TbUpload,
  TbWriting,
  TbX,
} from "react-icons/tb";

export const COLORS = {
  blue: { bg: "#E6F1FB", border: "#B5D4F4", text: "#185FA5", dark: "#0C447C" },
  green: { bg: "#EAF3DE", border: "#C0DD97", text: "#3B6D11", dark: "#27500A" },
  amber: { bg: "#FAEEDA", border: "#FAC775", text: "#854F0B", dark: "#633806" },
  red: { bg: "#FCEBEB", border: "#F7C1C1", text: "#A32D2D", dark: "#791F1F" },
  purple: { bg: "#EEEDFE", border: "#CECBF6", text: "#3C3489", dark: "#26215C" },
  gray: { bg: "#F1EFE8", border: "#D3D1C7", text: "#5F5E5A", dark: "#2C2C2A" },
};

const ICONS = {
  "alert-triangle": TbAlertTriangle,
  "arrow-back-up": TbArrowBackUp,
  "book-2": TbBook2,
  books: TbBooks,
  "brand-google": TbBrandGoogle,
  calendar: TbCalendar,
  "chart-bar": TbChartBar,
  check: TbCheck,
  "chevron-down": TbChevronDown,
  "circle-check": TbCircleCheck,
  "circle-x": TbCircleX,
  "clipboard-list": TbClipboardList,
  clock: TbClock,
  "clock-off": TbClockOff,
  "external-link": TbExternalLink,
  eye: TbEye,
  file: TbFile,
  "file-text": TbFileText,
  "file-type-doc": TbFileTypeDoc,
  "file-type-pdf": TbFileTypePdf,
  "file-type-txt": TbFileTypeTxt,
  inbox: TbInbox,
  "info-circle": TbInfoCircle,
  link: TbLink,
  list: TbList,
  "loader-2": TbLoader2,
  lock: TbLock,
  paperclip: TbPaperclip,
  pencil: TbPencil,
  plug: TbPlug,
  "plug-connected": TbPlugConnected,
  plus: TbPlus,
  refresh: TbRefresh,
  robot: TbRobot,
  school: TbSchool,
  send: TbSend,
  star: TbStar,
  trophy: TbTrophy,
  upload: TbUpload,
  writing: TbWriting,
  x: TbX,
};

export function Icon({ name, size = 16, style = {}, color, title }) {
  const Component = ICONS[name] || TbFile;
  return (
    <Component
      aria-hidden={title ? undefined : true}
      title={title}
      size={size}
      color={color || style.color || "currentColor"}
      style={{ display: "inline-block", flexShrink: 0, ...style }}
    />
  );
}

export function Badge({ color = "gray", icon, children }) {
  const c = COLORS[color] || COLORS.gray;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "2px 9px", borderRadius: "20px",
      fontSize: "11px", fontWeight: "500",
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {icon && <Icon name={icon} size={11} />}
      {children}
    </span>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  const map = {
    error: { ...COLORS.red, icon: "alert-triangle" },
    info: { ...COLORS.blue, icon: "info-circle" },
    success: { ...COLORS.green, icon: "circle-check" },
  };
  const t = map[toast.type] || map.success;
  return (
    <div style={{
      position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
      zIndex: 999, background: t.bg, border: `1px solid ${t.border}`, color: t.text,
      padding: "10px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
      boxShadow: "0 4px 16px rgba(0,0,0,0.10)", maxWidth: "90vw", textAlign: "center",
      display: "flex", alignItems: "center", gap: "8px",
    }}>
      <Icon name={t.icon} size={15} />
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
        background: "rgba(15,13,40,0.55)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        zIndex: 200, backdropFilter: "blur(4px)",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: wide ? "900px" : "700px", maxHeight: "94vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.14)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}>
          <div style={{ width: "36px", height: "4px", background: "#E2E0F0", borderRadius: "2px" }} />
        </div>
        <div style={{
          padding: "10px 24px 14px", borderBottom: "1px solid #F0EFF8",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px",
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: "600", fontSize: "17px", color: "#1A1830", margin: "0 0 2px", lineHeight: 1.3 }}>
              {title}
            </h2>
            {subtitle && <p style={{ fontSize: "12px", color: "#8884A8", margin: 0 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "#F1EFE8", border: "none", borderRadius: "50%",
              width: "30px", height: "30px", cursor: "pointer", color: "#5F5E5A",
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>{children}</div>
        {footer && (
          <div style={{ padding: "14px 24px 22px", borderTop: "1px solid #F0EFF8" }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

export function scoreColor(pct) {
  if (pct >= 70) return "#3B6D11";
  if (pct >= 50) return "#854F0B";
  return "#A32D2D";
}

export function scoreBg(pct) {
  if (pct >= 70) return "#EAF3DE";
  if (pct >= 50) return "#FAEEDA";
  return "#FCEBEB";
}

export function scoreLabel(pct) {
  if (pct >= 70) return "Pass";
  if (pct >= 50) return "Borderline";
  return "Needs work";
}

const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  borderRadius: "9px",
  fontSize: "13px",
  fontWeight: "500",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "background 0.2s",
};

export const C = {
  card: {
    background: "#fff",
    border: "1px solid #E8E6FF",
    borderRadius: "14px",
    padding: "16px 18px",
    boxShadow: "0 1px 4px rgba(60,52,137,0.06)",
  },
  sL: {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#8884A8",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: "6px",
  },
  pBtn: (disabled = false) => ({
    ...buttonBase,
    padding: "8px 16px",
    border: "none",
    background: disabled ? "#C5BFFF" : "#3C3489",
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  }),
  gBtn: {
    ...buttonBase,
    padding: "8px 16px",
    border: "1px solid #D3D1C7",
    background: "#F1EFE8",
    color: "#5F5E5A",
  },
  dBtn: {
    ...buttonBase,
    padding: "8px 16px",
    border: "1px solid #F7C1C1",
    background: "#FCEBEB",
    color: "#A32D2D",
  },
  smallButton: {
    ...buttonBase,
    padding: "6px 12px",
    border: "1px solid #D3D1C7",
    background: "#F1EFE8",
    color: "#5F5E5A",
    fontSize: "12px",
  },
  smallPrimaryButton: {
    ...buttonBase,
    padding: "6px 12px",
    border: "none",
    background: "#3C3489",
    color: "#fff",
    fontSize: "12px",
  },
};

export const colors = COLORS;
