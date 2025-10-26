const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { protect, authorize } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/message', chatbotController.sendMessage);
router.get('/starters', chatbotController.getConversationStarters);
router.post('/job-suggestions', chatbotController.getJobSuggestions);

// Admin routes
router.get('/analytics',
    protect,
    authorize('admin'),
    chatbotController.getChatbotAnalytics
);

module.exports = router;
