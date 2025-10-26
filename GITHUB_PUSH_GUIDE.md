# 🚀 GitHub Push Guide - AI Hiring System

## ❌ Current Issue

GitHub authentication failed because we need a personal access token (not password).

---

## ✅ Solution: Use GitHub Personal Access Token

### **Step 1: Generate Personal Access Token on GitHub**

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `ai-hiring-system-push`
4. Select scopes:
   - ✅ `repo` (full control of private repositories)
   - ✅ `workflow` (if needed)
5. Click "Generate token"
6. **⚠️ COPY THE TOKEN IMMEDIATELY** (you won't see it again)

---

### **Step 2: Configure Git to Use Token**

Run this command with your token:

```powershell
git config --global user.password "YOUR_PERSONAL_ACCESS_TOKEN_HERE"
```

Or better, use credential manager:

```powershell
# For Windows, use this helper
git config --global credential.helper wincred
```

---

### **Step 3: Update Remote with Token (Alternative)**

```powershell
cd D:\final-year-project\ai-hiring-system

# Replace USERNAME and TOKEN
git remote set-url origin https://USERNAME:TOKEN@github.com/naseeribalti/ai-powered_hiring_system.git

# Then push
git push -u origin main
```

---

### **Step 4: Push to GitHub**

```powershell
cd D:\final-year-project\ai-hiring-system
git push -u origin main
```

---

## 🔑 Quick Steps (Fastest)

1. Go to: https://github.com/settings/tokens/new
2. Create token with `repo` scope
3. Copy token
4. Run:
   ```powershell
   cd D:\final-year-project\ai-hiring-system
   git config credential.helper wincred
   git push -u origin main
   ```
5. When prompted:
   - **Username:** `naseeribalti`
   - **Password:** Paste your token

---

## 📋 What Gets Pushed

✅ **Included:**

- All source code (backend, frontend, AI-ML)
- Configuration files
- Documentation
- .gitignore (excludes node_modules)

❌ **Excluded:**

- node_modules/ (too large)
- .env (secrets)
- Logs and build outputs

---

## ✨ After Successful Push

Your GitHub repo will have:

```
https://github.com/naseeribalti/ai-powered_hiring_system
```

With folders:

- backend/ - Node.js API
- frontend/ - React UI
- ai-ml/ - Python models
- config/ - Configuration
- deployment/ - Docker, K8s

---

## 🎯 Next Commands

After pushing, anyone can clone:

```powershell
git clone https://github.com/naseeribalti/ai-powered_hiring_system.git
cd ai-powered_hiring_system
npm install
npm start
```

---

**Follow the steps above and your code will be on GitHub!** 🎉
