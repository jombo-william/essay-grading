// import { useState, useRef } from 'react';

// // ─── MOCK DATA ─────────────────────────────────────────────────────────────
// const MOCK_STUDENTS = [
//   { id: 2, name: 'Alice Mwale',   email: 'alice@example.com' },
//   { id: 3, name: 'Brian Phiri',  email: 'brian@example.com' },
//   { id: 4, name: 'Chisomo Banda',email: 'chisomo@example.com' },
//   { id: 5, name: 'Diana Tembo',  email: 'diana@example.com' },
// ];

// const MOCK_ASSIGNMENTS_INIT = [
//   {
//     id: 1, title: 'Climate Change & Society',
//     description: 'Analyse the socio-economic impacts of climate change on developing nations.',
//     instructions: 'Write a well-structured essay (500–800 words) discussing at least three specific socio-economic impacts of climate change on developing nations. Use examples where possible.',
//     referenceMaterial: 'Climate change impacts: food insecurity (IPCC, 2022), displacement (IOM, 2021), 5% GDP losses (World Bank, 2023), vector-borne diseases, infrastructure damage.',
//     rubric: { content: 35, structure: 25, grammar: 20, evidence: 20 },
//     max_score: 100, due_date: '2026-04-15T23:59',
//     attachments: [],
//   },
//   {
//     id: 2, title: 'Artificial Intelligence in Education',
//     description: 'Discuss the benefits and challenges of integrating AI tools in secondary schools.',
//     instructions: 'Write an argumentative essay (400–600 words) presenting both sides of AI integration. Conclude with your recommendation.',
//     referenceMaterial: 'AI benefits: personalised learning, automated grading. Challenges: digital divide, data privacy, dishonesty risk. UNESCO ethical AI frameworks (2023).',
//     rubric: { argumentation: 40, structure: 25, grammar: 20, evidence: 15 },
//     max_score: 100, due_date: '2026-04-20T23:59',
//     attachments: [],
//   },
//   {
//     id: 3, title: 'The Role of Entrepreneurs in Africa',
//     description: 'Examine how entrepreneurship drives economic development in African economies.',
//     instructions: 'Write a 500–700 word essay on entrepreneurship in at least two African countries. Include challenges and solutions.',
//     referenceMaterial: 'M-Pesa (Kenya), Twiga Foods, mPharma. Challenges: funding, infrastructure, regulation. Solutions: AFCFTA, angel investors.',
//     rubric: { content: 30, structure: 25, grammar: 20, examples: 25 },
//     max_score: 100, due_date: '2026-02-01T23:59',
//     attachments: [],
//   },
// ];

// const ALL_SUBMISSIONS_INIT = [
//   { id: 101, student_id: 2, assignment_id: 1, student_name: 'Alice Mwale', assignment_title: 'Climate Change & Society', max_score: 100,
//     essay_text: 'Climate change is one of the most pressing global challenges... [full essay content would appear here, demonstrating the student\'s analysis of food insecurity, economic losses, and mass displacement across developing nations with references to IPCC, World Bank, and IOM reports]',
//     file_name: null, submit_mode: 'write', submitted_at: '2026-03-04T10:30:00',
//     ai_score: 82, ai_detection_score: 8,
//     ai_feedback: 'Content (28/35): Three clear impacts identified with relevant examples. Structure (22/25): Clear paragraphs. Grammar (18/20): Fluent writing. Evidence (14/20): Good citations but needs more statistics.\nAI Detection: Low (~8%). Appears authentically written.',
//     final_score: 85, teacher_feedback: 'Excellent work Alice! Strong analysis with good examples. Watch citation formatting.', status: 'graded' },

//   { id: 102, student_id: 2, assignment_id: 2, student_name: 'Alice Mwale', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
//     essay_text: 'Artificial intelligence is rapidly transforming education... [essay presenting balanced arguments on AI integration in secondary schools, discussing personalised learning benefits vs digital divide and privacy concerns]',
//     file_name: null, submit_mode: 'write', submitted_at: '2026-03-10T14:00:00',
//     ai_score: 76, ai_detection_score: 18,
//     ai_feedback: 'Argumentation (30/40): Balanced perspective. Structure (20/25): Good flow. Grammar (16/20): Minor errors. Evidence (10/15): Needs more specific citations.\nAI Detection: Low (~18%). Original work.',
//     final_score: null, teacher_feedback: null, status: 'ai_graded' },

//   { id: 103, student_id: 3, assignment_id: 1, student_name: 'Brian Phiri', assignment_title: 'Climate Change & Society', max_score: 100,
//     essay_text: 'Climate change represents a multifaceted global challenge with profound socio-economic implications... [essay using highly formal academic language consistent with AI generation, lacking personal voice and specific local examples]',
//     file_name: null, submit_mode: 'write', submitted_at: '2026-03-05T11:00:00',
//     ai_score: 0, ai_detection_score: 81,
//     ai_feedback: '⚠️ HIGH AI CONTENT (81%)\nUniform sentence structure, generic phrasing, no local examples, vocabulary patterns consistent with LLMs. Score: 0/100.',
//     final_score: null, teacher_feedback: null, status: 'ai_graded' },

//   { id: 104, student_id: 3, assignment_id: 2, student_name: 'Brian Phiri', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
//     essay_text: '[Content from uploaded file: AI_Education_Essay_BPhiri.pdf]\n\nBrian argues that AI in education offers transformative potential but must be introduced carefully with teacher training, equitable access policies, and safeguards against academic misuse...',
//     file_name: 'AI_Education_Essay_BPhiri.pdf', submit_mode: 'upload', submitted_at: '2026-03-12T09:30:00',
//     ai_score: 71, ai_detection_score: 12,
//     ai_feedback: 'Argumentation (28/40): Good but needs stronger counterarguments. Structure (22/25): Well organised. Grammar (18/20): Strong. Evidence (3/15): Very few citations provided.\nAI Detection: Low (~12%). Authentic writing.',
//     final_score: 68, teacher_feedback: 'Good effort Brian. The PDF upload was received. Main area for improvement: you need much stronger evidence — cite at least 3 sources in your next essay.', status: 'graded' },

//   { id: 105, student_id: 4, assignment_id: 1, student_name: 'Chisomo Banda', assignment_title: 'Climate Change & Society', max_score: 100,
//     essay_text: 'Climate change poses existential risks to developing nations... [submitted essay currently being processed by AI grader]',
//     file_name: null, submit_mode: 'write', submitted_at: '2026-03-15T16:45:00',
//     ai_score: null, ai_detection_score: null, ai_feedback: null,
//     final_score: null, teacher_feedback: null, status: 'pending' },

//   { id: 106, student_id: 5, assignment_id: 2, student_name: 'Diana Tembo', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
//     essay_text: '[Content from uploaded file: diana_essay.docx]\n\nDiana provides a nuanced perspective drawing on her own school\'s experience with tablet-based learning, discussing both the opportunities and the challenges she personally observed...',
//     file_name: 'diana_essay.docx', submit_mode: 'upload', submitted_at: '2026-03-11T10:15:00',
//     ai_score: 88, ai_detection_score: 5,
//     ai_feedback: 'Argumentation (38/40): Exceptional personal perspective. Structure (24/25): Near perfect. Grammar (19/20): Excellent. Evidence (7/15): Good personal evidence, needs academic sources.\nAI Detection: Very low (~5%). Highly original.',
//     final_score: 91, teacher_feedback: 'Outstanding Diana! Your personal anecdotes made this essay stand out. The only gap is academic citations — a few scholarly references would make this publication-worthy.', status: 'graded' },

//   { id: 107, student_id: 3, assignment_id: 3, student_name: 'Brian Phiri', assignment_title: 'The Role of Entrepreneurs in Africa', max_score: 100,
//     essay_text: 'Entrepreneurship in Africa is often discussed in the context of M-Pesa in Kenya and various agricultural tech startups... [Brian\'s essay examining entrepreneurship across Kenya and Nigeria with analysis of funding challenges]',
//     file_name: null, submit_mode: 'write', submitted_at: '2026-01-28T20:00:00',
//     ai_score: 63, ai_detection_score: 31,
//     ai_feedback: 'Content (20/30): Good examples but shallow analysis. Structure (18/25): Needs better transitions. Grammar (16/20): Several errors. Examples (9/25): More country-specific detail needed.\nAI Detection: Borderline (~31%). Some sections may have AI assistance.',
//     final_score: null, teacher_feedback: null, status: 'ai_graded' },
// ];

// // ─── STYLES ────────────────────────────────────────────────────────────────
// const C = {
//   page: { minHeight:'100vh', background:'#f8fafc', fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif" },
//   header: { background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 20px', height:'62px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 8px rgba(0,0,0,0.05)' },
//   main: { maxWidth:'900px', margin:'0 auto', padding:'24px 16px 60px' },
//   card: { background:'#fff', borderRadius:'16px', border:'1px solid #e2e8f0', padding:'20px', marginBottom:'12px', boxShadow:'0 1px 4px rgba(0,0,0,0.03)' },
//   sL: { display:'block', fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' },
//   tab: a => ({ padding:'8px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'700', background: a?'#fff':'transparent', color: a?'#6366f1':'#64748b', boxShadow: a?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all 0.2s', whiteSpace:'nowrap' }),
//   badge: c => ({ display:'inline-flex', alignItems:'center', gap:'4px', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background: c==='green'?'#f0fdf4':c==='red'?'#fef2f2':c==='amber'?'#fffbeb':c==='purple'?'#fdf4ff':c==='blue'?'#eff6ff':'#f1f5f9', color: c==='green'?'#16a34a':c==='red'?'#dc2626':c==='amber'?'#d97706':c==='purple'?'#9333ea':c==='blue'?'#2563eb':'#64748b' }),
//   pBtn: dis => ({ padding:'11px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor: dis?'not-allowed':'pointer', border:'none', background: dis?'#c7d2fe':'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', boxShadow: dis?'none':'0 2px 10px rgba(99,102,241,0.35)', opacity: dis?0.7:1 }),
//   gBtn: { padding:'11px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', border:'none', background:'#f1f5f9', color:'#475569' },
//   dBtn: { padding:'11px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', background:'#fef2f2', border:'1.5px solid #fecaca', color:'#dc2626' },
//   input: { width:'100%', padding:'10px 14px', boxSizing:'border-box', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'13px', color:'#1e293b', outline:'none', fontFamily:'inherit', background:'#fff' },
// };

// function Sheet({ onClose, title, subtitle, children, footer, wide }) {
//   return (
//     <div onClick={e => e.target===e.currentTarget && onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200, backdropFilter:'blur(3px)' }}>
//       <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', width:'100%', maxWidth: wide?'900px':'700px', maxHeight:'96vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 -8px 40px rgba(0,0,0,0.18)' }}>
//         <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}><div style={{ width:'40px', height:'4px', background:'#e2e8f0', borderRadius:'2px' }} /></div>
//         <div style={{ padding:'8px 20px 14px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
//           <div style={{ flex:1 }}>
//             <h2 style={{ fontWeight:'800', fontSize:'17px', color:'#1e293b', margin:'0 0 2px', lineHeight:1.3 }}>{title}</h2>
//             {subtitle && <p style={{ fontSize:'12px', color:'#94a3b8', margin:0 }}>{subtitle}</p>}
//           </div>
//           <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'32px', height:'32px', fontSize:'18px', cursor:'pointer', color:'#64748b', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
//         </div>
//         <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>{children}</div>
//         {footer && <div style={{ padding:'14px 20px 20px', borderTop:'1px solid #f1f5f9' }}>{footer}</div>}
//       </div>
//     </div>
//   );
// }

// export default function TeacherDashboard({ onBack }) {
//   const user = { id: 1, name: 'Dr. Sarah Banda' };
//   const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS_INIT);
//   const [submissions, setSubmissions] = useState(ALL_SUBMISSIONS_INIT);
//   const [tab, setTab] = useState('pending');
//   const [toast, setToast] = useState(null);

