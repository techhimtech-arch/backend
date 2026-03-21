/**
 * GIGW Quality 17 - Proper metadata for page like keywords and description
 */
const metaDescriptionRule = {
  id: 'GIGW_QUALITY_META_DESC_001',
  title: 'Page has meta description',
  description:
    'Checks that the page includes a meta description for search and accessibility.',
  category: 'Quality',
  severity: 'medium',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Quality Guidelines',
    clause: 'Proper page title and metadata',
  },
  check($) {
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const content = (metaDesc || '').trim();

    if (!content) {
      return {
        status: 'fail',
        details: { hasDescription: false },
        suggestions: [
          'Add a <meta name="description" content="..."> with a brief summary of the page (typically 120–160 characters).',
        ],
      };
    }

    if (content.length < 30) {
      return {
        status: 'needs_review',
        details: { length: content.length },
        suggestions: ['Meta description should be meaningful (around 120–160 characters).'],
      };
    }

    return {
      status: 'pass',
      details: { length: content.length },
      suggestions: [],
    };
  },
};

module.exports = metaDescriptionRule;
