// routes/gameRoutes.js
import express from 'express';
const router = express.Router();
import {
    createScore,
    getLeaderboard,
    getScoreForUser,
} from '../controllers/game.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

// Save a new score
router.post('/scores', authenticateToken, createScore);

// Get the leaderboard
router.get('/scores/leaderboard', authenticateToken, getLeaderboard);

// Get the scores for a user
router.get('/scores/user/:userId', authenticateToken, getScoreForUser);

export default router;