# 👨‍💻 Frontend Developer Complete Setup Guide

**For:** Syed Qamar Abbas  
**Project:** AI-Powered Hiring System  
**Backend Status:** ✅ Production Ready  
**Your Role:** Build the User Experience

---

## 🎯 Your Mission

Build a professional React application that:

- ✅ Authenticates users securely
- ✅ Displays job listings with advanced filtering
- ✅ Allows candidates to apply to jobs
- ✅ Provides recruiter dashboard for job management
- ✅ Shows application status tracking

**Timeline:** 4-6 weeks to MVP  
**Testing:** Backend fully tested and ready to integrate

---

## 📋 Before You Start - Essential Reading

### **REQUIRED** (Read in order - 45 minutes total)

1. **MASTER_DOCUMENTATION_INDEX.md** (10 min)

   - Understand what documentation exists
   - Find answers quickly

2. **QUICK_REFERENCE.md** (5 min)

   - Test credentials
   - Common issues
   - Emergency help

3. **FRONTEND_SETUP.md** (20 min)

   - Axios configuration (copy the code!)
   - Auth Context setup (your foundation)
   - Protected routes pattern
   - Error handling

4. **api/endpoints.md** (10 min)
   - Bookmark this
   - Reference while coding
   - Know what endpoints do what

### **OPTIONAL** (Reference as needed)

- `POSTMAN_TESTING_GUIDE.md` - If you want to test APIs manually
- `POSTMAN_COLLECTIONS_REFERENCE.md` - If you want advanced testing

---

## 🚀 Quick Start (Today)

### **Step 1: Install Postman (5 minutes)**

Download from: https://www.postman.com/downloads/

After install:

1. Click **File → Import**
2. Navigate to: `docs/api/postman-collection.json`
3. Click **Import**

### **Step 2: Test Backend Connection (10 minutes)**

In Postman:

1. Expand **Authentication** folder
2. Click **Login (Job Seeker)**
3. Click **Send** button
4. You should see: `{ "token": "...", "data": { "id": "...", "role": "jobSeeker" } }`

**If it works:** ✅ Backend is running and connected  
**If it fails:** Check backend is running on http://localhost:3000/api

### **Step 3: Understand API Variables (5 minutes)**

In Postman collection, variables auto-save:

```
base_url     → http://localhost:3000/api
token        → Auto-saved after login
user_id      → Auto-saved from login response
job_id       → Auto-saved when you view a job
user_role    → Auto-saved as "jobSeeker" or "recruiter"
```

This means: Login once → all future requests use your token automatically! ✨

### **Step 4: Create Your React Project (10 minutes)**

In terminal:

```bash
npm create vite@latest ai-hiring-frontend -- --template react
cd ai-hiring-frontend
npm install
npm run dev
```

Visit: http://localhost:5173  
You should see the Vite welcome page ✅

---

## 📦 Install Required Dependencies

```bash
# Navigation
npm install react-router-dom

# HTTP Client
npm install axios

# UI Framework (Choose one)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Utilities
npm install lucide-react              # Icons
npm install date-fns                  # Date formatting
npm install react-hot-toast           # Notifications
```

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Jobs/
│   │   ├── JobList.jsx
│   │   ├── JobDetails.jsx
│   │   └── JobCard.jsx
│   ├── Applications/
│   │   ├── MyApplications.jsx
│   │   └── ApplicationStatus.jsx
│   └── Recruiter/
│       ├── Dashboard.jsx
│       ├── CreateJob.jsx
│       └── ApplicationReview.jsx
├── context/
│   ├── AuthContext.jsx              # Login/logout state
│   └── AppContext.jsx               # Global app state
├── services/
│   └── api.js                       # Axios instance (see FRONTEND_SETUP.md)
├── pages/
│   ├── Home.jsx
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── App.jsx                          # Router setup
└── index.css                        # Tailwind styles
```

---

## 🔑 Copy-Paste Code Snippets

### **1. Axios Setup** (`src/services/api.js`)

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
```

### **2. Auth Context** (`src/context/AuthContext.jsx`)

