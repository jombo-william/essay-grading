
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

async function mockAiGrade({ essayText, assignment }) {
  await new Promise(r => setTimeout(r, 2500 + Math.random() * 1500))
  const words = essayText.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const lowerText = essayText.toLowerCase()
  const genericPhrases = ['multifaceted','furthermore','in conclusion','it is important to note','plays a crucial role','in today\'s world','throughout history','significantly impacts','one must consider','it is worth noting','in summary','as mentioned above','on the other hand']
  const genericCount = genericPhrases.filter(p => lowerText.includes(p)).length
  const hasPersonalVoice = /\b(i |my |we |our |personally|in my view|i believe|i think)\b/i.test(essayText)
  const hasSpecificExamples = /\b(20\d\d|for example|for instance|such as|according to)\b/i.test(essayText)
  const sentences = essayText.split(/[.!?]+/).map(s => s.trim().split(/\s+/).length)
  const avgLen = sentences.reduce((a,b) => a+b, 0) / sentences.length
  const variance = sentences.reduce((a,b) => a+Math.abs(b-avgLen), 0) / sentences.length
  let aiPct = 15
  aiPct += genericCount * 7
  if (!hasPersonalVoice) aiPct += 18
  if (!hasSpecificExamples) aiPct += 12
  if (variance < 3) aiPct += 15
  if (wordCount > 600) aiPct -= 8
  aiPct = Math.min(95, Math.max(3, aiPct + Math.floor(Math.random() * 12) - 6))
  if (aiPct >= 50) {
    return { total_score: 0, ai_detection_percentage: aiPct, overall_feedback: `⚠️ HIGH AI CONTENT DETECTED\n\nAn estimated ${aiPct}% of this essay appears AI-generated.\n\nPer academic integrity policy, essays with ≥50% AI content receive a score of 0/100.\n\nIndicators:\n• ${!hasPersonalVoice ? 'No personal voice or first-person examples\n• ' : ''}${genericCount > 2 ? 'Overuse of generic academic phrases\n• ' : ''}${variance < 3 ? 'Unnaturally uniform sentence structure\n• ' : ''}Vocabulary patterns consistent with LLM output\n\nPlease rewrite in your own words with specific examples.`, rubric_breakdown: [] }
  }
  const rubricEntries = Object.entries(assignment.rubric)
  let totalScore = 0
  let breakdown = []
  for (const [criterion, weight] of rubricEntries) {
    let pct = 0.72 + Math.random() * 0.22
    if (['grammar','structure'].includes(criterion)) pct = Math.min(0.97, pct + 0.05)
    if (['evidence','examples'].includes(criterion)) pct = hasSpecificExamples ? pct : pct * 0.72
    if (['content','argumentation'].includes(criterion)) pct = wordCount >= 400 ? pct : pct * 0.8
    const earned = Math.round(weight * pct)
    totalScore += earned
    breakdown.push({ criterion, earned, weight, pct: Math.round(pct * 100) })
  }
  totalScore = Math.min(assignment.max_score, totalScore)
  const qualLabel = totalScore >= 85 ? 'Excellent' : totalScore >= 75 ? 'Good' : totalScore >= 65 ? 'Satisfactory' : 'Needs Improvement'
  const strongest = breakdown.reduce((a,b) => a.pct > b.pct ? a : b)
  const weakest   = breakdown.reduce((a,b) => a.pct < b.pct ? a : b)
  const improveTip = { evidence:'specific citations and real-world examples', examples:'country-specific or dated examples', structure:'clear paragraph transitions and a stronger conclusion', grammar:'proofreading for tense and agreement errors', content:'deeper analysis and more nuanced argument', argumentation:'stronger counterarguments and a clearer stance' }[weakest.criterion] || 'more depth and original analysis'
  const feedbackLines = [`Overall Assessment: ${qualLabel} — ${totalScore}/${assignment.max_score}\n`, ...breakdown.map(b => { const label = b.pct >= 88 ? 'Strong' : b.pct >= 76 ? 'Good' : b.pct >= 64 ? 'Satisfactory' : 'Needs work'; return `${b.criterion.charAt(0).toUpperCase() + b.criterion.slice(1)} (${b.earned}/${b.weight}): ${label}` }), `\nStrength: Your ${strongest.criterion} was the strongest area.`, `Improve: ${weakest.criterion} — consider adding ${improveTip}.`, `\nAI Detection: ${aiPct < 15 ? 'Very low' : aiPct < 30 ? 'Low' : 'Moderate'} (~${aiPct}%). ${aiPct < 20 ? 'Appears authentically written.' : 'Ensure all work is your own.'}` ]
  return { total_score: totalScore, ai_detection_percentage: aiPct, overall_feedback: feedbackLines.join('\n'), rubric_breakdown: breakdown }
}


function analyzeSentences(text, overallAiPct) {
  if (!text || !overallAiPct) return []
  const genericPhrases = ['multifaceted','furthermore','it is important to note','plays a crucial role','in today\'s world','throughout history','significantly impacts','one must consider','it is worth noting','as mentioned above','on the other hand','has fundamentally transformed','the intersection of']
  const raw = text.split(/(?<=[.!?])\s+/)
  return raw.map((sentence, i) => {
    const lower = sentence.toLowerCase()
    const hasGeneric = genericPhrases.some(p => lower.includes(p))
    const hasPersonal = /\b(i |my |we |our |i believe|i think|personally)\b/i.test(sentence)
    const wordCount = sentence.trim().split(/\s+/).length
    const isUniformLen = wordCount >= 18 && wordCount <= 28
    let risk = 0
    if (hasGeneric) risk += 40
    if (!hasPersonal && wordCount > 12) risk += 15
    if (isUniformLen) risk += 10
    risk += Math.floor(Math.random() * 15)
    risk = Math.min(95, Math.round(risk * (overallAiPct / 50)))
    return { sentence, risk, index: i }
  })
}


