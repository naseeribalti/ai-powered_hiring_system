// Mapping helpers to align UI-friendly values with backend model enums and query params

// Backend model enums (see backend/models/Job.js):
// jobType: ['full-time','part-time','contract','internship','remote']
// experienceLevel: ['entry','mid','senior','lead','executive']

const mapExperienceLevelToModel = (value) => {
    if (!value) return undefined;
    const v = String(value).toLowerCase();
    const map = {
        'entry': 'entry',
        'entry-level': 'entry',
        'mid': 'mid',
        'mid-level': 'mid',
        'senior': 'senior',
        'senior-level': 'senior',
        'lead': 'lead',
        'executive': 'executive',
    };
    return map[v];
};

const mapJobTypeToModel = (value) => {
    if (!value) return undefined;
    const v = String(value).toLowerCase();
    const allowed = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
    if (allowed.includes(v)) return v;
    // Graceful fallback for UI-specific values
    if (v === 'hybrid') return 'remote';
    if (v === 'temporary') return 'contract';
    return undefined;
};

const normalizeSkills = (skills) => {
    if (!skills) return undefined;
    if (Array.isArray(skills)) return skills.map((s) => String(s).trim()).filter(Boolean);
    return String(skills)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};

// Build backend job list query from UI filters
// Maps to jobController.getJobs() expected keys: search, location, skills, salary_min, job_type, experience_level, status, page, limit, sort
const buildJobQueryParams = (filters = {}) => {
    const params = {};
    if (filters.keyword) params.search = filters.keyword;
    if (filters.location) params.location = filters.location;

    const skills = normalizeSkills(filters.skills);
    if (skills && skills.length) params.skills = skills.join(',');

    if (filters.salaryMin != null && filters.salaryMin !== '') params.salary_min = Number(filters.salaryMin);
    const jt = mapJobTypeToModel(filters.jobType);
    if (jt) params.job_type = jt;

    const xp = mapExperienceLevelToModel(filters.experienceLevel);
    if (xp) params.experience_level = xp;

    if (filters.status) params.status = filters.status;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.sort) params.sort = filters.sort; // e.g., '-createdAt,title'

    return params;
};

module.exports = {
    mapExperienceLevelToModel,
    mapJobTypeToModel,
    normalizeSkills,
    buildJobQueryParams,
};
