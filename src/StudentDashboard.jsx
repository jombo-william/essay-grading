
import { useState, useRef, useEffect } from 'react';


async function mockAiGrade({ essayText, assignment }) {
  await new Promise(r => setTimeout(r, 2500 + Math.random() * 1500));

  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lowerText = essayText.toLowerCase();

  const genericPhrases = [
    'multifaceted', 'furthermore', 'in conclusion', 'it is important to note',
    'plays a crucial role', 'in today\'s world', 'throughout history',
    'significantly impacts', 'one must consider', 'it is worth noting',
    'in summary', 'as mentioned above', 'on the other hand',
  ];
  const genericCount = genericPhrases.filter(p => lowerText.includes(p)).length;
  const hasPersonalVoice = /\b(i |my |we |our |personally|in my view|i believe|i think)\b/i.test(essayText);
  const hasSpecificExamples = /\b(20\d\d|for example|for instance|such as|according to)\b/i.test(essayText);
  const sentences = essayText.split(/[.!?]+/).map(s => s.trim().split(/\s+/).length);
  const avgLen = sentences.reduce((a, b) => a + b, 0) / sentences.length;
  const variance = sentences.reduce((a, b) => a + Math.abs(b - avgLen), 0) / sentences.length;

  let aiPct = 15;
  aiPct += genericCount * 7;
  if (!hasPersonalVoice) aiPct += 18;
  if (!hasSpecificExamples) aiPct += 12;
  if (variance < 3) aiPct += 15;
  if (wordCount > 600) aiPct -= 8;
  aiPct = Math.min(95, Math.max(3, aiPct + Math.floor(Math.random() * 12) - 6));

  if (aiPct >= 50) {
    return {
      total_score: 0,
      ai_detection_percentage: aiPct,
      overall_feedback: `⚠️ HIGH AI CONTENT DETECTED\n\nAn estimated ${aiPct}% of this essay appears AI-generated.\n\nPer academic integrity policy, essays with ≥50% AI content receive a score of 0/100.\n\nIndicators:\n• ${!hasPersonalVoice ? 'No personal voice or first-person examples\n• ' : ''}${genericCount > 2 ? 'Overuse of generic academic phrases\n• ' : ''}${variance < 3 ? 'Unnaturally uniform sentence structure\n• ' : ''}Vocabulary patterns consistent with LLM output\n\nPlease rewrite in your own words with specific examples.`,
    };
  }

  const rubricEntries = Object.entries(assignment.rubric);
  let totalScore = 0;
  let breakdown = [];

  for (const [criterion, weight] of rubricEntries) {
    let pct = 0.72 + Math.random() * 0.22;
    if (['grammar', 'structure'].includes(criterion)) pct = Math.min(0.97, pct + 0.05);
    if (['evidence', 'examples'].includes(criterion)) pct = hasSpecificExamples ? pct : pct * 0.72;
    if (['content', 'argumentation'].includes(criterion)) pct = wordCount >= 400 ? pct : pct * 0.8;
    const earned = Math.round(weight * pct);
    totalScore += earned;
    breakdown.push({ criterion, earned, weight, pct: Math.round(pct * 100) });
  }
  totalScore = Math.min(assignment.max_score, totalScore);

  const qualLabel = totalScore >= 85 ? 'Excellent' : totalScore >= 75 ? 'Good' : totalScore >= 65 ? 'Satisfactory' : 'Needs Improvement';
  const strongest = breakdown.reduce((a, b) => a.pct > b.pct ? a : b);
  const weakest   = breakdown.reduce((a, b) => a.pct < b.pct ? a : b);

  const improveTip = {
    evidence: 'specific citations and real-world examples',
    examples: 'country-specific or dated examples',
    structure: 'clear paragraph transitions and a stronger conclusion',
    grammar: 'proofreading for tense and agreement errors',
    content: 'deeper analysis and more nuanced argument',
    argumentation: 'stronger counterarguments and a clearer stance',
  }[weakest.criterion] || 'more depth and original analysis';

  const feedbackLines = [
    `Overall Assessment: ${qualLabel} — ${totalScore}/${assignment.max_score}\n`,
    ...breakdown.map(b => {
      const label = b.pct >= 88 ? 'Strong' : b.pct >= 76 ? 'Good' : b.pct >= 64 ? 'Satisfactory' : 'Needs work';
      return `${b.criterion.charAt(0).toUpperCase() + b.criterion.slice(1)} (${b.earned}/${b.weight}): ${label}`;
    }),
    `\nStrength: Your ${strongest.criterion} was the strongest area.`,
    `Improve: ${weakest.criterion} — consider adding ${improveTip}.`,
    `\nAI Detection: ${aiPct < 15 ? 'Very low' : aiPct < 30 ? 'Low' : 'Moderate'} (~${aiPct}%). ${aiPct < 20 ? 'Appears authentically written.' : 'Ensure all work is your own.'}`,
  ];

  return {
    total_score: totalScore,
    ai_detection_percentage: aiPct,
    overall_feedback: feedbackLines.join('\n'),
  };
}


const loadPdfJs = () =>
  new Promise(resolve => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(s);
  });


