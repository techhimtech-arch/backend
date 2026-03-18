/**
 * GIGW Quality 17, WCAG 2.4.2 - Page Titled
 * Web pages have titles that describe the topic or purpose.
 */
const pageTitleRule = {
  id: 'GIGW_QUALITY_PAGE_TITLE_001',
  title: 'Page has a descriptive title',
  description:
    'Checks that the page has a meaningful <title> element that describes the topic or purpose.',
  category: 'Quality',
  severity: 'high',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Quality Guidelines',
    clause: 'Proper page title and metadata',
  },
  check($, context) {
    const title = (context.title || '').trim();
    const titleFromDoc = $('head title').text().trim();
    const effectiveTitle = title || titleFromDoc;

    if (!effectiveTitle) {
      return {
        status: 'fail',
        details: { found: false },
        suggestions: [
          'Add a <title> element in the <head> that clearly describes the page content.',
        ],
      };
    }

    if (effectiveTitle.length < 10) {
      return {
        status: 'needs_review',
        details: { title: effectiveTitle, length: effectiveTitle.length },
        suggestions: [
          'Page title should be descriptive (typically 30–60 characters). Consider a more descriptive title.',
        ],
      };
    }

    const genericTitles = ['untitled', 'home', 'page', 'welcome', 'index'];
    const isGeneric = genericTitles.some(
      (g) => effectiveTitle.toLowerCase() === g
    );

    if (isGeneric) {
      return {
        status: 'needs_review',
        details: { title: effectiveTitle },
        suggestions: ['Use a descriptive title specific to the page content.'],
      };
    }

    return {
      status: 'pass',
      details: { title: effectiveTitle },
      suggestions: [],
    };
  },
};

module.exports = pageTitleRule;
