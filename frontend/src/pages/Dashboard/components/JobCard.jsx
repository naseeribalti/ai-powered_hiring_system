// JobCard.jsx - Reusable Job Card Component
import React from 'react';

const JobCard = ({
    job,
    isRecruiter = false,
    isJobSeeker = false,
    showActions = false,
    showSalary = false,
    showCompanyInfo = false,
    showAIMatch = false,
    onApply,
    onView,
    onEdit,
    onDelete,
    onSave
}) => {
    const formatSalary = (min, max) => {
        if (!min && !max) return null;
        if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        if (min) return `$${min.toLocaleString()}+`;
        return `Up to $${max.toLocaleString()}`;
    };

    return (
        <div className="job-card">
            <div className="job-card-header">
                <div className="job-info">
                    <h6 className="job-title">{job.title}</h6>
                    <div className="job-company">{job.company || job.companyName || 'Company'}</div>
                    <div className="job-location">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {job.location || 'Remote'}
                    </div>
                </div>

                <div className="job-actions">
                    {showAIMatch && (
                        <span className="badge bg-warning text-dark mb-2">
                            <i className="fas fa-robot me-1"></i>
                            95% Match
                        </span>
                    )}

                    {job.status && (
                        <span className={`status-badge status-${job.status}`}>
                            {job.status}
                        </span>
                    )}
                </div>
            </div>

            {job.description && (
                <div className="job-description">
                    {job.description.substring(0, 150)}
                    {job.description.length > 150 && '...'}
                </div>
            )}

            {showSalary && (job.salaryMin || job.salaryMax) && (
                <div className="job-salary">
                    <i className="fas fa-dollar-sign me-1"></i>
                    {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
            )}

            {job.skills && job.skills.length > 0 && (
                <div className="job-skills">
                    {job.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag">
                            {skill}
                        </span>
                    ))}
                    {job.skills.length > 3 && (
                        <span className="skill-tag more">
                            +{job.skills.length - 3} more
                        </span>
                    )}
                </div>
            )}

            <div className="job-meta">
                <span>
                    <i className="fas fa-clock me-1"></i>
                    {new Date(job.createdAt).toLocaleDateString()}
                </span>

                {job.jobType && (
                    <span>
                        <i className="fas fa-briefcase me-1"></i>
                        {job.jobType}
                    </span>
                )}

                {job.experienceLevel && (
                    <span>
                        <i className="fas fa-user-tie me-1"></i>
                        {job.experienceLevel}
                    </span>
                )}
            </div>

            <div className="job-card-footer">
                {isJobSeeker && (
                    <div className="job-seeker-actions">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onApply && onApply(job)}
                        >
                            <i className="fas fa-paper-plane me-1"></i>
                            Apply Now
                        </button>

                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => onSave && onSave(job)}
                        >
                            <i className="fas fa-bookmark me-1"></i>
                            Save
                        </button>

                        <button
                            className="btn btn-outline-info btn-sm"
                            onClick={() => onView && onView(job)}
                        >
                            <i className="fas fa-eye me-1"></i>
                            View
                        </button>
                    </div>
                )}

                {isRecruiter && (
                    <div className="recruiter-actions">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onView && onView(job)}
                        >
                            <i className="fas fa-eye me-1"></i>
                            View
                        </button>

                        <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => onEdit && onEdit(job)}
                        >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                        </button>

                        {showActions && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onDelete && onDelete(job)}
                            >
                                <i className="fas fa-trash me-1"></i>
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobCard;
