import RoundService from "../services/RoundService";
import User from "../models/User";
import Info from "../models/Info";

class RoundController extends RoundService{
    constructor(user: User) {
        super(user);
    }

    public async nextRound(): Promise<void> {
        this.moneySystem();
        this.energySystem();
        this.levelSystem();
        this.populationSystem();
        this.questSystem();

        await this.saveUser();
    }

    public makeInfoObject(): Info {
        return {
            money: this.getMoney(),
            level: this.user.level,
            exp: this.getExp(),
            earnings: this.getEarnings(),
            expenses: this.getExpenses(),
            producedEnergy: this.getProducedEnergy(),
            usedEnergy: this.getUsedEnergy(),
            buildings: this.countBuildings(),
            people: this.countPeople(),
        };
    }
}

export default RoundController;
