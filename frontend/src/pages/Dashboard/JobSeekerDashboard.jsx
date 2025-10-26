// JobSeekerDashboard.jsx - Professional Job Seeker Interface
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './components/StatsCard';
import JobCard from './components/JobCard';
import ApplicationCard from './components/ApplicationCard';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';

const JobSeekerDashboard = ({ data, user }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const { availableJobs = [], myApplications = [], stats = {} } = data;

    // Calculate additional metrics
    const recentJobs = availableJobs.slice(0, 6);
    const interviewApplications = myApplications.filter(app => app.status === 'interview');

    // Quick actions for job seekers
    const quickActions = [
        {
            title: 'Browse Jobs',
            icon: 'fas fa-search',
            color: 'primary',
            action: () => navigate('/jobs'),
            description: 'Discover new job opportunities'
        },
        {
            title: 'Update Profile',
            icon: 'fas fa-user-edit',
            color: 'success',
            action: () => navigate('/profile'),
            description: 'Keep your profile up to date'
        },
        {
            title: 'Upload Resume',
            icon: 'fas fa-file-upload',
            color: 'info',
            action: () => navigate('/resume'),
            description: 'Upload or update your resume'
        },
        {
            title: 'AI Recommendations',
            icon: 'fas fa-robot',
            color: 'warning',
            action: () => navigate('/recommendations'),
            description: 'Get AI-powered job suggestions'
        }
    ];

    // Stats cards data
    const statsCards = [
        {
            title: 'Available Jobs',
            value: stats.totalJobs || 0,
            icon: 'fas fa-briefcase',
            color: 'primary',
            trend: { value: '+25%', direction: 'up' },
            description: 'New jobs posted this week'
        },
        {
            title: 'My Applications',
            value: stats.myApplications || 0,
            icon: 'fas fa-file-alt',
            color: 'success',
            trend: { value: '+3', direction: 'up' },
            description: 'Total applications submitted'
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingApplications || 0,
            icon: 'fas fa-clock',
            color: 'warning',
            trend: { value: '2 new', direction: 'up' },
            description: 'Applications under review'
        },
        {
            title: 'Interview Invites',
            value: interviewApplications.length,
            icon: 'fas fa-handshake',
            color: 'info',
            trend: { value: '+1', direction: 'up' },
            description: 'Interview opportunities'
        }
    ];

    // Recent activity data
    const recentActivity = [
        ...myApplications.slice(0, 3).map(app => ({
            type: 'application',
            title: 'Application Status Update',
            description: `Your application for ${app.job?.title} is now ${app.status}`,
            time: new Date(app.appliedAt).toLocaleDateString(),
            icon: 'fas fa-file-alt',
            color: app.status === 'accepted' ? 'success' : app.status === 'interview' ? 'info' : 'warning'
        })),
        ...recentJobs.slice(0, 3).map(job => ({
            type: 'job',
            title: 'New Job Match',
            description: `${job.title} at ${job.company} matches your profile`,
            time: new Date(job.createdAt).toLocaleDateString(),
            icon: 'fas fa-star',
            color: 'primary'
        }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

    // Recommended jobs (mock AI recommendations)
    const recommendedJobs = availableJobs.slice(0, 3);

    return (
        <div className="jobseeker-dashboard">
            {/* Quick Actions */}
            <QuickActions actions={quickActions} />

            {/* Stats Grid */}
            <div className="stats-grid">
                {statsCards.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Dashboard Tabs */}
            <div className="dashboard-tabs">
                <div className="tab-navigation">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <i className="fas fa-tachometer-alt me-2"></i>
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        <i className="fas fa-briefcase me-2"></i>
                        Job Opportunities ({availableJobs.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <i className="fas fa-file-alt me-2"></i>
                        My Applications ({myApplications.length})
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="content-grid">
                            {/* Recommended Jobs */}
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-robot me-2"></i>
                                        AI Recommended Jobs
                                    </h5>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate('/jobs')}
                                    >
                                        <i className="fas fa-search me-1"></i>
                                        Browse All
                                    </button>
                                </div>
                                <div className="card-body">
                                    {recommendedJobs.length > 0 ? (
                                        <div className="jobs-list">
                                            {recommendedJobs.map(job => (
                                                <JobCard
                                                    key={job._id}
                                                    job={job}
                                                    isJobSeeker={true}
                                                    showAIMatch={true}
                                                    onApply={() => navigate(`/jobs/${job._id}/apply`)}
                                                    onView={() => navigate(`/jobs/${job._id}`)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <i className="fas fa-robot"></i>
                                            </div>
                                            <h6 className="empty-state-title">No Recommendations Yet</h6>
                                            <p className="empty-state-description">
                                                Complete your profile to get AI-powered job recommendations
                                            </p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate('/profile')}
                                            >
                                                <i className="fas fa-user-edit me-2"></i>
                                                Complete Profile
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Feed */}
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-bell me-2"></i>
                                        Recent Activity
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <ActivityFeed activities={recentActivity} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'jobs' && (
                        <div className="jobs-tab">
                            <div className="tab-header">
                                <h4>Job Opportunities</h4>
                                <div className="tab-actions">
                                    <div className="search-filters">
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            placeholder="Search jobs..."
                                            style={{ width: '200px' }}
                                        />
                                        <select className="form-select me-2" style={{ width: '150px' }}>
                                            <option value="">All Locations</option>
                                            <option value="remote">Remote</option>
                                            <option value="onsite">On-site</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                        <select className="form-select" style={{ width: '150px' }}>
                                            <option value="">All Types</option>
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="jobs-grid">
                                {availableJobs.length > 0 ? (
                                    availableJobs.map(job => (
                                        <JobCard
                                            key={job._id}
                                            job={job}
                                            isJobSeeker={true}
                                            showSalary={true}
                                            showCompanyInfo={true}
                                            onApply={() => navigate(`/jobs/${job._id}/apply`)}
                                            onView={() => navigate(`/jobs/${job._id}`)}
                                            onSave={() => {/* Handle save job */ }}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <h5 className="empty-state-title">No Jobs Found</h5>
                                        <p className="empty-state-description">
                                            Try adjusting your search filters or check back later for new opportunities
                                        </p>
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={() => navigate('/jobs')}
                                        >
                                            <i className="fas fa-search me-2"></i>
                                            Browse All Jobs
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <div className="applications-tab">
                            <div className="tab-header">
                                <h4>My Applications</h4>
                                <div className="filter-options">
                                    <select className="form-select">
                                        <option value="all">All Applications</option>
                                        <option value="pending">Pending</option>
                                        <option value="interview">Interview</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className="applications-list">
                                {myApplications.length > 0 ? (
                                    myApplications.map(application => (
                                        <ApplicationCard
                                            key={application._id}
                                            application={application}
                                            isJobSeeker={true}
                                            onViewJob={() => navigate(`/jobs/${application.job._id}`)}
                                            onWithdraw={() => {/* Handle withdraw application */ }}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <i className="fas fa-file-alt"></i>
                                        </div>
                                        <h5 className="empty-state-title">No Applications Yet</h5>
                                        <p className="empty-state-description">
                                            Start applying to jobs that match your skills and interests
                                        </p>
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={() => navigate('/jobs')}
                                        >
                                            <i className="fas fa-search me-2"></i>
                                            Find Jobs to Apply
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Career Insights */}
            <div className="dashboard-card career-insights">
                <div className="card-header">
                    <h5 className="card-title">
                        <i className="fas fa-chart-line me-2"></i>
                        Career Insights
                    </h5>
                </div>
                <div className="card-body">
                    <div className="insights-grid">
                        <div className="insight-item">
                            <div className="insight-icon success">
                                <i className="fas fa-percentage"></i>
                            </div>
                            <div className="insight-content">
                                <h6>Profile Completeness</h6>
                                <p className="insight-value">85%</p>
                                <small className="text-success">Almost complete!</small>
                            </div>
                        </div>

                        <div className="insight-item">
                            <div className="insight-icon info">
                                <i className="fas fa-eye"></i>
                            </div>
                            <div className="insight-content">
                                <h6>Profile Views</h6>
                                <p className="insight-value">47</p>
                                <small className="text-info">This month</small>
                            </div>
                        </div>

                        <div className="insight-item">
                            <div className="insight-icon warning">
                                <i className="fas fa-star"></i>
                            </div>
                            <div className="insight-content">
                                <h6>Skill Match Rate</h6>
                                <p className="insight-value">78%</p>
                                <small className="text-warning">Good match</small>
                            </div>
                        </div>

                        <div className="insight-item">
                            <div className="insight-icon primary">
                                <i className="fas fa-trophy"></i>
                            </div>
                            <div className="insight-content">
                                <h6>Application Success</h6>
                                <p className="insight-value">12%</p>
                                <small className="text-primary">Above average</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Completion Prompt */}
            {user && (!user.resume || !user.skills || user.skills.length < 5) && (
                <div className="dashboard-card profile-prompt">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h5 className="mb-2">
                                    <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                                    Complete Your Profile
                                </h5>
                                <p className="mb-0 text-muted">
                                    Increase your chances of getting hired by completing your profile and uploading your resume.
                                </p>
                            </div>
                            <div className="col-md-4 text-end">
                                <button
                                    className="btn btn-warning"
                                    onClick={() => navigate('/profile')}
                                >
                                    <i className="fas fa-user-edit me-2"></i>
                                    Complete Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobSeekerDashboard;
