// routes/userRoutes.js
import express from 'express';
const router = express.Router();
import {
    getUser,
    updateUser,
    listUsers,
    sendFriendRequest,
    acceptFriendRequest,
} from '../controllers/userController.js';
import authenticateToken from '../middleware/authMiddleware.js';

// Get a user's profile by ID
router.get('/:id', authenticateToken, getUser);

// Update a user's profile
router.put('/:id', authenticateToken, updateUser);

// Get a list of users
router.get('/', authenticateToken, listUsers);

// Send a friend request
router.post('/:id/friends', authenticateToken, sendFriendRequest);

// Accept friend request
router.put('/:id/friends/:friendId', authenticateToken, acceptFriendRequest);

export default router;