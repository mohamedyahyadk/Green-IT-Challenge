/**
 * Lightweight HTTP client with GreenIT optimizations
 */
const fetch = require('node-fetch');

class HttpClient {
  constructor(options = {}) {
    this.defaultOptions = {
      timeout: 8000, // Fast timeout saves energy
      compress: true,
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'close',
        'User-Agent': 'EcoAudit-GreenIT/1.0'
      },
      ...options
    };
    
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes
  }

  async get(url, options = {}) {
    const cacheKey = `GET:${url}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached response if valid
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      console.log(`📦 Cache hit: ${url}`);
      return cached.data;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultOptions.timeout);
    
    try {
      const response = await fetch(url, {
        ...this.defaultOptions,
        ...options,
        signal: controller.signal,
        method: 'GET'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.text();
      const result = {
        data,
        headers: response.headers.raw(),
        status: response.status,
        size: data.length
      };
      
      // Cache successful responses
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  // Clear cache (for memory management)
  clearCache() {
    this.cache.clear();
  }
  
  // Get cache stats (for monitoring)
  getCacheStats() {
    return {
      size: this.cache.size,
      hits: 0, // Would track in production
      memory: process.memoryUsage().heapUsed / 1024 / 1024
    };
  }
}

module.exports = HttpClient;