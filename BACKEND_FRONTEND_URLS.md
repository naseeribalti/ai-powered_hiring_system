# 🚀 BACKEND & FRONTEND - URLS & ACCESS GUIDE

**Date:** October 25, 2025  
**Status:** ✅ Ready to Access

---

## 📍 FRONTEND URL

### Development Server

```
http://localhost:3000
```

### How to Start Frontend

```bash
cd d:\final-year-project\ai-hiring-system\frontend
npm install
npm start
```

### Expected Output

```
✅ Compiled successfully!
You can now view ai-hiring-frontend in the browser
Local: http://localhost:3000
```

---

## 📍 BACKEND URL

### API Base URL

```
http://localhost:3001
```

### Health Check Endpoint

```
GET http://localhost:3001/api/health
```

### Expected Response

```json
{
  "status": "ok",
  "uptime": 1234.56
}
```

### How to Start Backend

```bash
cd d:\final-year-project\ai-hiring-system\backend
npm install
node server.js
```

---

## 🔗 API ENDPOINTS REFERENCE

### Authentication Endpoints

```
POST   http://localhost:3001/api/auth/login
POST   http://localhost:3001/api/auth/register
GET    http://localhost:3001/api/auth/profile
```

### Jobs Endpoints

```
GET    http://localhost:3001/api/jobs
POST   http://localhost:3001/api/jobs
GET    http://localhost:3001/api/jobs/:id
PUT    http://localhost:3001/api/jobs/:id
DELETE http://localhost:3001/api/jobs/:id
GET    http://localhost:3001/api/jobs/my-jobs
```

### Applications Endpoints

```
GET    http://localhost:3001/api/applications
POST   http://localhost:3001/api/applications
GET    http://localhost:3001/api/applications/:id
PUT    http://localhost:3001/api/applications/:id
DELETE http://localhost:3001/api/applications/:id
GET    http://localhost:3001/api/applications/my-applications
GET    http://localhost:3001/api/applications/job/:jobId
```

---

## 🎯 QUICK START COMMANDS

### Terminal 1: Start Backend

```bash
cd d:\final-year-project\ai-hiring-system\backend
npm install
node server.js
```

**Wait for:**

```
✅ Backend server listening on port 3001
```

### Terminal 2: Start Frontend

```bash
cd d:\final-year-project\ai-hiring-system\frontend
npm install
npm start
```

**Wait for:**

```
✅ Compiled successfully!
You can now view ai-hiring-frontend in the browser
Local: http://localhost:3000
```

---

## 🌐 ACCESS FROM DIFFERENT LOCATIONS

### Local Machine

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

### Another Machine on Network

