

// // src/componets/teacher/PendingTab.jsx
// import { Badge, btn, colors } from "./shared.jsx";

// export default function PendingTab({ pending, loading, onViewEssay, onGrade }) {
//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
//         <div style={{ width: "36px", height: "36px", border: "4px solid #bfdbfe", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
//         <p style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Pending Review</p>
//         {pending.length > 0 && (
//           <span style={{ background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", borderRadius: "20px", fontSize: "12px", fontWeight: "700", padding: "3px 12px" }}>
//             {pending.length}
//           </span>
//         )}
//       </div>

//       {pending.length === 0 ? (
//         <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "center", padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
//           <p style={{ fontSize: "48px", margin: "0 0 14px" }}>✅</p>
//           <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: "0 0 6px" }}>All caught up!</p>
//           <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>No essays are waiting for your review.</p>
//         </div>
//       ) : (
//         pending.map(sub => {
//           const flagged = sub.ai_detection_score >= 50;
//           return (
//             <div key={sub.id} style={{
//               background: "#fff",
//               borderRadius: "18px",
//               border: "1px solid #e2e8f0",
//               borderLeft: `5px solid ${flagged ? "#ef4444" : "#f59e0b"}`,
//               padding: "20px 22px",
//               marginBottom: "14px",
//               boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
//             }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
//                 {/* Left: avatar + info */}
//                 <div style={{ display: "flex", gap: "14px", flex: 1 }}>
//                   <div style={{
//                     width: "46px", height: "46px", borderRadius: "13px", flexShrink: 0,
//                     background: flagged ? "#fee2e2" : "#fef3c7",
//                     color: flagged ? "#dc2626" : "#d97706",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontWeight: "800", fontSize: "18px",
//                   }}>
//                     {sub.student_name?.charAt(0)}
//                   </div>
//                   <div>
//                     <p style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b", margin: "0 0 3px" }}>{sub.student_name}</p>
//                     <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 5px" }}>{sub.assignment_title}</p>
//                     <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
//                       Submitted {new Date(sub.submitted_at).toLocaleString()}
//                       {sub.file_name && ` · 📎 ${sub.file_name}`}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Right: AI score */}
//                 <div style={{ textAlign: "right", flexShrink: 0 }}>
//                   <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 2px" }}>AI Score</p>
//                   <p style={{ fontSize: "22px", fontWeight: "900", margin: 0, color: flagged ? "#dc2626" : "#3b82f6" }}>
//                     {flagged ? "0" : (sub.ai_score ?? "—")}/{sub.max_score}
//                   </p>
//                 </div>
//               </div>

//               {/* AI flag warning */}
//               {flagged && (
//                 <div style={{ marginTop: "14px", background: colors.red.bg, border: `1px solid ${colors.red.border}`, borderRadius: "10px", padding: "10px 14px", display: "flex", gap: "8px", alignItems: "center" }}>
//                   <span>🚨</span>
//                   <p style={{ fontSize: "12px", color: colors.red.text, fontWeight: "700", margin: 0 }}>
//                     HIGH AI CONTENT — {sub.ai_detection_score}% detected. Score auto-set to 0. Review required.
//                   </p>
//                 </div>
//               )}

//               {/* Low detection badge */}
//               {!flagged && sub.ai_detection_score !== null && (
//                 <div style={{ marginTop: "12px" }}>
//                   <Badge color="green">🤖 AI Detection: {sub.ai_detection_score}% — Low</Badge>
//                 </div>
//               )}

//               {/* Actions */}
//               <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
//                 <button style={btn.small} onClick={() => onViewEssay(sub)}>👁 View Essay</button>
//                 <button style={btn.smallPrimary} onClick={() => onGrade(sub)}>Review & Grade →</button>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }


export default function StudentsTab() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 24px" }}>
      <p style={{ fontSize: "18px", fontWeight: "600", color: "#64748b", textAlign: "center" }}>
        Will be done by Limbani Chipeni
      </p>
    </div>
  );
}