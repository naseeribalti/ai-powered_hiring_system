# Admin API Documentation

## Overview

Admin routes for managing recruiters and users in the AI Hiring System.

**Base URL:** `http://localhost:3001/api/admin`

**Authentication:** All routes require valid JWT token with `admin` role.

---

## Authentication

Include JWT token in request headers:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get Pending Recruiters

Retrieve all recruiters waiting for approval.

**Endpoint:** `GET /recruiters/pending`

**Access:** Admin only

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "recruiters": [
      {
        "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@techcorp.com",
        "companyName": "Tech Innovations Inc",
        "companyWebsite": "https://techinnovations.com",
        "phone": "+1-555-0123",
        "createdAt": "2025-10-25T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get All Recruiters

Retrieve all recruiters with optional status filter.

**Endpoint:** `GET /recruiters?status=active`

**Access:** Admin only

**Query Parameters:**

- `status` (optional): Filter by status (`active`, `pending_approval`, `inactive`, `suspended`)

**Response:**

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "recruiters": [
      {
        "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@techcorp.com",
        "companyName": "Tech Innovations Inc",
        "status": "active",
        "createdAt": "2025-10-25T10:30:00.000Z",
        "lastLogin": "2025-10-25T15:45:00.000Z"
      }
    ]
  }
}
```

---

### 3. Approve Recruiter

Activate a pending recruiter account.

**Endpoint:** `PATCH /recruiters/:id/approve`

**Access:** Admin only

**URL Parameters:**

- `id`: Recruiter user ID

**Response:**

```json
{
  "status": "success",
  "message": "Recruiter approved successfully",
  "data": {
    "recruiter": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@techcorp.com",
      "status": "active",
      "role": "recruiter"
    }
  }
}
```

**Error Responses:**

- `404 Not Found`: Recruiter not found
- `400 Bad Request`: Recruiter is not pending approval

---

### 4. Reject Recruiter

Reject a pending recruiter application.

**Endpoint:** `PATCH /recruiters/:id/reject`

**Access:** Admin only

**URL Parameters:**

- `id`: Recruiter user ID

**Request Body:**

```json
{
  "reason": "Incomplete company information"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Recruiter rejected successfully",
  "data": {
    "recruiter": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "status": "inactive"
    }
  }
}
```

---

### 5. Suspend User

Suspend a user account (job seeker or recruiter).

**Endpoint:** `PATCH /users/:id/suspend`

**Access:** Admin only

**URL Parameters:**

- `id`: User ID

**Request Body:**

```json
{
  "reason": "Violation of terms of service"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "User suspended successfully",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "status": "suspended",
      "isActive": false
    }
  }
}
```

**Error Responses:**

- `404 Not Found`: User not found
- `403 Forbidden`: Cannot suspend admin accounts

---

### 6. Reactivate User

Reactivate a suspended or inactive user account.

**Endpoint:** `PATCH /users/:id/reactivate`

**Access:** Admin only

**URL Parameters:**

- `id`: User ID

**Response:**

```json
{
  "status": "success",
  "message": "User reactivated successfully",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "status": "active",
      "isActive": true
    }
  }
}
```

**Error Responses:**

- `404 Not Found`: User not found
- `400 Bad Request`: User is not suspended or inactive

---

## Status Values

### User Status

- `active`: Account is active and can be used
- `inactive`: Account is deactivated
- `suspended`: Account is suspended due to violations
- `pending_approval`: Recruiter account waiting for admin approval

---

## Error Responses

### 401 Unauthorized

```json
{
  "status": "error",
  "message": "Not authenticated"
}
```

### 403 Forbidden

```json
{
  "status": "error",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 400 Bad Request

```json
{
  "status": "error",
  "message": "Invalid request data"
}
```

---

## Testing with cURL

### Get Pending Recruiters

```bash
curl -X GET http://localhost:3001/api/admin/recruiters/pending \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Approve Recruiter

```bash
curl -X PATCH http://localhost:3001/api/admin/recruiters/64f5a1b2c3d4e5f6a7b8c9d0/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Suspend User

```bash
curl -X PATCH http://localhost:3001/api/admin/users/64f5a1b2c3d4e5f6a7b8c9d0/suspend \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"reason\": \"Terms of service violation\"}"
```

---

## Business Rules

1. **Recruiter Approval (SRS Rule 7.1.1)**

   - New recruiters register with status `pending_approval`
   - Cannot login or post jobs until approved
   - Admin must approve or reject application

2. **Account Suspension**

   - Admin accounts cannot be suspended
   - Suspended users cannot login
   - Can be reactivated by admin

3. **Status Transitions**
   - `pending_approval` → `active` (via approval)
   - `pending_approval` → `inactive` (via rejection)
   - `active` → `suspended` (via suspension)
   - `suspended` → `active` (via reactivation)
   - `inactive` → `active` (via reactivation)

---

## Frontend Integration Example

```javascript
// AdminService.js
import api from './api';

export const adminService = {
  // Get pending recruiters
  getPendingRecruiters: () => api.get('/admin/recruiters/pending'),

  // Get all recruiters
  getAllRecruiters: (status) =>
    api.get('/admin/recruiters', { params: { status } }),

  // Approve recruiter
  approveRecruiter: (recruiterId) =>
    api.patch(`/admin/recruiters/${recruiterId}/approve`),

  // Reject recruiter
  rejectRecruiter: (recruiterId, reason) =>
    api.patch(`/admin/recruiters/${recruiterId}/reject`, { reason }),

  // Suspend user
  suspendUser: (userId, reason) =>
    api.patch(`/admin/users/${userId}/suspend`, { reason }),

  // Reactivate user
  reactivateUser: (userId) => api.patch(`/admin/users/${userId}/reactivate`),
};
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- User IDs are MongoDB ObjectIds (24-character hex strings)
- Pagination is not implemented for admin routes (future enhancement)
- Email notifications for approval/rejection are placeholders (TODO)

---

**Last Updated:** October 25, 2025
**Version:** 1.0
