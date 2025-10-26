import React, { useState } from 'react';
import api from '../../../services/api';

// ResumeAnalyzer - upload a resume file and parse it via AI service
const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [parsed, setParsed] = useState(null);
    const [error, setError] = useState('');

    const onFileChange = (e) => {
        setFile(e.target.files?.[0] || null);
    };

    const onParse = async (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        setError('');
        setParsed(null);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            // Backend contract: POST /api/ai/parse-resume (multipart/form-data)
            const { data } = await api.post('/ai/parse-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setParsed(data);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Parse failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header d-flex align-items-center">
                <i className="fas fa-file-alt me-2" />
                <strong>Resume Analyzer</strong>
            </div>
            <div className="card-body">
                <form onSubmit={onParse}>
                    <div className="mb-3">
                        <input type="file" className="form-control" accept=".pdf,.doc,.docx,.txt" onChange={onFileChange} />
                    </div>
                    <button className="btn btn-primary" disabled={!file || loading}>
                        {loading ? 'Analyzing...' : 'Analyze Resume'}
                    </button>
                </form>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {parsed && (
                    <pre className="mt-3 bg-light p-2 rounded" style={{ maxHeight: 300, overflow: 'auto' }}>
                        {JSON.stringify(parsed, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
