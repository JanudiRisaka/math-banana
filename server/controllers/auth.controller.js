// controllers/auth.controller.js
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/email.service.js';

dotenv.config();

// User Registration (signup)
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 3600000; // 1 hour

    // Create new user with verification data
    const newUser = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      verificationToken,
      verificationTokenExpires
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({
      message: "Verification email sent",
      userId: newUser._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New verification endpoint
// controllers/auth.controller.js
// 修正箇所: VerifyEmail controller
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Missing verification token' });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification token'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Return JSON response instead of redirect
    res.status(200).json({
      message: 'Email verified successfully!',
      verified: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Email verification failed: ' + error.message
    });
  }
};

// User Login (signin)
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified. Check your email for verification link'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify token and get user data
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password') // Exclude password
      .lean(); // Convert to plain object

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar // Include avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};

// Logout (client-side token removal)
export const logout = (req, res) => {
  // Inform the client to remove the token on the client-side
  res.status(200).json({ message: 'Logout successful' });
};
