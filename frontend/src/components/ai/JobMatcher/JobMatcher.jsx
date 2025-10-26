import React, { useState } from 'react';
import { jobsAPI } from '../../../services/api';

// JobMatcher - find jobs based on skills/keywords and optional location
const JobMatcher = () => {
    const [skills, setSkills] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');

    const onSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setJobs([]);
        try {
            const filters = {};
            if (skills.trim()) filters.skills = skills.trim();
            if (location.trim()) filters.location = location.trim();
            const { data } = await jobsAPI.search(filters);
            setJobs(data?.jobs || []);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header d-flex align-items-center">
                <i className="fas fa-magnifying-glass me-2" />
                <strong>AI Job Matcher</strong>
            </div>
            <div className="card-body">
                <form className="row g-2" onSubmit={onSearch}>
                    <div className="col-md-6">
                        <input
                            className="form-control"
                            placeholder="Skills or keywords (e.g. React, Python)"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            className="form-control"
                            placeholder="Location (optional)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2 d-grid">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'Find Matches'}
                        </button>
                    </div>
                </form>

                {error && <div className="alert alert-danger mt-3">{error}</div>}

                {jobs?.length > 0 && (
                    <div className="mt-3">
                        <div className="small text-muted mb-2">{jobs.length} matches</div>
                        <ul className="list-group">
                            {jobs.map((job) => (
                                <li key={job._id || job.id} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-semibold">{job.title}</div>
                                            <div className="text-muted small">{job.company} • {job.location}</div>
                                        </div>
                                        <a className="btn btn-sm btn-outline-secondary" href={`/jobs/${job._id || job.id}`}>
                                            View
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobMatcher;
