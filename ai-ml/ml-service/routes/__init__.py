"""
API routes module
"""
from .resume_routes import resume_bp
from .job_routes import job_bp

__all__ = ['resume_bp', 'job_bp']
