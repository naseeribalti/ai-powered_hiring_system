const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getPendingRecruiters,
    approveRecruiter,
    rejectRecruiter,
    suspendUser,
    reactivateUser,
    getAllRecruiters
} = require('../controllers/adminController');

// Admin Dashboard Controllers
const {
    getPlatformStats,
    getAllUsers,
    getUserDetails,
    updateUserStatus,
    deleteUser,
    getUserAnalytics,
    getBusinessIntelligence
} = require('../controllers/adminDashboardController');

// All admin routes require authentication and admin role
router.use(protect);

// Admin-only middleware
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Admin access required'
        });
    }
    next();
};

router.use(requireAdmin);

// === Dashboard & Analytics ===
router.get('/stats', getPlatformStats);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/business-intelligence', getBusinessIntelligence);

// === User Management ===
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// === Recruiter Management ===
router.get('/recruiters/pending', getPendingRecruiters);
router.get('/recruiters', getAllRecruiters);
router.patch('/recruiters/:id/approve', approveRecruiter);
router.patch('/recruiters/:id/reject', rejectRecruiter);

// === Legacy User Actions (kept for backward compatibility) ===
router.patch('/users/:id/suspend', suspendUser);
router.patch('/users/:id/reactivate', reactivateUser);

module.exports = router;
