export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: {},
            timing: {}
        };
        this.setupMonitoring();
    }

    setupMonitoring() {
        this.monitorFPS();
        this.monitorMemory();
        this.monitorNetworkRequests();
        this.setupPerformanceObserver();
    }

    monitorFPS() {
        let frameCount = 0;
        let lastTime = performance.now();

        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                this.logMetrics();
            }
            
            requestAnimationFrame(countFrames);
        };

        requestAnimationFrame(countFrames);
    }

    monitorMemory() {
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memory = {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize
                };
                this.logMetrics();
            }, 1000);
        }
    }

    monitorNetworkRequests() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                this.metrics.timing[args[0]] = endTime - startTime;
                return response;
            } catch (error) {
                throw error;
            }
        };
    }

    setupPerformanceObserver() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    this.metrics.lcp = entry.startTime;
                }
                if (entry.entryType === 'first-input') {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                }
            }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }

    logMetrics() {
        console.log('Performance Metrics:', this.metrics);
        // Send metrics to analytics service
        this.sendToAnalytics(this.metrics);
    }

    sendToAnalytics(metrics) {
        fetch('/api/analytics/performance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metrics)
        }).catch(console.error);
    }
} 