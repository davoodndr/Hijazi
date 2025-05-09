import express from "express";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";
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
import { addBrand, deleteBrand, getBrands, updateBrand, uploadBrandLogo } from "../controllers/brandController.js";
import { addProduct, getProducts, updateProduct, uploadProductImages } from "../controllers/productController.js";


const adminRouter = express.Router();

/* common */
adminRouter.post('/upload-upload-image',authenticate, allowRoles(['admin']), upload, uploadSingleImage);

/* users management */
adminRouter.get('/get-users',authenticate, allowRoles(['admin']), getUsers);
adminRouter.post('/add-user',authenticate, allowRoles(['admin']),addUser);
adminRouter.post('/upload-avatar',authenticate, allowRoles(['admin']), upload, uploadAvatar);
adminRouter.patch('/update-user',authenticate, allowRoles(['admin']),updateUser);
adminRouter.patch('/block-user',authenticate, allowRoles(['admin']),blockUser);
adminRouter.patch('/unblock-user',authenticate, allowRoles(['admin']),unblockUser);
adminRouter.put('/delete-user',authenticate, allowRoles(['admin']),deleteUser);

/* category management */
adminRouter.get('/get-categories', authenticate, allowRoles(['admin']), getCategories)
adminRouter.post('/add-category', authenticate, allowRoles(['admin']), addCategory)
adminRouter.post('/upload-category-image',authenticate, allowRoles(['admin']), upload, uploadCategoryImage);
adminRouter.patch('/update-category', authenticate, allowRoles(['admin']), updateCategory)
adminRouter.put('/delete-category', authenticate, allowRoles(['admin']), deleteCategory)

/* brand management */
adminRouter.get('/get-brands', authenticate, allowRoles(['admin']), getBrands)
adminRouter.post('/add-brand', authenticate, allowRoles(['admin']), addBrand)
adminRouter.post('/upload-brand-logo',authenticate, allowRoles(['admin']), upload, uploadBrandLogo);
adminRouter.patch('/update-brand', authenticate, allowRoles(['admin']), updateBrand)
adminRouter.put('/delete-brand', authenticate, allowRoles(['admin']), deleteBrand)

/* product management */
adminRouter.get('/get-products', authenticate, allowRoles(['admin']), getProducts)
adminRouter.post('/add-product', authenticate, allowRoles(['admin']), addProduct)
adminRouter.post('/upload-product-images',authenticate, allowRoles(['admin']), upload, uploadProductImages);
adminRouter.patch('/update-product', authenticate, allowRoles(['admin']), updateProduct)

export default adminRouter;