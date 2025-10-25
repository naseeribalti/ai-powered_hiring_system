import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
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
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Jobs API calls
export const jobsAPI = {
    getAll: (params = {}) => api.get('/jobs', { params }),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (jobData) => api.post('/jobs', jobData),
    update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
    delete: (id) => api.delete(`/jobs/${id}`),
    getMyJobs: () => api.get('/jobs/my-jobs'),
};

// Applications API calls
export const applicationsAPI = {
    getAll: (params = {}) => api.get('/applications', { params }),
    getById: (id) => api.get(`/applications/${id}`),
    create: (applicationData) => api.post('/applications', applicationData),
    update: (id, applicationData) => api.put(`/applications/${id}`, applicationData),
    delete: (id) => api.delete(`/applications/${id}`),
    getMyApplications: () => api.get('/applications/my-applications'),
    getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
};

// Users API calls (for admin/hr)
export const usersAPI = {
    getAll: (params = {}) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
};

export default api;