const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Climate Change & Society',
    description: 'Analyse the socio-economic impacts of climate change on developing nations.',
    instructions: 'Write a well-structured essay (500–800 words) discussing at least three specific socio-economic impacts of climate change on developing nations. Use examples where possible. Cite any sources informally (Author, Year).',
    referenceMaterial: 'Climate change disproportionately affects developing nations through food insecurity (IPCC, 2022), displacement (IOM, 2021), economic losses averaging 5% of GDP (World Bank, 2023), health crises from vector-borne diseases, and infrastructure damage from extreme weather.',
    rubric: { content: 35, structure: 25, grammar: 20, evidence: 20 },
    max_score: 100,
    due_date: '2026-04-15T23:59',
  },
  {
    id: 2,
    title: 'Artificial Intelligence in Education',
    description: 'Discuss the benefits and challenges of integrating AI tools in secondary schools.',
    instructions: 'Write an argumentative essay (400–600 words) presenting both sides of AI integration in secondary schools. Conclude with your reasoned recommendation.',
    referenceMaterial: 'AI in education benefits: personalised learning, automated grading, 24/7 tutoring. Challenges: digital divide, data privacy, academic dishonesty risk. UNESCO recommends ethical AI frameworks (2023).',
    rubric: { argumentation: 40, structure: 25, grammar: 20, evidence: 15 },
    max_score: 100,
    due_date: '2026-04-20T23:59',
  },
  {
    id: 3,
    title: 'The Role of Entrepreneurs in Africa',
    description: 'Examine how entrepreneurship drives economic development in African economies.',
    instructions: 'Write a 500–700 word essay examining the role of entrepreneurship in driving economic development in at least two African countries. Include challenges and proposed solutions.',
    referenceMaterial: 'African entrepreneurship: fintech (M-Pesa, Kenya), agriculture tech (Twiga Foods), health (mPharma). Challenges: funding gaps, infrastructure, regulation. Solutions: AFCFTA, angel investors, government incubators.',
    rubric: { content: 30, structure: 25, grammar: 20, examples: 25 },
    max_score: 100,
    due_date: '2026-02-01T23:59',
  },
];

const PRE_SUBMISSION = {
  id: 100, assignment_id: 1, assignment_title: 'Climate Change & Society',
  max_score: 100,
  essay_text: `Climate change is one of the most pressing global challenges, and its socio-economic impacts on developing nations are particularly severe.\n\nFirstly, food insecurity is a major consequence. In Sub-Saharan Africa, over 60% of the population relies on rain-fed agriculture. The IPCC (2022) projects crop yields could fall by up to 25% by 2050.\n\nSecondly, economic losses are severe. The World Bank (2023) estimates developing nations lose 5% of GDP annually due to climate-related disasters.\n\nThirdly, mass displacement is rising. The IOM (2021) recorded over 30 million internal climate displacements in 2020 alone.\n\nIn conclusion, climate change is a development crisis requiring urgent global cooperation and financial support for affected nations.`,
  submitted_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  submit_mode: 'write', file_name: null,
  ai_score: null, ai_detection_score: null, final_score: null,
  ai_feedback: null, teacher_feedback: null, status: 'pending',
};

