const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createTicket,
    getMyTickets,
    getTicket,
    addMessage,
    closeTicket,
    getAllTickets,
    getTicketAdmin,
    updateTicket,
    addAdminMessage,
    getSupportAnalytics,
} = require('../controllers/supportController');

// User routes (authenticated)
router.post('/tickets', protect, createTicket);
router.get('/tickets', protect, getMyTickets);
router.get('/tickets/:id', protect, getTicket);
router.post('/tickets/:id/messages', protect, addMessage);
router.patch('/tickets/:id/close', protect, closeTicket);

// Admin routes
router.get('/admin/tickets', protect, authorize('admin'), getAllTickets);
router.get('/admin/tickets/:id', protect, authorize('admin'), getTicketAdmin);
router.patch('/admin/tickets/:id', protect, authorize('admin'), updateTicket);
router.post('/admin/tickets/:id/messages', protect, authorize('admin'), addAdminMessage);
router.get('/admin/analytics', protect, authorize('admin'), getSupportAnalytics);

module.exports = router;
