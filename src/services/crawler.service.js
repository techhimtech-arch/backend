const cheerio = require('cheerio');
const url = require('url');

/**
 * Crawl a given URL to find internal links, prioritizing specific pages.
 * @param {string} baseUrl
 * @param {number} maxPages
 * @returns {Promise<string[]>} List of URLs to audit.
 */
async function crawl(baseUrl, maxPages = 5) {
  const visited = new Set();
  const queue = [baseUrl];
  const foundUrls = new Set([baseUrl]);
  
  const parsedBase = new URL(baseUrl);
  const baseHostname = parsedBase.hostname;

  const priorities = ['about', 'contact', 'home'];

  while (queue.length > 0 && foundUrls.size < 20) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    try {
      const response = await fetch(currentUrl, {
        headers: { 'User-Agent': 'GIGW-UX-Audit-Crawler/1.0' }
      });
      if (!response.ok) continue;

      const html = await response.text();
      const $ = cheerio.load(html);

      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        
        try {
          const resolvedUrl = new URL(href, currentUrl);
          if (
            resolvedUrl.hostname === baseHostname &&
            !resolvedUrl.pathname.match(/\.(pdf|jpg|png|gif|doc|docx|xls|xlsx|zip)$/i)
          ) {
            const cleanUrl = resolvedUrl.origin + resolvedUrl.pathname;
            if (!foundUrls.has(cleanUrl)) {
              foundUrls.add(cleanUrl);
              queue.push(cleanUrl);
            }
          }
        } catch (e) {
          // invalid url, skip
        }
      });
    } catch (error) {
      console.warn(`Crawler failed to fetch ${currentUrl}:`, error.message);
    }
  }

  // Sort and pick top maxPages prioritizing keywords
  const urlsArray = Array.from(foundUrls);
  
  const scoredUrls = urlsArray.map(u => {
    let score = 0;
    if (u === baseUrl || u === baseUrl + '/') score += 100;
    const lowerU = u.toLowerCase();
    
    if (lowerU.includes('about')) score += 50;
    if (lowerU.includes('contact')) score += 50;
    if (lowerU.includes('home')) score += 50;
    
    // De-prioritize deep paths
    const pathSegments = new URL(u).pathname.split('/').filter(x => x);
    score -= pathSegments.length * 5;
    
    return { url: u, score };
  });

  scoredUrls.sort((a, b) => b.score - a.score);

  return scoredUrls.slice(0, maxPages).map(x => x.url);
}

module.exports = {
  crawl
};