//   // Modals
//   const [gradeModal, setGradeModal]           = useState(null);
//   const [submissionDetail, setSubmissionDetail] = useState(null);
//   const [createModal, setCreateModal]         = useState(false);
//   const [editAssignmentModal, setEditAssignmentModal] = useState(null);
//   const [studentTableModal, setStudentTableModal] = useState(null);
//   const [editGradeModal, setEditGradeModal]   = useState(null);

//   // Grade form
//   const [gradeScore, setGradeScore]       = useState('');
//   const [gradeFeedback, setGradeFeedback] = useState('');

//   // Create/edit assignment form
//   const emptyForm = { title:'', description:'', instructions:'', referenceMaterial:'', max_score:100, due_date:'', rubric:{ content:35, structure:25, grammar:20, evidence:20 }, attachments:[] };
//   const [form, setForm] = useState(emptyForm);
//   const [formAttachments, setFormAttachments] = useState([]);
//   const attachRef = useRef();

//   const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

//   const pending = submissions.filter(s => s.status === 'ai_graded' && s.final_score === null);
//   const rubricTotal = Object.values(form.rubric).reduce((a,b)=>a+b,0);

//   const saveGrade = () => {
//     const score = parseInt(gradeScore);
//     if (isNaN(score) || score < 0 || score > gradeModal.max_score) { showToast('Invalid score.','error'); return; }
//     setSubmissions(prev => prev.map(s => s.id===gradeModal.id ? { ...s, final_score:score, teacher_feedback:gradeFeedback, status:'graded' } : s));
//     setGradeModal(null); showToast('✅ Grade saved and visible to student.');
//   };

//   const saveEditGrade = () => {
//     const score = parseInt(gradeScore);
//     if (isNaN(score) || score < 0 || score > editGradeModal.max_score) { showToast('Invalid score.','error'); return; }
//     setSubmissions(prev => prev.map(s => s.id===editGradeModal.id ? { ...s, final_score:score, teacher_feedback:gradeFeedback, status:'graded' } : s));
//     setEditGradeModal(null);
//     showToast('✅ Grade updated.');
//   };

//   const openGrade = sub => { setGradeModal(sub); setGradeScore(sub.ai_score ?? ''); setGradeFeedback(sub.teacher_feedback || ''); };
//   const openEditGrade = sub => { setEditGradeModal(sub); setGradeScore(sub.final_score ?? sub.ai_score ?? ''); setGradeFeedback(sub.teacher_feedback || ''); };

//   const handleCreate = () => {
//     if (!form.title || !form.instructions || !form.due_date) { showToast('Please fill required fields.','error'); return; }
//     if (rubricTotal !== 100) { showToast('Rubric weights must total 100%.','error'); return; }
//     const newA = { ...form, id: Date.now(), attachments: formAttachments };
//     setAssignments(prev => [...prev, newA]);
//     setCreateModal(false); setForm(emptyForm); setFormAttachments([]);
//     showToast('✅ Assignment created and published to students.');
//   };

//   const handleEditSave = () => {
//     setAssignments(prev => prev.map(a => a.id===editAssignmentModal.id ? { ...editAssignmentModal, attachments: formAttachments } : a));
//     setEditAssignmentModal(null); setFormAttachments([]);
//     showToast('✅ Assignment updated.');
//   };

//   const handleAttachFile = e => {
//     const files = Array.from(e.target.files);
//     const newAttachments = files.map(f => ({
//       name: f.name, size: f.size, type: f.type,
//       url: URL.createObjectURL(f),
//       icon: f.type.startsWith('image/') ? '🖼️' : f.type.startsWith('video/') ? '🎬' : f.type === 'application/pdf' ? '📄' : f.type.includes('word') ? '📝' : '📎',
//     }));
//     setFormAttachments(prev => [...prev, ...newAttachments]);
//     e.target.value = '';
//   };

//   const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';

//   const studentSubmissions = (studentId) => submissions.filter(s => s.student_id === studentId);

//   const allGraded = submissions.filter(s => s.final_score !== null);
//   const avgClass = allGraded.length ? Math.round(allGraded.reduce((sum,s)=>sum+(s.final_score/s.max_score)*100,0)/allGraded.length) : null;

//   return (
//     <div style={C.page}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}} input[type=file]{display:none}`}</style>

//       {toast && (
//         <div style={{ position:'fixed', top:'16px', left:'50%', transform:'translateX(-50%)', zIndex:999, background: toast.type==='error'?'#fef2f2':'#f0fdf4', border:`1px solid ${toast.type==='error'?'#fecaca':'#bbf7d0'}`, color: toast.type==='error'?'#dc2626':'#15803d', padding:'10px 20px', borderRadius:'12px', fontSize:'13px', fontWeight:'700', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', maxWidth:'90vw', textAlign:'center' }}>
//           {toast.msg}
//         </div>
//       )}

//       {/* HEADER */}
//       <header style={C.header}>
//         <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
//           <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'11px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'19px', boxShadow:'0 2px 8px rgba(99,102,241,0.3)' }}>✍️</div>
//           <div>
//             <p style={{ fontWeight:'800', fontSize:'15px', color:'#1e293b', margin:0 }}>EssayGrade AI</p>
//             <p style={{ fontSize:'11px', color:'#94a3b8', margin:0 }}>Teacher Portal</p>
//           </div>
//         </div>
//         <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
//           <div style={{ display:'flex', alignItems:'center', gap:'7px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'20px', padding:'4px 12px 4px 4px' }}>
//             <div style={{ width:'26px', height:'26px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px' }}>👨‍🏫</div>
//             <span style={{ fontSize:'13px', color:'#374151', fontWeight:'600' }}>{user.name}</span>
//           </div>
//           <button onClick={onBack} style={{ background:'none', border:'1.5px solid #e2e8f0', borderRadius:'8px', color:'#64748b', fontWeight:'600', fontSize:'12px', padding:'6px 12px', cursor:'pointer' }}>← Home</button>
//         </div>
//       </header>

//       <div style={C.main}>
//         {/* STATS */}
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px', marginBottom:'24px' }}>
//           {[
//             { label:'Total Assignments', value:assignments.length, icon:'📋', bg:'#eff6ff', fg:'#3b82f6' },
//             { label:'Pending Review', value:pending.length, icon:'⏳', bg:'#fffbeb', fg:'#d97706' },
//             { label:'Total Submissions', value:submissions.length, icon:'📝', bg:'#fdf4ff', fg:'#9333ea' },
//             { label:'Class Avg Score', value: avgClass!==null?`${avgClass}%`:'—', icon:'📊', bg:'#f0fdf4', fg:'#16a34a' },
//           ].map(s => (
//             <div key={s.label} style={{ background:'#fff', borderRadius:'16px', padding:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:'10px', boxShadow:'0 1px 4px rgba(0,0,0,0.03)' }}>
//               <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:s.bg, color:s.fg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{s.icon}</div>
//               <div>
//                 <p style={{ fontSize:'20px', fontWeight:'900', color:'#1e293b', margin:0, lineHeight:1 }}>{s.value}</p>
//                 <p style={{ fontSize:'11px', color:'#94a3b8', margin:'2px 0 0', fontWeight:'500' }}>{s.label}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* TABS — 3 tabs only */}
//         <div style={{ display:'flex', background:'#f1f5f9', borderRadius:'10px', padding:'4px', marginBottom:'20px', gap:'2px', overflowX:'auto' }}>
//           {[
//             ['pending', `⏳ Pending${pending.length > 0 ? ` (${pending.length})` : ''}`],
//             ['assignments', '📋 Assignments'],
//             ['students', '👥 Students'],
//           ].map(([id, label]) => (
//             <button key={id} style={C.tab(tab===id)} onClick={()=>setTab(id)}>{label}</button>
//           ))}
//         </div>

