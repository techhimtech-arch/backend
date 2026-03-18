/**
 * UX4G / GIGW - Government branding and emblem
 * Heuristically checks for presence of government / ministry branding near the top of the page.
 */
const { buildSelectorPath } = require('./utils');

const govBrandingRule = {
  id: 'UX4G_TRUST_GOV_BRANDING_001',
  title: 'Government branding / emblem is visible',
  description:
    'Heuristically checks for national emblem and government branding strings near the top of the page.',
  category: 'Trust & Credibility',
  severity: 'low',
  guidelineRef: {
    standard: 'UX4G',
    section: 'Trust & Credibility',
    clause: 'Association to Government is demonstrated',
  },
  check($) {
    const pageText = $('body').text().toLowerCase();

    const govtPhrases = [
      'government of india',
      'govt. of india',
      'भारत सरकार',
      'govt. of',
      'government of',
      'ministry of',
      'ministries of',
      'department of',
      'भारत सरकार',
    ];

    const hasGovtText = govtPhrases.some((p) => pageText.includes(p));

    const emblemCandidates = [];
    $('img').each((_, el) => {
      const $el = $(el);
      const alt = ($el.attr('alt') || '').toLowerCase();
      const title = ($el.attr('title') || '').toLowerCase();
      const src = ($el.attr('src') || '').toLowerCase();

      const hit =
        alt.includes('emblem') ||
        alt.includes('ashoka') ||
        alt.includes('india') ||
        title.includes('emblem') ||
        title.includes('ashoka') ||
        title.includes('india') ||
        src.includes('emblem') ||
        src.includes('ashoka') ||
        src.includes('india_gov');

      if (hit) {
        emblemCandidates.push({
          selector: buildSelectorPath($el),
          alt: $el.attr('alt') || '',
          title: $el.attr('title') || '',
          src: $el.attr('src') || '',
        });
      }
    });

    if (!hasGovtText && emblemCandidates.length === 0) {
      return {
        status: 'needs_review',
        details: {
          govtTextDetected: false,
          emblemDetected: false,
        },
        suggestions: [
          'Ensure government association is clearly visible via text (e.g. “Government of India”) and emblem where applicable.',
        ],
      };
    }

    return {
      status: 'pass',
      details: {
        govtTextDetected: hasGovtText,
        emblemDetected: emblemCandidates.length > 0,
        emblemExamples: emblemCandidates.slice(0, 3),
      },
      suggestions: [],
    };
  },
};

module.exports = govBrandingRule;

