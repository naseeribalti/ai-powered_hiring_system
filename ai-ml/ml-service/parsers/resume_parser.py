import pdfplumber
import docx
import re
from datetime import datetime
import requests
from io import BytesIO


class ResumeParser:
    """
    Parses resumes from PDF or DOCX files and extracts structured information
    """

    def __init__(self):
        self.email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        self.phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        self.url_pattern = r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)'

    def parse_from_url(self, file_url):
        """Download and parse resume from URL"""
        try:
            response = requests.get(file_url, timeout=30)
            response.raise_for_status()

            file_bytes = BytesIO(response.content)

            # Determine file type from URL
            if file_url.lower().endswith('.pdf'):
                return self.parse_pdf(file_bytes)
            elif file_url.lower().endswith('.docx'):
                return self.parse_docx(file_bytes)
            else:
                # Try PDF first
                try:
                    return self.parse_pdf(file_bytes)
                except:
                    file_bytes.seek(0)
                    return self.parse_docx(file_bytes)

        except Exception as e:
            print(f"Error downloading resume: {str(e)}")
            return self._get_empty_result()

    def parse_pdf(self, file_path_or_bytes):
        """Extract text from PDF file"""
        try:
            with pdfplumber.open(file_path_or_bytes) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() + "\n"

                return self._parse_text(text)
        except Exception as e:
            print(f"Error parsing PDF: {str(e)}")
            return self._get_empty_result()

    def parse_docx(self, file_path_or_bytes):
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path_or_bytes)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])

            return self._parse_text(text)
        except Exception as e:
            print(f"Error parsing DOCX: {str(e)}")
            return self._get_empty_result()

    def _parse_text(self, text):
        """Parse extracted text and structure the information"""
        result = {
            'raw_text': text,
            'contact': self._extract_contact(text),
            'sections': self._identify_sections(text),
            'experience': self._extract_experience(text),
            'education': self._extract_education(text),
            'certifications': self._extract_certifications(text),
            'projects': self._extract_projects(text),
        }

        return result

    def _extract_contact(self, text):
        """Extract contact information"""
        lines = text.split('\n')[:10]  # Check first 10 lines

        contact = {
            'email': None,
            'phone': None,
            'linkedin': None,
            'github': None,
            'website': None
        }

        # Extract email
        email_match = re.search(self.email_pattern, text, re.IGNORECASE)
        if email_match:
            contact['email'] = email_match.group()

        # Extract phone
        phone_match = re.search(self.phone_pattern, text)
        if phone_match:
            contact['phone'] = phone_match.group()

        # Extract URLs
        urls = re.findall(self.url_pattern, text, re.IGNORECASE)
        for url in urls:
            url_lower = url.lower()
            if 'linkedin.com' in url_lower:
                contact['linkedin'] = url
            elif 'github.com' in url_lower:
                contact['github'] = url
            elif not contact['website']:
                contact['website'] = url

        return contact

    def _identify_sections(self, text):
        """Identify major sections in resume"""
        sections = {}

        section_keywords = {
            'summary': ['summary', 'objective', 'profile', 'about'],
            'experience': ['experience', 'employment', 'work history', 'professional experience'],
            'education': ['education', 'academic', 'qualification'],
            'skills': ['skills', 'technical skills', 'competencies', 'expertise'],
            'certifications': ['certifications', 'certificates', 'licenses'],
            'projects': ['projects', 'portfolio'],
            'awards': ['awards', 'achievements', 'honors'],
            'languages': ['languages', 'language proficiency']
        }

        lines = text.split('\n')
        current_section = None

        for i, line in enumerate(lines):
            line_lower = line.lower().strip()

            for section_name, keywords in section_keywords.items():
                for keyword in keywords:
                    if keyword in line_lower and len(line.strip()) < 50:
                        sections[section_name] = {
                            'start_line': i, 'header': line.strip()}
                        current_section = section_name
                        break

        return sections

    def _extract_experience(self, text):
        """Extract work experience entries"""
        experiences = []

        # Pattern to match date ranges
        date_pattern = r'(\d{4}|\w+\s+\d{4})\s*[-–—]\s*(\d{4}|\w+\s+\d{4}|Present|Current)'

        lines = text.split('\n')

        # Common job title patterns
        job_title_indicators = [
            'engineer', 'developer', 'manager', 'analyst', 'specialist',
            'consultant', 'director', 'lead', 'senior', 'junior', 'intern',
            'designer', 'architect', 'administrator', 'coordinator'
        ]

        current_exp = {}
        in_experience_section = False

        for i, line in enumerate(lines):
            line_lower = line.lower().strip()

            # Check if we're in experience section
            if any(keyword in line_lower for keyword in ['experience', 'employment', 'work history']):
                in_experience_section = True
                continue

            if any(keyword in line_lower for keyword in ['education', 'skills', 'certifications']):
                in_experience_section = False

            if not in_experience_section:
                continue

            # Check for date ranges
            date_match = re.search(date_pattern, line, re.IGNORECASE)
            if date_match and line.strip():
                if current_exp:
                    experiences.append(current_exp)

                current_exp = {
                    'title': '',
                    'company': '',
                    'start_date': date_match.group(1),
                    'end_date': date_match.group(2),
                    'current': date_match.group(2).lower() in ['present', 'current'],
                    'description': '',
                    'location': ''
                }

                # Try to extract title and company from same line
                parts = line.split('-')
                if len(parts) >= 2:
                    current_exp['title'] = parts[0].replace(
                        date_match.group(0), '').strip()
                    if len(parts) > 2:
                        current_exp['company'] = parts[1].strip()

            # Extract job title
            elif not current_exp.get('title') and any(indicator in line_lower for indicator in job_title_indicators):
                current_exp['title'] = line.strip()

            # Extract company
            elif current_exp.get('title') and not current_exp.get('company') and line.strip():
                current_exp['company'] = line.strip()

            # Extract description
            elif current_exp.get('company') and line.strip() and len(line.strip()) > 20:
                if current_exp['description']:
                    current_exp['description'] += ' ' + line.strip()
                else:
                    current_exp['description'] = line.strip()

        if current_exp:
            experiences.append(current_exp)

        return experiences

    def _extract_education(self, text):
        """Extract education entries"""
        education = []

        degree_keywords = [
            'bachelor', 'master', 'phd', 'doctorate', 'mba', 'b.s.', 'm.s.',
            'b.a.', 'm.a.', 'b.tech', 'm.tech', 'diploma', 'associate'
        ]

        lines = text.split('\n')
        in_education_section = False
        current_edu = {}

        for i, line in enumerate(lines):
            line_lower = line.lower().strip()

            # Check if we're in education section
            if any(keyword in line_lower for keyword in ['education', 'academic', 'qualification']):
                in_education_section = True
                continue

            if any(keyword in line_lower for keyword in ['experience', 'skills', 'certifications', 'projects']):
                in_education_section = False

            if not in_education_section:
                continue

            # Check for degree
            if any(keyword in line_lower for keyword in degree_keywords):
                if current_edu:
                    education.append(current_edu)

                current_edu = {
                    'degree': line.strip(),
                    'institution': '',
                    'major': '',
                    'start_date': None,
                    'end_date': None,
                    'gpa': None
                }

            # Extract institution
            elif current_edu.get('degree') and not current_edu.get('institution') and line.strip():
                # Check if line contains university/college/institute
                if any(word in line_lower for word in ['university', 'college', 'institute', 'school']):
                    current_edu['institution'] = line.strip()

            # Extract GPA
            gpa_match = re.search(
                r'gpa[:\s]*(\d+\.?\d*)\s*/\s*(\d+\.?\d*)', line_lower)
            if gpa_match:
                current_edu['gpa'] = f"{gpa_match.group(1)}/{gpa_match.group(2)}"

        if current_edu:
            education.append(current_edu)

        return education

    def _extract_certifications(self, text):
        """Extract certifications"""
        certifications = []

        cert_keywords = [
            'certified', 'certification', 'certificate', 'license', 'credential'
        ]

        lines = text.split('\n')
        in_cert_section = False

        for line in lines:
            line_lower = line.lower().strip()

            # Check if we're in certifications section
            if any(keyword in line_lower for keyword in ['certification', 'certificates', 'licenses']):
                in_cert_section = True
                continue

            if any(keyword in line_lower for keyword in ['experience', 'education', 'skills', 'projects']):
                in_cert_section = False

            if in_cert_section and line.strip() and len(line.strip()) > 5:
                cert = {
                    'name': line.strip(),
                    'issuer': '',
                    'date': None
                }

                # Try to extract date
                date_match = re.search(r'\d{4}', line)
                if date_match:
                    cert['date'] = date_match.group()
                    cert['name'] = line.replace(date_match.group(), '').strip()

                certifications.append(cert)

        return certifications

    def _extract_projects(self, text):
        """Extract project entries"""
        projects = []

        lines = text.split('\n')
        in_projects_section = False
        current_project = {}

        for line in lines:
            line_lower = line.lower().strip()

            # Check if we're in projects section
            if 'project' in line_lower and len(line.strip()) < 50:
                in_projects_section = True
                continue

            if any(keyword in line_lower for keyword in ['experience', 'education', 'skills', 'certification']):
                in_projects_section = False

            if in_projects_section and line.strip():
                # New project (starts with bullet or capital letter)
                if line.strip().startswith(('•', '-', '*')) or (line.strip()[0].isupper() and not current_project):
                    if current_project:
                        projects.append(current_project)

                    current_project = {
                        'name': line.strip().lstrip('•-* '),
                        'description': '',
                        'technologies': []
                    }
                # Project description
                elif current_project:
                    if current_project['description']:
                        current_project['description'] += ' ' + line.strip()
                    else:
                        current_project['description'] = line.strip()

        if current_project:
            projects.append(current_project)

        return projects

    def _get_empty_result(self):
        """Return empty result structure"""
        return {
            'raw_text': '',
            'contact': {
                'email': None,
                'phone': None,
                'linkedin': None,
                'github': None,
                'website': None
            },
            'sections': {},
            'experience': [],
            'education': [],
            'certifications': [],
            'projects': []
        }
