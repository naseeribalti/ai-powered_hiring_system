# 🧪 Postman API Testing Guide for AI Hiring System

**Last Updated:** October 25, 2025  
**Status:** Production Ready  
**Collection Versions:** 2 (Standard + Advanced)

---

## 📥 Quick Import

### Option 1: Standard Collection (Recommended for Beginners)

1. Open Postman
2. Click **Import** → Choose **File**
3. Select: `docs/api/postman-collection.json`
4. Click **Open**

### Option 2: Advanced Collection (With Test Scripts)

1. Open Postman
2. Click **Import** → Choose **File**
3. Select: `docs/api/postman-collection-advanced.json`
4. Click **Open**

---

## ⚙️ Configuration

### Step 1: Set Base URL

After importing, configure variables:

1. Click **Collections** → Select your collection
2. Click **Variables** tab
3. Find `base_url` variable
4. Set **Current Value:** `http://localhost:3000/api`
5. Click **Save**

### Step 2: Environment Setup (Optional)

Create an environment for different configurations:

1. Click **Environments** → **+** button
2. Name it `AI Hiring - Development`
3. Add variables:
   ```
   base_url: http://localhost:3000/api
   token: (auto-filled after login)
   user_id: (auto-filled after login)
   job_id: (auto-filled after job creation)
   application_id: (auto-filled after applying)
   ```
4. Click **Save**

---

## 🔑 Authentication Flow

### Manual Token Setup

1. Send **Login** request (use test credentials below)
2. Copy `token` from response
3. Click **Collections** → **Edit**
4. Go to **Variables** tab
5. Paste token in `token` variable's **Current Value**
6. **Save**

### Automatic Token Setup (Advanced Collection Only)

1. Send **Login** request
2. Token automatically saved to environment ✅

**Test Credentials:**

```
Job Seeker:
  Email: jobseeker@example.com
  Password: SecurePassword123

Recruiter:
  Email: recruiter@example.com
  Password: SecurePassword123

Admin:
  Email: admin@example.com
  Password: SecurePassword123
```

---

## 📋 Testing Workflows

### Workflow 1: Job Seeker Complete Flow

**Follow these steps in order:**

1. ✅ **Check Backend Health** (No auth needed)

   - Endpoint: `GET /health`
   - Expected: 200 OK

2. ✅ **Register/Login as Job Seeker**

   - Endpoint: `POST /auth/login`
   - Body: Use jobseeker@example.com credentials
   - Save token from response

3. ✅ **Get Current Profile**

   - Endpoint: `GET /auth/me`
   - Auth: Bearer {{token}}
   - Expected: 200 OK with user profile

4. ✅ **Browse Jobs**

   - Endpoint: `GET /jobs`
   - Optional filters: search, location, skills
   - Expected: List of jobs with pagination

5. ✅ **View Job Details**

   - Endpoint: `GET /jobs/{{job_id}}`
   - Expected: Complete job information

6. ✅ **Apply for Job**

   - Endpoint: `POST /applications`
   - Body: jobId + cover letter
   - Expected: 201 Created with application ID

7. ✅ **View My Applications**
   - Endpoint: `GET /applications/my-applications`
   - Optional filter: status=pending
   - Expected: All your applications

---

### Workflow 2: Recruiter Complete Flow

**Follow these steps in order:**

1. ✅ **Check Backend Health**

   - Endpoint: `GET /health`

2. ✅ **Register/Login as Recruiter**

   - Endpoint: `POST /auth/login`
   - Email: recruiter@example.com
   - Save token

3. ✅ **Get Profile**

   - Endpoint: `GET /auth/me`
   - Verify role is "recruiter"

4. ✅ **Create Job**

   - Endpoint: `POST /jobs`
   - Fill in all required fields
   - Save job_id from response

5. ✅ **View My Jobs**

   - Endpoint: `GET /jobs/my-jobs`
   - Expected: Only your posted jobs

6. ✅ **View Job Applications**

   - Endpoint: `GET /applications/jobs/{{job_id}}/applications`
   - Expected: All applications for this job

7. ✅ **Update Application Status**
   - Endpoint: `PUT /applications/{{application_id}}/status`
   - Body: `{"status": "interview"}`
   - Expected: Application status updated

---

## 🧪 Detailed Endpoint Testing

### Authentication Endpoints

#### 1. POST /auth/register

```
URL: {{base_url}}/auth/register
Method: POST
Auth: None
Body (raw JSON):
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "SecurePassword123",
  "role": "jobSeeker"
}

Expected Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "jobSeeker"
  }
}
```

**Test Cases:**

- ✅ Valid registration data → 201
- ❌ Email already exists → 409
- ❌ Missing required field → 422
- ❌ Invalid email format → 422
- ❌ Password < 8 chars → 422

---

#### 2. POST /auth/login

```
URL: {{base_url}}/auth/login
Method: POST
Auth: None
Body (raw JSON):
{
  "email": "jobseeker@example.com",
  "password": "SecurePassword123"
}

Expected Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}

Note: Token auto-saved in Advanced Collection
```

