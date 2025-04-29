import express from "express";
import { 
  addUser, 
  blockUser, 
  getUsers, 
  unblockUser, 
  updateUser, 
  uploadAvatar
} from "../controllers/usersController.js";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";


const adminRouter = express.Router();


adminRouter.get('/get-users',authenticate, allowRoles(['admin']), getUsers);
adminRouter.post('/add-user',authenticate, allowRoles(['admin']),addUser);
adminRouter.post('/upload-avatar',authenticate, allowRoles(['admin']), upload('avatar',5, 1), uploadAvatar);
adminRouter.patch('/update-user',authenticate, allowRoles(['admin']),updateUser);
adminRouter.patch('/block-user',authenticate, allowRoles(['admin']),blockUser);
adminRouter.patch('/unblock-user',authenticate, allowRoles(['admin']),unblockUser);


export default adminRouter;