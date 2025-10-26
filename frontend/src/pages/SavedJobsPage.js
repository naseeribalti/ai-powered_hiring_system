import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBookmark, FaRegBookmark, FaMapMarkerAlt, FaBriefcase, FaClock, FaDollarSign, FaBuilding } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './SavedJobsPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const SavedJobsPage = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('savedDate'); // 'savedDate', 'salary', 'title'

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/jobs/saved`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedJobs(response.data);
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            toast.error('Failed to load saved jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/jobs/${jobId}/save`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedJobs(savedJobs.filter(job => job._id !== jobId));
            toast.success('Job removed from saved');
        } catch (error) {
            console.error('Error unsaving job:', error);
            toast.error('Failed to remove job');
        }
    };

    const sortedJobs = [...savedJobs].sort((a, b) => {
        switch (sortBy) {
            case 'salary':
                return (b.salary?.min || 0) - (a.salary?.min || 0);
            case 'title':
                return a.title.localeCompare(b.title);
            case 'savedDate':
            default:
                return new Date(b.savedAt) - new Date(a.savedAt);
        }
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your saved jobs...</p>
            </div>
        );
    }

    return (
        <div className="saved-jobs-page">
            <div className="saved-jobs-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>
                            <FaBookmark className="header-icon" />
                            Saved Jobs
                        </h1>
                        <p className="header-subtitle">
                            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
                        </p>
                    </div>
                    <div className="header-actions">
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                                onClick={() => setView('grid')}
                            >
                                Grid
                            </button>
                            <button
                                className={`view-btn ${view === 'list' ? 'active' : ''}`}
                                onClick={() => setView('list')}
                            >
                                List
                            </button>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="savedDate">Recently Saved</option>
                            <option value="salary">Highest Salary</option>
                            <option value="title">Job Title (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="saved-jobs-content">
                {sortedJobs.length === 0 ? (
                    <div className="empty-state">
                        <FaRegBookmark className="empty-icon" />
                        <h2>No Saved Jobs Yet</h2>
                        <p>Start exploring and save jobs you're interested in</p>
                        <Link to="/jobs" className="btn btn-primary">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className={`jobs-${view}`}>
                        {sortedJobs.map((job) => (
                            <div key={job._id} className="job-card">
                                <div className="job-card-header">
                                    <div className="company-logo">
                                        {job.company?.name?.charAt(0) || 'C'}
                                    </div>
                                    <button
                                        className="save-button saved"
                                        onClick={() => handleUnsave(job._id)}
                                        title="Remove from saved"
                                    >
                                        <FaBookmark />
                                    </button>
                                </div>

                                <div className="job-card-body">
                                    <Link to={`/jobs/${job._id}`} className="job-title">
                                        {job.title}
                                    </Link>
                                    <div className="company-name">
                                        <FaBuilding />
                                        <span>{job.company?.name || 'Company Name'}</span>
                                    </div>

                                    <div className="job-meta">
                                        <div className="meta-item">
                                            <FaMapMarkerAlt />
                                            <span>{job.location || 'Remote'}</span>
                                        </div>
                                        <div className="meta-item">
                                            <FaBriefcase />
                                            <span>{job.jobType || 'Full-time'}</span>
                                        </div>
                                        {job.experienceLevel && (
                                            <div className="meta-item">
                                                <FaClock />
                                                <span>{job.experienceLevel}</span>
                                            </div>
                                        )}
                                        {job.salary && (
                                            <div className="meta-item">
                                                <FaDollarSign />
                                                <span>
                                                    ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

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

                                    <div className="job-card-footer">
                                        <span className="saved-date">
                                            Saved {new Date(job.savedAt).toLocaleDateString()}
                                        </span>
                                        <Link to={`/jobs/${job._id}/apply`} className="apply-btn">
                                            Apply Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobsPage;
