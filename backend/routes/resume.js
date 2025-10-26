const express = require('express');
const { param } = require('express-validator');
const resumeController = require('../controllers/resumeController');
const { protect: authMiddleware, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadCloudinary = require('../middleware/uploadCloudinary');
const validate = require('../middleware/validation');

const router = express.Router();

// Resume validation
const resumeIdValidation = [
    param('resumeId').isMongoId().withMessage('Invalid resume ID'),
];

// Upload resume
router.post(
    '/upload',
    authMiddleware,
    authorize('jobSeeker'),
    upload.single('resume'),
    resumeController.uploadResume
);

// Upload resume to Cloudinary (alternate endpoint)
router.post(
    '/upload/cloudinary',
    authMiddleware,
    authorize('jobSeeker'),
    uploadCloudinary.single('resume'),
    resumeController.uploadResume
);

// Get user's resumes
router.get(
    '/my-resumes',
    authMiddleware,
    authorize('jobSeeker'),
    resumeController.getMyResumes
);

// Get resume by ID
router.get(
    '/:resumeId',
    authMiddleware,
    resumeIdValidation,
    validate,
    resumeController.getResumeById
);

// Analyze resume (AI scoring)
router.post(
    '/:resumeId/analyze',
    authMiddleware,
    authorize('jobSeeker'),
    resumeIdValidation,
    validate,
    resumeController.analyzeResume
);

// Get resume score
router.get(
    '/:resumeId/score',
    authMiddleware,
    resumeIdValidation,
    validate,
    resumeController.getResumeScore
);

// Delete resume
router.delete(
    '/:resumeId',
    authMiddleware,
    authorize('jobSeeker'),
    resumeIdValidation,
    validate,
    resumeController.deleteResume
);

// Update resume
router.put(
    '/:resumeId',
    authMiddleware,
    authorize('jobSeeker'),
    upload.single('resume'),
    resumeIdValidation,
    validate,
    resumeController.updateResume
);

module.exports = router;