function RadarChart({ breakdown, size = 200 }) {
  if (!breakdown || breakdown.length === 0) return null
  const cx = size / 2, cy = size / 2
  const r  = size * 0.36
  const n  = breakdown.length
  const angle = i => (Math.PI * 2 * i) / n - Math.PI / 2
  const points = breakdown.map((b, i) => {
    const ratio = b.pct / 100
    return {
      x: cx + r * ratio * Math.cos(angle(i)),
      y: cy + r * ratio * Math.sin(angle(i)),
      labelX: cx + (r + 24) * Math.cos(angle(i)),
      labelY: cy + (r + 24) * Math.sin(angle(i)),
      gridX: cx + r * Math.cos(angle(i)),
      gridY: cy + r * Math.sin(angle(i)),
      label: b.criterion.charAt(0).toUpperCase() + b.criterion.slice(1),
      pct: b.pct,
    }
  })
  const polygon = pts => pts.map(p => `${p.x},${p.y}`).join(' ')
  const gridLevels = [0.25, 0.5, 0.75, 1.0]
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((lvl, gi) => {
        const gPts = breakdown.map((_, i) => ({ x: cx + r * lvl * Math.cos(angle(i)), y: cy + r * lvl * Math.sin(angle(i)) }))
        return <polygon key={gi} points={polygon(gPts)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      })}
      {points.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.gridX} y2={p.gridY} stroke="#e2e8f0" strokeWidth="1" />)}
      <polygon points={polygon(points)} fill="#1a2e5a22" stroke="#1a2e5a" strokeWidth="2" strokeLinejoin="round" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1a2e5a" />)}
      {points.map((p, i) => (
        <text key={i} x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="#475569">
          {p.label}
          <tspan x={p.labelX} dy="11" fontSize="8" fill="#1a2e5a" fontWeight="800">{p.pct}%</tspan>
        </text>
      ))}
    </svg>
  )
}

