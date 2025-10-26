/**
 * Role-based authorization middleware
 * Restricts route access to specific user roles
 */

/**
 * Restrict route access to specified roles
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'recruiter', 'jobSeeker')
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'You must be logged in to access this resource'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

/**
 * Require active recruiter status
 * Checks if user is a recruiter with active status
 */
const requireActiveRecruiter = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'You must be logged in to access this resource'
        });
    }

    if (!req.user.isActiveRecruiter) {
        return res.status(403).json({
            status: 'error',
            message: 'Only active recruiters can perform this action. Your account may be pending approval.'
        });
    }

    next();
};

const Job = require('../models/Job');

/**
 * Check if user can manage a specific job
 * Verifies job ownership for recruiters by checking the Job document directly
 */
const canManageJob = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'You must be logged in to access this resource'
        });
    }

    const jobId = req.params.id || req.params.jobId;

    if (!jobId) {
        return res.status(400).json({
            status: 'error',
            message: 'Job ID is required'
        });
    }

    try {
        // Admin can manage any job
        if (req.user.role === 'admin') {
            return next();
        }

        // Load job and verify ownership
        const job = await Job.findById(jobId).select('postedBy');
        if (!job) {
            return res.status(404).json({
                status: 'error',
                message: 'Job not found'
            });
        }

        if (job.postedBy && job.postedBy.toString() === req.user._id.toString()) {
            return next();
        }

        return res.status(403).json({
            status: 'error',
            message: 'You do not have permission to manage this job'
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Require admin role
 * Shortcut middleware for admin-only routes
 */
const requireAdmin = restrictTo('admin');

/**
 * Require recruiter or admin role
 * Allows both recruiters and admins to access route
 */
const requireRecruiterOrAdmin = restrictTo('recruiter', 'admin');

/**
 * Check account status
 * Ensures user account is active and not suspended
 */
const checkAccountStatus = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'You must be logged in to access this resource'
        });
    }

    if (req.user.status === 'suspended') {
        return res.status(403).json({
            status: 'error',
            message: 'Your account has been suspended. Please contact support.'
        });
    }

    if (req.user.status === 'inactive') {
        return res.status(403).json({
            status: 'error',
            message: 'Your account is inactive. Please contact support.'
        });
    }

    if (req.user.status === 'pending_approval') {
        return res.status(403).json({
            status: 'error',
            message: 'Your account is pending approval. Please wait for administrator review.'
        });
    }

    if (!req.user.isActive) {
        return res.status(403).json({
            status: 'error',
            message: 'Your account is not active. Please contact support.'
        });
    }

    next();
};

module.exports = {
    restrictTo,
    requireActiveRecruiter,
    canManageJob,
    requireAdmin,
    requireRecruiterOrAdmin,
    checkAccountStatus
};
