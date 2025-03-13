import Game from '../models/game.model.js'; // Import the Game model
import User from '../models/user.model.js'; // Import the User model (if needed)

export const createScore = async (req, res) => {
  try {
    const { score, won = false } = req.body;
    const userId = req.user.userId;  // Extract userId from the decoded token

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ message: 'Invalid score' });
    }

    // Find or create game data for this user
    const gameData = await Game.findOneAndUpdate(
      { user: userId },
      {
        $inc: {
          gamesPlayed: 1,  // Increment games played
          wins: won ? 1 : 0,  // Increment wins if the game was won
        },
        $set: {
          lastGameScore: score,  // Set the last game score
          highScore: Math.max(score, 0),  // Update high score if the current score is higher
        },
      },
      { new: true, upsert: true }  // Upsert means create a new document if it doesn't exist
    );

    res.status(200).json({
      message: 'Game data updated successfully',
      data: gameData,
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ message: error.message });
  }
};


// Get the leaderboard (sorted by highest score)
export const getLeaderboard = async (req, res) => {
  try {
    // Fetch the leaderboard, sorted by score in descending order, and limit to 10 entries
    const leaderboard = await Game.find().sort({ score: -1 }).limit(10);

    // Check if the leaderboard is empty
    if (!leaderboard || leaderboard.length === 0) {
      return res.status(404).json({ message: 'No leaderboard data found' });
    }

    // Sending the leaderboard as part of the response object
    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Fetch user stats
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const gameData = await Game.findOne({ user: userId });

    if (!gameData) {
      return res.status(404).json({ message: 'No game data found for this user' });
    }

    res.status(200).json({ gameData });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all scores for a specific user
export const getScoreForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const scores = await Game.find({ user: userId });

    if (!scores.length) {
      return res.status(404).json({ message: 'No scores found for this user' });
    }

    res.status(200).json({ scores });
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
