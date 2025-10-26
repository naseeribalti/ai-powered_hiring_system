import React from 'react';

// Simple placeholder chart widget (no external libs)
const ChartWidget = ({ title = 'Chart' }) => {
    return (
        <div style={{
            border: '1px dashed rgba(0,0,0,0.1)',
            borderRadius: 12,
            padding: '1rem',
            marginBottom: '1rem',
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d'
        }}>
            <div>
                <div style={{ fontWeight: 600, color: '#2c3e50', marginBottom: 8 }}>{title}</div>
                <div>Chart preview (plug in Recharts/Chart.js later)</div>
            </div>
        </div>
    );
};

export default ChartWidget;
