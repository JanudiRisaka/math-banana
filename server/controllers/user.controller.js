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
    console.log('Fetching user with ID:', userId);

    // Fetch user details
    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch game data for the user
    const gameData = await Game.findOne({ user: userId });
    if (!gameData) {
      return res.status(404).json({ message: 'Game data not found' });
    }

    // Combine user and game data
    const profile = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      stats: {
        highScore: gameData.highScore,
        gamesPlayed: gameData.gamesPlayed,
        wins: gameData.wins,
        dailyStreak: gameData.dailyStreak,
        lastPlayed: gameData.lastPlayed,
        lastGameScore: gameData.lastGameScore,
      },
    };

    console.log('Fetched Profile:', profile);
    res.json(profile); // Return combined data
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user details
export const updateUserDetails = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!username && !email && !password) {
      return res.status(400).json({ message: 'No data provided to update' });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.user.id); // Simplified delete operation

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

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
