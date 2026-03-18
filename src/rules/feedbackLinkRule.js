/**
 * UX4G - Feedback / grievance mechanism
 * Checks that there is at least one entry point for feedback or grievance submission.
 */
const { buildSelectorPath } = require('./utils');

const feedbackLinkRule = {
  id: 'UX4G_TRUST_FEEDBACK_001',
  title: 'Feedback / Grievance link is present',
  description:
    'Checks that the site exposes a way for users to submit feedback, grievances or complaints.',
  category: 'Trust & Credibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'UX4G',
    section: 'Trust & Credibility',
    clause: 'User feedback and grievances',
  },
  check($) {
    const keywords = [
      'feedback',
      'grievance',
      'complaint',
      'suggestion',
      'review',
      'rating',
      'शिकायत',
      'प्रतिक्रिया',
    ];

    const matches = [];

    $('a[href], button, input[type="button"], input[type="submit"]').each(
      (_, el) => {
        const $el = $(el);
        const text = $el.text().trim().toLowerCase();
        const value = ($el.attr('value') || '').trim().toLowerCase();
        const ariaLabel = ($el.attr('aria-label') || '').trim().toLowerCase();

        const combined = `${text} ${value} ${ariaLabel}`;
        if (!combined.trim()) return;

        const hit = keywords.some((k) => combined.includes(k));
        if (hit) {
          matches.push({
            selector: buildSelectorPath($el),
            text: ($el.text() || $el.attr('value') || '').trim().slice(0, 80),
            href: $el.attr('href') || null,
          });
        }
      },
    );

    if (matches.length === 0) {
      return {
        status: 'needs_review',
        details: {
          found: false,
        },
        suggestions: [
          'Provide a clear Feedback or Grievance link/button so users can share issues and suggestions.',
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

module.exports = feedbackLinkRule;