// ─── TREND LINE CHART (pure SVG) ───────────────────────────────────────────
function TrendLineChart({ dataPoints }) {
  if (!dataPoints || dataPoints.length < 2) return null
  const W = 420, H = 140, PAD = { top:16, right:16, bottom:32, left:36 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const maxY = 100, minY = 0
  const xScale = i => PAD.left + (i / (dataPoints.length - 1)) * innerW
  const yScale = v => PAD.top + innerH - ((v - minY) / (maxY - minY)) * innerH
  const pathD = dataPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.score)}`).join(' ')
  const areaD = `${pathD} L ${xScale(dataPoints.length-1)} ${PAD.top+innerH} L ${xScale(0)} ${PAD.top+innerH} Z`
  const gridLines = [0, 25, 50, 75, 100]
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
      {/* Grid lines */}
      {gridLines.map(g => (
        <g key={g}>
          <line x1={PAD.left} y1={yScale(g)} x2={W-PAD.right} y2={yScale(g)} stroke="#f1f5f9" strokeWidth="1" />
          <text x={PAD.left - 6} y={yScale(g)} textAnchor="end" dominantBaseline="middle" fontSize="8" fill="#94a3b8">{g}</text>
        </g>
      ))}
      {/* 70% pass line */}
      <line x1={PAD.left} y1={yScale(70)} x2={W-PAD.right} y2={yScale(70)} stroke="#16a34a30" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={W-PAD.right+4} y={yScale(70)} fontSize="8" fill="#16a34a" dominantBaseline="middle">Pass</text>
      {/* Area fill */}
      <path d={areaD} fill="url(#trendGrad)" opacity="0.25" />
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2e5a" />
          <stop offset="100%" stopColor="#1a2e5a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Line */}
      <path d={pathD} fill="none" stroke="#1a2e5a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Points */}
      {dataPoints.map((d, i) => (
        <g key={i}>
          <circle cx={xScale(i)} cy={yScale(d.score)} r="5" fill="#fff" stroke="#1a2e5a" strokeWidth="2.5" />
          <text x={xScale(i)} y={yScale(d.score) - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#1a2e5a">{d.score}%</text>
          <text x={xScale(i)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="8" fill="#94a3b8">{d.label}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── AI LEARNING PROGRESS TRACKER ─────────────────────────────────────────
function LearningProgressTracker({ submissions, studentName }) {
  const [loading, setLoading]   = useState(false)
  const [insights, setInsights] = useState(null)
  const [error, setError]       = useState(null)
  const [expanded, setExpanded] = useState(false)

  // Only use submissions that have been scored (final or AI score, not flagged AI)
  const scoredSubmissions = submissions.filter(s =>
    (s.final_score !== null || (s.ai_score !== null && s.ai_score > 0)) &&
    s.ai_detection_score < 50
  ).sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))

  // Build trend data points
  const trendData = scoredSubmissions.map(s => ({
    label: s.assignment_title.split(' ').slice(0, 2).join(' '),
    score: s.final_score !== null
      ? Math.round((s.final_score / s.max_score) * 100)
      : Math.round((s.ai_score / s.max_score) * 100),
    title: s.assignment_title,
  }))

  // Compute improvement delta
  const improvementDelta = trendData.length >= 2
    ? trendData[trendData.length - 1].score - trendData[0].score
    : null

  // Aggregate rubric weakness across all submissions
  const allRubric = {}
  scoredSubmissions.forEach(s => {
    s.rubric_breakdown?.forEach(b => {
      if (!allRubric[b.criterion]) allRubric[b.criterion] = []
      allRubric[b.criterion].push(b.pct)
    })
  })
  const avgRubric = Object.entries(allRubric).map(([criterion, pcts]) => ({
    criterion,
    avg: Math.round(pcts.reduce((a,b) => a+b, 0) / pcts.length),
  })).sort((a,b) => a.avg - b.avg)

  const weakestArea   = avgRubric[0]
  const strongestArea = avgRubric[avgRubric.length - 1]

  const runAnalysis = async () => {
    if (insights) { setExpanded(true); return }
    setExpanded(true)
    setLoading(true)
    setError(null)

    const essaySummary = scoredSubmissions.map((s, i) =>
      `Essay ${i+1}: "${s.assignment_title}" — Score: ${s.final_score ?? s.ai_score}/${s.max_score} — Submitted: ${new Date(s.submitted_at).toLocaleDateString('en-GB')}${s.rubric_breakdown?.length ? '\n  Rubric: ' + s.rubric_breakdown.map(b => `${b.criterion} ${b.pct}%`).join(', ') : ''}`
    ).join('\n')

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are an encouraging academic progress advisor for university students. You analyse a student's essay submission history and return ONLY valid JSON — no markdown, no preamble — in this exact shape:
{
  "dna_title": "A creative 4-word writing style title e.g. 'The Analytical Evidence Builder'",
  "dna_summary": "2-3 sentences describing this student's overall writing personality and patterns across all their essays",
  "trend_insight": "1-2 sentences about their score trend — are they improving, consistent, or dropping? Be encouraging.",
  "strengths": ["strength 1 observed across essays", "strength 2"],
  "growth_areas": ["area needing work 1", "area needing work 2"],
  "recommendations": [
    { "title": "short action title", "detail": "1 concrete sentence on what to do before next essay" },
    { "title": "short action title", "detail": "1 concrete sentence on what to do before next essay" },
    { "title": "short action title", "detail": "1 concrete sentence on what to do before next essay" }
  ]
}
Be specific to the actual essay titles and scores. Be warm and encouraging — never discouraging.`,
          messages: [{
            role: 'user',
            content: `Student: ${studentName}\nNumber of essays: ${scoredSubmissions.length}\n\nSubmission history:\n${essaySummary}`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.map(b => b.text || '').join('') || ''
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      setInsights(parsed)
    } catch {
      setError('Could not generate insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (scoredSubmissions.length < 2) return null

  return (
    <div style={{ marginTop: 40 }}>
      {/* ── SECTION HEADER ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <p style={{ fontSize:20, fontWeight:800, color:'#1e293b', margin:0 }}>📈 AI Learning Progress Tracker</p>
          <p style={{ fontSize:13, color:'#94a3b8', margin:'2px 0 0' }}>AI analysis of all your essays together — your growth over time</p>
        </div>
        <button
          onClick={runAnalysis}
          style={{ padding:'10px 20px', background:`linear-gradient(135deg,#1a2e5a,#2d4a8a)`, border:'none', borderRadius:12, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 14px #1a2e5a50', whiteSpace:'nowrap', transition:'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform='none'}>
          🧠 {insights ? 'View My Insights' : 'Generate AI Insights'}
        </button>
      </div>

      {/* ── QUICK STATS ROW ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, marginBottom:20 }}>
        {[
          {
            icon:'📝', label:'Essays Analysed', value: scoredSubmissions.length,
            bg:'#eff6ff', color:'#2563eb',
          },
          {
            icon: improvementDelta > 0 ? '📈' : improvementDelta < 0 ? '📉' : '➡️',
            label:'Score Change',
            value: improvementDelta !== null ? `${improvementDelta > 0 ? '+' : ''}${improvementDelta}%` : '—',
            bg: improvementDelta > 0 ? '#f0fdf4' : improvementDelta < 0 ? '#fef2f2' : '#f8fafc',
            color: improvementDelta > 0 ? '#16a34a' : improvementDelta < 0 ? '#dc2626' : '#64748b',
          },
          {
            icon:'💪', label:'Strongest Area',
            value: strongestArea ? strongestArea.criterion.charAt(0).toUpperCase() + strongestArea.criterion.slice(1) : '—',
            sub: strongestArea ? `${strongestArea.avg}% avg` : '',
            bg:'#f0fdf4', color:'#15803d',
          },
          {
            icon:'🎯', label:'Focus Area',
            value: weakestArea ? weakestArea.criterion.charAt(0).toUpperCase() + weakestArea.criterion.slice(1) : '—',
            sub: weakestArea ? `${weakestArea.avg}% avg` : '',
            bg:'#fffbeb', color:'#d97706',
          },
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

      {/* ── TREND CHART ── */}
      <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:20, marginBottom:20, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <p style={{ fontSize:13, fontWeight:800, color:'#1e293b', margin:'0 0 16px' }}>Score Trend Across Submissions</p>
        <TrendLineChart dataPoints={trendData} />
        <p style={{ fontSize:11, color:'#94a3b8', margin:'10px 0 0', textAlign:'center' }}>
          {improvementDelta > 0
            ? `🎉 Great progress! Your score has improved by ${improvementDelta}% from your first to latest submission.`
            : improvementDelta === 0
            ? '➡️ Your scores have been consistent across submissions.'
            : `Your scores have varied — the AI Writing Coach can help identify patterns.`}
        </p>
      </div>

      {/* ── RUBRIC AVERAGE BARS ── */}
      {avgRubric.length > 0 && (
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:20, marginBottom:20, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize:13, fontWeight:800, color:'#1e293b', margin:'0 0 14px' }}>Average Rubric Performance Across All Essays</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {avgRubric.slice().reverse().map(r => (
              <div key={r.criterion}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#475569', textTransform:'capitalize' }}>{r.criterion}</span>
                  <span style={{ fontSize:12, fontWeight:800, color: r.avg >= 80 ? '#16a34a' : r.avg >= 65 ? '#d97706' : '#dc2626' }}>{r.avg}%</span>
                </div>
                <div style={{ height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${r.avg}%`, borderRadius:4, transition:'width 0.8s ease', background: r.avg >= 80 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : r.avg >= 65 ? 'linear-gradient(90deg,#fbbf24,#d97706)' : 'linear-gradient(90deg,#f87171,#dc2626)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI INSIGHTS PANEL ── */}
      {expanded && (
        <div style={{ background:'#fff', borderRadius:16, border:`1.5px solid #1a2e5a25`, overflow:'hidden', boxShadow:'0 4px 20px rgba(26,46,90,0.10)' }}>
          {/* Panel header */}
          <div style={{ background:`linear-gradient(135deg,#1a2e5a,#2d4a8a)`, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:14, fontWeight:800, color:'#fff', margin:0 }}>🧠 Your AI Learning Insights</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', margin:'2px 0 0' }}>Generated by Claude AI — based on all {scoredSubmissions.length} of your essays</p>
            </div>
            <button onClick={() => setExpanded(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', padding:'4px 10px' }}>✕ Close</button>
          </div>

          <div style={{ padding:20 }}>
            {loading && (
              <div style={{ textAlign:'center', padding:'36px 0' }}>
                <div style={{ width:40, height:40, border:'3px solid #1a2e5a20', borderTopColor:'#1a2e5a', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }} />
                <p style={{ fontSize:13, color:'#64748b', margin:'0 0 4px', fontWeight:600 }}>Claude is analysing your essay journey...</p>
                <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>Reading all {scoredSubmissions.length} submissions together</p>
              </div>
            )}

            {error && (
              <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:14, textAlign:'center' }}>
                <p style={{ color:'#dc2626', fontSize:13, margin:0 }}>{error}</p>
                <button onClick={() => { setInsights(null); runAnalysis() }} style={{ marginTop:10, padding:'6px 16px', background:'#dc2626', border:'none', borderRadius:8, color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>Retry</button>
              </div>
            )}

            {insights && !loading && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                {/* Writing DNA */}
                <div style={{ background:`linear-gradient(135deg,#1a2e5a08,#c9a22715)`, border:`1px solid #c9a22740`, borderRadius:14, padding:18 }}>
                  <p style={{ fontSize:10, fontWeight:700, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px' }}>🧬 Your Writing DNA</p>
                  <p style={{ fontSize:18, fontWeight:900, color:'#1a2e5a', margin:'0 0 8px' }}>{insights.dna_title}</p>
                  <p style={{ fontSize:13, color:'#475569', margin:0, lineHeight:1.7 }}>{insights.dna_summary}</p>
                </div>

                {/* Trend insight */}
                <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:14 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'#1d4ed8', margin:'0 0 4px' }}>📈 Progress Insight</p>
                  <p style={{ fontSize:13, color:'#1e3a8a', margin:0, lineHeight:1.6 }}>{insights.trend_insight}</p>
                </div>

                {/* Strengths & Growth areas */}
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

                {/* Study Recommendations */}
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:'#1e293b', margin:'0 0 10px' }}>📚 Personalised Study Recommendations</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {insights.recommendations?.map((r, i) => (
                      <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'12px 14px' }}>
                        <div style={{ width:24, height:24, borderRadius:'50%', background:'#1a2e5a', color:'#fff', fontSize:11, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                        <div>
                          <p style={{ fontSize:12, fontWeight:700, color:'#1a2e5a', margin:'0 0 2px' }}>{r.title}</p>
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
  )
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const MOCK_ASSIGNMENTS = [
  { id:1, title:'Climate Change & Society', description:'Analyse the socio-economic impacts of climate change on developing nations.', instructions:'Write a well-structured essay (500–800 words) discussing at least three specific socio-economic impacts of climate change on developing nations.', referenceMaterial:'Climate change disproportionately affects developing nations...', rubric:{ content:35, structure:25, grammar:20, evidence:20 }, max_score:100, due_date:'2026-04-15T23:59' },
  { id:2, title:'Artificial Intelligence in Education', description:'Discuss the benefits and challenges of integrating AI tools in secondary schools.', instructions:'Write an argumentative essay (400–600 words) presenting both sides of AI integration in secondary schools.', referenceMaterial:'AI in education benefits: personalised learning, automated grading...', rubric:{ argumentation:40, structure:25, grammar:20, evidence:15 }, max_score:100, due_date:'2026-04-20T23:59' },
  { id:3, title:'The Role of Entrepreneurs in Africa', description:'Examine how entrepreneurship drives economic development in African economies.', instructions:'Write a 500–700 word essay on entrepreneurship in at least two African countries.', referenceMaterial:'African entrepreneurship: fintech (M-Pesa, Kenya)...', rubric:{ content:30, structure:25, grammar:20, examples:25 }, max_score:100, due_date:'2026-02-01T23:59' },
]

const PRE_SUBMISSION = {
  id:100, assignment_id:1, assignment_title:'Climate Change & Society', max_score:100,
  essay_text:`Climate change is one of the most pressing global challenges, and its socio-economic impacts on developing nations are particularly severe.\n\nFirstly, food insecurity is a major consequence. In Sub-Saharan Africa, over 60% of the population relies on rain-fed agriculture. The IPCC (2022) projects crop yields could fall by up to 25% by 2050.\n\nSecondly, economic losses are severe. The World Bank (2023) estimates developing nations lose 5% of GDP annually due to climate-related disasters.\n\nThirdly, mass displacement is rising. The IOM (2021) recorded over 30 million internal climate displacements in 2020 alone.\n\nIn conclusion, climate change is a development crisis requiring urgent global cooperation and financial support for affected nations.`,
  submitted_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  submit_mode:'write', file_name:null, ai_score:null, ai_detection_score:null, final_score:null, ai_feedback:null, teacher_feedback:null, status:'pending', rubric_breakdown:[],
}

const INITIAL_SUBMISSIONS = [
  PRE_SUBMISSION,
  { id:101, assignment_id:98, assignment_title:'Democracy & Governance in Africa', max_score:100, essay_text:`Democracy in Africa has undergone significant transformation since the wave of independence in the 1960s. While early post-colonial governments often slid into authoritarianism, recent decades have seen gradual consolidation of democratic practices.\n\nCountries like Botswana have maintained stable multiparty democracy since independence.\n\nHowever, challenges persist. Electoral violence in Kenya's 2007–2008 post-election crisis and military coups in Mali and Burkina Faso (2021–2022) highlight the fragility of democratic institutions.\n\nIn conclusion, democracy in Africa is neither uniformly fragile nor strong. Sustained civic education and regional accountability are essential to deepening democratic culture.`, submitted_at:'2026-02-20T09:15:00', submit_mode:'write', file_name:null, ai_score:88, ai_detection_score:8, final_score:85, ai_feedback:`Overall Assessment: An impressive, well-researched essay.\n\nContent (31/35): Excellent coverage with specific country examples.\n\nStructure (23/25): Clear introduction, coherent body paragraphs, and strong conclusion.\n\nGrammar (19/20): Fluent and sophisticated writing.\n\nEvidence (12/20): Good use of historical events.\n\nAI Detection: Very low AI involvement (~8%). Appears authentically written.`, teacher_feedback:"Excellent work, Alice! Your analysis of Botswana and Rwanda showed real depth. One of the strongest essays in the class. Well done!", status:'graded', rubric_breakdown:[{criterion:'content',earned:31,weight:35,pct:89},{criterion:'structure',earned:23,weight:25,pct:92},{criterion:'grammar',earned:19,weight:20,pct:95},{criterion:'evidence',earned:12,weight:20,pct:60}] },
  { id:102, assignment_id:99, assignment_title:'Water Scarcity & Human Rights', max_score:100, essay_text:`Access to clean water is recognised as a fundamental human right under UN Resolution 64/292 (2010), yet over 2 billion people lack safe drinking water.\n\nIn Malawi, communities in Nsanje and Chikwawa face seasonal shortages forcing families to drink from contaminated sources.`, submitted_at:'2026-03-01T14:30:00', submit_mode:'write', file_name:null, ai_score:79, ai_detection_score:22, final_score:null, ai_feedback:`Overall Assessment: A well-structured essay linking water scarcity to human rights frameworks.\n\nContent (27/35): Strong local examples.\n\nStructure (22/25): Clear structure.\n\nGrammar (18/20): Well-written with minor tense inconsistencies.\n\nEvidence (12/20): Good sources.\n\nAI Detection: Low AI involvement (~22%). Largely original voice.`, teacher_feedback:null, status:'ai_graded', rubric_breakdown:[{criterion:'content',earned:27,weight:35,pct:77},{criterion:'structure',earned:22,weight:25,pct:88},{criterion:'grammar',earned:18,weight:20,pct:90},{criterion:'evidence',earned:12,weight:20,pct:60}] },
  { id:103, assignment_id:97, assignment_title:'Globalisation & Inequality', max_score:100, essay_text:`Globalisation represents a multifaceted phenomenon that has fundamentally transformed the economic landscape. The intersection of trade liberalisation, technological advancement, and capital mobility has created opportunities while exacerbating inequalities.`, submitted_at:'2026-03-03T11:00:00', submit_mode:'write', file_name:null, ai_score:0, ai_detection_score:81, final_score:null, ai_feedback:`⚠️ HIGH AI CONTENT DETECTED\n\nAn estimated 81% of this essay appears AI-generated.\n\nPer academic integrity policy, essays with ≥50% AI content receive a score of 0/100.\n\nIndicators:\n• Unnaturally uniform sentence structure\n• Generic phrasing with no personal examples\n\nPlease rewrite in your own voice with specific examples.`, teacher_feedback:null, status:'ai_graded', rubric_breakdown:[] },
]


const NAVY      = '#1a2e5a'
const NAVY_DARK = '#0f1d3a'
const GOLD      = '#c9a227'
const GOLD_L    = '#e8c547'

const badge = c => ({
  display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700,
  background: c==='green'?'#f0fdf4':c==='red'?'#fef2f2':c==='amber'?'#fffbeb':c==='purple'?'#fdf4ff':c==='gray'?'#f1f5f9':'#eff6ff',
  color:       c==='green'?'#16a34a':c==='red'?'#dc2626':c==='amber'?'#d97706':c==='purple'?'#9333ea':c==='gray'?'#64748b':'#2563eb',
})

function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.65)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200, backdropFilter:'blur(4px)' }}>
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
  )
}

function UnderDevelopmentModal({ feature, onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(4px)', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:24, padding:'40px 36px', maxWidth:400, width:'100%', textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,0.2)', animation:'cardIn 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🚧</div>
        <h2 style={{ fontWeight:800, fontSize:20, color:'#1e293b', marginBottom:8 }}>Under Development</h2>
        <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, marginBottom:8 }}><strong style={{ color: NAVY }}>{feature}</strong> is currently being built by a team member.</p>
        <p style={{ fontSize:13, color:'#94a3b8', marginBottom:28 }}>It will be available in the next sprint. Check back soon!</p>
        <div style={{ background:'#fffbeb', border:`1px solid ${GOLD}40`, borderRadius:12, padding:'10px 16px', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18 }}>👷</span>
          <p style={{ fontSize:12, color:'#92400e', margin:0, textAlign:'left', fontWeight:600 }}>Sprint 2 feature — coming soon</p>
        </div>
        <button onClick={onClose} style={{ width:'100%', padding:'12px', background:`linear-gradient(135deg,${NAVY},${NAVY_DARK})`, border:'none', borderRadius:12, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>Got it!</button>
      </div>
    </div>
  )
}

function ResultCard({ s, onClick, scoreColor, scoreLabel }) {
  const [hovered, setHovered] = useState(false)
  const pct = s.final_score !== null ? Math.round((s.final_score / s.max_score) * 100) : null
  const isAI = s.ai_detection_score >= 50
  const isPending = s.status === 'pending'
  const hoverBg = isAI ? '#fff5f5' : s.final_score !== null ? '#f0fdf4' : isPending ? '#f8fafc' : '#faf5ff'
  const borderColor = hovered ? (isAI ? '#fca5a5' : s.final_score !== null ? '#86efac' : isPending ? '#cbd5e1' : `${GOLD}80`) : '#e2e8f0'
  return (
    <div onClick={() => !isPending && onClick(s)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? hoverBg : '#fff', borderRadius:16, border:`1.5px solid ${borderColor}`, padding:20, marginBottom:12, boxShadow: hovered ? '0 6px 24px rgba(26,46,90,0.10)' : '0 1px 4px rgba(0,0,0,0.03)', cursor: isPending ? 'default' : 'pointer', transition:'all 0.2s ease', opacity: isPending ? 0.78 : 1, transform: hovered && !isPending ? 'translateY(-2px)' : 'none' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:6, marginBottom:4 }}>
            <span style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{s.assignment_title}</span>
            {s.submit_mode === 'upload' && s.file_name && <span style={badge('purple')}>📎 File</span>}
            {s.final_score !== null && <span style={badge('green')}>✅ Graded</span>}
            {!isPending && s.final_score === null && s.ai_score !== null && !isAI && <span style={badge('amber')}>⏳ Pending</span>}
            {!isPending && s.final_score === null && s.ai_score !== null && isAI  && <span style={badge('red')}>🚨 AI Flagged</span>}
            {isPending && <span style={badge('gray')}>🤖 Grading...</span>}
          </div>
          <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Submitted {new Date(s.submitted_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          {s.final_score !== null ? (
            <div>
              <p style={{ fontSize:26, fontWeight:900, color:scoreColor(pct), margin:0, lineHeight:1 }}>{s.final_score}<span style={{ fontSize:13, color:'#94a3b8' }}>/{s.max_score}</span></p>
              <p style={{ fontSize:12, fontWeight:700, color:scoreColor(pct), margin:'2px 0 0' }}>{scoreLabel(pct)} · {pct}%</p>
            </div>
          ) : isPending ? (
            <div style={{ width:28, height:28, border:'3px solid #e2e8f0', borderTopColor: NAVY, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          ) : s.ai_score !== null ? (
            <div>
              <p style={{ fontSize:14, color: NAVY, fontWeight:800, margin:0 }}>{s.ai_score}/{s.max_score}</p>
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
      {!isPending && <p style={{ fontSize:12, color: hovered ? GOLD : '#94a3b8', margin:'10px 0 0', fontWeight: hovered ? 700 : 500, transition:'color 0.2s' }}>{hovered ? 'View full details →' : 'Tap to view full details →'}</p>}
      {isPending && <p style={{ fontSize:12, color:'#94a3b8', margin:'10px 0 0' }}>AI is reviewing your essay, please wait...</p>}
    </div>
  )
}

function SentenceHighlighter({ text, aiPct }) {
  const [showHighlight, setShowHighlight] = useState(false)
  const [sentences, setSentences]         = useState([])
  const [tooltip, setTooltip]             = useState(null)
  useEffect(() => { setSentences(analyzeSentences(text, aiPct || 0)) }, [text, aiPct])
  const riskBg     = r => r >= 60 ? '#ef444428' : r >= 35 ? '#f59e0b22' : 'transparent'
  const riskBorder = r => r >= 60 ? '#ef4444'   : r >= 35 ? '#f59e0b'   : 'transparent'
  const riskLabel  = r => r >= 60 ? 'High AI risk' : r >= 35 ? 'Moderate AI risk' : 'Likely human'
  return (
    <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em' }}>Your Submission</span>
          <span style={{ fontSize:11, color:'#94a3b8' }}>{text?.trim().split(/\s+/).filter(Boolean).length} words</span>
        </div>
        {aiPct > 0 && (
          <button onClick={() => setShowHighlight(h => !h)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:20, border:`1.5px solid ${showHighlight ? '#ef4444' : NAVY}`, background: showHighlight ? '#fef2f2' : `${NAVY}10`, color: showHighlight ? '#dc2626' : NAVY, fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
            🔬 {showHighlight ? 'Hide AI Scan' : 'Show AI Scan'}
          </button>
        )}
      </div>
      {showHighlight && (
        <div style={{ display:'flex', gap:14, marginBottom:10, flexWrap:'wrap' }}>
          {[{bg:'#ef444428',border:'#ef4444',label:'High AI risk (≥60%)'},{bg:'#f59e0b22',border:'#f59e0b',label:'Moderate (35–59%)'},{bg:'transparent',border:'#d1d5db',label:'Likely human'}].map(l => (
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:12, height:12, borderRadius:3, background:l.bg, border:`1.5px solid ${l.border}`, display:'inline-block' }} />
              <span style={{ fontSize:10, color:'#64748b' }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ position:'relative' }}>
        {showHighlight ? (
          <p style={{ fontSize:13, color:'#475569', lineHeight:'2.1', margin:0 }}>
            {sentences.map((s, i) => (
              <span key={i} onMouseEnter={e => setTooltip({ idx:i, x:e.clientX, y:e.clientY })} onMouseLeave={() => setTooltip(null)}
                style={{ background: riskBg(s.risk), borderBottom: s.risk >= 35 ? `2px solid ${riskBorder(s.risk)}` : 'none', borderRadius:3, padding: s.risk >= 35 ? '1px 2px' : '0', cursor: s.risk >= 35 ? 'help' : 'default', transition:'background 0.2s' }}>
                {s.sentence}{i < sentences.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        ) : (
          <p style={{ fontSize:13, color:'#475569', lineHeight:'1.85', margin:0, whiteSpace:'pre-wrap' }}>{text}</p>
        )}
        {tooltip && sentences[tooltip.idx]?.risk >= 35 && (
          <div style={{ position:'fixed', top: tooltip.y - 64, left: tooltip.x - 80, background:'#1e293b', color:'#fff', padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:600, zIndex:9999, pointerEvents:'none', whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}>
            {riskLabel(sentences[tooltip.idx].risk)} · {sentences[tooltip.idx].risk}% AI score
          </div>
        )}
      </div>
    </div>
  )
}

function ImprovementCoach({ submission }) {
  const [open, setOpen]               = useState(false)
  const [loading, setLoading]         = useState(false)
  const [suggestions, setSuggestions] = useState(null)
  const [error, setError]             = useState(null)
  const runCoach = async () => {
    setOpen(true)
    if (suggestions) return
    setLoading(true); setError(null)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000,
          system:`You are an academic writing coach for university students. Analyse the essay and return ONLY valid JSON — no markdown, no preamble — in this exact shape:
{"overall":"2-sentence overall impression","suggestions":[{"type":"strength"|"weakness"|"tip","title":"short title","detail":"1-2 sentences of specific advice"}],"rewrite":{"original":"exact sentence from the essay that could be improved","improved":"your improved version of that sentence","why":"brief reason"}}
Give exactly 4 suggestions. Be specific, reference the actual essay content.`,
          messages:[{ role:'user', content:`Assignment: ${submission.assignment_title}\n\nEssay:\n${submission.essay_text}` }]
        })
      })
      const data = await res.json()
      const text = data.content?.map(b => b.text||'').join('') || ''
      setSuggestions(JSON.parse(text.replace(/```json|```/g,'').trim()))
    } catch { setError('Could not load suggestions. Please try again.') }
    finally { setLoading(false) }
  }
  const typeStyle = t => ({ strength:{ bg:'#f0fdf4', border:'#86efac', icon:'💪', color:'#15803d' }, weakness:{ bg:'#fef2f2', border:'#fecaca', icon:'⚠️', color:'#dc2626' }, tip:{ bg:'#eff6ff', border:'#bfdbfe', icon:'💡', color:'#2563eb' } }[t] || { bg:'#f8fafc', border:'#e2e8f0', icon:'📝', color:'#64748b' })
  return (
    <div style={{ marginBottom:14 }}>
      <button onClick={runCoach} onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform='none'}
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
            {loading && <div style={{ textAlign:'center', padding:'28px 0' }}><div style={{ width:36, height:36, border:`3px solid ${NAVY}20`, borderTopColor:NAVY, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} /><p style={{ fontSize:13, color:'#64748b', margin:0 }}>Claude is analysing your essay...</p></div>}
            {error && <p style={{ color:'#dc2626', fontSize:13, textAlign:'center' }}>{error}</p>}
            {suggestions && !loading && (
              <>
                <p style={{ fontSize:13, color:'#475569', lineHeight:1.7, marginBottom:14, padding:'10px 14px', background:'#f8fafc', borderRadius:10, border:'1px solid #e2e8f0' }}>{suggestions.overall}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                  {suggestions.suggestions?.map((s, i) => { const ts = typeStyle(s.type); return <div key={i} style={{ background:ts.bg, border:`1px solid ${ts.border}`, borderRadius:10, padding:'10px 12px' }}><p style={{ fontSize:12, fontWeight:700, color:ts.color, margin:'0 0 4px' }}>{ts.icon} {s.title}</p><p style={{ fontSize:12, color:'#475569', margin:0, lineHeight:1.6 }}>{s.detail}</p></div> })}
                </div>
                {suggestions.rewrite && (
                  <div style={{ background:`${GOLD}12`, border:`1px solid ${GOLD}50`, borderRadius:10, padding:14 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 8px' }}>✍️ Suggested Rewrite</p>
                    <div style={{ background:'#fef2f2', borderRadius:8, padding:'8px 12px', marginBottom:8 }}><p style={{ fontSize:11, color:'#94a3b8', margin:'0 0 3px', fontWeight:600 }}>ORIGINAL</p><p style={{ fontSize:12, color:'#7f1d1d', margin:0, fontStyle:'italic' }}>"{suggestions.rewrite.original}"</p></div>
                    <div style={{ background:'#f0fdf4', borderRadius:8, padding:'8px 12px', marginBottom:8 }}><p style={{ fontSize:11, color:'#94a3b8', margin:'0 0 3px', fontWeight:600 }}>IMPROVED</p><p style={{ fontSize:12, color:'#14532d', margin:0, fontWeight:600 }}>"{suggestions.rewrite.improved}"</p></div>
                    <p style={{ fontSize:11, color:'#92400e', margin:0 }}>💬 {suggestions.rewrite.why}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


export default function Results() {
  const [tab, setTab]                 = useState('results')
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS)
  const [resultModal, setResultModal] = useState(null)
  const [activeTab, setActiveTab]     = useState('overview')
  const [toast, setToast]             = useState(null)
  const [underDevModal, setUnderDevModal] = useState(null)
  const [menuOpen, setMenuOpen]       = useState(false)

  const showToast = (msg, type='success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const studentName = user.full_name || user.name || 'Alice Mwale'

  useEffect(() => {
    const assignment = MOCK_ASSIGNMENTS.find(a => a.id === PRE_SUBMISSION.assignment_id)
    mockAiGrade({ essayText: PRE_SUBMISSION.essay_text, assignment }).then(result => {
      const aiScore = result.ai_detection_percentage >= 50 ? 0 : result.total_score
      setSubmissions(prev => prev.map(s =>
        s.id === PRE_SUBMISSION.id
          ? { ...s, ai_score: aiScore, ai_feedback: result.overall_feedback, ai_detection_score: result.ai_detection_percentage, status:'ai_graded', rubric_breakdown: result.rubric_breakdown || [] }
          : s
      ))
    })
  }, [])

  const openModal = s => { setResultModal(s); setActiveTab('overview') }
  const graded = submissions.filter(s => s.final_score !== null)
  const avgPct = graded.length ? Math.round(graded.reduce((sum,s) => sum+(s.final_score/s.max_score)*100, 0)/graded.length) : null
  const canUnsubmit = sub => { const a = MOCK_ASSIGNMENTS.find(a => a.id===sub.assignment_id); return sub.final_score===null && a && new Date()<new Date(a.due_date) }
  const handleUnsubmit = sub => { setSubmissions(p => p.filter(s => s.id!==sub.id)); setResultModal(null); showToast('↩ Essay unsubmitted.') }
  const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626'
  const scoreLabel = p => p >= 70 ? 'Pass' : p >= 50 ? 'Borderline' : 'Fail'
  const sL = { display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }

  return (
    <div style={{ minHeight:'100vh', background:'#f5f7fb', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes cardIn { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .nav-link { color:rgba(255,255,255,0.82); text-decoration:none; font-size:0.88rem; font-weight:500; padding:7px 14px; border-radius:6px; transition:all 0.2s; }
        .nav-link:hover { color:#fff; background:rgba(255,255,255,0.10); }
        .profile-pill { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:20px; padding:4px 14px 4px 4px; }
        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:8px; background:none; border:none; }
        .hamburger span { width:24px; height:2px; background:white; border-radius:2px; display:block; }
        .modal-tab { flex:1; padding:8px 4px; border-radius:8px; border:none; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s; }
        .modal-tab.active { background:${NAVY}; color:#fff; }
        .modal-tab.inactive { background:transparent; color:#64748b; }
        .modal-tab.inactive:hover { background:#f1f5f9; color:#1e293b; }
        .fade-in { animation:fadeIn 0.22s ease; }
        @media (max-width:700px) {
          .nav-links-row { display:none !important; }
          .hamburger { display:flex !important; }
          .nav-links-row.open { display:flex !important; flex-direction:column; position:absolute; top:68px; left:0; right:0; background:${NAVY}; padding:12px 16px; gap:4px; z-index:999; }
        }
      `}</style>

      {toast && (
        <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:999, background: toast.type==='error'?'#fef2f2':'#f0fdf4', border:`1px solid ${toast.type==='error'?'#fecaca':'#bbf7d0'}`, color: toast.type==='error'?'#dc2626':'#15803d', padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:700, boxShadow:'0 4px 20px rgba(0,0,0,0.12)', maxWidth:'90vw', textAlign:'center' }}>
          {toast.msg}
        </div>
      )}
      {underDevModal && <UnderDevelopmentModal feature={underDevModal} onClose={() => setUnderDevModal(null)} />}

     

      {}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px 60px' }}>

        {}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:28 }}>
          {[
            { label:'To Submit', value: MOCK_ASSIGNMENTS.filter(a => !submissions.find(s=>s.assignment_id===a.id) && new Date()<new Date(a.due_date)).length, icon:'📋', bg:`${NAVY}18` },
            { label:'Submitted', value: submissions.length, icon:'📝', bg:`${GOLD}20` },
            { label:'Avg Score', value: avgPct!==null?`${avgPct}%`:'—', icon:'⭐', bg:'#f0fdf4' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:16, padding:'14px 16px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, flexShrink:0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize:22, fontWeight:900, color:'#1e293b', margin:0, lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:11, color:'#94a3b8', margin:'3px 0 0', fontWeight:500 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 1 — INDIVIDUAL ESSAY RESULTS*/}
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

        {submissions.length === 0 && (
          <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'48px 24px', textAlign:'center' }}>
            <p style={{ fontSize:36, margin:'0 0 10px' }}>📭</p>
            <p style={{ fontWeight:700, color:'#64748b', fontSize:14, margin:0 }}>No submissions yet.</p>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(480px,1fr))', gap:0 }}>
          {submissions.map(s => <ResultCard key={s.id} s={s} onClick={openModal} scoreColor={scoreColor} scoreLabel={scoreLabel} />)}
        </div>

        {/* {
            SECTION 2 — AI LEARNING PROGRESS TRACKER } */}
        <LearningProgressTracker submissions={submissions} studentName={studentName} />

      </div>

      {}
      {resultModal && (
        <Sheet
          onClose={() => setResultModal(null)}
          title={resultModal.assignment_title}
          subtitle={`Submitted ${new Date(resultModal.submitted_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`}
          footer={
            <div style={{ display:'flex', gap:10 }}>
              {canUnsubmit(resultModal) && (
                <button onClick={() => { if(window.confirm('Unsubmit?')) handleUnsubmit(resultModal) }}
                  style={{ flex:1, padding:13, background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:12, color:'#dc2626', fontWeight:700, fontSize:14, cursor:'pointer' }}>
                  ↩ Unsubmit
                </button>
              )}
              <button onClick={() => setResultModal(null)} style={{ flex:1, padding:13, background:'#f1f5f9', border:'none', borderRadius:12, color:'#64748b', fontWeight:700, fontSize:14, cursor:'pointer' }}>Close</button>
            </div>
          }>

          <div style={{ display:'flex', gap:4, marginBottom:18, background:'#f8fafc', borderRadius:10, padding:4 }}>
            {[['overview','📊 Overview'],['ai analysis','🔬 AI Analysis'],['writing coach','🧠 Writing Coach']].map(([t,label]) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`modal-tab ${activeTab===t?'active':'inactive'}`}>{label}</button>
            ))}
          </div>

          {activeTab==='overview' && (
            <div className="fade-in">
              {resultModal.final_score !== null ? (() => {
                const pct = Math.round((resultModal.final_score/resultModal.max_score)*100)
                const bg = pct>=70?`linear-gradient(135deg,${NAVY},${NAVY_DARK})`:pct>=50?'linear-gradient(135deg,#f59e0b,#d97706)':'linear-gradient(135deg,#ef4444,#dc2626)'
                return (
                  <div style={{ background:bg, borderRadius:16, padding:'24px 20px', textAlign:'center', marginBottom:18, boxShadow:'0 6px 24px rgba(0,0,0,0.15)' }}>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 6px' }}>Final Score</p>
                    <p style={{ fontSize:52, fontWeight:900, color:'#fff', margin:0, lineHeight:1 }}>{resultModal.final_score}<span style={{ fontSize:22, opacity:0.55 }}>/{resultModal.max_score}</span></p>
                    <div style={{ display:'flex', justifyContent:'center', gap:10, marginTop:8 }}>
                      <span style={{ color:'rgba(255,255,255,0.85)', fontSize:16, fontWeight:700 }}>{pct}%</span>
                      <span style={{ background:'rgba(255,255,255,0.18)', color:'#fff', fontSize:12, fontWeight:700, padding:'2px 10px', borderRadius:20 }}>{scoreLabel(pct)}</span>
                    </div>
                    {resultModal.rubric_breakdown?.length > 0 && <div style={{ display:'flex', justifyContent:'center', marginTop:16 }}><RadarChart breakdown={resultModal.rubric_breakdown} size={180} /></div>}
                  </div>
                )
              })() : resultModal.ai_detection_score >= 50 ? (
                <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:14, padding:20, textAlign:'center', marginBottom:18 }}>
                  <p style={{ fontSize:26, margin:'0 0 8px' }}>🚨</p>
                  <p style={{ fontWeight:800, color:'#dc2626', fontSize:15, margin:'0 0 4px' }}>AI Content Detected</p>
                  <p style={{ fontSize:13, color:'#b91c1c', margin:'0 0 4px' }}>{resultModal.ai_detection_score}% AI-generated — Automatic score: 0</p>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Awaiting teacher review</p>
                </div>
              ) : resultModal.ai_score !== null ? (
                <div>
                  <div style={{ background:'#fffbeb', border:`1px solid ${GOLD}60`, borderRadius:14, padding:20, textAlign:'center', marginBottom:14 }}>
                    <p style={{ fontSize:24, margin:'0 0 6px' }}>⏳</p>
                    <p style={{ fontWeight:800, color:'#92400e', fontSize:15, margin:'0 0 4px' }}>Awaiting Teacher Approval</p>
                    <p style={{ fontSize:13, color:'#78350f', margin:0 }}>AI suggested <strong>{resultModal.ai_score}/{resultModal.max_score}</strong></p>
                  </div>
                  {resultModal.rubric_breakdown?.length > 0 && (
                    <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:16, marginBottom:14, display:'flex', flexDirection:'column', alignItems:'center' }}>
                      <span style={{ ...sL, marginBottom:12 }}>📊 Rubric Breakdown</span>
                      <RadarChart breakdown={resultModal.rubric_breakdown} size={200} />
                      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:12, justifyContent:'center' }}>
                        {resultModal.rubric_breakdown.map(b => (
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
              {resultModal.ai_feedback && <div style={{ background:`${NAVY}0a`, border:`1px solid ${NAVY}25`, borderRadius:12, padding:16, marginBottom:14 }}><span style={{ ...sL, color:NAVY }}>🤖 AI Feedback</span><p style={{ fontSize:13, color:'#1e293b', margin:0, lineHeight:'1.85', whiteSpace:'pre-wrap' }}>{resultModal.ai_feedback}</p></div>}
              {resultModal.teacher_feedback && <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:16, marginBottom:14 }}><span style={{ ...sL, color:'#15803d' }}>👨‍🏫 Teacher Feedback</span><p style={{ fontSize:13, color:'#1e293b', margin:0, lineHeight:'1.85' }}>{resultModal.teacher_feedback}</p></div>}
              <SentenceHighlighter text={resultModal.essay_text} aiPct={null} />
            </div>
          )}

          {activeTab==='ai analysis' && (
            <div className="fade-in">
              {resultModal.ai_detection_score !== null ? (
                <>
                  <div style={{ background: resultModal.ai_detection_score>=50?'#fef2f2':'#f0fdf4', border:`1px solid ${resultModal.ai_detection_score>=50?'#fecaca':'#bbf7d0'}`, borderRadius:14, padding:20, marginBottom:16, textAlign:'center' }}>
                    <p style={{ fontSize:48, fontWeight:900, color: resultModal.ai_detection_score>=50?'#dc2626':'#16a34a', margin:'0 0 4px' }}>{resultModal.ai_detection_score}%</p>
                    <p style={{ fontSize:13, fontWeight:700, color:'#475569', margin:'0 0 14px' }}>{resultModal.ai_detection_score>=50?'🚨 High AI Content — Policy Violation':resultModal.ai_detection_score>=30?'⚠️ Moderate AI Signals Detected':'✅ Largely Human-Written'}</p>
                    <div style={{ height:12, background:'#e2e8f0', borderRadius:6, overflow:'hidden', position:'relative' }}>
                      <div style={{ height:'100%', width:`${resultModal.ai_detection_score}%`, background: resultModal.ai_detection_score>=50?'linear-gradient(90deg,#f59e0b,#ef4444)':'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius:6 }} />
                      <div style={{ position:'absolute', top:0, left:'50%', width:2, height:'100%', background:'#94a3b8' }} />
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
                    <SentenceHighlighter text={resultModal.essay_text} aiPct={resultModal.ai_detection_score} />
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

          {activeTab==='writing coach' && (
            <div className="fade-in">
              <div style={{ background:`linear-gradient(135deg,${NAVY}08,${GOLD}12)`, border:`1px solid ${NAVY}20`, borderRadius:14, padding:16, marginBottom:16 }}>
                <p style={{ fontWeight:800, fontSize:14, color:NAVY, margin:'0 0 4px' }}>🧠 AI Writing Coach — Powered by Claude</p>
                <p style={{ fontSize:12, color:'#64748b', margin:0, lineHeight:1.6 }}>Get personalised AI feedback on your essay: strengths, weaknesses, specific improvement tips, and a before/after sentence rewrite example.</p>
              </div>
              <ImprovementCoach submission={resultModal} />
              <SentenceHighlighter text={resultModal.essay_text} aiPct={resultModal.ai_detection_score} />
            </div>
          )}
        </Sheet>
      )}
    </div>
  )
}