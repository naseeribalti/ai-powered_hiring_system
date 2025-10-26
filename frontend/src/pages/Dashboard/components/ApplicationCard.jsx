// ApplicationCard.jsx - Reusable Application Card Component
import React from 'react';

const ApplicationCard = ({
    application,
    isRecruiter = false,
    isJobSeeker = false,
    onStatusChange,
    onViewProfile,
    onViewJob,
    onWithdraw
}) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return 'fas fa-clock';
            case 'accepted': return 'fas fa-check-circle';
            case 'rejected': return 'fas fa-times-circle';
            case 'interview': return 'fas fa-handshake';
            default: return 'fas fa-file-alt';
        }
    };

    return (
        <div className="application-card">
            <div className="application-header">
                <div className="application-info">
                    {isRecruiter ? (
                        <>
                            <h6 className="applicant-name">
                                {application.applicant?.firstName} {application.applicant?.lastName}
                            </h6>
                            <div className="job-title">{application.job?.title}</div>
                        </>
                    ) : (
                        <>
                            <h6 className="job-title">{application.job?.title}</h6>
                            <div className="company-name">{application.job?.company}</div>
                        </>
                    )}

                    <div className="application-date">
                        <i className="fas fa-calendar me-1"></i>
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                </div>

                <div className="application-status">
                    <span className={`status-badge status-${application.status}`}>
                        <i className={`${getStatusIcon(application.status)} me-1`}></i>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                </div>
            </div>

            {application.coverLetter && (
                <div className="cover-letter-preview">
                    <strong>Cover Letter:</strong>
                    <p>{application.coverLetter.substring(0, 100)}...</p>
                </div>
            )}

            {application.aiScore && (
                <div className="ai-score">
                    <div className="score-label">AI Match Score:</div>
                    <div className="score-value">
                        <div className="score-bar">
                            <div
                                className="score-fill"
                                style={{ width: `${application.aiScore}%` }}
                            ></div>
                        </div>
                        <span className="score-text">{application.aiScore}%</span>
                    </div>
                </div>
            )}

            <div className="application-actions">
                {isRecruiter && (
                    <>
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onViewProfile && onViewProfile(application.applicant)}
                        >
                            <i className="fas fa-user me-1"></i>
                            View Profile
                        </button>

                        <div className="status-actions">
                            <select
                                className="form-select form-select-sm"
                                value={application.status}
                                onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="interview">Interview</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </>
                )}

                {isJobSeeker && (
                    <>
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onViewJob && onViewJob(application.job)}
                        >
                            <i className="fas fa-briefcase me-1"></i>
                            View Job
                        </button>

                        {application.status === 'pending' && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onWithdraw && onWithdraw(application)}
                            >
                                <i className="fas fa-times me-1"></i>
                                Withdraw
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicationCard;
