/**
 * GIGW Quality 17, WCAG 3.1.1 - Language of Page
 * The default human language of each web page can be programmatically determined.
 */
const htmlLangRule = {
  id: 'GIGW_A11Y_HTML_LANG_001',
  title: 'Page language is declared',
  description:
    'Checks that the <html> element has a valid lang attribute for screen readers and language detection.',
  category: 'Accessibility',
  severity: 'high',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Language of page (WCAG 3.1.1)',
  },
  check($) {
    const htmlEl = $('html');
    const lang = (htmlEl.attr('lang') || '').trim();

    if (!lang) {
      return {
        status: 'fail',
        details: { hasLang: false },
        suggestions: [
          'Add a lang attribute to the <html> element (e.g. lang="en" for English, lang="hi" for Hindi).',
        ],
      };
    }

    const validPattern = /^[a-z]{2}(-[A-Za-z]{2,})?$/;
    if (!validPattern.test(lang)) {
      return {
        status: 'needs_review',
        details: { lang, note: 'Format should be like "en", "hi", "en-IN"' },
        suggestions: [
          'Use a valid BCP 47 language code (e.g. lang="en", lang="hi", lang="en-IN").',
        ],
      };
    }

    return {
      status: 'pass',
      details: { lang },
      suggestions: [],
    };
  },
};

module.exports = htmlLangRule;
