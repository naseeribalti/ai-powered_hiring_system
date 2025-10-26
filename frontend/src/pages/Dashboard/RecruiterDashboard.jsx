// RecruiterDashboard.jsx - Professional Recruiter Interface
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './components/StatsCard';
import JobCard from './components/JobCard';
import ApplicationCard from './components/ApplicationCard';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';

const RecruiterDashboard = ({ data, user }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const { myJobs = [], applications = [], stats = {} } = data;

    // Calculate additional metrics
    const recentJobs = myJobs.slice(0, 5);
    const recentApplications = applications.slice(0, 5);

    // Quick actions for recruiters
    const quickActions = [
        {
            title: 'Post New Job',
            icon: 'fas fa-plus-circle',
            color: 'primary',
            action: () => navigate('/jobs/new'),
            description: 'Create a new job posting'
        },
        {
            title: 'View Applications',
            icon: 'fas fa-file-alt',
            color: 'success',
            action: () => navigate('/applications'),
            description: 'Review candidate applications'
        },
        {
            title: 'Manage Jobs',
            icon: 'fas fa-briefcase',
            color: 'info',
            action: () => navigate('/jobs/manage'),
            description: 'Edit and manage your job postings'
        },
        {
            title: 'AI Analytics',
            icon: 'fas fa-chart-line',
            color: 'warning',
            action: () => navigate('/analytics'),
            description: 'View AI-powered insights'
        }
    ];

    // Stats cards data
    const statsCards = [
        {
            title: 'Active Jobs',
            value: stats.activeJobs || 0,
            icon: 'fas fa-briefcase',
            color: 'primary',
            trend: { value: '+12%', direction: 'up' },
            description: 'Currently active job postings'
        },
        {
            title: 'Total Applications',
            value: stats.totalApplications || 0,
            icon: 'fas fa-file-alt',
            color: 'success',
            trend: { value: '+8%', direction: 'up' },
            description: 'Applications received this month'
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingApplications || 0,
            icon: 'fas fa-clock',
            color: 'warning',
            trend: { value: '-5%', direction: 'down' },
            description: 'Applications awaiting review'
        },
        {
            title: 'Hired This Month',
            value: applications.filter(app => app.status === 'accepted').length,
            icon: 'fas fa-user-check',
            color: 'info',
            trend: { value: '+15%', direction: 'up' },
            description: 'Successful hires this month'
        }
    ];

    // Recent activity data
    const recentActivity = [
        ...recentApplications.map(app => ({
            type: 'application',
            title: 'New Application Received',
            description: `${app.applicant?.firstName} ${app.applicant?.lastName} applied for ${app.job?.title}`,
            time: new Date(app.appliedAt).toLocaleDateString(),
            icon: 'fas fa-file-alt',
            color: 'success'
        })),
        ...recentJobs.map(job => ({
            type: 'job',
            title: 'Job Posted',
            description: `${job.title} at ${job.company}`,
            time: new Date(job.createdAt).toLocaleDateString(),
            icon: 'fas fa-briefcase',
            color: 'primary'
        }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    return (
        <div className="recruiter-dashboard">
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
                        My Jobs ({myJobs.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <i className="fas fa-file-alt me-2"></i>
                        Applications ({applications.length})
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="content-grid">
                            {/* Recent Jobs */}
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-briefcase me-2"></i>
                                        Recent Job Postings
                                    </h5>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate('/jobs/new')}
                                    >
                                        <i className="fas fa-plus me-1"></i>
                                        Post Job
                                    </button>
                                </div>
                                <div className="card-body">
                                    {recentJobs.length > 0 ? (
                                        <div className="jobs-list">
                                            {recentJobs.map(job => (
                                                <JobCard
                                                    key={job._id}
                                                    job={job}
                                                    isRecruiter={true}
                                                    onEdit={() => navigate(`/jobs/${job._id}/edit`)}
                                                    onView={() => navigate(`/jobs/${job._id}`)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <i className="fas fa-briefcase"></i>
                                            </div>
                                            <h6 className="empty-state-title">No Jobs Posted Yet</h6>
                                            <p className="empty-state-description">
                                                Start by posting your first job to attract top talent
                                            </p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate('/jobs/new')}
                                            >
                                                <i className="fas fa-plus me-2"></i>
                                                Post Your First Job
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
                                <h4>My Job Postings</h4>
                                <div className="tab-actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate('/jobs/new')}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Post New Job
                                    </button>
                                </div>
                            </div>

                            <div className="jobs-grid">
                                {myJobs.length > 0 ? (
                                    myJobs.map(job => (
                                        <JobCard
                                            key={job._id}
                                            job={job}
                                            isRecruiter={true}
                                            showActions={true}
                                            onEdit={() => navigate(`/jobs/${job._id}/edit`)}
                                            onView={() => navigate(`/jobs/${job._id}`)}
                                            onDelete={() => {/* Handle delete */ }}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <i className="fas fa-briefcase"></i>
                                        </div>
                                        <h5 className="empty-state-title">No Jobs Posted</h5>
                                        <p className="empty-state-description">
                                            Create your first job posting to start finding great candidates
                                        </p>
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={() => navigate('/jobs/new')}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            Post Your First Job
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <div className="applications-tab">
                            <div className="tab-header">
                                <h4>Applications Received</h4>
                                <div className="filter-options">
                                    <select className="form-select">
                                        <option value="all">All Applications</option>
                                        <option value="pending">Pending Review</option>
                                        <option value="interview">Interview</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className="applications-list">
                                {applications.length > 0 ? (
                                    applications.map(application => (
                                        <ApplicationCard
                                            key={application._id}
                                            application={application}
                                            isRecruiter={true}
                                            onStatusChange={(status) => {/* Handle status change */ }}
                                            onViewProfile={() => navigate(`/profile/${application.applicant._id}`)}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <i className="fas fa-file-alt"></i>
                                        </div>
                                        <h5 className="empty-state-title">No Applications Yet</h5>
                                        <p className="empty-state-description">
                                            Applications will appear here once candidates start applying to your jobs
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Performance Insights */}
            <div className="dashboard-card performance-insights">
                <div className="card-header">
                    <h5 className="card-title">
                        <i className="fas fa-chart-line me-2"></i>
                        Performance Insights
                    </h5>
                </div>
                <div className="card-body">
                    <div className="insights-grid">
                        <div className="insight-item">
                            <div className="insight-icon success">
                                <i className="fas fa-eye"></i>
                            </div>
                            <div className="insight-content">
                                <h6>Job Views</h6>
                                <p className="insight-value">1,234</p>
                                <small className="text-success">+15% this week</small>
                            </div>
                        </div>

                        <div className="insight-item">
                            <div className="insight-icon info">
                                <i className="fas fa-mouse-pointer"></i>
                            </div>
                            <div className="insight-content">
                                <h6>Application Rate</h6>
                                <p className="insight-value">8.5%</p>
                                <small className="text-info">Above average</small>
                            </div>
                        </div>

                        <div className="insight-item">
                            <div className="insight-icon warning">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="insight-content">
                                <h6>Avg. Response Time</h6>
                                <p className="insight-value">2.3 days</p>
                                <small className="text-warning">Can improve</small>
                            </div>
                        </div>

                        <div className="insight-item">
                            <div className="insight-icon primary">
                                <i className="fas fa-star"></i>
                            </div>
                            <div className="insight-content">
                                <h6>Quality Score</h6>
                                <p className="insight-value">4.8/5</p>
                                <small className="text-primary">Excellent</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
