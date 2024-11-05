export function setupConcertLights(scene) {
    // Spotlights
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00];
    const lights = colors.map((color, index) => {
        const spotlight = new THREE.SpotLight(color, 2);
        spotlight.position.set(Math.sin(index * Math.PI * 0.4) * 10, 5, Math.cos(index * Math.PI * 0.4) * 10);
        spotlight.angle = Math.PI / 8;
        spotlight.penumbra = 0.2;
        spotlight.decay = 1;
        spotlight.distance = 30;
        scene.add(spotlight);
        return spotlight;
    });

    // Animate lights
    return function animateLights(time) {
        lights.forEach((light, index) => {
            const offset = index * Math.PI * 0.4;
            light.position.x = Math.sin(time + offset) * 10;
            light.position.z = Math.cos(time + offset) * 10;
            light.intensity = 1.5 + Math.sin(time * 2 + offset) * 0.5;
        });
    };
} 