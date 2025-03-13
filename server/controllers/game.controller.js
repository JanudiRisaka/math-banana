import Game from '../models/game.model.js';

export const createScore = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { score, won = false } = req.body;
    const userId = req.user?._id;

    if (typeof score !== 'number' || score < 0) {
      console.log('Invalid score:', score);
      return res.status(400).json({ message: 'Invalid score' });
    }

    if (!userId) {
      console.log('User not authenticated');
      return res.status(400).json({ message: 'User not authenticated' });
    }

    let gameData = await Game.findOne({ user: userId });
    if (!gameData) {
      gameData = new Game({ user: userId });
    }

    gameData.score = score;
    gameData.lastPlayed = new Date();
    gameData.gamesPlayed += 1;
    gameData.lastGameScore = score;

    if (won) gameData.wins += 1;
    if (score > gameData.highScore) gameData.highScore = score;

    const today = new Date().toDateString();
    const lastPlayedDate = gameData.lastPlayed.toDateString();
    if (today === lastPlayedDate) {
      gameData.dailyStreak += 1;
    } else {
      gameData.dailyStreak = 1;
    }

    await gameData.save();

    res.status(201).json({ message: 'Score and stats updated', gameData });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ message: 'Failed to save score', error: error.message });
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
