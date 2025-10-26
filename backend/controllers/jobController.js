const Job = require('../models/Job');
const User = require('../models/User');
const { mapExperienceLevelToModel, mapJobTypeToModel } = require('../../config/mappers');

const createJob = async (req, res, next) => {
    try {
        const jobData = {
            ...req.body,
            postedBy: req.user._id,
        };

        const job = await Job.create(jobData);

        // Add job to user's jobs_posted array
        await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { jobs_posted: job._id } },
            { new: true }
        );

        return res.status(201).json({
            job,
            message: 'Job posted successfully'
        });
    } catch (error) {
        return next(error);
    }
};

const getJobs = async (req, res, next) => {
    try {
        // Support both backend-native query keys and UI-friendly alternatives
        const {
            search: qSearch,
            location: qLocation,
            skills: qSkills,
            salary_min: qSalaryMin,
            job_type: qJobType,
            experience_level: qExperienceLevel,
            status: qStatus,
            page: qPage,
            limit: qLimit,
            sort: qSort,
            // Alternatives from frontend/UI
            keyword,
            salaryMin,
            jobType,
            experienceLevel,
        } = req.query;

        const search = qSearch || keyword || undefined;
        const location = qLocation || undefined;
        const skills = qSkills || undefined;
        const salary_min = qSalaryMin || (salaryMin != null && salaryMin !== '' ? Number(salaryMin) : undefined);
        const job_type = qJobType || mapJobTypeToModel(jobType);
        const experience_level = qExperienceLevel || mapExperienceLevelToModel(experienceLevel);
        const status = qStatus || 'active';
        const page = Number(qPage || 1);
        const limit = Number(qLimit || 10);
        const sort = qSort || '-createdAt';

        const query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$text = { $search: search };
        }

        if (location) {
            query.location = new RegExp(location, 'i');
        }

        if (skills) {
            const skillArray = skills.split(',').map((s) => s.trim());
            query.skills = { $in: skillArray };
        }

        if (salary_min) {
            query['salary.min'] = { $gte: Number(salary_min) };
        }

        if (job_type) {
            query.jobType = job_type;
        }

        if (experience_level) {
            query.experienceLevel = experience_level;
        }

        const sortFields = sort.split(',').reduce((acc, field) => {
            if (field.startsWith('-')) {
                acc[field.substring(1)] = -1;
            } else {
                acc[field] = 1;
            }
            return acc;
        }, {});

        const skip = (page - 1) * limit;

        const jobs = await Job.find(query)
            .sort(sortFields)
            .skip(skip)
            .limit(limit)
            .populate('postedBy', 'firstName lastName email');

        const total = await Job.countDocuments(query);

        return res.json({
            jobs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return next(error);
    }
};

const getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id).populate('postedBy', 'firstName lastName email');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.incrementViewCount();

        return res.json({ job });
    } catch (error) {
        return next(error);
    }
};

const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (!job.isOwner(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        Object.assign(job, req.body);
        await job.save();

        return res.json({ job });
    } catch (error) {
        return next(error);
    }
};

const deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (!job.isOwner(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();

        // Remove job from user's jobs_posted array
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { jobs_posted: id } },
            { new: true }
        );

        return res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        return next(error);
    }
};

const getMyJobs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const jobs = await Job.find({ postedBy: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Job.countDocuments({ postedBy: req.user._id });

        return res.json({
            jobs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Save a job for later
 * 
 * @route POST /api/jobs/:id/save
 * @access Private (Job Seekers)
 */
const saveJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const userId = req.user._id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                status: 'error',
                message: 'Job not found'
            });
        }

        // Check if already saved
        const user = await User.findById(userId);
        if (user.savedJobs && user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Job already saved'
            });
        }

        // Add to saved jobs with timestamp
        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    savedJobs: {
                        job: jobId,
                        savedAt: new Date()
                    }
                }
            }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Job saved successfully'
        });

    } catch (error) {
        return next(error);
    }
};

/**
 * Unsave a job
 * 
 * @route DELETE /api/jobs/:id/save
 * @access Private (Job Seekers)
 */
const unsaveJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const userId = req.user._id;

        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { savedJobs: { job: jobId } }
            }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Job removed from saved'
        });

    } catch (error) {
        return next(error);
    }
};

/**
 * Get all saved jobs
 * 
 * @route GET /api/jobs/saved
 * @access Private (Job Seekers)
 */
const getSavedJobs = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: 'savedJobs.job',
            select: 'title description location salary jobType experienceLevel skills company status',
            populate: {
                path: 'company',
                select: 'name logo'
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Filter out null jobs (deleted jobs)
        const savedJobs = user.savedJobs
            .filter(item => item.job !== null)
            .map(item => ({
                ...item.job.toObject(),
                savedAt: item.savedAt
            }));

        return res.status(200).json({
            status: 'success',
            results: savedJobs.length,
            data: savedJobs
        });

    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
    saveJob,
    unsaveJob,
    getSavedJobs
};