//         {/* ══ PENDING TAB ══ */}
//         {tab==='pending' && (
//           <div>
//             <p style={{ fontSize:'18px', fontWeight:'800', color:'#1e293b', margin:'0 0 16px' }}>Pending Review</p>
//             {pending.length === 0 ? (
//               <div style={{ ...C.card, textAlign:'center', padding:'56px 24px' }}>
//                 <p style={{ fontSize:'40px', margin:'0 0 10px' }}>✅</p>
//                 <p style={{ fontWeight:'700', color:'#64748b', fontSize:'15px', margin:'0 0 4px' }}>All caught up!</p>
//                 <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No essays pending your review.</p>
//               </div>
//             ) : pending.map(sub => (
//               <div key={sub.id} style={{ ...C.card, borderLeft:`4px solid ${sub.ai_detection_score>=50?'#ef4444':'#f59e0b'}` }}>
//                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
//                   <div style={{ display:'flex', gap:'12px', flex:1 }}>
//                     <div style={{ width:'42px', height:'42px', background: sub.ai_detection_score>=50?'#fee2e2':'#fef3c7', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'16px', color: sub.ai_detection_score>=50?'#dc2626':'#d97706', flexShrink:0 }}>{sub.student_name.charAt(0)}</div>
//                     <div>
//                       <p style={{ fontWeight:'800', fontSize:'15px', color:'#1e293b', margin:'0 0 2px' }}>{sub.student_name}</p>
//                       <p style={{ fontSize:'13px', color:'#64748b', margin:'0 0 4px' }}>{sub.assignment_title}</p>
//                       <p style={{ fontSize:'12px', color:'#94a3b8', margin:0 }}>Submitted {new Date(sub.submitted_at).toLocaleString()}{sub.file_name ? ` · 📎 ${sub.file_name}` : ''}</p>
//                     </div>
//                   </div>
//                   <div style={{ textAlign:'right', flexShrink:0 }}>
//                     {sub.ai_detection_score >= 50 ? (
//                       <div style={{ marginBottom:'8px' }}><p style={{ fontSize:'11px', color:'#94a3b8', margin:0 }}>AI Score</p><p style={{ fontSize:'18px', fontWeight:'800', color:'#dc2626', margin:0 }}>0/{sub.max_score}</p></div>
//                     ) : sub.ai_score !== null ? (
//                       <div style={{ marginBottom:'8px' }}><p style={{ fontSize:'11px', color:'#94a3b8', margin:0 }}>AI Score</p><p style={{ fontSize:'18px', fontWeight:'800', color:'#6366f1', margin:0 }}>{sub.ai_score}/{sub.max_score}</p></div>
//                     ) : null}
//                   </div>
//                 </div>
//                 {sub.ai_detection_score >= 50 && (
//                   <div style={{ marginTop:'10px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'8px', padding:'8px 12px', display:'flex', gap:'6px', alignItems:'center' }}>
//                     <span>🚨</span><p style={{ fontSize:'12px', color:'#dc2626', fontWeight:'700', margin:0 }}>HIGH AI CONTENT — {sub.ai_detection_score}% detected. Score auto-set to 0. Review required.</p>
//                   </div>
//                 )}
//                 <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
//                   <button onClick={() => setSubmissionDetail(sub)} style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>👁 View Essay</button>
//                   <button onClick={() => openGrade(sub)} style={{ ...C.pBtn(false), padding:'7px 16px', fontSize:'12px' }}>Review & Grade →</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ══ ASSIGNMENTS TAB ══ */}
//         {tab==='assignments' && (
//           <div>
//             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
//               <p style={{ fontSize:'18px', fontWeight:'800', color:'#1e293b', margin:0 }}>Assignments</p>
//               <button onClick={() => { setForm(emptyForm); setFormAttachments([]); setCreateModal(true); }} style={C.pBtn(false)}>+ New Assignment</button>
//             </div>
//             {assignments.map(a => {
//               const subCount = submissions.filter(s=>s.assignment_id===a.id).length;
//               const gradedCount = submissions.filter(s=>s.assignment_id===a.id && s.final_score!==null).length;
//               const isPast = new Date() > new Date(a.due_date);
//               return (
//                 <div key={a.id} style={{ ...C.card, borderLeft:`4px solid ${isPast?'#94a3b8':'#6366f1'}` }}>
//                   <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
//                     <div style={{ flex:1 }}>
//                       <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', marginBottom:'4px' }}>
//                         <span style={{ fontWeight:'800', fontSize:'15px', color:'#1e293b' }}>{a.title}</span>
//                         <span style={C.badge('blue')}>{a.max_score} pts</span>
//                         {isPast && <span style={C.badge('gray')}>Closed</span>}
//                         {!isPast && <span style={C.badge('green')}>Active</span>}
//                         {a.attachments?.length > 0 && <span style={C.badge('purple')}>📎 {a.attachments.length} file{a.attachments.length>1?'s':''}</span>}
//                       </div>
//                       <p style={{ fontSize:'13px', color:'#64748b', margin:'0 0 6px', lineHeight:1.5 }}>{a.description}</p>
//                       <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
//                         <span style={{ fontSize:'12px', color:'#94a3b8' }}>📅 Due {new Date(a.due_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
//                         <span style={{ fontSize:'12px', color:'#94a3b8' }}>📝 {subCount} submitted · ✅ {gradedCount} graded</span>
//                       </div>
//                     </div>
//                     <button onClick={() => { setEditAssignmentModal({...a, rubric:{...a.rubric}}); setFormAttachments(a.attachments || []); }}
//                       style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:'12px', fontWeight:'600', cursor:'pointer', flexShrink:0 }}>✏️ Edit</button>
//                   </div>
//                   {a.attachments?.length > 0 && (
//                     <div style={{ marginTop:'10px', display:'flex', flexWrap:'wrap', gap:'6px' }}>
//                       {a.attachments.map((f,i) => (
//                         <a key={i} href={f.url} target="_blank" rel="noreferrer"
//                           style={{ display:'flex', alignItems:'center', gap:'5px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'4px 10px', textDecoration:'none' }}>
//                           <span style={{ fontSize:'14px' }}>{f.icon}</span>
//                           <span style={{ fontSize:'11px', color:'#4f46e5', fontWeight:'600' }}>{f.name.length>20?f.name.slice(0,20)+'...':f.name}</span>
//                         </a>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* ══ STUDENTS TAB ══ */}
//         {tab==='students' && (
//           <div>
//             <p style={{ fontSize:'18px', fontWeight:'800', color:'#1e293b', margin:'0 0 16px' }}>Students Overview</p>
//             <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.03)', marginBottom:'16px' }}>
//               <div style={{ overflowX:'auto' }}>
//                 <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
//                   <thead>
//                     <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
//                       {['Student','Submitted','Graded','AI Flagged','Avg Score','Actions'].map(h => (
//                         <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {MOCK_STUDENTS.map(student => {
//                       const subs = studentSubmissions(student.id);
//                       const gradedSubs = subs.filter(s => s.final_score !== null);
//                       const flagged = subs.filter(s => s.ai_detection_score >= 50).length;
//                       const avg = gradedSubs.length ? Math.round(gradedSubs.reduce((sum,s)=>sum+(s.final_score/s.max_score)*100,0)/gradedSubs.length) : null;
//                       return (
//                         <tr key={student.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.1s' }}
//                           onMouseEnter={e=>e.currentTarget.style.background='#fafafe'}
//                           onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
//                           <td style={{ padding:'12px 16px' }}>
//                             <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
//                               <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,#8b5cf6,#a78bfa)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'13px', fontWeight:'700', flexShrink:0 }}>{student.name.charAt(0)}</div>
//                               <div>
//                                 <p style={{ fontWeight:'700', color:'#1e293b', margin:0, fontSize:'13px' }}>{student.name}</p>
//                                 <p style={{ fontSize:'11px', color:'#94a3b8', margin:0 }}>{student.email}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td style={{ padding:'12px 16px' }}><span style={{ fontWeight:'700', color:'#6366f1' }}>{subs.length}</span></td>
//                           <td style={{ padding:'12px 16px' }}><span style={{ fontWeight:'700', color:'#16a34a' }}>{gradedSubs.length}</span></td>
//                           <td style={{ padding:'12px 16px' }}>
//                             {flagged > 0
//                               ? <span style={{ ...C.badge('red') }}>🚨 {flagged}</span>
//                               : <span style={{ fontSize:'12px', color:'#16a34a' }}>✅ None</span>}
//                           </td>
//                           <td style={{ padding:'12px 16px' }}>
//                             {avg !== null
//                               ? <span style={{ fontWeight:'800', color: scoreColor(avg), fontSize:'14px' }}>{avg}%</span>
//                               : <span style={{ color:'#94a3b8' }}>—</span>}
//                           </td>
//                           <td style={{ padding:'12px 16px' }}>
//                             <button onClick={() => setStudentTableModal(student)}
//                               style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid #c7d2fe', background:'#eff6ff', color:'#4f46e5', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
//                               View All →
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ══ STUDENT TABLE MODAL ══ */}
//       {studentTableModal && (() => {
//         const subs = studentSubmissions(studentTableModal.id);
//         return (
//           <Sheet onClose={() => setStudentTableModal(null)} title={`${studentTableModal.name}'s Submissions`}
//             subtitle={`${subs.length} submission${subs.length!==1?'s':''} · ${studentTableModal.email}`} wide>
//             {subs.length === 0 ? (
//               <div style={{ textAlign:'center', padding:'48px', color:'#94a3b8' }}>
//                 <p style={{ fontSize:'36px', margin:'0 0 10px' }}>📭</p>
//                 <p>No submissions yet from this student.</p>
//               </div>
//             ) : (
//               <div>
//                 <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'20px' }}>
//                   {[
//                     { label:'Submitted', value:subs.length, icon:'📝' },
//                     { label:'Graded', value:subs.filter(s=>s.final_score!==null).length, icon:'✅' },
//                     { label:'Avg Score', value: subs.filter(s=>s.final_score!==null).length ? `${Math.round(subs.filter(s=>s.final_score!==null).reduce((sum,s)=>sum+(s.final_score/s.max_score)*100,0)/subs.filter(s=>s.final_score!==null).length)}%` : '—', icon:'⭐' },
//                   ].map(s => (
//                     <div key={s.label} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'12px 14px', textAlign:'center' }}>
//                       <p style={{ fontSize:'20px', fontWeight:'900', color:'#1e293b', margin:'0 0 2px' }}>{s.value}</p>
//                       <p style={{ fontSize:'11px', color:'#94a3b8', margin:0, fontWeight:'500' }}>{s.icon} {s.label}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <div style={{ borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
//                   <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
//                     <thead>
//                       <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
//                         {['Assignment','Submitted','AI Score','Final Score','AI%','Status','Actions'].map(h=>(
//                           <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {subs.map(sub => (
//                         <tr key={sub.id} style={{ borderBottom:'1px solid #f1f5f9' }}
//                           onMouseEnter={e=>e.currentTarget.style.background='#fafafe'}
//                           onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
//                           <td style={{ padding:'10px 14px' }}>
//                             <p style={{ fontWeight:'600', color:'#1e293b', margin:0 }}>{sub.assignment_title}</p>
//                             {sub.file_name && <p style={{ fontSize:'11px', color:'#8b5cf6', margin:'1px 0 0' }}>📎 {sub.file_name}</p>}
//                           </td>
//                           <td style={{ padding:'10px 14px', color:'#64748b', fontSize:'12px', whiteSpace:'nowrap' }}>{new Date(sub.submitted_at).toLocaleDateString()}</td>
//                           <td style={{ padding:'10px 14px' }}>
//                             {sub.ai_score!==null ? <span style={{ fontWeight:'700', color:'#6366f1' }}>{sub.ai_score}/{sub.max_score}</span> : <span style={{ color:'#94a3b8' }}>—</span>}
//                           </td>
//                           <td style={{ padding:'10px 14px' }}>
//                             {sub.final_score!==null
//                               ? <span style={{ fontWeight:'800', color:scoreColor(Math.round((sub.final_score/sub.max_score)*100)) }}>{sub.final_score}/{sub.max_score}</span>
//                               : <span style={{ color:'#94a3b8', fontSize:'12px' }}>Pending</span>}
//                           </td>
//                           <td style={{ padding:'10px 14px' }}>
//                             {sub.ai_detection_score!==null
//                               ? <span style={{ fontWeight:'700', color:sub.ai_detection_score>=50?'#dc2626':'#16a34a', fontSize:'12px' }}>{sub.ai_detection_score}%{sub.ai_detection_score>=50?' 🚨':''}</span>
//                               : <span style={{ color:'#94a3b8' }}>—</span>}
//                           </td>
//                           <td style={{ padding:'10px 14px' }}>
//                             {sub.status==='graded' && <span style={C.badge('green')}>✅ Graded</span>}
//                             {sub.status==='ai_graded' && <span style={C.badge('amber')}>⏳ Pending</span>}
//                             {sub.status==='pending' && <span style={C.badge('gray')}>🤖 Grading</span>}
//                           </td>
//                           <td style={{ padding:'10px 14px' }}>
//                             <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
//                               <button onClick={()=>setSubmissionDetail(sub)} style={{ padding:'5px 10px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:'11px', fontWeight:'600', cursor:'pointer' }}>View</button>
//                               {sub.status==='ai_graded' && <button onClick={()=>openGrade(sub)} style={{ padding:'5px 10px', borderRadius:'6px', border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>Grade</button>}
//                               {sub.status==='graded' && <button onClick={()=>openEditGrade(sub)} style={{ padding:'5px 10px', borderRadius:'6px', border:'1px solid #c7d2fe', background:'#eff6ff', color:'#4f46e5', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>✏️ Edit Grade</button>}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </Sheet>
//         );
//       })()}

//       {/* ══ SUBMISSION DETAIL MODAL ══ */}
//       {submissionDetail && (
//         <Sheet onClose={() => setSubmissionDetail(null)} title={submissionDetail.student_name}
//           subtitle={submissionDetail.assignment_title}
//           footer={
//             <div style={{ display:'flex', gap:'10px' }}>
//               {submissionDetail.status==='ai_graded' && <button onClick={()=>{setSubmissionDetail(null);openGrade(submissionDetail);}} style={C.pBtn(false)}>Grade This Essay →</button>}
//               {submissionDetail.status==='graded' && <button onClick={()=>{setSubmissionDetail(null);openEditGrade(submissionDetail);}} style={{ padding:'12px 20px', borderRadius:'10px', border:'1px solid #c7d2fe', background:'#eff6ff', color:'#4f46e5', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>✏️ Edit Grade</button>}
//               <button onClick={()=>setSubmissionDetail(null)} style={C.gBtn}>Close</button>
//             </div>
//           }>
//           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
//             {[
//               { label:'Submitted', value: new Date(submissionDetail.submitted_at).toLocaleString() },
//               { label:'Submit Mode', value: submissionDetail.file_name ? `📎 ${submissionDetail.file_name}` : '✏️ Written' },
//               { label:'AI Score', value: submissionDetail.ai_score!==null ? `${submissionDetail.ai_score}/${submissionDetail.max_score}` : '—' },
//               { label:'AI Detection', value: submissionDetail.ai_detection_score!==null ? `${submissionDetail.ai_detection_score}%${submissionDetail.ai_detection_score>=50?' 🚨':''}` : '—' },
//             ].map(d => (
//               <div key={d.label} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'10px 12px' }}>
//                 <p style={{ fontSize:'11px', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', margin:'0 0 3px' }}>{d.label}</p>
//                 <p style={{ fontSize:'13px', color:'#1e293b', fontWeight:'600', margin:0 }}>{d.value}</p>
//               </div>
//             ))}
//           </div>
//           {submissionDetail.ai_detection_score >= 50 && (
//             <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px', display:'flex', gap:'8px' }}>
//               <span>🚨</span><p style={{ fontSize:'12px', color:'#dc2626', fontWeight:'700', margin:0 }}>{submissionDetail.ai_detection_score}% AI detected. Score automatically set to 0. Your review determines the final outcome.</p>
//             </div>
//           )}
//           {submissionDetail.ai_feedback && (
//             <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'12px', padding:'14px', marginBottom:'14px' }}>
//               <p style={{ ...C.sL, color:'#1d4ed8' }}>🤖 AI Feedback</p>
//               <p style={{ fontSize:'13px', color:'#1e293b', margin:0, lineHeight:'1.8', whiteSpace:'pre-wrap' }}>{submissionDetail.ai_feedback}</p>
//             </div>
//           )}
//           {submissionDetail.teacher_feedback && (
//             <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'14px', marginBottom:'14px' }}>
//               <p style={{ ...C.sL, color:'#15803d' }}>👨‍🏫 Your Feedback</p>
//               <p style={{ fontSize:'13px', color:'#1e293b', margin:0, lineHeight:'1.8' }}>{submissionDetail.teacher_feedback}</p>
//             </div>
//           )}
//           <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'16px' }}>
//             <p style={C.sL}>Essay Text</p>
//             <p style={{ fontSize:'13px', color:'#475569', lineHeight:'1.85', margin:0, whiteSpace:'pre-wrap' }}>{submissionDetail.essay_text}</p>
//           </div>
//         </Sheet>
//       )}

