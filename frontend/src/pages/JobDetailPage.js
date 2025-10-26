import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
    FaBriefcase,
    FaMapMarkerAlt,
    FaDollarSign,
    FaClock,
    FaBuilding,
    FaUserTie,
    FaCalendarAlt,
    FaUsers,
    FaCheckCircle,
    FaArrowLeft
} from 'react-icons/fa';
import '../styles/JobDetailPage.css';

// Using shared API client; baseURL is handled centrally

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        fetchJobDetails();
        if (user?.role === 'jobSeeker') {
            checkApplicationStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user]);

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/jobs/${id}`);
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

    const checkApplicationStatus = async () => {
        try {
            const response = await api.get('/applications');
            const applications = response.data;
            const applied = applications.some(app => app.job._id === id || app.job === id);
            setHasApplied(applied);
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    const handleQuickApply = async () => {
        if (hasApplied) {
            toast.info('You have already applied to this job');
            return;
        }

        setApplying(true);
        try {
            await api.post('/applications', { jobId: id });
            toast.success('Application submitted successfully!');
            setHasApplied(true);
            navigate('/applications');
        } catch (error) {
            console.error('Error applying to job:', error);
            const message = error.response?.data?.message || 'Failed to submit application';
            toast.error(message);
        } finally {
            setApplying(false);
        }
    };

    const handleDetailedApply = () => {
        navigate(`/jobs/${id}/apply`);
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

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Competitive';
        if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        if (min) return `$${min.toLocaleString()}+`;
        return `Up to $${max.toLocaleString()}`;
    };

    const getEmploymentTypeLabel = (type) => {
        const types = {
            'full-time': 'Full Time',
            'part-time': 'Part Time',
            'contract': 'Contract',
            'internship': 'Internship'
        };
        return types[type] || type;
    };

    const getExperienceLevelLabel = (level) => {
        const levels = {
            'entry': 'Entry Level',
            'mid': 'Mid Level',
            'senior': 'Senior Level',
            'lead': 'Lead',
            'executive': 'Executive'
        };
        return levels[level] || level;
    };

    return (
        <div className="job-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb-nav">
                    <Link to="/dashboard" className="breadcrumb-link">
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/jobs" className="breadcrumb-link">Jobs</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{job.title}</span>
                </nav>

                <div className="row">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        {/* Job Header */}
                        <div className="job-header-card">
                            <div className="company-logo">
                                <div className="company-logo-placeholder">
                                    <FaBuilding />
                                </div>
                            </div>
                            <div className="job-header-info">
                                <h1 className="job-title">{job.title}</h1>
                                <div className="company-info">
                                    <FaBuilding className="icon" />
                                    <span>{job.company}</span>
                                </div>
                                <div className="job-meta">
                                    <span className="meta-item">
                                        <FaMapMarkerAlt className="icon" />
                                        {job.location}
                                    </span>
                                    <span className="meta-item">
                                        <FaBriefcase className="icon" />
                                        {getEmploymentTypeLabel(job.jobType)}
                                    </span>
                                    <span className="meta-item">
                                        <FaDollarSign className="icon" />
                                        {formatSalary(job.salary?.min, job.salary?.max)}
                                    </span>
                                    <span className="meta-item">
                                        <FaUserTie className="icon" />
                                        {getExperienceLevelLabel(job.experienceLevel)}
                                    </span>
                                </div>
                                <div className="job-tags">
                                    {job.status === 'active' && (
                                        <span className="badge badge-success">
                                            <FaCheckCircle /> Active
                                        </span>
                                    )}
                                    {job.jobType === 'remote' && (
                                        <span className="badge badge-info">Remote</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="job-section">
                            <h2 className="section-title">Job Description</h2>
                            <div className="section-content">
                                <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
                            </div>
                        </div>

                        {/* Requirements */}
                        {job.requirements && (
                            <div className="job-section">
                                <h2 className="section-title">Requirements</h2>
                                <div className="section-content">
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                            <div className="job-section">
                                <h2 className="section-title">Required Skills</h2>
                                <div className="skills-container">
                                    {job.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        {/* Apply Card */}
                        {user?.role === 'jobSeeker' && (
                            <div className="apply-card sticky-sidebar">
                                {hasApplied ? (
                                    <div className="applied-status">
                                        <FaCheckCircle className="success-icon" />
                                        <h3>Already Applied</h3>
                                        <p>You have already submitted an application for this position</p>
                                        <Link to="/applications" className="btn btn-outline-primary btn-block">
                                            View My Applications
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <h3>Apply for this position</h3>
                                        <p className="apply-description">
                                            Choose how you'd like to apply:
                                        </p>
                                        <button
                                            className="btn btn-primary btn-block mb-3"
                                            onClick={handleQuickApply}
                                            disabled={applying}
                                        >
                                            {applying ? 'Submitting...' : 'Quick Apply'}
                                        </button>
                                        <button
                                            className="btn btn-outline-primary btn-block"
                                            onClick={handleDetailedApply}
                                        >
                                            Detailed Application
                                        </button>
                                        <small className="text-muted mt-2 d-block">
                                            Quick Apply uses your profile information
                                        </small>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Job Info Card */}
                        <div className="info-card">
                            <h3>Job Information</h3>
                            <div className="info-item">
                                <FaCalendarAlt className="icon" />
                                <div>
                                    <strong>Posted</strong>
                                    <p>{new Date(job.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <FaClock className="icon" />
                                <div>
                                    <strong>Expires</strong>
                                    <p>
                                        {job.expiresAt
                                            ? new Date(job.expiresAt).toLocaleDateString()
                                            : 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            <div className="info-item">
                                <FaUsers className="icon" />
                                <div>
                                    <strong>Applicants</strong>
                                    <p>{job.applications?.length || 0} applied</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <FaMapMarkerAlt className="icon" />
                                <div>
                                    <strong>Location</strong>
                                    <p>{job.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Company Card */}
                        <div className="info-card">
                            <h3>About {job.company}</h3>
                            <p>Posted by: {job.postedBy?.firstName} {job.postedBy?.lastName}</p>
                            {job.postedBy?.email && (
                                <p>Contact: {job.postedBy.email}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailPage;
