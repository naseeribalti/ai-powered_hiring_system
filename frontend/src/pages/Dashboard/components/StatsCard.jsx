// StatsCard.jsx - Reusable Statistics Card Component
import React from 'react';

const StatsCard = ({
    title,
    value,
    icon,
    color = 'primary',
    trend,
    description,
    onClick
}) => {
    return (
        <div
            className={`stats-card ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
        >
            <div className={`stats-icon ${color}`}>
                <i className={icon}></i>
            </div>

            <div className="stats-content">
                <div className="stats-number">{value}</div>
                <div className="stats-label">{title}</div>

                {trend && (
                    <div className={`stats-trend trend-${trend.direction}`}>
                        <i className={`fas fa-arrow-${trend.direction === 'up' ? 'up' : 'down'} me-1`}></i>
                        {trend.value}
                    </div>
                )}

                {description && (
                    <div className="stats-description">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
