const { chromium } = require('playwright');

/**
 * Loads a page with Playwright and returns a snapshot of the rendered HTML and metadata.
 * This is the only place that talks to the browser; rules work on static HTML/DOM.
 *
 * @param {string} url
 * @returns {Promise<{ url: string, title: string, html: string }>}
 */
async function getPageSnapshot(url) {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded', // Changed from networkidle to avoid timeouts on sites with persistent network activity
      timeout: 60000, // Increased timeout just to be safe for slower sites
    });

    const [title, html] = await Promise.all([page.title(), page.content()]);

    return {
      url,
      title,
      html,
    };
  } finally {
    await browser.close();
  }
}

module.exports = {
  getPageSnapshot,
};

