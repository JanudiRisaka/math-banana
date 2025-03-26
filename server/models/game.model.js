// game.model.js
import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    wins: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    highScore: { type: Number, default: 0, required: true,},
    lastGameScore: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastPlayed: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Game', gameSchema);
