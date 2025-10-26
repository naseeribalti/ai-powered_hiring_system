"""
Simple test script to verify ML service components are working
Run this after installing dependencies to check everything is set up correctly
"""


def test_imports():
    """Test that all required packages can be imported"""
    print("Testing imports...")

    try:
        import flask
        print("✓ Flask imported successfully")
    except ImportError as e:
        print(f"✗ Flask import failed: {e}")
        return False

    try:
        from flask_cors import CORS
        print("✓ Flask-CORS imported successfully")
    except ImportError as e:
        print(f"✗ Flask-CORS import failed: {e}")
        return False

    try:
        import pdfplumber
        print("✓ pdfplumber imported successfully")
    except ImportError as e:
        print(f"✗ pdfplumber import failed: {e}")
        return False

    try:
        import docx
        print("✓ python-docx imported successfully")
    except ImportError as e:
        print(f"✗ python-docx import failed: {e}")
        return False

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        print("✓ scikit-learn imported successfully")
    except ImportError as e:
        print(f"✗ scikit-learn import failed: {e}")
        return False

    try:
        import requests
        print("✓ requests imported successfully")
    except ImportError as e:
        print(f"✗ requests import failed: {e}")
        return False

    try:
        import numpy
        print("✓ numpy imported successfully")
    except ImportError as e:
        print(f"✗ numpy import failed: {e}")
        return False

    return True


def test_components():
    """Test that our custom components can be imported"""
    print("\nTesting custom components...")

    try:
        from parsers.resume_parser import ResumeParser
        print("✓ ResumeParser imported successfully")

        parser = ResumeParser()
        print("✓ ResumeParser instantiated successfully")
    except Exception as e:
        print(f"✗ ResumeParser failed: {e}")
        return False

    try:
        from extractors.skill_extractor import SkillExtractor
        print("✓ SkillExtractor imported successfully")

        extractor = SkillExtractor()
        print("✓ SkillExtractor instantiated successfully")
    except Exception as e:
        print(f"✗ SkillExtractor failed: {e}")
        return False

    try:
        from scorers.resume_scorer import ResumeScorer
        print("✓ ResumeScorer imported successfully")

        scorer = ResumeScorer()
        print("✓ ResumeScorer instantiated successfully")
    except Exception as e:
        print(f"✗ ResumeScorer failed: {e}")
        return False

    return True


def test_skill_extraction():
    """Test skill extraction with sample text"""
    print("\nTesting skill extraction...")

    try:
        from extractors.skill_extractor import SkillExtractor

        extractor = SkillExtractor()

        sample_text = """
        Experienced software engineer with 5 years of experience.
        Skills: Python, JavaScript, React, Node.js, MongoDB, AWS, Docker.
        Proficient in machine learning and data science.
        Strong background in web development and cloud computing.
        """

        result = extractor.extract_skills(sample_text, {})

        if result and 'skills' in result:
            print(f"✓ Extracted {len(result['skills'])} skills")
            print(
                f"  Sample skills: {[s['name'] for s in result['skills'][:5]]}")
            return True
        else:
            print("✗ Skill extraction returned unexpected format")
            return False

    except Exception as e:
        print(f"✗ Skill extraction failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_scoring():
    """Test scoring with sample data"""
    print("\nTesting scoring...")

    try:
        from scorers.resume_scorer import ResumeScorer

        scorer = ResumeScorer()

        sample_parsed_data = {
            'contact': {'email': 'test@example.com', 'phone': '1234567890'},
            'experience': [
                {
                    'title': 'Software Engineer',
                    'company': 'Tech Corp',
                    'start_date': '2020',
                    'end_date': '2023',
                    'current': False,
                    'description': 'Developed web applications using React and Node.js. Led team of 5 developers. Increased performance by 40%.'
                }
            ],
            'education': [
                {
                    'degree': 'Bachelor of Science',
                    'institution': 'University',
                    'major': 'Computer Science',
                    'gpa': '3.8'
                }
            ],
            'sections': {
                'experience': True,
                'education': True,
                'skills': True,
                'summary': True
            },
            'raw_text': 'Sample resume text with action verbs: led, developed, managed, improved, created.'
        }

        sample_skills_data = {
            'skills': [
                {'name': 'Python', 'confidence': 0.95, 'category': 'programming'},
                {'name': 'JavaScript', 'confidence': 0.92,
                    'category': 'programming'},
                {'name': 'React', 'confidence': 0.90, 'category': 'web_frontend'},
                {'name': 'Node.js', 'confidence': 0.88, 'category': 'web_backend'},
                {'name': 'MongoDB', 'confidence': 0.85, 'category': 'database'},
                {'name': 'AWS', 'confidence': 0.82, 'category': 'cloud'},
                {'name': 'Docker', 'confidence': 0.80, 'category': 'devops'},
            ]
        }

        scores = scorer.calculate_score(sample_parsed_data, sample_skills_data)

        if scores and 'overall' in scores:
            print(f"✓ Scoring successful")
            print(f"  Overall Score: {scores['overall']}/100")
            print(f"  Skills Match: {scores['skills_match']}/100")
            print(
                f"  Experience Relevance: {scores['experience_relevance']}/100")
            print(
                f"  Recommendations: {len(scores['recommendations'])} generated")
            return True
        else:
            print("✗ Scoring returned unexpected format")
            return False

    except Exception as e:
        print(f"✗ Scoring failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_job_matching():
    """Test job matching algorithm"""
    print("\nTesting job matching...")

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        resume_text = "Python developer with 5 years experience in web development, Django, Flask, REST APIs, PostgreSQL"

        jobs = [
            {
                '_id': 'job1',
                'title': 'Python Developer',
                'description': 'Looking for Python developer with Django and REST API experience',
                'skills': ['Python', 'Django', 'REST API']
            },
            {
                '_id': 'job2',
                'title': 'JavaScript Developer',
                'description': 'Need React and Node.js developer for frontend work',
                'skills': ['JavaScript', 'React', 'Node.js']
            }
        ]

        documents = [resume_text] + [job['description'] for job in jobs]

        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)

        resume_vector = tfidf_matrix[0:1]
        job_vectors = tfidf_matrix[1:]
        similarities = cosine_similarity(resume_vector, job_vectors)[0]

        print(f"✓ Job matching successful")
        print(f"  Job 1 (Python) match: {similarities[0]*100:.1f}%")
        print(f"  Job 2 (JavaScript) match: {similarities[1]*100:.1f}%")

        if similarities[0] > similarities[1]:
            print(f"  ✓ Correctly ranked Python job higher")
            return True
        else:
            print(f"  ✗ Ranking seems incorrect")
            return False

    except Exception as e:
        print(f"✗ Job matching failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("ML Service Component Tests")
    print("=" * 60)

    results = []

    results.append(("Imports", test_imports()))
    results.append(("Components", test_components()))
    results.append(("Skill Extraction", test_skill_extraction()))
    results.append(("Scoring", test_scoring()))
    results.append(("Job Matching", test_job_matching()))

    print("\n" + "=" * 60)
    print("Test Results Summary")
    print("=" * 60)

    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status} - {name}")

    all_passed = all(result[1] for result in results)

    print("=" * 60)

    if all_passed:
        print("\n🎉 All tests passed! ML service is ready to use.")
        print("\nNext step: Start the service with 'python app.py'")
    else:
        print("\n⚠️ Some tests failed. Please check the errors above.")
        print("\nTry reinstalling dependencies:")
        print("  pip install -r requirements.txt --force-reinstall")

    print()
    return all_passed


if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
