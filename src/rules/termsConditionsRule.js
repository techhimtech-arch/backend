/**
 * UX4G / GIGW - Terms & Conditions presence
 * Checks whether the page exposes a Terms & Conditions link.
 */
const { buildSelectorPath } = require('./utils');

const termsConditionsRule = {
  id: 'UX4G_TRUST_TERMS_001',
  title: 'Terms & Conditions link is present',
  description:
    'Checks that the page exposes a clearly labelled Terms & Conditions / Terms of Use link.',
  category: 'Trust & Credibility',
  severity: 'low',
  guidelineRef: {
    standard: 'UX4G',
    section: 'Trust & Credibility',
    clause: 'Privacy and Terms visibility',
  },
  check($) {
    const candidates = [];

    $('a[href]').each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim().toLowerCase();
      const href = ($el.attr('href') || '').toLowerCase();

      const matchText =
        text.includes('terms & conditions') ||
        text.includes('terms and conditions') ||
        text.includes('terms of use') ||
        text.includes('नियम') ||
        text.includes('शर्त');

      const matchHref =
        href.includes('terms') ||
        href.includes('conditions');

      if (matchText || matchHref) {
        candidates.push({
          selector: buildSelectorPath($el),
          text: $el.text().trim().slice(0, 80),
          href: $el.attr('href'),
        });
      }
    });

    if (candidates.length === 0) {
      return {
        status: 'needs_review',
        details: {
          found: false,
        },
        suggestions: [
          'Expose a Terms & Conditions or Terms of Use link so users can understand legal usage conditions.',
        ],
      };
    }

    return {
      status: 'pass',
      details: {
        count: candidates.length,
        examples: candidates.slice(0, 5),
      },
      suggestions: [],
    };
  },
};

module.exports = termsConditionsRule;

