import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { smokeVertexShader, smokeFragmentShader } from './shaderCode';

export class BackgroundEffects {
    constructor() {
        this.init();
        this.setupPostProcessing();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#webgl-background'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add point lights
        const pointLight1 = new THREE.PointLight(0x00ff99, 2, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00ccff, 2, 100);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);

        this.setupParticles();
        this.setupSmoke();
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    setupParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setupSmoke() {
        const geometry = new THREE.PlaneGeometry(20, 20, 128, 128);
        const material = new THREE.ShaderMaterial({
            vertexShader: smokeVertexShader,
            fragmentShader: smokeFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uScrollProgress: { value: 0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.smoke = new THREE.Mesh(geometry, material);
        this.scene.add(this.smoke);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,  // strength
            0.4,  // radius
            0.85  // threshold
        );
        this.composer.addPass(bloomPass);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = performance.now() * 0.001;

        // Animate particles
        this.particles.rotation.y = time * 0.1;
        this.particles.rotation.x = time * 0.05;

        // Update smoke shader
        if (this.smoke.material.uniforms) {
            this.smoke.material.uniforms.uTime.value = time;
            this.smoke.material.uniforms.uScrollProgress.value = 
                window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        }

        this.composer.render();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
} 