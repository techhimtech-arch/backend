const { buildSelectorPath } = require('../utils');

/**
 * Basic rule:
 * - All <img> elements that convey information should have a non-empty alt attribute.
 * - If many images are missing alt, mark as fail; if a few, mark as needs_review.
 */
const imageAltRule = {
  id: 'GIGW_A11Y_IMG_ALT_001',
  title: 'Images have appropriate alternative text',
  description:
    'Checks whether images on the page provide alternative text to support accessibility and compliance with GIGW accessibility requirements.',
  category: 'Accessibility',
  severity: 'high',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Alt text for non-text content',
  },

  /**
   * @param {import('cheerio').CheerioAPI} $
   * @param {{ url: string, title: string }} _context
   */
  check($, _context) {
    const images = $('img');
    const totalImages = images.length;

    const missingAlt = [];

    images.each((_, el) => {
      const $el = $(el);
      const alt = ($el.attr('alt') || '').trim();

      if (!alt) {
        missingAlt.push({
          selector: buildSelectorPath($el),
          htmlSnippet: $.html($el).slice(0, 200),
        });
      }
    });

    if (totalImages === 0) {
      return {
        status: 'pass',
        details: {
          totalImages,
          missingAltCount: 0,
        },
        suggestions: [],
      };
    }

    const ratio = missingAlt.length / totalImages;

    let status;
    if (missingAlt.length === 0) {
      status = 'pass';
    } else if (ratio <= 0.1) {
      status = 'needs_review';
    } else {
      status = 'fail';
    }

    return {
      status,
      details: {
        totalImages,
        missingAltCount: missingAlt.length,
        examples: missingAlt.slice(0, 10),
      },
      suggestions: [
        'Provide meaningful alt text for all informative images.',
        'Use empty alt (alt="") only for purely decorative images.',
      ],
    };
  },
};

module.exports = imageAltRule;

