import {
	WebGLRenderer,
	Scene,
	PerspectiveCamera,
	TextureLoader,
	AmbientLight,
	DirectionalLight,
	RepeatWrapping,
	Vector2,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import BackgroundImage from '../assets/images/background.png';

import { Utils } from './utils/utils';
import { WorldManager } from './world-manager';
import { ModelManager } from './model-manager';
import { EventManager } from './event-manager';
import { EnemyManager } from './enemy-manager';
import { TowerManager } from './tower-manager';
import { WorldTile } from './world-tile';
import { Player } from './player';
import { EventCallbacks } from './event-callbacks';

export class Game {
	private scene: Scene;
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;
	private controls: OrbitControls;
	private worldManager: WorldManager;
	private modelManager: ModelManager;
	private eventManager: EventManager;
	private enemyManager: EnemyManager;
	private towerManager: TowerManager;
	private player: Player;
	private isRunning = false;
	private previousUpdateTime = 0;

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

		// Initialize player
		this.player = new Player(10, 200);

		// Create the world
		this.worldManager = new WorldManager(22);

		// Add event listeners
		const callbacks: EventCallbacks = {
			resize: this.onResize.bind(this),
			mouseRightClick: this.buildTower.bind(this),
			mouseMove: this.hoverTower.bind(this),
			towerClick: this.selectTower.bind(this),
			toggleClick: this.toggleGameRunning.bind(this),
		};
		this.eventManager = new EventManager(callbacks);

		this.towerManager = new TowerManager(
			this.scene,
			this.player,
			this.camera,
			this.eventManager
		);

		// Set up enemy manager
		this.enemyManager = new EnemyManager(
			this.scene,
			this.player,
			this.worldManager,
			this.towerManager,
			3
		);

		requestAnimationFrame(this.animate.bind(this));
	}

	private loadWorld() {
		const size = this.worldManager.getWorldSize();
		const world = this.worldManager.getWorld();

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const zOffset = Utils.convertPosToSceneOffset(i, size);
				const xOffset = Utils.convertPosToSceneOffset(j, size);
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
			obj.rotateY((Math.PI * Utils.getRandomInteger(2)) / 2);
		} else if (tile === WorldTile.Bridge) {
			obj.rotateY(Math.PI / 2);
		}

		this.scene.add(obj);
	}

	/**
	 * Animation callback.
	 */
	private animate(currentTime: number) {
		// Convert to seconds
		currentTime /= 1000;

		if (
			currentTime - this.previousUpdateTime > 0.05 &&
			this.isRunning &&
			this.player.getHealth() > 0
		) {
			this.enemyManager.update(currentTime);

			this.previousUpdateTime = currentTime;
		}

		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.animate.bind(this));
	}

	private onResize() {
		// TODO: fix background repeat on resize
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	private toggleGameRunning(): void {
		this.isRunning = !this.isRunning;
		const toggleBtnText = this.isRunning ? 'Pause' : 'Resume';
		Utils.setInnerTextByID('toggle', toggleBtnText);
	}

	private buildTower(mouse: Vector2): void {
		this.towerManager.addTower(mouse);
	}

	private hoverTower(mouse: Vector2) {
		// TODO: implement the hover tower
	}

	private selectTower(towerID: string): void {
		this.towerManager.selectTower(towerID);
	}
}
