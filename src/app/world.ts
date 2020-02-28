import { WorldTiles } from './world-tiles.enum';

/** Class for the game world. */
export class World {
	private world: WorldTiles[][];

	/**
	 * Create a world.
	 *
	 * @param size The size of the world.
	 */
	constructor(private size: number) {
		this.generateWorld();
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
	 * Generate a game world.
	 *
	 * @returns The game world of size * size.
	 */
	private generateWorld() {
		const world: WorldTiles[][] = [[]];

		for (let i = 0; i < this.size; i++) {
			world[i] = [];

			for (let j = 0; j < this.size; j++) {
				world[i][j] = Math.floor(Math.random() * 4 + 2);
			}
		}

		this.world = world;
	}
}
