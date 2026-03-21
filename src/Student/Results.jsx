import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ─── MOCK AI GRADER (no backend needed) ────────────────────────────────────
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
    return { total_score: 0, ai_detection_percentage: aiPct, overall_feedback: `⚠️ HIGH AI CONTENT DETECTED\n\nAn estimated ${aiPct}% of this essay appears AI-generated.\n\nPer academic integrity policy, essays with ≥50% AI content receive a score of 0/100.\n\nIndicators:\n• ${!hasPersonalVoice ? 'No personal voice or first-person examples\n• ' : ''}${genericCount > 2 ? 'Overuse of generic academic phrases\n• ' : ''}${variance < 3 ? 'Unnaturally uniform sentence structure\n• ' : ''}Vocabulary patterns consistent with LLM output\n\nPlease rewrite in your own words with specific examples.` }
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
  const weakest = breakdown.reduce((a,b) => a.pct < b.pct ? a : b)
  const improveTip = { evidence:'specific citations and real-world examples', examples:'country-specific or dated examples', structure:'clear paragraph transitions and a stronger conclusion', grammar:'proofreading for tense and agreement errors', content:'deeper analysis and more nuanced argument', argumentation:'stronger counterarguments and a clearer stance' }[weakest.criterion] || 'more depth and original analysis'
  const feedbackLines = [`Overall Assessment: ${qualLabel} — ${totalScore}/${assignment.max_score}\n`, ...breakdown.map(b => { const label = b.pct >= 88 ? 'Strong' : b.pct >= 76 ? 'Good' : b.pct >= 64 ? 'Satisfactory' : 'Needs work'; return `${b.criterion.charAt(0).toUpperCase() + b.criterion.slice(1)} (${b.earned}/${b.weight}): ${label}` }), `\nStrength: Your ${strongest.criterion} was the strongest area.`, `Improve: ${weakest.criterion} — consider adding ${improveTip}.`, `\nAI Detection: ${aiPct < 15 ? 'Very low' : aiPct < 30 ? 'Low' : 'Moderate'} (~${aiPct}%). ${aiPct < 20 ? 'Appears authentically written.' : 'Ensure all work is your own.'}` ]
  return { total_score: totalScore, ai_detection_percentage: aiPct, overall_feedback: feedbackLines.join('\n') }
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const MOCK_ASSIGNMENTS = [
  { id:1, title:'Climate Change & Society', description:'Analyse the socio-economic impacts of climate change on developing nations.', instructions:'Write a well-structured essay (500–800 words) discussing at least three specific socio-economic impacts of climate change on developing nations. Use examples where possible.', referenceMaterial:'Climate change disproportionately affects developing nations...', rubric:{ content:35, structure:25, grammar:20, evidence:20 }, max_score:100, due_date:'2026-04-15T23:59' },
  { id:2, title:'Artificial Intelligence in Education', description:'Discuss the benefits and challenges of integrating AI tools in secondary schools.', instructions:'Write an argumentative essay (400–600 words) presenting both sides of AI integration in secondary schools.', referenceMaterial:'AI in education benefits: personalised learning, automated grading...', rubric:{ argumentation:40, structure:25, grammar:20, evidence:15 }, max_score:100, due_date:'2026-04-20T23:59' },
  { id:3, title:'The Role of Entrepreneurs in Africa', description:'Examine how entrepreneurship drives economic development in African economies.', instructions:'Write a 500–700 word essay examining the role of entrepreneurship in driving economic development in at least two African countries.', referenceMaterial:'African entrepreneurship: fintech (M-Pesa, Kenya)...', rubric:{ content:30, structure:25, grammar:20, examples:25 }, max_score:100, due_date:'2026-02-01T23:59' },
]

