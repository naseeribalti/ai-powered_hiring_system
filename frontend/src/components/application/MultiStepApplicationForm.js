import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MultiStepApplicationForm = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);

    const [formData, setFormData] = useState({
        // Step 1: Personal Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        linkedIn: '',
        portfolio: '',

        // Step 2: Education
        education: [{
            degree: '',
            institution: '',
            major: '',
            startDate: '',
            endDate: '',
            gpa: '',
        }],

        // Step 3: Experience
        experience: [{
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        }],

        // Step 4: Skills & Certifications
        skills: [],
        certifications: [{
            name: '',
            issuer: '',
            date: '',
        }],

        // Step 5: Cover Letter & Additional
        coverLetter: '',
        availabilityDate: '',
        salaryExpectation: '',
        willingToRelocate: false,
        requiresSponsorship: false,

        // Resume
        resumeId: null,
    });

    const totalSteps = 6;

    useEffect(() => {
        fetchJobDetails();
        loadDraftApplication();
        autoFillFromProfile();
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/jobs/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setJobDetails(data.job);
        } catch (error) {
            console.error('Error fetching job:', error);
            toast.error('Failed to load job details');
        }
    };

    const loadDraftApplication = () => {
        const draft = localStorage.getItem(`draft_application_${jobId}`);
        if (draft) {
            setFormData(JSON.parse(draft));
            toast.info('Draft application loaded');
        }
    };

    const autoFillFromProfile = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setFormData(prev => ({
            ...prev,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
        }));
    };

    const saveDraft = () => {
        localStorage.setItem(`draft_application_${jobId}`, JSON.stringify(formData));
        toast.success('Draft saved!');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addArrayItem = (section, template) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], template]
        }));
    };

    const removeArrayItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                    toast.error('Please fill all required fields');
                    return false;
                }
                if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
                    toast.error('Please enter a valid email');
                    return false;
                }
                break;
            case 2:
                if (formData.education[0].degree === '') {
                    toast.error('Please add at least one education entry');
                    return false;
                }
                break;
            case 3:
                if (formData.experience[0].title === '') {
                    toast.error('Please add at least one work experience');
                    return false;
                }
                break;
            case 4:
                if (formData.skills.length === 0) {
                    toast.error('Please add at least one skill');
                    return false;
                }
                break;
            case 5:
                if (!formData.coverLetter || formData.coverLetter.length < 50) {
                    toast.error('Cover letter must be at least 50 characters');
                    return false;
                }
                break;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            saveDraft();
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId,
                    ...formData
                })
            });

            if (!response.ok) throw new Error('Application failed');

            toast.success('Application submitted successfully!');
            localStorage.removeItem(`draft_application_${jobId}`);
            navigate('/applications');
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h4 className="mb-4">Personal Information</h4>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">First Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Phone *</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="City, Country"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">LinkedIn Profile</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="linkedIn"
                                    value={formData.linkedIn}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">Portfolio/Website</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h4 className="mb-4">Education Background</h4>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6>Education #{index + 1}</h6>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeArrayItem('education', index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Degree *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={edu.degree}
                                                onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                                placeholder="e.g., Bachelor's in Computer Science"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Institution *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={edu.institution}
                                                onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                                                placeholder="University name"
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Major</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={edu.major}
                                                onChange={(e) => handleArrayChange('education', index, 'major', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Start Date</label>
                                            <input
                                                type="month"
                                                className="form-control"
                                                value={edu.startDate}
                                                onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">End Date</label>
                                            <input
                                                type="month"
                                                className="form-control"
                                                value={edu.endDate}
                                                onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">GPA</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={edu.gpa}
                                                onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                                                placeholder="3.8/4.0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => addArrayItem('education', { degree: '', institution: '', major: '', startDate: '', endDate: '', gpa: '' })}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Add Another Education
                        </button>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h4 className="mb-4">Work Experience</h4>
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6>Experience #{index + 1}</h6>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeArrayItem('experience', index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Job Title *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={exp.title}
                                                onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Company *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={exp.company}
                                                onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={exp.location}
                                                onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-5 mb-3">
                                            <label className="form-label">Start Date</label>
                                            <input
                                                type="month"
                                                className="form-control"
                                                value={exp.startDate}
                                                onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-5 mb-3">
                                            <label className="form-label">End Date</label>
                                            <input
                                                type="month"
                                                className="form-control"
                                                value={exp.endDate}
                                                onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                                                disabled={exp.current}
                                            />
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label className="form-label">&nbsp;</label>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={exp.current}
                                                    onChange={(e) => handleArrayChange('experience', index, 'current', e.target.checked)}
                                                />
                                                <label className="form-check-label">Current</label>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={exp.description}
                                                onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                                                placeholder="Describe your responsibilities and achievements..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => addArrayItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' })}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Add Another Experience
                        </button>
                    </div>
                );

            case 4:
                return (
                    <div>
                        <h4 className="mb-4">Skills & Certifications</h4>
                        <div className="mb-4">
                            <label className="form-label">Skills (comma-separated)</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={formData.skills.join(', ')}
                                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                                placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
                            />
                            <small className="text-muted">Separate skills with commas</small>
                        </div>

                        <h5 className="mb-3">Certifications</h5>
                        {formData.certifications.map((cert, index) => (
                            <div key={index} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6>Certification #{index + 1}</h6>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeArrayItem('certifications', index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Certification Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={cert.name}
                                                onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Issuer</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={cert.issuer}
                                                onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="month"
                                                className="form-control"
                                                value={cert.date}
                                                onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '' })}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Add Certification
                        </button>
                    </div>
                );

            case 5:
                return (
                    <div>
                        <h4 className="mb-4">Cover Letter & Additional Information</h4>
                        <div className="mb-4">
                            <label className="form-label">Cover Letter *</label>
                            <textarea
                                className="form-control"
                                rows="6"
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                placeholder="Explain why you're interested in this position and what makes you a great fit..."
                                required
                            />
                            <small className="text-muted">{formData.coverLetter.length} characters (minimum 50)</small>
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Availability Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="availabilityDate"
                                    value={formData.availabilityDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Salary Expectation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="salaryExpectation"
                                    value={formData.salaryExpectation}
                                    onChange={handleChange}
                                    placeholder="e.g., $80,000 - $100,000"
                                />
                            </div>
                        </div>
                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="willingToRelocate"
                                checked={formData.willingToRelocate}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Willing to relocate</label>
                        </div>
                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="requiresSponsorship"
                                checked={formData.requiresSponsorship}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Requires visa sponsorship</label>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div>
                        <h4 className="mb-4">Review & Submit</h4>
                        <div className="alert alert-info">
                            <i className="fas fa-info-circle me-2"></i>
                            Please review your application before submitting. You can go back to edit any section.
                        </div>

                        <div className="card mb-3">
                            <div className="card-header">
                                <strong>Personal Information</strong>
                            </div>
                            <div className="card-body">
                                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                                <p><strong>Email:</strong> {formData.email}</p>
                                <p><strong>Phone:</strong> {formData.phone}</p>
                                {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
                            </div>
                        </div>

                        <div className="card mb-3">
                            <div className="card-header">
                                <strong>Education ({formData.education.filter(e => e.degree).length})</strong>
                            </div>
                            <div className="card-body">
                                {formData.education.filter(e => e.degree).map((edu, i) => (
                                    <div key={i} className="mb-2">
                                        <p className="mb-0"><strong>{edu.degree}</strong> - {edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card mb-3">
                            <div className="card-header">
                                <strong>Experience ({formData.experience.filter(e => e.title).length})</strong>
                            </div>
                            <div className="card-body">
                                {formData.experience.filter(e => e.title).map((exp, i) => (
                                    <div key={i} className="mb-2">
                                        <p className="mb-0"><strong>{exp.title}</strong> at {exp.company}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card mb-3">
                            <div className="card-header">
                                <strong>Skills ({formData.skills.length})</strong>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-2">
                                    {formData.skills.map((skill, i) => (
                                        <span key={i} className="badge bg-primary">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card mb-3">
                            <div className="card-header">
                                <strong>Cover Letter</strong>
                            </div>
                            <div className="card-body">
                                <p className="text-muted small">{formData.coverLetter.substring(0, 200)}...</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Job Header */}
                    {jobDetails && (
                        <div className="card mb-4 border-primary">
                            <div className="card-body">
                                <h3>{jobDetails.title}</h3>
                                <p className="text-muted mb-0">
                                    <i className="fas fa-building me-2"></i>
                                    {jobDetails.company} • {jobDetails.location}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                {[1, 2, 3, 4, 5, 6].map(step => (
                                    <div
                                        key={step}
                                        className={`text-center ${currentStep >= step ? 'text-primary' : 'text-muted'}`}
                                        style={{ flex: 1 }}
                                    >
                                        <div
                                            className={`rounded-circle d-inline-flex align-items-center justify-content-center ${currentStep >= step ? 'bg-primary text-white' : 'bg-light'}`}
                                            style={{ width: '40px', height: '40px' }}
                                        >
                                            {step < currentStep ? <i className="fas fa-check"></i> : step}
                                        </div>
                                        <div className="small mt-1">
                                            {step === 1 && 'Personal'}
                                            {step === 2 && 'Education'}
                                            {step === 3 && 'Experience'}
                                            {step === 4 && 'Skills'}
                                            {step === 5 && 'Cover Letter'}
                                            {step === 6 && 'Review'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="progress" style={{ height: '4px' }}>
                                <div
                                    className="progress-bar"
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {renderStep()}

                                {/* Navigation Buttons */}
                                <div className="d-flex justify-content-between mt-4 pt-4 border-top">
                                    <div>
                                        {currentStep > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={prevStep}
                                            >
                                                <i className="fas fa-arrow-left me-2"></i>
                                                Previous
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary me-2"
                                            onClick={saveDraft}
                                        >
                                            <i className="fas fa-save me-2"></i>
                                            Save Draft
                                        </button>
                                        {currentStep < totalSteps ? (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={nextStep}
                                            >
                                                Next
                                                <i className="fas fa-arrow-right ms-2"></i>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-paper-plane me-2"></i>
                                                        Submit Application
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiStepApplicationForm;
