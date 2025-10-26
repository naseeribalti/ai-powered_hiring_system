"""
Data Augmentation Module for AI Hiring System

This module provides comprehensive data augmentation techniques for:
- Text data (synonym replacement, insertion, swap, deletion, back-translation)
- Numerical data (Gaussian noise, scaling, outliers)
- Tabular data (MixUp, SMOTE-like augmentation)

Author: AI Hiring System Team
Date: October 2025
"""

import numpy as np
import pandas as pd
import random
from typing import List, Dict, Union, Optional, Tuple, Any
import re
from collections import defaultdict
import nltk
from nltk.corpus import wordnet

# Optional image augmentation imports (will be imported only if needed)
try:
    import cv2
    from PIL import Image, ImageEnhance, ImageFilter
    import albumentations as A
    IMAGE_AUGMENTATION_AVAILABLE = True
except ImportError:
    IMAGE_AUGMENTATION_AVAILABLE = False


class DataAugmentation:
    """
    A comprehensive data augmentation utility for various data types.
    Supports text, numerical, and tabular data augmentation.
    """

    def __init__(self, random_seed: int = 42):
        """
        Initialize DataAugmentation with random seed.

        Args:
            random_seed: Random seed for reproducibility
        """
        self.random_seed = random_seed
        random.seed(random_seed)
        np.random.seed(random_seed)

        # Download required NLTK data
        try:
            nltk.data.find('corpora/wordnet')
        except LookupError:
            print("Downloading NLTK wordnet data...")
            nltk.download('wordnet')
            nltk.download('omw-1.4')  # Open Multilingual Wordnet

    # ============================================================
    # TEXT AUGMENTATION METHODS
    # ============================================================

    def synonym_replacement(self, text: str, n: int = 1) -> str:
        """
        Replace n words in the text with their synonyms.

        Args:
            text: Input text
            n: Number of words to replace

        Returns:
            Augmented text with synonym replacements

        Example:
            >>> aug = DataAugmentation()
            >>> aug.synonym_replacement("I love machine learning", n=1)
            "I love machine eruditeness"
        """
        words = text.split()
        new_words = words.copy()
        random_word_list = list(
            set([word for word in words if word.isalpha()]))
        random.shuffle(random_word_list)

        num_replaced = 0
        for random_word in random_word_list:
            synonyms = []
            for syn in wordnet.synsets(random_word):
                for lemma in syn.lemmas():
                    synonyms.append(lemma.name())

            if len(synonyms) >= 1:
                synonym = random.choice(list(synonyms))
                new_words = [synonym if word ==
                             random_word else word for word in new_words]
                num_replaced += 1

            if num_replaced >= n:
                break

        return ' '.join(new_words)

    def random_insertion(self, text: str, n: int = 1) -> str:
        """
        Randomly insert n words into the text.

        Args:
            text: Input text
            n: Number of words to insert

        Returns:
            Augmented text with random insertions
        """
        words = text.split()
        for _ in range(n):
            new_word = self._get_random_synonym(words)
            if new_word:
                random_idx = random.randint(0, len(words))
                words.insert(random_idx, new_word)

        return ' '.join(words)

    def random_swap(self, text: str, n: int = 1) -> str:
        """
        Randomly swap words in the text.

        Args:
            text: Input text
            n: Number of swaps to perform

        Returns:
            Augmented text with random swaps
        """
        words = text.split()
        for _ in range(n):
            if len(words) >= 2:
                idx1, idx2 = random.sample(range(len(words)), 2)
                words[idx1], words[idx2] = words[idx2], words[idx1]

        return ' '.join(words)

    def random_deletion(self, text: str, p: float = 0.1) -> str:
        """
        Randomly delete words from the text.

        Args:
            text: Input text
            p: Probability of deleting each word

        Returns:
            Augmented text with random deletions
        """
        words = text.split()
        if len(words) == 1:
            return text

        new_words = []
        for word in words:
            if random.uniform(0, 1) > p:
                new_words.append(word)

        if len(new_words) == 0:
            rand_int = random.randint(0, len(words) - 1)
            return words[rand_int]

        return ' '.join(new_words)

    def back_translation(self, text: str, target_lang: str = 'es') -> str:
        """
        Simulate back translation for text augmentation.
        Note: This is a simplified version. For real back translation,
        you would need translation APIs like Google Translate.

        Args:
            text: Input text
            target_lang: Target language code (placeholder)

        Returns:
            Augmented text (simplified version)
        """
        # This is a placeholder for back translation
        # In practice, you would use translation services
        words = text.split()
        # Simulate slight modifications that might occur in translation
        augmented_words = []
        for word in words:
            if random.random() < 0.1:  # 10% chance to modify
                # Simple modifications to simulate translation effects
                if len(word) > 3:
                    # Randomly change a character
                    idx = random.randint(1, len(word) - 2)
                    word_list = list(word)
                    word_list[idx] = random.choice('aeiou')
                    word = ''.join(word_list)
            augmented_words.append(word)

        return ' '.join(augmented_words)

    def _get_random_synonym(self, words: List[str]) -> Optional[str]:
        """Get a random synonym from the given words."""
        if not words:
            return None

        random_word = random.choice(words)
        synonyms = []
        for syn in wordnet.synsets(random_word):
            for lemma in syn.lemmas():
                synonyms.append(lemma.name())

        if synonyms:
            return random.choice(synonyms)
        return None

    # ============================================================
    # NUMERICAL DATA AUGMENTATION METHODS
    # ============================================================

    def add_gaussian_noise(self, data: np.ndarray, noise_factor: float = 0.1) -> np.ndarray:
        """
        Add Gaussian noise to numerical data.

        Args:
            data: Input numerical data
            noise_factor: Factor controlling noise intensity

        Returns:
            Data with added Gaussian noise
        """
        noise = np.random.normal(0, noise_factor * np.std(data), data.shape)
        return data + noise

    def scale_features(self, data: np.ndarray, scale_range: Tuple[float, float] = (0.8, 1.2)) -> np.ndarray:
        """
        Randomly scale features within a range.

        Args:
            data: Input numerical data
            scale_range: Range of scaling factors

        Returns:
            Scaled data
        """
        scale_factor = np.random.uniform(
            scale_range[0], scale_range[1], data.shape[1])
        return data * scale_factor

    def add_outliers(self, data: np.ndarray, outlier_fraction: float = 0.05) -> np.ndarray:
        """
        Add outliers to numerical data.

        Args:
            data: Input numerical data
            outlier_fraction: Fraction of data points to make outliers

        Returns:
            Data with added outliers
        """
        augmented_data = data.copy()
        n_outliers = int(len(data) * outlier_fraction)
        outlier_indices = np.random.choice(
            len(data), n_outliers, replace=False)

        for idx in outlier_indices:
            # Make outliers by multiplying by a large factor
            outlier_factor = np.random.choice([-3, -2, 2, 3])
            augmented_data[idx] *= outlier_factor

        return augmented_data

    # ============================================================
    # IMAGE AUGMENTATION METHODS
    # ============================================================

    def get_image_augmentation_pipeline(self,
                                        image_size: Tuple[int, int] = (
                                            224, 224),
                                        augmentation_prob: float = 0.5) -> Any:
        """
        Create an image augmentation pipeline using Albumentations.

        Args:
            image_size: Target image size (height, width)
            augmentation_prob: Probability of applying each augmentation

        Returns:
            Albumentations composition pipeline

        Raises:
            ImportError: If albumentations is not installed
        """
        if not IMAGE_AUGMENTATION_AVAILABLE:
            raise ImportError(
                "Image augmentation requires: opencv-python, pillow, albumentations. "
                "Install with: pip install opencv-python pillow albumentations"
            )

        return A.Compose([
            A.Resize(height=image_size[0], width=image_size[1]),
            A.HorizontalFlip(p=augmentation_prob),
            A.VerticalFlip(p=augmentation_prob * 0.5),
            A.RandomRotate90(p=augmentation_prob),
            A.Rotate(limit=15, p=augmentation_prob),
            A.RandomBrightnessContrast(
                brightness_limit=0.2,
                contrast_limit=0.2,
                p=augmentation_prob
            ),
            A.HueSaturationValue(
                hue_shift_limit=10,
                sat_shift_limit=20,
                val_shift_limit=10,
                p=augmentation_prob
            ),
            A.GaussianBlur(blur_limit=3, p=augmentation_prob * 0.3),
            A.GaussNoise(var_limit=(10.0, 50.0), p=augmentation_prob * 0.3),
            A.Cutout(
                num_holes=8,
                max_h_size=8,
                max_w_size=8,
                fill_value=0,
                p=augmentation_prob * 0.3
            ),
        ])

    def augment_image(self, image: np.ndarray, pipeline: Any) -> np.ndarray:
        """
        Apply augmentation pipeline to an image.

        Args:
            image: Input image as numpy array (H, W, C)
            pipeline: Albumentations pipeline from get_image_augmentation_pipeline()

        Returns:
            Augmented image as numpy array

        Raises:
            ImportError: If required image libraries are not installed
        """
        if not IMAGE_AUGMENTATION_AVAILABLE:
            raise ImportError(
                "Image augmentation requires: opencv-python, pillow, albumentations. "
                "Install with: pip install opencv-python pillow albumentations"
            )

        augmented = pipeline(image=image)
        return augmented['image']

    def augment_image_pil(self,
                          image: 'Image.Image',
                          brightness_range: Tuple[float, float] = (0.8, 1.2),
                          contrast_range: Tuple[float, float] = (0.8, 1.2),
                          blur_prob: float = 0.3) -> 'Image.Image':
        """
        Apply simple augmentation to PIL Image (alternative to Albumentations).

        Args:
            image: PIL Image object
            brightness_range: Range for brightness adjustment
            contrast_range: Range for contrast adjustment
            blur_prob: Probability of applying blur

        Returns:
            Augmented PIL Image

        Raises:
            ImportError: If PIL is not installed
        """
        if not IMAGE_AUGMENTATION_AVAILABLE:
            raise ImportError(
                "Image augmentation requires PIL. Install with: pip install pillow"
            )

        # Random brightness
        brightness_factor = np.random.uniform(
            brightness_range[0], brightness_range[1])
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(brightness_factor)

        # Random contrast
        contrast_factor = np.random.uniform(
            contrast_range[0], contrast_range[1])
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(contrast_factor)

        # Random blur
        if np.random.random() < blur_prob:
            image = image.filter(ImageFilter.GaussianBlur(radius=2))

        # Random flip
        if np.random.random() < 0.5:
            image = image.transpose(Image.FLIP_LEFT_RIGHT)

        return image

    # ============================================================
    # TABULAR DATA AUGMENTATION METHODS
    # ============================================================

    def mixup(self, X: np.ndarray, y: np.ndarray, alpha: float = 0.2) -> Tuple[np.ndarray, np.ndarray]:
        """
        Apply MixUp augmentation to tabular data.

        Args:
            X: Feature matrix
            y: Target vector
            alpha: MixUp parameter

        Returns:
            Augmented features and targets
        """
        if len(X) < 2:
            return X, y

        indices = np.random.permutation(len(X))
        lam = np.random.beta(alpha, alpha)

        mixed_X = lam * X + (1 - lam) * X[indices]
        mixed_y = lam * y + (1 - lam) * y[indices]

        return mixed_X, mixed_y

    def smote_like_augmentation(self, X: np.ndarray, k: int = 5) -> np.ndarray:
        """
        Apply SMOTE-like augmentation to generate synthetic samples.

        Args:
            X: Feature matrix
            k: Number of nearest neighbors to consider

        Returns:
            Augmented feature matrix
        """
        from sklearn.neighbors import NearestNeighbors

        if len(X) < k:
            k = len(X) - 1

        if k <= 0:
            return X

        nbrs = NearestNeighbors(n_neighbors=k + 1).fit(X)
        synthetic_samples = []

        for i in range(len(X)):
            distances, indices = nbrs.kneighbors([X[i]])
            # Exclude the point itself
            neighbor_indices = indices[0][1:]

            # Generate synthetic sample
            neighbor_idx = np.random.choice(neighbor_indices)
            diff = X[neighbor_idx] - X[i]
            gap = np.random.random()
            synthetic_sample = X[i] + gap * diff
            synthetic_samples.append(synthetic_sample)

        return np.vstack([X, np.array(synthetic_samples)])

    # ============================================================
    # COMBINED AUGMENTATION METHODS
    # ============================================================

    def augment_text_dataset(self,
                             texts: List[str],
                             labels: List[Any],
                             augmentation_factor: int = 2) -> Tuple[List[str], List[Any]]:
        """
        Augment a text dataset using multiple techniques.

        Args:
            texts: List of text samples
            labels: List of corresponding labels
            augmentation_factor: Number of augmented samples per original sample

        Returns:
            Augmented texts and labels
        """
        augmented_texts = texts.copy()
        augmented_labels = labels.copy()

        augmentation_methods = [
            self.synonym_replacement,
            self.random_insertion,
            self.random_swap,
            self.random_deletion,
            self.back_translation
        ]

        for i, (text, label) in enumerate(zip(texts, labels)):
            for _ in range(augmentation_factor):
                method = random.choice(augmentation_methods)
                try:
                    augmented_text = method(text)
                    augmented_texts.append(augmented_text)
                    augmented_labels.append(label)
                except:
                    # If augmentation fails, use original text
                    augmented_texts.append(text)
                    augmented_labels.append(label)

        return augmented_texts, augmented_labels

    def augment_numerical_dataset(self,
                                  X: np.ndarray,
                                  y: np.ndarray,
                                  methods: List[str] = ['noise', 'scale', 'mixup']) -> Tuple[np.ndarray, np.ndarray]:
        """
        Augment a numerical dataset using multiple techniques.

        Args:
            X: Feature matrix
            y: Target vector
            methods: List of augmentation methods to apply

        Returns:
            Augmented features and targets
        """
        augmented_X = X.copy()
        augmented_y = y.copy()

        for method in methods:
            if method == 'noise':
                noisy_X = self.add_gaussian_noise(X)
                augmented_X = np.vstack([augmented_X, noisy_X])
                augmented_y = np.hstack([augmented_y, y])

            elif method == 'scale':
                scaled_X = self.scale_features(X)
                augmented_X = np.vstack([augmented_X, scaled_X])
                augmented_y = np.hstack([augmented_y, y])

            elif method == 'mixup':
                mixed_X, mixed_y = self.mixup(X, y)
                augmented_X = np.vstack([augmented_X, mixed_X])
                augmented_y = np.hstack([augmented_y, mixed_y])

            elif method == 'smote':
                smote_X = self.smote_like_augmentation(X)
                # For SMOTE, we duplicate the labels
                smote_y = np.hstack([y, y])
                augmented_X = np.vstack(
                    [augmented_X, smote_X[len(X):]])  # Only new samples
                augmented_y = np.hstack(
                    [augmented_y, smote_y[len(y):]])  # Only new labels

        return augmented_X, augmented_y


