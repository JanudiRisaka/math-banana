// routes/auth.route.js
import express from 'express';
import { signup, signin, me } from '../controllers/auth.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', authenticateToken, me); // Protect this route with token verification

export default router;
