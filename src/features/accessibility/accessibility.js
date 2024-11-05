export default class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupARIA();
        this.setupHighContrast();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
    }

    setupARIA() {
        document.querySelectorAll('button, a').forEach(element => {
            if (!element.getAttribute('aria-label')) {
                element.setAttribute('aria-label', element.textContent);
            }
        });
    }

    setupHighContrast() {
        const toggle = document.getElementById('high-contrast-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
            });
        }
    }
} 