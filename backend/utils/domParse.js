/**
 * Fast, lightweight DOM analysis for GreenIT metrics
 */
const { parse: parseHTML } = require('node-html-parser');

class DOMParser {
  constructor() {
    this.metrics = {
      elementCount: 0,
      depth: 0,
      complexity: 0
    };
  }
  
  parse(html) {
    const startTime = Date.now();
    const root = parseHTML(html);
    
    // Calculate metrics
    this.calculateMetrics(root);
    
    console.log(`📊 DOM parsed in ${Date.now() - startTime}ms`);
    
    return {
      root,
      metrics: this.metrics,
      // Contest-specific analysis
      contestAnalysis: this.getContestAnalysis(root)
    };
  }
  
  calculateMetrics(root) {
    // Count all elements (fast traversal)
    const allElements = root.querySelectorAll('*');
    this.metrics.elementCount = allElements.length;
    
    // Calculate max depth
    this.metrics.depth = this.getMaxDepth(root);
    
    // Calculate complexity score
    this.metrics.complexity = this.calculateComplexity(root);
  }
  
  getMaxDepth(node, currentDepth = 0) {
    let maxDepth = currentDepth;
    node.childNodes.forEach(child => {
      if (child.nodeType === 1) { // ELEMENT_NODE
        const childDepth = this.getMaxDepth(child, currentDepth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
    });
    return maxDepth;
  }
  
  calculateComplexity(root) {
    // Simple complexity heuristic
    const elements = root.querySelectorAll('*');
    let score = 0;
    
    elements.forEach(el => {
      // Penalize deeply nested divs
      if (el.tagName === 'DIV') {
        let parent = el.parentNode;
        let divCount = 0;
        while (parent && parent.tagName) {
          if (parent.tagName === 'DIV') divCount++;
          parent = parent.parentNode;
        }
        score += divCount;
      }
      
      // Penalize inline styles (harder to optimize)
      if (el.getAttribute('style')) {
        score += 2;
      }
      
      // Penalize scripts (client-side processing)
      if (el.tagName === 'SCRIPT') {
        score += 3;
      }
    });
    
    return score;
  }
  
  getContestAnalysis(root) {
    // Analysis specifically for contest judging
    const elementsByType = {};
    const allElements = root.querySelectorAll('*');
    
    allElements.forEach(el => {
      const tag = el.tagName.toLowerCase();
      elementsByType[tag] = (elementsByType[tag] || 0) + 1;
    });
    
    return {
      totalElements: this.metrics.elementCount,
      elementsByType: Object.entries(elementsByType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10), // Top 10 most used tags
      domDepth: this.metrics.depth,
      complexityScore: this.metrics.complexity,
      // GreenIT recommendations
      recommendations: this.generateRecommendations(root)
    };
  }
  
  generateRecommendations(root) {
    const recommendations = [];
    const elements = root.querySelectorAll('*');
    
    // Count potential issues
    const divCount = root.querySelectorAll('div').length;
    const spanCount = root.querySelectorAll('span').length;
    const scriptCount = root.querySelectorAll('script').length;
    
    if (divCount > 100) {
      recommendations.push(`Reduce DIV count (${divCount} found)`);
    }
    
    if (spanCount > divCount * 0.5) {
      recommendations.push(`Consider semantic HTML instead of ${spanCount} SPANs`);
    }
    
    if (scriptCount > 10) {
      recommendations.push(`Combine ${scriptCount} script files`);
    }
    
    // Check for inline styles
    const inlineStyles = root.querySelectorAll('[style]').length;
    if (inlineStyles > 20) {
      recommendations.push(`Move ${inlineStyles} inline styles to CSS`);
    }
    
    return recommendations.slice(0, 3);
  }
}

module.exports = DOMParser;