import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplications: 0,
        myJobs: 0,
        myApplications: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch jobs data
            const jobsResponse = await jobsAPI.getAll({ limit: 5 });
            const jobs = jobsResponse.data.jobs || [];
            setRecentJobs(jobs);

            // Fetch applications data
            const applicationsResponse = await applicationsAPI.getAll({ limit: 5 });
            const applications = applicationsResponse.data.applications || [];
            setRecentApplications(applications);

            // Calculate stats based on user role
            let statsData = {
                totalJobs: jobs.length,
                totalApplications: applications.length,
                myJobs: 0,
                myApplications: 0
            };

            if (user?.role === 'hr' || user?.role === 'admin') {
                // For HR/Admin, show jobs they created
                const myJobsResponse = await jobsAPI.getMyJobs();
                statsData.myJobs = myJobsResponse.data.jobs?.length || 0;
            } else {
                // For candidates, show their applications
                const myApplicationsResponse = await applicationsAPI.getMyApplications();
                statsData.myApplications = myApplicationsResponse.data.applications?.length || 0;
            }

            setStats(statsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading dashboard..." />;
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <h1 className="h3 mb-4">
                        Welcome back, {user?.name}!
                        <span className="badge bg-secondary ms-2">{user?.role}</span>
                    </h1>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title">{stats.totalJobs}</h4>
                                    <p className="card-text">Total Jobs</p>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-briefcase fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title">{stats.totalApplications}</h4>
                                    <p className="card-text">Total Applications</p>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-file-alt fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title">
                                        {user?.role === 'candidate' ? stats.myApplications : stats.myJobs}
                                    </h4>
                                    <p className="card-text">
                                        {user?.role === 'candidate' ? 'My Applications' : 'My Jobs'}
                                    </p>
                                </div>
                                <div className="align-self-center">
                                    <i className={`fas ${user?.role === 'candidate' ? 'fa-user' : 'fa-plus'} fa-2x`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title">AI</h4>
                                    <p className="card-text">Powered</p>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-robot fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-briefcase me-2"></i>
                                Recent Jobs
                            </h5>
                        </div>
                        <div className="card-body">
                            {recentJobs.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {recentJobs.map((job) => (
                                        <div key={job.id} className="list-group-item border-0 px-0">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1">{job.title}</h6>
                                                    <p className="mb-1 text-muted small">{job.company}</p>
                                                    <small className="text-muted">{job.location}</small>
                                                </div>
                                                <span className={`badge bg-${job.status === 'active' ? 'success' : 'secondary'}`}>
                                                    {job.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No recent jobs found.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-file-alt me-2"></i>
                                Recent Applications
                            </h5>
                        </div>
                        <div className="card-body">
                            {recentApplications.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {recentApplications.map((application) => (
                                        <div key={application.id} className="list-group-item border-0 px-0">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1">Application #{application.id}</h6>
                                                    <p className="mb-1 text-muted small">Job ID: {application.job_id}</p>
                                                    <small className="text-muted">
                                                        {new Date(application.created_at).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <span className={`badge bg-${application.status === 'pending' ? 'warning' :
                                                        application.status === 'accepted' ? 'success' : 'danger'
                                                    }`}>
                                                    {application.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No recent applications found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
