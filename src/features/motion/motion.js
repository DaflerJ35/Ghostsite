export class MotionControls {
    constructor() {
        this.setupMotionControls();
        this.setupDeviceOrientation();
    }

    setupMotionControls() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.handleMotion.bind(this));
        }
    }

    setupDeviceOrientation() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
        }
    }

    handleMotion(event) {
        const x = event.accelerationIncludingGravity.x;
        const y = event.accelerationIncludingGravity.y;

        document.querySelectorAll('.motion-sensitive').forEach(element => {
            element.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
        });
    }

    handleOrientation(event) {
        const beta = event.beta; // X-axis rotation
        const gamma = event.gamma; // Y-axis rotation

        document.querySelectorAll('.orientation-sensitive').forEach(element => {
            element.style.transform = `rotateX(${beta}deg) rotateY(${gamma}deg)`;
        });
    }
} 