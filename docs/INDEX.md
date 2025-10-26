# AI Hiring System - Documentation Index

Welcome to the AI Hiring System documentation hub. This guide helps you navigate all resources for development and deployment.

---

## 📚 Quick Navigation

### For Backend Developers

1. **[Backend README](../backend/README.md)** - Setup, dependencies, running tests
2. **[API Endpoints Reference](api/endpoints.md)** - Complete API documentation with examples
3. **[Postman Collection](api/postman-collection.json)** - Import into Postman for testing

### For Frontend Developers

1. **[Frontend Setup Guide](FRONTEND_SETUP.md)** - Step-by-step frontend integration
2. **[API Endpoints Reference](api/endpoints.md)** - Understand API contracts
3. **[Postman Collection](api/postman-collection.json)** - Test APIs before frontend dev

### For DevOps/Deployment

1. **[Deployment Guide](technical/deployment-guide.md)** - Production setup & Docker
2. **[SRS Document](srs/software-requirements-specification.md)** - Requirements & architecture
3. **[API Endpoints Reference](api/endpoints.md)** - Available services

### For Project Managers

1. **[SRS Document](srs/software-requirements-specification.md)** - Full requirements & timeline
2. **[API Endpoints Reference](api/endpoints.md)** - Capabilities overview
3. **[Backend README](../backend/README.md)** - Development status

---

## 🚀 Getting Started (5 minutes)

### Backend (Node.js/Express)

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3000
# Tests: npm test
```

### Frontend (React)

```bash
cd frontend
npm install
# Set up .env with: REACT_APP_API_BASE_URL=http://localhost:3000/api
npm start
# Runs on http://localhost:3000 (requires backend running on different port)
```

---

## 📋 Complete Documentation Structure

```
docs/
├── README.md                          ← You are here
├── FRONTEND_SETUP.md                  ← Frontend integration guide
├── api/
│   ├── endpoints.md                   ← Complete API reference
│   ├── postman-collection.json        ← Postman import file
│   └── api-documentation.md           ← Original API docs
├── technical/
│   ├── deployment-guide.md            ← Production deployment
│   ├── api-documentation.md           ← API reference (legacy)
├── srs/
│   └── software-requirements-specification.md  ← Full project requirements
└── user-guides/
    ├── job-seeker-guide.md            ← End user documentation
    └── recruiter-guide.md             ← End user documentation
```

---

## 🔐 Authentication

All protected API endpoints require JWT authentication.

### Quick Test

```bash
# 1. Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jobseeker@example.com","password":"SecurePassword123"}'

# 2. Use token in requests
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Test Credentials:**

- Job Seeker: `jobseeker@example.com` / `SecurePassword123`
- Recruiter: `recruiter@example.com` / `SecurePassword123`
- Admin: `admin@example.com` / `SecurePassword123`

---

## 🎯 Core APIs

### Authentication (`/api/auth`)

- `POST /register` - Create account
- `POST /login` - Get JWT token
- `GET /me` - Current user profile

### Jobs (`/api/jobs`)

- `GET /` - Browse all jobs (public)
- `GET /:id` - Job details (public)
- `POST /` - Create job (recruiter only)
- `PUT /:id` - Update job (owner only)
- `DELETE /:id` - Delete job (owner only)
- `GET /my-jobs` - Your job postings

### Applications (`/api/applications`)

- `POST /` - Apply for job
- `GET /my-applications` - Your applications
- `GET /:applicationId` - Application details
- `GET /jobs/:jobId/applications` - Job applications (recruiter only)
- `PUT /:applicationId/status` - Update status (recruiter only)

---

## 📊 Database Schema

### Users

- Roles: `jobSeeker`, `recruiter`, `admin`
- Authentication: JWT + bcryptjs password hashing
- Fields: firstName, lastName, email, password, phone, isActive

### Jobs

- Posted by: Recruiters or Admins
- Status: draft, active, paused, closed, expired
- Search: Full-text indexing on title/description
- Filters: Location, skills, experience level, job type, salary range

