# 📚 MongoDB Atlas Integration Guide - AI Hiring System

## 🎯 Complete Step-by-Step Guide

This guide will help you connect your AI Hiring System to MongoDB Atlas (cloud database).

---

## ✨ What is MongoDB Atlas?

- **Cloud-hosted MongoDB** - No installation needed
- **Free tier available** - Perfect for development
- **Automatic backups** - Data is secure
- **Scalable** - Grows with your app

---

## 📋 Prerequisites

- GitHub account (✅ You have this)
- Email address
- Internet connection
- 10 minutes of time

---

# 🚀 STEP-BY-STEP INSTRUCTIONS

## **STEP 1: Create MongoDB Atlas Account**

### 1.1 Go to MongoDB Atlas

Visit: https://www.mongodb.com/cloud/atlas

### 1.2 Click "Start Free"

- Look for the green "Start Free" button
- Click it

### 1.3 Create Account

Choose one of these options:

- **Option A:** Sign up with email

  1. Enter your email: `nasir.bspa118@iiu.edu.pk`
  2. Create password
  3. Click "Sign Up"

- **Option B:** Sign up with GitHub
  1. Click "Sign Up with GitHub"
  2. Authorize MongoDB
  3. Done!

### 1.4 Verify Email

1. Check your email inbox
2. Click the verification link
3. Accept terms & conditions

**✅ Status: Account Created**

---

## **STEP 2: Create Your First Cluster**

### 2.1 Choose Deployment Type

After login, you'll see options:

- Select **"Build your own"** (recommended)

### 2.2 Select Cloud Provider

- **Provider:** AWS (recommended)
- **Region:** Choose closest to you
  - Asia Pacific: `ap-south-1` (India)
  - Or your nearest region
- **Tier:** M0 (Free) ✅

### 2.3 Create Cluster

1. Scroll down
2. Click **"Create Deployment"** (green button)
3. Wait for cluster to be created (~5 minutes)

**✅ Status: Cluster Created**

---

## **STEP 3: Create Database User**

### 3.1 Set Up Authentication

After cluster is created, you'll see a prompt:

1. **Create a database user**

   - Username: `aiHiringAdmin`
   - Password: Create a strong password (save it!)
   - Or click "Auto-generate secure password"
   - Click "Create User"

2. **Save Credentials**
   - ✅ Username: `aiHiringAdmin`
   - ✅ Password: `YourPasswordHere` (save this!)

**⚠️ IMPORTANT:** Save the username and password!

### 3.2 Add IP Address

1. Click "Add My IP Address"
2. Your current IP will be added automatically
3. Or manually enter: `0.0.0.0/0` (allows all IPs - for development)

**✅ Status: User & IP Added**

---

## **STEP 4: Get Connection String**

### 4.1 Connect to Cluster

1. Click the green **"Connect"** button
2. Choose **"Connect your application"** (not "Connect with MongoDB Shell")

### 4.2 Copy Connection String

1. Select **Node.js** in the dropdown
2. Copy the connection string (looks like):
   ```
   mongodb+srv://aiHiringAdmin:password123@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```

### 4.3 Replace Password

In the connection string, replace:

- `password123` → Your actual password

**Example:**