```javascript
import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await API.get('/auth/me');
          setUser(response.data.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.data);
    return response.data;
  };

  const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### **3. Protected Route** (`src/components/Auth/ProtectedRoute.jsx`)

```javascript
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
```

### **4. Login Component** (`src/components/Auth/Login.jsx`)

```javascript
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('jobseeker@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      toast.success('Login successful!');
      navigate(
        result.data.role === 'recruiter' ? '/recruiter/dashboard' : '/jobs'
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
```

### **5. Job List Component** (`src/components/Jobs/JobList.jsx`)

```javascript
import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minSalary: 0,
    maxSalary: 1000000,
    jobType: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        search: filters.search,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        jobType: filters.jobType,
        page: 1,
        limit: 10,
      };

      const response = await API.get('/jobs', { params });
      setJobs(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        {/* Add more filters as needed */}
      </div>

      {/* Job List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="p-4 border rounded hover:shadow-lg">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-green-600 font-bold">
                ${job.salary?.min}-${job.salary?.max}
              </p>
              <button className="mt-4 bg-blue-600 text-white p-2 rounded">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 📚 Building Week-by-Week

### **Week 1: Foundation**

- [ ] React project setup
- [ ] Axios + Auth Context working
- [ ] Login/Register pages functional
- [ ] Protected routes in place
- [ ] Local storage authentication working

**Testing:** Login in frontend, verify token saved, refresh page still logged in

### **Week 2: Job Features**

- [ ] Job list displays from API
- [ ] Search/filter working
- [ ] Job details page
- [ ] Pagination
- [ ] View count tracking

**Testing:** Browse jobs in Postman, verify counts match frontend

### **Week 3: Application System**

- [ ] Apply to job button
- [ ] My Applications page
- [ ] View application details
- [ ] Status tracking
- [ ] Error handling for duplicate apps

**Testing:** Apply via frontend, check Postman shows application created

### **Week 4: Recruiter Features**

- [ ] Switch between job seeker/recruiter
- [ ] Create job form
- [ ] View job applications
- [ ] Update application status
- [ ] Recruiter dashboard

**Testing:** Create job via frontend, apply as different user, update status

### **Week 5: Polish**

- [ ] UI/UX improvements
- [ ] Error messages user-friendly
- [ ] Loading states everywhere
- [ ] Responsive design
- [ ] Animations

**Testing:** Full end-to-end workflows

### **Week 6: Testing & Deploy**

- [ ] Unit tests
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Deployment prep
- [ ] Final verification

---

## 🧪 Testing Your Integration

### **Test 1: Authentication Flow**

```
1. Open frontend, click Login
2. Use: jobseeker@example.com / password123
3. Verify: Redirected to jobs page
4. Verify: localStorage has token
5. Verify: User name shown in header
6. Refresh page
7. Verify: Still logged in ✅
```

### **Test 2: Job Listing**

```
1. On jobs page, wait for list to load
2. In Postman, call GET /jobs
3. Verify: Frontend shows same jobs as Postman
4. Verify: Count matches
5. Try search filter
6. Verify: Results match Postman GET /jobs?search=... ✅
```

### **Test 3: Apply to Job**

```
1. Click "Apply" on a job
2. Confirm application
3. In Postman, GET /applications (auto-saves job_id)
4. Verify: Your application in list
5. Check status is "pending" ✅
```

### **Test 4: Recruiter Flow**

```
1. Logout, login as recruiter@example.com / password123
2. Verify: Redirected to recruiter dashboard
3. Create new job via form
4. In Postman, GET /jobs/my-jobs (as recruiter)
5. Verify: New job appears ✅
```

---

## 🐛 Common Issues & Solutions

### **Issue: CORS Error**

```
Error: Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:** Backend CORS is configured. Make sure backend is running on port 3000.

### **Issue: 401 Unauthorized on Protected Route**

```
Error: { message: "Not authenticated" }
```

**Solution:**

1. Did token auto-save? Check localStorage in browser DevTools
2. Is token in Authorization header? Check Postman request headers
3. Did token expire? Login again

### **Issue: Job ID undefined in filters**

```
Error: Cannot read property '_id' of undefined
```

**Solution:** Wait for API response before accessing job.\_id. Use loading state.

### **Issue: Form won't submit**

```
Error: Network error
```

**Solution:**

1. Is backend running? (`npm start` in backend folder)
2. Correct URL? Should be `http://localhost:3000/api`
3. Data format correct? Check Postman request body

---

## 🎨 UI Component Library Recommendation

### **Option 1: Tailwind CSS** (Recommended)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Simple, utility-first
- No component library overhead
- Great documentation

### **Option 2: Material-UI**

```bash
npm install @mui/material @emotion/react @emotion/styled
```

- Pre-built components
- Professional look
- More opinionated

### **Option 3: Shadcn/ui**

```bash
npm install shadcn-ui
```

- Modern, clean
- Copy-paste components
- Great for quick development

---

## 📱 API Endpoints You'll Use Most

### **Authentication**

```
POST   /auth/register        - Create account
POST   /auth/login           - Login
GET    /auth/me              - Get current user
```

### **Jobs**

```
GET    /jobs                 - List all jobs
GET    /jobs/:id             - Get job details
POST   /jobs                 - Create job (recruiter only)
PUT    /jobs/:id             - Update job (recruiter only)
DELETE /jobs/:id             - Delete job (recruiter only)
GET    /jobs/my-jobs         - Your jobs (recruiter only)
```

### **Applications**

```
POST   /applications         - Apply to job
GET    /applications         - Your applications
GET    /applications/:id     - Application details
GET    /jobs/:jobId/applications  - Job applications (recruiter)
PUT    /applications/:id/status   - Update application status
```

---

## ✅ Definition of Done

### **Feature Complete Means:**

- ✅ Frontend renders without errors
- ✅ API calls succeed (check Network tab in DevTools)
- ✅ Data displays correctly
- ✅ Errors handled gracefully
- ✅ Tested in Postman collection first
- ✅ Responsive on mobile
- ✅ No console errors

---

## 📞 Getting Help

### **Quick Questions**

→ Ask in team chat, reference docs

### **API Questions**

→ Check `docs/api/endpoints.md`

### **Integration Issues**

→ Compare your request with Postman collection

### **State Management Issues**

→ Review `FRONTEND_SETUP.md` Auth Context section

### **Stuck on Something?**

→ Reference `POSTMAN_TESTING_GUIDE.md` for how endpoints work

---

## 🚀 Ready to Begin?

### **Your Checklist:**

- [ ] Read QUICK_REFERENCE.md
- [ ] Read FRONTEND_SETUP.md
- [ ] Import postman-collection.json
- [ ] Test login in Postman (works? ✅)
- [ ] Create React project
- [ ] Install dependencies
- [ ] Copy Axios setup code
- [ ] Copy Auth Context code
- [ ] Create Login component
- [ ] Test first login flow

**Once these are done → Week 1 Foundation complete!**

---

## 💪 You Got This!

You have:

- ✅ Production-ready backend
- ✅ Complete API documentation
- ✅ Working Postman collection
- ✅ Code examples ready to copy
- ✅ Clear step-by-step guide

All the pieces are in place. Now it's time to **build something amazing**! 🎉

---

**Questions?** Check the docs first, then ask!  
**Stuck?** Compare with Postman, then debug.  
**Ready?** Let's create an incredible AI Hiring System! 🚀

Good luck, Syed! 💪
