// routes/auth.route.js
import express from 'express';
import { signup, signin, me, logout } from '../controllers/auth.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', authenticateToken, me);
router.post('/logout', logout);

export default router;
