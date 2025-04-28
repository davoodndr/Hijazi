import express from "express";
import { 
  addUser, 
  getUsers, 
  uploadAvatar
} from "../controllers/usersController.js";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";


const adminRouter = express.Router();


adminRouter.get('/get-users',authenticate, allowRoles(['admin']),getUsers);
adminRouter.post('/add-user',authenticate, allowRoles(['admin']),addUser);
adminRouter.post('/upload-avatar',/* authenticate, */ upload('avatar',5, 2), uploadAvatar);


export default adminRouter;