// // src/components/student/ResultsTab.jsx
// import { C, scoreColor, scoreLabel } from './shared.jsx';

// export default function ResultsTab({ results, loading, onOpenResult }) {
//   if (loading) {
//     return (
//       <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
//         <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
//         <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Loading results…</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px' }}>My Results</p>

//       {/* Legend */}
//       <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 16px', marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
//         {[
//           { i: '✅', l: 'Graded',          c: '#16a34a' },
//           { i: '⏳', l: 'Awaiting teacher', c: '#d97706' },
//           { i: '🚨', l: 'AI flagged',       c: '#dc2626' },
//           { i: '🤖', l: 'Grading...',       c: '#6366f1' },
//         ].map(x => (
//           <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//             <span style={{ fontSize: '13px' }}>{x.i}</span>
//             <span style={{ fontSize: '11px', color: x.c, fontWeight: '600' }}>{x.l}</span>
//           </div>
//         ))}
//       </div>

//       {results.length === 0 && (
//         <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
//           <p style={{ fontSize: '36px', margin: '0 0 10px' }}>📭</p>
//           <p style={{ fontWeight: '700', color: '#64748b', fontSize: '14px', margin: 0 }}>No submissions yet. Submit an assignment to see your results here.</p>
//         </div>
//       )}

//       {results.map(s => {
//         const pct       = s.final_score !== null ? Math.round((s.final_score / s.max_score) * 100) : null;
//         const isAI      = (s.ai_detection_score ?? 0) >= 50;
//         const isPending = s.status === 'pending';

//         return (
//           <div key={s.id}
//             style={{ ...C.card, cursor: isPending ? 'default' : 'pointer', transition: 'box-shadow 0.15s', opacity: isPending ? 0.75 : 1 }}
//             onClick={() => !isPending && onOpenResult(s)}
//             onMouseEnter={e => { if (!isPending) e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'; }}
//             onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'}
//           >
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
//               <div style={{ flex: 1 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
//                   <span style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>{s.assignment_title}</span>
//                   {s.submit_mode === 'upload' && s.file_name && <span style={C.badge('purple')}>📎 File</span>}
//                   {s.final_score !== null                               && <span style={C.badge('green')}>✅ Graded</span>}
//                   {!isPending && s.final_score === null && s.ai_score !== null && !isAI && <span style={C.badge('amber')}>⏳ Pending</span>}
//                   {!isPending && s.final_score === null && s.ai_score !== null && isAI  && <span style={C.badge('red')}>🚨 AI Flagged</span>}
//                   {isPending && <span style={C.badge('gray')}>🤖 Grading...</span>}
//                 </div>
//                 <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
//                   Submitted {new Date(s.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                 </p>
//               </div>

//               {/* Score display */}
//               <div style={{ textAlign: 'right', flexShrink: 0 }}>
//                 {s.final_score !== null ? (
//                   <div>
//                     <p style={{ fontSize: '26px', fontWeight: '900', color: scoreColor(pct), margin: 0, lineHeight: 1 }}>
//                       {s.final_score}<span style={{ fontSize: '13px', color: '#94a3b8' }}>/{s.max_score}</span>
//                     </p>
//                     <p style={{ fontSize: '12px', fontWeight: '700', color: scoreColor(pct), margin: '2px 0 0' }}>{scoreLabel(pct)} · {pct}%</p>
//                   </div>
//                 ) : isPending ? (
//                   <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//                 ) : s.ai_score !== null ? (
//                   <div>
//                     <p style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '800', margin: 0 }}>{s.ai_score}/{s.max_score}</p>
//                     <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>AI score</p>
//                   </div>
//                 ) : null}
//               </div>
//             </div>

//             {/* AI flag warning */}
//             {isAI && !isPending && (
//               <div style={{ marginTop: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
//                 <span>🚨</span>
//                 <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', margin: 0 }}>{s.ai_detection_score}% AI — automatic score: 0. Awaiting teacher review.</p>
//               </div>
//             )}

