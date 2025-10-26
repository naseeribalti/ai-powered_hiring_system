# Backend API Documentation

## Overview

This document provides a comprehensive guide to all backend API endpoints with clean, easy-to-understand examples.

---

## Base URL

```
http://localhost:3001/api
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Jobs](#jobs)
3. [Applications](#applications)
4. [AI/ML Features](#aiml-features)
5. [Notifications](#notifications)
6. [Admin](#admin)
7. [Resumes](#resumes)
8. [Users](#users)
9. [Billing & Subscriptions](#billing--subscriptions)
10. [Support Tickets](#support-tickets)

---

## Authentication

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "jobSeeker",  // or "recruiter"
  "companyName": "Tech Corp"  // Required for recruiters only
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "token": "jwt_token_here",
  "user": { ...user_data }
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

## Jobs

### Get All Jobs (with filters)

```http
GET /api/jobs?search=developer&location=remote&jobType=full-time&page=1&limit=10
```

**Query Parameters:**

- `search` - Search in title/description
- `location` - Filter by location
- `skills` - Filter by skills (comma-separated)
- `jobType` - full-time, part-time, contract, internship, remote
- `experienceLevel` - entry, mid, senior, lead, executive
- `salary_min` - Minimum salary
- `status` - active, paused, closed
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Get Single Job

```http
GET /api/jobs/:id
```

### Create Job (Recruiter only)

```http
POST /api/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "jobType": "full-time",
  "experienceLevel": "senior",
  "skills": ["JavaScript", "React", "Node.js"],
  "salary": {
    "min": 100000,
    "max": 150000,
    "currency": "USD"
  },
  "requirements": ["5+ years experience", "Bachelor's degree"],
  "benefits": ["Health insurance", "401k"],
  "status": "active"
}
```

### Update Job (Recruiter only)

```http
PUT /api/jobs/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Job Title",
  "status": "paused"
}
```

### Delete Job (Recruiter only)

```http
DELETE /api/jobs/:id
Authorization: Bearer {token}
```

### Get My Jobs (Recruiter)

```http
GET /api/jobs/my-jobs
Authorization: Bearer {token}
```

### Save Job (Job Seeker)

```http
POST /api/jobs/:id/save
Authorization: Bearer {token}
```

### Unsave Job (Job Seeker)

```http
DELETE /api/jobs/:id/save
Authorization: Bearer {token}
```

### Get Saved Jobs (Job Seeker)

```http
GET /api/jobs/saved
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "results": 5,
  "data": [
    {
      "_id": "job_id",
      "title": "Software Engineer",
      "company": {...},
      "savedAt": "2025-10-25T10:00:00Z",
      ...
    }
  ]
}
```

---

## Applications

### Submit Application

```http
POST /api/applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "job": "job_id_here",
  "coverLetter": "I am very interested...",
  "resume": "resume_id_here",
  "answers": [
    {
      "question": "Why do you want to work here?",
      "answer": "Because..."
    }
  ]
}
```

### Get My Applications (Job Seeker)

```http
GET /api/applications
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "results": 3,
  "data": [
    {
      "_id": "application_id",
      "job": {...job_details},
      "status": "pending",
      "appliedAt": "2025-10-20T12:00:00Z",
      ...
    }
  ]
}
```

### Get Applications for Job (Recruiter)

```http
GET /api/applications/job/:jobId
Authorization: Bearer {token}
```

### Update Application Status (Recruiter)

```http
PUT /api/applications/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "reviewed"  // or "shortlisted", "interview", "rejected", "accepted"
}
```

### Withdraw Application (Job Seeker)

```http
DELETE /api/applications/:id
Authorization: Bearer {token}
```

---

## AI/ML Features

### Parse Resume

```http
POST /api/ai/parse-resume
Authorization: Bearer {token}
Content-Type: application/json

{
  "resumeId": "resume_id_here"
}

Response:
{
  "status": "success",
  "data": {
    "resume": {
      "parsedData": {
        "name": "John Doe",
        "email": "john@example.com",
        "skills": [...],
        "experience": [...],
        "education": [...]
      }
    }
  }
}
```

### Analyze Resume Quality

```http
POST /api/ai/analyze-resume
Authorization: Bearer {token}
Content-Type: application/json

{
  "resumeId": "resume_id_here"
}

Response:
{
  "status": "success",
  "data": {
    "scores": {
      "overall": 85,
      "skillsMatch": 90,
      "experienceRelevance": 80,
      "atsCompatibility": 88
    },
    "recommendations": [
      {
        "type": "skill",
        "priority": "high",
        "message": "Consider adding more technical skills"
      }
    ]
  }
}
```

### Get Job Recommendations (AI-powered)

```http
GET /api/ai/job-recommendations?limit=10
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "results": 10,
  "data": {
    "recommendations": [
      {
        "_id": "job_id",
        "title": "Software Engineer",
        "matchScore": 92,
        "matchReasons": ["Skills match", "Experience level"],
        ...job_details
      }
    ]
  }
}
```

### Rank Candidates (Recruiter, AI-powered)

```http
POST /api/ai/rank-candidates
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobId": "job_id_here"
}

