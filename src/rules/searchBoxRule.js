/**
 * UX4G - Search box presence for large applications
 * Checks for search input or search form controls.
 */
const { buildSelectorPath } = require('./utils');

const searchBoxRule = {
  id: 'UX4G_NAV_SEARCH_001',
  title: 'Search box is available (if needed)',
  description:
    'Detects the presence of a search box so users can quickly find content on larger sites.',
  category: 'Navigation & IA',
  severity: 'low',
  guidelineRef: {
    standard: 'UX4G',
    section: 'Search',
    clause: 'Search box for large applications',
  },
  check($) {
    const matches = [];

    // Look for explicit search input types
    $('input[type="search"]').each((_, el) => {
      const $el = $(el);
      matches.push({
        selector: buildSelectorPath($el),
        type: 'search',
        placeholder: $el.attr('placeholder') || '',
      });
    });

    // Look for text inputs with search placeholder or aria-label
    $('input[type="text"], input:not([type])').each((_, el) => {
      const $el = $(el);
      const placeholder = ($el.attr('placeholder') || '').toLowerCase();
      const ariaLabel = ($el.attr('aria-label') || '').toLowerCase();
      const role = ($el.attr('role') || '').toLowerCase();

      const looksLikeSearch =
        role === 'searchbox' ||
        placeholder.includes('search') ||
        placeholder.includes('खोज') ||
        ariaLabel.includes('search') ||
        ariaLabel.includes('खोज');

      if (looksLikeSearch) {
        matches.push({
          selector: buildSelectorPath($el),
          type: 'text',
          placeholder: $el.attr('placeholder') || '',
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
          'For larger sites, provide a visible search box (e.g. in header) to help users quickly find content.',
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

module.exports = searchBoxRule;

