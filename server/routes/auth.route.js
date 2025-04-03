// This file defines authentication-related routes such as signup, signin, OTP verification, and logout.
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

// User registration
authRoutes.post("/signup", signup);

// User login
authRoutes.post("/signin", signin);

// User logout
authRoutes.post("/logout", userAuth, logout);

// Send OTP for email verification
authRoutes.post("/send-verify-otp", sendVerifyOtp);

// Verify email with OTP
authRoutes.post("/verify-email", verifyEmail);

// Check if user is authenticated (protected route)
authRoutes.get("/is-auth", userAuth, isAuthenticated);

// Send OTP for password reset
authRoutes.post("/send-reset-otp", sendResetOtp);

// Reset password using OTP
authRoutes.post("/reset-password", resetPassword);

export default authRoutes;
