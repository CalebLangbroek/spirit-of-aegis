import { Scene } from 'three';

import { WorldManager } from './world-manager';
import { EnemyType } from './enemy-type';
import { Utils } from './utils/utils';
import { Player } from './player';
import { Enemy } from './enemy';
import { WorldTileNode } from './world-tile-node';

export class EnemyManager {
	private enemies: Enemy[];

	constructor(
		private scene: Scene,
		private player: Player,
		private worldManager: WorldManager,
		private maxEnemies: number
	) {
		this.enemies = [];
	}

	update() {
		// Check if we need to add any new enemies
		if (this.enemies.length < this.maxEnemies) {
			this.addEnemy();
		}

		for (let i = 0; i < this.enemies.length; i++) {
			const enemy = this.enemies[i];
			const path = this.worldManager.getPaths()[enemy.pathIndex];

			// Check if any enemies have crossed the last tile
			if (enemy.targetNodeIndex >= path.length) {
				this.removeEnemy(i);
				this.player.setHealth(this.player.getHealth() - 1);
			}

			// Check if any towers in range
			this.checkTowersInRange();

			// If in range update health

			if (enemy.health < 1) {
				// Remove if health is 0
				this.removeEnemy(i);

				// Add player gold if removed
				this.player.setMoney(
					this.player.getMoney() + enemy.type.killValue
				);
			} else {
				// Move enemies
				this.moveEnemy(enemy, path);
			}
		}

		// Update enemy count in GUI
		Utils.setInnerTextByID('enemies-remaining', this.maxEnemies.toString());
		Utils.setInnerTextByID('enemies-total', this.maxEnemies.toString());
	}

	private addEnemy() {
		const type = EnemyType.UFORed;
		const health = 100;

		// Get the position for enemy to start at
		const pathIndex = Utils.getRandomInteger(2);
		const spawnTile = this.worldManager.getSpawnTiles()[pathIndex];
		const size = this.worldManager.getWorldSize();

		const x = Utils.convertPosToSceneOffset(spawnTile.x, size);
		const z = Utils.convertPosToSceneOffset(spawnTile.z, size);

		// Add to scene
		const obj = type.getObject3D();
		obj.translateX(x);
		obj.translateY(1);
		obj.translateZ(z);

		this.scene.add(obj);

		const enemy: Enemy = {
			type,
			health,
			obj,
			targetNodeIndex: 1,
			pathIndex,
		};

		// Add to list of enemies
		this.enemies.push(enemy);
	}

	private removeEnemy(index: number) {
		// Remove from array
		const enemy = this.enemies.splice(index)[0];

		// Remove from scene
		this.scene.remove(enemy.obj);
	}

	private checkTowersInRange() {
		// for(const tower in this.towerManager) {}
	}

	private moveEnemy(enemy: Enemy, path: WorldTileNode[]) {
		// Move from current position to next path index
		const size = this.worldManager.getWorldSize();
		const targetNode = path[enemy.targetNodeIndex];
		const currentNode = path[enemy.targetNodeIndex - 1];

		const x = (targetNode.x - currentNode.x) / 100;
		const z = (targetNode.z - currentNode.z) / 100;

		enemy.obj.translateX(x);
		enemy.obj.translateZ(z);

		if (
			Math.round(enemy.obj.position.x) ===
				Utils.convertPosToSceneOffset(targetNode.x, size) &&
			Math.round(enemy.obj.position.z) ===
				Utils.convertPosToSceneOffset(targetNode.z, size)
		) {
			enemy.targetNodeIndex++;
		}
	}
}
