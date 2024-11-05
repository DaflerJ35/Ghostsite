class PerformanceOptimization {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupPrefetching();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const config = {
            rootMargin: '0px 0px 50px 0px',
            threshold: 0.01
        };

        const observer = new IntersectionObserver((entries, self) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.preloadImage(entry.target);
                    self.unobserve(entry.target);
                }
            });
        }, config);

        images.forEach(image => {
            observer.observe(image);
        });
    }

    preloadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) {
            return;
        }
        img.src = src;
    }

    setupPrefetching() {
        const links = document.querySelectorAll('a[data-prefetch]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const url = link.getAttribute('href');
                if (url) {
                    const linkElem = document.createElement('link');
                    linkElem.rel = 'prefetch';
                    linkElem.href = url;
                    document.head.appendChild(linkElem);
                }
            });
        });
    }
}

new PerformanceOptimization(); 