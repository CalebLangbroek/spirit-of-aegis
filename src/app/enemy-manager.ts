import { Scene } from 'three';

import { WorldManager } from './world-manager';
import { EnemyType } from './enemy-type';
import { Utils } from './utils/utils';
import { Player } from './player';
import { Enemy } from './enemy';
import { WorldTileNode } from './world-tile-node';
import { TowerManager } from './tower-manager';
import { Tower } from './tower';

export class EnemyManager {
	private enemies: Enemy[] = [];
	private lastAddEnemyTime = 0;
	private purpleEnemyCount = 0;
	private redEnemyCount = 0;

	constructor(
		private scene: Scene,
		private player: Player,
		private worldManager: WorldManager,
		private towerManager: TowerManager,
		private maxEnemies: number
	) {}

	update(currentTime: number) {
		// Check if we need to add any new enemies
		if (
			this.enemies.length < this.maxEnemies &&
			currentTime - this.lastAddEnemyTime > Utils.getRandomInteger(100)
		) {
			this.addEnemy();
			this.lastAddEnemyTime = currentTime;
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
			const inRange = this.checkTowersInRange(enemy);

			// If in range update health
			for (const tower of inRange) {
				enemy.health -= tower.type.dps;
			}

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
		Utils.setInnerTextByID(
			'red-enemy-count',
			this.redEnemyCount.toString()
		);
		Utils.setInnerTextByID(
			'purple-enemy-count',
			this.purpleEnemyCount.toString()
		);
	}

	private addEnemy() {
		const type =
			EnemyType.Enemies[Utils.getRandomInteger(EnemyType.Enemies.length)];

		if (type === EnemyType.UFORed) {
			this.redEnemyCount++;
		} else {
			this.purpleEnemyCount++;
		}

		// Get the position for enemy to start at
		const pathIndex = Utils.getRandomInteger(2);
		const spawnTile = this.worldManager.getPaths()[pathIndex][0];
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
			health: type.health,
			obj,
			targetNodeIndex: 1,
			pathIndex,
		};

		// Add to list of enemies
		this.enemies.push(enemy);
	}

	private removeEnemy(index: number) {
		// Remove from array
		const enemy = this.enemies.splice(index, 1)[0];

		if (enemy.type === EnemyType.UFORed) {
			this.redEnemyCount--;
		} else {
			this.purpleEnemyCount--;
		}

		// Remove from scene
		this.scene.remove(enemy.obj);
	}

	private checkTowersInRange(enemy: Enemy) {
		const inRange: Tower[] = [];

		for (const tower of this.towerManager.getTowers()) {
			const xDistance = enemy.obj.position.x - tower.obj.position.x;
			const zDistance = enemy.obj.position.z - tower.obj.position.z;
			const distance = Math.round(
				Math.sqrt(Math.pow(xDistance, 2) + Math.pow(zDistance, 2))
			);

			if (distance <= tower.type.range) {
				inRange.push(tower);
			}
		}

		return inRange;
	}

	private moveEnemy(enemy: Enemy, path: WorldTileNode[]) {
		// Move from current position to next path index
		const size = this.worldManager.getWorldSize();
		const targetNode = path[enemy.targetNodeIndex];
		const currentNode = path[enemy.targetNodeIndex - 1];

		if (!currentNode || !targetNode) {
			return;
		}

		const x = (targetNode.x - currentNode.x) / 10;
		const z = (targetNode.z - currentNode.z) / 10;

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
