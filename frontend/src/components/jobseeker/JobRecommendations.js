import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const JobRecommendations = ({ userSkills = [] }) => {
    const navigate = useNavigate();
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendations();
    }, [userSkills]);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual AI recommendation API
            // const response = await fetch('http://localhost:3002/api/ai/recommend-jobs', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`
            //     },
            //     body: JSON.stringify({ skills: userSkills })
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock recommended jobs with AI match scores
            const mockJobs = [
                {
                    _id: '1',
                    title: 'Senior Full Stack Developer',
                    company: 'Tech Innovations Inc.',
                    location: 'San Francisco, CA',
                    salary: '$120k - $160k',
                    type: 'Full-time',
                    matchScore: 95,
                    matchedSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
                    description: 'Looking for an experienced full-stack developer...',
                    postedDays: 2
                },
                {
                    _id: '2',
                    title: 'React Developer',
                    company: 'Digital Solutions LLC',
                    location: 'Remote',
                    salary: '$100k - $140k',
                    type: 'Full-time',
                    matchScore: 92,
                    matchedSkills: ['React', 'JavaScript', 'Git'],
                    description: 'Join our dynamic team building cutting-edge web apps...',
                    postedDays: 5
                },
                {
                    _id: '3',
                    title: 'Software Engineer - Cloud',
                    company: 'CloudTech Systems',
                    location: 'New York, NY',
                    salary: '$130k - $170k',
                    type: 'Full-time',
                    matchScore: 88,
                    matchedSkills: ['Python', 'AWS', 'Docker'],
                    description: 'Build scalable cloud infrastructure...',
                    postedDays: 3
                },
                {
                    _id: '4',
                    title: 'Frontend Developer',
                    company: 'Creative Web Studio',
                    location: 'Austin, TX',
                    salary: '$90k - $120k',
                    type: 'Full-time',
                    matchScore: 85,
                    matchedSkills: ['React', 'JavaScript'],
                    description: 'Create beautiful and responsive user interfaces...',
                    postedDays: 7
                },
                {
                    _id: '5',
                    title: 'Backend Engineer',
                    company: 'DataFlow Corp',
                    location: 'Seattle, WA',
                    salary: '$110k - $150k',
                    type: 'Full-time',
                    matchScore: 82,
                    matchedSkills: ['Node.js', 'Python', 'SQL'],
                    description: 'Design and implement robust backend systems...',
                    postedDays: 4
                }
            ];

            setRecommendedJobs(mockJobs);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMatchColor = (score) => {
        if (score >= 90) return 'success';
        if (score >= 80) return 'primary';
        if (score >= 70) return 'info';
        return 'warning';
    };

    if (loading) {
        return (
            <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">AI is finding best jobs for you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                    <i className="fas fa-robot me-2"></i>
                    AI-Powered Job Recommendations
                </h5>
            </div>
            <div className="card-body">
                {recommendedJobs.length > 0 ? (
                    <>
                        <div className="alert alert-info mb-4">
                            <i className="fas fa-info-circle me-2"></i>
                            Based on your skills, we found <strong>{recommendedJobs.length} perfect matches</strong> for you!
                        </div>

                        <div className="list-group">
                            {recommendedJobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="list-group-item list-group-item-action p-3 mb-3 border rounded"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/jobs/${job._id}`)}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">
                                                {job.title}
                                                <span className="badge bg-primary ms-2">{job.type}</span>
                                            </h6>
                                            <p className="mb-1 text-muted">
                                                <i className="fas fa-building me-1"></i>
                                                {job.company}
                                            </p>
                                            <p className="mb-1 text-muted small">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {job.location}
                                                <span className="mx-2">•</span>
                                                <i className="fas fa-dollar-sign me-1"></i>
                                                {job.salary}
                                            </p>
                                        </div>
                                        <div className="text-center" style={{ minWidth: '80px' }}>
                                            <div
                                                className={`badge bg-${getMatchColor(job.matchScore)} p-2`}
                                                style={{ fontSize: '18px' }}
                                            >
                                                {job.matchScore}%
                                            </div>
                                            <div>
                                                <small className="text-muted">Match</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <small className="text-muted">Matched Skills:</small>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {job.matchedSkills.map((skill, index) => (
                                                <span key={index} className="badge bg-light text-dark border">
                                                    <i className="fas fa-check-circle text-success me-1"></i>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="mb-2 small text-muted">
                                        {job.description.substring(0, 100)}...
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">
                                            <i className="fas fa-clock me-1"></i>
                                            Posted {job.postedDays} days ago
                                        </small>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/jobs/${job._id}/apply`);
                                            }}
                                        >
                                            <i className="fas fa-paper-plane me-1"></i>
                                            Quick Apply
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-3">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/jobs')}
                            >
                                <i className="fas fa-search me-2"></i>
                                Browse All Jobs
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-5">
                        <i className="fas fa-robot fa-3x text-muted mb-3"></i>
                        <h5>No recommendations yet</h5>
                        <p className="text-muted">
                            Upload your resume to get AI-powered job recommendations!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobRecommendations;
