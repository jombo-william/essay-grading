// import { useState } from "react";

// export default function RoleSelector({ onSelect }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Demo credentials — email contains role hint, password is same for both
//   const CREDENTIALS = [
//     { email: "teacher@essaygrade.com", password: "demo1234", role: "teacher", name: "Dr. william jombo" },
//     { email: "student@essaygrade.com", password: "demo1234", role: "student", name: "mr Limbani chipeni" },
//   ];

//   const handleLogin = () => {
//     setError("");
//     if (!email || !password) { setError("Please enter your email and password."); return; }

//     setLoading(true);
//     setTimeout(() => {
//       const match = CREDENTIALS.find(
//         c => c.email.toLowerCase() === email.toLowerCase().trim() && c.password === password
//       );
//       if (match) {
//         onSelect(match.role);
//       } else {
//         setLoading(false);
//         setError("Invalid email or password. Use the hint below to try.");
//       }
//     }, 800);
//   };

//   const handleKey = e => { if (e.key === "Enter") handleLogin(); };

//   const inp = focused => ({
//     width: "100%",
//     padding: "12px 14px",
//     boxSizing: "border-box",
//     border: `1.5px solid ${focused ? "#6366f1" : "#e2e8f0"}`,
//     borderRadius: "12px",
//     fontSize: "14px",
//     color: "#1e293b",
//     outline: "none",
//     fontFamily: "inherit",
//     background: "#fff",
//     transition: "border-color 0.2s",
//     boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
//   });

//   const [focusedField, setFocusedField] = useState(null);

//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "linear-gradient(160deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)",
//       fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "24px",
//       position: "relative",
//       overflow: "hidden",
//     }}>
//       {/* Soft background blobs */}
//       <div style={{ position:"absolute", top:"-80px", left:"-80px", width:"380px", height:"380px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents:"none" }} />
//       <div style={{ position:"absolute", bottom:"-100px", right:"-60px", width:"440px", height:"440px", borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />
//       <div style={{ position:"absolute", top:"40%", right:"5%", width:"260px", height:"260px", borderRadius:"50%", background:"radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />

//       <div style={{ width:"100%", maxWidth:"420px", position:"relative", zIndex:1 }}>

//         {/* Card */}
//         <div style={{
//           background: "#fff",
//           borderRadius: "24px",
//           border: "1px solid rgba(99,102,241,0.12)",
//           boxShadow: "0 8px 48px rgba(99,102,241,0.1), 0 2px 12px rgba(0,0,0,0.06)",
//           padding: "40px 36px 36px",
//         }}>
//           {/* Logo */}
//           <div style={{ textAlign:"center", marginBottom:"32px" }}>
//             <div style={{
//               width:"64px", height:"64px",
//               background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
//               borderRadius:"18px",
//               display:"flex", alignItems:"center", justifyContent:"center",
//               margin:"0 auto 16px",
//               fontSize:"30px",
//               boxShadow:"0 6px 24px rgba(99,102,241,0.35)",
//             }}>✍️</div>
//             <h1 style={{ color:"#1e293b", fontSize:"22px", fontWeight:"800", margin:"0 0 6px", letterSpacing:"-0.3px" }}>EssayGrade AI</h1>
//             <p style={{ color:"#94a3b8", fontSize:"13px", margin:0 }}>Sign in to your portal</p>
//           </div>

//           {/* Fields */}
//           <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginBottom:"20px" }}>
//             <div>
//               <label style={{ display:"block", fontSize:"12px", fontWeight:"700", color:"#374151", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.05em" }}>Email Address</label>
//               <input
//                 type="email"
//                 placeholder="you@essaygrade.com"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 onFocus={() => setFocusedField("email")}
//                 onBlur={() => setFocusedField(null)}
//                 onKeyDown={handleKey}
//                 style={inp(focusedField === "email")}
//               />
//             </div>

//             <div>
//               <label style={{ display:"block", fontSize:"12px", fontWeight:"700", color:"#374151", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.05em" }}>Password</label>
//               <div style={{ position:"relative" }}>
//                 <input
//                   type={showPass ? "text" : "password"}
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={e => setPassword(e.target.value)}
//                   onFocus={() => setFocusedField("pass")}
//                   onBlur={() => setFocusedField(null)}
//                   onKeyDown={handleKey}
//                   style={{ ...inp(focusedField === "pass"), paddingRight:"44px" }}
//                 />
//                 <button
//                   onClick={() => setShowPass(p => !p)}
//                   style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"16px", color:"#94a3b8", padding:0, lineHeight:1 }}
//                 >
//                   {showPass ? "🙈" : "👁"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", padding:"10px 14px", marginBottom:"16px", display:"flex", gap:"8px", alignItems:"center" }}>
//               <span style={{ fontSize:"14px" }}>⚠️</span>
//               <p style={{ fontSize:"12px", color:"#dc2626", fontWeight:"600", margin:0 }}>{error}</p>
//             </div>
//           )}

//           {/* Login button */}
//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             style={{
//               width:"100%",
//               padding:"13px",
//               borderRadius:"12px",
//               border:"none",
//               background: loading ? "#c7d2fe" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
//               color:"#fff",
//               fontSize:"14px",
//               fontWeight:"700",
//               cursor: loading ? "not-allowed" : "pointer",
//               boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.4)",
//               transition:"all 0.2s",
//               letterSpacing:"0.02em",
//             }}
//           >
//             {loading ? "Signing in…" : "Sign In →"}
//           </button>

//           {/* Demo hint */}
//           <div style={{ marginTop:"24px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"14px", padding:"16px" }}>
//             <p style={{ fontSize:"11px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 10px" }}>Demo Credentials</p>
//             <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
//               {[
//                 { role:"Teacher", icon:"👨‍🏫", email:"teacher@essaygrade.com", color:"#6366f1", bg:"#eff6ff" },
//                 { role:"Student", icon:"🎓", email:"student@essaygrade.com", color:"#8b5cf6", bg:"#fdf4ff" },
//               ].map(c => (
//                 <button
//                   key={c.role}
//                   onClick={() => { setEmail(c.email); setPassword("demo1234"); setError(""); }}
//                   style={{
//                     display:"flex", alignItems:"center", gap:"10px",
//                     background: c.bg,
//                     border:`1px solid ${c.color}22`,
//                     borderRadius:"10px",
//                     padding:"8px 12px",
//                     cursor:"pointer",
//                     textAlign:"left",
//                     transition:"all 0.15s",
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
//                   onMouseLeave={e => e.currentTarget.style.opacity = "1"}
//                 >
//                   <span style={{ fontSize:"18px" }}>{c.icon}</span>
//                   <div>
//                     <p style={{ fontSize:"12px", fontWeight:"700", color:c.color, margin:0 }}>{c.role} Portal</p>
//                     <p style={{ fontSize:"11px", color:"#94a3b8", margin:0 }}>{c.email} · demo1234</p>
//                   </div>
//                   <span style={{ marginLeft:"auto", fontSize:"11px", color:c.color, fontWeight:"700" }}>Use →</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <p style={{ textAlign:"center", color:"#94a3b8", fontSize:"12px", marginTop:"20px" }}>
//           Prototype · Final Year Project Presentation 
          
//         </p>
//       </div>
//     </div>
//   );
// }
