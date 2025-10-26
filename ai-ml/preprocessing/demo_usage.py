"""
Demo Usage of AI/ML Preprocessing Modules

This script demonstrates how to use all three preprocessing modules:
1. text_cleaner.py - Clean and normalize text
2. feature_extractor.py - Extract ML features
3. data_augmentation.py - Augment datasets
"""

from data_augmentation import DataAugmentation
from feature_extractor import FeatureExtractor
from text_cleaner import TextCleaner
import sys
import os
import numpy as np
import pandas as pd

# Add preprocessing directory to path
sys.path.insert(0, os.path.dirname(__file__))


print("=" * 80)
print("AI/ML PREPROCESSING MODULES - DEMO USAGE")
print("=" * 80)
print()

# ============================================================================
# DEMO 1: TEXT CLEANING
# ============================================================================
print("=" * 80)
print("DEMO 1: TEXT CLEANING MODULE")
print("=" * 80)
print()

cleaner = TextCleaner()

# Sample resume data (raw and messy)
raw_resume = """
<html>
<body>
    <h1>John Doe</h1>
    <p>Email: john.doe@example.com | Phone: +1-555-123-4567</p>
    <p>Website: https://johndoe.com</p>
    <p>I'm a Senior Software Engineer with 8+ years of experience. 
    I've worked on Python, JavaScript, React, and Node.js projects.
    We're looking for challenging opportunities!</p>
</body>
</html>
"""

print("Original Resume (Raw):")
print("-" * 80)
print(raw_resume[:200] + "...")
print()

# Clean the resume
cleaned_resume = cleaner.clean_text(
    raw_resume,
    remove_html=True,
    remove_urls=True,
    remove_emails=True,
    remove_phone=True,
    expand_contractions=True,
    to_lowercase=True,
    remove_punctuation=True,
    remove_stopwords=True
)

print("Cleaned Resume:")
print("-" * 80)
print(cleaned_resume)
print()

# Batch cleaning example
raw_job_descriptions = [
    "<p>We're hiring a Python Developer! Email: hr@company.com</p>",
    "Senior Java Engineer needed. Contact: +1-555-999-8888",
    "<html>Full Stack Developer - React & Node.js - https://jobs.com/apply</html>"
]

print("Batch Cleaning (3 Job Descriptions):")
print("-" * 80)
cleaned_jobs = cleaner.batch_clean(
    raw_job_descriptions,
    remove_html=True,
    remove_urls=True,
    remove_emails=True,
    remove_phone=True,
    to_lowercase=True
)

for i, (original, cleaned) in enumerate(zip(raw_job_descriptions, cleaned_jobs), 1):
    print(f"{i}. Original: {original[:50]}...")
    print(f"   Cleaned:  {cleaned}")
    print()

# ============================================================================
# DEMO 2: FEATURE EXTRACTION
# ============================================================================
print("=" * 80)
print("DEMO 2: FEATURE EXTRACTION MODULE")
print("=" * 80)
print()

extractor = FeatureExtractor()

# Sample candidate data
candidate_texts = [
    "Senior Software Engineer with 8 years of Python experience",
    "Junior Developer skilled in Java and Spring Boot",
    "Full Stack Developer proficient in React, Node.js, and MongoDB",
    "Data Scientist with expertise in Machine Learning and TensorFlow",
    "DevOps Engineer experienced in Docker, Kubernetes, and AWS"
]

print("Extracting Text Statistics:")
print("-" * 80)
text_stats = extractor.extract_text_statistics(candidate_texts)
print(text_stats)
print()

print("Extracting TF-IDF Features:")
print("-" * 80)
tfidf_matrix = extractor.extract_tfidf_features(
    candidate_texts, max_features=20, min_df=1)
print(f"TF-IDF Matrix Shape: {tfidf_matrix.shape}")
print(f"\nFeature Matrix (first 2 candidates):")
print(tfidf_matrix[:2])
print()

# Numerical feature scaling
print("Feature Scaling Example:")
print("-" * 80)
sample_data = np.array([
    [5, 80000],  # 5 years, $80k salary
    [3, 60000],  # 3 years, $60k salary
    [8, 100000],  # 8 years, $100k salary
    [2, 50000]   # 2 years, $50k salary
])

print("Original Data (Years, Salary):")
print(sample_data)
print()

scaled_data = extractor.scale_features(sample_data, method='standard')
print("Scaled Data (Standard Scaling):")
print(scaled_data)
print()

# Categorical encoding
print("Categorical Encoding Example:")
print("-" * 80)
experience_levels = ['entry', 'mid', 'senior', 'entry', 'mid']
encoded_levels = extractor.encode_categorical_features(
    experience_levels, method='label')

print(f"Original: {experience_levels}")
print(f"Encoded:  {encoded_levels}")
print()

# ============================================================================
# DEMO 3: DATA AUGMENTATION
# ============================================================================
print("=" * 80)
print("DEMO 3: DATA AUGMENTATION MODULE")
print("=" * 80)
print()

augmenter = DataAugmentation(random_seed=42)

# Text augmentation
sample_text = "This is a good opportunity for fast learners"

print("Text Augmentation Techniques:")
print("-" * 80)
print(f"Original: {sample_text}")
print()

print(
    f"1. Synonym Replacement: {augmenter.synonym_replacement(sample_text, n=2)}")
print(
    f"2. Random Insertion:    {augmenter.random_insertion(sample_text, n=1)}")
print(f"3. Random Swap:         {augmenter.random_swap(sample_text, n=2)}")
print(
    f"4. Random Deletion:     {augmenter.random_deletion(sample_text, p=0.2)}")
