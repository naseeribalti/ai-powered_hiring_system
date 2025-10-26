# Role-Based Access Control (RBAC) Documentation

## Overview

Comprehensive guide to the role-based access control system in the AI Hiring System.

---

## User Roles

### 1. Job Seeker (`jobSeeker`)

**Purpose:** Job applicants searching and applying for positions

**Permissions:**

- ✅ Browse and search jobs
- ✅ View job details
- ✅ Apply to jobs
- ✅ View own applications
- ✅ Update own profile
- ✅ Upload resume
- ✅ Manage skills and experience
- ❌ Post jobs
- ❌ View other users' applications
- ❌ Manage recruiters

**Required Fields:**

- firstName, lastName, email, password
- skills (array) - for profile completion
- resumeUrl (optional)
- experienceLevel (optional)
- education (optional)

---

### 2. Recruiter (`recruiter`)

**Purpose:** Company representatives posting jobs and managing candidates

**Permissions:**

- ✅ Post new jobs
- ✅ Edit own jobs
- ✅ Delete own jobs
- ✅ View applications for own jobs
- ✅ Manage candidates for own jobs
- ✅ Update company profile
- ❌ View other recruiters' jobs
- ❌ Manage users
- ❌ Approve recruiters

**Required Fields:**

- firstName, lastName, email, password
- companyName (required)
- phone (required)
- companyWebsite (optional)
- companyDetails (optional)

**Status Requirements:**

- Must have `status: 'active'` to post jobs
- New recruiters start with `status: 'pending_approval'`
- Cannot login until approved by admin

---

### 3. Admin (`admin`)

**Purpose:** System administrators managing platform and users

**Permissions:**

- ✅ All job seeker permissions
- ✅ All recruiter permissions
- ✅ Approve/reject recruiters
- ✅ Suspend/reactivate users
- ✅ View all jobs and applications
- ✅ Manage any job
- ✅ View system analytics

**Required Fields:**

- firstName, lastName, email, password

---

## Account Statuses

### Status Types

| Status             | Description                 | Can Login? | Can Post Jobs?        |
| ------------------ | --------------------------- | ---------- | --------------------- |
| `active`           | Normal active account       | ✅ Yes     | ✅ Yes (if recruiter) |
| `inactive`         | Deactivated account         | ❌ No      | ❌ No                 |
| `suspended`        | Suspended due to violations | ❌ No      | ❌ No                 |
| `pending_approval` | Awaiting admin approval     | ❌ No      | ❌ No                 |

### Status Transitions

```
New Recruiter Registration
         ↓
   pending_approval ──→ (Admin Approves) ──→ active
         ↓
   (Admin Rejects)
         ↓
      inactive

Active User
         ↓
   (Admin Suspends)
         ↓
      suspended ──→ (Admin Reactivates) ──→ active
```

---

## Virtual Properties

### User Model Virtuals

```javascript
// Full name computed property
user.fullName; // "John Doe"

// Role checking
user.isRecruiter; // true if role === 'recruiter'
user.isJobSeeker; // true if role === 'jobSeeker'
user.isAdmin; // true if role === 'admin'

// Status checking
user.isActiveUser; // true if status === 'active' && isActive === true
user.isActiveRecruiter; // true if recruiter AND active
user.needsApproval; // true if recruiter AND pending_approval
```

---

## Instance Methods

### Authorization Methods

```javascript
// Check if user can post jobs
if (user.canPostJobs()) {
  // Only active recruiters return true
}

// Check if user can view specific job applications
if (user.canViewApplications([jobId1, jobId2])) {
  // Returns true if user is active recruiter and owns any of the jobs
}

// Check if user can manage a specific job
if (user.canManageJob(jobId)) {
  // Returns true if user is active recruiter and owns the job
}
```

### Activity Methods

```javascript
// Update last login timestamp
await user.updateLastLogin();

// Check if profile is complete (role-specific)
const isComplete = user.isProfileComplete();
// Job Seeker: needs firstName, lastName, email, skills
// Recruiter: needs firstName, lastName, email, companyName, phone
// Admin: needs firstName, lastName, email
```

---

## Static Methods

