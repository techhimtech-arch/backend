/**
 * UX4G / GIGW - Ownership / About section
 * Checks that the site exposes an About / About Us / About Department entry.
 */
const { buildSelectorPath } = require('../utils');

const aboutOwnershipRule = {
  id: 'UX4G_TRUST_ABOUT_001',
  title: 'About / Ownership information is present',
  description:
    'Checks that the website exposes an About / About Us / About Department section for organisational information.',
  category: 'Trust & Credibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'UX4G',
    section: 'Trust & Credibility',
    clause: 'About Us section & ownership info',
  },
  check($) {
    const keywords = [
      'about',
      'about us',
      'about department',
      'about the ministry',
      'हमारे बारे में',
      'परिचय',
    ];

    const matches = [];

    $('a[href], h1, h2, h3, h4, h5, h6').each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim().toLowerCase();
      if (!text) return;

      const hit = keywords.some((k) => text.includes(k));
      if (hit) {
        matches.push({
          selector: buildSelectorPath($el),
          text: $el.text().trim().slice(0, 80),
        });
      }
    });

    if (matches.length === 0) {
      return {
        status: 'needs_review',
        details: {
          found: false,
        },
        suggestions: [
          'Add an About / About Us / About Department section describing the organisation and its mandate.',
        ],
      };
    }

    return {
      status: 'pass',
      details: {
        count: matches.length,
        examples: matches.slice(0, 5),
      },
      suggestions: [],
    };
  },
};

module.exports = aboutOwnershipRule;

