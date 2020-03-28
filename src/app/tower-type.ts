import { ModelType } from './model-type';

import TowerSquareOBJ from '../assets/models/towers/towerSquare_sampleA.obj';
import TowerSquareMTL from '../assets/models/towers/towerSquare_sampleA.mtl';

import TowerRoundOBJ from '../assets/models/towers/towerRound_sampleF.obj';
import TowerRoundMTL from '../assets/models/towers/towerRound_sampleF.mtl';

/** Class for declaring static tile types */
export class TowerType extends ModelType {
	static index = 0;
	static readonly Towers: TowerType[] = [];

	static readonly TowerSquare = new TowerType('towerSquare', TowerSquareOBJ, TowerSquareMTL);
	static readonly TowerRound = new TowerType('towerRound', TowerRoundOBJ, TowerRoundMTL);

	readonly key: number;

	constructor(name: string, objUrl: string, mtlUrl: string) {
		super(name, objUrl, mtlUrl);
		this.key = TowerType.index++;
		TowerType.Towers.push(this);
	}
}
