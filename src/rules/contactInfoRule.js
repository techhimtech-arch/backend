/**
 * UX4G / GIGW - Contact / Help / FAQ presence
 * Checks for visible entry points to contact information or support.
 */
const { buildSelectorPath } = require('./utils');

const contactInfoRule = {
  id: 'UX4G_TRUST_CONTACT_001',
  title: 'Contact / Help / FAQ links are present',
  description:
    'Checks that the page exposes links to Contact, Help Center, Support or FAQs so users know how to reach the organisation.',
  category: 'Trust & Credibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'UX4G',
    section: 'Trust & Credibility',
    clause: 'Contact Us and Help information',
  },
  check($) {
    const keywords = [
      'contact',
      'contact us',
      'help',
      'support',
      'faq',
      'faqs',
      'grievance',
      'complaint',
      'संपर्क',
      'मदद',
      'शिकायत',
    ];

    const matches = [];

    $('a[href]').each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim().toLowerCase();

      if (!text) return;

      const hit = keywords.some((k) => text.includes(k));
      if (hit) {
        matches.push({
          selector: buildSelectorPath($el),
          text: $el.text().trim().slice(0, 80),
          href: $el.attr('href'),
        });
      }
    });

    if (matches.length === 0) {
      return {
        status: 'fail',
        details: {
          found: false,
        },
        suggestions: [
          'Provide clear navigation entries for Contact, Help/Support or FAQs in header, footer or main navigation.',
        ],
      };
    }

    return {
      status: 'pass',
      details: {
        count: matches.length,
        examples: matches.slice(0, 8),
      },
      suggestions: [],
    };
  },
};

module.exports = contactInfoRule;

