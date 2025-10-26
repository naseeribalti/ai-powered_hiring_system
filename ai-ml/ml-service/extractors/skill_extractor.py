import re
from collections import Counter


class SkillExtractor:
    """
    Extracts and categorizes skills from resume text
    """

    def __init__(self):
        # Comprehensive skill database
        self.skill_database = {
            'programming': [
                'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust', 'ruby',
                'php', 'swift', 'kotlin', 'scala', 'perl', 'r', 'matlab', 'julia', 'dart'
            ],
            'web_frontend': [
                'react', 'angular', 'vue', 'svelte', 'nextjs', 'nuxt', 'gatsby', 'jquery',
                'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui', 'redux',
                'webpack', 'vite', 'babel'
            ],
            'web_backend': [
                'nodejs', 'express', 'fastapi', 'flask', 'django', 'spring', 'springboot',
                'asp.net', 'laravel', 'rails', 'nestjs', 'koa', 'fastify'
            ],
            'mobile': [
                'react native', 'flutter', 'ios', 'android', 'xamarin', 'ionic', 'cordova'
            ],
            'database': [
                'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
                'dynamodb', 'firebase', 'sql', 'nosql', 'oracle', 'sql server', 'mariadb',
                'neo4j', 'graphql', 'sqlite'
            ],
            'cloud': [
                'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'vercel',
                'netlify', 'cloudflare', 's3', 'ec2', 'lambda', 'kubernetes', 'docker',
                'terraform', 'ansible', 'jenkins'
            ],
            'devops': [
                'ci/cd', 'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes',
                'jenkins', 'travis', 'circleci', 'terraform', 'ansible', 'chef', 'puppet',
                'monitoring', 'prometheus', 'grafana', 'elk'
            ],
            'data_science': [
                'machine learning', 'deep learning', 'data science', 'ai', 'artificial intelligence',
                'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'opencv',
                'nlp', 'computer vision', 'data analysis', 'statistics', 'matplotlib', 'seaborn',
                'jupyter', 'spark', 'hadoop', 'tableau', 'power bi'
            ],
            'testing': [
                'jest', 'mocha', 'chai', 'cypress', 'selenium', 'pytest', 'junit', 'testng',
                'unit testing', 'integration testing', 'e2e testing', 'tdd', 'bdd'
            ],
            'methodologies': [
                'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'microservices',
                'rest api', 'restful', 'soap', 'graphql', 'mvc', 'mvvm', 'solid',
                'design patterns', 'oop', 'functional programming'
            ],
            'soft_skills': [
                'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
                'time management', 'project management', 'mentoring', 'presentation',
                'collaboration', 'analytical', 'creative', 'adaptable'
            ]
        }

        # Create reverse mapping for categorization
        self.skill_to_category = {}
        for category, skills in self.skill_database.items():
            for skill in skills:
                self.skill_to_category[skill.lower()] = category

    def extract_skills(self, text, parsed_data=None):
        """
        Extract skills from resume text
        Returns: List of dictionaries with skill name, category, and confidence
        """
        text_lower = text.lower()
        found_skills = []
        skill_counts = Counter()

        # Extract skills from all categories
        for category, skills in self.skill_database.items():
            for skill in skills:
                # Create regex pattern for whole word matching
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                matches = re.findall(pattern, text_lower)

                if matches:
                    count = len(matches)
                    skill_counts[skill] = count

                    # Calculate confidence based on frequency and context
                    confidence = self._calculate_confidence(
                        skill, count, text_lower, parsed_data)

                    found_skills.append({
                        'name': self._format_skill_name(skill),
                        'category': category,
                        'confidence': confidence,
                        'occurrences': count
                    })

        # Sort by confidence
        found_skills.sort(key=lambda x: x['confidence'], reverse=True)

        # Group by category
        categorized_skills = self._categorize_skills(found_skills)

        return {
            'skills': found_skills,
            'categorized': categorized_skills,
            'total_count': len(found_skills),
            'top_categories': self._get_top_categories(found_skills)
        }

    def _calculate_confidence(self, skill, count, text, parsed_data):
        """
        Calculate confidence score for a skill (0.0 to 1.0)
        """
        base_confidence = 0.5

        # Frequency boost (max 0.2)
        frequency_boost = min(count * 0.05, 0.2)

        # Context boost (max 0.2)
        context_boost = 0

        # Check if in skills section
        if parsed_data and 'sections' in parsed_data:
            if 'skills' in parsed_data['sections']:
                skills_section_start = parsed_data['sections']['skills'].get(
                    'start_line', 0)
                # Simple check if skill appears in skills section
                if 'technical' in text or 'skills' in text:
                    context_boost += 0.1

        # Check if in experience descriptions (stronger indicator)
        if parsed_data and 'experience' in parsed_data:
            for exp in parsed_data['experience']:
                if skill in exp.get('description', '').lower():
                    context_boost += 0.1
                    break

        # Check if in projects
        if parsed_data and 'projects' in parsed_data:
            for project in parsed_data['projects']:
                if skill in project.get('description', '').lower():
                    context_boost += 0.05
                    break

        # Years of experience boost (if mentioned)
        years_pattern = fr'(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience\s+)?(?:with\s+|in\s+)?{re.escape(skill)}'
        years_match = re.search(years_pattern, text, re.IGNORECASE)

        if years_match:
            years = int(years_match.group(1))
            context_boost += min(years * 0.03, 0.1)  # Max 0.1 boost

        # Calculate final confidence
        confidence = base_confidence + \
            frequency_boost + min(context_boost, 0.2)

        # Cap at 0.98 (never 100% certain from text analysis)
        return min(confidence, 0.98)

    def _format_skill_name(self, skill):
        """Format skill name for display"""
        # Handle special cases
        special_formats = {
            'nodejs': 'Node.js',
            'nextjs': 'Next.js',
            'nestjs': 'NestJS',
            'aws': 'AWS',
            'gcp': 'GCP',
            'ci/cd': 'CI/CD',
            'restful': 'RESTful',
            'graphql': 'GraphQL',
            'postgresql': 'PostgreSQL',
            'mongodb': 'MongoDB',
            'mysql': 'MySQL',
            'sql': 'SQL',
            'nosql': 'NoSQL',
            'html': 'HTML',
            'css': 'CSS',
            'javascript': 'JavaScript',
            'typescript': 'TypeScript',
            'api': 'API',
            'oop': 'OOP',
            'mvc': 'MVC',
            'mvvm': 'MVVM',
            'tdd': 'TDD',
            'bdd': 'BDD',
            'nlp': 'NLP',
            'ai': 'AI',
            'ml': 'ML'
        }

        if skill.lower() in special_formats:
            return special_formats[skill.lower()]

        # Title case for others
        return skill.title()

    def _categorize_skills(self, skills):
        """Group skills by category"""
        categorized = {}

        for skill in skills:
            category = skill['category']
            if category not in categorized:
                categorized[category] = []
            categorized[category].append(skill)

        return categorized

    def _get_top_categories(self, skills, top_n=5):
        """Get top skill categories by count"""
        category_counts = Counter()

        for skill in skills:
            category_counts[skill['category']] += 1

        return [
            {'category': cat, 'count': count}
            for cat, count in category_counts.most_common(top_n)
        ]

    def extract_years_of_experience(self, text):
        """Extract total years of experience"""
        # Pattern to match "X years of experience"
        patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience[:\s]+(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s+in\s+(?:the\s+)?industry'
        ]

        years = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            years.extend([int(m) for m in matches])

        if years:
            return max(years)  # Return highest mentioned

        # Try to estimate from experience entries
        return None

    def extract_education_level(self, text):
        """Determine highest education level"""
        education_levels = {
            'phd': ['ph.d', 'phd', 'doctorate', 'doctoral'],
            'masters': ['master', 'm.s.', 'm.a.', 'mba', 'm.tech', 'msc'],
            'bachelors': ['bachelor', 'b.s.', 'b.a.', 'b.tech', 'bsc', 'beng'],
            'associates': ['associate', 'a.a.', 'a.s.'],
            'high_school': ['high school', 'secondary', 'diploma']
        }

        text_lower = text.lower()

        for level, keywords in education_levels.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return level

        return 'not_specified'
