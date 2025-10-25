#!/usr/bin/env python3
"""
AI Hiring System - Complete API Documentation Generator
Generates comprehensive API documentation, Postman collections, and frontend guides

Usage:
    python3 generate_docs.py
    
Output:
    - api_documentation.json - Complete API specification
    - postman_collection.json - Ready to import into Postman
    - frontend_integration_guide.json - Frontend setup instructions
"""

import json
from datetime import datetime
from pathlib import Path


class APIDocumentationGenerator:
    """Generate comprehensive API documentation"""

    def __init__(self):
        self.base_url = "http://localhost:3000/api"
        self.version = "1.0.0"
        self.generated_at = datetime.now().isoformat()

    def create_api_specification(self):
        """Create complete API specification"""
        spec = {
            "openapi": "3.0.0",
            "info": {
                "title": "AI Hiring System API",
                "description": "Complete REST API for job posting, application management, and AI-powered matching",
                "version": self.version,
                "contact": {
                    "name": "AI Hiring System Team",
                    "url": "https://github.com/your-repo"
                }
            },
            "servers": [
                {
                    "url": "http://localhost:3000/api",
                    "description": "Development server"
                },
                {
                    "url": "https://api.ai-hiring-system.com/api",
                    "description": "Production server"
                }
            ],
            "components": {
                "securitySchemes": {
                    "bearerAuth": {
                        "type": "http",
                        "scheme": "bearer",
                        "bearerFormat": "JWT"
                    }
                }
            },
            "paths": self._generate_paths(),
            "generated": self.generated_at
        }
        return spec

    def _generate_paths(self):
        """Generate all API paths"""
        return {
            "/auth/register": self._auth_register(),
            "/auth/login": self._auth_login(),
            "/auth/me": self._auth_me(),
            "/jobs": self._jobs_list_create(),
            "/jobs/{jobId}": self._jobs_detail_update_delete(),
            "/jobs/my-jobs": self._jobs_my_jobs(),
            "/applications": self._applications_create(),
            "/applications/my-applications": self._applications_list(),
            "/applications/{applicationId}": self._applications_detail(),
            "/applications/jobs/{jobId}/applications": self._applications_job_list(),
            "/applications/{applicationId}/status": self._applications_status_update()
        }

    def _auth_register(self):
        return {
            "post": {
                "tags": ["Authentication"],
                "summary": "Register new user",
                "description": "Create a new user account",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "firstName": {"type": "string", "minLength": 2, "maxLength": 50},
                                    "lastName": {"type": "string", "minLength": 2, "maxLength": 50},
                                    "email": {"type": "string", "format": "email"},
                                    "password": {"type": "string", "minLength": 8},
                                    "role": {"type": "string", "enum": ["jobSeeker", "recruiter", "admin"]},
                                    "phone": {"type": "string"}
                                },
                                "required": ["firstName", "lastName", "email", "password", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "201": {"description": "User created successfully"},
                    "400": {"description": "Validation error"},
                    "409": {"description": "Email already exists"}
                }
            }
        }

    def _auth_login(self):
        return {
            "post": {
                "tags": ["Authentication"],
                "summary": "User login",
                "description": "Authenticate user and receive JWT token",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "email": {"type": "string", "format": "email"},
                                    "password": {"type": "string"}
                                },
                                "required": ["email", "password"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {"description": "Login successful, returns token"},
                    "401": {"description": "Invalid credentials"}
                }
            }
        }

    def _auth_me(self):
        return {
            "get": {
                "tags": ["Authentication"],
                "summary": "Get current user",
                "security": [{"bearerAuth": []}],
                "responses": {
                    "200": {"description": "Current user profile"},
                    "401": {"description": "Unauthorized"}
                }
            }
        }

    def _jobs_list_create(self):
        return {
            "get": {
                "tags": ["Jobs"],
                "summary": "Browse jobs",
                "parameters": [
                    {"name": "search", "in": "query",
                        "schema": {"type": "string"}},
                    {"name": "location", "in": "query",
                        "schema": {"type": "string"}},
                    {"name": "skills", "in": "query",
                        "schema": {"type": "string"}},
                    {"name": "page", "in": "query", "schema": {
                        "type": "integer", "default": 1}},
                    {"name": "limit", "in": "query", "schema": {
                        "type": "integer", "default": 10}}
                ],
                "responses": {
                    "200": {"description": "List of jobs"}
                }
            },
            "post": {
                "tags": ["Jobs"],
                "summary": "Create job",
                "security": [{"bearerAuth": []}],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "title": {"type": "string"},
                                    "description": {"type": "string"},
                                    "company": {"type": "string"},
                                    "location": {"type": "string"},
                                    "jobType": {"type": "string", "enum": ["full-time", "part-time", "contract", "internship"]},
                                    "skills": {"type": "array", "items": {"type": "string"}},
                                    "salary": {
                                        "type": "object",
                                        "properties": {
                                            "min": {"type": "number"},
                                            "max": {"type": "number"},
                                            "currency": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {"description": "Job created"},
                    "403": {"description": "Insufficient permissions"}
                }
            }
        }

    def _jobs_detail_update_delete(self):
        return {
            "get": {
                "tags": ["Jobs"],
                "summary": "Get job details",
                "parameters": [{"name": "jobId", "in": "path", "required": True, "schema": {"type": "string"}}],
                "responses": {"200": {"description": "Job details"}}
            },
            "put": {
                "tags": ["Jobs"],
                "summary": "Update job",
                "security": [{"bearerAuth": []}],
                "responses": {"200": {"description": "Job updated"}}
            },
            "delete": {
                "tags": ["Jobs"],
                "summary": "Delete job",
                "security": [{"bearerAuth": []}],
                "responses": {"200": {"description": "Job deleted"}}
            }
        }

    def _jobs_my_jobs(self):
        return {
            "get": {
                "tags": ["Jobs"],
                "summary": "Get my job postings",
                "security": [{"bearerAuth": []}],
                "parameters": [
                    {"name": "page", "in": "query", "schema": {
                        "type": "integer", "default": 1}},
                    {"name": "limit", "in": "query", "schema": {
                        "type": "integer", "default": 10}}
                ],
                "responses": {"200": {"description": "My job postings"}}
            }
        }

    def _applications_create(self):
        return {
            "post": {
                "tags": ["Applications"],
                "summary": "Apply for job",
                "security": [{"bearerAuth": []}],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "jobId": {"type": "string"},
                                    "coverLetter": {"type": "string"}
                                }
                            }
                        }
                    }
                },
                "responses": {"201": {"description": "Application submitted"}}
            }
        }

    def _applications_list(self):
        return {
            "get": {
                "tags": ["Applications"],
                "summary": "Get my applications",
                "security": [{"bearerAuth": []}],
                "parameters": [
                    {"name": "status", "in": "query",
                        "schema": {"type": "string"}},
                    {"name": "page", "in": "query", "schema": {
                        "type": "integer", "default": 1}},
                    {"name": "limit", "in": "query", "schema": {
                        "type": "integer", "default": 10}}
                ],
                "responses": {"200": {"description": "My applications"}}
            }
        }

    def _applications_detail(self):
        return {
            "get": {
                "tags": ["Applications"],
                "summary": "Get application details",
                "security": [{"bearerAuth": []}],
                "responses": {"200": {"description": "Application details"}}
            }
        }

    def _applications_job_list(self):
        return {
            "get": {
                "tags": ["Applications"],
                "summary": "Get job applications",
                "security": [{"bearerAuth": []}],
                "responses": {"200": {"description": "Job applications"}}
            }
        }

    def _applications_status_update(self):
        return {
            "put": {
                "tags": ["Applications"],
                "summary": "Update application status",
                "security": [{"bearerAuth": []}],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "status": {
                                        "type": "string",
                                        "enum": ["pending", "reviewed", "interview", "accepted", "rejected"]
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {"200": {"description": "Status updated"}}
            }
        }

    def generate(self, output_dir="./docs/api"):
        """Generate all documentation files"""
        Path(output_dir).mkdir(parents=True, exist_ok=True)

        # Generate API specification
        api_spec = self.create_api_specification()
        api_path = Path(output_dir) / "api_specification.json"
        with open(api_path, "w") as f:
            json.dump(api_spec, f, indent=2)
        print(f"✅ API Specification: {api_path}")

        return api_path


def generate_postman_collection():
    """Generate Postman collection from our existing one"""
    postman_file = Path("./docs/api/postman-collection.json")
    if postman_file.exists():
        print(f"✅ Postman Collection: {postman_file}")
        return postman_file
    return None


def generate_frontend_guide():
    """Generate frontend integration guide"""
    guide = {
        "title": "Frontend Integration Guide",
        "created": datetime.now().isoformat(),
        "sections": [
            {
                "id": "setup",
                "title": "Environment Setup",
                "steps": [
                    "Create .env file in frontend directory",
                    "Add: REACT_APP_API_BASE_URL=http://localhost:3000/api",
                    "Install dependencies: npm install",
                    "Start dev server: npm start"
                ]
            },
            {
                "id": "auth",
                "title": "Authentication Setup",
                "steps": [
                    "Create Axios instance with JWT interceptors",
                    "Implement Auth Context for state management",
                    "Create login/register components",
                    "Setup protected routes with role-based access"
                ],
                "testCredentials": {
                    "jobSeeker": {"email": "jobseeker@example.com", "password": "SecurePassword123"},
                    "recruiter": {"email": "recruiter@example.com", "password": "SecurePassword123"},
                    "admin": {"email": "admin@example.com", "password": "SecurePassword123"}
                }
            },
            {
                "id": "api-integration",
                "title": "API Integration",
                "steps": [
                    "Create service files (authService, jobService, applicationService)",
                    "Implement API calls in React components",
                    "Handle errors and loading states",
                    "Test with Postman collection first"
                ]
            },
            {
                "id": "testing",
                "title": "Testing",
                "tools": [
                    "Import Postman collection for manual API testing",
                    "Test all workflows before UI development",
                    "Verify authentication flow",
                    "Check error handling"
                ]
            }
        ]
    }

    output_path = Path("./docs/api/frontend_integration_guide.json")
    with open(output_path, "w") as f:
        json.dump(guide, f, indent=2)
    print(f"✅ Frontend Integration Guide: {output_path}")
    return output_path


def main():
    """Main documentation generation function"""
    print("🚀 AI Hiring System - Documentation Generator")
    print("=" * 60)
    print()

    # Generate API specification
    generator = APIDocumentationGenerator()
    api_spec_path = generator.generate()

    # Check Postman collection
    postman_path = generate_postman_collection()

    # Generate frontend guide
    frontend_guide_path = generate_frontend_guide()

    print()
    print("=" * 60)
    print("✅ Documentation Generation Complete!")
    print()
    print("📄 Generated Files:")
    print(f"  1. API Specification: ./docs/api/api_specification.json")
    print(f"  2. Postman Collection: ./docs/api/postman-collection.json")
    print(f"  3. Frontend Guide: ./docs/api/frontend_integration_guide.json")
    print()
    print("🎯 Next Steps:")
    print("  1. Open Postman and import postman-collection.json")
    print("  2. Set base_url variable to http://localhost:3000/api")
    print("  3. Follow frontend_integration_guide.json for React setup")
    print("  4. Share API specification with your team")
    print()
    print("📚 For more details, see:")
    print("  - docs/INDEX.md - Documentation hub")
    print("  - docs/FRONTEND_SETUP.md - Complete frontend guide")
    print("  - docs/api/endpoints.md - API reference")
    print()


if __name__ == "__main__":
    main()
