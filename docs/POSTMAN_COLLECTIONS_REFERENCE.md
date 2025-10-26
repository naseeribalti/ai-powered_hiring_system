# 🧪 Complete Postman Collections & Testing Reference

**Status:** ✅ Complete with Multiple Testing Options  
**Last Updated:** October 25, 2025  
**Compatibility:** Postman v10.0+

---

## 📦 Available Collections

### 1. **Standard Collection** (Recommended for Most Users)

📄 File: `docs/api/postman-collection.json`

**Features:**

- ✅ 15 core API endpoints
- ✅ Basic request templates
- ✅ Pre-configured variables
- ✅ Clean, minimal structure
- ✅ Best for beginners

**Best For:** Learning, quick testing, frontend development

---

### 2. **Advanced Collection** (With Test Scripts)

📄 File: `docs/api/postman-collection-advanced.json`

**Features:**

- ✅ Automated test scripts
- ✅ Status code assertions
- ✅ Auto-save tokens & IDs
- ✅ Pre/post request scripts
- ✅ Console logging
- ✅ Complete workflow scenarios
- ✅ Error case testing

**Best For:** Comprehensive testing, CI/CD integration, quality assurance

---

### 3. **Python Documentation Generator**

📄 File: `scripts/generate_api_docs.py`

**Generates:**

```bash
python3 scripts/generate_api_docs.py

Output:
  ✅ api_specification.json - OpenAPI 3.0 spec
  ✅ postman_collection.json - New collection
  ✅ frontend_integration_guide.json - Integration help
```

---

## 🎯 Quick Start (5 minutes)

### Step 1: Import Collection

```bash
1. Open Postman (Web or Desktop)
2. Click "Import" button
3. Choose "File"
4. Select: docs/api/postman-collection.json
5. Click "Open"
```

### Step 2: Configure Variables

```
1. In Postman: Collections → Your Collection → Variables
2. Find: base_url
3. Set Current Value: http://localhost:3000/api
4. Save
```

### Step 3: Login to Get Token

```
1. Navigate to: Collections → Authentication → Login
2. Select "jobseeker@example.com" (already filled)
3. Click "Send"
4. Copy token from response
5. Paste into: {{token}} variable
```

### Step 4: Test Any Endpoint

```
1. Select endpoint from collection
2. Click "Send"
3. View response in "Body" tab
4. Done! ✅
```

---

## 📋 Collection Organization

### Standard Collection Structure

```
AI Hiring System API
├── Authentication (3 endpoints)
│   ├── Register User
│   ├── Login
│   └── Get Current User
├── Jobs (6 endpoints)
│   ├── Browse All Jobs
│   ├── Get Job Details
│   ├── Create Job
│   ├── Update Job
│   ├── Delete Job
│   └── Get My Jobs
├── Applications (5 endpoints)
│   ├── Apply to Job
│   ├── Get My Applications
│   ├── Get Application Details
│   ├── Get Job Applications
│   └── Update Status
└── System (1 endpoint)
    └── Health Check
```

### Advanced Collection Structure

```
Advanced Collection
├── Setup & Authentication (4 tests)
│   ├── 1️⃣ Check Backend Health
│   ├── 2️⃣ Register Job Seeker
│   ├── 3️⃣ Login as Job Seeker
│   └── 4️⃣ Get Current Profile
├── Jobs Management (7 tests)
│   ├── Browse Jobs
│   ├── Get Details
│   ├── Recruiter Setup
│   ├── Recruiter Login
│   ├── Create Job
│   ├── Update Job
│   └── Get My Jobs
├── Applications Workflow (5 tests)
│   ├── Apply to Job
│   ├── View My Applications
│   ├── View Details
│   ├── Recruiter View
│   └── Update Status
├── Error Handling (3 tests)
│   ├── Invalid Credentials
│   ├── Missing Token
│   └── Insufficient Permissions
└── Workflow Scenarios (2 tests)
    ├── Complete Job Application
    └── Recruiter Management
```

---

## 🔧 Pre-request Scripts (Advanced)

### Auto-generate Timestamp

```javascript
pm.environment.set('timestamp', Date.now());
```

### Generate Unique Email

```javascript
const timestamp = Date.now();
pm.environment.set('unique_email', `user-${timestamp}@example.com`);
```

### Add Custom Headers

