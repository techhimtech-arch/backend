/**
 * Calculate scores based on the findings.
 * @param {Array<{ruleId, category, severity, status, message, recommendation}>} findings
 * @returns {Object} Scores by category and a total overall score
 */
function calculateScores(findings) {
  const categories = ['accessibility', 'trust', 'quality', 'navigation'];
  const scores = {};
  
  let totalScore = 0;
  let categoryCount = 0;

  for (const cat of categories) {
    const catFindings = findings.filter(f => f.category === cat);
    if (catFindings.length === 0) {
      scores[cat] = 100; // Default if no rules or all passed
      totalScore += 100;
      categoryCount++;
      continue;
    }

    const maxScore = catFindings.length * 10;
    let earned = 0;

    for (const f of catFindings) {
      if (f.status === 'pass' || f.status === 'not_applicable' || f.status === 'manual_check') {
        earned += 10;
      } else if (f.status === 'fail') {
        if (f.severity === 'high') {
          earned += 0;
        } else if (f.severity === 'medium') {
          earned += 4;
        } else {
          earned += 8;
        }
      }
    }

    const catScore = Math.round((earned / maxScore) * 100);
    scores[cat] = catScore;
    totalScore += catScore;
    categoryCount++;
  }

  const overall = categoryCount > 0 ? Math.round(totalScore / categoryCount) : 100;
  return { ...scores, overall };
}

module.exports = {
  calculateScores
};
