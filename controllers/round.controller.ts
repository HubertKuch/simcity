import RoundService from "../services/RoundService";

class RoundController extends RoundService{
    constructor(user: any) {
        super(user);
    }

    public async nextRound(): Promise<void> {
        this.moneySystem();
        this.energySystem();
        this.levelSystem();
        this.populationSystem();

        await this.saveUser();
    }

    public makeInfoObject(): any {
        return {
            money: this.getMoney(),
            level: this.user.level,
            exp: this.getExp(),
            earnings: this.getEarnings(),
            expenses: this.getExpenses(),
            producedEnergy: 2,
            usedEnergy: 2,
            buildings: this.user.building.length,
            people: this.countPeople(),
        };
    }
}

export default RoundController;
