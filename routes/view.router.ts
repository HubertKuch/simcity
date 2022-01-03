import { Router } from "express";
import viewsController from "../controllers/views.controller";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";

const viewRouter: Router = Router();

viewRouter
    .get('/', authController.isLoggedIn, userController.cityInfo, viewsController.mainPage)
    .get('/login', viewsController.login)
    .get('/signup', viewsController.signUp)

export default viewRouter;
