import express from "express";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { updateUserRole } from "../controllers/shared/userController.js";
import { addFund, getWallet } from "../controllers/shared/walletController.js";
import { createRazorpayOrder, generatePaymentLink, verifyRazorpay } from "../controllers/shared/paymentController.js";
import { cancelItem, cancelOrder, getOrder, getOrders } from "../controllers/shared/orderController.js";

const sharedRouter = express.Router();

/* handle user */
sharedRouter.patch('/update-user-role', authenticate, allowRoles(["user", "admin"]), updateUserRole);

/* handle order */
sharedRouter.get('/get-orders-list', authenticate, allowRoles(["user", "admin"]), getOrders)
sharedRouter.get('/get-order', authenticate, allowRoles(["user", "admin"]), getOrder)
sharedRouter.patch('/order/cancel-item', authenticate, allowRoles(["user", "admin"]), cancelItem)
sharedRouter.post('/orders/cancel-order', authenticate, allowRoles(["user", "admin"]), cancelOrder)

/* payment managment */
sharedRouter.post('/generate-razorpay-link', authenticate, allowRoles(["user", "admin"]), generatePaymentLink)
sharedRouter.post('/create-razorpay-order', authenticate, allowRoles(["user", "admin"]), createRazorpayOrder)
sharedRouter.post('/verify-razorpay-payment', authenticate, allowRoles(["user", "admin"]), verifyRazorpay)

/* handle wallet */
sharedRouter.get('/get-wallet', authenticate, allowRoles(["user", "admin"]), getWallet)
sharedRouter.post('/add-fund', authenticate, allowRoles(["user", "admin"]), addFund)

export default sharedRouter;