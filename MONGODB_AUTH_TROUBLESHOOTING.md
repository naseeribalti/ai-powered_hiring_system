# 🔧 MongoDB Atlas Authentication Troubleshooting

## ❌ Current Error
```
Error: bad auth : authentication failed
```

## ✅ Solutions to Try (In Order)

### Solution 1: Check IP Whitelist in MongoDB Atlas

**This is the most common issue!**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Login
3. Go to your cluster
4. Click "Network Access" (or "Security" → "Network Access")
5. Look for your IP address

**You should see:**
```
✅ Your IP: xxx.xxx.xxx.xxx (whitelisted)
```

**If NOT there:**
1. Click "Add IP Address"
2. Click "Add Current IP Address"
3. Or enter: `0.0.0.0/0` (for development only)
4. Click "Confirm"

---

### Solution 2: Verify Credentials in MongoDB Atlas

1. Go to: https://www.mongodb.com/cloud/atlas
2. Login
3. Click your cluster
4. Go to: "Database Access" or "Security" → "Database Users"
5. Find user: `nasirbspa118_db_user`
6. Check password is correct

**If password is wrong:**
1. Click the "..." menu
2. Click "Edit Password"
3. Change it to something you know
4. Save

---

### Solution 3: Check Connection String Format

Your connection string should look like:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

**Replace:**
- `USERNAME` with `nasirbspa118_db_user`
- `PASSWORD` with your actual password
- `CLUSTER` with your cluster address
- `DATABASE` with `ai-hiring`

**Example:**
```
mongodb+srv://nasirbspa118_db_user:Balti12345@cluster1.yhjwzek.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

---

### Solution 4: Handle Special Characters in Password

**If your password has special characters:**

Characters that need URL encoding:
```
@ = %40
# = %23
$ = %24
% = %25
& = %26
? = %3F
```

**Example:**
- Password: `Pass@word123`
- Encoded: `Pass%40word123`

**Update in .env:**
```
MONGODB_URI=mongodb+srv://nasirbspa118_db_user:Pass%40word123@cluster1.yhjwzek.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

---

### Solution 5: Verify Database Name

MongoDB Atlas creates a database on first write. But you can specify it:

**Option A: Let MongoDB create it**
```
mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
```

**Option B: Specify database name**
```
mongodb+srv://user:pass@cluster.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

---

## 🔍 Step-by-Step Verification

### Step 1: Get Fresh Connection String from MongoDB Atlas

1. Go to MongoDB Atlas
2. Click your cluster
3. Click "Connect"
4. Select "Connect your application"
5. Choose "Node.js"
6. **Copy the COMPLETE connection string** (including all parameters)

### Step 2: Replace Password

In the connection string:
- Find: `<password>`
- Replace with: your actual password (no angle brackets)

### Step 3: Update .env File

File: `D:\final-year-project\ai-hiring-system\.env`

```properties
PORT=3001
NODE_ENV=development
MONGODB_URI=<YOUR_COMPLETE_CONNECTION_STRING_HERE>
JWT_SECRET=your-secret-key-change-this-in-production
```

### Step 4: Test Connection

```powershell
cd D:\final-year-project\ai-hiring-system
node backend/server.js
```

**Expected output:**
```
✅ Backend server listening on port 3001
✅ MongoDB connected
```

---

## 🆘 If Still Not Working

### Check 1: Username
```
Your username should be: nasirbspa118_db_user
(NOT just "nasirbspa118" or something else)
```

### Check 2: Cluster Name
```
Your cluster address should be: cluster1.yhjwzek.mongodb.net
(Match what MongoDB Atlas shows)
```

### Check 3: Network Access
```
Go to: MongoDB Atlas → Security → Network Access

You should see:
✅ 0.0.0.0/0 (allows all) - for development
OR
✅ Your specific IP address
```

### Check 4: Database User Status
```
Go to: MongoDB Atlas → Security → Database Users

User should be:
✅ ACTIVE (not pending or disabled)
✅ Built-in role: atlasAdmin or dbOwner
```

---

## 🎯 Quick Checklist

- [ ] Logged into MongoDB Atlas
- [ ] Cluster is created and running
- [ ] Database user exists: `nasirbspa118_db_user`
- [ ] IP address is whitelisted (or 0.0.0.0/0)
- [ ] Connection string matches format
- [ ] Password is correct (no typos)
- [ ] Special characters are URL encoded
- [ ] .env file is updated
- [ ] Backend restarted
- [ ] No spaces in connection string

---

## 📞 Get Help

### From MongoDB Atlas
1. Go to your cluster
2. Click "Support" (bottom left)
3. Click "Troubleshoot Connection"
4. Follow the wizard

### From Us
Check these files for more info:
- `MONGODB_ATLAS_SETUP_GUIDE.md`
- `MONGODB_ATLAS_VISUAL_STEPS.md`
- `MONGODB_ATLAS_QUICK_CHECKLIST.md`

---

## 🔑 Most Common Fix

**99% of the time, the issue is:**
```
❌ IP address not whitelisted
```

**Solution:**
1. Go to MongoDB Atlas
2. Network Access
3. Add your IP address (or use 0.0.0.0/0 for dev)
4. Restart backend
5. ✅ Should work!

---

**Try these solutions in order. The first 2 will fix most issues!** ✨
