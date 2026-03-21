/**
 * Rule:
 * - There should be a clear heading hierarchy.
 * - At least one <h1> should be present.
 * - Heading levels should not jump too aggressively (e.g. h1 -> h4).
 */
const headingStructureRule = {
  id: 'GIGW_A11Y_HEADINGS_001',
  title: 'Page has a clear heading structure',
  description:
    'Checks the presence of a main heading and reasonable heading level progression to support screen reader navigation and content clarity.',
  category: 'Accessibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Content structure',
    clause: 'Headings and hierarchy',
  },

  /**
   * @param {import('cheerio').CheerioAPI} $
   * @param {{ url: string, title: string }} _context
   */
  check($, _context) {
    const headings = [];

    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const tag = el.tagName.toLowerCase();
      const level = Number(tag.replace('h', ''));
      headings.push({
        tag,
        level,
        text: $(el).text().trim().slice(0, 120),
      });
    });

    const h1Count = headings.filter((h) => h.level === 1).length;
    const issues = [];

    if (h1Count === 0) {
      issues.push('No <h1> main heading found on the page.');
    }

    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1];
      const current = headings[i];
      if (current.level - prev.level > 2) {
        issues.push(
          `Heading level jumps from ${prev.tag} to ${current.tag} ("${current.text || '...'}"...).`,
        );
      }
    }

    let status;
    if (issues.length === 0) {
      status = 'pass';
    } else if (h1Count === 0 || issues.length > 3) {
      status = 'fail';
    } else {
      status = 'needs_review';
    }

    return {
      status,
      details: {
        totalHeadings: headings.length,
        h1Count,
        issues,
        sampleHeadings: headings.slice(0, 15),
      },
      suggestions: [
        'Ensure the page has a single, descriptive <h1> that describes the main topic.',
        'Use subsequent headings (<h2>, <h3>, etc.) to structure content in a logical outline.',
        'Avoid skipping multiple levels (for example, going directly from <h1> to <h4>).',
      ],
    };
  },
};

module.exports = headingStructureRule;

