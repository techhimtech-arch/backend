const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

/**
 * Capture screenshots using Puppeteer.
 * @param {string[]} urls List of URLs to screenshot
 * @returns {Promise<Array<{url: string, path: string}>>} Screenshot results
 */
async function captureScreenshots(urls) {
  const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    // Handle skipped install if necessary
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  });

  const results = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    for (const link of urls) {
      try {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 30000 });
        const parsedUrl = new URL(link);
        const filename = `${parsedUrl.hostname.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`;
        const filePath = path.join(screenshotsDir, filename);

        await page.screenshot({ path: filePath, fullPage: true });
        
        results.push({
          url: link,
          path: `/screenshots/${filename}`
        });
      } catch (err) {
        console.warn(`Failed to capture screenshot for ${link}:`, err.message);
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

module.exports = {
  captureScreenshots
};
