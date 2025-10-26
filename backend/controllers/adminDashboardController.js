/**
 * Admin Dashboard - User Management
 * View and manage all users (recruiters and job seekers)
 */

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const adminAnalyticsService = require('../services/adminAnalyticsService');

/**
 * @desc    Get platform statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
exports.getPlatformStats = async (req, res, next) => {
    try {
        // Calculate date for recent registrations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Run all independent database queries in parallel using Promise.all
        const [
            totalRecruiters,
            totalJobSeekers,
            pendingRecruiters,
            activeRecruiters,
            totalJobs,
            activeJobs,
            closedJobs,
            totalApplications,
            pendingApplications,
            acceptedApplications,
            newUsersLastWeek,
            newJobsLastWeek
        ] = await Promise.all([
            User.countDocuments({ role: 'recruiter' }),
            User.countDocuments({ role: 'jobSeeker' }),
            User.countDocuments({ role: 'recruiter', status: 'pending_approval' }),
            User.countDocuments({ role: 'recruiter', status: 'active' }),
            Job.countDocuments(),
            Job.countDocuments({ status: 'active' }),
            Job.countDocuments({ status: 'closed' }),
            Application.countDocuments(),
            Application.countDocuments({ status: 'pending' }),
            Application.countDocuments({ status: 'accepted' }),
            User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
            Job.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                users: {
                    total: totalRecruiters + totalJobSeekers,
                    recruiters: {
                        total: totalRecruiters,
                        active: activeRecruiters,
                        pending: pendingRecruiters
                    },
                    jobSeekers: {
                        total: totalJobSeekers
                    },
                    newLastWeek: newUsersLastWeek
                },
                jobs: {
                    total: totalJobs,
                    active: activeJobs,
                    closed: closedJobs,
                    newLastWeek: newJobsLastWeek
                },
                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                    accepted: acceptedApplications,
                    successRate: totalApplications > 0
                        ? ((acceptedApplications / totalApplications) * 100).toFixed(2)
                        : 0
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all users with filters
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const {
            role,
            status,
            search,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (role) filter.role = role;
        if (status) filter.status = status;

        // Search functionality
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const users = await User.find(filter)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            results: users.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user details with activity
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        let activityData = {};

        // Get activity based on role
        if (user.role === 'recruiter') {
            const jobs = await Job.find({ postedBy: user._id })
                .select('title status createdAt applications')
                .sort('-createdAt')
                .limit(10);

            const totalJobs = await Job.countDocuments({ postedBy: user._id });
            const activeJobs = await Job.countDocuments({
                postedBy: user._id,
                status: 'active'
            });

            activityData = {
                jobs: {
                    total: totalJobs,
                    active: activeJobs,
                    recent: jobs
                }
            };
        } else if (user.role === 'jobSeeker') {
            const applications = await Application.find({ applicant: user._id })
                .populate('job', 'title company')
                .select('status appliedAt')
                .sort('-appliedAt')
                .limit(10);

            const totalApplications = await Application.countDocuments({
                applicant: user._id
            });
            const acceptedApplications = await Application.countDocuments({
                applicant: user._id,
                status: 'accepted'
            });

            activityData = {
                applications: {
                    total: totalApplications,
                    accepted: acceptedApplications,
                    successRate: totalApplications > 0
                        ? ((acceptedApplications / totalApplications) * 100).toFixed(2)
                        : 0,
                    recent: applications
                }
            };
        }

        res.status(200).json({
            status: 'success',
            data: {
                user,
                activity: activityData
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user status (suspend/activate)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin)
 */
exports.updateUserStatus = async (req, res, next) => {
    try {
        const { status, reason } = req.body;

        if (!['active', 'suspended', 'inactive'].includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid status. Must be: active, suspended, or inactive'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Don't allow suspending admins
        if (user.role === 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Cannot modify admin user status'
            });
        }

        user.status = status;
        await user.save();

        // TODO: Send notification to user about status change
        // await notificationService.notifyStatusChange(user._id, status, reason);

        res.status(200).json({
            status: 'success',
            message: `User status updated to ${status}`,
            data: {
                userId: user._id,
                newStatus: status,
                reason: reason || 'No reason provided'
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Don't allow deleting admins
        if (user.role === 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Cannot delete admin user'
            });
        }

        // Delete related data based on role
        if (user.role === 'recruiter') {
            // Delete all jobs posted by this recruiter
            await Job.deleteMany({ postedBy: user._id });
        } else if (user.role === 'jobSeeker') {
            // Delete all applications by this job seeker
            await Application.deleteMany({ applicant: user._id });
        }

        await user.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'User account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user analytics
 * @route   GET /api/admin/analytics/users
 * @access  Private (Admin)
 */
exports.getUserAnalytics = async (req, res, next) => {
    try {
        const { period = '30' } = req.query; // days
        const daysAgo = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        // User registration trends
        const userTrends = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        role: '$role'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.date': 1 }
            }
        ]);

        // Most active users (by applications for job seekers, by jobs for recruiters)
        const topJobSeekers = await Application.aggregate([
            {
                $group: {
                    _id: '$applicant',
                    applicationCount: { $sum: 1 }
                }
            },
            {
                $sort: { applicationCount: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
                    email: '$user.email',
                    applicationCount: 1
                }
            }
        ]);

        const topRecruiters = await Job.aggregate([
            {
                $group: {
                    _id: '$postedBy',
                    jobCount: { $sum: 1 }
                }
            },
            {
                $sort: { jobCount: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    companyName: '$user.companyName',
                    email: '$user.email',
                    jobCount: 1
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                period: `Last ${daysAgo} days`,
                registrationTrends: userTrends,
                topJobSeekers,
                topRecruiters
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = exports;

/**
 * @desc    Get comprehensive business intelligence
 * @route   GET /api/admin/analytics/business-intelligence
 * @access  Private (Admin)
 */
exports.getBusinessIntelligence = async (req, res, next) => {
    try {
        const [
            skillsDemand,
            salaryTrends,
            geographicTrends,
            successRates,
            engagementMetrics,
            healthIndicators
        ] = await Promise.all([
            adminAnalyticsService.getSkillDemandAnalytics(),
            adminAnalyticsService.getSalaryTrends(),
            adminAnalyticsService.getGeographicTrends(),
            adminAnalyticsService.getSuccessRateByExperience(),
            adminAnalyticsService.getUserEngagementMetrics(30),
            adminAnalyticsService.getPlatformHealthIndicators()
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                platformHealth: healthIndicators,
                userEngagement: engagementMetrics,
                marketInsights: {
                    topSkills: skillsDemand,
                    salaryTrends,
                    geographicTrends
                },
                performanceMetrics: {
                    successRatesByExperience: successRates
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
