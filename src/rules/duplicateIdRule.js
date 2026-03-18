/**
 * WCAG 4.1.1 - Parsing
 * Any IDs are unique in the document.
 */
const duplicateIdRule = {
  id: 'GIGW_A11Y_DUPLICATE_ID_001',
  title: 'No duplicate IDs in document',
  description:
    'Checks that all id attributes are unique. Duplicate IDs break accessibility and fragment links.',
  category: 'Accessibility',
  severity: 'high',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Parsing (WCAG 4.1.1)',
  },
  check($) {
    const idCount = {};
    $('[id]').each((_, el) => {
      const id = $(el).attr('id');
      if (id) {
        idCount[id] = (idCount[id] || 0) + 1;
      }
    });

    const duplicates = Object.entries(idCount)
      .filter(([, count]) => count > 1)
      .map(([id, count]) => ({ id, count }));

    if (duplicates.length === 0) {
      return {
        status: 'pass',
        details: { totalIds: Object.keys(idCount).length },
        suggestions: [],
      };
    }

    return {
      status: 'fail',
      details: {
        duplicateCount: duplicates.length,
        examples: duplicates.slice(0, 15),
      },
      suggestions: [
        'Ensure each id attribute is unique in the document. Duplicate IDs cause unpredictable behavior for links, labels, and ARIA.',
      ],
    };
  },
};

module.exports = duplicateIdRule;
