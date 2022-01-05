import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import IReqUser from "../utils/IReqUser";

/**
 * TAXES
 * LOW INCOMES
 * NEIGHBORS
 */

const roundController = catchAsync(async (req: IReqUser, res: Response, next: NextFunction) => {
    let user = req.user;
    const userCopy = Object.assign({}, user);

    interface IExpEndpoint {
        min: number,
        max: number,
        expEndPoint: number,
    }

    const lowLevelExpEndpoint: IExpEndpoint = { min: 1, max: 10, expEndPoint: 500 }; 
    const mediumLevelExpEndpoint: IExpEndpoint = { min: 10, max: 15, expEndPoint: 1000 }; 
    const highLevelExpEndpoint: IExpEndpoint = { min: 15, max: 20, expEndPoint: 2000 }; 
    const expEndopints: Array<IExpEndpoint> = [lowLevelExpEndpoint, mediumLevelExpEndpoint, highLevelExpEndpoint];

    let userLevel: number = user.level;
    let userBuildings: Array<any> = user.building;
    let needExpToNextLevel: number = 0;

    // 1) experience and level
    // incresse user experience
    userBuildings.forEach(building => {
        user.exp += building.expPerDay;
    });

    // incresse user level
    expEndopints.forEach(endpoint => {
        if (userLevel >= endpoint.min && userLevel < endpoint.max && userLevel < 20) {
            needExpToNextLevel = endpoint.expEndPoint * userLevel;
        }
    });

    if (user.exp >= needExpToNextLevel) {
        user.exp -= needExpToNextLevel;
        user.level += 1;
    }
    
    // 2) Energy, expenses, earnings, population
    userBuildings.forEach((buildingEl, index) => {
        const building = Object.assign({}, buildingEl);
        // energy
        if (building.people > 0) {
            building.usedEnergy = building.people * 1.5;
        }

        // expenses
        user.money -= building.expensePerPerson * building.people;

        // earnings
        user.money += building.coinsPerPerson * building.people;

        // population
        if (Math.random() > 0.5) {
            if(building.people < building.forPeople) {
                const newPeople = Math.floor(Math.random() * 2);
                if ((newPeople + building.people) < building.forPeople) {
                    building.people += newPeople;
                }
            }
        }
        
        req.user.building[index] = building;        
    })

    if (user !== userCopy) {
        console.log('save');        
        await user.save({ validateBeforeSave: false });
    }
    return res.status(200)
});

export default roundController;
