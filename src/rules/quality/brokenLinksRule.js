/**
 * UX4G / GIGW - Broken Links Check (Static/Heuristic part)
 */

const brokenLinksRule = {
  ruleId: 'UX4G_QUALITY_BROKEN_LINKS_001',
  title: 'No broken links (Format checking)',
  category: 'quality',
  severity: 'high',
  check($) {
    const suspiciousLinks = [];

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href').trim();
      if (!href) return;
      
      if (href === '#' || href.startsWith('javascript:void(0)')) {
        suspiciousLinks.push(href);
      }
    });

    if (suspiciousLinks.length > 0) {
      return {
        ruleId: this.ruleId,
        category: this.category,
        severity: this.severity,
        status: 'fail',
        message: `Found ${suspiciousLinks.length} suspicious or potentially broken links (e.g., # or javascript:void(0)).`,
        recommendation: 'Replace placeholder links with actual URLs or use buttons for javascript actions.'
      };
    }

    return {
      ruleId: this.ruleId,
      category: this.category,
      severity: this.severity,
      status: 'pass',
      message: 'No suspicious dummy links found.',
      recommendation: ''
    };
  }
};

module.exports = brokenLinksRule;
