import { Object3D } from 'three';

import { TowerType } from './tower-type';

export interface Tower {
	type: TowerType;
	obj: Object3D;
}
