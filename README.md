# 🚀 AI-Powered Hiring System

An intelligent hiring platform that leverages AI/ML for resume parsing, candidate matching, and automated ranking.

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### **For Job Seekers**

- 🎯 AI-powered job recommendations
- 📄 Smart resume parsing and analysis
- 💾 Save and track favorite jobs
- 📊 Application tracking dashboard
- 🔔 Real-time notifications
- 💳 Flexible subscription plans
- 🎫 Support ticket system

### **For Recruiters**

- 🤖 AI candidate ranking
- 📝 Job posting management
- 📧 Application management
- 📈 Analytics dashboard
- 🔍 Advanced candidate search
- 💼 Subscription-based features
- 🎯 Priority support access

### **For Admins**

- 👥 User management dashboard
- 📊 Business intelligence analytics
- 🎫 Support ticket management
- 💰 Subscription & billing oversight
- 📈 Platform health monitoring
- 🔐 Role-based access control
- 📈 Advanced analytics
- 🎨 Custom job postings
- 📧 Automated notifications
- 👥 Candidate management

### **AI/ML Features**

- Resume parsing (PDF/DOCX)
- Skills extraction
- Job-candidate matching
- Resume quality scoring
- Intelligent candidate ranking

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js (v14+)
- Python (3.8+)
- MongoDB (local or Atlas)

### **1. Clone Repository**

```bash
git clone https://github.com/naseeribalti/ai-powered_hiring_system.git
cd ai-hiring-system
```

### **2. Install Dependencies**

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..

# Backend dependencies
cd backend
npm install
cd ..

# ML Service dependencies
cd ai-ml/ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### **3. Configure Environment**

```bash
# Copy example env files
copy .env.example .env
copy backend\.env.example backend\.env
copy ai-ml\ml-service\.env.example ai-ml\ml-service\.env

# Edit .env files with your configuration
```

### **4. Start Services**

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

**Terminal 3 - ML Service:**

```bash
cd ai-ml\ml-service
venv\Scripts\activate
python app.py
```

### **5. Access Application**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **ML Service:** http://localhost:3002

---

## 📁 Project Structure

```
ai-hiring-system/
├── backend/               # Node.js/Express backend
│   ├── controllers/       # Request handlers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Auth, validation, etc.
│   └── API_DOCUMENTATION.md
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # State management
│   │   └── services/     # API services
│   └── README.md
├── ai-ml/               # ML/AI services
│   ├── ml-service/      # Flask ML API
│   ├── models/          # ML models
│   ├── training/        # Training scripts
│   └── README.md
├── config/              # Configuration files
├── database/            # DB schemas & migrations
├── docs/                # Documentation
│   ├── api/             # API documentation
│   ├── technical/       # Technical guides
│   ├── user-guides/     # User manuals
│   └── session-reports/ # Development logs
└── scripts/             # Utility scripts
```

---

## 🛠️ Technology Stack

### **Frontend**

- React 18
- Material-UI / Tailwind CSS
- Axios
- React Router
- Context API

### **Backend**

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt

### **ML/AI**

- Python 3.8+
- Flask
- spaCy
- scikit-learn
- PyPDF2
- python-docx

### **DevOps**

- Docker
- GitHub Actions
- PM2

---

## 📚 API Documentation

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Jobs**

- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job (recruiter)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/save` - Save job
- `GET /api/jobs/saved` - Get saved jobs

### **Applications**

- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user applications
- `PUT /api/applications/:id/status` - Update status

### **AI Features**

- `POST /api/ai/parse-resume` - Parse resume
- `POST /api/ai/analyze-resume` - Analyze quality
- `GET /api/ai/job-recommendations` - Get matches
- `POST /api/ai/rank-candidates` - Rank applicants

### **Notifications**

- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Count unread
- `PUT /api/notifications/read-all` - Mark all read

**Full API Documentation:** [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

---

## 🔧 Configuration

### **Environment Variables**

**Backend (.env):**

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ai-hiring
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
ML_SERVICE_URL=http://localhost:3002
```

**Frontend (.env):**

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ML_URL=http://localhost:3002
```

**ML Service (.env):**

```env
FLASK_ENV=development
PORT=3002
MODEL_PATH=./models
```

---

## 🧪 Testing

### **Backend Tests**

```bash
cd backend
npm test
```

### **Frontend Tests**

```bash
cd frontend
npm test
```

### **ML Service Tests**

```bash
cd ai-ml/ml-service
python -m pytest tests/
```

---

## 📖 Documentation

- **[Getting Started](docs/GETTING_STARTED.md)** - Setup guide
- **[API Documentation](backend/API_DOCUMENTATION.md)** - Complete API reference
- **[Job Seeker Guide](docs/user-guides/job-seeker-guide.md)** - For candidates
- **[Recruiter Guide](docs/user-guides/recruiter-guide.md)** - For recruiters
- **[Deployment Guide](docs/technical/deployment-guide.md)** - Production deployment
- **[ML Integration](docs/technical/ML_INTEGRATION_GUIDE.md)** - ML service details

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **Development Workflow**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- Bug description
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer:** Naseer Ibalti
- **Repository:** [github.com/naseeribalti/ai-powered_hiring_system](https://github.com/naseeribalti/ai-powered_hiring_system)

---

## 📞 Support

For questions or support:

- 📧 Email: support@aihiring.com
- 💬 Issues: [GitHub Issues](https://github.com/naseeribalti/ai-powered_hiring_system/issues)
- 📚 Documentation: `/docs` folder

---

## 🎯 Roadmap

- [x] Core authentication system
- [x] Job posting and management
- [x] Resume parsing (AI)
- [x] Candidate matching (AI)
- [x] Notification system
- [x] Saved jobs feature
- [ ] Video interviews
- [ ] Chat system
- [ ] Mobile app
- [ ] Analytics dashboard

---

## 🙏 Acknowledgments

- spaCy for NLP capabilities
- Material-UI for beautiful components
- MongoDB for flexible database
- All open-source contributors

---

## 📊 Project Stats

- **Backend Endpoints:** 40+
- **Frontend Components:** 50+
- **AI Features:** 6
- **Test Coverage:** 80%+
- **Documentation Pages:** 20+

---

**Built with ❤️ using React, Node.js, Python, and AI/ML**

_Last Updated: October 25, 2025_
