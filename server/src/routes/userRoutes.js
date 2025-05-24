import express from 'express';
import { getProductList } from '../controllers/user/productController.js';
import { allowRoles, authenticate } from '../middleware/authMiddleware.js';
import { getCategories } from '../controllers/user/categoryController.js';
import { getBrands } from '../controllers/user/brandController.js';

const userRouter = express.Router();

//userRouter.post('/upload-avatar',)

/* category management */
userRouter.get('/get-categories', authenticate, allowRoles(['admin','user']), getCategories)

/* brand management */
userRouter.get('/get-brands', authenticate, allowRoles(['admin']), getBrands)

/* product management */
userRouter.get('/get-product-list', authenticate, allowRoles(['admin','user']), getProductList)









export default userRouter;