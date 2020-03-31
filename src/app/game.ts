import {
	WebGLRenderer,
	Scene,
	PerspectiveCamera,
	TextureLoader,
	AmbientLight,
	DirectionalLight,
	RepeatWrapping
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import BackgroundImage from '../assets/images/background.png';

import { WorldManager } from './world-manager';
import { WorldTile } from './world-tile';
import { ModelManager } from './model-manager';
import { EventManager } from './event-manager';

export class Game {
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	controls: OrbitControls;
	worldManager: WorldManager;
	modelManager: ModelManager;
	eventManager: EventManager;

	constructor() {}

	init() {
		// Setting up the scene and camera
		const texture = new TextureLoader().load(BackgroundImage);
		texture.wrapS = RepeatWrapping;
		texture.repeat.set(Math.floor(window.innerWidth / 1024), 1);

		this.scene = new Scene();
		this.scene.background = texture;

		this.camera = new PerspectiveCamera(
			80,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.x = 15;
		this.camera.position.z = 15;
		this.camera.position.y = 15;

		// Setting up the renderer
		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		// Adding lighting
		this.scene.add(new DirectionalLight(0xffffff, 0.1));
		this.scene.add(new AmbientLight(0xbfe3dd, 0.75));

		// Initialize model manager and load models
		this.modelManager = new ModelManager(this.loadWorld.bind(this));
		this.modelManager.loadModels();

		// Setting up controls
		this.controls = new OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.enablePan = false;

		// Add event listeners
		this.eventManager = new EventManager(this.scene, this.camera);
		window.addEventListener('resize', this.onResize.bind(this), false);

		// Create the world
		this.worldManager = new WorldManager(22);

		this.animate();
	}

	private loadWorld() {
		const size = this.worldManager.getWorldSize();
		const world = this.worldManager.getWorld();

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const xOffset = i - Math.floor(size / 2);
				const zOffset = j - Math.floor(size / 2);
				this.addWorldTileToScene(world[i][j], xOffset, zOffset);
			}
		}
	}

	private addWorldTileToScene(
		tile: WorldTile,
		xOffset: number,
		zOffset: number
	) {
		const obj = tile.getObject3D();
		obj.translateX(xOffset);
		obj.translateZ(zOffset);

		// TODO: move tile rotation to separate class/function
		if (tile === WorldTile.Forest) {
			// Randomly rotate the forest tiles
			obj.rotateY((Math.PI * Math.floor(Math.random() * 2)) / 2);
		} else if (tile === WorldTile.River) {
			obj.rotateY(Math.PI / 2);
		} else if (tile === WorldTile.Bridge) {
			obj.rotateY(Math.PI / 2);
		}

		this.scene.add(obj);
	}

	/**
	 * Animation callback.
	 */
	private animate() {
		requestAnimationFrame(this.animate.bind(this));

		this.renderer.render(this.scene, this.camera);
	}

	private onResize() {
		// TODO: fix background repeat on resize
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