//       {/* ══ GRADE MODAL ══ */}
//       {gradeModal && (
//         <Sheet onClose={() => setGradeModal(null)} title="Review & Grade"
//           subtitle={`${gradeModal.student_name} — ${gradeModal.assignment_title}`}
//           footer={
//             <div style={{ display:'flex', gap:'10px' }}>
//               <button onClick={() => setGradeModal(null)} style={C.gBtn}>Cancel</button>
//               <button onClick={saveGrade} style={C.pBtn(false)}>💾 Save Grade</button>
//             </div>
//           }>
//           {gradeModal.ai_score !== null && (
//             <div style={{ background: gradeModal.ai_detection_score>=50?'#fef2f2':'#eff6ff', border:`1px solid ${gradeModal.ai_detection_score>=50?'#fecaca':'#bfdbfe'}`, borderRadius:'12px', padding:'14px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'12px' }}>
//               <span style={{ fontSize:'24px' }}>{gradeModal.ai_detection_score>=50?'🚨':'🤖'}</span>
//               <div>
//                 <p style={{ fontWeight:'700', color: gradeModal.ai_detection_score>=50?'#dc2626':'#1d4ed8', fontSize:'14px', margin:'0 0 2px' }}>
//                   AI Score: {gradeModal.ai_score}/{gradeModal.max_score}
//                   {gradeModal.ai_detection_score>=50 && ' · AI Flagged'}
//                 </p>
//                 <p style={{ fontSize:'12px', color:'#64748b', margin:0 }}>You can accept or override below. AI detection: {gradeModal.ai_detection_score}%</p>
//               </div>
//             </div>
//           )}
//           <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'14px', marginBottom:'16px', maxHeight:'160px', overflow:'auto' }}>
//             <p style={C.sL}>Student Essay</p>
//             <p style={{ fontSize:'13px', color:'#475569', lineHeight:'1.8', margin:0, whiteSpace:'pre-wrap' }}>{gradeModal.essay_text}</p>
//           </div>
//           {gradeModal.ai_feedback && (
//             <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'10px', padding:'12px', marginBottom:'14px' }}>
//               <p style={{ ...C.sL, color:'#1d4ed8', marginBottom:'4px' }}>🤖 AI Feedback</p>
//               <p style={{ fontSize:'12px', color:'#1e293b', margin:0, lineHeight:'1.7', whiteSpace:'pre-wrap' }}>{gradeModal.ai_feedback}</p>
//             </div>
//           )}
//           <div style={{ marginBottom:'14px' }}>
//             <label style={{ ...C.sL, marginBottom:'6px' }}>Final Score (out of {gradeModal.max_score}) *</label>
//             <input style={{ ...C.input, width:'140px' }} type="number" min="0" max={gradeModal.max_score} value={gradeScore} onChange={e=>setGradeScore(e.target.value)} placeholder="0–100" />
//           </div>
//           <div>
//             <label style={{ ...C.sL, marginBottom:'6px' }}>Your Feedback to Student</label>
//             <textarea value={gradeFeedback} onChange={e=>setGradeFeedback(e.target.value)} rows={4} placeholder="Write personalised feedback for the student..."
//               style={{ ...C.input, resize:'vertical', lineHeight:'1.6' }} />
//           </div>
//         </Sheet>
//       )}

//       {/* ══ EDIT GRADE MODAL ══ */}
//       {editGradeModal && (
//         <Sheet onClose={() => setEditGradeModal(null)} title="Edit Grade"
//           subtitle={`${editGradeModal.student_name} — ${editGradeModal.assignment_title}`}
//           footer={
//             <div style={{ display:'flex', gap:'10px' }}>
//               <button onClick={() => setEditGradeModal(null)} style={C.gBtn}>Cancel</button>
//               <button onClick={saveEditGrade} style={C.pBtn(false)}>💾 Update Grade</button>
//             </div>
//           }>
//           <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'12px', padding:'12px 14px', marginBottom:'16px', display:'flex', gap:'8px', alignItems:'center' }}>
//             <span>✏️</span>
//             <p style={{ fontSize:'13px', color:'#92400e', fontWeight:'600', margin:0 }}>
//               Current grade: <strong>{editGradeModal.final_score}/{editGradeModal.max_score}</strong> ({Math.round((editGradeModal.final_score/editGradeModal.max_score)*100)}%). You are overriding this.
//             </p>
//           </div>
//           <div style={{ marginBottom:'14px' }}>
//             <label style={{ ...C.sL, marginBottom:'6px' }}>New Score (out of {editGradeModal.max_score})</label>
//             <input style={{ ...C.input, width:'140px' }} type="number" min="0" max={editGradeModal.max_score} value={gradeScore} onChange={e=>setGradeScore(e.target.value)} />
//           </div>
//           <div>
//             <label style={{ ...C.sL, marginBottom:'6px' }}>Updated Feedback</label>
//             <textarea value={gradeFeedback} onChange={e=>setGradeFeedback(e.target.value)} rows={4}
//               style={{ ...C.input, resize:'vertical', lineHeight:'1.6' }} />
//           </div>
//         </Sheet>
//       )}

//       {/* ══ CREATE ASSIGNMENT MODAL ══ */}
//       {createModal && (
//         <Sheet onClose={() => { setCreateModal(false); setForm(emptyForm); setFormAttachments([]); }} title="Create New Assignment"
//           footer={
//             <div style={{ display:'flex', gap:'10px' }}>
//               <button onClick={() => { setCreateModal(false); setForm(emptyForm); setFormAttachments([]); }} style={C.gBtn}>Cancel</button>
//               <button onClick={handleCreate} style={C.pBtn(false)}>✅ Publish Assignment</button>
//             </div>
//           }>
//           <AssignmentForm form={form} setForm={setForm} attachments={formAttachments} setAttachments={setFormAttachments} rubricTotal={rubricTotal} attachRef={attachRef} onAttachFile={handleAttachFile} />
//         </Sheet>
//       )}

//       {/* ══ EDIT ASSIGNMENT MODAL ══ */}
//       {editAssignmentModal && (
//         <Sheet onClose={() => { setEditAssignmentModal(null); setFormAttachments([]); }} title="Edit Assignment"
//           footer={
//             <div style={{ display:'flex', gap:'10px' }}>
//               <button onClick={() => { setEditAssignmentModal(null); setFormAttachments([]); }} style={C.gBtn}>Cancel</button>
//               <button onClick={handleEditSave} style={C.pBtn(false)}>💾 Save Changes</button>
//             </div>
//           }>
//           <AssignmentForm form={editAssignmentModal} setForm={setEditAssignmentModal} attachments={formAttachments} setAttachments={setFormAttachments} rubricTotal={Object.values(editAssignmentModal.rubric||{}).reduce((a,b)=>a+b,0)} attachRef={attachRef} onAttachFile={handleAttachFile} />
//         </Sheet>
//       )}
//     </div>
//   );
// }

// // ─── ASSIGNMENT FORM (shared by create & edit) ────────────────────────────
// function AssignmentForm({ form, setForm, attachments, setAttachments, rubricTotal, attachRef, onAttachFile }) {
//   const inp = { width:'100%', padding:'10px 14px', boxSizing:'border-box', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'13px', color:'#1e293b', outline:'none', fontFamily:'inherit', background:'#fff' };

//   const FILE_TYPES = [
//     { label:'📄 PDF / Word', accept:'.pdf,.doc,.docx', color:'#eff6ff', text:'#2563eb' },
//     { label:'🖼️ Image', accept:'image/*', color:'#fdf4ff', text:'#9333ea' },
//     { label:'🎬 Video', accept:'video/*', color:'#fff7ed', text:'#ea580c' },
//     { label:'📎 Any File', accept:'*', color:'#f1f5f9', text:'#475569' },
//   ];
//   const [uploadType, setUploadType] = useState(null);
//   const localRef = useRef();

//   const triggerUpload = (accept) => {
//     setUploadType(accept);
//     setTimeout(() => { if (localRef.current) { localRef.current.accept = accept; localRef.current.click(); } }, 50);
//   };

//   return (
//     <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
//       <input ref={localRef} type="file" multiple style={{ display:'none' }} onChange={onAttachFile} />

//       {[
//         { label:'Title *', key:'title', placeholder:'e.g. Climate Change & Society' },
//         { label:'Description', key:'description', placeholder:'Brief overview shown to students...' },
//       ].map(f => (
//         <div key={f.key}>
//           <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>{f.label}</label>
//           <input style={inp} value={form[f.key]||''} placeholder={f.placeholder} onChange={e=>setForm({...form,[f.key]:e.target.value})} />
//         </div>
//       ))}

//       <div>
//         <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Essay Instructions *</label>
//         <textarea style={{ ...inp, resize:'vertical', lineHeight:'1.6' }} rows={3} placeholder="Detailed instructions for students..." value={form.instructions||''} onChange={e=>setForm({...form,instructions:e.target.value})} />
//       </div>

//       <div>
//         <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Reference Material (for AI grading) *</label>
//         <textarea style={{ ...inp, resize:'vertical', lineHeight:'1.6' }} rows={3} placeholder="Key facts, model answers, or study notes the AI should use when grading..." value={form.referenceMaterial||''} onChange={e=>setForm({...form,referenceMaterial:e.target.value})} />
//         <p style={{ fontSize:'11px', color:'#8b5cf6', marginTop:'4px' }}>🤖 The AI uses this to assess accuracy and relevance of student essays.</p>
//       </div>

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
//         <div>
//           <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Max Score *</label>
//           <input style={inp} type="number" min="1" value={form.max_score||100} onChange={e=>setForm({...form,max_score:parseInt(e.target.value)||100})} />
//         </div>
//         <div>
//           <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Due Date *</label>
//           <input style={inp} type="datetime-local" value={form.due_date||''} onChange={e=>setForm({...form,due_date:e.target.value})} />
//         </div>
//       </div>

