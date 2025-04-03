// controllers/auth.controller.js
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcryptjs from "bcryptjs";
import transporter from '../config/nodemailer.js'
import { error } from 'console';
import userModel from '../models/user.model.js';

dotenv.config();

// User Registration (signup)
export const signup = async (req, res) => {

	const { username, email, password, confirmPassword } = req.body;

	if (!username || !email || !password || !confirmPassword){
		return res.json({
			success: false,
			message: 'All the fields required'
		})
	}

	// Check if passwords match after trimming
	if (password !== confirmPassword) {
		return res.status(400).json({
		  success: false,
		  message: "Passwords do not match",
		  field: "confirmPassword"
		});
	}

	// Validate username length
	if (username.length < 3) {
		return res.status(400).json({
		  success: false,
		  message: "Username must be at least 3 characters"
		});
	}

	try {
	// Check for existing user
	const existingUser = await User.findOne({email});

	if (existingUser) {
		return res.json({
			success: false,
			message: "User already exists"
		  });
	}

	const hashedPassword = await bcryptjs.hash(password, 10);

	const user = new User({
		username: username,
		email: email,
		password: hashedPassword
	});

	await user.save();
	res.status(201).json({
		success: true,
		message: 'Registration successful. Please verify your email.',
		email: user.email
	  });

	} catch (error) {
		return res.json({ success: false, message: error.message });

	}
};

export const signin = async (req, res) => {

	const { email, password } = req.body;

	if (!email || !password){
		return res.json({
			success: false,
			message: 'Email and password are required'
		})
	}

	try {

		const user = await User.findOne({email});

		if (!user) {
			return res.json({
				success: false,
				message: "Invalid email"
			});
		}

		const isPasswordMatch = await bcryptjs.compare(password, user.password);

		if (!isPasswordMatch) {
			return res.json({ success: false, message: "Invalid password" });
		}

	// Generate token
	const token = jwt.sign(
		{ userId: user._id },
		process.env.JWT_SECRET,
		{ expiresIn: '7h' }
	);

	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
		maxAge: 7 * 24 * 60 * 60 * 1000
	});

		res.json({success: true});

	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie('token' ,  {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
		});

		return res.json({ success: true, message: "Logged out successfully" });

	} catch {
		return res.json({ success: false, message: error.message });
	}
};

//send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
	try {
		const { email } = req.body; // Get email from request body

		const user = await User.findOne({ email });

		if (!user) {
		  return res.status(404).json({
			success: false,
			message: "User not found"
		  });
		}

		if (user.isAccountVerified) {
		  return res.json({
			success: false,
			message: "Account already verified"
		  });
		}

		const otp = String(Math.floor(100000 + Math.random() * 900000));

		user.verifyOtp = otp;
		user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000; // 3 minutes

		await user.save();

		const mailOption = {
			from: process.env.SENDER_EMAIL,
			to: user.email,
			subject: 'Account Verification OTP',
			text: `Your OTP is ${otp}. Verify your account using this OTP. (valid for 3 minutes)`
		}

		await transporter.sendMail(mailOption);

		return res.json({ success: true, message: "OTP sent to your email" });

	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
}

export const verifyEmail = async (req, res) => {
	const { email, otp } = req.body;

	if(!email || !otp){
		return res.json({ success: false, message: 'Missing Details'});
	}

	try {
		const user = await User.findOne({ email });

		if(!user) {
			return res.json({ success: false, message: 'Missing User not found'});
		}

		if(user.verifyOtp === '' || user.verifyOtp !== otp) {
			return res.json({ success: false, message: 'Invalid OTP'});
		}

		if(user.verifyOtpExpireAt < Date.now()) {
			return res.json({ success: false, message: 'OTP expired'});
		}

		user.isAccountVerified = true;
		user.verifyOtp = '';
		user.verifyOtpExpireAt = 0;

		await user.save();

		// Generate token after verification
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '7h' }
		);

		// Set cookie
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

    	// Send welcome email
    	const welcomeMail = {
			from: process.env.SENDER_EMAIL,
			to: user.email,
			subject: 'Welcome to Math Banana!',
			text: `Welcome ${user.username}! Your account has been successfully verified.`
	  	};
	  	await transporter.sendMail(welcomeMail);

		res.json({
			success: true,
			message: "Email verified successfully",
			user: {
			  id: user._id,
			  username: user.username,
			  email: user.email
			}
		});

	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
}

// Add proper authentication check
export const isAuthenticated = async (req, res) => {
	try {
	  // The userAuth middleware already verified the token
	  // Return user status with basic info
	  res.json({
		success: true,
		user: req.user // From userAuth middleware
	  });
	} catch (error) {
	  res.status(500).json({
		success: false,
		message: error.message
	  });
	}
  }

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
	const {email} = req.body;

	if(!email) {
		return res.json({success:false, message: 'Email is required'})
	}

	try {
		const user = await User.findOne({email});

		if(!user) {
			return res.json({success:false, message: 'User not found'})
		}

		const otp = String(Math.floor(100000 + Math.random() * 900000));

		user.resetOtp = otp;
		user.resetOtpExpiredAt = Date.now() + 5 * 60 * 1000;

		await user.save();

		const mailOption = {
			from: process.env.SENDER_EMAIL,
			to: user.email,
			subject: 'Password Reset OTP',
			text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
		}

		await transporter.sendMail(mailOption);

		return res.json({success: true, message: 'OTP sent to your email'})

	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
}

//Reset User Password
export const resetPassword = async (req, res) => {
	const {email, otp, newPassword} = req.body;

	if(!email || !otp || !newPassword) {
		return res.json({ success: false, message: 'Email, OTP, and new password are required' });
	}

	try {
		const user = await User.findOne({email});

		if(!user) {
			return res.json({ success: false, message: 'User not found' });
		}

		if (user.resetOtp === "" || user.resetOtp !== otp) {
			return res.json({ success: false, message: 'Invalid OTP' });
		}

		if (user.resetOtpExpiredAt < Date.now()) {
			return res.json({ success: false, message: 'OTP expired' });
		}

		const hashedPassword = await bcryptjs.hash(newPassword, 10);

		user.password = hashedPassword;
		user.resetOtp = '';
		user.resetOtpExpiredAt = 0;

		await user.save();

		return res.json({ success: true, message: 'Password has been reset successfully' });

	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
}