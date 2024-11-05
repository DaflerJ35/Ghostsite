export default class Analytics {
    constructor() {
        this.init();
    }

    init() {
        this.trackPageViews();
        this.trackUserInteractions();
    }

    trackPageViews() {
        this.sendAnalytics('pageview', {
            url: window.location.href,
            timestamp: new Date().toISOString()
        });
    }

    trackUserInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, a')) {
                this.sendAnalytics('interaction', {
                    type: 'click',
                    element: e.target.tagName,
                    id: e.target.id,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    sendAnalytics(eventType, data) {
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventType, data })
        });
    }
} 