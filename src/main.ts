import {
	WebGLRenderer,
	Scene,
	PerspectiveCamera,
	BoxGeometry,
	MeshBasicMaterial,
	Mesh
} from 'three';
import './styles.css';

const scene = new Scene();
const camera = new PerspectiveCamera(
	80,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new WebGLRenderer();

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var geometry = new BoxGeometry();
	var material = new MeshBasicMaterial({ color: 0x00ff00 });
	var cube = new Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 5;

	var animate = function() {
		requestAnimationFrame(animate);

		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		renderer.render(scene, camera);
	};

	animate();
}

init();
