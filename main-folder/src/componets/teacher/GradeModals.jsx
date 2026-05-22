

// // src/components/teacher/GradeModals.jsx
// // No external CSS — all styles inline. Uses Tabler Icons via shared.jsx Icon component.

// import { Icon, Sheet, ScoreBar } from "./shared.jsx";

// // ── Color tokens ──────────────────────────────────────────────────────────────
// const C = {
//   blue:   { bg: "#E6F1FB", border: "#B5D4F4", text: "#185FA5" },
//   red:    { bg: "#FCEBEB", border: "#F7C1C1", text: "#A32D2D" },
//   amber:  { bg: "#FAEEDA", border: "#FAC775", text: "#854F0B" },
//   gray:   { bg: "#F1EFE8", border: "#D3D1C7", text: "#5F5E5A" },
// };

// const inputStyle = {
//   width: "100%", padding: "10px 12px", boxSizing: "border-box",
//   border: `1px solid ${C.gray.border}`, borderRadius: 9,
//   fontSize: 14, color: "#1A1830", outline: "none",
//   fontFamily: "inherit", background: "#fff", transition: "border-color 0.2s",
// };

// const labelStyle = {
//   display: "block", fontSize: 10, fontWeight: 700,
//   color: "#8884A8", textTransform: "uppercase",
//   letterSpacing: "0.07em", marginBottom: 7,
// };

// function FooterBtn({ onClick, icon, children, primary = false }) {
//   return (
//     <button onClick={onClick} style={{
//       flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//       padding: "10px 18px", borderRadius: 9, fontFamily: "inherit",
//       fontWeight: 500, fontSize: 13, cursor: "pointer",
//       border: primary ? "none" : `1px solid ${C.gray.border}`,
//       background: primary ? "#1A1830" : C.gray.bg,
//       color: primary ? "#fff" : C.gray.text,
//     }}>
//       {icon && <Icon name={icon} size={14} style={{ color: primary ? "#EEEDFE" : C.gray.text }} />}
//       {children}
//     </button>
//   );
// }

// // ── GradeModal ────────────────────────────────────────────────────────────────
// export function GradeModal({ sub, score, setScore, feedback, setFeedback, onSave, onClose }) {
//   const flagged = sub.ai_detection_score >= 50;
//   const c = flagged ? C.red : C.blue;
//   const aiIcon = flagged ? "alert-triangle" : "robot";

//   return (
//     <Sheet
//       onClose={onClose}
//       title="Review & grade"
//       subtitle={`${sub.student_name} — ${sub.assignment_title}`}
//       footer={
//         <>
//           <FooterBtn onClick={onClose} icon="x">Cancel</FooterBtn>
//           <FooterBtn onClick={onSave} icon="device-floppy" primary>Save grade</FooterBtn>
//         </>
//       }
//     >
//       {/* AI score banner */}
//       {sub.ai_score !== null && (
//         <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 11, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12 }}>
//           <div style={{ width: 36, height: 36, borderRadius: 9, background: flagged ? "#FCEBEB" : "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//             <Icon name={aiIcon} size={18} style={{ color: c.text }} />
//           </div>
//           <div>
//             <p style={{ fontWeight: 700, fontSize: 14, color: c.text, margin: "0 0 3px" }}>
//               AI score: {sub.ai_score}/{sub.max_score}
//               {flagged && " · High AI content flagged"}
//             </p>
//             <p style={{ fontSize: 12, color: "#8884A8", margin: 0 }}>
//               AI detection: {sub.ai_detection_score}% — accept or override below.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Essay preview */}
//       <div style={{ background: "#FDFCF7", border: `1px solid ${C.gray.border}`, borderRadius: 11, padding: 16, marginBottom: 20, maxHeight: 150, overflowY: "auto" }}>
//         <p style={{ ...labelStyle, marginBottom: 8 }}>Student essay</p>
//         <p style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }}>
//           {sub.essay_text}
//         </p>
//       </div>

