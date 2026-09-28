const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ─── Helper: generate JWT ─────────────────────────────────────────────────────
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── Email / Password Auth ────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// Step 1: Redirect user to Google's consent screen
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ error: 'Google OAuth is not configured on this server.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Step 2: Google redirects back here after user grants permission
router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${FRONTEND_URL}/login?error=google_not_configured`);
  }
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login?error=google_failed`,
    session: true,
  })(req, res, next);
},
  (req, res) => {
    // Issue a JWT and pass user data to the frontend via URL params
    const token = generateToken(req.user._id);
    const params = new URLSearchParams({
      token,
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar || '',
    });
    // Redirect to frontend callback page — it will store the token and redirect
    res.redirect(`${FRONTEND_URL}/auth/callback?${params.toString()}`);
  }
);

module.exports = router;
