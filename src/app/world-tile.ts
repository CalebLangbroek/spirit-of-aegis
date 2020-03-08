import { Object3D } from 'three';

import TileSpawnOBJ from '../assets/models/tile_endSpawn.obj';
import TileSpawnMTL from '../assets/models/tile_endSpawn.mtl';

import TileDirtOBJ from '../assets/models/tile_dirt.obj';
import TileDirtMTL from '../assets/models/tile_dirt.mtl';

import TileHillOBJ from '../assets/models/tile_hill.obj';
import TileHillMTL from '../assets/models/tile_hill.mtl';

import TileTreeDoubleOBJ from '../assets/models/tile_treeDouble.obj';
import TileTreeDoubleMTL from '../assets/models/tile_treeDouble.mtl';

import TileTreeQuadOBJ from '../assets/models/tile_treeQuad.obj';
import TileTreeQuadMTL from '../assets/models/tile_treeQuad.mtl';

import TileDefaultOBJ from '../assets/models/tile.obj';
import TileDefaultMTL from '../assets/models/tile.mtl';

import TileRiverOBJ from '../assets/models/tile_riverStraight.obj';
import TileRiverMTL from '../assets/models/tile_riverStraight.mtl';

import TileRiverBridgeOBJ from '../assets/models/tile_riverBridge.obj';
import TileRiverBridgeMTL from '../assets/models/tile_riverBridge.mtl';

export class WorldTile {
	// Static defined tiles
	static index = 0;
	static readonly Tiles: WorldTile[] = [];
	static readonly Spawn = new WorldTile(TileSpawnOBJ, TileSpawnMTL);
	static readonly Path = new WorldTile(TileDirtOBJ, TileDirtMTL);
	static readonly Mountain = new WorldTile(TileHillOBJ, TileHillMTL);
	static readonly Forest = new WorldTile(
		TileTreeDoubleOBJ,
		TileTreeDoubleMTL
	);
	static readonly ForestQuad = new WorldTile(
		TileTreeQuadOBJ,
		TileTreeQuadMTL
	);
	static readonly Default = new WorldTile(TileDefaultOBJ, TileDefaultMTL);
	static readonly River = new WorldTile(TileRiverOBJ, TileRiverMTL);
	static readonly Bridge = new WorldTile(
		TileRiverBridgeOBJ,
		TileRiverBridgeMTL
	);

	readonly key: number;
	private obj: Object3D;

	constructor(readonly objUrl: string, readonly mtlUrl: string) {
		this.key = WorldTile.index++;
		WorldTile.Tiles.push(this);
	}

	setObject3D(obj: Object3D) {
		this.obj = obj;
	}

	getObject3D() {
		return this.obj.clone();
	}
}
