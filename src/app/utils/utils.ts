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
}
