const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');

connectDB();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Ensure DB connected for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection middleware error:', err);
  }
  next();
});

// ─── CORS ─────────────────────────────────────────────────────────────────────
// In production: frontend & backend are on the same Vercel domain → same-origin,
// no CORS needed for /api calls. We still need CORS for any external callers.
const allowedOrigins = [
  process.env.FRONTEND_URL,          // e.g. https://skillgap-ai.vercel.app
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // In production same-origin calls won't even have a CORS Origin header,
      // so this mainly protects against unknown external origins.
      if (isProd) return callback(null, true); // allow all same-domain Vercel calls
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Session ──────────────────────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'skillgap-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 10 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '✅ SkillGap AI Backend is running',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err.stack);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Local Dev Server (skipped on Vercel) ─────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📌 ENV: ${process.env.NODE_ENV || 'development'}`);
  });

  const shutdown = (signal) => {
    console.log(`\n🛑 ${signal} — closing server...`);
    server.close(() => {
      console.log('✅ Closed cleanly.');
      process.kill(process.pid, signal);
    });
  };

  process.once('SIGUSR2', () => shutdown('SIGUSR2'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Required by Vercel serverless
module.exports = app;