```javascript
// Find all active recruiters
const activeRecruiters = await User.findActiveRecruiters();

// Find recruiters pending approval
const pendingRecruiters = await User.findPendingApproval();

// Find users by role
const jobSeekers = await User.findByRole('jobSeeker');
const recruiters = await User.findByRole('recruiter');
```

---

## Middleware

### 1. Authentication Middleware

**File:** `/backend/middleware/auth.js`

```javascript
// Verify JWT token and attach user to request
router.use(protect);
```

**Usage:**

```javascript
router.get('/profile', protect, getProfile);
```

---

### 2. Role Restriction Middleware

**File:** `/backend/middleware/roleMiddleware.js`

#### `restrictTo(...roles)`

Restrict route to specific roles.

```javascript
// Only recruiters and admins
router.post('/jobs', protect, restrictTo('recruiter', 'admin'), createJob);

// Only admins
router.get('/admin/users', protect, restrictTo('admin'), getAllUsers);
```

#### `requireActiveRecruiter`

Ensure user is an active recruiter (not pending approval).

```javascript
router.post('/jobs', protect, requireActiveRecruiter, createJob);
```

**Response if not active recruiter:**

```json
{
  "status": "error",
  "message": "Only active recruiters can perform this action. Your account may be pending approval."
}
```

#### `requireAdmin`

Shortcut for admin-only routes.

```javascript
router.get('/admin/stats', protect, requireAdmin, getStats);
```

#### `canManageJob`

Verify user owns the job (or is admin).

```javascript
router.put(
  '/jobs/:id',
  protect,
  authorize('recruiter', 'admin'),
  canManageJob,
  updateJob
);
```

#### `checkAccountStatus`

Verify account is active and not suspended.

```javascript
router.post('/applications', protect, checkAccountStatus, createApplication);
```

---

## Route Protection Examples

### Job Routes

```javascript
// Public - no auth required
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);

// Recruiter only - requires active status
router.post('/jobs', protect, requireActiveRecruiter, createJob);
router.get('/jobs/my-jobs', protect, requireActiveRecruiter, getMyJobs);

// Recruiter/Admin - requires job ownership
router.put(
  '/jobs/:id',
  protect,
  authorize('recruiter', 'admin'),
  canManageJob,
  updateJob
);
router.delete(
  '/jobs/:id',
  protect,
  authorize('recruiter', 'admin'),
  canManageJob,
  deleteJob
);
```

### Application Routes

```javascript
// Job seeker - view own applications
router.get(
  '/applications/my-applications',
  protect,
  restrictTo('jobSeeker'),
  getMyApplications
);

// Recruiter - view applications for own jobs
router.get(
  '/jobs/:jobId/applications',
  protect,
  requireActiveRecruiter,
  getJobApplications
);

// Apply to job - any authenticated user
router.post('/applications', protect, checkAccountStatus, createApplication);
```

### Admin Routes

```javascript
// All require admin role
router.use('/admin', protect, requireAdmin);

router.get('/admin/recruiters/pending', getPendingRecruiters);
router.patch('/admin/recruiters/:id/approve', approveRecruiter);
router.patch('/admin/users/:id/suspend', suspendUser);
```

---

## Frontend Integration

### AuthContext with Role Support

```javascript
// src/context/AuthContext.js
export const useAuth = () => {
  const { user } = useContext(AuthContext);

  return {
    user,
    isRecruiter: user?.role === 'recruiter',
    isJobSeeker: user?.role === 'jobSeeker',
    isAdmin: user?.role === 'admin',
    isActiveRecruiter: user?.role === 'recruiter' && user?.status === 'active',
    needsApproval:
      user?.role === 'recruiter' && user?.status === 'pending_approval',
  };
};
```

### Protected Routes

```javascript
// src/components/routing/ProtectedRoute.js
<Route element={<ProtectedRoute allowedRoles={['recruiter', 'admin']} />}>
  <Route path="/jobs/new" element={<CreateJobPage />} />
</Route>

<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
  <Route path="/admin/recruiters" element={<RecruiterApprovalPage />} />
</Route>
```

### Conditional UI Rendering

