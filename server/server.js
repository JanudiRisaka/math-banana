// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from "./config/mongodb.js";

import path from 'path';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import gameRouter from './routes/game.route.js';

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

const __dirname = path.resolve();
const allowedOrigins = [process.env.CLIENT_URL];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

// Serve static assets from React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

//API endpoints
app.get('/', (req, res)=> res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/game', gameRouter);

// Middleware to enforce JSON responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Keep this AFTER other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔑 MongoDB URI: ${process.env.MONGO_URI?.slice(0, 25)}...`);
    console.log(`🌐 CORS Origin: ${process.env.CLIENT_URL}`);
  } catch (error) {
    console.error("🔥 Failed to start server:", error);
    process.exit(1);
  }
});