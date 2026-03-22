const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileSize: { type: Number },
    extractedText: { type: String },
    analysis: {
      score: { type: Number, default: 0 },
      summary: { type: String },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }],
      keywords: {
        found: [{ type: String }],
        missing: [{ type: String }],
      },
      sections: {
        hasContact: { type: Boolean, default: false },
        hasEducation: { type: Boolean, default: false },
        hasExperience: { type: Boolean, default: false },
        hasSkills: { type: Boolean, default: false },
        hasSummary: { type: Boolean, default: false },
        hasProjects: { type: Boolean, default: false },
      },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
