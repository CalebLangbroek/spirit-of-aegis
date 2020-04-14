import { ModelType } from './model-type';

import EnemyUFORedOBJ from '../assets/models/enemies/enemy_ufoRed.obj';
import EnemyUFORedMTL from '../assets/models/enemies/enemy_ufoRed.mtl';

/** Class for declaring static enemy types. */
export class EnemyType extends ModelType {
	static index = 0;
	static readonly Enemies: EnemyType[] = [];

	static readonly UFORed = new EnemyType(
		'enemy_ufoRed',
		EnemyUFORedOBJ,
		EnemyUFORedMTL,
		50
	);

	readonly key: number;

	constructor(
		name: string,
		objUrl: string,
		mtlUrl: string,
		readonly killValue: number
	) {
		super(name, objUrl, mtlUrl);
		this.key = EnemyType.index++;
		EnemyType.Enemies.push(this);
	}
}
