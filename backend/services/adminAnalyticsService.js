/**
 * Admin Analytics Service
 * Advanced analytics and business intelligence for admin dashboard
 */

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

/**
 * Get skill demand analytics
 * Shows most in-demand skills based on job postings
 */
exports.getSkillDemandAnalytics = async () => {
    const skillsDemand = await Job.aggregate([
        { $match: { status: 'active' } },
        { $unwind: '$skills' },
        {
            $group: {
                _id: '$skills',
                jobCount: { $sum: 1 }
            }
        },
        { $sort: { jobCount: -1 } },
        { $limit: 20 },
        {
            $project: {
                skill: '$_id',
                demand: '$jobCount',
                _id: 0
            }
        }
    ]);
    return skillsDemand;
};

/**
 * Get salary trend analytics
 * Analyze salary ranges by experience level and job type
 */
exports.getSalaryTrends = async () => {
    const salaryTrends = await Job.aggregate([
        {
            $match: {
                'salary.min': { $exists: true, $gt: 0 }
            }
        },
        {
            $group: {
                _id: {
                    experienceLevel: '$experienceLevel',
                    jobType: '$jobType'
                },
                avgSalaryMin: { $avg: '$salary.min' },
                avgSalaryMax: { $avg: '$salary.max' },
                jobCount: { $sum: 1 }
            }
        },
        {
            $project: {
                experienceLevel: '$_id.experienceLevel',
                jobType: '$_id.jobType',
                averageSalary: {
                    $avg: ['$avgSalaryMin', '$avgSalaryMax']
                },
                salaryRange: {
                    min: { $round: ['$avgSalaryMin', 0] },
                    max: { $round: ['$avgSalaryMax', 0] }
                },
                jobCount: 1,
                _id: 0
            }
        },
        { $sort: { averageSalary: -1 } }
    ]);
    return salaryTrends;
};

/**
 * Get geographic hiring patterns
 * Shows where jobs are being posted and where applications come from
 */
exports.getGeographicTrends = async () => {
    const jobsByLocation = await Job.aggregate([
        { $match: { location: { $exists: true, $ne: '' } } },
        {
            $group: {
                _id: '$location',
                jobCount: { $sum: 1 },
                activeJobs: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                }
            }
        },
        { $sort: { jobCount: -1 } },
        { $limit: 15 },
        {
            $project: {
                location: '$_id',
                jobCount: 1,
                activeJobs: 1,
                _id: 0
            }
        }
    ]);
    return jobsByLocation;
};

/**
 * Get application success rate by experience level
 * Helps understand which experience levels have better success
 */
exports.getSuccessRateByExperience = async () => {
    const successRates = await Application.aggregate([
        {
            $lookup: {
                from: 'jobs',
                localField: 'job',
                foreignField: '_id',
                as: 'jobDetails'
            }
        },
        { $unwind: '$jobDetails' },
        {
            $group: {
                _id: '$jobDetails.experienceLevel',
                totalApplications: { $sum: 1 },
                acceptedApplications: {
                    $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
                },
                interviewApplications: {
                    $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] }
                }
            }
        },
        {
            $project: {
                experienceLevel: '$_id',
                totalApplications: 1,
                acceptedApplications: 1,
                interviewApplications: 1,
                successRate: {
                    $multiply: [
                        { $divide: ['$acceptedApplications', '$totalApplications'] },
                        100
                    ]
                },
                interviewRate: {
                    $multiply: [
                        { $divide: ['$interviewApplications', '$totalApplications'] },
                        100
                    ]
                },
                _id: 0
            }
        },
        { $sort: { successRate: -1 } }
    ]);
    return successRates;
};

/**
 * Get user engagement metrics
 * Track daily/monthly active users and engagement patterns
 */
