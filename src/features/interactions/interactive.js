export default class Interactive {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupClickEffects();
    }

    setupHoverEffects() {
        document.querySelectorAll('.interactive').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('hovered');
            });
            element.addEventListener('mouseleave', () => {
                element.classList.remove('hovered');
            });
        });
    }

    setupClickEffects() {
        document.querySelectorAll('.clickable').forEach(element => {
            element.addEventListener('click', () => {
                element.classList.add('clicked');
                setTimeout(() => element.classList.remove('clicked'), 200);
            });
        });
    }
} 