import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'stats.js';

const container = document.getElementById('container');
const scene = new THREE.Scene();
// No scene background - let body background show through

//Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//Camera
const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = -1000;

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;
controls.rotateSpeed = 0.5;
controls.minDistance = 250;
controls.maxDistance = 250;

//Lights - Improved lighting setup
// Ambient light for overall illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

// Hemisphere light for natural sky/ground lighting
const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.6);
hemisphereLight.position.set(0, 100, 0);
scene.add(hemisphereLight);

// Main directional light (sun)
const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(200, 200, 100);
scene.add(mainLight);

// Fill light from the opposite side
const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-150, 100, -100);
scene.add(fillLight);

// Rim light for edge definition
const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
rimLight.position.set(0, 50, -200);
scene.add(rimLight);

// No floor or shadows - clean floating shoe

//T-shirt
const tshirtMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
const tagMaterial = new THREE.MeshPhongMaterial();
const designMaterial = new THREE.MeshPhongMaterial({ transparent: true });
designMaterial.opacity = 0;

// Load GLB model
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    // Using the MaterialsVariantsShoe GLB from glTF sample models
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
    function (gltf) {
        console.log('GLB model loaded successfully:', gltf);
        const model = gltf.scene;
        
        // Scale and position the model
        model.scale.set(500, 500, 500);
        model.rotateY(Math.PI / 1.4);
        model.position.y = -50.1; // Position the model slightly lower to eliminate gap
        
        // Keep the original materials from the GLB model
        // The MaterialsVariantsShoe model has built-in materials that we want to preserve
        console.log('Model materials preserved:', model);
        
        // No shadow casting needed
        
        scene.add(model);
    },
    // Function called when download progresses
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Function called when download errors
    function (error) {
        console.error('Error loading GLB model:', error);
        // Fallback to a simple cube if GLB loading fails
        const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
        const cubeMesh = new THREE.Mesh(cubeGeometry, tshirtMaterial);
        cubeMesh.name = "Fallback Cube";
        cubeMesh.scale.set(1, 1, 1);
        cubeMesh.rotateY(Math.PI / 1.4);
        scene.add(cubeMesh);
    }
);


//Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    stats.update();

    renderer.render(scene, camera);
}
animate();

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}