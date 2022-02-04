import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";

const mainPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.render('main', { 
        title: 'My city',
        user: res.locals.user,
        cityInfo: res.locals.cityInfo
    });
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => res.render('login'));
const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => res.render('signup'));

export default { mainPage, login, signUp };
