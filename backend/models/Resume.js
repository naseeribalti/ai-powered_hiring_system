const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
            enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        },
        // Parsed resume data
        parsedData: {
            name: String,
            email: String,
            phone: String,
            summary: String,
            skills: [{
                name: String,
                confidence: Number,
                category: String,
            }],
            experience: [{
                title: String,
                company: String,
                location: String,
                startDate: Date,
                endDate: Date,
                current: Boolean,
                description: String,
                achievements: [String],
            }],
            education: [{
                degree: String,
                institution: String,
                location: String,
                startDate: Date,
                endDate: Date,
                gpa: Number,
                major: String,
            }],
            certifications: [{
                name: String,
                issuer: String,
                date: Date,
                expiryDate: Date,
            }],
            projects: [{
                name: String,
                description: String,
                technologies: [String],
                url: String,
            }],
            languages: [{
                name: String,
                proficiency: String,
            }],
        },
        // AI Analysis scores
        aiScore: {
            overall: {
                type: Number,
                min: 0,
                max: 100,
            },
            skillsMatch: {
                type: Number,
                min: 0,
                max: 100,
            },
            experienceRelevance: {
                type: Number,
                min: 0,
                max: 100,
            },
            educationMatch: {
                type: Number,
                min: 0,
                max: 100,
            },
            resumeQuality: {
                type: Number,
                min: 0,
                max: 100,
            },
            keywordOptimization: {
                type: Number,
                min: 0,
                max: 100,
            },
            atsCompatibility: {
                type: Number,
                min: 0,
                max: 100,
            },
        },
        // AI Recommendations
        recommendations: [{
            type: {
                type: String,
                enum: ['skill', 'experience', 'education', 'formatting', 'keyword', 'general'],
            },
            priority: {
                type: String,
                enum: ['high', 'medium', 'low'],
            },
            message: String,
            actionable: Boolean,
        }],
        // Analysis metadata
        analyzed: {
            type: Boolean,
            default: false,
        },
        analyzedAt: Date,
        lastAnalyzedBy: {
            type: String,
            enum: ['ai', 'recruiter', 'admin'],
        },
        // Status
        isActive: {
            type: Boolean,
            default: true,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
        // Usage statistics
        views: {
            type: Number,
            default: 0,
        },
        downloads: {
            type: Number,
            default: 0,
        },
        applicationsUsed: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ 'parsedData.skills.name': 1 });
resumeSchema.index({ 'aiScore.overall': -1 });

// Ensure only one primary resume per user
resumeSchema.pre('save', async function (next) {
    if (this.isPrimary && this.isModified('isPrimary')) {
        await this.constructor.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { isPrimary: false }
        );
    }
    next();
});

// Virtual for resume age
resumeSchema.virtual('ageInDays').get(function () {
    return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to increment views
resumeSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Method to increment downloads
resumeSchema.methods.incrementDownloads = function () {
    this.downloads += 1;
    return this.save();
};

// Method to mark as used in application
resumeSchema.methods.markAsUsed = function () {
    this.applicationsUsed += 1;
    return this.save();
};

// Static method to get user's primary resume
resumeSchema.statics.getPrimaryResume = function (userId) {
    return this.findOne({ user: userId, isPrimary: true, isActive: true });
};

// Static method to get high-scoring resumes
resumeSchema.statics.getHighScoringResumes = function (minScore = 80) {
    return this.find({
        'aiScore.overall': { $gte: minScore },
        analyzed: true,
        isActive: true,
    })
        .populate('user', 'firstName lastName email')
        .sort({ 'aiScore.overall': -1 });
};

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
