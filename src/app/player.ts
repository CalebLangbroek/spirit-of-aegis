import { Utils } from "./utils/utils";

export class Player {
	private money = 0;
	private health = 0;

	constructor() {}

	getHealth() {
		return this.health;
	}

	getMoney() {
		return this.money;
	}

	setHealth(newHealth: number) {
		this.health = newHealth;
		Utils.setInnerTextByID('health', newHealth.toString());
	}

	setMoney(newMoney: number) {
		this.money = newMoney;
		Utils.setInnerTextByID('money', newMoney.toString());
	}
}
