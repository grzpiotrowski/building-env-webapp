import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { client } from "./mqttClient.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
//renderer.setClearColor(0x6d7372, 1);

let container = document.getElementById('viewer-container');
renderer.setSize($(container).width(), $(container).height());
container.appendChild(renderer.domElement);

// Dynamically adjust renderer size when browser window is resized
window.addEventListener('resize', onWindowResize);

// Orbit camera controls
const controls = new OrbitControls(camera, renderer.domElement);

// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
	// resource URL
	'models/building-model.glb',
	// called when the resource is loaded
	function (gltf) {
		scene.add(gltf.scene);

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
	},
	// called while loading is progressing
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	// called when loading has errors
	function (error) {
		console.log( 'An error happened' );
	}
);

camera.position.x = -2.73;
camera.position.y = 8.51;
camera.position.z = 3.86;
//controls.update() must be called after any manual changes to the camera's transform
controls.update(); 


/***  LIGHTING ***/
const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
directionalLight.translateX(15);
directionalLight.translateZ(10);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight2.translateX(-15);
directionalLight2.translateZ(-10);
scene.add(directionalLight2);

const directionalLightTopDown = new THREE.DirectionalLight( 0xffffff, 2 );
scene.add(directionalLightTopDown);

scene.fog = new THREE.Fog( 0x6d7372, 10, 25 );
scene.background = new THREE.Color( 0x6d7372 );



/*** TEXT ***/
let textMesh
const fontLoader = new FontLoader();

createText("TEST");

function createText(text) {
	fontLoader.load( '././fonts/helvetiker_regular.typeface.json', function ( font ) {

		const textGeo = new TextGeometry( text, {

			font: font,

			size: 0.5,
			height: 0.05,
			curveSegments: 0.05,

			bevelThickness: 0.05,
			bevelSize: 0.02,
			bevelEnabled: true

		} );

		textGeo.computeBoundingBox();
		const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

		const textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

		textMesh = new THREE.Mesh( textGeo, textMaterial );
		textMesh.position.x = centerOffset;
		textMesh.position.y = 5;

		textMesh.castShadow = true;
		textMesh.receiveShadow = true;

		scene.add( textMesh );
		
	} );
}

function refreshText(text) {
	scene.remove(textMesh);
	createText(text);
}

function onWindowResize() {
	let container = document.getElementById('viewer-container');
    camera.aspect = $(container).width() / $(container).height();
    camera.updateProjectionMatrix();
    renderer.setSize($(container).width(), $(container).height());
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

client.on('message', (topic, message) => {
	refreshText(message.toString());
  })

animate();