```javascript
pm.request.headers.add({
  key: 'X-Custom-Header',
  value: 'your-value',
});
```

---

## ✅ Test Scripts (Advanced)

### Basic Status Test

```javascript
pm.test('Should return 200', function () {
  pm.response.to.have.status(200);
});
```

### Response Structure Test

```javascript
pm.test('Response has required fields', function () {
  pm.expect(pm.response.json()).to.have.property('data');
  pm.expect(pm.response.json().data).to.have.property('id');
});
```

### Auto-save Token

```javascript
pm.test('Save token', function () {
  const response = pm.response.json();
  pm.environment.set('token', response.token);
});
```

### Multiple Assertions

```javascript
pm.test('Complete test suite', function () {
  const response = pm.response.json();
  pm.expect(response.status).to.equal('success');
  pm.expect(response.data).to.be.an('array');
  pm.expect(response.data.length).to.equal(10);
  pm.environment.set('last_id', response.data[0].id);
});
```

---

## 🚀 Running from Command Line

### Install Newman (Postman CLI)

```bash
npm install -g newman
```

### Run Collection Directly

```bash
# Basic run
newman run docs/api/postman-collection.json

# With environment
newman run docs/api/postman-collection.json \
  -e docs/postman-environment.json

# Generate HTML report
newman run docs/api/postman-collection.json \
  -r html \
  --reporter-html-export test-report.html
```

### Run Specific Requests

```bash
newman run docs/api/postman-collection.json \
  --folder "Authentication" \
  -r cli

newman run docs/api/postman-collection-advanced.json \
  --folder "Setup & Authentication"
```

### Continuous Testing (CI/CD)

```bash
# GitHub Actions
newman run postman-collection.json \
  --environment postman-environment.json \
  --reporters cli,json \
  --reporter-json-export results.json

# Fail on test failure
if [ $? -ne 0 ]; then echo "Tests failed"; exit 1; fi
```

---

## 📊 Environment Variables Reference

### Default Variables (Pre-configured)

```
base_url                = http://localhost:3000/api
token                   = (auto-filled after login)
user_id                 = (auto-filled after login)
user_role               = (auto-filled after login)
job_id                  = (auto-filled after creating job)
application_id          = (auto-filled after applying)
recruiter_id            = (auto-filled after recruiter login)
timestamp               = (current time)
```

### Test Credentials (Pre-configured)

```
jobseeker_email         = jobseeker@example.com
test_password           = SecurePassword123
recruiter_email         = recruiter@example.com
```

### Create Custom Environment

1. Click **Environments** → **+**
2. Name: `My Environment`
3. Add variables:
   ```json
   {
     "key": "api_url",
     "value": "http://localhost:3000/api"
   },
   {
     "key": "timeout",
     "value": "5000"
   }
   ```
4. **Save**

---

## 🔄 Request Workflows

### Workflow 1: Complete Job Seeker Journey

```
Step 1: Check Health
  GET /health
  Expected: 200 OK

Step 2: Login
  POST /auth/login
  Expected: 200 OK, save token

Step 3: Get Profile
  GET /auth/me
  Expected: 200 OK, see user data

Step 4: Browse Jobs
  GET /jobs?page=1&limit=10
  Expected: 200 OK, array of jobs, save job_id

Step 5: View Job Details
  GET /jobs/{{job_id}}
  Expected: 200 OK, full job details

Step 6: Apply for Job
  POST /applications
  Body: jobId + coverLetter
  Expected: 201 Created, save application_id

Step 7: View My Applications
  GET /applications/my-applications
  Expected: 200 OK, array includes our application

Step 8: View Application Status
  GET /applications/{{application_id}}
  Expected: 200 OK, see "pending" status
```

### Workflow 2: Complete Recruiter Journey

```
Step 1: Login as Recruiter
  POST /auth/login (recruiter@example.com)
  Expected: 200 OK, save recruiter_token

Step 2: Create Job
  POST /jobs
  Body: Complete job details
  Expected: 201 Created, save job_id

Step 3: View My Jobs
  GET /jobs/my-jobs
  Expected: 200 OK, see created job

Step 4: View Job Applications
  GET /applications/jobs/{{job_id}}/applications
  Expected: 200 OK, see all applications (stats)

Step 5: Update Application Status
  PUT /applications/{{application_id}}/status
  Body: {"status": "interview"}
  Expected: 200 OK, status changed

Step 6: Check Updated Status
  GET /applications/jobs/{{job_id}}/applications
  Expected: 200 OK, stats updated
```

