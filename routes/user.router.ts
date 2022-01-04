import { Router } from 'express';
import UserApi from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import roundController from '../controllers/round.controller';

const userRouter: Router  = Router();
    
// ROUTER FOR ALL USERS
userRouter
    .get('/cityInfo', authController.protectRoute, UserApi.cityInfo)
    .get('/logout', authController.logout)
    .post('/signup', authController.signup)
    .post('/login', authController.login)
    .patch('/verifyEmail/:id/:token', authController.verifyEmail)
    .patch('/twoAuth/:id/:token', authController.twoFactorAuth)
    .patch('/nextRound', authController.protectRoute, roundController);

// ROUTER FOR ADMINS
userRouter
    .get('/',
        authController.protectRoute,
        authController.restrictTo('admin'),
        UserApi.getAllUsers
    );

export default userRouter;
