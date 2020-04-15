import { Raycaster, Scene, Vector2, Camera } from 'three';

import { EventManager } from './event-manager';
import { Utils } from './utils/utils';
import { WorldTile } from './world-tile';
import { TowerType } from './tower-type';
import { Player } from './player';
import { Tower } from './tower';

export class TowerManager {
	private towers: Tower[];
	private selectedTower: TowerType;

	constructor(
		private scene: Scene,
		private player: Player,
		private camera: Camera,
		private eventManager: EventManager
	) {
		this.towers = [];
	}

	getTowers() {
		return this.towers.slice();
	}

	addTower(mouse: Vector2) {
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
		const obj = this.selectedTower.getObject3D();
		obj.translateX(Math.round(intersect.point.x));
		obj.translateY(0.2);
		obj.translateZ(Math.round(intersect.point.z));
		this.scene.add(obj);

		const tower: Tower = {
			obj,
			type: this.selectedTower,
		};

		this.towers.push(tower);

		this.player.setMoney(this.player.getMoney() - this.selectedTower.cost);
	}

	removeTower() {}

	selectTower(towerID: string) {
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
