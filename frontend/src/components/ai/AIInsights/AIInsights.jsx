import React, { useState } from 'react';
import api from '../../../services/api';

// AIInsights - lightweight panel to send free-form text to AI analyze endpoint
const AIInsights = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            // Backend contract: POST /api/ai/analyze-resume { text }
            const { data } = await api.post('/ai/analyze-resume', { text });
            setResult(data);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header d-flex align-items-center">
                <i className="fas fa-lightbulb me-2" />
                <strong>AI Insights</strong>
            </div>
            <div className="card-body">
                <form onSubmit={handleAnalyze}>
                    <div className="mb-3">
                        <label className="form-label">Paste resume text or job description</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste text here to analyze..."
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading || !text.trim()}>
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {result && (
                    <pre className="mt-3 bg-light p-2 rounded" style={{ maxHeight: 300, overflow: 'auto' }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default AIInsights;
