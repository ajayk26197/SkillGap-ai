const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileType: { type: String },
    jobDescription: { type: String, required: true },
    resumeText: { type: String },
    // ── AI result fields (mirrors MatchAnalysisSchema) ──────────────────────
    matchScore: { type: Number, min: 0, max: 100 },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    bonusSkills: [{ type: String }],
    actionPlan: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', AnalysisSchema);
