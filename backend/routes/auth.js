const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

const registerValidation = [
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('role')
        .optional()
        .isIn(['jobSeeker', 'recruiter', 'admin'])
        .withMessage('Invalid role supplied'),
    body('phone').optional().trim().isLength({ min: 7, max: 20 }),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be provided'),
];

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
