const cheerio = require('cheerio');
const { getPageSnapshot } = require('./pageSnapshot');
const { runAllRules } = require('../rules');
const lighthouseService = require('./lighthouseService');
const crawlerService = require('./crawler.service');
const screenshotService = require('./screenshot.service');
const scoringEngine = require('./scoring.engine');
const recommendationEngine = require('./recommendation.engine');

/**
 * Main entrypoint for running an audit for a URL.
 * Now modularized with multi-page crawling and advanced features.
 *
 * @param {string} baseUrl
 */
async function runAudit(baseUrl) {
  // 1. Crawl links
  const targetUrls = await crawlerService.crawl(baseUrl, 5);
  if (targetUrls.length === 0) {
    targetUrls.push(baseUrl);
  }

  // 2. Capture screenshots in parallel
  const screenshotPromise = screenshotService.captureScreenshots(targetUrls).catch(err => {
    console.warn('Screenshot capture failed:', err.message);
    return [];
  });

  // 3. Lighthouse on main URL
  const lighthousePromise = lighthouseService.runLighthouseAudit(baseUrl).catch(err => {
    console.warn('Lighthouse audit failed:', err.message);
    return null;
  });

  // 4. Run detailed checks per page
  const allIssues = [];
  const scannedPages = [];

  for (const targetUrl of targetUrls) {
    try {
      const snapshot = await getPageSnapshot(targetUrl);
      const $ = cheerio.load(snapshot.html);
      
      const pageIssues = runAllRules($, { url: snapshot.url, title: snapshot.title });
      
      const scopedIssues = pageIssues.map(issue => ({
        ...issue,
        pageUrl: snapshot.url
      }));

      allIssues.push(...scopedIssues);
      scannedPages.push({ url: snapshot.url, title: snapshot.title });
    } catch (err) {
      console.warn('Analysis failed for ' + targetUrl + ':', err.message);
    }
  }

  // 5. Aggregate results
  const scores = scoringEngine.calculateScores(allIssues);
  const recommendations = recommendationEngine.generateRecommendations(allIssues);

  const passedIssues = allIssues.filter(i => i.status === 'pass').length;
  const failedIssues = allIssues.filter(i => i.status === 'fail').length;
  const manualCheckIssues = allIssues.filter(i => i.status === 'manual_check').length;

  const screenshots = await screenshotPromise;
  const lighthouseReport = await lighthousePromise;

  const summary = {
    baseUrl,
    fetchedAt: new Date().toISOString(),
    pagesScanned: scannedPages.length,
    scannedUrls: scannedPages.map(p => p.url),
    totalRulesRun: allIssues.length,
    passed: passedIssues,
    failed: failedIssues,
    manualCheck: manualCheckIssues,
    recommendations,
  };

  return {
    summary,
    scores,
    issues: allIssues,
    screenshots,
    lighthouse: lighthouseReport
  };
}

module.exports = {
  runAudit,
};
