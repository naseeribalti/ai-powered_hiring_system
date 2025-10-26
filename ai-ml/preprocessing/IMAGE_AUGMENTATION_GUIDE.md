# Image Augmentation Guide

## 📦 Installation

To enable image augmentation features, install the required packages:

```bash
pip install opencv-python pillow albumentations
```

## 🚀 Quick Start

### Method 1: Using Albumentations (Recommended)

```python
from preprocessing.data_augmentation import DataAugmentation
import cv2
import numpy as np

# Initialize augmenter
augmenter = DataAugmentation(random_seed=42)

# Load an image (using OpenCV)
image = cv2.imread('profile_photo.jpg')
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB

# Create augmentation pipeline
pipeline = augmenter.get_image_augmentation_pipeline(
    image_size=(224, 224),
    augmentation_prob=0.5
)

# Apply augmentation
augmented_image = augmenter.augment_image(image, pipeline)

# Save result
cv2.imwrite('augmented_photo.jpg', cv2.cvtColor(augmented_image, cv2.COLOR_RGB2BGR))
```

### Method 2: Using PIL (Simpler Alternative)

```python
from preprocessing.data_augmentation import DataAugmentation
from PIL import Image

# Initialize augmenter
augmenter = DataAugmentation(random_seed=42)

# Load an image (using PIL)
image = Image.open('profile_photo.jpg')

# Apply augmentation
augmented_image = augmenter.augment_image_pil(
    image,
    brightness_range=(0.8, 1.2),
    contrast_range=(0.8, 1.2),
    blur_prob=0.3
)

# Save result
augmented_image.save('augmented_photo.jpg')
```

## 🎯 Use Cases for AI Hiring System

### 1. Profile Photo Augmentation

Augment candidate profile photos for training a face recognition or photo quality assessment model:

```python
import cv2
import numpy as np
from preprocessing.data_augmentation import DataAugmentation

augmenter = DataAugmentation()
pipeline = augmenter.get_image_augmentation_pipeline(
    image_size=(256, 256),
    augmentation_prob=0.5
)

# Load candidate photos
photo_paths = ['candidate1.jpg', 'candidate2.jpg', 'candidate3.jpg']
augmented_photos = []

for path in photo_paths:
    image = cv2.imread(path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Generate 5 augmented versions per photo
    for i in range(5):
        aug_img = augmenter.augment_image(image, pipeline)
        augmented_photos.append(aug_img)

print(f"Generated {len(augmented_photos)} augmented photos from {len(photo_paths)} originals")
```

### 2. Document/Resume Image Processing

If resumes are scanned as images, augment them to train OCR or document classification models:

```python
from PIL import Image
from preprocessing.data_augmentation import DataAugmentation

augmenter = DataAugmentation()

# Load scanned resume
resume_image = Image.open('resume_scan.jpg')

# Apply lighter augmentation (preserve readability)
augmented_resume = augmenter.augment_image_pil(
    resume_image,
    brightness_range=(0.9, 1.1),  # Subtle brightness change
    contrast_range=(0.9, 1.1),    # Subtle contrast change
    blur_prob=0.1                 # Low blur probability
)

augmented_resume.save('augmented_resume.jpg')
```

### 3. Batch Processing with Multiple Augmentations

```python
import cv2
import os
from preprocessing.data_augmentation import DataAugmentation

def augment_image_dataset(input_dir, output_dir, num_augmentations=3):
    """Augment all images in a directory"""
    augmenter = DataAugmentation()
    pipeline = augmenter.get_image_augmentation_pipeline()

    os.makedirs(output_dir, exist_ok=True)

    for filename in os.listdir(input_dir):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            # Load image
            image_path = os.path.join(input_dir, filename)
            image = cv2.imread(image_path)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Save original
            base_name = os.path.splitext(filename)[0]
            output_path = os.path.join(output_dir, f"{base_name}_original.jpg")
            cv2.imwrite(output_path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))

            # Generate augmented versions
            for i in range(num_augmentations):
                aug_img = augmenter.augment_image(image, pipeline)
                output_path = os.path.join(output_dir, f"{base_name}_aug_{i+1}.jpg")
                cv2.imwrite(output_path, cv2.cvtColor(aug_img, cv2.COLOR_RGB2BGR))

            print(f"Processed {filename}: 1 original + {num_augmentations} augmented")

# Usage
augment_image_dataset('data/profile_photos', 'data/augmented_photos', num_augmentations=5)
```

## 🔧 Augmentation Pipeline Details

The Albumentations pipeline includes:

