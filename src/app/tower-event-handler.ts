import { Scene, Camera } from 'three';
import { Raycaster } from 'three/src/core/Raycaster';
import { Vector2 } from 'three/src/math/Vector2';

import { EventHandler } from './event-handler';
import { WorldTile } from './world-tile';
import { TowerType } from './tower-type';

export class TowerEventHandler implements EventHandler {
	private raycaster: Raycaster;
	private mouse: Vector2;

	constructor(public scene: Scene, public camera: Camera) {
		this.raycaster = new Raycaster();
		this.mouse = new Vector2();
	}

	handleMouseRightClick(): void {
		return;
	}

	handleMouseLeftClick(event: MouseEvent): void {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = this.raycaster.intersectObjects(
			this.scene.children,
			true
		);

		// Check if mouse intersected with any tiles
		if (intersects.length < 1) {
			return;
		}

		const intersect = intersects[0];

		// Can't add tower on certain tiles
		const noBuildTiles = [
			WorldTile.River.name,
			WorldTile.Path.name,
			WorldTile.River.name,
			WorldTile.Spawn.name,
			WorldTile.Bridge.name
		];

		if (noBuildTiles.includes(intersect.object.parent.name)) {
			return;
		}

		// Add tower to tile clicked
		const point = intersect.point;
		const obj =
			Math.round(Math.random() * 10) % 2 === 0
				? TowerType.TowerRound.getObject3D()
				: TowerType.TowerSquare.getObject3D();
		obj.translateX(Math.round(point.x));
		obj.translateY(0.2);
		obj.translateZ(Math.round(point.z));
		this.scene.add(obj);
	}
}