Response:
{
  "status": "success",
  "data": {
    "rankedCandidates": [
      {
        "candidate_id": "...",
        "rank": 1,
        "score": 95,
        "strengths": [...],
        "weaknesses": [...]
      }
    ]
  }
}
```

### Extract Skills from Text

```http
POST /api/ai/extract-skills
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "I have 5 years of experience with JavaScript, React, Node.js..."
}

Response:
{
  "status": "success",
  "data": {
    "skills": ["JavaScript", "React", "Node.js"],
    "categories": ["Frontend", "Backend"]
  }
}
```

### Check ML Service Health (Admin only)

```http
GET /api/ai/health
Authorization: Bearer {token}
```

---

## Notifications

### Get All Notifications

```http
GET /api/notifications?limit=50&skip=0&unreadOnly=false
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "results": 15,
  "data": [
    {
      "_id": "notification_id",
      "title": "Application Submitted",
      "message": "Your application for Software Engineer has been submitted",
      "type": "success",
      "read": false,
      "link": "/applications/app_id",
      "createdAt": "2025-10-25T10:00:00Z"
    }
  ]
}
```

### Get Unread Count

```http
GET /api/notifications/unread-count
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "data": {
    "count": 5
  }
}
```

### Mark Notification as Read

```http
PUT /api/notifications/:id/read
Authorization: Bearer {token}
```

### Mark All as Read

```http
PUT /api/notifications/read-all
Authorization: Bearer {token}
```

### Delete Notification

```http
DELETE /api/notifications/:id
Authorization: Bearer {token}
```

### Clear All Notifications

```http
DELETE /api/notifications
Authorization: Bearer {token}
```

---

## Admin

### Get Pending Recruiters

```http
GET /api/admin/recruiters/pending
Authorization: Bearer {admin_token}
```

### Approve Recruiter

```http
PATCH /api/admin/recruiters/:id/approve
Authorization: Bearer {admin_token}
```

### Reject Recruiter

```http
PATCH /api/admin/recruiters/:id/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Company information not verified"
}
```

### Suspend User

```http
PATCH /api/admin/users/:id/suspend
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Policy violation"
}
```

### Reactivate User

```http
PATCH /api/admin/users/:id/reactivate
Authorization: Bearer {admin_token}
```

### Get All Recruiters

```http
GET /api/admin/recruiters?status=active
Authorization: Bearer {admin_token}
```

---

## Resumes

### Upload Resume

```http
POST /api/resumes/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- resume: [file] (PDF or DOCX)
```

### Get User Resumes

```http
GET /api/resumes
Authorization: Bearer {token}
```

### Get Resume by ID

```http
GET /api/resumes/:id
Authorization: Bearer {token}
```

### Set Primary Resume

```http
PUT /api/resumes/:id/primary
Authorization: Bearer {token}
```

### Delete Resume

```http
DELETE /api/resumes/:id
Authorization: Bearer {token}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description here",
  "errors": [...]  // Optional validation errors
}
```

### Common Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## Authentication

All protected endpoints require JWT token in Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get token from `/api/auth/login` or `/api/auth/register` endpoints.

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 5 requests per 15 minutes
- Other endpoints: 100 requests per 15 minutes

---

## Pagination

List endpoints support pagination with `page` and `limit` query parameters:

```http
GET /api/jobs?page=2&limit=20
```

Response includes pagination metadata:

```json
{
  "status": "success",
  "results": 20,
  "page": 2,
  "totalPages": 10,
  "totalResults": 200,
  "data": [...]
}
```

---

## Best Practices

1. **Always include Authorization header** for protected routes
2. **Validate input data** on client-side before sending
3. **Handle errors gracefully** and display user-friendly messages
4. **Use pagination** for large datasets
5. **Cache responses** when appropriate
6. **Implement retry logic** for failed requests
7. **Log errors** for debugging

---

## Testing Endpoints

### Using cURL:

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get jobs with token
curl -X GET "http://localhost:3001/api/jobs?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman:

1. Create a new request
2. Set method (GET, POST, etc.)
3. Enter URL: `http://localhost:3001/api/...`
4. Add Authorization header: `Bearer {token}`
5. Add JSON body if needed
6. Send request

---

## Workflow Examples

### Job Seeker Flow:

1. Register → `POST /api/auth/register`
2. Upload resume → `POST /api/resumes/upload`
3. Parse resume → `POST /api/ai/parse-resume`
4. Get job recommendations → `GET /api/ai/job-recommendations`
5. Browse jobs → `GET /api/jobs`
6. Save interesting jobs → `POST /api/jobs/:id/save`
7. Apply for job → `POST /api/applications`
8. Track applications → `GET /api/applications`

### Recruiter Flow:

1. Register → `POST /api/auth/register` (role: recruiter)
2. Wait for admin approval
3. Create job posting → `POST /api/jobs`
4. View applications → `GET /api/applications/job/:jobId`
5. Rank candidates (AI) → `POST /api/ai/rank-candidates`
6. Update application status → `PUT /api/applications/:id/status`

