# 🚀 AI Hiring System - QUICK START GUIDE

## ✅ Current Status

- **Backend:** ✅ Running on `http://localhost:3001`
- **Frontend:** ✅ Running on `http://localhost:3000`
- **Database:** ⚠️ Running in Development Mode (without persistent storage)

---

## 🎯 To Get Full System Working

### **Step 1: Start MongoDB (Choose ONE option)**

#### Option A: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account (just email)
3. Create a cluster (takes ~5 min)
4. Click "Connect" → Copy connection string
5. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ai-hiring?retryWrites=true&w=majority
   ```

#### Option B: Install MongoDB Locally (Windows)

1. Download from https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Choose "Install MongoDB as a Windows Service"
4. Done! MongoDB runs automatically in background
5. Use `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/ai-hiring
   ```

#### Option C: Quick Test (No Database Needed)

- Backend is already running in development mode
- Endpoints will respond but data won't persist
- Perfect for UI testing

---

## 🏃 Quick Start Commands

### **Terminal 1: Backend**

```powershell
cd D:\final-year-project\ai-hiring-system
node backend/server.js
```

Expected output:

```
✅ Backend server listening on port 3001
⚠️  Running in development mode without database
```

### **Terminal 2: Frontend**

```powershell
cd D:\final-year-project\ai-hiring-system\frontend
npm start
```

Expected output:

```
Compiled successfully!
You can now view ai-hiring in the browser.
Local:            http://localhost:3000
```

### **Terminal 3: Access Application**

Open browser to: `http://localhost:3000`

---

## 🧪 Test the System

1. **Login Page:** http://localhost:3000/login
2. **Register:** Try creating an account (won't persist without DB)
3. **Dashboard:** See dashboard after login
4. **Jobs:** Browse jobs page
5. **Profile:** View profile management

---

## 🔧 Available Endpoints (API)

### Health Check

```
GET http://localhost:3001/api/health
```

Response:

```json
{
  "status": "ok",
  "uptime": 123.45
}
```

### Authentication

```
POST http://localhost:3001/api/auth/register
POST http://localhost:3001/api/auth/login
GET  http://localhost:3001/api/auth/me
```

### Jobs

```
GET  http://localhost:3001/api/jobs
POST http://localhost:3001/api/jobs
```

### Applications

```
GET  http://localhost:3001/api/applications
POST http://localhost:3001/api/applications
```

---

## 📝 Environment Configuration

File: `.env`

```properties
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-hiring
JWT_SECRET=your-secret-key-change-this-in-production
```

---

## ✨ Next Steps to Deploy

1. ✅ Set up MongoDB Atlas (recommended)
2. ✅ Update `.env` with real connection string
3. ✅ Restart backend: `node backend/server.js`
4. ✅ Create test user and verify persistence
5. ✅ Deploy to production (AWS, Heroku, etc.)

---

## 🛠️ Troubleshooting

### Backend won't start

- Ensure `.env` file exists
- Check PORT is not in use: `netstat -ano | findstr :3001`

### Frontend won't load

- Clear browser cache (Ctrl+Shift+Delete)
- Check frontend running on port 3000: `npm start`

### MongoDB connection error

- Option A: Use MongoDB Atlas (no local install needed)
- Option B: Install MongoDB Community Edition
- Option C: Continue without DB for development testing

### API calls failing

- Verify backend running on port 3001
- Check browser console for CORS errors
- Ensure `.env` has correct MONGODB_URI

---

## 📚 Project Structure

```
ai-hiring-system/
├── backend/              # Node.js Express API
│   ├── server.js         # Entry point
│   ├── app.js            # Express app
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # Auth, validation, etc.
│   └── utils/            # Helpers, DB connection
├── frontend/             # React app
│   ├── public/           # Static files
│   ├── src/              # React components
│   ├── package.json      # Dependencies
│   └── public/index.html # HTML entry point
├── .env                  # Environment variables
├── package.json          # Backend dependencies
└── README.md
```

---

## 🎓 Learning Resources

- **Express.js:** https://expressjs.com
- **React:** https://react.dev
- **MongoDB:** https://docs.mongodb.com
- **JWT Auth:** https://jwt.io
- **React Router:** https://reactrouter.com

---

## 💡 Pro Tips

1. Use `npm run dev` for backend hot-reload with nodemon
2. Backend automatically handles missing MongoDB gracefully
3. Frontend uses React Query for efficient data fetching
4. JWT tokens stored in localStorage for authentication
5. All endpoints are documented in API routes

---

**System ready! Start the backend and frontend, then visit http://localhost:3000** 🎉
