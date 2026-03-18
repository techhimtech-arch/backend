/**
 * WCAG 2.4.4 - Link Purpose (In Context)
 * The purpose of each link can be determined from the link text alone or with context.
 */
const { buildSelectorPath } = require('./utils');

const GENERIC_LINK_TEXTS = [
  'click here',
  'click',
  'here',
  'read more',
  'more',
  'learn more',
  'link',
  'link to',
  'this link',
  'go',
  'submit',
];

function isGenericText(text) {
  const t = (text || '').trim().toLowerCase();
  if (!t) return true;
  return GENERIC_LINK_TEXTS.some((g) => t === g || t.startsWith(g + ' '));
}

const linkPurposeRule = {
  id: 'GIGW_A11Y_LINK_PURPOSE_001',
  title: 'Links have descriptive text',
  description:
    'Checks that links have meaningful link text so users can understand the destination without context.',
  category: 'Accessibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Link purpose (WCAG 2.4.4)',
  },
  check($) {
    const links = $('a[href]');
    const weak = [];

    links.each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const ariaLabel = ($el.attr('aria-label') || '').trim();
      const titleAttr = ($el.attr('title') || '').trim();

      const accessibleName = ariaLabel || text || titleAttr;

      if (!accessibleName) {
        weak.push({
          selector: buildSelectorPath($el),
          reason: 'empty_link_text',
          href: ($el.attr('href') || '').slice(0, 80),
        });
        return;
      }

      if (isGenericText(accessibleName)) {
        weak.push({
          selector: buildSelectorPath($el),
          reason: 'generic_text',
          text: accessibleName,
          href: ($el.attr('href') || '').slice(0, 80),
        });
      }
    });

    const total = links.length;

    if (total === 0) {
      return {
        status: 'pass',
        details: { totalLinks: 0 },
        suggestions: [],
      };
    }

    const ratio = weak.length / total;
    let status;
    if (weak.length === 0) status = 'pass';
    else if (ratio <= 0.1) status = 'needs_review';
    else status = 'fail';

    return {
      status,
      details: {
        totalLinks: total,
        weakCount: weak.length,
        examples: weak.slice(0, 10),
      },
      suggestions: [
        'Use descriptive link text (e.g. "Download Annual Report" instead of "Click here").',
        'If you must use "Read more", add context via aria-label or surrounding text.',
      ],
    };
  },
};

module.exports = linkPurposeRule;
