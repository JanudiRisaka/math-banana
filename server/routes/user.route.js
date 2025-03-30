// routes/user.routes.js
import express from 'express';
import {
  getUserDetails,
  updateUserDetails,
  deleteUser,
  getUserData
} from '../controllers/user.controller.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);


userRouter.put('/profile', updateUserDetails);
userRouter.get('/profile', getUserDetails);
userRouter.delete('/profile', deleteUser);

export default userRouter;
