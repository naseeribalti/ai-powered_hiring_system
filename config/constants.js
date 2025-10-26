// config/constants.js - Application Constants and Enums
const constants = {
    // User Roles and Types
    USER_TYPES: {
        JOB_SEEKER: 'job_seeker',
        RECRUITER: 'recruiter',
        ADMIN: 'admin'
    },

    USER_STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        SUSPENDED: 'suspended',
        PENDING_APPROVAL: 'pending_approval',
        DELETED: 'deleted'
    },

    // Job Related Constants
    JOB_TYPES: {
        FULL_TIME: 'full-time',
        PART_TIME: 'part-time',
        CONTRACT: 'contract',
        INTERNSHIP: 'internship',
        TEMPORARY: 'temporary',
        REMOTE: 'remote',
        HYBRID: 'hybrid'
    },

    JOB_STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DRAFT: 'draft',
        EXPIRED: 'expired',
        CLOSED: 'closed'
    },

    EXPERIENCE_LEVELS: {
        ENTRY: 'entry-level',
        MID: 'mid-level',
        SENIOR: 'senior-level',
        EXECUTIVE: 'executive'
    },

    SALARY_TYPES: {
        HOURLY: 'hourly',
        MONTHLY: 'monthly',
        YEARLY: 'yearly'
    },

    // Application Status
    APPLICATION_STATUS: {
        PENDING: 'pending',
        REVIEWED: 'reviewed',
        SHORTLISTED: 'shortlisted',
        INTERVIEW: 'interview',
        REJECTED: 'rejected',
        ACCEPTED: 'accepted',
        WITHDRAWN: 'withdrawn'
    },

    // Resume and AI Scoring
    RESUME_SCORE_WEIGHTS: {
        SKILLS_MATCH: 0.35,
        EXPERIENCE: 0.25,
        EDUCATION: 0.15,
        KEYWORDS: 0.10,
        FORMATTING: 0.10,
        COMPLETENESS: 0.05
    },

    SCORE_THRESHOLDS: {
        EXCELLENT: 85,
        GOOD: 70,
        AVERAGE: 50,
        POOR: 0
    },

    // AI and ML Constants
    AI_MODELS: {
        RESUME_PARSER: 'resume_parser_v1',
        JOB_MATCHER: 'job_matcher_v1',
        SKILL_EXTRACTOR: 'skill_extractor_v1',
        SALARY_PREDICTOR: 'salary_predictor_v1'
    },

    // Pagination and Limits
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
        JOB_SEARCH_LIMIT: 20,
        APPLICATION_LIMIT: 15
    },

    // Validation Constants
    VALIDATION: {
        EMAIL_MAX_LENGTH: 255,
        NAME_MAX_LENGTH: 100,
        TITLE_MAX_LENGTH: 200,
        COMPANY_MAX_LENGTH: 100,
        DESCRIPTION_MAX_LENGTH: 5000,
        BIO_MAX_LENGTH: 1000,
        SKILL_MAX_LENGTH: 50
    },

    // File and Upload Constants
    FILE: {
        MAX_RESUME_SIZE: 5 * 1024 * 1024, // 5MB
        MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
        ALLOWED_RESUME_TYPES: ['pdf', 'doc', 'docx'],
        ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp']
    },

    // HTTP Status Codes for consistency
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_ERROR: 500
    },

    // Error Messages
    ERROR_MESSAGES: {
        UNAUTHORIZED: 'Unauthorized access',
        FORBIDDEN: 'Access forbidden',
        NOT_FOUND: 'Resource not found',
        VALIDATION_ERROR: 'Validation failed',
        DUPLICATE_ENTRY: 'Duplicate entry found',
        INTERNAL_ERROR: 'Internal server error',
        FILE_TOO_LARGE: 'File size too large',
        INVALID_FILE_TYPE: 'Invalid file type'
    },

    // Success Messages
    SUCCESS_MESSAGES: {
        CREATED: 'Resource created successfully',
        UPDATED: 'Resource updated successfully',
        DELETED: 'Resource deleted successfully',
        UPLOADED: 'File uploaded successfully'
    },

    // Utility Functions
    getUserTypeLabel: (userType) => {
        const labels = {
            [constants.USER_TYPES.JOB_SEEKER]: 'Job Seeker',
            [constants.USER_TYPES.RECRUITER]: 'Recruiter',
            [constants.USER_TYPES.ADMIN]: 'Administrator'
        };
        return labels[userType] || 'Unknown';
    },

    getJobTypeLabel: (jobType) => {
        const labels = {
            [constants.JOB_TYPES.FULL_TIME]: 'Full Time',
            [constants.JOB_TYPES.PART_TIME]: 'Part Time',
            [constants.JOB_TYPES.CONTRACT]: 'Contract',
            [constants.JOB_TYPES.INTERNSHIP]: 'Internship',
            [constants.JOB_TYPES.TEMPORARY]: 'Temporary',
            [constants.JOB_TYPES.REMOTE]: 'Remote',
            [constants.JOB_TYPES.HYBRID]: 'Hybrid'
        };
        return labels[jobType] || 'Unknown';
    },

    getApplicationStatusLabel: (status) => {
        const labels = {
            [constants.APPLICATION_STATUS.PENDING]: 'Pending',
            [constants.APPLICATION_STATUS.REVIEWED]: 'Reviewed',
            [constants.APPLICATION_STATUS.SHORTLISTED]: 'Shortlisted',
            [constants.APPLICATION_STATUS.INTERVIEW]: 'Interview',
            [constants.APPLICATION_STATUS.REJECTED]: 'Rejected',
            [constants.APPLICATION_STATUS.ACCEPTED]: 'Accepted',
            [constants.APPLICATION_STATUS.WITHDRAWN]: 'Withdrawn'
        };
        return labels[status] || 'Unknown';
    },

    // Color mapping for status (for UI)
    getStatusColor: (status) => {
        const colors = {
            [constants.APPLICATION_STATUS.PENDING]: 'warning',
            [constants.APPLICATION_STATUS.REVIEWED]: 'info',
            [constants.APPLICATION_STATUS.SHORTLISTED]: 'primary',
            [constants.APPLICATION_STATUS.INTERVIEW]: 'success',
            [constants.APPLICATION_STATUS.REJECTED]: 'danger',
            [constants.APPLICATION_STATUS.ACCEPTED]: 'success',
            [constants.APPLICATION_STATUS.WITHDRAWN]: 'secondary'
        };
        return colors[status] || 'secondary';
    }
};

module.exports = constants;

