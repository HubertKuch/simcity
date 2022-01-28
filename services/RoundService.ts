import Building from "../models/Building";
import User from "../models/User";

interface ExpEndpoint {
  min: number;
  max: number;
  expEndPoint: number;
}

class RoundService {
  private readonly lowLevelExpEndpoint: ExpEndpoint;
  private readonly mediumLevelExpEndpoint: ExpEndpoint;
  private readonly highLevelExpEndpoint: ExpEndpoint;
  private expEndpoints: Array<ExpEndpoint>;
  protected user: User;

  public constructor(user: User) {
    this.user = user;
    this.lowLevelExpEndpoint = { min: 1, max: 10, expEndPoint: 500 };
    this.mediumLevelExpEndpoint = { min: 10, max: 15, expEndPoint: 1000 };
    this.highLevelExpEndpoint = { min: 15, max: 20, expEndPoint: 2000 };
    this.expEndpoints = [
      this.lowLevelExpEndpoint,
      this.mediumLevelExpEndpoint,
      this.highLevelExpEndpoint,
    ];
  }

  // SYSTEMS
  public moneySystem(): void {
    const earnings: number = this.getEarnings();
    const expenses: number = this.getExpenses();

    this.addMoney(earnings);
    this.subtractMoney(expenses);
  }

  public levelSystem(): void {
    const needExp: number = this.requiredExpToNextLevel();

    this.setExp();

    if (this.isHaveExpToNextLevel(needExp)) {
      this.setLevel();
    }
  }

  public energySystem(): void {
    return;
  }

  public populationSystem(): void {
    for (let i = 0; i < this.user.building.length; i++) {
      const building: Building = this.user.building[i];

      if (!building) return;

      if (building.people >= building.forPeople) return;

      const newPeople: number = Math.floor(Math.random() * 3);

      if (newPeople + building.people < building.forPeople) {
        building.people += newPeople;
      }
    }
  }

  // UTILS
  protected requiredExpToNextLevel(): number {
    const userLevel: number = this.user.level;
    let requiredExp: number = 0;
    this.expEndpoints.forEach((expEndpoint: ExpEndpoint) => {
      if (userLevel >= expEndpoint.min && userLevel <= expEndpoint.max) {
        requiredExp = userLevel * expEndpoint.expEndPoint;
      }
    });

    return requiredExp;
  }

  protected isHaveExpToNextLevel(requiredExp: number): boolean {
    return this.user.exp >= requiredExp;
  }

  protected setExp(): void {
    this.user.building.forEach((building: Building) => {
      this.user.exp += building.expPerDay;
    });
  }

  protected setLevel(): void {
    this.user.level += 1;
  }

  protected static getUsedEnergy(building: Building): number {
    return building.people * 1.5;
  }

  protected setUsedEnergy(value: number): void {
    this.user.building.forEach((building: Building) => {
      building.usedEnergy = value;
    });
  }

  protected getEarnings(): number {
    let earnings: number = 0;

    this.user.building.forEach((building: Building) => {
      earnings += building.people * building.coinsPerPerson;
    });

    return earnings;
  }

  protected getExpenses(): number {
    let expenses: number = 0;

    this.user.building.forEach((building: Building) => {
      expenses += building.expensePerPerson * building.people;
    });

    return expenses;
  }

  protected addMoney(money: number): void {
    this.user.money += money;
  }

  protected subtractMoney(money: number): void {
    this.user.money -= money;
  }

  // INFO STUFF
  protected getMoney(): number {
    return this.user.money;
  }

  protected getExp(): number {
    return this.user.exp;
  }

  protected countBuildings(): number {
    return this.user.building.length ?? 0;
  }

  protected countPeople(): number {
    let people: number = 0;
    this.user.building.forEach((b: Building) => (people += b.people));

    return people;
  }

  public async saveUser(): Promise<void> {
    this.user.markModified('building');
    await this.user.save({ validateBeforeSave: false });
  }
}
export default RoundService;
