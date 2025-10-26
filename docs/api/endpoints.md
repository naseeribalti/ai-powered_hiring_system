# AI Hiring System - API Documentation

## Overview

Complete REST API for the AI-Powered Hiring System. All endpoints require authentication via JWT token (except public job browsing and auth endpoints).

**Base URL**: `http://localhost:3000/api`

**Authentication**: Include JWT token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "jobSeeker",
  "phone": "+1-555-0123"
}
```

**Parameters:**

- `firstName` (string, required): First name (2-50 chars)
- `lastName` (string, required): Last name (2-50 chars)
- `email` (string, required): Valid email address
- `password` (string, required): Minimum 8 characters
- `role` (string, optional): `jobSeeker` (default), `recruiter`, or `admin`
- `phone` (string, optional): Contact phone number

**Response (201 Created):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "jobSeeker",
    "phone": "+1-555-0123",
    "isActive": true,
    "createdAt": "2025-10-24T10:30:00Z",
    "updatedAt": "2025-10-24T10:30:00Z"
  }
}
```

**Error Responses:**

- `409 Conflict`: Email already in use
- `422 Unprocessable Entity`: Validation failed

---

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Parameters:**

- `email` (string, required): User email address
- `password` (string, required): User password

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "jobSeeker",
    "isActive": true,
    "createdAt": "2025-10-24T10:30:00Z",
    "updatedAt": "2025-10-24T10:30:00Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid credentials
- `422 Unprocessable Entity`: Validation failed

---

### Get Current User Profile

**GET** `/auth/me`

Retrieve authenticated user's profile information.

**Authentication**: Required ✅

**Response (200 OK):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "jobSeeker",
    "phone": "+1-555-0123",
    "isActive": true,
    "createdAt": "2025-10-24T10:30:00Z",
    "updatedAt": "2025-10-24T10:30:00Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Token missing or invalid
- `401 Unauthorized`: User not found

---

## Jobs Endpoints

### Browse All Jobs

**GET** `/jobs`

Retrieve paginated list of active jobs with optional filtering and search.

**Authentication**: Not required (public endpoint)

**Query Parameters:**

- `search` (string, optional): Search in title/description
- `location` (string, optional): Filter by location (case-insensitive)
- `skills` (string, optional): Comma-separated skills (e.g., `javascript,react`)
- `salary_min` (number, optional): Minimum salary
- `job_type` (string, optional): `full-time`, `part-time`, `contract`, `internship`, `remote`
- `experience_level` (string, optional): `entry`, `mid`, `senior`, `lead`, `executive`
- `status` (string, optional): Job status (default: `active`)
- `sort` (string, optional): Sort fields (default: `-createdAt`). Use `-field` for descending
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 10)

**Example Request:**

```
GET /jobs?search=developer&location=San+Francisco&skills=javascript,react&page=1&limit=10
```

**Response (200 OK):**