### Applications

- Status workflow: pending → reviewed → interview → accepted/rejected
- Audit trail: statusHistory tracks all status changes with timestamp and actor
- Constraint: Unique per (applicant, job) - can't apply twice

---

## 🧪 Testing

### Run Tests

```bash
cd backend
npm test
```

### Coverage

```bash
npm test -- --coverage
```

### Specific Test Suite

```bash
npm test -- auth.test.js
npm test -- jobs.test.js
npm test -- applications.test.js
```

### Test with Postman

1. Import `docs/api/postman-collection.json` into Postman
2. Set `base_url` variable to `http://localhost:3000/api`
3. Run "Login" request first (token auto-saved)
4. Try other endpoints

---

## 🐳 Docker Deployment

### Build and Run

```bash
# Start all services (MongoDB, backend, frontend)
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Validate Configuration

```bash
docker compose config
```

---

## 📱 Frontend Implementation

### Architecture

- **Framework:** React 18 with Hooks
- **Routing:** React Router 6
- **State:** Context API (+ optional Redux for scalability)
- **HTTP Client:** Axios with JWT interceptors
- **Styling:** Tailwind CSS

### Setup Checklist

- [ ] Clone repo and run `npm install`
- [ ] Create `.env` with `REACT_APP_API_BASE_URL=http://localhost:3000/api`
- [ ] Set up `src/services/api.js` Axios instance
- [ ] Create Auth Context for state management
- [ ] Implement protected routes
- [ ] Build auth UI (Login, Register, Profile)
- [ ] Integrate job listing & search
- [ ] Implement job application workflow
- [ ] Build recruiter dashboard

**See:** [FRONTEND_SETUP.md](FRONTEND_SETUP.md) for complete setup guide with code examples.

---

## 🔧 Environment Configuration

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-hiring-system
JWT_SECRET=your-super-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

---

## 🚢 Deployment Steps

1. **Prepare Environment**

   - Set production environment variables
   - Update API_BASE_URL to production domain
   - Enable HTTPS

2. **Database**

   - Set up MongoDB Atlas or self-hosted MongoDB
   - Run migrations

3. **Backend**

   - Build: `npm install --production`
   - Start: `npm start`
   - Monitor with PM2 or Docker

4. **Frontend**

   - Build: `npm run build`
   - Deploy to CDN (Netlify, Vercel, AWS S3 + CloudFront)

5. **CI/CD**
   - GitHub Actions configured in `.github/workflows/ci.yml`
   - Auto-runs ESLint, Jest tests, Docker validation

**See:** [Deployment Guide](technical/deployment-guide.md)

---

## ✅ Quality Assurance

### Code Quality

- **Linting:** ESLint (0 warnings required)

  ```bash
  npm run lint
  ```

- **Testing:** Jest + Supertest

  ```bash
  npm test
  ```

- **Type Safety:** Optional JSDoc + TypeScript (can add)

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] ESLint clean
- [ ] Docker compose config valid
- [ ] Environment variables set
- [ ] API endpoints tested in Postman
- [ ] Frontend connects to backend
- [ ] Protected routes working
- [ ] Error handling implemented
- [ ] Sensitive data not in logs
- [ ] HTTPS enabled (production)

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**

```
→ Check MONGODB_URI in .env
→ Ensure MongoDB is running: mongosh
→ Verify connection string format
```

**"Port 3000 already in use"**

```
→ Kill process: lsof -ti:3000 | xargs kill -9
→ Or use different port: PORT=3001 npm start
```

**"JWT_SECRET not set"**

```
→ Add JWT_SECRET to .env file
→ Restart backend: npm run dev
```

### Frontend Issues

**"CORS error"**

```
→ Check REACT_APP_API_BASE_URL in .env
→ Verify backend CORS_ORIGIN matches frontend URL
→ Ensure backend is running
```

**"Token expired"**