const PRE_SUBMISSION = {
  id:100, assignment_id:1, assignment_title:'Climate Change & Society', max_score:100,
  essay_text:`Climate change is one of the most pressing global challenges, and its socio-economic impacts on developing nations are particularly severe.\n\nFirstly, food insecurity is a major consequence. In Sub-Saharan Africa, over 60% of the population relies on rain-fed agriculture. The IPCC (2022) projects crop yields could fall by up to 25% by 2050.\n\nSecondly, economic losses are severe. The World Bank (2023) estimates developing nations lose 5% of GDP annually due to climate-related disasters.\n\nThirdly, mass displacement is rising. The IOM (2021) recorded over 30 million internal climate displacements in 2020 alone.\n\nIn conclusion, climate change is a development crisis requiring urgent global cooperation and financial support for affected nations.`,
  submitted_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  submit_mode:'write', file_name:null, ai_score:null, ai_detection_score:null, final_score:null, ai_feedback:null, teacher_feedback:null, status:'pending',
}

const INITIAL_SUBMISSIONS = [
  PRE_SUBMISSION,
  { id:101, assignment_id:98, assignment_title:'Democracy & Governance in Africa', max_score:100, essay_text:`Democracy in Africa has undergone significant transformation since the wave of independence in the 1960s. While early post-colonial governments often slid into authoritarianism, recent decades have seen gradual consolidation of democratic practices.\n\nCountries like Botswana have maintained stable multiparty democracy since independence.\n\nHowever, challenges persist. Electoral violence in Kenya's 2007–2008 post-election crisis and military coups in Mali and Burkina Faso (2021–2022) highlight the fragility of democratic institutions.\n\nIn conclusion, democracy in Africa is neither uniformly fragile nor strong. Sustained civic education and regional accountability are essential to deepening democratic culture.`, submitted_at:'2026-02-20T09:15:00', submit_mode:'write', file_name:null, ai_score:88, ai_detection_score:8, final_score:85, ai_feedback:`Overall Assessment: An impressive, well-researched essay.\n\nContent (31/35): Excellent coverage with specific country examples — Botswana, Kenya, Mali, Burkina Faso all used effectively.\n\nStructure (23/25): Clear introduction, coherent body paragraphs, and strong conclusion.\n\nGrammar (19/20): Fluent and sophisticated writing.\n\nEvidence (12/20): Good use of historical events. More specific statistics would strengthen the argument.\n\nAI Detection: Very low AI involvement (~8%). Appears authentically written.`, teacher_feedback:"Excellent work, Alice! Your analysis of Botswana and Rwanda showed real depth. One of the strongest essays in the class. Well done!", status:'graded' },
  { id:102, assignment_id:99, assignment_title:'Water Scarcity & Human Rights', max_score:100, essay_text:`Access to clean water is recognised as a fundamental human right under UN Resolution 64/292 (2010), yet over 2 billion people lack safe drinking water.\n\nIn Malawi, communities in Nsanje and Chikwawa face seasonal shortages forcing families to drink from contaminated sources, contributing to cholera outbreaks.\n\nThe AAAQ framework (UN CESCR) requires states to ensure water availability, accessibility, acceptability, and quality. Yet many governments allocate less than 1% of GDP to WASH services (WHO, 2022).`, submitted_at:'2026-03-01T14:30:00', submit_mode:'write', file_name:null, ai_score:79, ai_detection_score:22, final_score:null, ai_feedback:`Overall Assessment: A well-structured essay linking water scarcity to human rights frameworks.\n\nContent (27/35): Strong local examples (Nsanje, Chikwawa). The AAAQ framework reference shows good research.\n\nStructure (22/25): Clear structure.\n\nGrammar (18/20): Well-written with minor tense inconsistencies.\n\nEvidence (12/20): Good sources.\n\nAI Detection: Low AI involvement (~22%). Largely original voice.`, teacher_feedback:null, status:'ai_graded' },
  { id:103, assignment_id:97, assignment_title:'Globalisation & Inequality', max_score:100, essay_text:`Globalisation represents a multifaceted phenomenon that has fundamentally transformed the economic landscape. The intersection of trade liberalisation, technological advancement, and capital mobility has created opportunities while exacerbating inequalities.\n\nThe primary mechanism through which globalisation contributes to inequality manifests in labour market dynamics.`, submitted_at:'2026-03-03T11:00:00', submit_mode:'write', file_name:null, ai_score:0, ai_detection_score:81, final_score:null, ai_feedback:`⚠️ HIGH AI CONTENT DETECTED\n\nAn estimated 81% of this essay appears AI-generated.\n\nPer academic integrity policy, essays with ≥50% AI content receive a score of 0/100.\n\nIndicators:\n• Unnaturally uniform sentence structure\n• Generic phrasing with no personal examples\n• No specific country names or dated references\n\nPlease rewrite in your own voice with specific examples and original analysis.`, teacher_feedback:null, status:'ai_graded' },
]

