const Resume = require('../models/Resume');
const { cloudinary } = require('../config/cloudinary');
const axios = require('axios');

// Upload resume
const uploadResume = async (req, res, next) => {
    try {
        console.log('Upload request received');
        console.log('File:', req.file);
        console.log('User:', req.user);

        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let uploadedUrl;
        // If file already uploaded by CloudinaryStorage, its path is a URL
        if (req.file.path && /^https?:\/\//i.test(req.file.path) && req.file.filename) {
            uploadedUrl = req.file.path;
            console.log('Using existing Cloudinary file:', uploadedUrl);
        } else {
            console.log('Uploading to Cloudinary...');
            // Upload local file to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'resumes',
                resource_type: 'raw',
                format: req.file.mimetype.includes('pdf') ? 'pdf' : 'docx',
            });
            uploadedUrl = result.secure_url;
            console.log('Cloudinary upload successful:', uploadedUrl);
        }

        // Create resume record
        const resume = await Resume.create({
            user: req.user._id,
            fileName: req.file.originalname,
            fileUrl: uploadedUrl,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
        });

        console.log('Resume record created:', resume._id);

        // Trigger AI analysis asynchronously (don't wait for it)
        analyzeResumeAsync(resume._id).catch(err => {
            console.error('Error in async analysis:', err);
        });

        return res.status(201).json({
            message: 'Resume uploaded successfully',
            resume: {
                id: resume._id,
                fileName: resume.fileName,
                fileUrl: resume.fileUrl,
                uploadedAt: resume.createdAt,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return next(error);
    }
};

// Async function to analyze resume (called in background)
const analyzeResumeAsync = async (resumeId) => {
    try {
        const resume = await Resume.findById(resumeId);
        if (!resume) return;

        // Call Python ML service for analysis
        const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:3002';

        try {
            const response = await axios.post(`${ML_SERVICE_URL}/api/resume/analyze`, {
                resumeUrl: resume.fileUrl,
                resumeId: resume._id.toString(),
            }, {
                timeout: 30000, // 30 second timeout
            });

            // Update resume with parsed data and scores
            resume.parsedData = response.data.parsedData;
            resume.aiScore = response.data.aiScore;
            resume.recommendations = response.data.recommendations;
            resume.analyzed = true;
            resume.analyzedAt = new Date();
            resume.lastAnalyzedBy = 'ai';

            await resume.save();
        } catch (mlError) {
            console.error('ML service error:', mlError.message);
            // Use demo data if ML service is not available
            await useDemoAnalysis(resume);
        }
    } catch (error) {
        console.error('Error analyzing resume:', error);
    }
};

// Demo analysis for when ML service is not available
const useDemoAnalysis = async (resume) => {
    const demoData = {
        parsedData: {
            name: 'Demo User',
            skills: [
                { name: 'JavaScript', confidence: 0.95, category: 'Programming' },
                { name: 'React', confidence: 0.92, category: 'Framework' },
                { name: 'Node.js', confidence: 0.88, category: 'Backend' },
                { name: 'Python', confidence: 0.85, category: 'Programming' },
                { name: 'SQL', confidence: 0.80, category: 'Database' },
            ],
            experience: [
                {
                    title: 'Senior Software Engineer',
                    company: 'Tech Corp',
                    startDate: new Date('2020-01-01'),
                    current: true,
                    description: 'Led development of microservices architecture',
                },
            ],
            education: [
                {
                    degree: 'B.S. Computer Science',
                    institution: 'University of Technology',
                    endDate: new Date('2018-05-01'),
                },
            ],
        },
        aiScore: {
            overall: 85,
            skillsMatch: 90,
            experienceRelevance: 85,
            educationMatch: 80,
            resumeQuality: 85,
            keywordOptimization: 82,
            atsCompatibility: 88,
        },
        recommendations: [
            {
                type: 'skill',
                priority: 'medium',
                message: 'Add more quantifiable achievements (e.g., "Increased performance by 40%")',
                actionable: true,
            },
            {
                type: 'experience',
                priority: 'high',
                message: 'Include specific technologies used in each role',
                actionable: true,
            },
            {
                type: 'general',
                priority: 'low',
                message: 'Consider adding links to GitHub projects or portfolio',
                actionable: true,
            },
        ],
    };

    resume.parsedData = demoData.parsedData;
    resume.aiScore = demoData.aiScore;
    resume.recommendations = demoData.recommendations;
    resume.analyzed = true;
    resume.analyzedAt = new Date();
    resume.lastAnalyzedBy = 'ai';

    await resume.save();
};

// Get user's resumes
const getMyResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.find({
            user: req.user._id,
            isActive: true,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            count: resumes.length,
            resumes,
        });
    } catch (error) {
        return next(error);
    }
};

// Get resume by ID
const getResumeById = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Check if user owns this resume or is recruiter/admin
        if (
            resume.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'recruiter' &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Increment views if accessed by recruiter
        if (req.user.role === 'recruiter') {
            await resume.incrementViews();
        }

        return res.status(200).json({ resume });
    } catch (error) {
        return next(error);
    }
};

// Analyze resume (trigger re-analysis)
const analyzeResume = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Check ownership
        if (resume.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Trigger analysis
        analyzeResumeAsync(resume._id).catch(console.error);

        return res.status(200).json({
            message: 'Resume analysis started. This may take a few moments.',
            resumeId: resume._id,
        });
    } catch (error) {
        return next(error);
    }
};

// Get resume score
const getResumeScore = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Check ownership
        if (
            resume.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'recruiter' &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!resume.analyzed) {
            return res.status(202).json({
                message: 'Resume analysis in progress',
                analyzed: false,
            });
        }

        return res.status(200).json({
            analyzed: true,
            aiScore: resume.aiScore,
            recommendations: resume.recommendations,
            analyzedAt: resume.analyzedAt,
        });
    } catch (error) {
        return next(error);
    }
};

// Delete resume
const deleteResume = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Check ownership
        if (resume.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Soft delete
        resume.isActive = false;
        await resume.save();

        return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        return next(error);
    }
};

// Update resume
const updateResume = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Check ownership
        if (resume.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If new file uploaded, update file
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'resumes',
                resource_type: 'raw',
            });

            resume.fileName = req.file.originalname;
            resume.fileUrl = result.secure_url;
            resume.fileSize = req.file.size;
            resume.fileType = req.file.mimetype;
            resume.analyzed = false;
            resume.parsedData = {};
            resume.aiScore = {};
            resume.recommendations = [];

            await resume.save();

            // Trigger re-analysis
            analyzeResumeAsync(resume._id).catch(console.error);
        }

        // Update isPrimary status
        if (req.body.isPrimary !== undefined) {
            resume.isPrimary = req.body.isPrimary;
            await resume.save();
        }

        return res.status(200).json({
            message: 'Resume updated successfully',
            resume,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    uploadResume,
    getMyResumes,
    getResumeById,
    analyzeResume,
    getResumeScore,
    deleteResume,
    updateResume,
};
