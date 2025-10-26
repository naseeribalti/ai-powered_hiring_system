# Frontend Setup Guide

## Overview

This guide helps frontend developers connect React to the AI Hiring System backend API and understand the architecture for building the user interface.

---

## Backend Requirements (Prerequisites)

**Before starting frontend development, ensure:**

1. ✅ Backend is running: `npm run dev` (starts on `http://localhost:3000`)
2. ✅ MongoDB is accessible (local or cloud connection via `.env`)
3. ✅ All backend tests passing: `npm test`
4. ✅ `.env` file configured with:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ai-hiring-system
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

**Backend Status Check:**

```bash
curl http://localhost:3000/api/health
# Should return: { "status": "ok", "uptime": ... }
```

---

## Frontend Architecture Overview

### Technology Stack

```
React 18
├── React Router 6 (routing)
├── Context API (state management)
├── Axios (HTTP client)
├── Tailwind CSS (styling)
└── React Query (optional, data fetching)
```

### Directory Structure (Recommended)

```
frontend/src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Jobs/
│   │   ├── JobList.jsx
│   │   ├── JobDetail.jsx
│   │   ├── JobForm.jsx
│   │   └── JobSearch.jsx
│   ├── Applications/
│   │   ├── ApplicationForm.jsx
│   │   ├── ApplicationList.jsx
│   │   ├── ApplicationDetail.jsx
│   │   └── ApplicationStatus.jsx
│   ├── Layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── Common/
│       ├── Loading.jsx
│       ├── Error.jsx
│       └── Button.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── JobContext.jsx
│   └── ApplicationContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useJobs.js
│   └── useApplications.js
├── services/
│   ├── api.js (Axios instance)
│   ├── authService.js
│   ├── jobService.js
│   └── applicationService.js
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── JobsPage.jsx
│   ├── JobDetailPage.jsx
│   ├── ApplicationsPage.jsx
│   ├── DashboardPage.jsx
│   └── ProfilePage.jsx
├── styles/
│   └── globals.css
├── utils/
│   ├── constants.js
│   └── helpers.js
├── App.jsx
└── index.js
```

---

## Setup Steps

### 1. Environment Configuration

Create `.env` in `frontend/` directory:

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

**Note:** React environment variables must start with `REACT_APP_`

### 2. Axios Instance Setup

**`frontend/src/services/api.js`:**

