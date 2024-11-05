import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function loadStudioModels(scene) {
    const loader = new GLTFLoader();
    
    // Load studio equipment models
    const models = [
        { url: 'assets/models/microphone.glb', position: [0, 1, 0], scale: 0.5 },
        { url: 'assets/models/mixer.glb', position: [2, 0.8, 1], scale: 0.3 },
        { url: 'assets/models/speakers.glb', position: [-2, 1, 0], scale: 0.4 }
    ];

    models.forEach(model => {
        loader.load(model.url, (gltf) => {
            const object = gltf.scene;
            object.position.set(...model.position);
            object.scale.setScalar(model.scale);
            scene.add(object);
        });
    });
} 