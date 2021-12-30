import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import User from "../models/user.schema";

const mainPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const user = await User.find 

    res.render('main', { title: 'My city' });
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.render('login')
});

export default { mainPage, login };
