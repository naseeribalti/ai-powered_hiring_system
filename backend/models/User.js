const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const roles = ['jobSeeker', 'recruiter', 'admin'];
const statuses = ['active', 'inactive', 'suspended', 'pending_approval'];

const userSchema = new mongoose.Schema(
    {
        // === Core Identity & Authentication ===
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        // === Role & Status Management ===
        role: {
            type: String,
            enum: roles,
            default: 'jobSeeker',
        },
        status: {
            type: String,
            enum: statuses,
            default: 'active', // Recruiters can be set to 'pending_approval' if needed
        },

        // === Contact Information ===
        phone: {
            type: String,
            trim: true,
        },

        // === Recruiter-Specific Fields ===
        companyName: {
            type: String,
            trim: true,
            maxlength: 100,
            // Optional at schema level to avoid breaking tests and allow gradual profile completion
        },
        companyDetails: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        companyWebsite: {
            type: String,
            trim: true,
            maxlength: 255,
        },
        companyType: {
            type: String,
            enum: ['IT', 'Tech', 'Business', 'Health', 'Education', 'Finance', 'Other'],
            trim: true,
        },
        employeesCount: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
            trim: true,
        },
        companyAddress: {
            type: String,
            trim: true,
            maxlength: 255,
        },

        // === Job Seeker-Specific Fields ===
        resumeUrl: {
            type: String,
            maxlength: 500,
        },
        // Profile picture (optional)
        avatarUrl: {
            type: String,
            maxlength: 500,
        },
        avatarPublicId: {
            type: String,
            maxlength: 255,
        },
        skills: [{
            type: String,
            trim: true,
            maxlength: 50,
        }],
        experienceLevel: {
            type: String,
            enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
            default: 'entry',
        },
        education: {
            type: String,
            maxlength: 255,
        },

        // === Activity Tracking ===
        lastLogin: {
            type: Date,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        profileCompleted: {
            type: Boolean,
            default: false,
        },

        // === Password Reset ===
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpires: {
            type: Date,
            select: false,
        },

        // === Legacy Field for Compatibility ===
        isActive: {
            type: Boolean,
            default: true,
        },

        // === Job Management ===
        jobs_posted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
        }],

        // === Saved Jobs (for job seekers) ===
        savedJobs: [{
            job: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job'
            },
            savedAt: {
                type: Date,
                default: Date.now
            }
        }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// === Virtual Fields ===
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('isRecruiter').get(function () {
    return this.role === 'recruiter';
});

userSchema.virtual('isJobSeeker').get(function () {
    return this.role === 'jobSeeker';
});

userSchema.virtual('isAdmin').get(function () {
    return this.role === 'admin';
});

userSchema.virtual('isActiveUser').get(function () {
    return this.status === 'active' && this.isActive;
});

// === Business Logic Virtual Properties ===
userSchema.virtual('isActiveRecruiter').get(function () {
    return this.role === 'recruiter' && this.status === 'active' && this.isActive;
});

userSchema.virtual('needsApproval').get(function () {
    return this.role === 'recruiter' && this.status === 'pending_approval';
});

// === Indexes for Performance ===
// Note: email index is created automatically by unique: true
userSchema.index({ role: 1, status: 1 });
userSchema.index({ companyName: 'text', firstName: 'text', lastName: 'text' });

// === Middleware ===
userSchema.pre('save', async function hashPassword(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

// === Instance Methods ===
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save({ validateBeforeSave: false });
};

userSchema.methods.isProfileComplete = function () {
    const requiredFields = {
        jobSeeker: ['firstName', 'lastName', 'email', 'skills'],
        recruiter: ['firstName', 'lastName', 'email', 'companyName', 'phone'],
        admin: ['firstName', 'lastName', 'email']
    };

    const fields = requiredFields[this.role] || [];
    return fields.every(field => {
        const value = this[field];
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value && value.toString().trim().length > 0;
    });
};

userSchema.methods.toJSON = function toJSON() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

// === Authorization Methods ===
userSchema.methods.canPostJobs = function () {
    return this.isActiveRecruiter;
};

userSchema.methods.canViewApplications = function (jobPostedIds) {
    if (!this.isActiveRecruiter) {
        return false;
    }
    // Check if any of the provided job IDs belong to this recruiter
    if (!jobPostedIds || !Array.isArray(jobPostedIds)) {
        return false;
    }
    return jobPostedIds.some(jobId => this.jobs_posted && this.jobs_posted.includes(jobId));
};

userSchema.methods.canManageJob = function (jobId) {
    if (!this.isActiveRecruiter) {
        return false;
    }
    return this.jobs_posted && this.jobs_posted.some(id => id.toString() === jobId.toString());
};

// === Static Methods ===
userSchema.statics.findActiveRecruiters = function () {
    return this.find({
        role: 'recruiter',
        status: 'active',
        isActive: true
    });
};

userSchema.statics.findPendingApproval = function () {
    return this.find({
        role: 'recruiter',
        status: 'pending_approval'
    });
};

userSchema.statics.findByRole = function (role) {
    return this.find({
        role: role,
        isActive: true
    });
};

module.exports = mongoose.model('User', userSchema);
