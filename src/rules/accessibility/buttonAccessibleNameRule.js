/**
 * WCAG 4.1.2 - Name, Role, Value
 * Buttons and icon buttons must have an accessible name.
 */
const { buildSelectorPath } = require('../utils');

const buttonAccessibleNameRule = {
  id: 'GIGW_A11Y_BUTTON_NAME_001',
  title: 'Buttons have accessible names',
  description:
    'Checks that button and submit elements have text or aria-label for screen readers.',
  category: 'Accessibility',
  severity: 'high',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Name, role, value (WCAG 4.1.2)',
  },
  check($) {
    const buttons = $('button, input[type="submit"], input[type="button"], input[type="reset"], [role="button"]');
    const unnamed = [];

    buttons.each((_, el) => {
      const $el = $(el);
      const tag = el.tagName.toLowerCase();
      const type = ($el.attr('type') || '').toLowerCase();

      let name = $el.attr('aria-label') || $el.attr('aria-labelledby') || $el.attr('title') || '';
      if (!name) {
        name = $el.text().trim();
      }
      if (!name && tag === 'input') {
        name = $el.attr('value') || '';
      }

      if (!(name || '').trim()) {
        unnamed.push({
          selector: buildSelectorPath($el),
          tag: tag + (type ? `[type="${type}"]` : ''),
        });
      }
    });

    const total = buttons.length;

    if (total === 0) {
      return {
        status: 'pass',
        details: { totalButtons: 0 },
        suggestions: [],
      };
    }

    if (unnamed.length > 0) {
      const ratio = unnamed.length / total;
      const status = ratio > 0.5 ? 'fail' : 'needs_review';
      return {
        status,
        details: {
          totalButtons: total,
          unnamedCount: unnamed.length,
          examples: unnamed.slice(0, 10),
        },
        suggestions: [
          'Add visible text, aria-label, or aria-labelledby to every button so screen readers can announce its purpose.',
        ],
      };
    }

    return {
      status: 'pass',
      details: { totalButtons: total },
      suggestions: [],
    };
  },
};

module.exports = buttonAccessibleNameRule;