```json
{
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior Backend Developer",
      "description": "Build scalable backend systems...",
      "requirements": "5+ years experience...",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "salary": {
        "min": 120000,
        "max": 180000,
        "currency": "USD"
      },
      "skills": ["Node.js", "MongoDB", "AWS"],
      "experienceLevel": "senior",
      "jobType": "full-time",
      "postedBy": {
        "_id": "507f1f77bcf86cd799439012",
        "firstName": "Jane",
        "lastName": "Recruiter",
        "email": "jane@company.com"
      },
      "status": "active",
      "viewCount": 245,
      "createdAt": "2025-10-24T10:30:00Z",
      "updatedAt": "2025-10-24T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### Get Job Details

**GET** `/jobs/:id`

Retrieve detailed information about a specific job.

**Authentication**: Not required (public endpoint)

**URL Parameters:**

- `id` (string, required): Job ID (MongoDB ObjectId)

**Response (200 OK):**

```json
{
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior Backend Developer",
    "description": "Build scalable backend systems...",
    "requirements": "5+ years experience...",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "salary": {
      "min": 120000,
      "max": 180000,
      "currency": "USD"
    },
    "skills": ["Node.js", "MongoDB", "AWS"],
    "experienceLevel": "senior",
    "jobType": "full-time",
    "postedBy": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Recruiter",
      "email": "jane@company.com"
    },
    "status": "active",
    "viewCount": 246,
    "applications": [],
    "createdAt": "2025-10-24T10:30:00Z",
    "updatedAt": "2025-10-24T10:30:00Z"
  }
}
```

**Error Responses:**

- `404 Not Found`: Job not found
- `400 Bad Request`: Invalid job ID format

---

### Create Job Posting

**POST** `/jobs`

Post a new job listing (recruiters and admins only).

**Authentication**: Required ✅ (Role: `recruiter` or `admin`)

**Request Body:**

```json
{
  "title": "Senior Backend Developer",
  "description": "Build scalable backend systems for our platform...",
  "requirements": "5+ years experience with Node.js and MongoDB",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "jobType": "full-time",
  "experienceLevel": "senior",
  "skills": ["Node.js", "MongoDB", "AWS"],
  "salary": {
    "min": 120000,
    "max": 180000,
    "currency": "USD"
  },
  "status": "active"
}
```

**Parameters:**

- `title` (string, required): Job title (3-200 chars)
- `description` (string, required): Full job description (10-5000 chars)
- `requirements` (string, optional): Required qualifications
- `company` (string, required): Company name (2-200 chars)
- `location` (string, required): Job location (2-200 chars)
- `jobType` (string, required): `full-time`, `part-time`, `contract`, `internship`, `remote`
- `experienceLevel` (string, optional): `entry`, `mid`, `senior`, `lead`, `executive`
- `skills` (array, optional): Array of required skills
- `salary` (object, optional): `{ min, max, currency }`
- `status` (string, optional): `draft`, `active`, `paused`, `closed`, `expired`

**Response (201 Created):**

```json
{
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior Backend Developer",
    "description": "Build scalable backend systems...",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "jobType": "full-time",
    "experienceLevel": "senior",
    "skills": ["Node.js", "MongoDB", "AWS"],
    "salary": {
      "min": 120000,
      "max": 180000,
      "currency": "USD"
    },
    "postedBy": "507f1f77bcf86cd799439012",
    "status": "active",
    "viewCount": 0,
    "applications": [],
    "createdAt": "2025-10-24T10:30:00Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User role not `recruiter` or `admin`
- `422 Unprocessable Entity`: Validation failed

---

### Update Job

**PUT** `/jobs/:id`

Update an existing job posting (owner or admin only).

**Authentication**: Required ✅ (Role: `recruiter` or `admin`)

**URL Parameters:**

- `id` (string, required): Job ID

**Request Body:** (all fields optional, send only fields to update)

```json
{
  "title": "Updated Job Title",
  "status": "paused",
  "salary": {
    "min": 130000,
    "max": 190000
  }
}
```

**Response (200 OK):**

```json
{
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Job Title",
    "status": "paused",
    "salary": {
      "min": 130000,
      "max": 190000,
      "currency": "USD"
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not job owner or admin
- `404 Not Found`: Job not found
- `422 Unprocessable Entity`: Validation failed

---

### Delete Job

**DELETE** `/jobs/:id`

Remove a job posting (owner or admin only).

**Authentication**: Required ✅ (Role: `recruiter` or `admin`)

**URL Parameters:**

- `id` (string, required): Job ID

**Response (200 OK):**

```json
{
  "message": "Job deleted successfully"
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not job owner or admin
- `404 Not Found`: Job not found

---

### Get My Job Postings

**GET** `/jobs/my-jobs`

Retrieve all jobs posted by authenticated recruiter.

**Authentication**: Required ✅ (Role: `recruiter` or `admin`)

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 10)

**Response (200 OK):**

```json
{
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior Backend Developer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "status": "active",
      "viewCount": 245,
      "createdAt": "2025-10-24T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "pages": 2
  }
}
```

---

## Applications Endpoints

### Apply to Job

**POST** `/applications`

Submit application for a job posting (job seekers only).

**Authentication**: Required ✅ (Role: `jobSeeker`)

**Request Body:**

```json
{
  "jobId": "507f1f77bcf86cd799439011",
  "coverLetter": "I am very interested in this position because..."
}
```

**Parameters:**

- `jobId` (string, required): ID of the job to apply for
- `coverLetter` (string, optional): Cover letter (10-5000 chars)

**Response (201 Created):**

```json
{
  "application": {
    "_id": "507f1f77bcf86cd799439020",
    "applicant": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior Backend Developer",
      "company": "Tech Corp"
    },
    "status": "pending",
    "coverLetter": "I am very interested in this position because...",
    "statusHistory": [
      {
        "status": "pending",
        "changedAt": "2025-10-24T10:30:00Z",
        "changedBy": "507f1f77bcf86cd799439011"
      }
    ],
    "appliedAt": "2025-10-24T10:30:00Z",
    "createdAt": "2025-10-24T10:30:00Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated or not a job seeker
- `403 Forbidden`: User role must be `jobSeeker`
- `404 Not Found`: Job not found
- `409 Conflict`: Already applied to this job
- `400 Bad Request`: Job posting is no longer active

---

### Get My Applications

**GET** `/applications/my-applications`

Retrieve all applications submitted by authenticated user.

**Authentication**: Required ✅ (Role: `jobSeeker`)

**Query Parameters:**

- `status` (string, optional): Filter by status (`pending`, `reviewed`, `interview`, `accepted`, `rejected`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 10)

**Example Request:**

```
GET /applications/my-applications?status=pending&page=1&limit=10
```

**Response (200 OK):**

```json
{
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "job": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Senior Backend Developer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "salary": { "min": 120000, "max": 180000 },
        "jobType": "full-time"
      },
      "status": "pending",
      "appliedAt": "2025-10-24T10:30:00Z",
      "statusHistory": [
        {
          "status": "pending",
          "changedAt": "2025-10-24T10:30:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

### View Application Details

**GET** `/applications/:applicationId`

Get detailed information about a specific application (applicant or recruiter only).

**Authentication**: Required ✅

**URL Parameters:**

- `applicationId` (string, required): Application ID

**Response (200 OK):**

```json
{
  "application": {
    "_id": "507f1f77bcf86cd799439020",
    "applicant": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123"
    },
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior Backend Developer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "salary": { "min": 120000, "max": 180000 }
    },
    "status": "pending",
    "coverLetter": "I am very interested...",
    "statusHistory": [
      {
        "status": "pending",
        "changedAt": "2025-10-24T10:30:00Z",
        "changedBy": "507f1f77bcf86cd799439011"
      }
    ],
    "appliedAt": "2025-10-24T10:30:00Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not applicant, recruiter, or admin
- `404 Not Found`: Application not found

---

### Get Job Applications

**GET** `/applications/jobs/:jobId/applications`

Retrieve all applications for a specific job (recruiter or admin only).

**Authentication**: Required ✅ (Role: `recruiter` or `admin`)

**URL Parameters:**

- `jobId` (string, required): Job ID

**Query Parameters:**

- `status` (string, optional): Filter by status
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 10)

**Response (200 OK):**

```json
{
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "applicant": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1-555-0123"
      },
      "status": "pending",
      "appliedAt": "2025-10-24T10:30:00Z"
    }
  ],
  "stats": {
    "total": 15,
    "pending": 8,
    "reviewed": 4,
    "interview": 2,
    "accepted": 1,
    "rejected": 0
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not job owner or admin
- `404 Not Found`: Job not found

---

### Update Application Status

**PUT** `/applications/:applicationId/status`

Move application through hiring workflow (recruiter or admin only).

**Authentication**: Required ✅ (Role: `recruiter` or `admin`)

**URL Parameters:**

- `applicationId` (string, required): Application ID

**Request Body:**

```json
{
  "status": "interview"
}
```

**Parameters:**

- `status` (string, required): New status: `pending`, `reviewed`, `interview`, `accepted`, `rejected`

**Response (200 OK):**

```json
{
  "application": {
    "_id": "507f1f77bcf86cd799439020",
    "status": "interview",
    "statusHistory": [
      {
        "status": "pending",
        "changedAt": "2025-10-24T10:30:00Z",
        "changedBy": "507f1f77bcf86cd799439012"
      },
      {
        "status": "reviewed",
        "changedAt": "2025-10-24T11:15:00Z",
        "changedBy": "507f1f77bcf86cd799439012"
      },
      {
        "status": "interview",
        "changedAt": "2025-10-24T12:00:00Z",
        "changedBy": "507f1f77bcf86cd799439012"
      }
    ]
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not job owner or admin
- `404 Not Found`: Application not found
- `422 Unprocessable Entity`: Invalid status

---

## Health Check

### System Health

**GET** `/health`

Check if backend service is running (public endpoint).

**Authentication**: Not required

**Response (200 OK):**

```json
{
  "status": "ok",
  "uptime": 3600.25
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

**Common HTTP Status Codes:**

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request format or parameters
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Authenticated but insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., duplicate application)
- `422 Unprocessable Entity` - Validation failed
- `500 Internal Server Error` - Server error

---

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration**: 7 days

**How to get a token:**

1. Register: `POST /auth/register`
2. Login: `POST /auth/login`
3. Use the `token` value from response

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 failed attempts per 15 minutes
- Search: 50 requests per minute

---

## Pagination

Paginated endpoints support:

- `page`: Page number (default: 1, minimum: 1)
- `limit`: Results per page (default: 10, maximum: 100)

Example: `/jobs?page=2&limit=20`

---

## Sorting

Sort parameters use MongoDB syntax:

- Field name: ascending order (e.g., `createdAt`)
- `-` prefix: descending order (e.g., `-createdAt`)
- Multiple: comma-separated (e.g., `status,-createdAt`)

---

## Date Format

All dates are ISO 8601 format (UTC):

```
"createdAt": "2025-10-24T10:30:00Z"
```

---

## Base URL Examples

**Development:**

```
http://localhost:3000/api
```

**Production (after deployment):**

```
https://api.ai-hiring-system.com/api
```

---

## Support & Issues

- Review test files in `backend/tests/` for endpoint examples
- Check `backend/README.md` for local setup instructions
- All endpoints are fully tested and documented
