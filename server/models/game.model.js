import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    default: 0,
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
  }
}, { timestamps: true });

// Indexes for faster queries
gameSchema.index({ highScore: -1 });

export default mongoose.model('Game', gameSchema);