// ─── STYLE HELPERS ─────────────────────────────────────────────────────────
const C = {
  page: { minHeight:'100vh', background:'#f8fafc', fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif" },
  header: { background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 20px', height:62, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 8px rgba(0,0,0,0.05)' },
  main: { maxWidth:680, margin:'0 auto', padding:'24px 16px 60px' },
  card: { background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:20, marginBottom:12, boxShadow:'0 1px 4px rgba(0,0,0,0.03)' },
  sL: { display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 },
  tab: a => ({ padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background: a?'#fff':'transparent', color: a?'#6366f1':'#64748b', boxShadow: a?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all 0.2s', whiteSpace:'nowrap' }),
  badge: c => ({ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background: c==='green'?'#f0fdf4':c==='red'?'#fef2f2':c==='amber'?'#fffbeb':c==='purple'?'#fdf4ff':c==='gray'?'#f1f5f9':'#eff6ff', color: c==='green'?'#16a34a':c==='red'?'#dc2626':c==='amber'?'#d97706':c==='purple'?'#9333ea':c==='gray'?'#64748b':'#2563eb' }),
  gBtn: { flex:1, padding:13, background:'#f1f5f9', border:'none', borderRadius:12, color:'#64748b', fontWeight:700, fontSize:14, cursor:'pointer' },
}

// ─── SHEET COMPONENT ───────────────────────────────────────────────────────
function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200, backdropFilter:'blur(3px)' }}>
      <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:700, maxHeight:'96vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 -8px 40px rgba(0,0,0,0.18)' }}>
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

