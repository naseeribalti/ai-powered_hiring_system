/**
 * Notification Service
 * 
 * Handles all notification-related operations:
 * - Create notifications
 * - Send email notifications
 * - Real-time notifications (future: WebSocket)
 * - Notification preferences
 * 
 * Clean and easy-to-understand code with clear workflow
 */

const mongoose = require('mongoose');

/**
 * Notification Schema
 * 
 * Stores all system notifications for users
 */
const notificationSchema = new mongoose.Schema(
    {
        // Who receives this notification
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        // Notification content
        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        // Notification type for icon/color display
        type: {
            type: String,
            enum: ['application', 'message', 'alert', 'success', 'info', 'job_update'],
            default: 'info'
        },

        // Link to navigate when clicked
        link: {
            type: String,
            default: null
        },

        // Related entities (optional)
        relatedJob: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },

        relatedApplication: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        },

        // Status
        read: {
            type: Boolean,
            default: false,
            index: true
        },

        readAt: {
            type: Date,
            default: null
        },

        // Email notification sent?
        emailSent: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Indexes for performance
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Auto-delete after 30 days

const Notification = mongoose.model('Notification', notificationSchema);

/**
 * Create a new notification
 * 
 * @param {Object} data - Notification data
 * @param {String} data.recipient - User ID who receives notification
 * @param {String} data.title - Notification title
 * @param {String} data.message - Notification message
 * @param {String} data.type - Notification type (application, message, alert, etc.)
 * @param {String} data.link - Optional link to navigate
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (data) => {
    try {
        const notification = await Notification.create({
            recipient: data.recipient,
            title: data.title,
            message: data.message,
            type: data.type || 'info',
            link: data.link || null,
            relatedJob: data.relatedJob || null,
            relatedApplication: data.relatedApplication || null
        });

        console.log(`✅ Notification created for user ${data.recipient}`);

        return notification;

    } catch (error) {
        console.error('❌ Error creating notification:', error.message);
        throw error;
    }
};

/**
 * Get all notifications for a user
 * 
 * @param {String} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} List of notifications
 */
const getUserNotifications = async (userId, options = {}) => {
    try {
        const {
            limit = 50,
            skip = 0,
            unreadOnly = false
        } = options;

        const query = { recipient: userId };

        if (unreadOnly) {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('relatedJob', 'title company')
            .populate('relatedApplication', 'status');

        return notifications;

    } catch (error) {
        console.error('❌ Error fetching notifications:', error.message);
        throw error;
    }
};

/**
 * Get unread notification count
 * 
 * @param {String} userId - User ID
 * @returns {Promise<Number>} Count of unread notifications
 */
const getUnreadCount = async (userId) => {
    try {
        const count = await Notification.countDocuments({
            recipient: userId,
            read: false
        });

        return count;

    } catch (error) {
        console.error('❌ Error counting unread notifications:', error.message);
        throw error;
    }
};

/**
 * Mark notification as read
 * 
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for authorization)
 * @returns {Promise<Object>} Updated notification
 */
const markAsRead = async (notificationId, userId) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                recipient: userId,
                read: false
            },
            {
                read: true,
                readAt: new Date()
            },
            { new: true }
        );

        if (!notification) {
            throw new Error('Notification not found or already read');
        }

        return notification;

    } catch (error) {
        console.error('❌ Error marking notification as read:', error.message);
        throw error;
    }
};

/**
 * Mark all notifications as read
 * 
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Update result
 */
const markAllAsRead = async (userId) => {
    try {
        const result = await Notification.updateMany(
            {
                recipient: userId,
                read: false
            },
            {
                read: true,
                readAt: new Date()
            }
        );

        console.log(`✅ Marked ${result.modifiedCount} notifications as read for user ${userId}`);

        return result;

    } catch (error) {
        console.error('❌ Error marking all as read:', error.message);
        throw error;
    }
};

/**
 * Delete a notification
 * 
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for authorization)
 * @returns {Promise<Object>} Deleted notification
 */
const deleteNotification = async (notificationId, userId) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        return notification;

    } catch (error) {
        console.error('❌ Error deleting notification:', error.message);
        throw error;
    }
};

/**
 * Clear all notifications for a user
 * 
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Delete result
 */
const clearAllNotifications = async (userId) => {
    try {
        const result = await Notification.deleteMany({
            recipient: userId
        });

        console.log(`✅ Cleared ${result.deletedCount} notifications for user ${userId}`);

        return result;

    } catch (error) {
        console.error('❌ Error clearing notifications:', error.message);
        throw error;
    }
};

// ============================================
// Pre-built notification templates
// ============================================

/**
 * Notify when application is submitted
 */
const notifyApplicationSubmitted = async (userId, jobTitle, applicationId) => {
    return createNotification({
        recipient: userId,
        title: 'Application Submitted',
        message: `Your application for ${jobTitle} has been submitted successfully.`,
        type: 'success',
        link: `/applications/${applicationId}`,
        relatedApplication: applicationId
    });
};

/**
 * Notify when application status changes
 */
const notifyApplicationStatusChange = async (userId, jobTitle, status, applicationId) => {
    const statusMessages = {
        'reviewed': `Your application for ${jobTitle} is being reviewed.`,
        'shortlisted': `Great news! You've been shortlisted for ${jobTitle}.`,
        'interview': `You've been invited for an interview for ${jobTitle}.`,
        'rejected': `Unfortunately, your application for ${jobTitle} was not successful.`,
        'accepted': `Congratulations! Your application for ${jobTitle} has been accepted.`
    };

    return createNotification({
        recipient: userId,
        title: 'Application Status Update',
        message: statusMessages[status] || `Your application status for ${jobTitle} has been updated to ${status}.`,
        type: status === 'rejected' ? 'alert' : status === 'accepted' ? 'success' : 'info',
        link: `/applications/${applicationId}`,
        relatedApplication: applicationId
    });
};

/**
 * Notify recruiter about new application
 */
const notifyRecruiterNewApplication = async (recruiterId, candidateName, jobTitle, applicationId) => {
    return createNotification({
        recipient: recruiterId,
        title: 'New Application Received',
        message: `${candidateName} has applied for ${jobTitle}.`,
        type: 'application',
        link: `/recruiter/applications/${applicationId}`,
        relatedApplication: applicationId
    });
};

/**
 * Notify about new job matching user profile
 */
const notifyNewJobMatch = async (userId, jobTitle, jobId) => {
    return createNotification({
        recipient: userId,
        title: 'New Job Match',
        message: `We found a job that matches your profile: ${jobTitle}`,
        type: 'job_update',
        link: `/jobs/${jobId}`,
        relatedJob: jobId
    });
};

/**
 * Notify about saved job status change
 */
const notifySavedJobUpdate = async (userId, jobTitle, status, jobId) => {
    let message = '';

    if (status === 'closed') {
        message = `The job "${jobTitle}" you saved has been closed.`;
    } else if (status === 'updated') {
        message = `The job "${jobTitle}" you saved has been updated.`;
    }

    return createNotification({
        recipient: userId,
        title: 'Saved Job Update',
        message,
        type: 'info',
        link: `/jobs/${jobId}`,
        relatedJob: jobId
    });
};

module.exports = {
    // Core functions
    createNotification,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,

    // Template functions
    notifyApplicationSubmitted,
    notifyApplicationStatusChange,
    notifyRecruiterNewApplication,
    notifyNewJobMatch,
    notifySavedJobUpdate
};
