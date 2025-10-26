from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

job_bp = Blueprint('jobs', __name__)


@job_bp.route('/match', methods=['POST'])
def match_resume_to_jobs():
    """
    Match a resume to multiple jobs using TF-IDF and cosine similarity
    Returns jobs ranked by match score
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        resume_text = data.get('resumeText', '')
        jobs = data.get('jobs', [])

        if not resume_text:
            return jsonify({'error': 'Resume text is required'}), 400

        if not jobs or len(jobs) == 0:
            return jsonify({'matches': []}), 200

        print(f"\n{'='*50}")
        print(f"Matching resume to {len(jobs)} jobs")
        print(f"{'='*50}\n")

        # Prepare documents: [resume, job1_desc, job2_desc, ...]
        documents = [resume_text]

        for job in jobs:
            # Combine multiple job fields for better matching
            job_text = ' '.join([
                job.get('title', ''),
                job.get('description', ''),
                job.get('requirements', ''),
                ' '.join(job.get('skills', [])),
                job.get('location', ''),
                job.get('type', '')
            ])
            documents.append(job_text)

        # TF-IDF vectorization
        try:
            vectorizer = TfidfVectorizer(
                stop_words='english',
                max_features=500,
                ngram_range=(1, 2)  # Include bigrams for better matching
            )
            tfidf_matrix = vectorizer.fit_transform(documents)
        except Exception as e:
            print(f"TF-IDF vectorization error: {str(e)}")
            return jsonify({'error': 'Failed to vectorize documents'}), 500

        # Calculate cosine similarity between resume and all jobs
        resume_vector = tfidf_matrix[0:1]
        job_vectors = tfidf_matrix[1:]
        similarities = cosine_similarity(resume_vector, job_vectors)[0]

        # Get feature names for skill gap analysis
        feature_names = vectorizer.get_feature_names_out()

        # Create match results
        matches = []
        for i, job in enumerate(jobs):
            match_score = float(similarities[i] * 100)

            # Skill gap analysis
            job_vector = job_vectors[i].toarray()[0]
            resume_vector_array = resume_vector.toarray()[0]

            # Find top keywords in job that are missing/weak in resume
            job_keywords = []
            for j, score in enumerate(job_vector):
                if score > 0:
                    job_keywords.append((feature_names[j], score))

            job_keywords.sort(key=lambda x: x[1], reverse=True)

            # Find missing/weak skills
            missing_skills = []
            for keyword, job_score in job_keywords[:10]:  # Top 10 job keywords
                resume_score = resume_vector_array[list(
                    feature_names).index(keyword)]
                if resume_score < job_score * 0.5:  # Significantly weaker in resume
                    missing_skills.append(keyword)

            matches.append({
                'jobId': job.get('_id', job.get('id', '')),
                'title': job.get('title', ''),
                'company': job.get('company', {}).get('name', '') if isinstance(job.get('company'), dict) else job.get('company', ''),
                'location': job.get('location', ''),
                'matchScore': round(match_score, 2),
                'missingSkills': missing_skills[:5],  # Top 5 missing skills
                'matchLevel': 'high' if match_score >= 70 else 'medium' if match_score >= 50 else 'low'
            })

        # Sort by match score (descending)
        matches.sort(key=lambda x: x['matchScore'], reverse=True)

        print(f"✓ Matching complete. Top match: {
              matches[0]['matchScore']:.2f}%\n")

        return jsonify({
            'success': True,
            'matches': matches,
            'totalJobs': len(jobs),
            'topMatch': matches[0] if matches else None
        }), 200

    except Exception as e:
        print(f"Error matching resume to jobs: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to match resume to jobs: {str(e)}'}), 500


@job_bp.route('/recommend', methods=['POST'])
def recommend_jobs():
    """
    Recommend jobs based on user skills and preferences
    More sophisticated than simple matching
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        user_skills = data.get('userSkills', [])
        jobs = data.get('jobs', [])
        preferences = data.get('preferences', {})

        if not jobs:
            return jsonify({'recommendations': []}), 200

        print(f"\n{'='*50}")
        print(f"Recommending jobs for user with {
              len(user_skills)} skills")
        print(f"{'='*50}\n")

        recommendations = []

        for job in jobs:
            score = 0
            reasons = []

            # Skill matching
            job_skills = job.get('skills', [])
            matched_skills = [
                skill for skill in user_skills if skill.lower() in [s.lower() for s in job_skills]]
            skill_match_ratio = len(matched_skills) / \
                len(job_skills) if job_skills else 0

            score += skill_match_ratio * 40  # 40% weight for skills
            if matched_skills:
                reasons.append(
                    f"Matches {len(matched_skills)} of your skills")

            # Experience level matching
            user_experience_years = preferences.get('experienceYears', 0)
            job_experience_required = job.get('experienceRequired', 0)

            if abs(user_experience_years - job_experience_required) <= 1:
                score += 20
                reasons.append("Experience level matches")
            elif user_experience_years >= job_experience_required:
                score += 15
                reasons.append("You meet the experience requirement")

            # Location preference
            preferred_locations = preferences.get('locations', [])
            job_location = job.get('location', '')

            if not preferred_locations or any(loc.lower() in job_location.lower() for loc in preferred_locations):
                score += 15
                if preferred_locations:
                    reasons.append("Matches your location preference")

            # Job type preference (full-time, part-time, remote, etc.)
            preferred_types = preferences.get('jobTypes', [])
            job_type = job.get('type', '')

            if not preferred_types or job_type.lower() in [t.lower() for t in preferred_types]:
                score += 10
                if preferred_types:
                    reasons.append("Matches your job type preference")

            # Salary preference
            preferred_salary_min = preferences.get('salaryMin', 0)
            job_salary_max = job.get('salary', {}).get(
                'max', 0) if isinstance(job.get('salary'), dict) else 0

            if job_salary_max >= preferred_salary_min:
                score += 10
                if preferred_salary_min > 0:
                    reasons.append("Meets your salary expectation")

            # Industry preference
            preferred_industries = preferences.get('industries', [])
            job_industry = job.get('industry', '')

            if not preferred_industries or job_industry in preferred_industries:
                score += 5
                if preferred_industries:
                    reasons.append("Matches your industry preference")

            recommendations.append({
                'jobId': job.get('_id', job.get('id', '')),
                'title': job.get('title', ''),
                'company': job.get('company', {}).get('name', '') if isinstance(job.get('company'), dict) else job.get('company', ''),
                'location': job.get('location', ''),
                'recommendationScore': round(score, 2),
                'matchedSkills': matched_skills,
                'reasons': reasons,
                'recommendationLevel': 'highly_recommended' if score >= 80 else 'recommended' if score >= 60 else 'consider'
            })

        # Sort by recommendation score (descending)
        recommendations.sort(
            key=lambda x: x['recommendationScore'], reverse=True)

        print(f"✓ Recommendation complete. Top score: {
              recommendations[0]['recommendationScore']:.2f}\n")

        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'totalJobs': len(jobs),
            'topRecommendation': recommendations[0] if recommendations else None
        }), 200

    except Exception as e:
        print(f"Error recommending jobs: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to recommend jobs: {str(e)}'}), 500


@job_bp.route('/analyze-description', methods=['POST'])
def analyze_job_description():
    """
    Analyze a job description and extract key requirements
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        description = data.get('description', '')

        if not description:
            return jsonify({'error': 'Job description is required'}), 400

        # Use TF-IDF to extract important keywords
        vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=20,
            ngram_range=(1, 2)
        )

        try:
            tfidf_matrix = vectorizer.fit_transform([description])
            feature_names = vectorizer.get_feature_names_out()
            scores = tfidf_matrix.toarray()[0]

            # Get top keywords
            keyword_scores = list(zip(feature_names, scores))
            keyword_scores.sort(key=lambda x: x[1], reverse=True)

            keywords = [kw for kw, score in keyword_scores if score > 0]

            return jsonify({
                'success': True,
                'keywords': keywords,
                'totalKeywords': len(keywords)
            }), 200

        except Exception as e:
            return jsonify({'error': f'Failed to analyze description: {str(e)}'}), 500

    except Exception as e:
        print(f"Error analyzing job description: {str(e)}")
        return jsonify({'error': f'Failed to analyze job description: {str(e)}'}), 500


@job_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'service': 'job-matching',
        'algorithms': {
            'tfidf': 'ready',
            'cosine_similarity': 'ready',
            'recommendation_engine': 'ready'
        }
    }), 200