```javascript
// DashboardPage.js
const { user, isActiveRecruiter, needsApproval } = useAuth();

{
  needsApproval && (
    <Alert variant="warning">
      Your recruiter account is pending admin approval.
    </Alert>
  );
}

{
  isActiveRecruiter && (
    <Button onClick={() => navigate('/jobs/new')}>Post New Job</Button>
  );
}
```

---

## Business Rules (SRS Compliance)

### FR-001: User Authentication

- ✅ JWT-based authentication with role in payload
- ✅ Password hashing with bcrypt
- ✅ Token expiration (7 days)

### FR-002: Role-Based Dashboard Access

- ✅ Different dashboards for job seekers vs recruiters
- ✅ Role stored in user model and token
- ✅ Frontend conditional rendering based on role

### FR-020: Recruiter Job Posting

- ✅ Only active recruiters can post jobs
- ✅ Recruiter approval workflow implemented
- ✅ Job ownership tracked in jobs_posted array

### FR-021: Candidate Management

- ✅ Recruiters can only view applications for own jobs
- ✅ Security checks prevent unauthorized access
- ✅ Admin can view all applications

### Rule 7.1.1: Recruiter Approval

- ✅ New recruiters start with pending_approval status
- ✅ Cannot login until admin approves
- ✅ Admin endpoints for approval/rejection

---

## Security Best Practices

### 1. Authentication Layer

- Always use `protect` middleware first
- Verify JWT token signature and expiration
- Attach authenticated user to `req.user`

### 2. Authorization Layer

- Check role AFTER authentication
- Use specific middleware for common checks
- Verify resource ownership for sensitive operations

### 3. Status Validation

- Check account status on login
- Prevent suspended users from accessing system
- Require approval for recruiter accounts

### 4. Resource Ownership

- Verify job ownership before updates/deletes
- Check application ownership before viewing
- Admin bypass for system management

---

## Error Handling

### Common Error Responses

```javascript
// 401 Unauthorized - Not authenticated
{
  "status": "error",
  "message": "Not authenticated"
}

// 403 Forbidden - Wrong role
{
  "status": "error",
  "message": "You do not have permission to perform this action"
}

// 403 Forbidden - Pending approval
{
  "status": "error",
  "message": "Your account is pending approval. Please wait for administrator review."
}

// 403 Forbidden - Suspended
{
  "status": "error",
  "message": "Your account has been suspended. Please contact support."
}

// 403 Forbidden - Not active recruiter
{
  "status": "error",
  "message": "Only active recruiters can perform this action."
}
```

---

## Testing Scenarios

### Scenario 1: Recruiter Registration & Approval

1. ✅ Recruiter registers with company details
2. ✅ Status set to `pending_approval`
3. ❌ Cannot login (401 error)
4. ✅ Admin approves recruiter
5. ✅ Status changes to `active`
6. ✅ Recruiter can now login and post jobs

### Scenario 2: Job Posting Authorization

1. ✅ Active recruiter creates job
2. ✅ Job added to `jobs_posted` array
3. ✅ Recruiter can edit/delete own job
4. ❌ Cannot edit/delete other recruiter's jobs
5. ✅ Admin can edit/delete any job

### Scenario 3: Account Suspension

1. ✅ Admin suspends user account
2. ✅ Status changes to `suspended`
3. ❌ User cannot login (401 error)
4. ✅ Admin reactivates account
5. ✅ User can login again

---

## Database Indexes

Performance indexes for role-based queries:

```javascript
// User model indexes
userSchema.index({ email: 1 }); // Unique index for login
userSchema.index({ role: 1, status: 1 }); // Filter by role and status
userSchema.index({ companyName: 'text' }); // Text search for recruiters
```

---

## Future Enhancements

1. **Granular Permissions**

   - Add permission array to user model
   - Custom permissions per role
   - Permission-based middleware

2. **Multi-Factor Authentication**

   - OTP for sensitive operations
   - Email verification required for recruiters

3. **Audit Logging**

   - Track role changes
   - Log admin actions
   - Monitor suspicious activity

4. **Rate Limiting by Role**
   - Different limits for different roles
   - Premium tier for recruiters
   - API quotas

---

**Last Updated:** October 25, 2025
**Version:** 1.0
**SRS Compliant:** Yes ✅
