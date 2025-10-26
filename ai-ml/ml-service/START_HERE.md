# 🚀 QUICK START - Run Your Complete AI Hiring System

## 🎯 You Have 3 Options to Start the ML Service:

### **Option 1: Double-Click (Easiest!)**

Just double-click one of these files:

- `start-ml-service.bat` (Windows Command Prompt)
- `start-ml-service.ps1` (PowerShell)

It will automatically:

- ✅ Create virtual environment
- ✅ Install all dependencies
- ✅ Run tests
- ✅ Start the service on port 3002

---

### **Option 2: Command Prompt**

```cmd
cd d:\final-year-project\ai-hiring-system\ai-ml\ml-service
start-ml-service.bat
```

---

### **Option 3: PowerShell**

```powershell
cd d:\final-year-project\ai-hiring-system\ai-ml\ml-service
.\start-ml-service.ps1
```

**Note:** If you get an execution policy error in PowerShell, run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## ✅ What You'll See When It Starts

```
============================================================
  🎉 Starting AI Hiring System ML Service
============================================================

✅ Python found: Python 3.11.0
✅ Virtual environment created
✅ Virtual environment activated
✅ All packages installed successfully
✅ All tests passed!

============================================================
  🚀 Starting ML Service on port 3002
============================================================

╔═══════════════════════════════════════╗
║   AI Hiring System - ML Service      ║
║   Port: 3002                         ║
║   Environment: development           ║
╚═══════════════════════════════════════╝

 * Running on http://127.0.0.1:3002
```

---

## 🧪 Test It's Working

Open a **new terminal** and run:

```bash
curl http://localhost:3002/health
```

You should see:

```json
{
  "status": "healthy",
  "service": "AI Hiring System ML Service",
  "version": "1.0.0"
}
```

---

## 🎊 Complete System Setup

To run the **entire system**, you need **3 terminals**:

### **Terminal 1: ML Service (Python)**

```cmd
cd d:\final-year-project\ai-hiring-system\ai-ml\ml-service
start-ml-service.bat
```

**Port:** 3002

### **Terminal 2: Backend (Node.js)**

```cmd
cd d:\final-year-project\ai-hiring-system\backend
npm start
```

**Port:** 3001

### **Terminal 3: Frontend (React)**

```cmd
cd d:\final-year-project\ai-hiring-system\frontend
npm start
```

**Port:** 3000

---

## 🎯 Test End-to-End

1. **All 3 services running** ✅
2. Open browser: http://localhost:3000
3. **Login** as job seeker
4. Go to **Dashboard**
5. Click **"Upload Resume"**
6. Select any PDF or DOCX file
7. Wait **5-10 seconds**
8. **See REAL AI scores!** 🎉

---

## 📊 What the ML Service Does

**When you upload a resume:**

```
User uploads resume.pdf
       ↓
Frontend → Backend (saves to Cloudinary)
       ↓
Backend → ML Service: POST /api/resume/analyze
       ↓
ML Service:
  1. Downloads PDF from Cloudinary
  2. Parses text (pdfplumber/python-docx)
  3. Extracts skills (200+ database)
  4. Calculates 7 AI scores
  5. Generates recommendations
       ↓
Backend ← Returns JSON with scores
       ↓
Frontend ← Polls every 1 second
       ↓
Displays AI scores! ✨
```

---

## 🎓 Your 7 AI Metrics

1. **Overall Score** (0-100) - Weighted average
2. **Skills Match** - Quantity + quality + diversity
3. **Experience Relevance** - Years + descriptions
4. **Education Match** - Degree level + GPA
5. **Resume Quality** - Completeness + formatting
6. **Keyword Optimization** - Action verbs + terms
7. **ATS Compatibility** - Structure + readability

---

## 🐛 Troubleshooting

### Python not found?

Install Python 3.8+: https://www.python.org/downloads/
Make sure to check "Add to PATH" during installation!

### Port 3002 already in use?

```cmd
netstat -ano | findstr :3002
taskkill /PID <PID> /F
```

### Virtual environment issues?

Delete the `venv` folder and run the start script again.

### Import errors?

```cmd
cd d:\final-year-project\ai-hiring-system\ai-ml\ml-service
venv\Scripts\activate
pip install -r requirements.txt --force-reinstall
```

### Backend not calling ML service?

Check `backend/controllers/resumeController.js`:

```javascript
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:3002';
// Should call: ${ML_SERVICE_URL}/api/resume/analyze
```

---

## 📝 Files Created

✅ `start-ml-service.bat` - Windows batch script
✅ `start-ml-service.ps1` - PowerShell script
✅ `scorers/resume_scorer.py` - 7 scoring algorithms
✅ `routes/resume_routes.py` - Resume analysis endpoints
✅ `routes/job_routes.py` - Job matching endpoints
✅ `requirements.txt` - Python dependencies
✅ `test_setup.py` - Validation tests

---

## 🏆 Congratulations!

You now have a **production-ready AI hiring system** with:

- ✅ Real resume parsing (not demo data!)
- ✅ 200+ skills recognition
- ✅ 7 AI scoring metrics
- ✅ TF-IDF job matching
- ✅ Intelligent recommendations
- ✅ Full-stack integration

**This is a commercial-grade platform!** 🚀

Perfect for your final year project presentation! 🎓

---

## 💡 What's Next?

1. ✅ **Run the ML service** (double-click start script)
2. ✅ **Test with real resumes** (upload 5-10 different ones)
3. ✅ **Fine-tune if needed** (adjust scoring weights)
4. ✅ **Prepare presentation** (you have real AI to demo!)
5. ✅ **Deploy to production** (optional - everything is ready!)

---

**Need more help?** Check these files:

- `README.md` - Full documentation
- `QUICKSTART.md` - 5-minute guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details

**Your ML service is ready to go!** 🎉