**Test Cases:**

- ✅ Valid credentials → 200, returns token
- ❌ Wrong password → 401
- ❌ Email not found → 401
- ❌ Missing email/password → 422

---

#### 3. GET /auth/me

```
URL: {{base_url}}/auth/me
Method: GET
Auth: Bearer {{token}}

Expected Response (200):
{
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "jobseeker@example.com",
    "role": "jobSeeker",
    "phone": "+1-555-0001",
    "createdAt": "2025-10-24T10:30:00Z"
  }
}
```

**Test Cases:**

- ✅ Valid token → 200, returns user
- ❌ Missing token → 401
- ❌ Invalid token → 401
- ❌ Expired token → 401

---

### Jobs Endpoints

#### 1. GET /jobs (Browse Jobs)

```
URL: {{base_url}}/jobs
Method: GET
Auth: None
Query Parameters:
  - search=developer (optional)
  - location=Remote (optional)
  - skills=React,Node.js (optional)
  - page=1 (optional, default)
  - limit=10 (optional, default)

Expected Response (200):
{
  "jobs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Senior Developer",
      "company": "Tech Corp",
      "location": "Remote",
      "salary": { "min": 80000, "max": 120000 },
      "skills": ["React", "Node.js"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "pages": 5
  }
}
```

**Try These Searches:**

- `search=developer` → Find developer roles
- `location=Remote` → Remote jobs
- `skills=React` → React-specific jobs
- `salary_min=100000` → High-paying jobs

---

#### 2. POST /jobs (Create Job - Recruiter Only)

```
URL: {{base_url}}/jobs
Method: POST
Auth: Bearer {{token}} (Recruiter)
Body (raw JSON):
{
  "title": "Senior Full Stack Developer",
  "description": "We're looking for...",
  "company": "TechCorp",
  "location": "San Francisco, CA",
  "jobType": "full-time",
  "experienceLevel": "senior",
  "skills": ["React", "Node.js", "AWS"],
  "salary": {
    "min": 120000,
    "max": 180000,
    "currency": "USD"
  },
  "status": "active"
}

Expected Response (201):
{
  "job": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Senior Full Stack Developer",
    ...
  }
}
```

**Error Test Cases:**

- ❌ Job seeker tries to create → 403
- ❌ Missing required field → 422
- ❌ No auth token → 401

---

#### 3. PUT /jobs/{{job_id}} (Update Job)

```
URL: {{base_url}}/jobs/{{job_id}}
Method: PUT
Auth: Bearer {{token}} (Recruiter who created it)
Body (raw JSON):
{
  "status": "paused",
  "salary": {
    "min": 130000,
    "max": 190000
  }
}

Expected Response (200):
{
  "job": { updated job data }
}
```

**Error Test Cases:**

- ❌ Not the job owner → 403
- ❌ Invalid job ID → 404

---

#### 4. DELETE /jobs/{{job_id}}

```
URL: {{base_url}}/jobs/{{job_id}}
Method: DELETE
Auth: Bearer {{token}} (Recruiter who created it)

Expected Response (200):
{
  "message": "Job deleted successfully"
}
```

---

### Applications Endpoints

#### 1. POST /applications (Apply for Job)

```
URL: {{base_url}}/applications
Method: POST
Auth: Bearer {{token}} (Job Seeker)
Body (raw JSON):
{
  "jobId": "{{job_id}}",
  "coverLetter": "I am very interested in this position because..."
}

Expected Response (201):
{
  "application": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "applicant": "64f8a1b2c3d4e5f6a7b8c9d0",
    "job": "64f8a1b2c3d4e5f6a7b8c9d1",
    "status": "pending",
    "appliedAt": "2025-10-24T14:30:00Z"
  }
}
```

**Error Test Cases:**

- ❌ Duplicate application → 409
- ❌ Job not found → 404
- ❌ Not a job seeker → 403

---

#### 2. GET /applications/my-applications

```
URL: {{base_url}}/applications/my-applications
Method: GET
Auth: Bearer {{token}}
Query Parameters (optional):
  - status=pending (or: reviewed, interview, accepted, rejected)
  - page=1
  - limit=10

Expected Response (200):
{
  "applications": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "job": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "title": "Senior Developer",
        "company": "Tech Corp"
      },
      "status": "pending",
      "appliedAt": "2025-10-24T14:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### 3. PUT /applications/{{application_id}}/status (Update Status - Recruiter Only)

```
URL: {{base_url}}/applications/{{application_id}}/status
Method: PUT
Auth: Bearer {{token}} (Recruiter)
Body (raw JSON):
{
  "status": "interview"
}

Valid statuses: pending → reviewed → interview → accepted/rejected

