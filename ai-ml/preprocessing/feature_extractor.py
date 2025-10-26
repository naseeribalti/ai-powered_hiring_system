"""
Feature Extraction Module for AI Hiring System
Comprehensive feature engineering utilities for ML preprocessing
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Union, Optional, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.feature_selection import SelectKBest, chi2, f_classif
from sklearn.preprocessing import PolynomialFeatures
import re
from collections import Counter


class FeatureExtractor:
    """
    A comprehensive feature extraction utility for ML preprocessing.
    Handles text, numerical, and categorical features.
    """

    def __init__(self):
        """Initialize FeatureExtractor with default parameters."""
        self.scalers = {}
        self.encoders = {}
        self.vectorizers = {}
        self.feature_selectors = {}
        self.dimensionality_reducers = {}

    # Text Feature Extraction Methods
    def extract_tfidf_features(self,
                               texts: List[str],
                               max_features: int = 10000,
                               ngram_range: Tuple[int, int] = (1, 2),
                               min_df: int = 2,
                               max_df: float = 0.95,
                               fit_transform: bool = True) -> np.ndarray:
        """
        Extract TF-IDF features from text data.

        Args:
            texts: List of text documents
            max_features: Maximum number of features
            ngram_range: Range of n-grams to extract (1,1) = unigrams, (1,2) = unigrams+bigrams
            min_df: Minimum document frequency (ignore terms appearing in less than min_df documents)
            max_df: Maximum document frequency (ignore terms appearing in more than max_df% of documents)
            fit_transform: Whether to fit and transform or just transform

        Returns:
            TF-IDF feature matrix (n_samples, n_features)
        """
        if 'tfidf' not in self.vectorizers or fit_transform:
            self.vectorizers['tfidf'] = TfidfVectorizer(
                max_features=max_features,
                ngram_range=ngram_range,
                min_df=min_df,
                max_df=max_df,
                stop_words='english'
            )
            return self.vectorizers['tfidf'].fit_transform(texts).toarray()
        else:
            return self.vectorizers['tfidf'].transform(texts).toarray()

    def extract_count_features(self,
                               texts: List[str],
                               max_features: int = 10000,
                               ngram_range: Tuple[int, int] = (1, 2),
                               min_df: int = 2,
                               fit_transform: bool = True) -> np.ndarray:
        """
        Extract count-based features from text data.

        Args:
            texts: List of text documents
            max_features: Maximum number of features
            ngram_range: Range of n-grams to extract
            min_df: Minimum document frequency
            fit_transform: Whether to fit and transform or just transform

        Returns:
            Count feature matrix (n_samples, n_features)
        """
        if 'count' not in self.vectorizers or fit_transform:
            self.vectorizers['count'] = CountVectorizer(
                max_features=max_features,
                ngram_range=ngram_range,
                min_df=min_df,
                stop_words='english'
            )
            return self.vectorizers['count'].fit_transform(texts).toarray()
        else:
            return self.vectorizers['count'].transform(texts).toarray()

    def extract_text_statistics(self, texts: List[str]) -> pd.DataFrame:
        """
        Extract statistical features from text data.

        Args:
            texts: List of text documents

        Returns:
            DataFrame with text statistics (char_count, word_count, etc.)
        """
        features = []

        for text in texts:
            if not isinstance(text, str):
                text = str(text)

            # Basic statistics
            char_count = len(text)
            word_count = len(text.split())
            sentence_count = len(re.split(r'[.!?]+', text))

            # Advanced statistics
            avg_word_length = np.mean(
                [len(word) for word in text.split()]) if word_count > 0 else 0
            punctuation_count = len(re.findall(r'[^\w\s]', text))
            uppercase_count = sum(1 for c in text if c.isupper())
            digit_count = sum(1 for c in text if c.isdigit())

            # Readability features
            avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0
            punctuation_ratio = punctuation_count / char_count if char_count > 0 else 0

            features.append({
                'char_count': char_count,
                'word_count': word_count,
                'sentence_count': sentence_count,
                'avg_word_length': avg_word_length,
                'punctuation_count': punctuation_count,
                'uppercase_count': uppercase_count,
                'digit_count': digit_count,
                'avg_sentence_length': avg_sentence_length,
                'punctuation_ratio': punctuation_ratio
            })

        return pd.DataFrame(features)

    # Numerical Feature Processing Methods
    def scale_features(self,
                       data: np.ndarray,
                       method: str = 'standard',
                       fit_transform: bool = True) -> np.ndarray:
        """
        Scale numerical features.

        Args:
            data: Input data array (n_samples, n_features)
            method: Scaling method ('standard' = zero mean, unit variance; 'minmax' = 0-1 range)
            fit_transform: Whether to fit and transform or just transform

        Returns:
            Scaled feature array
        """
        if method not in self.scalers or fit_transform:
            if method == 'standard':
                self.scalers[method] = StandardScaler()
            elif method == 'minmax':
                self.scalers[method] = MinMaxScaler()
            else:
                raise ValueError("Method must be 'standard' or 'minmax'")

            return self.scalers[method].fit_transform(data)
        else:
            return self.scalers[method].transform(data)

    def encode_categorical_features(self,
                                    data: Union[List, np.ndarray],
                                    method: str = 'label',
                                    fit_transform: bool = True) -> np.ndarray:
        """
        Encode categorical features.

        Args:
            data: Input categorical data
            method: Encoding method ('label' = integer encoding; 'onehot' = binary columns)
            fit_transform: Whether to fit and transform or just transform

        Returns:
            Encoded feature array
        """
        if method == 'label':
            if 'label' not in self.encoders or fit_transform:
                self.encoders['label'] = LabelEncoder()
                return self.encoders['label'].fit_transform(data)
            else:
                return self.encoders['label'].transform(data)

        elif method == 'onehot':
            # Convert to DataFrame for easier one-hot encoding
            df = pd.DataFrame({'feature': data})
            return pd.get_dummies(df, columns=['feature']).values

        else:
            raise ValueError("Method must be 'label' or 'onehot'")

    # Feature Selection Methods
    def select_features(self,
                        X: np.ndarray,
                        y: np.ndarray,
                        method: str = 'chi2',
                        k: int = 100,
                        fit_transform: bool = True) -> np.ndarray:
        """
        Select top k features based on statistical tests.

        Args:
            X: Feature matrix (n_samples, n_features)
            y: Target vector (n_samples,)
            method: Selection method ('chi2' = chi-squared test; 'f_classif' = ANOVA F-test)
            k: Number of features to select
            fit_transform: Whether to fit and transform or just transform

        Returns:
            Selected feature matrix (n_samples, k)
        """
        if method not in self.feature_selectors or fit_transform:
            if method == 'chi2':
                self.feature_selectors[method] = SelectKBest(chi2, k=k)
            elif method == 'f_classif':
                self.feature_selectors[method] = SelectKBest(f_classif, k=k)
            else:
                raise ValueError("Method must be 'chi2' or 'f_classif'")

            return self.feature_selectors[method].fit_transform(X, y)
        else:
            return self.feature_selectors[method].transform(X)

    # Dimensionality Reduction Methods
    def reduce_dimensions(self,
                          X: np.ndarray,
                          method: str = 'pca',
                          n_components: int = 50,
                          fit_transform: bool = True) -> np.ndarray:
        """
        Reduce dimensionality of feature matrix.

        Args:
            X: Feature matrix (n_samples, n_features)
            method: Reduction method ('pca' = Principal Component Analysis; 'svd' = Truncated SVD)
            n_components: Number of components to keep
            fit_transform: Whether to fit and transform or just transform

        Returns:
            Reduced feature matrix (n_samples, n_components)
        """
        if method not in self.dimensionality_reducers or fit_transform:
            if method == 'pca':
                self.dimensionality_reducers[method] = PCA(
                    n_components=n_components)
            elif method == 'svd':
                self.dimensionality_reducers[method] = TruncatedSVD(
                    n_components=n_components)
            else:
                raise ValueError("Method must be 'pca' or 'svd'")

            return self.dimensionality_reducers[method].fit_transform(X)
        else:
            return self.dimensionality_reducers[method].transform(X)

    # Combined Feature Engineering Methods
    def create_polynomial_features(self, X: np.ndarray, degree: int = 2) -> np.ndarray:
        """
        Create polynomial features (x1^2, x2^2, x1*x2, etc.).

        Args:
            X: Input feature matrix (n_samples, n_features)
            degree: Polynomial degree (2 = quadratic, 3 = cubic, etc.)

        Returns:
            Polynomial feature matrix (n_samples, n_poly_features)
        """
        poly = PolynomialFeatures(degree=degree, include_bias=False)
        return poly.fit_transform(X)

    def create_interaction_features(self, X: np.ndarray) -> np.ndarray:
        """
        Create interaction features between all pairs of features (x1*x2, x1*x3, etc.).

        Args:
            X: Input feature matrix (n_samples, n_features)

        Returns:
            Feature matrix with interactions (n_samples, n_features + n_interactions)
        """
        poly = PolynomialFeatures(
            degree=2, interaction_only=True, include_bias=False)
        return poly.fit_transform(X)

    def extract_datetime_features(self, dates: pd.Series) -> pd.DataFrame:
        """
        Extract features from datetime data.

        Args:
            dates: Series of datetime objects or datetime strings

        Returns:
            DataFrame with datetime features (year, month, day, dayofweek, etc.)
        """
        dates = pd.to_datetime(dates)

        features = pd.DataFrame({
            'year': dates.dt.year,
            'month': dates.dt.month,
            'day': dates.dt.day,
            'dayofweek': dates.dt.dayofweek,
            'dayofyear': dates.dt.dayofyear,
            'quarter': dates.dt.quarter,
            'is_weekend': (dates.dt.dayofweek >= 5).astype(int),
            'hour': dates.dt.hour,
            'minute': dates.dt.minute
        })

        return features

    # Utility Methods
    def get_feature_names(self, vectorizer_type: str = 'tfidf') -> List[str]:
        """
        Get feature names from fitted vectorizers.

        Args:
            vectorizer_type: Type of vectorizer ('tfidf' or 'count')

        Returns:
            List of feature names
        """
        if vectorizer_type in self.vectorizers:
            return self.vectorizers[vectorizer_type].get_feature_names_out().tolist()
        else:
            return []

    def get_feature_importance_scores(self, method: str = 'chi2') -> np.ndarray:
        """
        Get feature importance scores from feature selectors.

        Args:
            method: Feature selection method ('chi2' or 'f_classif')

        Returns:
            Array of feature importance scores
        """
        if method in self.feature_selectors:
            return self.feature_selectors[method].scores_
        else:
            return np.array([])

    def extract_resume_features(self, resume_text: str) -> Dict[str, any]:
        """
        Specialized feature extraction for resumes.

        Args:
            resume_text: Clean resume text

        Returns:
            Dictionary of resume features
        """
        # Text statistics
        stats = self.extract_text_statistics([resume_text]).iloc[0].to_dict()

        # Extract years of experience (simple heuristic)
        experience_matches = re.findall(
            r'(\d+)\+?\s*(?:years?|yrs?)', resume_text.lower())
        years_experience = max(
            [int(y) for y in experience_matches]) if experience_matches else 0

        # Count technical keywords
        tech_keywords = [
            'python', 'java', 'javascript', 'react', 'node', 'sql', 'aws',
            'docker', 'kubernetes', 'machine learning', 'ai', 'data science'
        ]
        tech_skills_count = sum(
            1 for keyword in tech_keywords if keyword in resume_text.lower())

        return {
            **stats,
            'years_experience': years_experience,
            'tech_skills_count': tech_skills_count
        }


# Example usage and testing
if __name__ == '__main__':
    print("="*60)
    print("FEATURE EXTRACTOR - DEMONSTRATION")
    print("="*60)

    # Initialize extractor
    extractor = FeatureExtractor()

    # Example 1: Text Statistics
    print("\n1. TEXT STATISTICS")
    print("-"*60)
    sample_texts = [
        "I am a senior developer with 5 years of experience in Python and JavaScript.",
        "Junior data scientist looking for opportunities in machine learning.",
        "Experienced DevOps engineer. Skilled in Docker, Kubernetes, and AWS."
    ]

    text_stats = extractor.extract_text_statistics(sample_texts)
    print(text_stats)

    # Example 2: TF-IDF Features
    print("\n2. TF-IDF FEATURES")
    print("-"*60)
    tfidf_features = extractor.extract_tfidf_features(
        sample_texts,
        max_features=20,
        ngram_range=(1, 1),
        min_df=1  # Allow terms that appear in at least 1 document
    )
    print(f"Shape: {tfidf_features.shape}")
    print(f"Top features: {extractor.get_feature_names('tfidf')[:10]}")

    # Example 3: Numerical Scaling
    print("\n3. NUMERICAL SCALING")
    print("-"*60)
    numerical_data = np.array([[1, 100], [2, 200], [3, 300], [4, 400]])
    scaled_data = extractor.scale_features(numerical_data, method='standard')
    print("Original data:")
    print(numerical_data)
    print("\nScaled data (standard):")
    print(scaled_data)

    # Example 4: Categorical Encoding
    print("\n4. CATEGORICAL ENCODING")
    print("-"*60)
    categories = ['entry', 'mid', 'senior', 'entry', 'mid']
    encoded = extractor.encode_categorical_features(categories, method='label')
    print(f"Original: {categories}")
    print(f"Encoded: {encoded}")

    # Example 5: Resume Features
    print("\n5. RESUME FEATURE EXTRACTION")
    print("-"*60)
    sample_resume = """
    Senior Software Engineer with 8 years of experience.
    Proficient in Python, JavaScript, React, Node.js, and AWS.
    Led teams of 5 developers. Strong problem-solving skills.
    """
    resume_features = extractor.extract_resume_features(sample_resume)
    print("Resume features:")
    for key, value in resume_features.items():
        print(f"  {key}: {value}")

    print("\n" + "="*60)
    print("✅ FEATURE EXTRACTOR READY FOR PRODUCTION!")
    print("="*60)
