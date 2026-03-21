/**
 * GIGW Quality 15 - Responsive design
 * Website uses responsive design features to ensure interface displays well on different screen sizes.
 * WCAG 1.4.10 Reflow - content without horizontal scrolling at 320px width.
 */
const viewportRule = {
  id: 'GIGW_QUALITY_VIEWPORT_001',
  title: 'Page has viewport meta for responsive display',
  description:
    'Checks that a viewport meta tag is present to support responsive layout on different devices.',
  category: 'Quality',
  severity: 'high',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Quality Guidelines',
    clause: 'Responsive design / CSS layout',
  },
  check($) {
    const viewport = $('meta[name="viewport"]').attr('content') || '';

    if (!viewport.trim()) {
      return {
        status: 'fail',
        details: { hasViewport: false },
        suggestions: [
          'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for responsive design.',
        ],
      };
    }

    const hasWidth = /width\s*=\s*(device-width|\d+)/i.test(viewport);
    if (!hasWidth) {
      return {
        status: 'needs_review',
        details: { content: viewport },
        suggestions: [
          'Viewport should typically include width=device-width for mobile-friendly layout.',
        ],
      };
    }

    return {
      status: 'pass',
      details: { content: viewport },
      suggestions: [],
    };
  },
};

module.exports = viewportRule;
