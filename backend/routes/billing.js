const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getPlans,
    getMySubscription,
    subscribe,
    cancel,
    webhook,
} = require('../controllers/billingController');

// Public
router.get('/plans', getPlans);
router.post('/webhook', webhook);

// Authenticated (Recruiters/Admins primarily, but allow any logged-in user to subscribe)
router.get('/subscription', protect, getMySubscription);
router.post('/subscribe', protect, authorize('recruiter', 'admin', 'jobSeeker'), subscribe);
router.post('/cancel', protect, authorize('recruiter', 'admin', 'jobSeeker'), cancel);

module.exports = router;