```
→ JWT tokens last 7 days
→ Implement refresh token logic if needed
→ Auto-logout in Axios interceptor (see FRONTEND_SETUP.md)
```

---

## 📞 Support Resources

### Documentation Files

- API Reference: `docs/api/endpoints.md`
- Frontend Setup: `docs/FRONTEND_SETUP.md`
- Backend Setup: `backend/README.md`
- Requirements: `docs/srs/software-requirements-specification.md`

### Code Examples

- Tests: `backend/tests/*.test.js`
- Controllers: `backend/controllers/`
- Models: `backend/models/`
- Services: `backend/services/`

### External Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [JWT Docs](https://jwt.io/)
- [Postman Learning Center](https://learning.postman.com/)

---

## 📈 Development Timeline

### Phase 1: Foundation ✅

- Authentication system with JWT
- User model with roles (job seeker, recruiter, admin)
- Auth middleware and error handling

### Phase 2: Job Management ✅

- Job posting with advanced search
- Filtering by location, skills, salary, experience level
- View tracking and recruiter dashboard

### Phase 3: Applications ✅

- Job application workflow
- Status tracking with audit trail
- Permission-based access (applicant vs recruiter)

### Phase 4: Frontend 🔄

- React components for all workflows
- Job search interface
- Application management UI
- Recruiter dashboard

### Phase 5: Advanced Features (Future)

- File uploads (resumes, cover letters)
- Email notifications
- AI/ML job matching
- Analytics dashboard
- Profile completeness scoring

---

## 👥 Team Responsibilities

### Backend Developer (Muhammad Usama)

- Authentication & authorization
- Job management API
- Applications workflow
- Database design
- API testing
- Error handling & logging

### Frontend Developer (Syed Qamar Abbas)

- React component architecture
- User interfaces for all workflows
- API integration
- State management
- Responsive design
- Testing & QA

### DevOps (Shared)

- Docker configuration
- CI/CD pipeline
- Deployment automation
- Monitoring & logging

---

## 📝 Important Notes

1. **Security:**

   - Never commit `.env` files with real secrets
   - Change JWT_SECRET in production
   - Use HTTPS for all production API calls
   - Validate all user inputs

2. **Performance:**

   - Database indexes configured for search queries
   - Pagination implemented for large datasets
   - Lazy loading for frontend components

3. **Scalability:**

   - Separate concerns into services
   - Ready for microservices if needed
   - Connection pooling for database

4. **Testing:**
   - 42 tests passing (auth, jobs, applications)
   - Comprehensive edge case coverage
   - Mock database for isolated testing

---

## 🎓 Learning Resources

### Backend

- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Mongoose Best Practices](https://mongoosejs.com/docs/best_practices.html)
- [JWT Authentication](https://jwt.io/introduction)

### Frontend

- [React Hooks](https://react.dev/reference/react/hooks)
- [Context API](https://react.dev/reference/react/useContext)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

### Testing

- [Jest Documentation](https://jestjs.io/)
- [Supertest HTTP Assertions](https://github.com/visionmedia/supertest)

---

## 🎉 Ready to Start?

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd ai-hiring-system
   ```

2. **Backend Setup:**

   ```bash
   cd backend && npm install && npm run dev
   ```

3. **Frontend Setup:**

   ```bash
   cd frontend && npm install
   echo "REACT_APP_API_BASE_URL=http://localhost:3000/api" > .env
   npm start
   ```

4. **Test Everything:**

   ```bash
   # In backend directory
   npm test
   npm run lint
   ```

5. **Access the Application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001/api` (or update frontend .env)
   - API Docs: See `docs/api/endpoints.md`

---

## 📞 Questions?

Refer to the specific documentation for your role:

- **Backend Dev:** `backend/README.md` + `docs/api/endpoints.md`
- **Frontend Dev:** `docs/FRONTEND_SETUP.md` + `docs/api/endpoints.md`
- **DevOps:** `docs/technical/deployment-guide.md`
- **PM:** `docs/srs/software-requirements-specification.md`

Happy coding! 🚀
