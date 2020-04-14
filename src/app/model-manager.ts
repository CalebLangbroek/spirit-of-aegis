import { Object3D, LoadingManager } from 'three';

import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge';

import { WorldTile } from './world-tile';
import { TowerType } from './tower-type';
import { ModelType } from './model-type';
import { EnemyType } from './enemy-type';

/** Class for managing game models. */
export class ModelManager {
	private loadingManager: LoadingManager;
	private mtlLoader: MTLLoader;

	constructor(private onLoadCallback: () => void) {
		this.loadingManager = new LoadingManager();
		this.loadingManager.onLoad = this.onLoadCallback;
		this.mtlLoader = new MTLLoader(this.loadingManager);
	}

	/**
	 * Load all of the game's models.
	 */
	loadModels() {
		// Load world tiles
		this.loadModelType(WorldTile.Tiles);

		// Load towers
		this.loadModelType(TowerType.Towers);

		// Load enemy models
		this.loadModelType(EnemyType.Enemies);
	}

	/**
	 * Load all the models from an array.
	 *
	 * @param models Models to load.
	 */
	private loadModelType(models: ModelType[]) {
		for (const model of models) {
			this.mtlLoader.load(
				model.mtlUrl,
				(material: MTLLoader.MaterialCreator) => {
					this.onMTLLoad(material, model);
				},
				this.onProgress,
				this.onError
			);
		}
	}

	/**
	 * MTL done loading callback.
	 */
	private onMTLLoad(material: MTLLoader.MaterialCreator, model: ModelType) {
		const objLoader = new OBJLoader2(this.loadingManager);

		objLoader.addMaterials(
			MtlObjBridge.addMaterialsFromMtlLoader(material),
			true
		);
		objLoader.load(
			model.objUrl,
			(obj: Object3D) => {
				this.onOBJLoad(obj, model);
			},
			this.onProgress,
			this.onError
		);
	}

	/**
	 * OBJ done loading callback.
	 */
	private onOBJLoad(obj: Object3D, model: ModelType) {
		obj.name = model.name;
		model.setObject3D(obj);
	}

	/**
	 * Model loading callback.
	 */
	private onProgress(progressEvent: ProgressEvent) {
		const percentLoaded =
			(progressEvent.loaded / progressEvent.total) * 100;
		console.log(`Progress: ${percentLoaded}%`);
	}

	/**
	 * Model error loading callback.
	 */
	private onError(error: ErrorEvent) {
		console.log(`Error: ${error.message}`);
	}
}
