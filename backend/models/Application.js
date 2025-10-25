const mongoose = require('mongoose');

const applicationStatuses = ['pending', 'reviewed', 'interview', 'accepted', 'rejected'];

const statusHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: applicationStatuses,
            required: true,
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { _id: false }
);

const applicationSchema = new mongoose.Schema(
    {
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: applicationStatuses,
            default: 'pending',
            index: true,
        },
        coverLetter: {
            type: String,
            trim: true,
            maxlength: 5000,
        },
        resumeUrl: {
            type: String,
            trim: true,
        },
        statusHistory: {
            type: [statusHistorySchema],
            default: () => [],
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

applicationSchema.methods.isApplicant = function isApplicant(userId) {
    return this.applicant.toString() === userId.toString();
};

applicationSchema.methods.updateStatus = async function updateStatus(newStatus, changedBy) {
    if (!applicationStatuses.includes(newStatus)) {
        throw new Error('Invalid status');
    }

    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        changedBy,
        changedAt: new Date(),
    });

    return this.save();
};

module.exports = mongoose.model('Application', applicationSchema);
