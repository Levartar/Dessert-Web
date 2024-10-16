// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add desert environment
const tileSize = 20; // Size of each tile
const gridSize = 5; // 10x10 grid
const tileCount = 4; // 9 different tiles
const tiles = []; // Array to store loaded tiles

// Load all tiles and store them in the array
const loader = new THREE.GLTFLoader();
for (let i = 1; i <= tileCount; i++) {
    tileName = `Assets/3D/Tile-${i}.glb`
    console.log(tileName)
    loader.load(tileName, (gltf) => {
        desertTile = gltf.scene;
        tiles.push(desertTile);
        if (tiles.length === tileCount) {
            // Once all tiles are loaded, generate the grid
            generateDesertGrid();
        }
    });
    console.log(tiles)
}

// generate grid of desert tiles
function generateDesertGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Randomly select a tile from the loaded tiles
            const randomTileIndex = Math.floor(Math.random() * tileCount);
            console.log("randomtileindex: "+randomTileIndex)
            const tile = tiles[randomTileIndex].clone();

            // Position the tile in the grid
            tile.position.set(i * tileSize, 0, j * tileSize);

            // Add the tile to the scene
            scene.add(tile);
        }
    }
}


//let dessert;
//loader.load('Assets/3D/Tile-Start.glb', (gltf) => {
//    dessert = gltf.scene;
//    dessert.scale.set(1, 1, 1);
//    scene.add(dessert);
//});
//let dessert2;
//loader.load('Assets/3D/Tile-2.glb', (gltf) => {
//    dessert2 = gltf.scene;
//    dessert2.scale.set(1, 1, 1);
//    dessert2.position.set(-20,0,0)
//    scene.add(dessert2);
//});

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Load spaceship model
let spaceship, cameraHolder;
let hoverSpeed = 0.04;
let hoverHeight = 0.1;
let hoverTime = 0;

loader.load('Assets/3D/simple-spaceship.glb', (gltf) => {
    // Set initial camera position
    cameraHolder = new THREE.Object3D();
    camera.position.set(0, 10, 10); // Position camera behind spaceship
    scene.add(cameraHolder)
    cameraHolder.add(camera);

    // Create a container for the spaceship to apply the hover effect independently
    const spaceshipContainer = new THREE.Object3D();
    spaceshipContainer.position.set(0, 2, 4); // Set initial position
    cameraHolder.add(spaceshipContainer);

    spaceship = gltf.scene;
    spaceship.scale.set(0.5, 0.5, 0.5);
    spaceship.position.set(0, 2, 4);
    spaceshipContainer.add(spaceship);

    //cameralook leads to hover bug 
    //camera.lookAt(spaceshipContainer.position);
});

// Fly controls (basic keypress handling)
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let spaceshipVelocity = new THREE.Vector3();  // To hold velocity
let spaceshipDirection = new THREE.Vector3(); // To hold direction
let rotationSpeed = 0.1;  // How quickly the spaceship rotates

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
        // Hovering animation (up and down motion)
        hoverTime += hoverSpeed;
        spaceship.position.y = Math.sin(hoverTime) * hoverHeight;
        console.log("spaceship y: "+spaceship.position.y)
        console.log("cameraholder y: "+cameraHolder.position.y)

        // Calculate the movement direction
        spaceshipDirection.set(0, 0, 0); // Reset direction

        if (moveForward) spaceshipDirection.z -= 1;
        if (moveBackward) spaceshipDirection.z += 1;
        if (moveLeft) spaceshipDirection.x -= 1;
        if (moveRight) spaceshipDirection.x += 1;

        // Normalize direction and update position
        if (spaceshipDirection.length() > 0) {
            spaceshipDirection.normalize();
            spaceshipVelocity.copy(spaceshipDirection).multiplyScalar(0.1); // Adjust speed as needed
            spaceship.position.add(spaceshipVelocity);

            // Rotate spaceship towards the direction of movement
            let targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(1, 0, 0),  // Default forward direction
                spaceshipDirection.clone().normalize()  // New forward direction
            );

            spaceship.quaternion.slerp(targetQuaternion, rotationSpeed);  // Smooth rotation
        }

        // Position the camera relative to the spaceship
        camera.position.set(spaceship.position.x, spaceship.position.y + 10, spaceship.position.z + 10); // Adjust as necessary
        camera.lookAt(spaceship.position);  // Ensure the camera looks at the spaceship
    }

    // Render the scene
    renderer.render(scene, camera);
}

animate();
