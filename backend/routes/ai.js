/**
 * AI Routes
 * 
 * Handles all AI/ML related endpoints
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   POST /api/ai/parse-resume
 * @desc    Parse resume using AI/ML service
 * @access  Private (Job Seekers)
 */
router.post(
    '/parse-resume',
    protect,
    authorize('jobSeeker'),
    aiController.parseResume
);

/**
 * @route   POST /api/ai/analyze-resume
 * @desc    Analyze resume quality and get recommendations
 * @access  Private (Job Seekers)
 */
router.post(
    '/analyze-resume',
    protect,
    authorize('jobSeeker'),
    aiController.analyzeResume
);

/**
 * @route   GET /api/ai/job-recommendations
 * @desc    Get AI-powered job recommendations for user
 * @access  Private (Job Seekers)
 */
router.get(
    '/job-recommendations',
    protect,
    authorize('jobSeeker'),
    aiController.getJobRecommendations
);

/**
 * @route   POST /api/ai/rank-candidates
 * @desc    Rank candidates for a job using AI
 * @access  Private (Recruiters, Admin)
 */
router.post(
    '/rank-candidates',
    protect,
    authorize('recruiter', 'admin'),
    aiController.rankCandidates
);

/**
 * @route   POST /api/ai/extract-skills
 * @desc    Extract skills from text using AI
 * @access  Private
 */
router.post(
    '/extract-skills',
    protect,
    aiController.extractSkills
);

/**
 * @route   GET /api/ai/health
 * @desc    Check ML service health status
 * @access  Private (Admin)
 */
router.get(
    '/health',
    protect,
    authorize('admin'),
    aiController.getMLServiceHealth
);

module.exports = router;
