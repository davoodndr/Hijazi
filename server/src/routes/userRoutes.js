import express, { Router } from "express";
import {
	forgotPasswordOtp,
	getUserDetail,
	googleAuth,
	logoutUser,
	refreshAccessToken,
	registerUser,
	resendOtp,
	resetUserPassword,
	userLogin,
	verifyForgotPassOtp,
} from "../controllers/userAuthController.js";
import { authenticate, allowRoles }from "../middleware/authMiddleware.js";

const userRouter = express.Router();

/* user auth */
userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);
userRouter.post("/google", googleAuth);
userRouter.get("/get-user-detail", authenticate, getUserDetail);
userRouter.post('/refresh-token', refreshAccessToken);
userRouter.post('/forgot-password-otp', forgotPasswordOtp);
userRouter.post('/resend-forgot-pass-otp', resendOtp);
userRouter.post('/verify-forgot-pass-otp', verifyForgotPassOtp);
userRouter.patch('/reset-password', resetUserPassword);
userRouter.get("/logout", authenticate, allowRoles(["user"]), logoutUser);


export default userRouter;
