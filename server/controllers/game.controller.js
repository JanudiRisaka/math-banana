import Game from '../models/game.model.js'; // Import the Game model
import User from '../models/user.model.js'; // Import the User model (if needed)

// controllers/game.controller.js
export const createScore = async (req, res) => {
  try {
    const { score, won = false } = req.body;
    const userId = req.userId;

    // Enhanced validation
    if (typeof score !== "number" || score < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid score value",
        received: score
      });
    }

    // Find or create game data with proper defaults
    let gameData = await Game.findOneAndUpdate(
      { user: userId },
      {
        $setOnInsert: {
          user: userId,
          score: 0,
          gamesPlayed: 0,
          wins: 0,
          highScore: 0,
          dailyStreak: 0
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Update statistics
    const updates = {
      $inc: {
        score: Number(score),
        gamesPlayed: 1,
        ...(won && { wins: 1 })
      },
      $max: { highScore: gameData.highScore + Number(score) },
      $set: { lastPlayed: new Date() }
    };

    // Update streak calculation
    const lastPlayedDate = gameData.lastPlayed || new Date(0);
    const dayDifference = Math.floor((Date.now() - lastPlayedDate) / (1000 * 3600 * 24));

    updates.$set.dailyStreak = dayDifference === 1 ?
      gameData.dailyStreak + 1 :
      dayDifference === 0 ? gameData.dailyStreak : 1;

    const updatedGame = await Game.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true }
    ).populate('user', 'username');

    res.status(200).json({
      success: true,
      message: "Score updated successfully",
      data: updatedGame
    });
  } catch (error) {
    console.error("Score save error:", error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ?
        error.message :
        "Failed to save score"
    });
  }
};

// Get the leaderboard (sorted by highest score)
// controllers/game.controller.js
export const getLeaderboard = async (req, res) => {
  try {
    // 1. Fetch all games with user data
    const games = await Game.find()
      .populate({
        path: 'user',
        select: 'username',
      })
      .lean(); // Convert to plain JS objects

    // 2. Filter out entries with invalid users
    const validGames = games.filter(game => game.user !== null);

    // 3. Validate highScore and provide defaults if missing
    const validatedGames = validGames.map(game => ({
      ...game,
      highScore: typeof game.highScore === 'number' ? game.highScore : 0,
    }));

    // 4. Sort by highScore (descending)
    const sortedGames = validatedGames.sort((a, b) => b.highScore - a.highScore);

    // 5. Get top 10 entries
    const leaderboard = sortedGames.slice(0, 10);

    if (!leaderboard.length) {
      return res.status(404).json({ message: 'No leaderboard data found' });
    }

    // 6. Send successful response
    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Error in getLeaderboard:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message // Include error details for debugging
    });
  }
};


export const getUserStats = async (req, res) => {
  try {
    const gameData = await Game.findOne({ user: req.userId })
      .select('-__v -_id -user')
      .lean();

    if (!gameData) {
      return res.status(404).json({
        success: false,
        message: 'No game data found'
      });
    }

    res.status(200).json({
      success: true,
      data: gameData
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};