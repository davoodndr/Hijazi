import express from "express";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { productUpload, upload } from "../middleware/multer.js";
import { uploadSingleImage } from "../controllers/admin/commonController.js";
import { 
  addUser, 
  blockUser, 
  deleteUser, 
  getUsers, 
  unblockUser, 
  updateUser, 
  uploadAvatar
} from "../controllers/admin/usersController.js";
import { addCategory, deleteCategory, getCategories, updateCategory, uploadCategoryImage } from "../controllers/admin/categoryController.js";
import { addBrand, deleteBrand, getBrands, updateBrand, uploadBrandLogo } from "../controllers/admin/brandController.js";
import { addProduct, changeProductStatus, getProducts, updateProduct, uploadProductImages } from "../controllers/admin/productController.js";


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
adminRouter.post('/upload-product-images',authenticate, allowRoles(['admin']), productUpload, uploadProductImages);
adminRouter.patch('/update-product', authenticate, allowRoles(['admin']), updateProduct)
adminRouter.patch('/change-product-status', authenticate, allowRoles(['admin']), changeProductStatus)

export default adminRouter;