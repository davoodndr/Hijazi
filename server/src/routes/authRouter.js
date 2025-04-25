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
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", userLogin);
authRouter.post("/google", googleAuth);
authRouter.get("/get-user-detail", authMiddleware, getUserDetail);
authRouter.get("/logout", authMiddleware, logoutUser);
authRouter.post('/refresh-token', refreshAccessToken);
authRouter.post('/forgot-password-otp', forgotPasswordOtp);
authRouter.post('/resend-forgot-pass-otp', resendOtp);
authRouter.post('/verify-forgot-pass-otp', verifyForgotPassOtp);
authRouter.patch('/reset-password', resetUserPassword);

export default authRouter;
