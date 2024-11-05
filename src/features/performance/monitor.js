export default class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.trackPerformanceMetrics();
    }

    trackPerformanceMetrics() {
        window.addEventListener('load', () => {
            const metrics = {
                loadTime: performance.now(),
                resources: performance.getEntriesByType('resource'),
                navigation: performance.getEntriesByType('navigation')
            };
            
            console.log('Performance Metrics:', metrics);
            this.sendMetrics(metrics);
        });
    }

    sendMetrics(metrics) {
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'performance', data: metrics })
        });
    }
} 