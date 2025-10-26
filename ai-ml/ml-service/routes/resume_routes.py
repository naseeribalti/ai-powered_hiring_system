from scorers.resume_scorer import ResumeScorer
from extractors.skill_extractor import SkillExtractor
from parsers.resume_parser import ResumeParser
from flask import Blueprint, request, jsonify
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


resume_bp = Blueprint('resume', __name__)

# Initialize components
parser = ResumeParser()
skill_extractor = SkillExtractor()
scorer = ResumeScorer()


@resume_bp.route('/parse', methods=['POST'])
def parse_resume():
    """
    Parse resume from URL or file upload
    Extracts text and basic structure
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        resume_url = data.get('resumeUrl')

        if not resume_url:
            return jsonify({'error': 'Resume URL is required'}), 400

        # Parse the resume
        parsed_data = parser.parse_from_url(resume_url)

        if not parsed_data:
            return jsonify({'error': 'Failed to parse resume'}), 500

        return jsonify({
            'success': True,
            'parsedData': parsed_data
        }), 200

    except Exception as e:
        print(f"Error parsing resume: {str(e)}")
        return jsonify({'error': f'Failed to parse resume: {str(e)}'}), 500


@resume_bp.route('/extract-skills', methods=['POST'])
def extract_skills():
    """
    Extract skills from resume text
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Can accept either raw text or URL
        resume_text = data.get('resumeText')
        resume_url = data.get('resumeUrl')
        parsed_data = data.get('parsedData', {})

        if not resume_text and not resume_url:
            return jsonify({'error': 'Resume text or URL is required'}), 400

        # Parse if URL provided
        if resume_url and not resume_text:
            parsed_result = parser.parse_from_url(resume_url)
            resume_text = parsed_result.get('raw_text', '')
            parsed_data = parsed_result

        # Extract skills
        skills_result = skill_extractor.extract_skills(
            resume_text, parsed_data)

        return jsonify({
            'success': True,
            'skills': skills_result
        }), 200

    except Exception as e:
        print(f"Error extracting skills: {str(e)}")
        return jsonify({'error': f'Failed to extract skills: {str(e)}'}), 500


@resume_bp.route('/score', methods=['POST'])
def score_resume():
    """
    Calculate AI scores for a resume
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        parsed_data = data.get('parsedData')
        skills_data = data.get('skillsData')
        job_requirements = data.get('jobRequirements')

        if not parsed_data or not skills_data:
            return jsonify({'error': 'Parsed data and skills data are required'}), 400

        # Calculate scores
        scores = scorer.calculate_score(
            parsed_data, skills_data, job_requirements)

        return jsonify({
            'success': True,
            'scores': scores
        }), 200

    except Exception as e:
        print(f"Error scoring resume: {str(e)}")
        return jsonify({'error': f'Failed to score resume: {str(e)}'}), 500


@resume_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    """
    Full resume analysis pipeline: parse -> extract skills -> score
    This is the main endpoint used by the backend
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        resume_url = data.get('resumeUrl')
        resume_id = data.get('resumeId')

        if not resume_url:
            return jsonify({'error': 'Resume URL is required'}), 400

        print(f"\n{'='*50}")
        print(f"Starting resume analysis for ID: {resume_id}")
        print(f"Resume URL: {resume_url}")
        print(f"{'='*50}\n")

        # Step 1: Parse resume
        print("Step 1: Parsing resume...")
        parsed_data = parser.parse_from_url(resume_url)

        if not parsed_data or not parsed_data.get('raw_text'):
            print("ERROR: Failed to parse resume or extract text")
            return jsonify({'error': 'Failed to parse resume'}), 500

        print(f"✓ Parsed successfully. Text length: {
              len(parsed_data.get('raw_text', ''))} characters")

        # Step 2: Extract skills
        print("\nStep 2: Extracting skills...")
        skills_result = skill_extractor.extract_skills(
            parsed_data['raw_text'],
            parsed_data
        )

        print(f"✓ Extracted {len(skills_result.get('skills', []))} skills")

        # Step 3: Calculate scores
        print("\nStep 3: Calculating AI scores...")
        scores = scorer.calculate_score(parsed_data, skills_result)

        print(f"✓ Overall Score: {scores.get('overall')}/100")

        # Prepare response in format expected by backend
        response_data = {
            'success': True,
            'parsedData': {
                'name': parsed_data['contact'].get('name', ''),
                'email': parsed_data['contact'].get('email', ''),
                'phone': parsed_data['contact'].get('phone', ''),
                'linkedin': parsed_data['contact'].get('linkedin', ''),
                'github': parsed_data['contact'].get('github', ''),
                'website': parsed_data['contact'].get('website', ''),
                'summary': parsed_data.get('summary', ''),
                'skills': skills_result.get('skills', []),
                'experience': parsed_data.get('experience', []),
                'education': parsed_data.get('education', []),
                'certifications': parsed_data.get('certifications', []),
                'projects': parsed_data.get('projects', []),
                'languages': parsed_data.get('languages', [])
            },
            'aiScore': {
                'overall': scores.get('overall', 0),
                'skillsMatch': scores.get('skills_match', 0),
                'experienceRelevance': scores.get('experience_relevance', 0),
                'educationMatch': scores.get('education_match', 0),
                'resumeQuality': scores.get('resume_quality', 0),
                'keywordOptimization': scores.get('keyword_optimization', 0),
                'atsCompatibility': scores.get('ats_compatibility', 0)
            },
            'recommendations': scores.get('recommendations', [])
        }

        print(f"\n{'='*50}")
        print(f"Analysis complete for resume ID: {resume_id}")
        print(f"{'='*50}\n")

        return jsonify(response_data), 200

    except Exception as e:
        print(f"\nERROR: Failed to analyze resume: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': f'Failed to analyze resume: {str(e)}'
        }), 500


@resume_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'service': 'resume-analysis',
        'components': {
            'parser': 'ready',
            'skill_extractor': 'ready',
            'scorer': 'ready'
        }
    }), 200
