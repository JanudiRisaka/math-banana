import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  wins: {
    type: Number,
    default: 0,
    min: 0
  },
  highScore: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastPlayed: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastGameScore: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Indexes for faster queries
gameSchema.index({ user: 1, score: -1 });

export default mongoose.model('Game', gameSchema);