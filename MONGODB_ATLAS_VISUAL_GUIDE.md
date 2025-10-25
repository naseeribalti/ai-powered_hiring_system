# 🗂️ MongoDB Atlas Setup - Visual Overview

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR APPLICATION                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐          ┌──────────────┐                     │
│  │   Frontend   │  HTTP    │   Backend    │                     │
│  │  (React)     │◄────────►│  (Node.js)   │                     │
│  │ :3000        │          │  :3001       │                     │
│  └──────────────┘          └──────┬───────┘                     │
│                                    │                             │
│                            MongoDB Driver                        │
│                                    │                             │
│                                    ▼                             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                  MongoDB Connection String
                  (Over Internet/HTTPS)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Cloud)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │  AWS / Google Cloud / Azure                      │           │
│  │  ┌─────────────────────────────────────────┐    │           │
│  │  │ MongoDB Cluster (M0 Free)              │    │           │
│  │  │ ┌─────────────────────────────────┐    │    │           │
│  │  │ │ Databases:                      │    │    │           │
│  │  │ │ • ai-hiring (default)           │    │    │           │
│  │  │ │   • users collection            │    │    │           │
│  │  │ │   • jobs collection             │    │    │           │
│  │  │ │   • applications collection     │    │    │           │
│  │  │ │   • skills collection           │    │    │           │
│  │  │ └─────────────────────────────────┘    │    │           │
│  │  │                                         │    │           │
│  │  │ Authentication: ✅                      │    │           │
│  │  │ • Username: aiHiringAdmin              │    │           │
│  │  │ • Password: ••••••••••••••••••         │    │           │
│  │  │                                         │    │           │
│  │  │ Network Access: ✅                      │    │           │
│  │  │ • IP Whitelist: 0.0.0.0/0              │    │           │
│  │  └─────────────────────────────────────────┘    │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User Actions (Frontend)
        │
        ▼
Register/Login
        │
        ▼
Backend API (/api/auth/register, /api/auth/login)
        │
        ▼
Validation & Hashing (bcryptjs)
        │
        ▼
MongoDB Atlas Query
   (INSERT/SELECT)
        │
        ▼
Data Stored in Cloud
        │
        ▼
Response sent to Frontend
        │
        ▼
User logged in ✅
```

---

## File Structure Updates

```
ai-hiring-system/
│
├── .env                          ← UPDATE THIS
│   ├── PORT=3001
│   ├── NODE_ENV=development
│   ├── MONGODB_URI=mongodb+srv://aiHiringAdmin:PASSWORD@cluster0...
│   └── JWT_SECRET=...
│
├── backend/
│   ├── server.js                 ← Uses MONGODB_URI from .env
│   ├── app.js
│   ├── utils/
│   │   └── db.js                 ← Connects to MongoDB Atlas
│   ├── models/                   ← Define your data structure
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── ...
│   └── controllers/              ← Handle requests & queries
│       ├── authController.js
│       ├── jobController.js
│       └── ...
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js            ← Calls backend API
│   │   └── pages/
│   │       ├── LoginPage.js
│   │       └── RegisterPage.js
│   └── ...
│
└── package.json
```

---

## Connection String Breakdown

### Raw Connection String

```
mongodb+srv://aiHiringAdmin:MyPass123!@cluster0.m1a2b3c.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

### Parts Explained

```
mongodb+srv://
  │
  └─ Protocol: Uses DNS SRV records (for MongoDB Atlas)

username:password
  │
  └─ aiHiringAdmin:MyPass123!
     Your credentials

@cluster0.m1a2b3c.mongodb.net
  │
  └─ MongoDB Atlas host address
     (auto-generated for your cluster)

/ai-hiring
  │
  └─ Database name (will be created on first write)

?retryWrites=true&w=majority
  │
  └─ Options:
     - retryWrites: Automatically retry failed writes
     - w=majority: Write concern (data replicated)
```

---

## Step Summary

| Step | Action                       | Time  | Status          |
| ---- | ---------------------------- | ----- | --------------- |
| 1    | Create MongoDB Atlas account | 5 min | 📍 You are here |
| 2    | Create cluster (M0 Free)     | 5 min | ⏳ Next         |
| 3    | Create database user         | 2 min | ⏳ Next         |
| 4    | Add IP whitelist             | 1 min | ⏳ Next         |
| 5    | Get connection string        | 1 min | ⏳ Next         |
| 6    | Update .env file             | 1 min | ⏳ Next         |
| 7    | Restart backend              | 1 min | ⏳ Next         |
| 8    | Test connection              | 2 min | ⏳ Next         |

**Total Time: ~20 minutes**

---

## Security Best Practices

### Development ✅

```properties
MONGODB_URI=mongodb+srv://aiHiringAdmin:password@cluster0.xxxxx/ai-hiring
IP Whitelist: 0.0.0.0/0 (everyone)
```

### Production ⚠️

```properties
MONGODB_URI=mongodb+srv://prodAdmin:strongPassword@cluster0.xxxxx/ai-hiring
IP Whitelist: Only your server IPs
Enable Encryption at Rest
Enable Encryption in Transit (TLS)
```

---

## Verification Checklist

After completing setup:

```
✅ MongoDB Atlas account created
✅ Cluster deployed and running
✅ Database user created
✅ IP address whitelisted
✅ Connection string copied
✅ .env file updated
✅ Backend restarted without errors
✅ Console shows "MongoDB connected"
✅ Can register new user
✅ User data visible in MongoDB Atlas
✅ Login works on next visit (data persisted)
✅ All 15 API endpoints working
```

---

## Monitoring Your Database

### View Data in MongoDB Atlas

1. **Go to:** https://www.mongodb.com/cloud/atlas
2. **Login**
3. **Click Cluster Name**
4. **Go to "Collections" tab**
5. **View your data:**
   - ai-hiring > users (all registered users)
   - ai-hiring > jobs (all job postings)
   - ai-hiring > applications (all applications)

---

## Next Steps After Setup

### Immediate

- [ ] Test registration/login
- [ ] Verify data in MongoDB Atlas
- [ ] Check backend logs for "MongoDB connected"

### Short Term

- [ ] Create test data (jobs, applications)
- [ ] Test filtering and search
- [ ] Verify all API endpoints

### Production

- [ ] Set up GitHub Actions (CI/CD)
- [ ] Deploy to AWS/Heroku/DigitalOcean
- [ ] Configure custom domain
- [ ] Set up monitoring & alerts

---

**You're ready to set up MongoDB Atlas!** 🚀

Reference the detailed guide above for step-by-step instructions.
