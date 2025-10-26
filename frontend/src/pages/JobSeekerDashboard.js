import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/jobseeker/ResumeUpload';
import JobRecommendations from '../components/jobseeker/JobRecommendations';

const JobSeekerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userSkills, setUserSkills] = useState([]);

    const stats = {
        availableJobs: 247,
        myApplications: 0,
        interviewsScheduled: 0,
        profileViews: 0
    };

    return (
        <div className="container-fluid py-4">
            {/* Welcome Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card bg-gradient-primary text-white">
                        <div className="card-body">
                            <h2 className="mb-2">
                                <i className="fas fa-sun me-2"></i>
                                Welcome back, {user?.firstName}!
                            </h2>
                            <p className="mb-0 opacity-75">
                                Your AI-powered job search companion is ready to help you find your dream job.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm border-start border-primary border-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0 text-primary">{stats.availableJobs}</h3>
                                    <small className="text-muted">Available Jobs</small>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded">
                                    <i className="fas fa-briefcase fa-2x text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm border-start border-success border-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0 text-success">{stats.myApplications}</h3>
                                    <small className="text-muted">Applications Sent</small>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded">
                                    <i className="fas fa-file-alt fa-2x text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm border-start border-info border-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0 text-info">{stats.interviewsScheduled}</h3>
                                    <small className="text-muted">Interviews</small>
                                </div>
                                <div className="bg-info bg-opacity-10 p-3 rounded">
                                    <i className="fas fa-calendar-check fa-2x text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm border-start border-warning border-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0 text-warning">{stats.profileViews}</h3>
                                    <small className="text-muted">Profile Views</small>
                                </div>
                                <div className="bg-warning bg-opacity-10 p-3 rounded">
                                    <i className="fas fa-eye fa-2x text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="row">
                {/* Left Column - Resume & Recommendations */}
                <div className="col-lg-8 mb-4">
                    {/* Resume Upload */}
                    <div className="mb-4">
                        <ResumeUpload
                            onUploadSuccess={(data) => {
                                setUserSkills(data.skills.map(s => s.name));
                            }}
                        />
                    </div>

                    {/* AI Job Recommendations */}
                    <div className="mb-4">
                        <JobRecommendations userSkills={userSkills} />
                    </div>
                </div>

                {/* Right Column - Applications & Actions */}
                <div className="col-lg-4 mb-4">
                    {/* My Applications Summary */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0">
                                <i className="fas fa-file-alt me-2"></i>
                                My Applications
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-4">
                                <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                                <p className="text-muted mb-3">No applications yet</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/jobs')}
                                >
                                    <i className="fas fa-search me-2"></i>
                                    Browse Jobs
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-warning text-dark">
                            <h6 className="mb-0">
                                <i className="fas fa-bolt me-2"></i>
                                Quick Actions
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/jobs')}
                                >
                                    <i className="fas fa-search me-2"></i>
                                    Browse All Jobs
                                </button>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => navigate('/applications')}
                                >
                                    <i className="fas fa-file-alt me-2"></i>
                                    My Applications
                                </button>
                                <button
                                    className="btn btn-outline-success"
                                    onClick={() => navigate('/profile')}
                                >
                                    <i className="fas fa-user me-2"></i>
                                    Update Profile
                                </button>
                                <button
                                    className="btn btn-outline-info"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                >
                                    <i className="fas fa-robot me-2"></i>
                                    AI Resume Scan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tips Card */}
                    <div className="card shadow-sm border-primary">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0">
                                <i className="fas fa-lightbulb me-2"></i>
                                Quick Tips
                            </h6>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0 small">
                                <li className="mb-2">
                                    <i className="fas fa-check-circle text-success me-2"></i>
                                    Upload your resume to get AI-powered recommendations
                                </li>
                                <li className="mb-2">
                                    <i className="fas fa-check-circle text-success me-2"></i>
                                    Update your profile regularly to match more jobs
                                </li>
                                <li className="mb-2">
                                    <i className="fas fa-check-circle text-success me-2"></i>
                                    Apply to jobs with 80%+ match score for best results
                                </li>
                                <li className="mb-0">
                                    <i className="fas fa-check-circle text-success me-2"></i>
                                    Customize your cover letter for each application
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
