import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ResumeUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [aiScore, setAiScore] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error('Please upload a PDF or Word document');
                return;
            }

            // Validate file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            setFile(selectedFile);
        }
    };

    const parseResume = async () => {
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            // Upload resume to backend
            const token = localStorage.getItem('token');
            const uploadResponse = await fetch('http://localhost:3001/api/resumes/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            const uploadData = await uploadResponse.json();
            toast.success('Resume uploaded! Analyzing with AI...');

            // Poll for analysis results
            const resumeId = uploadData.resume.id;
            let analyzed = false;
            let attempts = 0;
            const maxAttempts = 20; // 20 seconds max

            while (!analyzed && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

                const scoreResponse = await fetch(`http://localhost:3001/api/resumes/${resumeId}/score`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const scoreData = await scoreResponse.json();

                if (scoreData.analyzed) {
                    analyzed = true;
                    setResumeData({
                        ...scoreData,
                        skills: scoreData.parsedData?.skills || [],
                        experience: scoreData.parsedData?.experience || [],
                        education: scoreData.parsedData?.education || [],
                    });
                    setAiScore(scoreData.aiScore);
                    toast.success('Resume analyzed! AI Score: ' + scoreData.aiScore.overall + '/100');

                    if (onUploadSuccess) {
                        onUploadSuccess({
                            skills: scoreData.parsedData?.skills || [],
                            aiScore: scoreData.aiScore,
                        });
                    }
                }

                attempts++;
            }

            if (!analyzed) {
                toast.info('Analysis taking longer than expected. Check back in a moment.');
            }
        } catch (error) {
            console.error('Error parsing resume:', error);
            toast.error('Failed to parse resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                    <i className="fas fa-file-upload me-2"></i>
                    Upload & Scan Resume
                </h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="resume" className="form-label">
                        Select Your Resume (PDF or Word)
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <small className="text-muted">Max file size: 5MB</small>
                </div>

                {file && (
                    <div className="alert alert-info">
                        <i className="fas fa-file me-2"></i>
                        <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </div>
                )}

                <button
                    className="btn btn-primary w-100"
                    onClick={parseResume}
                    disabled={!file || uploading}
                >
                    {uploading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Scanning Resume with AI...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-robot me-2"></i>
                            Scan Resume with AI
                        </>
                    )}
                </button>

                {aiScore && (
                    <div className="mt-4">
                        <div className="alert alert-success">
                            <h6 className="alert-heading">
                                <i className="fas fa-check-circle me-2"></i>
                                AI Resume Analysis Complete!
                            </h6>
                            <hr />
                            <div className="row text-center">
                                <div className="col-6 col-md-3 mb-2">
                                    <div className="mb-1">
                                        <strong className="text-primary" style={{ fontSize: '24px' }}>
                                            {aiScore.overall}
                                        </strong>
                                        <small className="text-muted">/100</small>
                                    </div>
                                    <small className="text-muted">Overall Score</small>
                                </div>
                                <div className="col-6 col-md-3 mb-2">
                                    <div className="mb-1">
                                        <strong className="text-success" style={{ fontSize: '24px' }}>
                                            {aiScore.skillsMatch}
                                        </strong>
                                        <small className="text-muted">/100</small>
                                    </div>
                                    <small className="text-muted">Skills Match</small>
                                </div>
                                <div className="col-6 col-md-3 mb-2">
                                    <div className="mb-1">
                                        <strong className="text-info" style={{ fontSize: '24px' }}>
                                            {aiScore.experienceRelevance}
                                        </strong>
                                        <small className="text-muted">/100</small>
                                    </div>
                                    <small className="text-muted">Experience</small>
                                </div>
                                <div className="col-6 col-md-3 mb-2">
                                    <div className="mb-1">
                                        <strong className="text-warning" style={{ fontSize: '24px' }}>
                                            {aiScore.resumeQuality}
                                        </strong>
                                        <small className="text-muted">/100</small>
                                    </div>
                                    <small className="text-muted">Quality</small>
                                </div>
                            </div>
                        </div>

                        {resumeData && (
                            <div className="mt-3">
                                <h6 className="mb-3">
                                    <i className="fas fa-code me-2"></i>
                                    Extracted Skills ({resumeData.skills.length})
                                </h6>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {resumeData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className={`badge bg-${skill.confidence > 0.85 ? 'success' : skill.confidence > 0.7 ? 'primary' : 'secondary'}`}
                                            style={{ fontSize: '14px' }}
                                        >
                                            {skill.name}
                                            <small className="ms-1">({Math.round(skill.confidence * 100)}%)</small>
                                        </span>
                                    ))}
                                </div>

                                <h6 className="mb-3 mt-4">
                                    <i className="fas fa-lightbulb me-2"></i>
                                    AI Recommendations
                                </h6>
                                <ul className="list-group">
                                    {(aiScore.recommendations || []).map((rec, index) => (
                                        <li key={index} className="list-group-item">
                                            <i className={`fas fa-check-circle text-${rec.priority === 'high' ? 'danger' :
                                                    rec.priority === 'medium' ? 'warning' : 'success'
                                                } me-2`}></i>
                                            {rec.message || rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUpload;
