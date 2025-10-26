# Vercel deployment (frontend)

This project uses Create React App. The repository root includes `vercel.json` to build only the frontend and proxy API requests to your backend.

## Build & output

- Build command: `npm run build --prefix frontend`
- Output directory: `frontend/build`

## Required env vars (Vercel → Project Settings → Environment Variables)

- BACKEND_URL: e.g. https://api.ai-hiring.app (your backend base URL without trailing slash)
- (Optional) REACT_APP_API_URL: will be set from BACKEND_URL by vercel.json, but you can override

## How API requests work

- Frontend uses `REACT_APP_API_URL` (see `src/services/api.js`).
- `vercel.json` sets `REACT_APP_API_URL` to `${BACKEND_URL}/api` and rewrites `/api/*` to `${BACKEND_URL}/api/*`.
- You can use either approach:
  1. Allow axios to hit `REACT_APP_API_URL` directly (preferred); or
  2. Use `/api` relative paths and let Vercel rewrites forward to the backend.

## Steps

1. Push repo to GitHub
2. In Vercel, import the GitHub repo
3. Leave “Framework Preset” as Create React App
4. Add env vars:
   - `BACKEND_URL` = https://your-backend-domain
5. Deploy

## CORS

Make sure your backend CORS allows the Vercel domain:

- In `backend/app.js`, CORS origin should include your Vercel site (e.g., https://ai-hiring.vercel.app)

## Troubleshooting

- 404s on API: confirm `BACKEND_URL` correctness and that backend is reachable over HTTPS
- Mixed content: ensure BACKEND_URL is https
- Auth issues: verify tokens are sent; `Authorization` header is added in `src/services/api.js`
