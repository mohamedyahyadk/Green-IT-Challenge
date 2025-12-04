/**
 * Extracts GreenIT metrics from page data
 * Optimized for speed and minimal memory
 */
const extractResources = async (pageData, originalUrl) => {
  const { root, html, headers } = pageData;
  
  console.log(`🔍 Extracting metrics from ${originalUrl}`);
  
  // 1. Count DOM elements (fast method)
  const domCount = countDOMElements(root);
  
  // 2. Extract resources (CSS, JS, Images, Fonts)
  const resources = extractResourceUrls(root, originalUrl);
  
  // 3. Count total HTTP requests
  const requestCount = calculateRequestCount(resources, headers);
  
  // 4. Calculate total page size (estimate)
  const totalSize = estimateTotalSize(html.length, resources);
  
  return {
    domCount,
    resources,
    requestCount,
    totalSize,
    htmlSize: html.length,
    hasGreenHosting: checkGreenHosting(headers),
    // Contest-specific metrics
    contestMetrics: {
      domElements: domCount,
      dataTransferred: totalSize,
      httpRequests: requestCount
    }
  };
};

function countDOMElements(root) {
  // Fast approximation - count tags
  const elements = root.querySelectorAll('*');
  return elements.length;
}

function extractResourceUrls(root, baseUrl) {
  const resources = {
    css: [],
    js: [],
    images: [],
    fonts: [],
    iframes: [],
    other: []
  };
  
  // CSS (link[rel=stylesheet], style)
  root.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href) resources.css.push(resolveUrl(href, baseUrl));
  });
  
  // JS (script[src])
  root.querySelectorAll('script[src]').forEach(script => {
    const src = script.getAttribute('src');
    if (src) resources.js.push(resolveUrl(src, baseUrl));
  });
  
  // Images (img[src], source[srcset], picture>source)
  root.querySelectorAll('img[src]').forEach(img => {
    const src = img.getAttribute('src');
    if (src) resources.images.push(resolveUrl(src, baseUrl));
  });
  
  // Simplified for performance - don't fetch every resource
  return resources;
}

function calculateRequestCount(resources, headers) {
  // Base: 1 for HTML
  let count = 1;
  
  // Count each resource type
  count += resources.css.length;
  count += resources.js.length;
  count += resources.images.length;
  count += resources.fonts.length;
  count += resources.iframes.length;
  count += resources.other.length;
  
  // Add critical headers as separate requests
  const linkHeader = headers['link'];
  if (linkHeader && Array.isArray(linkHeader)) {
    count += linkHeader.length;
  }
  
  return count;
}

function estimateTotalSize(htmlSize, resources) {
  // Simple estimation for contest
  // Real implementation would fetch a sample of resources
  const averageSizes = {
    css: 15000, // 15KB avg
    js: 50000,  // 50KB avg
    images: 80000, // 80KB avg
    fonts: 30000, // 30KB avg
    other: 10000 // 10KB avg
  };
  
  let estimatedSize = htmlSize;
  
  Object.keys(resources).forEach(type => {
    if (averageSizes[type]) {
      estimatedSize += resources[type].length * averageSizes[type];
    }
  });
  
  return Math.round(estimatedSize);
}

function checkGreenHosting(headers) {
  const serverHeader = headers['server'] || '';
  const poweredBy = headers['x-powered-by'] || '';
  
  // Check for green hosting indicators
  const greenHosts = [
    'netlify', 'vercel', 'cloudflare', 'o2switch',
    'greengeeks', 'krystal', 'infomaniak'
  ];
  
  const combined = (serverHeader + poweredBy).toLowerCase();
  return greenHosts.some(host => combined.includes(host));
}

function resolveUrl(url, baseUrl) {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

module.exports = extractResources;