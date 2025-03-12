import express from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';

const router = express.Router();

// Define the route to get the leaderboard
router.get('/leaderboard', getLeaderboard);

export default router;
