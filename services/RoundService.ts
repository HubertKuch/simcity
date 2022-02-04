import Building from "../models/Building";
import User from "../models/User";
import Quest from "../models/Quest";
import Task from "../models/Task";

interface ExpEndpoint {
  min: number;
  max: number;
  expEndPoint: number;
}

class RoundService {
  private readonly lowLevelExpEndpoint: ExpEndpoint;
  private readonly mediumLevelExpEndpoint: ExpEndpoint;
  private readonly highLevelExpEndpoint: ExpEndpoint;
  private readonly expEndpoints: Array<ExpEndpoint>;
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

  // QUESTS
  public getCompletedQuest(): Array<Quest> {
    let completed: Array<Quest> = [];
    const allQuests: Array<Quest> = this.user.quests;

    for (const quest of allQuests) {
      if (!quest.requirement) {
        continue;
      }

      const task: Task = JSON.parse(quest.requirement);

      const isLevelProp: boolean = task.hasOwnProperty('level');
      const isBuildingProp: boolean = task.hasOwnProperty('building');
      const isMoneyProp: boolean = task.hasOwnProperty('money');

      if (isBuildingProp) {
        const nestedTask: any = task.building;

        if (nestedTask.hasOwnProperty('have')) {
           if (this.user.building.length >= nestedTask.have) {
             completed.push(quest);
           }
        }
      } else if (isMoneyProp){
        const nestedTask: any = task.money;

        if (nestedTask.hasOwnProperty('have')) {
          if (this.user.money >= nestedTask.have) {
            completed.push(quest);
          }
        }
      } else if (isLevelProp) {}
    }

    return completed;
  }

  public questSystem(): void {
    const completedQuests: Array<Quest> = this.getCompletedQuest();
    const quests: Array<Quest> = this.user.quests;

    for (const quest of quests) {
      for (const completedQuest of completedQuests) {
        if (completedQuest.name === quest.name) {
          quest.isComplete = true;
        }
      }
    }
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
      this.user.exp -= needExp;
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

  protected getUsedEnergy(): number {
    const usedEnergy: number = 0;

    for (const building of this.user.building) {
      building.usedEnergy += usedEnergy;
    }

    return usedEnergy;
  }

  protected getProducedEnergy(): number {
    const producedEnergy: number = 0;

    for (const building of this.user.building) {
      building.producedEnergy += producedEnergy;
    }

    return producedEnergy;
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
    this.user.markModified('quests');
    await this.user.save({ validateBeforeSave: false });
  }
}
export default RoundService;
