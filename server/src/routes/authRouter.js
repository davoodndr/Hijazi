import express from "express";
import {
	forgotPasswordOtp,
	getUserDetail,
	googleAuth,
	logoutUser,
	refreshAccessToken,
	registerUser,
	resendOtp,
	resetUserPassword,
	updateUserDetail,
	userLogin,
	verifyForgotPassOtp,
} from "../controllers/user/userController.js";
import { authenticate, allowRoles } from "../middleware/authMiddleware.js";
import { upload } from '../middleware/multer.js'

const authRouter = express.Router();

/* user auth */
authRouter.post("/register", registerUser);
authRouter.post("/login", userLogin);
authRouter.post("/google", googleAuth);
authRouter.get("/get-user-detail", authenticate, getUserDetail);
authRouter.post('/refresh-token', refreshAccessToken);
authRouter.post('/forgot-password-otp', forgotPasswordOtp);
authRouter.post('/resend-forgot-pass-otp', resendOtp);
authRouter.post('/verify-forgot-pass-otp', verifyForgotPassOtp);
authRouter.patch('/reset-password', resetUserPassword);
authRouter.patch('/update-user', authenticate, allowRoles(["user", "admin"]), upload, updateUserDetail);
authRouter.get("/logout", authenticate, allowRoles(["user"]), logoutUser);


export default authRouter;
