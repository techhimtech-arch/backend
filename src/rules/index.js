const fs = require('fs');
const path = require('path');

const rulesDir = __dirname;
const categories = ['accessibility', 'trust', 'quality', 'navigation'];
const ALL_RULES = [];

for (const cat of categories) {
  const catPath = path.join(rulesDir, cat);
  if (fs.existsSync(catPath)) {
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const rule = require(path.join(catPath, file));
      rule.category = cat;
      ALL_RULES.push(rule);
    }
  }
}

function normalizeResult(rule, rawResult) {
  if (rawResult && typeof rawResult.ruleId !== 'undefined') {
    return rawResult;
  }
  let status = 'fail';
  if (rawResult && rawResult.status === 'pass') status = 'pass';
  if (rawResult && rawResult.status === 'needs_review') status = 'manual_check';
  if (!rawResult || rawResult.status === 'error') status = 'error';

  let message = rule.title || rule.description || '';
  if (rawResult && rawResult.details && rawResult.details.message) {
    message = rawResult.details.message;
  }
  let recommendation = '';
  if (rawResult && Array.isArray(rawResult.suggestions) && rawResult.suggestions.length > 0) {
    recommendation = rawResult.suggestions.join(' ');
  }
  return {
    ruleId: rule.id || rule.ruleId || 'UNKNOWN_RULE',
    category: rule.category || 'quality',
    severity: rule.severity || 'medium',
    status,
    message,
    recommendation
  };
}

function runAllRules($, context) {
  const issues = [];
  for (const rule of ALL_RULES) {
    let rawResult;
    try {
      rawResult = rule.check($, context);
    } catch (err) {
      rawResult = {
        status: 'error',
        details: { message: String(err) },
        suggestions: ['Rule execution crashed. Please verify rule implementation.']
      };
    }
    issues.push(normalizeResult(rule, rawResult));
  }
  return issues;
}

module.exports = { runAllRules, ALL_RULES };
