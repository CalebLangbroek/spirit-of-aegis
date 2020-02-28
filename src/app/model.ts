import { Object3D } from "three";

export interface Model {
	name: string;
	objUrl: string;
	mtlUrl: string;
	obj?: Object3D;
}