// ─── UNDER DEVELOPMENT MODAL ───────────────────────────────────────────────
function UnderDevelopmentModal({ feature, onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(3px)', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:24, padding:'40px 36px', maxWidth:400, width:'100%', textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,0.2)', animation:'cardIn 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🚧</div>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:20, color:'#1e293b', marginBottom:8 }}>Under Development</h2>
        <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, marginBottom:8 }}>
          <strong style={{ color:'#6366f1' }}>{feature}</strong> is currently being built by a team member.
        </p>
        <p style={{ fontSize:13, color:'#94a3b8', marginBottom:28 }}>It will be available in the next sprint. Check back soon!</p>
        <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'10px 16px', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18 }}>👷</span>
          <p style={{ fontSize:12, color:'#1e40af', margin:0, textAlign:'left', fontWeight:600 }}>Sprint 2 feature — coming soon</p>
        </div>
        <button onClick={onClose} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:12, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:'0 2px 10px rgba(99,102,241,0.4)' }}>Got it!</button>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function Results() {
  const [tab, setTab] = useState('results')
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS)
  const [resultModal, setResultModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [underDevModal, setUnderDevModal] = useState(null) // feature name string

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }

  // Auto-grade the pending submission on mount
  useEffect(() => {
    const assignment = MOCK_ASSIGNMENTS.find(a => a.id === PRE_SUBMISSION.assignment_id)
    mockAiGrade({ essayText: PRE_SUBMISSION.essay_text, assignment }).then(result => {
      const aiScore = result.ai_detection_percentage >= 50 ? 0 : result.total_score
      setSubmissions(prev => prev.map(s =>
        s.id === PRE_SUBMISSION.id
          ? { ...s, ai_score: aiScore, ai_feedback: result.overall_feedback, ai_detection_score: result.ai_detection_percentage, status:'ai_graded' }
          : s
      ))
    })
  }, [])

  const graded = submissions.filter(s => s.final_score !== null)
  const avgPct = graded.length
    ? Math.round(graded.reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / graded.length)
    : null

  const canUnsubmit = sub => {
    const a = MOCK_ASSIGNMENTS.find(a => a.id === sub.assignment_id)
    return sub.final_score === null && a && new Date() < new Date(a.due_date)
  }

  const handleUnsubmit = sub => {
    setSubmissions(p => p.filter(s => s.id !== sub.id))
    setResultModal(null)
    showToast('↩ Essay unsubmitted. You can rewrite before the deadline.')
  }

  const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626'
  const scoreLabel = p => p >= 70 ? 'Pass' : p >= 50 ? 'Borderline' : 'Fail'

  // Tabs — assignments is "under development" (your friend's part)
  const tabs = [
    { id:'assignments', label:'📋 Assignments' },
    { id:'results',     label:'📊 My Results' },
  ]

  return (
    <div style={C.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cardIn { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:999, background: toast.type==='error'?'#fef2f2':toast.type==='info'?'#eff6ff':'#f0fdf4', border:`1px solid ${toast.type==='error'?'#fecaca':toast.type==='info'?'#bfdbfe':'#bbf7d0'}`, color: toast.type==='error'?'#dc2626':toast.type==='info'?'#2563eb':'#15803d', padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:700, boxShadow:'0 4px 20px rgba(0,0,0,0.12)', maxWidth:'90vw', textAlign:'center' }}>
          {toast.msg}
        </div>
      )}

      {/* UNDER DEVELOPMENT MODAL */}
      {underDevModal && <UnderDevelopmentModal feature={underDevModal} onClose={() => setUnderDevModal(null)} />}

      {/* HEADER */}
      <header style={C.header}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, boxShadow:'0 2px 8px rgba(99,102,241,0.3)' }}>✍️</div>
          <div>
            <p style={{ fontWeight:800, fontSize:15, color:'#1e293b', margin:0 }}>EssayGrade AI</p>
            <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>Student Portal</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:20, padding:'4px 12px 4px 4px' }}>
            <div style={{ width:26, height:26, background:'linear-gradient(135deg,#8b5cf6,#a78bfa)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🎓</div>
            <span style={{ fontSize:13, color:'#374151', fontWeight:600 }}>Alice Mwale</span>
          </div>
          <Link to="/" style={{ background:'none', border:'1.5px solid #e2e8f0', borderRadius:8, color:'#64748b', fontWeight:600, fontSize:12, padding:'6px 12px', textDecoration:'none' }}>← Home</Link>
        </div>
      </header>

      <div style={C.main}>
        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:24 }}>
          {[
            { label:'To Submit', value: MOCK_ASSIGNMENTS.filter(a => !submissions.find(s=>s.assignment_id===a.id) && new Date()<new Date(a.due_date)).length, icon:'📋', bg:'#eff6ff', fg:'#3b82f6' },
            { label:'Submitted', value: submissions.length, icon:'📝', bg:'#fdf4ff', fg:'#9333ea' },
            { label:'Avg Score', value: avgPct !== null ? `${avgPct}%` : '—', icon:'⭐', bg:'#f0fdf4', fg:'#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:16, padding:14, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:10, boxShadow:'0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:s.bg, color:s.fg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize:20, fontWeight:900, color:'#1e293b', margin:0, lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:11, color:'#94a3b8', margin:'2px 0 0', fontWeight:500 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display:'flex', background:'#f1f5f9', borderRadius:10, padding:4, marginBottom:20, gap:2, width:'fit-content' }}>
          {tabs.map(({ id, label }) => (
            <button key={id} style={C.tab(tab===id)}
              onClick={() => {
                if (id === 'assignments') {
                  setUnderDevModal('Assignments Submission')
                } else {
                  setTab(id)
                }
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ RESULTS TAB ══ */}
        {tab === 'results' && (
          <div>
            <p style={{ fontSize:18, fontWeight:800, color:'#1e293b', margin:'0 0 12px' }}>My Results</p>

            {/* Legend */}
            <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'10px 16px', marginBottom:14, display:'flex', flexWrap:'wrap', gap:12 }}>
              {[{i:'✅',l:'Graded',c:'#16a34a'},{i:'⏳',l:'Awaiting teacher',c:'#d97706'},{i:'🚨',l:'AI flagged',c:'#dc2626'},{i:'🤖',l:'Grading...',c:'#6366f1'}].map(x => (
                <div key={x.l} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ fontSize:13 }}>{x.i}</span>
                  <span style={{ fontSize:11, color:x.c, fontWeight:600 }}>{x.l}</span>
                </div>
              ))}
            </div>

            {submissions.length === 0 && (
              <div style={{ ...C.card, textAlign:'center', padding:'48px 24px' }}>
                <p style={{ fontSize:36, margin:'0 0 10px' }}>📭</p>
                <p style={{ fontWeight:700, color:'#64748b', fontSize:14, margin:0 }}>No submissions yet.</p>
              </div>
            )}

            {/* ── RESULT CARDS ── */}
            {submissions.map(s => {
              const pct = s.final_score !== null ? Math.round((s.final_score/s.max_score)*100) : null
              const isAI = s.ai_detection_score >= 50
              const isPending = s.status === 'pending'
              return (
                <div key={s.id}
                  style={{ ...C.card, cursor: isPending ? 'default' : 'pointer', transition:'box-shadow 0.15s', opacity: isPending ? 0.75 : 1 }}
                  onClick={() => !isPending && setResultModal(s)}
                  onMouseEnter={e => { if(!isPending) e.currentTarget.style.boxShadow='0 4px 16px rgba(99,102,241,0.12)' }}
                  onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.03)'}>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:6, marginBottom:4 }}>
                        <span style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{s.assignment_title}</span>
                        {s.submit_mode === 'upload' && s.file_name && <span style={C.badge('purple')}>📎 File</span>}
                        {s.final_score !== null && <span style={C.badge('green')}>✅ Graded</span>}
                        {!isPending && s.final_score===null && s.ai_score!==null && !isAI && <span style={C.badge('amber')}>⏳ Pending</span>}
                        {!isPending && s.final_score===null && s.ai_score!==null && isAI && <span style={C.badge('red')}>🚨 AI Flagged</span>}
                        {isPending && <span style={C.badge('gray')}>🤖 Grading...</span>}
                      </div>
                      <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>
                        Submitted {new Date(s.submitted_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                      </p>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      {s.final_score !== null ? (
                        <div>
                          <p style={{ fontSize:26, fontWeight:900, color:scoreColor(pct), margin:0, lineHeight:1 }}>
                            {s.final_score}<span style={{ fontSize:13, color:'#94a3b8' }}>/{s.max_score}</span>
                          </p>
                          <p style={{ fontSize:12, fontWeight:700, color:scoreColor(pct), margin:'2px 0 0' }}>{scoreLabel(pct)} · {pct}%</p>
                        </div>
                      ) : isPending ? (
                        <div style={{ width:28, height:28, border:'3px solid #e2e8f0', borderTopColor:'#8b5cf6', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                      ) : s.ai_score !== null ? (
                        <div>
                          <p style={{ fontSize:14, color:'#8b5cf6', fontWeight:800, margin:0 }}>{s.ai_score}/{s.max_score}</p>
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

                  {!isPending && <p style={{ fontSize:12, color:'#8b5cf6', margin:'10px 0 0', fontWeight:600 }}>Tap to view full details →</p>}
                  {isPending && <p style={{ fontSize:12, color:'#94a3b8', margin:'10px 0 0' }}>AI is reviewing your essay, please wait...</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ══ RESULT DETAIL SHEET ══ */}
      {resultModal && (
        <Sheet
          onClose={() => setResultModal(null)}
          title={resultModal.assignment_title}
          subtitle={`Submitted ${new Date(resultModal.submitted_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`}
          footer={
            <div style={{ display:'flex', gap:10 }}>
              {canUnsubmit(resultModal) && (
                <button
                  onClick={() => { if(window.confirm('Unsubmit?')) handleUnsubmit(resultModal) }}
                  style={{ flex:1, padding:13, background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:12, color:'#dc2626', fontWeight:700, fontSize:14, cursor:'pointer' }}>
                  ↩ Unsubmit
                </button>
              )}
              <button onClick={() => setResultModal(null)} style={C.gBtn}>Close</button>
            </div>
          }>

          {/* Score banner */}
          {resultModal.final_score !== null ? (() => {
            const pct = Math.round((resultModal.final_score/resultModal.max_score)*100)
            const bg = pct>=70?'linear-gradient(135deg,#6366f1,#8b5cf6)':pct>=50?'linear-gradient(135deg,#f59e0b,#d97706)':'linear-gradient(135deg,#ef4444,#dc2626)'
            return (
              <div style={{ background:bg, borderRadius:18, padding:28, textAlign:'center', marginBottom:18, boxShadow:'0 4px 24px rgba(99,102,241,0.2)' }}>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 8px' }}>Final Score</p>
                <p style={{ color:'#fff', fontSize:62, fontWeight:900, margin:0, lineHeight:1 }}>
                  {resultModal.final_score}<span style={{ fontSize:22, opacity:0.55 }}>/{resultModal.max_score}</span>
                </p>
                <div style={{ display:'flex', justifyContent:'center', gap:10, marginTop:8 }}>
                  <span style={{ color:'rgba(255,255,255,0.85)', fontSize:16, fontWeight:700 }}>{pct}%</span>
                  <span style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:12, fontWeight:700, padding:'2px 10px', borderRadius:20 }}>{scoreLabel(pct)}</span>
                </div>
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
            <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:14, padding:20, textAlign:'center', marginBottom:18 }}>
              <p style={{ fontSize:24, margin:'0 0 6px' }}>⏳</p>
              <p style={{ fontWeight:800, color:'#92400e', fontSize:15, margin:'0 0 4px' }}>Awaiting Teacher Approval</p>
              <p style={{ fontSize:13, color:'#78350f', margin:0 }}>AI suggested <strong>{resultModal.ai_score}/{resultModal.max_score}</strong></p>
            </div>
          ) : (
            <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:14, padding:20, textAlign:'center', marginBottom:18 }}>
              <p style={{ fontWeight:700, color:'#1e40af', margin:0 }}>🤖 Grading in progress...</p>
            </div>
          )}

          {/* AI Detection bar */}
          {resultModal.ai_detection_score !== null && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={C.sL}>AI Content Detection</span>
                <span style={{ fontSize:13, fontWeight:800, color: resultModal.ai_detection_score>=50?'#dc2626':'#16a34a' }}>{resultModal.ai_detection_score}%</span>
              </div>
              <div style={{ height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden', position:'relative' }}>
                <div style={{ height:'100%', width:`${resultModal.ai_detection_score}%`, background: resultModal.ai_detection_score>=50?'linear-gradient(90deg,#f59e0b,#ef4444)':'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius:4 }} />
                <div style={{ position:'absolute', top:0, left:'50%', width:2, height:'100%', background:'#94a3b8' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{ fontSize:10, color:'#94a3b8' }}>0% Human</span>
                <span style={{ fontSize:10, color:'#ef4444', fontWeight:700 }}>50% limit</span>
                <span style={{ fontSize:10, color:'#94a3b8' }}>100% AI</span>
              </div>
            </div>
          )}

          {/* AI Feedback */}
          {resultModal.ai_feedback && (
            <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:16, marginBottom:14 }}>
              <span style={{ ...C.sL, color:'#1d4ed8' }}>🤖 AI Feedback</span>
              <p style={{ fontSize:13, color:'#1e293b', margin:0, lineHeight:'1.85', whiteSpace:'pre-wrap' }}>{resultModal.ai_feedback}</p>
            </div>
          )}

          {/* Teacher Feedback */}
          {resultModal.teacher_feedback && (
            <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:16, marginBottom:14 }}>
              <span style={{ ...C.sL, color:'#15803d' }}>👨‍🏫 Teacher Feedback</span>
              <p style={{ fontSize:13, color:'#1e293b', margin:0, lineHeight:'1.85' }}>{resultModal.teacher_feedback}</p>
            </div>
          )}

          {/* Essay text */}
          <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <span style={C.sL}>Your Submission</span>
              <span style={{ fontSize:11, color:'#94a3b8' }}>
                {resultModal.essay_text?.trim().split(/\s+/).filter(Boolean).length} words
                {resultModal.file_name ? ` · 📎 ${resultModal.file_name}` : ''}
              </span>
            </div>
            <p style={{ fontSize:13, color:'#475569', lineHeight:'1.85', margin:0, whiteSpace:'pre-wrap' }}>{resultModal.essay_text}</p>
          </div>
        </Sheet>
      )}
    </div>
  )
}