---

## Billing & Subscriptions

### Get All Plans (Public)

```http
GET /api/billing/plans
```

**Response:**

```json
{
  "plans": [
    {
      "_id": "plan_id",
      "name": "Free",
      "description": "Basic access with limited features",
      "price": 0,
      "currency": "USD",
      "interval": "month",
      "features": [
        "Apply to up to 5 jobs/month",
        "Basic resume parsing",
        "Email notifications"
      ],
      "active": true,
      "sortOrder": 0
    }
  ]
}
```

### Get My Subscription (Protected)

```http
GET /api/billing/subscription
Authorization: Bearer <token>
```

**Response:**

```json
{
  "subscription": {
    "_id": "sub_id",
    "user": "user_id",
    "plan": { "name": "Pro", "price": 49 },
    "status": "active",
    "startDate": "2025-01-15T00:00:00.000Z",
    "currentPeriodEnd": "2025-02-15T00:00:00.000Z",
    "cancelAtPeriodEnd": false
  }
}
```

### Subscribe to Plan

```http
POST /api/billing/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "plan_id_here"
}
```

**Response (Free Plan):**

```json
{
  "subscription": {
    "status": "active",
    "plan": { "name": "Free" }
  },
  "checkout": null
}
```

**Response (Paid Plan):**

```json
{
  "subscription": {
    "status": "pending",
    "plan": { "name": "Pro" }
  },
  "checkout": {
    "mode": "manual",
    "sessionId": "sess_123456789"
  }
}
```

### Cancel Subscription

```http
POST /api/billing/cancel
Authorization: Bearer <token>
```

**Response:**

```json
{
  "subscription": {
    "_id": "sub_id",
    "status": "active",
    "cancelAtPeriodEnd": true,
    "currentPeriodEnd": "2025-02-15T00:00:00.000Z"
  }
}
```

---

## Support Tickets

### Create Ticket (User)

```http
POST /api/support/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Unable to upload resume",
  "description": "Getting error 500 when uploading PDF resume",
  "category": "technical",
  "priority": "high"
}
```

**Response:**

```json
{
  "ticket": {
    "_id": "ticket_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "subject": "Unable to upload resume",
    "description": "Getting error 500 when uploading PDF resume",
    "category": "technical",
    "priority": "high",
    "status": "open",
    "messages": [],
    "createdAt": "2025-10-26T10:00:00.000Z"
  }
}
```

### Get My Tickets

```http
GET /api/support/tickets?status=open&category=technical
Authorization: Bearer <token>
```

**Response:**

```json
{
  "tickets": [
    {
      "_id": "ticket_id",
      "subject": "Unable to upload resume",
      "status": "open",
      "priority": "high",
      "category": "technical",
      "createdAt": "2025-10-26T10:00:00.000Z"
    }
  ]
}
```

### Get Single Ticket

```http
GET /api/support/tickets/:id
Authorization: Bearer <token>
```

**Response:**

```json
{
  "ticket": {
    "_id": "ticket_id",
    "subject": "Unable to upload resume",
    "description": "Getting error 500 when uploading PDF resume",
    "status": "in_progress",
    "messages": [
      {
        "sender": { "name": "Support Agent" },
        "senderRole": "admin",
        "content": "We're looking into this issue",
        "createdAt": "2025-10-26T11:00:00.000Z"
      }
    ]
  }
}
```

### Add Message to Ticket

```http
POST /api/support/tickets/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I tried with a smaller file and it worked",
  "attachments": ["https://example.com/screenshot.png"]
}
```

### Close Ticket

```http
PATCH /api/support/tickets/:id/close
Authorization: Bearer <token>
```

**Response:**

```json
{
  "ticket": {
    "_id": "ticket_id",
    "status": "closed"
  }
}
```

### Get All Tickets (Admin)

```http
GET /api/support/admin/tickets?status=open&priority=high&page=1&limit=20
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "tickets": [...],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 3,
    "limit": 20
  }
}
```

### Update Ticket (Admin)

```http
PATCH /api/support/admin/tickets/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "urgent",
  "assignedTo": "admin_user_id",
  "tags": ["bug", "urgent"]
}
```

### Add Admin Message

```http
POST /api/support/admin/tickets/:id/messages
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "message": "This has been escalated to engineering team",
  "isInternal": false,
  "attachments": []
}
```

### Get Support Analytics (Admin)

```http
GET /api/support/admin/analytics
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "summary": {
    "total": 150,
    "open": 25,
    "inProgress": 40,
    "resolved": 85,
    "avgResolutionTime": "8 hours"
  },
  "byPriority": [
    { "priority": "low", "count": 30 },
    { "priority": "medium", "count": 60 },
    { "priority": "high", "count": 40 },
    { "priority": "urgent", "count": 20 }
  ],
  "byCategory": [
    { "category": "technical", "count": 60 },
    { "category": "billing", "count": 30 },
    { "category": "account", "count": 25 }
  ]
}
```

---

## Support

For issues or questions, contact the development team or check the backend logs.

Happy coding! 🚀