- Frontend: `http://<YOUR-IP>:3000` (e.g., http://192.168.1.100:3000)
- Backend: `http://<YOUR-IP>:3001` (e.g., http://192.168.1.100:3001)

### Find Your IP Address

```bash
# Windows Command Prompt
ipconfig

# Look for IPv4 Address (e.g., 192.168.x.x)
```

---

## ✅ SYSTEM CHECK - BOTH RUNNING

Create a file to verify both are running:

### Check Script (Windows)

```bash
# Open http://localhost:3000 in browser for frontend
# Open http://localhost:3001/api/health in browser for backend
```

### Expected Results

**Frontend (http://localhost:3000):**

```
✅ Login page displays
✅ Navigation bar visible
✅ All CSS loaded
✅ No console errors
```

**Backend Health Check (http://localhost:3001/api/health):**

```json
{
  "status": "ok",
  "uptime": 12345.67
}
```

---

## 📊 CONFIGURATION SUMMARY

### Backend Configuration

- **Port:** 3001
- **Server:** http://localhost:3001
- **Database:** MongoDB (configured in utils/db.js)
- **Routes:** /api/auth, /api/jobs, /api/applications
- **Health Check:** GET /api/health

### Frontend Configuration

- **Port:** 3000
- **Server:** http://localhost:3000
- **Backend Proxy:** http://localhost:3001 (defined in package.json)
- **Router:** React Router v6.8
- **State Management:** Context API + React Query

### Network Communication

- Frontend makes API calls to: `http://localhost:3001/api/*`
- Automatically forwards requests via proxy in development
- Uses JWT tokens for authentication
- Error handling with toast notifications

---

## 🧪 TEST API ENDPOINTS

### Using Browser

```
1. Health Check:
   http://localhost:3001/api/health

2. Frontend:
   http://localhost:3000
```

### Using Postman or cURL

**Login Example:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Get Jobs Example:**

```bash
curl http://localhost:3001/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔐 AUTHENTICATION FLOW

1. **User opens** → `http://localhost:3000`
2. **Clicks Login/Register**
3. **Frontend sends** → POST to `http://localhost:3001/api/auth/login`
4. **Backend returns** → JWT token
5. **Frontend stores** → Token in localStorage
6. **Frontend redirects** → Dashboard
7. **All API calls** → Include JWT token in header
8. **Backend verifies** → Token validity
9. **Returns data** → If authenticated

---

## 📋 STEP-BY-STEP ACCESS GUIDE

### Step 1: Open Terminal 1

```bash
cd d:\final-year-project\ai-hiring-system\backend
npm install
node server.js
```

### Step 2: Wait for Backend

```
✅ Backend server listening on port 3001
```

### Step 3: Open Terminal 2

```bash
cd d:\final-year-project\ai-hiring-system\frontend
npm install
npm start
```

### Step 4: Wait for Frontend

```
✅ Compiled successfully!
Your app is running at: http://localhost:3000
```

### Step 5: Access Frontend

- Open Browser: `http://localhost:3000`
- Login page displays ✅

### Step 6: Test Login

- Email: `test@example.com`
- Password: `password123`
- Click Login
- Dashboard loads ✅

### Step 7: Verify Backend Connection

- Open new tab: `http://localhost:3001/api/health`
- See: `{ "status": "ok", "uptime": ... }` ✅

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue: "Cannot GET /"

**Solution:** Backend not running on port 3001

```bash
# Make sure terminal running: node server.js
# Check: http://localhost:3001/api/health
```

### Issue: "Connection Refused"

**Solution:** Port already in use

```bash
# Find process using port
netstat -ano | findstr :3001

# Kill process (replace PID with actual number)
taskkill /PID 12345 /F
```

### Issue: "Cannot Connect to Database"

**Solution:** Check MongoDB connection

```bash
# Verify MongoDB is running
# Check connection string in config/database.js
```

### Issue: Frontend Not Loading

**Solution:** Clear browser cache and restart

```bash
# Clear cache: Ctrl+Shift+Delete
# Hard refresh: Ctrl+Shift+R
# Restart: npm start
```

---

## 📱 RESPONSIVE TESTING

### Desktop

```
http://localhost:3000
```

### Mobile Simulation

```
# In Chrome Developer Tools:
Press: F12 → Toggle Device Toolbar → Ctrl+Shift+M
```

### Test Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

---

## 🎯 VERIFICATION CHECKLIST

### Backend

- [x] Server listens on port 3001
- [x] Health endpoint: `/api/health` ✅
- [x] Auth routes: `/api/auth/*` ✅
- [x] Jobs routes: `/api/jobs/*` ✅
- [x] Applications routes: `/api/applications/*` ✅
- [x] Error handler middleware ✅
- [x] Database connection ✅

### Frontend

- [x] App runs on port 3000
- [x] React Router configured ✅
- [x] Login page displays ✅
- [x] API proxy to backend ✅
- [x] Bootstrap CSS loaded ✅
- [x] Authentication context ✅
- [x] API service configured ✅

### Communication

- [x] Frontend connects to Backend ✅
- [x] API calls work ✅
- [x] Authentication works ✅
- [x] Error handling works ✅
- [x] Token management works ✅

---

## 🚀 PRODUCTION DEPLOYMENT URLS

### Example URLs (Update with your domain)

```
Frontend: https://yourdomain.com
Backend:  https://api.yourdomain.com
```

### Environment Variables for Production

```
REACT_APP_API_URL=https://api.yourdomain.com
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your-secret-key
```

---

## 📞 SUPPORT & DEBUGGING

### Enable Debug Logs

```javascript
// In frontend/src/services/api.js
// Uncomment console.log for request/response
```

### Browser DevTools

```
F12 → Network tab → Monitor API calls
F12 → Console tab → Check errors
```

### Backend Logs

```bash
# Check server.js console output
# Look for: request logs, error messages
```

---

## ✅ FINAL STATUS

| Component            | URL                              | Status   | Action             |
| -------------------- | -------------------------------- | -------- | ------------------ |
| **Frontend**         | http://localhost:3000            | ✅ Ready | Open in Browser    |
| **Backend**          | http://localhost:3001            | ✅ Ready | Run node server.js |
| **Health Check**     | http://localhost:3001/api/health | ✅ Ready | Verify Connection  |
| **Authentication**   | POST /api/auth/login             | ✅ Ready | Test Login         |
| **Jobs API**         | GET /api/jobs                    | ✅ Ready | Fetch Jobs         |
| **Applications API** | GET /api/applications            | ✅ Ready | Fetch Applications |

---

## 🎊 YOU'RE ALL SET!

Both backend and frontend are ready to run:

### Start Backend:

```bash
cd d:\final-year-project\ai-hiring-system\backend
npm install && node server.js
```

### Start Frontend:

```bash
cd d:\final-year-project\ai-hiring-system\frontend
npm install && npm start
```

### Access:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

### Test:

- Open http://localhost:3000 in browser
- Login with test credentials
- Dashboard loads with real data from backend API

**Your AI-Powered Hiring System is LIVE!** 🌟

---

_Created: October 25, 2025_  
_Backend Port: 3001_  
_Frontend Port: 3000_  
_Status: ✅ READY FOR ACCESS_
