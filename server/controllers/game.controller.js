import Game from '../models/game.model.js';
import mongoose from 'mongoose';

const isConsecutiveDay = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const d1 = new Date(date1).setHours(0, 0, 0, 0);
  const d2 = new Date(date2).setHours(0, 0, 0, 0);
  return Math.abs(d1 - d2) <= oneDay;
};


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

export const createGameData  = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user.userId;
    const { score, playedDate } = req.body; // Remove 'won' from destructuring
    const won = score > 100; // Automatically determine win status

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      await session.abortTransaction();
      return res.status(401).json({ success: false, message: 'Invalid user ID' });
    }

    const existing = await Game.findOne({ user: userId }).session(session);

    // Calculate streak (existing code remains the same)
    let dailyStreak = 1;
    let incrementBestStreak = false;

    if (existing?.lastPlayed) {
      const today = playedDate ? new Date(playedDate) : new Date();
      const lastPlayed = new Date(existing.lastPlayed);

      const lastPlayedLocal = new Date(lastPlayed.toLocaleDateString());
      const todayLocal = new Date(today.toLocaleDateString());

      if (isConsecutiveDay(lastPlayedLocal, todayLocal)) {
        dailyStreak = existing.dailyStreak + 1;
      } else {
        dailyStreak = 1;
      }
    }

    // Update the win condition in the update object
    const update = {
      $set: {
        highScore: Math.max(existing?.highScore || 0, score),
        lastPlayed: playedDate ? new Date(playedDate) : new Date(),
        dailyStreak: dailyStreak,
        lastGameScore: score,
      },
      $inc: {
        gamesPlayed: 1,
        wins: won ? 1 : 0, // Simplified win increment
        totalScore: score
      }
    };

    // Best streak logic remains the same
    if (incrementBestStreak) {
      const currentBestStreak = existing?.bestStreak || 0;
      if (dailyStreak > currentBestStreak) {
        update.$set.bestStreak = dailyStreak;
      }
    } else if (!existing?.bestStreak) {
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
        lastPlayedDate: result.lastPlayed,
        lastGameScore: result.lastGameScore,
        wins: result.wins // Include wins in response
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