Expected Response (200):
{
  "application": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "status": "interview",
    "statusHistory": [
      { "status": "pending", "changedAt": "...", "changedBy": "..." },
      { "status": "interview", "changedAt": "...", "changedBy": "..." }
    ]
  }
}
```

---

## 🧪 Test Scripts (Advanced Collection)

The Advanced Collection includes automatic test scripts that:

✅ Verify response status codes  
✅ Assert response structure  
✅ Auto-save IDs to variables  
✅ Log results to console  
✅ Display workflow progress

**View Test Results:**

1. Send a request
2. Click **Test Results** tab
3. See pass/fail results
4. Check **Console** for detailed logs

---

## 🔍 Error Scenarios to Test

### Test Invalid Credentials

```
Request: POST /auth/login
Body: {
  "email": "wrong@example.com",
  "password": "wrongpassword"
}
Expected: 401 Unauthorized
```

### Test Missing Token

```
Request: GET /applications/my-applications
Headers: (no Authorization header)
Expected: 401 Unauthorized
```

### Test Insufficient Permissions

```
Request: POST /jobs
Auth: Bearer {{token}} (Job Seeker token)
Body: { job data }
Expected: 403 Forbidden
```

### Test Duplicate Application

```
Request: POST /applications
Body: {
  "jobId": "{{job_id}}",
  "coverLetter": "..."
}
Expected: 201 (first time)
Expected: 409 Conflict (second time, same job)
```

---

## 📊 Common Test Patterns

### Pattern 1: Pagination Testing

```
Test Case 1: Get page 1
Request: GET /jobs?page=1&limit=5

Test Case 2: Get next page
Request: GET /jobs?page=2&limit=5

Verify: pagination.has_next increases correctly
```

### Pattern 2: Filtering Testing

```
Test Case 1: Search for "developer"
Request: GET /jobs?search=developer

Test Case 2: Location filter
Request: GET /jobs?location=Remote

Test Case 3: Multiple filters
Request: GET /jobs?search=developer&location=Remote&skills=React
```

### Pattern 3: Authorization Testing

```
Test as Job Seeker:
  ✅ GET /jobs (browse)
  ✅ POST /applications (apply)
  ✅ GET /applications/my-applications
  ❌ POST /jobs (create)
  ❌ PUT /applications/*/status (update)

Test as Recruiter:
  ✅ POST /jobs (create)
  ✅ GET /applications/jobs/*/applications
  ✅ PUT /applications/*/status (update)
  ✅ GET /jobs/my-jobs
  ❌ POST /applications (apply, wrong role)
```

---

## 💡 Pro Tips

### Tip 1: Use Pre-request Scripts

Add dynamic values before requests:

```javascript
// Generate unique email for each test
pm.environment.set('test_email', 'user-' + Date.now() + '@example.com');
```

### Tip 2: Chain Requests

Save values from one response to use in next:

```javascript
// After login
pm.environment.set('token', pm.response.json().token);

// After job creation
pm.environment.set('job_id', pm.response.json().job._id);
```

### Tip 3: Bulk Test with Runner

1. Click **Runner** button
2. Select collection
3. Check endpoints to test
4. Click **Run**
5. View all results in one report

### Tip 4: Export Collection

1. Right-click collection
2. **Export**
3. Share with team (includes all requests & variables)

---

## 📱 Testing Checklist

### Before Deploying to Production

- [ ] All auth endpoints working (register, login, me)
- [ ] Job CRUD operations verified
- [ ] Search and filtering working
- [ ] Applications workflow tested
- [ ] Status updates working
- [ ] Error responses correct (401, 403, 404, 422)
- [ ] Permissions enforced properly
- [ ] Token expiration handled
- [ ] CORS enabled for frontend
- [ ] Database connections stable
- [ ] Rate limiting working
- [ ] All 42 tests passing locally

---

## 🚀 Running Test Suite

### Command Line (Newman)

```bash
# Install newman (Postman CLI)
npm install -g newman

# Run collection
newman run postman-collection.json \
  --environment environment.json \
  --reporters cli,json

# Generate HTML report
newman run postman-collection.json \
  --environment environment.json \
  --reporters html \
  --reporter-html-template template.html
```

---

## 📞 Troubleshooting

### Issue: "Cannot GET /api/..."

**Solution:**

- Backend not running
- Run: `npm run dev` in backend folder
- Check port 3000 is correct

### Issue: "401 Unauthorized"

**Solution:**

- Token missing or expired
- Send login request again
- Copy new token to {{token}} variable

### Issue: "CORS error"

**Solution:**

- Backend CORS not configured
- Check backend .env
- Restart backend

### Issue: "Cannot read property 'token' of undefined"

**Solution:**

- Response not in expected format
- Check response in "Response" tab
- Verify login was successful

---

## 📚 Additional Resources

- **API Reference:** `docs/api/endpoints.md`
- **Frontend Setup:** `docs/FRONTEND_SETUP.md`
- **Backend README:** `backend/README.md`
- **Postman Docs:** https://learning.postman.com/
- **REST API Best Practices:** https://restfulapi.net/

---

**Happy Testing! 🎉**

For questions or issues, refer to the troubleshooting section or check `docs/INDEX.md`
