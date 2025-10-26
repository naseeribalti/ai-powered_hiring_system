# ✅ MongoDB Atlas Quick Checklist

## 📋 Follow These Steps in Order

### STEP 1: Create Account (2 minutes)

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Click "Start Free"
- [ ] Sign up with email or GitHub
- [ ] Verify your email
- [ ] Login to your account

---

### STEP 2: Create Cluster (5 minutes)

- [ ] Click "Build your own"
- [ ] Select Cloud Provider: **AWS**
- [ ] Select Region: **ap-south-1** (or nearest to you)
- [ ] Select Tier: **M0 (Free)**
- [ ] Click "Create Deployment"
- [ ] ⏳ Wait for cluster to deploy (5 minutes)

---

### STEP 3: Create Database User (2 minutes)

- [ ] When prompted, click "Create a database user"
- [ ] **Username:** `aiHiringAdmin`
- [ ] **Password:** Create strong password
- [ ] 📝 **SAVE USERNAME AND PASSWORD SOMEWHERE SAFE**
- [ ] Click "Create User"
- [ ] Click "Add My IP Address" (or enter 0.0.0.0/0)
- [ ] Click "Finish and Close"

---

### STEP 4: Get Connection String (2 minutes)

- [ ] Click the green "Connect" button
- [ ] Select "Connect your application"
- [ ] Choose "Node.js" from dropdown
- [ ] Copy the connection string
- [ ] **Replace `password123` with your actual password**

**Your connection string should look like:**

```
mongodb+srv://aiHiringAdmin:YourPassword@cluster0.xxxxx.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

---

### STEP 5: Update .env File (1 minute)

**File location:** `D:\final-year-project\ai-hiring-system\.env`

**Find this line:**

```properties
MONGODB_URI=mongodb://localhost:27017/ai-hiring
```

**Replace with:**

```properties
MONGODB_URI=mongodb+srv://aiHiringAdmin:YourPassword@cluster0.xxxxx.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

**Save file:** Ctrl + S

---

### STEP 6: Restart Backend (1 minute)

**In PowerShell Terminal:**

```powershell
# Stop the current backend (Ctrl + C)

# Navigate to project
cd D:\final-year-project\ai-hiring-system

# Start backend again
node backend/server.js
```

**You should see:**

```
✅ Backend server listening on port 3001
MongoDB connected
```

✅ **IF YOU SEE "MongoDB connected" - SUCCESS!**

---

### STEP 7: Test It (2 minutes)

**Test 1: Health Check**

- Open browser: http://localhost:3001/api/health
- Should show: `{"status":"ok","uptime":...}`

**Test 2: Register User**

- Go to: http://localhost:3000
- Click Register
- Fill in details:
  - Name: Test User
  - Email: test@example.com
  - Password: TestPass123!
- Click Register
- ✅ Should see success message

**Test 3: Verify Persistence**

- Close browser completely
- Open browser again
- Go to: http://localhost:3000/login
- Login with same email and password
- ✅ Should work (data persisted!)

---

## 🎯 If Something Goes Wrong

### Problem: "Authentication failed"

**Solution:**

1. Check password is correct in connection string
2. Check username is `aiHiringAdmin`
3. Make sure you replaced `password` with actual password
4. Look for special characters (&, %, etc) - they need encoding

### Problem: "Connection timeout"

**Solution:**

1. Check internet connection
2. Verify IP is whitelisted in MongoDB Atlas
3. Wait 2-3 minutes for cluster to fully setup
4. Try restarting backend

### Problem: "Cannot connect to localhost:27017"

**Solution:**

- This is OLD connection string
- You forgot to update .env file
- Make sure you added the mongodb+srv:// URI

### Problem: Backend shows old error

**Solution:**

1. Delete the line `MONGODB_URI=mongodb://localhost:27017/ai-hiring`
2. Add your MongoDB Atlas URI
3. Restart backend

---

## 📊 Important Credentials to Save

Save these safely (like in a password manager):

```
MongoDB Atlas Account
├── Email: nasir.bspa118@iiu.edu.pk
├── Password: [Your account password]
├── Username: aiHiringAdmin
├── DB Password: [Your database password]
├── Connection String: mongodb+srv://aiHiringAdmin:PASSWORD@cluster0...
└── Cluster Name: [Your cluster name]
```

---

## 🚀 Once Connected, You Can:

✅ Register users (data persists)
✅ Login to users (data retrieval)
✅ Create job postings
✅ Apply for jobs
✅ View all applications
✅ Full CRUD operations

---

## 📈 Next (Optional)

After MongoDB is working:

1. Push changes to GitHub: `git push origin main`
2. Deploy to Heroku/AWS
3. Set up monitoring
4. Configure custom domain

---

## 🎉 Success Indicators

You'll know it's working when:

1. Backend logs show: **"MongoDB connected"**
2. Can register new users
3. Data appears in MongoDB Atlas console
4. Can login after closing browser
5. All pages load without database errors

---

**Everything ready? Let's go!** 🚀

Got stuck? Check the detailed guides:

- `MONGODB_ATLAS_SETUP_GUIDE.md` - Detailed steps
- `MONGODB_ATLAS_VISUAL_GUIDE.md` - Diagrams and architecture
