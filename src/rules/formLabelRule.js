const { buildSelectorPath } = require('./utils');

/**
 * Rule:
 * - Form controls (inputs, selects, textareas) must have an associated label
 *   via <label for>, wrapping label, or aria attributes.
 */
const formLabelRule = {
  id: 'GIGW_A11Y_FORM_LABEL_001',
  title: 'Form fields have associated labels',
  description:
    'Checks whether form controls are properly labelled to support accessibility and usability.',
  category: 'Accessibility',
  severity: 'high',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Forms',
    clause: 'Labels and instructions',
  },

  /**
   * @param {import('cheerio').CheerioAPI} $
   * @param {{ url: string, title: string }} _context
   */
  check($, _context) {
    const controls = $('input, select, textarea').filter((_, el) => {
      const $el = $(el);
      const type = ($el.attr('type') || '').toLowerCase();
      if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'image') {
        return false;
      }
      return true;
    });

    const unlabeled = [];

    controls.each((_, el) => {
      const $el = $(el);
      const id = $el.attr('id');
      const ariaLabel = $el.attr('aria-label');
      const ariaLabelledBy = $el.attr('aria-labelledby');

      let hasLabel = false;

      if (ariaLabel || ariaLabelledBy) {
        hasLabel = true;
      }

      if (!hasLabel && id) {
        const labelFor = $(`label[for="${id}"]`);
        if (labelFor.length > 0) {
          hasLabel = true;
        }
      }

      if (!hasLabel) {
        const parentLabel = $el.closest('label');
        if (parentLabel.length > 0) {
          hasLabel = true;
        }
      }

      if (!hasLabel) {
        unlabeled.push({
          selector: buildSelectorPath($el),
          htmlSnippet: $.html($el).slice(0, 200),
        });
      }
    });

    if (controls.length === 0) {
      return {
        status: 'pass',
        details: {
          totalControls: 0,
          unlabeledCount: 0,
        },
        suggestions: [],
      };
    }

    const ratio = unlabeled.length / controls.length;

    let status;
    if (unlabeled.length === 0) {
      status = 'pass';
    } else if (ratio <= 0.1) {
      status = 'needs_review';
    } else {
      status = 'fail';
    }

    return {
      status,
      details: {
        totalControls: controls.length,
        unlabeledCount: unlabeled.length,
        examples: unlabeled.slice(0, 10),
      },
      suggestions: [
        'Ensure each form control has a visible label connected using the "for" attribute or wrapping label element.',
        'Alternatively, use accessible name techniques like aria-label or aria-labelledby, especially for icon-only controls.',
      ],
    };
  },
};

module.exports = formLabelRule;

