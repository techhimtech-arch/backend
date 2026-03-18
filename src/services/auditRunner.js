const cheerio = require('cheerio');
const { getPageSnapshot } = require('./pageSnapshot');
const { runAllRules } = require('../rules');
const lighthouseService = require('./lighthouseService');

/**
 * Main entrypoint for running an audit for a single URL.
 *
 * @param {string} url
 */
async function runAudit(url) {
  const snapshot = await getPageSnapshot(url);

  const $ = cheerio.load(snapshot.html);

  const { findings, summary } = runAllRules($, {
    url: snapshot.url,
    title: snapshot.title,
  });

  // Run Lighthouse audit in parallel
  const lighthousePromise = lighthouseService.runLighthouseAudit(url).catch(err => {
    console.warn('Lighthouse audit failed:', err.message);
    return null;
  });

  const lighthouseReport = await lighthousePromise;

  return {
    url: snapshot.url,
    title: snapshot.title,
    fetchedAt: new Date().toISOString(),
    summary,
    findings,
    lighthouse: lighthouseReport,
  };
}

module.exports = {
  runAudit,
};

