const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Strict protect: rejects unauthenticated requests ─────────────────────────
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorized. No token provided.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found.' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized. Token invalid or expired.' });
  }
};

// ── Optional protect: attaches user if token present, but always continues ───
const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch (_) {
    // Invalid token — just continue without setting req.user
  }
  next();
};

module.exports = { protect, optionalProtect };
