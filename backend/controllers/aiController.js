/**
 * AI Controller
 * 
 * Handles AI-powered features:
 * - Resume parsing and analysis
 * - Job matching
 * - Candidate ranking
 * - Skill extraction
 * 
 * This controller acts as a bridge between the backend and ML service
 */

const axios = require('axios');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const User = require('../models/User');

// ML Service URL from environment
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:3002';

/**
 * Parse Resume using AI/ML Service
 * 
 * @route POST /api/ai/parse-resume
 * @access Private (Job Seekers)
 * 
 * Flow:
 * 1. Validate resume file uploaded
 * 2. Send file to ML service for parsing
 * 3. Save parsed data to database
 * 4. Return structured resume data
 */
const parseResume = async (req, res, next) => {
    try {
        // Check if resume exists in database
        const resumeId = req.body.resumeId;

        if (!resumeId) {
            return res.status(400).json({
                status: 'error',
                message: 'Resume ID is required'
            });
        }

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({
                status: 'error',
                message: 'Resume not found'
            });
        }

        // Check if user owns this resume
        if (resume.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to parse this resume'
            });
        }

        // Call ML service to parse resume
        const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/api/resume/parse`,
            {
                resume_url: resume.fileUrl,
                file_type: resume.fileType
            },
            {
                timeout: 30000 // 30 second timeout
            }
        );

        // Update resume with parsed data
        resume.parsedData = mlResponse.data.parsed_data;
        resume.analyzed = true;
        resume.analyzedAt = new Date();
        resume.lastAnalyzedBy = 'ai';

        await resume.save();

        return res.status(200).json({
            status: 'success',
            message: 'Resume parsed successfully',
            data: {
                resume: {
                    id: resume._id,
                    parsedData: resume.parsedData,
                    analyzedAt: resume.analyzedAt
                }
            }
        });

    } catch (error) {
        console.error('Error parsing resume:', error.message);

        // Handle ML service errors
        if (error.response) {
            return res.status(error.response.status).json({
                status: 'error',
                message: error.response.data.message || 'ML service error'
            });
        }

        return next(error);
    }
};

/**
 * Analyze Resume Quality using AI
 * 
 * @route POST /api/ai/analyze-resume
 * @access Private (Job Seekers)
 * 
 * Returns:
 * - Overall score (0-100)
 * - Skill analysis
 * - ATS compatibility
 * - Improvement suggestions
 */
const analyzeResume = async (req, res, next) => {
    try {
        const { resumeId } = req.body;

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({
                status: 'error',
                message: 'Resume not found'
            });
        }

        // Check authorization
        if (resume.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized'
            });
        }

        // Call ML service for analysis
        const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/api/resume/analyze`,
            {
                resume_id: resumeId,
                parsed_data: resume.parsedData
            },
            {
                timeout: 30000
            }
        );

        // Update resume with AI scores
        resume.aiScore = mlResponse.data.scores;
        resume.recommendations = mlResponse.data.recommendations;
        resume.analyzed = true;
        resume.analyzedAt = new Date();

        await resume.save();

        return res.status(200).json({
            status: 'success',
            message: 'Resume analyzed successfully',
            data: {
                scores: resume.aiScore,
                recommendations: resume.recommendations
            }
        });

    } catch (error) {
        console.error('Error analyzing resume:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                status: 'error',
                message: error.response.data.message || 'Analysis failed'
            });
        }

        return next(error);
    }
};

/**
 * Get Job Recommendations for User
 * 
 * @route GET /api/ai/job-recommendations
 * @access Private (Job Seekers)
 * 
 * Uses AI to match:
 * - User skills with job requirements
 * - Experience level
 * - Location preferences
 * - Salary expectations
 */
