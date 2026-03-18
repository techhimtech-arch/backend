/**
 * UX4G / GIGW - Privacy Policy link presence
 * Checks whether the page exposes a Privacy Policy link.
 */
const { buildSelectorPath } = require('./utils');

const privacyPolicyRule = {
  id: 'UX4G_TRUST_PRIVACY_POLICY_001',
  title: 'Privacy Policy link is present',
  description:
    'Checks that the page exposes a clearly labelled Privacy Policy link so users can review data practices.',
  category: 'Trust & Credibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'UX4G',
    section: 'Trust & Credibility',
    clause: 'Privacy Policy availability',
  },
  check($) {
    const candidates = [];

    $('a[href]').each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim().toLowerCase();
      const href = ($el.attr('href') || '').toLowerCase();

      const matchText =
        text.includes('privacy policy') ||
        text.includes('privacy') ||
        text.includes('गोपनीयता');

      const matchHref =
        href.includes('privacy') ||
        href.includes('policy');

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
        status: 'fail',
        details: {
          found: false,
        },
        suggestions: [
          'Add a clearly labelled Privacy Policy link, typically in the footer or main menu.',
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

module.exports = privacyPolicyRule;

