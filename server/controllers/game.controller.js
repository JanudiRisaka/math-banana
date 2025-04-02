// game.controller.js (Backend)
import Game from '../models/game.model.js';
import mongoose from 'mongoose';

// Enhanced date comparison utility
const isConsecutiveDay = (previousDate, currentDate) => {
  const prev = new Date(previousDate);
  const curr = new Date(currentDate);
  prev.setHours(0, 0, 0, 0);
  curr.setHours(0, 0, 0, 0);
  return Math.floor((curr - prev) / (1000 * 60 * 60 * 24)) === 1;
};

export const createGameData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('[Game Controller] Starting transaction for user:', req.user.userId);
    const { score: rawScore, won: rawWon } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid user ID:', userId);
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const score = Math.round(Number(rawScore));
    const won = Boolean(rawWon);

    console.log(`Processing score: ${score}, won: ${won} for user: ${userId}`);

    if (isNaN(score) || typeof won !== 'boolean') {
      console.error('Invalid request data types:', { score: typeof rawScore, won: typeof rawWon });
      return res.status(400).json({ success: false, message: 'Invalid request format' });
    }

    if (score < 0 || score > 2147483647) {
      console.error('Score out of range:', score);
      return res.status(400).json({ success: false, message: 'Invalid score value' });
    }

    // Create the increment object for wins properly
    const increment = {
      score: score,
      gamesPlayed: 1
    };

    // Only increment wins if won is true
    if (won === true) {
      increment.wins = 1;
    }

    // Initial update operation
    const baseUpdate = {
      $inc: increment,
      $max: { highScore: score },
      $set: { lastPlayed: new Date() },
      $setOnInsert: {
        dailyStreak: 1 // Initialize streak on first insert
      }
    };

    console.log('Debug - Base update operation:', JSON.stringify(baseUpdate));

    const options = {
      new: true,
      upsert: true,
      session,
      projection: { lastPlayed: 1, dailyStreak: 1 },
      runValidators: true
    };

    console.log('Executing findOneAndUpdate with:', { baseUpdate, options });
    const gameData = await Game.findOneAndUpdate(
      { user: userId },
      baseUpdate,
      options
    ).populate('user', 'username email');

    console.log('Initial update result:', gameData);

    // Daily streak calculation
    const now = new Date();
    const lastPlayed = gameData.lastPlayed || now;
    const isStreakValid = isConsecutiveDay(lastPlayed, now);

    const streakUpdate = isStreakValid
      ? { $inc: { dailyStreak: 1 } }
      : { $set: { dailyStreak: 1 } };

    console.log(`Applying streak update: ${JSON.stringify(streakUpdate)}`);
    await Game.updateOne(
      { _id: gameData._id },
      streakUpdate,
      { session }
    );

    await session.commitTransaction();
    console.log('Transaction committed successfully');

    // Fetch final updated document
    const updatedData = await Game.findById(gameData._id)
      .populate('user', 'username email')
      .lean();

    console.log('Final game data:', updatedData);

    res.status(200).json({
      success: true,
      data: {
        score: updatedData.score,
        highScore: updatedData.highScore,
        gamesPlayed: updatedData.gamesPlayed,
        wins: updatedData.wins,
        dailyStreak: updatedData.dailyStreak,
        lastPlayed: updatedData.lastPlayed
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction aborted due to error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Game data processing failed'
    });
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
          _id: 0,
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