import authenticateToken from '../middleware/auth.middleware.js';
import express from 'express';
const router = express.Router();
import {
    getUserDetails,
    updateUserDetails,
    deleteUser
} from '../controllers/user.controller.js';

// Get the authenticated user's profile
router.get('/profile', authenticateToken, getUserDetails);

// Update the authenticated user's profile
router.put('/profile', authenticateToken, updateUserDetails);

// Delete the authenticated user's profile
router.delete('/profile', authenticateToken, deleteUser);

export default router;
