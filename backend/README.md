# Backend (Node.js + Express)

Quick start:

1. Install dependencies:

```cmd
cd d:\final-year-project\ai-hiring-system
npm install
```

2. Create and populate environment variables (use `backend/.env.example` as a template).

3. Run in dev mode (requires nodemon):

```cmd
npm run backend:dev
```

4. Lint and test:

```cmd
npm run lint
npm test
```

5. Health check:

- GET /health -> { status: 'ok' }

Notes:

- Add routes under `backend/routes/` and controllers in `backend/controllers/`.
- Use `backend/models/` for Mongoose schemas.
- Auth routes available at `/api/auth` (register, login, me).
- Job routes available at `/api/jobs` (CRUD, search, filter, my-jobs).
- Application routes available at `/api/applications` (apply, manage, track).
