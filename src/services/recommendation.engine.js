/**
 * Generate actionable recommendations from the issues.
 * @param {Array<{ruleId, category, severity, status, message, recommendation}>} issues
 */
function generateRecommendations(issues) {
  const recommendations = [];
  const failedIssues = issues.filter(i => i.status === 'fail');

  // Aggregate by category
  const categorized = failedIssues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = [];
    }
    acc[issue.category].push({
      ruleId: issue.ruleId,
      severity: issue.severity,
      message: issue.message,
      recommendation: issue.recommendation
    });
    return acc;
  }, {});

  for (const [category, catIssues] of Object.entries(categorized)) {
    const highPriority = catIssues.filter(i => i.severity === 'high');
    const mediumPriority = catIssues.filter(i => i.severity === 'medium');
    const lowPriority = catIssues.filter(i => i.severity === 'low');

    recommendations.push({
      category,
      priorities: {
        high: highPriority.map(i => i.recommendation),
        medium: mediumPriority.map(i => i.recommendation),
        low: lowPriority.map(i => i.recommendation)
      }
    });
  }

  return recommendations;
}

module.exports = {
  generateRecommendations
};