//       {/* AI feedback */}
//       {sub.ai_feedback && (
//         <div style={{ background: C.blue.bg, border: `1px solid ${C.blue.border}`, borderRadius: 11, padding: 16, marginBottom: 20 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
//             <Icon name="robot" size={13} style={{ color: C.blue.text }} />
//             <p style={{ ...labelStyle, marginBottom: 0, color: C.blue.text }}>AI feedback</p>
//           </div>
//           <p style={{ fontSize: 13, color: "#1A1830", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
//             {sub.ai_feedback}
//           </p>
//         </div>
//       )}

//       {/* Score input */}
//       <div style={{ marginBottom: 20 }}>
//         <label style={labelStyle}>Final score (out of {sub.max_score}) *</label>
//         <input
//           style={{ ...inputStyle, width: 160 }}
//           type="number" min="0" max={sub.max_score}
//           value={score}
//           onChange={e => setScore(e.target.value)}
//           placeholder={`0 – ${sub.max_score}`}
//         />
//         {score !== "" && score !== undefined && (
//           <div style={{ marginTop: 10 }}>
//             <ScoreBar value={parseInt(score) || 0} max={sub.max_score} />
//           </div>
//         )}
//       </div>

//       {/* Feedback textarea */}
//       <div>
//         <label style={labelStyle}>Your feedback to student</label>
//         <textarea
//           value={feedback}
//           onChange={e => setFeedback(e.target.value)}
//           rows={4}
//           placeholder="Write personalised feedback for the student…"
//           style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
//         />
//       </div>
//     </Sheet>
//   );
// }

// // ── EditGradeModal ────────────────────────────────────────────────────────────
// export function EditGradeModal({ sub, score, setScore, feedback, setFeedback, onSave, onClose }) {
//   const currentPct = Math.round((sub.final_score / sub.max_score) * 100);

//   return (
//     <Sheet
//       onClose={onClose}
//       title="Edit grade"
//       subtitle={`${sub.student_name} — ${sub.assignment_title}`}
//       footer={
//         <>
//           <FooterBtn onClick={onClose} icon="x">Cancel</FooterBtn>
//           <FooterBtn onClick={onSave} icon="device-floppy" primary>Update grade</FooterBtn>
//         </>
//       }
//     >
//       {/* Override notice */}
//       <div style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}`, borderRadius: 11, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "center" }}>
//         <Icon name="pencil" size={15} style={{ color: C.amber.text, flexShrink: 0 }} />
//         <p style={{ fontSize: 13, color: C.amber.text, fontWeight: 600, margin: 0 }}>
//           Current grade: <strong>{sub.final_score}/{sub.max_score}</strong> ({currentPct}%) — you are overriding this.
//         </p>
//       </div>

//       {/* New score */}
//       <div style={{ marginBottom: 20 }}>
//         <label style={labelStyle}>New score (out of {sub.max_score})</label>
//         <div style={{ marginBottom: 12 }}>
//           <ScoreBar value={parseInt(score) || 0} max={sub.max_score} />
//         </div>
//         <input
//           style={{ ...inputStyle, width: 160 }}
//           type="number" min="0" max={sub.max_score}
//           value={score}
//           onChange={e => setScore(e.target.value)}
//         />
//       </div>

//       {/* Updated feedback */}
//       <div>
//         <label style={labelStyle}>Updated feedback</label>
//         <textarea
//           value={feedback}
//           onChange={e => setFeedback(e.target.value)}
//           rows={4}
//           style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
//           placeholder="Update feedback for the student…"
//         />
//       </div>
//     </Sheet>
//   );
// }






// src/components/teacher/GradeModals.jsx
// No external CSS — all styles inline. Uses Tabler Icons via shared.jsx Icon component.

import { useEffect, useState } from "react";
import { Icon, Sheet, ScoreBar } from "./shared.jsx";

// ── Responsive hook ────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 520) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  blue:  { bg: "#E6F1FB", border: "#B5D4F4", text: "#185FA5" },
  red:   { bg: "#FCEBEB", border: "#F7C1C1", text: "#A32D2D" },
  amber: { bg: "#FAEEDA", border: "#FAC775", text: "#854F0B" },
  gray:  { bg: "#F1EFE8", border: "#D3D1C7", text: "#5F5E5A" },
};

