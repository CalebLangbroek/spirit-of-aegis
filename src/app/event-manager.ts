import { Vector2 } from 'three/src/math/Vector2';
import { EventCallbacks } from './event-callbacks';

/** Class for setting up DOM event listeners. */
export class EventManager {
	private onMouseMoveBound: any;

	constructor(private callbacks: EventCallbacks) {
		// Here we need to store the listener as a variable so we can remove it
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.addEventListeners();
	}

	addMouseMoveListener() {
		window.addEventListener('mousemove', this.onMouseMoveBound);
	}

	removeMouseMoveListener() {
		window.removeEventListener('mousemove', this.onMouseMoveBound);
	}

	private addEventListeners() {
		window.addEventListener('resize', this.callbacks.resize);

		window.addEventListener('mousedown', this.onMouseDown.bind(this));

		[
			...document.querySelectorAll('#towerSquare, #towerRound'),
		].forEach((el) =>
			el.addEventListener('click', this.onTowerClick.bind(this))
		);

		document
			.getElementById('toggle')
			.addEventListener('click', this.callbacks.toggleClick);
	}

	private onMouseDown(event: MouseEvent) {
		const mouse = this.getMouseFromMouseEvent(event);

		if (event.button === 0) {
			// Left click
		} else if (event.button === 2) {
			// Right click
			this.callbacks.mouseRightClick(mouse);
		}
	}

	private onMouseMove(event: MouseEvent) {
		const mouse = this.getMouseFromMouseEvent(event);

		this.callbacks.mouseMove(mouse);
	}

	private onTowerClick(event: MouseEvent) {
		const target = event.target as Element;
		const id = target.id;
		this.callbacks.towerClick(id);
	}

	private getMouseFromMouseEvent(event: MouseEvent) {
		const mouse = new Vector2();
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		return mouse;
	}
}
