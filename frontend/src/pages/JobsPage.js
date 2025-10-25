import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const JobsPage = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await jobsAPI.getAll();
            setJobs(response.data.jobs || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <LoadingSpinner text="Loading jobs..." />;
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h3 mb-0">
                            <i className="fas fa-briefcase me-2"></i>
                            Job Listings
                        </h1>
                        {(user?.role === 'hr' || user?.role === 'admin') && (
                            <button className="btn btn-primary">
                                <i className="fas fa-plus me-2"></i>
                                Post New Job
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search jobs by title, company, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="row">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="card-title">{job.title}</h5>
                                        <span className={`badge bg-${job.status === 'active' ? 'success' :
                                                job.status === 'closed' ? 'danger' : 'secondary'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>

                                    <div className="mb-2">
                                        <i className="fas fa-building me-2 text-muted"></i>
                                        <span>{job.company}</span>
                                    </div>

                                    <div className="mb-2">
                                        <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                                        <span>{job.location}</span>
                                    </div>

                                    <div className="mb-3">
                                        <i className="fas fa-dollar-sign me-2 text-muted"></i>
                                        <span>{job.salary_range || 'Salary not specified'}</span>
                                    </div>

                                    <p className="card-text text-muted small">
                                        {job.description ? job.description.substring(0, 100) + '...' : 'No description available'}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">
                                            Posted: {new Date(job.created_at).toLocaleDateString()}
                                        </small>
                                        {user?.role === 'candidate' && job.status === 'active' && (
                                            <button className="btn btn-primary btn-sm">
                                                <i className="fas fa-paper-plane me-1"></i>
                                                Apply
                                            </button>
                                        )}
                                        {(user?.role === 'hr' || user?.role === 'admin') && (
                                            <div className="btn-group">
                                                <button className="btn btn-outline-primary btn-sm">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="text-center py-5">
                            <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
                            <h4>No jobs found</h4>
                            <p className="text-muted">
                                {searchTerm || filterStatus !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No jobs have been posted yet.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobsPage;
