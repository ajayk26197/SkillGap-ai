const dotenv = require('dotenv');
// Load environment variables FIRST — before any module reads process.env
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');

// Connect to MongoDB Atlas
connectDB();

const app = express();

const isProd = process.env.NODE_ENV === 'production';

// ─── Allowed Origins ──────────────────────────────────────────────────────────
// Add your Vercel frontend URL to FRONTEND_URL in production env vars
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Vercel SSR)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Session (required for OAuth dance) ──────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'skillgap-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,       // HTTPS only in production
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 10 * 60 * 1000, // 10 min (OAuth dance only)
    },
  })
);

// ─── Passport Middleware ──────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: '✅ SkillGap AI Backend is running',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err.stack);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Start Server (skipped in serverless/Vercel) ──────────────────────────────
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5001;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📌 ENV: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful Shutdown (nodemon uses SIGUSR2 to restart)
  const shutdown = (signal) => {
    console.log(`\n🛑 ${signal} received — closing server...`);
    server.close(() => {
      console.log('✅ Server closed cleanly.');
      process.kill(process.pid, signal);
    });
  };

  process.once('SIGUSR2', () => shutdown('SIGUSR2')); // nodemon restart
  process.on('SIGTERM', () => shutdown('SIGTERM'));    // production stop
}

// Export for Vercel serverless
module.exports = app;
