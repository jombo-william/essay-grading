/**
 * mockAiGrade — simulates the AI grading pipeline for the prototype.
 * In production this would call a real API endpoint.
 *
 * Returns: { total_score, ai_detection_percentage, overall_feedback, ai_detection_note }
 */
export async function mockAiGrade({ essayText, assignment }) {
  // Simulate network + processing delay (2–4 seconds)
  await new Promise(r => setTimeout(r, 2200 + Math.random() * 1800));

  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // ── AI detection heuristics (deterministic-ish from text patterns) ──
  const genericPhrases = [
    'multifaceted', 'furthermore', 'in conclusion', 'it is important to note',
    'plays a crucial role', 'in today\'s world', 'throughout history',
    'significantly impacts', 'one must consider', 'it is worth noting',
    'in summary', 'as mentioned above', 'on the other hand',
  ];
  const lowerText = essayText.toLowerCase();
  const genericCount = genericPhrases.filter(p => lowerText.includes(p)).length;
  const hasPersonalVoice = /\b(i |my |we |our |personally|in my view|i believe|i think)\b/i.test(essayText);
  const hasSpecificExamples = /\b(20\d\d|for example|for instance|such as|according to)\b/i.test(essayText);
  const sentenceLengths = essayText.split(/[.!?]+/).map(s => s.trim().split(/\s+/).length);
  const avgSentLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const lengthVariance = sentenceLengths.reduce((a, b) => a + Math.abs(b - avgSentLen), 0) / sentenceLengths.length;

  let aiPct = 15; // base
  aiPct += genericCount * 7;
  if (!hasPersonalVoice) aiPct += 18;
  if (!hasSpecificExamples) aiPct += 12;
  if (lengthVariance < 3) aiPct += 15; // uniform sentence length = AI signal
  if (wordCount > 600) aiPct -= 8; // longer essays more likely human
  aiPct = Math.min(95, Math.max(3, aiPct + Math.floor(Math.random() * 12) - 6));

  const isAiFlagged = aiPct >= 50;

  if (isAiFlagged) {
    return {
      total_score: 0,
      ai_detection_percentage: aiPct,
      overall_feedback: `⚠️ HIGH AI CONTENT DETECTED\n\nAn estimated ${aiPct}% of this essay appears AI-generated.\n\nPer academic integrity policy, essays with ≥50% AI content receive a score of 0/100.\n\nIndicators detected:\n• ${!hasPersonalVoice ? 'No personal voice or first-person examples\n• ' : ''}${genericCount > 2 ? 'Overuse of generic academic phrases\n• ' : ''}${lengthVariance < 3 ? 'Unnaturally uniform sentence structure\n• ' : ''}Vocabulary patterns consistent with LLM output\n\nPlease rewrite in your own words with specific examples and original analysis.`,
      ai_detection_note: null,
    };
  }

  // ── Score each rubric criterion ──
  const rubric = assignment.rubric;
  const rubricEntries = Object.entries(rubric);
  let breakdown = [];
  let totalScore = 0;

  for (const [criterion, weight] of rubricEntries) {
    let pct = 0.72 + Math.random() * 0.22; // 72–94% base performance

    // Adjust by criterion type
    if (criterion === 'grammar' || criterion === 'structure') {
      pct = Math.min(0.97, pct + 0.05);
    }
    if (criterion === 'evidence' || criterion === 'examples') {
      pct = hasSpecificExamples ? pct : pct * 0.72;
    }
    if (criterion === 'content' || criterion === 'argumentation') {
      pct = wordCount >= 400 ? pct : pct * 0.8;
    }

    const earned = Math.round(weight * pct);
    totalScore += earned;
    breakdown.push({ criterion, earned, weight, pct: Math.round(pct * 100) });
  }

  // Cap at max_score
  totalScore = Math.min(assignment.max_score, totalScore);

  // ── Build detailed feedback ──
  const qualLabel = totalScore >= 85 ? 'Excellent' : totalScore >= 75 ? 'Good' : totalScore >= 65 ? 'Satisfactory' : 'Needs Improvement';
  const strengthCriterion = breakdown.reduce((a, b) => (a.pct > b.pct ? a : b));
  const weakCriterion = breakdown.reduce((a, b) => (a.pct < b.pct ? a : b));

  const feedbackLines = [
    `Overall Assessment: ${qualLabel} work — ${totalScore}/${assignment.max_score}\n`,
    ...breakdown.map(b => {
      const label = b.pct >= 88 ? 'Strong' : b.pct >= 76 ? 'Good' : b.pct >= 64 ? 'Satisfactory' : 'Needs work';
      const cap = b.criterion.charAt(0).toUpperCase() + b.criterion.slice(1);
      return `${cap} (${b.earned}/${b.weight}): ${label}`;
    }),
    `\nStrength: ${strengthCriterion.criterion} was your strongest area.`,
    `Area to improve: ${weakCriterion.criterion} — consider adding more ${weakCriterion.criterion === 'evidence' || weakCriterion.criterion === 'examples' ? 'specific citations and real-world examples' : weakCriterion.criterion === 'structure' ? 'clear paragraph transitions and a stronger conclusion' : weakCriterion.criterion === 'grammar' ? 'proofreading for tense and agreement errors' : 'depth and analysis'}.`,
    `\nAI Detection: ${aiPct < 15 ? 'Very low' : aiPct < 30 ? 'Low' : 'Moderate'} AI involvement (~${aiPct}%). ${aiPct < 20 ? 'Appears authentically written.' : 'Some sections may use AI assistance — ensure the final work is your own.'}`,
  ];

  return {
    total_score: totalScore,
    ai_detection_percentage: aiPct,
    overall_feedback: feedbackLines.join('\n'),
    ai_detection_note: aiPct < 20 ? 'Appears original' : 'Some AI signals detected',
  };
}
