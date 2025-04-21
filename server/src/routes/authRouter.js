
import express, { Router } from "express";
import { registerUser } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/register', registerUser)

export default authRouter;