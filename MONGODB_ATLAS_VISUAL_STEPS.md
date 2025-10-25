# 🗂️ MongoDB Atlas Visual Setup - Step by Step

## 🎯 Complete Visual Guide

---

## STEP 1️⃣: Create Account

### Visit Website

```
Go to: https://www.mongodb.com/cloud/atlas
```

### What You'll See

```
┌──────────────────────────────┐
│  MongoDB Atlas              │
│                              │
│  ☐ Start Free (green button)│
│                              │
│  Sign up options:            │
│  • Email + Password          │
│  • GitHub account            │
│  • Google account            │
└──────────────────────────────┘
```

### Action

- Click **"Start Free"** (green button)
- Choose: Sign up with **GitHub** (easier)
- Click "Sign Up with GitHub"
- Authorize MongoDB
- **Done! ✅**

---

## STEP 2️⃣: Create Cluster

### After Login, You'll See

```
┌────────────────────────────────┐
│ Create a new Cluster           │
│                                 │
│ "Build your own"  ← Select this │
│                                 │
└────────────────────────────────┘
```

### Configuration Screen

```
┌─────────────────────────────────────┐
│ Select Your Deployment Type         │
├─────────────────────────────────────┤
│                                      │
│ Cloud Provider: [AWS ▼]             │
│ ✓ AWS (recommended)                 │
│                                      │
│ Region: [ap-south-1 ▼] or closest   │
│ ✓ ap-south-1 (India)                │
│ ✓ or your nearest region             │
│                                      │
│ Cluster Tier: [M0 Free ▼]           │
│ ✓ M0 (FREE) - 512 MB storage        │
│                                      │
│        [Create Deployment]           │
│                                      │
└─────────────────────────────────────┘
```

### Wait for Cluster

```
🔄 Creating cluster...

After ~5 minutes:
✅ Cluster created!
```

---

## STEP 3️⃣: Create Database User

### Popup After Cluster Creation

```
┌──────────────────────────────────┐
│ Set up your connection            │
├──────────────────────────────────┤
│                                   │
│ Create a database user:           │
│                                   │
│ Username: [aiHiringAdmin      ]   │
│                                   │
│ Password: [••••••••••••••••••] ← Auto-generate │
│          [Regenerate]           │
│                                   │
│ ☑ Auto-generated password        │
│                                   │
│     [Create User]                │
│                                   │
└──────────────────────────────────┘
```

### Important

```
📝 SAVE YOUR CREDENTIALS!

Username: aiHiringAdmin
Password: ______________________

Copy to notepad or password manager
```

### Next Step

```
Network Access

☑ Add My IP Address (automatic)
  OR
☐ 0.0.0.0/0 (development - allows all)

     [Finish and Close]
```

---

## STEP 4️⃣: Get Connection String

### Click Connect Button

```
┌──────────────────┐
│  [Connect]       │ ← Green button
└──────────────────┘
```

### Choose Connection Method

```
┌────────────────────────────┐
│ Choose connection method    │
├────────────────────────────┤
│                             │
│ ☑ Connect your application │ ← Select
│ ☐ Connect with shell       │
│                             │
└────────────────────────────┘
```

### Select Driver

```
┌──────────────────────────────┐
│ Select your driver version   │
│                               │
│ Driver: [Node.js ▼]          │
│ Version: [4.x or later ▼]    │
│                               │
└──────────────────────────────┘
```

### Copy Connection String

```
┌────────────────────────────────────────┐
│ Connection String                      │
├────────────────────────────────────────┤
│                                         │
│ mongodb+srv://aiHiringAdmin:password123│
│ @cluster0.xxxxx.mongodb.net/myFirstDat│
│ abase?retryWrites=true&w=majority      │
│                                         │
│          [Copy] ← Click this            │
│                                         │
└────────────────────────────────────────┘
```

### 📝 Example Connection String

```
mongodb+srv://aiHiringAdmin:MyPass123!@cluster0.m1a2b3c.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

---

## STEP 5️⃣: Update .env File

### Open Your Project

```
File: D:\final-year-project\ai-hiring-system\.env

Current content:
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-hiring  ← CHANGE THIS
JWT_SECRET=your-secret-key
```

### Find and Replace

```
FIND:
mongodb://localhost:27017/ai-hiring

REPLACE WITH:
mongodb+srv://aiHiringAdmin:MyPass123!@cluster0.m1a2b3c.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

### Updated .env

```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://aiHiringAdmin:MyPass123!@cluster0.m1a2b3c.mongodb.net/ai-hiring?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
```

### Save

```
Ctrl + S
✅ Saved!
```

---

## STEP 6️⃣: Restart Backend

### Stop Current Backend

```
PowerShell Terminal:

Current: node backend/server.js [RUNNING]

Press: Ctrl + C

Result: ✅ Stopped
```

### Start Backend Again

```
PowerShell Terminal:

cd D:\final-year-project\ai-hiring-system
node backend/server.js

Expected output:
✅ Backend server listening on port 3001
✅ MongoDB connected
```

