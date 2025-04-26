import express from "express";
import { getUsers } from "../controllers/usersController.js";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";


const adminRouter = express.Router();


adminRouter.get('/get-users',authenticate, allowRoles(['admin']),getUsers);


export default adminRouter;