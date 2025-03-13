// routes/user.routes.js
import authenticateToken from '../middleware/auth.middleware.js';
import express from 'express';
const router = express.Router();
import {
  getUserDetails,
  updateUserDetails,
  deleteUser
} from '../controllers/user.controller.js';

// Get the authenticated user's profile using user ID
router.get('/profile/:id', authenticateToken, getUserDetails);

// Update the authenticated user's profile
router.put('/profile', authenticateToken, updateUserDetails);

// Delete the authenticated user's profile
router.delete('/profile/:id', authenticateToken, deleteUser); // Modified route for deletion

export default router;
