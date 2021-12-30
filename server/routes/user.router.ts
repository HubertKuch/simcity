import { Router } from 'express';
import UserApi from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import roundController from '../controllers/round.controller';

const userRouter: Router  = Router();
    
userRouter
    .post('/signup', authController.signup)
    .post('/login', authController.login)
    .patch('/verifyEmail/:id/:token', authController.verifyEmail)
    .patch('/twoAuth/:id/:token', authController.twoFactorAuth)
    .patch('/nextRound', authController.protectRoute, roundController)
    .get('/cityInfo', authController.protectRoute, UserApi.cityInfo)

userRouter
    .get('/',
        authController.protectRoute,
        authController.restrictTo('admin'),
        UserApi.getAllUsers
    );

export default userRouter;
