import * as THREE from 'three';

export class AudioVisualizer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        
        // Three.js setup for visualization
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Add to waveform container
        const container = document.querySelector('.waveform-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }

        this.setupVisualization();
        this.animate();
    }

    setupVisualization() {
        // Create bars for frequency visualization
        this.bars = new THREE.Group();
        const barGeometry = new THREE.BoxGeometry(1, 1, 1);
        const barMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff99,
            emissive: 0x00ff99,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });

        for (let i = 0; i < 64; i++) {
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            bar.position.x = i * 2 - 64;
            this.bars.add(bar);
        }

        this.scene.add(this.bars);
        this.camera.position.z = 100;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const pointLight = new THREE.PointLight(0x00ff99, 1);
        pointLight.position.set(0, 0, 50);
        this.scene.add(ambientLight, pointLight);
    }

    connectAudio(audioElement) {
        const source = this.audioContext.createMediaElementSource(audioElement);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);

        // Update visualization
        for (let i = 0; i < this.bars.children.length; i++) {
            const bar = this.bars.children[i];
            const value = this.dataArray[i * 4] / 255;
            bar.scale.y = value * 50 + 1;
            bar.material.emissiveIntensity = value + 0.5;
            bar.material.opacity = value + 0.5;
        }

        this.bars.rotation.y += 0.005;
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
} 