const INITIAL_SUBMISSIONS = [
  PRE_SUBMISSION,
  {
    id: 101, assignment_id: 98, assignment_title: 'Democracy & Governance in Africa',
    max_score: 100,
    essay_text: `Democracy in Africa has undergone significant transformation since the wave of independence in the 1960s. While early post-colonial governments often slid into authoritarianism, recent decades have seen gradual consolidation of democratic practices.\n\nCountries like Botswana have maintained stable multiparty democracy since independence. Botswana's management of diamond revenues through the Debswana model has produced one of Africa's highest GDPs per capita.\n\nHowever, challenges persist. Electoral violence in Kenya's 2007–2008 post-election crisis and military coups in Mali and Burkina Faso (2021–2022) highlight the fragility of democratic institutions.\n\nIn conclusion, democracy in Africa is neither uniformly fragile nor strong. Sustained civic education and regional accountability are essential to deepening democratic culture.`,
    submitted_at: '2026-02-20T09:15:00', submit_mode: 'write', file_name: null,
    ai_score: 88, ai_detection_score: 8, final_score: 85,
    ai_feedback: `Overall Assessment: An impressive, well-researched essay.\n\nContent (31/35): Excellent coverage with specific country examples — Botswana, Kenya, Mali, Burkina Faso all used effectively.\n\nStructure (23/25): Clear introduction, coherent body paragraphs, and strong conclusion.\n\nGrammar (19/20): Fluent and sophisticated writing.\n\nEvidence (12/20): Good use of historical events. More specific statistics would strengthen the argument.\n\nAI Detection: Very low AI involvement (~8%). Appears authentically written.`,
    teacher_feedback: 'Excellent work, Alice! Your analysis of Botswana and Rwanda showed real depth. One of the strongest essays in the class. Well done!',
    status: 'graded',
  },
  {
    id: 102, assignment_id: 99, assignment_title: 'Water Scarcity & Human Rights',
    max_score: 100,
    essay_text: `Access to clean water is recognised as a fundamental human right under UN Resolution 64/292 (2010), yet over 2 billion people lack safe drinking water.\n\nIn Malawi, communities in Nsanje and Chikwawa face seasonal shortages forcing families to drink from contaminated sources, contributing to cholera outbreaks.\n\nThe AAAQ framework (UN CESCR) requires states to ensure water availability, accessibility, acceptability, and quality. Yet many governments allocate less than 1% of GDP to WASH services (WHO, 2022).\n\nLake Chad has shrunk by 90% since the 1960s, affecting 30 million people across four nations.\n\nSolutions: increased development finance, community-led water management, rainwater harvesting, and stronger state accountability.`,
    submitted_at: '2026-03-01T14:30:00', submit_mode: 'write', file_name: null,
    ai_score: 79, ai_detection_score: 22, final_score: null,
    ai_feedback: `Overall Assessment: A well-structured essay linking water scarcity to human rights frameworks.\n\nContent (27/35): Strong local examples (Nsanje, Chikwawa). The AAAQ framework reference shows good research.\n\nStructure (22/25): Clear structure. Transition from climate change to solutions could be smoother.\n\nGrammar (18/20): Well-written with minor tense inconsistencies.\n\nEvidence (12/20): Good sources (UNICEF, WHO, UN). More recent data would help.\n\nAI Detection: Low AI involvement (~22%). Largely original voice.`,
    teacher_feedback: null, status: 'ai_graded',
  },
  {
    id: 103, assignment_id: 97, assignment_title: 'Globalisation & Inequality',
    max_score: 100,
    essay_text: `Globalisation represents a multifaceted phenomenon that has fundamentally transformed the economic landscape. The intersection of trade liberalisation, technological advancement, and capital mobility has created opportunities while exacerbating inequalities.\n\nThe primary mechanism through which globalisation contributes to inequality manifests in labour market dynamics. Multinational corporations provide employment, but concentration of high-value activities in developed nations disadvantages workers elsewhere.\n\nThe digital divide presents another critical dimension. Rapid advancement of ICT creates opportunities predominantly accessible to those with existing educational advantages.\n\nIn conclusion, globalisation's distributional consequences require policy interventions including progressive taxation, social protection, and targeted human capital investment.`,
    submitted_at: '2026-03-03T11:00:00', submit_mode: 'write', file_name: null,
    ai_score: 0, ai_detection_score: 81, final_score: null,
    ai_feedback: `⚠️ HIGH AI CONTENT DETECTED\n\nAn estimated 81% of this essay appears AI-generated.\n\nPer academic integrity policy, essays with ≥50% AI content receive a score of 0/100.\n\nIndicators:\n• Unnaturally uniform sentence structure\n• Generic phrasing with no personal examples\n• No specific country names or dated references\n• Vocabulary patterns consistent with LLMs\n\nPlease rewrite in your own voice with specific examples and original analysis.`,
    teacher_feedback: null, status: 'ai_graded',
  },
];


