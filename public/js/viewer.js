import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { client } from "./mqttClient.js";
import { PickHelper } from "./pickHelper.js"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true});
//renderer.setClearColor(0x6d7372, 1);

let container = document.getElementById('viewer-container');
renderer.setSize($(container).width(), $(container).height());
const canvas = renderer.domElement;
container.appendChild(canvas);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( $(container).width(), $(container).height() );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
container.appendChild( labelRenderer.domElement );

// Dynamically adjust renderer size when browser window is resized
window.addEventListener('resize', onWindowResize);

// Orbit camera controls
const controls = new OrbitControls(camera, labelRenderer.domElement);
controls.enableDamping = true;

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



/*** TEXT 3D ***/
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

/** OBJECT PICKING **/
const pickPosition = {x: 0, y: 0};
const pickHelper = new PickHelper();
clearPickPosition();

function getCanvasRelativePosition(event) {
	const rect = canvas.getBoundingClientRect();
	return {
	  x: event.clientX - rect.left,
	  y: event.clientY - rect.top,
	};
}
   
function setPickPosition(event) {
	const pos = getCanvasRelativePosition(event);
	pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
	pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
}
   
function clearPickPosition() {
	// unlike the mouse which always has a position
	// if the user stops touching the screen we want
	// to stop picking. For now we just pick a value
	// unlikely to pick something
	pickPosition.x = -100000;
	pickPosition.y = -100000;
}

window.addEventListener('mousemove', setPickPosition);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);




/*** LABEL ***/
let sensorDiv;
const label = addLabel('pico01sensor', "SENSOR", -3, 0.8, 2);
let labelDiv = sensorDiv;

function addLabel(divId, text, x, y, z) {
    sensorDiv = document.createElement('div');
	sensorDiv.className = 'label';
	sensorDiv.id = divId;
	sensorDiv.textContent = text;
	sensorDiv.style.marginTop = '-1em';
	const sensorLabel = new CSS2DObject(sensorDiv);
	sensorLabel.position.set(x, y, z);
	scene.add(sensorLabel);
	sensorLabel.layers.set(0);

	return sensorLabel;
}

function onWindowResize() {
	let container = document.getElementById('viewer-container');
    camera.aspect = $(container).width() / $(container).height();
    camera.updateProjectionMatrix();
    renderer.setSize($(container).width(), $(container).height());
	labelRenderer.setSize($(container).width(), $(container).height());
}


function animate() {
    requestAnimationFrame(animate);
	controls.update();
	pickHelper.pick(pickPosition, scene, camera);
    renderer.render(scene, camera);
	labelRenderer.render( scene, camera );
};

client.on('message', (topic, message) => {
	refreshText(message.toString());
	sensorDiv.textContent = message.toString();
  })

animate();