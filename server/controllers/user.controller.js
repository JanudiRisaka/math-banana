import User from '../models/user.model.js';
import Game from '../models/game.model.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const generateAvatar = (username) =>
  `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(username)}`;

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let gameStats = {
      highScore: 0,
      gamesPlayed: 0,
      avgScore: 0,
      lastPlayed: null,
      lastGameScore: 0
    };

    if (!req.params.userId) {
      // Get complete stats from Game document
      const gameData = await Game.findOne({ user: userId });

      if (gameData) {
        gameStats = {
          highScore: gameData.highScore || 0,
          gamesPlayed: gameData.gamesPlayed || 0,
          avgScore: gameData.gamesPlayed > 0
            ? Math.round(gameData.totalScore / gameData.gamesPlayed)
            : 0,
          lastPlayed: gameData.lastPlayed,
          lastGameScore: gameData.lastGameScore || 0,
          wins: gameData.wins || 0, // Add this line
          dailyStreak: gameData.dailyStreak || 0 // Add this line
        };
      }
    }

    const response = req.params.userId
      ? {
          success: true,
          publicProfile: {
            id: user._id,
            username: user.username,
            avatar: user.avatar || generateAvatar(user.username)
          }
        }
      : {
          success: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar || generateAvatar(user.username)
          },
          stats: gameStats
        };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      code: 'USER_FETCH_ERROR'
    });
  }
};

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -otp -otpExpiry')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      userData: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || generateAvatar(user.username)
      }
    });

  } catch (error) {
    console.error('User data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
      code: 'USER_DATA_FETCH_FAILED'
    });
  }
};

// Update user details
export const updateUserDetails = async (req, res) => {
  const { username, email, password, avatar } = req.body;

  try {
    const updates = {};
    const user = await User.findById(req.user.userId);

    if (username) {
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({
          success: false,
          message: 'Username must be between 3-30 characters'
        });
      }
      updates.username = username;
    }

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      const emailExists = await User.exists({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
      updates.email = email;
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters'
        });
      }
      updates.password = await bcrypt.hash(password, 12);
    }

    if (avatar) {
      if (!avatar.startsWith('http')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid avatar URL'
        });
      }
      updates.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpiry');

    return res.status(200).json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Update failed',
      code: 'USER_UPDATE_FAILED',
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Fixed from req.userId
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Account deletion failed'
    });
  }
};