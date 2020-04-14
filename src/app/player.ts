import { Utils } from './utils/utils';

export class Player {
	private money: number;
	private health: number;

	constructor(health: number = 0, money: number = 0) {
		this.setHealth(health);
		this.setMoney(money);
	}

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
