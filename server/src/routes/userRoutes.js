import express from 'express';
import { allowRoles, authenticate } from '../middleware/authMiddleware.js';
import { getCategories } from '../controllers/user/categoryController.js';
import { getBrands } from '../controllers/user/brandController.js';
import { getProduct, getProductList, getRelatedItems } from '../controllers/user/productController.js';
import { addToCart, getCart, removeFromCart } from '../controllers/user/cartController.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/user/wishlistController.js';
import { generatePaymentLink } from '../controllers/user/paymentController.js';

const userRouter = express.Router();

//userRouter.post('/upload-avatar',)

/* category management */
userRouter.get('/get-categories', getCategories)

/* brand management */
userRouter.get('/get-brands', getBrands)

/* product management */
userRouter.get('/get-single-product', getProduct)
userRouter.get('/get-product-list', getProductList)
userRouter.get('/get-related-items', getRelatedItems)

/* cart management */
userRouter.get('/get-cart', authenticate, allowRoles(['admin','user']), getCart);
userRouter.post('/add-to-cart', authenticate, allowRoles(['admin','user']), addToCart);
userRouter.patch('/remove-from-cart', authenticate, allowRoles(['admin','user']), removeFromCart);

/* wishlist management */
userRouter.get('/get-wishlist', authenticate, allowRoles(['admin','user']), getWishlist);
userRouter.post('/add-to-wishlist', authenticate, allowRoles(['admin','user']), addToWishlist);
userRouter.patch('/remove-from-wishlist', authenticate, allowRoles(['admin','user']), removeFromWishlist);

/* payment managment */
userRouter.post('/generate-razorpay-link', authenticate, allowRoles(['admin','user']), generatePaymentLink)
userRouter.get('/payment-success',(req,res) => res.status(200).json({success:true}))




export default userRouter;