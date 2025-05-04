import express from "express";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { single, upload } from "../middleware/multer.js";
import { uploadSingleImage } from "../controllers/commonController.js";
import { 
  addUser, 
  blockUser, 
  deleteUser, 
  getUsers, 
  unblockUser, 
  updateUser, 
  uploadAvatar
} from "../controllers/usersController.js";
import { addCategory, deleteCategory, getCategories, updateCategory, uploadCategoryImage } from "../controllers/categoryController.js";
import { addBrand, getBrands, uploadBrandLogo } from "../controllers/brandController.js";


const adminRouter = express.Router();

/* common */
adminRouter.post('/upload-single-image',authenticate, allowRoles(['admin']), single, uploadSingleImage);

/* users management */
adminRouter.get('/get-users',authenticate, allowRoles(['admin']), getUsers);
adminRouter.post('/add-user',authenticate, allowRoles(['admin']),addUser);
adminRouter.post('/upload-avatar',authenticate, allowRoles(['admin']), upload('avatar',5, 1), uploadAvatar);
adminRouter.patch('/update-user',authenticate, allowRoles(['admin']),updateUser);
adminRouter.patch('/block-user',authenticate, allowRoles(['admin']),blockUser);
adminRouter.patch('/unblock-user',authenticate, allowRoles(['admin']),unblockUser);
adminRouter.put('/delete-user',authenticate, allowRoles(['admin']),deleteUser);

/* category management */
adminRouter.get('/get-categories', authenticate, allowRoles(['admin']), getCategories)
adminRouter.post('/add-category', authenticate, allowRoles(['admin']), addCategory)
adminRouter.post('/upload-category-image',authenticate, allowRoles(['admin']), single, uploadCategoryImage);
adminRouter.patch('/update-category', authenticate, allowRoles(['admin']), updateCategory)
adminRouter.put('/delete-category', authenticate, allowRoles(['admin']), deleteCategory)

/* brand management */
adminRouter.get('/get-brands', /* authenticate, allowRoles(['admin']), */ getBrands)
adminRouter.post('/add-brand', authenticate, allowRoles(['admin']), addBrand)
adminRouter.post('/upload-brand-logo',authenticate, allowRoles(['admin']), single, uploadBrandLogo);

export default adminRouter;