//             {/* Teacher feedback preview */}
//             {s.teacher_feedback && (
//               <div style={{ marginTop: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 12px' }}>
//                 <p style={{ fontSize: '11px', fontWeight: '700', color: '#15803d', margin: '0 0 2px' }}>👨‍🏫 Teacher Feedback</p>
//                 <p style={{ fontSize: '12px', color: '#166534', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.teacher_feedback}</p>
//               </div>
//             )}

//             {!isPending && <p style={{ fontSize: '12px', color: '#8b5cf6', margin: '10px 0 0', fontWeight: '600' }}>Tap to view full details →</p>}
//             {isPending  && <p style={{ fontSize: '12px', color: '#94a3b8', margin: '10px 0 0' }}>AI is reviewing your essay, please wait...</p>}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// src/components/student/ResultsTab.jsx
import { useState, useEffect } from 'react';

// ─── COLOUR TOKENS ─────────────────────────────────────────────────────────
const NAVY      = '#1a2e5a';
const NAVY_DARK = '#0f1d3a';
const GOLD      = '#c9a227';

// ─── SHARED HELPERS ────────────────────────────────────────────────────────
export const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';
export const scoreLabel = p => p >= 70 ? 'Pass'    : p >= 50 ? 'Borderline' : 'Fail';

const badge = c => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
  background: c==='green'?'#f0fdf4':c==='red'?'#fef2f2':c==='amber'?'#fffbeb':c==='purple'?'#fdf4ff':c==='gray'?'#f1f5f9':'#eff6ff',
  color:      c==='green'?'#16a34a':c==='red'?'#dc2626':c==='amber'?'#d97706':c==='purple'?'#9333ea':c==='gray'?'#64748b':'#2563eb',
});

const sL = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
};

// ─── SENTENCE-LEVEL AI DETECTION ───────────────────────────────────────────
function analyzeSentences(text, overallAiPct) {
  if (!text || !overallAiPct) return [];
  const genericPhrases = ['multifaceted','furthermore','it is important to note','plays a crucial role','in today\'s world','throughout history','significantly impacts','one must consider','it is worth noting','as mentioned above','on the other hand','has fundamentally transformed','the intersection of'];
  const raw = text.split(/(?<=[.!?])\s+/);
  return raw.map((sentence, i) => {
    const lower = sentence.toLowerCase();
    const hasGeneric  = genericPhrases.some(p => lower.includes(p));
    const hasPersonal = /\b(i |my |we |our |i believe|i think|personally)\b/i.test(sentence);
    const wordCount   = sentence.trim().split(/\s+/).length;
    const isUniformLen = wordCount >= 18 && wordCount <= 28;
    let risk = 0;
    if (hasGeneric)                   risk += 40;
    if (!hasPersonal && wordCount>12) risk += 15;
    if (isUniformLen)                 risk += 10;
    risk += Math.floor(Math.random() * 15);
    risk = Math.min(95, Math.round(risk * (overallAiPct / 50)));
    return { sentence, risk, index: i };
  });
}

// ─── RADAR CHART ───────────────────────────────────────────────────────────
function RadarChart({ breakdown, size = 200 }) {
  if (!breakdown || breakdown.length === 0) return null;
  const cx = size / 2, cy = size / 2;
  const r  = size * 0.36;
  const n  = breakdown.length;
  const angle = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const points = breakdown.map((b, i) => {
    const ratio = b.pct / 100;
    return {
      x:      cx + r * ratio * Math.cos(angle(i)),
      y:      cy + r * ratio * Math.sin(angle(i)),
      labelX: cx + (r + 24) * Math.cos(angle(i)),
      labelY: cy + (r + 24) * Math.sin(angle(i)),
      gridX:  cx + r * Math.cos(angle(i)),
      gridY:  cy + r * Math.sin(angle(i)),
      label:  b.criterion.charAt(0).toUpperCase() + b.criterion.slice(1),
      pct:    b.pct,
    };
  });
  const polygon    = pts => pts.map(p => `${p.x},${p.y}`).join(' ');
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((lvl, gi) => {
        const gPts = breakdown.map((_, i) => ({ x: cx + r * lvl * Math.cos(angle(i)), y: cy + r * lvl * Math.sin(angle(i)) }));
        return <polygon key={gi} points={polygon(gPts)} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
      })}
      {points.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.gridX} y2={p.gridY} stroke="#e2e8f0" strokeWidth="1" />)}
      <polygon points={polygon(points)} fill={`${NAVY}22`} stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill={NAVY} />)}
      {points.map((p, i) => (
        <text key={i} x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="#475569">
          {p.label}
          <tspan x={p.labelX} dy="11" fontSize="8" fill={NAVY} fontWeight="800">{p.pct}%</tspan>
        </text>
      ))}
    </svg>
  );
}

