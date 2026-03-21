/**
 * UX4G / GIGW - Downloadable file metadata
 */

const downloadableFileMetadataRule = {
  ruleId: 'UX4G_ACCESSIBILITY_FILE_META_001',
  title: 'Downloadable File Metadata (Size, Format)',
  category: 'accessibility',
  severity: 'medium',
  check($) {
    let missingMetadataCount = 0;

    $('a[href]').each((_, el) => {
      const $el = $(el);
      const href = $el.attr('href');
      const text = $el.text().toLowerCase();
      
      if (href && href.match(/\.(pdf|doc|docx|xls|xlsx|zip)$/i)) {
        // Checking if link text or nearby text mentions format or size
        // e.g. "Download Report (PDF, 2MB)"
        const hasFormat = /(pdf|doc|xls|zip)/i.test(text);
        const hasSize = /(\d+\s*(kb|mb|gb|bytes))/i.test(text);
        
        if (!hasFormat && !hasSize) {
          missingMetadataCount++;
        }
      }
    });

    if (missingMetadataCount > 0) {
      return {
        ruleId: this.ruleId,
        category: this.category,
        severity: this.severity,
        status: 'fail',
        message: `Found ${missingMetadataCount} downloadable link(s) without file size or format indication.`,
        recommendation: 'Include file type and size in the link text for downloadable files (e.g., "Report (PDF, 2.5 MB)").'
      };
    }

    return {
      ruleId: this.ruleId,
      category: this.category,
      severity: this.severity,
      status: 'pass',
      message: 'All downloadable links have appropriate metadata or none existed.',
      recommendation: ''
    };
  }
};

module.exports = downloadableFileMetadataRule;
