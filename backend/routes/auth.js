const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const authConfig = require('../../config/auth');
const { protect: authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

const registerValidation = [
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .bail()
        .custom((value) => authConfig.validatePassword(value))
        .withMessage(() => {
            const rules = authConfig.getPasswordRequirements();
            return `Password must include: ${rules.join(', ')}`;
        }),
    body('role')
        .optional()
        .isIn(['jobSeeker', 'recruiter', 'admin'])
        .withMessage('Invalid role supplied'),
    body('phone').optional().trim().isLength({ min: 7, max: 20 }),
    // Recruiter-specific fields
    body('companyName')
        .if(body('role').equals('recruiter'))
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name is required for recruiters'),
    body('companyWebsite')
        .optional()
        .trim()
        .isURL()
        .withMessage('Please provide a valid company website URL'),
    body('companyDetails')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Company details must not exceed 1000 characters'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be provided'),
];

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
