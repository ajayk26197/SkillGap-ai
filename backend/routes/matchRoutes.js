const express = require('express');
const router = express.Router();
const { analyzeResume, getHistory, getAnalysis } = require('../controllers/matchController');
const { protect, optionalProtect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// POST /api/match/analyze
// Public route: works without auth (result not saved), saves when authenticated
router.post('/analyze', optionalProtect, upload.single('resume'), analyzeResume);

// GET /api/match/history  (protected — requires login)
router.get('/history', protect, getHistory);

// GET /api/match/:id  (protected — requires login)
router.get('/:id', protect, getAnalysis);

module.exports = router;
