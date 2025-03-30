import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createScore, getLeaderboard, getUserStats } from '../controllers/game.controller.js';

const router = express.Router();

// Define the routes for scores and leaderboard with authentication middleware
router.post('/scores', verifyToken, createScore);
router.get('/leaderboard', getLeaderboard); // GET request to fetch leaderboard
router.get('/stats', verifyToken, getUserStats);

export default router;
