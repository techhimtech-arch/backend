/**
 * GIGW / WCAG - Document structure
 * Page should have a main content landmark for screen reader navigation.
 */
const documentLandmarkRule = {
  id: 'GIGW_A11Y_LANDMARK_001',
  title: 'Page has main content landmark',
  description:
    'Checks that the page has a main content region (main element or role="main") for structure.',
  category: 'Accessibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Info and relationships (WCAG 1.3.1)',
  },
  check($) {
    const main = $('main, [role="main"]');
    const hasMain = main.length > 0;

    const hasContentId =
      $('#main, #content, #main-content').length > 0;

    if (hasMain) {
      return {
        status: 'pass',
        details: { landmarkCount: main.length },
        suggestions: [],
      };
    }

    if (hasContentId) {
      return {
        status: 'needs_review',
        details: {
          note: 'Main content uses id but not semantic <main> or role="main"',
        },
        suggestions: [
          'Consider wrapping main content in <main> or adding role="main" for better structure.',
        ],
      };
    }

    return {
      status: 'needs_review',
      details: {
        note: 'No explicit main content landmark detected',
      },
      suggestions: [
        'Add a <main> element wrapping the primary content, or use role="main" on the main content container.',
      ],
    };
  },
};

module.exports = documentLandmarkRule;