```
mongodb+srv://aiHiringAdmin:MySecurePass123!@cluster0.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

**✅ Status: Connection String Ready**

---

## **STEP 5: Update Your .env File**

### 5.1 Open .env File

Navigate to:

```
D:\final-year-project\ai-hiring-system\.env
```

### 5.2 Update MONGODB_URI

Replace:

```properties
MONGODB_URI=mongodb://localhost:27017/ai-hiring
```

With your MongoDB Atlas connection string:

```properties
MONGODB_URI=mongodb+srv://aiHiringAdmin:MySecurePass123!@cluster0.mongodb.net/ai-hiring?retryWrites=true&w=majority
```

### 5.3 Complete .env File

```properties
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://aiHiringAdmin:MySecurePass123!@cluster0.mongodb.net/ai-hiring?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
```

### 5.4 Save File

- **Ctrl + S** to save

**✅ Status: .env Updated**

---

## **STEP 6: Restart Backend**

### 6.1 Stop Current Backend

1. Go to terminal where backend is running
2. Press **Ctrl + C** to stop

### 6.2 Start Backend Again

```powershell
cd D:\final-year-project\ai-hiring-system
node backend/server.js
```

### 6.3 Check Connection

You should see:

```
✅ Backend server listening on port 3001
MongoDB connected
```

**✅ Status: Connected to MongoDB Atlas!**

---

## **STEP 7: Verify Connection (Optional)**

### 7.1 Check in MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Login
3. Click on your cluster name
4. Go to "Collections" tab
5. You should see databases being created

### 7.2 Test with API

Open browser and visit:

```
http://localhost:3001/api/health
```

You should see:

```json
{
  "status": "ok",
  "uptime": 123.45
}
```

**✅ Status: Everything Working!**

---

## **STEP 8: Test Full System**

### 8.1 Register a New User

1. Open: http://localhost:3000
2. Go to Register
3. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPass123!
4. Click Register

### 8.2 Verify Data Persists

1. Close browser
2. Open again: http://localhost:3000
3. Try to Login with same credentials
4. ✅ Should work (data persisted in MongoDB Atlas!)

**✅ Status: Data Persistence Working!**

---

## 📊 Quick Reference

### Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_NAME.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

### Parts Explained

| Part            | Example       | What it is              |
| --------------- | ------------- | ----------------------- |
| `USERNAME`      | aiHiringAdmin | Your MongoDB user       |
| `PASSWORD`      | MyPass123!    | Your password           |
| `CLUSTER_NAME`  | cluster0.xxxx | Your cluster identifier |
| `DATABASE_NAME` | ai-hiring     | Your database name      |

---

## 🔒 Security Notes

### What NOT to Do ❌

- Don't share your connection string in public
- Don't commit `.env` to GitHub
- Don't use `0.0.0.0/0` in production (only for dev)

### What TO Do ✅

- Keep password strong
- Use environment variables
- Restrict IP addresses in production
- Enable IP Whitelist

---

## ⚡ Troubleshooting

### Problem: Connection Timeout

**Solution:**

1. Check if IP is whitelisted in MongoDB Atlas
2. Verify password is correct in connection string
3. Check internet connection

### Problem: Authentication Failed

**Solution:**

1. Double-check username and password
2. Make sure you replaced `password123` with actual password
3. Check for special characters (%, &, etc. need URL encoding)

### Problem: Database Not Connecting

**Solution:**

1. Stop backend (Ctrl+C)
2. Verify `.env` file has correct `MONGODB_URI`
3. Restart: `node backend/server.js`

### Problem: "cluster0.mongodb.net" not found

**Solution:**

1. Verify connection string is complete
2. Check internet connection
3. Wait 2-3 minutes for cluster to fully provision

---

## 🎯 Next Steps

### ✅ Done:

1. Created MongoDB Atlas account
2. Created cluster
3. Added database user
4. Updated `.env` file
5. Connected backend

### 🚀 Next:

1. Deploy to production (AWS, Heroku, etc.)
2. Set up GitHub Actions (CI/CD)
3. Configure custom domain
4. Enable SSL/TLS

---

## 📞 Support Resources

- **MongoDB Docs:** https://docs.mongodb.com/manual/
- **MongoDB Atlas Tutorial:** https://docs.atlas.mongodb.com/getting-started/
- **Connection Issues:** https://docs.mongodb.com/manual/reference/connection-string/

---

## ✨ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster deployed (M0 Free tier)
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Connection string copied
- [ ] .env file updated with connection string
- [ ] Backend restarted
- [ ] Backend shows "MongoDB connected"
- [ ] Can register new user
- [ ] Data persists after refresh
- [ ] API health check working

**Once all checkboxes are ✅, your system is production-ready!**

---

**Your AI Hiring System is now connected to MongoDB Atlas!** 🎉

Questions? Check the troubleshooting section above or refer to MongoDB official docs.
