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
    lastLogic: {
      type: Date,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date
  },
  { timestamps: true }
);
userSchema.index(
  { verificationToken: 1 },
  {
    partialFilterExpression: { verificationToken: { $exists: true } },
    expireAfterSeconds: 3600 // Auto-expire after 1 hour
  }
);
export default mongoose.model('User', userSchema);
