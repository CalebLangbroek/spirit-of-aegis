export class Utils {
	public static addCSSClassByID(id: string, CSSClassName: string) {
		document.getElementById(id).classList.add(CSSClassName);
	}

	public static removeCSSClassByID(id: string, CSSClassName: string) {
		document.getElementById(id).classList.remove(CSSClassName);
	}

	public static setInnerTextByID(id: string, innerText: string) {
		document.getElementById(id).innerText = innerText;
	}

	public static convertPosToSceneOffset(position: number, worldSize: number) {
		return position - Math.floor(worldSize / 2);
	}

	/**
	 * Get a random integer between the min and max.
	 *
	 * @param max The maximum for the random number (exclusive).
	 * @param min The minimum for the random number.
	 * @returns A random number.
	 */
	static getRandomInteger(max: number, min = 0): number {
		return Math.floor(Math.random() * (max - min) + min);
	}
}
