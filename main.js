// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add desert Environment
const loader = new THREE.GLTFLoader();
let desert
loader.load('Assets/3D/simple-overgrown-containers.glb', (gltf) => {
    desert = gltf.scene;
    desert.scale.set(1, 1, 1);
    scene.add(desert);
});

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Load spaceship model
let spaceship;
loader.load('Assets/3D/simple-spaceship.glb', (gltf) => {
    spaceship = gltf.scene;
    spaceship.scale.set(0.5, 0.5, 0.5);
    spaceship.position.set(0,0,2);
    scene.add(spaceship);

    let cameraHolder = new THREE.Object3D();

    camera.position.set(0, 10, 10); // Position camera behind spaceship
    cameraHolder.add(camera);
    spaceship.add(cameraHolder);
    camera.lookAt(spaceship.position);
});

// Fly controls (basic keypress handling)
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w': moveForward = true; break;
        case 's': moveBackward = true; break;
        case 'a': moveLeft = true; break;
        case 'd': moveRight = true; break;
    }
});
document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w': moveForward = false; break;
        case 's': moveBackward = false; break;
        case 'a': moveLeft = false; break;
        case 'd': moveRight = false; break;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (spaceship) {
        if (moveForward) spaceship.position.z -= 0.1;
        if (moveBackward) spaceship.position.z += 0.1;
        if (moveLeft) spaceship.position.x -= 0.1;
        if (moveRight) spaceship.position.x += 0.1;
    }

    renderer.render(scene, camera);
}
animate();
