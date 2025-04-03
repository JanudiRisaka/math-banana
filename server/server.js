// server.js
// This is the main server file that sets up the Express application, middleware, and API routes.
// It also includes security, logging, static asset handling, and error management.
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/mongodb.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route files
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import gameRouter from './routes/game.route.js';

// Set __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Set security headers using helmet with custom CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://marcconrad.com"],
      connectSrc: ["'self'", process.env.CLIENT_URL]
    }
  }
}));

// Configure CORS based on environment
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Custom request logging middleware (logs method, path, and timestamp)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/game', gameRouter);

// Health check endpoint for monitoring server status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve static assets for production (client build)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Additional security headers middleware for extra protection
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});

// Handle missing API routes with a warning and 404 response
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.warn(`[WARNING] Missing API route handler for: ${req.method} ${req.path}`);
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  next();
});

// Global error handling middleware for catching unexpected errors
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error'
  });
});

// Serve Single Page Application (SPA) fallback for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});