// Utility helper functions for the AI Hiring System

// Format date to readable string
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Format date with time
export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

// Get status badge color
export const getStatusColor = (status) => {
    const statusColors = {
        active: 'success',
        inactive: 'secondary',
        pending: 'warning',
        accepted: 'success',
        rejected: 'danger',
        interview: 'info',
        closed: 'danger',
        draft: 'secondary'
    };

    return statusColors[status?.toLowerCase()] || 'secondary';
};

// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Generate random ID
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

// Debounce function for search
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Local storage helpers
export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting from localStorage:', error);
            return null;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting to localStorage:', error);
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

// Constants
export const USER_ROLES = {
    CANDIDATE: 'candidate',
    HR: 'hr',
    ADMIN: 'admin'
};

export const JOB_STATUS = {
    ACTIVE: 'active',
    CLOSED: 'closed',
    DRAFT: 'draft'
};

export const APPLICATION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    INTERVIEW: 'interview'
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile'
    },
    JOBS: {
        BASE: '/jobs',
        MY_JOBS: '/jobs/my-jobs'
    },
    APPLICATIONS: {
        BASE: '/applications',
        MY_APPLICATIONS: '/applications/my-applications',
        BY_JOB: (jobId) => `/applications/job/${jobId}`
    },
    USERS: {
        BASE: '/users'
    }
};
