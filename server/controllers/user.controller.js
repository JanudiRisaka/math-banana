import User from '../models/user.model.js'; // User model
import bcrypt from 'bcryptjs'; // For hashing passwords
import jwt from 'jsonwebtoken'; // For generating JWT
import dotenv from 'dotenv';

dotenv.config();

// Get the authenticated user's details
export const getUserDetails = async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the token
    const user = await User.findById(req.user.id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Return user details
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the authenticated user's profile
export const updateUserDetails = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If a password is provided, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update user details
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save(); // Save the updated user

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete the authenticated user's account
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove(); // Remove the user

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change the user's password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save(); // Save the new password

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
