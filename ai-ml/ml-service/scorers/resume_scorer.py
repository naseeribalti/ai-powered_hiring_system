import re
from datetime import datetime


class ResumeScorer:
    """
    Scores resumes based on multiple criteria and generates recommendations
    """

    def __init__(self):
        self.weights = {
            'skills_match': 0.30,
            'experience_relevance': 0.25,
            'education_match': 0.15,
            'resume_quality': 0.15,
            'keyword_optimization': 0.10,
            'ats_compatibility': 0.05
        }

    def calculate_score(self, parsed_data, skills_data, job_requirements=None):
        """
        Calculate overall resume score and component scores
        Returns: Dictionary with scores and recommendations
        """
        scores = {}

        # Calculate individual scores
        scores['skills_match'] = self._score_skills(
            skills_data, job_requirements)
        scores['experience_relevance'] = self._score_experience(
            parsed_data.get('experience', []))
        scores['education_match'] = self._score_education(
            parsed_data.get('education', []))
        scores['resume_quality'] = self._score_quality(parsed_data)
        scores['keyword_optimization'] = self._score_keywords(
            parsed_data, skills_data)
        scores['ats_compatibility'] = self._score_ats_compatibility(
            parsed_data)

        # Calculate weighted overall score
        overall_score = sum(
            scores[key] * self.weights[key] for key in self.weights
        )

        # Generate recommendations
        recommendations = self._generate_recommendations(
            scores, parsed_data, skills_data)

        return {
            'overall': round(overall_score, 2),
            'skills_match': round(scores['skills_match'], 2),
            'experience_relevance': round(scores['experience_relevance'], 2),
            'education_match': round(scores['education_match'], 2),
            'resume_quality': round(scores['resume_quality'], 2),
            'keyword_optimization': round(scores['keyword_optimization'], 2),
            'ats_compatibility': round(scores['ats_compatibility'], 2),
            'recommendations': recommendations
        }

    def _score_skills(self, skills_data, job_requirements=None):
        """
        Score based on skills (0-100)
        Higher confidence and more skills = higher score
        """
        if not skills_data or not skills_data.get('skills'):
            return 40  # Base score

        skills = skills_data['skills']
        total_skills = len(skills)

        # Base score from quantity
        quantity_score = min(total_skills * 3, 40)  # Max 40 from quantity

        # Quality score from confidence
        avg_confidence = sum(
            s['confidence'] for s in skills) / total_skills if total_skills > 0 else 0
        quality_score = avg_confidence * 50  # Max 50 from quality

        # Category diversity bonus
        categories = set(s['category'] for s in skills)
        diversity_bonus = min(len(categories) * 2, 10)  # Max 10 bonus

        score = quantity_score + quality_score + diversity_bonus

        return min(score, 100)

    def _score_experience(self, experience_entries):
        """
        Score based on work experience (0-100)
        """
        if not experience_entries:
            return 50  # Base score for entry level

        score = 50  # Base score

        # Number of positions bonus
        num_positions = len(experience_entries)
        score += min(num_positions * 5, 20)  # Max 20 from quantity

        # Quality indicators
        for exp in experience_entries:
            # Has detailed description
            if exp.get('description') and len(exp['description']) > 50:
                score += 5

            # Has clear title and company
            if exp.get('title') and exp.get('company'):
                score += 5

            # Long tenure (estimate years)
            if exp.get('start_date') and exp.get('end_date'):
                try:
                    start_year = int(re.search(
                        r'\d{4}', str(exp['start_date'])).group())
                    if exp['current']:
                        end_year = datetime.now().year
                    else:
                        end_year = int(re.search(
                            r'\d{4}', str(exp['end_date'])).group())

                    years = end_year - start_year
                    if years >= 2:
                        score += min(years * 2, 10)  # Max 10 per position
                except:
                    pass

        return min(score, 100)

    def _score_education(self, education_entries):
        """
        Score based on education (0-100)
        """
        if not education_entries:
            return 60  # Acceptable base score

        score = 60  # Base score

        education_levels = {
            'phd': 40,
            'doctorate': 40,
            'master': 30,
            'mba': 30,
            'bachelor': 20,
            'associate': 10,
            'diploma': 5
        }

        # Find highest education level
        max_education_score = 0
        has_gpa = False

        for edu in education_entries:
            degree = edu.get('degree', '').lower()

            for level, points in education_levels.items():
                if level in degree:
                    max_education_score = max(max_education_score, points)
                    break

            # Has institution name
            if edu.get('institution'):
                score += 5

            # Has GPA
            if edu.get('gpa'):
                has_gpa = True
                score += 5

        score += max_education_score

        return min(score, 100)

    def _score_quality(self, parsed_data):
        """
        Score resume quality and formatting (0-100)
        """
        score = 50  # Base score

        # Has contact information
        contact = parsed_data.get('contact', {})
        if contact.get('email'):
            score += 10
        if contact.get('phone'):
            score += 10
        if contact.get('linkedin'):
            score += 5
        if contact.get('github') or contact.get('website'):
            score += 5

        # Has key sections
        sections = parsed_data.get('sections', {})
        required_sections = ['experience', 'education', 'skills']
        for section in required_sections:
            if section in sections:
                score += 5

        # Has additional sections (bonus)
        optional_sections = ['summary', 'certifications',
                             'projects', 'awards', 'languages']
        bonus_sections = sum(1 for s in optional_sections if s in sections)
        score += min(bonus_sections * 3, 15)

        # Resume length (not too short, not too long)
        raw_text = parsed_data.get('raw_text', '')
        word_count = len(raw_text.split())

        if 300 <= word_count <= 1000:  # Optimal range
            score += 10
        elif 150 <= word_count < 300 or 1000 < word_count <= 1500:
            score += 5

        return min(score, 100)

    def _score_keywords(self, parsed_data, skills_data):
        """
        Score keyword optimization (0-100)
        """
        score = 50  # Base score

        # Number of unique skills/keywords
        skills = skills_data.get('skills', [])
        num_skills = len(skills)

        if num_skills >= 20:
            score += 30
        elif num_skills >= 15:
            score += 25
        elif num_skills >= 10:
            score += 20
        elif num_skills >= 5:
            score += 15
        else:
            score += 10

        # Action verbs in experience
        action_verbs = [
            'led', 'managed', 'developed', 'created', 'implemented', 'designed',
            'improved', 'increased', 'reduced', 'achieved', 'delivered', 'built',
            'optimized', 'streamlined', 'collaborated', 'coordinated'
        ]

        experience_text = ' '.join(
            exp.get('description', '') for exp in parsed_data.get('experience', [])
        ).lower()

        verb_count = sum(1 for verb in action_verbs if verb in experience_text)
        score += min(verb_count * 2, 20)  # Max 20 bonus

        return min(score, 100)

    def _score_ats_compatibility(self, parsed_data):
        """
        Score ATS (Applicant Tracking System) compatibility (0-100)
        """
        score = 60  # Base score

        # Has standard section headers
        sections = parsed_data.get('sections', {})
        standard_headers = ['experience', 'education', 'skills']

        for header in standard_headers:
            if header in sections:
                score += 10

        # Contact info clearly visible
        contact = parsed_data.get('contact', {})
        if contact.get('email') and contact.get('phone'):
            score += 10

        # Not too many special characters or formatting
        raw_text = parsed_data.get('raw_text', '')
        special_char_ratio = len(
            re.findall(r'[^a-zA-Z0-9\s.,!?()-]', raw_text)) / max(len(raw_text), 1)

        if special_char_ratio < 0.05:  # Less than 5% special chars
            score += 10

        return min(score, 100)

    def _generate_recommendations(self, scores, parsed_data, skills_data):
        """
        Generate actionable recommendations based on scores
        """
        recommendations = []

        # Skills recommendations
        if scores['skills_match'] < 70:
            recommendations.append({
                'type': 'skill',
                'priority': 'high',
                'message': 'Add more technical skills relevant to your field. Aim for 15-20 key skills.',
                'actionable': True
            })

        skills = skills_data.get('skills', [])
        if len(skills) < 10:
            recommendations.append({
                'type': 'skill',
                'priority': 'high',
                'message': 'Include both technical and soft skills to present a well-rounded profile.',
                'actionable': True
            })

        # Experience recommendations
        if scores['experience_relevance'] < 70:
            experiences = parsed_data.get('experience', [])

            if len(experiences) < 2:
                recommendations.append({
                    'type': 'experience',
                    'priority': 'high',
                    'message': 'Add more work experience entries, including internships and part-time positions.',
                    'actionable': True
                })

            # Check for quantifiable achievements
            has_numbers = any(
                re.search(r'\d+%|\d+x|\$\d+', exp.get('description', ''))
                for exp in experiences
            )

            if not has_numbers:
                recommendations.append({
                    'type': 'experience',
                    'priority': 'high',
                    'message': 'Add quantifiable achievements (e.g., "Increased performance by 40%", "Managed team of 5").',
                    'actionable': True
                })

        # Education recommendations
        if scores['education_match'] < 70:
            education = parsed_data.get('education', [])

            if not education:
                recommendations.append({
                    'type': 'education',
                    'priority': 'medium',
                    'message': 'Add your education details including degree, institution, and graduation year.',
                    'actionable': True
                })
            elif not any(edu.get('gpa') for edu in education):
                recommendations.append({
                    'type': 'education',
                    'priority': 'low',
                    'message': 'Consider adding GPA if it\'s above 3.0/4.0.',
                    'actionable': True
                })

        # Quality recommendations
        if scores['resume_quality'] < 70:
            contact = parsed_data.get('contact', {})

            if not contact.get('linkedin'):
                recommendations.append({
                    'type': 'formatting',
                    'priority': 'medium',
                    'message': 'Add your LinkedIn profile URL to increase professional visibility.',
                    'actionable': True
                })

            if not contact.get('github') and not contact.get('website'):
                recommendations.append({
                    'type': 'formatting',
                    'priority': 'medium',
                    'message': 'Add a link to your GitHub profile or portfolio website.',
                    'actionable': True
                })

            sections = parsed_data.get('sections', {})
            if 'summary' not in sections:
                recommendations.append({
                    'type': 'formatting',
                    'priority': 'medium',
                    'message': 'Add a professional summary at the top highlighting your key strengths.',
                    'actionable': True
                })

        # Keyword recommendations
        if scores['keyword_optimization'] < 70:
            recommendations.append({
                'type': 'keyword',
                'priority': 'medium',
                'message': 'Use more industry-specific keywords and technical terms.',
                'actionable': True
            })

            recommendations.append({
                'type': 'keyword',
                'priority': 'medium',
                'message': 'Include action verbs (led, managed, developed, implemented) in experience descriptions.',
                'actionable': True
            })

        # ATS recommendations
        if scores['ats_compatibility'] < 80:
            recommendations.append({
                'type': 'formatting',
                'priority': 'high',
                'message': 'Use standard section headers (Experience, Education, Skills) for better ATS compatibility.',
                'actionable': True
            })

            recommendations.append({
                'type': 'formatting',
                'priority': 'medium',
                'message': 'Avoid excessive special characters, tables, or images that may not parse well in ATS systems.',
                'actionable': True
            })

        # General recommendations
        if scores['overall'] >= 80:
            recommendations.append({
                'type': 'general',
                'priority': 'low',
                'message': 'Great resume! Consider customizing it for each job application to increase match rate.',
                'actionable': True
            })

        return recommendations