```javascript
import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Auth Context Setup

**`frontend/src/context/AuthContext.jsx`:**

```javascript
import React, { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch({ type: 'LOAD_USER', payload: JSON.parse(user) });
    }
    dispatch({ type: 'LOADING', payload: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 4. Auth Service

**`frontend/src/services/authService.js`:**

```javascript
import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
```

### 5. Jobs Service

**`frontend/src/services/jobService.js`:**

```javascript
import api from './api';

export const jobService = {
  async getJobs(query = {}) {
    const params = new URLSearchParams();
    Object.keys(query).forEach((key) => {
      if (query[key]) params.append(key, query[key]);
    });

    const response = await api.get('/jobs', { params });
    return response.data;
  },

  async getJobById(jobId) {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data.job;
  },

  async createJob(jobData) {
    const response = await api.post('/jobs', jobData);
    return response.data.job;
  },

  async updateJob(jobId, jobData) {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data.job;
  },

  async deleteJob(jobId) {
    await api.delete(`/jobs/${jobId}`);
  },

  async getMyJobs(page = 1, limit = 10) {
    const response = await api.get('/jobs/my-jobs', {
      params: { page, limit },
    });
    return response.data;
  },
};
```

### 6. Applications Service

**`frontend/src/services/applicationService.js`:**

```javascript
import api from './api';

export const applicationService = {
  async applyForJob(jobId, coverLetter) {
    const response = await api.post('/applications', {
      jobId,
      coverLetter,
    });
    return response.data.application;
  },

  async getMyApplications(status = null, page = 1, limit = 10) {
    const params = { page, limit };
    if (status) params.status = status;

    const response = await api.get('/applications/my-applications', { params });
    return response.data;
  },

  async getApplicationById(applicationId) {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data.application;
  },

  async getJobApplications(jobId, status = null, page = 1, limit = 10) {
    const params = { page, limit };
    if (status) params.status = status;

    const response = await api.get(`/applications/jobs/${jobId}/applications`, {
      params,
    });
    return response.data;
  },

  async updateApplicationStatus(applicationId, newStatus) {
    const response = await api.put(`/applications/${applicationId}/status`, {
      status: newStatus,
    });
    return response.data.application;
  },
};
```

---

## Testing API Connectivity

### Test Authentication

```javascript
// frontend/src/components/TestConnection.jsx
import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';

export function TestConnection() {
  const [message, setMessage] = useState('Testing...');

  useEffect(() => {
    async function test() {
      try {
        // Test login endpoint
        const result = await authService.login(
          'test@example.com',
          'password123'
        );
        setMessage(`✅ Connected! Welcome ${result.user.firstName}`);
      } catch (error) {
        setMessage(`❌ Connection failed: ${error.message}`);
      }
    }
    test();
  }, []);

  return <div>{message}</div>;
}
```

### Test with cURL

**Test Backend Health:**

```bash
curl http://localhost:3000/api/health
```

**Test Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Test Protected Route (with token):**

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Test Credentials

Use these credentials to test during development:

### Job Seeker Account

- **Email:** jobseeker@example.com
- **Password:** SecurePassword123
- **Role:** jobSeeker

### Recruiter Account

- **Email:** recruiter@example.com
- **Password:** SecurePassword123
- **Role:** recruiter

### Admin Account

- **Email:** admin@example.com
- **Password:** SecurePassword123
- **Role:** admin

**Note:** Run `npm run seed` in backend to populate these test accounts.

---

## CORS Configuration

The backend is configured to accept requests from `localhost:3000` (frontend dev server).

**If you see CORS errors:**

1. Verify backend is running on port 3000
2. Check `backend/app.js` for CORS middleware:
   ```javascript
   app.use(
     cors({
       origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
       credentials: true,
     })
   );
   ```
3. Ensure `REACT_APP_API_BASE_URL=http://localhost:3000/api`

---

## Protected Routes Pattern

**`frontend/src/components/Auth/ProtectedRoute.jsx`:**

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
```

**Usage in Router:**

```javascript
<Route
  path="/jobs/create"
  element={
    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
      <CreateJobPage />
    </ProtectedRoute>
  }
/>
```

---

## Common API Patterns

### Fetch with Error Handling

```javascript
async function loadJobs() {
  try {
    setLoading(true);
    const data = await jobService.getJobs({ search: query });
    setJobs(data.jobs);
  } catch (error) {
    setError(error.response?.data?.message || 'Failed to load jobs');
  } finally {
    setLoading(false);
  }
}
```

### Paginated List

```javascript
const [page, setPage] = useState(1);
const [data, setData] = useState({ jobs: [], pagination: {} });

useEffect(() => {
  async function load() {
    const result = await jobService.getJobs({ page, limit: 10 });
    setData(result);
  }
  load();
}, [page]);

// In component:
<button onClick={() => setPage(page + 1)}>Next Page</button>;
```

### Search with Debounce

```javascript
import { useCallback, useState } from 'react';

function JobSearch() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length >= 2) {
        const data = await jobService.getJobs({ search: query });
        setResults(data.jobs);
      }
    }, 500),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <>
      <input
        value={search}
        onChange={handleChange}
        placeholder="Search jobs..."
      />
      <ul>
        {results.map((job) => (
          <li key={job._id}>{job.title}</li>
        ))}
      </ul>
    </>
  );
}
```

---

## Debugging Tips

### Check Browser Console

All API errors are logged. Look for:

- Network tab: View actual HTTP requests/responses
- Console: JavaScript errors and warnings
- Application tab: Check localStorage for token/user

### Enable API Logging

```javascript
// In api.js interceptor
api.interceptors.response.use((response) => {
  console.log('API Response:', response.config.url, response.data);
  return response;
});
```

### Test in Browser Console

```javascript
// Check if token exists
localStorage.getItem('token');

// Test API call
fetch('http://localhost:3000/api/jobs')
  .then((r) => r.json())
  .then(console.log);

// Login and get token
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
})
  .then((r) => r.json())
  .then((data) => localStorage.setItem('token', data.token));
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Update `REACT_APP_API_BASE_URL` to production backend URL
- [ ] Remove test credentials from codebase
- [ ] Enable HTTPS for API calls
- [ ] Update CORS origin in backend for production domain
- [ ] Set up environment variables in deployment platform
- [ ] Test all authentication flows
- [ ] Verify protected routes work correctly
- [ ] Test error handling and fallbacks
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Security review (no sensitive data in localStorage beyond token)

---

## Backend API Reference

For complete API documentation, see: [`/docs/api/endpoints.md`](./api/endpoints.md)

Key endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Current user profile
- `GET /jobs` - Browse jobs
- `POST /jobs` - Create job (recruiter only)
- `POST /applications` - Apply for job
- `GET /applications/my-applications` - View my applications
- `PUT /applications/:id/status` - Update application status (recruiter only)

---

## Support

**Frontend Common Issues:**

1. **"Token expired"**: User token lasts 7 days. Implement refresh token logic if needed.
2. **"Cannot GET /api/..."**: Backend not running. Run `npm run dev` in backend directory.
3. **"CORS error"**: Check CORS_ORIGIN in backend .env matches your frontend URL.
4. **"Network failed"**: Verify API_BASE_URL is correct in `.env`.

**Backend API Support:**

- See backend `README.md` for setup
- Check test files in `backend/tests/` for endpoint examples
- Review validation errors in API responses

---

## Related Files

- Backend API: `../backend/README.md`
- Complete Endpoint Reference: `./api/endpoints.md`
- Postman Collection: `./api/postman-collection.json`
