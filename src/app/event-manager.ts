import { EventHandler } from './event-handler';

export class EventManager {
	constructor(public eventHandler: EventHandler) {
		window.addEventListener(
			'mousedown',
			this.onMouseDown.bind(this),
			false
		);
	}

	private onMouseDown(event: MouseEvent) {
		if (event.button === 0) {
			// Left click
			this.eventHandler.handleMouseLeftClick(event);
		} else if (event.button === 2) {
			// Right click
			this.eventHandler.handleMouseRightClick(event);
		}
	}
}