// ─── TREND LINE CHART ──────────────────────────────────────────────────────
function TrendLineChart({ dataPoints }) {
  if (!dataPoints || dataPoints.length < 2) return null;
  const W = 420, H = 140, PAD = { top: 16, right: 16, bottom: 32, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top  - PAD.bottom;
  const xScale = i => PAD.left + (i / (dataPoints.length - 1)) * innerW;
  const yScale = v => PAD.top + innerH - ((v - 0) / 100) * innerH;
  const pathD  = dataPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.score)}`).join(' ');
  const areaD  = `${pathD} L ${xScale(dataPoints.length-1)} ${PAD.top+innerH} L ${xScale(0)} ${PAD.top+innerH} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {[0,25,50,75,100].map(g => (
        <g key={g}>
          <line x1={PAD.left} y1={yScale(g)} x2={W-PAD.right} y2={yScale(g)} stroke="#f1f5f9" strokeWidth="1" />
          <text x={PAD.left-6} y={yScale(g)} textAnchor="end" dominantBaseline="middle" fontSize="8" fill="#94a3b8">{g}</text>
        </g>
      ))}
      <line x1={PAD.left} y1={yScale(70)} x2={W-PAD.right} y2={yScale(70)} stroke="#16a34a30" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={W-PAD.right+4} y={yScale(70)} fontSize="8" fill="#16a34a" dominantBaseline="middle">Pass</text>
      <path d={areaD} fill="url(#trendGrad)" opacity="0.25" />
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={NAVY} />
          <stop offset="100%" stopColor={NAVY} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={pathD} fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {dataPoints.map((d, i) => (
        <g key={i}>
          <circle cx={xScale(i)} cy={yScale(d.score)} r="5" fill="#fff" stroke={NAVY} strokeWidth="2.5" />
          <text x={xScale(i)} y={yScale(d.score)-10} textAnchor="middle" fontSize="9" fontWeight="800" fill={NAVY}>{d.score}%</text>
          <text x={xScale(i)} y={H-PAD.bottom+14} textAnchor="middle" fontSize="8" fill="#94a3b8">{d.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── AI LEARNING PROGRESS TRACKER ─────────────────────────────────────────
function LearningProgressTracker({ submissions, studentName }) {
  const [loading,  setLoading]  = useState(false);
  const [insights, setInsights] = useState(null);
  const [error,    setError]    = useState(null);
  const [expanded, setExpanded] = useState(false);

  const scoredSubmissions = submissions
    .filter(s => (s.final_score !== null || (s.ai_score !== null && s.ai_score > 0)) && s.ai_detection_score < 50)
    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));

  const trendData = scoredSubmissions.map(s => ({
    label: s.assignment_title.split(' ').slice(0, 2).join(' '),
    score: s.final_score !== null
      ? Math.round((s.final_score / s.max_score) * 100)
      : Math.round((s.ai_score  / s.max_score) * 100),
    title: s.assignment_title,
  }));

  const improvementDelta = trendData.length >= 2
    ? trendData[trendData.length - 1].score - trendData[0].score
    : null;

  const allRubric = {};
  scoredSubmissions.forEach(s => {
    s.rubric_breakdown?.forEach(b => {
      if (!allRubric[b.criterion]) allRubric[b.criterion] = [];
      allRubric[b.criterion].push(b.pct);
    });
  });
  const avgRubric = Object.entries(allRubric)
    .map(([criterion, pcts]) => ({ criterion, avg: Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length) }))
    .sort((a, b) => a.avg - b.avg);
  const weakestArea   = avgRubric[0];
  const strongestArea = avgRubric[avgRubric.length - 1];

  const runAnalysis = async () => {
    if (insights) { setExpanded(true); return; }
    setExpanded(true);
    setLoading(true);
    setError(null);
    const essaySummary = scoredSubmissions.map((s, i) =>
      `Essay ${i+1}: "${s.assignment_title}" — Score: ${s.final_score ?? s.ai_score}/${s.max_score} — Submitted: ${new Date(s.submitted_at).toLocaleDateString('en-GB')}${s.rubric_breakdown?.length ? '\n  Rubric: '+s.rubric_breakdown.map(b=>`${b.criterion} ${b.pct}%`).join(', ') : ''}`
    ).join('\n');
    const systemPrompt = `You are an encouraging academic progress advisor for university students. You analyse a student's essay submission history and return ONLY valid JSON — no markdown, no preamble — in this exact shape:\n{"dna_title":"A creative 4-word writing style title","dna_summary":"2-3 sentences describing this student's overall writing personality","trend_insight":"1-2 sentences about their score trend","strengths":["strength 1","strength 2"],"growth_areas":["area 1","area 2"],"recommendations":[{"title":"short action title","detail":"1 concrete sentence"},{"title":"short action title","detail":"1 concrete sentence"},{"title":"short action title","detail":"1 concrete sentence"}]}\nBe specific to the actual essay titles and scores. Be warm and encouraging.`;
    const userPrompt   = `Student: ${studentName}\nNumber of essays: ${scoredSubmissions.length}\n\nSubmission history:\n${essaySummary}`;
    try {
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
      const data   = await res.json();
      const text   = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
      setInsights(parsed);
    } catch {
      setError('Could not generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (scoredSubmissions.length < 2) return null;

  return (
    <div style={{ marginTop: 40 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <p style={{ fontSize:20, fontWeight:800, color:'#1e293b', margin:0 }}>📈 AI Learning Progress Tracker</p>
          <p style={{ fontSize:13, color:'#94a3b8', margin:'2px 0 0' }}>AI analysis of all your essays together — your growth over time</p>
        </div>
        <button onClick={runAnalysis}
          style={{ padding:'10px 20px', background:`linear-gradient(135deg,${NAVY},${NAVY_DARK})`, border:'none', borderRadius:12, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:`0 4px 14px ${NAVY}50`, whiteSpace:'nowrap', transition:'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform='none'}>
          🧠 {insights ? 'View My Insights' : 'Generate AI Insights'}
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, marginBottom:20 }}>
        {[
          { icon:'📝', label:'Essays Analysed', value:scoredSubmissions.length, bg:'#eff6ff', color:'#2563eb' },
          { icon: improvementDelta>0?'📈':improvementDelta<0?'📉':'➡️', label:'Score Change', value: improvementDelta!==null?`${improvementDelta>0?'+':''}${improvementDelta}%`:'—', bg: improvementDelta>0?'#f0fdf4':improvementDelta<0?'#fef2f2':'#f8fafc', color: improvementDelta>0?'#16a34a':improvementDelta<0?'#dc2626':'#64748b' },
          { icon:'💪', label:'Strongest Area', value: strongestArea?strongestArea.criterion.charAt(0).toUpperCase()+strongestArea.criterion.slice(1):'—', sub: strongestArea?`${strongestArea.avg}% avg`:'', bg:'#f0fdf4', color:'#15803d' },
          { icon:'🎯', label:'Focus Area',     value: weakestArea?weakestArea.criterion.charAt(0).toUpperCase()+weakestArea.criterion.slice(1):'—',   sub: weakestArea?`${weakestArea.avg}% avg`:'',   bg:'#fffbeb', color:'#d97706' },
        ].map((s, i) => (
          <div key={i} style={{ background:'#fff', borderRadius:14, padding:'14px 16px', border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{s.icon}</div>
              <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{s.label}</span>
            </div>
            <p style={{ fontSize:20, fontWeight:900, color:s.color, margin:0, lineHeight:1 }}>{s.value}</p>
            {s.sub && <p style={{ fontSize:10, color:'#94a3b8', margin:'2px 0 0' }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:20, marginBottom:20, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <p style={{ fontSize:13, fontWeight:800, color:'#1e293b', margin:'0 0 16px' }}>Score Trend Across Submissions</p>
        <TrendLineChart dataPoints={trendData} />
        <p style={{ fontSize:11, color:'#94a3b8', margin:'10px 0 0', textAlign:'center' }}>
          {improvementDelta > 0
            ? `🎉 Great progress! Your score has improved by ${improvementDelta}% from your first to latest submission.`
            : improvementDelta === 0
            ? '➡️ Your scores have been consistent across submissions.'
            : 'Your scores have varied — the AI Writing Coach can help identify patterns.'}
        </p>
      </div>

      {/* Rubric Average Bars */}
      {avgRubric.length > 0 && (
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:20, marginBottom:20, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize:13, fontWeight:800, color:'#1e293b', margin:'0 0 14px' }}>Average Rubric Performance Across All Essays</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {avgRubric.slice().reverse().map(r => (
              <div key={r.criterion}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#475569', textTransform:'capitalize' }}>{r.criterion}</span>
                  <span style={{ fontSize:12, fontWeight:800, color: r.avg>=80?'#16a34a':r.avg>=65?'#d97706':'#dc2626' }}>{r.avg}%</span>
                </div>
                <div style={{ height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${r.avg}%`, borderRadius:4, transition:'width 0.8s ease', background: r.avg>=80?'linear-gradient(90deg,#22c55e,#16a34a)':r.avg>=65?'linear-gradient(90deg,#fbbf24,#d97706)':'linear-gradient(90deg,#f87171,#dc2626)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights Panel */}
      {expanded && (
        <div style={{ background:'#fff', borderRadius:16, border:`1.5px solid ${NAVY}25`, overflow:'hidden', boxShadow:'0 4px 20px rgba(26,46,90,0.10)' }}>
          <div style={{ background:`linear-gradient(135deg,${NAVY},${NAVY_DARK})`, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:14, fontWeight:800, color:'#fff', margin:0 }}>🧠 Your AI Learning Insights</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', margin:'2px 0 0' }}>Generated by Gemini AI — based on all {scoredSubmissions.length} of your essays</p>
            </div>
            <button onClick={() => setExpanded(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', padding:'4px 10px' }}>✕ Close</button>
          </div>
          <div style={{ padding:20 }}>
            {loading && (
              <div style={{ textAlign:'center', padding:'36px 0' }}>
                <div style={{ width:40, height:40, border:`3px solid ${NAVY}20`, borderTopColor:NAVY, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }} />
                <p style={{ fontSize:13, color:'#64748b', margin:'0 0 4px', fontWeight:600 }}>Claude is analysing your essay journey...</p>
                <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>Reading all {scoredSubmissions.length} submissions together</p>
              </div>
            )}
            {error && (
              <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:14, textAlign:'center' }}>
                <p style={{ color:'#dc2626', fontSize:13, margin:0 }}>{error}</p>
                <button onClick={() => { setInsights(null); runAnalysis(); }} style={{ marginTop:10, padding:'6px 16px', background:'#dc2626', border:'none', borderRadius:8, color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>Retry</button>
              </div>
            )}
            {insights && !loading && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {/* Writing DNA */}
                <div style={{ background:`linear-gradient(135deg,${NAVY}08,${GOLD}15)`, border:`1px solid ${GOLD}40`, borderRadius:14, padding:18 }}>
                  <p style={{ fontSize:10, fontWeight:700, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px' }}>🧬 Your Writing DNA</p>
                  <p style={{ fontSize:18, fontWeight:900, color:NAVY, margin:'0 0 8px' }}>{insights.dna_title}</p>
                  <p style={{ fontSize:13, color:'#475569', margin:0, lineHeight:1.7 }}>{insights.dna_summary}</p>
                </div>
                {/* Trend insight */}
                <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:14 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'#1d4ed8', margin:'0 0 4px' }}>📈 Progress Insight</p>
                  <p style={{ fontSize:13, color:'#1e3a8a', margin:0, lineHeight:1.6 }}>{insights.trend_insight}</p>
                </div>
                {/* Strengths & Growth */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:12, padding:14 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#15803d', margin:'0 0 8px' }}>💪 Your Strengths</p>
                    {insights.strengths?.map((s, i) => (
                      <div key={i} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:6 }}>
                        <span style={{ fontSize:10, color:'#16a34a', marginTop:2, flexShrink:0 }}>✓</span>
                        <p style={{ fontSize:12, color:'#166534', margin:0, lineHeight:1.5 }}>{s}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:14 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#d97706', margin:'0 0 8px' }}>🎯 Growth Areas</p>
                    {insights.growth_areas?.map((s, i) => (
                      <div key={i} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:6 }}>
                        <span style={{ fontSize:10, color:'#d97706', marginTop:2, flexShrink:0 }}>→</span>
                        <p style={{ fontSize:12, color:'#92400e', margin:0, lineHeight:1.5 }}>{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Recommendations */}
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:'#1e293b', margin:'0 0 10px' }}>📚 Personalised Study Recommendations</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {insights.recommendations?.map((r, i) => (
                      <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'12px 14px' }}>
                        <div style={{ width:24, height:24, borderRadius:'50%', background:NAVY, color:'#fff', fontSize:11, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                        <div>
                          <p style={{ fontSize:12, fontWeight:700, color:NAVY, margin:'0 0 2px' }}>{r.title}</p>
                          <p style={{ fontSize:12, color:'#64748b', margin:0, lineHeight:1.5 }}>{r.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESULT CARD ───────────────────────────────────────────────────────────
function ResultCard({ s, onClick }) {
  const [hovered, setHovered] = useState(false);
  const pct       = s.final_score !== null ? Math.round((s.final_score / s.max_score) * 100) : null;
  const isAI      = s.ai_detection_score >= 50;
  const isPending = s.status === 'pending';
  const hoverBg   = isAI?'#fff5f5':s.final_score!==null?'#f0fdf4':isPending?'#f8fafc':'#faf5ff';
  const borderColor = hovered ? (isAI?'#fca5a5':s.final_score!==null?'#86efac':isPending?'#cbd5e1':`${GOLD}80`) : '#e2e8f0';

  return (
    <div
      onClick={() => !isPending && onClick(s)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered?hoverBg:'#fff', borderRadius:16, border:`1.5px solid ${borderColor}`, padding:20, marginBottom:12, boxShadow: hovered?'0 6px 24px rgba(26,46,90,0.10)':'0 1px 4px rgba(0,0,0,0.03)', cursor: isPending?'default':'pointer', transition:'all 0.2s ease', opacity: isPending?0.78:1, transform: hovered&&!isPending?'translateY(-2px)':'none' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:6, marginBottom:4 }}>
            <span style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{s.assignment_title}</span>
            {s.submit_mode==='upload' && s.file_name && <span style={badge('purple')}>📎 File</span>}
            {s.final_score !== null                               && <span style={badge('green')}>✅ Graded</span>}
            {!isPending && s.final_score===null && s.ai_score!==null && !isAI && <span style={badge('amber')}>⏳ Pending</span>}
            {!isPending && s.final_score===null && s.ai_score!==null &&  isAI && <span style={badge('red')}>🚨 AI Flagged</span>}
            {isPending && <span style={badge('gray')}>🤖 Grading...</span>}
          </div>
          <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>
            Submitted {new Date(s.submitted_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
          </p>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          {s.final_score !== null ? (
            <div>
              <p style={{ fontSize:26, fontWeight:900, color:scoreColor(pct), margin:0, lineHeight:1 }}>{s.final_score}<span style={{ fontSize:13, color:'#94a3b8' }}>/{s.max_score}</span></p>
              <p style={{ fontSize:12, fontWeight:700, color:scoreColor(pct), margin:'2px 0 0' }}>{scoreLabel(pct)} · {pct}%</p>
            </div>
          ) : isPending ? (
            <div style={{ width:28, height:28, border:'3px solid #e2e8f0', borderTopColor:NAVY, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          ) : s.ai_score !== null ? (
            <div>
              <p style={{ fontSize:14, color:NAVY, fontWeight:800, margin:0 }}>{s.ai_score}/{s.max_score}</p>
              <p style={{ fontSize:11, color:'#94a3b8', margin:'2px 0 0' }}>AI score</p>
            </div>
          ) : null}
        </div>
      </div>

      {isAI && !isPending && (
        <div style={{ marginTop:10, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'8px 12px', display:'flex', gap:6, alignItems:'center' }}>
          <span>🚨</span>
          <p style={{ fontSize:12, color:'#dc2626', fontWeight:700, margin:0 }}>{s.ai_detection_score}% AI — automatic score: 0. Awaiting teacher review.</p>
        </div>
      )}
      {s.teacher_feedback && (
        <div style={{ marginTop:10, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:'8px 12px' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#15803d', margin:'0 0 2px' }}>👨‍🏫 Teacher Feedback</p>
          <p style={{ fontSize:12, color:'#166534', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.teacher_feedback}</p>
        </div>
      )}
      {!isPending && <p style={{ fontSize:12, color: hovered?GOLD:'#94a3b8', margin:'10px 0 0', fontWeight: hovered?700:500, transition:'color 0.2s' }}>{hovered?'View full details →':'Tap to view full details →'}</p>}
      {isPending  && <p style={{ fontSize:12, color:'#94a3b8', margin:'10px 0 0' }}>AI is reviewing your essay, please wait...</p>}
    </div>
  );
}

// ─── RESULTS TAB (main export) ─────────────────────────────────────────────
export default function ResultsTab({ results, loading, onOpenResult, studentName }) {
  if (loading) {
    return (
      <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'48px 24px', textAlign:'center' }}>
        <div style={{ width:32, height:32, border:`3px solid #e2e8f0`, borderTopColor:NAVY, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
        <p style={{ color:'#94a3b8', fontSize:14, margin:0 }}>Loading results…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header + legend */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <p style={{ fontSize:20, fontWeight:800, color:'#1e293b', margin:0 }}>My Results</p>
          <p style={{ fontSize:13, color:'#94a3b8', margin:'2px 0 0' }}>Click any card to view full feedback</p>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          {[{i:'✅',l:'Graded',c:'#16a34a'},{i:'⏳',l:'Pending',c:'#d97706'},{i:'🚨',l:'AI flagged',c:'#dc2626'},{i:'🤖',l:'Grading',c:NAVY}].map(x => (
            <div key={x.l} style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:12 }}>{x.i}</span>
              <span style={{ fontSize:11, color:x.c, fontWeight:600 }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>

      {results.length === 0 && (
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'48px 24px', textAlign:'center' }}>
          <p style={{ fontSize:36, margin:'0 0 10px' }}>📭</p>
          <p style={{ fontWeight:700, color:'#64748b', fontSize:14, margin:0 }}>No submissions yet. Submit an assignment to see your results here.</p>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(480px,1fr))', gap:0 }}>
        {results.map(s => (
          <ResultCard key={s.id} s={s} onClick={onOpenResult} />
        ))}
      </div>

      {/* AI Learning Progress Tracker */}
      <LearningProgressTracker submissions={results} studentName={studentName || 'Student'} />
    </div>
  );
}
