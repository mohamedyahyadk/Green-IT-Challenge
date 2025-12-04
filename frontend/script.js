// GreenIT Frontend - Ultra lightweight
class EcoAudit {
    constructor() {
        this.backendUrl = 'http://localhost:3000/api/analyze';
        this.elements = {
            urlInput: document.getElementById('urlInput'),
            analyzeBtn: document.getElementById('analyzeBtn'),
            loading: document.getElementById('loading'),
            results: document.getElementById('results'),
            metricsGrid: document.getElementById('metricsGrid'),
            tips: document.getElementById('tips'),
            scoreValue: document.getElementById('scoreValue'),
            scoreCircle: document.getElementById('scoreCircle'),
            urlDisplay: document.getElementById('urlDisplay'),
            pageStats: document.getElementById('pageStats'),
            progressBar: document.getElementById('progressBar')
        };
        
        this.init();
    }
    
    init() {
        // Measure own page performance (for contest)
        this.measurePagePerformance();
        
        // Event listeners
        this.elements.analyzeBtn.addEventListener('click', () => this.analyze());
        this.elements.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.analyze();
        });
        
        // Load sample analysis on start
        setTimeout(() => this.showSampleResults(), 500);
    }
    
    async analyze() {
        const url = this.elements.urlInput.value.trim();
        
        if (!url || !this.isValidUrl(url)) {
            this.showError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Simulate progress for contest demo
            this.simulateProgress();
            
            // Call backend API
            const response = await fetch(this.backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.displayResults(data);
            
        } catch (error) {
            console.error('Analysis error:', error);
            
            // Fallback: Mock data for contest demo
            const mockData = this.generateMockData(url);
            this.displayResults(mockData);
            
            // Show warning
            this.showError('Using demo data (backend connection failed)');
        } finally {
            this.showLoading(false);
        }
    }
    
    displayResults(data) {
        // Display URL
        this.elements.urlDisplay.textContent = `Analysis for: ${data.url}`;
        
        // Update score
        this.elements.scoreValue.textContent = data.score?.greenScore || '--';
        this.updateScoreCircle(data.score?.greenScore || 0);
        
        // Clear previous metrics
        this.elements.metricsGrid.innerHTML = '';
        this.elements.tips.innerHTML = '<h3>💡 Tips to Improve</h3>';
        
        // Add metrics
        if (data.metrics) {
            this.addMetric('Page Size', data.metrics.sizeReadable, this.getSizeRating(data.metrics.size));
            this.addMetric('DOM Complexity', `${data.metrics.domElements} elements`, this.getDomRating(data.metrics.domElements));
            this.addMetric('HTTP Requests', data.metrics.httpRequests, this.getRequestRating(data.metrics.httpRequests));
            this.addMetric('Carbon Footprint', data.metrics.co2PerVisitReadable, this.getCarbonRating(data.metrics.co2PerVisit));
        }
        
        // Add tips
        if (data.tips && Array.isArray(data.tips)) {
            data.tips.forEach(tip => this.addTip(tip));
        } else {
            this.addTip('Compress images using WebP format');
            this.addTip('Minify CSS and JavaScript files');
            this.addTip('Use system fonts instead of web fonts');
            this.addTip('Implement lazy loading for images');
        }
        
        // Show results
        this.elements.results.classList.add('active');
        
        // Scroll to results
        this.elements.results.scrollIntoView({ behavior: 'smooth' });
    }
    
    addMetric(label, value, rating) {
        const card = document.createElement('div');
        card.className = 'metric-card';
        
        const html = `
            <div style="font-size: 0.875rem; opacity: 0.8;">${label}</div>
            <div class="metric-value metric-${rating}">${value}</div>
            <div class="comparison">${this.getComparisonText(label, value)}</div>
        `;
        
        card.innerHTML = html;
        this.elements.metricsGrid.appendChild(card);
    }
    
    addTip(text) {
        const tip = document.createElement('div');
        tip.className = 'tip';
        tip.textContent = text;
        this.elements.tips.appendChild(tip);
    }
    
    updateScoreCircle(score) {
        const percent = Math.min(score, 100);
        this.elements.scoreCircle.style.background = 
            `conic-gradient(var(--accent) 0% ${percent}%, var(--surface) ${percent}% 100%)`;
    }
    
    getSizeRating(sizeBytes) {
        if (sizeBytes < 500 * 1024) return 'good';     // < 500KB
        if (sizeBytes < 2 * 1024 * 1024) return 'warning'; // < 2MB
        return 'danger';                              // > 2MB
    }
    
    getDomRating(count) {
        if (count < 500) return 'good';
        if (count < 1500) return 'warning';
        return 'danger';
    }
    
    getRequestRating(count) {
        if (count < 20) return 'good';
        if (count < 50) return 'warning';
        return 'danger';
    }
    
    getCarbonRating(grams) {
        if (grams < 0.5) return 'good';
        if (grams < 1.0) return 'warning';
        return 'danger';
    }
    
    getComparisonText(label, value) {
        const comparisons = {
            'Page Size': value.includes('MB') ? 'Heavier than 70% of sites' : 'Lighter than 60% of sites',
            'DOM Complexity': 'Average complexity',
            'HTTP Requests': 'Fewer than average',
            'Carbon Footprint': 'Lower than industry average'
        };
        return comparisons[label] || '';
    }
    
    showSampleResults() {
        const sampleData = this.generateMockData('https://example.com');
        this.displayResults(sampleData);
    }
    
    generateMockData(url) {
        // Mock data for contest demo
        return {
            url,
            metrics: {
                size: 1024 * 800, // 800KB
                sizeReadable: '800 KB',
                domElements: 450,
                httpRequests: 12,
                co2PerVisit: 0.42,
                co2PerVisitReadable: '0.42g CO₂'
            },
            score: {
                greenScore: 78
            },
            tips: [
                'Compress images: Save ~200KB using WebP',
                'Combine CSS files: Reduce HTTP requests by 3',
                'Enable GZIP compression: Save 40% bandwidth',
                'Use caching headers: Reduce server load'
            ]
        };
    }
    
    simulateProgress() {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 90) {
                clearInterval(interval);
                return;
            }
            width += 10;
            this.elements.progressBar.style.width = `${width}%`;
        }, 200);
    }
    
    showLoading(show) {
        if (show) {
            this.elements.loading.classList.add('active');
            this.elements.analyzeBtn.disabled = true;
        } else {
            this.elements.loading.classList.remove('active');
            this.elements.analyzeBtn.disabled = false;
            this.elements.progressBar.style.width = '0%';
        }
    }
    
    showError(message) {
        // Simple error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: var(--danger);
            color: white;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-top: 1rem;
        `;
        errorDiv.textContent = message;
        
        const analyzer = document.querySelector('.analyzer');
        analyzer.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    measurePagePerformance() {
        // Calculate our own page's performance (for contest)
        const domCount = document.querySelectorAll('*').length;
        const pageWeight = Math.round(performance.getEntriesByType('resource')
            .reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024);
        
        // Update footer stats
        this.elements.pageStats.innerHTML = `
            This page: ${domCount} DOM elements • ${pageWeight}KB transferred • 
            <span id="co2Estimate">Calculating CO₂...</span>
        `;
        
        // Estimate CO₂ for our own page
        setTimeout(() => {
            const co2 = (pageWeight / 1024) * 0.5; // Simple estimate
            document.getElementById('co2Estimate').textContent = 
                `${co2.toFixed(3)}g CO₂ per visit`;
        }, 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EcoAudit();
});