const inputStyle = {
  width: "100%", padding: "10px 12px", boxSizing: "border-box",
  border: `1px solid ${C.gray.border}`, borderRadius: 9,
  fontSize: 14, color: "#1A1830", outline: "none",
  fontFamily: "inherit", background: "#fff", transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block", fontSize: 10, fontWeight: 700,
  color: "#8884A8", textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: 7,
};

function FooterBtn({ onClick, icon, children, primary = false, fullWidth = false }) {
  return (
    <button onClick={onClick} style={{
      flex: fullWidth ? undefined : 1,
      width: fullWidth ? "100%" : undefined,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      padding: "12px 18px", borderRadius: 9, fontFamily: "inherit",
      fontWeight: 500, fontSize: 13, cursor: "pointer",
      border: primary ? "none" : `1px solid ${C.gray.border}`,
      background: primary ? "#1A1830" : C.gray.bg,
      color: primary ? "#fff" : C.gray.text,
    }}>
      {icon && <Icon name={icon} size={14} style={{ color: primary ? "#EEEDFE" : C.gray.text }} />}
      {children}
    </button>
  );
}

// ── GradeModal ────────────────────────────────────────────────────────────────
export function GradeModal({ sub, score, setScore, feedback, setFeedback, onSave, onClose }) {
  const isMobile = useIsMobile();
  const flagged  = sub.ai_detection_score >= 50;
  const c        = flagged ? C.red : C.blue;
  const aiIcon   = flagged ? "alert-triangle" : "robot";

  return (
    <Sheet
      onClose={onClose}
      title="Review & grade"
      subtitle={`${sub.student_name} — ${sub.assignment_title}`}
      footer={
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 8,
          width: "100%",
        }}>
          <FooterBtn onClick={onClose} icon="x" fullWidth={isMobile}>Cancel</FooterBtn>
          <FooterBtn onClick={onSave} icon="device-floppy" primary fullWidth={isMobile}>Save grade</FooterBtn>
        </div>
      }
    >
      {/* AI score banner */}
      {sub.ai_score !== null && (
        <div style={{
          background: c.bg, border: `1px solid ${c.border}`,
          borderRadius: 11, padding: isMobile ? "12px 14px" : "14px 16px",
          marginBottom: 20,
          display: "flex", alignItems: "flex-start", gap: isMobile ? 10 : 12,
        }}>
          <div style={{
            width: isMobile ? 32 : 36, height: isMobile ? 32 : 36,
            borderRadius: 9,
            background: flagged ? "#FCEBEB" : "#E6F1FB",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon name={aiIcon} size={isMobile ? 16 : 18} style={{ color: c.text }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: isMobile ? 13 : 14, color: c.text, margin: "0 0 3px", wordBreak: "break-word" }}>
              AI score: {sub.ai_score}/{sub.max_score}
              {flagged && " · High AI content flagged"}
            </p>
            <p style={{ fontSize: 12, color: "#8884A8", margin: 0 }}>
              AI detection: {sub.ai_detection_score}% — accept or override below.
            </p>
          </div>
        </div>
      )}

      {/* Essay preview */}
      <div style={{
        background: "#FDFCF7", border: `1px solid ${C.gray.border}`,
        borderRadius: 11, padding: isMobile ? 14 : 16,
        marginBottom: 20,
        maxHeight: isMobile ? 120 : 150,
        overflowY: "auto",
      }}>
        <p style={{ ...labelStyle, marginBottom: 8 }}>Student essay</p>
        <p style={{
          fontSize: 13, color: "#5F5E5A", lineHeight: 1.8, margin: 0,
          whiteSpace: "pre-wrap", fontFamily: "Georgia, serif",
          wordBreak: "break-word", overflowWrap: "break-word",
        }}>
          {sub.essay_text}
        </p>
      </div>

      {/* AI feedback */}
      {sub.ai_feedback && (
        <div style={{
          background: C.blue.bg, border: `1px solid ${C.blue.border}`,
          borderRadius: 11, padding: isMobile ? 14 : 16, marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Icon name="robot" size={13} style={{ color: C.blue.text }} />
            <p style={{ ...labelStyle, marginBottom: 0, color: C.blue.text }}>AI feedback</p>
          </div>
          <p style={{
            fontSize: 13, color: "#1A1830", lineHeight: 1.8, margin: 0,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {sub.ai_feedback}
          </p>
        </div>
      )}

      {/* Score input — full width on mobile */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Final score (out of {sub.max_score}) *</label>
        <input
          style={{
            ...inputStyle,
            width: isMobile ? "100%" : 160,
            fontSize: isMobile ? 16 : 14, // 16px prevents iOS zoom on focus
          }}
          type="number" min="0" max={sub.max_score}
          value={score}
          onChange={e => setScore(e.target.value)}
          placeholder={`0 – ${sub.max_score}`}
          inputMode="numeric"
        />
        {score !== "" && score !== undefined && (
          <div style={{ marginTop: 10 }}>
            <ScoreBar value={parseInt(score) || 0} max={sub.max_score} />
          </div>
        )}
      </div>

      {/* Feedback textarea */}
      <div>
        <label style={labelStyle}>Your feedback to student</label>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={isMobile ? 5 : 4}
          placeholder="Write personalised feedback for the student…"
          style={{
            ...inputStyle, resize: "vertical", lineHeight: 1.65,
            fontSize: isMobile ? 16 : 14, // prevent iOS zoom
          }}
        />
      </div>
    </Sheet>
  );
}

// ── EditGradeModal ────────────────────────────────────────────────────────────
export function EditGradeModal({ sub, score, setScore, feedback, setFeedback, onSave, onClose }) {
  const isMobile  = useIsMobile();
  const currentPct = Math.round((sub.final_score / sub.max_score) * 100);

  return (
    <Sheet
      onClose={onClose}
      title="Edit grade"
      subtitle={`${sub.student_name} — ${sub.assignment_title}`}
      footer={
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 8,
          width: "100%",
        }}>
          <FooterBtn onClick={onClose} icon="x" fullWidth={isMobile}>Cancel</FooterBtn>
          <FooterBtn onClick={onSave} icon="device-floppy" primary fullWidth={isMobile}>Update grade</FooterBtn>
        </div>
      }
    >
      {/* Override notice */}
      <div style={{
        background: C.amber.bg, border: `1px solid ${C.amber.border}`,
        borderRadius: 11, padding: isMobile ? "12px 14px" : "12px 16px",
        marginBottom: 24,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <Icon name="pencil" size={15} style={{ color: C.amber.text, flexShrink: 0, marginTop: 1 }} />
        <p style={{
          fontSize: 13, color: C.amber.text, fontWeight: 600,
          margin: 0, lineHeight: 1.5, wordBreak: "break-word",
        }}>
          Current grade: <strong>{sub.final_score}/{sub.max_score}</strong> ({currentPct}%) — you are overriding this.
        </p>
      </div>

      {/* New score */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>New score (out of {sub.max_score})</label>
        <div style={{ marginBottom: 12 }}>
          <ScoreBar value={parseInt(score) || 0} max={sub.max_score} />
        </div>
        <input
          style={{
            ...inputStyle,
            width: isMobile ? "100%" : 160,
            fontSize: isMobile ? 16 : 14, // prevent iOS zoom
          }}
          type="number" min="0" max={sub.max_score}
          value={score}
          onChange={e => setScore(e.target.value)}
          inputMode="numeric"
        />
      </div>

      {/* Updated feedback */}
      <div>
        <label style={labelStyle}>Updated feedback</label>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={isMobile ? 5 : 4}
          style={{
            ...inputStyle, resize: "vertical", lineHeight: 1.65,
            fontSize: isMobile ? 16 : 14, // prevent iOS zoom
          }}
          placeholder="Update feedback for the student…"
        />
      </div>
    </Sheet>
  );
}