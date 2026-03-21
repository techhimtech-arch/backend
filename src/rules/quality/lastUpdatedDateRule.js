/**
 * UX4G / GIGW - Last Updated Date Detection
 */

const lastUpdatedDateRule = {
  ruleId: 'UX4G_QUALITY_LAST_UPDATED_001',
  title: 'Presence of Last Updated Date',
  category: 'quality',
  severity: 'low',
  check($) {
    const text = $('body').text().toLowerCase();
    
    // Heuristic for updated dates
    const patterns = [
      /last updated on\s*:?\s*\d+/i,
      /page last updated/i,
      /updated on\s*:?\s*\d+/i,
      /last reviewed/i,
      /date of update/i
    ];
    
    const found = patterns.some(p => p.test(text));

    if (!found) {
      return {
        ruleId: this.ruleId,
        category: this.category,
        severity: this.severity,
        status: 'fail',
        message: 'Could not detect a "Last Updated" or "Last Reviewed" date on the page.',
        recommendation: 'Add a "Last Updated" timestamp to the footer to inform users about the freshness of the content.'
      };
    }

    return {
      ruleId: this.ruleId,
      category: this.category,
      severity: this.severity,
      status: 'pass',
      message: 'Last updated timestamp detected.',
      recommendation: ''
    };
  }
};

module.exports = lastUpdatedDateRule;
