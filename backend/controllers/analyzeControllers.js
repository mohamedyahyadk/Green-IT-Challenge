const fetchPage = require('../services/fetchPage');
const extractResources = require('../services/extractResources');
const computeCarbon = require('../services/computeCarbon');

const { analyzeWebsite } = require('./analyzeControllers');
/**
 * Main analysis controller
 * Respects GreenIT: Minimal processing, fast responses
 */
const analyzeWebsite = async (req, res) => {
  const startTime = Date.now();
  const { url } = req.body;

  // Input validation
  if (!url) {
    return res.status(400).json({
      error: 'URL required',
      example: { url: 'https://example.com' }
    });
  }

  try {
    // 1. Fetch the page (with timeout for energy efficiency)
    console.log(`🌐 Analyzing: ${url}`);
    const pageData = await fetchPage(url);
    
    // 2. Extract metrics
    const resources = await extractResources(pageData, url);
    
    // 3. Compute carbon and score
    const carbonResult = computeCarbon(resources);
    
    // 4. Calculate performance score (0-100)
    const greenScore = calculateGreenScore(resources, carbonResult);
    
    // 5. Prepare response (minimal data)
    const response = {
      url,
      metrics: {
        size: resources.totalSize,
        sizeReadable: formatBytes(resources.totalSize),
        domElements: resources.domCount,
        httpRequests: resources.requestCount,
        co2PerVisit: carbonResult.co2PerVisit,
        co2PerVisitReadable: `${carbonResult.co2PerVisit.toFixed(3)}g CO₂`,
        monthlyImpact: carbonResult.monthlyImpact // if 10k visits
      },
      score: {
        greenScore,
        rating: getRating(greenScore)
      },
      performance: {
        analysisTimeMs: Date.now() - startTime,
        cache: 'HIT' // Add if implementing cache
      },
      tips: generateTips(resources, carbonResult)
    };

    // Add caching header for identical requests
    res.set('Cache-Control', 'public, max-age=1800'); // 30 minutes
    
    console.log(`✅ Analysis complete: ${greenScore}/100 in ${Date.now() - startTime}ms`);
    res.json(response);

  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    
    // User-friendly error messages
    let status = 500;
    let message = 'Analysis failed';
    
    if (error.message.includes('timeout')) {
      status = 408;
      message = 'Website took too long to respond';
    } else if (error.message.includes('ENOTFOUND')) {
      status = 404;
      message = 'Website not found';
    } else if (error.message.includes('ECONNREFUSED')) {
      status = 503;
      message = 'Website refused connection';
    }
    
    res.status(status).json({
      error: message,
      originalError: process.env.NODE_ENV === 'development' ? error.message : undefined,
      suggestion: 'Try a different URL or check if the site is accessible'
    });
  }
};

// Helper functions
function calculateGreenScore(resources, carbonResult) {
  // Scoring algorithm (simplified for contest)
  // Lower numbers = better score
  const sizeScore = Math.max(0, 100 - (resources.totalSize / 1024 / 10)); // -1 per 10KB
  const domScore = Math.max(0, 100 - (resources.domCount / 10)); // -1 per 10 DOM elements
  const requestScore = Math.max(0, 100 - (resources.requestCount * 2)); // -2 per request
  const carbonScore = Math.max(0, 100 - (carbonResult.co2PerVisit * 1000)); // -1 per 0.001g
  
  // Weighted average (customize as needed)
  return Math.round(
    (sizeScore * 0.3) + 
    (domScore * 0.25) + 
    (requestScore * 0.25) + 
    (carbonScore * 0.2)
  );
}

function getRating(score) {
  if (score >= 90) return '🌿 Excellent';
  if (score >= 75) return '✅ Good';
  if (score >= 60) return '⚠️ Average';
  return '🔴 Needs Improvement';
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateTips(resources, carbonResult) {
  const tips = [];
  
  if (resources.totalSize > 1024 * 1024) { // > 1MB
    tips.push('Consider compressing images with WebP format');
  }
  
  if (resources.requestCount > 50) {
    tips.push('Combine CSS/JS files to reduce HTTP requests');
  }
  
  if (resources.domCount > 1000) {
    tips.push('Simplify HTML structure to reduce DOM complexity');
  }
  
  if (carbonResult.co2PerVisit > 0.5) {
    tips.push('Switch to a green hosting provider to reduce CO₂');
  }
  
  return tips.slice(0, 3); // Return max 3 tips
}

module.exports = { analyzeWebsite };