const getJobRecommendations = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { limit = 10 } = req.query;

        // Get user profile with skills
        const user = await User.findById(userId)
            .populate('skills')
            .populate('experience')
            .populate('education');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Get user's primary resume
        const resume = await Resume.getPrimaryResume(userId);

        // Prepare user profile for ML service
        const userProfile = {
            skills: resume?.parsedData?.skills || user.skills || [],
            experience: resume?.parsedData?.experience || user.experience || [],
            education: resume?.parsedData?.education || user.education || [],
            preferences: {
                location: user.location,
                jobType: user.preferredJobTypes,
                salaryExpectation: user.expectedSalary
            }
        };

        // Call ML service for job matching
        const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/api/jobs/match`,
            {
                user_profile: userProfile,
                limit: parseInt(limit)
            },
            {
                timeout: 30000
            }
        );

        // Get recommended job IDs
        const recommendedJobIds = mlResponse.data.recommendations.map(r => r.job_id);

        // Fetch full job details
        const jobs = await Job.find({
            _id: { $in: recommendedJobIds },
            status: 'active',
            isActive: true
        })
            .populate('company', 'name logo website')
            .populate('postedBy', 'firstName lastName');

        // Merge jobs with match scores
        const jobsWithScores = jobs.map(job => {
            const recommendation = mlResponse.data.recommendations.find(
                r => r.job_id === job._id.toString()
            );

            return {
                ...job.toObject(),
                matchScore: recommendation?.match_score || 0,
                matchReasons: recommendation?.match_reasons || []
            };
        });

        // Sort by match score
        jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

        return res.status(200).json({
            status: 'success',
            results: jobsWithScores.length,
            data: {
                recommendations: jobsWithScores
            }
        });

    } catch (error) {
        console.error('Error getting job recommendations:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                status: 'error',
                message: error.response.data.message || 'Recommendation failed'
            });
        }

        return next(error);
    }
};

/**
 * Rank Candidates for a Job
 * 
 * @route POST /api/ai/rank-candidates
 * @access Private (Recruiters)
 * 
 * Uses AI to rank applicants based on:
 * - Skills match
 * - Experience relevance
 * - Education fit
 * - Resume quality
 */
const rankCandidates = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        // Get job details
        const job = await Job.findById(jobId)
            .populate('applications');

        if (!job) {
            return res.status(404).json({
                status: 'error',
                message: 'Job not found'
            });
        }

        // Check if user is recruiter and owns this job
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to rank candidates for this job'
            });
        }

        // Get all applicants with their resumes
        const Application = require('../models/Application');
        const applications = await Application.find({ job: jobId })
            .populate({
                path: 'applicant',
                populate: {
                    path: 'resume',
                    model: 'Resume'
                }
            });

        if (applications.length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No candidates to rank',
                data: {
                    rankedCandidates: []
                }
            });
        }

        // Prepare data for ML service
        const candidatesData = applications.map(app => ({
            application_id: app._id,
            candidate_id: app.applicant._id,
            resume_data: app.applicant.resume?.parsedData || {},
            application_data: {
                coverLetter: app.coverLetter,
                answers: app.answers
            }
        }));

        // Call ML service for ranking
        const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/api/candidates/rank`,
            {
                job_requirements: {
                    title: job.title,
                    description: job.description,
                    requirements: job.requirements,
                    skills: job.skills,
                    experienceLevel: job.experienceLevel
                },
                candidates: candidatesData
            },
            {
                timeout: 60000 // 60 seconds for large candidate pools
            }
        );

        return res.status(200).json({
            status: 'success',
            results: mlResponse.data.ranked_candidates.length,
            data: {
                rankedCandidates: mlResponse.data.ranked_candidates
            }
        });

    } catch (error) {
        console.error('Error ranking candidates:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                status: 'error',
                message: error.response.data.message || 'Ranking failed'
            });
        }

        return next(error);
    }
};

/**
 * Extract Skills from Text
 * 
 * @route POST /api/ai/extract-skills
 * @access Private
 * 
 * Useful for:
 * - Auto-populating skill tags
 * - Analyzing job descriptions
 * - Resume skill extraction
 */
const extractSkills = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Text is required'
            });
        }

        // Call ML service to extract skills
        const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/api/skills/extract`,
            { text },
            {
                timeout: 15000
            }
        );

        return res.status(200).json({
            status: 'success',
            data: {
                skills: mlResponse.data.skills,
                categories: mlResponse.data.categories
            }
        });

    } catch (error) {
        console.error('Error extracting skills:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                status: 'error',
                message: error.response.data.message || 'Skill extraction failed'
            });
        }

        return next(error);
    }
};

/**
 * Get ML Service Health Status
 * 
 * @route GET /api/ai/health
 * @access Private (Admin)
 */
const getMLServiceHealth = async (req, res) => {
    try {
        const mlResponse = await axios.get(`${ML_SERVICE_URL}/health`, {
            timeout: 5000
        });

        return res.status(200).json({
            status: 'success',
            data: {
                mlService: mlResponse.data,
                connected: true,
                url: ML_SERVICE_URL
            }
        });

    } catch (error) {
        return res.status(503).json({
            status: 'error',
            message: 'ML service is unavailable',
            data: {
                connected: false,
                url: ML_SERVICE_URL,
                error: error.message
            }
        });
    }
};

module.exports = {
    parseResume,
    analyzeResume,
    getJobRecommendations,
    rankCandidates,
    extractSkills,
    getMLServiceHealth
};
