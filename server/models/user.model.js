import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Game data
  score: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  lastGameScore: { type: Number, default: 0 },
  dailyStreak: { type: Number, default: 0 },
  lastPlayed: { type: Date, default: Date.now },

},  { timestamps: true, strict: false }
);

export default mongoose.model('User', userSchema);
