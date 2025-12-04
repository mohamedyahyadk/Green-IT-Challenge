const fetch = require('node-fetch');
const { parse: parseHTML } = require('node-html-parser'); // Lightweight parser

/**
 * Fetches and parses a webpage with GreenIT optimizations
 */
const fetchPage = async (url, options = {}) => {
  const timeout = options.timeout || 10000; // 10 seconds max (save energy)
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB max
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`📥 Fetching: ${url}`);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'EcoAudit/1.0 (GreenIT Analysis Bot)',
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'close' // Save resources
      },
      compress: true, // Request compression
      redirect: 'follow',
      size: maxSize // Prevent memory overflow
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Basic validation
    if (!html || html.length < 100) {
      throw new Error('Page content too small or empty');
    }

    // Parse with lightweight DOM parser
    const root = parseHTML(html);
    
    return {
      url: response.url, // Final URL after redirects
      html,
      root, // Parsed DOM
      headers: response.headers.raw(),
      status: response.status,
      size: html.length,
      contentType: response.headers.get('content-type')
    };

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    
    throw error;
  }
};

module.exports = fetchPage;