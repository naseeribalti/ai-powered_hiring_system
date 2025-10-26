# 🔍 TERMINAL ERROR CHECK - BOTH POWERSHELL

**Date:** October 25, 2025  
**Status:** ⚠️ ERRORS DETECTED

---

## 📊 CURRENT TERMINAL STATUS

### Terminal 1 (PowerShell) ❌

```
Command:  node backend/server.js
CWD:      D:\final-year-project\ai-hiring-system
Exit Code: 1 (ERROR)
Status:    FAILED
```

### Terminal 2 (PowerShell) ✅

```
Command:  npm install
CWD:      D:\final-year-project\ai-hiring-system\frontend
Exit Code: 0 (SUCCESS)
Status:    OK
```

---

## 🚨 ISSUES DETECTED

### Issue 1: Backend Server Not Starting

**Terminal 1 Error:** Exit Code 1

- Backend server.js exited with error
- Likely causes:
  1. Port 3001 already in use
  2. Missing MongoDB connection
  3. Missing environment variables
  4. Dependencies not installed
  5. .env file missing

### Issue 2: npm install Incomplete?

**Terminal 2 Status:** Exit Code 0 (npm install succeeded)

- But we need to see if `npm start` works

---

## 🔧 DIAGNOSTIC STEPS

### Step 1: Check Node Modules Installed

```powershell
cd D:\final-year-project\ai-hiring-system
ls node_modules | measure-object
# Should show many folders (>200 modules)
```

### Step 2: Check Port 3001

```powershell
netstat -ano | findstr :3001
# If shows a process, port is in use - kill it:
taskkill /F /IM node.exe
```

### Step 3: Create .env File

```powershell
cd D:\final-year-project\ai-hiring-system
"PORT=3001`nNODE_ENV=development" | Out-File .env -Encoding UTF8
```

### Step 4: Try Backend Again

```powershell
cd D:\final-year-project\ai-hiring-system
node backend/server.js
```

---

## 🎯 COMPLETE FIX SEQUENCE

### PowerShell Terminal 1: Backend

```powershell
# Step 1: Navigate to root
cd D:\final-year-project\ai-hiring-system

# Step 2: Kill any running node processes
taskkill /F /IM node.exe 2>$null

# Step 3: Create .env file
@"
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-hiring
JWT_SECRET=your-secret-key
"@ | Out-File .env -Encoding UTF8

# Step 4: Check package.json exists
Test-Path package.json

# Step 5: Install dependencies (if needed)
npm install

# Step 6: Start backend
node backend/server.js
```

**Expected Output:**

```
✅ Backend server listening on port 3001
```

---

### PowerShell Terminal 2: Frontend

```powershell
# Already in frontend directory
cd D:\final-year-project\ai-hiring-system\frontend

# npm install already done (Exit Code 0)
# Now start frontend
npm start
```

**Expected Output:**

```
✅ Compiled successfully!
You can now view ai-hiring-frontend in the browser.
```

---

## 💡 COMMON BACKEND ERRORS & FIXES

### Error 1: "Port 3001 already in use"

```powershell
netstat -ano | findstr :3001
# Kill the process:
taskkill /PID <PID> /F
# Then try again:
node backend/server.js
```

### Error 2: "Cannot find module"

```powershell
# Reinstall dependencies
npm install express mongoose bcryptjs jsonwebtoken dotenv
node backend/server.js
```

### Error 3: "ENOENT: no such file or directory, open '.env'"

```powershell
# Create .env file
@"
PORT=3001
NODE_ENV=development
"@ | Out-File .env -Encoding UTF8
```

### Error 4: "Connection to MongoDB failed"

```powershell
# Check MongoDB is running
# Or update MONGODB_URI in .env
@"
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-hiring
"@ | Out-File .env -Encoding UTF8
```

---

## ✅ QUICK POWERSHELL FIXES

### Clean Start All

```powershell
# Kill all node processes
taskkill /F /IM node.exe 2>$null

# Go to root
cd D:\final-year-project\ai-hiring-system

# Clean install
rm node_modules -Recurse -Force 2>$null
rm package-lock.json -Force 2>$null
npm cache clean --force

# Fresh install
npm install

# Create .env
@"
PORT=3001
NODE_ENV=development
"@ | Out-File .env -Encoding UTF8

# Start backend
node backend/server.js
```

---

## 📋 WHAT'S NEEDED

### For Backend (Terminal 1) to Work:

- [ ] package.json exists in root
- [ ] node_modules installed
- [ ] .env file created
- [ ] server.js in backend/ folder
- [ ] app.js in backend/ folder
- [ ] Port 3001 available
- [ ] MongoDB configured (or .env updated)

### For Frontend (Terminal 2) to Work:

- [ ] npm install completed (✅ Exit Code 0)
- [ ] Run: `npm start`
- [ ] Port 3000 available

---

## 🎯 STEP-BY-STEP POWERSHELL SOLUTION

### Step 1: Kill Any Running Processes

```powershell
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2
```

### Step 2: Backend Setup

```powershell
cd D:\final-year-project\ai-hiring-system

# Create .env
@"
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-hiring
JWT_SECRET=test-secret-key
"@ | Out-File .env -Encoding UTF8

# Check files exist
Test-Path package.json
Test-Path backend/server.js
Test-Path backend/app.js
```

### Step 3: Install Dependencies

```powershell
npm install
```

### Step 4: Start Backend

```powershell
node backend/server.js
```

### Step 5: In Another PowerShell: Frontend

```powershell
cd D:\final-year-project\ai-hiring-system\frontend
npm start
```

---

## 🔍 DEBUGGING: GET MORE INFO

### To see actual error message:

```powershell
cd D:\final-year-project\ai-hiring-system
node --trace-warnings backend/server.js
```

This will show:

- Exact error message
- File path
- Line number
- Full stack trace

---

## ✨ SUCCESS INDICATORS

### Backend Success:

```
✅ Backend server listening on port 3001
✅ Database connected (if MongoDB)
✅ Ready for requests
```

### Frontend Success:

```
✅ Compiled successfully!
✅ webpack compiled with X warnings
✅ Local: http://localhost:3000
```

---

## 🚀 NEXT ACTIONS

1. **Check actual error:** Run with trace-warnings to see exact error
2. **Create .env file** with correct variables
3. **Ensure dependencies installed:** `npm install`
4. **Start backend:** `node backend/server.js`
5. **Start frontend:** `npm start` (in frontend/)
6. **Access:** http://localhost:3000

---

**Status:** ⚠️ Backend Exit Code 1 - Needs investigation  
**Action:** Run diagnostic steps above to see actual error  
**Next:** Fix based on actual error message shown

---

_Diagnostic Report: October 25, 2025_  
_Both Terminals: PowerShell_  
_Status: Need to see actual error to fix_
