## Copilot instructions for ai-powered_hiring_system

This repo is a 3-tier app: React frontend (3000), Node/Express API (3001), and a Python ML service (Flask, 3002). Focus your changes in the right tier and preserve existing patterns.

Architecture and data flow

- Backend entry: `backend/server.js` loads `backend/app.js` and starts before connecting to MongoDB (`backend/utils/db.js`). In development it can run without MongoDB (limited persistence).
- API mounts (see `backend/app.js`):
  - `/api/auth`, `/api/jobs`, `/api/applications`, `/api/ai`, `/api/users`, `/api/admin`, `/api/resumes`, `/api/search`, `/api/billing`, `/api/notifications`, `/api/support`.
- ML integration: `backend/controllers/aiController.js` proxies to `ML_SERVICE_URL` (default `http://localhost:3002`). Keep calls fast (<60s) and return the ML response mapped to the API’s shapes.
- Data store: MongoDB via `MONGODB_URI`. Core models include `backend/models/User.js`, `backend/models/Job.js`, plus `Application`, `Resume` (see controllers usage).

Conventions you must follow

- Routing: Put route files in `backend/routes/` and wire in `backend/app.js`. Example: `backend/routes/jobs.js` -> `jobController.*` functions.
- Validation: Use `express-validator` with `backend/middleware/validation.js` to return `{ errors: [{ field, message }] }` and HTTP 422.
- Auth: Require `Authorization: Bearer <jwt>` via `backend/middleware/auth.js (protect, authorize)`. Roles are `jobSeeker | recruiter | admin`. Use helpers from `backend/middleware/roleMiddleware.js` (e.g., `requireActiveRecruiter`, `canManageJob`).
- Errors: Throw/`next(err)` and let `backend/middleware/errorHandler.js` return `{ message }` with the proper status.
- Pagination/sorting: Jobs use `page`, `limit`, and a comma-separated `sort` (e.g., `-createdAt,title`) that maps to Mongo sort (see `getJobs` in `jobController`).
- Query params used by Jobs: `search` (text), `location`, `skills` (comma), `salary_min`, `job_type`, `experience_level`, `status`.

Frontend service patterns

- All HTTP goes through `frontend/src/services/api.js` (axios instance with baseURL `REACT_APP_API_URL || http://localhost:3001/api`, auth interceptor, toast on errors). Reuse/extend exported groups (`authAPI`, `jobsAPI`, `applicationsAPI`, `usersAPI`).
- Align endpoints to backend routes. Example fix: Job applications are served at `GET /api/applications/jobs/:jobId/applications` (see `backend/routes/applications.js`), not `/applications/job/:jobId`.
- Auth state lives in `frontend/src/context/AuthContext.js`. Prefer reading `user` and token via `useAuth()`.

Build, run, and tests (local dev)

- Backend from repo root:
  - Install once: `npm install`
  - Dev: `npm run backend:dev` (nodemon) • Lint: `npm run lint` • Tests: `npm test` (Jest; tests live in `backend/tests/**`).
- Frontend from `frontend/`:
  - Dev: `npm start` (proxy to 3001; or set `REACT_APP_API_URL`).
- ML service from `ai-ml/ml-service/`:
  - Create venv, `pip install -r ../requirements.txt`, start `python app.py` (defaults to 3002). See `ai-ml/ml-service/README.md`.

Key examples to mirror

- Jobs list endpoint (pagination + sort): see `backend/controllers/jobController.getJobs()`; response `{ jobs, pagination }`.
- Save/unsave job: `POST /api/jobs/:id/save`, `DELETE /api/jobs/:id/save` guarded by `protect` (Job Seekers).
- AI resume flow: `POST /api/ai/parse-resume` → update Resume, then `POST /api/ai/analyze-resume` → scores + recommendations (see `aiController`).

Adding a new API feature (contract)

- Create controller in `backend/controllers/*Controller.js` with input validation and 401/403 where applicable.
- Add route in `backend/routes/*.js` using `protect`, `authorize`, and `validation` middleware.
- Ensure consistent response shapes with the neighboring controller (don’t introduce a new pattern).
- Update `frontend/src/services/api.js` and call from a component/page via hooks/context.

Environment and ports

- Backend: `.env` needs `PORT=3001`, `MONGODB_URI`, `JWT_SECRET`, optional `ML_SERVICE_URL`.
- Frontend: `.env` may set `REACT_APP_API_URL=http://localhost:3001/api` (or rely on dev proxy).
- CORS: `backend/app.js` currently allows `http://localhost:3000` with credentials.

Gotchas

- Backend starts even if Mongo is down in development; writes will fail silently later—check logs from `backend/utils/db.js`.
- Keep role checks consistent: owners can manage their own jobs; admins bypass in `roleMiddleware.canManageJob`.
- When editing applications routes, match the established URL shapes in `backend/routes/applications.js` and update frontend accordingly.
