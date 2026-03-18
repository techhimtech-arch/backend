/**
 * UX4G - Breadcrumb navigation
 * Checks for breadcrumb navigation to show user location in the site structure.
 */
const { buildSelectorPath } = require('./utils');

const breadcrumbsRule = {
  id: 'UX4G_NAV_BREADCRUMBS_001',
  title: 'Breadcrumb navigation is available',
  description:
    'Checks that the page provides breadcrumb navigation or similar indicators for deep hierarchies.',
  category: 'Navigation & IA',
  severity: 'low',
  guidelineRef: {
    standard: 'UX4G',
    section: 'Navigation & Information Architecture',
    clause: 'Breadcrumbs or path indicators',
  },
  check($) {
    const matches = [];

    // ARIA breadcrumb landmarks
    $('nav[aria-label]').each((_, el) => {
      const $el = $(el);
      const label = ($el.attr('aria-label') || '').toLowerCase();
      if (label.includes('breadcrumb')) {
        matches.push({
          selector: buildSelectorPath($el),
          type: 'aria-label',
          label: $el.attr('aria-label'),
        });
      }
    });

    // Semantic breadcrumbs by class
    $('[class]').each((_, el) => {
      const $el = $(el);
      const className = ($el.attr('class') || '').toLowerCase();
      if (className.includes('breadcrumb')) {
        matches.push({
          selector: buildSelectorPath($el),
          type: 'class',
          className: $el.attr('class'),
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
          'For deeper sites, provide breadcrumb navigation to help users understand their location and move up levels easily.',
        ],
      };
    }

    return {
      status: 'pass',
      details: {
        count: matches.length,
        examples: matches.slice(0, 3),
      },
      suggestions: [],
    };
  },
};

module.exports = breadcrumbsRule;

