import express from "express";
import { allowRoles, authenticate } from "../middleware/authMiddleware.js";
import { updateUserRole } from "../controllers/shared/userController.js";
import { addFund, getWallet } from "../controllers/shared/walletController.js";

const sharedRouter = express.Router();

/* handle user */
sharedRouter.patch('/update-user-role', authenticate, allowRoles(["user", "admin"]), updateUserRole);

/* handle wallet */
sharedRouter.get('/get-wallet', authenticate, allowRoles(["user", "admin"]), getWallet)
sharedRouter.post('/add-fund', authenticate, allowRoles(["user", "admin"]), addFund)

export default sharedRouter;