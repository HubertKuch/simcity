import { Response, NextFunction } from "express";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import Building from "../models/BuildingModel";
import UserReq from "../utils/UserReq";
import User from "../models/User";
import { tilemap } from "../map/tilemap";

/* [ ADMIN ] */
const addBuilding = catchAsync(async (req: UserReq, res: Response, next: NextFunction) => {
   const { name, cost, costPerDay, coinsPerPerson, level, requiredLevel, forPeople, people, img }: {
       name: string,
       cost: number,
       costPerDay: number,
       coinsPerPerson: number,
       level: number,
       requiredLevel: number,
       forPeople: number,
       people: number,
       img: string,
   } = req.body;

   const building = new Building({ name, cost, costPerDay, coinsPerPerson, level, requiredLevel, forPeople, people, img });

    await building.save();
   res.status(200).json({ message: 'success', status: 'ok', statusCode: 200, data: { building }});
});

/* [ USER ] */
export class BuildingController{
    private user: User;

    constructor(user: User) {
        this.user = user;
    }

    public isHaveEnoughMoney(cost: number): boolean {
        return this.user.money >= cost;
    }

    public isHaveRequiredLevel(needLevel: number): boolean {
        return this.user.level >= needLevel;
    }

    public async buildBuilding(id: string, placeId: number): Promise<void> {
        if (!id || !placeId) {
            return;
        }

        // 1) Get building by id
        const building = await Building.findById(id);

        // 2) Check is user have enough money
        const isHaveMoney: boolean= this.isHaveEnoughMoney(building.cost);
        const isHaveRequiredLevel: boolean = this.isHaveRequiredLevel(building.requiredLevel);

        if (!isHaveMoney) {
            return;
        }

        // 3) Check is user have minimum required level
        if (!isHaveRequiredLevel) {
            return;
        }

        // 4) Check is on this place was another building
        let isBusy: boolean = false;
        await this.user.building.forEach((building: any) => {
            if (building.placeId == `${placeId}`) {
                isBusy = true;
            }
        });

        if(isBusy) {
            return;
        }
        // 5) Check there is no water on site
        const x: number = Math.floor(placeId / tilemap[0].length);
        const y: number = Math.floor(placeId % tilemap[0].length);

        if (tilemap[x][y+1] === 0) {
            return;
        }


        building.placeId = placeId;
        let preparedBuilding = JSON.parse(JSON.stringify(building));
        delete preparedBuilding._id;
        delete preparedBuilding.__v;

        this.user.building.push(preparedBuilding);
        this.user.money -= preparedBuilding.cost;

        await this.user.save({ validateBeforeSave: false });
    }
}

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

export default { BuildingController, addBuilding };
