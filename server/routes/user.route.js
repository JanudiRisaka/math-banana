// This file sets up Express routes for user-related operations (fetching data, updating profiles, and account deletion)
// All routes require user authentication via the `userAuth` middleware.
import express from 'express';
import {
  getUserData,
  getUserDetails,
  updateUserDetails,
  deleteUser
} from '../controllers/user.controller.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

// GET /data - Retrieve authenticated user's data
userRouter.get('/data', userAuth, getUserData);

// GET /profile/:userId? - Retrieve public or private profile details (optional userId parameter)
userRouter.get('/profile/:userId?', userAuth, getUserDetails);

// PUT /profile - Update authenticated user's profile details
userRouter.put('/profile', userAuth, updateUserDetails);

// DELETE /profile - Delete authenticated user's account
userRouter.delete('/profile', userAuth, deleteUser);

export default userRouter;