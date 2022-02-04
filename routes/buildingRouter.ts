import { Router } from 'express';
import userController from '../controllers/authController';
import buildingController from "../controllers/BuildingController";

const buildingRouter: Router = Router();

// For all users
/*buildingRouter
    .patch(
        '/:buildingId/:placeId',
        userController.protectRoute,
        buildingController.buildBuilding
    )
    .delete(
        '/:placeId',
        userController.protectRoute,
        buildingController.destroyBuilding
    );
    
*/
// For admins
buildingRouter
    .post(
        '/',
        userController.protectRoute,
        userController.restrictTo('admin'),
        buildingController.addBuilding
    );

export default buildingRouter;
