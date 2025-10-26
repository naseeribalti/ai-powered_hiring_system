# AI-ML Service for Hiring System

This is the Python Flask-based machine learning service that powers the AI features of the hiring system, including resume parsing, skill extraction, and intelligent scoring.

## Features

- **Resume Parsing**: Extract text and structure from PDF and DOCX files
- **Skill Extraction**: Identify 200+ technical and soft skills with confidence scores
- **AI Scoring**: Calculate 7 different metrics to evaluate resume quality
- **Job Matching**: Use TF-IDF and cosine similarity to match resumes to jobs
- **Recommendations**: Generate actionable recommendations to improve resumes

## Architecture

```
ml-service/
├── app.py                  # Flask application entry point
├── parsers/
│   └── resume_parser.py    # PDF/DOCX parsing logic
├── extractors/
│   └── skill_extractor.py  # Skill identification and confidence scoring
├── scorers/
│   └── resume_scorer.py    # AI scoring algorithms
└── routes/
    ├── resume_routes.py    # Resume analysis endpoints
    └── job_routes.py       # Job matching endpoints
```

## Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### 2. Create Virtual Environment

**Windows:**

```bash
cd ai-ml\ml-service
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**

```bash
cd ai-ml/ml-service
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:

- Flask (web framework)
- flask-cors (CORS support)
- pdfplumber (PDF parsing)
- python-docx (DOCX parsing)
- scikit-learn (TF-IDF, cosine similarity)
- requests (HTTP client)
- numpy (numerical operations)

### 4. Start the Service

```bash
python app.py
```

The service will start on **http://localhost:3002**

You should see:

```
╔═══════════════════════════════════════╗
║   AI Hiring System - ML Service      ║
║   Port: 3002                         ║
║   Environment: development           ║
╚═══════════════════════════════════════╝

Available routes:
  GET  /health
  POST /api/resume/parse
  POST /api/resume/analyze
  POST /api/resume/extract-skills
  POST /api/resume/score
  POST /api/jobs/match
  POST /api/jobs/recommend
```

## API Endpoints

### Resume Analysis

#### POST `/api/resume/analyze`

Full resume analysis pipeline (parse + extract + score)

**Request:**

```json
{
  "resumeUrl": "https://res.cloudinary.com/.../resume.pdf",
  "resumeId": "507f1f77bcf86cd799439011"
}
```

**Response:**

```json
{
  "success": true,
  "parsedData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-234-567-8900",
    "skills": [
      { "name": "JavaScript", "confidence": 0.95, "category": "programming" },
      { "name": "React", "confidence": 0.92, "category": "web_frontend" }
    ],
    "experience": [...],
    "education": [...]
  },
  "aiScore": {
    "overall": 85,
    "skillsMatch": 90,
    "experienceRelevance": 85,
    "educationMatch": 80,
    "resumeQuality": 85,
    "keywordOptimization": 82,
    "atsCompatibility": 88
  },
  "recommendations": [
    {
      "type": "skill",
      "priority": "high",
      "message": "Add more technical skills...",
      "actionable": true
    }
  ]
}
```

#### POST `/api/resume/parse`

Parse resume and extract structure only

#### POST `/api/resume/extract-skills`

Extract skills from text

#### POST `/api/resume/score`

Calculate AI scores for parsed data

### Job Matching

#### POST `/api/jobs/match`

Match a resume to multiple jobs

**Request:**

```json
{
  "resumeText": "Full text of resume...",
  "jobs": [
    {
      "_id": "job123",
      "title": "Software Engineer",
      "description": "...",
      "requirements": "...",
      "skills": ["JavaScript", "React"]
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "matches": [
    {
      "jobId": "job123",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "matchScore": 87.5,
      "missingSkills": ["Docker", "Kubernetes"],
      "matchLevel": "high"
    }
  ]
}
```

#### POST `/api/jobs/recommend`

Recommend jobs based on user profile and preferences

### Health Check

#### GET `/health`

Check service status

## Testing

### 1. Test with cURL

**Parse Resume:**

```bash
curl -X POST http://localhost:3002/api/resume/parse ^
  -H "Content-Type: application/json" ^
  -d "{\"resumeUrl\": \"https://example.com/resume.pdf\"}"
```

**Health Check:**

```bash
curl http://localhost:3002/health
```

