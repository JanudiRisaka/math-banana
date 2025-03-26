import Game from '../models/game.model.js'; // Import the Game model
import User from '../models/user.model.js'; // Import the User model (if needed)

export const createScore = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging

    const { score, won = false } = req.body;
    const userId = req.user.userId;

    if (typeof score !== "number" || score < 0) {
      return res.status(400).json({ message: "Invalid score" });
    }

    let gameData = await Game.findOne({ user: userId });
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    if (gameData) {
      const lastPlayed = gameData.lastPlayed ? new Date(gameData.lastPlayed) : null;

      if (lastPlayed && today - lastPlayed < 2 * oneDay) {
        if (today - lastPlayed >= oneDay) {
          gameData.dailyStreak += 1;
        }
      } else {
        gameData.dailyStreak = 1;
      }
    } else {
      gameData = new Game({
        user: userId,
        score,
        gamesPlayed: 0,
        wins: 0,
        lastGameScore: score,
        highScore: score,
        dailyStreak: 1,
        lastPlayed: today,
      });
    }

    // Update game data
    gameData.score = score;
    gameData.gamesPlayed += 1;
    if (won) gameData.wins += 1;
    gameData.lastGameScore = score;
    gameData.highScore = Math.max(gameData.highScore, score);
    gameData.lastPlayed = today;

    await gameData.save();

    res.status(200).json({
      message: "Game data updated successfully",
      data: gameData,
    });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ message: error.message });
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
