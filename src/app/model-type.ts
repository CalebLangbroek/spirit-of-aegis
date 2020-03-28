import { Object3D } from 'three';

export abstract class ModelType {
	private obj: Object3D;

	constructor(readonly name: string, readonly objUrl: string, readonly mtlUrl: string) {}

	setObject3D(obj: Object3D) {
		this.obj = obj;
	}

	getObject3D() {
		return this.obj.clone();
	}
}
