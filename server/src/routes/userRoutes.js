import express from 'express';
import { getProductList } from '../controllers/user/productController.js';
import { allowRoles, authenticate } from '../middleware/authMiddleware.js';
import { getCategories } from '../controllers/user/categoryController.js';

const userRouter = express.Router();

//userRouter.post('/upload-avatar',)

/* category management */
userRouter.get('/get-categories', authenticate, allowRoles(['admin','user']), getCategories)

/* product management */
userRouter.get('/get-product-list', authenticate, allowRoles(['admin','user']), getProductList)
/* adminRouter.post('/add-product', authenticate, allowRoles(['admin']), addProduct)
adminRouter.post('/upload-product-images',authenticate, allowRoles(['admin']), productUpload, uploadProductImages);
adminRouter.patch('/update-product', authenticate, allowRoles(['admin']), updateProduct)
adminRouter.patch('/change-product-status', authenticate, allowRoles(['admin']), changeProductStatus)
 */









export default userRouter;