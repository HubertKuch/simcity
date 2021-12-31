import { Response, Request, NextFunction } from 'express';
import catchAsync from "../utils/catchAsync";
import User from "../models/user.schema";
import AppError from "../utils/appError";
import sendStatus from "../utils/sendStatus";

interface IReqUser extends Request {
    user: any
}

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    sendStatus(res, 'success', 200, 'ok', { users });
});

const cityInfo = catchAsync(async (req: IReqUser, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    const response = {
        money: user.money,
        exp: user.exp,
        level: user.level,
        buildings: user.building.length,
        expToNextLevel: 0,
        expenses: 0,
        earnings: 0,
        energyUsed: 0,
        producedEnergy: 0,
        people: 0,
    };

    user.building.forEach((building: any) => {
        // 1) get expenses
        response.expenses += (building.people * building.coinsPerPerson)

        // 2) Get required exp to next lvl
        // 3) Calculate earnings
        response.earnings += (building.coinsPerDay + (building.coinsPerPerson * building.people));

        // 4) Energy used
        response.energyUsed += (building.usedEnergy);

        // 5) Energy produced
        response.producedEnergy += (building.producedEnergy);

        // 6) Count people
        response.people += building.people;

    });

    res.locals.cityInfo = response;

    next();
})

export default {
    getAllUsers,
    cityInfo
};
