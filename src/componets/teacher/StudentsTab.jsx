


// // src/componets/teacher/StudentsTab.jsx
// import { useState } from "react";
// import { Sheet, ScoreBar, Badge, btn, label, colors } from "./shared.jsx";

// export default function StudentsTab({ students, submissions, assignments, loading }) {
//   const [selected, setSelected] = useState(null);

//   if (loading) return (
//     <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
//       <div style={{ width: "36px", height: "36px", border: "4px solid #bfdbfe", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
//     </div>
//   );

//   const studentSubs = selected ? submissions.filter(s => s.student_id === selected.id) : [];

//   return (
//     <div>
//       <p style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: "0 0 20px" }}>Students Overview</p>

//       {students.length === 0 ? (
//         <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "center", padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
//           <p style={{ fontSize: "48px", margin: "0 0 14px" }}>👥</p>
//           <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: "0 0 6px" }}>No students yet</p>
//           <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Students will appear here once they submit essays.</p>
//         </div>
//       ) : (
//         <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
//           {/* Table header */}
//           <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "12px 22px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
//             {["Student", "Submitted", "Graded", "AI Flagged", "Avg Score"].map(h => (
//               <span key={h} style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
//             ))}
//           </div>

//           {students.map((st, i) => {
//             const subs       = submissions.filter(s => s.student_id === st.id);
//             const graded     = subs.filter(s => s.final_score !== null);
//             const flagged    = subs.filter(s => s.ai_detection_score >= 50).length;
//             const avgScore   = graded.length > 0
//               ? Math.round(graded.reduce((acc, s) => acc + (s.final_score / s.max_score) * 100, 0) / graded.length)
//               : null;
//             const scoreColor = avgScore === null ? "#94a3b8" : avgScore >= 70 ? "#16a34a" : avgScore >= 50 ? "#d97706" : "#dc2626";

//             return (
//               <div key={st.id}
//                 onClick={() => setSelected(st)}
//                 style={{
//                   display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
//                   padding: "16px 22px", cursor: "pointer",
//                   borderBottom: i < students.length - 1 ? "1px solid #f1f5f9" : "none",
//                   transition: "background 0.15s",
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
//                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//               >
//                 {/* Name + email */}
//                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                   <div style={{
//                     width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
//                     background: "linear-gradient(135deg, #3b82f6, #38bdf8)",
//                     color: "#fff", fontWeight: "800", fontSize: "15px",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                   }}>
//                     {st.name?.charAt(0)}
//                   </div>
//                   <div>
//                     <p style={{ fontWeight: "700", fontSize: "14px", color: "#1e293b", margin: "0 0 2px" }}>{st.name}</p>
//                     <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{st.email}</p>
//                   </div>
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <span style={{ fontSize: "14px", fontWeight: "700", color: "#3b82f6" }}>{subs.length}</span>
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <span style={{ fontSize: "14px", fontWeight: "700", color: "#16a34a" }}>{graded.length}</span>
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   {flagged > 0
//                     ? <Badge color="red">🚨 {flagged}</Badge>
//                     : <span style={{ fontSize: "13px", color: "#94a3b8" }}>—</span>}
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   {avgScore !== null
//                     ? <span style={{ fontSize: "14px", fontWeight: "800", color: scoreColor }}>{avgScore}%</span>
//                     : <span style={{ fontSize: "13px", color: "#94a3b8" }}>—</span>}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Student detail sheet */}
//       {selected && (() => {
//         const subs    = submissions.filter(s => s.student_id === selected.id);
//         const graded  = subs.filter(s => s.final_score !== null);
//         const flagged = subs.filter(s => s.ai_detection_score >= 50).length;
//         const avg     = graded.length > 0
//           ? Math.round(graded.reduce((acc, s) => acc + (s.final_score / s.max_score) * 100, 0) / graded.length)
//           : null;

//         return (
//           <Sheet onClose={() => setSelected(null)}
//             title={selected.name}
//             subtitle={selected.email}
//           >
//             {/* Stats row */}
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
//               {[
//                 { label: "Submitted",  value: subs.length,    color: "#3b82f6", bg: "#eff6ff" },
//                 { label: "Graded",     value: graded.length,  color: "#16a34a", bg: "#f0fdf4" },
//                 { label: "AI Flagged", value: flagged,        color: flagged > 0 ? "#dc2626" : "#94a3b8", bg: flagged > 0 ? "#fef2f2" : "#f8fafc" },
//                 { label: "Avg Score",  value: avg !== null ? `${avg}%` : "—", color: avg === null ? "#94a3b8" : avg >= 70 ? "#16a34a" : avg >= 50 ? "#d97706" : "#dc2626", bg: "#f8fafc" },
//               ].map(stat => (
//                 <div key={stat.label} style={{ background: stat.bg, borderRadius: "14px", padding: "16px", textAlign: "center" }}>
//                   <p style={{ fontSize: "22px", fontWeight: "900", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
//                   <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{stat.label}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Submission list */}
//             <p style={{ fontSize: "13px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>
//               Submissions
//             </p>

//             {subs.length === 0 ? (
//               <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "32px", textAlign: "center" }}>
//                 <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>No submissions yet.</p>
//               </div>
//             ) : (
//               subs.map(s => {
//                 const isFlagged = s.ai_detection_score >= 50;
//                 return (
//                   <div key={s.id} style={{
//                     background: "#f8fafc", border: "1px solid #e2e8f0",
//                     borderRadius: "14px", padding: "16px 18px", marginBottom: "12px",
//                     borderLeft: `4px solid ${isFlagged ? "#ef4444" : s.final_score !== null ? "#16a34a" : "#f59e0b"}`,
//                   }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
//                       <div style={{ flex: 1 }}>
//                         <p style={{ fontWeight: "700", fontSize: "14px", color: "#1e293b", margin: "0 0 4px" }}>{s.assignment_title}</p>
//                         <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 10px" }}>
//                           {new Date(s.submitted_at).toLocaleString()}
//                           {s.file_name && ` · 📎 ${s.file_name}`}
//                         </p>
//                         {isFlagged && (
//                           <Badge color="red">🚨 AI Detection: {s.ai_detection_score}%</Badge>
//                         )}
//                       </div>
//                       <div style={{ textAlign: "right", flexShrink: 0 }}>
//                         {s.final_score !== null ? (
//                           <>
//                             <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 4px" }}>Final Score</p>
//                             <ScoreBar value={s.final_score} max={s.max_score} />
//                           </>
//                         ) : (
//                           <Badge color="amber">⏳ Pending</Badge>
//                         )}
//                       </div>
//                     </div>

//                     {s.teacher_feedback && (
//                       <div style={{ marginTop: "10px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>
//                         <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Your Feedback</p>
//                         <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.7", margin: 0 }}>{s.teacher_feedback}</p>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </Sheet>
//         );
//       })()}
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
