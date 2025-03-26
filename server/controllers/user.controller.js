import User from '../models/user.model.js';  // Correct import for user model
import Game from '../models/game.model.js';  // Correct import for game model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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
        avatar: user.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${user.username}`,
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
    // 1. Use URL parameter instead of token ID
    const user = await User.findById(req.params.id);

    // 2. Add authorization check
    if (req.user.userId !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // 3. Update fields only if they exist in request
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    // 4. Return complete user object
    res.status(200).json({
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this profile' });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.user.userId);

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
