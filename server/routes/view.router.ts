import { Router } from "express";
import viewsController from "../controllers/views.controller";
import authController from "../controllers/auth.controller";

const viewRouter: Router = Router();

viewRouter
    .get('/', viewsController.mainPage)
    .get('/login', viewsController.login)

export default viewRouter;