//       {/* Rubric */}
//       <div>
//         <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Grading Rubric</label>
//         {Object.entries(form.rubric||{}).map(([k,v]) => (
//           <div key={k} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
//             <span style={{ fontSize:'13px', color:'#475569', textTransform:'capitalize', fontWeight:'600', width:'100px', flexShrink:0 }}>{k}</span>
//             <input type="number" min="0" max="100" value={v} onChange={e=>setForm({...form,rubric:{...form.rubric,[k]:parseInt(e.target.value)||0}})} style={{ ...inp, width:'60px', padding:'6px 10px' }} />
//             <span style={{ fontSize:'12px', color:'#94a3b8' }}>%</span>
//             <div style={{ flex:1, height:'6px', background:'#f1f5f9', borderRadius:'3px', overflow:'hidden' }}>
//               <div style={{ height:'6px', background:'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius:'3px', width:`${v}%` }} />
//             </div>
//           </div>
//         ))}
//         <p style={{ fontSize:'12px', color: rubricTotal!==100?'#ef4444':'#16a34a', fontWeight:'700', margin:'4px 0 0' }}>
//           Total: {rubricTotal}% {rubricTotal!==100&&'⚠️ Must equal 100'}
//         </p>
//       </div>

//       {/* File attachments */}
//       <div>
//         <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Attach Files for Students</label>
//         <p style={{ fontSize:'12px', color:'#94a3b8', margin:'0 0 10px' }}>Attach reading materials, rubric PDFs, reference images, instructional videos — any file type.</p>
//         <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
//           {FILE_TYPES.map(ft => (
//             <button key={ft.label} type="button" onClick={() => triggerUpload(ft.accept)}
//               style={{ padding:'7px 14px', borderRadius:'8px', border:`1px solid ${ft.color==='#f1f5f9'?'#e2e8f0':ft.color}`, background:ft.color, color:ft.text, fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
//               {ft.label}
//             </button>
//           ))}
//         </div>
//         {attachments.length > 0 && (
//           <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
//             {attachments.map((f,i) => (
//               <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'5px 10px' }}>
//                 <span style={{ fontSize:'14px' }}>{f.icon}</span>
//                 <span style={{ fontSize:'11px', color:'#4f46e5', fontWeight:'600', maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</span>
//                 <span style={{ fontSize:'10px', color:'#94a3b8' }}>{(f.size/1024).toFixed(0)}KB</span>
//                 <button onClick={() => setAttachments(prev => prev.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:'13px', padding:'0', lineHeight:1, fontWeight:'700' }}>×</button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




















import { useState, useRef } from 'react';

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: 2, name: 'Alice Mwale',   email: 'alice@example.com' },
  { id: 3, name: 'Brian Phiri',  email: 'brian@example.com' },
  { id: 4, name: 'Chisomo Banda',email: 'chisomo@example.com' },
  { id: 5, name: 'Diana Tembo',  email: 'diana@example.com' },
];

const MOCK_ASSIGNMENTS_INIT = [
  {
    id: 1, title: 'Climate Change & Society',
    description: 'Analyse the socio-economic impacts of climate change on developing nations.',
    instructions: 'Write a well-structured essay (500–800 words) discussing at least three specific socio-economic impacts of climate change on developing nations. Use examples where possible.',
    referenceMaterial: 'Climate change impacts: food insecurity (IPCC, 2022), displacement (IOM, 2021), 5% GDP losses (World Bank, 2023), vector-borne diseases, infrastructure damage.',
    rubric: { content: 35, structure: 25, grammar: 20, evidence: 20 },
    max_score: 100, due_date: '2026-04-15T23:59',
    attachments: [],
  },
  {
    id: 2, title: 'Artificial Intelligence in Education',
    description: 'Discuss the benefits and challenges of integrating AI tools in secondary schools.',
    instructions: 'Write an argumentative essay (400–600 words) presenting both sides of AI integration. Conclude with your recommendation.',
    referenceMaterial: 'AI benefits: personalised learning, automated grading. Challenges: digital divide, data privacy, dishonesty risk. UNESCO ethical AI frameworks (2023).',
    rubric: { argumentation: 40, structure: 25, grammar: 20, evidence: 15 },
    max_score: 100, due_date: '2026-04-20T23:59',
    attachments: [],
  },
  {
    id: 3, title: 'The Role of Entrepreneurs in Africa',
    description: 'Examine how entrepreneurship drives economic development in African economies.',
    instructions: 'Write a 500–700 word essay on entrepreneurship in at least two African countries. Include challenges and solutions.',
    referenceMaterial: 'M-Pesa (Kenya), Twiga Foods, mPharma. Challenges: funding, infrastructure, regulation. Solutions: AFCFTA, angel investors.',
    rubric: { content: 30, structure: 25, grammar: 20, examples: 25 },
    max_score: 100, due_date: '2026-02-01T23:59',
    attachments: [],
  },
];

