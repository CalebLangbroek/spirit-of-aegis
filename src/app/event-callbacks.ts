import { Vector2 } from 'three/src/math/Vector2';

export interface EventCallbacks {
	resize: () => void;
	mouseRightClick: (mouse: Vector2) => void;
	mouseMove: (mouse: Vector2) => void;
	towerClick: (id: string) => void;
	startClick: () => void;
}