### ✅ SUCCESS!

If you see both messages, MongoDB Atlas is connected!

---

## STEP 7️⃣: Test Connection

### Test 1: Health Check API

```
Browser URL: http://localhost:3001/api/health

Response:
{
  "status": "ok",
  "uptime": 123.45
}

✅ Connection working!
```

### Test 2: Register New User

```
Browser: http://localhost:3000
Action: Click "Register"

Fill in:
- Name: Test User
- Email: test@example.com
- Password: TestPass123!

Click: Register

✅ User created in MongoDB Atlas!
```

### Test 3: Check Data Persistence

```
Step 1: Close browser completely

Step 2: Reopen browser: http://localhost:3000

Step 3: Go to Login

Step 4: Enter credentials:
  - Email: test@example.com
  - Password: TestPass123!

Step 5: Click Login

✅ If you can login → Data persisted!
```

---

## 📊 Verification

### In MongoDB Atlas Dashboard

1. **Go to:** https://www.mongodb.com/cloud/atlas

2. **Login** → Click your cluster name

3. **Go to:** "Collections" tab

4. **You should see:**

```
ai-hiring (database)
├── users (collection)
│   └── 1 user created (your test user)
│
├── jobs (collection)
│   └── (empty until you create jobs)
│
└── applications (collection)
    └── (empty)
```

5. **Click on "users"** → See your test user data!

```
Example user document:
{
  "_id": ObjectId("..."),
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "$2a$10$...(hashed)",
  "role": "jobSeeker",
  "createdAt": ISODate("2025-10-25T..."),
  "updatedAt": ISODate("2025-10-25T...")
}
```

---

## 🎯 Success Checklist

```
✅ MongoDB Atlas account created
✅ Cluster deployed (M0 free tier)
✅ Database user created (aiHiringAdmin)
✅ IP whitelist configured
✅ Connection string copied
✅ .env file updated with new URI
✅ Backend restarted
✅ Console shows "MongoDB connected"
✅ Health check API responding
✅ Can register new user
✅ User data in MongoDB Atlas
✅ Can login after browser restart (persistence works!)
✅ All systems go! 🚀
```

---

## 🛠️ Troubleshooting by Symptom

### Issue: "Cannot connect to MongoDB"

```
Error: MongooseServerSelectionError

Solution:
1. Check .env has mongodb+srv:// (not mongodb://)
2. Check password is correct and URL-encoded
3. Wait 5 minutes for cluster to fully provision
4. Check internet connection
5. Verify IP is whitelisted
```

### Issue: "Connection timeout"

```
Error: ECONNREFUSED

Solution:
1. Check backend shows "MongoDB connected"
2. Verify connection string in .env
3. Check username/password are correct
4. Restart backend: Ctrl+C then node backend/server.js
```

### Issue: "Authentication failed"

```
Error: MongoError: authentication failed

Solution:
1. Verify username: aiHiringAdmin (exactly)
2. Verify password (case sensitive!)
3. If password has special chars, check URL encoding
4. Try regenerating password in MongoDB Atlas
```

### Issue: Cluster not provisioning

```
Status: Still creating after 10 minutes

Solution:
1. Refresh MongoDB Atlas page
2. Check AWS status page
3. Try different region
4. Contact MongoDB support
```

---

## 📈 What Happens After Connection

### Automatic Collection Creation

```
When you use your app, MongoDB automatically creates:

1. users - Stores user accounts
2. jobs - Stores job postings
3. applications - Stores job applications
4. skills - Stores skill data
5. ... (any other models you define)
```

### Data Flow

```
Frontend (Register)
    ↓
Backend (Express)
    ↓
Mongoose Model
    ↓
MongoDB Driver
    ↓
MongoDB Atlas (Cloud)
    ↓
Data stored! ✅
```

---

## 🔐 Security Reminders

### Development

```
✅ .env file is LOCAL ONLY
✅ Connection string is in .env (not in code)
✅ Password is protected
✅ GitHub .gitignore excludes .env
```

### Before Production

```
⚠️ Change JWT_SECRET
⚠️ Create strong database password
⚠️ Enable IP whitelist (not 0.0.0.0/0)
⚠️ Enable encryption at rest
⚠️ Enable authentication at OS level
```

---

## 📞 Next Steps

### Immediate

1. ✅ Follow this guide (15 minutes)
2. ✅ Test registration/login (5 minutes)
3. ✅ Verify data in MongoDB (2 minutes)

### Short Term

1. Create test jobs
2. Test applications flow
3. Verify all endpoints work

### Medium Term

1. Deploy to production
2. Set up monitoring
3. Enable backups

---

## 🎉 Congratulations!

Your AI Hiring System now has:

- ✅ Persistent database
- ✅ User authentication
- ✅ Data integrity
- ✅ Automatic backups
- ✅ Scalable architecture

**You're production-ready!** 🚀

---

**Questions?** Check the detailed setup guide: `MONGODB_ATLAS_SETUP_GUIDE.md`

**Visual reference?** You're reading it! 📖
