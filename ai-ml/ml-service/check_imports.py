"""
Quick import test to check for errors
"""
import sys

print("Testing imports...")
print("-" * 50)

try:
    from parsers.resume_parser import ResumeParser
    print("✓ ResumeParser imported successfully")
except Exception as e:
    print(f"✗ ResumeParser import failed: {e}")
    sys.exit(1)

try:
    from extractors.skill_extractor import SkillExtractor
    print("✓ SkillExtractor imported successfully")
except Exception as e:
    print(f"✗ SkillExtractor import failed: {e}")
    sys.exit(1)

try:
    from scorers.resume_scorer import ResumeScorer
    print("✓ ResumeScorer imported successfully")
except Exception as e:
    print(f"✗ ResumeScorer import failed: {e}")
    sys.exit(1)

try:
    from routes.resume_routes import resume_bp
    print("✓ resume_routes imported successfully")
except Exception as e:
    print(f"✗ resume_routes import failed: {e}")
    sys.exit(1)

try:
    from routes.job_routes import job_bp
    print("✓ job_routes imported successfully")
except Exception as e:
    print(f"✗ job_routes import failed: {e}")
    sys.exit(1)

try:
    from flask import Flask
    print("✓ Flask imported successfully")
except Exception as e:
    print(f"✗ Flask import failed: {e}")
    print("  Run: pip install -r requirements.txt")
    sys.exit(1)

print("-" * 50)
print("✓ All imports successful!")
print("\nYou can now run: python app.py")
