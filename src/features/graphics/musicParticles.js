export function createMusicParticles(scene) {
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            size: { value: 4.0 }
        },
        vertexShader: `
            uniform float time;
            uniform float size;
            attribute float particleSize;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec3 pos = position;
                pos.y += sin(time + position.x * 0.5) * 0.5;
                pos.x += cos(time + position.z * 0.5) * 0.5;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * particleSize * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                gl_FragColor = vec4(vColor, 1.0 - dist * 2.0);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    // Initialize particles
    for(let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random();
        colors[i * 3 + 2] = Math.random();
        
        sizes[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('particleSize', new THREE.BufferAttribute(sizes, 1));

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    return particles;
} 