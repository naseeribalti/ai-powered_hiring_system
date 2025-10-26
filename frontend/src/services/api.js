import axios from 'axios';
import toast from 'react-hot-toast';
import { buildJobQueryParams } from '../utils/mappers';

// Determine sensible default base URL
// - In production (Vercel), prefer hitting "/api" so Vercel rewrites can proxy to the backend
// - In development, default to local backend
const defaultBaseURL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

// Resolve baseURL with safe normalization
// - If REACT_APP_API_URL is provided as a full backend root (e.g., https://api.example.com),
//   automatically append "/api" to align with backend mount points
// - Avoid double "/api" when already present or when using the defaultBaseURL
const resolveBaseURL = () => {
    const envBase = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
    if (!envBase) return defaultBaseURL; // use sensible defaults

    // If a full URL is provided without trailing /api, append it
    const isFullUrl = /^https?:\/\//i.test(envBase);
    const endsWithApi = /\/api$/i.test(envBase);
    if (isFullUrl && !endsWithApi) {
        return `${envBase}/api`;
    }
    return envBase || defaultBaseURL;
};

// Create axios instance with base configuration
const api = axios.create({
    baseURL: resolveBaseURL(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        } else if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        } else if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else if (error.message) {
            toast.error(error.message);
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (userData) => api.put('/auth/me', userData),
};

// Jobs API calls
export const jobsAPI = {
    getAll: (params = {}) => api.get('/jobs', { params }),
    // Search helper that maps UI filters to backend query params
    search: (filters = {}) => {
        const params = buildJobQueryParams(filters);
        return api.get('/jobs', { params });
    },
    getById: (id) => api.get(`/jobs/${id}`),
    create: (jobData) => api.post('/jobs', jobData),
    update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
    delete: (id) => api.delete(`/jobs/${id}`),
    getMyJobs: () => api.get('/jobs/my-jobs'),
    // Saved jobs
    getSaved: () => api.get('/jobs/saved'),
    save: (id) => api.post(`/jobs/${id}/save`),
    unsave: (id) => api.delete(`/jobs/${id}/save`),
};

// Applications API calls
export const applicationsAPI = {
    getAll: (params = {}) => api.get('/applications', { params }),
    getById: (id) => api.get(`/applications/${id}`),
    create: (applicationData) => api.post('/applications', applicationData),
    update: (id, applicationData) => api.put(`/applications/${id}`, applicationData),
    delete: (id) => api.delete(`/applications/${id}`),
    getMyApplications: () => api.get('/applications/my-applications'),
    // Align with backend: GET /api/applications/jobs/:jobId/applications
    getJobApplications: (jobId) => api.get(`/applications/jobs/${jobId}/applications`),
};

// Users API calls (for admin/hr)
export const usersAPI = {
    getAll: (params = {}) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
    // Current user's profile photo upload
    uploadMyPhoto: (file) => {
        const formData = new FormData();
        formData.append('photo', file);
        return api.post('/users/me/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// Notifications API calls
export const notificationsAPI = {
    list: () => api.get('/notifications'),
    markRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all'),
    remove: (id) => api.delete(`/notifications/${id}`),
    clearAll: () => api.delete('/notifications'),
};

export default api;
