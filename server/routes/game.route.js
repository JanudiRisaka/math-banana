import express from 'express';
import { createGameData, getUserStats, getLeaderboard } from '../controllers/game.controller.js';
import userAuth from '../middleware/userAuth.js';
import rateLimit from 'express-rate-limit';

const gameRoutes = express.Router();

const scoreLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    success: false,
    message: 'Too many score submissions'
  })
});

gameRoutes.get('/stats', userAuth, getUserStats);
gameRoutes.post('/scores', userAuth, scoreLimiter, createGameData);
gameRoutes.get('/leaderboard', userAuth, getLeaderboard);

export default gameRoutes;