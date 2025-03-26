import User from '../models/user.model.js';  // Correct import for user model
import Game from '../models/game.model.js';  // Correct import for game model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Get user details
// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user details
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch or create default game data
    let gameData = await Game.findOne({ user: userId });
    if (!gameData) {
      gameData = {
        highScore: 0,
        gamesPlayed: 0,
        wins: 0,
        dailyStreak: 0,
        lastPlayed: null,
        lastGameScore: 0,
      };
    }

    // Convert Mongoose document to plain object
    const responseData = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      stats: gameData.toObject ? gameData.toObject() : gameData
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user details
// controllers/user.controller.js
export const updateUserDetails = async (req, res) => {
  const { username, email, password, avatar } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!username && !email && !password && !avatar) {
      return res.status(400).json({ message: 'No data provided to update' });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    await user.save();

    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
