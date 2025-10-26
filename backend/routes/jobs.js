const express = require('express');
const { body, param } = require('express-validator');

const jobController = require('../controllers/jobController');
const { protect: authMiddleware, authorize } = require('../middleware/auth');
const { requireActiveRecruiter, canManageJob } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validation');

const router = express.Router();

const jobValidation = [
    body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title is required'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage('Description must be between 10 and 5000 characters'),
    body('company').trim().isLength({ min: 2, max: 200 }).withMessage('Company name is required'),
    body('location')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Location is required'),
    body('jobType')
        .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
        .withMessage('Invalid job type'),
    body('experienceLevel')
        .optional()
        .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
        .withMessage('Invalid experience level'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('salary.min').optional().isNumeric().withMessage('Salary min must be a number'),
    body('salary.max').optional().isNumeric().withMessage('Salary max must be a number'),
    body('status')
        .optional()
        .isIn(['draft', 'active', 'paused', 'closed', 'expired'])
        .withMessage('Invalid status'),
];

const jobUpdateValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be 3-200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage('Description must be between 10 and 5000 characters'),
    body('company')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Company name must be 2-200 characters'),
    body('location')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Location must be 2-200 characters'),
    body('jobType')
        .optional()
        .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
        .withMessage('Invalid job type'),
    body('experienceLevel')
        .optional()
        .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
        .withMessage('Invalid experience level'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('salary.min').optional().isNumeric().withMessage('Salary min must be a number'),
    body('salary.max').optional().isNumeric().withMessage('Salary max must be a number'),
    body('status')
        .optional()
        .isIn(['draft', 'active', 'paused', 'closed', 'expired'])
        .withMessage('Invalid status'),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid job ID')];

router.get('/', jobController.getJobs);

// Get saved jobs - requires authentication
router.get('/saved', authMiddleware, jobController.getSavedJobs);

// Get recruiter's own jobs - requires active recruiter status
router.get('/my-jobs', authMiddleware, requireActiveRecruiter, jobController.getMyJobs);

router.get('/:id', idValidation, validate, jobController.getJobById);

// Save/Unsave job - requires authentication
router.post('/:id/save', authMiddleware, idValidation, validate, jobController.saveJob);
router.delete('/:id/save', authMiddleware, idValidation, validate, jobController.unsaveJob);

// Create job - requires active recruiter status
router.post(
    '/',
    authMiddleware,
    requireActiveRecruiter,
    jobValidation,
    validate,
    jobController.createJob
);

// Update job - requires authentication and job ownership
router.put(
    '/:id',
    authMiddleware,
    authorize('recruiter', 'admin'),
    canManageJob,
    idValidation,
    jobUpdateValidation,
    validate,
    jobController.updateJob
);

// Delete job - requires authentication and job ownership
router.delete(
    '/:id',
    authMiddleware,
    authorize('recruiter', 'admin'),
    canManageJob,
    idValidation,
    validate,
    jobController.deleteJob
);

module.exports = router;
