import {
	WebGLRenderer,
	Scene,
	PerspectiveCamera,
	TextureLoader,
	AmbientLight,
	DirectionalLight,
	RepeatWrapping,
	Vector2,
	Raycaster,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import BackgroundImage from '../assets/images/background.png';

import { Utils } from './utils/utils';
import { WorldManager } from './world-manager';
import { ModelManager } from './model-manager';
import { EventManager } from './event-manager';
import { EnemyManager } from './enemy-manager';
import { WorldTile } from './world-tile';
import { TowerType } from './tower-type';
import { Player } from './player';
import { EventCallbacks } from './event-callbacks';

export class Game {
	private selectedTower: TowerType;
	private scene: Scene;
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;
	private controls: OrbitControls;
	private worldManager: WorldManager;
	private modelManager: ModelManager;
	private eventManager: EventManager;
	private enemyManager: EnemyManager;
	private player: Player;
	private isRunning: boolean;

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
		const callbacks: EventCallbacks = {
			resize: this.onResize.bind(this),
			mouseRightClick: this.buildTower.bind(this),
			mouseMove: this.hoverTower.bind(this),
			towerClick: this.selectTower.bind(this),
			toggleClick: this.toggleGameRunning.bind(this),
		};
		this.eventManager = new EventManager(callbacks);

		// Initialize player
		this.player = new Player(10, 200);
		this.isRunning = false;

		// Create the world
		this.worldManager = new WorldManager(22);

		this.enemyManager = new EnemyManager(
			this.scene,
			this.player,
			this.worldManager,
			1
		);

		this.animate();
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
	private animate() {
		requestAnimationFrame(this.animate.bind(this));

		if (this.isRunning && this.player.getHealth() > 0) {
			this.enemyManager.update();
		}

		this.renderer.render(this.scene, this.camera);
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
		// No tower selected, nothing to build
		if (!this.selectedTower) {
			return;
		}

		const raycaster = new Raycaster();
		raycaster.setFromCamera(mouse, this.camera);
		const intersects = raycaster.intersectObjects(
			this.scene.children,
			true
		);

		// Check if mouse intersected with any tiles
		if (intersects.length < 1) {
			return;
		}

		const intersect = intersects[0];

		// Can't add tower on certain tiles
		const noBuildTiles = [
			WorldTile.River.name,
			WorldTile.Path.name,
			WorldTile.River.name,
			WorldTile.Spawn.name,
			WorldTile.Bridge.name,
		];

		if (noBuildTiles.includes(intersect.object.parent.name)) {
			return;
		}

		// Check that the player has enough money
		if (this.player.getMoney() < this.selectedTower.cost) {
			return;
		}

		// Add tower to tile clicked
		const point = intersect.point;
		const obj = this.selectedTower.getObject3D();
		obj.translateX(Math.round(point.x));
		obj.translateY(0.2);
		obj.translateZ(Math.round(point.z));
		this.scene.add(obj);

		this.player.setMoney(this.player.getMoney() - this.selectedTower.cost);
	}

	private hoverTower(mouse: Vector2) {
		// TODO: implement the hover tower
		console.log(`X: ${mouse.x}, Y: ${mouse.y}`);
	}

	private selectTower(towerID: string): void {
		// Remove the selected class from the currently selected tower
		if (this.selectedTower) {
			Utils.removeCSSClassByID(
				this.selectedTower.name,
				'tower-img-selected'
			);
		}

		// Check all tower types
		for (const tower of TowerType.Towers) {
			// Check if the tower type was selected
			if (tower.name === towerID) {
				if (this.selectedTower === tower) {
					// Same tower as current tower so deselect
					this.selectedTower = undefined;

					// Remove event listener for hovering the tower
					this.eventManager.removeMouseMoveListener();
				} else {
					this.selectedTower = tower;
					Utils.addCSSClassByID(
						this.selectedTower.name,
						'tower-img-selected'
					);
					this.eventManager.addMouseMoveListener();
				}
			}
		}
	}
}
