import { WorldTile } from './world-tile';
import { WorldTileNode } from './world-tile-node';

/** Class for managing the game world. */
export class WorldManager {
	private world: WorldTile[][];
	private path: WorldTileNode[];

	/**
	 * Create a world manager.
	 *
	 * @param size The size of the world.
	 * @param towerCount The number of tower tiles.
	 */
	constructor(private size: number) {
		this.world = [[]];
		this.generateWorld();
	}

	/**
	 * Get the world.
	 *
	 * @returns The world.
	 */
	getWorld(): WorldTile[][] {
		return this.world.slice();
	}

	/**
	 * Get the size of the world.
	 *
	 * @returns The world size.
	 */
	getWorldSize(): number {
		return this.size;
	}

	/**
	 * Generate a new world.
	 */
	generateWorld() {
		this.generateTerrain();
		this.generateRiver();
		this.generatePath();
		this.generatePath();
	}

	/**
	 * Generate the terrain of the world.
	 * This is any tiles that don't have any interaction (ie. not a path or tower tile).
	 */
	private generateTerrain() {
		// Randomly set the tiles to terrain tiles
		for (let i = 0; i < this.size; i++) {
			this.world[i] = [];

			for (let j = 0; j < this.size; j++) {
				const randomInteger = this.getRandomInteger(
					WorldTile.River.key,
					WorldTile.Mountain.key
				);
				const randomTile = WorldTile.Tiles[randomInteger];
				this.world[i][j] = randomTile;
			}
		}
	}

	/**
	 * Generates the path for enemies to walk down.
	 */
	private generatePath() {
		// Randomly select the starting tile
		const startNode: WorldTileNode = {
			x: 0,
			z: this.getRandomInteger(this.size)
		};
		this.world[startNode.z][0] = WorldTile.Spawn;

		// Randomly select the ending tile
		const goalNode: WorldTileNode = {
			x: this.size - 1,
			z: this.getRandomInteger(this.size)
		};

		// Generate the path
		this.path = this.findShortestPath(startNode, goalNode);
		for (const node of this.path) {
			if (this.world[node.z][node.x] === WorldTile.River) {
				this.world[node.z][node.x] = WorldTile.Bridge;
			} else {
				this.world[node.z][node.x] = WorldTile.Path;
			}
		}
	}

	/**
	 * Generates a river for the world.
	 */
	private generateRiver() {
		// Randomly select the starting tile
		const startNode: WorldTileNode = {
			x: this.getRandomInteger(this.size),
			z: 0
		};
		this.world[0][startNode.x] = WorldTile.River;

		// Randomly select the ending tile
		const goalNode: WorldTileNode = {
			x: this.getRandomInteger(this.size),
			z: this.size - 1
		};

		// Generate a path for the river
		const path = this.findShortestPath(startNode, goalNode);

		for (const node of path) {
			this.world[node.z][node.x] = WorldTile.River;
		}
	}

	/**
	 * Find the shortest path between two nodes.
	 *
	 * @param startNode Node to start from.
	 * @param goalNode Node to end at.
	 * @returns The path between the two nodes.
	 */
	private findShortestPath(
		startNode: WorldTileNode,
		goalNode: WorldTileNode
	): WorldTileNode[] {
		const path: WorldTileNode[] = [];
		let currentNode = startNode;

		while (currentNode.heuristic !== 0) {
			// Get the next closest tiles
			const northNode: WorldTileNode = {
				x: currentNode.x,
				z: currentNode.z + 1
			};
			const eastNode: WorldTileNode = {
				x: currentNode.x + 1,
				z: currentNode.z
			};
			const southNode: WorldTileNode = {
				x: currentNode.x,
				z: currentNode.z - 1
			};
			const westNode: WorldTileNode = {
				x: currentNode.x - 1,
				z: currentNode.z
			};

			// Determine their heuristic to the end tile
			northNode.heuristic = this.calcHeuristic(northNode, goalNode);
			eastNode.heuristic = this.calcHeuristic(eastNode, goalNode);
			southNode.heuristic = this.calcHeuristic(southNode, goalNode);
			westNode.heuristic = this.calcHeuristic(westNode, goalNode);

			// Choose the closest direction to move
			const lowestHeuristic = Math.min(
				northNode.heuristic,
				eastNode.heuristic,
				southNode.heuristic,
				westNode.heuristic
			);

			switch (lowestHeuristic) {
				case northNode.heuristic:
					currentNode = northNode;
					break;
				case eastNode.heuristic:
					currentNode = eastNode;
					break;
				case southNode.heuristic:
					currentNode = southNode;
					break;
				case westNode.heuristic:
					currentNode = westNode;
					break;
			}

			path.push(currentNode);
		}

		return path;
	}

	/**
	 * Calculate the heuristic for the current node.
	 * Heuristic is the euclidean distance between the current and goal node.
	 *
	 * @param currentNode The node to calculate the heuristic for.
	 * @param goalNode The goal node.
	 * @returns The heuristic of the current node.
	 */
	private calcHeuristic(
		currentNode: WorldTileNode,
		goalNode: WorldTileNode
	): number {
		const xDistance = Math.abs(goalNode.x - currentNode.x);
		const yDistance = Math.abs(goalNode.z - currentNode.z);
		const totalDistance = Math.sqrt(
			Math.pow(xDistance, 2) + Math.pow(yDistance, 2)
		);
		return Math.round(totalDistance);
	}

	/**
	 * Get a random integer between the min and max.
	 *
	 * @param max The maximum for the random number (exclusive).
	 * @param min The minimum for the random number.
	 * @returns A random number.
	 */
	private getRandomInteger(max: number, min = 0): number {
		return Math.floor(Math.random() * (max - min) + min);
	}
}
