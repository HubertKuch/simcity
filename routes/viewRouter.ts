import { Router } from "express";
import viewsController from "../controllers/viewsController";
import authController from "../controllers/authController";

const viewRouter: Router = Router();

viewRouter
    .get('/', authController.isLoggedIn, viewsController.mainPage)
    .get('/login', viewsController.login)
    .get('/signup', viewsController.signUp)

export default viewRouter;
