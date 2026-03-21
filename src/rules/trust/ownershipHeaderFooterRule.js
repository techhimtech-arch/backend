/**
 * UX4G / GIGW - Ownership info in header/footer
 */

const ownershipHeaderFooterRule = {
  ruleId: 'UX4G_TRUST_OWNERSHIP_002',
  title: 'Ownership Information in Header/Footer',
  category: 'trust',
  severity: 'medium',
  check($) {
    const headerFooterText = $('header, footer, .header, .footer, #header, #footer').text().toLowerCase();
    
    // Quick heuristic for ownership terms
    const keywords = ['owned by', 'department of', 'ministry of', 'government of', 'copyright', 'managed by'];
    
    const found = keywords.some(k => headerFooterText.includes(k));

    if (!found) {
      return {
        ruleId: this.ruleId,
        category: this.category,
        severity: this.severity,
        status: 'fail',
        message: 'Could not detect clear ownership or copyright information in the header or footer.',
        recommendation: 'Add explicit ownership/governance details (e.g. "Owned by Ministry of X") in the global footer.'
      };
    }

    return {
      ruleId: this.ruleId,
      category: this.category,
      severity: this.severity,
      status: 'pass',
      message: 'Ownership information detected in header/footer regions.',
      recommendation: ''
    };
  }
};

module.exports = ownershipHeaderFooterRule;
