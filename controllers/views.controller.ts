import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";

const mainPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log(res.locals.cityInfo);
    
    res.render('main', { 
        title: 'My city',
        user: res.locals.user,
        cityInfo: res.locals.cityInfo
    });
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.render('login')
});

export default { mainPage, login };
