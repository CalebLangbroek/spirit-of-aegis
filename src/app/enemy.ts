import { Object3D } from 'three';

import { EnemyType } from './enemy-type';

export interface Enemy {
	type: EnemyType;
	health: number;
	obj: Object3D;
	targetNodeIndex: number;
	pathIndex: number;
}
