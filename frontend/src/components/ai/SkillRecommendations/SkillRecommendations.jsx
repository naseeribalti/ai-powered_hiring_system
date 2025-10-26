import React, { useState } from 'react';
import api from '../../../services/api';

// SkillRecommendations - suggest skills from a snippet or job title
const SkillRecommendations = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState('');

    const onRecommend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        setError('');
        setSkills([]);
        try {
            // Expected endpoint (adjust if backend differs): POST /api/ai/recommend-skills { text }
            const { data } = await api.post('/ai/recommend-skills', { text: input });
            const list = data?.skills || data || [];
            setSkills(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Recommendation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header d-flex align-items-center">
                <i className="fas fa-wand-magic-sparkles me-2" />
                <strong>Skill Recommendations</strong>
            </div>
            <div className="card-body">
                <form onSubmit={onRecommend}>
                    <div className="mb-3">
                        <input
                            className="form-control"
                            placeholder="Job title or text (e.g., Frontend Engineer React)"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" disabled={!input.trim() || loading}>
                        {loading ? 'Recommending...' : 'Recommend Skills'}
                    </button>
                </form>

                {error && <div className="alert alert-danger mt-3">{error}</div>}

                {skills.length > 0 && (
                    <ul className="mt-3 list-group list-group-flush">
                        {skills.map((s, idx) => (
                            <li key={`${s}-${idx}`} className="list-group-item">
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SkillRecommendations;
