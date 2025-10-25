const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
    {
        min: {
            type: Number,
            min: 0,
        },
        max: {
            type: Number,
            min: 0,
        },
        currency: {
            type: String,
            default: 'USD',
            uppercase: true,
        },
    },
    { _id: false }
);

const jobStatuses = ['draft', 'active', 'paused', 'closed', 'expired'];
const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
            index: 'text',
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
            index: 'text',
        },
        requirements: {
            type: String,
            trim: true,
            maxlength: 3000,
        },
        company: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        location: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        salary: {
            type: salarySchema,
        },
        skills: {
            type: [String],
            default: [],
            index: true,
        },
        experienceLevel: {
            type: String,
            enum: experienceLevels,
            default: 'mid',
        },
        jobType: {
            type: String,
            enum: jobTypes,
            required: true,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: jobStatuses,
            default: 'draft',
            index: true,
        },
        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Application',
            },
        ],
        expiresAt: {
            type: Date,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ location: 1, status: 1 });
jobSchema.index({ skills: 1, status: 1 });
jobSchema.index({ createdAt: -1 });

jobSchema.methods.isOwner = function isOwner(userId) {
    return this.postedBy.toString() === userId.toString();
};

jobSchema.methods.incrementViewCount = async function incrementViewCount() {
    this.viewCount += 1;
    return this.save();
};

module.exports = mongoose.model('Job', jobSchema);
