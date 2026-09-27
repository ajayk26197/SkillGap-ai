const { runAiMatch } = require('../utils/aiMatch');
const { extractText } = require('../utils/textExtractor');
const Analysis = require('../models/Analysis');

// ─── POST /api/match/analyze ─────────────────────────────────────────────────
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'A resume file (PDF, DOCX, PNG, JPG) is required.' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({ error: 'Job description must be at least 10 characters.' });
    }

    // Step 1: Extract text from uploaded file (pdf-parse / mammoth / Tesseract OCR)
    let resumeText;
    try {
      resumeText = await extractText(req.file.buffer, req.file.mimetype);
    } catch (parseErr) {
      return res.status(422).json({ error: `File reading failed: ${parseErr.message}` });
    }

    if (!resumeText || resumeText.trim().length < 40) {
      return res.status(422).json({
        error: 'Could not extract enough text. Please upload a text-based PDF or DOCX.',
      });
    }

    // Step 2: Run AI match using gpt-4o-mini + Zod structured output
    const result = await runAiMatch(
      resumeText.slice(0, 6000),       // cap to stay within token limits
      jobDescription.slice(0, 3000)
    );
    // result = { matchScore, matchedSkills, missingSkills, bonusSkills, actionPlan }

    // Step 3: Save to DB only if authenticated
    let savedAnalysis = null;
    if (req.user) {
      savedAnalysis = await Analysis.create({
        user: req.user._id,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        jobDescription,
        resumeText,
        ...result,
      });
    }

    res.json({
      success: true,
      analysisId: savedAnalysis?._id || null,
      fileName: req.file.originalname,
      saved: !!savedAnalysis,
      ...result,
    });
  } catch (err) {
    console.error('❌ Analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' });
  }
};

// ─── GET /api/match/history ───────────────────────────────────────────────────
const getHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .select('-resumeText -jobDescription -actionPlan') // keep list response light
      .sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /api/match/:id ───────────────────────────────────────────────────────
const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found.' });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeResume, getHistory, getAnalysis };
