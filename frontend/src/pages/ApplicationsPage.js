import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ApplicationsPage = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            let response;

            if (user?.role === 'candidate') {
                response = await applicationsAPI.getMyApplications();
            } else {
                response = await applicationsAPI.getAll();
            }

            setApplications(response.data.applications || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(application => {
        return filterStatus === 'all' || application.status === filterStatus;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'accepted': return 'bg-success';
            case 'rejected': return 'bg-danger';
            case 'interview': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading applications..." />;
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <h1 className="h3 mb-4">
                        <i className="fas fa-file-alt me-2"></i>
                        {user?.role === 'candidate' ? 'My Applications' : 'All Applications'}
                    </h1>
                </div>
            </div>

            {/* Filter */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="interview">Interview</option>
                    </select>
                </div>
            </div>

            {/* Applications List */}
            <div className="row">
                <div className="col-12">
                    {filteredApplications.length > 0 ? (
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Application ID</th>
                                                <th>Job ID</th>
                                                {user?.role !== 'candidate' && <th>Candidate</th>}
                                                <th>Applied Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApplications.map((application) => (
                                                <tr key={application.id}>
                                                    <td>
                                                        <strong>#{application.id}</strong>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-light text-dark">
                                                            Job #{application.job_id}
                                                        </span>
                                                    </td>
                                                    {user?.role !== 'candidate' && (
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <i className="fas fa-user-circle me-2 text-muted"></i>
                                                                User #{application.user_id}
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td>
                                                        {new Date(application.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                                                            {application.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group">
                                                            <button className="btn btn-outline-primary btn-sm">
                                                                <i className="fas fa-eye me-1"></i>
                                                                View
                                                            </button>
                                                            {(user?.role === 'hr' || user?.role === 'admin') && (
                                                                <>
                                                                    <button className="btn btn-outline-success btn-sm">
                                                                        <i className="fas fa-check me-1"></i>
                                                                        Accept
                                                                    </button>
                                                                    <button className="btn btn-outline-danger btn-sm">
                                                                        <i className="fas fa-times me-1"></i>
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                            <h4>No applications found</h4>
                            <p className="text-muted">
                                {filterStatus !== 'all'
                                    ? 'Try adjusting your filter criteria.'
                                    : user?.role === 'candidate'
                                        ? "You haven't applied to any jobs yet."
                                        : 'No applications have been submitted yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationsPage;
