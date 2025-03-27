// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authenticateToken from './middleware/auth.middleware.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import gameRoutes from './routes/game.route.js';
import rateLimit from 'express-rate-limit';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many attempts, please try again later'
});
app.use('/auth/signup', apiLimiter);
app.use('/auth/signin', apiLimiter);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/game', gameRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
