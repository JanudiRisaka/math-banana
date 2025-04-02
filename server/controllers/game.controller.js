import Game from '../models/game.model.js';
import mongoose from 'mongoose';

const isSameDay = (date1, date2) => (
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate()
);


// 1. Add getUserStats controller to handle /api/game/stats endpoint
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'Invalid user ID' });
    }

    const gameData = await Game.findOne({ user: userId });

    if (!gameData) {
      // New user, return defaults
      return res.status(200).json({
        success: true,
        data: {
          highScore: 0,
          dailyStreak: 0,
          lastPlayedDate: null,
          gamesPlayed: 0,
          wins: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        highScore: gameData.highScore || 0,
        dailyStreak: gameData.dailyStreak || 0,
        lastPlayedDate: gameData.lastPlayed,
        gamesPlayed: gameData.gamesPlayed || 0,
        wins: gameData.wins || 0
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user stats' });
  }
};

// 2. Fixed saveScore function (renamed from createGameData for clarity)
export const createGameData  = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user.userId;
    const { score, won, playedDate } = req.body; // Match frontend request format

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      await session.abortTransaction();
      return res.status(401).json({ success: false, message: 'Invalid user ID' });
    }

    const existing = await Game.findOne({ user: userId }).session(session);

    // Calculate streak
    let dailyStreak = 1; // Default for new players
    let incrementBestStreak = false;

    if (existing?.lastPlayed) {
      const today = playedDate ? new Date(playedDate) : new Date();
      const lastPlayedDate = new Date(existing.lastPlayed);

      if (isSameDay(today, lastPlayedDate)) {
        // Already played today, keep streak the same
        dailyStreak = existing.dailyStreak || 1;
      } else {
        // Check if last played was yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (isSameDay(lastPlayedDate, yesterday)) {
          // Played yesterday, increment streak
          dailyStreak = (existing.dailyStreak || 0) + 1;
          incrementBestStreak = true;
        } else {
          // Streak broken, reset to 1
          dailyStreak = 1;
        }
      }
    }

    // Calculate high score
    const currentHighScore = existing?.highScore || 0;
    const newHighScore = Math.max(currentHighScore, score);

    // Build update object
    const update = {
      $set: {
        highScore: newHighScore,
        lastPlayed: playedDate ? new Date(playedDate) : new Date(),
        dailyStreak: dailyStreak
      },
      $inc: {
        gamesPlayed: 1,
        ...(won && { wins: 1 })
      }
    };

    // Increment best streak if needed
    if (incrementBestStreak) {
      const currentBestStreak = existing?.bestStreak || 0;
      if (dailyStreak > currentBestStreak) {
        update.$set.bestStreak = dailyStreak;
      }
    } else if (!existing?.bestStreak) {
      // Initialize best streak for new users
      update.$set.bestStreak = 1;
    }

    const result = await Game.findOneAndUpdate(
      { user: userId },
      update,
      { new: true, upsert: true, session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: {
        dailyStreak: result.dailyStreak,
        highScore: result.highScore,
        lastPlayedDate: result.lastPlayed // Match frontend property name
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Save score error:', error);
    res.status(500).json({ success: false, message: 'Failed to save score' });
  } finally {
    session.endSession();
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Game.aggregate([
      { $match: { highScore: { $gt: 0 } }},
      { $sort: { highScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            { $project: { username: 1, avatar: 1 } }
          ]
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1, // Include ID for frontend identification
          user: {
            username: 1,
            avatar: 1
          },
          highScore: 1,
          updatedAt: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
};