| Transformation               | Probability | Description                             |
| ---------------------------- | ----------- | --------------------------------------- |
| **Resize**                   | 100%        | Resize to target size (default 224x224) |
| **HorizontalFlip**           | 50%         | Flip image horizontally                 |
| **VerticalFlip**             | 25%         | Flip image vertically                   |
| **RandomRotate90**           | 50%         | Rotate by 90° increments                |
| **Rotate**                   | 50%         | Random rotation ±15°                    |
| **RandomBrightnessContrast** | 50%         | Adjust brightness/contrast ±20%         |
| **HueSaturationValue**       | 50%         | Adjust color properties                 |
| **GaussianBlur**             | 15%         | Apply Gaussian blur                     |
| **GaussNoise**               | 15%         | Add Gaussian noise                      |
| **Cutout**                   | 15%         | Random rectangular cutouts              |

## 📊 Example Output

```python
from preprocessing.data_augmentation import DataAugmentation
import numpy as np

# Check if image augmentation is available
augmenter = DataAugmentation()

try:
    pipeline = augmenter.get_image_augmentation_pipeline()
    print("✅ Image augmentation is available!")
    print("📦 Installed: opencv-python, pillow, albumentations")
except ImportError as e:
    print("❌ Image augmentation not available")
    print(f"   Error: {e}")
    print("   Install with: pip install opencv-python pillow albumentations")
```

## 🎨 Customizing Augmentation

### Adjust Augmentation Probability

```python
# More aggressive augmentation
pipeline = augmenter.get_image_augmentation_pipeline(
    image_size=(512, 512),
    augmentation_prob=0.8  # 80% chance for each transformation
)

# More conservative augmentation
pipeline = augmenter.get_image_augmentation_pipeline(
    image_size=(256, 256),
    augmentation_prob=0.2  # 20% chance for each transformation
)
```

### PIL Method Parameters

```python
# Lighter augmentation
augmented = augmenter.augment_image_pil(
    image,
    brightness_range=(0.95, 1.05),  # ±5%
    contrast_range=(0.95, 1.05),    # ±5%
    blur_prob=0.1                   # 10% blur chance
)

# Stronger augmentation
augmented = augmenter.augment_image_pil(
    image,
    brightness_range=(0.7, 1.3),    # ±30%
    contrast_range=(0.7, 1.3),      # ±30%
    blur_prob=0.5                   # 50% blur chance
)
```

## ⚡ Performance Tips

1. **Batch Processing**: Process multiple images together for better performance
2. **Fixed Seeds**: Use consistent `random_seed` for reproducible augmentations
3. **Pipeline Reuse**: Create pipeline once and reuse for multiple images
4. **Memory Management**: Process large datasets in chunks to avoid memory issues

## 🚨 Error Handling

```python
from preprocessing.data_augmentation import DataAugmentation

augmenter = DataAugmentation()

try:
    pipeline = augmenter.get_image_augmentation_pipeline()
    # Use pipeline...
except ImportError as e:
    print(f"Image augmentation not available: {e}")
    print("Install required packages:")
    print("  pip install opencv-python pillow albumentations")
```

## 📝 Notes

- **Image Format**: Albumentations expects RGB images (numpy arrays)
- **PIL Format**: PIL methods work with PIL Image objects
- **Color Space**: OpenCV loads images in BGR; convert to RGB before augmentation
- **File Formats**: Supports .jpg, .jpeg, .png, and most common image formats
- **Thread Safety**: Create separate `DataAugmentation` instances for multi-threading

## 🔗 Integration Example

Combine with text and numerical augmentation:

```python
from preprocessing.data_augmentation import DataAugmentation
import numpy as np

augmenter = DataAugmentation(random_seed=42)

# Text augmentation
resume_text = "Senior Python Developer with 5 years experience"
augmented_text = augmenter.synonym_replacement(resume_text, n=2)

# Numerical augmentation
skills_vector = np.array([[8, 7, 6, 9]])  # Skill ratings
augmented_skills = augmenter.add_gaussian_noise(skills_vector, noise_factor=0.1)

# Image augmentation (if available)
try:
    import cv2
    profile_photo = cv2.imread('candidate_photo.jpg')
    profile_photo = cv2.cvtColor(profile_photo, cv2.COLOR_BGR2RGB)
    pipeline = augmenter.get_image_augmentation_pipeline()
    augmented_photo = augmenter.augment_image(profile_photo, pipeline)
    print("✅ Full multimodal augmentation complete!")
except ImportError:
    print("⚠️ Skipping image augmentation (libraries not installed)")
```

---

**Status**: ✅ Module ready | ⚠️ Optional dependencies required for image augmentation
