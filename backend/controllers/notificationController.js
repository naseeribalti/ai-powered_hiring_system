/**
 * Notifications Controller
 * 
 * Handles HTTP requests for notifications
 * Clean, simple, and easy to understand
 */

const notificationService = require('../services/notificationService');

/**
 * Get all notifications for current user
 * 
 * @route GET /api/notifications
 * @access Private
 */
const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { limit, skip, unreadOnly } = req.query;

        const options = {
            limit: parseInt(limit) || 50,
            skip: parseInt(skip) || 0,
            unreadOnly: unreadOnly === 'true'
        };

        const notifications = await notificationService.getUserNotifications(userId, options);

        return res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: notifications
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return next(error);
    }
};

/**
 * Get unread notification count
 * 
 * @route GET /api/notifications/unread-count
 * @access Private
 */
const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const count = await notificationService.getUnreadCount(userId);

        return res.status(200).json({
            status: 'success',
            data: {
                count
            }
        });

    } catch (error) {
        console.error('Error getting unread count:', error);
        return next(error);
    }
};

/**
 * Mark notification as read
 * 
 * @route PUT /api/notifications/:id/read
 * @access Private
 */
const markAsRead = async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        const notification = await notificationService.markAsRead(notificationId, userId);

        return res.status(200).json({
            status: 'success',
            message: 'Notification marked as read',
            data: notification
        });

    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }

        console.error('Error marking as read:', error);
        return next(error);
    }
};

/**
 * Mark all notifications as read
 * 
 * @route PUT /api/notifications/read-all
 * @access Private
 */
const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const result = await notificationService.markAllAsRead(userId);

        return res.status(200).json({
            status: 'success',
            message: `${result.modifiedCount} notifications marked as read`,
            data: {
                modifiedCount: result.modifiedCount
            }
        });

    } catch (error) {
        console.error('Error marking all as read:', error);
        return next(error);
    }
};

/**
 * Delete a notification
 * 
 * @route DELETE /api/notifications/:id
 * @access Private
 */
const deleteNotification = async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        await notificationService.deleteNotification(notificationId, userId);

        return res.status(200).json({
            status: 'success',
            message: 'Notification deleted'
        });

    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }

        console.error('Error deleting notification:', error);
        return next(error);
    }
};

/**
 * Clear all notifications
 * 
 * @route DELETE /api/notifications
 * @access Private
 */
const clearAll = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const result = await notificationService.clearAllNotifications(userId);

        return res.status(200).json({
            status: 'success',
            message: `${result.deletedCount} notifications cleared`,
            data: {
                deletedCount: result.deletedCount
            }
        });

    } catch (error) {
        console.error('Error clearing notifications:', error);
        return next(error);
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
};
