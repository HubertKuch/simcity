import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import User from "../models/user.schema";

interface IReqUser extends Request {
    user: any,
}

const roundController = catchAsync(async (req: IReqUser, res: Response, next: NextFunction) => {
    const lowLevelExpEndpoint: number = 500; // level 1 - 10
    const highLevelExpEndpoint: number = 1000; // level 10 - 15
    const advanceLevelExpEndpoint: number = 2000; // level 15 - 20
    // 20 is max level

    let user = req.user;
    const userBuildings: Array<object> = req.user.building;
    const userExp: number = req.user.exp;
    const userLevel: number = req.user.level;
    let needExp: number = userExp;

    const incresseLevel = (level: number, needExp: number, haveExp: number): void => {
        if (needExp <= haveExp) {
            level+=1;
            haveExp -= needExp;
        }
    };
    // check user exp
    if (userLevel <= 10) {
        incresseLevel(user.level, (userLevel * lowLevelExpEndpoint), user.exp);
    } else if (userLevel >= 10 && userLevel <= 15) {
        incresseLevel(user.level, (userLevel * highLevelExpEndpoint), user.exp);
    } else if (userLevel >= 15 && userLevel <= 20) {
        incresseLevel(user.level, (userLevel * advanceLevelExpEndpoint), user.exp);
    } else if (userLevel === 20) {
        return;
    }
    user.exp -= 500;
    console.log(user);
    
    // await user.save();
});

export default roundController;
