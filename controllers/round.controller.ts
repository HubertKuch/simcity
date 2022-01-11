import { Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import UserReq from "../utils/UserReq";

interface ExpEndpoint {
    min: number,
    max: number,
    expEndPoint: number,
}

abstract class RoundController {
    constructor(req: UserReq){};

    public abstract moneySystem(): void;
    public abstract levelSystem(): void;
    public abstract energySystem(): void;
    public abstract populationSystem(): void;

    protected abstract isHaveExpToNextLevel(requiredExp: number): boolean;
    protected abstract requiredExpToNextLevel(): number;
    protected abstract setExp(): void;
    protected abstract setLevel(): void;

    protected abstract getUsedEnergy(building: any): number;
    protected abstract setUsedEnergy(value: number): void;
 
    protected abstract getEarnings(): number;
    protected abstract getExpenses(): number;
    protected abstract addMoney(money: number): void;
    protected abstract subtractMoney(money: number): void;
 
    protected abstract setBuildingsPopulation(): void;
 
    protected abstract saveUser(): Promise<void>;
}

class RoundControllerImpl extends RoundController {
    private lowLevelExpEndpoint: ExpEndpoint;
    private mediumLevelExpEndpoint: ExpEndpoint
    private highLevelExpEndpoint: ExpEndpoint;
    private expEndopints: Array<ExpEndpoint>;
    private req: UserReq;
    private user: any;

    public constructor(req: UserReq) {
        super(req);
        this.req = req;
        this.user = this.req.user;
        this.lowLevelExpEndpoint = { min: 1, max: 10, expEndPoint: 500 }; 
        this.mediumLevelExpEndpoint = { min: 10, max: 15, expEndPoint: 1000 }; 
        this.highLevelExpEndpoint = { min: 15, max: 20, expEndPoint: 2000 }; 
        this.expEndopints = [this.lowLevelExpEndpoint, this.mediumLevelExpEndpoint, this.highLevelExpEndpoint];
    }

    public moneySystem(): void {
        const earnings: number = this.getEarnings();
        const expenses: number = this.getExpenses();
        console.log(expenses, earnings);
        
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
        this.setBuildingsPopulation();
    }

    protected requiredExpToNextLevel(): number {
        const userLevel: number = this.user.level;
        let requiredExp: number = 0;
        this.expEndopints.forEach(expEndpoint => {
            if (userLevel >= expEndpoint.min && userLevel <= expEndpoint.max) {
                requiredExp = userLevel * expEndpoint.expEndPoint;
            }
        })
    
        return requiredExp;
    };

    protected isHaveExpToNextLevel(requiredExp: number): boolean {
        if (this.user.exp >= requiredExp) 
            return true;
        return false;
    };
    
    protected setExp(): void {
        this.user.building.forEach((building: any) => {
            this.user.exp += building.expPerDay;
        })
    }

    protected setLevel(): void {
        this.user.level += 1;
    };
    

    protected getUsedEnergy(building: any): number {
        return building.peole * 1.5;
    };

    protected setUsedEnergy(value: number): void {
        this.user.building.forEach((building: any) => {
            building.usedEnergy = value;
        });
    }


    protected getEarnings(): number {
        let earnings: number = 0;

        this.user.building.forEach((building: any) => {
            earnings += building.coinsPerPerson * building.people;
        })

        return earnings;
    };

    protected getExpenses(): number {
        let expenses: number = 0;

        this.user.building.forEach((building: any) => {
            expenses += building.expensePerPerson * building.people;
        })

        return expenses;
    };

    protected addMoney(money: number): void {
        this.user.money += money;
    }

    protected subtractMoney(money: number): void {
        this.user.money -= money;
    }


    protected setBuildingsPopulation(): void {
        this.user.building.forEach((building: any) => {
            if (building === {})
                return;

            if (building.people === building.forPeople) 
                return;
            
            const newPeople: number = Math.floor(Math.random() * 3);

            const isMoveIn: boolean = Math.random() > .5;
            if (isMoveIn && (building.people + newPeople) > building.forPeople)
                building.people += (building.forPeople - building.people)
        });
    }

    public async saveUser(): Promise<void> {
        console.log("SAVE");
        
        await this.user.save({ validateBeforeSave: false });
    }
}

const nextRoundController = catchAsync(async (req: UserReq, res: Response, next: NextFunction): Promise<void> => {
    const roundController: RoundControllerImpl = new RoundControllerImpl(req)

    roundController.levelSystem();
    roundController.moneySystem();
    roundController.energySystem();
    roundController.populationSystem();

    await roundController.saveUser();
});

export default nextRoundController;
