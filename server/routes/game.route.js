import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';  // Import the middleware
import { createScore, getLeaderboard, getUserStats, getScoreForUser } from '../controllers/game.controller.js';

const router = express.Router();

// Define the routes for scores and leaderboard with authentication middleware
router.post('/scores', authenticateToken, createScore); // POST request to save score
router.get('/leaderboard', getLeaderboard); // GET request to fetch leaderboard
router.get('/user/:userId/stats', authenticateToken, getUserStats); // GET user stats (requires authentication)
router.get('/user/:userId/scores', authenticateToken, getScoreForUser); // GET scores for a specific user (requires authentication)

export default router;
