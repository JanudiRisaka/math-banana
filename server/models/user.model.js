// user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    verifyOtp: {
      type: String,
      default: ''
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0
    },
    isAccountVerified: {
      type: Boolean,
      default: false
    },
    resetOtp: {
      type: String,
      default: ''
    },
    resetOtpExpiredAt: {
      type: Number,
      default: 0
    },
    games: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }]
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
