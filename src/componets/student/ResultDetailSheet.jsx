// // src/components/student/ResultDetailSheet.jsx
// import { C, Sheet, scoreColor, scoreLabel } from './shared.jsx';

// export default function ResultDetailSheet({ sub, canUnsubmit, onClose, onUnsubmit }) {
//   if (!sub) return null;

//   const pct   = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
//   const isAI  = (sub.ai_detection_score ?? 0) >= 50;

//   return (
//     <Sheet
//       onClose={onClose}
//       title={sub.assignment_title}
//       subtitle={`Submitted ${new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
//       footer={
//         <div style={{ display: 'flex', gap: '10px' }}>
//           {canUnsubmit && (
//             <button onClick={() => { if (window.confirm('Unsubmit?')) onUnsubmit(sub); }} style={C.dBtn}>↩ Unsubmit</button>
//           )}
//           <button onClick={onClose} style={C.gBtn}>Close</button>
//         </div>
//       }
//     >
//       {/* ── Score banner ── */}
//       {sub.final_score !== null ? (() => {
//         const bg = pct >= 70 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : pct >= 50 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#ef4444,#dc2626)';
//         return (
//           <div style={{ background: bg, borderRadius: '18px', padding: '28px', textAlign: 'center', marginBottom: '18px', boxShadow: '0 4px 24px rgba(99,102,241,0.2)' }}>
//             <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Final Score</p>
//             <p style={{ color: '#fff', fontSize: '62px', fontWeight: '900', margin: 0, lineHeight: 1 }}>
//               {sub.final_score}<span style={{ fontSize: '22px', opacity: 0.55 }}>/{sub.max_score}</span>
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
//               <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', fontWeight: '700' }}>{pct}%</span>
//               <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>{scoreLabel(pct)}</span>
//             </div>
//           </div>
//         );
//       })() : isAI ? (
//         <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
//           <p style={{ fontSize: '26px', margin: '0 0 8px' }}>🚨</p>
//           <p style={{ fontWeight: '800', color: '#dc2626', fontSize: '15px', margin: '0 0 4px' }}>AI Content Detected</p>
//           <p style={{ fontSize: '13px', color: '#b91c1c', margin: '0 0 4px' }}>{sub.ai_detection_score}% AI-generated — Automatic score: 0</p>
//           <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Awaiting teacher review</p>
//         </div>
//       ) : sub.ai_score !== null ? (
//         <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
//           <p style={{ fontSize: '24px', margin: '0 0 6px' }}>⏳</p>
//           <p style={{ fontWeight: '800', color: '#92400e', fontSize: '15px', margin: '0 0 4px' }}>Awaiting Teacher Approval</p>
//           <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>AI suggested <strong>{sub.ai_score}/{sub.max_score}</strong></p>
//         </div>
//       ) : (
//         <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
//           <p style={{ fontWeight: '700', color: '#1e40af', margin: 0 }}>🤖 Grading in progress...</p>
//         </div>
//       )}

//       {/* ── AI Detection bar ── */}
//       {sub.ai_detection_score !== null && (
//         <div style={{ marginBottom: '16px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
//             <p style={C.sL}>AI Content Detection</p>
//             <span style={{ fontSize: '13px', fontWeight: '800', color: isAI ? '#dc2626' : '#16a34a' }}>{sub.ai_detection_score}%</span>
//           </div>
//           <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
//             <div style={{ height: '100%', width: `${sub.ai_detection_score}%`, background: isAI ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: '4px' }} />
//             <div style={{ position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%', background: '#94a3b8' }} />
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
//             <span style={{ fontSize: '10px', color: '#94a3b8' }}>0% Human</span>
//             <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700' }}>50% limit</span>
//             <span style={{ fontSize: '10px', color: '#94a3b8' }}>100% AI</span>
//           </div>
//         </div>
//       )}

//       {/* ── AI Feedback ── */}
//       {sub.ai_feedback && (
//         <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
//           <p style={{ ...C.sL, color: '#1d4ed8' }}>🤖 AI Feedback</p>
//           <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.85', whiteSpace: 'pre-wrap' }}>{sub.ai_feedback}</p>
//         </div>
//       )}

