import express from "express";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { updateUserRole } from "../controllers/shared/userController.js";
import { addFund, getWallet, withdrawFund } from "../controllers/shared/walletController.js";
import { createRazorpayOrder, generatePaymentLink, verifyRazorpay } from "../controllers/shared/paymentController.js";
import { cancelItem, cancelOrder, getOrder, getOrders } from "../controllers/shared/orderController.js";
import { checkRatingEligiblity, getProductReviews } from "../controllers/shared/reviewController.js";
import { getCart } from "../controllers/shared/cartController.js";
import { getWishlist } from "../controllers/shared/wishlistController.js";

const sharedRouter = express.Router();

/* handle user */
sharedRouter.patch('/update-user-role', authenticate, allowRoles(["user", "admin"]), updateUserRole);

/* handle wishlist */
sharedRouter.get('/get-wishlist', authenticate, allowRoles(["user", "admin"]), getWishlist);

/* handle cart */
sharedRouter.get('/get-cart', authenticate, allowRoles(["user", "admin"]), getCart);

/* handle order */
sharedRouter.get('/get-orders-list', authenticate, allowRoles(["user", "admin"]), getOrders)
sharedRouter.get('/get-order', authenticate, allowRoles(["user", "admin"]), getOrder)
sharedRouter.patch('/order/cancel-item', authenticate, allowRoles(["user", "admin"]), cancelItem)
sharedRouter.post('/orders/cancel-order', authenticate, allowRoles(["user", "admin"]), cancelOrder)

/* handle payment */
sharedRouter.post('/generate-razorpay-link', authenticate, allowRoles(["user", "admin"]), generatePaymentLink)
sharedRouter.post('/create-razorpay-order', authenticate, allowRoles(["user", "admin"]), createRazorpayOrder)
sharedRouter.post('/verify-razorpay-payment', authenticate, allowRoles(["user", "admin"]), verifyRazorpay)

/* handle wallet */
sharedRouter.get('/get-wallet', authenticate, allowRoles(["user", "admin"]), getWallet)
sharedRouter.post('/add-fund', authenticate, allowRoles(["user", "admin"]), addFund)
sharedRouter.post('/withdraw-fund', authenticate, allowRoles(["user", "admin"]), withdrawFund)

/* handle reviews */
sharedRouter.get('/get-product-reviews', getProductReviews)
sharedRouter.get('/get-can-review', authenticate, allowRoles(["user", "admin"]), checkRatingEligiblity)

export default sharedRouter;