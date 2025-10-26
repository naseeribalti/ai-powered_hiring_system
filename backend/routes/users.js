const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const uploadProfileCloudinary = require('../middleware/uploadProfileCloudinary');
const userController = require('../controllers/userController');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res, next) => {
    try {
        res.json({
            status: 'success',
            data: {
                user: req.user
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, async (req, res, next) => {
    try {
        // TODO: Implement profile update logic
        res.json({
            status: 'success',
            message: 'Profile update endpoint - Coming soon'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/users/me/photo
 * @desc    Upload profile photo (Cloudinary)
 * @access  Private
 */
router.post(
    '/me/photo',
    protect,
    uploadProfileCloudinary.single('photo'),
    userController.uploadProfilePhoto
);

module.exports = router;
