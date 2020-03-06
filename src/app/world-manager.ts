import { WorldTiles } from './world-tiles.enum';
import { WorldTileNode } from './world-tile-node';

/** Class for managing the game world. */
export class WorldManager {
	private world: WorldTiles[][];

	/**
	 * Create a world manager.
	 *
	 * @param size The size of the world.
	 */
	constructor(private size: number) {
		this.world = this.generateWorld(size);
	}

	/**
	 * Get the world.
	 *
	 * @returns The world.
	 */
	getWorld(): WorldTiles[][] {
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
	 * Generate a world.
	 *
	 * @param size The size of the world.
	 * @returns The world of size * size. Made up of world tiles.
	 */
	private generateWorld(size: number): WorldTiles[][] {
		let world = this.generateTerrain(size);
		world = this.generateRiver(world, size);
		world = this.generatePath(world, size);
		return world;
	}

	/**
	 * Generate the terrain of the world.
	 * This is any tiles that don't have any interaction (ie. not a path or tower tile).
	 *
	 * @param size The size of the world.
	 * @returns The world with terrain added.
	 */
	private generateTerrain(size: number): WorldTiles[][] {
		const world: WorldTiles[][] = [[]];

		// Randomly set the tiles to terrain tiles
		for (let i = 0; i < size; i++) {
			world[i] = [];

			for (let j = 0; j < size; j++) {
				world[i][j] = this.randomInteger(
					WorldTiles.River,
					WorldTiles.Mountain
				);
			}
		}

		return world;
	}

	/**
	 * Generates the path for enemies to walk down.
	 *
	 * @param world The world to add a path to.
	 * @param size The size of the world.
	 * @returns The world with path added.
	 */
	private generatePath(world: WorldTiles[][], size: number): WorldTiles[][] {
		// Randomly select the starting tile
		const startNode: WorldTileNode = {
			x: 0,
			z: this.randomInteger(size)
		};
		world[startNode.z][0] = WorldTiles.Spawn;

		// Randomly select the ending tile
		const goalNode: WorldTileNode = {
			x: size - 1,
			z: this.randomInteger(size)
		};

		// Generate the path
		const path = this.findShortestPath(startNode, goalNode);
		for (const node of path) {
			if (world[node.z][node.x] === WorldTiles.River) {
				world[node.z][node.x] = WorldTiles.Bridge;
			} else {
				world[node.z][node.x] = WorldTiles.Path;
			}
		}

		return world;
	}

	/**
	 * Generates a river for the world.
	 *
	 * @param world The world to add a river to.
	 * @param size The size of the world.
	 * @returns The world with the river added.
	 */
	private generateRiver(world: WorldTiles[][], size: number): WorldTiles[][] {
		// Randomly select the starting tile
		const startNode: WorldTileNode = {
			x: this.randomInteger(size),
			z: 0
		};
		world[0][startNode.x] = WorldTiles.River;

		// Randomly select the ending tile
		const goalNode: WorldTileNode = {
			x: this.randomInteger(size),
			z: size - 1
		};

		// Generate a path for the river
		const path = this.findShortestPath(startNode, goalNode);

		for (const node of path) {
			world[node.z][node.x] = WorldTiles.River;
		}

		return world;
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
	private randomInteger(max: number, min = 0): number {
		return Math.floor(Math.random() * (max - min) + min);
	}
}
