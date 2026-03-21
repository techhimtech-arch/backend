const { chromium } = require('playwright');
const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');

class LighthouseService {
  constructor() {
    this.lhrCategories = [
      'performance',
      'accessibility',
      'best-practices',
      'seo'
    ];
  }

  async runLighthouseAudit(url) {
    let chrome;
    let browser;
    
    try {
      // Launch Chrome for Lighthouse
      chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
      const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: this.lhrCategories,
        port: chrome.port,
        settings: {
          emulatedFormFactor: 'desktop',
          throttling: {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0
          }
        }
      };

      // Run Lighthouse
      const runnerResult = await lighthouse(url, options);
      const lhr = runnerResult.lhr;

      // Extract key metrics
      const report = {
        url: lhr.finalUrl,
        timestamp: lhr.fetchTime,
        scores: {
          overall: Math.round(lhr.categories.performance.score * 100) || 0,
          performance: Math.round(lhr.categories.performance.score * 100) || 0,
          accessibility: Math.round(lhr.categories.accessibility.score * 100) || 0,
          bestPractices: Math.round(lhr.categories['best-practices'].score * 100) || 0,
          seo: Math.round(lhr.categories.seo.score * 100) || 0
        },
        metrics: this.extractMetrics(lhr),
        audits: this.extractAudits(lhr),
        opportunities: this.extractOpportunities(lhr)
      };

      return report;

    } catch (error) {
      console.error('Lighthouse audit failed:', error);
      throw new Error('Lighthouse audit failed: ' + error.message);
    } finally {
      if (browser) await browser.close();
      if (chrome) await chrome.kill();
    }
  }

  extractMetrics(lhr) {
    const metrics = {};
    
    // Performance metrics
    if (lhr.audits['first-contentful-paint']) {
      metrics.firstContentfulPaint = lhr.audits['first-contentful-paint'].numericValue;
    }
    if (lhr.audits['largest-contentful-paint']) {
      metrics.largestContentfulPaint = lhr.audits['largest-contentful-paint'].numericValue;
    }
    if (lhr.audits['cumulative-layout-shift']) {
      metrics.cumulativeLayoutShift = lhr.audits['cumulative-layout-shift'].numericValue;
    }
    if (lhr.audits['total-blocking-time']) {
      metrics.totalBlockingTime = lhr.audits['total-blocking-time'].numericValue;
    }
    if (lhr.audits['speed-index']) {
      metrics.speedIndex = lhr.audits['speed-index'].numericValue;
    }
    
    return metrics;
  }

  extractAudits(lhr) {
    const audits = {};
    
    // Key performance audits
    const performanceAudits = [
      'uses-webp-images',
      'uses-optimized-images',
      'modern-image-formats',
      'efficient-animated-content',
      'preload-key-requests',
      'uses-text-compression',
      'unused-css-rules',
      'unused-javascript',
      'render-blocking-resources'
    ];

    performanceAudits.forEach(auditId => {
      if (lhr.audits[auditId]) {
        audits[auditId] = {
          score: lhr.audits[auditId].score,
          title: lhr.audits[auditId].title,
          description: lhr.audits[auditId].description,
          displayValue: lhr.audits[auditId].displayValue
        };
      }
    });

    return audits;
  }

  extractOpportunities(lhr) {
    const opportunities = [];
    
    Object.values(lhr.audits).forEach(audit => {
      if (audit.scoreDisplayMode === 'numeric' && 
          audit.score < 1 && 
          audit.numericValue !== undefined) {
        opportunities.push({
          id: audit.id,
          title: audit.title,
          description: audit.description,
          value: audit.numericValue,
          displayValue: audit.displayValue,
          savings: audit.details?.overallSavingsMs || 0
        });
      }
    });

    return opportunities.sort((a, b) => b.savings - a.savings);
  }

  // Generate HTML report
  generateHtmlReport(lhrData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Lighthouse Report - ${lhrData.url}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .score-card { 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 10px 0; 
            display: inline-block;
            min-width: 200px;
        }
        .score-good { border-left: 5px solid #0cce6b; }
        .score-medium { border-left: 5px solid #ffa400; }
        .score-poor { border-left: 5px solid #ff4e42; }
        .score { font-size: 48px; font-weight: bold; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .metric { background: #f5f5f5; padding: 15px; border-radius: 8px; }
        .opportunity { background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>Lighthouse Audit Report</h1>
    <p><strong>URL:</strong> ${lhrData.url}</p>
    <p><strong>Timestamp:</strong> ${new Date(lhrData.timestamp).toLocaleString()}</p>
    
    <h2>Performance Scores</h2>
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div class="score-card ${this.getScoreClass(lhrData.scores.overall)}">
            <div class="score">${lhrData.scores.overall}</div>
            <div>Overall Score</div>
        </div>
        <div class="score-card ${this.getScoreClass(lhrData.scores.performance)}">
            <div class="score">${lhrData.scores.performance}</div>
            <div>Performance</div>
        </div>
        <div class="score-card ${this.getScoreClass(lhrData.scores.accessibility)}">
            <div class="score">${lhrData.scores.accessibility}</div>
            <div>Accessibility</div>
        </div>
        <div class="score-card ${this.getScoreClass(lhrData.scores.bestPractices)}">
            <div class="score">${lhrData.scores.bestPractices}</div>
            <div>Best Practices</div>
        </div>
        <div class="score-card ${this.getScoreClass(lhrData.scores.seo)}">
            <div class="score">${lhrData.scores.seo}</div>
            <div>SEO</div>
        </div>
    </div>

    <h2>Performance Metrics</h2>
    <div class="metrics">
        <div class="metric">
            <h3>First Contentful Paint</h3>
            <p>${this.formatTime(lhrData.metrics.firstContentfulPaint)}</p>
        </div>
        <div class="metric">
            <h3>Largest Contentful Paint</h3>
            <p>${this.formatTime(lhrData.metrics.largestContentfulPaint)}</p>
        </div>
        <div class="metric">
            <h3>Cumulative Layout Shift</h3>
            <p>${lhrData.metrics.cumulativeLayoutShift?.toFixed(3) || 'N/A'}</p>
        </div>
        <div class="metric">
            <h3>Total Blocking Time</h3>
            <p>${this.formatTime(lhrData.metrics.totalBlockingTime)}</p>
        </div>
        <div class="metric">
            <h3>Speed Index</h3>
            <p>${this.formatTime(lhrData.metrics.speedIndex)}</p>
        </div>
    </div>

    <h2>Improvement Opportunities</h2>
    ${lhrData.opportunities.map(opp => `
        <div class="opportunity">
            <h4>${opp.title}</h4>
            <p>${opp.description}</p>
            <p><strong>Potential Savings:</strong> ${this.formatTime(opp.savings)}</p>
        </div>
    `).join('')}
</body>
</html>`;
  }

  getScoreClass(score) {
    if (score >= 90) return 'score-good';
    if (score >= 50) return 'score-medium';
    return 'score-poor';
  }

  formatTime(ms) {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }
}

module.exports = new LighthouseService();
