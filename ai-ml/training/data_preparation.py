"""
Data Preparation Module for AI Hiring System
Prepares training data for machine learning models from CSV datasets
"""

import pandas as pd
import numpy as np
from pathlib import Path
import json
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import logging

# Setup logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class DataPreparation:
    """
    Handles loading, cleaning, and preparing data for ML models
    """

    def __init__(self, data_dir=None, output_dir=None):
        """
        Initialize data preparation

        Args:
            data_dir: Directory containing raw CSV files (default: auto-detect)
            output_dir: Directory for processed data output (default: auto-detect)
        """
        # Get absolute paths relative to this file
        script_dir = Path(__file__).parent.parent  # ai-ml directory

        if data_dir is None:
            self.data_dir = script_dir / 'data' / 'raw'
        else:
            self.data_dir = Path(data_dir)

        if output_dir is None:
            self.output_dir = script_dir / 'data' / 'processed'
        else:
            self.output_dir = Path(output_dir)

        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Data containers
        self.jobs_df = None
        self.candidates_df = None
        self.skills_df = None
        self.master_skills_df = None
        self.standardized_skills_df = None
        self.enhanced_skills_df = None

        logger.info(f"Data preparation initialized")
        logger.info(f"Data directory: {self.data_dir.absolute()}")
        logger.info(f"Output directory: {self.output_dir.absolute()}")

        # Verify data directory exists
        if not self.data_dir.exists():
            logger.error(
                f"❌ Data directory does not exist: {self.data_dir.absolute()}")
            raise FileNotFoundError(
                f"Data directory not found: {self.data_dir.absolute()}")

    def load_datasets(self):
        """
        Load all CSV datasets

        Returns:
            dict: Dictionary containing all loaded dataframes
        """
        logger.info("Loading datasets...")

        # Verify all files exist before loading
        required_files = [
            'ai_hiring_dataset.csv',
            'ai_hiring_candidates.csv',
            'ai_hiring_candidates_skills.csv',
            'master_skills_dataset.csv',
            'standardized_skills.csv',
            'enhanced_skills_dataset.csv'
        ]

        missing_files = []
        for filename in required_files:
            file_path = self.data_dir / filename
            if not file_path.exists():
                missing_files.append(filename)

        if missing_files:
            logger.error(f"❌ Missing files in {self.data_dir.absolute()}:")
            for f in missing_files:
                logger.error(f"   - {f}")
            raise FileNotFoundError(
                f"Missing required CSV files: {', '.join(missing_files)}")

        try:
            # Core datasets
            self.jobs_df = pd.read_csv(self.data_dir / 'ai_hiring_dataset.csv')
            logger.info(f"✅ Loaded jobs: {len(self.jobs_df)} records")

            self.candidates_df = pd.read_csv(
                self.data_dir / 'ai_hiring_candidates.csv')
            logger.info(
                f"✅ Loaded candidates: {len(self.candidates_df)} records")

            self.skills_df = pd.read_csv(
                self.data_dir / 'ai_hiring_candidates_skills.csv')
            logger.info(
                f"✅ Loaded candidate skills: {len(self.skills_df)} records")

            # Skills reference datasets
            self.master_skills_df = pd.read_csv(
                self.data_dir / 'master_skills_dataset.csv')
            logger.info(
                f"✅ Loaded master skills: {len(self.master_skills_df)} records")

            self.standardized_skills_df = pd.read_csv(
                self.data_dir / 'standardized_skills.csv')
            logger.info(
                f"✅ Loaded standardized skills: {len(self.standardized_skills_df)} records")

            self.enhanced_skills_df = pd.read_csv(
                self.data_dir / 'enhanced_skills_dataset.csv')
            logger.info(
                f"✅ Loaded enhanced skills: {len(self.enhanced_skills_df)} records")

            return {
                'jobs': self.jobs_df,
                'candidates': self.candidates_df,
                'skills': self.skills_df,
                'master_skills': self.master_skills_df,
                'standardized_skills': self.standardized_skills_df,
                'enhanced_skills': self.enhanced_skills_df
            }

        except FileNotFoundError as e:
            logger.error(f"❌ File not found: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ Error loading datasets: {e}")
            raise

    def clean_data(self):
        """
        Clean and validate loaded datasets

        Returns:
            dict: Cleaning report with statistics
        """
        logger.info("Cleaning data...")

        report = {
            'timestamp': datetime.now().isoformat(),
            'datasets': {}
        }

        # Clean jobs dataset
        if self.jobs_df is not None:
            initial_count = len(self.jobs_df)

            # Remove duplicates
            self.jobs_df = self.jobs_df.drop_duplicates(subset=['id'])

            # Handle missing values
            self.jobs_df['description'] = self.jobs_df['description'].fillna(
                '')
            self.jobs_df['required_skills'] = self.jobs_df['required_skills'].fillna(
                '')

            # Convert dates
            self.jobs_df['posted_date'] = pd.to_datetime(
                self.jobs_df['posted_date'], errors='coerce')

            # Validate salary ranges
            salary_mask = self.jobs_df['salary_max'] >= self.jobs_df['salary_min']
            self.jobs_df = self.jobs_df[salary_mask]

            report['datasets']['jobs'] = {
                'initial': initial_count,
                'final': len(self.jobs_df),
                'removed': initial_count - len(self.jobs_df),
                'duplicates_removed': initial_count - len(self.jobs_df.drop_duplicates()),
                'columns': list(self.jobs_df.columns)
            }

            logger.info(
                f"✅ Jobs cleaned: {initial_count} → {len(self.jobs_df)}")

        # Clean candidates dataset
        if self.candidates_df is not None:
            initial_count = len(self.candidates_df)

            # Remove duplicates
            self.candidates_df = self.candidates_df.drop_duplicates(
                subset=['candidate_id'])

            # Handle missing values
            self.candidates_df['education'] = self.candidates_df['education'].fillna(
                'Not specified')
            self.candidates_df['location'] = self.candidates_df['location'].fillna(
                'Remote')

            # Validate years of experience
            self.candidates_df['years_experience'] = pd.to_numeric(
                self.candidates_df['years_experience'],
                errors='coerce'
            ).fillna(0)

            report['datasets']['candidates'] = {
                'initial': initial_count,
                'final': len(self.candidates_df),
                'removed': initial_count - len(self.candidates_df),
                'columns': list(self.candidates_df.columns)
            }

            logger.info(
                f"✅ Candidates cleaned: {initial_count} → {len(self.candidates_df)}")

        # Clean skills dataset
        if self.skills_df is not None:
            initial_count = len(self.skills_df)

            # Remove duplicates (same candidate + skill)
            self.skills_df = self.skills_df.drop_duplicates(
                subset=['candidate_id', 'skill_name']
            )

            # Standardize skill levels
            valid_levels = ['beginner', 'intermediate', 'advanced', 'expert']
            self.skills_df = self.skills_df[
                self.skills_df['skill_level'].isin(valid_levels)
            ]

            report['datasets']['skills'] = {
                'initial': initial_count,
                'final': len(self.skills_df),
                'removed': initial_count - len(self.skills_df),
                'unique_skills': self.skills_df['skill_name'].nunique(),
                'unique_candidates': self.skills_df['candidate_id'].nunique()
            }

            logger.info(
                f"✅ Skills cleaned: {initial_count} → {len(self.skills_df)}")

        # Save cleaning report
        report_path = self.output_dir / 'cleaning_report.json'
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)

        logger.info(f"✅ Cleaning report saved to {report_path}")

        return report

    def create_master_dataset(self):
        """
        Create master dataset by merging all sources

        Returns:
            pd.DataFrame: Master dataset with all features
        """
        logger.info("Creating master dataset...")

        # Create candidate profiles with aggregated skills
        candidate_profiles = []

        for _, candidate in self.candidates_df.iterrows():
            candidate_id = candidate['candidate_id']

            # Get candidate skills
            candidate_skills = self.skills_df[
                self.skills_df['candidate_id'] == candidate_id
            ]

            # Aggregate skills
            skills_list = candidate_skills['skill_name'].tolist()
            skills_str = ','.join(skills_list) if skills_list else ''

            # Count skills by level
            skill_counts = candidate_skills['skill_level'].value_counts(
            ).to_dict()

            # Create profile
            profile = {
                'candidate_id': candidate_id,
                'full_name': f"{candidate['first_name']} {candidate['last_name']}",
                'email': candidate['email'],
                'location': candidate['location'],
                'experience_level': candidate['experience_level'],
                'education': candidate['education'],
                'years_experience': candidate['years_experience'],
                'skills': skills_str,
                'num_skills': len(skills_list),
                'expert_skills': skill_counts.get('expert', 0),
                'advanced_skills': skill_counts.get('advanced', 0),
                'intermediate_skills': skill_counts.get('intermediate', 0),
                'beginner_skills': skill_counts.get('beginner', 0),
                'salary_expectation_min': candidate.get('salary_expectation_min', 0),
                'salary_expectation_max': candidate.get('salary_expectation_max', 0),
                'availability': candidate.get('availability', 'Not specified')
            }

            candidate_profiles.append(profile)

        master_df = pd.DataFrame(candidate_profiles)

        # Save master dataset
        output_path = self.output_dir / 'master_dataset.csv'
        master_df.to_csv(output_path, index=False)

        logger.info(f"✅ Master dataset created: {len(master_df)} records")
        logger.info(f"✅ Saved to {output_path}")

        return master_df

    def prepare_training_data(self, test_size=0.2, random_state=42):
        """
        Prepare train/test splits for ML models

        Args:
            test_size: Proportion of data for testing
            random_state: Random seed for reproducibility

        Returns:
            dict: Dictionary containing train/test splits
        """
        logger.info("Preparing training data splits...")

        master_df = self.create_master_dataset()

        # Feature engineering
        features = [
            'years_experience',
            'num_skills',
            'expert_skills',
            'advanced_skills',
            'intermediate_skills',
            'beginner_skills'
        ]

        X = master_df[features]

        # Encode experience level as target
        le = LabelEncoder()
        y = le.fit_transform(master_df['experience_level'])

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=test_size,
            random_state=random_state,
            stratify=y
        )

        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Save splits
        np.save(self.output_dir / 'X_train.npy', X_train_scaled)
        np.save(self.output_dir / 'X_test.npy', X_test_scaled)
        np.save(self.output_dir / 'y_train.npy', y_train)
        np.save(self.output_dir / 'y_test.npy', y_test)

        # Save label encoder
        import joblib
        joblib.dump(le, self.output_dir / 'label_encoder.pkl')
        joblib.dump(scaler, self.output_dir / 'scaler.pkl')

        logger.info(f"✅ Training data prepared:")
        logger.info(f"   Train: {X_train_scaled.shape[0]} samples")
        logger.info(f"   Test: {X_test_scaled.shape[0]} samples")
        logger.info(f"   Features: {X_train_scaled.shape[1]}")
        logger.info(f"   Classes: {len(le.classes_)}")

        return {
            'X_train': X_train_scaled,
            'X_test': X_test_scaled,
            'y_train': y_train,
            'y_test': y_test,
            'label_encoder': le,
            'scaler': scaler,
            'feature_names': features
        }

    def get_statistics(self):
        """
        Get comprehensive statistics about the datasets

        Returns:
            dict: Statistics about all datasets
        """
        stats = {}

        if self.jobs_df is not None:
            stats['jobs'] = {
                'total': len(self.jobs_df),
                'by_type': self.jobs_df['job_type'].value_counts().to_dict(),
                'by_experience': self.jobs_df['experience_level'].value_counts().to_dict(),
                'by_status': self.jobs_df['status'].value_counts().to_dict(),
                'avg_salary_min': float(self.jobs_df['salary_min'].mean()),
                'avg_salary_max': float(self.jobs_df['salary_max'].mean())
            }

        if self.candidates_df is not None:
            stats['candidates'] = {
                'total': len(self.candidates_df),
                'by_experience': self.candidates_df['experience_level'].value_counts().to_dict(),
                'avg_years_experience': float(self.candidates_df['years_experience'].mean()),
                'by_education': self.candidates_df['education'].value_counts().to_dict()
            }

        if self.skills_df is not None:
            stats['skills'] = {
                'total_mappings': len(self.skills_df),
                'unique_skills': self.skills_df['skill_name'].nunique(),
                'by_level': self.skills_df['skill_level'].value_counts().to_dict(),
                'top_skills': self.skills_df['skill_name'].value_counts().head(10).to_dict()
            }

        return stats


def main():
    """
    Main execution function
    """
    logger.info("="*60)
    logger.info("AI HIRING SYSTEM - DATA PREPARATION")
    logger.info("="*60)

    # Initialize
    prep = DataPreparation()

    # Load datasets
    datasets = prep.load_datasets()
    logger.info(f"\n✅ Loaded {len(datasets)} datasets")

    # Clean data
    cleaning_report = prep.clean_data()
    logger.info("\n✅ Data cleaning complete")

    # Get statistics
    stats = prep.get_statistics()
    logger.info("\n📊 Dataset Statistics:")
    for dataset_name, dataset_stats in stats.items():
        logger.info(f"\n{dataset_name.upper()}:")
        for key, value in dataset_stats.items():
            logger.info(f"  {key}: {value}")

    # Create master dataset
    master_df = prep.create_master_dataset()
    logger.info(f"\n✅ Master dataset created: {len(master_df)} records")

    # Prepare training data
    training_data = prep.prepare_training_data()
    logger.info("\n✅ Training data prepared and saved")

    logger.info("\n" + "="*60)
    logger.info("DATA PREPARATION COMPLETE")
    logger.info("="*60)

    return prep, training_data


if __name__ == '__main__':
    prep, training_data = main()
