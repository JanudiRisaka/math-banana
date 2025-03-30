import User from '../models/user.model.js';
import Game from '../models/game.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

		if(!user) {
			return res.json({ success: false, message: 'User not found' });
		}

    res.json({
      success: true,
      userData: {
        name: user.username,
        isAccountVerified: user.isAccountVerified,
        email: user.email
        //avatar: avatar
      }
    })
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}





// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
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
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user details
// controllers/user.controller.js
export const updateUserDetails = async (req, res) => {
  const { username, email, password, avatar } = req.body;

  try {
    // 1. Get user ID from verified token
    const userId = req.userId;

    // 2. Find user by ID from token
    const user = await User.findById(userId);

    // 3. Update fields
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
    const userId = req.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.clearCookie("token");
    // Respond with success
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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
