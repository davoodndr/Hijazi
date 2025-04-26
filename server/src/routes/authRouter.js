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
	userLogin,
	verifyForgotPassOtp,
} from "../controllers/userAuthController.js";
import { authenticate, allowRoles }from "../middleware/authMiddleware.js";

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
authRouter.get("/logout", authenticate, allowRoles(["user"]), logoutUser);


export default authRouter;
