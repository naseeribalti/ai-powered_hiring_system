const Application = require('../models/Application');
const Job = require('../models/Job');

const applyToJob = async (req, res, next) => {
    try {
        const { jobId, coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.status !== 'active') {
            return res.status(400).json({ message: 'This job posting is no longer active' });
        }

        const existingApplication = await Application.findOne({
            applicant: req.user._id,
            job: jobId,
        });

        if (existingApplication) {
            return res.status(409).json({ message: 'You have already applied to this job' });
        }

        const application = await Application.create({
            applicant: req.user._id,
            job: jobId,
            coverLetter,
        });

        await application.updateStatus('pending', req.user._id);

        job.applications.push(application._id);
        await job.save();

        await application.populate('applicant', 'firstName lastName email');
        await application.populate('job', 'title company');

        return res.status(201).json({ application });
    } catch (error) {
        return next(error);
    }
};

const getMyApplications = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { applicant: req.user._id };
        if (status) {
            query.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const applications = await Application.find(query)
            .populate('job', 'title company location salary jobType')
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Application.countDocuments(query);

        return res.json({
            applications,
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

const getJobApplications = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (!job.isOwner(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view applications for this job' });
        }

        const query = { job: jobId };
        if (status) {
            query.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const applications = await Application.find(query)
            .populate('applicant', 'firstName lastName email phone')
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Application.countDocuments(query);

        const stats = {
            total: await Application.countDocuments({ job: jobId }),
            pending: await Application.countDocuments({ job: jobId, status: 'pending' }),
            reviewed: await Application.countDocuments({ job: jobId, status: 'reviewed' }),
            interview: await Application.countDocuments({ job: jobId, status: 'interview' }),
            accepted: await Application.countDocuments({ job: jobId, status: 'accepted' }),
            rejected: await Application.countDocuments({ job: jobId, status: 'rejected' }),
        };

        return res.json({
            applications,
            stats,
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

const updateApplicationStatus = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await Application.findById(applicationId).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.job.isOwner(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        await application.updateStatus(status, req.user._id);

        await application.populate('applicant', 'firstName lastName email');
        await application.populate('job', 'title company');

        return res.json({ application });
    } catch (error) {
        return next(error);
    }
};

const getApplicationById = async (req, res, next) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId)
            .populate('applicant', 'firstName lastName email phone')
            .populate('job', 'title company location salary postedBy');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const isApplicant = application.applicant._id.toString() === req.user._id.toString();
        const jobFull = await Job.findById(application.job._id);
        const isJobOwner = jobFull.isOwner(req.user._id);
        const isAdmin = req.user.role === 'admin';

        if (!isApplicant && !isJobOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }

        return res.json({ application });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    getApplicationById,
};
