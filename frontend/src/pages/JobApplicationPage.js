import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
    FaArrowLeft,
    FaArrowRight,
    FaCheckCircle,
    FaBriefcase,
    FaUser,
    FaGraduationCap,
    FaFileAlt,
    FaQuestionCircle
} from 'react-icons/fa';
import '../styles/JobApplicationPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const JobApplicationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    // Form data
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',

        // Professional Information
        currentJobTitle: '',
        yearsOfExperience: '',
        expectedSalary: '',
        noticePeriod: '',

        // Education
        highestDegree: '',
        fieldOfStudy: '',
        university: '',
        graduationYear: '',

        // Additional Information
        coverLetter: '',
        portfolio: '',
        linkedin: '',
        github: '',

        // Questions
        whyInterested: '',
        availability: '',
        specializations: []
    });

    useEffect(() => {
        fetchJobDetails();
        loadUserProfile();
        loadFromLocalStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Auto-save to localStorage
    useEffect(() => {
        const saveData = setTimeout(() => {
            localStorage.setItem(`job_application_${id}`, JSON.stringify(formData));
        }, 1000);
        return () => clearTimeout(saveData);
    }, [formData, id]);

    const fetchJobDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Backend returns { job: {...} }
            setJob(response.data.job || response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
            toast.error('Failed to load job details');
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const loadUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const profile = response.data;

            setFormData(prev => ({
                ...prev,
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                location: profile.location || '',
                linkedin: profile.linkedin || '',
                github: profile.github || '',
                portfolio: profile.portfolio || ''
            }));
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }; const loadFromLocalStorage = () => {
        const savedData = localStorage.getItem(`job_application_${id}`);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(prev => ({ ...prev, ...parsed }));
                toast.success('Draft application loaded');
            } catch (error) {
                console.error('Error parsing saved data:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecializationChange = (e) => {
        const value = e.target.value;
        const specializations = value.split(',').map(s => s.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, specializations }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                    toast.error('Please fill in all required personal information');
                    return false;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    toast.error('Please enter a valid email address');
                    return false;
                }
                return true;
            case 2:
                if (!formData.currentJobTitle || !formData.yearsOfExperience) {
                    toast.error('Please fill in your professional information');
                    return false;
                }
                return true;
            case 3:
                if (!formData.highestDegree || !formData.fieldOfStudy) {
                    toast.error('Please fill in your education details');
                    return false;
                }
                return true;
            case 4:
                if (!formData.coverLetter || formData.coverLetter.length < 100) {
                    toast.error('Cover letter should be at least 100 characters');
                    return false;
                }
                return true;
            case 5:
                if (!formData.whyInterested) {
                    toast.error('Please answer why you\'re interested in this position');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/applications`,
                {
                    jobId: id,
                    applicationData: formData
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Clear saved draft
            localStorage.removeItem(`job_application_${id}`);

            toast.success('Application submitted successfully!');
            navigate('/applications');
        } catch (error) {
            console.error('Error submitting application:', error);
            const message = error.response?.data?.message || 'Failed to submit application';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!job) {
        return (
            <div className="container mt-5 text-center">
                <h2>Job not found</h2>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/jobs')}>
                    Back to Jobs
                </button>
            </div>
        );
    }

    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="job-application-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb-nav">
                    <Link to="/jobs" className="breadcrumb-link">
                        <FaArrowLeft /> Back to Jobs
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to={`/jobs/${id}`} className="breadcrumb-link">{job.title}</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Apply</span>
                </nav>

                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        {/* Application Header */}
                        <div className="application-header">
                            <h1>Apply for {job.title}</h1>
                            <p className="company-name">{job.company}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <div className="progress-steps">
                                {[1, 2, 3, 4, 5].map(step => (
                                    <div
                                        key={step}
                                        className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                                    >
                                        {currentStep > step ? <FaCheckCircle /> : step}
                                    </div>
                                ))}
                            </div>
                            <div className="progress-labels">
                                <span>Personal</span>
                                <span>Professional</span>
                                <span>Education</span>
                                <span>Documents</span>
                                <span>Review</span>
                            </div>
                        </div>

                        {/* Application Form */}
                        <form onSubmit={handleSubmit} className="application-form">
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="form-step">
                                    <div className="step-header">
                                        <FaUser className="step-icon" />
                                        <h2>Personal Information</h2>
                                        <p>Tell us about yourself</p>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>First Name *</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    className="form-control"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Last Name *</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    className="form-control"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Location *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            placeholder="City, Country"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Professional Information */}
                            {currentStep === 2 && (
                                <div className="form-step">
                                    <div className="step-header">
                                        <FaBriefcase className="step-icon" />
                                        <h2>Professional Information</h2>
                                        <p>Share your work experience</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Current Job Title *</label>
                                        <input
                                            type="text"
                                            name="currentJobTitle"
                                            className="form-control"
                                            value={formData.currentJobTitle}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Years of Experience *</label>
                                        <select
                                            name="yearsOfExperience"
                                            className="form-control"
                                            value={formData.yearsOfExperience}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="0-1">0-1 years</option>
                                            <option value="1-3">1-3 years</option>
                                            <option value="3-5">3-5 years</option>
                                            <option value="5-7">5-7 years</option>
                                            <option value="7-10">7-10 years</option>
                                            <option value="10+">10+ years</option>
                                        </select>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Expected Salary</label>
                                                <input
                                                    type="text"
                                                    name="expectedSalary"
                                                    className="form-control"
                                                    placeholder="e.g., $80,000 - $100,000"
                                                    value={formData.expectedSalary}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Notice Period</label>
                                                <select
                                                    name="noticePeriod"
                                                    className="form-control"
                                                    value={formData.noticePeriod}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="immediate">Immediate</option>
                                                    <option value="1-week">1 week</option>
                                                    <option value="2-weeks">2 weeks</option>
                                                    <option value="1-month">1 month</option>
                                                    <option value="2-months">2 months</option>
                                                    <option value="3-months">3 months</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Specializations</label>
                                        <input
                                            type="text"
                                            name="specializations"
                                            className="form-control"
                                            placeholder="e.g., React, Node.js, AWS (comma-separated)"
                                            value={formData.specializations.join(', ')}
                                            onChange={handleSpecializationChange}
                                        />
                                        <small className="form-text text-muted">
                                            Enter your key skills separated by commas
                                        </small>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Education */}
                            {currentStep === 3 && (
                                <div className="form-step">
                                    <div className="step-header">
                                        <FaGraduationCap className="step-icon" />
                                        <h2>Education</h2>
                                        <p>Tell us about your academic background</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Highest Degree *</label>
                                        <select
                                            name="highestDegree"
                                            className="form-control"
                                            value={formData.highestDegree}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="high-school">High School</option>
                                            <option value="associate">Associate Degree</option>
                                            <option value="bachelor">Bachelor's Degree</option>
                                            <option value="master">Master's Degree</option>
                                            <option value="phd">Ph.D.</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Field of Study *</label>
                                        <input
                                            type="text"
                                            name="fieldOfStudy"
                                            className="form-control"
                                            placeholder="e.g., Computer Science"
                                            value={formData.fieldOfStudy}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>University/Institution</label>
                                        <input
                                            type="text"
                                            name="university"
                                            className="form-control"
                                            value={formData.university}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Graduation Year</label>
                                        <input
                                            type="number"
                                            name="graduationYear"
                                            className="form-control"
                                            min="1950"
                                            max={new Date().getFullYear() + 10}
                                            value={formData.graduationYear}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Documents & Links */}
                            {currentStep === 4 && (
                                <div className="form-step">
                                    <div className="step-header">
                                        <FaFileAlt className="step-icon" />
                                        <h2>Documents & Additional Information</h2>
                                        <p>Showcase your work and tell us more</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Cover Letter *</label>
                                        <textarea
                                            name="coverLetter"
                                            className="form-control"
                                            rows="6"
                                            placeholder="Tell us why you're the perfect fit for this role..."
                                            value={formData.coverLetter}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <small className="form-text text-muted">
                                            {formData.coverLetter.length}/100 characters minimum
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label>Portfolio URL</label>
                                        <input
                                            type="url"
                                            name="portfolio"
                                            className="form-control"
                                            placeholder="https://your-portfolio.com"
                                            value={formData.portfolio}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>LinkedIn Profile</label>
                                                <input
                                                    type="url"
                                                    name="linkedin"
                                                    className="form-control"
                                                    placeholder="https://linkedin.com/in/..."
                                                    value={formData.linkedin}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>GitHub Profile</label>
                                                <input
                                                    type="url"
                                                    name="github"
                                                    className="form-control"
                                                    placeholder="https://github.com/..."
                                                    value={formData.github}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Review & Questions */}
                            {currentStep === 5 && (
                                <div className="form-step">
                                    <div className="step-header">
                                        <FaQuestionCircle className="step-icon" />
                                        <h2>Final Questions</h2>
                                        <p>A few more details before you submit</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Why are you interested in this position? *</label>
                                        <textarea
                                            name="whyInterested"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Share your motivation for applying..."
                                            value={formData.whyInterested}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>When can you start?</label>
                                        <input
                                            type="text"
                                            name="availability"
                                            className="form-control"
                                            placeholder="e.g., Immediately, 2 weeks notice, etc."
                                            value={formData.availability}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Application Summary */}
                                    <div className="application-summary">
                                        <h3>Application Summary</h3>
                                        <div className="summary-grid">
                                            <div className="summary-item">
                                                <strong>Name:</strong>
                                                <span>{formData.firstName} {formData.lastName}</span>
                                            </div>
                                            <div className="summary-item">
                                                <strong>Email:</strong>
                                                <span>{formData.email}</span>
                                            </div>
                                            <div className="summary-item">
                                                <strong>Current Role:</strong>
                                                <span>{formData.currentJobTitle}</span>
                                            </div>
                                            <div className="summary-item">
                                                <strong>Experience:</strong>
                                                <span>{formData.yearsOfExperience}</span>
                                            </div>
                                            <div className="summary-item">
                                                <strong>Education:</strong>
                                                <span>{formData.highestDegree} in {formData.fieldOfStudy}</span>
                                            </div>
                                            <div className="summary-item">
                                                <strong>Location:</strong>
                                                <span>{formData.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="form-navigation">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={prevStep}
                                    >
                                        <FaArrowLeft /> Previous
                                    </button>
                                )}
                                {currentStep < totalSteps ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary ml-auto"
                                        onClick={nextStep}
                                    >
                                        Next <FaArrowRight />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn btn-success ml-auto"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationPage;
