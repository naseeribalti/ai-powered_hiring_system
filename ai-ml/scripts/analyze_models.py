"""
Model Analysis Script
Analyzes transferred ML outputs to understand what models were built
"""

import json
import pandas as pd
from pathlib import Path
import logging
from PIL import Image
import numpy as np

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ModelAnalyzer:
    """
    Analyzes ML outputs to understand model architecture and performance
    """

    def __init__(self, data_dir='../data'):
        self.data_dir = Path(data_dir)
        self.processed_dir = self.data_dir / 'processed'
        self.viz_dir = self.data_dir / 'visualizations'
        self.test_cases_dir = self.data_dir / 'test_cases'

        self.analysis = {
            'datasets': {},
            'models': {},
            'visualizations': {},
            'test_cases': {}
        }

    def analyze_all(self):
        """
        Run complete analysis
        """
        logger.info("="*60)
        logger.info("MODEL ANALYSIS")
        logger.info("="*60)

        self.analyze_datasets()
        self.analyze_predictions()
        self.analyze_visualizations()
        self.analyze_test_cases()
        self.generate_report()

        return self.analysis

    def analyze_datasets(self):
        """
        Analyze dataset files
        """
        logger.info("\n📊 DATASETS")
        logger.info("-"*60)

        dataset_files = {
            'master': 'ai_hiring_master_dataset.csv',
            'predictions': 'model_predictions.csv',
            'rankings': 'top_candidates_ranking.csv',
            'feature_importance': 'feature_importance.csv'
        }

        for name, filename in dataset_files.items():
            file_path = self.processed_dir / filename

            if file_path.exists():
                try:
                    df = pd.read_csv(file_path)

                    self.analysis['datasets'][name] = {
                        'file': filename,
                        'rows': len(df),
                        'columns': list(df.columns),
                        'size_mb': file_path.stat().st_size / (1024*1024),
                        'status': 'found'
                    }

                    logger.info(
                        f"✅ {name}: {len(df)} rows, {len(df.columns)} cols")

                    # Show sample for key datasets
                    if name == 'predictions':
                        logger.info(f"   Columns: {', '.join(df.columns[:5])}")
                        if len(df) > 0:
                            logger.info(
                                f"   Sample prediction: {df.iloc[0].to_dict()}")

                    if name == 'feature_importance':
                        logger.info(f"   Top 3 features:")
                        for idx, row in df.head(3).iterrows():
                            logger.info(
                                f"     {idx+1}. {row.get('feature', row.iloc[0])}")

                except Exception as e:
                    logger.warning(f"⚠️  {name}: Error reading - {e}")
                    self.analysis['datasets'][name] = {
                        'file': filename,
                        'status': 'error',
                        'error': str(e)
                    }
            else:
                logger.info(f"❌ {name}: Not found")
                self.analysis['datasets'][name] = {
                    'file': filename,
                    'status': 'missing'
                }

    def analyze_predictions(self):
        """
        Analyze model predictions to understand model type
        """
        logger.info("\n🤖 MODEL INFERENCE")
        logger.info("-"*60)

        predictions_path = self.processed_dir / 'model_predictions.csv'

        if predictions_path.exists():
            try:
                df = pd.read_csv(predictions_path)

                # Infer model type
                model_type = "Unknown"
                target_variable = None

                # Look for common column patterns
                if 'prediction' in df.columns:
                    unique_values = df['prediction'].nunique()
                    if unique_values < 10:
                        model_type = "Classification"
                        logger.info(
                            f"✅ Model Type: Classification ({unique_values} classes)")
                    else:
                        model_type = "Regression"
                        logger.info(f"✅ Model Type: Regression")

                    target_variable = 'prediction'

                # Check for probability columns
                prob_cols = [
                    c for c in df.columns if 'prob' in c.lower() or 'confidence' in c.lower()]
                if prob_cols:
                    logger.info(
                        f"   Probability columns found: {', '.join(prob_cols)}")

                # Check for actual vs predicted
                if 'actual' in df.columns and 'predicted' in df.columns:
                    accuracy = (df['actual'] == df['predicted']).mean()
                    logger.info(f"   Accuracy: {accuracy:.2%}")

                self.analysis['models']['primary'] = {
                    'type': model_type,
                    'target': target_variable,
                    'predictions_count': len(df),
                    'features_used': [c for c in df.columns if c not in ['prediction', 'actual', 'predicted']]
                }

            except Exception as e:
                logger.error(f"❌ Error analyzing predictions: {e}")
        else:
            logger.info("❌ No predictions file found")

    def analyze_visualizations(self):
        """
        Analyze visualization files
        """
        logger.info("\n📈 VISUALIZATIONS")
        logger.info("-"*60)

        viz_files = {
            'confusion_matrix.png': 'Classification performance',
            'feature_importance.png': 'Feature rankings',
            'enhanced_feature_importance.png': 'Detailed feature analysis',
            'realtime_candidate_evaluation.png': 'Live evaluation metrics',
            'skill_demand_correlation.png': 'Skill market analysis',
            'top_candidates_education.png': 'Education analysis'
        }

        for filename, description in viz_files.items():
            file_path = self.viz_dir / filename

            if file_path.exists():
                try:
                    img = Image.open(file_path)
                    size_kb = file_path.stat().st_size / 1024

                    self.analysis['visualizations'][filename] = {
                        'description': description,
                        'dimensions': img.size,
                        'size_kb': size_kb,
                        'status': 'found'
                    }

                    logger.info(f"✅ {filename}")
                    logger.info(f"   {description}")
                    logger.info(
                        f"   {img.size[0]}x{img.size[1]} pixels, {size_kb:.1f} KB")

                except Exception as e:
                    logger.warning(f"⚠️  {filename}: {e}")
            else:
                logger.info(f"❌ {filename}: Not found")

    def analyze_test_cases(self):
        """
        Analyze test case JSON files
        """
        logger.info("\n🧪 TEST CASES")
        logger.info("-"*60)

        test_files = {
            'good_match_pair.json': 'Example of good candidate-job match',
            'poor_match_pair.json': 'Example of poor match',
            'ml_job_description.json': 'ML job posting',
            'synthetic_resume.json': 'Generated resume',
            'junior_dev_resumes.json': 'Junior developer examples',
            'cloud_security_summaries.json': 'Cloud security examples'
        }

        for filename, description in test_files.items():
            file_path = self.test_cases_dir / filename

            if file_path.exists():
                try:
                    with open(file_path, 'r') as f:
                        data = json.load(f)

                    self.analysis['test_cases'][filename] = {
                        'description': description,
                        'structure': self._get_json_structure(data),
                        'status': 'found'
                    }

                    logger.info(f"✅ {filename}")
                    logger.info(f"   {description}")
                    logger.info(
                        f"   Structure: {self._format_structure(data)}")

                except Exception as e:
                    logger.warning(f"⚠️  {filename}: {e}")
            else:
                logger.info(f"❌ {filename}: Not found")

    def _get_json_structure(self, data):
        """Get structure of JSON data"""
        if isinstance(data, dict):
            return {k: type(v).__name__ for k, v in data.items()}
        elif isinstance(data, list):
            if len(data) > 0:
                return [self._get_json_structure(data[0])]
            return []
        return type(data).__name__

    def _format_structure(self, data):
        """Format structure for display"""
        if isinstance(data, dict):
            keys = list(data.keys())[:3]
            more = f" (+{len(data)-3} more)" if len(data) > 3 else ""
            return f"dict with {len(data)} keys: {', '.join(keys)}{more}"
        elif isinstance(data, list):
            return f"list with {len(data)} items"
        return type(data).__name__

    def generate_report(self):
        """
        Generate comprehensive analysis report
        """
        logger.info("\n" + "="*60)
        logger.info("ANALYSIS SUMMARY")
        logger.info("="*60)

        # Count found items
        datasets_found = sum(
            1 for d in self.analysis['datasets'].values() if d.get('status') == 'found')
        viz_found = sum(1 for v in self.analysis['visualizations'].values() if v.get(
            'status') == 'found')
        test_found = sum(
            1 for t in self.analysis['test_cases'].values() if t.get('status') == 'found')

        logger.info(
            f"\nDatasets: {datasets_found}/{len(self.analysis['datasets'])} found")
        logger.info(
            f"Visualizations: {viz_found}/{len(self.analysis['visualizations'])} found")
        logger.info(
            f"Test Cases: {test_found}/{len(self.analysis['test_cases'])} found")

        # Model summary
        if self.analysis['models']:
            logger.info("\nModel Information:")
            for model_name, model_info in self.analysis['models'].items():
                logger.info(f"  {model_name}:")
                logger.info(f"    Type: {model_info.get('type', 'Unknown')}")
                logger.info(
                    f"    Predictions: {model_info.get('predictions_count', 0)}")

        # Save report
        report_path = self.data_dir / 'reports' / 'analysis_report.json'
        report_path.parent.mkdir(parents=True, exist_ok=True)

        with open(report_path, 'w') as f:
            json.dump(self.analysis, f, indent=2)

        logger.info(f"\n✅ Full report saved to: {report_path}")

        # Generate recommendations
        self.generate_recommendations()

    def generate_recommendations(self):
        """
        Generate recommendations based on analysis
        """
        logger.info("\n💡 RECOMMENDATIONS")
        logger.info("-"*60)

        recommendations = []

        # Check for missing files
        missing_datasets = [
            k for k, v in self.analysis['datasets'].items() if v.get('status') != 'found']
        if missing_datasets:
            recommendations.append(
                f"Transfer missing datasets: {', '.join(missing_datasets)}")

        missing_viz = [k for k, v in self.analysis['visualizations'].items() if v.get(
            'status') != 'found']
        if missing_viz:
            recommendations.append(
                f"Transfer missing visualizations: {', '.join(missing_viz[:3])}")

        # Check for model files
        model_dir = self.data_dir / 'saved_models'
        if model_dir.exists():
            model_files = list(model_dir.glob('*.pkl')) + \
                list(model_dir.glob('*.h5'))
            if not model_files:
                recommendations.append(
                    "No trained model files (.pkl, .h5) found - transfer from Jupyter")

        # Check for required test cases
        if 'good_match_pair.json' not in self.analysis['test_cases']:
            recommendations.append(
                "Missing good_match_pair.json - needed for API testing")

        if not recommendations:
            logger.info("✅ All critical files present!")
            logger.info("\nNext steps:")
            logger.info("1. Extract model code from Jupyter notebooks")
            logger.info("2. Create training scripts in training/")
            logger.info("3. Build Flask API")
            logger.info("4. Test with good_match_pair.json")
        else:
            for i, rec in enumerate(recommendations, 1):
                logger.info(f"{i}. {rec}")


def main():
    """
    Main execution
    """
    analyzer = ModelAnalyzer()
    analysis = analyzer.analyze_all()

    print("\n✅ Analysis complete!")
    print(
        f"Report saved to: {Path(analyzer.data_dir) / 'reports' / 'analysis_report.json'}")


if __name__ == '__main__':
    main()
