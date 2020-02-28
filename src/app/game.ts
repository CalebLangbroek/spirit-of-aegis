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

import { World } from './world';
import { WorldTiles } from './world-tiles.enum';
import { Model } from './model';

import BackgroundImage from '../assets/images/backgroundColorForest.png';
import TileSpawnOBJ from '../assets/models/tile_spawn.obj';
import TileSpawnMTL from '../assets/models/tile_spawn.mtl';
import TileEndMTL from '../assets/models/tile_end.mtl';
import TileEndOBJ from '../assets/models/tile_end.obj';
import TileDirtMTL from '../assets/models/tile_dirt.mtl';
import TileDirtOBJ from '../assets/models/tile_dirt.obj';
import TileHillOBJ from '../assets/models/tile_hill.obj';
import TileHillMTL from '../assets/models/tile_hill.mtl';
import TileTreeDoubleOBJ from '../assets/models/tile_treeDouble.obj';
import TileTreeDoubleMTL from '../assets/models/tile_treeDouble.mtl';
import TileDefaultOBJ from '../assets/models/tile.obj';
import TileDefaultMTL from '../assets/models/tile.mtl';


export class Game {
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	controls: OrbitControls;
	loadingManager: LoadingManager;
	models: Model[];
	world: WorldTiles[][];

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
		this.camera.position.x = 2;
		this.camera.position.z = 2;
		this.camera.position.y = 2;

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
		this.controls.enablePan = false;

		// Add event listeners
		window.addEventListener('resize', this.onResize.bind(this));

		// Create the world
		this.world = new World(10).getWorld();

		this.animate();
	}

	private loadModels() {
		const mtlLoader = new MTLLoader(this.loadingManager);

		this.models = [
			{
				name: 'tile-spawn',
				objUrl: TileSpawnOBJ,
				mtlUrl: TileSpawnMTL
			},
			{
				name: 'tile-end',
				objUrl: TileEndOBJ,
				mtlUrl: TileEndMTL
			},
			{
				name: 'tile-dirt',
				objUrl: TileDirtOBJ,
				mtlUrl: TileDirtMTL
			},
			{
				name: 'tile-hill',
				objUrl: TileHillOBJ,
				mtlUrl: TileHillMTL
			},
			{
				name: 'tile-tree-double',
				objUrl: TileTreeDoubleOBJ,
				mtlUrl: TileTreeDoubleMTL
			},
			{
				name: 'tile-default',
				objUrl: TileDefaultOBJ,
				mtlUrl: TileDefaultMTL
			}
		];

		for (const model of this.models) {
			mtlLoader.load(
				model.mtlUrl,
				(material: MTLLoader.MaterialCreator) => {
					this.onMTLLoad(material, model);
				},
				this.onProgress
			);
		}
	}

	private loadWorld() {
		const size = this.world.length;

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const xOffset = i - Math.ceil(size / 2);
				const zOffset = j - Math.ceil(size / 2);
				this.addWorldTileToScene(this.world[i][j], xOffset, zOffset);
			}
		}
	}

	private addWorldTileToScene(
		modelIndex: number,
		xOffset: number,
		zOffset: number
	) {
		const obj = this.models[modelIndex].obj.clone();
		obj.translateX(xOffset);
		obj.translateZ(zOffset);
		this.scene.add(obj);
	}

	/**
	 * MTL done loading callback.
	 */
	private onMTLLoad(material: MTLLoader.MaterialCreator, model: Model) {
		const objLoader = new OBJLoader2(this.loadingManager);
		objLoader.setModelName(model.name);
		objLoader.addMaterials(
			MtlObjBridge.addMaterialsFromMtlLoader(material),
			true
		);
		objLoader.load(
			model.objUrl,
			(obj: Object3D) => {
				this.onOBJLoad(obj, model);
			},
			this.onProgress
		);
	}

	/**
	 * OBJ done loading callback.
	 */
	private onOBJLoad(obj: Object3D, model: Model) {
		model.obj = obj;
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
