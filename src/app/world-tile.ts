import { ModelType } from './model-type';

import TileSpawnOBJ from '../assets/models/tiles/tile_endSpawn.obj';
import TileSpawnMTL from '../assets/models/tiles/tile_endSpawn.mtl';

import TileDirtOBJ from '../assets/models/tiles/tile_dirt.obj';
import TileDirtMTL from '../assets/models/tiles/tile_dirt.mtl';

import TileHillOBJ from '../assets/models/tiles/tile_hill.obj';
import TileHillMTL from '../assets/models/tiles/tile_hill.mtl';

import TileTreeDoubleOBJ from '../assets/models/tiles/tile_treeDouble.obj';
import TileTreeDoubleMTL from '../assets/models/tiles/tile_treeDouble.mtl';

import TileTreeQuadOBJ from '../assets/models/tiles/tile_treeQuad.obj';
import TileTreeQuadMTL from '../assets/models/tiles/tile_treeQuad.mtl';

import TileDefaultOBJ from '../assets/models/tiles/tile.obj';
import TileDefaultMTL from '../assets/models/tiles/tile.mtl';

import TileRiverOBJ from '../assets/models/tiles/tile_riverStraight.obj';
import TileRiverMTL from '../assets/models/tiles/tile_riverStraight.mtl';

import TileRiverBridgeOBJ from '../assets/models/tiles/tile_riverBridge.obj';
import TileRiverBridgeMTL from '../assets/models/tiles/tile_riverBridge.mtl';

/** Class for declaring static tile types. */
export class WorldTile extends ModelType {
	static index = 0;
	static readonly Tiles: WorldTile[] = [];

	// Tile types
	static readonly Spawn = new WorldTile('spawn', TileSpawnOBJ, TileSpawnMTL);
	static readonly Path = new WorldTile('path', TileDirtOBJ, TileDirtMTL);
	static readonly Mountain = new WorldTile(
		'mountain',
		TileHillOBJ,
		TileHillMTL
	);
	static readonly Forest = new WorldTile(
		'forest',
		TileTreeDoubleOBJ,
		TileTreeDoubleMTL
	);
	static readonly ForestQuad = new WorldTile(
		'forestQuad',
		TileTreeQuadOBJ,
		TileTreeQuadMTL
	);
	static readonly Default = new WorldTile(
		'default',
		TileDefaultOBJ,
		TileDefaultMTL
	);
	static readonly River = new WorldTile('river', TileRiverOBJ, TileRiverMTL);
	static readonly Bridge = new WorldTile(
		'bridge',
		TileRiverBridgeOBJ,
		TileRiverBridgeMTL
	);

	readonly key: number;

	constructor(name: string, objUrl: string, mtlUrl: string) {
		super(name, objUrl, mtlUrl);
		this.key = WorldTile.index++;
		WorldTile.Tiles.push(this);
	}
}
