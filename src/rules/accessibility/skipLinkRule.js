/**
 * WCAG 2.4.1 - Bypass Blocks
 * A mechanism is available to bypass blocks of content that are repeated on multiple web pages.
 */
const { buildSelectorPath } = require('../utils');

const skipLinkRule = {
  id: 'GIGW_A11Y_SKIP_LINK_001',
  title: 'Skip to main content link is available',
  description:
    'Checks for a skip link or similar mechanism so keyboard users can bypass repeated navigation.',
  category: 'Accessibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Bypass blocks (WCAG 2.4.1)',
  },
  check($) {
    const body = $('body');
    const mainContent = body.find('main, [role="main"], #main, #content, #main-content').first();
    const mainId = mainContent.attr('id');

    const skipLinks = $('a[href^="#"]').filter((_, el) => {
      const href = $(el).attr('href');
      const anchor = href === '#' ? '' : href.slice(1);
      const text = $(el).text().trim().toLowerCase();
      const isSkip =
        text.includes('skip') ||
        text.includes('main content') ||
        text.includes('content') ||
        /^#(main|content|main-content)$/.test(href) ||
        (anchor && mainId && anchor === mainId);
      return isSkip;
    });

    const hasMainLandmark =
      $('main').length > 0 || $('[role="main"]').length > 0;

    if (skipLinks.length > 0) {
      return {
        status: 'pass',
        details: {
          skipLinkCount: skipLinks.length,
          hasMainLandmark,
        },
        suggestions: [],
      };
    }

    if (hasMainLandmark && mainId) {
      return {
        status: 'needs_review',
        details: {
          hasMainLandmark: true,
          mainId,
          note: 'Main landmark exists but no visible skip link found',
        },
        suggestions: [
          'Add a "Skip to main content" link as the first focusable element that links to #' +
            mainId +
            '.',
        ],
      };
    }

    const navCount = $('nav, [role="navigation"]').length;
    if (navCount > 0) {
      return {
        status: 'fail',
        details: {
          navCount,
          note: 'Repeated navigation exists but no skip mechanism found',
        },
        suggestions: [
          'Add a "Skip to main content" link at the top of the page linking to the main content area.',
          'Ensure the main content has an id and is the target of the skip link.',
        ],
      };
    }

    return {
      status: 'pass',
      details: {
        note: 'No significant repeated navigation blocks detected',
      },
      suggestions: [],
    };
  },
};

module.exports = skipLinkRule;
