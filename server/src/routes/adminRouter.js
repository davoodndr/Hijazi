import express from "express";
import { 
  addUser, 
  getUsers 
} from "../controllers/usersController.js";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";


const adminRouter = express.Router();


adminRouter.get('/get-users',authenticate, allowRoles(['admin']),getUsers);
adminRouter.post('/add-user',authenticate, allowRoles(['admin']),addUser);


export default adminRouter;