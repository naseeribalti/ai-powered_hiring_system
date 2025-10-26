from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from routes.resume_routes import resume_bp
from routes.job_routes import job_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:3001"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(resume_bp, url_prefix='/api/resume')
app.register_blueprint(job_bp, url_prefix='/api/jobs')

# Health check endpoint


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'AI ML Service',
        'version': '1.0.0'
    }), 200

# Root endpoint


@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'AI-Powered Hiring System - ML Service',
        'endpoints': {
            'resume_analysis': '/api/resume/analyze',
            'resume_parse': '/api/resume/parse',
            'resume_score': '/api/resume/score',
            'job_matching': '/api/jobs/match',
            'skill_extraction': '/api/resume/extract-skills'
        }
    }), 200

# Error handlers


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 3002))
    debug = os.getenv('FLASK_ENV') == 'development'

    print(f"""
╔═══════════════════════════════════════════════════════╗
║   AI-POWERED HIRING SYSTEM - ML SERVICE              ║
║   Port: {port}                                          ║
║   Environment: {'Development' if debug else 'Production'}                           ║
╚═══════════════════════════════════════════════════════╝

📊 Available Endpoints:
   
   Resume Analysis:
   ✓ POST /api/resume/analyze        - Full pipeline (parse + extract + score)
   ✓ POST /api/resume/parse          - Parse resume from URL
   ✓ POST /api/resume/extract-skills - Extract skills from text
   ✓ POST /api/resume/score          - Calculate AI scores
   ✓ GET  /api/resume/health         - Health check
   
   Job Matching:
   ✓ POST /api/jobs/match            - Match resume to jobs (TF-IDF)
   ✓ POST /api/jobs/recommend        - Get job recommendations
   ✓ POST /api/jobs/analyze-description - Extract job keywords
   ✓ GET  /api/jobs/health           - Health check
   
   System:
   ✓ GET  /health                    - Service health check
   ✓ GET  /                          - API information

🚀 ML Service Features:
   • 200+ skills across 11 categories
   • 7 AI scoring metrics
   • PDF/DOCX resume parsing
   • TF-IDF job matching
   • Confidence-based skill extraction
   • Intelligent recommendations

🔗 Integration:
   • Backend: http://localhost:3001
   • Frontend: http://localhost:3000
   • ML Service: http://localhost:{port}

✨ Ready to process resumes!
    """)

    app.run(host='0.0.0.0', port=port, debug=debug)
