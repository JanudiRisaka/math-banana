
import Game from '../models/game.model.js';
import mongoose from 'mongoose';

const isConsecutiveDay = (date1, date2) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const d1 = formatDate(date1);
  const d2 = formatDate(date2);

  // If they're the same day, they are not consecutive
  if (d1 === d2) return false;

  // Create date objects from the formatted strings to ensure midnight comparison
  const date1Obj = new Date(d1);
  const date2Obj = new Date(d2);

  // Calculate difference in days
  const diffTime = Math.abs(date2Obj - date1Obj);
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Return true only if exactly 1 day difference
  return diffDays === 1;
};

export const createGameData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user.userId;
    const { score, playedDate } = req.body;
    const won = score >= 100;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      await session.abortTransaction();
      return res.status(401).json({ success: false, message: 'Invalid user ID' });
    }

    const existing = await Game.findOne({ user: userId }).session(session);

    // Get today's date and last played date in consistent format
    const today = playedDate ? new Date(playedDate) : new Date();
    const todayString = today.toISOString().split('T')[0];

    let dailyStreak = 1; // Default for new players

    if (existing?.lastPlayed) {
      const lastPlayed = new Date(existing.lastPlayed);
      const lastPlayedString = lastPlayed.toISOString().split('T')[0];

      // Check if this is the same day
      if (todayString === lastPlayedString) {
        // Same day, keep current streak
        dailyStreak = existing.dailyStreak;
      } else if (isConsecutiveDay(lastPlayed, today)) {
        // New day and consecutive, increment streak
        dailyStreak = existing.dailyStreak + 1;
      } else {
        // Not consecutive, reset streak
        dailyStreak = 1;
      }
    }

    const update = {
      $set: {
        highScore: Math.max(existing?.highScore || 0, score),
        lastPlayed: today,
        dailyStreak: dailyStreak,
        lastGameScore: score,
      },
      $inc: {
        gamesPlayed: 1,
        wins: won ? 1 : 0,
        totalScore: score
      }
    };

    // Best streak logic
    if (!existing?.bestStreak || dailyStreak > existing.bestStreak) {
      update.$set.bestStreak = dailyStreak;
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
        wins: result.wins
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