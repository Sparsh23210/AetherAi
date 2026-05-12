import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import dotenv from 'dotenv';
import toolRoutes from './routes/toolRoutes';
import categoryRoutes from './routes/categoryRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler, notFound } from './middleware/error';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 10000, // higher limit for local dev
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Aether AI Backend is running.' });
});

// Routes
app.use('/api/tools', toolRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/user', userRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

// Graceful Shutdown & Crash Handling
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception! Shutting down gracefully...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('CRITICAL: Unhandled Rejection! Shutting down gracefully...', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received. Closing HTTP server gracefully...');
  server.close(() => {
    console.info('HTTP server closed.');
    process.exit(0);
  });
});
