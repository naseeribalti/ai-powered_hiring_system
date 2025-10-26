const User = require('../models/User');

/**
 * Get all pending recruiter approvals
 * @route GET /api/admin/recruiters/pending
 * @access Private (Admin only)
 */
const getPendingRecruiters = async (req, res, next) => {
    try {
        const pendingRecruiters = await User.find({
            role: 'recruiter',
            status: 'pending_approval'
        })
            .select('firstName lastName email companyName companyWebsite phone createdAt')
            .sort('-createdAt');

        return res.status(200).json({
            status: 'success',
            results: pendingRecruiters.length,
            data: {
                recruiters: pendingRecruiters
            }
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Approve a recruiter account
 * @route PATCH /api/admin/recruiters/:id/approve
 * @access Private (Admin only)
 */
const approveRecruiter = async (req, res, next) => {
    try {
        const recruiter = await User.findOne({
            _id: req.params.id,
            role: 'recruiter'
        });

        if (!recruiter) {
            return res.status(404).json({
                status: 'error',
                message: 'Recruiter not found'
            });
        }

        if (recruiter.status !== 'pending_approval') {
            return res.status(400).json({
                status: 'error',
                message: 'Recruiter is not pending approval'
            });
        }

        recruiter.status = 'active';
        await recruiter.save();

        return res.status(200).json({
            status: 'success',
            message: 'Recruiter approved successfully',
            data: {
                recruiter: recruiter.toJSON()
            }
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Reject a recruiter account
 * @route PATCH /api/admin/recruiters/:id/reject
 * @access Private (Admin only)
 */
const rejectRecruiter = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const recruiter = await User.findOne({
            _id: req.params.id,
            role: 'recruiter'
        });

        if (!recruiter) {
            return res.status(404).json({
                status: 'error',
                message: 'Recruiter not found'
            });
        }

        if (recruiter.status !== 'pending_approval') {
            return res.status(400).json({
                status: 'error',
                message: 'Recruiter is not pending approval'
            });
        }

        recruiter.status = 'inactive';
        await recruiter.save();

        // TODO: Send rejection email with reason
        // await sendRejectionEmail(recruiter.email, reason);

        return res.status(200).json({
            status: 'success',
            message: 'Recruiter rejected successfully',
            data: {
                recruiter: recruiter.toJSON()
            }
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Suspend a user account
 * @route PATCH /api/admin/users/:id/suspend
 * @access Private (Admin only)
 */
const suspendUser = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Cannot suspend admin accounts'
            });
        }

        user.status = 'suspended';
        user.isActive = false;
        await user.save();

        // TODO: Send suspension email with reason
        // await sendSuspensionEmail(user.email, reason);

        return res.status(200).json({
            status: 'success',
            message: 'User suspended successfully',
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Reactivate a suspended user account
 * @route PATCH /api/admin/users/:id/reactivate
 * @access Private (Admin only)
 */
const reactivateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user.status !== 'suspended' && user.status !== 'inactive') {
            return res.status(400).json({
                status: 'error',
                message: 'User is not suspended or inactive'
            });
        }

        user.status = 'active';
        user.isActive = true;
        await user.save();

        // TODO: Send reactivation email
        // await sendReactivationEmail(user.email);

        return res.status(200).json({
            status: 'success',
            message: 'User reactivated successfully',
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Get all recruiters (active, pending, inactive)
 * @route GET /api/admin/recruiters
 * @access Private (Admin only)
 */
const getAllRecruiters = async (req, res, next) => {
    try {
        const { status } = req.query;

        const filter = { role: 'recruiter' };
        if (status) {
            filter.status = status;
        }

        const recruiters = await User.find(filter)
            .select('firstName lastName email companyName status createdAt lastLogin')
            .sort('-createdAt');

        return res.status(200).json({
            status: 'success',
            results: recruiters.length,
            data: {
                recruiters
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getPendingRecruiters,
    approveRecruiter,
    rejectRecruiter,
    suspendUser,
    reactivateUser,
    getAllRecruiters
};