# ============================================================
# DEMONSTRATION CODE
# ============================================================

if __name__ == "__main__":
    print("=" * 60)
    print("DATA AUGMENTATION MODULE - DEMONSTRATION")
    print("=" * 60)
    print()

    # Initialize augmenter
    augmenter = DataAugmentation(random_seed=42)

    # ============================================================
    # 1. TEXT AUGMENTATION DEMONSTRATION
    # ============================================================
    print("1. TEXT AUGMENTATION")
    print("-" * 60)

    original_text = "Senior Software Engineer with expertise in Python and machine learning"
    print(f"Original Text:\n{original_text}\n")

    print("a) Synonym Replacement:")
    augmented = augmenter.synonym_replacement(original_text, n=2)
    print(f"   {augmented}\n")

    print("b) Random Insertion:")
    augmented = augmenter.random_insertion(original_text, n=1)
    print(f"   {augmented}\n")

    print("c) Random Swap:")
    augmented = augmenter.random_swap(original_text, n=2)
    print(f"   {augmented}\n")

    print("d) Random Deletion:")
    augmented = augmenter.random_deletion(original_text, p=0.1)
    print(f"   {augmented}\n")

    # ============================================================
    # 2. NUMERICAL DATA AUGMENTATION
    # ============================================================
    print("\n2. NUMERICAL DATA AUGMENTATION")
    print("-" * 60)

    # Sample numerical data
    original_data = np.array([
        [5.0, 80000.0],
        [3.0, 60000.0],
        [7.0, 100000.0],
        [2.0, 50000.0]
    ])
    print(f"Original Data Shape: {original_data.shape}")
    print(f"Original Data (first 2 rows):\n{original_data[:2]}\n")

    print("a) Gaussian Noise Addition:")
    noisy_data = augmenter.add_gaussian_noise(original_data, noise_factor=0.1)
    print(f"   Noisy Data (first 2 rows):\n{noisy_data[:2]}\n")

    print("b) Feature Scaling:")
    scaled_data = augmenter.scale_features(
        original_data, scale_range=(0.9, 1.1))
    print(f"   Scaled Data (first 2 rows):\n{scaled_data[:2]}\n")

    # ============================================================
    # 3. TABULAR DATA AUGMENTATION (MIXUP)
    # ============================================================
    print("\n3. TABULAR DATA AUGMENTATION (MIXUP)")
    print("-" * 60)

    X_sample = np.array([[1, 2], [3, 4], [5, 6]])
    y_sample = np.array([0, 1, 0])

    print(f"Original X Shape: {X_sample.shape}")
    print(f"Original y Shape: {y_sample.shape}\n")

    mixed_X, mixed_y = augmenter.mixup(X_sample, y_sample, alpha=0.2)
    print(f"Mixed X (first 2 rows):\n{mixed_X[:2]}")
    print(f"Mixed y (first 2 values): {mixed_y[:2]}\n")

    # ============================================================
    # 4. DATASET AUGMENTATION
    # ============================================================
    print("\n4. DATASET AUGMENTATION")
    print("-" * 60)

    # Text dataset augmentation
    sample_texts = [
        "Python developer with 5 years experience",
        "Machine learning engineer seeking opportunities",
        "Full stack developer with React and Node.js skills"
    ]
    sample_labels = ['technical', 'technical', 'technical']

    print(f"Original Dataset Size: {len(sample_texts)} samples")

    augmented_texts, augmented_labels = augmenter.augment_text_dataset(
        sample_texts,
        sample_labels,
        augmentation_factor=2
    )

    print(f"Augmented Dataset Size: {len(augmented_texts)} samples")
    print(
        f"Augmentation Factor: {len(augmented_texts) / len(sample_texts):.1f}x\n")

    print("Sample Augmented Texts:")
    for i in range(min(3, len(augmented_texts))):
        print(f"  {i+1}. {augmented_texts[i]}")

    # Numerical dataset augmentation
    print(f"\nNumerical Dataset Augmentation:")
    X_demo = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]])
    y_demo = np.array([0, 1, 0, 1])

    print(f"Original Shape: X={X_demo.shape}, y={y_demo.shape}")

    augmented_X, augmented_y = augmenter.augment_numerical_dataset(
        X_demo,
        y_demo,
        methods=['noise', 'scale']
    )

    print(f"Augmented Shape: X={augmented_X.shape}, y={augmented_y.shape}")
    print(f"Augmentation Factor: {len(augmented_X) / len(X_demo):.1f}x")

    print()
    print("=" * 60)
    print("✅ DATA AUGMENTATION MODULE READY FOR PRODUCTION!")
    print("=" * 60)
    print()
    print("Available Methods:")
    print("  Text: synonym_replacement, random_insertion, random_swap,")
    print("        random_deletion, back_translation")
    print("  Numerical: add_gaussian_noise, scale_features, add_outliers")
    print("  Image: get_image_augmentation_pipeline, augment_image,")
    print("         augment_image_pil (requires: opencv-python, pillow, albumentations)")
    print("  Tabular: mixup, smote_like_augmentation")
    print("  Combined: augment_text_dataset, augment_numerical_dataset")
    print()
    if not IMAGE_AUGMENTATION_AVAILABLE:
        print("⚠️  Image augmentation libraries not installed.")
        print("   To enable: pip install opencv-python pillow albumentations")
        print()