### 2. Test with Full System

1. Start ML Service (port 3002)
2. Start Backend (port 3001)
3. Start Frontend (port 3000)
4. Login as job seeker
5. Upload a resume through the dashboard
6. Watch the console logs for ML processing

## Scoring Algorithm Details

### Overall Score (0-100)

Weighted average of all component scores:

- Skills Match: 30%
- Experience Relevance: 25%
- Education Match: 15%
- Resume Quality: 15%
- Keyword Optimization: 10%
- ATS Compatibility: 5%

### Skills Match

- Based on quantity (15-20 skills is optimal)
- Confidence scores from skill extractor
- Category diversity (multiple skill categories)
- High-value skills (AI/ML, Cloud, etc.)

### Experience Relevance

- Total years of experience
- Number of positions held
- Quality of job descriptions
- Recent/current employment
- Quantifiable achievements

### Education Match

- Degree level (PhD=100, Masters=85, Bachelors=75, etc.)
- Institution quality
- GPA if provided (3.5+ gets bonus)
- Relevant major

### Resume Quality

- Completeness (all sections present)
- Contact information (email, phone, LinkedIn, GitHub)
- Professional formatting
- Appropriate length (1-2 pages ideal)

### Keyword Optimization

- Industry-specific keywords
- Action verbs (led, managed, developed, etc.)
- Quantifiable achievements
- Technical terminology

### ATS Compatibility

- Standard section headers
- Simple formatting
- No excessive special characters
- Clear structure

## Skill Database

The system recognizes 200+ skills across 11 categories:

- **Programming**: Python, JavaScript, Java, C++, TypeScript, Go, Rust, etc.
- **Web Frontend**: React, Angular, Vue, Next.js, HTML, CSS, Tailwind, etc.
- **Web Backend**: Node.js, Express, Django, Flask, FastAPI, Spring, etc.
- **Mobile**: React Native, Flutter, iOS, Android, Swift, Kotlin
- **Database**: MySQL, PostgreSQL, MongoDB, Redis, Elasticsearch
- **Cloud**: AWS, Azure, GCP, Docker, Kubernetes, Terraform
- **DevOps**: CI/CD, Git, Jenkins, GitHub Actions, Monitoring
- **Data Science**: Machine Learning, Pandas, TensorFlow, PyTorch, NLP
- **Testing**: Jest, Mocha, Cypress, Selenium, Pytest, TDD
- **Methodologies**: Agile, Scrum, Microservices, REST API
- **Soft Skills**: Leadership, Communication, Problem Solving, etc.

## Troubleshooting

### Service won't start

- Check Python version: `python --version` (should be 3.8+)
- Verify all dependencies installed: `pip list`
- Check port 3002 is available

### Resume parsing fails

- Verify resume URL is accessible
- Check file format (only PDF and DOCX supported)
- Look for error messages in console

### Low scores despite good resume

- Check if skills are being extracted (look at `parsedData.skills`)
- Verify text is being extracted from PDF/DOCX
- Some PDFs with complex layouts may not parse well

### Integration issues

- Verify backend is calling correct endpoint: `/api/resume/analyze`
- Check CORS is enabled for your frontend/backend URLs
- Look at network tab in browser DevTools

## Environment Variables

Create a `.env` file in `ml-service/` directory:

```env
FLASK_ENV=development
FLASK_PORT=3002
ML_SERVICE_URL=http://localhost:3002
```

## Performance

- **Resume parsing**: ~2-5 seconds per resume
- **Skill extraction**: ~1-2 seconds
- **AI scoring**: <1 second
- **Job matching (100 jobs)**: ~2-3 seconds

## Future Enhancements

- [ ] spaCy integration for better NER
- [ ] BERT models for semantic understanding
- [ ] Sentiment analysis for cover letters
- [ ] Job description quality scoring
- [ ] Salary prediction based on skills
- [ ] Resume comparison and ranking
- [ ] Real-time analysis streaming
- [ ] Caching for faster repeat analyses

## Contributing

When adding new features:

1. Add skills to `skill_extractor.py` skill database
2. Update scoring weights in `resume_scorer.py` if needed
3. Add new routes to appropriate blueprint
4. Update this README with new endpoints
5. Test with sample resumes

## License

Part of the AI Hiring System - Final Year Project
