import {
	WebGLRenderer,
	Scene,
	PerspectiveCamera,
	TextureLoader,
	AmbientLight,
	DirectionalLight,
	RepeatWrapping,
	Object3D,
	LoadingManager
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge';

import { WorldManager } from './world-manager';
import { WorldTile } from './world-tile';

import BackgroundImage from '../assets/images/backgroundEmpty.png';

export class Game {
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	controls: OrbitControls;
	loadingManager: LoadingManager;
	worldManager: WorldManager;

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
		this.camera.position.x = 7;
		this.camera.position.z = 7;
		this.camera.position.y = 7;

		// Setting up the renderer
		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		// Adding lighting
		this.scene.add(new DirectionalLight(0xffffff, 0.1));
		this.scene.add(new AmbientLight(0xbfe3dd, 0.75));

		// Load the objects
		this.loadingManager = new LoadingManager();
		this.loadingManager.onLoad = this.loadWorld.bind(this);
		this.loadModels();

		// Setting up controls
		this.controls = new OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.enablePan = true;

		// Add event listeners
		window.addEventListener('resize', this.onResize.bind(this));

		// Create the world
		this.worldManager = new WorldManager(22);

		this.animate();
	}

	private loadModels() {
		const mtlLoader = new MTLLoader(this.loadingManager);

		for (const tile of WorldTile.Tiles) {
			mtlLoader.load(
				tile.mtlUrl,
				(material: MTLLoader.MaterialCreator) => {
					this.onMTLLoad(material, tile);
				},
				this.onProgress
			);
		}
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
	 * MTL done loading callback.
	 */
	private onMTLLoad(material: MTLLoader.MaterialCreator, tile: WorldTile) {
		const objLoader = new OBJLoader2(this.loadingManager);
		// objLoader.setModelName(tile.name);
		objLoader.addMaterials(
			MtlObjBridge.addMaterialsFromMtlLoader(material),
			true
		);
		objLoader.load(
			tile.objUrl,
			(obj: Object3D) => {
				this.onOBJLoad(obj, tile);
			},
			this.onProgress
		);
	}

	/**
	 * OBJ done loading callback.
	 */
	private onOBJLoad(obj: Object3D, tile: WorldTile) {
		tile.setObject3D(obj);
	}

	/**
	 * Model loading callback.
	 */
	private onProgress(progressEvent: ProgressEvent) {
		const percentLoaded =
			(progressEvent.loaded / progressEvent.total) * 100;
		console.log(`Progress: ${percentLoaded}%`);
	}

	/**
	 * Model error loading callback.
	 */
	private onError() {}

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