const ALL_SUBMISSIONS_INIT = [
  { id: 101, student_id: 2, assignment_id: 1, student_name: 'Alice Mwale', assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change is one of the most pressing global challenges... [full essay content would appear here, demonstrating the student\'s analysis of food insecurity, economic losses, and mass displacement across developing nations with references to IPCC, World Bank, and IOM reports]',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-04T10:30:00',
    ai_score: 82, ai_detection_score: 8,
    ai_feedback: 'Content (28/35): Three clear impacts identified with relevant examples. Structure (22/25): Clear paragraphs. Grammar (18/20): Fluent writing. Evidence (14/20): Good citations but needs more statistics.\nAI Detection: Low (~8%). Appears authentically written.',
    final_score: 85, teacher_feedback: 'Excellent work Alice! Strong analysis with good examples. Watch citation formatting.', status: 'graded' },

  { id: 102, student_id: 2, assignment_id: 2, student_name: 'Alice Mwale', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: 'Artificial intelligence is rapidly transforming education... [essay presenting balanced arguments on AI integration in secondary schools, discussing personalised learning benefits vs digital divide and privacy concerns]',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-10T14:00:00',
    ai_score: 76, ai_detection_score: 18,
    ai_feedback: 'Argumentation (30/40): Balanced perspective. Structure (20/25): Good flow. Grammar (16/20): Minor errors. Evidence (10/15): Needs more specific citations.\nAI Detection: Low (~18%). Original work.',
    final_score: null, teacher_feedback: null, status: 'ai_graded' },

  { id: 103, student_id: 3, assignment_id: 1, student_name: 'Brian Phiri', assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change represents a multifaceted global challenge with profound socio-economic implications... [essay using highly formal academic language consistent with AI generation, lacking personal voice and specific local examples]',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-05T11:00:00',
    ai_score: 0, ai_detection_score: 81,
    ai_feedback: '⚠️ HIGH AI CONTENT (81%)\nUniform sentence structure, generic phrasing, no local examples, vocabulary patterns consistent with LLMs. Score: 0/100.',
    final_score: null, teacher_feedback: null, status: 'ai_graded' },

  { id: 104, student_id: 3, assignment_id: 2, student_name: 'Brian Phiri', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: '[Content from uploaded file: AI_Education_Essay_BPhiri.pdf]\n\nBrian argues that AI in education offers transformative potential but must be introduced carefully with teacher training, equitable access policies, and safeguards against academic misuse...',
    file_name: 'AI_Education_Essay_BPhiri.pdf', submit_mode: 'upload', submitted_at: '2026-03-12T09:30:00',
    ai_score: 71, ai_detection_score: 12,
    ai_feedback: 'Argumentation (28/40): Good but needs stronger counterarguments. Structure (22/25): Well organised. Grammar (18/20): Strong. Evidence (3/15): Very few citations provided.\nAI Detection: Low (~12%). Authentic writing.',
    final_score: 68, teacher_feedback: 'Good effort Brian. The PDF upload was received. Main area for improvement: you need much stronger evidence — cite at least 3 sources in your next essay.', status: 'graded' },

  { id: 105, student_id: 4, assignment_id: 1, student_name: 'Chisomo Banda', assignment_title: 'Climate Change & Society', max_score: 100,
    essay_text: 'Climate change poses existential risks to developing nations... [submitted essay currently being processed by AI grader]',
    file_name: null, submit_mode: 'write', submitted_at: '2026-03-15T16:45:00',
    ai_score: null, ai_detection_score: null, ai_feedback: null,
    final_score: null, teacher_feedback: null, status: 'pending' },

  { id: 106, student_id: 5, assignment_id: 2, student_name: 'Diana Tembo', assignment_title: 'Artificial Intelligence in Education', max_score: 100,
    essay_text: '[Content from uploaded file: diana_essay.docx]\n\nDiana provides a nuanced perspective drawing on her own school\'s experience with tablet-based learning, discussing both the opportunities and the challenges she personally observed...',
    file_name: 'diana_essay.docx', submit_mode: 'upload', submitted_at: '2026-03-11T10:15:00',
    ai_score: 88, ai_detection_score: 5,
    ai_feedback: 'Argumentation (38/40): Exceptional personal perspective. Structure (24/25): Near perfect. Grammar (19/20): Excellent. Evidence (7/15): Good personal evidence, needs academic sources.\nAI Detection: Very low (~5%). Highly original.',
    final_score: 91, teacher_feedback: 'Outstanding Diana! Your personal anecdotes made this essay stand out. The only gap is academic citations — a few scholarly references would make this publication-worthy.', status: 'graded' },

  { id: 107, student_id: 3, assignment_id: 3, student_name: 'Brian Phiri', assignment_title: 'The Role of Entrepreneurs in Africa', max_score: 100,
    essay_text: 'Entrepreneurship in Africa is often discussed in the context of M-Pesa in Kenya and various agricultural tech startups... [Brian\'s essay examining entrepreneurship across Kenya and Nigeria with analysis of funding challenges]',
    file_name: null, submit_mode: 'write', submitted_at: '2026-01-28T20:00:00',
    ai_score: 63, ai_detection_score: 31,
    ai_feedback: 'Content (20/30): Good examples but shallow analysis. Structure (18/25): Needs better transitions. Grammar (16/20): Several errors. Examples (9/25): More country-specific detail needed.\nAI Detection: Borderline (~31%). Some sections may have AI assistance.',
    final_score: null, teacher_feedback: null, status: 'ai_graded' },
];

// ─── STYLES ────────────────────────────────────────────────────────────────
const C = {
  page: { minHeight:'100vh', background:'#f8fafc', fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif" },
  header: { background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 20px', height:'62px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 8px rgba(0,0,0,0.05)' },
  main: { maxWidth:'900px', margin:'0 auto', padding:'24px 16px 60px' },
  card: { background:'#fff', borderRadius:'16px', border:'1px solid #e2e8f0', padding:'20px', marginBottom:'12px', boxShadow:'0 1px 4px rgba(0,0,0,0.03)' },
  sL: { display:'block', fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' },
  tab: a => ({ padding:'8px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'700', background: a?'#fff':'transparent', color: a?'#6366f1':'#64748b', boxShadow: a?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all 0.2s', whiteSpace:'nowrap' }),
  badge: c => ({ display:'inline-flex', alignItems:'center', gap:'4px', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background: c==='green'?'#f0fdf4':c==='red'?'#fef2f2':c==='amber'?'#fffbeb':c==='purple'?'#fdf4ff':c==='blue'?'#eff6ff':'#f1f5f9', color: c==='green'?'#16a34a':c==='red'?'#dc2626':c==='amber'?'#d97706':c==='purple'?'#9333ea':c==='blue'?'#2563eb':'#64748b' }),
  pBtn: dis => ({ padding:'11px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor: dis?'not-allowed':'pointer', border:'none', background: dis?'#c7d2fe':'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', boxShadow: dis?'none':'0 2px 10px rgba(99,102,241,0.35)', opacity: dis?0.7:1 }),
  gBtn: { padding:'11px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', border:'none', background:'#f1f5f9', color:'#475569' },
  dBtn: { padding:'11px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', background:'#fef2f2', border:'1.5px solid #fecaca', color:'#dc2626' },
  input: { width:'100%', padding:'10px 14px', boxSizing:'border-box', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'13px', color:'#1e293b', outline:'none', fontFamily:'inherit', background:'#fff' },
};

function Sheet({ onClose, title, subtitle, children, footer, wide }) {
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200, backdropFilter:'blur(3px)' }}>
      <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', width:'100%', maxWidth: wide?'900px':'700px', maxHeight:'96vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 -8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}><div style={{ width:'40px', height:'4px', background:'#e2e8f0', borderRadius:'2px' }} /></div>
        <div style={{ padding:'8px 20px 14px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
          <div style={{ flex:1 }}>
            <h2 style={{ fontWeight:'800', fontSize:'17px', color:'#1e293b', margin:'0 0 2px', lineHeight:1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize:'12px', color:'#94a3b8', margin:0 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'32px', height:'32px', fontSize:'18px', cursor:'pointer', color:'#64748b', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>{children}</div>
        {footer && <div style={{ padding:'14px 20px 20px', borderTop:'1px solid #f1f5f9' }}>{footer}</div>}
      </div>
    </div>
  );
}

export default function TeacherDashboard({ onBack }) {
  const user = { id: 1, name: 'Dr. Sarah Banda' };
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS_INIT);
  const [submissions, setSubmissions] = useState(ALL_SUBMISSIONS_INIT);
  const [tab, setTab] = useState('pending');
  const [toast, setToast] = useState(null);

  // Modals
  const [gradeModal, setGradeModal]           = useState(null);
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [createModal, setCreateModal]         = useState(false);
  const [editAssignmentModal, setEditAssignmentModal] = useState(null);
  const [studentTableModal, setStudentTableModal] = useState(null);
  const [editGradeModal, setEditGradeModal]   = useState(null);

  // Grade form
  const [gradeScore, setGradeScore]       = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Create/edit assignment form
  const emptyForm = { title:'', description:'', instructions:'', referenceMaterial:'', max_score:100, due_date:'', rubric:{ content:35, structure:25, grammar:20, evidence:20 }, attachments:[] };
  const [form, setForm] = useState(emptyForm);
  const [formAttachments, setFormAttachments] = useState([]);
  const attachRef = useRef();

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const pending = submissions.filter(s => s.status === 'ai_graded' && s.final_score === null);
  const rubricTotal = Object.values(form.rubric).reduce((a,b)=>a+b,0);

  const saveGrade = () => {
    const score = parseInt(gradeScore);
    if (isNaN(score) || score < 0 || score > gradeModal.max_score) { showToast('Invalid score.','error'); return; }
    setSubmissions(prev => prev.map(s => s.id===gradeModal.id ? { ...s, final_score:score, teacher_feedback:gradeFeedback, status:'graded' } : s));
    setGradeModal(null); showToast('✅ Grade saved and visible to student.');
  };

  const saveEditGrade = () => {
    const score = parseInt(gradeScore);
    if (isNaN(score) || score < 0 || score > editGradeModal.max_score) { showToast('Invalid score.','error'); return; }
    setSubmissions(prev => prev.map(s => s.id===editGradeModal.id ? { ...s, final_score:score, teacher_feedback:gradeFeedback, status:'graded' } : s));
    setEditGradeModal(null);
    showToast('✅ Grade updated.');
  };

  const openGrade = sub => { setGradeModal(sub); setGradeScore(sub.ai_score ?? ''); setGradeFeedback(sub.teacher_feedback || ''); };
  const openEditGrade = sub => { setEditGradeModal(sub); setGradeScore(sub.final_score ?? sub.ai_score ?? ''); setGradeFeedback(sub.teacher_feedback || ''); };

  const handleCreate = () => {
    if (!form.title || !form.instructions || !form.due_date) { showToast('Please fill required fields.','error'); return; }
    if (rubricTotal !== 100) { showToast('Rubric weights must total 100%.','error'); return; }
    const newA = { ...form, id: Date.now(), attachments: formAttachments };
    setAssignments(prev => [...prev, newA]);
    setCreateModal(false); setForm(emptyForm); setFormAttachments([]);
    showToast('✅ Assignment created and published to students.');
  };

  const handleEditSave = () => {
    setAssignments(prev => prev.map(a => a.id===editAssignmentModal.id ? { ...editAssignmentModal, attachments: formAttachments } : a));
    setEditAssignmentModal(null); setFormAttachments([]);
    showToast('✅ Assignment updated.');
  };

  const handleAttachFile = e => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(f => ({
      name: f.name, size: f.size, type: f.type,
      url: URL.createObjectURL(f),
      icon: f.type.startsWith('image/') ? '🖼️' : f.type.startsWith('video/') ? '🎬' : f.type === 'application/pdf' ? '📄' : f.type.includes('word') ? '📝' : '📎',
    }));
    setFormAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';

  const studentSubmissions = (studentId) => submissions.filter(s => s.student_id === studentId);

  const allGraded = submissions.filter(s => s.final_score !== null);
  const avgClass = allGraded.length ? Math.round(allGraded.reduce((sum,s)=>sum+(s.final_score/s.max_score)*100,0)/allGraded.length) : null;

  return (
    <div style={C.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input[type=file]{display:none}`}</style>

      {toast && (
        <div style={{ position:'fixed', top:'16px', left:'50%', transform:'translateX(-50%)', zIndex:999, background: toast.type==='error'?'#fef2f2':'#f0fdf4', border:`1px solid ${toast.type==='error'?'#fecaca':'#bbf7d0'}`, color: toast.type==='error'?'#dc2626':'#15803d', padding:'10px 20px', borderRadius:'12px', fontSize:'13px', fontWeight:'700', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', maxWidth:'90vw', textAlign:'center' }}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <header style={C.header}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'11px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'19px', boxShadow:'0 2px 8px rgba(99,102,241,0.3)' }}>✍️</div>
          <div>
            <p style={{ fontWeight:'800', fontSize:'15px', color:'#1e293b', margin:0 }}>EssayGrade AI</p>
            <p style={{ fontSize:'11px', color:'#94a3b8', margin:0 }}>Teacher Portal</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'7px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'20px', padding:'4px 12px 4px 4px' }}>
            <div style={{ width:'26px', height:'26px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px' }}>👨‍🏫</div>
            <span style={{ fontSize:'13px', color:'#374151', fontWeight:'600' }}>{user.name}</span>
          </div>
          <button onClick={onBack} style={{ background:'none', border:'1.5px solid #e2e8f0', borderRadius:'8px', color:'#64748b', fontWeight:'600', fontSize:'12px', padding:'6px 12px', cursor:'pointer' }}>← Home</button>
        </div>
      </header>

      <div style={C.main}>
        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px', marginBottom:'24px' }}>
          {[
            { label:'Total Assignments', value:assignments.length, icon:'📋', bg:'#eff6ff', fg:'#3b82f6' },
            { label:'Pending Review', value:pending.length, icon:'⏳', bg:'#fffbeb', fg:'#d97706' },
            { label:'Total Submissions', value:submissions.length, icon:'📝', bg:'#fdf4ff', fg:'#9333ea' },
            { label:'Class Avg Score', value: avgClass!==null?`${avgClass}%`:'—', icon:'📊', bg:'#f0fdf4', fg:'#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:'16px', padding:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:'10px', boxShadow:'0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:s.bg, color:s.fg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize:'20px', fontWeight:'900', color:'#1e293b', margin:0, lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:'11px', color:'#94a3b8', margin:'2px 0 0', fontWeight:'500' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TABS — 3 tabs only */}
        <div style={{ display:'flex', background:'#f1f5f9', borderRadius:'10px', padding:'4px', marginBottom:'20px', gap:'2px', overflowX:'auto' }}>
          {[
            ['pending', `⏳ Pending${pending.length > 0 ? ` (${pending.length})` : ''}`],
            ['assignments', '📋 Assignments'],
            ['students', '👥 Students'],
          ].map(([id, label]) => (
            <button key={id} style={C.tab(tab===id)} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </div>

        {/* ══ PENDING TAB ══ */}
        {tab==='pending' && (
          <div>
            <p style={{ fontSize:'18px', fontWeight:'800', color:'#1e293b', margin:'0 0 16px' }}>Pending Review</p>
            {pending.length === 0 ? (
              <div style={{ ...C.card, textAlign:'center', padding:'56px 24px' }}>
                <p style={{ fontSize:'40px', margin:'0 0 10px' }}>✅</p>
                <p style={{ fontWeight:'700', color:'#64748b', fontSize:'15px', margin:'0 0 4px' }}>All caught up!</p>
                <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No essays pending your review.</p>
              </div>
            ) : pending.map(sub => (
              <div key={sub.id} style={{ ...C.card, borderLeft:`4px solid ${sub.ai_detection_score>=50?'#ef4444':'#f59e0b'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                  <div style={{ display:'flex', gap:'12px', flex:1 }}>
                    <div style={{ width:'42px', height:'42px', background: sub.ai_detection_score>=50?'#fee2e2':'#fef3c7', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'16px', color: sub.ai_detection_score>=50?'#dc2626':'#d97706', flexShrink:0 }}>{sub.student_name.charAt(0)}</div>
                    <div>
                      <p style={{ fontWeight:'800', fontSize:'15px', color:'#1e293b', margin:'0 0 2px' }}>{sub.student_name}</p>
                      <p style={{ fontSize:'13px', color:'#64748b', margin:'0 0 4px' }}>{sub.assignment_title}</p>
                      <p style={{ fontSize:'12px', color:'#94a3b8', margin:0 }}>Submitted {new Date(sub.submitted_at).toLocaleString()}{sub.file_name ? ` · 📎 ${sub.file_name}` : ''}</p>
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    {sub.ai_detection_score >= 50 ? (
                      <div style={{ marginBottom:'8px' }}><p style={{ fontSize:'11px', color:'#94a3b8', margin:0 }}>AI Score</p><p style={{ fontSize:'18px', fontWeight:'800', color:'#dc2626', margin:0 }}>0/{sub.max_score}</p></div>
                    ) : sub.ai_score !== null ? (
                      <div style={{ marginBottom:'8px' }}><p style={{ fontSize:'11px', color:'#94a3b8', margin:0 }}>AI Score</p><p style={{ fontSize:'18px', fontWeight:'800', color:'#6366f1', margin:0 }}>{sub.ai_score}/{sub.max_score}</p></div>
                    ) : null}
                  </div>
                </div>
                {sub.ai_detection_score >= 50 && (
                  <div style={{ marginTop:'10px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'8px', padding:'8px 12px', display:'flex', gap:'6px', alignItems:'center' }}>
                    <span>🚨</span><p style={{ fontSize:'12px', color:'#dc2626', fontWeight:'700', margin:0 }}>HIGH AI CONTENT — {sub.ai_detection_score}% detected. Score auto-set to 0. Review required.</p>
                  </div>
                )}
                <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
                  <button onClick={() => setSubmissionDetail(sub)} style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>👁 View Essay</button>
                  <button onClick={() => openGrade(sub)} style={{ ...C.pBtn(false), padding:'7px 16px', fontSize:'12px' }}>Review & Grade →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ ASSIGNMENTS TAB ══ */}
        {tab==='assignments' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <p style={{ fontSize:'18px', fontWeight:'800', color:'#1e293b', margin:0 }}>Assignments</p>
              <button onClick={() => { setForm(emptyForm); setFormAttachments([]); setCreateModal(true); }} style={C.pBtn(false)}>+ New Assignment</button>
            </div>
            {assignments.map(a => {
              const subCount = submissions.filter(s=>s.assignment_id===a.id).length;
              const gradedCount = submissions.filter(s=>s.assignment_id===a.id && s.final_score!==null).length;
              const isPast = new Date() > new Date(a.due_date);
              return (
                <div key={a.id} style={{ ...C.card, borderLeft:`4px solid ${isPast?'#94a3b8':'#6366f1'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', marginBottom:'4px' }}>
                        <span style={{ fontWeight:'800', fontSize:'15px', color:'#1e293b' }}>{a.title}</span>
                        <span style={C.badge('blue')}>{a.max_score} pts</span>
                        {isPast && <span style={C.badge('gray')}>Closed</span>}
                        {!isPast && <span style={C.badge('green')}>Active</span>}
                        {a.attachments?.length > 0 && <span style={C.badge('purple')}>📎 {a.attachments.length} file{a.attachments.length>1?'s':''}</span>}
                      </div>
                      <p style={{ fontSize:'13px', color:'#64748b', margin:'0 0 6px', lineHeight:1.5 }}>{a.description}</p>
                      <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'12px', color:'#94a3b8' }}>📅 Due {new Date(a.due_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                        <span style={{ fontSize:'12px', color:'#94a3b8' }}>📝 {subCount} submitted · ✅ {gradedCount} graded</span>
                      </div>
                    </div>
                    <button onClick={() => { setEditAssignmentModal({...a, rubric:{...a.rubric}}); setFormAttachments(a.attachments || []); }}
                      style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:'12px', fontWeight:'600', cursor:'pointer', flexShrink:0 }}>✏️ Edit</button>
                  </div>
                  {a.attachments?.length > 0 && (
                    <div style={{ marginTop:'10px', display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      {a.attachments.map((f,i) => (
                        <a key={i} href={f.url} target="_blank" rel="noreferrer"
                          style={{ display:'flex', alignItems:'center', gap:'5px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'4px 10px', textDecoration:'none' }}>
                          <span style={{ fontSize:'14px' }}>{f.icon}</span>
                          <span style={{ fontSize:'11px', color:'#4f46e5', fontWeight:'600' }}>{f.name.length>20?f.name.slice(0,20)+'...':f.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ STUDENTS TAB ══ */}
        {tab==='students' && (
          <div>
            <p style={{ fontSize:'18px', fontWeight:'800', color:'#1e293b', margin:'0 0 16px' }}>Students Overview</p>
            <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.03)', marginBottom:'16px' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                  <thead>
                    <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                      {['Student','Submitted','Graded','AI Flagged','Avg Score','Actions'].map(h => (
                        <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_STUDENTS.map(student => {
                      const subs = studentSubmissions(student.id);
                      const gradedSubs = subs.filter(s => s.final_score !== null);
                      const flagged = subs.filter(s => s.ai_detection_score >= 50).length;
                      const avg = gradedSubs.length ? Math.round(gradedSubs.reduce((sum,s)=>sum+(s.final_score/s.max_score)*100,0)/gradedSubs.length) : null;
                      return (
                        <tr key={student.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.1s' }}
                          onMouseEnter={e=>e.currentTarget.style.background='#fafafe'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{ padding:'8px 10px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                              <div style={{ width:'28px', height:'28px', background:'linear-gradient(135deg,#8b5cf6,#a78bfa)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'12px', fontWeight:'700', flexShrink:0 }}>{student.name.charAt(0)}</div>
                              <div>
                                <p style={{ fontWeight:'700', color:'#1e293b', margin:0, fontSize:'12px' }}>{student.name}</p>
                                <p style={{ fontSize:'10px', color:'#94a3b8', margin:0 }}>{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'8px 10px' }}><span style={{ fontWeight:'700', color:'#6366f1' }}>{subs.length}</span></td>
                          <td style={{ padding:'8px 10px' }}><span style={{ fontWeight:'700', color:'#16a34a' }}>{gradedSubs.length}</span></td>
                          <td style={{ padding:'8px 10px' }}>
                            {flagged > 0
                              ? <span style={{ ...C.badge('red') }}>🚨 {flagged}</span>
                              : <span style={{ fontSize:'12px', color:'#16a34a' }}>✅ None</span>}
                          </td>
                          <td style={{ padding:'8px 10px' }}>
                            {avg !== null
                              ? <span style={{ fontWeight:'800', color: scoreColor(avg), fontSize:'13px' }}>{avg}%</span>
                              : <span style={{ color:'#94a3b8' }}>—</span>}
                          </td>
                          <td style={{ padding:'8px 10px' }}>
                            <button onClick={() => setStudentTableModal(student)}
                              style={{ padding:'5px 10px', borderRadius:'7px', border:'1px solid #c7d2fe', background:'#eff6ff', color:'#4f46e5', fontSize:'11px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap' }}>
                              View All →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ STUDENT TABLE MODAL ══ */}
      {studentTableModal && (() => {
        const subs = studentSubmissions(studentTableModal.id);
        return (
          <Sheet onClose={() => setStudentTableModal(null)} title={`${studentTableModal.name}'s Submissions`}
            subtitle={`${subs.length} submission${subs.length!==1?'s':''} · ${studentTableModal.email}`} wide>
            {subs.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px', color:'#94a3b8' }}>
                <p style={{ fontSize:'36px', margin:'0 0 10px' }}>📭</p>
                <p>No submissions yet from this student.</p>
              </div>
            ) : (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'20px' }}>
                  {[
                    { label:'Submitted', value:subs.length, icon:'📝' },
                    { label:'Graded', value:subs.filter(s=>s.final_score!==null).length, icon:'✅' },
                    { label:'Avg Score', value: subs.filter(s=>s.final_score!==null).length ? `${Math.round(subs.filter(s=>s.final_score!==null).reduce((sum,s)=>sum+(s.final_score/s.max_score)*100,0)/subs.filter(s=>s.final_score!==null).length)}%` : '—', icon:'⭐' },
                  ].map(s => (
                    <div key={s.label} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'12px 14px', textAlign:'center' }}>
                      <p style={{ fontSize:'20px', fontWeight:'900', color:'#1e293b', margin:'0 0 2px' }}>{s.value}</p>
                      <p style={{ fontSize:'11px', color:'#94a3b8', margin:0, fontWeight:'500' }}>{s.icon} {s.label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
                  <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                  <table style={{ width:'100%', minWidth:'580px', borderCollapse:'collapse', fontSize:'12px' }}>
                    <thead>
                      <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                        {['Assignment','Submitted','AI Score','Final Score','AI%','Status','Actions'].map(h=>(
                          <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:'10px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {subs.map(sub => (
                        <tr key={sub.id} style={{ borderBottom:'1px solid #f1f5f9' }}
                          onMouseEnter={e=>e.currentTarget.style.background='#fafafe'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{ padding:'8px 10px' }}>
                            <p style={{ fontWeight:'600', color:'#1e293b', margin:0, fontSize:'12px', whiteSpace:'nowrap' }}>{sub.assignment_title}</p>
                            {sub.file_name && <p style={{ fontSize:'10px', color:'#8b5cf6', margin:'1px 0 0' }}>📎 {sub.file_name}</p>}
                          </td>
                          <td style={{ padding:'8px 10px', color:'#64748b', fontSize:'11px', whiteSpace:'nowrap' }}>{new Date(sub.submitted_at).toLocaleDateString()}</td>
                          <td style={{ padding:'8px 10px' }}>
                            {sub.ai_score!==null ? <span style={{ fontWeight:'700', color:'#6366f1', fontSize:'12px' }}>{sub.ai_score}/{sub.max_score}</span> : <span style={{ color:'#94a3b8' }}>—</span>}
                          </td>
                          <td style={{ padding:'8px 10px' }}>
                            {sub.final_score!==null
                              ? <span style={{ fontWeight:'800', color:scoreColor(Math.round((sub.final_score/sub.max_score)*100)), fontSize:'12px' }}>{sub.final_score}/{sub.max_score}</span>
                              : <span style={{ color:'#94a3b8', fontSize:'11px' }}>Pending</span>}
                          </td>
                          <td style={{ padding:'8px 10px' }}>
                            {sub.ai_detection_score!==null
                              ? <span style={{ fontWeight:'700', color:sub.ai_detection_score>=50?'#dc2626':'#16a34a', fontSize:'11px' }}>{sub.ai_detection_score}%{sub.ai_detection_score>=50?' 🚨':''}</span>
                              : <span style={{ color:'#94a3b8' }}>—</span>}
                          </td>
                          <td style={{ padding:'8px 10px' }}>
                            {sub.status==='graded' && <span style={C.badge('green')}>✅ Graded</span>}
                            {sub.status==='ai_graded' && <span style={C.badge('amber')}>⏳ Pending</span>}
                            {sub.status==='pending' && <span style={C.badge('gray')}>🤖 Grading</span>}
                          </td>
                          <td style={{ padding:'8px 10px' }}>
                            <div style={{ display:'flex', gap:'4px', flexWrap:'nowrap' }}>
                              <button onClick={()=>setSubmissionDetail(sub)} style={{ padding:'4px 8px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:'10px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>View</button>
                              {sub.status==='ai_graded' && <button onClick={()=>openGrade(sub)} style={{ padding:'4px 8px', borderRadius:'6px', border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:'10px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap' }}>Grade</button>}
                              {sub.status==='graded' && <button onClick={()=>openEditGrade(sub)} style={{ padding:'4px 8px', borderRadius:'6px', border:'1px solid #c7d2fe', background:'#eff6ff', color:'#4f46e5', fontSize:'10px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap' }}>✏️ Edit</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            )}
          </Sheet>
        );
      })()}

      {/* ══ SUBMISSION DETAIL MODAL ══ */}
      {submissionDetail && (
        <Sheet onClose={() => setSubmissionDetail(null)} title={submissionDetail.student_name}
          subtitle={submissionDetail.assignment_title}
          footer={
            <div style={{ display:'flex', gap:'10px' }}>
              {submissionDetail.status==='ai_graded' && <button onClick={()=>{setSubmissionDetail(null);openGrade(submissionDetail);}} style={C.pBtn(false)}>Grade This Essay →</button>}
              {submissionDetail.status==='graded' && <button onClick={()=>{setSubmissionDetail(null);openEditGrade(submissionDetail);}} style={{ padding:'12px 20px', borderRadius:'10px', border:'1px solid #c7d2fe', background:'#eff6ff', color:'#4f46e5', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>✏️ Edit Grade</button>}
              <button onClick={()=>setSubmissionDetail(null)} style={C.gBtn}>Close</button>
            </div>
          }>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
            {[
              { label:'Submitted', value: new Date(submissionDetail.submitted_at).toLocaleString() },
              { label:'Submit Mode', value: submissionDetail.file_name ? `📎 ${submissionDetail.file_name}` : '✏️ Written' },
              { label:'AI Score', value: submissionDetail.ai_score!==null ? `${submissionDetail.ai_score}/${submissionDetail.max_score}` : '—' },
              { label:'AI Detection', value: submissionDetail.ai_detection_score!==null ? `${submissionDetail.ai_detection_score}%${submissionDetail.ai_detection_score>=50?' 🚨':''}` : '—' },
            ].map(d => (
              <div key={d.label} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'10px 12px' }}>
                <p style={{ fontSize:'11px', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', margin:'0 0 3px' }}>{d.label}</p>
                <p style={{ fontSize:'13px', color:'#1e293b', fontWeight:'600', margin:0 }}>{d.value}</p>
              </div>
            ))}
          </div>
          {submissionDetail.ai_detection_score >= 50 && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px', display:'flex', gap:'8px' }}>
              <span>🚨</span><p style={{ fontSize:'12px', color:'#dc2626', fontWeight:'700', margin:0 }}>{submissionDetail.ai_detection_score}% AI detected. Score automatically set to 0. Your review determines the final outcome.</p>
            </div>
          )}
          {submissionDetail.ai_feedback && (
            <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'12px', padding:'14px', marginBottom:'14px' }}>
              <p style={{ ...C.sL, color:'#1d4ed8' }}>🤖 AI Feedback</p>
              <p style={{ fontSize:'13px', color:'#1e293b', margin:0, lineHeight:'1.8', whiteSpace:'pre-wrap' }}>{submissionDetail.ai_feedback}</p>
            </div>
          )}
          {submissionDetail.teacher_feedback && (
            <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'14px', marginBottom:'14px' }}>
              <p style={{ ...C.sL, color:'#15803d' }}>👨‍🏫 Your Feedback</p>
              <p style={{ fontSize:'13px', color:'#1e293b', margin:0, lineHeight:'1.8' }}>{submissionDetail.teacher_feedback}</p>
            </div>
          )}
          <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'16px' }}>
            <p style={C.sL}>Essay Text</p>
            <p style={{ fontSize:'13px', color:'#475569', lineHeight:'1.85', margin:0, whiteSpace:'pre-wrap' }}>{submissionDetail.essay_text}</p>
          </div>
        </Sheet>
      )}

      {/* ══ GRADE MODAL ══ */}
      {gradeModal && (
        <Sheet onClose={() => setGradeModal(null)} title="Review & Grade"
          subtitle={`${gradeModal.student_name} — ${gradeModal.assignment_title}`}
          footer={
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setGradeModal(null)} style={C.gBtn}>Cancel</button>
              <button onClick={saveGrade} style={C.pBtn(false)}>💾 Save Grade</button>
            </div>
          }>
          {gradeModal.ai_score !== null && (
            <div style={{ background: gradeModal.ai_detection_score>=50?'#fef2f2':'#eff6ff', border:`1px solid ${gradeModal.ai_detection_score>=50?'#fecaca':'#bfdbfe'}`, borderRadius:'12px', padding:'14px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ fontSize:'24px' }}>{gradeModal.ai_detection_score>=50?'🚨':'🤖'}</span>
              <div>
                <p style={{ fontWeight:'700', color: gradeModal.ai_detection_score>=50?'#dc2626':'#1d4ed8', fontSize:'14px', margin:'0 0 2px' }}>
                  AI Score: {gradeModal.ai_score}/{gradeModal.max_score}
                  {gradeModal.ai_detection_score>=50 && ' · AI Flagged'}
                </p>
                <p style={{ fontSize:'12px', color:'#64748b', margin:0 }}>You can accept or override below. AI detection: {gradeModal.ai_detection_score}%</p>
              </div>
            </div>
          )}
          <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'14px', marginBottom:'16px', maxHeight:'160px', overflow:'auto' }}>
            <p style={C.sL}>Student Essay</p>
            <p style={{ fontSize:'13px', color:'#475569', lineHeight:'1.8', margin:0, whiteSpace:'pre-wrap' }}>{gradeModal.essay_text}</p>
          </div>
          {gradeModal.ai_feedback && (
            <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'10px', padding:'12px', marginBottom:'14px' }}>
              <p style={{ ...C.sL, color:'#1d4ed8', marginBottom:'4px' }}>🤖 AI Feedback</p>
              <p style={{ fontSize:'12px', color:'#1e293b', margin:0, lineHeight:'1.7', whiteSpace:'pre-wrap' }}>{gradeModal.ai_feedback}</p>
            </div>
          )}
          <div style={{ marginBottom:'14px' }}>
            <label style={{ ...C.sL, marginBottom:'6px' }}>Final Score (out of {gradeModal.max_score}) *</label>
            <input style={{ ...C.input, width:'140px' }} type="number" min="0" max={gradeModal.max_score} value={gradeScore} onChange={e=>setGradeScore(e.target.value)} placeholder="0–100" />
          </div>
          <div>
            <label style={{ ...C.sL, marginBottom:'6px' }}>Your Feedback to Student</label>
            <textarea value={gradeFeedback} onChange={e=>setGradeFeedback(e.target.value)} rows={4} placeholder="Write personalised feedback for the student..."
              style={{ ...C.input, resize:'vertical', lineHeight:'1.6' }} />
          </div>
        </Sheet>
      )}

      {/* ══ EDIT GRADE MODAL ══ */}
      {editGradeModal && (
        <Sheet onClose={() => setEditGradeModal(null)} title="Edit Grade"
          subtitle={`${editGradeModal.student_name} — ${editGradeModal.assignment_title}`}
          footer={
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setEditGradeModal(null)} style={C.gBtn}>Cancel</button>
              <button onClick={saveEditGrade} style={C.pBtn(false)}>💾 Update Grade</button>
            </div>
          }>
          <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'12px', padding:'12px 14px', marginBottom:'16px', display:'flex', gap:'8px', alignItems:'center' }}>
            <span>✏️</span>
            <p style={{ fontSize:'13px', color:'#92400e', fontWeight:'600', margin:0 }}>
              Current grade: <strong>{editGradeModal.final_score}/{editGradeModal.max_score}</strong> ({Math.round((editGradeModal.final_score/editGradeModal.max_score)*100)}%). You are overriding this.
            </p>
          </div>
          <div style={{ marginBottom:'14px' }}>
            <label style={{ ...C.sL, marginBottom:'6px' }}>New Score (out of {editGradeModal.max_score})</label>
            <input style={{ ...C.input, width:'140px' }} type="number" min="0" max={editGradeModal.max_score} value={gradeScore} onChange={e=>setGradeScore(e.target.value)} />
          </div>
          <div>
            <label style={{ ...C.sL, marginBottom:'6px' }}>Updated Feedback</label>
            <textarea value={gradeFeedback} onChange={e=>setGradeFeedback(e.target.value)} rows={4}
              style={{ ...C.input, resize:'vertical', lineHeight:'1.6' }} />
          </div>
        </Sheet>
      )}

      {/* ══ CREATE ASSIGNMENT MODAL ══ */}
      {createModal && (
        <Sheet onClose={() => { setCreateModal(false); setForm(emptyForm); setFormAttachments([]); }} title="Create New Assignment"
          footer={
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => { setCreateModal(false); setForm(emptyForm); setFormAttachments([]); }} style={C.gBtn}>Cancel</button>
              <button onClick={handleCreate} style={C.pBtn(false)}>✅ Publish Assignment</button>
            </div>
          }>
          <AssignmentForm form={form} setForm={setForm} attachments={formAttachments} setAttachments={setFormAttachments} rubricTotal={rubricTotal} attachRef={attachRef} onAttachFile={handleAttachFile} />
        </Sheet>
      )}

      {/* ══ EDIT ASSIGNMENT MODAL ══ */}
      {editAssignmentModal && (
        <Sheet onClose={() => { setEditAssignmentModal(null); setFormAttachments([]); }} title="Edit Assignment"
          footer={
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => { setEditAssignmentModal(null); setFormAttachments([]); }} style={C.gBtn}>Cancel</button>
              <button onClick={handleEditSave} style={C.pBtn(false)}>💾 Save Changes</button>
            </div>
          }>
          <AssignmentForm form={editAssignmentModal} setForm={setEditAssignmentModal} attachments={formAttachments} setAttachments={setFormAttachments} rubricTotal={Object.values(editAssignmentModal.rubric||{}).reduce((a,b)=>a+b,0)} attachRef={attachRef} onAttachFile={handleAttachFile} />
        </Sheet>
      )}
    </div>
  );
}

// ─── ASSIGNMENT FORM (shared by create & edit) ────────────────────────────
function AssignmentForm({ form, setForm, attachments, setAttachments, rubricTotal, attachRef, onAttachFile }) {
  const inp = { width:'100%', padding:'10px 14px', boxSizing:'border-box', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'13px', color:'#1e293b', outline:'none', fontFamily:'inherit', background:'#fff' };

  const FILE_TYPES = [
    { label:'📄 PDF / Word', accept:'.pdf,.doc,.docx', color:'#eff6ff', text:'#2563eb' },
    { label:'🖼️ Image', accept:'image/*', color:'#fdf4ff', text:'#9333ea' },
    { label:'🎬 Video', accept:'video/*', color:'#fff7ed', text:'#ea580c' },
    { label:'📎 Any File', accept:'*', color:'#f1f5f9', text:'#475569' },
  ];
  const [uploadType, setUploadType] = useState(null);
  const localRef = useRef();

  const triggerUpload = (accept) => {
    setUploadType(accept);
    setTimeout(() => { if (localRef.current) { localRef.current.accept = accept; localRef.current.click(); } }, 50);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
      <input ref={localRef} type="file" multiple style={{ display:'none' }} onChange={onAttachFile} />

      {[
        { label:'Title *', key:'title', placeholder:'e.g. Climate Change & Society' },
        { label:'Description', key:'description', placeholder:'Brief overview shown to students...' },
      ].map(f => (
        <div key={f.key}>
          <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>{f.label}</label>
          <input style={inp} value={form[f.key]||''} placeholder={f.placeholder} onChange={e=>setForm({...form,[f.key]:e.target.value})} />
        </div>
      ))}

      <div>
        <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Essay Instructions *</label>
        <textarea style={{ ...inp, resize:'vertical', lineHeight:'1.6' }} rows={3} placeholder="Detailed instructions for students..." value={form.instructions||''} onChange={e=>setForm({...form,instructions:e.target.value})} />
      </div>

      <div>
        <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Reference Material (for AI grading) *</label>
        <textarea style={{ ...inp, resize:'vertical', lineHeight:'1.6' }} rows={3} placeholder="Key facts, model answers, or study notes the AI should use when grading..." value={form.referenceMaterial||''} onChange={e=>setForm({...form,referenceMaterial:e.target.value})} />
        <p style={{ fontSize:'11px', color:'#8b5cf6', marginTop:'4px' }}>🤖 The AI uses this to assess accuracy and relevance of student essays.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        <div>
          <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Max Score *</label>
          <input style={inp} type="number" min="1" value={form.max_score||100} onChange={e=>setForm({...form,max_score:parseInt(e.target.value)||100})} />
        </div>
        <div>
          <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Due Date *</label>
          <input style={inp} type="datetime-local" value={form.due_date||''} onChange={e=>setForm({...form,due_date:e.target.value})} />
        </div>
      </div>

      {/* Rubric */}
      <div>
        <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Grading Rubric</label>
        {Object.entries(form.rubric||{}).map(([k,v]) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <span style={{ fontSize:'13px', color:'#475569', textTransform:'capitalize', fontWeight:'600', width:'100px', flexShrink:0 }}>{k}</span>
            <input type="number" min="0" max="100" value={v} onChange={e=>setForm({...form,rubric:{...form.rubric,[k]:parseInt(e.target.value)||0}})} style={{ ...inp, width:'60px', padding:'6px 10px' }} />
            <span style={{ fontSize:'12px', color:'#94a3b8' }}>%</span>
            <div style={{ flex:1, height:'6px', background:'#f1f5f9', borderRadius:'3px', overflow:'hidden' }}>
              <div style={{ height:'6px', background:'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius:'3px', width:`${v}%` }} />
            </div>
          </div>
        ))}
        <p style={{ fontSize:'12px', color: rubricTotal!==100?'#ef4444':'#16a34a', fontWeight:'700', margin:'4px 0 0' }}>
          Total: {rubricTotal}% {rubricTotal!==100&&'⚠️ Must equal 100'}
        </p>
      </div>

      {/* File attachments */}
      <div>
        <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#374151', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Attach Files for Students</label>
        <p style={{ fontSize:'12px', color:'#94a3b8', margin:'0 0 10px' }}>Attach reading materials, rubric PDFs, reference images, instructional videos — any file type.</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
          {FILE_TYPES.map(ft => (
            <button key={ft.label} type="button" onClick={() => triggerUpload(ft.accept)}
              style={{ padding:'7px 14px', borderRadius:'8px', border:`1px solid ${ft.color==='#f1f5f9'?'#e2e8f0':ft.color}`, background:ft.color, color:ft.text, fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
              {ft.label}
            </button>
          ))}
        </div>
        {attachments.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
            {attachments.map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'5px 10px' }}>
                <span style={{ fontSize:'14px' }}>{f.icon}</span>
                <span style={{ fontSize:'11px', color:'#4f46e5', fontWeight:'600', maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</span>
                <span style={{ fontSize:'10px', color:'#94a3b8' }}>{(f.size/1024).toFixed(0)}KB</span>
                <button onClick={() => setAttachments(prev => prev.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:'13px', padding:'0', lineHeight:1, fontWeight:'700' }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}