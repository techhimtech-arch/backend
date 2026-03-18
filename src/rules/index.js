const imageAltRule = require('./imageAltRule');
const formLabelRule = require('./formLabelRule');
const headingStructureRule = require('./headingStructureRule');
const pageTitleRule = require('./pageTitleRule');
const htmlLangRule = require('./htmlLangRule');
const metaDescriptionRule = require('./metaDescriptionRule');
const viewportRule = require('./viewportRule');
const linkPurposeRule = require('./linkPurposeRule');
const tableStructureRule = require('./tableStructureRule');
const skipLinkRule = require('./skipLinkRule');
const iframeTitleRule = require('./iframeTitleRule');
const duplicateIdRule = require('./duplicateIdRule');
const autoplayMediaRule = require('./autoplayMediaRule');
const documentLandmarkRule = require('./documentLandmarkRule');
const buttonAccessibleNameRule = require('./buttonAccessibleNameRule');
const privacyPolicyRule = require('./privacyPolicyRule');
const termsConditionsRule = require('./termsConditionsRule');
const contactInfoRule = require('./contactInfoRule');
const aboutOwnershipRule = require('./aboutOwnershipRule');
const searchBoxRule = require('./searchBoxRule');
const feedbackLinkRule = require('./feedbackLinkRule');
const govBrandingRule = require('./govBrandingRule');
const breadcrumbsRule = require('./breadcrumbsRule');

const ALL_RULES = [
  imageAltRule,
  formLabelRule,
  headingStructureRule,
  pageTitleRule,
  htmlLangRule,
  metaDescriptionRule,
  viewportRule,
  linkPurposeRule,
  tableStructureRule,
  skipLinkRule,
  iframeTitleRule,
  duplicateIdRule,
  autoplayMediaRule,
  documentLandmarkRule,
  buttonAccessibleNameRule,
  privacyPolicyRule,
  termsConditionsRule,
  contactInfoRule,
  aboutOwnershipRule,
  searchBoxRule,
  feedbackLinkRule,
  govBrandingRule,
  breadcrumbsRule,
];

/**
 * Compute a simple score (0–100) based on rule outcomes.
 * This is intentionally straightforward for Phase 1.
 */
function computeScore(findings) {
  if (!findings.length) {
    return 100;
  }

  let weightedTotal = 0;
  let weightedPossible = 0;

  const severityWeight = {
    low: 1,
    medium: 2,
    high: 3,
  };

  for (const f of findings) {
    const weight = severityWeight[f.severity] || 1;
    weightedPossible += weight;

    if (f.status === 'pass') {
      weightedTotal += weight;
    } else if (f.status === 'needs_review') {
      weightedTotal += weight * 0.4;
    } else {
      // fail → 0 contribution
    }
  }

  if (!weightedPossible) return 100;

  return Math.round((weightedTotal / weightedPossible) * 100);
}

/**
 * Run all rules against a Cheerio DOM instance.
 *
 * @param {import('cheerio').CheerioAPI} $ Parsed DOM
 * @param {{ url: string, title: string }} context
 */
function runAllRules($, context) {
  const findings = [];

  for (const rule of ALL_RULES) {
    try {
      const result = rule.check($, context);
      findings.push({
        id: rule.id,
        title: rule.title,
        description: rule.description,
        category: rule.category,
        guidelineRef: rule.guidelineRef || null,
        severity: rule.severity,
        status: result.status,
        details: result.details || {},
        suggestions: result.suggestions || [],
      });
    } catch (err) {
      findings.push({
        id: rule.id,
        title: rule.title,
        description: rule.description,
        category: rule.category,
        guidelineRef: rule.guidelineRef || null,
        severity: rule.severity,
        status: 'needs_review',
        details: {
          error: 'RULE_EXECUTION_FAILED',
          message: String(err),
        },
        suggestions: [
          'Review this rule implementation. The automated check failed to run.',
        ],
      });
    }
  }

  const total = findings.length;
  const passed = findings.filter((f) => f.status === 'pass').length;
  const failed = findings.filter((f) => f.status === 'fail').length;
  const needsReview = findings.filter(
    (f) => f.status === 'needs_review',
  ).length;

  const score = computeScore(findings);

  return {
    findings,
    summary: {
      totalRules: total,
      passed,
      failed,
      needsReview,
      score,
    },
  };
}

module.exports = {
  runAllRules,
};

