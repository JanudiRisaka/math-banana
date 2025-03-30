import express from "express";
import {
	signup,
	signin,
	logout,
	sendVerifyOtp,
	verifyEmail,
	isAuthenticated,
	sendResetOtp,
	resetPassword,
} from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.post("/logout", logout);
authRoutes.post("/send-verify-otp", sendVerifyOtp);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.get("/is-auth", userAuth, isAuthenticated);
authRoutes.post("/send-reset-otp", sendResetOtp);
authRoutes.post("/reset-password", resetPassword);

export default authRoutes;
