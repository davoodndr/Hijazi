
import express, { Router } from "express";
import { getUserDetail, registerUser, userLogin } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post('/register', registerUser)
authRouter.post('/login', userLogin)
authRouter.get('/get-user-detail', authMiddleware, getUserDetail)

export default authRouter;