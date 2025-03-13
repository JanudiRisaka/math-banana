// controllers/auth.controller.js
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// User Registration (signup)
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login (signin)
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email } // Include user details
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify token and get user data
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // req.user is set in the authenticateToken middleware
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.status(200).json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};
const logout = async () => {
  try {
    await axios.post('http://localhost:5000/auth/logout'); // Ensure backend supports this
  } catch (err) {
    console.error('Logout failed:', err);
  }
  localStorage.removeItem('token');
  setUser(null);
  setIsAuthenticated(false);
  window.location.reload();
};
