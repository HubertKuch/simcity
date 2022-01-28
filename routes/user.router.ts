import { Router } from 'express';
import authController from "../controllers/auth.controller";

const userRouter: Router  = Router();
    
// ROUTER FOR ALL USERS
userRouter
    .get('/logout', authController.logout)
    .post('/signup', authController.signup)
    .post('/login', authController.login)
    .patch('/verifyEmail/:id/:token', authController.verifyEmail)
    .patch('/twoAuth/:id/:token', authController.twoFactorAuth);


export default userRouter;
