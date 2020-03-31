import { Scene, Camera } from 'three';
import { Raycaster } from 'three/src/core/Raycaster';
import { Vector2 } from 'three/src/math/Vector2';

import { WorldTile } from './world-tile';
import { TowerType } from './tower-type';

export class EventManager {
	private raycaster: Raycaster;
	private mouse: Vector2;
	private selectedTower: TowerType;

	constructor(public scene: Scene, public camera: Camera) {
		this.raycaster = new Raycaster();
		this.mouse = new Vector2();
		this.addEventListeners();
	}

	private addEventListeners() {
		window.addEventListener('mousedown', this.onMouseDown.bind(this));

		document
			.getElementById('towerSquare')
			.addEventListener('click', this.onTowerClick.bind(this));

		document
			.getElementById('towerRound')
			.addEventListener('click', this.onTowerClick.bind(this));
	}

	private onMouseDown(event: MouseEvent) {
		if (event.button === 0) {
			// Left click
			this.handleMouseLeftClick(event);
		} else if (event.button === 2) {
			// Right click
			this.handleMouseRightClick(event);
		}
	}

	private handleMouseLeftClick(event: MouseEvent): void {
		return;
	}

	private handleMouseRightClick(event: MouseEvent): void {
		// No tower selected
		if (!this.selectedTower) {
			return;
		}

		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = this.raycaster.intersectObjects(
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
			WorldTile.Bridge.name
		];

		if (noBuildTiles.includes(intersect.object.parent.name)) {
			return;
		}

		// Add tower to tile clicked
		const point = intersect.point;
		const obj = this.selectedTower.getObject3D();
		obj.translateX(Math.round(point.x));
		obj.translateY(0.2);
		obj.translateZ(Math.round(point.z));
		this.scene.add(obj);
	}

	private onTowerClick(event: MouseEvent) {
		const target = event.target as Element;

		// Remove the selected class from the currently selected tower
		if (this.selectedTower) {
			document
				.getElementById(this.selectedTower.name)
				.classList.remove('tower-img-selected');
		}

		// Check all tower types
		for (const tower of TowerType.Towers) {
			// Check if the tower type was selected
			if (tower.name === target.id) {
				target.classList.add('tower-img-selected');
				this.selectedTower = tower;
			}
		}
	}
}
