import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { smokeVertexShader, smokeFragmentShader } from './shaderCode';
import { setupConcertLights } from './concertLights';
import { loadStudioModels } from './studioModels';
import { createMusicParticles } from './musicParticles';

export default class BackgroundEffects {
    constructor() {
        this.init();
        this.currentScene = 'smoke';
        this.scrollProgress = 0;
        this.scenes = {
            smoke: null,
            studio: null,
            musicStream: null,
            concert: null
        };
    }

    init() {
        this.setupRenderer();
        this.setupScenes();
        this.setupCamera();
        this.setupLights();
        this.setupPostProcessing();
        this.addEventListeners();
        this.animate();
    }

    setupRenderer() {
        this.canvas = document.querySelector('#webgl-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
    }

    setupScenes() {
        // Smoke Scene
        this.scenes.smoke = new THREE.Scene();
        this.setupSmoke();

        // Studio Scene
        this.scenes.studio = new THREE.Scene();
        this.setupStudio();

        // Music Stream Scene
        this.scenes.musicStream = new THREE.Scene();
        this.setupMusicStream();

        // Concert Scene
        this.scenes.concert = new THREE.Scene();
        this.setupConcert();
    }

    setupSmoke() {
        const smokeGeometry = new THREE.PlaneBufferGeometry(2, 2, 128, 128);
        const smokeMaterial = new THREE.ShaderMaterial({
            vertexShader: smokeVertexShader,
            fragmentShader: smokeFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uScrollProgress: { value: 0 }
            },
            transparent: true
        });
        const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
        this.scenes.smoke.add(smoke);
    }

    setupStudio() {
        // Studio environment setup with dim lighting
        const studioGeometry = new THREE.BoxGeometry(10, 8, 10);
        const studioMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.7,
            metalness: 0.3
        });
        const studio = new THREE.Mesh(studioGeometry, studioMaterial);
        this.scenes.studio.add(studio);

        // Add studio equipment models
        this.loadStudioModels();
    }

    setupMusicStream() {
        // Particle system for music notes and sound waves
        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for(let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10;
            colors[i] = Math.random();
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scenes.musicStream.add(particles);
    }

    setupConcert() {
        // Concert stage and lighting setup
        const stageGeometry = new THREE.BoxGeometry(20, 1, 10);
        const stageMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.8
        });
        const stage = new THREE.Mesh(stageGeometry, stageMaterial);
        this.scenes.concert.add(stage);

        // Add dynamic lights
        this.setupConcertLights();
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scenes[this.currentScene], this.camera));
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const time = performance.now() * 0.001;
        this.updateScene(time);
        
        this.composer.render();
    }

    updateScene(time) {
        // Update uniforms and animations based on scroll progress
        const materials = this.scenes[this.currentScene].children.map(child => child.material);
        materials.forEach(material => {
            if(material.uniforms) {
                material.uniforms.uTime.value = time;
                material.uniforms.uScrollProgress.value = this.scrollProgress;
            }
        });

        // Transition between scenes based on scroll progress
        this.updateSceneTransitions();
    }

    updateSceneTransitions() {
        if(this.scrollProgress < 0.25) {
            this.currentScene = 'smoke';
        } else if(this.scrollProgress < 0.5) {
            this.currentScene = 'studio';
        } else if(this.scrollProgress < 0.75) {
            this.currentScene = 'musicStream';
        } else {
            this.currentScene = 'concert';
        }

        this.composer.passes[0].scene = this.scenes[this.currentScene];
    }

    addEventListeners() {
        window.addEventListener('scroll', () => {
            this.scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
        });
    }
} 