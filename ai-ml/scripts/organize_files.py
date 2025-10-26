"""
File Organization Script for AI Hiring System
Helps organize files transferred from Jupyter server
"""

import os
import shutil
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class FileOrganizer:
    """
    Organizes ML files into proper directory structure
    """

    def __init__(self, source_dir=None):
        """
        Initialize file organizer

        Args:
            source_dir: Directory containing files to organize (default: current directory)
        """
        self.source_dir = Path(source_dir) if source_dir else Path.cwd()
        self.base_dir = Path(__file__).parent.parent  # ai-ml directory

        # Define target directories
        self.dirs = {
            'processed': self.base_dir / 'data' / 'processed',
            'visualizations': self.base_dir / 'data' / 'visualizations',
            'test_cases': self.base_dir / 'data' / 'test_cases',
            'saved_models': self.base_dir / 'models' / 'saved_models',
            'reports': self.base_dir / 'data' / 'reports'
        }

        # Create directories
        for dir_path in self.dirs.values():
            dir_path.mkdir(parents=True, exist_ok=True)
            logger.info(f"✅ Directory ready: {dir_path}")

    def organize_files(self, dry_run=True):
        """
        Organize files based on their type and purpose

        Args:
            dry_run: If True, only show what would be done without moving files

        Returns:
            dict: Summary of operations
        """
        logger.info("="*60)
        logger.info("FILE ORGANIZATION")
        logger.info("="*60)
        logger.info(f"Source: {self.source_dir}")
        logger.info(f"Dry run: {dry_run}")
        logger.info("")

        operations = {
            'processed': [],
            'visualizations': [],
            'test_cases': [],
            'saved_models': [],
            'reports': [],
            'skipped': []
        }

        # Define file categories
        file_mappings = {
            # Processed data files
            'processed': [
                'ai_hiring_master_dataset.csv',
                'model_predictions.csv',
                'feature_importance.csv',
                'top_candidates_ranking.csv'
            ],

            # Visualization files
            'visualizations': [
                'confusion_matrix.png',
                'feature_importance.png',
                'enhanced_feature_importance.png',
                'realtime_candidate_evaluation.png',
                'skill_demand_correlation.png',
                'top_candidates_education.png'
            ],

            # Test case files
            'test_cases': [
                'good_match_pair.json',
                'poor_match_pair.json',
                'ml_job_description.json',
                'synthetic_resume.json',
                'cloud_security_summaries.json',
                'distinct_resumes.json',
                'junior_dev_resumes.json',
                'software_job_descriptions.json'
            ],

            # Model files
            'saved_models': [
                '*.pkl',
                '*.h5',
                '*.pt',
                '*.pth',
                '*.joblib'
            ],

            # Report files
            'reports': [
                'cleaning_report.txt',
                '*_report.txt',
                '*_report.json'
            ]
        }

        # Process each category
        for category, file_patterns in file_mappings.items():
            logger.info(f"\n📂 {category.upper()}")
            logger.info("-" * 40)

            for pattern in file_patterns:
                # Find matching files
                if '*' in pattern:
                    import glob
                    matching_files = glob.glob(str(self.source_dir / pattern))
                else:
                    matching_files = [self.source_dir / pattern]

                for file_path in matching_files:
                    file_path = Path(file_path)

                    if file_path.exists() and file_path.is_file():
                        target_path = self.dirs[category] / file_path.name

                        if dry_run:
                            logger.info(
                                f"  Would move: {file_path.name} → {category}/")
                            operations[category].append({
                                'file': file_path.name,
                                'source': str(file_path),
                                'target': str(target_path),
                                'size': file_path.stat().st_size
                            })
                        else:
                            try:
                                shutil.copy2(file_path, target_path)
                                logger.info(
                                    f"  ✅ Moved: {file_path.name} → {category}/")
                                operations[category].append({
                                    'file': file_path.name,
                                    'source': str(file_path),
                                    'target': str(target_path),
                                    'size': file_path.stat().st_size,
                                    'status': 'success'
                                })
                            except Exception as e:
                                logger.error(
                                    f"  ❌ Error: {file_path.name} - {e}")
                                operations['skipped'].append({
                                    'file': file_path.name,
                                    'error': str(e)
                                })

        # Summary
        logger.info("\n" + "="*60)
        logger.info("SUMMARY")
        logger.info("="*60)

        for category, files in operations.items():
            if category != 'skipped' and files:
                total_size = sum(f.get('size', 0) for f in files)
                logger.info(
                    f"{category.upper()}: {len(files)} files ({total_size:,} bytes)")

        if operations['skipped']:
            logger.info(f"SKIPPED: {len(operations['skipped'])} files")

        if dry_run:
            logger.info("\n⚠️  DRY RUN - No files were actually moved")
            logger.info("Run with dry_run=False to execute")
        else:
            logger.info("\n✅ File organization complete!")

        return operations

    def verify_structure(self):
        """
        Verify that all expected directories and files are in place

        Returns:
            dict: Verification report
        """
        logger.info("\n" + "="*60)
        logger.info("STRUCTURE VERIFICATION")
        logger.info("="*60)

        report = {
            'directories': {},
            'files': {}
        }

        # Check directories
        for name, path in self.dirs.items():
            exists = path.exists()
            file_count = len(list(path.glob('*'))) if exists else 0

            report['directories'][name] = {
                'path': str(path),
                'exists': exists,
                'file_count': file_count
            }

            status = "✅" if exists else "❌"
            logger.info(f"{status} {name}: {file_count} files")

        # Check critical files
        critical_files = {
            'raw_jobs': self.base_dir / 'data' / 'raw' / 'ai_hiring_dataset.csv',
            'raw_candidates': self.base_dir / 'data' / 'raw' / 'ai_hiring_candidates.csv',
            'raw_skills': self.base_dir / 'data' / 'raw' / 'ai_hiring_candidates_skills.csv',
            'master_skills': self.base_dir / 'data' / 'raw' / 'master_skills_dataset.csv',
            'standardized_skills': self.base_dir / 'data' / 'raw' / 'standardized_skills.csv',
            'enhanced_skills': self.base_dir / 'data' / 'raw' / 'enhanced_skills_dataset.csv'
        }

        logger.info("\nCritical Files:")
        for name, path in critical_files.items():
            exists = path.exists()
            size = path.stat().st_size if exists else 0

            report['files'][name] = {
                'path': str(path),
                'exists': exists,
                'size': size
            }

            status = "✅" if exists else "❌"
            size_kb = f"{size/1024:.1f} KB" if size > 0 else "missing"
            logger.info(f"  {status} {name}: {size_kb}")

        return report

    def create_file_inventory(self):
        """
        Create an inventory of all files in the data directory

        Returns:
            dict: File inventory
        """
        inventory = {
            'timestamp': str(Path(__file__).stat().st_mtime),
            'directories': {}
        }

        data_dir = self.base_dir / 'data'

        for subdir in data_dir.rglob('*'):
            if subdir.is_dir():
                files = list(subdir.glob('*'))
                inventory['directories'][str(subdir.relative_to(self.base_dir))] = {
                    'count': len([f for f in files if f.is_file()]),
                    'files': [
                        {
                            'name': f.name,
                            'size': f.stat().st_size,
                            'extension': f.suffix
                        }
                        for f in files if f.is_file()
                    ]
                }

        # Save inventory
        import json
        inventory_path = self.dirs['reports'] / 'file_inventory.json'
        with open(inventory_path, 'w') as f:
            json.dump(inventory, f, indent=2)

        logger.info(f"\n✅ Inventory saved to: {inventory_path}")

        return inventory


def main():
    """
    Main execution
    """
    import sys

    # Parse arguments
    source_dir = sys.argv[1] if len(sys.argv) > 1 else None
    dry_run = '--execute' not in sys.argv

    # Initialize organizer
    organizer = FileOrganizer(source_dir)

    # Show current structure
    organizer.verify_structure()

    # Organize files
    if source_dir:
        operations = organizer.organize_files(dry_run=dry_run)

        if dry_run:
            print("\n" + "="*60)
            print("To actually move files, run:")
            print(f"python organize_files.py {source_dir} --execute")
            print("="*60)

    # Create inventory
    organizer.create_file_inventory()

    print("\n✅ Done!")


if __name__ == '__main__':
    main()
