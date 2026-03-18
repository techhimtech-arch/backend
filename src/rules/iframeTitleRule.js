/**
 * WCAG 4.1.2 - Name, Role, Value (implied for iframes)
 * Iframes must have a title so screen readers can describe their purpose.
 */
const { buildSelectorPath } = require('./utils');

const iframeTitleRule = {
  id: 'GIGW_A11Y_IFRAME_TITLE_001',
  title: 'Iframes have descriptive title',
  description:
    'Checks that all iframe elements have a title attribute for accessibility.',
  category: 'Accessibility',
  severity: 'high',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Name, role, value (WCAG 4.1.2)',
  },
  check($) {
    const iframes = $('iframe');
    const untitled = [];

    iframes.each((_, el) => {
      const $el = $(el);
      const title = ($el.attr('title') || '').trim();

      if (!title) {
        untitled.push({
          selector: buildSelectorPath($el),
          src: ($el.attr('src') || '').slice(0, 80),
        });
      }
    });

    const total = iframes.length;

    if (total === 0) {
      return {
        status: 'pass',
        details: { totalIframes: 0 },
        suggestions: [],
      };
    }

    if (untitled.length > 0) {
      return {
        status: 'fail',
        details: {
          totalIframes: total,
          untitledCount: untitled.length,
          examples: untitled.slice(0, 10),
        },
        suggestions: [
          'Add a title attribute to each iframe describing its content or purpose.',
        ],
      };
    }

    return {
      status: 'pass',
      details: { totalIframes: total },
      suggestions: [],
    };
  },
};

module.exports = iframeTitleRule;