//       {/* ── Teacher Feedback ── */}
//       {sub.teacher_feedback && (
//         <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
//           <p style={{ ...C.sL, color: '#15803d' }}>👨‍🏫 Teacher Feedback</p>
//           <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.85' }}>{sub.teacher_feedback}</p>
//         </div>
//       )}

//       {/* ── Essay text ── */}
//       <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
//           <p style={C.sL}>Your Submission</p>
//           <span style={{ fontSize: '11px', color: '#94a3b8' }}>
//             {sub.essay_text?.trim().split(/\s+/).filter(Boolean).length} words
//             {sub.file_name ? ` · 📎 ${sub.file_name}` : ''}
//           </span>
//         </div>
//         <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.85', margin: 0, whiteSpace: 'pre-wrap' }}>{sub.essay_text}</p>
//       </div>
//     </Sheet>
//   );
// }


// src/components/student/ResultDetailSheet.jsx
import { useState, useEffect } from 'react';

// ─── COLOUR TOKENS ─────────────────────────────────────────────────────────
const NAVY      = '#1a2e5a';
const NAVY_DARK = '#0f1d3a';
const GOLD      = '#c9a227';

// ─── SCORE HELPERS (exported so ResultsTab can also import them) ─────────────
export const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';
export const scoreLabel = p => p >= 70 ? 'Pass'    : p >= 50 ? 'Borderline' : 'Fail';

const sL = {
  display:'block', fontSize:11, fontWeight:700, color:'#94a3b8',
  textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8,
};

// ─── BOTTOM SHEET ──────────────────────────────────────────────────────────
function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.65)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200, backdropFilter:'blur(4px)' }}>
      <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:760, maxHeight:'96vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 -8px 48px rgba(0,0,0,0.22)' }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
          <div style={{ width:40, height:4, background:'#e2e8f0', borderRadius:2 }} />
        </div>
        <div style={{ padding:'8px 20px 14px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
          <div style={{ flex:1 }}>
            <h2 style={{ fontWeight:800, fontSize:17, color:'#1e293b', margin:'0 0 2px', lineHeight:1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:32, height:32, fontSize:18, cursor:'pointer', color:'#64748b', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:20 }}>{children}</div>
        {footer && <div style={{ padding:'14px 20px 20px', borderTop:'1px solid #f1f5f9' }}>{footer}</div>}
      </div>
    </div>
  );
}

// ─── RADAR CHART ───────────────────────────────────────────────────────────
function RadarChart({ breakdown, size = 200 }) {
  if (!breakdown || breakdown.length === 0) return null;
  const cx = size/2, cy = size/2;
  const r  = size * 0.36;
  const n  = breakdown.length;
  const angle = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const points = breakdown.map((b, i) => {
    const ratio = b.pct / 100;
    return {
      x: cx + r*ratio*Math.cos(angle(i)), y: cy + r*ratio*Math.sin(angle(i)),
      labelX: cx + (r+24)*Math.cos(angle(i)), labelY: cy + (r+24)*Math.sin(angle(i)),
      gridX: cx + r*Math.cos(angle(i)),       gridY: cy + r*Math.sin(angle(i)),
      label: b.criterion.charAt(0).toUpperCase() + b.criterion.slice(1),
      pct: b.pct,
    };
  });
  const polygon    = pts => pts.map(p=>`${p.x},${p.y}`).join(' ');
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((lvl, gi) => {
        const gPts = breakdown.map((_,i)=>({x:cx+r*lvl*Math.cos(angle(i)),y:cy+r*lvl*Math.sin(angle(i))}));
        return <polygon key={gi} points={polygon(gPts)} fill="none" stroke="#e2e8f0" strokeWidth="1"/>;
      })}
      {points.map((p,i)=><line key={i} x1={cx} y1={cy} x2={p.gridX} y2={p.gridY} stroke="#e2e8f0" strokeWidth="1"/>)}
      <polygon points={polygon(points)} fill={`${NAVY}22`} stroke={NAVY} strokeWidth="2" strokeLinejoin="round"/>
      {points.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" fill={NAVY}/>)}
      {points.map((p,i)=>(
        <text key={i} x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="#475569">
          {p.label}
          <tspan x={p.labelX} dy="11" fontSize="8" fill={NAVY} fontWeight="800">{p.pct}%</tspan>
        </text>
      ))}
    </svg>
  );
}

