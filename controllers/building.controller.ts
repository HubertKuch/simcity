import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import sendStatus from "../utils/sendStatus";
import catchAsync from "../utils/catchAsync";
import Building from "../models/building.schema";
import UserReq from "../utils/UserReq";

/* [ ADMIN ] */
const addBuilding = catchAsync(async (req: UserReq, res: Response, next: NextFunction) => {
   const { name, cost, costPerDay, coinsPerPerson, level, requiredLevel, forPeople, people, }: {
       name: string,
       cost: number,
       costPerDay: number,
       coinsPerPerson: number,
       level: number,
       requiredLevel: number,
       forPeople: number,
       people: number,
   } = req.body;

   const building = new Building({ name, cost, costPerDay, coinsPerPerson, level, requiredLevel, forPeople, people, });
    await building.save();
   res.status(200).json({ message: 'success', status: 'ok', statusCode: 200, data: { building }});
});

/* [ USER ] */
const buildBuilding = catchAsync(async (req: UserReq, res: Response, next: NextFunction) => {
    // 1) Get building id from req
    const { buildingId, placeId } = req.params;
    const building = await Building.findById(buildingId);

    if (!building) { 
        return next(new AppError('Dont be building with this id', 400));
    }

    // 2) Check is user have enough money
    const userMoney: number = (req.user.money) * 1;
    const userLevel: number = (req.user.level) * 1;

    if (userMoney < building.cost) {
        return next(new AppError('You don\'t have enough money', 400));
    }

    // 3) Check is user have minimum required level
    if (userLevel < building.requiredLevel) {
        return next(new AppError('Your level is to low.', 400));
    }

    // 4) Check is on this place was another building
    let checkPlace = { val: false };
    await req.user.building.forEach((building: any) => {
        if (parseInt(building.placeId) === parseInt(placeId)) {
            checkPlace.val = true;
        }
    });

    if(checkPlace.val) {
        return next(new AppError('You have building on this place!', 400));
    }

    // 5) Save building to user document and decrese user money
    building.placeId = placeId;
    req.user.building.push(building);
    req.user.money -= building.cost;
    await req.user.save({ validateBeforeSave: false });

    // 6) Send status
    return sendStatus(res, 'success', 200, 'ok', { building })
});

const destroyBuilding = catchAsync(async (req: UserReq, res: Response, next: NextFunction) => {
    const { placeId } = req.params;
    
    // 1) Get building by place id
    let buildingToDelete = { val: null };
    
    // 2) Remove building from user.building array
    await req.user.building.forEach((building: any, index: number) => {
        if (parseInt(building.placeId) === parseInt(placeId)) {
            buildingToDelete.val = building;
            req.user.building.splice(index, 1);
        }
    });


    // 2) Check is building exists
    if (!buildingToDelete.val) {
        return next(new AppError('Was not found building on this placeID', 400));
    }

    // 4) Add cost of building for user money 
    // @ts-ignore
    req.user.money += buildingToDelete.val.cost;

    // 5) Save user
    await req.user.save({ validateBeforeSave: false });
});

export default { buildBuilding, addBuilding, destroyBuilding };
