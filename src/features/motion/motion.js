export default class Motion {
    constructor() {
        this.init();
    }

    init() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.handleMotion.bind(this));
        }
    }

    handleMotion(event) {
        const x = event.accelerationIncludingGravity.x;
        const y = event.accelerationIncludingGravity.y;

        document.querySelectorAll('.motion-sensitive').forEach(element => {
            element.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        });
    }
} 