---

## 🧪 Test Execution Reports

### View Test Results

1. Send request in Advanced Collection
2. Click **Test Results** tab (next to Body)
3. See:
   - ✅ Passed assertions
   - ❌ Failed assertions
   - 📊 Count of assertions
   - ⏱️ Response time

### Generate Reports

```javascript
// Print to console
pm.test('My test', function () {
  console.log('Testing:', pm.request.name);
  console.log('Response:', pm.response.json());
  pm.expect(true).to.be.true;
});
```

### Run Test Suite (Runner)

1. Click **Runner** button (left sidebar)
2. Select collection
3. Select environment
4. Check "Requests" to run
5. Click **Run**
6. View summary report

---

## 🔍 Debugging & Troubleshooting

### Use Console

1. Click **View** → **Show Postman Console**
2. Run request
3. See detailed logs:
   ```
   Request URL: http://localhost:3000/api/jobs
   Request Method: GET
   Response Status: 200 OK
   Response Time: 45ms
   ```

### Use Inspector

1. Right-click request
2. Click **Open in New Tab**
3. Full HTTP details shown

### Check Network

1. **Network** tab shows all requests
2. Filter by status code
3. View request/response headers
4. Inspect payload

### Variable Debugging

1. Click **Environments**
2. Select environment
3. See all current values
4. Edit/reset as needed

---

## 📚 Integration with Development

### For Frontend Developers

```
1. Import postman-collection.json
2. Use it to test APIs BEFORE building UI
3. Understand request/response format
4. Verify error handling
5. Then build React components
```

### For Backend Developers

```
1. Use Advanced Collection
2. Run test suite with Newman
3. Verify all endpoints work
4. Check error cases
5. Ensure status codes correct
```

### For QA/Testers

```
1. Use Advanced Collection
2. Run complete workflows
3. Test edge cases
4. Document results
5. Report issues
```

---

## 🚀 Best Practices

### ✅ DO:

- Save complex workflows as collection
- Use variables instead of hardcoding values
- Add meaningful names to requests
- Use folders to organize endpoints
- Document expected responses
- Test error cases
- Export and share collections

### ❌ DON'T:

- Store real API keys in collections
- Share collections with sensitive data
- Use global variables for sensitive info
- Skip testing error scenarios
- Ignore response validation
- Test in production collection

---

## 📞 Quick Reference

| Task              | Steps                                          |
| ----------------- | ---------------------------------------------- |
| Import Collection | Import → File → Select JSON                    |
| Set Base URL      | Collections → Variables → base_url             |
| Get Token         | Login request → Copy token → Paste in variable |
| Run All Tests     | Runner → Select collection → Run               |
| Export Collection | Right-click → Export                           |
| Save Response     | Tests tab → save value to variable             |
| Retry Request     | Click Send again                               |
| Copy cURL         | Click Code → Select cURL                       |

---

## 🎓 Learning Resources

### Postman Documentation

- [Postman Learning Center](https://learning.postman.com/)
- [API Development in Postman](https://learning.postman.com/docs/designing-and-developing-your-api/managing-apis/)
- [Writing Tests](https://learning.postman.com/docs/writing-scripts/test-scripts/)

### Our Documentation

- 📖 API Reference: `docs/api/endpoints.md`
- 💻 Frontend Setup: `docs/FRONTEND_SETUP.md`
- 🗂️ Documentation Hub: `docs/INDEX.md`

---

## ✨ Summary

**Collections Available:**

- ✅ Standard Collection: Simple & beginner-friendly
- ✅ Advanced Collection: Full testing & automation
- ✅ Python Generator: Create custom collections

**Next Steps:**

1. Import one of the collections
2. Set base_url variable
3. Run "Login" to get token
4. Test any endpoint
5. Use as reference while building frontend

**Ready to test?** 🚀

```bash
# Start backend
cd backend && npm run dev

# In Postman:
# 1. Import docs/api/postman-collection.json
# 2. Set base_url = http://localhost:3000/api
# 3. Send requests!
```

---

**Last Updated:** October 25, 2025  
**Status:** Production Ready ✅
