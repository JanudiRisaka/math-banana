import express from 'express';
import {
  getUserData,
  getUserDetails,
  updateUserDetails,
  deleteUser
} from '../controllers/user.controller.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

// Add data endpoint
userRouter.get('/data', userAuth, getUserData);
userRouter.get('/profile/:userId?', userAuth, getUserDetails);
userRouter.put('/profile', userAuth, updateUserDetails);
userRouter.delete('/profile', userAuth, deleteUser);

export default userRouter;