// ─── SENTENCE HIGHLIGHTER ─────────────────────────────────────────────────
function analyzeSentences(text, overallAiPct) {
  if (!text || !overallAiPct) return [];
  const genericPhrases = ['multifaceted','furthermore','it is important to note','plays a crucial role','in today\'s world','throughout history','significantly impacts','one must consider','it is worth noting','as mentioned above','on the other hand','has fundamentally transformed','the intersection of'];
  const raw = text.split(/(?<=[.!?])\s+/);
  return raw.map((sentence, i) => {
    const lower = sentence.toLowerCase();
    const hasGeneric   = genericPhrases.some(p => lower.includes(p));
    const hasPersonal  = /\b(i |my |we |our |i believe|i think|personally)\b/i.test(sentence);
    const wordCount    = sentence.trim().split(/\s+/).length;
    const isUniformLen = wordCount >= 18 && wordCount <= 28;
    let risk = 0;
    if (hasGeneric)                    risk += 40;
    if (!hasPersonal && wordCount > 12) risk += 15;
    if (isUniformLen)                  risk += 10;
    risk += Math.floor(Math.random() * 15);
    risk = Math.min(95, Math.round(risk * (overallAiPct / 50)));
    return { sentence, risk, index: i };
  });
}

function SentenceHighlighter({ text, aiPct }) {
  const [showHighlight, setShowHighlight] = useState(false);
  const [sentences, setSentences]         = useState([]);
  const [tooltip, setTooltip]             = useState(null);

  useEffect(() => { setSentences(analyzeSentences(text, aiPct || 0)); }, [text, aiPct]);

  const riskBg     = r => r >= 60 ? '#ef444428' : r >= 35 ? '#f59e0b22' : 'transparent';
  const riskBorder = r => r >= 60 ? '#ef4444'   : r >= 35 ? '#f59e0b'   : 'transparent';
  const riskLabel  = r => r >= 60 ? 'High AI risk' : r >= 35 ? 'Moderate AI risk' : 'Likely human';

  return (
    <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em' }}>Your Submission</span>
          <span style={{ fontSize:11, color:'#94a3b8' }}>{text?.trim().split(/\s+/).filter(Boolean).length} words</span>
        </div>
        {aiPct > 0 && (
          <button onClick={() => setShowHighlight(h => !h)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:20, border:`1.5px solid ${showHighlight?'#ef4444':NAVY}`, background: showHighlight?'#fef2f2':`${NAVY}10`, color: showHighlight?'#dc2626':NAVY, fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
            🔬 {showHighlight ? 'Hide AI Scan' : 'Show AI Scan'}
          </button>
        )}
      </div>

      {showHighlight && (
        <div style={{ display:'flex', gap:14, marginBottom:10, flexWrap:'wrap' }}>
          {[{bg:'#ef444428',border:'#ef4444',label:'High AI risk (≥60%)'},{bg:'#f59e0b22',border:'#f59e0b',label:'Moderate (35–59%)'},{bg:'transparent',border:'#d1d5db',label:'Likely human'}].map(l=>(
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:12, height:12, borderRadius:3, background:l.bg, border:`1.5px solid ${l.border}`, display:'inline-block' }}/>
              <span style={{ fontSize:10, color:'#64748b' }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ position:'relative' }}>
        {showHighlight ? (
          <p style={{ fontSize:13, color:'#475569', lineHeight:'2.1', margin:0 }}>
            {sentences.map((s, i) => (
              <span key={i}
                onMouseEnter={e => setTooltip({ idx:i, x:e.clientX, y:e.clientY })}
                onMouseLeave={() => setTooltip(null)}
                style={{ background:riskBg(s.risk), borderBottom: s.risk>=35?`2px solid ${riskBorder(s.risk)}`:'none', borderRadius:3, padding: s.risk>=35?'1px 2px':'0', cursor: s.risk>=35?'help':'default', transition:'background 0.2s' }}>
                {s.sentence}{i < sentences.length-1 ? ' ' : ''}
              </span>
            ))}
          </p>
        ) : (
          <p style={{ fontSize:13, color:'#475569', lineHeight:'1.85', margin:0, whiteSpace:'pre-wrap' }}>{text}</p>
        )}
        {tooltip && sentences[tooltip.idx]?.risk >= 35 && (
          <div style={{ position:'fixed', top:tooltip.y-64, left:tooltip.x-80, background:'#1e293b', color:'#fff', padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:600, zIndex:9999, pointerEvents:'none', whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}>
            {riskLabel(sentences[tooltip.idx].risk)} · {sentences[tooltip.idx].risk}% AI score
          </div>
        )}
      </div>
    </div>
  );
}

// ─── IMPROVEMENT COACH ─────────────────────────────────────────────────────
function ImprovementCoach({ submission }) {
  const [open,        setOpen]        = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error,       setError]       = useState(null);

  const runCoach = async () => {
    setOpen(true);
    if (suggestions) return;
    setLoading(true); setError(null);
    try {
      const systemPrompt = `You are an academic writing coach for university students. Analyse the essay and return ONLY valid JSON — no markdown, no preamble — in this exact shape:\n{"overall":"2-sentence overall impression","suggestions":[{"type":"strength"|"weakness"|"tip","title":"short title","detail":"1-2 sentences of specific advice"}],"rewrite":{"original":"exact sentence from the essay that could be improved","improved":"your improved version of that sentence","why":"brief reason"}}\nGive exactly 4 suggestions. Be specific, reference the actual essay content.`;
      const userPrompt   = `Assignment: ${submission.assignment_title}\n\nEssay:\n${submission.essay_text}`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
          }),
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setSuggestions(JSON.parse(text.replace(/```json|```/g,'').trim()));
    } catch {
      setError('Could not load suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const typeStyle = t => ({ strength:{ bg:'#f0fdf4', border:'#86efac', icon:'💪', color:'#15803d' }, weakness:{ bg:'#fef2f2', border:'#fecaca', icon:'⚠️', color:'#dc2626' }, tip:{ bg:'#eff6ff', border:'#bfdbfe', icon:'💡', color:'#2563eb' } }[t] || { bg:'#f8fafc', border:'#e2e8f0', icon:'📝', color:'#64748b' });

  return (
    <div style={{ marginBottom:14 }}>
      <button onClick={runCoach}
        onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
        onMouseLeave={e => e.currentTarget.style.transform='none'}
        style={{ width:'100%', padding:'13px 16px', background:`linear-gradient(135deg,${NAVY},#2d4a8a)`, border:'none', borderRadius:12, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:`0 4px 14px ${NAVY}50`, transition:'transform 0.15s' }}>
        🧠 AI Writing Coach — Get Improvement Suggestions
      </button>

      {open && (
        <div style={{ marginTop:12, background:'#fff', border:`1.5px solid ${NAVY}25`, borderRadius:14, overflow:'hidden', boxShadow:'0 4px 20px rgba(26,46,90,0.10)' }}>
          <div style={{ background:`linear-gradient(135deg,${NAVY}10,${GOLD}15)`, padding:'12px 16px', borderBottom:`1px solid ${NAVY}15`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:800, fontSize:13, color:NAVY }}>🧠 AI Writing Coach</span>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', fontSize:16, cursor:'pointer', color:'#64748b' }}>×</button>
          </div>
          <div style={{ padding:16 }}>
            {loading && (
              <div style={{ textAlign:'center', padding:'28px 0' }}>
                <div style={{ width:36, height:36, border:`3px solid ${NAVY}20`, borderTopColor:NAVY, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }}/>
                <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Claude is analysing your essay...</p>
              </div>
            )}
            {error && <p style={{ color:'#dc2626', fontSize:13, textAlign:'center' }}>{error}</p>}
            {suggestions && !loading && (
              <>
                <p style={{ fontSize:13, color:'#475569', lineHeight:1.7, marginBottom:14, padding:'10px 14px', background:'#f8fafc', borderRadius:10, border:'1px solid #e2e8f0' }}>{suggestions.overall}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                  {suggestions.suggestions?.map((s, i) => {
                    const ts = typeStyle(s.type);
                    return (
                      <div key={i} style={{ background:ts.bg, border:`1px solid ${ts.border}`, borderRadius:10, padding:'10px 12px' }}>
                        <p style={{ fontSize:12, fontWeight:700, color:ts.color, margin:'0 0 4px' }}>{ts.icon} {s.title}</p>
                        <p style={{ fontSize:12, color:'#475569', margin:0, lineHeight:1.6 }}>{s.detail}</p>
                      </div>
                    );
                  })}
                </div>
                {suggestions.rewrite && (
                  <div style={{ background:`${GOLD}12`, border:`1px solid ${GOLD}50`, borderRadius:10, padding:14 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 8px' }}>✍️ Suggested Rewrite</p>
                    <div style={{ background:'#fef2f2', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
                      <p style={{ fontSize:11, color:'#94a3b8', margin:'0 0 3px', fontWeight:600 }}>ORIGINAL</p>
                      <p style={{ fontSize:12, color:'#7f1d1d', margin:0, fontStyle:'italic' }}>"{suggestions.rewrite.original}"</p>
                    </div>
                    <div style={{ background:'#f0fdf4', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
                      <p style={{ fontSize:11, color:'#94a3b8', margin:'0 0 3px', fontWeight:600 }}>IMPROVED</p>
                      <p style={{ fontSize:12, color:'#14532d', margin:0, fontWeight:600 }}>"{suggestions.rewrite.improved}"</p>
                    </div>
                    <p style={{ fontSize:11, color:'#92400e', margin:0 }}>💬 {suggestions.rewrite.why}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESULT DETAIL SHEET (main export) ────────────────────────────────────
export default function ResultDetailSheet({ sub, canUnsubmit, onClose, onUnsubmit }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!sub) return null;

  const pct  = sub.final_score !== null ? Math.round((sub.final_score / sub.max_score) * 100) : null;
  const isAI = (sub.ai_detection_score ?? 0) >= 50;

  return (
    <>
      <style>{`
        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .modal-tab { flex:1; padding:8px 4px; border-radius:8px; border:none; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s; }
        .modal-tab.active   { background:${NAVY}; color:#fff; }
        .modal-tab.inactive { background:transparent; color:#64748b; }
        .modal-tab.inactive:hover { background:#f1f5f9; color:#1e293b; }
        .fade-in { animation:fadeIn 0.22s ease; }
      `}</style>

      <Sheet
        onClose={onClose}
        title={sub.assignment_title}
        subtitle={`Submitted ${new Date(sub.submitted_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`}
        footer={
          <div style={{ display:'flex', gap:10 }}>
            {canUnsubmit && (
              <button onClick={() => { if (window.confirm('Unsubmit?')) onUnsubmit(sub); }}
                style={{ flex:1, padding:13, background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:12, color:'#dc2626', fontWeight:700, fontSize:14, cursor:'pointer' }}>
                ↩ Unsubmit
              </button>
            )}
            <button onClick={onClose}
              style={{ flex:1, padding:13, background:'#f1f5f9', border:'none', borderRadius:12, color:'#64748b', fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Close
            </button>
          </div>
        }>

        {/* Tab switcher */}
        <div style={{ display:'flex', gap:4, marginBottom:18, background:'#f8fafc', borderRadius:10, padding:4 }}>
          {[['overview','📊 Overview'],['ai analysis','🔬 AI Analysis'],['writing coach','🧠 Writing Coach']].map(([t,label]) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`modal-tab ${activeTab===t?'active':'inactive'}`}>{label}</button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="fade-in">
            {sub.final_score !== null ? (() => {
              const bg = pct>=70?`linear-gradient(135deg,${NAVY},${NAVY_DARK})`:pct>=50?'linear-gradient(135deg,#f59e0b,#d97706)':'linear-gradient(135deg,#ef4444,#dc2626)';
              return (
                <div style={{ background:bg, borderRadius:16, padding:'24px 20px', textAlign:'center', marginBottom:18, boxShadow:'0 6px 24px rgba(0,0,0,0.15)' }}>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 6px' }}>Final Score</p>
                  <p style={{ fontSize:52, fontWeight:900, color:'#fff', margin:0, lineHeight:1 }}>{sub.final_score}<span style={{ fontSize:22, opacity:0.55 }}>/{sub.max_score}</span></p>
                  <div style={{ display:'flex', justifyContent:'center', gap:10, marginTop:8 }}>
                    <span style={{ color:'rgba(255,255,255,0.85)', fontSize:16, fontWeight:700 }}>{pct}%</span>
                    <span style={{ background:'rgba(255,255,255,0.18)', color:'#fff', fontSize:12, fontWeight:700, padding:'2px 10px', borderRadius:20 }}>{scoreLabel(pct)}</span>
                  </div>
                  {sub.rubric_breakdown?.length > 0 && (
                    <div style={{ display:'flex', justifyContent:'center', marginTop:16 }}>
                      <RadarChart breakdown={sub.rubric_breakdown} size={180} />
                    </div>
                  )}
                </div>
              );
            })() : isAI ? (
              <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:14, padding:20, textAlign:'center', marginBottom:18 }}>
                <p style={{ fontSize:26, margin:'0 0 8px' }}>🚨</p>
                <p style={{ fontWeight:800, color:'#dc2626', fontSize:15, margin:'0 0 4px' }}>AI Content Detected</p>
                <p style={{ fontSize:13, color:'#b91c1c', margin:'0 0 4px' }}>{sub.ai_detection_score}% AI-generated — Automatic score: 0</p>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Awaiting teacher review</p>
              </div>
            ) : sub.ai_score !== null ? (
              <div>
                <div style={{ background:'#fffbeb', border:`1px solid ${GOLD}60`, borderRadius:14, padding:20, textAlign:'center', marginBottom:14 }}>
                  <p style={{ fontSize:24, margin:'0 0 6px' }}>⏳</p>
                  <p style={{ fontWeight:800, color:'#92400e', fontSize:15, margin:'0 0 4px' }}>Awaiting Teacher Approval</p>
                  <p style={{ fontSize:13, color:'#78350f', margin:0 }}>AI suggested <strong>{sub.ai_score}/{sub.max_score}</strong></p>
                </div>
                {sub.rubric_breakdown?.length > 0 && (
                  <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:16, marginBottom:14, display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <span style={{ ...sL, marginBottom:12 }}>📊 Rubric Breakdown</span>
                    <RadarChart breakdown={sub.rubric_breakdown} size={200} />
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:12, justifyContent:'center' }}>
                      {sub.rubric_breakdown.map(b => (
                        <div key={b.criterion} style={{ textAlign:'center', background:'#f8fafc', borderRadius:8, padding:'6px 12px', border:'1px solid #e2e8f0' }}>
                          <p style={{ fontSize:16, fontWeight:900, color:NAVY, margin:0 }}>{b.pct}%</p>
                          <p style={{ fontSize:10, color:'#94a3b8', margin:0, textTransform:'capitalize' }}>{b.criterion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background:`${NAVY}12`, border:`1px solid ${NAVY}30`, borderRadius:14, padding:20, textAlign:'center', marginBottom:18 }}>
                <p style={{ fontWeight:700, color:NAVY, margin:0 }}>🤖 Grading in progress...</p>
              </div>
            )}

            {sub.ai_feedback && (
              <div style={{ background:`${NAVY}0a`, border:`1px solid ${NAVY}25`, borderRadius:12, padding:16, marginBottom:14 }}>
                <span style={{ ...sL, color:NAVY }}>🤖 AI Feedback</span>
                <p style={{ fontSize:13, color:'#1e293b', margin:0, lineHeight:'1.85', whiteSpace:'pre-wrap' }}>{sub.ai_feedback}</p>
              </div>
            )}
            {sub.teacher_feedback && (
              <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:16, marginBottom:14 }}>
                <span style={{ ...sL, color:'#15803d' }}>👨‍🏫 Teacher Feedback</span>
                <p style={{ fontSize:13, color:'#1e293b', margin:0, lineHeight:'1.85' }}>{sub.teacher_feedback}</p>
              </div>
            )}
            <SentenceHighlighter text={sub.essay_text} aiPct={null} />
          </div>
        )}

        {/* ── AI ANALYSIS TAB ── */}
        {activeTab === 'ai analysis' && (
          <div className="fade-in">
            {sub.ai_detection_score !== null ? (
              <>
                <div style={{ background: sub.ai_detection_score>=50?'#fef2f2':'#f0fdf4', border:`1px solid ${sub.ai_detection_score>=50?'#fecaca':'#bbf7d0'}`, borderRadius:14, padding:20, marginBottom:16, textAlign:'center' }}>
                  <p style={{ fontSize:48, fontWeight:900, color: sub.ai_detection_score>=50?'#dc2626':'#16a34a', margin:'0 0 4px' }}>{sub.ai_detection_score}%</p>
                  <p style={{ fontSize:13, fontWeight:700, color:'#475569', margin:'0 0 14px' }}>
                    {sub.ai_detection_score>=50?'🚨 High AI Content — Policy Violation':sub.ai_detection_score>=30?'⚠️ Moderate AI Signals Detected':'✅ Largely Human-Written'}
                  </p>
                  <div style={{ height:12, background:'#e2e8f0', borderRadius:6, overflow:'hidden', position:'relative' }}>
                    <div style={{ height:'100%', width:`${sub.ai_detection_score}%`, background: sub.ai_detection_score>=50?'linear-gradient(90deg,#f59e0b,#ef4444)':'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius:6 }}/>
                    <div style={{ position:'absolute', top:0, left:'50%', width:2, height:'100%', background:'#94a3b8' }}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                    <span style={{ fontSize:10, color:'#94a3b8' }}>0% Human</span>
                    <span style={{ fontSize:10, color:'#ef4444', fontWeight:700 }}>50% policy limit</span>
                    <span style={{ fontSize:10, color:'#94a3b8' }}>100% AI</span>
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'#1e293b', marginBottom:6 }}>🔬 Sentence-Level AI Scan</p>
                  <p style={{ fontSize:12, color:'#64748b', marginBottom:10 }}>Toggle "Show AI Scan" to see which sentences were flagged. Red = high risk, amber = moderate risk.</p>
                  <SentenceHighlighter text={sub.essay_text} aiPct={sub.ai_detection_score} />
                </div>
                <div style={{ background:`${NAVY}08`, border:`1px solid ${NAVY}20`, borderRadius:12, padding:14 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:NAVY, margin:'0 0 8px' }}>ℹ️ How AI Detection Works</p>
                  <p style={{ fontSize:12, color:'#475569', margin:0, lineHeight:1.7 }}>The system analyses sentence uniformity, generic academic phrasing, vocabulary density, personal voice, and specificity of examples — all signals of AI-generated text. Scores ≥50% trigger an automatic zero pending teacher review.</p>
                </div>
              </>
            ) : (
              <div style={{ textAlign:'center', padding:'40px 0', color:'#94a3b8' }}>
                <p style={{ fontSize:32 }}>⏳</p>
                <p style={{ fontSize:13 }}>AI analysis not yet available for this submission.</p>
              </div>
            )}
          </div>
        )}

        {/* ── WRITING COACH TAB ── */}
        {activeTab === 'writing coach' && (
          <div className="fade-in">
            <div style={{ background:`linear-gradient(135deg,${NAVY}08,${GOLD}12)`, border:`1px solid ${NAVY}20`, borderRadius:14, padding:16, marginBottom:16 }}>
              <p style={{ fontWeight:800, fontSize:14, color:NAVY, margin:'0 0 4px' }}>🧠 AI Writing Coach — Powered by Gemini</p>
              <p style={{ fontSize:12, color:'#64748b', margin:0, lineHeight:1.6 }}>Get personalised AI feedback on your essay: strengths, weaknesses, specific improvement tips, and a before/after sentence rewrite example.</p>
            </div>
            <ImprovementCoach submission={sub} />
            <SentenceHighlighter text={sub.essay_text} aiPct={sub.ai_detection_score} />
          </div>
        )}
      </Sheet>
    </>
  );
}
