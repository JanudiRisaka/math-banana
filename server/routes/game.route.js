// This file defines game-related routes such as saving scores, fetching user stats, and retrieving the leaderboard.
import express from 'express';
import { createGameData, getUserStats, getLeaderboard } from '../controllers/game.controller.js';
import userAuth from '../middleware/userAuth.js';
import rateLimit from 'express-rate-limit';

const gameRoutes = express.Router();

// Rate limiter for score submissions to prevent abuse
const scoreLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,  // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    success: false,
    message: 'Too many score submissions'
  })
});

// Get user game statistics (protected route)
gameRoutes.get('/stats', userAuth, getUserStats);

// Save game score with rate limiting (protected route)
gameRoutes.post('/scores', userAuth, scoreLimiter, createGameData);

// Get the leaderboard (protected route)
gameRoutes.get('/leaderboard', userAuth, getLeaderboard);

export default gameRoutes;