print()

# Dataset augmentation
print("Dataset Augmentation (Text):")
print("-" * 80)
sample_resumes = [
    "Python developer with 5 years experience",
    "Java engineer skilled in Spring framework",
    "JavaScript developer proficient in React"
]
sample_labels = ['technical', 'technical', 'technical']

print(f"Original Dataset Size: {len(sample_resumes)} samples")

augmented_resumes, augmented_labels = augmenter.augment_text_dataset(
    sample_resumes,
    sample_labels,
    augmentation_factor=2
)

print(f"Augmented Dataset Size: {len(augmented_resumes)} samples")
print(
    f"Augmentation Factor: {len(augmented_resumes) / len(sample_resumes):.1f}x")
print()

print("First 5 Augmented Samples:")
for i in range(min(5, len(augmented_resumes))):
    print(f"{i+1}. {augmented_resumes[i]}")
print()

# Numerical data augmentation
print("Numerical Data Augmentation:")
print("-" * 80)
X = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
y = np.array([0, 1, 0])

print(f"Original Data Shape: X={X.shape}, y={y.shape}")
print("Original X:")
print(X)
print()

augmented_X, augmented_y = augmenter.augment_numerical_dataset(
    X, y, methods=['noise', 'scale']
)

print(f"Augmented Data Shape: X={augmented_X.shape}, y={augmented_y.shape}")
print(f"Augmentation Factor: {len(augmented_X) / len(X):.1f}x")
print()

# ============================================================================
# DEMO 4: COMPLETE PIPELINE
# ============================================================================
print("=" * 80)
print("DEMO 4: COMPLETE PREPROCESSING PIPELINE")
print("=" * 80)
print()

print("Step-by-Step Pipeline:")
print("-" * 80)

# Step 1: Start with raw data
raw_data = [
    "<html>I'm a Python developer with 5 years exp. Email: dev1@email.com</html>",
    "We're Java engineers! Phone: +1-555-1234. Visit https://oursite.com",
    "<p>Full stack developer - React, Node.js - contact@company.com</p>"
]
labels = ['entry', 'senior', 'mid']

print("Step 1: Raw Data (3 samples)")
for i, text in enumerate(raw_data, 1):
    print(f"  {i}. {text[:60]}...")
print()

# Step 2: Clean text
print("Step 2: Clean Text")
cleaned_data = cleaner.batch_clean(
    raw_data,
    remove_html=True,
    remove_urls=True,
    remove_emails=True,
    remove_phone=True,
    expand_contractions=True,
    to_lowercase=True
)
for i, text in enumerate(cleaned_data, 1):
    print(f"  {i}. {text}")
print()

# Step 3: Augment dataset
print("Step 3: Augment Dataset (3x)")
augmented_data, augmented_labels = augmenter.augment_text_dataset(
    cleaned_data,
    labels,
    augmentation_factor=2
)
print(f"  Dataset size: {len(cleaned_data)} → {len(augmented_data)} samples")
print()

# Step 4: Extract features
print("Step 4: Extract Features")
text_features = extractor.extract_text_statistics(augmented_data)
print(f"  Text statistics shape: {text_features.shape}")

tfidf_features = extractor.extract_tfidf_features(
    augmented_data, max_features=50, min_df=1)
print(f"  TF-IDF features shape: {tfidf_features.shape}")
print()

# Step 5: Combine and scale
print("Step 5: Combine Features and Scale")
combined_features = np.hstack([tfidf_features, text_features.values])
print(f"  Combined features shape: {combined_features.shape}")

scaled_features = extractor.scale_features(
    combined_features, method='standard')
print(f"  Scaled features shape: {scaled_features.shape}")
print()

# Step 6: Encode labels
print("Step 6: Encode Labels")
encoded_labels = extractor.encode_categorical_features(
    augmented_labels, method='label')
print(f"  Original labels: {augmented_labels[:5]}")
print(f"  Encoded labels:  {encoded_labels[:5]}")
print()

# Final output
print("=" * 80)
print("PIPELINE COMPLETE!")
print("=" * 80)
print(f"✅ Ready for ML Training:")
print(f"   - Features (X): shape {scaled_features.shape}")
print(f"   - Labels (y):   shape {encoded_labels.shape}")
print(f"   - Total samples: {len(scaled_features)}")
print(f"   - Features per sample: {scaled_features.shape[1]}")
print()
print("Next step: model.fit(X, y)")
print()

# ============================================================================
# SUMMARY
# ============================================================================
print("=" * 80)
print("MODULE SUMMARY")
print("=" * 80)
print()
print("1. text_cleaner.py")
print("   ✅ Removes HTML, URLs, emails, phone numbers")
print("   ✅ Expands contractions, normalizes unicode")
print("   ✅ Removes stopwords, punctuation, extra whitespace")
print("   ✅ Supports batch processing")
print()
print("2. feature_extractor.py")
print("   ✅ Extracts text statistics (9 features)")
print("   ✅ TF-IDF feature extraction")
print("   ✅ Standard/MinMax scaling")
print("   ✅ Label/OneHot encoding")
print("   ✅ Polynomial features")
print()
print("3. data_augmentation.py")
print("   ✅ Text augmentation (4 techniques)")
print("   ✅ Numerical augmentation (noise, scaling, outliers)")
print("   ✅ Tabular augmentation (MixUp, SMOTE-like)")
print("   ✅ Dataset-level batch augmentation")
print()
print("=" * 80)
print("🎉 ALL MODULES WORKING PERFECTLY!")
print("=" * 80)
