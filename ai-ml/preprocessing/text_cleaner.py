"""
Text Cleaning Module for AI Hiring System
Comprehensive text preprocessing utilities for resume and job description processing
"""

import re
import string
import unicodedata
from typing import List, Optional, Union
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
import contractions

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')


class TextCleaner:
    """
    A comprehensive text cleaning utility for preprocessing text data.
    Handles resumes, job descriptions, and other text inputs.
    """

    def __init__(self, language: str = 'english'):
        """
        Initialize TextCleaner with specified language.

        Args:
            language (str): Language for stopwords and processing (default: 'english')
        """
        self.language = language
        self.stemmer = PorterStemmer()
        self.lemmatizer = WordNetLemmatizer()

        try:
            self.stop_words = set(stopwords.words(language))
        except:
            self.stop_words = set()

    def remove_html_tags(self, text: str) -> str:
        """Remove HTML tags from text."""
        html_pattern = re.compile(r'<[^>]+>')
        return html_pattern.sub('', text)

    def remove_urls(self, text: str) -> str:
        """Remove URLs from text."""
        url_pattern = re.compile(
            r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
        return url_pattern.sub('', text)

    def remove_emails(self, text: str) -> str:
        """Remove email addresses from text."""
        email_pattern = re.compile(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        return email_pattern.sub('', text)

    def remove_phone_numbers(self, text: str) -> str:
        """Remove phone numbers from text."""
        phone_pattern = re.compile(
            r'(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}')
        return phone_pattern.sub('', text)

    def expand_contractions(self, text: str) -> str:
        """Expand contractions in text (e.g., don't -> do not)."""
        return contractions.fix(text)

    def normalize_unicode(self, text: str) -> str:
        """Normalize unicode characters to ASCII equivalents."""
        return unicodedata.normalize('NFKD', text)

    def remove_extra_whitespace(self, text: str) -> str:
        """Remove extra whitespace and normalize spacing."""
        return re.sub(r'\s+', ' ', text).strip()

    def remove_punctuation(self, text: str, keep_chars: str = '') -> str:
        """
        Remove punctuation from text.

        Args:
            text (str): Input text
            keep_chars (str): Punctuation characters to keep (e.g., '.-')

        Returns:
            str: Text with punctuation removed
        """
        translator = str.maketrans(
            '', '', string.punctuation.replace(keep_chars, ''))
        return text.translate(translator)

    def remove_numbers(self, text: str) -> str:
        """Remove all numbers from text."""
        return re.sub(r'\d+', '', text)

    def remove_special_characters(self, text: str, keep_chars: str = '') -> str:
        """
        Remove special characters except specified ones.

        Args:
            text (str): Input text
            keep_chars (str): Characters to keep

        Returns:
            str: Text with special characters removed
        """
        pattern = rf'[^a-zA-Z0-9\s{re.escape(keep_chars)}]'
        return re.sub(pattern, '', text)

    def to_lowercase(self, text: str) -> str:
        """Convert text to lowercase."""
        return text.lower()

    def remove_stopwords(self, text: str) -> str:
        """Remove stopwords from text."""
        words = word_tokenize(text)
        filtered_words = [
            word for word in words if word.lower() not in self.stop_words]
        return ' '.join(filtered_words)

    def stem_text(self, text: str) -> str:
        """
        Apply stemming to text (reduces words to root form).

        Example: running -> run, studies -> studi
        """
        words = word_tokenize(text)
        stemmed_words = [self.stemmer.stem(word) for word in words]
        return ' '.join(stemmed_words)

    def lemmatize_text(self, text: str) -> str:
        """
        Apply lemmatization to text (converts words to dictionary form).

        Example: running -> run, better -> good
        """
        words = word_tokenize(text)
        lemmatized_words = [self.lemmatizer.lemmatize(word) for word in words]
        return ' '.join(lemmatized_words)

    def clean_text(self,
                   text: str,
                   remove_html: bool = True,
                   remove_urls: bool = True,
                   remove_emails: bool = True,
                   remove_phone: bool = True,
                   expand_contractions: bool = True,
                   normalize_unicode: bool = True,
                   to_lowercase: bool = True,
                   remove_punctuation: bool = True,
                   remove_numbers: bool = False,
                   remove_extra_whitespace: bool = True,
                   remove_stopwords: bool = False,
                   apply_stemming: bool = False,
                   apply_lemmatization: bool = False) -> str:
        """
        Apply comprehensive text cleaning pipeline.

        Args:
            text (str): Input text to clean
            remove_html (bool): Remove HTML tags
            remove_urls (bool): Remove URLs
            remove_emails (bool): Remove email addresses
            remove_phone (bool): Remove phone numbers
            expand_contractions (bool): Expand contractions
            normalize_unicode (bool): Normalize unicode characters
            to_lowercase (bool): Convert to lowercase
            remove_punctuation (bool): Remove punctuation
            remove_numbers (bool): Remove numbers
            remove_extra_whitespace (bool): Normalize whitespace
            remove_stopwords (bool): Remove stopwords
            apply_stemming (bool): Apply stemming
            apply_lemmatization (bool): Apply lemmatization

        Returns:
            str: Cleaned text
        """
        if not isinstance(text, str):
            return ""

        cleaned_text = text

        if remove_html:
            cleaned_text = self.remove_html_tags(cleaned_text)

        if remove_urls:
            cleaned_text = self.remove_urls(cleaned_text)

        if remove_emails:
            cleaned_text = self.remove_emails(cleaned_text)

        if remove_phone:
            cleaned_text = self.remove_phone_numbers(cleaned_text)

        if expand_contractions:
            cleaned_text = self.expand_contractions(cleaned_text)

        if normalize_unicode:
            cleaned_text = self.normalize_unicode(cleaned_text)

        if to_lowercase:
            cleaned_text = self.to_lowercase(cleaned_text)

        if remove_punctuation:
            cleaned_text = self.remove_punctuation(cleaned_text)

        if remove_numbers:
            cleaned_text = self.remove_numbers(cleaned_text)

        if remove_extra_whitespace:
            cleaned_text = self.remove_extra_whitespace(cleaned_text)

        if remove_stopwords:
            cleaned_text = self.remove_stopwords(cleaned_text)

        if apply_stemming:
            cleaned_text = self.stem_text(cleaned_text)

        if apply_lemmatization:
            cleaned_text = self.lemmatize_text(cleaned_text)

        return cleaned_text

    def batch_clean(self, texts: List[str], **kwargs) -> List[str]:
        """
        Clean a batch of texts with the same parameters.

        Args:
            texts (List[str]): List of texts to clean
            **kwargs: Cleaning parameters to pass to clean_text()

        Returns:
            List[str]: List of cleaned texts
        """
        return [self.clean_text(text, **kwargs) for text in texts]

    def clean_resume(self, text: str) -> str:
        """
        Specialized cleaning for resume text.
        Preserves numbers (years of experience, dates) but removes personal info.
        """
        return self.clean_text(
            text,
            remove_html=True,
            remove_urls=True,
            remove_emails=True,
            remove_phone=True,
            expand_contractions=True,
            normalize_unicode=True,
            to_lowercase=True,
            remove_punctuation=True,
            remove_numbers=False,  # Keep numbers for dates and experience
            remove_extra_whitespace=True,
            remove_stopwords=False,
            apply_stemming=False,
            apply_lemmatization=False
        )

    def clean_job_description(self, text: str) -> str:
        """
        Specialized cleaning for job descriptions.
        Preserves key information while normalizing text.
        """
        return self.clean_text(
            text,
            remove_html=True,
            remove_urls=False,  # Keep company URLs
            remove_emails=False,  # Keep contact emails
            remove_phone=False,  # Keep contact numbers
            expand_contractions=True,
            normalize_unicode=True,
            to_lowercase=True,
            remove_punctuation=True,
            remove_numbers=False,
            remove_extra_whitespace=True,
            remove_stopwords=False,
            apply_stemming=False,
            apply_lemmatization=False
        )


# Example usage
if __name__ == '__main__':
    # Initialize cleaner
    cleaner = TextCleaner()

    # Example resume text
    sample_resume = """
    <html>
    John Doe
    Email: john.doe@email.com | Phone: +1-555-0123
    
    EXPERIENCE:
    Senior Developer at TechCorp (2020-2023)
    - Worked on React.js, Node.js, and MongoDB
    - I've led a team of 5 developers
    - Check out my portfolio: https://johndoe.dev
    
    EDUCATION:
    Bachelor's in Computer Science - MIT (2016-2020)
    </html>
    """

    print("Original Text:")
    print(sample_resume)
    print("\n" + "="*60 + "\n")

    print("Cleaned Resume:")
    cleaned = cleaner.clean_resume(sample_resume)
    print(cleaned)
    print("\n" + "="*60 + "\n")

    # Example job description
    sample_job = """
    <h1>Senior Full Stack Developer</h1>
    <p>We're looking for an experienced developer with 5+ years experience.</p>
    <p>Contact us at: jobs@techcorp.com or visit https://techcorp.com/careers</p>
    
    Requirements:
    - React.js & Node.js expertise
    - Experience with AWS/Docker
    - Strong problem-solving skills
    """

    print("Original Job Description:")
    print(sample_job)
    print("\n" + "="*60 + "\n")

    print("Cleaned Job Description:")
    cleaned_job = cleaner.clean_job_description(sample_job)
    print(cleaned_job)
