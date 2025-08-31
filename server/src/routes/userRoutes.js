import express from 'express';
import { allowRoles, authenticate } from '../middleware/authMiddleware.js';
import { getCategories } from '../controllers/user/categoryController.js';
import { getBrands } from '../controllers/user/brandController.js';
import { getProduct, getProductList, getRelatedItems } from '../controllers/user/productController.js';
import { addToCart, emptyCart, getCart, removeFromCart } from '../controllers/user/cartController.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/user/wishlistController.js';
import { createRazorpayOrder, generatePaymentLink, verifyRazorpay } from '../controllers/user/paymentController.js';
import { addNewAddress, getAddressList, makeAddressDefault } from '../controllers/user/addressController.js';
import { cancelOrder, getOrder, getOrders, placeOrder } from '../controllers/user/orderController.js';
import { getOffers } from '../controllers/user/offerController.js';

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
userRouter.get('/get-cart', authenticate, allowRoles(['user']), getCart);
userRouter.post('/add-to-cart', authenticate, allowRoles(['user']), addToCart);
userRouter.patch('/remove-from-cart', authenticate, allowRoles(['user']), removeFromCart);
/* not used this till yet */
userRouter.put('/clear-cart', authenticate, allowRoles(['user']), emptyCart);

/* wishlist management */
userRouter.get('/get-wishlist', authenticate, allowRoles(['user']), getWishlist);
userRouter.post('/add-to-wishlist', authenticate, allowRoles(['user']), addToWishlist);
userRouter.patch('/remove-from-wishlist', authenticate, allowRoles(['user']), removeFromWishlist);

/* payment managment */
userRouter.post('/generate-razorpay-link', authenticate, allowRoles(['user']), generatePaymentLink)
userRouter.post('/create-razorpay-order', authenticate, allowRoles(['user']), createRazorpayOrder)
userRouter.post('/verify-razorpay-payment', authenticate, allowRoles(['user']), verifyRazorpay)

/* address management */
userRouter.get('/get-address-list', authenticate, allowRoles(['user']), getAddressList)
userRouter.post('/add-new-address', authenticate, allowRoles(['user']), addNewAddress)
userRouter.patch('/make-address-default', authenticate, allowRoles(['user']), makeAddressDefault)

/* order management */
userRouter.get('/get-orders-list', authenticate, allowRoles(['user']), getOrders)
userRouter.get('/get-order', authenticate, allowRoles(['user']), getOrder)
userRouter.post('/place-order', authenticate, allowRoles(['user']), placeOrder)
userRouter.post('/cancel-order', authenticate, allowRoles(['user']), cancelOrder)

/* coupon management */
userRouter.get('/get-offers-list',getOffers)

export default userRouter;