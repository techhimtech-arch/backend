/**
 * GIGW Quality 19 - Data tables with necessary tags/markup
 * WCAG 1.3.1 - Info and relationships
 */
const { buildSelectorPath } = require('../utils');

const tableStructureRule = {
  id: 'GIGW_QUALITY_TABLE_001',
  title: 'Data tables have proper markup',
  description:
    'Checks that data tables use th elements and scope/headers for structure and accessibility.',
  category: 'Accessibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Quality Guidelines',
    clause: 'Data tables with necessary tags/markup',
  },
  check($) {
    const tables = $('table');
    const issues = [];

    tables.each((idx, el) => {
      const $table = $(el);
      const thCount = $table.find('th').length;
      const caption = $table.find('caption').length;
      const hasScope = $table.find('th[scope]').length > 0;

      if (thCount === 0) {
        const rowCount = $table.find('tr').length;
        if (rowCount > 1) {
          issues.push({
            selector: buildSelectorPath($table),
            reason: 'no_headers',
            note: 'Table with multiple rows but no <th> headers',
          });
        }
      } else if (!hasScope && thCount > 0) {
        issues.push({
          selector: buildSelectorPath($table),
          reason: 'th_without_scope',
          thCount,
          note: 'Consider adding scope="col" or scope="row" to th elements',
        });
      }

      if (caption === 0 && thCount > 0) {
        issues.push({
          selector: buildSelectorPath($table),
          reason: 'no_caption',
          note: 'Consider adding <caption> for table purpose',
        });
      }
    });

    const total = tables.length;

    if (total === 0) {
      return {
        status: 'pass',
        details: { totalTables: 0 },
        suggestions: [],
      };
    }

    const dataTables = tables.filter((_, t) => $(t).find('tr').length > 1);
    const dataTableCount = dataTables.length;

    if (dataTableCount === 0) {
      return {
        status: 'pass',
        details: { totalTables: total, dataTables: 0 },
        suggestions: [],
      };
    }

    const failCount = issues.filter((i) => i.reason === 'no_headers').length;
    let status;
    if (failCount > 0) status = 'fail';
    else if (issues.length > 0) status = 'needs_review';
    else status = 'pass';

    return {
      status,
      details: {
        totalTables: total,
        dataTableCount,
        issues,
        examples: issues.slice(0, 8),
      },
      suggestions: [
        'Use <th> for table headers. Add scope="col" or scope="row" as appropriate.',
        'Add <caption> to describe the table content.',
        'For complex tables, use headers/id attributes to associate cells with headers.',
      ],
    };
  },
};

module.exports = tableStructureRule;
