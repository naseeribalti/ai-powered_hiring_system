import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusColor, truncateText } from '../../utils/helpers';

const JobCard = ({ job, onApply, onEdit, onDelete, onView }) => {
    const { user } = useAuth();

    const handleApply = () => {
        if (onApply) {
            onApply(job);
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(job);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(job);
        }
    };

    const handleView = () => {
        if (onView) {
            onView(job);
        }
    };

    const canApply = user?.role === 'candidate' && job.status === 'active';
    const canManage = user?.role === 'hr' || user?.role === 'admin';

    return (
        <div className="card h-100 job-card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{job.title}</h5>
                    <span className={`badge bg-${getStatusColor(job.status)}`}>
                        {job.status}
                    </span>
                </div>

                <div className="job-details mb-3">
                    <div className="mb-2">
                        <i className="fas fa-building me-2 text-muted"></i>
                        <span className="fw-medium">{job.company}</span>
                    </div>

                    <div className="mb-2">
                        <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                        <span>{job.location}</span>
                    </div>

                    <div className="mb-2">
                        <i className="fas fa-dollar-sign me-2 text-muted"></i>
                        <span>{job.salary_range || 'Salary not specified'}</span>
                    </div>

                    <div className="mb-2">
                        <i className="fas fa-briefcase me-2 text-muted"></i>
                        <span>{job.job_type || 'Full-time'}</span>
                    </div>
                </div>

                {job.description && (
                    <p className="card-text text-muted small mb-3">
                        {truncateText(job.description, 120)}
                    </p>
                )}

                {job.requirements && (
                    <div className="mb-3">
                        <h6 className="small fw-bold text-muted mb-1">Requirements:</h6>
                        <p className="small text-muted mb-0">
                            {truncateText(job.requirements, 100)}
                        </p>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        <i className="fas fa-calendar me-1"></i>
                        Posted: {formatDate(job.created_at)}
                    </small>

                    <div className="btn-group">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleView}
                            title="View Details"
                        >
                            <i className="fas fa-eye"></i>
                        </button>

                        {canApply && (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleApply}
                                title="Apply Now"
                            >
                                <i className="fas fa-paper-plane me-1"></i>
                                Apply
                            </button>
                        )}

                        {canManage && (
                            <>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={handleEdit}
                                    title="Edit Job"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleDelete}
                                    title="Delete Job"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
