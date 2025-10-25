const Job = require('../models/Job');

const createJob = async (req, res, next) => {
    try {
        const jobData = {
            ...req.body,
            postedBy: req.user._id,
        };

        const job = await Job.create(jobData);

        return res.status(201).json({ job });
    } catch (error) {
        return next(error);
    }
};

const getJobs = async (req, res, next) => {
    try {
        const {
            search,
            location,
            skills,
            salary_min,
            job_type,
            experience_level,
            status = 'active',
            page = 1,
            limit = 10,
            sort = '-createdAt',
        } = req.query;

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

        const skip = (Number(page) - 1) * Number(limit);

        const jobs = await Job.find(query)
            .sort(sortFields)
            .skip(skip)
            .limit(Number(limit))
            .populate('postedBy', 'firstName lastName email');

        const total = await Job.countDocuments(query);

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

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
};
