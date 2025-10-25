const express = require('express');
const { body, param } = require('express-validator');

const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validation');

const router = express.Router();

const applyValidation = [
    body('jobId').isMongoId().withMessage('Invalid job ID'),
    body('coverLetter')
        .optional()
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage('Cover letter must be between 10 and 5000 characters'),
];

const applicationIdValidation = [
    param('applicationId').isMongoId().withMessage('Invalid application ID'),
];

const jobIdValidation = [param('jobId').isMongoId().withMessage('Invalid job ID')];

const statusUpdateValidation = [
    body('status')
        .isIn(['pending', 'reviewed', 'interview', 'accepted', 'rejected'])
        .withMessage('Invalid status'),
];

router.post('/', authMiddleware, authorize('jobSeeker'), applyValidation, validate, applicationController.applyToJob);

router.get('/my-applications', authMiddleware, applicationController.getMyApplications);

router.get('/jobs/:jobId/applications', authMiddleware, jobIdValidation, validate, applicationController.getJobApplications);

router.get('/:applicationId', authMiddleware, applicationIdValidation, validate, applicationController.getApplicationById);

router.put(
    '/:applicationId/status',
    authMiddleware,
    authorize('recruiter', 'admin'),
    applicationIdValidation,
    statusUpdateValidation,
    validate,
    applicationController.updateApplicationStatus
);

module.exports = router;