exports.getUserEngagementMetrics = async (days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Users who logged in (created applications or jobs) in the period
    const activeJobSeekers = await Application.distinct('applicant', {
        appliedAt: { $gte: startDate }
    });

    const activeRecruiters = await Job.distinct('postedBy', {
        createdAt: { $gte: startDate }
    });

    // Total registered users
    const totalJobSeekers = await User.countDocuments({ role: 'jobSeeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter', status: 'active' });

    // Calculate engagement rates
    const jobSeekerEngagement = totalJobSeekers > 0
        ? ((activeJobSeekers.length / totalJobSeekers) * 100).toFixed(2)
        : 0;

    const recruiterEngagement = totalRecruiters > 0
        ? ((activeRecruiters.length / totalRecruiters) * 100).toFixed(2)
        : 0;

    return {
        period: `Last ${days} days`,
        jobSeekers: {
            total: totalJobSeekers,
            active: activeJobSeekers.length,
            engagementRate: `${jobSeekerEngagement}%`
        },
        recruiters: {
            total: totalRecruiters,
            active: activeRecruiters.length,
            engagementRate: `${recruiterEngagement}%`
        }
    };
};

/**
 * Get platform health indicators
 * Key metrics for platform performance monitoring
 */
exports.getPlatformHealthIndicators = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Growth metrics
    const newUsersThisMonth = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    const newUsersLastMonth = await User.countDocuments({
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const userGrowth = newUsersLastMonth > 0
        ? (((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(2)
        : 100;

    // Job posting activity
    const jobsThisMonth = await Job.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    const jobsLastMonth = await Job.countDocuments({
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const jobGrowth = jobsLastMonth > 0
        ? (((jobsThisMonth - jobsLastMonth) / jobsLastMonth) * 100).toFixed(2)
        : 100;

    // Application activity
    const applicationsThisMonth = await Application.countDocuments({
        appliedAt: { $gte: thirtyDaysAgo }
    });

    const applicationsLastMonth = await Application.countDocuments({
        appliedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const applicationGrowth = applicationsLastMonth > 0
        ? (((applicationsThisMonth - applicationsLastMonth) / applicationsLastMonth) * 100).toFixed(2)
        : 100;

    // Average time to first application (platform efficiency)
    const recentJobs = await Job.find({
        createdAt: { $gte: thirtyDaysAgo }
    }).limit(100);

    let totalTimeToFirstApp = 0;
    let jobsWithApps = 0;

    for (const job of recentJobs) {
        const firstApp = await Application.findOne({ job: job._id })
            .sort('appliedAt')
            .select('appliedAt');

        if (firstApp) {
            const timeDiff = firstApp.appliedAt - job.createdAt;
            totalTimeToFirstApp += timeDiff;
            jobsWithApps++;
        }
    }

    const avgTimeToFirstApp = jobsWithApps > 0
        ? Math.round(totalTimeToFirstApp / jobsWithApps / (1000 * 60 * 60)) // hours
        : null;

    return {
        userGrowth: `${userGrowth}%`,
        jobGrowth: `${jobGrowth}%`,
        applicationGrowth: `${applicationGrowth}%`,
        newUsersThisMonth,
        jobsThisMonth,
        applicationsThisMonth,
        avgTimeToFirstApplication: avgTimeToFirstApp ? `${avgTimeToFirstApp} hours` : 'N/A',
        healthScore: calculateHealthScore(userGrowth, jobGrowth, applicationGrowth)
    };
};

/**
 * Calculate overall platform health score (0-100)
 */
function calculateHealthScore(userGrowth, jobGrowth, applicationGrowth) {
    const avgGrowth = (parseFloat(userGrowth) + parseFloat(jobGrowth) + parseFloat(applicationGrowth)) / 3;

    let score = 50; // Base score

    // Add points for positive growth
    if (avgGrowth > 0) score += Math.min(avgGrowth / 2, 30);

    // Deduct points for negative growth
    if (avgGrowth < 0) score += Math.max(avgGrowth / 2, -30);

    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));

    return {
        score: Math.round(score),
        status: score >= 70 ? 'Excellent' : score >= 50 ? 'Good' : score >= 30 ? 'Fair' : 'Needs Attention'
    };
}

module.exports = exports;