const C = {
  page:   { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
  header: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' },
  main:   { maxWidth: '680px', margin: '0 auto', padding: '24px 16px 60px' },
  card:   { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' },
  sL:     { display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
  tab:    a => ({ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: a ? '#fff' : 'transparent', color: a ? '#6366f1' : '#64748b', boxShadow: a ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }),
  badge:  c => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: c==='green'?'#f0fdf4':c==='red'?'#fef2f2':c==='amber'?'#fffbeb':c==='purple'?'#fdf4ff':c==='gray'?'#f1f5f9':'#eff6ff', color: c==='green'?'#16a34a':c==='red'?'#dc2626':c==='amber'?'#d97706':c==='purple'?'#9333ea':c==='gray'?'#64748b':'#2563eb' }),
  pBtn:   dis => ({ flex: 2, padding: '13px', background: dis ? '#c7d2fe' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: dis ? 'not-allowed' : 'pointer', boxShadow: dis ? 'none' : '0 2px 10px rgba(99,102,241,0.4)', opacity: dis ? 0.7 : 1 }),
  gBtn:   { flex: 1, padding: '13px', background: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#64748b', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
  dBtn:   { flex: 1, padding: '13px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
};


function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(3px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '700px', maxHeight: '96vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
        </div>
        <div style={{ padding: '8px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: '800', fontSize: '17px', color: '#1e293b', margin: '0 0 2px', lineHeight: 1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer', color: '#64748b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div>
        {footer && <div style={{ padding: '14px 20px 20px', borderTop: '1px solid #f1f5f9' }}>{footer}</div>}
      </div>
    </div>
  );
}


export default function StudentDashboard({ onBack }) {
  const [tab, setTab] = useState('assignments');
  const [submittedIds, setSubmittedIds] = useState(new Set([1]));
  const [submissions, setSubmissions]   = useState(INITIAL_SUBMISSIONS);

  const [assignmentModal, setAssignmentModal] = useState(null);
  const [writeModal, setWriteModal]           = useState(null);
  const [submitMode, setSubmitMode]           = useState('write');
  const [essayText, setEssayText]             = useState('');
  const [uploadFile, setUploadFile]           = useState(null);
  const [uploadText, setUploadText]           = useState('');
  const [submitting, setSubmitting]           = useState(false);
  const [gradingStatus, setGradingStatus]     = useState('');
  const fileRef = useRef();

  const [resultModal, setResultModal]       = useState(null);
  const [essayViewModal, setEssayViewModal] = useState(null);
  const [toast, setToast]                   = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

 
  useEffect(() => {
    const assignment = MOCK_ASSIGNMENTS.find(a => a.id === PRE_SUBMISSION.assignment_id);
    mockAiGrade({ essayText: PRE_SUBMISSION.essay_text, assignment }).then(result => {
      const aiScore = result.ai_detection_percentage >= 50 ? 0 : result.total_score;
      setSubmissions(prev => prev.map(s =>
        s.id === PRE_SUBMISSION.id
          ? { ...s, ai_score: aiScore, ai_feedback: result.overall_feedback, ai_detection_score: result.ai_detection_percentage, status: 'ai_graded' }
          : s
      ));
    });
  }, []);

  const activeText = submitMode === 'write' ? essayText : uploadText;
  const wordCount  = activeText.trim().split(/\s+/).filter(Boolean).length;

  const assignments = MOCK_ASSIGNMENTS.map(a => ({
    ...a,
    isPast: new Date() > new Date(a.due_date),
    submitted: submittedIds.has(a.id),
    submission: submissions.find(s => s.assignment_id === a.id),
  }));

  const graded = submissions.filter(s => s.final_score !== null);
  const avgPct = graded.length
    ? Math.round(graded.reduce((sum, s) => sum + (s.final_score / s.max_score) * 100, 0) / graded.length)
    : null;

  const canUnsubmit = sub => {
    const a = MOCK_ASSIGNMENTS.find(a => a.id === sub.assignment_id);
    return sub.final_score === null && a && new Date() < new Date(a.due_date);
  };

  const handleUnsubmit = sub => {
    setSubmissions(p => p.filter(s => s.id !== sub.id));
    setSubmittedIds(p => { const n = new Set(p); n.delete(sub.assignment_id); return n; });
    setResultModal(null); setEssayViewModal(null);
    showToast('↩ Essay unsubmitted. You can rewrite before the deadline.');
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);

    if (file.type === 'text/plain') {
      const r = new FileReader();
      r.onload = ev => setUploadText(ev.target.result);
      r.readAsText(file);

    } else if (file.type === 'application/pdf') {
      try {
        const pdfjsLib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setUploadText(fullText.trim() || '[No readable text found in PDF]');
      } catch (err) {
        setUploadText(`[Could not extract text from "${file.name}"]`);
      }

    } else {
      setUploadText(`[File attached: "${file.name}" — ${(file.size / 1024).toFixed(1)} KB]`);
    }
  };

  const openWrite = a => {
    setWriteModal(a); setSubmitMode('write'); setEssayText(''); setUploadFile(null); setUploadText('');
  };

  const handleSubmit = async () => {
    if (submitMode === 'write' && wordCount < 50) { showToast('Please write at least 50 words.', 'error'); return; }
    if (submitMode === 'upload' && !uploadFile)   { showToast('Please select a file to upload.', 'error'); return; }

    setSubmitting(true);
    setGradingStatus('📤 Submitting...');

    const assignment = MOCK_ASSIGNMENTS.find(a => a.id === writeModal.id);
    const newSub = {
      id: Date.now(),
      assignment_id: assignment.id,
      assignment_title: assignment.title,
      max_score: assignment.max_score,
      essay_text: activeText,
      submitted_at: new Date().toISOString(),
      submit_mode: submitMode,
      file_name: uploadFile ? uploadFile.name : null,
      ai_score: null, ai_detection_score: null,
      final_score: null, ai_feedback: null,
      teacher_feedback: null, status: 'pending',
    };

    setSubmittedIds(p => new Set([...p, assignment.id]));
    setSubmissions(p => [...p, newSub]);
    setGradingStatus('🤖 AI is grading your essay...');

    try {
      const result = await mockAiGrade({ essayText: activeText, assignment });
      const aiScore = result.ai_detection_percentage >= 50 ? 0 : result.total_score;

      setSubmissions(p => p.map(s =>
        s.id === newSub.id
          ? { ...s, ai_score: aiScore, ai_feedback: result.overall_feedback, ai_detection_score: result.ai_detection_percentage, status: 'ai_graded' }
          : s
      ));

      setWriteModal(null); setEssayText(''); setUploadFile(null); setUploadText('');
      setTab('results');
      showToast(result.ai_detection_percentage >= 50
        ? '🚨 AI content detected — score set to 0. Awaiting teacher review.'
        : '✅ Submitted and AI-graded! Awaiting teacher approval.'
      );
    } catch {
      setWriteModal(null); setEssayText(''); setUploadFile(null); setUploadText('');
      showToast('Essay submitted. AI grading will complete shortly.', 'info');
    }

    setSubmitting(false); setGradingStatus('');
  };

  const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';
  const scoreLabel = p => p >= 70 ? 'Pass'    : p >= 50 ? 'Borderline' : 'Fail';

  return (
    <div style={C.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input[type=file]{display:none}`}</style>

      {}
      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: toast.type==='error'?'#fef2f2':toast.type==='info'?'#eff6ff':'#f0fdf4', border: `1px solid ${toast.type==='error'?'#fecaca':toast.type==='info'?'#bfdbfe':'#bbf7d0'}`, color: toast.type==='error'?'#dc2626':toast.type==='info'?'#2563eb':'#15803d', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', maxWidth: '90vw', textAlign: 'center' }}>
          {toast.msg}
        </div>
      )}

      {}
      <header style={C.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>✍️</div>
          <div>
            <p style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', margin: 0 }}>EssayGrade AI</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Student Portal</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '4px 12px 4px 4px' }}>
            <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>🎓</div>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Alice Mwale</span>
          </div>
          <button onClick={onBack} style={{ background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: '600', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>← Home</button>
        </div>
      </header>

      <div style={C.main}>
        {}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: 'To Submit', value: assignments.filter(a => !a.submitted && !a.isPast).length, icon: '📋', bg: '#eff6ff', fg: '#3b82f6' },
            { label: 'Submitted', value: submissions.length, icon: '📝', bg: '#fdf4ff', fg: '#9333ea' },
            { label: 'Avg Score', value: avgPct !== null ? `${avgPct}%` : '—', icon: '⭐', bg: '#f0fdf4', fg: '#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '16px', padding: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: s.bg, color: s.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0', fontWeight: '500' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '20px', gap: '2px', width: 'fit-content' }}>
          {[['assignments', '📋 Assignments'], ['results', '📊 My Results']].map(([id, label]) => (
            <button key={id} style={C.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {}
        {tab === 'assignments' && (
          <div>
            <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px' }}>Your Assignments</p>
            {assignments.map(a => (
              <div key={a.id} onClick={() => setAssignmentModal(a)}
                style={{ ...C.card, borderLeft: `4px solid ${a.submitted ? '#8b5cf6' : a.isPast ? '#ef4444' : '#6366f1'}`, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '5px' }}>
                      <span style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>{a.title}</span>
                      {a.submitted && <span style={C.badge('purple')}>✅ Submitted</span>}
                      {a.isPast && !a.submitted && <span style={C.badge('red')}>⏰ Past Due</span>}
                      {!a.submitted && !a.isPast && <span style={C.badge('blue')}>📬 Open</span>}
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.5 }}>{a.description}</p>
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>📅 Due {new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>🏆 {a.max_score} pts</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '18px', color: '#94a3b8', flexShrink: 0 }}>→</span>
                </div>

                {}
                {a.submitted && a.submission && (() => {
                  const sub = a.submission;
                  const isAI = sub.ai_detection_score >= 50;
                  return (
                    <div onClick={e => { e.stopPropagation(); sub.final_score !== null && setResultModal(sub); }}
                      style={{ marginTop: '10px', background: isAI ? '#fef2f2' : '#faf5ff', border: `1px solid ${isAI ? '#fecaca' : '#e9d5ff'}`, borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{sub.final_score !== null ? '✅' : isAI ? '🚨' : sub.status === 'pending' ? '⏳' : sub.ai_score !== null ? '🔍' : '⏳'}</span>
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: isAI ? '#dc2626' : '#6d28d9', margin: 0 }}>
                            {sub.final_score !== null
                              ? `Graded: ${sub.final_score}/${sub.max_score} (${Math.round((sub.final_score / sub.max_score) * 100)}%)`
                              : isAI ? `AI Flagged (${sub.ai_detection_score}%) — Score: 0`
                              : sub.status === 'pending' ? 'Grading in progress...'
                              : 'AI graded — awaiting teacher'}
                          </p>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Submitted {new Date(sub.submitted_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {sub.final_score !== null && <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '700' }}>See feedback →</span>}
                        {sub.status !== 'pending' && (
                          <button onClick={e => { e.stopPropagation(); setEssayViewModal(sub); }}
                            style={{ fontSize: '12px', color: '#64748b', background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontWeight: '600' }}>View essay</button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        )}

        {}
        {tab === 'results' && (
          <div>
            <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px' }}>My Results</p>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 16px', marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[{ i: '✅', l: 'Graded', c: '#16a34a' }, { i: '⏳', l: 'Awaiting teacher', c: '#d97706' }, { i: '🚨', l: 'AI flagged', c: '#dc2626' }, { i: '🤖', l: 'Grading...', c: '#6366f1' }].map(x => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '13px' }}>{x.i}</span>
                  <span style={{ fontSize: '11px', color: x.c, fontWeight: '600' }}>{x.l}</span>
                </div>
              ))}
            </div>

            {submissions.length === 0 && (
              <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
                <p style={{ fontSize: '36px', margin: '0 0 10px' }}>📭</p>
                <p style={{ fontWeight: '700', color: '#64748b', fontSize: '14px', margin: 0 }}>No submissions yet. Submit an assignment to see your results here.</p>
              </div>
            )}

            {submissions.map(s => {
              const pct       = s.final_score !== null ? Math.round((s.final_score / s.max_score) * 100) : null;
              const isAI      = s.ai_detection_score >= 50;
              const isPending = s.status === 'pending';
              return (
                <div key={s.id} style={{ ...C.card, cursor: isPending ? 'default' : 'pointer', transition: 'box-shadow 0.15s', opacity: isPending ? 0.75 : 1 }}
                  onClick={() => !isPending && setResultModal(s)}
                  onMouseEnter={e => { if (!isPending) e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'; }}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>{s.assignment_title}</span>
                        {s.submit_mode === 'upload' && s.file_name && <span style={C.badge('purple')}>📎 File</span>}
                        {s.final_score !== null && <span style={C.badge('green')}>✅ Graded</span>}
                        {!isPending && s.final_score === null && s.ai_score !== null && !isAI && <span style={C.badge('amber')}>⏳ Pending</span>}
                        {!isPending && s.final_score === null && s.ai_score !== null && isAI  && <span style={C.badge('red')}>🚨 AI Flagged</span>}
                        {isPending && <span style={C.badge('gray')}>🤖 Grading...</span>}
                      </div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        Submitted {new Date(s.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {s.final_score !== null ? (
                        <div>
                          <p style={{ fontSize: '26px', fontWeight: '900', color: scoreColor(pct), margin: 0, lineHeight: 1 }}>
                            {s.final_score}<span style={{ fontSize: '13px', color: '#94a3b8' }}>/{s.max_score}</span>
                          </p>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: scoreColor(pct), margin: '2px 0 0' }}>{scoreLabel(pct)} · {pct}%</p>
                        </div>
                      ) : isPending ? (
                        <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      ) : s.ai_score !== null ? (
                        <div>
                          <p style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '800', margin: 0 }}>{s.ai_score}/{s.max_score}</p>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>AI score</p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {isAI && !isPending && (
                    <div style={{ marginTop: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span>🚨</span>
                      <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', margin: 0 }}>{s.ai_detection_score}% AI — automatic score: 0. Awaiting teacher review.</p>
                    </div>
                  )}
                  {s.teacher_feedback && (
                    <div style={{ marginTop: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 12px' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#15803d', margin: '0 0 2px' }}>👨‍🏫 Teacher Feedback</p>
                      <p style={{ fontSize: '12px', color: '#166534', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.teacher_feedback}</p>
                    </div>
                  )}
                  {!isPending && <p style={{ fontSize: '12px', color: '#8b5cf6', margin: '10px 0 0', fontWeight: '600' }}>Tap to view full details →</p>}
                  {isPending  && <p style={{ fontSize: '12px', color: '#94a3b8', margin: '10px 0 0' }}>AI is reviewing your essay, please wait...</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {}
      {assignmentModal && (
        <Sheet onClose={() => setAssignmentModal(null)} title={assignmentModal.title}
          subtitle={`Due ${new Date(assignmentModal.due_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${assignmentModal.max_score} pts`}
          footer={
            !assignmentModal.submitted && !assignmentModal.isPast ? (
              <button onClick={() => { setAssignmentModal(null); openWrite(assignmentModal); }}
                style={{ ...C.pBtn(false), width: '100%', display: 'block' }}>
                ✍️ Start Writing Essay
              </button>
            ) : assignmentModal.submitted ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    const sub = submissions.find(s => s.assignment_id === assignmentModal.id);
                    if (sub) { setAssignmentModal(null); setEssayViewModal(sub); }
                  }}
                  style={{ ...C.gBtn, border: '1.5px solid #8b5cf6', background: 'transparent', color: '#8b5cf6' }}>
                  View My Essay
                </button>
                {assignmentModal.submission?.final_score !== null && (
                  <button
                    onClick={() => {
                      const sub = submissions.find(s => s.assignment_id === assignmentModal.id);
                      if (sub) { setAssignmentModal(null); setResultModal(sub); }
                    }}
                    style={C.pBtn(false)}>
                    See Results →
                  </button>
                )}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', margin: 0 }}>⏰ Submission deadline has passed.</p>
            )
          }>
          {assignmentModal.submitted && (
            <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <div>
                <p style={{ fontWeight: '700', color: '#7e22ce', fontSize: '13px', margin: 0 }}>You have submitted this assignment</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                  {assignmentModal.submission?.final_score !== null
                    ? `Score: ${assignmentModal.submission.final_score}/${assignmentModal.max_score}`
                    : assignmentModal.submission?.status === 'pending' ? 'AI grading in progress...'
                    : assignmentModal.submission?.ai_score !== null ? 'Awaiting teacher approval'
                    : 'Grading in progress'}
                </p>
              </div>
            </div>
          )}
          {assignmentModal.isPast && !assignmentModal.submitted && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>⏰</span>
              <p style={{ fontWeight: '700', color: '#dc2626', fontSize: '13px', margin: 0 }}>Deadline passed — you did not submit this assignment.</p>
            </div>
          )}
          <div style={{ marginBottom: '18px' }}>
            <p style={C.sL}>About this Assignment</p>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, margin: 0 }}>{assignmentModal.description}</p>
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ ...C.sL, color: '#92400e' }}>Full Instructions</p>
            <p style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: 1.7 }}>{assignmentModal.instructions}</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <p style={C.sL}>Grading Rubric</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(assignmentModal.rubric).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#475569', textTransform: 'capitalize', fontWeight: '600', width: '100px', flexShrink: 0 }}>{k}</span>
                  <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${v}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#8b5cf6', fontWeight: '800', width: '36px', textAlign: 'right' }}>{v}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Maximum Score', value: `${assignmentModal.max_score} points`, icon: '🏆' },
              { label: 'Deadline',      value: new Date(assignmentModal.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), icon: '📅' },
              { label: 'Submission',    value: assignmentModal.submitted ? 'Submitted ✅' : assignmentModal.isPast ? 'Not submitted' : 'Not yet submitted', icon: '📝' },
              { label: 'AI Grading',   value: 'Automatic on submit', icon: '🤖' },
            ].map(d => (
              <div key={d.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
                <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 3px' }}>{d.label}</p>
                <p style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600', margin: 0 }}>{d.icon} {d.value}</p>
              </div>
            ))}
          </div>
        </Sheet>
      )}

      {}
      {writeModal && (
        <Sheet onClose={() => { setWriteModal(null); setEssayText(''); setUploadFile(null); setUploadText(''); }}
          title={writeModal.title}
          subtitle={`Due ${new Date(writeModal.due_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${writeModal.max_score} pts`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setWriteModal(null); setEssayText(''); setUploadFile(null); setUploadText(''); }} style={C.gBtn}>Cancel</button>
              <button onClick={handleSubmit}
                disabled={submitting || (submitMode === 'write' && wordCount < 50) || (submitMode === 'upload' && !uploadFile)}
                style={C.pBtn(submitting || (submitMode === 'write' && wordCount < 50) || (submitMode === 'upload' && !uploadFile))}>
                {submitting ? gradingStatus || '⏳ Submitting...' : '🚀 Submit Essay'}
              </button>
            </div>
          }>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {Object.entries(writeModal.rubric).map(([k, v]) => (
              <div key={k} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 10px', display: 'flex', gap: '5px' }}>
                <span style={{ fontSize: '12px', color: '#475569', textTransform: 'capitalize', fontWeight: '600' }}>{k}</span>
                <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '800' }}>{v}%</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '3px', marginBottom: '16px', gap: '2px' }}>
            {[['write', '✏️ Write Essay'], ['upload', '📎 Upload File']].map(([m, l]) => (
              <button key={m} onClick={() => setSubmitMode(m)}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: submitMode === m ? '#fff' : 'transparent', color: submitMode === m ? '#6366f1' : '#64748b', boxShadow: submitMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px' }}>
            <p style={{ ...C.sL, color: '#92400e', marginBottom: '4px' }}>Instructions</p>
            <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.6 }}>{writeModal.instructions}</p>
          </div>

          {submitMode === 'write' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={C.sL}>Your Essay</p>
                <span style={{ fontSize: '12px', fontWeight: '700', color: wordCount >= 50 ? '#16a34a' : '#ef4444' }}>
                  {wordCount} words {wordCount < 50 ? `· need ${50 - wordCount} more` : '✓'}
                </span>
              </div>
              <textarea value={essayText} onChange={e => setEssayText(e.target.value)}
                placeholder={`Write your essay on "${writeModal.title}"...\n\nTip: Aim for 400–800 words. Use specific examples and cite sources (Author, Year).`}
                style={{ width: '100%', padding: '16px', boxSizing: 'border-box', border: `1.5px solid ${wordCount > 0 && wordCount < 50 ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '14px', fontSize: '14px', lineHeight: '1.8', color: '#1e293b', resize: 'vertical', outline: 'none', fontFamily: 'inherit', minHeight: '260px', background: '#fafafa' }} />
              <p style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '8px' }}>🤖 Essay will be automatically AI-graded on submission.</p>
            </div>
          )}

          {submitMode === 'upload' && (
            <div>
              <p style={C.sL}>Upload Your Essay File</p>
              <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileChange} />
              {!uploadFile ? (
                <div onClick={() => fileRef.current?.click()}
                  style={{ border: '2px dashed #c7d2fe', borderRadius: '14px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: '#fafafe', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#c7d2fe'}>
                  <p style={{ fontSize: '32px', margin: '0 0 10px' }}>📎</p>
                  <p style={{ fontWeight: '700', color: '#4f46e5', fontSize: '14px', margin: '0 0 4px' }}>Click to upload your essay</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px' }}>PDF, TXT, DOC, DOCX supported</p>
                  <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['PDF', 'TXT', 'DOC', 'DOCX'].map(t => (
                      <span key={t} style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{uploadFile.name.endsWith('.pdf') ? '📄' : uploadFile.name.endsWith('.txt') ? '📝' : '📋'}</span>
                      <div>
                        <p style={{ fontWeight: '700', color: '#15803d', fontSize: '13px', margin: 0 }}>{uploadFile.name}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{(uploadFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => { setUploadFile(null); setUploadText(''); if (fileRef.current) fileRef.current.value = ''; }}
                      style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '5px 10px', color: '#dc2626', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>✕ Remove</button>
                  </div>
                  {uploadText && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <p style={{ ...C.sL, margin: 0 }}>Extracted Text Preview</p>
                        <span style={{ fontSize: '11px', color: wordCount >= 50 ? '#16a34a' : '#f59e0b', fontWeight: '700' }}>~{wordCount} words {wordCount < 50 ? '⚠️' : '✓'}</span>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', maxHeight: '140px', overflow: 'auto', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                        {uploadText.slice(0, 500)}{uploadText.length > 500 ? '...' : ''}
                      </div>
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '10px' }}>🤖 AI will grade based on the extracted text.</p>
                </div>
              )}
            </div>
          )}
        </Sheet>
      )}

      {}
      {essayViewModal && (
        <Sheet onClose={() => setEssayViewModal(null)} title="Your Submitted Essay" subtitle={essayViewModal.assignment_title}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              {canUnsubmit(essayViewModal) && (
                <button onClick={() => { if (window.confirm('Unsubmit? You can rewrite before the deadline.')) handleUnsubmit(essayViewModal); }} style={C.dBtn}>↩ Unsubmit</button>
              )}
              <button onClick={() => setEssayViewModal(null)} style={C.gBtn}>Close</button>
            </div>
          }>
          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#7e22ce', margin: '0 0 2px' }}>SUBMITTED</p>
              <p style={{ fontSize: '13px', color: '#6d28d9', fontWeight: '600', margin: 0 }}>{new Date(essayViewModal.submitted_at).toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#7e22ce', margin: '0 0 2px' }}>MODE</p>
              <p style={{ fontSize: '13px', color: '#6d28d9', fontWeight: '600', margin: 0 }}>{essayViewModal.file_name ? `📎 ${essayViewModal.file_name}` : '✏️ Written'}</p>
            </div>
          </div>
          {canUnsubmit(essayViewModal) && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', gap: '8px' }}>
              <span>💡</span>
              <p style={{ fontSize: '12px', color: '#c2410c', margin: 0, lineHeight: 1.5 }}>You can unsubmit and rewrite before the deadline. Once graded, unsubmit is no longer available.</p>
            </div>
          )}
          <p style={{ ...C.sL, marginBottom: '8px' }}>Essay Content · {essayViewModal.essay_text?.trim().split(/\s+/).filter(Boolean).length} words</p>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', fontSize: '14px', color: '#374151', lineHeight: '1.85', whiteSpace: 'pre-wrap' }}>
            {essayViewModal.essay_text}
          </div>
        </Sheet>
      )}

      {}
      {resultModal && (
        <Sheet onClose={() => setResultModal(null)} title={resultModal.assignment_title}
          subtitle={`Submitted ${new Date(resultModal.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              {canUnsubmit(resultModal) && (
                <button onClick={() => { if (window.confirm('Unsubmit?')) handleUnsubmit(resultModal); }} style={C.dBtn}>↩ Unsubmit</button>
              )}
              <button onClick={() => setResultModal(null)} style={C.gBtn}>Close</button>
            </div>
          }>

          {}
          {resultModal.final_score !== null ? (() => {
            const pct = Math.round((resultModal.final_score / resultModal.max_score) * 100);
            const bg  = pct >= 70 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : pct >= 50 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#ef4444,#dc2626)';
            return (
              <div style={{ background: bg, borderRadius: '18px', padding: '28px', textAlign: 'center', marginBottom: '18px', boxShadow: '0 4px 24px rgba(99,102,241,0.2)' }}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Final Score</p>
                <p style={{ color: '#fff', fontSize: '62px', fontWeight: '900', margin: 0, lineHeight: 1 }}>
                  {resultModal.final_score}<span style={{ fontSize: '22px', opacity: 0.55 }}>/{resultModal.max_score}</span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', fontWeight: '700' }}>{pct}%</span>
                  <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>{scoreLabel(pct)}</span>
                </div>
              </div>
            );
          })() : resultModal.ai_detection_score >= 50 ? (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
              <p style={{ fontSize: '26px', margin: '0 0 8px' }}>🚨</p>
              <p style={{ fontWeight: '800', color: '#dc2626', fontSize: '15px', margin: '0 0 4px' }}>AI Content Detected</p>
              <p style={{ fontSize: '13px', color: '#b91c1c', margin: '0 0 4px' }}>{resultModal.ai_detection_score}% AI-generated — Automatic score: 0</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Awaiting teacher review</p>
            </div>
          ) : resultModal.ai_score !== null ? (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
              <p style={{ fontSize: '24px', margin: '0 0 6px' }}>⏳</p>
              <p style={{ fontWeight: '800', color: '#92400e', fontSize: '15px', margin: '0 0 4px' }}>Awaiting Teacher Approval</p>
              <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>AI suggested <strong>{resultModal.ai_score}/{resultModal.max_score}</strong></p>
            </div>
          ) : (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
              <p style={{ fontWeight: '700', color: '#1e40af', margin: 0 }}>🤖 Grading in progress...</p>
            </div>
          )}

          {}
          {resultModal.ai_detection_score !== null && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <p style={C.sL}>AI Content Detection</p>
                <span style={{ fontSize: '13px', fontWeight: '800', color: resultModal.ai_detection_score >= 50 ? '#dc2626' : '#16a34a' }}>{resultModal.ai_detection_score}%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '100%', width: `${resultModal.ai_detection_score}%`, background: resultModal.ai_detection_score >= 50 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: '4px' }} />
                <div style={{ position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%', background: '#94a3b8' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>0% Human</span>
                <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700' }}>50% limit</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>100% AI</span>
              </div>
            </div>
          )}

          {resultModal.ai_feedback && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
              <p style={{ ...C.sL, color: '#1d4ed8' }}>🤖 AI Feedback</p>
              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.85', whiteSpace: 'pre-wrap' }}>{resultModal.ai_feedback}</p>
            </div>
          )}
          {resultModal.teacher_feedback && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
              <p style={{ ...C.sL, color: '#15803d' }}>👨‍🏫 Teacher Feedback</p>
              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.85' }}>{resultModal.teacher_feedback}</p>
            </div>
          )}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={C.sL}>Your Submission</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                {resultModal.essay_text?.trim().split(/\s+/).filter(Boolean).length} words
                {resultModal.file_name ? ` · 📎 ${resultModal.file_name}` : ''}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.85', margin: 0, whiteSpace: 'pre-wrap' }}>{resultModal.essay_text}</p>
          </div>
        </Sheet>
      )}
    </div>
  );
}