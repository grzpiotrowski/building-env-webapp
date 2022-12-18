import * as THREE from 'three';
import { OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { client } from './mqttClient.js';
import { PickHelper } from './three-util/pickHelper.js'
import loadGltfModel from './three-util/gltfLoaderHelper.js';
import { sensors } from './sensor.js';

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

// Loading GLTF model into the scene
loadGltfModel('models/building-model.glb', scene);

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




/*** LABELS ***/
const labelPico01 = addLabel('pico01', sensors[0], 3.5, 0.8, -2); // -3, 0.8, 2
const labelPico02 = addLabel('pico02', sensors[1], 3, 0.8, 2); // 3, 0.8, 2
const labelSenseHat = addLabel('senseHat01', sensors[2], -3, 0.8, 2) // 3.5, 0.8, -2

function addLabel(divId, sensor, x, y, z) {
    let sensorDiv = document.createElement('div');
	sensorDiv.className = 'label';
	sensorDiv.id = divId;
	sensorDiv.innerHTML = `<b> ${sensor.location} </b><br>
						   <b> SENSOR OFFLINE </b>
						  `;
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

function updateSensor(sensorData) {
	let sensorDiv = document.getElementById(sensorData.deviceId);
	let found = sensors.filter(function(item) { return item.id === sensorData.deviceId; });
	let sensor = found[0];

	console.log(sensorData.deviceId);
	sensorDiv.innerHTML = `<b> ${sensor.location} </b><br>
						   <b>Sensor:</b> ${sensorData.deviceId}<br>
						   <b>Temperature:</b> ${sensorData.temperature}&#176;C<br>
						   <b>Humidity:</b> ${sensorData.humidity}%<br>
						   <b>Reading time:</b> ${sensorData.timestamp}
						   `;
}


function animate() {
    requestAnimationFrame(animate);
	controls.update();
	pickHelper.pick(pickPosition, scene, camera);
    renderer.render(scene, camera);
	labelRenderer.render( scene, camera );
};


client.on('message', (topic, message) => {
	let sensorData = JSON.parse(message.toString());
	console.log(sensorData);
	updateSensor(sensorData);
  })

animate();