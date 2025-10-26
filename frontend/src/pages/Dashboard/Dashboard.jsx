// Main Dashboard Component - Professional Layout
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RecruiterDashboard from './RecruiterDashboard';
import JobSeekerDashboard from './JobSeekerDashboard';
import AdminDashboard from './AdminDashboard';
import './Dashboard.css';
import './DashboardComponents.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({});

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            let data = {};
            if (user?.role === 'admin') {
                data = await fetchAdminData();
            } else if (user?.role === 'recruiter') {
                data = await fetchRecruiterData();
            } else {
                data = await fetchJobSeekerData();
            }
            setDashboardData(data);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminData = async () => {
        // Placeholder; can be wired to admin analytics endpoints
        return {
            totalUsers: 0,
            totalJobs: 0,
            totalApplications: 0,
            recentActivity: []
        };
    };

    const fetchRecruiterData = async () => {
        try {
            const myJobsResponse = await jobsAPI.getMyJobs();
            const myJobs = myJobsResponse?.data?.jobs || [];

            const applicationsResponse = await applicationsAPI.getAll({ limit: 10 });
            const applications = applicationsResponse?.data?.applications || [];

            return {
                myJobs,
                applications,
                stats: {
                    totalJobs: myJobs.length,
                    activeJobs: myJobs.filter(job => job.status === 'active').length,
                    totalApplications: applications.length,
                    pendingApplications: applications.filter(app => app.status === 'pending').length
                }
            };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching recruiter data:', error);
            return { myJobs: [], applications: [], stats: {} };
        }
    };

    const fetchJobSeekerData = async () => {
        try {
            const jobsResponse = await jobsAPI.getAll({ limit: 10 });
            const jobs = jobsResponse?.data?.jobs || [];

            const myApplicationsResponse = await applicationsAPI.getMyApplications();
            const myApplications = myApplicationsResponse?.data?.applications || [];

            return {
                availableJobs: jobs,
                myApplications,
                stats: {
                    totalJobs: jobs.length,
                    myApplications: myApplications.length,
                    pendingApplications: myApplications.filter(app => app.status === 'pending').length,
                    acceptedApplications: myApplications.filter(app => app.status === 'accepted').length
                }
            };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching job seeker data:', error);
            return { availableJobs: [], myApplications: [], stats: {} };
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <LoadingSpinner text="Loading your dashboard..." />
            </div>
        );
    }

    const renderDashboard = () => {
        switch (user?.role) {
            case 'admin':
                return <AdminDashboard data={dashboardData} user={user} navigate={navigate} />;
            case 'recruiter':
                return <RecruiterDashboard data={dashboardData} user={user} navigate={navigate} />;
            default:
                return <JobSeekerDashboard data={dashboardData} user={user} navigate={navigate} />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <div className="welcome-section">
                                <h1 className="welcome-title">
                                    Good {getTimeOfDay()}, {user?.firstName}! 👋
                                </h1>
                                <p className="welcome-subtitle">
                                    {getRoleBasedWelcomeMessage(user?.role)}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 text-end">
                            <div className="user-profile-section">
                                <div className="user-avatar">
                                    {user?.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt="Profile"
                                            className="avatar-img"
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="user-info">
                                    <h6 className="user-name">
                                        {user?.firstName} {user?.lastName}
                                    </h6>
                                    <span className={`role-badge role-${user?.role}`}>
                                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {renderDashboard()}
            </div>
        </div>
    );
};

// Helpers
const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
};

const getRoleBasedWelcomeMessage = (role) => {
    switch (role) {
        case 'admin':
            return 'Manage your platform and monitor system performance';
        case 'recruiter':
            return 'Find the perfect candidates for your open positions';
        default:
            return 'Discover your next career opportunity';
    }
};

export default Dashboard;

