# 🔧 QUICK FIX - BACKEND ERROR

**Status:** Terminal 1 Error - Exit Code 1  
**Solution:** Step-by-step fix

---

## ⚠️ PROBLEM

Terminal 1 shows error when running:

```bash
cd d:\final-year-project\ai-hiring-system\backend && npm install && node server.js
```

**Exit Code: 1 = FAILED** ❌

---

## 🔧 QUICK FIX (Copy & Paste)

### Step 1: Kill All Node Processes

```bash
taskkill /F /IM node.exe
```

### Step 2: Clean Backend

```bash
cd d:\final-year-project\ai-hiring-system\backend
rmdir /S /Q node_modules
del package-lock.json
```

### Step 3: Fresh Install

```bash
npm cache clean --force
npm install
```

### Step 4: Start Backend

```bash
node server.js
```

---

## ✅ SHOULD SEE

```
✅ Backend server listening on port 3001
```

---

## 🚨 IF STILL FAILS

### Check 1: Verify Files Exist

```bash
dir d:\final-year-project\ai-hiring-system\backend\package.json
dir d:\final-year-project\ai-hiring-system\backend\server.js
```

### Check 2: Port 3001 In Use?

```bash
netstat -ano | findstr :3001
# If shows result, kill it with:
taskkill /PID xxxx /F
```

### Check 3: View Error Detail

```bash
cd d:\final-year-project\ai-hiring-system\backend
node server.js
# Read the error message carefully
```

---

## 📊 STATUS

**Backend:** ❌ ERROR (Exit Code 1)  
**Frontend:** ✅ OK (Exit Code 0)

**Action:** Fix backend using steps above

---

## 🎯 IF NOTHING WORKS

Create a minimal test:

```bash
cd d:\final-year-project\ai-hiring-system\backend
node -e "console.log('Node works')"
npm list
npm install --save express
node server.js
```

---

**Try the quick fix above first!** 🚀
